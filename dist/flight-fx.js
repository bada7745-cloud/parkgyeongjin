/* Visual-only flight actions. No changes to projectile positions, damage or timing. */
(function(){'use strict';const R=CritterRenderer.prototype,{WEAPONS,clamp}=Critters,oldRender=R.render,oldProjectile=R.projectile,oldSet=R.setGame,oldEvent=R.event;
const powered=new Set([0,2,5,10,12,15]),fused=new Set([1,4,7,9,11]);
function state(r){if(!r.flightState)r.flightState={particles:[],seen:new WeakMap(),time:0,flash:0};return r.flightState;}
function push(r,p){const s=state(r),cap=r.width<1000?160:260;if(s.particles.length<cap)s.particles.push(p);}
function spark(r,x,y,vx,vy,color,life=.28,size=2,kind='spark'){push(r,{x,y,vx,vy,color,life,max:life,size,kind});}
R.setGame=function(...args){this.flightState=null;oldSet.apply(this,args);};
R.event=function(e){oldEvent.call(this,e);if(this.reduced)return;const s=state(this);if(e.type==='fire'&&!this.lobby&&![3,8,13,14].includes(e.weapon)){const g=this.game,a=g.angle*Math.PI/180,dx=Math.cos(a),dy=-Math.sin(a),x=e.x,y=e.y;s.flash=.14;s.flashX=x;s.flashY=y;s.flashAngle=Math.atan2(dy,dx);s.flashColor=WEAPONS[e.weapon].color;for(let i=0;i<12;i++){const spread=(i-5.5)*.075,v=80+(i%4)*45;spark(this,x,y,Math.cos(s.flashAngle+spread)*v,Math.sin(s.flashAngle+spread)*v,s.flashColor,.15+i%3*.045,2.2);}this.shake=Math.max(this.shake,[2,9,15].includes(e.weapon)?7:4);}
if(e.type==='bounce'){for(let i=0;i<6;i++)spark(this,e.x,e.y,(i-2.5)*28,-45-i%3*22,'#ffe5ad',.2,1.8);}
if(e.type==='explosion'&&[0,2,4,5,6,7,9,10,11,12,15].includes(e.weapon)){const count=[9,15].includes(e.weapon)?18:10;for(let i=0;i<count;i++){const a=i/count*Math.PI*2,v=100+i%4*55;spark(this,e.x,e.y,Math.cos(a)*v,Math.sin(a)*v,WEAPONS[e.weapon].color,.3+i%3*.06,2,'streak');}}};
R.render=function(dt){const s=state(this),g=this.game,animate=g&&!g.paused&&!this.lobby;dt=clamp(dt,0,.05);if(animate){s.time+=dt;s.flash=Math.max(0,s.flash-dt);s.particles=s.particles.filter(p=>{p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.kind==='smoke'?-24:90)*dt;p.vx*=Math.exp(-dt*(p.kind==='smoke'?1.2:.4));return p.life>0;});if(!this.reduced)for(const p of [g.projectile,...(g.salvos||[])].filter(Boolean)){let marker=s.seen.get(p);if(!marker){marker={age:p.age,emit:0};s.seen.set(p,marker);}if(p.age===marker.age)continue;marker.emit+=Math.max(0,p.age-marker.age);marker.age=p.age;if(marker.emit<.026)continue;marker.emit%=.026;const w=WEAPONS[p.weapon],speed=Math.hypot(p.vx,p.vy)||1,dx=p.vx/speed,dy=p.vy/speed,phase=p.age*38;
if(powered.has(p.weapon)&&!p.stuck){const smoke=p.weapon===12?'#a9dfff':p.weapon===15?'#bb92ed':'#d1c8b6';spark(this,p.x-dx*15,p.y-dy*15,-dx*25+Math.sin(phase)*9,-dy*25-12,smoke,.4,5,'smoke');spark(this,p.x-dx*13,p.y-dy*13,-dx*90+dy*Math.sin(phase)*18,-dy*90-dx*Math.sin(phase)*18,w.color,.2,2.2);}
if(fused.has(p.weapon)&&!p.child){const a=p.age*6;spark(this,p.x+Math.cos(a)*10,p.y+Math.sin(a)*10,Math.cos(a)*32,-35+Math.sin(a)*22,p.weapon===9?'#fff2b1':'#ffd18a',.2,1.8);}
if(p.weapon===15||p.weapon===9){const a=p.age*9;spark(this,p.x+Math.cos(a)*20,p.y+Math.sin(a)*20,-Math.sin(a)*32,Math.cos(a)*32,w.color,.32,2);}
if(p.child||p.weapon===6)spark(this,p.x,p.y,-dx*40,-dy*40,w.color,.14,1.2);
}}
// Velocity look-ahead makes high shots lead the camera smoothly; manual panning keeps priority.
const p=g?.projectile;if(animate&&p&&!this.reduced&&this.manual<=0&&!this.overview){const lead={x:clamp(p.x+p.vx*.12,140,1460),y:clamp(p.y+p.vy*.1+70,160,620)};const blend=1-Math.exp(-dt*1.8);this.camera.x+=(lead.x-this.camera.x)*blend;this.camera.y+=(lead.y-this.camera.y)*blend;}
oldRender.call(this,dt);};
R.projectile=function(k){const s=state(this),g=this.game;if(!this.reduced){k.save();for(const p of s.particles){const fade=clamp(p.life/p.max,0,1);k.globalAlpha=p.kind==='smoke'?fade*.3:fade;k.fillStyle=p.color;k.strokeStyle=p.color;if(p.kind==='smoke'){const r=p.size*(1+(1-fade)*1.8);k.beginPath();k.ellipse(p.x,p.y,r,r*.8,0,0,7);k.fill();}else{k.lineWidth=p.size;k.lineCap='round';k.beginPath();k.moveTo(p.x,p.y);k.lineTo(p.x-p.vx*.035,p.y-p.vy*.035);k.stroke();}}k.restore();}
for(const p of [g.projectile,...(g.salvos||[])].filter(Boolean)){const w=WEAPONS[p.weapon],id=p.weapon,angle=Math.atan2(p.vy,p.vx);if(!this.reduced){k.save();k.translate(p.x,p.y);k.rotate(angle);const pulse=.65+.35*Math.sin(p.age*56);if(powered.has(id)&&!p.stuck){const length=(id===12?52:id===10?48:32)*(1+pulse*.4);k.globalCompositeOperation='lighter';k.fillStyle=id===15?'#b994ff80':id===12?'#a9eaff90':'#ffb95b90';k.beginPath();k.moveTo(-9,-7);k.quadraticCurveTo(-length*.6,-12*pulse,-length,0);k.quadraticCurveTo(-length*.6,12*pulse,-9,7);k.fill();k.fillStyle='#fff3cb';k.beginPath();k.moveTo(-10,-3);k.lineTo(-length*.68,0);k.lineTo(-10,3);k.fill();}k.restore();
if([9,12,15].includes(id)){k.save();k.globalAlpha=.12+.07*Math.sin(p.age*13);k.fillStyle=w.color;k.beginPath();k.arc(p.x,p.y,id===15?32:24,0,7);k.fill();k.restore();}
// Faint previous positions communicate spin and speed without altering the collision body.
if([4,7,9,11,15].includes(id)&&p.trail?.length>4){k.save();for(let i=1;i<=3;i++){const t=p.trail[Math.max(0,p.trail.length-1-i*3)];k.globalAlpha=.12/i;k.fillStyle=w.color;k.beginPath();k.arc(t.x,t.y,Math.max(3,9-i),0,7);k.fill();}k.restore();}
}
}
if(s.flash>0&&!this.reduced){k.save();k.translate(s.flashX,s.flashY);k.rotate(s.flashAngle);k.globalAlpha=s.flash/.14;k.fillStyle='#fff0b3';k.beginPath();k.moveTo(-5,-5);k.lineTo(12,-13);k.lineTo(8,-3);k.lineTo(33,0);k.lineTo(8,4);k.lineTo(12,13);k.lineTo(-5,5);k.fill();k.restore();}
oldProjectile.call(this,k);
};
})();
