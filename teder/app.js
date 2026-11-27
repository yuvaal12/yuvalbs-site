/* TEDER · site logic */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAL=[
 {n:'לילה',bg:'#0d0b14',line:'#efd9b4',sun:'#ff5a1f',hot:'#ff5a1f'},
 {n:'שקיעה',bg:'#ff5a1f',line:'#1a0b06',sun:'#ffd24a',hot:'#fff3d6'},
 {n:'זריחה',bg:'#efd9b4',line:'#2a1a12',sun:'#ff3d6e',hot:'#ff3d6e'},
 {n:'ירח',bg:'#10162b',line:'#b9c6ff',sun:'#f2f2ea',hot:'#7cf2d0'}];

/* ---------- hero dunes ---------- */
const cv=$('#dunes'),g=cv.getContext('2d');let W=0,H=0,DPR=Math.min(devicePixelRatio,2);
function size(){W=cv.clientWidth;H=cv.clientHeight;cv.width=W*DPR;cv.height=H*DPR;g.setTransform(DPR,0,0,DPR,0,0)}size();addEventListener('resize',size);
let mx=-9,tmx=-9,kick=0,lastBeat=0,heroVis=true;
cv.parentElement.addEventListener('pointermove',e=>{tmx=e.clientX/innerWidth},{passive:true});
cv.parentElement.addEventListener('pointerleave',()=>{tmx=-9});
new IntersectionObserver(([e])=>heroVis=e.isIntersecting).observe(cv);
/* idle "breath" spectrum when sound is off */
const idle=new Uint8Array(128);
function frame(now){
 const t=now/1000;
 if(TD.beat!==lastBeat){lastBeat=TD.beat;kick=1;pulse()}kick*=.9;
 mx=tmx<-1?-9:(mx<-1?tmx:mx+(tmx-mx)*.08);
 let bands=TD.on?TD.bands():null;
 if(!bands){for(let i=0;i<128;i++)idle[i]=(Math.sin(t*.8+i*.3)*.5+.5)*60;bands=idle}
 if(heroVis)DUNES.draw(g,W,H,reduce?0:t,{bands,kick,mx,colors:PAL[0],lines:innerWidth<700?30:46,top:innerWidth<700?.3:.34,gain:innerWidth<700?.45:1});
 if(footVis)DUNES.draw(fg,fW,fH,reduce?0:t*.6,{bands,kick:kick*.6,lines:22,top:.15,sunY:.2,colors:PAL[0]});
 /* heat haze on the big word follows the level */
 const lv=TD.on?TD.level():0;heatD.setAttribute('scale',(lv*28+kick*10).toFixed(1));
 logoWave.setAttribute('d',wavePath(t,lv+kick*.4));
 requestAnimationFrame(frame)}
const heatD=$('#heatD'),logoWave=$('#logoWave');
function wavePath(t,a){let d='M0 12';for(let x=2;x<=40;x+=2)d+=` L${x} ${(12+Math.sin(x*.55+t*6)*(3+a*8)).toFixed(1)}`;return d}
/* footer dunes */
const fc=$('#footDunes'),fg=fc.getContext('2d');let fW=0,fH=0,footVis=false;
function fsize(){fW=fc.clientWidth;fH=fc.clientHeight;fc.width=fW*DPR;fc.height=fH*DPR;fg.setTransform(DPR,0,0,DPR,0,0)}fsize();addEventListener('resize',fsize);
new IntersectionObserver(([e])=>footVis=e.isIntersecting).observe(fc);
requestAnimationFrame(frame);

/* ---------- sound toggle ---------- */
function pulse(){document.documentElement.style.setProperty('--k','1');requestAnimationFrame(()=>document.documentElement.style.setProperty('--k','0'))}
async function toggle(){if(TD.on)TD.stop();else await TD.start();const on=TD.on;$('#snd').setAttribute('aria-pressed',on);$('#snd .lbl').textContent=on?'השתק':'הפעל צליל';$('#play .pl').textContent=on?'להשקיט את המדבר':'להדליק את המדבר';$('#play').classList.toggle('on',on)}
$('#snd').addEventListener('click',toggle);$('#play').addEventListener('click',toggle);

/* ---------- marquee ---------- */
const MQ=['שקיעה','122 BPM','מכתש רמון','עד הזריחה','3 לילות','בלי קליטה','מתחת לכוכבים','חול קר'];
$('#mq').innerHTML=[...MQ,...MQ].map(s=>`<span>${s}</span><i>✳</i>`).join('');

