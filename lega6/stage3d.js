/* LEGA6 hero stage: a real 3D scene (three.js) — bright plate, drifting mist, SIX as a transparent video, leaves bending in the wind, light motes. */
(function(){
const P=window.PAGE||{},S=P.stage;const host=document.querySelector('.hero .st');
if(!S||!host||!window.THREE)return;
let gl;try{const c=document.createElement('canvas');gl=c.getContext('webgl')||c.getContext('experimental-webgl')}catch(e){}
if(!gl)return;
const T=THREE,mob=()=>innerWidth<=900,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const R=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
R.setPixelRatio(Math.min(devicePixelRatio,1.6));R.setClearColor(new T.Color(S.sky||'#EAF1EE'));
R.domElement.className='stage';host.insertBefore(R.domElement,host.firstChild);host.classList.add('gl');
const scene=new T.Scene(),cam=new T.PerspectiveCamera(36,1,.1,200);
const TL=new T.TextureLoader();const U={t:{value:0}};
const tex=(src,cb)=>TL.load(src,t=>{t.minFilter=T.LinearMipmapLinearFilter;t.anisotropy=4;cb&&cb(t)});
const fh=z=>2*Math.tan(T.MathUtils.degToRad(cam.fov/2))*Math.abs(z); // frustum height at distance

/* ---------- background plate ---------- */
const bgM=new T.ShaderMaterial({uniforms:{m:{value:null},a:{value:1.7},k:{value:0},t:U.t},depthWrite:false,
 vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'uniform sampler2D m;uniform float a,k,t;varying vec2 v;void main(){vec2 q=v-.5;float s=1.-k*.06;q*=s;q.x*=1.;vec2 u=q+.5;u.x+=sin(t*.05)*.006;vec4 c=texture2D(m,u);gl_FragColor=vec4(mix(c.rgb,vec3(.95,.97,.96),.06),1.);}'});
const BGZ=-60;const bg=new T.Mesh(new T.PlaneGeometry(1,1),bgM);bg.position.z=BGZ;bg.renderOrder=-1;scene.add(bg);
tex(mob()?S.bg.replace('.webp','_s.webp'):S.bg,t=>{bgM.uniforms.m.value=t;bgM.uniforms.a.value=t.image.width/t.image.height;fit()});

/* ---------- mist (procedural, drifting) ---------- */
const NOISE='float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}float fb(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*n(p);p*=2.03;a*=.5;}return s;}';
const mists=[];
[[-44,.22,.9],[-30,.14,.7],[-12,.07,.55]].forEach(([z,op,sp],i)=>{
 const m=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{t:U.t,o:{value:op},s:{value:sp},sd:{value:i*7.3},tint:{value:new T.Color(S.mist||'#FFFFFF')}},
  vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:NOISE+'uniform float t,o,s,sd;uniform vec3 tint;varying vec2 v;void main(){vec2 p=v*vec2(3.,1.6)+vec2(t*.018*s+sd,sd*.3);float f=fb(p+fb(p*1.7+t*.01));float band=smoothstep(.0,.45,v.y)*smoothstep(1.,.55,v.y);float a=smoothstep(.42,.85,f)*band*o;gl_FragColor=vec4(tint,a);}'});
 const me=new T.Mesh(new T.PlaneGeometry(1,1),m);me.position.z=z;me.userData.z=z;me.renderOrder=z>-16?5:1;scene.add(me);mists.push(me)});

/* ---------- SIX: stacked-alpha video (colour on top half, matte on bottom half) ---------- */
const sixM=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{m:{value:null},st:{value:null},mode:{value:0},glow:{value:0},op:{value:document.documentElement.classList.contains('intro-on')?0:1},t:U.t},
 vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'uniform sampler2D m,st;uniform float mode,glow,t,op;varying vec2 v;void main(){vec4 c;if(mode>.5){vec3 col=texture2D(m,vec2(v.x,.5+v.y*.5)).rgb;float a=texture2D(m,vec2(v.x,v.y*.5)).r;a=smoothstep(.08,.92,a);c=vec4(col,a);}else{c=texture2D(st,v);}float e=op*1.25;float band=smoothstep(e-.12,e,v.y);c.a*=1.-band;c.rgb=mix(c.rgb,vec3(.35,.55,1.),smoothstep(e-.12,e-.02,v.y)*(1.-band)*step(op,.999));if(c.a<.01)discard;gl_FragColor=c;}'});
