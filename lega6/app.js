/* LEGA6 · shared motion layer */
(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(pointer:fine)').matches,mob=()=>innerWidth<900;
const P=window.PAGE||{};
document.documentElement.classList.add('js');

/* split headings into words */
$$('.sw').forEach(el=>{let i=0;const mk=n=>{const w=document.createElement('span');w.className='w';const c=document.createElement('span');c.className='c';c.style.setProperty('--i',i++);c.appendChild(n);w.appendChild(c);return w};
  [...el.childNodes].forEach(n=>{if(n.nodeType===3){const f=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t))f.appendChild(document.createTextNode(t));else f.appendChild(mk(document.createTextNode(t)))});n.replaceWith(f)}else if(n.nodeName==='BR'){}else{const ph=document.createComment('');n.replaceWith(ph);ph.replaceWith(mk(n))}})});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!e.target.closest('.hero')){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.rv,.sw').forEach(el=>io.observe(el));

/* page transitions: a dark iris closes over the jungle, the next era opens */
const pt=document.createElement('div');pt.className='pt';pt.innerHTML='<div class="n"></div>';document.body.appendChild(pt);
let came=false;try{came=sessionStorage.getItem('l6pt')==='1';sessionStorage.removeItem('l6pt')}catch(e){}
if(came&&!RM){pt.classList.add('reveal');pt.querySelector('.n').textContent=P.eraName||'';requestAnimationFrame(()=>requestAnimationFrame(()=>{pt.style.transition='clip-path .9s cubic-bezier(.7,0,.2,1) .15s';pt.classList.remove('reveal')}))}
$$('a[href$=".html"],a[href="./"]').forEach(a=>a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||a.target==='_blank'||RM)return;e.preventDefault();const href=a.getAttribute('href');
  pt.querySelector('.n').textContent=a.dataset.era||'';pt.style.transition='';pt.classList.add('cover');try{sessionStorage.setItem('l6pt','1')}catch(e){}setTimeout(()=>location.href=href,720)}));

/* cursor */
if(fine&&!RM){const c=document.createElement('div');c.className='cur';c.innerHTML='<i></i><span></span>';document.body.appendChild(c);document.documentElement.classList.add('has-cur');
  let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y;addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;c.classList.add('on')},{passive:true});
  (function l(){cx+=(x-cx)*.22;cy+=(y-cy)*.22;c.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(l)})();
  document.addEventListener('pointerover',e=>{const t=e.target.closest('[data-cursor]');c.classList.toggle('big',!!t);$('span',c).textContent=t?t.dataset.cursor:''})}

/* nav */
const nav=$('.nav'),dock=$('.dock');let ly=0;
$('.burger')&&$('.burger').addEventListener('click',()=>nav.classList.toggle('open'));
addEventListener('scroll',()=>{const y=scrollY;nav.classList.toggle('sc',y>40);if(!nav.classList.contains('open'))nav.classList.toggle('hide',y>ly+2&&y>innerHeight*1.2);if(y<ly-2)nav.classList.remove('hide');ly=y;
  if(dock){const end=$('#spec')||$('footer');dock.classList.toggle('on',y>innerHeight*.8&&end.getBoundingClientRect().top>innerHeight*.6)}},{passive:true});

