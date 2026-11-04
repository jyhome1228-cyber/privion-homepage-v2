/* =========================================================
   PRIVION COMMON JS
   - 현재 메뉴 active 처리
   - 지도 API placeholder 제어
   - 다운로드 버튼 경로 관리
   - 외부 지도 버튼 링크 관리
========================================================= */

(function () {
  "use strict";

  /**
   * 1. 현재 URL 기준 헤더 메뉴 active 처리
   */
  function setActiveNavigation() {
    var currentPath = window.location.pathname;
    var navLinks = document.querySelectorAll(".pv-nav a");

    navLinks.forEach(function (link) {
      var href = link.getAttribute("href");

      if (!href) return;

      var normalizedHref = href.replace(".html", "");
      var normalizedPath = currentPath.replace(".html", "");

      if (
        (href === "/" || href === "/index.html" || href === "index.html") &&
        (currentPath === "/" || currentPath.includes("index.html"))
      ) {
        link.classList.add("is-active");
        return;
      }

      if (
        normalizedHref !== "/" &&
        normalizedPath.includes(normalizedHref.replace("/", ""))
      ) {
        link.classList.add("is-active");
      }
    });
  }

  /**
   * 2. 실제 지도 API가 들어간 경우 placeholder 숨김
   *
   * 지도 API 적용 후 아래 함수 호출:
   * window.privionHideMapPlaceholder();
   */
  function hideMapPlaceholder() {
    var placeholder = document.querySelector(".pv-map-placeholder");

    if (placeholder) {
      placeholder.style.display = "none";
    }
  }

  /**
   * 3. 카탈로그 다운로드 경로 일괄 관리
   *
   * 실제 PDF 파일은 아래 경로에 업로드:
   * assets/download/privion-dl-series-catalog.pdf
   */
  function setDownloadLinks() {
    var catalogPath = "assets/download/privion-dl-series-catalog.pdf";
    var downloadLinks = document.querySelectorAll('a[href="/download"], a[href="download"]');

    downloadLinks.forEach(function (link) {
      link.setAttribute("href", catalogPath);
      link.setAttribute("download", "");
    });
  }

  /**
   * 4. 외부 지도 버튼 경로
   */
  function setMapLinks() {
    var address = encodeURIComponent(
      "경기도 성남시 분당구 삼평동 621 판교이노밸리 제B동 6층 604-4호"
    );

    var naver = document.querySelector('[data-map="naver"]');
    var kakao = document.querySelector('[data-map="kakao"]');
    var google = document.querySelector('[data-map="google"]');

    if (naver) {
      naver.setAttribute("href", "https://map.naver.com/p/search/" + address);
      naver.setAttribute("target", "_blank");
      naver.setAttribute("rel", "noopener noreferrer");
    }

    if (kakao) {
      kakao.setAttribute("href", "https://map.kakao.com/link/search/" + address);
      kakao.setAttribute("target", "_blank");
      kakao.setAttribute("rel", "noopener noreferrer");
    }

    if (google) {
      google.setAttribute(
        "href",
        "https://www.google.com/maps/search/?api=1&query=" + address
      );
      google.setAttribute("target", "_blank");
      google.setAttribute("rel", "noopener noreferrer");
    }
  }

  /**
   * 5. 초기 실행
   */
  document.addEventListener("DOMContentLoaded", function () {
    setActiveNavigation();
    setDownloadLinks();
    setMapLinks();
  });

  /**
   * 외부에서 호출 가능한 함수
   */
  window.privionHideMapPlaceholder = hideMapPlaceholder;
})();

