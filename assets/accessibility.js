(function(){
'use strict';
const widget=document.getElementById('wa-widget'),dismiss=document.getElementById('wa-dismiss'),restore=document.getElementById('wa-restore');
function setWidget(hidden){if(widget)widget.hidden=hidden;if(restore)restore.hidden=!hidden;try{localStorage.setItem('lev-lead-hidden',hidden?'1':'0')}catch(e){}}
if(widget&&dismiss&&restore){let hidden=false;try{hidden=localStorage.getItem('lev-lead-hidden')==='1'}catch(e){}setWidget(hidden);dismiss.addEventListener('click',function(){setWidget(true);restore.focus()});restore.addEventListener('click',function(){setWidget(false);widget.querySelector('a').focus()});}
const menu=document.getElementById('menu-toggle'),nav=document.getElementById('site-nav');
if(menu&&nav){nav.addEventListener('focusout',function(){setTimeout(function(){if(!nav.contains(document.activeElement)&&document.activeElement!==menu){nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','פתיחת תפריט ניווט')}},0)});}
document.querySelectorAll('a[href^="#"]').forEach(function(link){link.addEventListener('click',function(){const target=document.getElementById(link.hash.slice(1));if(target){if(!target.hasAttribute('tabindex'))target.setAttribute('tabindex','-1');target.focus({preventScroll:true})}})});
// Future native media must remain user-controlled; captions require actual source media.
document.querySelectorAll('video,audio').forEach(function(media){media.removeAttribute('autoplay');media.autoplay=false;media.controls=true;media.preload='metadata'});
})();
