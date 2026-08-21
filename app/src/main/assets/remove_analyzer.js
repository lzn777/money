(function(){
  if(window.__rotaNoAnalyzer) return;
  window.__rotaNoAnalyzer=true;

  function removeAnalyzer(){
    var trip=document.getElementById('trip');
    if(trip){
      trip.classList.remove('on');
      trip.style.display='none';
      trip.setAttribute('aria-hidden','true');
    }

    document.querySelectorAll('.nav button[data-s="trip"],button[onclick*="go(\'trip\')"],button[onclick*="go(\"trip\")"]').forEach(function(el){
      el.remove();
    });

    var nav=document.querySelector('.nav');
    if(nav){
      nav.style.gridTemplateColumns='repeat(4,1fr)';
    }

    document.querySelectorAll('button').forEach(function(btn){
      var text=(btn.textContent||'').trim().toUpperCase();
      if(text.indexOf('ANALISAR CORRIDA')!==-1){
        btn.remove();
      }
    });

    if(typeof window.go==='function'&&!window.go.__rotaNoAnalyzer){
      var oldGo=window.go;
      var safeGo=function(screen){
        if(screen==='trip') screen='home';
        return oldGo(screen);
      };
      safeGo.__rotaNoAnalyzer=true;
      window.go=safeGo;
    }
  }

  removeAnalyzer();
  new MutationObserver(removeAnalyzer).observe(document.body,{childList:true,subtree:true});
})();
