const IMG = '/templates/country/images';
const FONT = '/templates/country/fonts';

export function getCustomCSS(): string {
  return `
@font-face { font-family:'Reckless Neue'; src:url('${FONT}/RecklessNeue-Regular.ttf') format('truetype'); font-weight:400; font-style:normal; font-display:swap; }
@font-face { font-family:'Lato'; src:url('${FONT}/Lato-Regular.ttf') format('truetype'); font-weight:400; font-style:normal; font-display:swap; }
@font-face { font-family:'Lato'; src:url('${FONT}/Lato-Light.ttf') format('truetype'); font-weight:300; font-style:normal; font-display:swap; }
html { scroll-behavior:smooth; }
body { background:#09312a; color:#fff; font-family:'Lato',sans-serif; font-weight:300; overflow-x:hidden; -webkit-font-smoothing:antialiased; margin:0; padding:0; }
* { box-sizing:border-box; }
.font-heading { font-family:'Reckless Neue','Georgia',serif; }
.gold-gradient-text { background:linear-gradient(90deg,#daaf3a 0%,#e8c860 25%,#ffebaf 50%,#c9a84c 75%,#9d7500 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.gold-gradient-bg { background:linear-gradient(90deg,#daaf3a 0%,#e8c860 25%,#ffebaf 50%,#c9a84c 75%,#9d7500 100%); position:relative; overflow:hidden; }
.gold-gradient-bg::after { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.4) 50%,transparent 100%); transition:none; }
.gold-gradient-bg:hover::after { animation:gold-shimmer 0.6s ease-in-out forwards; }
@keyframes gold-shimmer { 0%{left:-100%} 100%{left:100%} }
.parallax-bg { background-attachment:fixed; background-position:center; background-repeat:no-repeat; background-size:cover; }
@supports (-webkit-touch-callout:none) { .parallax-bg { background-attachment:scroll; } }
@media(max-width:768px) { .parallax-bg { background-attachment:scroll; } }
::-webkit-scrollbar { width:6px; }
::-webkit-scrollbar-track { background:#09312a; }
::-webkit-scrollbar-thumb { background:#daaf3a; border-radius:3px; }
button,a,[role="button"],input[type="submit"],select,summary { cursor:pointer; }
input,textarea,select { outline:none; }
input::placeholder,textarea::placeholder { color:rgba(255,255,255,0.4); font-family:'Lato',sans-serif; }
[data-page] { display:none; }
[data-page].active { display:block; }
.sr { opacity:0; transform:translateY(40px); transition:opacity 0.7s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94); }
.sr.visible { opacity:1; transform:translateY(0) translateX(0); }
.sr-left { transform:translateX(40px); }
.sr-right { transform:translateX(-40px); }
.hero-fade { opacity:0; transform:translateY(40px); animation:heroFade 1s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
.hero-fade-delay1 { animation-delay:0.3s; }
.hero-fade-delay2 { animation-delay:0.6s; }
.hero-fade-delay3 { animation-delay:0.9s; }
@keyframes heroFade { to { opacity:1; transform:translateY(0); } }
.img-hover { transition:transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94); }
.img-hover-wrap:hover .img-hover { transform:scale(1.06); }
.gold-line-hover { width:0; height:2px; transition:width 0.6s cubic-bezier(0.25,0.46,0.45,0.94); }
.img-hover-wrap:hover .gold-line-hover { width:100%; }
.menu-overlay { position:fixed; inset:0; z-index:60; background:#09312a; transform:translateY(-100%); opacity:0; transition:transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s; pointer-events:none; overflow-y:auto; }
.menu-overlay.open { transform:translateY(0); opacity:1; pointer-events:auto; }
.blog-content h2 { font-family:'Reckless Neue','Georgia',serif; font-weight:400; font-size:22px; line-height:1.3; color:white; margin-top:2em; margin-bottom:0.75em; background:linear-gradient(90deg,#daaf3a 0%,#e8c860 25%,#ffebaf 50%,#c9a84c 75%,#9d7500 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.blog-content h2:first-child { margin-top:0; }
.blog-content p { margin-bottom:1em; }
.blog-content p:last-child { margin-bottom:0; }
@media(min-width:768px) { .blog-content h2 { font-size:26px; } }
`.trim();
}