const SIXZ=-16;const six=new T.Mesh(new T.PlaneGeometry(1,1),sixM);six.position.z=SIXZ;six.renderOrder=4;scene.add(six);
let sixA=S.sixAspect||1;
if(S.still)tex(S.still,t=>{sixM.uniforms.st.value=t;if(!sixM.uniforms.mode.value){sixA=t.image.width/t.image.height;fit()}});
/* soft contact shadow under SIX */
const shM=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'varying vec2 v;void main(){float d=length((v-.5)*vec2(1.,2.6));gl_FragColor=vec4(.05,.12,.09,smoothstep(.5,0.,d)*.28);}'});
const shadow=new T.Mesh(new T.PlaneGeometry(1,1),shM);shadow.position.z=SIXZ-.05;shadow.renderOrder=3;scene.add(shadow);
const vid=document.createElement('video');
if(S.six&&!reduce){Object.assign(vid,{muted:true,loop:true,playsInline:true,autoplay:true,crossOrigin:'anonymous',preload:'auto'});vid.setAttribute('playsinline','');vid.setAttribute('muted','');
 vid.src=S.six+(mob()?'_m':'')+'.mp4';
 vid.addEventListener('loadeddata',()=>{const vt=new T.VideoTexture(vid);vt.minFilter=T.LinearFilter;vt.magFilter=T.LinearFilter;vt.generateMipmaps=false;sixM.uniforms.m.value=vt;sixM.uniforms.mode.value=1;sixA=vid.videoWidth/(vid.videoHeight/2);fit()},{once:true});
 const go=()=>vid.play().catch(()=>{});go();addEventListener('touchstart',go,{once:true,passive:true});addEventListener('pointerdown',go,{once:true})}

/* ---------- leaves: real planes bending in the wind, gusts sweep across, the cursor pushes them ---------- */
const W2={g:{value:-9},mp:{value:new T.Vector2(9,9)},mv:{value:0}};
const leafVS=`uniform float t,g,mv;uniform vec2 mp,sp;attribute vec4 ph;varying vec2 v;varying float d;
void main(){v=uv;vec3 p=position;float k=pow(uv.y,1.5);
float w=sin(t*ph.y+ph.x)*.5+sin(t*ph.y*2.3+ph.x*1.7)*.16+sin(t*.35+ph.x)*.3; w*=ph.z;
float gust=exp(-pow((sp.x-g)*2.2,2.))*1.6;                 // a gust of wind travelling across the screen
float push=exp(-dot(sp-mp,sp-mp)*5.)*mv*2.2;               // cursor brushes the leaves
w+=gust*(.7+.3*sin(t*3.+ph.x))+push;
float fl=sin(t*(7.+gust*6.)+uv.y*9.+ph.x)*(.022+gust*.03)*ph.z*k;
float a=w*.34*k; p.x+= sin(a)*p.y*.9 + fl; p.z+= (1.-cos(a))*p.y*-.6 + sin(t*ph.y*1.3+ph.x)*.16*k*ph.z + gust*.25*k;
vec4 m4=modelViewMatrix*vec4(p,1.);d=-m4.z;gl_Position=projectionMatrix*m4;}`;
const leafFS=`uniform sampler2D m;uniform vec4 r;uniform float blur,dark;uniform vec3 fogc;varying vec2 v;varying float d;
void main(){vec4 c=texture2D(m,r.xy+v*r.zw,blur);if(c.a<.04)discard;
float fog=smoothstep(26.,60.,d)*.18;vec3 col=mix(c.rgb*(1.-dark),fogc,fog);gl_FragColor=vec4(col,c.a);}`;
const leaves=[];
function rnd(s){return function(){s=Math.sin(s)*10000;return s-Math.floor(s)}}
// composed slots: [band, x(-.5..5 of frame width), y(-.5..5 of height), size(of frame height), tilt(deg), giant]
const SLOTS=S.slots||[
 // foreground: giant, soft, frame the screen like a lens through the jungle
 [0,-.56,-.7,.95,32,1],[0,.58,-.66,1.0,-34,1],[0,.56,.78,.85,205,1],[0,-.5,.82,.7,150,1],[0,-.66,-.3,.7,55,1],
 // middle: sharp, big
 [1,-.52,-.48,.62,20,1],[1,.5,-.52,.66,-22,1],[1,.56,.08,.5,-62,1],[1,-.6,-.62,.5,40,1],[1,-.14,.66,.4,190,1],[1,.26,.7,.42,168,1],[1,.42,.62,.36,150,0],[1,-.36,.64,.36,205,0],[1,-.3,-.56,.4,8,0],
 // far: a curtain of jungle behind SIX
 [2,-.42,-.5,.5,12,1],[2,-.18,-.56,.42,-6,0],[2,.06,-.55,.44,4,1],[2,.3,-.52,.48,-10,0],[2,.5,-.4,.5,-20,1],[2,-.5,-.52,.4,26,1],[2,.55,.1,.42,-40,0],[2,-.26,.55,.36,190,0],[2,.2,.58,.34,175,1]];
