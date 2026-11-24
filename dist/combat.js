(function(root){'use strict';const C=root.Critters,{Game,clamp}=C;
class PowerCharge{constructor(){this.cancel();}start(){this.active=true;this.elapsed=0;this.value=1;return this.value;}step(dt){if(this.active){this.elapsed+=Math.max(0,dt);const phase=(this.elapsed/1.5)%2;this.value=1+99*(phase<=1?phase:2-phase);}return this.value;}cancel(){this.active=false;this.elapsed=0;this.value=1;}}
C.PowerCharge=PowerCharge;
const select=Game.prototype.select;Game.prototype.select=function(i){return this.charging?false:select.call(this,i);};
const fire=Game.prototype.fire;Game.prototype.fire=function(a=this.angle,p=this.power,internal=false){const face=this.active.face,ok=fire.call(this,a,p,internal);if(!internal)this.active.face=face;return ok;};
Game.prototype.groundSlope=function(u=this.active){if(!u?.grounded)return 0;const probe=x=>{for(let y=Math.floor(u.y-4);y<=u.y+40;y++)if(this.solid(x,y))return y;return null;},a=probe(u.x-12),b=probe(u.x+12);if(a===null||b===null||Math.abs(a-b)>28)return 0;return clamp(Math.atan2(b-a,24),-.65,.65);};
Game.prototype.worldAim=function(elevation=this.elevation??45,face=this.active.face){const slope=this.groundSlope()*180/Math.PI;return clamp((face>0?elevation:180-elevation)-slope,5,175);};
Game.prototype.setElevation=function(value){if(!this.canFire()||this.charging)return false;this.elevation=clamp(value,5,85);this.angle=this.worldAim();return true;};
Game.prototype.turnFacing=function(face){if(!this.canFire()||this.charging)return false;this.active.face=face<0?-1:1;this.angle=this.worldAim();return true;};
const move=Game.prototype.canMove;Game.prototype.canMove=function(){return !this.charging&&move.call(this);};
const next=Game.prototype.nextTurn;Game.prototype.nextTurn=function(){next.call(this);this.elevation=45;this.charging=false;if(this.active&&this.human())this.angle=this.worldAim();};
const unit=Game.prototype.stepUnit;Game.prototype.stepUnit=function(u,dt){const oldX=u.x;unit.call(this,u,dt);u.groundTilt=this.groundSlope(u);if(u.hp>0&&u.id===this.activeId&&this.human()&&this.phase==='aim'){this.elevation??=45;this.angle=this.worldAim();}if(u.hp>0&&Math.abs(u.x-oldX)>.1&&u.grounded&&u.id===this.activeId)this.walkDistance=(this.walkDistance||0)+Math.abs(u.x-oldX);};
const dmg=Game.prototype.damage;Game.prototype.damage=function(u,amount,team,kind){const alive=u.hp>0;dmg.call(this,u,amount,team,kind);if(alive&&u.hp<=0&&kind!=='water'&&u.x>0&&u.x<C.W&&u.y<this.water-12){this.graves??=[];this.graves.push({id:u.id,name:u.name,team:u.team,x:u.x,y:u.y,vy:0});}};
const step=Game.prototype.step;Game.prototype.step=function(dt=C.STEP){if(this.paused)return;step.call(this,dt);for(const t of this.graves||[]){if(t.y>=this.water)continue;t.vy+=430*dt;let y=t.y+t.vy*dt;if(this.solid(t.x,y+18)){while(this.solid(t.x,t.y+17)&&t.y>0)t.y--;t.vy=0;}else t.y=y;}this.graves=(this.graves||[]).filter(t=>t.y+4<this.water);};
const snap=Game.prototype.snapshot;Game.prototype.snapshot=function(){return {...snap.call(this),graves:this.graves||[],elevation:this.elevation??45};};
const restore=Game.restore;Game.restore=function(d){const g=restore(d);if(g){g.graves=Array.isArray(d.graves)?d.graves.filter(t=>Number.isFinite(t.x)&&Number.isFinite(t.y)).map(t=>({...t,vy:t.vy||0})):[];g.elevation=clamp(d.elevation??45,5,85);g.charging=false;}return g;};
if(typeof module!=='undefined')module.exports=C;
})(globalThis);
