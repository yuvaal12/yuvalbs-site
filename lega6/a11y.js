/* Floating WhatsApp, back-to-top and a small accessibility menu (text size, contrast, links, font, cursor, motion, spacing). */
(()=>{const root=document.documentElement,w=document.getElementById('a11y');
 const top=document.getElementById('totop');if(top){const f=()=>top.classList.toggle('on',scrollY>innerHeight*1.2);f();addEventListener('scroll',f,{passive:true});
  top.addEventListener('click',()=>{const L=window.__lenis;if(L&&!root.classList.contains('a-motion')&&Math.abs(L.scroll-scrollY)<8)L.scrollTo(0,{duration:1.4,force:true});else scrollTo({top:0,behavior:root.classList.contains('a-motion')?'auto':'smooth'});const n=document.querySelector('.nav .brand');n&&n.focus({preventScroll:true})})}
 if(!w)return;const p=w.querySelector('.a11y-p'),b=w.querySelector('.a11y-b'),st=document.getElementById('a11yS');
 const K='l6a11y-';const get=k=>{try{return localStorage.getItem(K+k)}catch(e){return null}},set=(k,v)=>{try{v==null?localStorage.removeItem(K+k):localStorage.setItem(K+k,v)}catch(e){}};
 const T=['contrast','invert','gray','links','font','cursor','motion','spacing'];const on={};let fs=+(get('fs')||100);
 const apply=()=>{T.forEach(t=>root.classList.toggle('a-'+t,!!on[t]));
   root.style.filter=[on.contrast?'contrast(1.4)':'',on.invert?'invert(1) hue-rotate(180deg)':'',on.gray?'grayscale(1)':''].filter(Boolean).join(' ');
   document.querySelectorAll('main img,main video,main canvas,.hero canvas').forEach(m=>m.style.filter=on.invert?'invert(1) hue-rotate(180deg)':'');
   root.style.fontSize=fs===100?'':fs+'%';document.querySelectorAll('main').forEach(el=>el.style.zoom=fs===100?'':(fs/100));document.getElementById('a11yFs').textContent=fs+'%';
   if(on.motion)document.querySelectorAll('video').forEach(v=>v.pause());
   p.querySelectorAll('[data-t]').forEach(x=>x.setAttribute('aria-pressed',String(!!on[x.dataset.t])));
   const any=fs!==100||T.some(t=>on[t]);w.classList.toggle('active',any);if(any)w.classList.remove('mini');
   if(window.ScrollTrigger)setTimeout(()=>ScrollTrigger.refresh(),80)};
 T.forEach(t=>on[t]=get(t)==='1');if(get('mini')==='1')w.classList.add('mini');apply();
 const open=v=>{p.hidden=!v;b.setAttribute('aria-expanded',String(v));if(v){w.classList.remove('mini');set('mini',null);p.querySelector('button').focus()}};
 b.addEventListener('click',()=>open(p.hidden));w.querySelector('.a11y-c').addEventListener('click',()=>{open(false);b.focus()});
 w.querySelector('.a11y-x').addEventListener('click',()=>{open(false);w.classList.add('mini');set('mini','1')});
 p.addEventListener('click',e=>{const x=e.target.closest('button');if(!x)return;
  if(x.dataset.t){const t=x.dataset.t;on[t]=!on[t];if(t==='invert'&&on[t])on.contrast=false;if(t==='contrast'&&on[t])on.invert=false;set(t,on[t]?'1':null);apply();return}
  const a=x.dataset.a;if(a==='fs+')fs=Math.min(150,fs+10);else if(a==='fs-')fs=Math.max(90,fs-10);else if(a==='reset'){fs=100;T.forEach(t=>{on[t]=false;set(t,null)})}
  else if(a==='statement'){st.hidden=false;st.querySelector('.a11y-sx').focus();return}
  set('fs',fs===100?null:fs);apply()});
 st.addEventListener('click',e=>{if(e.target===st||e.target.closest('.a11y-sx')){st.hidden=true;b.focus()}});
 addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!st.hidden){st.hidden=true;b.focus()}else if(!p.hidden){open(false);b.focus()}});
 document.addEventListener('click',e=>{if(!p.hidden&&!w.contains(e.target))open(false)});
})();
