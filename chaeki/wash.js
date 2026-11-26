/* matcha-wash page transition */
(function(){const w=document.getElementById('wash');if(!w)return;
 w.innerHTML='<span class="jp">茶</span>';
 requestAnimationFrame(()=>requestAnimationFrame(()=>w.classList.remove('in')));
 addEventListener('pageshow',e=>{if(e.persisted)w.classList.remove('in','out')});
 document.addEventListener('click',e=>{const a=e.target.closest('a[data-wash],a[href^="tea.html"]');if(!a||e.metaKey||e.ctrlKey||a.target)return;const href=a.getAttribute('href');
  const same=href.startsWith('index.html#')&&!document.body.classList.contains('tea-page');if(same)return;
  e.preventDefault();w.style.setProperty('--x',e.clientX+'px');w.style.setProperty('--y',e.clientY+'px');w.classList.add('out');setTimeout(()=>location.href=href,720)});
})();