function buildLeaves(list){const r=rnd(42);const sl=mob()?SLOTS.filter((x,i)=>[0,1,2,5,6,9,10,14,16,18].includes(i)):SLOTS;
 const giants=list.filter(x=>x.giant),small=list.filter(x=>!x.giant);
 sl.forEach((q,i)=>{const pool=(q[5]&&giants.length)?giants:(small.length?small:list);const it=pool[(i*5+2)%pool.length];const band=q[0];
  const z=band==0?-(2.6+r()*1.2):band==1?-(8+r()*3):-(24+r()*6);
  const g=new T.PlaneGeometry(1,1,1,14);g.translate(0,.5,0);
  const ph=new Float32Array(g.attributes.position.count*4);const a=[r()*6.28,.5+r()*.6,band==0?.75:.9+r()*.4,0];
  for(let j=0;j<ph.length;j+=4){ph[j]=a[0];ph[j+1]=a[1];ph[j+2]=a[2];ph[j+3]=0}
  g.setAttribute('ph',new T.BufferAttribute(ph,4));
  const m=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,
   uniforms:{t:U.t,g:W2.g,mp:W2.mp,mv:W2.mv,sp:{value:new T.Vector2(q[1],q[2])},m:{value:it.tex},r:{value:new T.Vector4(it.x,it.y,it.w,it.h)},blur:{value:band==0?3.2:band==1?.3:1.1},dark:{value:band==0?.34:band==1?.04:0},fogc:{value:new T.Color(S.sky||'#EAF1EE')}},
   vertexShader:leafVS,fragmentShader:leafFS});
  const me=new T.Mesh(g,m);me.userData={z,q,ar:it.aspect};me.renderOrder=band==0?10:band==1?6:2;
  scene.add(me);leaves.push(me)});
 fit()}
const LS=[].concat(S.leaves||[]);
Promise.all(LS.map(src=>fetch(src+'.json').then(r=>r.json()).then(L=>new Promise(res=>tex(src+'.webp',t=>res(L.items.map(x=>Object.assign({},x,{tex:t,giant:!!L.giant})))))).catch(()=>[])))
 .then(arr=>{const list=[].concat(...arr);if(list.length)buildLeaves(list)});

/* ---------- light motes ---------- */
const N=mob()?70:160,pg=new T.BufferGeometry(),pp=new Float32Array(N*3),pr=new Float32Array(N);const rr=rnd(7);
for(let i=0;i<N;i++){pp[i*3]=(rr()-.5)*40;pp[i*3+1]=(rr()-.5)*24;pp[i*3+2]=-(3+rr()*40);pr[i]=rr()}
pg.setAttribute('position',new T.BufferAttribute(pp,3));pg.setAttribute('rn',new T.BufferAttribute(pr,1));
const pm=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{t:U.t,px:{value:1},c1:{value:new T.Color(S.mote||'#2F5BFF')}},
 vertexShader:'uniform float t,px;attribute float rn;varying float f;void main(){vec3 p=position;p.y+=mod(t*(.15+rn*.25)+rn*30.,24.)-12.;p.x+=sin(t*.4+rn*20.)*.6;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=px*(2.+rn*5.)*(18./-mv.z);f=.35+.65*sin(t*1.5+rn*40.)*.5+.5;}',
 fragmentShader:'uniform vec3 c1;varying float f;void main(){float d=length(gl_PointCoord-.5);gl_FragColor=vec4(c1,smoothstep(.5,0.,d)*.55*f);}'});
scene.add(new T.Points(pg,pm));

