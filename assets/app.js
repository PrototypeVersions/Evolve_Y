(() => {
 'use strict';
 const $ = s => document.querySelector(s);
 const $$ = s => [...document.querySelectorAll(s)];
 const menu=$('.menu-toggle');
 if(menu) menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));$('.nav').classList.toggle('open',open);menu.textContent=open?'Close':'Menu';});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu){menu.setAttribute('aria-expanded','false');$('.nav').classList.remove('open');menu.textContent='Menu';}});
 function tabs(group, update){
  const buttons=$$(group+' [role=tab]');
  const activate=b=>{buttons.forEach(x=>{x.setAttribute('aria-selected',String(x===b));x.tabIndex=x===b?0:-1;});update(b.dataset.key);};
  buttons.forEach((b,i)=>{b.addEventListener('click',()=>activate(b));b.addEventListener('keydown',e=>{let j;if(e.key==='ArrowRight')j=(i+1)%buttons.length;if(e.key==='ArrowLeft')j=(i+buttons.length-1)%buttons.length;if(e.key==='Home')j=0;if(e.key==='End')j=buttons.length-1;if(j!==undefined){e.preventDefault();activate(buttons[j]);buttons[j].focus();}});});
 }
 const scenarios={
  uneven:['Uneven progress','AI gets better, adoption stays difficult.','Small organizations need help turning capability into reliable daily work. Sell a service that saves time after review, training and integration costs.','Local support + measured outcomes','Keep the business useful at today’s capabilities. Expand only when customers renew and quality holds.'],
  concentrated:['Concentrated abundance','Intelligence is cheap. Access and ownership are not.','Power can collect around models, energy, distribution and customer data. Shared purchasing, portable records and enforceable member rights matter more.','Choice + bargaining power','Support multiple model providers, independent operators and a genuine right to leave. Fund access for those who cannot pay.'],
  abundant:['Broad abundance','AI does more; societies share the gains.','If public income support or universal high income emerges, people may spend more time on care, learning, creativity and community. Physical resources still matter.','Purpose + essential services','Help communities organize real projects and expand housing, skills and access. Company rebates complement public policy; they cannot replace it.']
 };
 if($('#scenario-panel')) tabs('#scenario-tabs',key=>{const s=scenarios[key];$('#scenario-title').textContent=s[0];$('#scenario-context').textContent=s[1];$('#scenario-body').textContent=s[2];$('#scenario-response').textContent=s[3];$('#scenario-action').textContent=s[4];$('#scenario-panel').setAttribute('aria-labelledby','scenario-'+key);});
 const decisions={
  service:['A service failure','The operator acts immediately.','The service team restores availability, contains incidents and notifies affected people. A named incident owner publishes a review. Members can appeal the handling; an emergency is not permission to rewrite ownership rules.'],
  fee:['A change to platform fees','Management proposes. Members have a protected say.','Publish the cost basis and at least 60 days’ notice. The proposed charter requires member approval for changes above the agreed cap. An independent steward can challenge violations. Existing records stay exportable.'],
  data:['A new use for personal data','The affected person decides.','Separate, specific consent is required for optional training or commercial reuse. Refusing must not remove basic service access. An independent reviewer investigates complaints. Technical access does not establish moral or legal permission.'],
  rights:['A change to core rights','No single founder can make it alone.','The proposed charter requires a supermajority of participating members and steward approval to change portability, nondiscrimination or distribution rules. Courts and applicable law remain available; rights must be incorporated into enforceable documents.']
 };
 if($('#decision-panel')) tabs('#decision-tabs',key=>{const d=decisions[key];$('#decision-label').textContent=d[0];$('#decision-title').textContent=d[1];$('#decision-body').textContent=d[2];$('#decision-panel').setAttribute('aria-labelledby','decision-'+key);});
 const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
 function economics(v){
  const revenue=v.customers*v.price, direct=v.customers*v.variable, contribution=revenue-direct, operating=contribution-v.fixed;
  const tax=Math.max(0,operating)*v.tax/100, afterTax=operating-tax;
  const reserve=Math.max(0,afterTax)*v.reserve/100, available=Math.max(0,afterTax-reserve);
  const share=available*v.share/100;
  return {revenue,direct,contribution,operating,tax,reserve,available,share,company:available-share,perMember:share*.65/v.members,community:share*.35,breakeven:v.price>v.variable?Math.ceil(v.fixed/(v.price-v.variable)):null};
 }
 // Pure function exposed only for the local validation harness; no network requests.
 if(typeof module!=='undefined'&&module.exports)module.exports={economics};
 function readCalc(){const fields=$$('#economics-form input');const v={};for(const el of fields){if(el.value.trim()===''||!el.checkValidity()){return null;}v[el.name]=Number(el.value);}return v;}
 function updateCalc(){
  const v=readCalc(); if(!v){$('#calc-error').textContent='Enter valid values in every field. Member count must be at least 1; percentages must be between 0 and 100.';$('#calc-results').setAttribute('aria-busy','true');return;}
  $('#calc-error').textContent='';$('#calc-results').setAttribute('aria-busy','false');const r=economics(v);
  for(const [id,key] of [['revenue','revenue'],['direct','direct'],['operating','operating'],['tax-result','tax'],['reserve-result','reserve'],['available','available'],['shared','share'],['company','company'],['per-member','perMember'],['community','community']])$('#'+id).textContent=money(r[key]);
  $('#fixed-result').textContent=money(v.fixed);$('#breakeven').textContent=r.breakeven===null?'No break-even at this price':r.breakeven.toLocaleString()+' paying organizations';
  $('#model-state').textContent=r.operating<=0?'This scenario runs at a loss or break-even. No surplus is shared.':r.share===0?'The business produces surplus, but this scenario allocates none to participants.':'This scenario supports a modest shared benefit, not a guaranteed income.';
  $('#calc-share-label').textContent=v.share+'% of distributable surplus';
  const amounts=[r.direct+v.fixed,r.tax,r.reserve,r.available];const total=amounts.reduce((a,b)=>a+b,0);$$('.calc-bar span').forEach((b,i)=>b.style.width=(total?amounts[i]/total*100:0)+'%');
 }
 if($('#economics-form')){$('#economics-form').addEventListener('input',updateCalc);$('#economics-form').addEventListener('submit',e=>e.preventDefault());$('#reset-model').addEventListener('click',()=>{$('#economics-form').reset();updateCalc();});updateCalc();}
 const steps=[
  ['A request becomes a shared record.','A small housing operator needs a repair. A coordinator collects the request, photos and access constraints with the resident’s consent. The record identifies what each participant is allowed to see.','Human responsibility: confirm scope and permission.'],
  ['AI does the administrative first pass.','The assistant organizes documents, suggests missing questions and prepares a comparable summary of contractor estimates. Every claim links back to submitted evidence; uncertainty stays visible.','Human responsibility: check the summary and choose the provider.'],
  ['Approval comes before commitment.','The authorized person accepts a quote and approves the work. The system records who agreed, the maximum cost and the scope. It cannot silently replace that agreement or spend beyond it.','Human responsibility: authorize cost, schedule and access.'],
  ['Work is verified and payment is reconciled.','A professional completes the repair. The coordinator checks evidence and gives the resident a way to raise a concern. Payment uses an established provider under the actual contract.','Human responsibility: verify completion and resolve disputes.'],
  ['The value stays visible.','The customer can export the project record. The pilot measures time, full cost, rework and contractor payment delay. Any later community allocation comes from earned platform surplus.','Human responsibility: review outcomes and decide whether to renew.']
 ];
 if($('#demo-title')){let step=0;const draw=()=>{const s=steps[step];$('#demo-count').textContent='STEP '+(step+1)+' / '+steps.length;$('#demo-title').textContent=s[0];$('#demo-body').textContent=s[1];$('#demo-human').textContent=s[2];$('#demo-prev').disabled=step===0;$('#demo-next').textContent=step===steps.length-1?'Start again ↻':'Next step →';};$('#demo-prev').addEventListener('click',()=>{step=Math.max(0,step-1);draw();});$('#demo-next').addEventListener('click',()=>{step=(step+1)%steps.length;draw();});draw();}
 if($('#pilot-checklist')){const inputs=$$('#pilot-checklist input');const draw=()=>{const count=inputs.filter(x=>x.checked).length;$('#pilot-progress').style.width=(count/inputs.length*100)+'%';$('#pilot-state').textContent=count+' of '+inputs.length+' planning conditions checked'+(count===inputs.length?'. Ready for an independent launch review.':'. This checklist stays in this tab.');};inputs.forEach(x=>x.addEventListener('change',draw));draw();}
 if($('#audit-search')){const filter=()=>{const term=$('#audit-search').value.trim().toLowerCase(),status=$('#audit-status').value;let count=0;$$('.audit-row').forEach(row=>{const show=(!term||row.textContent.toLowerCase().includes(term)||row.dataset.site.toLowerCase().includes(term))&&(!status||row.dataset.status===status);row.hidden=!show;if(show)count++;});$('#audit-count').textContent=count+' pages shown';$$('.audit-group').forEach(g=>g.hidden=![...g.querySelectorAll('.audit-row')].some(r=>!r.hidden));};$('#audit-search').addEventListener('input',filter);$('#audit-status').addEventListener('change',filter);filter();}
})();