/* ---------- lineup ---------- */
const NIGHTS=[
 {d:'חמישי 16.04',n:'לילה ראשון · שקיעה',acts:[['SALT MACHINE','במת הצוק','19:40'],['כביש 90','במת הצוק','21:10'],['ZOHAR/ZOHAR','האוהל','22:30'],['DUNE TELEPHONE','במת המכתש','00:00'],['צל צל','במת המכתש','02:00']]},
 {d:'שישי 17.04',n:'לילה שני · ירח',acts:[['נחל צין אורקסטרה','האוהל','20:00'],['MIRAGE UNIT','במת הצוק','21:30'],['KAV RAMON','במת המכתש','23:00'],['קולות מהבור','במת המכתש','01:00'],['ORANIM 4AM','במת המכתש','03:30']]},
 {d:'שבת 18.04',n:'לילה שלישי · זריחה',acts:[['שרב','במת הצוק','19:00'],['GRAVEL & GOLD','האוהל','21:00'],['YAAN','במת המכתש','23:00'],['BAR-ON SIGNAL','במת המכתש','01:30'],['זריחה (B2B כולם)','במת הצוק','05:15']]}];
$('#nights').innerHTML=NIGHTS.map((n,i)=>`<button role="tab" type="button" aria-selected="${i===0}" data-i="${i}"><b>${n.d}</b><span class="mono">${n.n}</span></button>`).join('');
function showNight(i){$$('#nights button').forEach((b,j)=>b.setAttribute('aria-selected',j===i));
 $('#acts').innerHTML=NIGHTS[i].acts.map((a,k)=>`<li style="--d:${k*60}ms"><span class="mono t">${a[2]}</span><b class="an" data-txt="${a[0]}">${a[0]}</b><span class="mono s">${a[1]}</span></li>`).join('');
 if(!reduce)gsap.from('#acts li',{yPercent:60,opacity:0,stagger:.06,duration:.8,ease:'expo.out'})}
$('#nights').addEventListener('click',e=>{const b=e.target.closest('button');if(b)showNight(+b.dataset.i)});
$('#nights').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;const cur=$$('#nights button').findIndex(b=>b.getAttribute('aria-selected')==='true');const n=(cur+(e.key==='ArrowLeft'?1:-1)+3)%3;showNight(n);$$('#nights button')[n].focus()});
showNight(0);

/* ---------- stages map ---------- */
const STG=[{n:'במת הצוק',x:430,y:120,d:'על שפת המכתש, 40 מטר מעל הקרקעית. השקיעה מאחורי הדיג׳יי.',c:'#ff5a1f'},{n:'במת המכתש',x:250,y:260,d:'הבמה הגדולה, על הקרקעית. מערכת סאונד שנשמעת עד מצפה רמון.',c:'#efd9b4'},{n:'האוהל',x:140,y:150,d:'אמביינט, שטיחים ותה עם נענע. למי שצריך לנשום בין הסטים.',c:'#7cf2d0'}];
(function map(){let s='';for(let i=0;i<9;i++){const rx=270-i*24,ry=170-i*16;s+=`<ellipse cx="${300+i*3}" cy="${210+i*2}" rx="${rx}" ry="${ry}" class="ct" style="--i:${i}"/>`}
 s+=`<path class="road" d="M600 60 C 520 80, 470 100, 430 120"/>`;
 s+=STG.map((p,i)=>`<g class="pin" data-i="${i}" tabindex="0" role="button" aria-label="${p.n}"><circle cx="${p.x}" cy="${p.y}" r="22" class="pr" style="--c:${p.c}"/><circle cx="${p.x}" cy="${p.y}" r="7" fill="${p.c}"/><text x="${p.x}" y="${p.y-32}" text-anchor="middle">${p.n}</text></g>`).join('');
 s+=`<text class="mono-t" x="20" y="400">N 30.61° · E 34.80° · −  -  − 40 מ׳</text>`;$('#map').innerHTML=s})();
$('#stList').innerHTML=STG.map((p,i)=>`<li data-i="${i}" style="--c:${p.c}"><b>${p.n}</b><p>${p.d}</p></li>`).join('');
function hiStage(i){$$('.pin').forEach((p,j)=>p.classList.toggle('on',j===i));$$('#stList li').forEach((l,j)=>l.classList.toggle('on',j===i))}
$('#map').addEventListener('pointerover',e=>{const p=e.target.closest('.pin');if(p)hiStage(+p.dataset.i)});
$('#map').addEventListener('focusin',e=>{const p=e.target.closest('.pin');if(p)hiStage(+p.dataset.i)});
$('#stList').addEventListener('pointerover',e=>{const l=e.target.closest('li');if(l)hiStage(+l.dataset.i)});
hiStage(1);

