/* Logo intro: the LEGA6 badge builds, the triceratops cut into it wakes up, steps out of the logo and becomes SIX. Once per session. */
(function(){
const ov=document.querySelector('.intro');if(!ov)return;
const done=()=>{ov.remove();document.documentElement.classList.remove('intro-on');window.L6stage&&L6stage.reveal&&L6stage.reveal()};
let seen=false;try{seen=sessionStorage.getItem('l6intro')==='1';sessionStorage.setItem('l6intro','1')}catch(e){}
if(seen||!window.gsap||matchMedia('(prefers-reduced-motion: reduce)').matches){done();return}
const g=gsap,lg=ov.querySelector('.lg'),badge=ov.querySelector('.badge'),dn=ov.querySelector('.dn'),fill=ov.querySelector('.dn .fill'),scan=ov.querySelector('.dn .scan'),eye=ov.querySelector('.eye'),px=[...ov.querySelectorAll('.px')],pc=ov.querySelector('.pc'),ld=ov.querySelector('.ld'),veil=ov.querySelector('.veil');
const brand=document.querySelector('.nav .brand img'),host=document.querySelector('.hero .st');
const skip=()=>{tl.progress(1)};ov.addEventListener('click',skip);addEventListener('keydown',skip,{once:true});
const cnt={v:0};
const tl=g.timeline({defaults:{ease:'power3.out'},onComplete:done});
tl.set(lg,{scale:.7,opacity:0,filter:'blur(14px)'})
 .to(cnt,{v:100,duration:2.1,ease:'power1.inOut',onUpdate:()=>pc.textContent=String(Math.round(cnt.v)).padStart(3,'0')},0)
 .to(lg,{scale:1,opacity:1,filter:'blur(0px)',duration:.9},0.05)
 .fromTo(px,{scale:0},{scale:1,duration:.4,stagger:.06,ease:'back.out(3)'},0.5)
 // the fossil wakes up: power runs through the cut-out, a scan line reads it, the eye opens
 .fromTo(fill,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.9,ease:'power2.inOut'},0.75)
 .fromTo(scan,{xPercent:-20,opacity:1},{xPercent:620,duration:.9,ease:'power2.inOut'},0.75)
 .to(scan,{opacity:0,duration:.2},1.6)
 .fromTo(eye,{scale:0,opacity:0},{scale:1,opacity:1,duration:.35,ease:'back.out(4)'},1.55)
 .to(eye,{scaleY:.1,duration:.08,yoyo:true,repeat:1,ease:'none'},1.95)
 // it steps out of the logo: lifts off the badge in 3D, the pixel bits burst away
 .to(dn,{z:140,rotationY:-18,rotationX:6,y:-14,scale:1.12,filter:'drop-shadow(0 40px 40px rgba(16,40,28,.35))',duration:.7,ease:'power2.out'},2.05)
 .to(px,{x:i=>[90,140,60,120][i%4],y:i=>[-120,-60,-150,-20][i%4],rotation:i=>[60,-90,140,-40][i%4],opacity:0,duration:.8,ease:'power2.out'},2.05)
 .to(ld,{opacity:0,y:10,duration:.4},2.1)
 .add(()=>{
   // fly to where SIX stands in the jungle, while the badge docks into the nav
   const r=dn.getBoundingClientRect(),cs=host?getComputedStyle(host):null;
   const hx=cs?parseFloat(cs.getPropertyValue('--hx'))||innerWidth*.66:innerWidth*.66,hy=cs?parseFloat(cs.getPropertyValue('--hy'))||innerHeight*.5:innerHeight*.5;
   g.to(dn,{x:'+='+(hx-(r.left+r.width/2)),y:'+='+(hy+innerHeight*.12-(r.top+r.height/2)),scale:2.4,opacity:0,duration:1.1,ease:'power3.inOut'});
   if(brand){const b=brand.getBoundingClientRect(),l=lg.getBoundingClientRect();
     g.to(badge,{x:b.left+b.width/2-(l.left+l.width/2),y:b.top+b.height/2-(l.top+l.height/2),scale:b.width/l.width,duration:1,ease:'power3.inOut'});
     g.to(badge,{opacity:0,duration:.25,delay:.85})}
   g.to(veil,{opacity:0,duration:1.1,ease:'power2.inOut'});
   setTimeout(()=>window.L6stage&&L6stage.reveal&&L6stage.reveal(),650);
 },2.75)
 .to({},{duration:1.25});
})();
