/* ARETZ — a north-to-south trail where the landscape is made of the tastes we grew up on. */
const ST=[
 {id:'hermon',n:'01',name:'החרמון',en:'HERMON',pack:'cottage',brand:'קוטג׳',geo:'33.30° N · 35.77° E',line:'השלג הכי לבן בארץ',copy:'הפסגה מתכסה בפתיתים רכים, הרכבל עולה לאט והגולשים מחליקים במורד. כל ישראלי יודע מה יש למעלה.',tag:'שלג רך · 5%',c:'#2f5fb3',ink:'#0f1a2e'},
 {id:'telaviv',n:'02',name:'תל אביב',en:'TEL AVIV',pack:'tapuchips',brand:'תפוצ׳יפס',geo:'32.08° N · 34.77° E',line:'גלים שמתפצפצים',copy:'שקיעה על הטיילת, המציל במגדל והגלים נשברים פריכים על החול. ים של קיץ, בטעם טבעי.',tag:'גלים · בטעם טבעי',c:'#d9282f',ink:'#2a0d0b'},
 {id:'eingedi',n:'03',name:'עין גדי',en:'EIN GEDI',pack:'eingedi',brand:'עין גדי',geo:'31.46° N · 35.39° E',line:'המים של המדבר',copy:'מפל קטן בתוך קניון צהוב, יעלים על המדפים ובריכה צלולה שאפשר לראות בה כל אבן.',tag:'מעיין · מים מינרליים',c:'#1f6fb8',ink:'#08243a'},
 {id:'deadsea',n:'04',name:'ים המלח',en:'DEAD SEA',pack:'krayot',brand:'כריות',geo:'31.50° N · 35.47° E',line:'לצוף על כריות',copy:'במקום הנמוך בעולם לא צריך לדעת לשחות. נשכבים על כרית זהובה, והשוקולד נוזל מבפנים.',tag:'מלח · נוגט',c:'#3b3fae',ink:'#14163d'},
 {id:'ramon',n:'05',name:'מכתש רמון',en:'MAKHTESH RAMON',pack:'bamba',brand:'במבה',geo:'30.61° N · 34.80° E',line:'המכתש מתמלא',copy:'מהשפה של המכתש רואים את הגבעות הזהובות פזורות על הקרקעית. חטיף בוטנים בגודל של סלע.',tag:'דיונות · בוטנים',c:'#e0731b',ink:'#3a1a05'},
 {id:'yotvata',n:'06',name:'יטבתה',en:'YOTVATA',pack:'shoko',brand:'שוקו',geo:'29.90° N · 35.06° E',line:'נהר של שוקו',copy:'עם שחר בערבה, בין הדיונות ושורת הדקלים של הקיבוץ, זורם נהר חום ומתוק. הטרקטור כבר בעבודה.',tag:'ערבה · חלב עם קקאו',c:'#7a4a2b',ink:'#2b170b'},
 {id:'timna',n:'07',name:'תמנע',en:'TIMNA',pack:'bissli',brand:'ביסלי',geo:'29.79° N · 34.99° E',line:'עמודים מסולסלים',copy:'עמודי הסלע של תמנע מתפתלים לשמיים בכתום של גריל. המטיילים קטנים, הטעם גדול.',tag:'סלעים · גריל',c:'#e85d12',ink:'#3a1405'},
 {id:'eilat',n:'08',name:'אילת',en:'EILAT',pack:'ketchup',brand:'קטשופ',geo:'29.56° N · 34.95° E',line:'הים האדום. באמת אדום.',copy:'בשקיעה ההרים מאדימים, והים מבריק ועבה. מתחת לפני המים, שונית אלמוגים כמו תמיד.',tag:'שונית · עגבניות',c:'#c8191f',ink:'#3a0607'}
];
const $=s=>document.querySelector(s);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* hero strips */
$('#strips').innerHTML=ST.map(s=>`<a href="#st-${s.id}" tabindex="-1" style="--c:${s.c}"><img src="i/${s.id}_s.webp" alt="" loading="eager"><b>${s.name}</b></a>`).join('');