/* whatsapp entry points */
const WA='972535113115',HE=document.documentElement.lang==='he';
$$('form.ask').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const v=$('input',f).value.trim();const a=document.createElement('a');a.href=`https://wa.me/${WA}?text=`+encodeURIComponent(HE?'היי LEGA6, אני רוצה לבנות: '+(v||'מוצר חדש'):'Hi LEGA6, I want to build: '+(v||'a new product'));a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove()}));
const sheet=$('#sheet');if(sheet){const opts=$$('.opts button',sheet),wa=$('#wa');$('#docn').textContent=String(Math.floor(1000+Math.random()*8999));
  const upd=()=>{const k=opts.filter(b=>b.getAttribute('aria-pressed')==='true').map(b=>b.textContent).join(', ');
    const L=HE?['היי LEGA6, אפיון פרויקט:','שם: ','חברה: ','בונים: ','הרעיון: ']:['Hi LEGA6, project spec:','Name: ','Company: ','Building: ','Idea: '];const t=[L[0],$('#nm').value&&(L[1]+$('#nm').value),$('#co').value&&(L[2]+$('#co').value),k&&(L[3]+k),$('#ms').value&&(L[4]+$('#ms').value)].filter(Boolean).join('\n');
    wa.href=`https://wa.me/${WA}?text=`+encodeURIComponent(t)};
  opts.forEach(b=>b.addEventListener('click',()=>{b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true');upd()}));
  ['nm','co','ms'].forEach(i=>$('#'+i).addEventListener('input',upd));upd();sheet.addEventListener('submit',e=>e.preventDefault())}

/* manifesto words */
const man=$('p.big');let mw=[];if(man){man.innerHTML=man.textContent.trim().split(/\s+/).map(w=>`<span>${w}</span>`).join(' ');mw=$$('span',man)}

/* whatsapp demos (illustrative) */
const CH={
 richard:{n:HE?'ריצ׳רד':'Richard',s:HE?'המשרת של תקציב הבית':'your home budget butler',c:'#7CB342',rtl:1,m:[['me','80 פיצה'],['bot','נרשם ✓ אוכל בחוץ · 80 ₪\nנשארו 420 ₪ לאוכל בחוץ החודש'],['me','כמה הוצאתי על דלק?'],['bot','החודש: 610 ₪ על דלק, 12% פחות מהחודש שעבר']]},
 toro:{n:'TORO',s:HE?'זימון תורים':'bookings',c:'#12B5C8',rtl:1,m:[['bot','היי! לאיזה טיפול לקבוע?\n1. תספורת  2. זקן'],['me','1'],['bot','יש מקום מחר ב-10:00 או ב-13:30'],['me','10:00'],['bot','נקבע ✓ מחר 10:00\nתזכורת תגיע שעה לפני']]},
 bernie:{n:HE?'ברני':'Bernie',s:HE?'מאמן התזונה שלך':'your nutrition coach',c:'#F25A1A',rtl:1,m:[['me','📸 שקשוקה ופיתה'],['bot','שקשוקה ופיתה. בערך 640 קלוריות 🔥'],['bot','נשארו לך 820 היום. לערב סלט עם חזה עוף?'],['me','סגור']]}};
let dT=[];window.l6demo=(k,el)=>{dT.forEach(clearTimeout);dT=[];const c=CH[k],s=el;if(!s)return;
  s.innerHTML=`<div class="top"><i style="background:${c.c}">${c.n[0]}</i><div><b>${c.n}</b><small>● ${c.s}</small></div></div>`;
  c.m.forEach((m,i)=>{const d=document.createElement('div');d.className='msg '+m[0];if(c.rtl)d.dir='rtl';d.innerHTML=m[1].replace(/\n/g,'<br>');s.appendChild(d);dT.push(setTimeout(()=>d.classList.add('on'),300+i*(RM?0:850)))})};
$$('[data-demo]').forEach(el=>{let on=false;new IntersectionObserver(e=>{if(e[0].isIntersecting&&!on){on=true;window.l6demo(el.dataset.demo,$('.scr',el))}},{threshold:.35}).observe(el)});

/* terminal */
const tpre=$('#tpre');let term=()=>{};
if(tpre){const TL=[['p','$ '],['w','lega6 new toro --stack react,node'],['','\n'],['ok','✓ '],['','auth · payments · whatsapp-bot\n\n'],['p','$ '],['w','lega6 ai attach --agent booking'],['','\n'],['ok','✓ '],['','agent online · hebrew + english\n\n'],['p','$ '],['w','lega6 test'],['','\n'],['ok','✓ '],['','all tests passed\n\n'],['p','$ '],['w','lega6 deploy --prod'],['','\n'],['ok','▲ '],['w','live → toro.lega6.com'],['','\n']];
  const TOT=TL.reduce((a,b)=>a+b[1].length,0);term=p=>{let n=Math.round(TOT*p),h='';for(const [c,t] of TL){if(n<=0)break;const s=t.slice(0,n);n-=s.length;h+=c?`<span class="${c}">${s}</span>`:s}tpre.innerHTML=h+'<span class="caret"></span>'};term(RM?1:0)}

/* calendar cells for the morph */
$$('.cal').forEach((c,i)=>{let h='';for(let d=1;d<=28;d++)h+=i%2===0?'<b></b>':`<b class="${d<6?'x':d===12?'on':''}">${d}</b>`;c.innerHTML=h});

/* ---- hero film: scrubbed by scroll ---- */
const film=$('#film'),hero=$('.hero');let heroP=()=>{};
if(film&&hero){const GL=!!window.L6stage;let fT=0,fC=0;
  if(!GL){const fsrc=P.film+(mob()?'_m':'')+'.mp4';film.src=fsrc;
  fetch(fsrc).then(r=>r.ok?r.blob():Promise.reject()).then(b=>{const u=URL.createObjectURL(b),t=film.currentTime;film.addEventListener('error',()=>{if(film.src===u)film.src=fsrc},{once:true});film.src=u;film.currentTime=t}).catch(()=>{});
  const unlock=()=>{film.play().then(()=>film.pause()).catch(()=>{});removeEventListener('touchstart',unlock)};addEventListener('touchstart',unlock,{passive:true});
  (function loop(){if(film.readyState>=2&&film.duration){fC+=(fT-fC)*.12;const t=Math.min(film.duration-.04,fC*film.duration);if(Math.abs(film.currentTime-t)>.015&&!film.seeking)film.currentTime=t}requestAnimationFrame(loop)})();}
  const caps=$$('.cap',hero),eb=$('.era b',hero),hb=$('.hud .pct',hero),es=$('.era small',hero),bar=$('.bar i',hero),cue=$('.cue',hero);const E=P.era||{from:0,to:0,unit:'',fmt:v=>v};
  heroP=p=>{fT=p;GL&&L6stage.set(p);bar&&(bar.style.transform=`scaleX(${p})`);cue&&(cue.style.opacity=p>.03?0:1);
    caps.forEach(c=>{const a=+c.dataset.a,b=+c.dataset.b;let o=0;if(p>=a&&p<=b)o=a===0?Math.min(1,(b-p)/.06):Math.min(1,(p-a)/.06,(b-p)/.06);c.style.opacity=o;c.style.transform=`translateY(${(1-o)*30}px)`;c.classList.toggle('on',o>.5);const h=$('.sw',c);if(o>.3&&h)h.classList.add('in')});
    if(eb){const q=Math.min(1,Math.max(0,(p-.1)/.8)),v=E.from+(E.to-E.from)*(1-Math.pow(1-q,3));eb.textContent=E.fmt(v);if(hb)hb.textContent=E.fmt(v)}};
  heroP(0);setTimeout(()=>{const h=$('.cap .sw',hero);h&&h.classList.add('in')},came?900:300)}

/* ---- GSAP layer ---- */
const boot=()=>{if(!(window.gsap&&window.ScrollTrigger&&window.Lenis))return setTimeout(boot,60);
  gsap.registerPlugin(ScrollTrigger);
  const lenis=new Lenis({lerp:.085,smoothWheel:true});window.__lenis=lenis;lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=$(a.getAttribute('href'));if(t){e.preventDefault();lenis.scrollTo(t,{duration:1.6})}}));
  if(RM){mw.forEach(s=>s.classList.add('on'));return}
  if(hero)ScrollTrigger.create({trigger:hero,start:'top top',end:'bottom bottom',onUpdate:s=>heroP(s.progress)});
  if(man)ScrollTrigger.create({trigger:man,start:'top 80%',end:'bottom 45%',onUpdate:s=>{const n=Math.round(s.progress*mw.length);mw.forEach((w,i)=>w.classList.toggle('on',i<n))}});
  $$('[data-par]').forEach(el=>gsap.fromTo(el,{y:()=>+el.dataset.par*innerHeight*.5},{y:()=>-el.dataset.par*innerHeight*.5,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:true}}));
  $$('.chap').forEach(ch=>{const bg=$('.bgi',ch),cr=$('.cr',ch),num=$('.num',ch);bg&&gsap.fromTo(bg,{yPercent:-6,scale:1.12},{yPercent:6,scale:1,ease:'none',scrollTrigger:{trigger:ch,start:'top bottom',end:'bottom top',scrub:true}});
    cr&&!mob()&&gsap.fromTo(cr,{x:120,opacity:0},{x:0,opacity:1,ease:'power2.out',scrollTrigger:{trigger:ch,start:'top 70%',end:'top 10%',scrub:.6}});
    num&&gsap.fromTo(num,{yPercent:30},{yPercent:-30,ease:'none',scrollTrigger:{trigger:ch,start:'top bottom',end:'bottom top',scrub:true}})});
  $$('.sp,.ev').forEach((c,i)=>gsap.from(c,{y:80,opacity:0,duration:1,ease:'power3.out',delay:(i%3)*.08,scrollTrigger:{trigger:c,start:'top 92%'}}));
  /* the AI jungle story */
  const story=$('#story');if(story){const items=$$('[data-a]',story),bg=$('.sbg',story),pr=$('.sprog i',story);
    const upd=p=>{pr.style.transform=`scaleX(${p})`;bg.style.transform=`scale(${1.1-p*.08}) translateX(${-p*3}%)`;
      items.forEach(el=>{const a=+el.dataset.a,b=+el.dataset.b;let o=0;if(p>=a&&p<=b)o=Math.min(1,(p-a)/.04,(b-p)/.04);if(a===0)o=Math.min(1,(b-p)/.04);
        const k=(p-a)/(b-a);el.style.opacity=o;if(el.classList.contains('sb'))el.style.marginTop=`${(1-o)*40}px`;else el.style.transform=`${el.classList.contains('six')&&innerWidth<900?'translateX(50%) ':''}translateY(${(1-o)*60}px) scale(${.94+o*.06+k*.04})`})};
    ScrollTrigger.create({trigger:story,start:'top top',end:'bottom bottom',onUpdate:s=>upd(s.progress)});upd(0)}
  /* morph */
  const ui=$('#ui');if(ui){const steps=$$('#mSteps span'),scan=$('#scan');
    ScrollTrigger.create({trigger:'#morph',start:'top 75%',end:'bottom 25%',onUpdate:s=>{const p=Math.min(1,Math.max(0,(s.progress-.1)/.7));ui.style.clipPath=`inset(0 ${(1-p)*100}% 0 0)`;scan.style.left=`${p*100}%`;scan.style.opacity=p>0&&p<1?1:0;steps.forEach((e,i)=>e.classList.toggle('on',i===(p<.35?0:p<.97?1:2)))}})}
  if(tpre)ScrollTrigger.create({trigger:'.term',start:'top 80%',end:'bottom 45%',onUpdate:s=>term(s.progress)});
  /* velocity */
  const row=$('#velRow');if(row){let vx=0,vel=0;ScrollTrigger.create({onUpdate:s=>{vel=s.getVelocity()}});
    gsap.ticker.add(()=>{vx-=1.1+Math.min(20,Math.abs(vel)/200);vel*=.9;const w=row.scrollWidth/2;if(-vx>w)vx+=w;row.style.transform=`translateX(${vx}px) skewX(${Math.max(-14,Math.min(14,-vel/260))}deg)`})}
  /* products: art floats in */
  $$('.prod').forEach(pr=>{const a=$('.art',pr);a&&gsap.fromTo(a,{y:120,rotate:-6,opacity:0},{y:0,rotate:0,opacity:1,ease:'power3.out',scrollTrigger:{trigger:pr,start:'top 75%',end:'top 15%',scrub:.7}});
    const n=$('.big-n',pr);n&&gsap.fromTo(n,{yPercent:30},{yPercent:-20,ease:'none',scrollTrigger:{trigger:pr,start:'top bottom',end:'bottom top',scrub:true}})});
  /* next era */
  $$('.next b').forEach(b=>gsap.fromTo(b,{letterSpacing:'.08em',opacity:.3},{letterSpacing:'-.05em',opacity:1,ease:'none',scrollTrigger:{trigger:b,start:'top bottom',end:'top 40%',scrub:true}}));
  const mega=$('#mega');mega&&gsap.fromTo(mega,{'--fill':'0%'},{'--fill':'100%',ease:'none',scrollTrigger:{trigger:'footer',start:'top 95%',end:'bottom bottom',scrub:true}});
  /* gauge */
  const gY=$('#gYr'),gE=$('#gEra'),gtk=$('.gauge .tk');if(gtk){ScrollTrigger.create({start:0,end:'max',onUpdate:s=>{gtk.style.backgroundPositionY=(s.progress*-1600)+'px'}});
    $$('[data-g]').forEach(sec=>ScrollTrigger.create({trigger:sec,start:'top 50%',end:'bottom 50%',onToggle:st=>{if(!st.isActive)return;const[a,b]=sec.dataset.g.split('|');gY.textContent=a;gE.textContent=b}}))}
  addEventListener('load',()=>ScrollTrigger.refresh());setTimeout(()=>ScrollTrigger.refresh(),800);
};boot();
})();

/* the gauge reading repeats the hero counter, so it waits until the hero scrolls away (keeps it off SIX) */
(function(){const h=document.documentElement,f=()=>h.classList.toggle('at-hero',scrollY<innerHeight*.55);f();let st;addEventListener('scroll',()=>{f();h.classList.add('scrolling');clearTimeout(st);st=setTimeout(()=>h.classList.remove('scrolling'),1100)},{passive:true});addEventListener('resize',f)})();
