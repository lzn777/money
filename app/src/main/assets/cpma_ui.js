(function(){
  if(window.__rotaCpmaUi) return; window.__rotaCpmaUi=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const brl=v=>(Number(v)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const num=v=>Math.max(0,Number(String(v??'').replace(',','.'))||0);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uid=()=>crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random());

  const css=document.createElement('style');
  css.textContent=`
    .top,.topbar{position:relative!important;min-height:58px!important;display:flex!important;align-items:center!important;justify-content:flex-end!important}
    .top .brand,.topbar .brand{position:absolute!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;width:max-content!important;max-width:72%!important;margin:0!important;padding:0 4px!important;text-align:center!important;background:transparent!important;border:0!important}
    .top .brand strong,.topbar .brand strong{display:block!important;white-space:nowrap!important;text-align:center!important;font-size:18px!important;line-height:1!important;letter-spacing:.02em!important;font-weight:1000!important}
    .top .brand small,.topbar .brand small{display:none!important}
    .top .brand img,.topbar .brand img{width:34px!important;height:34px!important;flex:0 0 auto!important}
    .header-gear,.gearV12{position:relative!important;z-index:4!important;margin-left:auto!important}
    .cpma-manage-btn{width:100%;margin:10px 0 14px;border:1px solid #2b5362;background:linear-gradient(145deg,#0e2732,#091a23);color:#eef8fb;border-radius:16px;padding:13px 14px;display:flex;align-items:center;justify-content:space-between;gap:12px;text-align:left;box-shadow:0 12px 28px rgba(0,0,0,.16)}
    .cpma-manage-btn span{display:flex;align-items:center;gap:10px}.cpma-manage-btn i{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;background:rgba(115,237,37,.11);color:#bdfc9d;font-style:normal;font-size:18px}.cpma-manage-btn b{display:block;font-size:12px}.cpma-manage-btn small{display:block;color:#7f9aa5;font-size:8px;margin-top:2px}.cpma-manage-btn em{font-style:normal;color:#8da4ad;font-size:18px}
    .cpma-modal{position:fixed;z-index:9999;inset:0;background:rgba(0,5,8,.86);backdrop-filter:blur(9px);display:flex;align-items:flex-end;justify-content:center;padding:0}.cpma-modal.hide{display:none}
    .cpma-sheet{width:min(560px,100%);max-height:92dvh;overflow:auto;background:linear-gradient(180deg,#0b202b,#06151d);border:1px solid #234653;border-bottom:0;border-radius:24px 24px 0 0;padding:18px 15px calc(20px + env(safe-area-inset-bottom));box-shadow:0 -30px 80px rgba(0,0,0,.55)}
    .cpma-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}.cpma-head h2{margin:0;font-size:22px;letter-spacing:-.03em}.cpma-head p{margin:3px 0 0;color:#7c98a3;font-size:9px}.cpma-close{width:38px;height:38px;border-radius:12px;border:1px solid #274957;background:#0a1a23;color:#dbe8ed;font-size:20px}
    .cpma-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:10px 0 14px}.cpma-tab{border:1px solid #244653;background:#071821;color:#7896a1;border-radius:12px;padding:10px 5px;font-size:9px;font-weight:900}.cpma-tab.on{background:#73ed25;border-color:#73ed25;color:#091507}
    .cpma-list{display:flex;flex-direction:column;gap:9px}.cpma-row{border:1px solid #1c3d4a;background:linear-gradient(145deg,#0b222e,#071720);border-radius:16px;padding:12px}.cpma-row-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.cpma-row-title{display:flex;gap:9px;align-items:center;min-width:0}.cpma-row-icon{width:34px;height:34px;border-radius:10px;background:#0e3341;color:#abf984;display:grid;place-items:center;font-weight:1000}.cpma-row-title small{display:block;color:#708e99;font-size:7px}.cpma-row-title strong{display:block;font-size:12px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:210px}.cpma-row-value{text-align:right}.cpma-row-value strong{font-size:12px}.cpma-row-meta{display:flex;flex-wrap:wrap;gap:5px 9px;margin-top:8px;color:#7895a0;font-size:8px}.cpma-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:10px}.cpma-actions button{border-radius:11px;padding:9px;border:1px solid #274957;background:#0b2029;color:#c8d7dc;font-size:9px;font-weight:900}.cpma-actions .edit{border-color:rgba(115,237,37,.28);color:#bdfc9d;background:rgba(115,237,37,.06)}.cpma-actions .del{border-color:rgba(255,103,122,.28);color:#ff9eaa;background:rgba(255,103,122,.05)}
    .cpma-empty{padding:28px 18px;text-align:center;color:#77939e;border:1px dashed #234754;border-radius:16px;font-size:10px;line-height:1.5}
    .cpma-form label{display:block;color:#9eb1b9;font-size:9px;font-weight:850;margin:10px 0}.cpma-form input,.cpma-form select,.cpma-form textarea{width:100%;margin-top:6px;border:1px solid #274957;background:#04121a;color:#f4fbfd;border-radius:12px;padding:12px;font-size:14px;outline:none}.cpma-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.cpma-form-actions{display:grid;grid-template-columns:1fr 1.3fr;gap:8px;margin-top:16px}.cpma-form-actions button{border:0;border-radius:13px;padding:13px;font-weight:950}.cpma-cancel{background:#132a34;color:#b9c9cf}.cpma-save{background:#73ed25;color:#071006}
    @media(max-width:380px){.top .brand strong,.topbar .brand strong{font-size:16px!important}.top .brand img,.topbar .brand img{width:30px!important;height:30px!important}.cpma-grid{grid-template-columns:1fr}.cpma-row-title strong{max-width:165px}}
  `;
  document.head.appendChild(css);

  function centerBrand(){
    const brand=$('.top .brand,.topbar .brand'); if(!brand)return;
    const strong=$('strong',brand); if(strong) strong.textContent='ROTA LUCRO';
  }

  function stateOK(){return typeof d==='object'&&d&&Array.isArray(d.t)&&Array.isArray(d.w)&&Array.isArray(d.f)}
  function saveAll(){try{if(typeof save==='function')save()}catch(e){}; try{if(typeof renderHist==='function')renderHist()}catch(e){}; try{if(typeof renderPanel==='function')renderPanel()}catch(e){}; try{if(typeof renderWork==='function')renderWork()}catch(e){};}
  function dtLocal(x){try{return new Date(x).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}catch(e){return'—'}}

  const modal=document.createElement('div'); modal.className='cpma-modal hide'; modal.innerHTML=`<div class="cpma-sheet"><div class="cpma-head"><div><h2>Gerenciar registros</h2><p>Edite ou exclua informações salvas no Rota Lucro.</p></div><button class="cpma-close" type="button">×</button></div><div class="cpma-tabs"><button class="cpma-tab on" data-tab="trips">Corridas</button><button class="cpma-tab" data-tab="work">Jornadas</button><button class="cpma-tab" data-tab="finance">Financeiro</button></div><div class="cpma-list"></div></div>`; document.body.appendChild(modal);
  let tab='trips';
  $('.cpma-close',modal).onclick=()=>modal.classList.add('hide'); modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.add('hide')});
  $$('.cpma-tab',modal).forEach(b=>b.onclick=()=>{tab=b.dataset.tab;$$('.cpma-tab',modal).forEach(x=>x.classList.toggle('on',x===b));renderManager()});

  const editModal=document.createElement('div'); editModal.className='cpma-modal hide'; editModal.innerHTML=`<div class="cpma-sheet"><div class="cpma-head"><div><h2 id="cpmaEditTitle">Editar registro</h2><p>Corrija os dados e toque em salvar.</p></div><button class="cpma-close" type="button">×</button></div><form class="cpma-form" id="cpmaEditForm"><div id="cpmaFields"></div><div class="cpma-form-actions"><button class="cpma-cancel" type="button">Cancelar</button><button class="cpma-save" type="submit">Salvar alterações</button></div></form></div>`; document.body.appendChild(editModal);
  $('.cpma-close',editModal).onclick=$('.cpma-cancel',editModal).onclick=()=>editModal.classList.add('hide'); editModal.addEventListener('click',e=>{if(e.target===editModal)editModal.classList.add('hide')});
  let editing=null;

  function addManageButton(){
    const hist=$('#hist,#history'); if(!hist||$('#cpmaManageBtn',hist))return;
    const btn=document.createElement('button');btn.id='cpmaManageBtn';btn.className='cpma-manage-btn';btn.type='button';btn.innerHTML='<span><i>⋮</i><span><b>Gerenciar registros</b><small>Editar ou excluir corridas, jornadas e lançamentos</small></span></span><em>›</em>';btn.onclick=()=>{tab='trips';$$('.cpma-tab',modal).forEach(x=>x.classList.toggle('on',x.dataset.tab==='trips'));renderManager();modal.classList.remove('hide')};
    const h=hist.querySelector('h1,h2,.section-head,.top'); if(h&&h.parentElement===hist)h.insertAdjacentElement('afterend',btn); else hist.insertBefore(btn,hist.firstChild);
  }

  function tripCost(t){
    const km=num(t.km)||num(t.pickupKm)+num(t.tripKm), mins=num(t.totalMinutes||t.minutes)+num(t.waitMinutes), extra=num(t.extraCost||t.extra), fuel=num(d.s?.fuel||d.s?.fuelPrice||6), kml=Math.max(.1,num(d.s?.kml||d.s?.kmPerLiter||10)), maint=num(d.s?.maint||d.s?.maintenanceKm||.22), other=num(d.s?.other||d.s?.otherKm||0), cost=km*(fuel/kml+maint+other)+extra, fare=num(t.fare), net=fare-cost;
    return {km,mins,cost,net,netKm:km?net/km:0,grossHour:mins?fare/(mins/60):0};
  }

  function renderManager(){
    const list=$('.cpma-list',modal); if(!stateOK()){list.innerHTML='<div class="cpma-empty">Os dados ainda estão carregando. Feche e abra novamente em alguns segundos.</div>';return}
    let arr=[];
    if(tab==='trips') arr=d.t.map((x,i)=>({x,i}));
    if(tab==='work') arr=d.w.map((x,i)=>({x,i}));
    if(tab==='finance') arr=d.f.map((x,i)=>({x,i}));
    if(!arr.length){list.innerHTML='<div class="cpma-empty">Nenhum registro nesta categoria.</div>';return}
    list.innerHTML=arr.slice(0,250).map(({x,i})=>{
      if(tab==='trips'){
        const m=tripCost(x),dec=x.ok===false||x.decision==='rejected'?'Recusada':'Aceita';return `<article class="cpma-row"><div class="cpma-row-top"><div class="cpma-row-title"><span class="cpma-row-icon">🚗</span><div><small>${esc(dec.toUpperCase())}</small><strong>${esc(x.platform||x.app||'Outro')} · ${brl(x.fare)}</strong></div></div><div class="cpma-row-value"><strong>${brl(m.net)}</strong></div></div><div class="cpma-row-meta"><span>${m.km.toFixed(1).replace('.',',')} km</span><span>${Math.round(m.mins)} min</span><span>${dtLocal(x.at||x.createdAt)}</span></div><div class="cpma-actions"><button class="edit" data-edit="${i}">✎ Editar</button><button class="del" data-del="${i}">🗑 Excluir</button></div></article>`;
      }
      if(tab==='work') return `<article class="cpma-row"><div class="cpma-row-top"><div class="cpma-row-title"><span class="cpma-row-icon">◷</span><div><small>JORNADA</small><strong>${dtLocal(x.start||x.startedAt)}</strong></div></div><div class="cpma-row-value"><strong>${num(x.km).toFixed(1).replace('.',',')} km</strong></div></div><div class="cpma-row-meta"><span>${Math.round(num(x.ms||x.durationMs)/60000)} min trabalhados</span><span>${x.n||x.count||0} corridas</span></div><div class="cpma-actions"><button class="edit" data-edit="${i}">✎ Editar</button><button class="del" data-del="${i}">🗑 Excluir</button></div></article>`;
      const income=x.type==='income',cat=x.cat||x.category||'Outros'; return `<article class="cpma-row"><div class="cpma-row-top"><div class="cpma-row-title"><span class="cpma-row-icon">${income?'+':'−'}</span><div><small>${income?'RECEITA':'DESPESA'}</small><strong>${esc(cat)}</strong></div></div><div class="cpma-row-value"><strong>${income?'+':'−'} ${brl(x.amount)}</strong></div></div><div class="cpma-row-meta"><span>${esc(x.platform||'—')}</span><span>${esc(x.payment||'')}</span><span>${dtLocal(x.at||x.date||x.createdAt)}</span></div><div class="cpma-actions"><button class="edit" data-edit="${i}">✎ Editar</button><button class="del" data-del="${i}">🗑 Excluir</button></div></article>`;
    }).join('');
    $$('[data-edit]',list).forEach(b=>b.onclick=()=>openEdit(tab,Number(b.dataset.edit)));
    $$('[data-del]',list).forEach(b=>b.onclick=()=>removeItem(tab,Number(b.dataset.del)));
  }

  function removeItem(kind,index){
    const names={trips:'esta corrida',work:'esta jornada',finance:'este lançamento'}; if(!confirm('Excluir '+names[kind]+'? Essa ação não pode ser desfeita.'))return;
    if(kind==='trips')d.t.splice(index,1); if(kind==='work')d.w.splice(index,1); if(kind==='finance')d.f.splice(index,1); saveAll();renderManager();
  }

  function openEdit(kind,index){
    editing={kind,index}; const x=kind==='trips'?d.t[index]:kind==='work'?d.w[index]:d.f[index]; if(!x)return;
    const f=$('#cpmaFields',editModal); $('#cpmaEditTitle',editModal).textContent=kind==='trips'?'Editar corrida':kind==='work'?'Editar jornada':'Editar lançamento';
    if(kind==='trips') f.innerHTML=`<label>Aplicativo<input name="platform" value="${esc(x.platform||x.app||'')}"></label><div class="cpma-grid"><label>Valor da corrida (R$)<input name="fare" type="number" step="0.01" value="${num(x.fare)}"></label><label>Decisão<select name="decision"><option value="accepted" ${(x.ok!==false&&x.decision!=='rejected')?'selected':''}>Aceita</option><option value="rejected" ${(x.ok===false||x.decision==='rejected')?'selected':''}>Recusada</option></select></label></div><div class="cpma-grid"><label>Km até buscar<input name="pickupKm" type="number" step="0.1" value="${num(x.pickupKm)}"></label><label>Km da viagem<input name="tripKm" type="number" step="0.1" value="${num(x.tripKm||Math.max(0,num(x.km)-num(x.pickupKm)))}"></label></div><div class="cpma-grid"><label>Tempo (min)<input name="minutes" type="number" step="1" value="${num(x.minutes||x.totalMinutes)}"></label><label>Custos extras (R$)<input name="extraCost" type="number" step="0.01" value="${num(x.extraCost||x.extra)}"></label></div>`;
    else if(kind==='work') f.innerHTML=`<div class="cpma-grid"><label>Km rodados<input name="km" type="number" step="0.1" value="${num(x.km)}"></label><label>Tempo trabalhado (min)<input name="mins" type="number" step="1" value="${Math.round(num(x.ms||x.durationMs)/60000)}"></label></div><label>Odômetro inicial<input name="odo" type="number" step="0.1" value="${num(x.odo||x.startOdometer)}"></label>`;
    else {const cat=x.cat||x.category||'';f.innerHTML=`<div class="cpma-grid"><label>Tipo<select name="type"><option value="expense" ${x.type!=='income'?'selected':''}>Despesa</option><option value="income" ${x.type==='income'?'selected':''}>Receita</option></select></label><label>Valor (R$)<input name="amount" type="number" step="0.01" value="${num(x.amount)}"></label></div><label>Categoria<input name="cat" value="${esc(cat)}"></label><div class="cpma-grid"><label>Aplicativo<input name="platform" value="${esc(x.platform||'')}"></label><label>Pagamento<input name="payment" value="${esc(x.payment||'')}"></label></div><label>Observação<textarea name="note" rows="2">${esc(x.note||'')}</textarea></label>`;}
    editModal.classList.remove('hide');
  }

  $('#cpmaEditForm',editModal).onsubmit=e=>{
    e.preventDefault(); if(!editing||!stateOK())return; const fd=new FormData(e.currentTarget),kind=editing.kind,index=editing.index,x=kind==='trips'?d.t[index]:kind==='work'?d.w[index]:d.f[index]; if(!x)return;
    if(kind==='trips'){
      x.platform=String(fd.get('platform')||'Outro').trim()||'Outro'; x.fare=num(fd.get('fare')); x.pickupKm=num(fd.get('pickupKm')); x.tripKm=num(fd.get('tripKm')); x.minutes=num(fd.get('minutes')); x.totalMinutes=x.minutes+num(x.waitMinutes); x.extraCost=num(fd.get('extraCost')); x.extra=x.extraCost; x.decision=fd.get('decision'); x.ok=x.decision==='accepted'; const m=tripCost(x); x.km=m.km; x.cost=m.cost; x.net=m.net; x.netKm=m.netKm; x.grossHour=m.grossHour;
    } else if(kind==='work'){
      x.km=num(fd.get('km')); const ms=num(fd.get('mins'))*60000; x.ms=ms; x.durationMs=ms; const od=num(fd.get('odo')); if('odo'in x)x.odo=od; if('startOdometer'in x)x.startOdometer=od; if('cur'in x)x.cur=od+x.km; if('endOdometer'in x)x.endOdometer=od+x.km;
    } else {
      x.type=fd.get('type'); x.amount=num(fd.get('amount')); const cat=String(fd.get('cat')||'Outros').trim()||'Outros'; x.cat=cat; x.category=cat; x.platform=String(fd.get('platform')||'—').trim()||'—'; x.payment=String(fd.get('payment')||'').trim(); x.note=String(fd.get('note')||'').trim();
    }
    saveAll(); editModal.classList.add('hide'); renderManager();
  };

  function patchRenders(){
    if(typeof renderHist==='function'&&!renderHist.__cpma){const old=renderHist;const wrapped=function(){const r=old.apply(this,arguments);setTimeout(addManageButton,0);return r};wrapped.__cpma=true;renderHist=wrapped}
  }

  centerBrand(); addManageButton(); patchRenders();
  const obs=new MutationObserver(()=>{centerBrand();addManageButton()}); obs.observe(document.body,{childList:true,subtree:true});
})();
