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
const hudC=$('#hudCoord'),hudP=$('#hudPlace'),hudN=$('#hudNum');let lastK=-2;
function line(p){const x=p2x(p);window.__gl&&__gl.set(x);
 const h=Math.max(0,1-x*1.6);gsap.set('.hero',{opacity:h,y:-x*120,pointerEvents:h>.2?'auto':'none'});
 const k=Math.round(x)-1;const settled=Math.abs(x-Math.round(x))<.08;
 sts.forEach((el,j)=>el.classList.toggle('on',j===k&&settled));
 if(k!==lastK){lastK=k;const g=k>=0&&k<6?GEO[k]:(k<0?['35.3606° N · 138.7274° E','Mount Fuji · 3,776 m']:['—','Tea house · 茶室']);hudC.textContent=g[0];hudP.textContent=g[1];hudN.textContent=k>=0&&k<6?S[k].n:(k<0?'00':'07');
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

/* ceremony bowl */
const bowl=$('#bowl');let rnd=7;const rr=()=>(rnd=(rnd*16807)%2147483647,(rnd-1)/2147483646);
let bub='';for(let i=0;i<160;i++){const a=rr()*Math.PI*2,d=Math.sqrt(rr())*205;bub+=`<circle class="bb" cx="${(300+Math.cos(a)*d).toFixed(1)}" cy="${(300+Math.sin(a)*d).toFixed(1)}" r="${(1.5+rr()*6).toFixed(1)}" fill="#E4EEC4" opacity="0"/>`}
let fall='';for(let i=0;i<46;i++)fall+=`<circle class="pw" cx="${(250+rr()*100).toFixed(1)}" cy="0" r="${(1.5+rr()*3).toFixed(1)}" fill="#8FB04A"/>`;
bowl.innerHTML=`<defs><radialGradient id="foam" cx="50%" cy="42%" r="58%"><stop offset="0" stop-color="#D2E39A"/><stop offset=".7" stop-color="#9DBA52"/><stop offset="1" stop-color="#6E8F3A"/></radialGradient><radialGradient id="cer" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#4a4740"/><stop offset="1" stop-color="#22211d"/></radialGradient><clipPath id="inner"><circle cx="300" cy="300" r="226"/></clipPath></defs>
<circle cx="300" cy="300" r="268" fill="url(#cer)"/><circle cx="300" cy="300" r="268" fill="none" stroke="#5a564d" stroke-width="2"/>
<circle cx="300" cy="300" r="230" fill="#141310"/>
<g clip-path="url(#inner)"><circle id="water" cx="300" cy="300" r="0" fill="#9FB46E" opacity=".9"/><circle id="liq" cx="300" cy="300" r="226" fill="#5E7D32" opacity="0"/><circle id="mound" cx="300" cy="300" r="0" fill="#8FB04A"/><circle id="foamL" cx="300" cy="300" r="226" fill="url(#foam)" opacity="0"/><g>${bub}</g>
<path id="whisk" d="M150 380 L220 220 L300 370 L380 220 L450 380" fill="none" stroke="#E6D9A8" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity="0"/></g><g>${fall}</g>`;
const steps=$$('#steps li');
function cer(q){const st=Math.min(3,Math.floor(q*4));steps.forEach((l,i)=>l.classList.toggle('on',i===st));
 const s1=Math.min(1,q/.25),s2=Math.max(0,Math.min(1,(q-.25)/.25)),s3=Math.max(0,Math.min(1,(q-.5)/.25)),s4=Math.max(0,Math.min(1,(q-.75)/.2));
 $$('.pw',bowl).forEach((c,i)=>{const y=((s1*560+i*17)%560);c.setAttribute('transform',`translate(0 ${s1>0&&s1<1?y:-60})`)});
 $('#mound').setAttribute('r',(72*s1*(1-s2*.6)).toFixed(1));$('#mound').setAttribute('opacity',1-s3);$('#water').setAttribute('r',(226*s2).toFixed(1));$('#liq').setAttribute('opacity',(s3*.95).toFixed(2));
 const w=$('#whisk');w.setAttribute('opacity',s3>0&&s4<1?1-s4:0);w.setAttribute('transform',`translate(${Math.sin(q*90)*40} ${Math.cos(q*70)*20})`);$('#foamL').setAttribute('opacity',s4.toFixed(2));
 $$('.bb',bowl).forEach((b,i)=>b.setAttribute('opacity',Math.max(0,Math.min(.9,(s3*1.4+s4)-i/160)).toFixed(2)))}
ScrollTrigger.create({trigger:'#ceremony',start:'top top',end:'bottom bottom',onUpdate:s=>cer(s.progress)});cer(0);
gsap.to('.bowl',{rotate:40,ease:'none',scrollTrigger:{trigger:'#ceremony',start:'top top',end:'bottom bottom',scrub:true}});

/* posters with tilt */
$('#poGrid').innerHTML=S.map((s,i)=>`<figure class="po" data-hover><img src="i/poster_${s.id}.webp" alt="Station ${s.n} poster: ${s.tea}" loading="lazy" width="900" height="1200"><figcaption class="mono">${s.n} · ${s.name}</figcaption></figure>`).join('');
$$('.po').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;gsap.to(el,{rotateY:x*14,rotateX:-y*14,duration:.5})});el.addEventListener('pointerleave',()=>gsap.to(el,{rotateY:0,rotateX:0,duration:.8,ease:'elastic.out(1,.5)'}))});
gsap.from('.po',{y:120,opacity:0,stagger:.08,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:'.po-grid',start:'top 80%'}});

/* section reveals */
$$('.pk-head h2,.po-head h2,.cer-txt h2,.gift-txt h2').forEach(h=>{h.innerHTML=h.innerHTML.split('<br>').map(l=>`<span class="ln"><span>${l}</span></span>`).join('');gsap.from($$('.ln>span',h),{yPercent:110,duration:1.2,stagger:.1,ease:'expo.out',scrollTrigger:{trigger:h,start:'top 85%'}})});
gsap.fromTo('.gift-img img',{scale:1.25},{scale:1,ease:'none',scrollTrigger:{trigger:'.gift',start:'top bottom',end:'bottom top',scrub:true}});
gsap.fromTo('.ft-word',{yPercent:40},{yPercent:0,ease:'none',scrollTrigger:{trigger:'.foot',start:'top bottom',end:'bottom bottom',scrub:true}});

/* nav state */
ScrollTrigger.create({start:120,onUpdate:s=>$('#nav').classList.toggle('scrolled',s.scroll()>120)});
addEventListener('load',()=>ScrollTrigger.refresh());
})();
