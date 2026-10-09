/* ===== Midway Bakery & Cafe: shared behaviour ===== */
(function(){
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  /* intro overlay, first page of a visit only */
  var intro = document.getElementById("intro");
  if(intro){
    if(root.classList.contains("no-intro")){ intro.parentNode.removeChild(intro); }
    else {
      try{ sessionStorage.setItem("mw-intro", "1"); }catch(e){}
      var hidden = false;
      var hide = function(){ if(hidden) return; hidden = true; intro.classList.add("hide"); };
      window.addEventListener("load", function(){ setTimeout(hide, reduce ? 100 : 700); });
      setTimeout(hide, 2500);
    }
  }

  /* scroll reveal */
  var revs = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window && !reduce){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, {threshold:.12, rootMargin:"0px 0px -60px 0px"});
    revs.forEach(function(el){ io.observe(el); });
  } else {
    revs.forEach(function(el){ el.classList.add("in"); });
  }

  /* mobile menu */
  var hamb = document.querySelector(".hamb");
  var menu = document.getElementById("mobileMenu");
  if(hamb && menu){
    hamb.addEventListener("click", function(){
      var open = menu.classList.toggle("open");
      hamb.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ menu.classList.remove("open"); hamb.setAttribute("aria-expanded", "false"); });
    });
  }

  /* build Gmail compose links from split parts (Cloudflare-safe) */
  document.querySelectorAll("a[data-gmail]").forEach(function(a){
    var to = a.getAttribute("data-user") + "@" + a.getAttribute("data-domain");
    a.href = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(to) +
             "&su=" + (a.getAttribute("data-su") || "") +
             "&body=" + (a.getAttribute("data-body") || "");
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* open now, in New Zealand time. Mon to Sat 6:30am to 5pm, Sunday closed */
  var HOURS = {1:[390,1020], 2:[390,1020], 3:[390,1020], 4:[390,1020], 5:[390,1020], 6:[390,1020]};
  var DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  function nzNow(){
    try{
      var o = {};
      new Intl.DateTimeFormat("en-US", {timeZone:"Pacific/Auckland", weekday:"short", hour:"numeric", minute:"numeric", hourCycle:"h23"})
        .formatToParts(new Date()).forEach(function(p){ o[p.type] = p.value; });
      var day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(o.weekday);
      if(day < 0) return null;
      return {day:day, min:(parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10)};
    }catch(e){ return null; }
  }
  var now = nzNow();
  if(now){
    var t = HOURS[now.day], open = false, text;
    if(t && now.min >= t[0] && now.min < t[1]){
      open = true;
      text = (t[1] - now.min <= 60) ? "Open now · closing soon at 5pm" : "Open now · until 5pm";
    } else if(t && now.min < t[0]){
      text = "Closed now · opens 6:30am today";
    } else {
      for(var i = 1; i <= 7; i++){
        var d = (now.day + i) % 7;
        if(HOURS[d]){ text = "Closed now · opens 6:30am " + (i === 1 ? "tomorrow" : DAYS[d]); break; }
      }
    }
    document.querySelectorAll("[data-open-status]").forEach(function(el){
      el.textContent = text;
      var wrap = el.closest(".status");
      if(wrap){ wrap.classList.add(open ? "is-open" : "is-closed"); }
    });
    document.querySelectorAll('.hours-list li[data-day="' + now.day + '"]').forEach(function(li){ li.classList.add("today"); });
  }

  /* floating review card in the hero */
  var slides = document.querySelectorAll(".fr-slide");
  if(slides.length > 1 && !reduce){
    var k = 0;
    setInterval(function(){
      slides[k].classList.remove("active");
      k = (k + 1) % slides.length;
      slides[k].classList.add("active");
    }, 5200);
  }

  /* marquees: duplicate the content once so the loop is seamless */
  if(!reduce){
    document.querySelectorAll("[data-marquee]").forEach(function(track){
      Array.prototype.slice.call(track.children).forEach(function(c){
        var copy = c.cloneNode(true);
        copy.setAttribute("aria-hidden", "true");
        track.appendChild(copy);
      });
    });
  }

  /* footer year */
  var y = document.getElementById("year");
  if(y){ y.textContent = new Date().getFullYear(); }
})();
