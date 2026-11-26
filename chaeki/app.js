(()=>{
const S=CHAEKI.S,$=(q,c=document)=>c.querySelector(q),$$=(q,c=document)=>[...c.querySelectorAll(q)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(pointer:fine)').matches;
gsap.registerPlugin(ScrollTrigger);
$$('[data-ring]').forEach(el=>el.innerHTML=CHAEKI_LOGO.ring({line:'#D9432B',ink:'currentColor',fill:'transparent',txt:'currentColor'}));

/* smooth scroll */
const lenis=new Lenis({lerp:.085,smoothWheel:true});window.__lenis=lenis;
lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');const el=id==='#top'?0:$(id);if(el===null)return;e.preventDefault();lenis.scrollTo(el,{duration:1.8})}));

/* cursor */
if(FINE&&!RM){const c=$('#cursor'),ring=$('.c-ring',c),dot=$('.c-dot',c);let x=innerWidth/2,y=innerHeight/2,rx=x,ry=y;
 addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;dot.style.transform=`translate(${x}px,${y}px)`},{passive:true});
 gsap.ticker.add(()=>{rx+=(x-rx)*.16;ry+=(y-ry)*.16;ring.style.transform=`translate(${rx}px,${ry}px)`});
 document.addEventListener('pointerover',e=>{c.classList.toggle('hov',!!e.target.closest('a,[data-hover],button'))});
 $$('[data-hover]').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();gsap.to(el,{x:(e.clientX-r.left-r.width/2)*.22,y:(e.clientY-r.top-r.height/2)*.3,duration:.4})});el.addEventListener('pointerleave',()=>gsap.to(el,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'}))});
}else $('#cursor').remove();

/* loader */
const ld=$('#loader'),num=$('#ldNum'),bar=$('#ldBar'),dest=$('#ldDest');let shown=0,di=0;const t0=performance.now();
const dT=setInterval(()=>{di=(di+1)%6;dest.textContent=`${S[di].name} · ${S[di].jp}`},260);
function ldTick(){const real=Math.min(1,(window.__glLoaded||0)/Math.min(3,(window.CHAEKI_SCENES||[]).length));const timeP=Math.min(1,(performance.now()-t0)/1700);const target=Math.min(real,timeP);shown+=(target-shown)*.12;
 num.textContent=String(Math.round(shown*100)).padStart(3,'0');bar.style.transform=`scaleX(${shown})`;
 if(shown>.995&&real>=1){clearInterval(dT);dest.textContent='CHA·EKI · 茶駅';done()}else requestAnimationFrame(ldTick)}
requestAnimationFrame(ldTick);setTimeout(()=>{if(document.body.classList.contains('is-loading')){window.__glLoaded=99}},6000);
function done(){const tl=gsap.timeline();tl.to('.ld-in',{opacity:0,y:-30,duration:.5,delay:.25}).to(ld,{clipPath:'inset(0 0 100% 0)',duration:1.1,ease:'expo.inOut'},'<.1')
 .add(()=>{document.body.classList.remove('is-loading');ld.remove()})
 .from('.hw',{yPercent:110,duration:1.3,stagger:.06,ease:'expo.out'},'-=.55').from('.hero-copy,.hero-meta,.hero-v,.scroll-cue,.nav,.route,.hud',{opacity:0,y:20,duration:1,stagger:.06},'-=1')}
gsap.set('.hw',{yPercent:0});

/* clock (Japan time) */
const clock=$('#clock');function tick(){try{clock.textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Tokyo'}).format(new Date())+' JST · Fuji'}catch(e){}}tick();setInterval(tick,30000);

/* stations */
const GEO=[['34.8844° N · 135.7999° E','Uji · Kyoto Pref.'],['34.9756° N · 138.3828° E','Shizuoka · under Fuji'],['35.0116° N · 135.7681° E','Kyoto · Fushimi'],['33.2119° N · 130.5578° E','Yame · Fukuoka Pref.'],['33.5597° N · 133.5311° E','Kochi · Pacific coast'],['34.3956° N · 135.8578° E','Yoshino · Nara Pref.']];
const col=s=>s.id==='yame'?'#5FBF92':s.id==='kochi'?'#E2AE1C':s.c;
$('#stations').innerHTML=S.map((s,k)=>`<article class="st" data-k="${k}" style="--sc:${col(s)}" aria-label="Station ${s.n}: ${s.tea}">
 <div class="st-num" aria-hidden="true">${s.n}</div>
 <div class="st-kanji jp" lang="ja" aria-hidden="true">${s.jp}</div>
 <div class="st-body">
  <p class="mono m"><span><i></i>Station ${s.n} / 06</span></p>
  <h2 class="m"><span><em class="jp" lang="ja">${s.teaJp}</em>${s.tea}</span></h2>
  <p class="st-note m"><span>${s.note}. ${s.notes.join(', ')}.</span></p>
  <div class="ticket m"><span>${s.brew.split('·').map((b,j)=>`<i><small>${['Leaf','Water','Temp','Time'][j]}</small>${b.trim()}</i>`).join('')}</span></div>
 </div>
 <img class="st-pouch" src="i/pouch_${s.id}.webp" alt="${s.tea} pouch" loading="lazy" width="626" height="900"></article>`).join('');
const sts=$$('.st');
$('#rDots').innerHTML=S.map((s,k)=>`<i style="left:${k/5*100}%;--dc:${col(s)}"><span class="jp">${s.jp}</span><small>${s.name}</small></i>`).join('');
const dots=$$('#rDots i');
$('#rTrain').innerHTML=`<svg viewBox="0 0 120 30"><path d="M4 6h84c18 0 28 6 30 14v4H4z" fill="#F1EADB"/><rect x="4" y="18" width="114" height="3" fill="#D9432B"/><rect x="4" y="21" width="114" height="3" fill="#5E7D32"/>${[12,28,44,60,76].map(x=>`<rect x="${x}" y="9" width="10" height="6" rx="2" fill="#20303a"/>`).join('')}<path d="M92 9h10c6 0 10 3 12 6H92z" fill="#20303a"/></svg>`;
const HOLD=.08,TR=(1-6*HOLD)/7,keys=[[0,0]];{let p=0;for(let i=0;i<6;i++){p+=TR;keys.push([p,i+1]);p+=HOLD;keys.push([p,i+1])}keys.push([1,7])}
const ease=f=>f<.5?4*f*f*f:1-Math.pow(-2*f+2,3)/2;
function p2x(p){for(let i=0;i<keys.length-1;i++){const [a,xa]=keys[i],[b,xb]=keys[i+1];if(p<=b){const f=(p-a)/(b-a||1);return xa+(xb-xa)*ease(f)}}return 7}
const scramble=(el,txt)=>{const ch='0123456789°·NE#/茶駅ABCDEFGHIJKLMNOPQRSTUVWXYZ';let f=0;cancelAnimationFrame(el._r);const run=()=>{f++;el.textContent=txt.split('').map((c,i)=>c===' '?' ':i<f*1.4?c:ch[Math.floor(Math.random()*ch.length)]).join('');if(f*1.4<txt.length)el._r=requestAnimationFrame(run)};run()};
const hudC=$('#hudCoord'),hudP=$('#hudPlace'),hudN=$('#hudNum');let lastK=-2;
function line(p){const x=p2x(p);window.__gl&&__gl.set(x);
 const h=Math.max(0,1-x*1.6);gsap.set('.hero',{opacity:h,y:-x*120,pointerEvents:h>.2?'auto':'none'});
 const k=Math.round(x)-1;const settled=Math.abs(x-Math.round(x))<.08;
 sts.forEach((el,j)=>el.classList.toggle('on',j===k&&settled));
 if(k!==lastK){lastK=k;const g=k>=0&&k<6?GEO[k]:(k<0?['35.3606° N · 138.7274° E','Mount Fuji · 3,776 m']:['—','Tea house · 茶室']);scramble(hudC,g[0]);scramble(hudP,g[1]);hudN.textContent=k>=0&&k<6?S[k].n:(k<0?'00':'07');
  document.documentElement.style.setProperty('--acc',k>=0&&k<6?col(S[k]):'#D9432B')}
 const r=Math.max(0,Math.min(1,(x-1)/5));$('#rOn').style.transform=`scaleX(${r})`;$('#rTrain').style.left=`${r*100}%`;dots.forEach((d,j)=>d.classList.toggle('on',j<=x-1+.02));
 $('#stations').style.setProperty('--par',(x-Math.round(x)).toFixed(3))}
ScrollTrigger.create({trigger:'#line',start:'top top',end:'bottom bottom',onUpdate:s=>line(s.progress)});line(0);

/* marquee driven by scroll velocity */
const mq=$('#mq');const unit=S.map(s=>`<span><b class="jp">${s.jp}</b>${s.name}<i>·</i>${s.tea}<i class="d" style="background:${col(s)}"></i></span>`).join('');mq.innerHTML=unit+unit+unit;
let mqx=0;gsap.ticker.add(()=>{const v=lenis.velocity||0;mqx-=1.1+Math.abs(v)*.6;const w=mq.scrollWidth/3;if(-mqx>w)mqx+=w;mq.style.transform=`translateX(${mqx}px) skewX(${Math.max(-12,Math.min(12,-v*.5))}deg)`});

/* manifesto: words fill as you read */
const mt=$('#maniT');mt.innerHTML=mt.textContent.split(' ').map(w=>`<span class="w">${w}</span>`).join(' ');const ws=$$('.w',mt);
ScrollTrigger.create({trigger:'.mani',start:'top 75%',end:'bottom 45%',scrub:true,onUpdate:s=>{const n=s.progress*ws.length;ws.forEach((w,i)=>w.classList.toggle('lit',i<n))}});
gsap.fromTo('.mani-k',{yPercent:30,opacity:0},{yPercent:-20,opacity:1,scrollTrigger:{trigger:'.mani',start:'top bottom',end:'bottom top',scrub:true}});

/* packs: horizontal ride */
const PK=(window.CHAEKI_PHOTOS||[]);const tr=$('#pkTrack');
tr.innerHTML=PK.map((g,i)=>`<figure class="pk ${g.s>=7?'w':''}" data-hover><div class="pk-img"><img src="i/${g.f}" alt="${g.a}" loading="lazy"></div><figcaption><b>${String(i+1).padStart(2,'0')}</b><span>${g.t}</span></figcaption></figure>`).join('');
const mm=gsap.matchMedia();
mm.add('(min-width:901px)',()=>{const dist=()=>tr.scrollWidth-innerWidth+80;
 const tw=gsap.to(tr,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:'.packs',start:'top top',end:()=>'+='+dist(),pin:'.pk-st',scrub:1,invalidateOnRefresh:true,onUpdate:s=>{$('#pkProg').style.transform=`scaleX(${s.progress})`}}});
 $$('.pk img',tr).forEach(img=>gsap.fromTo(img,{xPercent:-8},{xPercent:8,ease:'none',scrollTrigger:{trigger:img.closest('.pk'),containerAnimation:tw,start:'left right',end:'right left',scrub:true}}));
 return()=>{}});

/* ceremony: a painted top-down bowl, sift → pour → whisk → foam */
(()=>{const cv=$('#bowl'),cx=cv.getContext('2d'),stepEl=$('#bowlStep');let W=0,DP=Math.min(devicePixelRatio,2);
 function rs(){const r=cv.getBoundingClientRect();W=r.width;cv.width=W*DP;cv.height=W*DP}rs();addEventListener('resize',rs);
 let sd=11;const R=()=>(sd=(sd*16807)%2147483647,(sd-1)/2147483646);
 const powder=[...Array(900)].map(()=>{const a=R()*6.283,d=Math.pow(R(),.7);return{a,d,s:.6+R()*1.6,t:R()}});
 const foam=[...Array(2600)].map(()=>{const a=R()*6.283,d=Math.sqrt(R());return{a,d,s:.4+Math.pow(R(),4)*4.5,l:R()}});
 const tines=[...Array(64)].map((_,i)=>i/64*6.283);
 const noise=document.createElement('canvas');noise.width=noise.height=256;{const n=noise.getContext('2d'),im=n.createImageData(256,256);for(let i=0;i<im.data.length;i+=4){const v=R()*255;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=22}n.putImageData(im,0,0)}
 let q=0,qs=0;const steps=$$('#steps li');const NAMES=['Sift','Pour','Whisk','Foam'];
 window.__cer=v=>{q=v};
 function draw(t){qs+=(q-qs)*.12;const k=qs;cx.setTransform(DP,0,0,DP,0,0);cx.clearRect(0,0,W,W);const c=W/2,Rr=W*.44,Ri=W*.37;
  const s1=Math.min(1,k/.25),s2=Math.max(0,Math.min(1,(k-.25)/.25)),s3=Math.max(0,Math.min(1,(k-.5)/.25)),s4=Math.max(0,Math.min(1,(k-.75)/.22));
  const st=Math.min(3,Math.floor(k*4+.0001));steps.forEach((l,i)=>l.classList.toggle('on',i===st));stepEl.innerHTML=`<b>0${st+1}</b><span>${NAMES[st]}</span>`;
  // progress ring
  cx.strokeStyle='rgba(241,234,219,.12)';cx.lineWidth=1;cx.beginPath();cx.arc(c,c,W*.485,0,6.283);cx.stroke();
  cx.strokeStyle='#8FB04A';cx.lineWidth=2;cx.beginPath();cx.arc(c,c,W*.485,-1.5708,-1.5708+6.283*k);cx.stroke();
  // shadow + rim
  let g=cx.createRadialGradient(c,c+W*.03,Rr*.9,c,c+W*.03,Rr*1.12);g.addColorStop(0,'rgba(0,0,0,.6)');g.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=g;cx.beginPath();cx.arc(c,c+W*.03,Rr*1.12,0,6.283);cx.fill();
  g=cx.createLinearGradient(c-Rr,c-Rr,c+Rr,c+Rr);g.addColorStop(0,'#6b6557');g.addColorStop(.45,'#3a362f');g.addColorStop(1,'#1d1b17');cx.fillStyle=g;cx.beginPath();cx.arc(c,c,Rr,0,6.283);cx.fill();
  // glaze drip ring
  cx.save();cx.beginPath();cx.arc(c,c,Rr,0,6.283);cx.arc(c,c,Ri*1.02,0,6.283,true);cx.clip();for(let i=0;i<70;i++){const a=i/70*6.283+.2;cx.strokeStyle=`rgba(${120+(i%5)*12},${140+(i%3)*10},${90},.18)`;cx.lineWidth=W*.012;cx.beginPath();cx.moveTo(c+Math.cos(a)*Rr,c+Math.sin(a)*Rr);cx.lineTo(c+Math.cos(a)*Ri*(1.06+(i%4)*.03),c+Math.sin(a)*Ri*(1.06+(i%4)*.03));cx.stroke()}cx.restore();
  cx.strokeStyle='rgba(255,240,210,.22)';cx.lineWidth=2;cx.beginPath();cx.arc(c,c,Rr-2,3.4,5.3);cx.stroke();
  // inner well
  g=cx.createRadialGradient(c-Ri*.2,c-Ri*.25,Ri*.1,c,c,Ri);g.addColorStop(0,'#2b2924');g.addColorStop(1,'#0f0e0c');cx.fillStyle=g;cx.beginPath();cx.arc(c,c,Ri,0,6.283);cx.fill();
  cx.save();cx.beginPath();cx.arc(c,c,Ri,0,6.283);cx.clip();cx.globalAlpha=.6;cx.drawImage(noise,c-Ri,c-Ri,Ri*2,Ri*2);cx.globalAlpha=1;
  // liquid
  if(s2>0){const fr=Ri*Math.min(1,s2*1.15);const px=c+Ri*.25*(1-s2),py=c-Ri*.2*(1-s2);g=cx.createRadialGradient(px,py,0,c,c,fr*1.2);
   const mix=s3;const col1=`rgb(${Math.round(150-60*mix)},${Math.round(175-30*mix)},${Math.round(110-60*mix)})`;g.addColorStop(0,col1);g.addColorStop(1,`rgb(${Math.round(80-20*mix)},${Math.round(110+10*mix)},${Math.round(50-10*mix)})`);
   cx.fillStyle=g;cx.beginPath();cx.arc(px+(c-px)*s2,py+(c-py)*s2,fr,0,6.283);cx.fill();
   for(let r=0;r<5;r++){const rp=((t/1400+r/5)%1);cx.strokeStyle=`rgba(230,240,200,${(1-rp)*.25*(1-s3)})`;cx.lineWidth=1.2;cx.beginPath();cx.arc(c+Ri*.25*(1-s2),c-Ri*.2*(1-s2),rp*fr,0,6.283);cx.stroke()}}
  // powder mound
  const pm=s1*(1-s2*.9);if(pm>0){powder.forEach(p=>{if(p.t>s1)return;const d=p.d*Ri*.32*(.6+.4*s1),x=c+Math.cos(p.a)*d,y=c+Math.sin(p.a)*d;cx.fillStyle=`rgba(${110+p.s*20},${150+p.s*15},${60},${pm*.95})`;cx.beginPath();cx.arc(x,y,p.s*W/600*1.3,0,6.283);cx.fill()})}
  // swirl trails while whisking
  if(s3>0&&s4<1){const a=1-s4;for(let i=0;i<26;i++){const rr=Ri*(.15+i/26*.8),off=t/600*(1+i*.05);cx.strokeStyle=`rgba(200,220,140,${.13*a})`;cx.lineWidth=1.2;cx.beginPath();cx.arc(c,c,rr,off,off+1.2+i%3*.3);cx.stroke()}}
  // foam
  if(s3>.3||s4>0){const fa=Math.max(0,(s3-.3)/.7)*.6+s4*.4;g=cx.createRadialGradient(c-Ri*.15,c-Ri*.2,Ri*.05,c,c,Ri);g.addColorStop(0,`rgba(214,228,160,${fa})`);g.addColorStop(.7,`rgba(165,190,95,${fa})`);g.addColorStop(1,`rgba(110,140,55,${fa})`);cx.fillStyle=g;cx.beginPath();cx.arc(c,c,Ri,0,6.283);cx.fill();
   const n=Math.floor(foam.length*Math.min(1,(s3-.3)/.7*.5+s4));for(let i=0;i<n;i++){const f=foam[i],d=f.d*Ri*.98,x=c+Math.cos(f.a+t/9000)*d,y=c+Math.sin(f.a+t/9000)*d;cx.fillStyle=f.l>.5?'rgba(235,242,205,.55)':'rgba(140,168,80,.45)';cx.beginPath();cx.arc(x,y,f.s*W/600,0,6.283);cx.fill()}
   cx.fillStyle=`rgba(255,255,240,${.18*s4})`;cx.beginPath();cx.ellipse(c-Ri*.3,c-Ri*.35,Ri*.28,Ri*.12,-.6,0,6.283);cx.fill()}
  cx.restore();
  // falling powder from sieve
  if(s1>0&&s1<1){for(let i=0;i<60;i++){const ph=((t/900)+i/60)%1,x=c+(Math.sin(i*12.9)*.5)*Ri*.4,y=c-Rr-W*.06+ph*(Rr+W*.06);cx.fillStyle=`rgba(143,176,74,${.8*(1-ph*.5)})`;cx.beginPath();cx.arc(x,y,1.3+(i%3),0,6.283);cx.fill()}
   cx.strokeStyle='rgba(241,234,219,.6)';cx.lineWidth=1.5;cx.beginPath();cx.ellipse(c,c-Rr-W*.07,Ri*.42,W*.02,0,0,6.283);cx.stroke()}
  // water stream
  if(s2>0&&s2<1){const x0=c+Ri*.25,y0=c-Ri*.2;g=cx.createLinearGradient(x0,0,x0,y0);g.addColorStop(0,'rgba(220,235,240,0)');g.addColorStop(1,'rgba(220,235,240,.85)');cx.strokeStyle=g;cx.lineWidth=W*.012*(1-Math.abs(s2-.5));cx.beginPath();cx.moveTo(x0+Math.sin(t/200)*2,0);cx.lineTo(x0,y0);cx.stroke()}
  // chasen whisk from above
  if(s3>0&&s4<.9){const al=Math.min(1,s3*4)*(1-s4/.9);const ph=t/170;const wx=c+Math.sin(ph)*Ri*.42,wy=c+Math.sin(ph*2)*Ri*.18;cx.save();cx.globalAlpha=al;cx.translate(wx,wy);
   cx.fillStyle='rgba(0,0,0,.25)';cx.beginPath();cx.arc(6,10,W*.09,0,6.283);cx.fill();
   tines.forEach((a,i)=>{const r1=W*.025,r2=W*.085*(i%2?1:.92);cx.strokeStyle=i%2?'#E6D3A0':'#C9AE72';cx.lineWidth=1.6;cx.beginPath();cx.moveTo(Math.cos(a)*r1,Math.sin(a)*r1);cx.lineTo(Math.cos(a+.05)*r2,Math.sin(a+.05)*r2);cx.stroke()});
   cx.fillStyle='#B89656';cx.beginPath();cx.arc(0,0,W*.03,0,6.283);cx.fill();cx.fillStyle='#d9c48a';cx.beginPath();cx.arc(-2,-2,W*.018,0,6.283);cx.fill();cx.restore()}
  // steam when done
  if(s4>.4){cx.save();cx.globalCompositeOperation='screen';for(let i=0;i<5;i++){const ph=((t/3000)+i/5)%1,x=c+(i-2)*Ri*.25+Math.sin(t/800+i)*10,y=c-ph*Rr*1.3;g=cx.createRadialGradient(x,y,0,x,y,W*.09);g.addColorStop(0,`rgba(255,255,255,${.12*(1-ph)*(s4-.4)/.6})`);g.addColorStop(1,'rgba(255,255,255,0)');cx.fillStyle=g;cx.beginPath();cx.arc(x,y,W*.09,0,6.283);cx.fill()}cx.restore()}
  requestAnimationFrame(draw)}
 requestAnimationFrame(draw);
 ScrollTrigger.create({trigger:'#ceremony',start:'top top',end:'bottom bottom',onUpdate:s=>window.__cer(s.progress)});
})();

/* posters: a deck that deals itself onto the platform wall */
$('#poGrid').innerHTML=S.map((s,i)=>`<figure class="po" data-hover><div class="po-c"><img src="i/poster_${s.id}.webp" alt="Station ${s.n} poster: ${s.tea}" loading="lazy" width="900" height="1200"><i class="glare"></i></div><figcaption class="mono">${s.n} · ${s.name}</figcaption></figure>`).join('');
const pos=$$('.po');
pos.forEach(el=>{const c=$('.po-c',el),gl=$('.glare',el);el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;gsap.to(c,{rotateY:x*16,rotateX:-y*16,duration:.5});gl.style.background=`radial-gradient(circle at ${(x+.5)*100}% ${(y+.5)*100}%,rgba(255,255,255,.35),transparent 55%)`});el.addEventListener('pointerleave',()=>{gsap.to(c,{rotateY:0,rotateX:0,duration:.9,ease:'elastic.out(1,.5)'});gl.style.background='none'})});
mm.add('(min-width:901px)',()=>{const tl=gsap.timeline({scrollTrigger:{trigger:'.posters',start:'top top',end:'+=160%',pin:'.po-st',scrub:1}});
 const fan=i=>({rotate:(i-2.5)*6,y:Math.pow(Math.abs(i-2.5),2)*9});pos.forEach((el,i)=>gsap.set(el,fan(i)));
 tl.from(pos,{x:i=>(2.5-i)*Math.min(innerWidth*.18,300)*.81,y:i=>40,rotate:i=>(i-2.5)*2,ease:'power3.inOut',stagger:{each:.02,from:'center'}},0).from('.po figcaption',{opacity:0,duration:.2},.8);
 pos.forEach((el,i)=>{el.addEventListener('pointerenter',()=>gsap.to(el,{y:-50,rotate:0,scale:1.06,duration:.5,ease:'power3.out'}));el.addEventListener('pointerleave',()=>gsap.to(el,{...fan(i),scale:1,duration:.7,ease:'power3.out'}))});return()=>{}});
