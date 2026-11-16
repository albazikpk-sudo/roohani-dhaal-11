import duas from '../data/duas.json';
import './style.css';
import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  AdmobConsentStatus,
  BannerAdPosition,
  BannerAdSize
} from '@capacitor-community/admob';

const ADMOB_APP_ID = import.meta.env.VITE_ADMOB_APP_ID || '';
const ADMOB_BANNER_ID = import.meta.env.VITE_ADMOB_BANNER_ID || '';

const state={category:'تمام', index:0, query:'', favorites:JSON.parse(localStorage.getItem('rd-favs')||'[]'), dark:false};
const allDuas=duas;
const categories=['تمام',...new Set(duas.map(d=>d.category))];
const app=document.querySelector('#app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function filtered(){return allDuas.filter(d=>(state.category==='تمام'||state.category==='پسندیدہ' ? (state.category!=='پسندیدہ'||state.favorites.includes(d.id)) : d.category===state.category)&&(!state.query||[d.title,d.arabic,d.urdu,d.source,d.category].join(' ').toLowerCase().includes(state.query.toLowerCase())))}
function render(){const list=filtered();if(state.index>=list.length)state.index=0;const d=list[state.index];app.innerHTML=`<main class="shell ${state.dark?'dark':''}"><header><div class="brand"><img class="mark" src="./icon-192.png" alt="روحانی ڈھال لوگو"><div><h1>روحانی ڈھال</h1><p>مؤلف مفتی محمد سہیل البازی</p></div></div><button class="iconbtn" id="theme" aria-label="تھیم تبدیل کریں">◐</button></header><section class="intro"><span>قرآن و سنت کے اذکار اور فراہم کردہ دعاؤں کا مجموعہ</span><h2>ذکرِ الٰہی، روزمرہ زندگی کا حصہ</h2><p>آف لائن مطالعہ • حوالہ جات کے ساتھ • آسان استعمال</p><small class="total">اس نسخے میں ${duas.length} دعائیہ اندراجات؛ ہر اندراج کا تحقیقی درجہ الگ درج ہے</small></section><div class="search"><span>⌕</span><input id="search" placeholder="دعا، موضوع یا عربی الفاظ تلاش کریں" value="${esc(state.query)}"></div><nav class="cats">${categories.map(c=>`<button class="chip ${state.category===c?'active':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}<button class="chip ${state.category==='پسندیدہ'?'active':''}" data-cat="پسندیدہ">♡ پسندیدہ</button></nav>${d?`<section class="dua-card"><div class="cardtop"><span>${esc(d.category)}</span><button id="fav" class="fav ${state.favorites.includes(d.id)?'selected':''}">${state.favorites.includes(d.id)?'♥':'♡'}</button></div><div class="counter">${state.index+1} / ${list.length}</div><h3>${esc(d.title)}</h3><div class="arabic" dir="rtl">${esc(d.arabic)}</div><div class="translation"><label>اردو ترجمہ</label><p>${esc(d.urdu)}</p></div><div class="count"><b>تعداد / وقت</b><span>${esc(d.count)}</span></div><div class="reference"><b>حوالہ</b><p>${esc(d.source)}</p><span class="grade">درجۂ صحت: ${esc(d.grade)}</span><small>${esc(d.gradeNote||'')}</small>${d.sourceUrl?`<a href="${esc(d.sourceUrl)}" target="_blank" rel="noopener">اصل ماخذ دیکھیں ↗</a>`:""}</div><div class="actions"><button id="copy" class="primary">▣ دعا کاپی کریں</button><button id="share" class="secondary">شیئر کریں</button></div><div class="pager"><button id="prev" ${state.index===0?'disabled':''}>→ پچھلی دعا</button><button id="next" ${state.index>=list.length-1?'disabled':''}>اگلی دعا ←</button></div></section>`:`<section class="empty">اس زمرے میں فی الحال کوئی دعا موجود نہیں۔</section>`}<footer><p>روحانی ڈھال</p><small>مؤلف: مفتی محمد سہیل البازی</small><small><a href="./privacy.html">رازداری کی پالیسی</a></small><small>یہ ڈیجیٹل نسخہ فراہم کردہ کتاب کو بطور بنیادی ماخذ شامل کرتا ہے۔ ہر دعا کے متن، ترجمے، تعداد اور حدیثی درجے کی الگ تحقیقی توثیق ضروری ہے۔</small></footer></main>`;
 document.querySelector('#theme').onclick=()=>{state.dark=!state.dark;render()};document.querySelector('#search').oninput=e=>{state.query=e.target.value;state.index=0;const pos=e.target.selectionStart;render();const el=document.querySelector('#search');el.focus();el.setSelectionRange(pos,pos)};
 document.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{state.category=b.dataset.cat;state.index=0;render()});
 if(d){document.querySelector('#fav').onclick=()=>{state.favorites=state.favorites.includes(d.id)?state.favorites.filter(x=>x!==d.id):[...state.favorites,d.id];localStorage.setItem('rd-favs',JSON.stringify(state.favorites));render()};document.querySelector('#prev').onclick=()=>{state.index--;render()};document.querySelector('#next').onclick=()=>{state.index++;render()};document.querySelector('#copy').onclick=async()=>{const txt=`${d.title}\n\n${d.arabic}\n\n${d.urdu}\n\n${d.count}\n${d.source}\nدرجۂ صحت: ${d.grade}`;try{await navigator.clipboard.writeText(txt);alert('دعا کامیابی سے کاپی ہوگئی۔')}catch{alert('کاپی کی سہولت اس براؤزر میں دستیاب نہیں۔')}};document.querySelector('#share').onclick=async()=>{const text=`${d.title}\n${d.arabic}\n${d.urdu}\n${d.source}`;if(navigator.share){try{await navigator.share({title:d.title,text})}catch{}}else{await navigator.clipboard.writeText(text);alert('شیئر کرنے کے لیے متن کاپی ہوگیا۔')}}}
}
render();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));


// Native AdMob: consent is requested before any ad request. Errors stay in logs;
// raw SDK/JSON errors are never rendered in the user interface.
async function startNativeAdMob() {
  if (!Capacitor.isNativePlatform() || !ADMOB_APP_ID || !ADMOB_BANNER_ID) return;
  try {
    await AdMob.initialize();
    let consent = await AdMob.requestConsentInfo();
    if (
      consent.isConsentFormAvailable &&
      consent.status === AdmobConsentStatus.REQUIRED
    ) {
      consent = await AdMob.showConsentForm();
    }
    if (!consent.canRequestAds) return;
    await AdMob.showBanner({
      adId: ADMOB_BANNER_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0
    });
  } catch (error) {
    console.warn('AdMob could not load a banner:', error?.code || 'unknown');
  }
}
startNativeAdMob();
