const BUILD='0.4.0+67f6a6b70173';const CACHE='pc-live-'+BUILD;
// Install a complete, integrity-checked release. Never cache account or save API responses.
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const r=await fetch('./release.json',{cache:'no-store'});if(!r.ok)throw Error('release unavailable');const release=await r.json();if(release.version!==BUILD)throw Error('release mismatch');
 const cache=await caches.open(CACHE);try{for(const asset of release.assets){const response=await fetch('./'+asset.path,{cache:'no-store'});if(!response.ok)throw Error('asset unavailable');const bytes=await response.clone().arrayBuffer();const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(x=>x.toString(16).padStart(2,'0')).join('');if(digest!==asset.sha256)throw Error('asset integrity mismatch');await cache.put('./'+asset.path,response)}await cache.put('./',await cache.match('./index.html'));}catch(e){await caches.delete(CACHE);throw e}
})()));
self.addEventListener('message',event=>{if(event.data?.type==='APPLY_UPDATE')self.skipWaiting()});
self.addEventListener('activate',event=>event.waitUntil((async()=>{await self.clients.claim();const keys=(await caches.keys()).filter(k=>k.startsWith('pc-live-'));for(const key of keys.slice(0,-2))if(key!==CACHE)await caches.delete(key)})()));
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(event.request.method!=='GET'||u.origin!==self.location.origin||u.pathname.startsWith('/api/')||u.pathname.endsWith('/release.json'))return;event.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(event.request);if(cached)return cached;return fetch(event.request)}))});