/* ---- language switcher ---- */
(function () {
  var wrap = document.querySelector('.pv-lang');
  if (!wrap) return;
  var btn = wrap.querySelector('.pv-lang-btn');
  var parts = location.pathname.split('/');
  var page = parts.pop() || 'index.html';
  var folder = (parts.pop() || '').toLowerCase();
  var cur = folder === 'en' ? 'en' : 'kr';
  var items = wrap.querySelectorAll('.pv-lang-item');
  for (var i = 0; i < items.length; i++) {
    var lang = items[i].getAttribute('data-lang');
    items[i].href = (lang === cur ? '' : '../' + lang + '/') + page;
    if (lang === cur) items[i].className += ' is-current';
  }
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = wrap.className.indexOf('is-open') === -1;
    wrap.className = open ? 'pv-lang is-open' : 'pv-lang';
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', function () {
    wrap.className = 'pv-lang';
    btn.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { wrap.className = 'pv-lang'; btn.setAttribute('aria-expanded', 'false'); }
  });
})();

/* ---- 휴대폰 메뉴 (768px 이하) ---- */
(function () {
  var header = document.querySelector('.pv-header');
  var nav = header && header.querySelector('.pv-nav');
  var right = header && header.querySelector('.pv-header-right');
  if (!nav || !right) return;

  var parts = location.pathname.split('/');
  parts.pop();
  var en = (parts.pop() || '').toLowerCase() === 'en';

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'pv-menu-btn';
  btn.setAttribute('aria-label', en ? 'Menu' : '메뉴');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'pv-mnav');
  btn.innerHTML =
    '<svg class="pv-menu-open" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>' +
    '<svg class="pv-menu-close" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg>';
  right.appendChild(btn);

  var panel = document.createElement('nav');
  panel.className = 'pv-mnav';
  panel.id = 'pv-mnav';
  panel.setAttribute('aria-label', en ? 'Mobile navigation' : '모바일 메뉴');
  header.parentNode.insertBefore(panel, header.nextSibling);

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  var built = false;
  function build() {
    Array.prototype.forEach.call(nav.children, function (child) {
      if (child.tagName === 'A') {
        var a = el('a', 'pv-mnav-link', child.textContent.trim());
        a.href = child.getAttribute('href');
        panel.appendChild(a);
        return;
      }
      if (!child.classList.contains('pv-nav-item')) return;

      var main = child.querySelector(':scope > a');
      var toggle = el('button', 'pv-mnav-toggle');
      toggle.type = 'button';
      toggle.appendChild(el('span', '', main.textContent.trim()));
      toggle.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9.5l6 5.5 6-5.5"></path></svg>');
      var sub = el('div', 'pv-mnav-sub');

      child.querySelectorAll('.pv-nav-sub-group').forEach(function (g) {
        var h = g.querySelector('.pv-nav-sub-heading');
        if (h) sub.appendChild(el('p', 'pv-mnav-heading', h.textContent.trim()));
        g.querySelectorAll('.pv-nav-sub-link').forEach(function (l) {
          var a = el('a', 'pv-mnav-sub-link');
          a.href = l.getAttribute('href');
          var n = l.querySelector('.pv-nav-sub-name');
          var d = l.querySelector('.pv-nav-sub-desc');
          a.appendChild(document.createTextNode(n ? n.textContent.trim() : l.textContent.trim()));
          if (d) a.appendChild(el('span', '', d.textContent.trim()));
          sub.appendChild(a);
        });
      });

      var all = el('a', 'pv-mnav-all', en ? 'View all products' : '전체 제품 보기');
      all.href = main.getAttribute('href');
      sub.appendChild(all);

      var open = main.classList.contains('is-active');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) sub.classList.add('is-open');
      toggle.addEventListener('click', function () {
        var o = !sub.classList.contains('is-open');
        sub.classList.toggle('is-open', o);
        toggle.setAttribute('aria-expanded', o ? 'true' : 'false');
      });

      panel.appendChild(toggle);
      panel.appendChild(sub);
    });
    built = true;
  }

  function setOpen(o) {
    if (o && !built) build();
    panel.classList.toggle('is-open', o);
    btn.classList.toggle('is-open', o);
    document.documentElement.classList.toggle('pv-mnav-open', o);
    btn.setAttribute('aria-expanded', o ? 'true' : 'false');
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(!panel.classList.contains('is-open'));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && panel.classList.contains('is-open')) setOpen(false);
  });
})();


