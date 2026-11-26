/* CHA·EKI — cinematic line: full-bleed scenes crossfade as you ride. Same API as the 3D world (window.__world). */
(function(){
const host=document.getElementById('film');if(!host)return;
const SC=window.CHAEKI_SCENES||[];
host.innerHTML=SC.map((s,j)=>`<div class="sc" data-j="${j}"><div class="sc-in">${s.v?`<video src="i/${s.v}" poster="i/${s.f}" muted loop playsinline preload="${j<2?'auto':'none'}"></video>`:`<img src="i/${s.f}" alt="" ${j>1?'loading="lazy"':''}>`}</div></div>`).join('')+'<canvas class="petals" id="petals"></canvas><div class="grain"></div>';
const L=[...host.querySelectorAll('.sc')],IN=L.map(l=>l.querySelector('.sc-in')),VID=L.map(l=>l.querySelector('video'));
const HOLD=.075,TR=(1-6*HOLD)/7,keys=[[0,0]];{let p=0;for(let i=0;i<6;i++){p+=TR;keys.push([p,i+1]);p+=HOLD;keys.push([p,i+1])}keys.push([1,7])}
const ease=f=>f*f*(3-2*f);
function p2x(p){for(let i=0;i<keys.length-1;i++){const [a,xa]=keys[i],[b,xb]=keys[i+1];if(p<=b){const f=(p-a)/(b-a||1);return {x:xa+(xb-xa)*ease(f),hold:xa===xb?f:-1}}}return {x:7,hold:-1}}
let mx=0,my=0,tx=0,ty=0,cur={x:0,hold:-1},P=0;
addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5)},{passive:true});
function draw(){tx+=(mx-tx)*.06;ty+=(my-ty)*.06;const {x}=cur,a=Math.floor(x),f=x-a;
 L.forEach((l,j)=>{let o=0;if(j===a)o=1;else if(j===a+1)o=f<.5?f*2*f*2/1:1;
  const near=Math.abs(x-j)<1.05;l.style.visibility=near?'visible':'hidden';l.style.opacity=j<=a?1:Math.min(1,f*1.6);l.style.zIndex=j;
  if(near){const d=x-j;const s=1.16-.12*Math.max(0,Math.min(1,(d+1)/2));IN[j].style.transform=`translate3d(${(-tx*18).toFixed(1)}px,${(-ty*12+d*-40).toFixed(1)}px,0) scale(${s.toFixed(4)})`}
  const v=VID[j];if(v){if(near&&v.paused)v.play().catch(()=>{});else if(!near&&!v.paused)v.pause()}});
 host.classList.toggle('night',Math.round(x)===4);window.__worldZ={night:Math.round(x)===4?1:0};
 requestAnimationFrame(draw)}
requestAnimationFrame(draw);
/* falling petals over Yoshino, steam elsewhere */
const cv=document.getElementById('petals'),cx=cv.getContext('2d');let pts=[];
function rs(){cv.width=innerWidth;cv.height=innerHeight}rs();addEventListener('resize',rs);
for(let i=0;i<70;i++)pts.push({x:Math.random(),y:Math.random(),s:3+Math.random()*6,v:.03+Math.random()*.05,r:Math.random()*6,w:Math.random()*6});
function petals(t){cx.clearRect(0,0,cv.width,cv.height);const k=Math.max(0,1-Math.abs(cur.x-6)*1.6);if(k>0){cx.globalAlpha=k*.85;
 pts.forEach(p=>{p.y+=p.v*.016;p.x+=Math.sin(t/900+p.w)*.0008;p.r+=.02;if(p.y>1.05){p.y=-.05;p.x=Math.random()}cx.save();cx.translate(p.x*cv.width,p.y*cv.height);cx.rotate(p.r);cx.fillStyle='#F7C8D0';cx.beginPath();cx.ellipse(0,0,p.s,p.s*.6,0,0,7);cx.fill();cx.restore()})}
 requestAnimationFrame(petals)}requestAnimationFrame(petals);
window.__world={set:p=>{P=p;cur=p2x(p)},keys,HOLD,TR};
})();
