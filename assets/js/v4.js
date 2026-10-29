/* Forest Dew V4: Accessible visual refinements, no tracking */
(()=>{
'use strict';
const header=document.querySelector('.site-header');
if(!header)return;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduce&&document.querySelector('.v4-hero')){
 const hero=document.querySelector('.v4-hero');
 hero.classList.add('v4-motion-ready');
 requestAnimationFrame(()=>hero.classList.add('v4-motion-in'));
}
})();