export function getHeaderHTML(): string {
  return `
<header id="site-header" class="fixed top-0 left-0 right-0 z-50 bg-[#09312a] transition-all duration-500">
  <div class="w-full max-w-[1440px] mx-auto flex items-center justify-between px-5 md:px-10 lg:px-[60px] h-[70px] md:h-[99px]">
    <a href="/" data-nav class="shrink-0 flex items-center"><img src="${IMG}/header-logo.svg" alt="Aspen Muraski Real Estate" width="139" height="76" class="w-[100px] md:w-[139px] h-[55px] md:h-[76px] object-contain" /></a>
    <div class="hidden xl:flex items-center">
      <nav class="flex items-center gap-[30px]">
        <a href="/" data-nav class="nav-link relative group flex items-center gap-[4px] text-white text-[14px] font-normal leading-[20px] py-[2px] hover:text-[#daaf3a] transition-colors duration-300" style="font-family:'Lato',sans-serif">Home<span class="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#daaf3a] group-hover:w-full transition-all duration-300 ease-out"></span></a>
        <a href="/about" data-nav class="nav-link relative group flex items-center gap-[4px] text-white text-[14px] font-normal leading-[20px] py-[2px] hover:text-[#daaf3a] transition-colors duration-300" style="font-family:'Lato',sans-serif">About<span class="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#daaf3a] group-hover:w-full transition-all duration-300 ease-out"></span></a>
        <a href="/buying" data-nav class="nav-link relative group flex items-center gap-[4px] text-white text-[14px] font-normal leading-[20px] py-[2px] hover:text-[#daaf3a] transition-colors duration-300" style="font-family:'Lato',sans-serif">Buying<span class="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#daaf3a] group-hover:w-full transition-all duration-300 ease-out"></span></a>
        <a href="/selling" data-nav class="nav-link relative group flex items-center gap-[4px] text-white text-[14px] font-normal leading-[20px] py-[2px] hover:text-[#daaf3a] transition-colors duration-300" style="font-family:'Lato',sans-serif">Selling<span class="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#daaf3a] group-hover:w-full transition-all duration-300 ease-out"></span></a>
        <a href="/estates" data-nav class="nav-link relative group flex items-center gap-[4px] text-white text-[14px] font-normal leading-[20px] py-[2px] hover:text-[#daaf3a] transition-colors duration-300" style="font-family:'Lato',sans-serif">Estates/Ranch Properties<span class="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#daaf3a] group-hover:w-full transition-all duration-300 ease-out"></span></a>
        <a href="/listings/active" data-nav class="nav-link relative group flex items-center gap-[4px] text-white text-[14px] font-normal leading-[20px] py-[2px] hover:text-[#daaf3a] transition-colors duration-300" style="font-family:'Lato',sans-serif">Active Listings<span class="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#daaf3a] group-hover:w-full transition-all duration-300 ease-out"></span></a>
        <a href="/listings/sold" data-nav class="nav-link relative group flex items-center gap-[4px] text-white text-[14px] font-normal leading-[20px] py-[2px] hover:text-[#daaf3a] transition-colors duration-300" style="font-family:'Lato',sans-serif">Sold<span class="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#daaf3a] group-hover:w-full transition-all duration-300 ease-out"></span></a>
        <a href="/blog" data-nav class="nav-link relative group flex items-center gap-[4px] text-white text-[14px] font-normal leading-[20px] py-[2px] hover:text-[#daaf3a] transition-colors duration-300" style="font-family:'Lato',sans-serif">Blog<span class="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#daaf3a] group-hover:w-full transition-all duration-300 ease-out"></span></a>
        <a href="/contact" data-nav class="nav-link relative group flex items-center gap-[4px] text-white text-[14px] font-normal leading-[20px] py-[2px] hover:text-[#daaf3a] transition-colors duration-300" style="font-family:'Lato',sans-serif">Contact<span class="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#daaf3a] group-hover:w-full transition-all duration-300 ease-out"></span></a>
      </nav>
      <div class="flex items-center gap-[43px] ml-[127px]">
        <a href="tel:4037033909" class="gold-gradient-bg flex items-center justify-center h-[47px] w-[134px] text-[#31443a] text-[14px] font-semibold transition-all duration-300" style="font-family:'Lato',sans-serif">Call Aspen</a>
        <button id="menu-toggle-desktop" class="flex items-center justify-center w-[52px] h-[47px] bg-[#113d35] border border-solid border-[#daaf3a] hover:bg-[#1a5248] transition-colors duration-300" aria-label="Toggle menu"><div class="flex flex-col items-center justify-center gap-[7px]"><span class="block w-[22px] h-[1px] gold-gradient-bg"></span><span class="block w-[22px] h-[1px] gold-gradient-bg"></span><span class="block w-[22px] h-[1px] gold-gradient-bg"></span></div></button>
      </div>
    </div>
    <button id="menu-toggle-mobile" class="xl:hidden flex items-center justify-center w-[44px] h-[40px] md:w-[52px] md:h-[47px] bg-[#113d35] border border-solid border-[#daaf3a]" aria-label="Toggle menu"><div class="flex flex-col items-center justify-center gap-[6px] md:gap-[7px]"><span class="block w-[20px] md:w-[22px] h-[1px] gold-gradient-bg hamburger-line"></span><span class="block w-[20px] md:w-[22px] h-[1px] gold-gradient-bg hamburger-line"></span><span class="block w-[20px] md:w-[22px] h-[1px] gold-gradient-bg hamburger-line"></span></div></button>
  </div>
</header>
<div id="menu-overlay" class="menu-overlay">
  <div class="flex h-full">
    <div class="hidden lg:block relative w-[50%] h-full"><img src="${IMG}/expanded-menu.webp" alt="" class="w-full h-full object-cover" /></div>
    <div class="flex-1 flex flex-col h-full overflow-y-auto">
      <div class="flex justify-end px-5 md:px-10 lg:px-[60px] pt-4 md:pt-6 shrink-0"><button id="menu-close" class="flex items-center gap-2 text-white text-[14px] hover:text-[#daaf3a] transition-colors duration-300" style="font-family:'Lato',sans-serif">Close Menu <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 3L13 13M13 3L3 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div>
      <nav class="flex-1 flex flex-col justify-center px-5 md:px-10 lg:px-[60px] xl:px-[80px] py-4">
        <a href="/" data-nav class="menu-item group border-b border-white/10 py-[clamp(10px,2vh,20px)]"><span class="font-heading text-[clamp(18px,2.5vh,28px)] text-white group-hover:text-[#daaf3a] transition-colors duration-300" style="font-weight:400">Home</span></a>
        <a href="/about" data-nav class="menu-item group border-b border-white/10 py-[clamp(10px,2vh,20px)]"><span class="font-heading text-[clamp(18px,2.5vh,28px)] text-white group-hover:text-[#daaf3a] transition-colors duration-300" style="font-weight:400">About</span></a>
        <a href="/buying" data-nav class="menu-item group border-b border-white/10 py-[clamp(10px,2vh,20px)]"><span class="font-heading text-[clamp(18px,2.5vh,28px)] text-white group-hover:text-[#daaf3a] transition-colors duration-300" style="font-weight:400">Buying</span></a>
        <a href="/selling" data-nav class="menu-item group border-b border-white/10 py-[clamp(10px,2vh,20px)]"><span class="font-heading text-[clamp(18px,2.5vh,28px)] text-white group-hover:text-[#daaf3a] transition-colors duration-300" style="font-weight:400">Selling</span></a>
        <a href="/estates" data-nav class="menu-item group border-b border-white/10 py-[clamp(10px,2vh,20px)]"><span class="font-heading text-[clamp(18px,2.5vh,28px)] text-white group-hover:text-[#daaf3a] transition-colors duration-300" style="font-weight:400">Estates/Ranch Properties</span></a>
        <a href="/listings/active" data-nav class="menu-item group border-b border-white/10 py-[clamp(10px,2vh,20px)]"><span class="font-heading text-[clamp(18px,2.5vh,28px)] text-white group-hover:text-[#daaf3a] transition-colors duration-300" style="font-weight:400">Active Listings</span></a>
        <a href="/listings/sold" data-nav class="menu-item group border-b border-white/10 py-[clamp(10px,2vh,20px)]"><span class="font-heading text-[clamp(18px,2.5vh,28px)] text-white group-hover:text-[#daaf3a] transition-colors duration-300" style="font-weight:400">Sold</span></a>
        <a href="/blog" data-nav class="menu-item group border-b border-white/10 py-[clamp(10px,2vh,20px)]"><span class="font-heading text-[clamp(18px,2.5vh,28px)] text-white group-hover:text-[#daaf3a] transition-colors duration-300" style="font-weight:400">Blog</span></a>
        <a href="/contact" data-nav class="menu-item group border-b border-white/10 py-[clamp(10px,2vh,20px)]"><span class="font-heading text-[clamp(18px,2.5vh,28px)] text-white group-hover:text-[#daaf3a] transition-colors duration-300" style="font-weight:400">Contact</span></a>
        <div class="mt-[clamp(16px,2vh,40px)]"><a href="tel:4037033909" class="gold-gradient-bg inline-flex items-center justify-center h-[52px] px-10 text-[#09312a] font-semibold text-[14px] md:text-[15px] transition-all duration-300" style="font-family:'Lato',sans-serif">Call Aspen</a></div>
      </nav>
    </div>
  </div>
</div>`;
}

