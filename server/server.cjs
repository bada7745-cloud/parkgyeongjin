/* Independent mobile-game backend. Node 24+, no third-party runtime packages. */
'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {promisify}=require('node:util'),{DatabaseSync}=require('node:sqlite');
const scrypt=promisify(crypto.scrypt),ROOT=path.resolve(__dirname,'../dist');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const MAX_BODY=140000,SESSION_AGE=30*24*60*60*1000;
const SCRYPT={N:32768,r:8,p:1,maxmem:64*1024*1024};
const MIME={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml','.apk':'application/vnd.android.package-archive'};
class ApiError extends Error{constructor(status,message){super(message);this.status=status}}
function validateSave(s){if(!s||s.version!==2||!s.options||!Array.isArray(s.units)||s.units.length!==6||!['ready','aim'].includes(s.phase))return false;if(!Array.isArray(s.holes)||s.holes.length>500||!Array.isArray(s.ammo)||s.ammo.length!==2)return false;for(let u of s.units)if(!Number.isFinite(u.x)||!Number.isFinite(u.y)||!Number.isFinite(u.hp)||u.hp<0||u.hp>100)return false;return Number.isFinite(s.turn)&&s.turn>0&&s.turn<10000}
function createGameServer(config={}){
 const production=config.production??process.env.NODE_ENV==='production';
 const origin=config.origin??process.env.PUBLIC_ORIGIN??process.env.RENDER_EXTERNAL_URL??'http://127.0.0.1:8787';
 const expected=new URL(origin);if(production&&expected.protocol!=='https:')throw Error('Production PUBLIC_ORIGIN must use HTTPS');
 const dbPath=config.dbPath||process.env.DB_PATH||path.join(__dirname,'data/game.sqlite');
 if(dbPath!==':memory:')fs.mkdirSync(path.dirname(dbPath),{recursive:true});
 const db=new DatabaseSync(dbPath);db.exec('PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;');
 db.exec(`CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT NOT NULL UNIQUE,nickname TEXT NOT NULL,password_hash TEXT NOT NULL,salt TEXT NOT NULL,created_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS saves(user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,revision INTEGER NOT NULL,payload TEXT NOT NULL,updated_at INTEGER NOT NULL);`);
 const limiter=new Map();let cryptoJobs=0;
 function limit(key,max,period){let now=Date.now(),v=limiter.get(key);if(!v||v.until<now){v={count:0,until:now+period};limiter.set(key,v)}if(++v.count>max)throw new ApiError(429,'시도가 많습니다. 잠시 후 다시 시도해 주세요.');if(limiter.size>10000)for(let [k,v]of limiter)if(v.until<now)limiter.delete(k)}
 async function derive(password,salt){if(cryptoJobs>=4)throw new ApiError(503,'잠시 후 다시 시도해 주세요.');cryptoJobs++;try{return (await scrypt(password,salt,64,SCRYPT)).toString('hex')}finally{cryptoJobs--}}
 function cookie(req){let raw=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('pc_session='));let token=raw?.slice(11);if(!token||!/^[a-f0-9]{64}$/.test(token))return null;return token}
 function identity(req){let token=cookie(req);if(!token)return null;let row=db.prepare('SELECT u.id,u.email,u.nickname,s.expires_at FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?').get(hash(token),Date.now());return row||null}
 function user(req){let u=identity(req);if(!u)throw new ApiError(401,'로그인이 필요합니다.');return u}
 function publicUser(u){return {id:u.id,email:u.email,nickname:u.nickname}}
 function setSession(res,uid){let token=crypto.randomBytes(32).toString('hex');db.prepare('DELETE FROM sessions WHERE expires_at<?').run(Date.now());db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(hash(token),uid,Date.now()+SESSION_AGE);res.setHeader('Set-Cookie',`pc_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_AGE/1000}${production?'; Secure':''}`)}
 function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data))}
 async function body(req){let pieces=[],size=0;for await(let p of req){size+=p.length;if(size>MAX_BODY)throw new ApiError(413,'요청이 너무 큽니다.');pieces.push(p)}try{let b=JSON.parse(Buffer.concat(pieces).toString('utf8'));if(!b||typeof b!=='object'||Array.isArray(b))throw Error();return b}catch{throw new ApiError(400,'올바른 요청이 아닙니다.')}}
 function guard(req){if(req.method==='GET'||req.method==='HEAD')return;const requestOrigin=req.headers.origin;if(requestOrigin!==expected.origin)throw new ApiError(403,'요청 출처를 확인할 수 없습니다.');if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||''))throw new ApiError(415,'JSON 요청만 허용합니다.');if(req.headers['sec-fetch-site']==='cross-site')throw new ApiError(403,'허용되지 않은 요청입니다.')}
 function credentials(b,register=false){let email=typeof b.email==='string'?b.email.trim().toLowerCase():'',password=b.password;if(email.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email)||typeof password!=='string'||password.length<10||password.length>128)throw new ApiError(400,'이메일과 10~128자 비밀번호를 확인해 주세요.');let nickname=typeof b.nickname==='string'?b.nickname.trim():'';if(register&&(nickname.length<2||nickname.length>16||/[<>\x00-\x1f]/.test(nickname)))throw new ApiError(400,'닉네임은 2~16자로 입력해 주세요.');return {email,password,nickname}}
 const server=http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');res.setHeader('X-Frame-Options','DENY');res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; manifest-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");if(production)res.setHeader('Strict-Transport-Security','max-age=31536000');
  try{let url=new URL(req.url,'http://internal'),route=url.pathname,ip=req.socket.remoteAddress||'unknown';if(route.startsWith('/api/')){
   guard(req);limit('global:'+ip,300,60000);
   if(route==='/api/distribution'&&req.method==='GET'){let ios=process.env.IOS_TESTFLIGHT_URL||'';try{let u=new URL(ios);if(u.protocol!=='https:'||u.host!=='testflight.apple.com')ios=''}catch{ios=''}return json(res,200,{android:{available:fs.existsSync(path.join(ROOT,'downloads/pocket-critters.apk')),url:'/downloads/pocket-critters.apk'},ios:{available:!!ios,url:ios||null},pwa:{available:production,install:'/install.html'}})}
   if(route==='/api/health'&&req.method==='GET')return json(res,200,{ok:true,version:'0.3.0'});
   if(route==='/api/version'&&req.method==='GET'){let manifest=JSON.parse(fs.readFileSync(path.join(ROOT,'release.json'),'utf8'));return json(res,200,manifest)}
   if(route==='/api/me'&&req.method==='GET'){let u=identity(req);return json(res,200,{user:u?publicUser(u):null})}
   if(route==='/api/auth/register'&&req.method==='POST'){
    limit('signup:'+ip,6,3600000);let b=credentials(await body(req),true),salt=crypto.randomBytes(16).toString('hex'),digest=await derive(b.password,salt),uid=crypto.randomUUID();
    try{db.prepare('INSERT INTO users VALUES(?,?,?,?,?,?)').run(uid,b.email,b.nickname,digest,salt,Date.now())}catch(e){if(String(e.message).includes('UNIQUE'))throw new ApiError(409,'가입할 수 없습니다. 기존 계정이라면 로그인해 주세요.');throw e}
    setSession(res,uid);return json(res,201,{user:{id:uid,email:b.email,nickname:b.nickname},emailVerified:false});
   }
   if(route==='/api/auth/login'&&req.method==='POST'){
    limit('login:'+ip,20,15*60000);let b=credentials(await body(req));limit('account:'+hash(b.email),10,15*60000);let u=db.prepare('SELECT * FROM users WHERE email=?').get(b.email);let digest=await derive(b.password,u?.salt||'00000000000000000000000000000000');let expectedHash=u?.password_hash||'0'.repeat(128);if(!crypto.timingSafeEqual(Buffer.from(digest,'hex'),Buffer.from(expectedHash,'hex'))||!u)throw new ApiError(401,'이메일 또는 비밀번호를 확인해 주세요.');setSession(res,u.id);return json(res,200,{user:publicUser(u)});
   }
   if(route==='/api/auth/logout'&&req.method==='POST'){let token=cookie(req);if(token)db.prepare('DELETE FROM sessions WHERE token_hash=?').run(hash(token));res.setHeader('Set-Cookie',`pc_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${production?'; Secure':''}`);return json(res,200,{ok:true})}
   if(route==='/api/save'&&req.method==='GET'){let u=user(req),s=db.prepare('SELECT revision,payload,updated_at FROM saves WHERE user_id=?').get(u.id);return json(res,200,s?{revision:s.revision,save:JSON.parse(s.payload),updatedAt:s.updated_at}:{revision:0,save:null})}
   if(route==='/api/save'&&req.method==='PUT'){let u=user(req),b=await body(req);if(!Number.isInteger(b.revision)||b.revision<0||!validateSave(b.save))throw new ApiError(400,'저장 상태가 올바르지 않습니다.');let now=Date.now();if(b.revision===0){let r=db.prepare('INSERT INTO saves(user_id,revision,payload,updated_at) VALUES(?,1,?,?) ON CONFLICT(user_id) DO NOTHING').run(u.id,JSON.stringify(b.save),now);if(!r.changes)throw new ApiError(409,'다른 기기의 저장이 있습니다. 불러온 뒤 다시 저장해 주세요.')}else{let r=db.prepare('UPDATE saves SET revision=revision+1,payload=?,updated_at=? WHERE user_id=? AND revision=?').run(JSON.stringify(b.save),now,u.id,b.revision);if(!r.changes)throw new ApiError(409,'다른 기기에서 저장이 바뀌었습니다. 먼저 불러와 주세요.')}return json(res,200,{revision:b.revision+1,updatedAt:now})}
   if(route==='/api/account'&&req.method==='DELETE'){let u=user(req),b=await body(req);if(typeof b.password!=='string'||b.password.length>128)throw new ApiError(400,'비밀번호를 확인해 주세요.');let raw=db.prepare('SELECT * FROM users WHERE id=?').get(u.id),digest=await derive(b.password,raw.salt);if(!crypto.timingSafeEqual(Buffer.from(digest,'hex'),Buffer.from(raw.password_hash,'hex')))throw new ApiError(401,'비밀번호를 확인해 주세요.');db.prepare('DELETE FROM users WHERE id=?').run(u.id);res.setHeader('Set-Cookie',`pc_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${production?'; Secure':''}`);return json(res,200,{ok:true})}
   throw new ApiError(404,'없는 요청입니다.');
  }
  if(!['GET','HEAD'].includes(req.method))throw new ApiError(405,'허용되지 않은 요청입니다.');
  let decoded;try{decoded=decodeURIComponent(route)}catch{throw new ApiError(400,'올바르지 않은 경로입니다.')}
  let file=path.resolve(ROOT,'.'+(decoded==='/'?'/index.html':decoded));if(file!==ROOT&&!file.startsWith(ROOT+path.sep))throw new ApiError(403,'허용되지 않은 경로입니다.');if(!fs.existsSync(file)||!fs.statSync(file).isFile())throw new ApiError(404,'파일이 없습니다.');
  res.setHeader('Content-Type',MIME[path.extname(file)]||'application/octet-stream');res.setHeader('Cache-Control','no-cache');if(path.basename(file)==='sw.js')res.setHeader('Service-Worker-Allowed','/');res.writeHead(200);if(req.method==='HEAD')return res.end();fs.createReadStream(file).pipe(res);
  }catch(e){if(!res.headersSent)json(res,e.status||500,{error:e.status?e.message:'서버 오류가 발생했습니다.'});else res.end();if(!e.status)console.error('request failed:',e.name)}
 });server.requestTimeout=15000;server.headersTimeout=10000;server.db=db;server.on('close',()=>db.close());return server;
}
if(require.main===module){let port=Number(process.env.PORT)||8787,host=process.env.HOST||'127.0.0.1',s=createGameServer();s.listen(port,host,()=>console.log(`Pocket Critters server: http://${host}:${port}`));}
module.exports={createGameServer,validateSave};