/* ---------- layout ---------- */
let W=1,H=1;
function fit(){W=host.clientWidth;H=host.clientHeight;R.setSize(W,H,false);cam.aspect=W/H;cam.updateProjectionMatrix();pm.uniforms.px.value=R.getPixelRatio()*(H/900);
 const aspect=W/H;
 const bh=fh(BGZ)*1.18,ba=bgM.uniforms.a.value;let bw=bh*ba;if(bw<bh*aspect*1.18){bw=bh*aspect*1.18}bg.scale.set(bw,bw/ba,1);
 mists.forEach(me=>{const h=fh(me.userData.z);me.scale.set(h*aspect*1.6,h*.9,1);me.position.y=-h*.12});
 const hS=fh(SIXZ),m=mob(),bot=S.anchor=='bottom';let sh=hS*(m?(bot?.5:.34):(bot?.74:.58));if(sh*sixA>hS*aspect*(m?.95:.52))sh=hS*aspect*(m?.95:.52)/sixA;six.scale.set(sh*sixA,sh,1);
 six.position.x=m?0:(document.documentElement.dir==='rtl'?-1:1)*hS*aspect*((S.sixX!=null?S.sixX:.17)+(innerWidth<1200?.07:innerWidth<1360?.06:innerWidth<1500?.03:0));six.position.y=m?(bot?hS*.42:hS*.36)-sh*.5:(bot?-hS*.5+sh*.5:-hS*.5+hS*.1+sh*.5);
 shadow.visible=!bot;shadow.scale.set(sh*sixA*.8,sh*.12,1);shadow.position.set(six.position.x,six.position.y-sh*.47,SIXZ-.05);
 leaves.forEach(me=>{const u=me.userData,q=u.q,h=fh(u.z),w=h*aspect,s=h*q[3]*(m?.8:1);me.scale.set(s*u.ar,s,1);
  const rl=!m&&document.documentElement.dir==='rtl'?-1:1;me.position.set(rl*q[1]*w*(m?.9:1),q[2]*h,u.z);me.rotation.z=rl*T.MathUtils.degToRad(q[4])})}
addEventListener('resize',fit);fit();

/* ---------- motion ---------- */
let mx=0,my=0,tx=0,ty=0,prog=0,pc=0,vis=true;
let lx=0,ly=0,vel=0;addEventListener('pointermove',e=>{const nx=e.clientX/innerWidth-.5,ny=e.clientY/innerHeight-.5;vel=Math.min(1,vel+Math.hypot(nx-lx,ny-ly)*6);lx=nx;ly=ny;tx=nx;ty=ny;W2.mp.value.set(nx,-ny)},{passive:true});
new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis)loop();else vid.pause&&vid.pause();if(vis&&vid.src)vid.play().catch(()=>{})}).observe(host);
window.L6stage={set:p=>{prog=p},reveal:()=>{const o=sixM.uniforms.op;if(o.value>=1)return;const t1=performance.now();(function a(){const k=Math.min(1,(performance.now()-t1)/900);o.value=1-Math.pow(1-k,3);if(k<1)requestAnimationFrame(a)})()}};
if(sixM.uniforms.op.value<1)setTimeout(()=>L6stage.reveal(),7000);
const t0=performance.now();let raf=0,fr=0;const coord=host.querySelector('.hud .coord'),hud=host.querySelector('.hud');
function loop(){cancelAnimationFrame(raf);if(!vis)return;raf=requestAnimationFrame(loop);
 U.t.value=reduce?0:(performance.now()-t0)/1000;mx+=(tx-mx)*.05;my+=(ty-my)*.05;pc+=(prog-pc)*.08;
 cam.position.set(mx*1.4,-my*.8+pc*.6,-pc*7);cam.lookAt(mx*.3,pc*.2,-30);
 bgM.uniforms.k.value=pc;vel*=.94;W2.mv.value+=(vel-W2.mv.value)*.15;const tt=U.t.value;W2.g.value=((tt*.11)%2.4)*1.7-2.2;
 const hp=new T.Vector3(six.position.x+six.scale.x*.04,six.position.y+six.scale.y*.26,SIXZ).project(cam);host.style.setProperty('--hx',((hp.x*.5+.5)*W).toFixed(1)+'px');host.style.setProperty('--hy',((-hp.y*.5+.5)*H).toFixed(1)+'px');
 {const tp=new T.Vector3(six.position.x+six.scale.x*.04,six.position.y+six.scale.y*.5,SIXZ).project(cam),ay=(-hp.y*.5+.5)*H,ty=(-tp.y*.5+.5)*H;let hl=Math.max(56,ay-ty+26);if(ay-hl-58<92)hl=Math.max(40,ay-150);host.style.setProperty('--hl',hl.toFixed(0)+'px');if(hud&&(fr%10==0))hud.classList.toggle('flip',(hp.x*.5+.5)*W+hud.querySelector('.box').offsetWidth+40>W)}
 if(coord&&(++fr%6==0))coord.textContent='LAT '+(mx*2+.5).toFixed(3)+' · LON '+(my*2+.5).toFixed(3)+' · Z '+(16+pc*7).toFixed(1)+'m';
 R.render(scene,cam)}
loop();
})();
