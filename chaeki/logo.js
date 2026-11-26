/* CHA·EKI marks */
(function(){
function ring(o={}){const line=o.line||'#5E7D32',ink=o.ink||'#1B1A17',fill=o.fill||'#F1EADB',txt=o.txt||ink;
 return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"${o.w?` width="${o.w}"`:''}><rect x="0" y="45" width="100" height="10" fill="${line}"/><circle cx="50" cy="50" r="34" fill="${fill}" stroke="${ink}" stroke-width="9"/><text x="50" y="63.5" text-anchor="middle" font-family="Noto Sans JP" font-weight="900" font-size="38" fill="${txt}">茶</text></svg>`}
function bowl(o={}){const c=o.c||'#F1EADB',sun=o.sun||'#D9432B';return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M22 54 A28 28 0 0 0 78 54 Z" fill="${c}"/><circle cx="50" cy="31" r="14" fill="${sun}"/><rect x="8" y="49" width="84" height="5" fill="${c}"/></svg>`}
const L={ring,bowl};if(typeof module!=='undefined')module.exports=L;else window.CHAEKI_LOGO=L})();
