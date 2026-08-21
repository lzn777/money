(function(){
  if(window.__rotaNoAnalyzerV2) return;
  window.__rotaNoAnalyzerV2=true;
  function clean(){
    var trip=document.getElementById('trip');
    if(trip){trip.classList.remove('on');trip.style.setProperty('display','none','important');trip.setAttribute('aria-hidden','true');}
    document.querySelectorAll('.nav button[data-s="trip"],[data-s="trip"],button[onclick*="trip"],a[onclick*="trip"]').forEach(function(el){el.remove();});
    document.querySelectorAll('button,a,[role="button"]').forEach(function(el){
      var t=(el.textContent||'').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      if(t.indexOf('ANALISAR CORRIDA')>=0||t.indexOf('ANALIZAR CORRIDA')>=0)el.remove();
    });
    var nav=document.querySelector('.nav');if(nav)nav.style.setProperty('grid-template-columns','repeat(4,1fr)','important');
    if(document.querySelector('.screen.on')===trip&&typeof go==='function')try{go('home')}catch(e){}
    if(typeof window.go==='function'&&!window.go.__rotaNoAnalyzerV2){var old=window.go;var safe=function(s){return old(s==='trip'?'home':s)};safe.__rotaNoAnalyzerV2=true;window.go=safe;}
  }
  clean();requestAnimationFrame(clean);setTimeout(clean,40);setTimeout(clean,250);
  new MutationObserver(clean).observe(document.documentElement,{childList:true,subtree:true});
})();
