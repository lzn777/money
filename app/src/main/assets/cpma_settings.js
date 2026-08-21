(function(){
  if(window.__rotaConfigHub) return;
  window.__rotaConfigHub=true;

  const Q=(s,r=document)=>r.querySelector(s), QA=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const KEY='rotaLucroConfigHubV1';
  const defaults={
    theme:'system',weeklyGoal:1800,monthlyGoal:7500,annualGoal:90000,
    minKm:1.30,minHour:30,otherKm:0.10,dashboardPeriod:'30',
    origins:['Uber','99','inDrive','Cabify','Particular','Outro'],
    payments:['Pix','Dinheiro','Débito','Crédito','Outro'],
    expenseCats:['Combustível','Pedágio','Estacionamento','Alimentação','Lavagem','Manutenção','Pneus','Seguro','Parcela/Aluguel','Impostos/Taxas','Outra despesa'],
    incomeCats:['Bônus','Gorjeta','Corrida particular','Ajuste','Reembolso','Outra receita'],
    subcats:['Combustível','Manutenção preventiva','Manutenção corretiva','Pedágio','Estacionamento','Lavagem','Alimentação','Seguro','Impostos']
  };
  let cfg={...defaults,...load()};
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return{}}}
  function persist(){localStorage.setItem(KEY,JSON.stringify(cfg));}
  function n(v,d=0){v=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(v)?v:d}
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  const style=document.createElement('style');style.id='rotaConfigThemeCss';style.textContent=`
    :root[data-rl-theme="light"]{--b:#f2f5f7!important;--p:#ffffff!important;--l:#d9e2e7!important;--g:#45b91a!important;--t:#102129!important;--m:#617680!important;--r:#d94a5b!important}
    :root[data-rl-theme="light"] body{background:linear-gradient(#f7f9fa,#e9eff2)!important;color:#102129!important}
    :root[data-rl-theme="light"] .top{background:#f7f9faf2!important;color:#102129!important}
    :root[data-rl-theme="light"] .card{background:linear-gradient(145deg,#fff,#f5f8fa)!important;border-color:#d7e1e6!important;box-shadow:0 8px 22px rgba(20,45,55,.07)}
    :root[data-rl-theme="light"] .stat,:root[data-rl-theme="light"] .item{background:#fff!important;border-color:#d8e3e8!important;color:#102129!important}
    :root[data-rl-theme="light"] input,:root[data-rl-theme="light"] select,:root[data-rl-theme="light"] textarea{background:#fff!important;color:#102129!important;border-color:#cbd9df!important}
    :root[data-rl-theme="light"] .nav{background:#fffef8!important;border-color:#d9e2e7!important;box-shadow:0 -6px 24px rgba(20,45,55,.08)}
    :root[data-rl-theme="light"] .secondary{background:#eef3f5!important;color:#1a313b!important;border-color:#cbd9df!important}
    :root[data-rl-theme="light"] dialog,:root[data-rl-theme="light"] .cpma-sheet{background:#f8fbfc!important;color:#102129!important;border-color:#ccdce3!important}
    :root[data-rl-theme="light"] .cpma-row,:root[data-rl-theme="light"] .cpma-manage-btn{background:#fff!important;color:#102129!important;border-color:#d4e1e7!important}
    :root[data-rl-theme="light"] .cpma-modal{background:rgba(225,235,240,.72)!important}
    .rlhub{margin:14px 0 28px}.rlhub-title{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:18px 0 8px}.rlhub-title h3{margin:0;font-size:15px}.rlhub-title small{color:var(--m);font-size:9px}
    .rlhub-card{background:linear-gradient(145deg,#102633,var(--p));border:1px solid var(--l);border-radius:17px;padding:13px;margin:9px 0}.rlhub-card h4{margin:0 0 5px;font-size:12px}.rlhub-card p{margin:0 0 10px;color:var(--m);font-size:9px;line-height:1.45}
    .rlhub-seg{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.rlhub-seg button{border:1px solid var(--l);background:#091923;color:var(--m);border-radius:11px;padding:10px 5px;font-size:9px;font-weight:900}.rlhub-seg button.on{background:var(--g);border-color:var(--g);color:#071307}
    :root[data-rl-theme="light"] .rlhub-seg button{background:#eef3f5;color:#526a74;border-color:#cad8de}:root[data-rl-theme="light"] .rlhub-seg button.on{background:var(--g);color:white;border-color:var(--g)}
    .rlhub-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.rlhub-card label{font-size:9px;margin:8px 0}.rlhub-card input,.rlhub-card select{font-size:14px;padding:11px}
    .rlchips{display:flex;flex-wrap:wrap;gap:6px;margin:7px 0}.rlchip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--l);background:#091923;border-radius:999px;padding:7px 9px;font-size:9px}.rlchip button{border:0;background:none;color:var(--r);font-weight:1000;padding:0}
    :root[data-rl-theme="light"] .rlchip{background:#f4f8fa;border-color:#cedce2}
    .rladd{display:flex;gap:6px}.rladd input{margin:0}.rladd button{min-width:74px;border:0;border-radius:11px;background:var(--g);color:#071307;font-weight:900}
    .rlhub-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px}.rlhub-actions button{border-radius:12px;padding:11px;border:1px solid var(--l);font-weight:900}.rlsave{background:var(--g);color:#071307;border-color:var(--g)!important}.rlsoft{background:#0b1b24;color:#fff}.rlwarn{background:#34171d;color:#ffc1ca;border-color:#6a2b35!important}
    :root[data-rl-theme="light"] .rlsoft{background:#eef3f5;color:#17313b}.rlhub-note{font-size:8px;color:var(--m);line-height:1.45;margin-top:8px}
    @media(max-width:380px){.rlhub-grid{grid-template-columns:1fr}}
  `;document.head.appendChild(style);

  function resolvedTheme(){if(cfg.theme!=='system')return cfg.theme;return matchMedia&&matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}
  function applyTheme(){document.documentElement.dataset.rlTheme=resolvedTheme(); QA('[data-theme-choice]').forEach(b=>b.classList.toggle('on',b.dataset.themeChoice===cfg.theme));}
  try{matchMedia('(prefers-color-scheme: light)').addEventListener('change',()=>cfg.theme==='system'&&applyTheme())}catch(e){}
  applyTheme();

  function syncCore(){
    try{
      if(typeof d==='object'&&d&&d.s){
        d.s.minKm=n(cfg.minKm,1.3);d.s.minHour=n(cfg.minHour,30);d.s.other=n(cfg.otherKm,.1);d.s.otherKm=n(cfg.otherKm,.1);
        if(typeof save==='function')save();
      }
    }catch(e){}
  }

  function chipEditor(root,key){
    const box=Q('[data-chips="'+key+'"]',root),input=Q('[data-add="'+key+'"]',root),btn=Q('[data-add-btn="'+key+'"]',root);
    const paint=()=>{box.innerHTML=(cfg[key]||[]).map((v,i)=>`<span class="rlchip">${esc(v)}<button type="button" data-x="${i}">×</button></span>`).join('');QA('[data-x]',box).forEach(b=>b.onclick=()=>{cfg[key].splice(+b.dataset.x,1);persist();paint();refreshFinanceSelectors();});};
    btn.onclick=()=>{const v=input.value.trim();if(!v)return;if(!cfg[key].some(x=>x.toLowerCase()===v.toLowerCase()))cfg[key].push(v);input.value='';persist();paint();refreshFinanceSelectors();};
    input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();btn.click()}});paint();
  }

  function installHub(){
    const s=Q('#settings');if(!s||Q('#rotaConfigHub',s))return;
    const hub=document.createElement('div');hub.id='rotaConfigHub';hub.className='rlhub';hub.innerHTML=`
      <div class="rlhub-title"><h3>Central de configurações</h3><small>Rota Lucro</small></div>
      <div class="rlhub-card"><h4>◐ Aparência</h4><p>Escolha como o aplicativo deve aparecer.</p><div class="rlhub-seg"><button type="button" data-theme-choice="dark">🌙 Escuro</button><button type="button" data-theme-choice="light">☀ Claro</button><button type="button" data-theme-choice="system">◐ Automático</button></div></div>
      <div class="rlhub-card"><h4>🎯 Metas</h4><p>Metas de faturamento para acompanhar sua evolução.</p><div class="rlhub-grid"><label>Meta diária (R$)<input id="rlDaily" type="number" step="1"></label><label>Meta semanal (R$)<input id="rlWeekly" type="number" step="1"></label><label>Meta mensal (R$)<input id="rlMonthly" type="number" step="1"></label><label>Meta anual (R$)<input id="rlAnnual" type="number" step="1"></label></div></div>
      <div class="rlhub-card"><h4>🚘 Custos do veículo</h4><p>Use seus custos reais para o lucro ficar mais próximo da realidade.</p><div class="rlhub-grid"><label>Combustível R$/L<input id="rlFuel" type="number" step="0.01"></label><label>Consumo km/L<input id="rlKml" type="number" step="0.1"></label><label>Manutenção por km<input id="rlMaint" type="number" step="0.01"></label><label>Outros custos por km<input id="rlOther" type="number" step="0.01"></label></div></div>
      <div class="rlhub-card"><h4>📈 Regras de desempenho</h4><p>Parâmetros usados para avaliar sua jornada e seus indicadores.</p><div class="rlhub-grid"><label>Mínimo líquido R$/km<input id="rlMinKm" type="number" step="0.01"></label><label>Mínimo líquido R$/hora<input id="rlMinHour" type="number" step="1"></label><label>Período padrão do painel<select id="rlPeriod"><option value="7">7 dias</option><option value="30">30 dias</option><option value="365">Ano</option><option value="0">Tudo</option></select></label></div></div>
      <div class="rlhub-card"><h4>🚗 Aplicativos / Origens</h4><p>Cadastre os aplicativos e origens que aparecem nos seus lançamentos.</p><div class="rlchips" data-chips="origins"></div><div class="rladd"><input data-add="origins" placeholder="Ex.: Uber"><button data-add-btn="origins" type="button">Adicionar</button></div></div>
      <div class="rlhub-card"><h4>💳 Formas de pagamento</h4><p>Pix, dinheiro, cartão ou qualquer forma que você usar.</p><div class="rlchips" data-chips="payments"></div><div class="rladd"><input data-add="payments" placeholder="Nova forma"><button data-add-btn="payments" type="button">Adicionar</button></div></div>
      <div class="rlhub-card"><h4>− Categorias de despesas</h4><p>Personalize para onde seu dinheiro está indo.</p><div class="rlchips" data-chips="expenseCats"></div><div class="rladd"><input data-add="expenseCats" placeholder="Nova despesa"><button data-add-btn="expenseCats" type="button">Adicionar</button></div></div>
      <div class="rlhub-card"><h4>+ Categorias de entradas</h4><p>Organize bônus, gorjetas e outras receitas.</p><div class="rlchips" data-chips="incomeCats"></div><div class="rladd"><input data-add="incomeCats" placeholder="Nova entrada"><button data-add-btn="incomeCats" type="button">Adicionar</button></div></div>
      <div class="rlhub-card"><h4>▦ Subcategorias</h4><p>Crie classificações adicionais para detalhar seus lançamentos.</p><div class="rlchips" data-chips="subcats"></div><div class="rladd"><input data-add="subcats" placeholder="Nova subcategoria"><button data-add-btn="subcats" type="button">Adicionar</button></div></div>
      <div class="rlhub-card"><h4>💾 Backup e restauração</h4><p>Salve todos os registros e configurações em um arquivo e restaure quando precisar.</p><div class="rlhub-actions"><button class="rlsoft" type="button" id="rlBackup">⬇ Criar backup</button><button class="rlsoft" type="button" id="rlRestore">↥ Restaurar</button></div><input id="rlRestoreFile" type="file" accept="application/json,.json" class="hide"><div class="rlhub-note">O backup é manual e fica sob seu controle. Integração automática com Google Drive exige uma conta/API própria e não está ativada nesta versão.</div></div>
      <div class="rlhub-card"><h4>🔌 Integrações</h4><p>Integrações diretas com Uber ou serviços em nuvem precisam de credenciais oficiais e autorização do provedor.</p><div class="item"><div class="head"><strong>Uber</strong><span class="muted">Não conectado</span></div><div class="muted">O Rota Lucro continua funcionando normalmente com lançamentos locais.</div></div><div class="item"><div class="head"><strong>Google Drive</strong><span class="muted">Backup manual</span></div><div class="muted">Use o backup em arquivo acima até uma integração oficial ser configurada.</div></div></div>
      <button id="rlSaveConfig" class="btn primary full" type="button">SALVAR CONFIGURAÇÕES</button>
    `;
    s.appendChild(hub);

    Q('#rlDaily').value=(typeof d==='object'&&d?.s?.goal)||300;Q('#rlWeekly').value=cfg.weeklyGoal;Q('#rlMonthly').value=cfg.monthlyGoal;Q('#rlAnnual').value=cfg.annualGoal;
    Q('#rlFuel').value=(typeof d==='object'&&d?.s?.fuel)||6;Q('#rlKml').value=(typeof d==='object'&&d?.s?.kml)||10;Q('#rlMaint').value=(typeof d==='object'&&d?.s?.maint)||.22;Q('#rlOther').value=cfg.otherKm;Q('#rlMinKm').value=cfg.minKm;Q('#rlMinHour').value=cfg.minHour;Q('#rlPeriod').value=cfg.dashboardPeriod;

    QA('[data-theme-choice]',hub).forEach(b=>b.onclick=()=>{cfg.theme=b.dataset.themeChoice;persist();applyTheme();});
    ['origins','payments','expenseCats','incomeCats','subcats'].forEach(k=>chipEditor(hub,k));

    Q('#rlSaveConfig').onclick=()=>{
      cfg.weeklyGoal=n(Q('#rlWeekly').value,1800);cfg.monthlyGoal=n(Q('#rlMonthly').value,7500);cfg.annualGoal=n(Q('#rlAnnual').value,90000);cfg.otherKm=n(Q('#rlOther').value,.1);cfg.minKm=n(Q('#rlMinKm').value,1.3);cfg.minHour=n(Q('#rlMinHour').value,30);cfg.dashboardPeriod=Q('#rlPeriod').value;
      try{if(typeof d==='object'&&d&&d.s){d.s.goal=n(Q('#rlDaily').value,300);d.s.fuel=n(Q('#rlFuel').value,6);d.s.kml=Math.max(.1,n(Q('#rlKml').value,10));d.s.maint=n(Q('#rlMaint').value,.22);d.s.minKm=cfg.minKm;d.s.minHour=cfg.minHour;d.s.other=cfg.otherKm;d.s.otherKm=cfg.otherKm;if(typeof save==='function')save();}}catch(e){}
      persist();refreshFinanceSelectors();alert('Configurações salvas.');
    };
    Q('#rlBackup').onclick=backupAll;Q('#rlRestore').onclick=()=>Q('#rlRestoreFile').click();Q('#rlRestoreFile').onchange=restoreAll;
    applyTheme();refreshFinanceSelectors();syncCore();
  }

  function refreshFinanceSelectors(){
    const type=Q('#ftype'),cat=Q('#fcat');if(!type||!cat)return;
    const fill=()=>{const arr=type.value==='income'?cfg.incomeCats:cfg.expenseCats,old=cat.value;cat.innerHTML=arr.map(v=>`<option>${esc(v)}</option>`).join('');if(arr.includes(old))cat.value=old;};
    type.onchange=fill;fill();
    const card=cat.closest('.card');if(card&&!Q('#forigin',card)){
      const origin=document.createElement('label');origin.innerHTML='Origem / Aplicativo<select id="forigin"></select>';
      const pay=document.createElement('label');pay.innerHTML='Forma de pagamento<select id="fpayment"></select>';
      const sub=document.createElement('label');sub.innerHTML='Subcategoria<select id="fsubcat"></select>';
      const amount=Q('#famount',card)?.closest('label');if(amount){amount.insertAdjacentElement('beforebegin',origin);origin.insertAdjacentElement('afterend',pay);pay.insertAdjacentElement('afterend',sub);}
    }
    const o=Q('#forigin'),p=Q('#fpayment'),s=Q('#fsubcat');if(o)o.innerHTML=cfg.origins.map(v=>`<option>${esc(v)}</option>`).join('');if(p)p.innerHTML=cfg.payments.map(v=>`<option>${esc(v)}</option>`).join('');if(s)s.innerHTML=['—',...cfg.subcats].map(v=>`<option>${esc(v)}</option>`).join('');
  }

  if(typeof window.addFinance==='function'&&!window.addFinance.__rlhub){
    const replacement=function(){
      let a=n(Q('#famount')?.value);if(!a)return;
      try{
        d.f.unshift({type:Q('#ftype').value,cat:Q('#fcat').value,category:Q('#fcat').value,subcat:Q('#fsubcat')?.value||'',amount:a,note:Q('#fnote')?.value||'',platform:Q('#forigin')?.value||'',payment:Q('#fpayment')?.value||'',at:new Date().toISOString()});
        if(Q('#famount'))Q('#famount').value='';if(Q('#fnote'))Q('#fnote').value='';if(typeof save==='function')save();
      }catch(e){console.error(e)}
    };replacement.__rlhub=true;window.addFinance=replacement;
  }

  function backupAll(){
    const payload={app:'Rota Lucro',version:'1.7.0',exportedAt:new Date().toISOString(),data:(typeof d==='object'?d:null),config:cfg};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='rota-lucro-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  function restoreAll(e){const file=e.target.files&&e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!x||x.app!=='Rota Lucro'||!x.data)throw new Error('Arquivo inválido');if(!confirm('Restaurar este backup? Os dados atuais serão substituídos.'))return;localStorage.setItem('rl-v7',JSON.stringify(x.data));cfg={...defaults,...(x.config||{})};persist();location.reload();}catch(err){alert('Não foi possível restaurar este backup.')}};r.readAsText(file);e.target.value='';}

  function patchPanelDefault(){try{if(typeof window.setRayV12==='function'&&!window.setRayV12.__cfg){const old=window.setRayV12;const f=n=>old(n);f.__cfg=true;window.setRayV12=f;setTimeout(()=>old(Number(cfg.dashboardPeriod)||0),0)}}catch(e){}}

  installHub();refreshFinanceSelectors();patchPanelDefault();
  const obs=new MutationObserver(()=>{installHub();refreshFinanceSelectors();applyTheme();});obs.observe(document.body,{childList:true,subtree:true});
})();
