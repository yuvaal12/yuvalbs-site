/* CHA·EKI — six tea stations. art(id) returns SVG markup (viewBox 0 0 600 600). */
(function(){
const INK='#1B1A17',PAPER='#F1EADB',SUN='#D9432B';
const S=[
 {id:'uji',n:'01',name:'UJI',pref:'KYOTO',jp:'宇治',tea:'MATCHA',teaJp:'抹茶',c:'#5E7D32',c2:'#3F5A22',bg:'#ECE5CF',
  note:'Stone-ground shade tea',notes:['Umami','Sweet grass','Velvet'],brew:'2 g · 70 ml · 80°C · whisk 15 s',
  he:{tea:'מאצ׳ה',place:'אוג׳י, קיוטו',line:'תה מוצל טחון באבן רחיים. אומאמי, דשא מתוק, קטיפה.'}},
 {id:'shizuoka',n:'02',name:'SHIZUOKA',pref:'SHIZUOKA',jp:'静岡',tea:'SENCHA',teaJp:'煎茶',c:'#2F7A5B',c2:'#2C4A7A',bg:'#D7E4E2',
  note:'Everyday green under Mt Fuji',notes:['Fresh','Grassy','Bright'],brew:'4 g · 200 ml · 75°C · 60 s',
  he:{tea:'סנצ׳ה',place:'שיזואוקה',line:'הירוק היומיומי מתחת להר פוג׳י. רענן, עשבי, בהיר.'}},
 {id:'kyoto',n:'03',name:'KYOTO',pref:'KYOTO',jp:'京都',tea:'HOJICHA',teaJp:'ほうじ茶',c:'#8A4B2A',c2:'#5B2E19',bg:'#EBD8BE',
  note:'Roasted over charcoal',notes:['Toasty','Caramel','Low caffeine'],brew:'4 g · 200 ml · 95°C · 30 s',
  he:{tea:'הוג׳יצ׳ה',place:'קיוטו',line:'תה קלוי על פחמים. קלוי, קרמל, מעט קפאין.'}},
 {id:'yame',n:'04',name:'YAME',pref:'FUKUOKA',jp:'八女',tea:'GYOKURO',teaJp:'玉露',c:'#1F4A3C',c2:'#10261F',bg:'#1F3D35',dark:1,
  note:'Grown three weeks in shade',notes:['Deep umami','Seaweed','Sweet'],brew:'5 g · 60 ml · 55°C · 120 s',
  he:{tea:'גיוקורו',place:'יאמה, פוקואוקה',line:'גדל שלושה שבועות בצל. אומאמי עמוק, אצות, מתיקות.'}},
 {id:'kochi',n:'05',name:'KOCHI',pref:'KOCHI',jp:'高知',tea:'YUZU SENCHA',teaJp:'柚子煎茶',c:'#E2AE1C',c2:'#2C4A7A',bg:'#F3ECD9',
  note:'Green tea with Kochi yuzu peel',notes:['Citrus','Zesty','Clean'],brew:'4 g · 200 ml · 75°C · 60 s',
  he:{tea:'סנצ׳ה יוזו',place:'קוצ׳י',line:'תה ירוק עם קליפת יוזו. הדרי, חי, נקי.'}},
 {id:'yoshino',n:'06',name:'YOSHINO',pref:'NARA',jp:'吉野',tea:'SAKURA',teaJp:'桜茶',c:'#D9788A',c2:'#9C4F5E',bg:'#F6E3E3',
  note:'Spring sencha with cherry blossom',notes:['Floral','Soft','Spring'],brew:'4 g · 200 ml · 75°C · 60 s',
  he:{tea:'סאקורה',place:'יושינו, נארה',line:'סנצ׳ה אביבי עם פריחת דובדבן. פרחוני, רך, אביבי.'}},
];
function rnd(s){return()=>{s=(s*16807)%2147483647;return(s-1)/2147483646}}
function pill(x,y,w,h,f){return`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h/2}" fill="${f}"/>`}
const ART={
uji(){let r='';
 r+=`<rect width="600" height="600" fill="#ECE5CF"/><circle cx="488" cy="104" r="40" fill="${SUN}"/>`;
 r+=`<path d="M-20 470 Q160 400 330 450 T640 430 V600 H-20Z" fill="#9DB36A"/>`;
 r+=`<path d="M-20 500 Q180 440 360 490 T640 470 V600 H-20Z" fill="#5E7D32"/>`;
 for(let i=0;i<4;i++)r+=`<path d="M-20 ${525+i*22} Q200 ${465+i*22} 380 ${515+i*22} T640 ${495+i*22}" fill="none" stroke="#3F5A22" stroke-width="8" stroke-linecap="round"/>`;
 r+=`<ellipse cx="300" cy="462" rx="150" ry="16" fill="#3F5A22" opacity=".55"/>`;
 r+=`<path d="M132 238 L468 238 Q462 400 330 446 L270 446 Q138 400 132 238Z" fill="#3B3A35"/>`;
 r+=`<path d="M132 238 L468 238 Q467 282 458 312 Q300 290 142 312 Q133 282 132 238Z" fill="#7A6F5C"/>`;
 r+=`<path d="M142 312 Q300 290 458 312 L452 330 Q420 318 400 342 Q380 316 350 334 Q320 312 290 336 Q260 314 230 338 Q200 316 170 334 Q156 318 148 330Z" fill="#7A6F5C"/>`;
 r+=`<rect x="250" y="440" width="100" height="16" rx="4" fill="#2B2A26"/>`;
 r+=`<ellipse cx="300" cy="238" rx="168" ry="36" fill="#2B2A26"/><ellipse cx="300" cy="236" rx="156" ry="30" fill="#7FA03A"/><ellipse cx="296" cy="232" rx="118" ry="20" fill="#A9C45E"/>`;
 for(const [x,y,rr] of [[250,230,5],[300,226,4],[338,236,6],[276,240,3],[322,224,3],[360,230,3],[230,236,3]])r+=`<circle cx="${x}" cy="${y}" r="${rr}" fill="#D3E29A"/>`;
 r+=`<rect x="500" y="238" width="16" height="96" rx="5" fill="#C9A86A"/>`;
 r+=`<path d="M478 334 Q470 420 508 446 Q546 420 538 334Z" fill="#E3CF96"/>`;
 for(let k=0;k<7;k++){const x=484+k*8.5;r+=`<path d="M${x} 336 Q${x+(x-508)*.35} 412 ${508+(x-508)*.5} 444" fill="none" stroke="#B89656" stroke-width="2.5"/>`}
 return r},
shizuoka(){let r='';
 r+=`<rect width="600" height="600" fill="#D7E4E2"/><circle cx="104" cy="104" r="40" fill="${SUN}"/>`;
 r+=`<path d="M330 460 L440 330 Q460 318 480 330 L590 460Z" fill="#2C4A7A"/><path d="M440 330 Q460 318 480 330 L500 354 L486 348 L472 362 L458 346 L446 360 L432 348Z" fill="${PAPER}"/>`;
 r+=`<rect x="0" y="456" width="600" height="144" fill="#2F7A5B"/>`;
 for(let row=0;row<4;row++){const y=470+row*32,o=row%2?40:0;for(let x=-60+o;x<620;x+=150)r+=pill(x,y,120,20,row%2?'#4E9A6F':'#1F5C43')}
 r+=`<path d="M300 470 Q296 380 300 290" fill="none" stroke="#1F5C43" stroke-width="14" stroke-linecap="round"/>`;
 r+=`<path d="M296 350 Q180 210 70 270 Q170 400 296 350Z" fill="#3E8E5E"/><path d="M296 350 Q180 300 92 274" fill="none" stroke="#1F5C43" stroke-width="5"/>`;
 r+=`<path d="M304 320 Q430 180 540 236 Q440 370 304 320Z" fill="#5BA672"/><path d="M304 320 Q430 270 518 240" fill="none" stroke="#1F5C43" stroke-width="5"/>`;
 r+=`<path d="M300 300 Q258 180 300 64 Q342 180 300 300Z" fill="#8CC79A"/><path d="M300 296 L300 90" stroke="#3E8E5E" stroke-width="4"/>`;
 return r},
kyoto(){let r='';
 r+=`<rect width="600" height="600" fill="#EBD8BE"/><circle cx="300" cy="270" r="200" fill="#DDBB8E"/>`;
 r+=`<rect x="0" y="452" width="600" height="148" fill="#8A4B2A"/>`;
 r+=`<g transform="translate(452 330) scale(.42)"><path d="M10 28 Q150 48 290 28 L298 8 Q150 30 2 8Z" fill="${INK}"/><rect x="24" y="34" width="252" height="22" fill="${SUN}"/><rect x="40" y="80" width="220" height="16" fill="${SUN}"/><rect x="58" y="34" width="24" height="270" fill="${SUN}"/><rect x="218" y="34" width="24" height="270" fill="${SUN}"/></g>`;
 for(let i=0;i<3;i++)r+=`<path d="M${236+i*44} 176 q-26 -30 0 -60 t0 -60" fill="none" stroke="#8A4B2A" stroke-width="9" stroke-linecap="round" opacity=".55"/>`;
 r+=`<path d="M166 214 L414 214 L392 452 Q290 472 188 452Z" fill="${PAPER}"/><path d="M170 256 L410 256 L407 288 L173 288Z" fill="#8A4B2A"/>`;
 r+=`<ellipse cx="290" cy="214" rx="124" ry="26" fill="#CBBFA8"/><ellipse cx="290" cy="216" rx="110" ry="20" fill="#9C5A2E"/><ellipse cx="270" cy="212" rx="40" ry="6" fill="#C98A55" opacity=".7"/>`;
 for(const [x,y,rot] of [[110,500,-20],[150,540,30],[470,540,15],[520,505,-35],[90,560,60]])r+=`<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-24 0 Q0 -16 24 0 Q0 14 -24 0Z" fill="#5B2E19"/><path d="M-20 0 L20 0" stroke="#3A1C0E" stroke-width="2"/></g>`;
 return r},
yame(){let r='';
 r+=`<rect width="600" height="600" fill="#1F3D35"/><circle cx="492" cy="96" r="34" fill="${PAPER}"/>`;
 r+=`<defs><pattern id="ymn" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="16" height="16" fill="#0F221C"/><rect width="7" height="16" fill="#3F7A5E"/></pattern>
 <linearGradient id="ymd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B6F0CF"/><stop offset=".55" stop-color="#5FBF92"/><stop offset="1" stop-color="#1F7A57"/></linearGradient></defs>`;
 r+=`<rect x="0" y="470" width="600" height="130" fill="url(#ymn)"/><rect x="0" y="462" width="600" height="10" fill="${PAPER}"/>`;
 for(const x of [60,220,380,540])r+=`<rect x="${x-4}" y="470" width="8" height="130" fill="${PAPER}" opacity=".85"/>`;
 r+=`<path d="M60 396 Q300 250 550 360 Q300 470 60 396Z" fill="#3F7A5E"/><path d="M60 396 Q300 330 550 360" fill="none" stroke="#2A5A44" stroke-width="7"/>`;
 for(let i=0;i<4;i++){const x=150+i*100;r+=`<path d="M${x} ${374-i*6} q30 -30 60 -26" fill="none" stroke="#2A5A44" stroke-width="4"/>`}
 r+=`<ellipse cx="300" cy="352" rx="70" ry="12" fill="#183A2D" opacity=".6"/>`;
 r+=`<path d="M300 84 Q372 210 374 268 A74 74 0 1 1 226 268 Q228 210 300 84Z" fill="url(#ymd)"/>`;
 r+=`<ellipse cx="270" cy="250" rx="16" ry="34" fill="#fff" opacity=".7" transform="rotate(18 270 250)"/><circle cx="330" cy="310" r="8" fill="#fff" opacity=".45"/>`;
 return r},
kochi(){let r='';
 r+=`<rect width="600" height="600" fill="#F3ECD9"/>`;
 r+=`<defs><pattern id="kws" width="80" height="40" patternUnits="userSpaceOnUse">${[0,1].map(k=>[38,28,18,8].map((rr,i)=>`<circle cx="${k*40+(k?0:40)}" cy="${k?40:40}" r="${rr}" fill="${i%2?'#F3ECD9':'#2C4A7A'}"/>`).join('')).join('')}</pattern></defs>`;
 r+=`<rect x="0" y="400" width="600" height="200" fill="url(#kws)"/>`;
 r+=`<circle cx="300" cy="250" r="170" fill="#E2AE1C"/><circle cx="300" cy="250" r="138" fill="#F2C94C"/>`;
 for(let i=0;i<10;i++){const a=i*Math.PI/5;r+=`<line x1="300" y1="250" x2="${300+Math.cos(a)*130}" y2="${250+Math.sin(a)*130}" stroke="#F7E2A0" stroke-width="7"/>`}
 r+=`<circle cx="300" cy="250" r="18" fill="#F7E2A0"/>`;
 r+=`<rect x="296" y="62" width="10" height="26" rx="4" fill="#3F5A22"/><path d="M304 70 Q380 10 450 36 Q390 100 304 70Z" fill="#5E7D32"/>`;
 return r},
yoshino(){let r='',R=rnd(7);
 r+=`<rect width="600" height="600" fill="#F6E3E3"/><circle cx="500" cy="92" r="36" fill="${SUN}"/>`;
 r+=`<path d="M-20 500 Q140 400 300 470 Q440 390 640 470 V600 H-20Z" fill="#C98A93"/>`;
 r+=`<path d="M-20 540 Q200 470 420 530 Q520 500 640 520 V600 H-20Z" fill="#9C4F5E"/>`;
 for(let i=0;i<60;i++){const x=R()*600,y=470+R()*130;r+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(4+R()*7).toFixed(0)}" fill="${R()>.4?'#F2B8C1':'#FFF3F4'}"/>`}
 const pet=`<path d="M0 0 C-74 -40 -92 -150 -30 -186 L0 -158 L30 -186 C92 -150 74 -40 0 0Z"/>`;
 r+=`<g transform="translate(300 262)">`;
 for(let k=0;k<5;k++)r+=`<g transform="rotate(${k*72})" fill="#F2B8C1">${pet}</g>`;
 for(let k=0;k<5;k++)r+=`<g transform="rotate(${k*72}) scale(.55)" fill="#E79AA6">${pet}</g>`;
 r+=`<circle r="34" fill="#D9788A"/>`;
 for(let k=0;k<10;k++){const a=k*36*Math.PI/180;r+=`<line x1="0" y1="0" x2="${(Math.cos(a)*62).toFixed(1)}" y2="${(Math.sin(a)*62).toFixed(1)}" stroke="#9C4F5E" stroke-width="3"/><circle cx="${(Math.cos(a)*64).toFixed(1)}" cy="${(Math.sin(a)*64).toFixed(1)}" r="6" fill="#F2C94C"/>`}
 r+=`</g>`;
 return r}
};
function art(id){return ART[id]()}
const API={S,art,INK,PAPER,SUN};
if(typeof module!=='undefined')module.exports=API;else window.CHAEKI=API;
})();
