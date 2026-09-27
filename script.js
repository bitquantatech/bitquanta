'use strict';
let language='en',sending=false,sent=false;
const tr = key => COMPANY_I18N[language][key] || COMPANY_I18N.en[key] || '';
function setLanguage(value){
  language=value==='tr'?'tr':'en';document.documentElement.lang=language;
  document.title=tr('doc.title');
  document.querySelector('meta[name="description"]').content=tr('doc.description');
  document.querySelectorAll('[data-i18n]').forEach(el=>{const text=tr(el.dataset.i18n);if(text)el.textContent=text;});
  document.querySelectorAll('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',tr(el.dataset.i18nAria)));
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>el.placeholder=tr(el.dataset.i18nPh));
  document.querySelectorAll('[data-i18n-alt]').forEach(el=>el.alt=tr(el.dataset.i18nAlt));
  document.querySelectorAll('[data-lang]').forEach(button=>{button.classList.toggle('active',button.dataset.lang===language);button.setAttribute('aria-pressed',String(button.dataset.lang===language));});
  if(sending)document.getElementById('contact-submit').textContent=tr('form.sending');
  if(sent)document.getElementById('contact-status').textContent=tr('form.sent');
  try{localStorage.setItem('lang',language);}catch(error){}
}
document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.lang)));
let preference='';try{preference=localStorage.getItem('lang')||'';}catch(error){}
setLanguage(preference||((navigator.language||'').startsWith('tr')?'tr':'en'));
document.getElementById('year').textContent=new Date().getFullYear();
const localPreview=['localhost','127.0.0.1'].includes(location.hostname);
const inspectorOrigin=localPreview?'http://127.0.0.1:8002':'https://inspect.bitquanta.org';
if(localPreview)document.querySelectorAll('a[href^="https://inspect.bitquanta.org"]').forEach(link=>link.href=link.href.replace('https://inspect.bitquanta.org',inspectorOrigin));
const form=document.getElementById('company-contact'),status=document.getElementById('contact-status'),submit=document.getElementById('contact-submit');
form.addEventListener('submit',async event=>{
  event.preventDefault();if(sending||!form.reportValidity())return;
  const values=new FormData(form),name=String(values.get('name')||'').trim(),email=String(values.get('email')||'').trim();
  if(!name||!email){status.hidden=false;status.textContent=tr('form.error');return;}
  sending=true;sent=false;submit.disabled=true;submit.textContent=tr('form.sending');status.hidden=true;
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
  try{
    const response=await fetch(inspectorOrigin+'/contact',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'omit',signal:controller.signal,body:JSON.stringify({name,email,company:String(values.get('company')||'').trim(),message:String(values.get('message')||'').trim(),website:values.get('website')||''})});
    if(!response.ok)throw new Error('Delivery failed');
    const result=await response.json();if(result.ok!==true)throw new Error('Delivery not confirmed');
    sent=true;form.reset();status.textContent=tr('form.sent');status.className='success';
  }catch(error){status.textContent=tr('form.error');status.className='error';}
  finally{clearTimeout(timer);sending=false;submit.disabled=false;submit.textContent=tr('form.send');status.hidden=false;}
});
