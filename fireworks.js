const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let fireworks = [];
let particles = [];
let hue = 120;
let timerTotal = 80;
let timerTick = 0;

function random(min,max){ return Math.random()*(max-min)+min; }
function distance(x1,y1,x2,y2){ return Math.sqrt((x2-x1)**2+(y2-y1)**2); }

function Firework(sx,sy,tx,ty){
  this.x=sx; this.y=sy; this.sx=sx; this.sy=sy; this.tx=tx; this.ty=ty;
  this.distanceToTarget=distance(sx,sy,tx,ty);
  this.distanceTraveled=0;
  this.coordinates=[[sx,sy],[sx,sy],[sx,sy]];
  this.angle=Math.atan2(ty-sy,tx-sx);
  this.speed=2; this.acceleration=1.05; this.brightness=random(50,70);
}
Firework.prototype.update=function(i){
  this.coordinates.pop();
  this.coordinates.unshift([this.x,this.y]);
  this.speed*=this.acceleration;
  let vx=Math.cos(this.angle)*this.speed;
  let vy=Math.sin(this.angle)*this.speed;
  this.distanceTraveled=distance(this.sx,this.sy,this.x+vx,this.y+vy);
  if(this.distanceTraveled>=this.distanceToTarget){
    createParticles(this.tx,this.ty);
    fireworks.splice(i,1);
  }else{ this.x+=vx; this.y+=vy; }
}
Firework.prototype.draw=function(){
  ctx.beginPath();
  ctx.moveTo(this.coordinates[this.coordinates.length-1][0], this.coordinates[this.coordinates.length-1][1]);
  ctx.lineTo(this.x,this.y);
  ctx.strokeStyle=`hsl(${hue},100%,${this.brightness}%)`;
  ctx.stroke();
}

function Particle(x,y){
  this.x=x; this.y=y; this.coordinates=[[x,y],[x,y],[x,y],[x,y],[x,y]];
  this.angle=random(0,Math.PI*2); this.speed=random(1,10);
  this.friction=0.95; this.gravity=1; this.hue=random(hue-20,hue+20);
  this.brightness=random(50,80); this.alpha=1; this.decay=random(0.015,0.03);
}
Particle.prototype.update=function(i){
  this.coordinates.pop(); this.coordinates.unshift([this.x,this.y]);
  this.speed*=this.friction;
  this.x+=Math.cos(this.angle)*this.speed;
  this.y+=Math.sin(this.angle)*this.speed+this.gravity;
  this.alpha-=this.decay;
  if(this.alpha<=this.decay) particles.splice(i,1);
}
Particle.prototype.draw=function(){
  ctx.beginPath();
  ctx.moveTo(this.coordinates[this.coordinates.length-1][0], this.coordinates[this.coordinates.length-1][1]);
  ctx.lineTo(this.x,this.y);
  ctx.strokeStyle=`hsla(${this.hue},100%,${this.brightness}%,${this.alpha})`;
  ctx.stroke();
}

function createParticles(x,y){
  let count=30;
  while(count--) particles.push(new Particle(x,y));
}

function loop(){
  requestAnimationFrame(loop);
  hue+=0.5;
  ctx.globalCompositeOperation='destination-out';
  ctx.fillStyle='rgba(11,30,74,0.5)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.globalCompositeOperation='lighter';

  fireworks.forEach((f,i)=>{ f.draw(); f.update(i); });
  particles.forEach((p,i)=>{ p.draw(); p.update(i); });

  if(timerTick>=timerTotal){
    fireworks.push(new Firework(canvas.width/2,canvas.height,random(0,canvas.width),random(0,canvas.height/2)));
    timerTick=0;
  }else timerTick++;
}

loop();
