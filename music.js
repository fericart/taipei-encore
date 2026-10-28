// Official YouTube embed only; no copied soundtrack or generated impersonation.
// API: https://developers.google.com/youtube/iframe_api_reference
export function initMusic(){
 const $=s=>document.querySelector(s),panel=$('#music-panel'),slot=$('#player-slot');
 const stageButton=$('#music-toggle'),stripButton=$('#music-start'),close=$('#music-close');
 const status=$('#music-status'),volume=$('#music-volume'),level=$('#music-level');
 let player=null,ready=false,apiPromise=null,session=0,clock=null,watchdog=null,opener=stageButton;
 const labels={off:'開啟配樂',loading:'載入配樂',playing:'暫停配樂',paused:'繼續配樂',ready:'播放配樂',blocked:'播放配樂',error:'重試配樂',manual:'查看配樂'};
 function update(state,message){
  panel.dataset.state=state;const playing=state==='playing';
  stageButton.innerHTML=`<span aria-hidden="true">${playing?'Ⅱ':'♫'}</span> ${labels[state]}`;
  stageButton.setAttribute('aria-pressed',String(playing));stageButton.setAttribute('aria-expanded',String(!panel.hidden));
  stripButton.querySelector('.play-icon').textContent=playing?'Ⅱ':'▶';
  stripButton.querySelector('.music-label').textContent=labels[state]+'〈台北安可〉';
  stripButton.setAttribute('aria-pressed',String(playing));stripButton.setAttribute('aria-expanded',String(!panel.hidden));
  stripButton.classList.toggle('is-playing',playing);stageButton.classList.toggle('is-playing',playing);
  status.textContent=message||({off:'點一下，讓台北安可響起。',loading:'正在載入官方 MV…',playing:'配樂播放中 · 循環播放',paused:'配樂已暫停',ready:'按播放配樂，或點影片播放鍵。',blocked:'請點影片中的播放鍵，開啟配樂。',manual:'請使用影片內的播放與音量控制。',error:'暫時無法播放，請重試或在 YouTube 開啟。'}[state]);
 }
 function loadAPI(){
  if(window.YT?.Player)return Promise.resolve(window.YT);
  if(apiPromise)return apiPromise;
  apiPromise=new Promise((resolve,reject)=>{
   const previous=window.onYouTubeIframeAPIReady,script=document.createElement('script');
   const timer=setTimeout(()=>fail(),15000);
   function fail(){clearTimeout(timer);script.remove();apiPromise=null;window.onYouTubeIframeAPIReady=previous;reject(new Error('YouTube controls unavailable'));}
   window.onYouTubeIframeAPIReady=()=>{clearTimeout(timer);try{previous?.()}finally{resolve(window.YT)}};
   script.src='https://www.youtube.com/iframe_api';script.onerror=fail;document.head.append(script);
  });return apiPromise;
 }
 function stop(restoreFocus=false){
  session++;clearInterval(clock);clearTimeout(watchdog);clock=null;watchdog=null;ready=false;
  player?.destroy();player=null;slot.replaceChildren();panel.hidden=true;delete panel.dataset.playbackTime;delete panel.dataset.playerState;
  volume.disabled=true;update('off');if(restoreFocus)(opener.closest('[inert]')?stageButton:opener).focus();
 }
 async function start(){
  stop();const current=++session;panel.hidden=false;update('loading');
  const frame=document.createElement('iframe');frame.id='official-mv';
  const params=new URLSearchParams({autoplay:'1',enablejsapi:'1',origin:location.origin,playsinline:'1',loop:'1',playlist:'uKCiYJdv6Zg',rel:'0'});
  frame.src='https://www.youtube.com/embed/uKCiYJdv6Zg?'+params;
  frame.title='台北安可｜官方 MV 配樂';frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';slot.replaceChildren(frame);
  watchdog=setTimeout(()=>{if(current===session&&panel.dataset.state==='loading')update('blocked')},20000);
  try{
   const YT=await loadAPI();if(current!==session)return;
   player=new YT.Player(frame,{events:{
    onReady:e=>{
     if(current!==session)return;ready=true;volume.disabled=false;e.target.setVolume(Number(volume.value));e.target.unMute();if(document.hidden)e.target.pauseVideo();else if(e.target.getPlayerState()!==1)e.target.playVideo();
     clock=setInterval(()=>{if(current!==session||!ready)return;panel.dataset.playbackTime=Number(player.getCurrentTime()).toFixed(2);const state=player.getPlayerState();panel.dataset.playerState=String(state);if(state===1&&panel.dataset.state!=='playing')update('playing');},1000);
    },
    onStateChange:e=>{
     if(current!==session)return;panel.dataset.playerState=String(e.data);
     if(e.data===1){clearTimeout(watchdog);update('playing')}
     else if(e.data===2){clearTimeout(watchdog);update('paused')}
     else if(e.data===3)update('loading','配樂緩衝中…');
     else if(e.data===0)update('ready','曲目已結束，等待循環播放。');
     else if(e.data===5)update('ready');
    },
    // Some embeds emit a late blocked event for an earlier autoplay attempt even
    // after playback has begun. Actual playback takes precedence over that hint.
    onAutoplayBlocked:e=>{if(current===session){clearTimeout(watchdog);update(e.target.getPlayerState()===1?'playing':'blocked')}},
    onError:()=>{if(current===session){clearTimeout(watchdog);update('error')}}
   }});
  }catch{if(current===session){clearTimeout(watchdog);update('manual')}}
 }
 function toggle(e){
  opener=e.currentTarget;
  if(panel.hidden||panel.dataset.state==='error'){start();return}
  if(!ready){if(panel.dataset.state==='loading')stop();else close.focus();return}
  const state=player.getPlayerState();
  if(state===1||state===3){player.pauseVideo();return}
  player.unMute();player.setVolume(Number(volume.value));player.playVideo();
 }
 for(const button of[stageButton,stripButton]){button.setAttribute('aria-controls','music-panel');button.addEventListener('click',toggle)}
 close.addEventListener('click',()=>stop(true));
 volume.addEventListener('input',()=>{level.textContent=volume.value+'%';if(ready){player.unMute();player.setVolume(Number(volume.value))}});
 panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();stop(true)}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&ready)player.pauseVideo()});
 window.addEventListener('pagehide',()=>stop());update('off');
}