/* stations */
$('#stations').innerHTML=ST.map((s,i)=>`
<section class="st" id="st-${s.id}" style="--c:${s.c};--ink:${s.ink}" aria-label="${s.name}">
  <div class="bg"><img src="i/${s.id}.webp" alt="${s.name} עשוי מ${s.brand}" ${i>1?'loading="lazy"':''}></div>
  <div class="shade" aria-hidden="true"></div>
  <div class="pk"><img src="i/p_${s.pack}.webp" alt="אריזת ${s.brand}" ${i>1?'loading="lazy"':''}></div>
  <div class="txt">
    <p class="mono meta"><span class="num">${s.n}</span><span>/ 08</span><span class="geo">${s.geo}</span></p>
    <h2><span class="nm">${s.name}</span><span class="en mono">${s.en}</span></h2>
    <p class="line">${s.line}</p>
    <p class="copy">${s.copy}</p>
    <p class="tag mono"><i aria-hidden="true"></i>${s.brand} · ${s.tag}</p>
  </div>
  <div class="big" aria-hidden="true">${s.n}</div>
</section>`).join('');

/* trail nav: blaze marks */
$('#trailnav').innerHTML='<div class="tn-line"><i id="tnOn"></i></div>'+ST.map(s=>`<a href="#st-${s.id}" style="--c:${s.c}"><span class="dot"></span><b>${s.name}</b></a>`).join('');

/* outro grid */
$('#grid').innerHTML=ST.map(s=>`<a href="#st-${s.id}" style="--c:${s.c}"><img src="i/${s.id}_s.webp" alt="" loading="lazy"><img class="gp" src="i/p_${s.pack}.webp" alt="" loading="lazy"><span class="mono">${s.n} · ${s.name}</span></a>`).join('');

/* smooth anchor jumps (native snap handles the rest) */
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const t=document.querySelector(a.getAttribute('href'));if(!t)return;e.preventDefault();t.scrollIntoView({behavior:reduce?'auto':'smooth'});history.replaceState(null,'',a.getAttribute('href'))});

/* active station */
const navLinks=[...document.querySelectorAll('#trailnav a')];
const secs=[...document.querySelectorAll('.st')];
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>.55){const i=secs.indexOf(e.target);e.target.classList.add('on');navLinks.forEach((a,j)=>{a.classList.toggle('on',j===i);a.classList.toggle('past',j<i)});document.body.style.setProperty('--accent',ST[i].c);$('#tnOn').style.transform=`scaleY(${i/(ST.length-1)})`}else if(!e.isIntersecting)e.target.classList.remove('on')}),{threshold:[0,.56]});
secs.forEach(s=>io.observe(s));
const heroIO=new IntersectionObserver(([e])=>document.body.classList.toggle('in-hero',e.intersectionRatio>.4),{threshold:[0,.4,1]});heroIO.observe($('.hero'));
const endIO=new IntersectionObserver(([e])=>document.body.classList.toggle('in-end',e.isIntersecting),{threshold:.25});endIO.observe($('#end'));

/* motion */
if(!reduce&&window.gsap){
 gsap.registerPlugin(ScrollTrigger);
 gsap.from('.hero-txt>*',{y:40,opacity:0,duration:1.1,stagger:.08,ease:'power3.out',delay:.15});
 gsap.from('.strips a',{scaleY:0,transformOrigin:'50% 100%',duration:1.2,stagger:.06,ease:'expo.out'});
 secs.forEach(sec=>{
  const bg=sec.querySelector('.bg img'),pk=sec.querySelector('.pk');
  gsap.fromTo(bg,{scale:1.18,yPercent:-4},{scale:1.02,yPercent:4,ease:'none',scrollTrigger:{trigger:sec,start:'top bottom',end:'bottom top',scrub:true}});
  gsap.fromTo(pk,{yPercent:40,rotate:-8},{yPercent:-14,rotate:5,ease:'none',scrollTrigger:{trigger:sec,start:'top bottom',end:'bottom top',scrub:true}});
 });
 /* the pack breathes and follows the pointer a little */
 let mx=0,my=0;addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
 gsap.ticker.add(()=>{const on=document.querySelector('.st.on .pk img');if(on){gsap.set(on,{x:mx*-26,y:my*-18+Math.sin(performance.now()/900)*6,rotateY:mx*14,rotateX:my*-8})}});
}

/* keyboard: arrows move one station */
addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp','PageDown','PageUp'].includes(e.key)||e.target.closest('input,textarea'))return;const all=[$('.hero'),...secs,$('#end')];const y=scrollY+innerHeight*.5;let i=all.findIndex(s=>s.offsetTop<=y&&s.offsetTop+s.offsetHeight>y);if(i<0)return;const d=(e.key==='ArrowDown'||e.key==='PageDown')?1:-1;const t=all[Math.max(0,Math.min(all.length-1,i+d))];e.preventDefault();t.scrollIntoView({behavior:reduce?'auto':'smooth'})});