/* ---------- poster generator ---------- */
const po=$('#po'),pg=po.getContext('2d');let pal=0,pid=1,seed=Math.random()*50;
$('#sw').innerHTML=PAL.map((p,i)=>`<button type="button" role="radio" aria-checked="${i===0}" aria-label="${p.n}" data-i="${i}" style="--a:${p.bg};--b:${p.sun}"></button>`).join('');
$('#sw').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;pal=+b.dataset.i;$$('#sw button').forEach((x,j)=>x.setAttribute('aria-checked',j===pal));drawPoster()});
function drawPoster(){
 const C=PAL[pal],Wp=1080,Hp=1350,bands=TD.on?TD.bands():idle;
 DUNES.draw(pg,Wp,Hp,seed*3,{bands,kick:.4,lines:40,top:.42,sunY:.4,sunX:.5,colors:C,seed});
 pg.fillStyle=C.line;pg.textAlign='right';pg.direction='rtl';
 pg.font='700 330px Karantina, Rubik, sans-serif';pg.fillText('תדר',Wp-70,330);
 pg.font='500 30px "IBM Plex Mono", monospace';pg.direction='ltr';pg.fillText('16—18.04.2027',Wp-74,390);pg.direction='rtl';pg.font='700 40px Rubik, sans-serif';pg.fillText('מכתש רמון',Wp-74,440);
 pg.textAlign='left';pg.direction='ltr';pg.fillText('TEDER  #'+String(pid).padStart(4,'0'),70,390);
 pg.font='500 24px "IBM Plex Mono", monospace';pg.fillText('122 BPM · FICTIONAL FESTIVAL',70,Hp-50);
 $('#poId').textContent='#'+String(pid).padStart(4,'0');
 $('#poDl').href=po.toDataURL('image/png')}
$('#poNew').addEventListener('click',()=>{seed=Math.random()*50;pid++;drawPoster();if(!reduce)gsap.fromTo(po,{rotate:-2,scale:.97},{rotate:0,scale:1,duration:.6,ease:'back.out(2)'})});
document.fonts.ready.then(drawPoster);

/* ---------- tickets ---------- */
const TK=[{n:'לילה אחד',p:'₪290',d:['כניסה מהשקיעה עד הזריחה','גישה לשלוש הבמות','מים ללא הגבלה']},{n:'שלושה לילות',p:'₪690',d:['כל הסופ״ש','אזור קמפינג על החול','הסעה ממצפה רמון'],hot:1},{n:'אוהל בדואי',p:'₪1,450',d:['שלושה לילות לשניים','אוהל מוכן עם מזרנים','ארוחת בוקר בזריחה']}];
$('#tkGrid').innerHTML=TK.map((t,i)=>`<article class="tk-c${t.hot?' hot':''}"><p class="mono">${String(i+1).padStart(2,'0')} · ${t.hot?'הכי מבוקש':'כרטיס'}</p><h3>${t.n}</h3><p class="pr">${t.p}</p><ul>${t.d.map(x=>`<li>${x}</li>`).join('')}</ul><button class="btn" type="button">לבחירה</button></article>`).join('');
$('#tkGrid').addEventListener('click',e=>{if(!e.target.closest('.btn'))return;const n=$('#tkNote');n.textContent='זה פסטיבל בדיוני, אז אין קופה. אבל הטעם הטוב שלך נרשם.';n.classList.remove('flash');void n.offsetWidth;n.classList.add('flash')});

/* ---------- scroll motion ---------- */
if(!reduce&&window.gsap){
 gsap.registerPlugin(ScrollTrigger);
 gsap.from('.h-word span',{yPercent:110,duration:1.3,stagger:.09,ease:'expo.out',delay:.1});
 gsap.from('.h-meta,.h-sub,.h-cta',{y:24,opacity:0,duration:1,stagger:.08,delay:.5,ease:'power3.out'});
 /* manifesto words light up */
 const m=$('#maniT');m.innerHTML=m.textContent.split(' ').map(w=>`<span>${w}</span>`).join(' ');
 gsap.fromTo('#maniT span',{opacity:.14},{opacity:1,stagger:.04,ease:'none',scrollTrigger:{trigger:'.mani',start:'top 75%',end:'bottom 55%',scrub:true}});
 gsap.utils.toArray('.sec-h h2').forEach(h=>gsap.from(h,{yPercent:30,opacity:0,duration:1,ease:'expo.out',scrollTrigger:{trigger:h,start:'top 85%'}}));
 gsap.from('.tk-c',{y:60,opacity:0,stagger:.1,duration:1,ease:'expo.out',scrollTrigger:{trigger:'#tkGrid',start:'top 80%'}});
 gsap.from('.ct',{scale:.6,opacity:0,transformOrigin:'50% 50%',stagger:.05,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:'#map',start:'top 80%'}});
 /* marquee speed follows scroll velocity */
 let x=0,v=1;ScrollTrigger.create({onUpdate:s=>{v=1+Math.min(6,Math.abs(s.getVelocity())/400)}});
 gsap.ticker.add(()=>{x-=v*.6;v+=(1-v)*.05;const w=$('#mq').scrollWidth/2;if(-x>w)x+=w;$('#mq').style.transform=`translateX(${x}px)`});
}
