(function(root){'use strict';
function validConfig(c){if(!c||!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(c.supabaseUrl||''))return false;let key=c.supabasePublishableKey||'';if(key.startsWith('sb_publishable_'))return true;if(key.startsWith('sb_secret_'))return false;try{return JSON.parse(atob(key.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).role==='anon'}catch{return false}}
class Cloud{
 constructor(client,config){this.client=client;this.config=config;}
 static async connect(config=root.PC_CONFIG){if(!validConfig(config))throw Error('무료 회원 서버 연결 준비 중입니다. 게스트 플레이는 바로 이용할 수 있어요.');if(!root.supabase?.createClient)await new Promise((resolve,reject)=>{let s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=resolve;s.onerror=()=>reject(Error('회원 서비스를 불러오지 못했습니다. 인터넷 연결을 확인해 주세요.'));document.head.append(s)});let client=root.supabase.createClient(config.supabaseUrl,config.supabasePublishableKey,{auth:{flowType:'pkce',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'pc-free-'+new URL(config.supabaseUrl).hostname}});return new Cloud(client,config)}
 async check(result){let {data,error}=await result;if(error){let e=Error(error.message||'회원 서비스를 이용하지 못했습니다.');e.status=error.status||error.code;throw e}return data}
 async user(){let d=await this.check(this.client.auth.getUser());return d?.user||null}
 async me(){let {data:{session}}=await this.client.auth.getSession();if(!session)return null;return this.user()}
 profile(u){return u?{id:u.id,email:u.email,nickname:u.user_metadata?.nickname||u.email?.split('@')[0]||'탐험가'}:null}
 async signup(b){let d=await this.check(this.client.auth.signUp({email:b.email,password:b.password,options:{data:{nickname:b.nickname},emailRedirectTo:new URL('./',location.href).href}}));return {user:d.session?this.profile(d.user):null,confirmationRequired:!d.session}}
 async login(b){let d=await this.check(this.client.auth.signInWithPassword({email:b.email,password:b.password}));return {user:this.profile(d.user)}}
 async logout(){await this.check(this.client.auth.signOut())}
 async pull(){let u=await this.user();if(!u)throw Error('로그인이 필요합니다.');let d=await this.check(this.client.from('game_saves').select('revision,payload,updated_at').eq('user_id',u.id).maybeSingle());return d?{revision:d.revision,save:d.payload,updatedAt:d.updated_at}:{revision:0,save:null}}
 async push(revision,save){let d=await this.check(this.client.rpc('save_game',{expected_revision:revision,new_payload:save}));return {revision:d.revision,updatedAt:d.updatedAt}}
 async remove(password){if(!this.config.accountDeletionEnabled)throw Error('계정 삭제 기능은 서버 연결을 마친 후 이용할 수 있습니다.');let u=await this.user();if(!u)throw Error('다시 로그인해 주세요.');await this.login({email:u.email,password});await this.check(this.client.functions.invoke('delete-account',{body:{}}));await this.logout()}
}
root.CritterCloud={Cloud,validConfig};if(typeof module!=='undefined')module.exports={Cloud,validConfig};
})(globalThis);
