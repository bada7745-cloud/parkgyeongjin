import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
Deno.serve(async(req:Request)=>{
 const allowed=Deno.env.get('ALLOWED_ORIGIN')||'';
 const origin=req.headers.get('Origin')||'';
 const cors={'Access-Control-Allow-Origin':allowed,'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Vary':'Origin'};
 if(!allowed||origin!==allowed)return new Response('Forbidden',{status:403});
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
 if(req.method!=='POST')return new Response('Method not allowed',{status:405,headers:cors});
 const token=req.headers.get('Authorization')?.replace(/^Bearer\s+/i,'');
 if(!token)return Response.json({error:'Unauthorized'},{status:401,headers:cors});
 const admin=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:{user},error}=await admin.auth.getUser(token);
 if(error||!user)return Response.json({error:'Unauthorized'},{status:401,headers:cors});
 const {error:deletion}=await admin.auth.admin.deleteUser(user.id);
 return Response.json(deletion?{error:'계정을 삭제하지 못했습니다.'}:{ok:true},{status:deletion?500:200,headers:cors});
});
