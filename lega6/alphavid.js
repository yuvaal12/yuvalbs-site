/* Transparent creature videos: <div class="av" data-av="i/ai_claude"><img src="still.webp"></div>
   The mp4 holds colour on the top half and the matte on the bottom half; one shared WebGL context
   composites each visible clip into its own 2D canvas. */
(function(){
const els=[...document.querySelectorAll('[data-av]')];if(!els.length)return;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduce)return;
const G=document.createElement('canvas');const gl=G.getContext('webgl',{premultipliedAlpha:false,alpha:true,preserveDrawingBuffer:true});if(!gl)return;
const vs='attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}';
const fs='precision mediump float;uniform sampler2D t;varying vec2 v;void main(){vec3 c=texture2D(t,vec2(v.x,v.y*.5)).rgb;float a=texture2D(t,vec2(v.x,.5+v.y*.5)).r;a=smoothstep(.08,.92,a);gl_FragColor=vec4(c,a);}';
const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o};
const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);
const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
[gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.CLAMP_TO_EDGE));
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
gl.clearColor(0,0,0,0);
const mob=innerWidth<760,items=[];
els.forEach(el=>{const v=document.createElement('video');Object.assign(v,{muted:true,loop:true,playsInline:true,preload:'none'});v.setAttribute('playsinline','');v.setAttribute('muted','');
 const c=document.createElement('canvas');c.className='avc';el.appendChild(c);const it={el,v,c,ctx:c.getContext('2d'),on:false,ready:false};
 v.addEventListener('loadeddata',()=>{it.ready=true;el.classList.add('live')});
 items.push(it)});
const io=new IntersectionObserver(es=>es.forEach(e=>{const it=items.find(i=>i.el===e.target);if(!it)return;it.on=e.isIntersecting;
 if(it.on){if(!it.v.src)it.v.src=it.el.dataset.av+(mob?'_m':'')+'.mp4';it.v.play().catch(()=>{})}else it.v.pause()}),{rootMargin:'60px',threshold:.05});
items.forEach(i=>io.observe(i.el));
addEventListener('pointerdown',()=>items.forEach(i=>i.on&&i.v.play().catch(()=>{})),{once:true});
function draw(){requestAnimationFrame(draw);
 for(const it of items){if(!it.on||!it.ready||it.v.readyState<2)continue;
  const s=getComputedStyle(it.el);if(+s.opacity===0||s.visibility==='hidden')continue;
  const vw=it.v.videoWidth,vh=it.v.videoHeight/2;const r=it.el.getBoundingClientRect();if(r.width<2)continue;
  const d=Math.min(devicePixelRatio,1.5);let w=r.width,h=w*vh/vw;if(h>r.height){h=r.height;w=h*vw/vh}
  const W=Math.round(w*d),H=Math.round(h*d);if(it.c.width!==W||it.c.height!==H){it.drawn=0;it.c.width=W;it.c.height=H;it.c.style.width=w+'px';it.c.style.height=h+'px'}
  if(G.width<W||G.height<H){G.width=Math.max(G.width,W);G.height=Math.max(G.height,H)}   // grow only, never thrash
  if(it.v.currentTime===it.t&&it.drawn)continue;it.t=it.v.currentTime;it.drawn=1;        // only redraw on a new frame
  gl.viewport(0,G.height-H,W,H);gl.clear(gl.COLOR_BUFFER_BIT);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,it.v);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  it.ctx.clearRect(0,0,W,H);it.ctx.drawImage(G,0,0,W,H,0,0,W,H)}}
draw();
})();
