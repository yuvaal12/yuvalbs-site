/* TEDER visual engine: dunes drawn as ridgelines (a sound-wave plot that is also a desert).
   Each line is a dune crest; the music lifts the crests band by band. */
(function(){
function h(n){return (Math.sin(n*127.1)*43758.5453)%1}
function noise(x,y){const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);
 const a=h(ix+iy*57),b=h(ix+1+iy*57),c=h(ix+(iy+1)*57),d=h(ix+1+(iy+1)*57);return Math.abs(a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v)}
const DUNES=window.DUNES={
 draw(g,W,H,t,o){
  o=o||{};const L=o.lines||46,G=o.gain==null?1:o.gain,bands=o.bands,kick=o.kick||0,mx=o.mx==null?-9:o.mx,seed=o.seed||0;
  const C=o.colors||{bg:'#0d0b14',line:'#efd9b4',sun:'#ff5a1f',hot:'#ff5a1f'};
  g.fillStyle=C.bg;g.fillRect(0,0,W,H);
  /* sun / moon behind the dunes */
  const sr=Math.min(W,H)*(.16+kick*.015),sx=W*(o.sunX||.5),sy=H*(o.sunY||.36);
  const grd=g.createRadialGradient(sx,sy,sr*.2,sx,sy,sr*2.6);grd.addColorStop(0,C.sun+'55');grd.addColorStop(1,C.sun+'00');g.fillStyle=grd;g.fillRect(0,0,W,H);
  g.fillStyle=C.sun;g.beginPath();g.arc(sx,sy,sr,0,Math.PI*2);g.fill();
  /* scan stripes cut through the sun, like a heat haze */
  g.fillStyle=C.bg;for(let i=0;i<7;i++){const yy=sy+sr*(.1+i*.14),hh=1+i*1.3;g.fillRect(sx-sr,yy,sr*2,hh)}
  const top=H*(o.top||.3),bottom=H*(o.bottom||1.02),gap=(bottom-top)/L,step=Math.max(3,W/180);
  for(let j=0;j<L;j++){
   const y0=top+j*gap,depth=j/L,amp=gap*(2.2+depth*5.5);
   const band=bands?bands[Math.min(bands.length-1,2+Math.floor((1-depth)*48))]/255:0;
   g.beginPath();g.moveTo(-10,H+10);
   for(let x=-10;x<=W+10;x+=step){
    const nx=x/W;
    const dune=Math.pow(noise(nx*3.2+seed+j*.13,j*.31+t*.05),1.6);
    const ripple=Math.sin(nx*40+j*.7-t*1.6)*.06;
    const centre=Math.exp(-Math.pow((nx-.5)*2.4,2));
    const wind=mx>-1?Math.exp(-Math.pow((nx-mx)*9,2))*.9:0;
    const lift=(dune*.9+ripple)*(.55+centre*.6)+band*centre*1.6*G+wind*(.4+depth)+kick*centre*.25*(1-depth);
    g.lineTo(x,y0-lift*amp);
   }
   g.lineTo(W+10,H+10);g.closePath();g.fillStyle=C.bg;g.fill();
   const hot=band>.55&&j%3===0;
   g.strokeStyle=hot?C.hot:C.line;g.globalAlpha=.25+depth*.75;g.lineWidth=hot?1.6:1+depth*.6;g.stroke();g.globalAlpha=1;
  }
 }
};
})();
