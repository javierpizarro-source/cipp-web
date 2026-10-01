/* CIPP: optional, consent-based audience measurement. No clinical inputs. */
(function () {
  'use strict';
  var measurementId = 'G-61ZHDS5018';
  var key = 'cipp_analytics_consent_v1';
  var path = location.pathname;
  // Clinical tools and historical previews never load Google Analytics.
  if (/^\/(diario|preview)(\/|\.html|$)/i.test(path) || /orientacion-sintomas/i.test(path) || /google[a-z0-9]+\.html/i.test(path)) return;
  var loaded = false;
  function saved() { try { return localStorage.getItem(key); } catch (_) { return null; } }
  function remember(value) { try { localStorage.setItem(key, value); } catch (_) {} }
  function safeLocation() {
    var u = new URL(location.origin + path);
    // Only fixed, non-personal campaign values are allowed through.
    var q = new URLSearchParams(location.search);
    var allowed = {utm_source:['instagram'],utm_medium:['social'],utm_campaign:['cipp_web'],utm_content:['bio']};
    Object.keys(allowed).forEach(function(k){if(allowed[k].indexOf(q.get(k))!==-1)u.searchParams.set(k,q.get(k));});
    return u.href;
  }
  function safeReferrer() { try { return document.referrer ? new URL(document.referrer).origin + '/' : ''; } catch (_) { return ''; } }
  function load() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    gtag('js', new Date());
    gtag('config',measurementId,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:safeLocation(),page_referrer:safeReferrer(),page_title:path==='/'?'CIPP - Inicio':'CIPP - '+path});
    gtag('event','page_view',{page_location:safeLocation(),page_referrer:safeReferrer(),page_title:path==='/'?'CIPP - Inicio':'CIPP - '+path});
    var script = document.createElement('script');
    script.async = true; script.src = 'https://www.googletagmanager.com/gtag/js?id='+measurementId;
    document.head.appendChild(script);
  }
  function clearCookies() {
    document.cookie.split(';').forEach(function(c){var n=c.split('=')[0].trim();if(/^_ga/.test(n)){['',location.hostname,'.'+location.hostname].forEach(function(domain){document.cookie=n+'=; Max-Age=0; path=/'+(domain?'; domain='+domain:'')+'; SameSite=Lax';});}});
  }
  function init() {
    var style=document.createElement('style');style.textContent='#cipp-consent{position:fixed;bottom:18px;left:18px;right:18px;max-width:720px;margin:auto;padding:20px;background:#fff;color:#17333d;border:1px solid #c9dedf;border-radius:14px;box-shadow:0 6px 30px #102e3c22;z-index:9999;font:15px/1.5 system-ui,sans-serif}#cipp-consent p{margin:0 0 14px}#cipp-consent button,#cipp-privacy-choice{font:inherit;cursor:pointer}#cipp-consent button{padding:10px 16px;border-radius:8px;border:1px solid #27847f;margin:4px 8px 0 0;background:#fff;color:#17333d}#cipp-consent button[data-choice=accept]{background:#17333d;color:#fff}#cipp-privacy-choice{position:fixed;bottom:8px;left:8px;background:#fff;color:#17333d;border:1px solid #c9dedf;border-radius:6px;padding:5px 9px;font-size:12px;z-index:9998}';document.head.appendChild(style);
    var box=document.createElement('section');box.id='cipp-consent';box.setAttribute('aria-label','Preferencias de medición');
    box.innerHTML='<p>Usamos Google Analytics solo si lo aceptas, para medir visitas y su origen con cookies. No medimos las respuestas del diario ni del cuestionario. Puedes rechazarlo y usar la web igual, o cambiar tu elección en "Privacidad". <a href="/privacidad.html">Ver detalles</a>.</p><button type="button" data-choice="accept">Aceptar medición</button><button type="button" data-choice="reject">Rechazar</button>';
    var choice=document.createElement('button');choice.id='cipp-privacy-choice';choice.type='button';choice.textContent='Privacidad';choice.onclick=function(){box.hidden=false;};document.body.appendChild(choice);document.body.appendChild(box);
    box.addEventListener('click',function(e){var value=e.target.getAttribute('data-choice');if(!value)return;remember(value);box.hidden=true;if(value==='accept'){window['ga-disable-'+measurementId]=false;load();}else{window['ga-disable-'+measurementId]=true;clearCookies();if(loaded)location.reload();}});
    if(saved()==='accept'){box.hidden=true;load();}else if(saved()==='reject'){box.hidden=true;}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
