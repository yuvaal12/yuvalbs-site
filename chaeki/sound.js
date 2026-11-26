/* CHA·EKI ambient sound — all synthesised with WebAudio, off until the visitor turns it on. */
(function(){
let ac=null,on=false,master,rumble,rumbleG,birdsT,clackT,pourG,whiskG,velG;let vel=0,night=0,cerQ=0;
function noiseBuf(type){const n=ac.sampleRate*2,b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);let last=0;for(let i=0;i<n;i++){const w=Math.random()*2-1;if(type==='brown'){last=(last+.02*w)/1.02;d[i]=last*3.5}else d[i]=w}return b}
function loop(buf){const s=ac.createBufferSource();s.buffer=buf;s.loop=true;s.start();return s}
function init(){ac=new (window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=0;master.connect(ac.destination);
 const brown=noiseBuf('brown'),white=noiseBuf('white');
 rumble=loop(brown);const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=160;rumbleG=ac.createGain();rumbleG.gain.value=.25;rumble.connect(lp).connect(rumbleG).connect(master);
 velG=ac.createGain();velG.gain.value=0;const wn=loop(white),bp=ac.createBiquadFilter();bp.type='bandpass';bp.frequency.value=700;bp.Q.value=.6;wn.connect(bp).connect(velG).connect(master);
 const pn=loop(white),pb=ac.createBiquadFilter();pb.type='bandpass';pb.frequency.value=1200;pb.Q.value=1.4;pourG=ac.createGain();pourG.gain.value=0;pn.connect(pb).connect(pourG).connect(master);
 const wh=loop(white),wb=ac.createBiquadFilter();wb.type='highpass';wb.frequency.value=2500;whiskG=ac.createGain();whiskG.gain.value=0;const am=ac.createGain();am.gain.value=0;const lfo=ac.createOscillator();lfo.frequency.value=7;const lg=ac.createGain();lg.gain.value=.5;lfo.connect(lg).connect(am.gain);lfo.start();wh.connect(wb).connect(am).connect(whiskG).connect(master);
 schedBird();schedClack()}
function chirp(t,f){const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*1.6,t+.06);o.frequency.exponentialRampToValueAtTime(f*.9,t+.12);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+.14);o.connect(g).connect(master);o.start(t);o.stop(t+.16)}
function schedBird(){birdsT=setTimeout(()=>{if(on&&night<.5){const t=ac.currentTime,f=2400+Math.random()*1600,n=2+Math.floor(Math.random()*4);for(let i=0;i<n;i++)chirp(t+i*.16,f*(1+(Math.random()-.5)*.15))}schedBird()},2500+Math.random()*5000)}
function click(t,v){const s=ac.createBufferSource(),b=ac.createBuffer(1,600,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<600;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/80);s.buffer=b;const g=ac.createGain();g.gain.value=v;const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=900;s.connect(f).connect(g).connect(master);s.start(t)}
function schedClack(){clackT=setTimeout(()=>{if(on&&vel>.05){const t=ac.currentTime,v=Math.min(.5,vel*.6);click(t,v);click(t+.11,v*.8)}schedClack()},Math.max(260,1100-vel*900))}
function bell(t,f,d,v){[1,2.01,3.02].forEach((m,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=f*m;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v/(i+1),t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(master);o.start(t);o.stop(t+d+.05)})}
const NOTES=[659.25,783.99,1046.5,987.77,783.99];
window.__snd={
 get on(){return on},
 toggle(){if(!ac)init();on=!on;ac.resume&&ac.resume();master.gain.cancelScheduledValues(ac.currentTime);master.gain.linearRampToValueAtTime(on?.8:0,ac.currentTime+.6);document.documentElement.classList.toggle('snd-on',on);try{localStorage.setItem('chaeki-snd',on?'1':'0')}catch(e){}return on},
 arrive(k){if(!on)return;const t=ac.currentTime+.05;const seq=[0,1,2,1,3].map(i=>NOTES[(i+k)%NOTES.length]);seq.forEach((f,i)=>bell(t+i*.22,f,1.4,.09))},
 vel(v){vel=Math.min(1,Math.abs(v)/40);if(ac&&on){velG.gain.setTargetAtTime(vel*.05,ac.currentTime,.2);rumbleG.gain.setTargetAtTime(.2+vel*.25,ac.currentTime,.3)}},
 night(n){night=n},
 cer(q,active){if(!ac||!on)return;const pour=active&&q>.25&&q<.5?1:0,wh=active&&q>.5&&q<.75?1:0;pourG.gain.setTargetAtTime(pour*.18,ac.currentTime,.15);whiskG.gain.setTargetAtTime(wh*.12,ac.currentTime,.1)}
};
})();
