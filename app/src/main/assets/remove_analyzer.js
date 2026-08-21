(function(){
  if(window.__rotaNoAnalyzerV132) return;
  window.__rotaNoAnalyzerV132=true;

  var style=document.getElementById('rotaNoAnalyzerStyle');
  if(!style){
    style=document.createElement('style');
    style.id='rotaNoAnalyzerStyle';
    style.textContent='#trip,.nav button[data-s="trip"],button[onclick*="trip"]{display:none!important;visibility:hidden!important;width:0!important;min-width:0!important;max-width:0!important;padding:0!important;margin:0!important;border:0!important;overflow:hidden!important}.nav{grid-template-columns:repeat(4,1fr)!important}';
    (document.head||document.documentElement).appendChild(style);
  }

  function normalizeText(v){
    return String(v||'').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim();
  }

  function removeAnalyzer(){
    var trip=document.getElementById('trip');
    if(trip){
      trip.classList.remove('on');
      trip.hidden=true;
      trip.style.setProperty('display','none','important');
      trip.setAttribute('aria-hidden','true');
    }

    document.querySelectorAll('.nav button[data-s="trip"],button[onclick*="trip"],a[href="#trip"],[data-screen="trip"]').forEach(function(el){
      el.remove();
    });

    document.querySelectorAll('button,a,[role="button"]').forEach(function(el){
      var text=normalizeText(el.textContent);
      if(text.indexOf('ANALISAR CORRIDA')!==-1 || text.indexOf('ANALIZAR CORRIDA')!==-1 || text==='CORRIDA'){
        var target=el.getAttribute('data-s')||el.getAttribute('data-screen')||'';
        var onclick=el.getAttribute('onclick')||'';
        if(text.indexOf('ANALIS')!==-1 || text.indexOf('ANALIZ')!==-1 || target==='trip' || onclick.indexOf('trip')!==-1){
          el.remove();
        }
      }
    });

    var nav=document.querySelector('.nav');
    if(nav) nav.style.setProperty('grid-template-columns','repeat(4,1fr)','important');

    if(document.querySelector('.screen.on#trip')){
      document.querySelectorAll('.screen').forEach(function(s){s.classList.toggle('on',s.id==='home');});
      document.querySelectorAll('.nav button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-s')==='home');});
    }

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
  var observer=new MutationObserver(removeAnalyzer);
  observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
  setTimeout(removeAnalyzer,0);
  setTimeout(removeAnalyzer,100);
  setTimeout(removeAnalyzer,500);
})();
