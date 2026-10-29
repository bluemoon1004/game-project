'use strict';
// Original sixteen-bar sky-garden theme, synthesized locally without downloads.
window.gameAudio=(()=>{
 let context,master,musicBus,effectBus,timer=null,step=0,next=0,playing=false,muted=false;
 const beat=60/112/2;
 const melody=[76,0,79,0,83,81,79,0,76,0,74,76,79,0,0,0,74,0,78,0,81,79,78,0,74,0,72,74,78,0,0,0,72,0,76,0,79,83,81,79,76,0,74,76,79,0,0,0,74,0,78,0,81,0,79,78,76,0,74,71,72,0,0,0,76,79,83,0,86,83,81,79,81,0,79,76,74,0,0,0,74,78,81,0,84,81,79,78,79,0,78,74,72,0,0,0,72,76,79,0,83,79,76,74,76,0,79,81,79,0,76,0,74,0,78,81,79,0,78,74,71,0,74,0,72,0,0,0];
 const chords=[[48,52,55],[43,47,50],[45,48,52],[41,45,48]];
 const hz=n=>440*Math.pow(2,(n-69)/12);
 function init(){if(context)return true;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;context=new AC();master=context.createGain();master.gain.value=.55;master.connect(context.destination);musicBus=context.createGain();musicBus.gain.value=.28;musicBus.connect(master);effectBus=context.createGain();effectBus.gain.value=.48;effectBus.connect(master);return true}
 function tone(note,when,duration,volume=.2,type='sine',bus=musicBus,endNote){const o=context.createOscillator(),g=context.createGain();o.type=type;o.frequency.setValueAtTime(hz(note),when);if(endNote!==undefined)o.frequency.exponentialRampToValueAtTime(hz(endNote),when+duration);g.gain.setValueAtTime(0,when);g.gain.linearRampToValueAtTime(volume,when+.012);g.gain.exponentialRampToValueAtTime(.0001,when+duration);o.connect(g);g.connect(bus);o.start(when);o.stop(when+duration+.03);o.onended=()=>{o.disconnect();g.disconnect()}}
 function schedule(){if(!playing)return;while(next<context.currentTime+.15){const index=step%melody.length,chord=chords[Math.floor(index/16)%4];if(melody[index]){tone(melody[index],next,.32,.24,'sine');tone(melody[index]+12,next,.20,.035,'triangle')}if(index%4===0)tone(chord[index%8===0?0:2]-12,next,.36,.29,'triangle');if(index%2===0)tone(chord[(index/2)%3]+12,next,.16,.075,'triangle');if(index%4===2)tone(91,next,.045,.025,'square');step++;next+=beat}}
 function label(){const b=document.querySelector('#sound');if(b){b.textContent=muted?'🔇':'♪';b.setAttribute('aria-label',muted?'소리 켜기':'소리 끄기');b.setAttribute('aria-pressed',String(!muted));b.title=muted?'소리 켜기 (M)':'소리 끄기 (M)'}}
 async function play(){if(!init())return;try{await context.resume();if(playing)return;playing=true;next=context.currentTime+.04;schedule();timer=setInterval(schedule,50)}catch{}}
 function pause(){playing=false;clearInterval(timer);timer=null;if(context)context.suspend().catch(()=>{})}
 async function toggle(){if(!init())return;muted=!muted;master.gain.setTargetAtTime(muted?0:.55,context.currentTime,.025);label()}
 function sfx(kind){if(!context||muted||context.state!=='running')return;const t=context.currentTime;const seq=(notes,spacing=.08)=>notes.forEach((n,i)=>tone(n,t+i*spacing,.22,.35,'sine',effectBus));if(kind==='jump')tone(60,t,.19,.28,'triangle',effectBus,84);if(kind==='star')seq([88,95],.065);if(kind==='fall')tone(67,t,.4,.22,'triangle',effectBus,40);if(kind==='checkpoint')seq([72,76,79,84],.10);if(kind==='win')seq([72,76,79,84,79,84,88],.12)}
 return {play,pause,toggle,sfx};
})();
