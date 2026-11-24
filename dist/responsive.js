(function(){'use strict';const root=document.documentElement;let queued=false;
function fit(){queued=false;const h=window.visualViewport?.height||innerHeight;root.style.setProperty('--view-h',h+'px');const dock=document.getElementById('controlDock'),info=document.querySelector('.battle-info');if(dock&&!document.getElementById('hud').hidden){root.style.setProperty('--dock-h',Math.ceil(dock.getBoundingClientRect().height)+'px');if(info)root.style.setProperty('--hud-bottom',Math.ceil(info.getBoundingClientRect().bottom)+'px');}}
function schedule(){if(!queued){queued=true;requestAnimationFrame(fit);}}
window.addEventListener('resize',schedule);window.addEventListener('orientationchange',schedule);window.visualViewport?.addEventListener('resize',schedule);
if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(schedule);for(const id of ['controlDock','hud']){const el=document.getElementById(id);if(el)observer.observe(el);}}
new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['class']});schedule();
})();
