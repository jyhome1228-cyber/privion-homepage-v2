/* PRIVION site search — case-insensitive, URL query and async data-safe */
(function () {
  "use strict";
  function init() {
    var input = document.getElementById("pv-search-input");
    var box = document.getElementById("pv-search-results");
    if (!input || !box) return;
    var items = [];
    var loaded = false;
    var dictionary = {"prompt":"검색어를 입력하면 관련 페이지가 표시됩니다.","none":"검색 결과가 없습니다.","error":"검색 데이터를 불러오지 못했습니다.","loading":"검색 데이터를 불러오는 중입니다."};
    function normalize(value) {
      return String(value == null ? "" : value)
        .normalize("NFKC").toLocaleLowerCase()
        .replace(/[\s\-_./]+/g, "");
    }
    function message(value) {
      box.replaceChildren();
      var p=document.createElement("p");
      p.className="pv-search-empty";
      p.textContent=value;
      box.appendChild(p);
    }
    function show(results) {
      box.replaceChildren();
      results.forEach(function (item) {
        var link=document.createElement("a");
        link.className="pv-search-result";
        link.href=item.url;
        var category=document.createElement("span"); category.textContent=item.category || "";
        var heading=document.createElement("strong"); heading.textContent=item.title || "";
        var description=document.createElement("p"); description.textContent=item.description || "";
        link.append(category,heading,description);
        box.appendChild(link);
      });
    }
    function search() {
      var q=normalize(input.value);
      if (!q) {message(dictionary.prompt);return;}
      if (!loaded) {message(dictionary.loading);return;}
      var results=items.filter(function(item){
        return normalize([item.title,item.category,item.description,item.keywords,item.url].join(" ")).includes(q);
      });
      if (!results.length) {message(dictionary.none);return;}
      results.sort(function(a,b) {
        var at=normalize(a.title),bt=normalize(b.title);
        return (bt===q?1:bt.startsWith(q)?0.5:0)-(at===q?1:at.startsWith(q)?0.5:0);
      });
      show(results);
    }
    input.addEventListener("input",search);
    var params=new URLSearchParams(location.search);
    var query=params.get("q");
    if(query)input.value=query;
    search();
    fetch("assets/data/search-data.json",{cache:"no-cache"})
      .then(function(res){if(!res.ok)throw new Error("Search data fetch failed");return res.json();})
      .then(function(data){if(!Array.isArray(data))throw new Error("Invalid search data");items=data;loaded=true;search();})
      .catch(function(){loaded=true;message(dictionary.error);});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
  else init();
})();