/* PRIVION footer sitemap and scroll reveal */
(function(){
 function enhance(){
  var footer=document.querySelector('.pv-footer');
  if(footer&&!footer.querySelector('.pv-footer-sitemap')){
   var right=footer.querySelector('.pv-footer-right');
   if(right){
    var nav=document.createElement('nav');
    nav.className='pv-footer-sitemap';
    nav.setAttribute('aria-label','사이트맵');
    [
     ['기술 소개','technology.html'],['제품 목록','product.html'],
     ['적용 분야','application.html'],['문의','contact.html'],
     ['DL100','product-dl100.html'],['DL100S','product-dl100s.html'],
     ['DL150','product-dl150.html'],['DL150S','product-dl150s.html'],
     ['DL100FL','product-dl100fl.html'],['개인정보처리방침','privacy.html']
    ].forEach(function(item){var link=document.createElement('a');link.href=item[1];link.textContent=item[0];nav.appendChild(link);});
    right.insertBefore(nav,right.firstChild);
   }
  }
  if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var targets=document.querySelectorAll('main section:not(.pv-home-hero):not(.pv-home-rolling):not(.pv-home-app-card):not(.pv-feature-static), main .pv-product-card, main .pv-home-product-card, main .pv-system-card, main .pv-tech-row, main .pv-application-item, main .pv-other-card');
  var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}})},{threshold:.08,rootMargin:'0px 0px -20px 0px'});
  targets.forEach(function(el){el.classList.add('pv-reveal');observer.observe(el);});
  document.documentElement.classList.add('pv-motion-ready');
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance);else enhance();
})();


