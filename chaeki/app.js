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

/* hero rail */
$('#heroSegs').innerHTML=S.map((s,k)=>k?`<i style="background:${col(s)}"></i>`:'').join('');
$('#heroSt').innerHTML=S.map((s,k)=>`<div class="s" style="left:${pos(k)*100}%"><i></i><span class="jp" lang="ja">${s.jp}</span><small>${s.name}</small></div>`).join('');
const ht=$('#heroTrain');ht.innerHTML=train();
const railW=()=>$('#heroSt').offsetWidth;
gsap.from('#heroSegs',{scaleX:0,duration:RM?0:1.6,ease:'power3.inOut',delay:.2});
gsap.from('#heroSt .s',{y:20,opacity:0,stagger:.08,duration:.6,delay:.6});
gsap.from('.hero .w',{yPercent:110,opacity:0,stagger:.12,duration:1,ease:'power4.out'});
gsap.from('.hero-jp',{opacity:0,y:40,duration:1.2,delay:.3});
ScrollTrigger.create({trigger:'.hero',start:'top top',end:'bottom top',onUpdate:s=>{gsap.set(ht,{x:s.progress*railW()*1.0})}});

/* the line */
const stage=$('#stage'),st=$('.line-st');
stage.innerHTML=S.map((s,k)=>`<article class="sp" data-k="${k}" aria-label="Station ${s.n}: ${s.tea}">
 <div class="tx"><div class="num">${s.n}</div>
  <div class="place"><span class="jp" lang="ja">${s.jp}</span><span class="mono">${s.name===s.pref?s.name+' Pref.':s.name+' · '+s.pref}</span></div>
  <h3 class="tea"><span class="jp" lang="ja">${s.teaJp}</span>${s.tea}</h3>
  <p class="note">${s.note}. ${s.notes.join(', ')}.</p>
  <div class="ticket">${s.brew.split('·').map((b,j)=>`<div>${['Leaf','Water','Temp','Time'][j]||''}<b>${b.trim()}</b></div>`).join('')}</div></div>
 <div class="vis"><div class="art"><svg viewBox="0 0 600 600" role="img" aria-label="${s.name} landscape">${CHAEKI.art(s.id)}</svg></div><img class="pouch" src="i/pouch_${s.id}.webp" alt="${s.tea} pouch" loading="lazy" width="626" height="900"></div></article>`).join('');
const sps=$$('.sp',stage);
$('#routeDots').innerHTML=S.map((s,k)=>`<i class="d" style="left:${pos(k)*100}%"><span>${s.n} ${s.name}</span></i>`).join('');
const dots=$$('#route .d'),lt=$('#lineTrain');
const nav=$('#nav');let lineOn=false;
function lerpC(a,b,t){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const A=p(a),B=p(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
function upd(p){
 const f=Math.min(5,Math.max(0,p*6-.5)),k=Math.round(f),fr=f-Math.floor(f);
 const a=S[Math.floor(f)],b=S[Math.min(5,Math.floor(f)+1)];
 const tb=Math.max(0,Math.min(1,(fr-.35)/.3));
 const bg=lerpC(col(a),col(b),tb);st.style.backgroundColor=bg;st.style.setProperty('--c',bg);
 const tc=tb<.5?txt(a):txt(b);st.style.color=tc;
 sps.forEach((el,j)=>{const d=f-j;const o=Math.max(0,Math.min(1,(.5-Math.abs(d))/.18));el.style.opacity=o;el.classList.toggle('on',o>0);
  if(o>0){const art=$('.art',el),pou=$('.pouch',el),tx=$('.tx',el);gsap.set(art,{scale:1.04-d*.05,y:d*-30});gsap.set(pou,{y:d*-120,rotate:6+d*8});gsap.set(tx,{y:d*-60})}});
 dots.forEach((d,j)=>d.classList.toggle('on',j<=k));
 const r=f/5;$('#routeOn').style.transform=`scaleX(${r})`;gsap.set(lt,{x:r*$('#route').offsetWidth-42});
 lt.innerHTML=train(tc,bg);
 if(lineOn){nav.style.setProperty('--nt',tc);nav.style.setProperty('--nb',bg)}
}
ScrollTrigger.create({trigger:'#line',start:'top top',end:'bottom bottom',onUpdate:s=>upd(s.progress),onToggle:s=>{lineOn=s.isActive;if(!s.isActive){nav.style.removeProperty('--nt');nav.style.removeProperty('--nb')}}});
upd(0);

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
$$('.mani-t,.shop .wrap,.gift-in>*,.rv').forEach(el=>{el.classList.add('rv');gsap.to(el,{opacity:1,y:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%'}})});
ScrollTrigger.create({start:80,onUpdate:s=>nav.classList.toggle('solid',s.scroll()>80)});
addEventListener('load',()=>ScrollTrigger.refresh());
})();
