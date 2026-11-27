/* TEDER sound engine: a small desert-techno loop synthesized live with WebAudio (no samples, no licensed music).
   Exposes window.TD = {start, stop, on, bands(), level(), beat, bpm} */
(function(){
const BPM=122,STEP=60/BPM/4; // 16th notes
let ctx,master,an,data,timer,next=0,step=0,on=false,beatT=-9;
const TD=window.TD={on:false,bpm:BPM,beat:0,kickAt:-9,
 bands(){if(!an)return null;an.getByteFrequencyData(data);return data},
 level(){if(!an)return 0;const d=this.bands();let s=0;for(let i=2;i<40;i++)s+=d[i];return s/(38*255)}};
function init(){
 ctx=new (window.AudioContext||window.webkitAudioContext)();
 master=ctx.createGain();master.gain.value=0;
 const comp=ctx.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;
 an=ctx.createAnalyser();an.fftSize=256;an.smoothingTimeConstant=.78;data=new Uint8Array(an.frequencyBinCount);
 master.connect(comp);comp.connect(an);an.connect(ctx.destination);
 /* desert air: delay for the arp */
 TD.dl=ctx.createDelay(1);TD.dl.delayTime.value=STEP*3;const fb=ctx.createGain();fb.gain.value=.38;const dlf=ctx.createBiquadFilter();dlf.type='lowpass';dlf.frequency.value=2400;
 TD.dl.connect(dlf);dlf.connect(fb);fb.connect(TD.dl);dlf.connect(master);
 TD.noise=ctx.createBuffer(1,ctx.sampleRate*.5,ctx.sampleRate);const nd=TD.noise.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
 /* pad: slow detuned drone */
 const pad=ctx.createGain();pad.gain.value=.05;const pf=ctx.createBiquadFilter();pf.type='lowpass';pf.frequency.value=700;pf.Q.value=4;
 const lfo=ctx.createOscillator();lfo.frequency.value=.05;const lg=ctx.createGain();lg.gain.value=500;lfo.connect(lg);lg.connect(pf.frequency);lfo.start();
 [55,82.4,110.2,164.8].forEach((f,i)=>[-6,6].forEach(dt=>{const o=ctx.createOscillator();o.type='sawtooth';o.frequency.value=f;o.detune.value=dt+i*2;o.connect(pf);o.start()}));
 pf.connect(pad);pad.connect(master);
}
function kick(t){const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+.12);g.gain.setValueAtTime(1,t);g.gain.exponentialRampToValueAtTime(.001,t+.42);o.connect(g);g.connect(master);o.start(t);o.stop(t+.45)}
function hat(t,open){const s=ctx.createBufferSource();s.buffer=TD.noise;const f=ctx.createBiquadFilter();f.type='highpass';f.frequency.value=8000;const g=ctx.createGain();g.gain.setValueAtTime(open?.16:.09,t);g.gain.exponentialRampToValueAtTime(.001,t+(open?.22:.05));s.connect(f);f.connect(g);g.connect(master);s.start(t);s.stop(t+.25)}
function clap(t){const s=ctx.createBufferSource();s.buffer=TD.noise;const f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=1500;f.Q.value=.8;const g=ctx.createGain();g.gain.setValueAtTime(.0001,t);[0,.012,.024].forEach(d=>{g.gain.setValueAtTime(.35,t+d);g.gain.exponentialRampToValueAtTime(.05,t+d+.011)});g.gain.exponentialRampToValueAtTime(.001,t+.2);s.connect(f);f.connect(g);g.connect(master);s.start(t);s.stop(t+.25)}
const BASS=[0,0,12,0,0,10,0,7, 0,0,12,0,3,0,5,7];
function bass(t,n){const o=ctx.createOscillator(),f=ctx.createBiquadFilter(),g=ctx.createGain();o.type='sawtooth';o.frequency.value=41.2*Math.pow(2,n/12);f.type='lowpass';f.Q.value=9;f.frequency.setValueAtTime(900,t);f.frequency.exponentialRampToValueAtTime(140,t+.16);g.gain.setValueAtTime(.32,t);g.gain.exponentialRampToValueAtTime(.001,t+.2);o.connect(f);f.connect(g);g.connect(master);o.start(t);o.stop(t+.22)}
/* phrygian-dominant flavour: the desert scale (E F G# A B C D) */
const SC=[0,1,4,5,7,8,10,12,13,16];
function arp(t,i){const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.value=329.6*Math.pow(2,SC[(i*3+(i>>2))%SC.length]/12);g.gain.setValueAtTime(.07,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);o.connect(g);g.connect(master);g.connect(TD.dl);o.start(t);o.stop(t+.2)}
function sched(){while(next<ctx.currentTime+.12){const s=step%16,bar=Math.floor(step/16);
  if(s%4===0){kick(next);const tt=next;setTimeout(()=>{TD.kickAt=performance.now();TD.beat++},Math.max(0,(tt-ctx.currentTime)*1000))}
  if(s%4===2)hat(next,true);else if(s%2===1)hat(next,false);
  if(s===4||s===12)clap(next);
  if(BASS[s]!==undefined&&s%4!==0)bass(next,BASS[s]);
  if(bar%4>=2&&s%2===0)arp(next,step);
  next+=STEP;step++}}
TD.start=async()=>{if(!ctx)init();await ctx.resume();next=ctx.currentTime+.05;master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setTargetAtTime(.8,ctx.currentTime,.4);clearInterval(timer);timer=setInterval(sched,25);TD.on=true;document.documentElement.classList.add('playing')};
TD.stop=()=>{if(!ctx)return;master.gain.setTargetAtTime(0,ctx.currentTime,.25);setTimeout(()=>clearInterval(timer),900);TD.on=false;document.documentElement.classList.remove('playing')};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&TD.on){TD.stop();TD.paused=1}});
})();
