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
