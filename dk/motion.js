(function(){
// auto-tag text blocks for entrance motion, staggered in reading order
var SEL='.kick,h1,h2,p.l,.box,.stat,.big,.card,.m';
document.querySelectorAll('section.s').forEach(function(s){
  var d=0.05;
  s.querySelectorAll(SEL).forEach(function(e){
    var p=e.parentElement,skip=false;
    while(p&&p!==s){if(p.matches(SEL)||p.classList.contains('a')||p.classList.contains('p')){skip=true;break}p=p.parentElement}
    if(skip||e.classList.contains('na'))return;
    if(!/\b(a|f|p|gx|gy)\b/.test(e.className))e.classList.add('a');
    if(!e.style.getPropertyValue('--d')){e.style.setProperty('--d',d.toFixed(2)+'s');d=Math.min(d+.12,1.1)}
  });
});
if(!/play/.test(location.search))return;
var S=[].slice.call(document.querySelectorAll('section.s')),i=0;
document.documentElement.classList.add('play');
function fit(){var k=Math.min(innerWidth/1920,innerHeight/1080);S.forEach(function(s){s.style.transform='translate(-50%,-50%) scale('+k+')'})}
var nav=document.createElement('div');nav.className='m-nav';
nav.innerHTML='<button aria-label="next">‹</button><span></span><button aria-label="prev">›</button>';
document.body.appendChild(nav);
var lab=nav.querySelector('span');
function go(n){i=Math.max(0,Math.min(S.length-1,n));S.forEach(function(s,j){s.classList.toggle('cur',j===i);s.classList.remove('on')});void S[i].offsetWidth;S[i].classList.add('on');lab.textContent=(i+1)+' / '+S.length;try{parent.postMessage({deck:i,of:S.length},'*')}catch(e){}}
nav.children[0].onclick=function(){go(i+1)};nav.children[2].onclick=function(){go(i-1)};
addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowUp'||e.key==='PageUp')go(i-1);if(e.key==='ArrowLeft'||e.key==='ArrowDown'||e.key===' '||e.key==='PageDown')go(i+1)});
var x0=null;addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
addEventListener('touchend',function(e){if(x0==null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)go(dx>0?i+1:i-1);x0=null});
document.addEventListener('click',function(e){if(e.target.closest('.m-nav'))return;go(e.clientX<innerWidth/2?i+1:i-1)});
addEventListener('message',function(e){if(e.data&&e.data.go!=null)go(e.data.go)});
addEventListener('resize',fit);fit();go(0);
})();
