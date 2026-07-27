/* ===== Midway Bakery & Cafe — shared behaviour ===== */
(function(){
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* intro overlay */
  window.addEventListener("load", function(){
    var intro = document.getElementById("intro");
    if(intro){ setTimeout(function(){ intro.classList.add("hide"); }, reduce ? 200 : 1300); }
  });

  /* hero rotating slides */
  var slides = document.querySelectorAll(".hero-slide");
  if(slides.length > 1 && !reduce){
    var i = 0;
    setInterval(function(){
      slides[i].classList.remove("active");
      i = (i + 1) % slides.length;
      slides[i].classList.add("active");
    }, 5200);
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
    hamb.addEventListener("click", function(){ menu.classList.toggle("open"); });
    menu.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ menu.classList.remove("open"); });
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

  /* footer year */
  var y = document.getElementById("year");
  if(y){ y.textContent = new Date().getFullYear(); }
})();