export function getFooterHTML(): string {
  return `
<footer class="bg-[#09312a]">
  <div class="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-10 md:py-[60px]">
    <div class="flex flex-col sm:flex-row items-center sm:justify-between gap-6 md:gap-8">
      <img src="${IMG}/footer-logo.svg" alt="Aspen Muraski Real Estate" width="234" height="128" class="w-[180px] md:w-[234px] h-[98px] md:h-[128px] object-contain" />
      <img src="${IMG}/remax-logo.png" alt="RE/MAX House of Real Estate" class="h-[50px] md:h-[65px] w-auto object-contain" />
    </div>
    <div class="mt-8 md:mt-[55px]"></div>
    <div class="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 lg:gap-10">
      <div class="w-full sm:w-[360px] text-center lg:text-left">
        <p class="font-heading text-[18px] md:text-[20px] leading-[28px] gold-gradient-text mb-3 md:mb-[14px]" style="font-weight:400">Aspen Muraski</p>
        <div class="flex flex-col items-center lg:items-start">
          <a href="tel:4037033909" class="text-white text-[15px] md:text-[16px] leading-[24px] hover:text-[#daaf3a] transition-colors duration-300" style="font-family:'Lato',sans-serif">403-703-3909</a>
          <a href="mailto:Aspen@SundreRealEstate.com" class="text-white text-[15px] md:text-[16px] leading-[24px] hover:text-[#daaf3a] transition-colors duration-300" style="font-family:'Lato',sans-serif">Aspen@SundreRealEstate.com</a>
          <a href="https://SundreRealEstate.com" target="_blank" rel="noopener noreferrer" class="text-white text-[15px] md:text-[16px] leading-[24px] hover:text-[#daaf3a] transition-colors duration-300" style="font-family:'Lato',sans-serif">SundreRealEstate.com</a>
          <a href="https://instagram.com/aspenmuraski_real_estate" target="_blank" rel="noopener noreferrer" class="text-white text-[15px] md:text-[16px] leading-[24px] underline hover:text-[#daaf3a] transition-colors duration-300" style="font-family:'Lato',sans-serif">@aspenmuraski_real_estate</a>
        </div>
      </div>
      <nav class="flex flex-wrap items-start lg:items-end gap-x-[14px] md:gap-x-[18px] gap-y-2 md:gap-y-3 lg:self-end">
        <a href="/" data-nav class="text-white text-[13px] md:text-[14px] leading-[20px] hover:text-[#daaf3a] transition-colors duration-300 border-b border-white py-[2px]" style="font-family:'Lato',sans-serif">Home</a>
        <a href="/estates" data-nav class="text-white text-[13px] md:text-[14px] leading-[20px] hover:text-[#daaf3a] transition-colors duration-300 border-b border-white py-[2px]" style="font-family:'Lato',sans-serif">Estates/Ranch Properties</a>
        <a href="/listings/active" data-nav class="text-white text-[13px] md:text-[14px] leading-[20px] hover:text-[#daaf3a] transition-colors duration-300 border-b border-white py-[2px]" style="font-family:'Lato',sans-serif">Active</a>
        <a href="/listings/sold" data-nav class="text-white text-[13px] md:text-[14px] leading-[20px] hover:text-[#daaf3a] transition-colors duration-300 border-b border-white py-[2px]" style="font-family:'Lato',sans-serif">Sold</a>
        <a href="/buying" data-nav class="text-white text-[13px] md:text-[14px] leading-[20px] hover:text-[#daaf3a] transition-colors duration-300 border-b border-white py-[2px]" style="font-family:'Lato',sans-serif">Buying</a>
        <a href="/selling" data-nav class="text-white text-[13px] md:text-[14px] leading-[20px] hover:text-[#daaf3a] transition-colors duration-300 border-b border-white py-[2px]" style="font-family:'Lato',sans-serif">Selling</a>
        <a href="/blog" data-nav class="text-white text-[13px] md:text-[14px] leading-[20px] hover:text-[#daaf3a] transition-colors duration-300 border-b border-white py-[2px]" style="font-family:'Lato',sans-serif">Blog</a>
        <a href="/about" data-nav class="text-white text-[13px] md:text-[14px] leading-[20px] hover:text-[#daaf3a] transition-colors duration-300 border-b border-white py-[2px]" style="font-family:'Lato',sans-serif">About</a>
        <a href="/contact" data-nav class="text-white text-[13px] md:text-[14px] leading-[20px] hover:text-[#daaf3a] transition-colors duration-300 border-b border-white py-[2px]" style="font-family:'Lato',sans-serif">Contact</a>
      </nav>
    </div>
    <div class="mt-6 md:mt-10 flex justify-center lg:justify-end"><a href="/privacy" data-nav class="text-white/40 text-[8px] leading-[12px] hover:text-white/60 transition-colors duration-300" style="font-family:'Lato',sans-serif">Privacy Policy</a></div>
    <div class="mt-4 md:mt-6"></div>
    <p class="text-white/70 text-[8px] leading-[12px] font-light" style="font-family:'Lato',sans-serif">Remax House of Real Estate | 4034 &ndash; 16th Street SW, Calgary, AB T2T 4H4. Each RE/MAX office is independently owned and operated. RE/MAX House of Real Estate fully supports the Equal Housing Opportunity laws. RE/MAX House of Real Estate make no representations, warranties, or guarantees as to the accuracy of the information contained herein, including square footage, lot size, or other information concerning the condition, suitability, or features of the property. All material is intended for informational purposes only and has been obtained from public records, MLS, or other sources believed to be reliable, but not verified. All prospective buyers should conduct a careful, independent investigation of the information and property, and consult with appropriate professionals, such as appraisers, architects, civil engineers, or others. | &copy; 2025 RE/MAX House of Real Estate. All rights reserved.</p>
  </div>
</footer>`;
}

