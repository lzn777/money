(function(){
  if(window.__rotaV12) return; window.__rotaV12=true;
  const $x=id=>document.getElementById(id), money=v=>(+v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}), num=v=>Math.max(0,parseFloat(v)||0);
  d.s={goal:300,fuel:6,kml:10,maint:.22,minKm:1.3,minHour:30,...(d.s||{})};
  const css=document.createElement('style'); css.textContent=`
    .top{display:flex;align-items:center;justify-content:space-between}.gearV12{border:1px solid #1d3d4a;background:#0b1b24;color:#fff;border-radius:11px;width:40px;height:40px;font-size:18px}
    .v12verdict{border-radius:14px;padding:13px;text-align:center;font-weight:1000;font-size:17px;margin:10px 0}.v12good{background:#173a1f;border:1px solid #3f9d38;color:#bfffa1}.v12warn{background:#3b2f12;border:1px solid #7f6420;color:#ffe29b}.v12bad{background:#3a171d;border:1px solid #7f2e3a;color:#ffc1ca}
    .v12line{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #15313d}.v12line:last-child{border-bottom:0}.v12line span{color:#8fa5af}.v12line strong{text-align:right}
    .v12ins{border-left:3px solid #73ed25;padding:10px 12px;background:#081820;border-radius:0 12px 12px 0;margin:8px 0}.v12ins b{display:block;margin-bottom:3px}
    .v12tabs{display:flex;gap:7px;margin:10px 0}.v12tab{flex:1;border:1px solid #244654;background:#081720;color:#9fb0b8;border-radius:10px;padding:9px;font-weight:800}.v12tab.on{color:#091307;background:#73ed25;border-color:#73ed25}
    .v12bar{display:grid;grid-template-columns:70px 1fr 68px;gap:8px;align-items:center;margin:9px 0;font-size:11px}.v12bg{height:8px;background:#173642;border-radius:8px;overflow:hidden}.v12bg i{display:block;height:100%;background:#73ed25}
  `; document.head.appendChild(css);

  const top=document.querySelector('.top'); if(top && !document.querySelector('.gearV12')){const g=document.createElement('button');g.className='gearV12';g.textContent='⚙';g.onclick=()=>go('settings');top.appendChild(g)}

  function baseKmCost(){return d.s.fuel/Math.max(.1,d.s.kml)+d.s.maint}
  function jnums(w){
    const end=w.end||new Date().toISOString();
    const tr=d.t.filter(x=>x.ok&&new Date(x.at)>=new Date(w.start)&&new Date(x.at)<=new Date(end));
    const fi=d.f.filter(x=>new Date(x.at)>=new Date(w.start)&&new Date(x.at)<=new Date(end));
    let gross=tr.reduce((s,x)=>s+num(x.fare),0)+fi.filter(x=>x.type==='income').reduce((s,x)=>s+num(x.amount),0);
    let km=num(w.km),vehicle=km*baseKmCost(),extras=tr.reduce((s,x)=>s+num(x.extra),0),manual=fi.filter(x=>x.type==='expense').reduce((s,x)=>s+num(x.amount),0),cost=vehicle+extras+manual,profit=gross-cost;
    return {gross,km,vehicle,extras,manual,cost,profit,n:tr.length,rh:num(w.ms)?profit/(num(w.ms)/36e5):0,rkm:km?profit/km:0}
  }
  function shortDur(ms){let m=Math.floor(num(ms)/60000),h=Math.floor(m/60);return h+'h '+(m%60)+'min'}
  function verdict(j){if(j.profit>=d.s.goal)return['v12good','META BATIDA 🚀'];if(j.rkm>=d.s.minKm&&j.rh>=d.s.minHour)return['v12good','SUA JORNADA FOI BOA ✅'];if(j.profit>=d.s.goal*.7)return['v12warn','QUASE LÁ — ABAIXO DA META ⚠️'];return['v12bad','JORNADA ABAIXO DA META ⚠️']}
  window.showJourneyV12=function(w){
    const j=jnums(w),v=verdict(j),pct=d.s.goal?Math.max(0,j.profit/d.s.goal*100):0;
    summaryBody.innerHTML=`<div style="text-align:center"><div class="ey">HOJE VOCÊ TRABALHOU</div><div class="big green" style="font-size:35px">${shortDur(w.ms)}</div><div class="muted">${tm(w.start)} – ${tm(w.end)}</div></div><div class="v12verdict ${v[0]}">${v[1]}</div><div class="card"><div class="v12line"><span>Faturou</span><strong>${money(j.gross)}</strong></div><div class="v12line"><span>Rodou</span><strong>${j.km.toFixed(1)} km</strong></div><div class="v12line"><span>Custos</span><strong class="red">− ${money(j.cost)}</strong></div><div class="v12line"><span>Lucro real</span><strong class="green">${money(j.profit)}</strong></div><div class="v12line"><span>Ganhou por hora</span><strong>${money(j.rh)}/h</strong></div><div class="v12line"><span>Ganhou por km</span><strong>${money(j.rkm)}/km</strong></div><div class="v12line"><span>Corridas</span><strong>${j.n}</strong></div><div class="v12line"><span>Meta diária</span><strong>${pct.toFixed(0)}%</strong></div></div><div class="card"><div class="ey">DETALHE DOS CUSTOS</div><div class="v12line"><span>Combustível + manutenção</span><strong>${money(j.vehicle)}</strong></div><div class="v12line"><span>Pedágios/extras</span><strong>${money(j.extras)}</strong></div><div class="v12line"><span>Despesas lançadas</span><strong>${money(j.manual)}</strong></div></div>`;
    summary.showModal();
  };

  stopWork=function(){if(!d.active)return;ask('Encerrar jornada',v=>{let w=d.active;if(v<w.odo)return alert('KM final menor que o inicial.');if(w.pauseAt){w.paused+=Date.now()-new Date(w.pauseAt).getTime();w.pauseAt=null}w.cur=v;w.end=new Date().toISOString();w.ms=elapsed(w);w.km=v-w.odo;let j=jnums(w);w.g=j.gross;w.c=j.cost;w.p=j.profit;w.n=j.n;d.w.unshift(w);d.active=null;save();showJourneyV12(w)})};

  if(!$x('updKmV12')){const stop=$x('stop'); if(stop){const b=document.createElement('button');b.id='updKmV12';b.className='btn secondary hide';b.textContent='🚗 Atualizar KM';b.onclick=()=>{if(!d.active)return;ask('Atualizar quilometragem',v=>{if(v<d.active.odo)return alert('KM menor que o inicial.');d.active.cur=v;save()})};stop.parentElement.insertBefore(b,stop)}}
  const oldRW=renderWork; renderWork=function(){oldRW();const b=$x('updKmV12');if(b)b.classList.toggle('hide',!d.active)};

  function period(h){if(h>=5&&h<9)return'05h–09h';if(h>=9&&h<13)return'09h–13h';if(h>=13&&h<17)return'13h–17h';if(h>=17&&h<21)return'17h–21h';if(h>=21||h<1)return'21h–01h';return'01h–05h'}
  const week=['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
  function rangeDate(n){if(!n)return new Date(0);let x=new Date();x.setHours(0,0,0,0);x.setDate(x.getDate()-(n-1));return x}
  function ray(n){
    let cut=rangeDate(n),tr=d.t.filter(x=>x.ok&&new Date(x.at)>=cut),all=d.t.filter(x=>new Date(x.at)>=cut),fi=d.f.filter(x=>new Date(x.at)>=cut),ws=d.w.filter(x=>new Date(x.end||x.start)>=cut);
    let hours=ws.reduce((s,x)=>s+num(x.ms),0)/36e5,km=ws.reduce((s,x)=>s+num(x.km),0); if(!km)km=tr.reduce((s,x)=>s+num(x.km),0);
    let inc=fi.filter(x=>x.type==='income').reduce((s,x)=>s+num(x.amount),0),exp=fi.filter(x=>x.type==='expense').reduce((s,x)=>s+num(x.amount),0),gross=tr.reduce((s,x)=>s+num(x.fare),0)+inc;
    let vehicle=km*baseKmCost(),extras=tr.reduce((s,x)=>s+num(x.extra),0),cost=vehicle+extras+exp,profit=gross-cost,apps={},periods={},days={},bad=0;
    tr.forEach(x=>{let p=num(x.fare)-num(x.cost||0);apps[x.platform]=(apps[x.platform]||0)+p;let pl=period(new Date(x.at).getHours());periods[pl]=(periods[pl]||0)+p;let key=new Date(x.at).toISOString().slice(0,10);days[key]=(days[key]||0)+p;let rkm=num(x.km)?p/num(x.km):0,rh=num(x.mins)?p/(num(x.mins)/60):0;if(rkm<d.s.minKm||rh<d.s.minHour)bad+=num(x.cost||0)});
    let bestApp=Object.entries(apps).sort((a,b)=>b[1]-a[1])[0],bestPeriod=Object.entries(periods).sort((a,b)=>b[1]-a[1])[0],wd={};Object.entries(days).forEach(([k,v])=>{let q=new Date(k+'T12:00:00').getDay();(wd[q]??=[]).push(v)});let worst=Object.entries(wd).map(([k,v])=>[+k,v.reduce((a,b)=>a+b,0)/v.length]).sort((a,b)=>a[1]-b[1])[0],positive=Object.values(apps).reduce((s,x)=>s+Math.max(0,x),0),share=bestApp&&positive?Math.max(0,bestApp[1])/positive*100:0;
    return{tr,fi,hours,km,gross,cost,profit,apps,bestApp,bestPeriod,worst,share,bad,avg:tr.length?gross/tr.length:0,rh:hours?profit/hours:0,rkm:km?profit/km:0,accept:all.length?tr.length/all.length*100:0}
  }
  let rdays=30;
  function renderRay(){
    const panel=$x('panel');if(!panel)return;let box=$x('rayV12');if(!box){box=document.createElement('div');box.id='rayV12';panel.insertBefore(box,panel.children[1]||null)}
    let r=ray(rdays),ba=r.bestApp?r.bestApp[0]:'—',bp=r.bestPeriod?r.bestPeriod[0]:'—',wd=r.worst?week[r.worst[0]]:'—',lab=rdays?`últimos ${rdays} dias`:'todo o período';
    box.innerHTML=`<div class="v12tabs"><button class="v12tab ${rdays===7?'on':''}" onclick="window.setRayV12(7)">7 dias</button><button class="v12tab ${rdays===30?'on':''}" onclick="window.setRayV12(30)">30 dias</button><button class="v12tab ${rdays===0?'on':''}" onclick="window.setRayV12(0)">Total</button></div><div class="card"><div class="ey">RAIO-X · ${lab}</div><div class="big green">${money(r.profit)}</div><div class="muted">lucro real estimado</div><div class="grid" style="margin-top:10px"><div class="stat"><small>Trabalhou</small><strong>${r.hours.toFixed(1)} h</strong></div><div class="stat"><small>Faturou</small><strong>${money(r.gross)}</strong></div><div class="stat"><small>Rodou</small><strong>${r.km.toFixed(0)} km</strong></div><div class="stat"><small>Custos</small><strong>${money(r.cost)}</strong></div><div class="stat"><small>R$/hora</small><strong>${money(r.rh)}</strong></div><div class="stat"><small>R$/km</small><strong>${money(r.rkm)}</strong></div></div></div><div class="card"><div class="v12ins"><b>🏆 Melhor aplicativo</b>${ba}${r.bestApp?` representou ${r.share.toFixed(0)}% do lucro positivo entre os apps.`:''}</div><div class="v12ins"><b>⏰ Melhor período</b>${bp} foi o horário com maior lucro registrado.</div><div class="v12ins"><b>📉 Dia mais fraco</b>${wd} teve a menor média entre os dias trabalhados.</div><div class="v12ins"><b>💡 Economia potencial estimada</b>Cerca de <strong>${money(r.bad)}</strong> em custos vieram de corridas abaixo das suas regras mínimas.</div></div><div class="grid"><div class="stat"><small>Ticket médio</small><strong>${money(r.avg)}</strong></div><div class="stat"><small>Taxa de aceitas</small><strong>${r.accept.toFixed(0)}%</strong></div></div><h2>Lucro por aplicativo</h2><div id="appsV12"></div><h2>Despesas por categoria</h2><div id="catsV12"></div>`;
    let ae=Object.entries(r.apps).sort((a,b)=>b[1]-a[1]),mx=Math.max(1,...ae.map(x=>Math.max(0,x[1])));appsV12.innerHTML=ae.map(([k,v])=>`<div class="v12bar"><b>${k}</b><div class="v12bg"><i style="width:${Math.max(2,Math.max(0,v)/mx*100)}%"></i></div><strong>${money(v)}</strong></div>`).join('')||'<div class="muted">Registre corridas para comparar.</div>';
    let cats={};r.fi.filter(x=>x.type==='expense').forEach(x=>cats[x.cat]=(cats[x.cat]||0)+num(x.amount));let ce=Object.entries(cats).sort((a,b)=>b[1]-a[1]),cm=Math.max(1,...ce.map(x=>x[1]));catsV12.innerHTML=ce.map(([k,v])=>`<div class="v12bar"><b>${k}</b><div class="v12bg"><i style="width:${v/cm*100}%"></i></div><strong>${money(v)}</strong></div>`).join('')||'<div class="muted">Sem despesas lançadas.</div>';
  }
  window.setRayV12=n=>{rdays=n;renderRay()};
  const oldRP=renderPanel;renderPanel=function(){oldRP();renderRay()};

  const oldRH=renderHist;renderHist=function(){oldRH();document.querySelectorAll('#hist .item').forEach((el,i)=>{let txt=el.textContent||'';if(txt.includes('Jornada')){el.style.cursor='pointer';let m=txt.match(/Jornada/);if(m){const journeys=d.w.slice();let label=el.querySelector('strong')?.textContent||'';let w=journeys.find(j=>label.includes(dt(j.start)));if(w)el.onclick=()=>showJourneyV12(w)}}})};

  const set=$x('settings'); if(set && !$x('minKmV12')){const btn=set.querySelector('button.primary'); if(btn){const wrap=document.createElement('div');wrap.innerHTML=`<div class="grid"><label>Mínimo líquido (R$/km)<input id="minKmV12" type="number" step="0.01" value="${d.s.minKm}"></label><label>Mínimo líquido (R$/hora)<input id="minHourV12" type="number" step="0.01" value="${d.s.minHour}"></label></div>`;btn.parentElement.insertBefore(wrap,btn);const oldSave=saveSettings;saveSettings=function(){d.s.minKm=num(minKmV12.value);d.s.minHour=num(minHourV12.value);oldSave()}}}
  render();
})();
