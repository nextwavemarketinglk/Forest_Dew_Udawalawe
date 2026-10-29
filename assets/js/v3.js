/* Forest Dew V3: Progressive enhancements only. Works without external dependencies. */
(()=>{
  'use strict';
  const scenes=[...document.querySelectorAll('[data-hero-scene]')];
  const controls=[...document.querySelectorAll('[data-hero-dot]')];
  const caption=document.querySelector('[data-scene-caption]');
  const label=document.querySelector('.hero-art-note');
  let current=0, timer=null;
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const captions=['THE STAY / REAL HOTEL PHOTOGRAPH','THE POOL / REAL HOTEL PHOTOGRAPH','THE TERRACE / REAL HOTEL PHOTOGRAPH'];
  function showScene(index){
    if(!scenes.length)return;
    current=index%scenes.length;
    scenes.forEach((s,i)=>s.classList.toggle('is-active',i===current));
    controls.forEach((b,i)=>{b.classList.toggle('active',i===current);b.setAttribute('aria-pressed',String(i===current));});
    if(caption)caption.textContent=captions[current];
    if(label)label.textContent='ACTUAL PHOTOGRAPH OF FOREST DEW UDAWALAWA';
  }
  function stop(){if(timer!==null){window.clearInterval(timer);timer=null;}}
  function start(){stop();if(!reduceMotion&&scenes.length>1&&document.visibilityState==='visible')timer=window.setInterval(()=>showScene((current+1)%scenes.length),7500);}
  controls.forEach((b,i)=>b.addEventListener('click',()=>{showScene(i);start();}));
  if(scenes.length){showScene(0);start();document.addEventListener('visibilitychange',()=>document.hidden?stop():start());}
  const buttons=[...document.querySelectorAll('[data-gallery-filter]')];
  const photos=[...document.querySelectorAll('[data-photo-category]')];
  buttons.forEach(btn=>btn.addEventListener('click',()=>{
    const filter=btn.dataset.galleryFilter;
    buttons.forEach(b=>{const selected=b===btn;b.classList.toggle('is-active',selected);b.setAttribute('aria-pressed',String(selected));});
    photos.forEach(photo=>{photo.hidden=filter!=='all'&&photo.dataset.photoCategory!==filter;});
  }));
})();
