/* CHA·EKI — WebGL scene transitions: a matcha wash spreads across the frame and carries you to the next station. */
(function(){
const T=THREE,cv=document.getElementById('gl');if(!cv)return;
const SC=window.CHAEKI_SCENES||[];
const ren=new T.WebGLRenderer({canvas:cv,antialias:false,alpha:false,powerPreference:'high-performance'});
const DPR=Math.min(devicePixelRatio,1.75);ren.setPixelRatio(DPR);
const scene=new T.Scene(),cam=new T.OrthographicCamera(-1,1,1,-1,0,1);
const loader=new T.TextureLoader();
/* first three scenes load now (the loader waits for them); the rest stream in once the page is idle */
const mk=j=>{const t=loader.load('i/'+SC[j].f,()=>{t.userData.ok=1;window.__glLoaded=(window.__glLoaded||0)+1});t.minFilter=T.LinearFilter;t.generateMipmaps=false;t.userData={w:2560,h:1440};return t};
const tex=SC.map((s,j)=>j<3?mk(j):null);
const rest=()=>SC.forEach((s,j)=>{if(!tex[j])tex[j]=mk(j)});
addEventListener('load',()=>setTimeout(rest,600));setTimeout(rest,5000);
const T0=()=>tex[0];
/* optional live videos replace stills when present */
const vids=SC.map((s,j)=>{if(!s.v)return null;const v=document.createElement('video');v.src='i/'+s.v;v.muted=true;v.loop=true;v.playsInline=true;v.preload=j<1?'auto':'metadata';v.crossOrigin='anonymous';const vt=new T.VideoTexture(v);vt.minFilter=T.LinearFilter;v.addEventListener('playing',()=>{tex[j]=vt;vt.userData={w:v.videoWidth,h:v.videoHeight,ok:1}},{once:true});return v});
const U={t0:{value:tex[0]},t1:{value:tex[1]||tex[0]},prog:{value:0},time:{value:0},res:{value:new T.Vector2(1,1)},ir0:{value:16/9},ir1:{value:16/9},mouse:{value:new T.Vector2()},vel:{value:0},zoom0:{value:1},zoom1:{value:1},dark:{value:0}};
const mat=new T.ShaderMaterial({uniforms:U,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:`
precision highp float;varying vec2 vUv;uniform sampler2D t0,t1;uniform float prog,time,ir0,ir1,vel,zoom0,zoom1,dark;uniform vec2 res,mouse;
vec2 cover(vec2 uv,float ir,float z){float sr=res.x/res.y;vec2 s=sr>ir?vec2(1.,ir/sr):vec2(sr/ir,1.);vec2 c=(uv-.5)*s/z+.5;return c;}
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}
float sdRR(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
vec3 sceneCol(vec2 uv,vec2 m,out float glow){
 float w=sin(uv.y*12.+time*1.5)*.0035*vel;uv.x+=w;
 float f=fbm(uv*vec2(3.,2.2)+vec2(time*.03,0.));
 float edge=prog*1.3-.15;float d=f*.85+(1.-uv.y)*.25;
 float mask=smoothstep(edge-.05,edge+.05,d);
 vec2 a=cover(uv+m,ir0,zoom0+prog*.08);vec2 b=cover(uv+m*1.3,ir1,zoom1+(1.-prog)*.12);
 vec2 dist=vec2(f-.5)*(1.-mask)*mask*.25;
 vec3 c0=texture2D(t0,a+dist).rgb;vec3 c1=texture2D(t1,b-dist).rgb;
 glow=(1.-smoothstep(0.,.07,abs(d-edge)))*step(.001,prog)*step(prog,.999);
 return mix(c1,c0,mask);}
void main(){
 vec2 m=mouse*.012;
 float W=sin(clamp(prog,0.,1.)*3.14159);W=smoothstep(.05,.85,W);
 float asp=res.x/res.y;vec2 p=(vUv-.5)*vec2(asp,1.);
 vec2 hs=mix(vec2(asp*.5+.08,.58),vec2(min(asp*.36,.62),.33),W);float rr=mix(.0,.07,W);
 float d=sdRR(p+vec2(0.,.03*W),hs,rr);float inside=1.-smoothstep(0.,.003,d);
 float glow;vec3 col=vec3(0.);float speed=W*.007;float ws=0.;
 if(W<.002){col=sceneCol(vUv,m,glow);}else{
 for(int i=-3;i<=3;i++){float g;vec2 u=vUv+vec2(float(i)*speed*.5,0.);col+=sceneCol(u+vec2(sin(time*9.)*.0015*W,cos(time*13.)*.001*W),m,g);ws+=1.;}
 col/=ws;glow=0.;}
 col=mix(col,vec3(.56,.69,.29),glow*.85*(1.-W));
 float pole=smoothstep(.93,.95,fract(vUv.x*.9+time*.55))*W;col=mix(col,vec3(.05,.05,.045),pole*.92);
 float wire=(1.-smoothstep(0.,.004,abs(vUv.y-.78-sin(vUv.x*3.+time*3.3)*.02)))*W;col=mix(col,vec3(.08),wire*.7);
 vec3 wall=mix(vec3(.13,.115,.1),vec3(.06,.055,.05),vUv.y);wall+=fbm(vUv*vec2(60.,4.))*.03;
 float rim=1.-smoothstep(0.,.012,abs(d));float sill=(1.-smoothstep(0.,.02,abs(p.y+hs.y+.03*W+.035)))*step(abs(p.x),hs.x+.02);
 vec3 inner=mix(wall,col,inside);inner=mix(inner,vec3(.78,.72,.6),rim*.55*W);inner=mix(inner,vec3(.32,.26,.2),sill*W);
 col=mix(col,inner,W);
 /* one film grade for every scene: soft S-curve, lifted blacks, cool shadows, warm highlights */
 float lum=dot(col,vec3(.299,.587,.114));col=mix(col,col*col*(3.-2.*col),.22);col=mix(vec3(lum),col,.9);
 col+=vec3(-.012,.004,.02)*(1.-lum)+vec3(.025,.012,-.02)*lum;col=col*.93+.035;
 vec2 q=vUv-.5;col*=1.-dot(q,q)*.5;
 float g=h(vUv*res+time);col+=(g-.5)*.04;
 gl_FragColor=vec4(col,1.);}`});
scene.add(new T.Mesh(new T.PlaneGeometry(2,2),mat));
function size(){const w=cv.clientWidth,h=cv.clientHeight;ren.setSize(w,h,false);U.res.value.set(w,h)}size();addEventListener('resize',size);
let x=0,tx=0,mx=0,my=0,cmx=0,cmy=0,lastX=0,vel=0;
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=.5-e.clientY/innerHeight},{passive:true});
const ir=t=>{const d=t.image&&(t.image.videoWidth||t.image.width);const e=t.image&&(t.image.videoHeight||t.image.height);return d&&e?d/e:16/9};
let vis=true;new IntersectionObserver(es=>{vis=es[0].isIntersecting},{rootMargin:'100px'}).observe(cv);
function frame(now){if(!vis||document.hidden){requestAnimationFrame(frame);return}const t=now/1000;x+=(tx-x)*.12;vel+=((Math.abs(x-lastX)*60)-vel)*.1;lastX=x;cmx+=(mx-cmx)*.05;cmy+=(my-cmy)*.05;
 const a=Math.max(0,Math.min(SC.length-1,Math.floor(x))),b=Math.min(SC.length-1,a+1),p=Math.max(0,Math.min(1,x-a));
 if(!tex[a]||!tex[b])rest();U.t0.value=tex[a]||tex[0];U.t1.value=tex[b]||tex[0];U.prog.value=p;U.ir0.value=ir(U.t0.value);U.ir1.value=ir(U.t1.value);U.time.value=t;U.mouse.value.set(cmx,cmy);U.vel.value=Math.min(1,vel);
 U.zoom0.value=1.04+((x%1)*0)+Math.sin(t*.1)*.004;U.zoom1.value=1.04;
 vids.forEach((v,j)=>{if(!v)return;const near=Math.abs(x-j)<1.2;if(near&&v.paused)v.play().catch(()=>{});else if(!near&&!v.paused)v.pause()});
 ren.render(scene,cam);requestAnimationFrame(frame)}
requestAnimationFrame(frame);
window.__gl={set:v=>{tx=v},get x(){return x}};
})();
