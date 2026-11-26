(()=>{
const S=CHAEKI.S,R=CHAEKI_LOGO.ring,$=(q,c=document)=>c.querySelector(q),$$=(q,c=document)=>[...c.querySelectorAll(q)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const col=s=>s.id==='yame'?'#163029':s.c, txt=s=>['kochi','yoshino'].includes(s.id)?'#1B1A17':'#F1EADB';
const pos=k=>k/(S.length-1);
gsap.registerPlugin(ScrollTrigger);

/* rings */
$$('[data-ring]').forEach(el=>{const l=el.dataset.ring==='light';el.innerHTML=R(l?{line:'#D9432B'}:{line:'#D9432B'})});

/* train icon */
const train=(c='#1B1A17',w='#F1EADB')=>`<svg viewBox="0 0 120 44"><rect x="2" y="4" width="116" height="34" rx="17" fill="${c}"/><rect x="2" y="26" width="116" height="5" fill="#D9432B"/>${[22,44,66,88].map(x=>`<rect x="${x}" y="11" width="14" height="10" rx="3" fill="${w}"/>`).join('')}<circle cx="106" cy="16" r="4" fill="#F2C94C"/></svg>`;

/* departure board */
const board=$('#board');let bi=0;
function drawBoard(){board.innerHTML=[0,1,2].map(o=>{const s=S[(bi+o)%6];return`<div class="r${o===0?' on':''}"><b>${s.n}</b><span>${s.name} · ${s.tea}</span><span>${o===0?'Boarding':s.brew.split('·')[2].trim()}</span></div>`}).join('')}
drawBoard();if(!RM)setInterval(()=>{bi=(bi+1)%6;gsap.fromTo('#board .r',{y:14,opacity:0},{y:0,opacity:1,duration:.5,stagger:.06,onStart:drawBoard})},2800);

/* journey */
const nav=$('#nav'),Wd=window.__world,J=$('.journey'),route=$('#route'),lt=$('#lineTrain');
$('#panels').innerHTML=S.map((s,k)=>`<article class="sp" id="st${k+1}" aria-label="Station ${s.n}: ${s.tea}">
 <div class="sp-top"><span class="num">${s.n}</span><span class="place"><span class="jp" lang="ja">${s.jp}</span><span class="mono">${s.name===s.pref?s.name+' Pref.':s.name+' · '+s.pref}</span></span></div>
 <h3 class="tea"><span class="jp" lang="ja">${s.teaJp}</span>${s.tea}</h3>
 <p class="note">${s.note}. ${s.notes.join(', ')}.</p>
 <div class="ticket">${s.brew.split('·').map((b,j)=>`<div>${['Leaf','Water','Temp','Time'][j]||''}<b>${b.trim()}</b></div>`).join('')}</div>
 <img class="pouch" src="i/pouch_${s.id}.webp" alt="${s.tea} pouch" loading="lazy" width="626" height="900"></article>`).join('');
const sps=$$('#panels .sp');
$('#routeDots').innerHTML=S.map((s,k)=>`<i class="d" style="left:${pos(k)*100}%;--dc:${col(s)}"><span><b class="jp" lang="ja">${s.jp}</b> ${s.name}</span></i>`).join('');
const dots=$$('#route .d');
gsap.from('.j-hero .w',{yPercent:110,opacity:0,stagger:.12,duration:1,ease:'power4.out',delay:.2});
gsap.from('.j-hero .lead,.j-hero .btn,.j-hero .eyebrow,.board',{opacity:0,y:20,duration:1,delay:.6,stagger:.08});
const win=k=>{const a=Wd.keys[1+2*k][0],b=Wd.keys[2+2*k][0];return[a-Wd.TR*.16,a,b,b+Wd.TR*.16]};
function jour(p){Wd.set(p);
 const ho=Math.max(0,1-p/.03);gsap.set('.j-hero',{opacity:ho,y:-p*900,pointerEvents:ho>.1?'auto':'none'});gsap.set('.board',{opacity:ho,x:p*600});
 $('#jHint').style.opacity=Math.max(0,1-p/.015);
 let act=-1;sps.forEach((el,k)=>{const [a0,a,b,b0]=win(k);let o=0;if(p>a0&&p<b0)o=p<a?(p-a0)/(a-a0):p>b?(b0-p)/(b0-b):1;o=Math.max(0,Math.min(1,o));
  el.style.opacity=o;el.style.visibility=o>0?'visible':'hidden';el.style.transform=`translateY(${(1-o)*(p<a?40:-40)}px)`;if(o>.5)act=k});
 const z=window.__worldZ||{night:0};J.classList.toggle('night',z.night>.5);
 const u=(p2s(p));dots.forEach((d,j)=>d.classList.toggle('on',j<=u-0.001));
 const r=Math.max(0,Math.min(1,u/5));$('#routeOn').style.transform=`scaleX(${r})`;gsap.set(lt,{x:r*route.offsetWidth-42});
}
function p2s(p){const K=Wd.keys;for(let i=0;i<K.length-1;i++){if(p<=K[i+1][0]){const f=(p-K[i][0])/(K[i+1][0]-K[i][0]||1);return i===0?-1+f:(i%2?(i-1)/2:(i-2)/2+f)}}return 6}
lt.innerHTML=train();
ScrollTrigger.create({trigger:'#line',start:'top top',end:'bottom bottom',onUpdate:s=>jour(s.progress)});jour(0);
$$('a[href="#st1"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const y=J.offsetTop+(Wd.keys[1][0]+Wd.HOLD/2)*(J.offsetHeight-innerHeight);scrollTo({top:y,behavior:'smooth'})}));

/* ceremony bowl */
const bowl=$('#bowl'),NS='http://www.w3.org/2000/svg';
let rnd=7;const rr=()=>(rnd=(rnd*16807)%2147483647,(rnd-1)/2147483646);
let bub='';for(let i=0;i<140;i++){const a=rr()*Math.PI*2,d=Math.sqrt(rr())*200;bub+=`<circle class="bb" cx="${(300+Math.cos(a)*d).toFixed(1)}" cy="${(300+Math.sin(a)*d).toFixed(1)}" r="${(2+rr()*7).toFixed(1)}" fill="#DCE6B8" opacity=".0"/>`}
let fall='';for(let i=0;i<40;i++)fall+=`<circle class="pw" cx="${(240+rr()*120).toFixed(1)}" cy="${(rr()*-200).toFixed(1)}" r="${(2+rr()*3).toFixed(1)}" fill="#7E9B45"/>`;
bowl.innerHTML=`<defs><radialGradient id="foam" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#C5D98A"/><stop offset="1" stop-color="#7F9E3E"/></radialGradient><clipPath id="inner"><circle cx="300" cy="300" r="226"/></clipPath></defs>
<circle cx="300" cy="300" r="262" fill="#CBBFA8"/><circle cx="300" cy="300" r="262" fill="none" stroke="#A89A80" stroke-width="3"/>
<path d="M300 38 A262 262 0 0 1 520 160" fill="none" stroke="#6E8F3A" stroke-width="14" stroke-linecap="round" opacity=".7"/>
<circle cx="300" cy="300" r="228" fill="#2B2A26"/>
<g clip-path="url(#inner)"><circle id="water" cx="300" cy="300" r="0" fill="#B7C98A" opacity=".9"/><circle id="liq" cx="300" cy="300" r="226" fill="#5E7D32" opacity="0"/>
<circle id="mound" cx="300" cy="300" r="0" fill="#7E9B45"/><circle id="foamL" cx="300" cy="300" r="226" fill="url(#foam)" opacity="0"/><g id="bubs">${bub}</g>
<path id="whisk" d="M150 380 L220 220 L300 370 L380 220 L450 380" fill="none" stroke="#E6D9A8" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity="0"/></g>
<g id="fall">${fall}</g>`;
const steps=$$('#steps li');
function cer(q){
 const st=Math.min(3,Math.floor(q*4));steps.forEach((l,i)=>l.classList.toggle('on',i===st));
 const s1=Math.min(1,q/.25),s2=Math.max(0,Math.min(1,(q-.25)/.25)),s3=Math.max(0,Math.min(1,(q-.5)/.25)),s4=Math.max(0,Math.min(1,(q-.75)/.2));
 $$('.pw',bowl).forEach((c,i)=>{const y=-200+((s1*520+i*13)%520);c.setAttribute('transform',`translate(0 ${s1<1&&s1>0?y+200:-400})`)});
 $('#mound').setAttribute('r',(70*s1*(1-s2*.6)).toFixed(1));$('#mound').setAttribute('opacity',1-s3);
 $('#water').setAttribute('r',(226*s2).toFixed(1));
 $('#liq').setAttribute('opacity',(s3*.95).toFixed(2));
 const w=$('#whisk');w.setAttribute('opacity',s3>0&&s4<1?1-s4:0);w.setAttribute('transform',`translate(${Math.sin(q*90)*40} ${Math.cos(q*70)*20})`);
 $('#foamL').setAttribute('opacity',(s4).toFixed(2));
 $$('.bb',bowl).forEach((b,i)=>b.setAttribute('opacity',Math.max(0,Math.min(.9,(s3*1.4+s4)-i/140)).toFixed(2)));
}
ScrollTrigger.create({trigger:'#ceremony',start:'top top',end:'bottom bottom',onUpdate:s=>cer(s.progress)});cer(0);

/* gallery */
const G=window.CHAEKI_PHOTOS||[];
$('#gal').innerHTML=G.map(g=>`<figure class="rv${g.s>=7?' l':''}" style="--s:${g.s}"><img src="i/${g.f}" alt="${g.a}" loading="lazy"><figcaption>${g.t}</figcaption></figure>`).join('');

/* reveals */
$$('.shop .wrap,.gift-in>*,.rv').forEach(el=>{el.classList.add('rv');gsap.to(el,{opacity:1,y:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%'}})});
ScrollTrigger.create({start:80,onUpdate:s=>nav.classList.toggle('solid',s.scroll()>80)});
addEventListener('load',()=>ScrollTrigger.refresh());
})();
