/* CHA·EKI — WebGL scene transitions: a matcha wash spreads across the frame and carries you to the next station. */
(function(){
const T=THREE,cv=document.getElementById('gl');if(!cv)return;
const SC=window.CHAEKI_SCENES||[];
const ren=new T.WebGLRenderer({canvas:cv,antialias:false,alpha:false,powerPreference:'high-performance'});
const DPR=Math.min(devicePixelRatio,1.75);ren.setPixelRatio(DPR);
const scene=new T.Scene(),cam=new T.OrthographicCamera(-1,1,1,-1,0,1);
const loader=new T.TextureLoader();
const tex=SC.map((s,j)=>{const t=loader.load('i/'+s.f,()=>{t.userData.ok=1;window.__glLoaded=(window.__glLoaded||0)+1});t.minFilter=T.LinearFilter;t.generateMipmaps=false;t.userData={w:2560,h:1440};return t});
/* optional live videos replace stills when present */
const vids=SC.map((s,j)=>{if(!s.v)return null;const v=document.createElement('video');v.src='i/'+s.v;v.muted=true;v.loop=true;v.playsInline=true;v.preload=j<1?'auto':'metadata';v.crossOrigin='anonymous';const vt=new T.VideoTexture(v);vt.minFilter=T.LinearFilter;v.addEventListener('playing',()=>{tex[j]=vt;vt.userData={w:v.videoWidth,h:v.videoHeight,ok:1}},{once:true});return v});
const U={t0:{value:tex[0]},t1:{value:tex[1]||tex[0]},prog:{value:0},time:{value:0},res:{value:new T.Vector2(1,1)},ir0:{value:16/9},ir1:{value:16/9},mouse:{value:new T.Vector2()},vel:{value:0},zoom0:{value:1},zoom1:{value:1},dark:{value:0}};
const mat=new T.ShaderMaterial({uniforms:U,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:`
precision highp float;varying vec2 vUv;uniform sampler2D t0,t1;uniform float prog,time,ir0,ir1,vel,zoom0,zoom1,dark;uniform vec2 res,mouse;
vec2 cover(vec2 uv,float ir,float z){float sr=res.x/res.y;vec2 s=sr>ir?vec2(1.,ir/sr):vec2(sr/ir,1.);vec2 c=(uv-.5)*s/z+.5;return c;}
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}
void main(){
 vec2 uv=vUv;vec2 m=mouse*.012;
 float w=sin(uv.y*12.+time*1.5)*.0035*vel;uv.x+=w;
 float f=fbm(uv*vec2(3.,2.2)+vec2(time*.03,0.));
 float edge=prog*1.3-.15;float d=f*.85+(1.-uv.y)*.25;
 float mask=smoothstep(edge-.05,edge+.05,d);
 vec2 a=cover(uv+m,ir0,zoom0+prog*.08);vec2 b=cover(uv+m*1.3,ir1,zoom1+(1.-prog)*.12);
 vec2 dist=vec2(f-.5)*(1.-mask)*mask*.25;
 vec3 c0=texture2D(t0,a+dist).rgb;vec3 c1=texture2D(t1,b-dist).rgb;
 vec3 col=mix(c1,c0,mask);
 float rim=smoothstep(.0,.06,abs(d-edge)) ;float glow=(1.-smoothstep(0.,.07,abs(d-edge)))*step(.001,prog)*step(prog,.999);
 col=mix(col,vec3(.56,.69,.29),glow*.85);col+=glow*vec3(.25,.3,.1)*.4;
 col=mix(col,col*vec3(.86,.9,1.),dark*.0);
 vec2 q=vUv-.5;col*=1.-dot(q,q)*.5;
 float g=h(vUv*res+time);col+=(g-.5)*.04;
 gl_FragColor=vec4(col,1.);}`});
scene.add(new T.Mesh(new T.PlaneGeometry(2,2),mat));
function size(){const w=cv.clientWidth,h=cv.clientHeight;ren.setSize(w,h,false);U.res.value.set(w,h)}size();addEventListener('resize',size);
let x=0,tx=0,mx=0,my=0,cmx=0,cmy=0,lastX=0,vel=0;
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=.5-e.clientY/innerHeight},{passive:true});
const ir=t=>{const d=t.image&&(t.image.videoWidth||t.image.width);const e=t.image&&(t.image.videoHeight||t.image.height);return d&&e?d/e:16/9};
function frame(now){const t=now/1000;x+=(tx-x)*.12;vel+=((Math.abs(x-lastX)*60)-vel)*.1;lastX=x;cmx+=(mx-cmx)*.05;cmy+=(my-cmy)*.05;
 const a=Math.max(0,Math.min(SC.length-1,Math.floor(x))),b=Math.min(SC.length-1,a+1),p=Math.max(0,Math.min(1,x-a));
 U.t0.value=tex[a];U.t1.value=tex[b];U.prog.value=p;U.ir0.value=ir(tex[a]);U.ir1.value=ir(tex[b]);U.time.value=t;U.mouse.value.set(cmx,cmy);U.vel.value=Math.min(1,vel);
 U.zoom0.value=1.04+((x%1)*0)+Math.sin(t*.1)*.004;U.zoom1.value=1.04;
 vids.forEach((v,j)=>{if(!v)return;const near=Math.abs(x-j)<1.2;if(near&&v.paused)v.play().catch(()=>{});else if(!near&&!v.paused)v.pause()});
 ren.render(scene,cam);requestAnimationFrame(frame)}
requestAnimationFrame(frame);
window.__gl={set:v=>{tx=v},get x(){return x}};
})();