export function getClientJS(): string {
  return `
(function(){
  /* --- Router --- */
  var pages=document.querySelectorAll('[data-page]');
  var basePath=window.__HOSTED_BASE||'';

  function revealActive(){
    var active=document.querySelector('[data-page].active');
    if(!active)return;
    active.querySelectorAll('.sr').forEach(function(el){
      el.classList.remove('visible');
      void el.offsetWidth;
      obs.observe(el);
    });
    active.querySelectorAll('.hero-fade').forEach(function(el){
      el.style.animation='none';
      void el.offsetWidth;
      el.style.animation='';
    });
  }

  function go(path){
    pages.forEach(function(p){p.classList.toggle('active',p.getAttribute('data-page')===path);});
    window.scrollTo(0,0);
    var ov=document.getElementById('menu-overlay');
    if(ov)ov.classList.remove('open');
    document.body.style.overflow='';
    setTimeout(revealActive,50);
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[data-nav]');
    if(!a)return;
    var h=a.getAttribute('href');
    if(!h||h.startsWith('http')||h.startsWith('mailto:')||h.startsWith('tel:'))return;
    e.preventDefault();
    history.pushState(null,'',basePath+h);
    go(h);
  });
  window.addEventListener('popstate',function(){
    var p=location.pathname.replace(basePath,'');
    if(!p||p==='')p='/';
    go(p);
  });

  /* --- Scroll Reveal --- */
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('visible');obs.unobserve(entry.target);}});
  },{threshold:0.1,rootMargin:'0px'});

  /* --- Sticky Header --- */
  var hdr=document.getElementById('site-header');
  var stickyStyle=document.createElement('style');
  stickyStyle.textContent='#site-header.scrolled{background:rgba(9,49,42,0.95);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 4px 30px rgba(0,0,0,0.3);}';
  document.head.appendChild(stickyStyle);
  window.addEventListener('scroll',function(){
    if(!hdr)return;
    hdr.classList.toggle('scrolled',window.scrollY>50);
  },{passive:true});

  /* --- Menu Overlay --- */
  var overlay=document.getElementById('menu-overlay');
  function toggleMenu(){
    if(!overlay)return;
    var open=overlay.classList.toggle('open');
    document.body.style.overflow=open?'hidden':'';
  }
  var mb=document.getElementById('menu-toggle-mobile');
  var md=document.getElementById('menu-toggle-desktop');
  var mc=document.getElementById('menu-close');
  if(mb)mb.addEventListener('click',toggleMenu);
  if(md)md.addEventListener('click',toggleMenu);
  if(mc)mc.addEventListener('click',function(){overlay.classList.remove('open');document.body.style.overflow='';});
  overlay.querySelectorAll('a[data-nav]').forEach(function(a){a.addEventListener('click',function(){overlay.classList.remove('open');document.body.style.overflow='';});});

  /* --- Testimonials Slider --- */
  var testSliders=document.querySelectorAll('[data-testimonials]');
  testSliders.forEach(function(slider){
    var items=slider.querySelectorAll('.test-item');
    var dots=slider.querySelectorAll('.test-dot');
    var cur=0;
    function show(i){
      items.forEach(function(el,idx){el.style.display=idx===i?'block':'none';});
      dots.forEach(function(d,idx){d.className=idx===i?'test-dot w-2 h-2 rounded-full gold-gradient-bg':'test-dot w-2 h-2 rounded-full bg-white/20';});
      cur=i;
    }
    show(0);
    var prev=slider.querySelector('.test-prev');
    var next=slider.querySelector('.test-next');
    if(prev)prev.addEventListener('click',function(){show(cur<=0?items.length-1:cur-1);});
    if(next)next.addEventListener('click',function(){show(cur>=items.length-1?0:cur+1);});
    dots.forEach(function(d,i){d.addEventListener('click',function(){show(i);});});
  });

  /* --- Listings Slider --- */
  var listSliders=document.querySelectorAll('[data-listings-slider]');
  listSliders.forEach(function(slider){
    var pages=slider.querySelectorAll('.listing-page');
    var curP=0;
    function showPage(i){pages.forEach(function(p,idx){p.style.display=idx===i?'flex':'none';});curP=i;}
    showPage(0);
    var prevB=slider.querySelector('.ls-prev');
    var nextB=slider.querySelector('.ls-next');
    if(prevB)prevB.addEventListener('click',function(){showPage(curP<=0?pages.length-1:curP-1);});
    if(nextB)nextB.addEventListener('click',function(){showPage(curP>=pages.length-1?0:curP+1);});
  });

  /* --- Buying Process Accordion --- */
  document.querySelectorAll('[data-step-accordion]').forEach(function(container){
    var steps=container.querySelectorAll('.step-item');
    steps.forEach(function(step,i){
      step.addEventListener('mouseenter',function(){
        steps.forEach(function(s,j){
          s.classList.toggle('active',j===i);
          var desc=s.querySelector('.step-desc');
          if(desc)desc.style.maxHeight=j===i?desc.scrollHeight+'px':'0';
        });
      });
    });
    if(steps[0]){steps[0].classList.add('active');var d=steps[0].querySelector('.step-desc');if(d)d.style.maxHeight=d.scrollHeight+'px';}
  });

  /* --- Marketing Slider --- */
  document.querySelectorAll('[data-mktg-slider]').forEach(function(slider){
    var items=JSON.parse(slider.getAttribute('data-mktg-items')||'[]');
    var cur=0;
    var imgEl=slider.querySelector('.mktg-img');
    var labelEl=slider.querySelector('.mktg-label');
    var titleEl=slider.querySelector('.mktg-title');
    var descEl=slider.querySelector('.mktg-desc');
    var dotsC=slider.querySelector('.mktg-dots');
    var counterEl=slider.querySelector('.mktg-counter');
    function show(i){
      if(!items[i])return;
      cur=i;
      if(imgEl)imgEl.src=items[i].image;
      if(labelEl)labelEl.textContent=items[i].label;
      if(titleEl)titleEl.textContent=items[i].title;
      if(descEl)descEl.textContent=items[i].description;
      if(counterEl)counterEl.textContent=String(i+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');
      if(dotsC){var dots=dotsC.querySelectorAll('button');dots.forEach(function(d,j){d.className=j===i?'h-[3px] w-[24px] gold-gradient-bg transition-all duration-400':'h-[3px] w-[12px] bg-white/20 hover:bg-white/40 transition-all duration-400';});}
    }
    show(0);
    var prevB=slider.querySelector('.mktg-prev');
    var nextB=slider.querySelector('.mktg-next');
    if(prevB)prevB.addEventListener('click',function(){show(cur<=0?items.length-1:cur-1);});
    if(nextB)nextB.addEventListener('click',function(){show(cur>=items.length-1?0:cur+1);});
    if(dotsC){dotsC.querySelectorAll('button').forEach(function(d,i){d.addEventListener('click',function(){show(i);});});}
  });

  /* --- Lazy-load below-fold images --- */
  document.querySelectorAll('img').forEach(function(img,i){
    if(i>2)img.setAttribute('loading','lazy');
    img.setAttribute('decoding','async');
  });

  /* --- Init: show correct page --- */
  var initPath=window.__INITIAL_PATH__||'/';
  go(initPath);
})();
`.trim();
}

export { IMG };
