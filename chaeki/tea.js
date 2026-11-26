(()=>{const S=CHAEKI.S,$=(q,c=document)=>c.querySelector(q),$$=(q,c=document)=>[...c.querySelectorAll(q)];
gsap.registerPlugin(ScrollTrigger);$$('[data-ring]').forEach(el=>el.innerHTML=CHAEKI_LOGO.ring({line:'#D9432B',ink:'currentColor',fill:'transparent',txt:'currentColor'}));
const id=new URLSearchParams(location.search).get('t')||'uji';const k=Math.max(0,S.findIndex(s=>s.id===id)),s=S[k],nx=S[(k+1)%6];
const col=s=>s.id==='yame'?'#5FBF92':s.id==='kochi'?'#E2AE1C':s.c;document.documentElement.style.setProperty('--sc',col(s));
const STORY={
 uji:['Tea has grown in the hills around <em>Uji</em> for centuries.','The leaves for matcha are shaded from the sun before picking, then steamed, dried and ground slowly between stones into a powder so fine it floats. You don’t steep it. You whisk it, and drink the whole leaf.'],
 shizuoka:['Shizuoka grows more tea than anywhere else in <em>Japan</em>.','Rows of sencha climb the hills that face Mount Fuji. The young leaves are steamed within hours of picking and rolled into fine green needles. This is the tea Japan drinks every day: fresh, grassy and bright.'],
 kyoto:['Green tea, <em>roasted</em> until it turns the colour of autumn.','Hojicha is roasted over high heat, which turns the leaves reddish-brown and swaps grassiness for toast and caramel. It is gentle and low in caffeine, a Kyoto favourite for the evening.'],
 yame:['Three weeks in the <em>shade</em>, under black nets.','In Yame, Fukuoka, gyokuro fields are covered before the harvest. With less sun the leaves hold on to their sweetness, and the tea becomes deep, rich and full of umami. Brew it cool, in small cups, and slowly.'],
 kochi:['Kochi grows more <em>yuzu</em> than anywhere in Japan.','On the Pacific coast, between the mountains and the sea, the orchards turn yellow every winter. We fold dried yuzu peel into a clean sencha, so every cup tastes of citrus, salt air and sun.'],
 yoshino:['Mount Yoshino blooms with <em>cherry blossom</em> every spring.','For a few weeks a year the hills turn pink. This blend catches that moment: a soft spring sencha with cherry blossom, floral and gentle, made to drink outside.']}[s.id];
const GEO={uji:'34.8844° N · 135.7999° E',shizuoka:'34.9756° N · 138.3828° E',kyoto:'35.0116° N · 135.7681° E',yame:'33.2119° N · 130.5578° E',kochi:'33.5597° N · 133.5311° E',yoshino:'34.3956° N · 135.8578° E'}[s.id];
const PH={uji:'ph_uji.jpg',shizuoka:'ph_shizuoka.jpg',kyoto:'ph_kyoto.jpg',yame:'ph_yame.jpg',kochi:'ph_kochi.jpg',yoshino:'ph_yoshino.jpg'}[s.id];
document.title=`CHA·EKI · ${s.tea} · Station ${s.n}`;$('#navMid').innerHTML=`Station ${s.n} / 06 · <span class="jp">${s.jp}</span>`;
const brew=s.brew.split('·').map(x=>x.trim());
$('#main').innerHTML=`<section class="t-hero"><img src="i/kv_${s.id}.jpg" alt="${s.name} key visual" id="thImg"><div class="t-in"><div><p class="t-no">Station ${s.n} · ${s.name} · <span class="jp">${s.teaJp}</span></p><h1><span class="ln"><span>${s.tea}</span></span></h1><div class="t-meta mono"><span>${GEO}</span><span>${s.pref} Pref.</span><span>${s.note}</span></div></div><div class="t-k jp" lang="ja">${s.jp}</div></div></section>
<section class="t-story"><p class="big">${STORY[0]}</p><p class="body">${STORY[1]}</p></section>
<section class="t-notes" aria-label="Tasting notes">${s.notes.map(n=>`<b>${n}</b>`).join('')}</section>
<section class="t-brew" aria-label="How to brew">${brew.map((b,j)=>`<div><small class="mono">${['Leaf','Water','Temperature','Time'][j]}</small><strong>${b}</strong></div>`).join('')}</section>
<section class="t-pack"><div class="ph"><img src="i/${PH}" alt="${s.tea} pouch photographed" loading="lazy"></div><div class="flat"><img src="i/pouch_${s.id}.webp" alt="${s.tea} pouch design" loading="lazy"></div></section>
<a class="t-next" href="tea.html?t=${nx.id}" data-hover><span class="mono">Next station · ${nx.n} · <span class="jp">${nx.jp}</span></span><b>${nx.tea} →</b><img src="i/kv_${nx.id}.jpg" alt=""></a>`;
const lenis=new Lenis({lerp:.085});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
gsap.from('.t-hero h1 .ln>span',{yPercent:110,duration:1.3,stagger:.1,ease:'expo.out',delay:.5});gsap.from('.t-hero img',{scale:1.25,duration:2.4,ease:'expo.out'});
gsap.to('#thImg',{yPercent:18,ease:'none',scrollTrigger:{trigger:'.t-hero',start:'top top',end:'bottom top',scrub:true}});
$$('.t-story>*,.t-brew div,.t-pack>*').forEach(el=>gsap.from(el,{y:60,opacity:0,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 85%'}}));
$$('.t-notes b').forEach((el,i)=>gsap.from(el,{yPercent:60,opacity:0,duration:1.2,delay:i*.08,ease:'expo.out',scrollTrigger:{trigger:'.t-notes',start:'top 85%'}}));
if(matchMedia('(pointer:fine)').matches){const c=$('#cursor'),ring=$('.c-ring',c),dot=$('.c-dot',c);let x=0,y=0,rx=0,ry=0;addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;dot.style.transform=`translate(${x}px,${y}px)`});gsap.ticker.add(()=>{rx+=(x-rx)*.16;ry+=(y-ry)*.16;ring.style.transform=`translate(${rx}px,${ry}px)`});document.addEventListener('pointerover',e=>c.classList.toggle('hov',!!e.target.closest('a,[data-hover],button')))}else $('#cursor').remove();
})();