mm.add('(max-width:900px)',()=>{gsap.from('.po',{y:80,opacity:0,stagger:.08,duration:1,ease:'expo.out',scrollTrigger:{trigger:'.po-grid',start:'top 85%'}});return()=>{}});

/* section reveals */
$$('.pk-head h2,.po-head h2,.cer-txt h2,.gift-txt h2').forEach(h=>{h.innerHTML=h.innerHTML.split('<br>').map(l=>`<span class="ln"><span>${l}</span></span>`).join('');gsap.from($$('.ln>span',h),{yPercent:110,duration:1.2,stagger:.1,ease:'expo.out',scrollTrigger:{trigger:h,start:'top 85%'}})});
gsap.fromTo('.gift-img img',{scale:1.25},{scale:1,ease:'none',scrollTrigger:{trigger:'.gift',start:'top bottom',end:'bottom top',scrub:true}});
gsap.fromTo('.ft-word',{yPercent:40},{yPercent:0,ease:'none',scrollTrigger:{trigger:'.foot',start:'top bottom',end:'bottom bottom',scrub:true}});

/* nav state */
ScrollTrigger.create({start:120,onUpdate:s=>$('#nav').classList.toggle('scrolled',s.scroll()>120)});
addEventListener('load',()=>ScrollTrigger.refresh());
})();