/* Consistent brand descriptor directly below footer logo */
(function(){
 function mountFooterDescriptor(){
  document.querySelectorAll('.pv-footer-left').forEach(function(column){
   if(column.querySelector('.pv-footer-brandline'))return;
   var logo=column.querySelector('.pv-logo');
   if(!logo)return;
   var line=document.createElement('p');
   line.className='pv-footer-brandline';
   line.textContent='산업 현장을 위한 국산 FMCW LiDAR 솔루션, PRIVION';
   logo.insertAdjacentElement('afterend',line);
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountFooterDescriptor);
 else mountFooterDescriptor();
})();


/* Global header search drawer (KR/EN), 2026-11-02 */
(function(){
 function init(){
  var header=document.querySelector('.pv-header');
  if(!header||header.querySelector('.pv-header-search-panel'))return;
  var en=document.documentElement.lang.toLowerCase().startsWith('en');
  var trigger=header.querySelector('.pv-header-icon[aria-label="Search"],.pv-header-icon[href*="search.html"]');
  if(!trigger){
   var right=header.querySelector('.pv-header-right');
   if(!right)return;
   trigger=document.createElement('button');
   trigger.type='button';trigger.className='pv-header-icon pv-search-trigger';trigger.setAttribute('aria-label',en?'Open search':'검색 열기');
   trigger.innerHTML='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke-width="1.8"></circle><path d="M16.5 16.5L21 21" stroke-width="1.8" stroke-linecap="round"></path></svg>';
   right.appendChild(trigger);
  }
  trigger.setAttribute('aria-expanded','false');
  trigger.setAttribute('aria-controls','pv-header-search-panel');
  var panel=document.createElement('div');
  panel.id='pv-header-search-panel';panel.className='pv-header-search-panel';panel.hidden=true;
  panel.innerHTML='<form class="pv-header-search-form" action="search.html" method="get" role="search">'+
   '<label for="pv-header-search-input">'+(en?'Search PRIVION':'프리비온 검색')+'</label>'+
   '<div class="pv-header-search-line"><input id="pv-header-search-input" type="search" name="q" autocomplete="off" placeholder="'+(en?'Search products, technology, applications':'제품, 기술, 적용 분야를 검색하세요')+'" required>'+
   '<button type="submit">'+(en?'Search':'검색')+'</button><button type="button" class="pv-header-search-close" aria-label="'+(en?'Close search':'검색 닫기')+'">×</button></div></form>';
  header.appendChild(panel);
  var input=panel.querySelector('input');
  function setOpen(open){panel.hidden=!open;trigger.setAttribute('aria-expanded',String(open));if(open)input.focus();else trigger.focus();}
  trigger.addEventListener('click',function(e){e.preventDefault();setOpen(panel.hidden);});
  panel.querySelector('.pv-header-search-close').addEventListener('click',function(){setOpen(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!panel.hidden)setOpen(false);});
  document.addEventListener('pointerdown',function(e){if(!panel.hidden&&!panel.contains(e.target)&&!trigger.contains(e.target)){panel.hidden=true;trigger.setAttribute('aria-expanded','false');}});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();


/* Live header search suggestions: independent of the search results page */
(function(){
function ready(){
 const panel=document.getElementById('pv-header-search-panel');
 if(!panel||panel.querySelector('.pv-search-suggestions'))return;
 const input=panel.querySelector('input[name="q"]');
 const form=panel.querySelector('form');
 if(!input||!form)return;
 const en=document.documentElement.lang.toLowerCase().startsWith('en');
 const box=document.createElement('div');box.className='pv-search-suggestions';box.setAttribute('aria-live','polite');
 form.appendChild(box);
 let index=[],loaded=false;
 const fallback=[{"title":"DL100","category":"제품","description":"컴팩트 산업용 감지형 라이다","url":"product-dl100.html","keywords":"dl100"},{"title":"DL100S","category":"제품","description":"컴팩트 산업용 감지·스캔형 라이다","url":"product-dl100s.html","keywords":"dl100s"},{"title":"DL100FL","category":"시스템","description":"지게차 안전 시스템","url":"product-dl100fl.html","keywords":"dl100fl 지게차"},{"title":"DL150","category":"제품","description":"야외환경 산업용 감지형 라이다","url":"product-dl150.html","keywords":"dl150"},{"title":"DL150S","category":"제품","description":"야외환경 산업용 감지·스캔형 라이다","url":"product-dl150s.html","keywords":"dl150s"}];
 function normalize(x){return String(x||'').normalize('NFKC').toLowerCase().replace(/[\s._\/-]+/g,'');}
 function render(){
  box.replaceChildren();
  const q=normalize(input.value);
  if(!q){box.hidden=true;return;}
  box.hidden=false;
  const all=index.concat(fallback.filter(x=>!index.some(y=>y.url===x.url)));
  const hits=all.filter(x=>normalize([x.title,x.description,x.category,x.keywords,x.url].join(' ')).includes(q)).sort((a,b)=>Number(normalize(b.title).startsWith(q))-Number(normalize(a.title).startsWith(q))).slice(0,6);
  if(!hits.length){const p=document.createElement('p');p.className='pv-search-no-results';p.textContent=en?'No matching pages.':'검색 결과가 없습니다.';box.append(p);return;}
  const heading=document.createElement('p');heading.className='pv-search-suggestions-heading';heading.textContent=en?'Related results':'관련 검색 결과';box.append(heading);
  hits.forEach(x=>{
   const link=document.createElement('a');link.className='pv-search-suggestion';link.href=x.url;
   const contents=document.createElement('span');contents.className='pv-search-suggestion-text';
   const title=document.createElement('strong');title.textContent=x.title;
   const desc=document.createElement('small');desc.textContent=x.description||'';
   contents.append(title,desc);
   const category=document.createElement('em');category.textContent=x.category||'';
   link.append(contents,category);box.append(link);
  });
 }
 input.addEventListener('input',render);
 form.addEventListener('submit',function(e){
   const q=normalize(input.value);if(!q)return;
   e.preventDefault();
   const first=box.querySelector('.pv-search-suggestion');
   if(first)location.assign(first.getAttribute('href'));
   else location.assign('search.html?q='+encodeURIComponent(input.value));
 });
 fetch('assets/data/search-data.json').then(r=>{if(!r.ok)throw Error('index');return r.json()}).then(data=>{index=Array.isArray(data)?data:[];loaded=true;render()}).catch(()=>{loaded=true;render()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();
