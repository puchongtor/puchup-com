export const PROJECT_ONE_STYLES = `
  :root{
    --bg:#FCFAF5;
    --bg-alt:#F3EEE0;
    --ink:#0D182C;
    --ink-soft:#5B6472;
    --ink-faint:#8C93A0;
    --purple:#6B4EFF;
    --orange:#FF8A45;
    --line:#E4DECB;
    --card:#FFFFFF;
  }
  *{box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{
    background:var(--bg);
    color:var(--ink);
    font-family:'Noto Sans Thai','Fraunces',sans-serif;
    -webkit-font-smoothing:antialiased;
  }
  .font-display{ font-family:'Fraunces','Noto Sans Thai',serif; font-optical-sizing:auto; }
  .font-mono{ font-family:'IBM Plex Mono',monospace; letter-spacing:.08em; }
  .grad-text{
    background:linear-gradient(100deg,var(--purple),var(--orange));
    -webkit-background-clip:text; background-clip:text; color:transparent;
  }
  .grad-bg{ background:linear-gradient(120deg,var(--purple),var(--orange)); }
  .grad-ring{
    background:linear-gradient(140deg, rgba(107,78,255,.14), rgba(255,138,69,.14));
  }
  .eyebrow{
    font-family:'IBM Plex Mono',monospace; font-size:.72rem; letter-spacing:.18em;
    text-transform:uppercase; color:var(--purple); font-weight:500;
  }
  .hairline{ border-color:var(--line); }
  .section-pad{ padding-top:clamp(4rem,9vw,7.5rem); padding-bottom:clamp(4rem,9vw,7.5rem); }
  .reveal{ opacity:0; transform:translateY(22px); transition:opacity .8s ease, transform .8s ease; }
  .reveal.in{ opacity:1; transform:translateY(0); }
  .num-tag{
    font-family:'IBM Plex Mono',monospace; font-size:.7rem; color:var(--ink-faint);
    border:1px solid var(--line); border-radius:999px; padding:.2rem .6rem;
  }
  ::selection{ background:var(--purple); color:#fff; }

  /* Hero convergence animation */
  .float-pill{
    position:absolute; font-family:'IBM Plex Mono',monospace; font-size:.72rem;
    letter-spacing:.06em; padding:.45rem .9rem; border-radius:999px;
    background:#fff; border:1px solid var(--line); color:var(--ink-soft);
    box-shadow:0 6px 20px -8px rgba(13,24,44,.15);
    animation: drift 7s ease-in-out infinite;
    will-change: transform;
  }
  @keyframes drift{
    0%,100%{ transform:translateY(0px) translateX(0px); }
    50%{ transform:translateY(-10px) translateX(4px); }
  }
  .hero-frame{
    animation: pulseframe 5s ease-in-out infinite;
  }
  @keyframes pulseframe{
    0%,100%{ box-shadow:0 30px 80px -30px rgba(107,78,255,.25); }
    50%{ box-shadow:0 30px 90px -20px rgba(255,138,69,.28); }
  }

  /* Tabs */
  .tab-btn{ color:var(--ink-faint); border-bottom:2px solid transparent; transition:.25s; }
  .tab-btn.active{ color:var(--ink); border-bottom-color:var(--purple); }
  .filter-chip{
    border:1px solid var(--line); color:var(--ink-soft); transition:.2s;
  }
  .filter-chip.active{ background:var(--ink); color:#fff; border-color:var(--ink); }

  .sticky-nav{ backdrop-filter: blur(10px); background:rgba(252,250,245,.82); }

  /* image placeholders */
  .img-slot{ position:relative; overflow:hidden; background:var(--bg-alt); }
  .img-slot img{ width:100%; height:100%; object-fit:cover; display:block; transition:transform .6s ease; }
  .img-slot:hover img{ transform:scale(1.045); }
  .img-tag{
    position:absolute; bottom:.55rem; left:.55rem; font-family:'IBM Plex Mono',monospace;
    font-size:.6rem; letter-spacing:.05em; background:rgba(13,24,44,.72); color:#fff;
    padding:.18rem .5rem; border-radius:4px; opacity:0; transition:.2s;
  }
  .img-slot:hover .img-tag{ opacity:1; }

  @media (prefers-reduced-motion: reduce){
    .float-pill, .hero-frame{ animation:none !important; }
    .reveal{ transition:none; }
  }
`;

export const PROJECT_ONE_BODY = `

<!-- ============ NAV ============ -->
<nav id="mainnav" class="fixed top-0 left-0 right-0 z-50 border-b hairline sticky-nav">
  <div class="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16">
    <a href="#top" class="flex items-center gap-2 font-display font-semibold text-lg">
      <span class="w-7 h-7 rounded-md grad-bg inline-block"></span>
      PuchUp
    </a>
    <div class="hidden lg:flex items-center gap-8 text-sm text-[var(--ink-soft)]">
      <a href="#one" class="hover:text-[var(--ink)]">Project ONE</a>
      <a href="#how" class="hover:text-[var(--ink)]">How It Works</a>
      <a href="/demo/" class="hover:text-[var(--ink)]">ตัวอย่างธุรกิจ</a>
      <a href="#google" class="hover:text-[var(--ink)]">Google Business</a>
      <a href="#growth" class="hover:text-[var(--ink)]">Growth</a>
      <a href="#demo" class="hover:text-[var(--ink)]">Demo</a>
    </div>
    <a href="#final-cta" class="text-sm font-medium bg-[var(--ink)] text-white rounded-full px-5 py-2 hover:opacity-85 transition">Build My ONE</a>
  </div>
</nav>

<!-- ============ HERO ============ -->
<header id="top" class="relative pt-40 pb-28 md:pt-48 md:pb-36 overflow-hidden">
  <div class="absolute inset-0 grad-ring -z-10"></div>
  <div class="max-w-5xl mx-auto px-5 md:px-8 text-center relative">
    <p class="eyebrow mb-5">PUCHUP PROJECT ONE</p>
    <h1 class="font-display font-semibold leading-[1.02] text-[clamp(2.6rem,7vw,5.2rem)]">
      One Page.<br><span class="grad-text">Full Business.</span>
    </h1>
    <p class="mt-6 text-lg md:text-xl text-[var(--ink-soft)] max-w-2xl mx-auto">
      เว็บไซต์หน้าเดียว ที่ทำให้ลูกค้ารู้จักธุรกิจ ตัดสินใจ และอยากมาที่ร้าน
    </p>
    <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="#one" class="grad-bg text-white rounded-full px-7 py-3.5 font-medium text-sm hover:opacity-90 transition">ดู Project ONE</a>
      <a href="/demo/" class="border hairline rounded-full px-7 py-3.5 font-medium text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition">ดูตัวอย่างธุรกิจ</a>
    </div>

    <!-- Hero convergence visual -->
    <div class="relative mt-20 h-[300px] md:h-[340px] max-w-lg mx-auto">
      <div class="float-pill" style="top:2%; left:4%; animation-delay:.2s;">About</div>
      <div class="float-pill" style="top:10%; right:2%; animation-delay:1.1s;">Services</div>
      <div class="float-pill" style="bottom:32%; left:-4%; animation-delay:.6s;">Products</div>
      <div class="float-pill" style="bottom:24%; right:-2%; animation-delay:1.6s;">Gallery</div>
      <div class="float-pill" style="bottom:6%; left:10%; animation-delay:2.1s;">Reviews</div>
      <div class="float-pill" style="bottom:0%; right:14%; animation-delay:.9s;">Location</div>
      <div class="float-pill" style="top:-4%; left:38%; animation-delay:1.4s;">Contact</div>

      <div class="hero-frame absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-[220px] md:w-[250px] aspect-[9/16] bg-white rounded-[1.6rem] border hairline flex flex-col items-center justify-center gap-2 p-4">
        <span class="w-8 h-8 rounded-lg grad-bg"></span>
        <p class="font-display font-semibold text-sm text-center leading-tight">ONE<br>PAGE</p>
        <p class="text-[10px] text-[var(--ink-faint)] font-mono text-center mt-1">FULL BUSINESS</p>
      </div>
    </div>
    <p class="mt-8 text-sm text-[var(--ink-soft)] font-medium">หลายสิ่งที่ลูกค้าต้องรู้ ไม่จำเป็นต้องอยู่หลายหน้า</p>
    <p class="mt-1 eyebrow">Designed for Local Businesses</p>
  </div>
</header>

<!-- ============ PROBLEM ============ -->
<section class="section-pad reveal">
  <div class="max-w-4xl mx-auto px-5 md:px-8 text-center">
    <p class="eyebrow mb-4">THE PROBLEM</p>
    <h2 class="font-display font-semibold text-[clamp(1.8rem,4vw,2.8rem)] leading-tight">
      เว็บไซต์ไม่จำเป็นต้องใหญ่<br class="hidden md:block"> เพื่อให้ธุรกิจดูใหญ่
    </h2>
    <p class="mt-6 text-[var(--ink-soft)] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
      เว็บไซต์ธุรกิจจำนวนมากมีหลายหน้า — Home, About, Services, Gallery, Contact —
      แต่ลูกค้าจริง ๆ ต้องการรู้เพียงว่า คุณคือใคร มีอะไร ดีอย่างไร คนอื่นคิดอย่างไร
      อยู่ที่ไหน และควรไปหาคุณไหม
    </p>
    <p class="mt-6 font-display italic text-[var(--ink)] text-lg">
      Project ONE จึงออกแบบทุกอย่างให้เดินทางไปถึงคำตอบเหล่านี้ ภายในประสบการณ์เดียว
    </p>
  </div>
</section>

<!-- ============ HOW ONE WORKS ============ -->
<section id="how" class="section-pad bg-[var(--bg-alt)] reveal">
  <div class="max-w-6xl mx-auto px-5 md:px-8">
    <div class="text-center mb-14">
      <p class="eyebrow mb-3">HOW ONE WORKS</p>
      <h2 class="font-display font-semibold text-[clamp(1.8rem,4vw,2.6rem)]">From "Who are you?" <span class="grad-text">to "I'm coming."</span></h2>
    </div>
    <div class="grid md:grid-cols-5 gap-6">
      <div class="md:col-span-1"><div class="num-tag inline-block mb-3">01</div><p class="font-display font-medium text-lg">Discover</p><p class="text-sm text-[var(--ink-soft)] mt-1">ลูกค้าเห็นธุรกิจ</p></div>
      <div class="md:col-span-1"><div class="num-tag inline-block mb-3">02</div><p class="font-display font-medium text-lg">Explore</p><p class="text-sm text-[var(--ink-soft)] mt-1">ดูบริการ / สินค้า / รูปภาพ</p></div>
      <div class="md:col-span-1"><div class="num-tag inline-block mb-3">03</div><p class="font-display font-medium text-lg">Trust</p><p class="text-sm text-[var(--ink-soft)] mt-1">ดูรีวิว / ผลงาน / เรื่องราว</p></div>
      <div class="md:col-span-1"><div class="num-tag inline-block mb-3">04</div><p class="font-display font-medium text-lg">Decide</p><p class="text-sm text-[var(--ink-soft)] mt-1">ดูราคา / รายละเอียด</p></div>
      <div class="md:col-span-1"><div class="num-tag inline-block mb-3">05</div><p class="font-display font-medium text-lg">Action</p><p class="text-sm text-[var(--ink-soft)] mt-1">โทร / LINE / จอง / นำทาง</p></div>
    </div>
  </div>
</section>

<!-- ============ ONE PAGE != SIMPLE PAGE ============ -->
<section id="one" class="section-pad reveal">
  <div class="max-w-6xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-14 items-center">
    <div>
      <p class="eyebrow mb-4">NOT WHAT YOU THINK</p>
      <h2 class="font-display font-semibold text-[clamp(1.9rem,4vw,2.8rem)] leading-tight">หน้าเดียว<br>ไม่ได้แปลว่าเรียบง่าย</h2>
      <p class="mt-6 text-[var(--ink-soft)] leading-relaxed">
        Project ONE ใช้หน้าเดียวเป็นพื้นที่หลัก แต่ภายในสามารถแบ่งประสบการณ์ออกเป็นหลายส่วนได้
        ทำให้ผู้ใช้งานรู้สึกเหมือนกำลังสำรวจเว็บไซต์หลายหน้า
      </p>
      <p class="mt-6 font-display text-xl">One URL. One Experience.<br><span class="grad-text">Everything your customer needs.</span></p>
    </div>
    <div class="rounded-2xl border hairline bg-white overflow-hidden shadow-[0_30px_70px_-40px_rgba(13,24,44,.35)]">
      <div class="flex items-center gap-1.5 px-4 py-3 border-b hairline bg-[var(--bg-alt)]">
        <span class="w-2.5 h-2.5 rounded-full bg-[#E4A0A0]"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-[#E7D28E]"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-[#9FD3AE]"></span>
        <span class="ml-3 text-xs text-[var(--ink-faint)] font-mono">yourbusiness.puchup.com</span>
      </div>
      <div class="grid grid-cols-2">
        <div class="p-6 border-r hairline flex flex-col justify-center">
          <p class="font-mono text-xs text-[var(--ink-faint)] mb-2">LEFT</p>
          <p class="font-display font-semibold text-2xl">ONE PAGE</p>
        </div>
        <div class="p-6 text-sm text-[var(--ink-soft)] space-y-1.5">
          <p class="font-mono text-xs text-[var(--ink-faint)] mb-2">RIGHT — BUSINESS</p>
          <p>├ Story</p><p>├ Services</p><p>├ Products</p><p>├ Gallery</p>
          <p>├ Reviews</p><p>├ FAQ</p><p>├ Location</p><p>└ Contact</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ BUSINESS JOURNEY ============ -->
<section class="section-pad bg-[var(--ink)] text-[var(--bg)] reveal">
  <div class="max-w-5xl mx-auto px-5 md:px-8 text-center">
    <p class="eyebrow mb-4" style="color:var(--orange)">THE BUSINESS JOURNEY</p>
    <h2 class="font-display font-semibold text-[clamp(1.9rem,4vw,2.8rem)] mb-14">
      เราไม่ได้ออกแบบ "หน้าเว็บ"<br>เราออกแบบการเดินทางของลูกค้า
    </h2>
    <div class="flex flex-wrap justify-center gap-3 md:gap-4 text-sm font-mono">
      <span class="px-4 py-2 rounded-full border border-white/20">SEE</span>
      <span class="opacity-40">→</span>
      <span class="px-4 py-2 rounded-full border border-white/20">FEEL</span>
      <span class="opacity-40">→</span>
      <span class="px-4 py-2 rounded-full border border-white/20">KNOW</span>
      <span class="opacity-40">→</span>
      <span class="px-4 py-2 rounded-full border border-white/20">TRUST</span>
      <span class="opacity-40">→</span>
      <span class="px-4 py-2 rounded-full border border-white/20">WANT</span>
      <span class="opacity-40">→</span>
      <span class="px-4 py-2 rounded-full border border-white/20">GO</span>
      <span class="opacity-40">→</span>
      <span class="px-4 py-2 rounded-full grad-bg text-white">CONTACT</span>
    </div>
  </div>
</section>

<!-- ============ DEMO LIBRARY ============ -->
<section id="demo" class="section-pad bg-[var(--bg-alt)] reveal">
  <div class="max-w-6xl mx-auto px-5 md:px-8">
    <div class="text-center mb-10">
      <p class="eyebrow mb-3">DEMO LIBRARY</p>
      <h2 class="font-display font-semibold text-[clamp(1.9rem,4vw,2.8rem)]">See it. <span class="grad-text">Before you build it.</span></h2>
      <p class="mt-4 text-[var(--ink-soft)] max-w-2xl mx-auto">เรากำลังสร้าง Project ONE สำหรับธุรกิจหลากหลายประเภท เพื่อให้คุณเห็นภาพว่าแนวคิดเดียวกันสามารถเปลี่ยนเป็นประสบการณ์ที่แตกต่างกันได้อย่างไร</p>
    </div>

    <div id="filterTabs" class="flex flex-wrap justify-center gap-2 mb-10">
      <button data-filter="all" class="filter-chip active rounded-full px-4 py-1.5 text-sm font-mono">All</button>
      <button data-filter="restaurant" class="filter-chip rounded-full px-4 py-1.5 text-sm font-mono">Restaurant</button>
      <button data-filter="cafe" class="filter-chip rounded-full px-4 py-1.5 text-sm font-mono">Café</button>
      <button data-filter="health" class="filter-chip rounded-full px-4 py-1.5 text-sm font-mono">Health</button>
      <button data-filter="hotel" class="filter-chip rounded-full px-4 py-1.5 text-sm font-mono">Hotel</button>
      <button data-filter="retail" class="filter-chip rounded-full px-4 py-1.5 text-sm font-mono">Retail</button>
      <button data-filter="creator" class="filter-chip rounded-full px-4 py-1.5 text-sm font-mono">Creator</button>
    </div>

    <div id="demoGrid" class="grid sm:grid-cols-2 md:grid-cols-3 gap-6"></div>

    <div class="text-center mt-12">
      <a href="/demo/" class="inline-flex items-center gap-2 text-sm font-medium text-[var(--purple)] hover:opacity-75 transition">
        ดูตัวอย่างธุรกิจทั้งหมด 50+ ประเภท →
      </a>
    </div>
  </div>
</section>

<!-- ============ GOOGLE BUSINESS ============ -->
<section id="google" class="section-pad reveal">
  <div class="max-w-6xl mx-auto px-5 md:px-8">
    <div class="text-center mb-12">
      <p class="eyebrow mb-3">PROJECT ONE + GOOGLE BUSINESS</p>
      <h2 class="font-display font-semibold text-[clamp(1.9rem,4vw,2.8rem)]">เว็บไซต์ของคุณ<br>ไม่ควรอยู่คนเดียว</h2>
      <p class="mt-4 text-[var(--ink-soft)] max-w-2xl mx-auto">ลูกค้าอาจพบธุรกิจของคุณจาก Google ก่อนที่จะเห็นเว็บไซต์ ดังนั้น Project ONE ถูกออกแบบให้ทำงานร่วมกับ Google Business Profile</p>
    </div>

    <div class="flex justify-center gap-8 border-b hairline mb-10 text-sm font-medium">
      <button data-gtab="website" class="tab-btn active pb-3">WEBSITE</button>
      <button data-gtab="gbusiness" class="tab-btn pb-3">GOOGLE BUSINESS</button>
      <button data-gtab="growth" class="tab-btn pb-3">LOCAL GROWTH</button>
    </div>

    <!-- WEBSITE panel -->
    <div id="panel-website" class="gpanel grid md:grid-cols-2 gap-10 items-center">
      <div class="img-slot rounded-2xl aspect-[4/3]" data-prompt="Warm editorial hero photo of a cozy Bangkok café storefront at golden hour, premium lifestyle photography, soft natural light" data-slot-id="one-website-hero">
        <img src="https://picsum.photos/seed/puchup-website/900/700" alt="Business website preview">
        <span class="img-tag">imagen: café storefront, golden hour</span>
      </div>
      <div>
        <p class="font-display text-xl mb-3">One page, everything a customer needs to decide.</p>
        <p class="text-[var(--ink-soft)]">Story, services, gallery, reviews, location and contact — living inside a single scroll built for the moment someone decides where to go.</p>
      </div>
    </div>

    <!-- GOOGLE BUSINESS panel -->
    <div id="panel-gbusiness" class="gpanel hidden grid md:grid-cols-2 gap-10 items-start">
      <div>
        <p class="font-display text-xl mb-2">เมื่อคนค้นหา คุณต้องพร้อมให้เขาเจอ</p>
        <p class="text-[var(--ink-soft)] mb-6">Search Preview — ตัวอย่างจำลอง ไม่ใช่ UI ของ Google จริง</p>
        <div class="rounded-2xl border hairline bg-white p-5">
          <div class="flex gap-4">
            <div class="img-slot rounded-lg w-20 h-20 shrink-0" data-prompt="Small square logo mockup for a boutique café, minimalist icon style, warm palette" data-slot-id="one-gbiz-logo">
              <img src="https://picsum.photos/seed/puchup-gbiz-logo/200/200" alt="Business logo">
            </div>
            <div>
              <p class="font-medium">Mellow House Café</p>
              <p class="text-sm text-[var(--ink-soft)]">⭐ 4.8 · Café · Bangkok</p>
              <p class="text-sm text-[#4C9A6A]">Open now</p>
            </div>
          </div>
          <div class="grid grid-cols-4 gap-2 mt-5 text-center text-xs text-[var(--ink-soft)]">
            <div class="border hairline rounded-lg py-2">📍 Location</div>
            <div class="border hairline rounded-lg py-2">⭐ Reviews</div>
            <div class="border hairline rounded-lg py-2">📸 Photos</div>
            <div class="border hairline rounded-lg py-2">🕐 Hours</div>
          </div>
        </div>
      </div>
      <div class="rounded-2xl overflow-hidden border hairline">
        <iframe
          title="Business location map placeholder"
          class="w-full h-[300px] md:h-[380px]"
          style="border:0"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=Bangkok,Thailand&output=embed">
        </iframe>
        <p class="text-xs font-mono text-[var(--ink-faint)] px-4 py-2 bg-[var(--bg-alt)]">แผนที่ตัวอย่าง — แทนที่ query ด้วยที่อยู่จริงของธุรกิจ (Google Maps Embed API)</p>
      </div>
    </div>

    <!-- GROWTH panel -->
    <div id="panel-growth" class="gpanel hidden">
      <div class="max-w-3xl mx-auto text-center">
        <p class="font-display text-xl mb-3">ไม่ใช่แค่ SEO แต่คือการสร้างตัวตนของธุรกิจบนโลกจริง</p>
        <div class="flex flex-wrap justify-center items-center gap-3 mt-6 text-sm font-mono">
          <span class="px-4 py-2 rounded-full border hairline">Google Business</span>
          <span class="opacity-40">+</span>
          <span class="px-4 py-2 rounded-full border hairline">Project ONE</span>
          <span class="opacity-40">+</span>
          <span class="px-4 py-2 rounded-full border hairline">Content</span>
          <span class="opacity-40">+</span>
          <span class="px-4 py-2 rounded-full border hairline">Reviews</span>
          <span class="opacity-40">=</span>
          <span class="px-4 py-2 rounded-full grad-bg text-white">Stronger Local Presence</span>
        </div>
      </div>
    </div>

    <div class="text-center mt-14">
      <p class="font-display text-xl md:text-2xl">Google helps them find you.<br><span class="grad-text">Project ONE gives them a reason to come.</span></p>
    </div>
  </div>
</section>

<!-- ============ THE ENGINE ============ -->
<section class="section-pad bg-[var(--ink)] text-[var(--bg)] reveal">
  <div class="max-w-5xl mx-auto px-5 md:px-8">
    <div class="text-center mb-14">
      <p class="eyebrow mb-3" style="color:var(--orange)">THE ENGINE</p>
      <h2 class="font-display font-semibold text-[clamp(1.9rem,4vw,2.8rem)]">สิ่งที่คุณเห็นคือเว็บไซต์<br>แต่สิ่งที่อยู่ข้างในคือระบบ</h2>
    </div>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="rounded-2xl border border-white/15 p-8">
        <p class="font-mono text-xs opacity-60 mb-4">THE EXPERIENCE</p>
        <p class="font-display text-lg">Website · Design · Content · Images</p>
      </div>
      <div class="rounded-2xl border border-white/15 p-8" style="background:linear-gradient(140deg, rgba(107,78,255,.18), rgba(255,138,69,.14));">
        <p class="font-mono text-xs opacity-60 mb-4">THE ENGINE</p>
        <p class="font-display text-lg">Structure · Performance · Search · Mobile UX · Conversion · Analytics · Scalability</p>
      </div>
    </div>
  </div>
</section>

<!-- ============ BUILT TO GROW ============ -->
<section id="growth" class="section-pad reveal">
  <div class="max-w-4xl mx-auto px-5 md:px-8 text-center">
    <p class="eyebrow mb-3">BUILT TO GROW</p>
    <h2 class="font-display font-semibold text-[clamp(1.9rem,4vw,2.8rem)] mb-12">วันนี้เป็น One Page<br>พรุ่งนี้ไปได้ไกลกว่านั้น</h2>
    <div class="flex flex-wrap justify-center gap-2 text-sm font-mono">
      <span class="px-4 py-2 rounded-full border hairline">START · Project ONE</span>
      <span class="opacity-30">→</span>
      <span class="px-4 py-2 rounded-full border hairline">GROW · Google Business</span>
      <span class="opacity-30">→</span>
      <span class="px-4 py-2 rounded-full border hairline">BUILD · Content</span>
      <span class="opacity-30">→</span>
      <span class="px-4 py-2 rounded-full border hairline">CONNECT · LINE/Booking</span>
      <span class="opacity-30">→</span>
      <span class="px-4 py-2 rounded-full grad-bg text-white">SCALE · Digital System</span>
    </div>
  </div>
</section>

<!-- ============ WHAT'S INSIDE ============ -->
<section class="section-pad bg-[var(--bg-alt)] reveal">
  <div class="max-w-5xl mx-auto px-5 md:px-8">
    <div class="text-center mb-12">
      <p class="eyebrow mb-3">WHAT'S INSIDE</p>
      <h2 class="font-display font-semibold text-[clamp(1.9rem,4vw,2.6rem)]">เลือกเฉพาะสิ่งที่ธุรกิจของคุณต้องการ</h2>
      <p class="mt-3 text-[var(--ink-soft)]">ไม่ใช่ทุกธุรกิจต้องเหมือนกัน</p>
    </div>
    <div class="flex flex-wrap justify-center gap-2.5 text-sm">
      <span class="bg-white border hairline rounded-full px-4 py-2">Business Story</span>
      <span class="bg-white border hairline rounded-full px-4 py-2">Services</span>
      <span class="bg-white border hairline rounded-full px-4 py-2">Products</span>
      <span class="bg-white border hairline rounded-full px-4 py-2">Gallery</span>
      <span class="bg-white border hairline rounded-full px-4 py-2">Reviews</span>
      <span class="bg-white border hairline rounded-full px-4 py-2">FAQ</span>
      <span class="bg-white border hairline rounded-full px-4 py-2">Opening Hours</span>
      <span class="bg-white border hairline rounded-full px-4 py-2">Location</span>
      <span class="bg-white border hairline rounded-full px-4 py-2">Google Maps</span>
      <span class="bg-white border hairline rounded-full px-4 py-2">Contact</span>
      <span class="bg-white border hairline rounded-full px-4 py-2">LINE</span>
      <span class="bg-white border hairline rounded-full px-4 py-2">Booking</span>
      <span class="bg-white border hairline rounded-full px-4 py-2">Articles</span>
      <span class="bg-white border hairline rounded-full px-4 py-2">Promotions</span>
    </div>
  </div>
</section>

<!-- ============ CONTENT / ARTICLES ============ -->
<section class="section-pad reveal">
  <div class="max-w-6xl mx-auto px-5 md:px-8">
    <div class="text-center mb-12">
      <p class="eyebrow mb-3">CONTENT & ARTICLES</p>
      <h2 class="font-display font-semibold text-[clamp(1.9rem,4vw,2.6rem)]">One Page ไม่ได้แปลว่าไม่มี Content</h2>
    </div>
    <div class="grid md:grid-cols-3 gap-6">
      <article class="rounded-xl overflow-hidden border hairline bg-white">
        <div class="img-slot aspect-[16/10]" data-prompt="Warm neighbourhood street scene near a small local shop, documentary lifestyle photography" data-slot-id="one-article-1">
          <img src="https://picsum.photos/seed/puchup-article1/700/440" alt="">
          <span class="img-tag">imagen: neighbourhood scene</span>
        </div>
        <div class="p-5">
          <p class="eyebrow mb-2">LOCAL</p>
          <p class="font-display text-lg leading-snug">5 เหตุผลที่คนในย่านนี้เลือกมาที่ร้านเรา</p>
          <a href="#" class="inline-block mt-4 text-sm font-medium text-[var(--purple)]">Read Article →</a>
        </div>
      </article>
      <article class="rounded-xl overflow-hidden border hairline bg-white">
        <div class="img-slot aspect-[16/10]" data-prompt="Founder working quietly inside a small shop, candid warm portrait, editorial tone" data-slot-id="one-article-2">
          <img src="https://picsum.photos/seed/puchup-article2/700/440" alt="">
          <span class="img-tag">imagen: founder portrait</span>
        </div>
        <div class="p-5">
          <p class="eyebrow mb-2">STORY</p>
          <p class="font-display text-lg leading-snug">จากร้านเล็ก ๆ สู่ร้านที่คนกลับมาอีกครั้ง</p>
          <a href="#" class="inline-block mt-4 text-sm font-medium text-[var(--purple)]">Read Article →</a>
        </div>
      </article>
      <article class="rounded-xl overflow-hidden border hairline bg-white">
        <div class="img-slot aspect-[16/10]" data-prompt="Close-up of product display and menu on a wooden table, natural window light, premium still life" data-slot-id="one-article-3">
          <img src="https://picsum.photos/seed/puchup-article3/700/440" alt="">
          <span class="img-tag">imagen: product still life</span>
        </div>
        <div class="p-5">
          <p class="eyebrow mb-2">GUIDE</p>
          <p class="font-display text-lg leading-snug">ก่อนมาร้านเรา มีอะไรที่คุณควรรู้</p>
          <a href="#" class="inline-block mt-4 text-sm font-medium text-[var(--purple)]">Read Article →</a>
        </div>
      </article>
    </div>
  </div>
</section>

<!-- ============ MOBILE FIRST ============ -->
<section class="section-pad bg-[var(--bg-alt)] reveal">
  <div class="max-w-5xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-14 items-center">
    <div>
      <p class="eyebrow mb-4">MOBILE FIRST</p>
      <h2 class="font-display font-semibold text-[clamp(1.8rem,4vw,2.6rem)] leading-tight">ลูกค้าของคุณไม่ได้เปิดเว็บ<br>เพื่อ "อ่านเว็บไซต์"</h2>
      <p class="mt-5 text-[var(--ink-soft)]">เขาเปิดเพื่อหาอะไรบางอย่าง</p>
      <p class="mt-8 font-display text-xl grad-text">Designed for the moment of decision.</p>
    </div>
    <div class="mx-auto w-[220px] rounded-[2rem] border hairline bg-white p-4 space-y-3 shadow-[0_30px_70px_-40px_rgba(13,24,44,.35)]">
      <div class="text-center text-sm border hairline rounded-lg py-2.5">ร้านเปิดไหม?</div>
      <div class="text-center text-sm border hairline rounded-lg py-2.5">ราคาเท่าไหร่?</div>
      <div class="text-center text-sm border hairline rounded-lg py-2.5">อยู่ที่ไหน?</div>
      <div class="text-center text-sm border hairline rounded-lg py-2.5">รีวิวเป็นยังไง?</div>
      <div class="text-center text-sm rounded-lg py-2.5 grad-bg text-white font-medium">ไปเลย</div>
    </div>
  </div>
</section>

<!-- ============ THE WOW ============ -->
<section class="py-32 md:py-44 reveal">
  <div class="max-w-3xl mx-auto px-5 md:px-8 text-center">
    <p class="font-display text-[clamp(1.7rem,5vw,3rem)] leading-[1.25]">
      What if<br>your entire business<br>could fit into<br><span class="grad-text">one perfect experience?</span>
    </p>
    <p class="mt-10 eyebrow">That's Project ONE.</p>
  </div>
</section>

<!-- ============ PRICING ============ -->
<section class="section-pad bg-[var(--bg-alt)] reveal">
  <div class="max-w-6xl mx-auto px-5 md:px-8">
    <div class="text-center mb-14">
      <p class="eyebrow mb-3">PRICING</p>
      <h2 class="font-display font-semibold text-[clamp(1.9rem,4vw,2.6rem)]">เลือกจุดเริ่มต้นที่ใช่สำหรับธุรกิจคุณ</h2>
      <p class="mt-3 inline-block text-xs font-mono rounded-full px-3 py-1 grad-bg text-white">ราคาเปิดตัว — จำนวนจำกัด</p>
    </div>
    <div class="grid md:grid-cols-3 gap-6">
      <div class="rounded-2xl bg-white border hairline p-8">
        <p class="font-mono text-xs text-[var(--ink-faint)] mb-3">ONE</p>
        <p class="font-display text-2xl mb-2">One Page Website</p>
        <p class="text-sm text-[var(--ink-soft)] mb-5">สำหรับธุรกิจที่ต้องการเริ่มต้น</p>
        <div class="flex items-end gap-2">
          <span class="text-sm text-[var(--ink-faint)] line-through">฿19,900</span>
          <span class="font-display text-3xl font-semibold">฿9,900</span>
        </div>
        <p class="text-xs text-[var(--ink-faint)] mt-1">ไม่รวมบริการรายเดือน</p>
        <a href="#final-cta" class="block text-center mt-8 border hairline rounded-full py-2.5 text-sm font-medium hover:border-[var(--ink)] transition">คุยกับ PuchUp</a>
      </div>
      <div class="rounded-2xl bg-[var(--ink)] text-white p-8 md:scale-105 shadow-[0_30px_80px_-30px_rgba(13,24,44,.5)]">
        <p class="font-mono text-xs opacity-60 mb-3">ONE + LOCAL</p>
        <p class="font-display text-2xl mb-2">One Page + Google Business</p>
        <p class="text-sm opacity-75">สำหรับธุรกิจที่ต้องการสร้างตัวตนบน Google</p>
        <a href="#final-cta" class="block text-center mt-8 grad-bg rounded-full py-2.5 text-sm font-medium">คุยกับ PuchUp</a>
      </div>
      <div class="rounded-2xl bg-white border hairline p-8">
        <p class="font-mono text-xs text-[var(--ink-faint)] mb-3">ONE + GROWTH</p>
        <p class="font-display text-2xl mb-2">One Page + Local Growth</p>
        <p class="text-sm text-[var(--ink-soft)]">สำหรับธุรกิจที่ต้องการพัฒนาต่อเนื่อง</p>
        <a href="#final-cta" class="block text-center mt-8 border hairline rounded-full py-2.5 text-sm font-medium hover:border-[var(--ink)] transition">คุยกับ PuchUp</a>
      </div>
    </div>
  </div>
</section>

<!-- ============ WHO IS IT FOR ============ -->
<section class="section-pad reveal">
  <div class="max-w-5xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-14">
    <div>
      <p class="eyebrow mb-4">WHO IS IT FOR?</p>
      <h2 class="font-display font-semibold text-[clamp(1.8rem,4vw,2.5rem)] mb-6">Project ONE เหมาะกับคุณไหม?</h2>
      <ul class="space-y-3 text-[var(--ink-soft)]">
        <li>✓ มีหน้าร้านจริง</li>
        <li>✓ ต้องการให้ลูกค้าหาเจอ</li>
        <li>✓ มี Google Business</li>
        <li>✓ มีรูปภาพ / ผลงาน</li>
        <li>✓ ต้องการเว็บไซต์ที่ดูดีโดยไม่ซับซ้อน</li>
        <li>✓ ลูกค้าต้องการโทร / LINE / จอง / เดินทางมาหา</li>
        <li>✓ ต้องการเริ่มต้นก่อน แล้วค่อยขยาย</li>
      </ul>
    </div>
    <div class="flex items-center">
      <p class="font-display text-2xl md:text-3xl leading-snug">ถ้าธุรกิจของคุณมีเรื่องราว<br><span class="grad-text">เรามีพื้นที่ให้มันเล่า</span></p>
    </div>
  </div>
</section>

<!-- ============ FAQ ============ -->
<section class="section-pad bg-[var(--bg-alt)] reveal">
  <div class="max-w-3xl mx-auto px-5 md:px-8">
    <div class="text-center mb-12">
      <p class="eyebrow mb-3">FAQ</p>
      <h2 class="font-display font-semibold text-[clamp(1.8rem,4vw,2.5rem)]">คำถามที่พบบ่อย</h2>
    </div>
    <div id="faqList" class="space-y-3">
      <!-- filled by JS -->
    </div>
  </div>
</section>

<!-- ============ FINAL CTA ============ -->
<section id="final-cta" class="section-pad reveal">
  <div class="max-w-3xl mx-auto px-5 md:px-8 text-center">
    <p class="font-display font-semibold text-[clamp(2rem,5vw,3.2rem)] leading-tight mb-6">Your Business.<br><span class="grad-text">Your ONE.</span></p>
    <p class="text-[var(--ink-soft)] mb-10">ให้เราลองออกแบบธุรกิจของคุณ ในแบบ Project ONE</p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="#" class="grad-bg text-white rounded-full px-8 py-4 font-medium hover:opacity-90 transition">Build My ONE</a>
      <a href="/demo/" class="border hairline rounded-full px-8 py-4 font-medium text-[var(--ink-soft)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition">ดูตัวอย่างธุรกิจ</a>
    </div>
    <p class="mt-12 eyebrow">PuchUp — Level Up Your Life.</p>
  </div>
</section>

<!-- ============ FOOTER ============ -->
<footer class="border-t hairline py-14">
  <div class="max-w-6xl mx-auto px-5 md:px-8 grid md:grid-cols-4 gap-10 text-sm">
    <div>
      <p class="font-display font-semibold text-lg mb-2">PuchUp</p>
      <p class="text-[var(--ink-soft)]">Project ONE<br>One Page. Full Business.</p>
    </div>
    <div>
      <p class="font-mono text-xs text-[var(--ink-faint)] mb-3">EXPLORE</p>
      <ul class="space-y-1.5 text-[var(--ink-soft)]">
        <li><a href="#one" class="hover:text-[var(--ink)]">Project ONE</a></li>
        <li><a href="#demo" class="hover:text-[var(--ink)]">Demo Library</a></li>
        <li><a href="/demo/" class="hover:text-[var(--ink)]">ตัวอย่างธุรกิจทั้งหมด</a></li>
        <li><a href="#google" class="hover:text-[var(--ink)]">Google Business</a></li>
        <li><a href="#growth" class="hover:text-[var(--ink)]">Local Growth</a></li>
      </ul>
    </div>
    <div>
      <p class="font-mono text-xs text-[var(--ink-faint)] mb-3">BUSINESS</p>
      <ul class="space-y-1.5 text-[var(--ink-soft)]">
        <li>Restaurant</li><li>Café</li><li>Hotel</li><li>Clinic</li><li>Retail</li>
      </ul>
    </div>
    <div>
      <p class="font-mono text-xs text-[var(--ink-faint)] mb-3">CONTACT</p>
      <ul class="space-y-1.5 text-[var(--ink-soft)]">
        <li>LINE</li><li>Facebook</li><li>Email</li>
      </ul>
    </div>
  </div>
  <p class="text-center text-xs text-[var(--ink-faint)] mt-12">© PuchUp</p>
</footer>

`;

export const PROJECT_ONE_SCRIPT_RAW = `
/* =========================================================
   IMAGE GENERATION — Google Imagen (Gemini API) wiring
   =========================================================
   ทุก element ที่มี class "img-slot" จะมี data-prompt เก็บคำสั่ง
   (prompt) สำหรับส่งให้ Google Imagen API เจนรูปจริงภายหลัง

   วิธีต่อ Google Imagen API จริง (ทำฝั่ง backend เพื่อไม่ให้ API key
   หลุดออกมาที่ฝั่ง client):

   POST https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict
   Headers: { "x-goog-api-key": "<YOUR_KEY>" }
   Body: {
     "instances": [{ "prompt": "<data-prompt ของแต่ละรูป>" }],
     "parameters": { "sampleCount": 1, "aspectRatio": "4:3" }
   }
   -> เก็บ base64 image ที่ได้ แล้วเซ็ตเป็น src ของ <img> แทน placeholder

   ตอนนี้ยังไม่มี key ต่อไว้ จึงใช้รูป placeholder (picsum) ไปก่อน
   เพื่อให้เห็นโครงสร้างและสัดส่วนภาพจริง — สามารถสลับรูปเองได้ทันที
   ========================================================= */
async function generateImageForSlot(el){
  const prompt = el.dataset.prompt;
  // TODO: ผู้ใช้ต่อ backend endpoint ของตัวเองตรงนี้ เช่น:
  // const res = await fetch('/api/imagen', { method:'POST', body: JSON.stringify({ prompt }) });
  // const { imageUrl } = await res.json();
  // el.querySelector('img').src = imageUrl;
  console.log('[imagen prompt ready]', prompt);
}
document.querySelectorAll('.img-slot').forEach(generateImageForSlot);

/* ---------- Demo library data + filter ---------- */
const demos = [
  { name:'Mellow House Café', type:'Café / Bangkok', cat:'cafe', prompt:'Bright minimalist café interior with warm wood tones, editorial lifestyle photography' },
  { name:'Baan Suan Thai', type:'Restaurant / Chiang Mai', cat:'restaurant', prompt:'Traditional Thai restaurant courtyard with wooden tables and lush greenery, warm daylight' },
  { name:'Aura Dental Clinic', type:'Health / Bangkok', cat:'health', prompt:'Clean modern dental clinic reception, soft light, premium healthcare interior' },
  { name:'Velora Resort', type:'Hotel / Phuket', cat:'hotel', prompt:'Boutique beachfront resort pool at sunset, premium travel photography' },
  { name:'Amethez Crystals', type:'Retail / Bangkok', cat:'retail', prompt:'Elegant crystal and gemstone display on a wooden shelf, soft studio light' },
  { name:'Nol Studio', type:'Creator / Bangkok', cat:'creator', prompt:'Photographer working in a bright minimal studio with camera equipment, editorial tone' },
  { name:'Green Table Bistro', type:'Restaurant / Bangkok', cat:'restaurant', prompt:'Cozy bistro table setting with plants and warm lighting, editorial food photography' },
  { name:'Solace Spa', type:'Health / Hua Hin', cat:'health', prompt:'Serene spa treatment room with candles and soft textiles, calm premium interior' },
  { name:'Craft & Bean', type:'Café / Bangkok', cat:'cafe', prompt:'Specialty coffee bar with barista pouring latte art, warm editorial lighting' },
];

const demoGrid = document.getElementById('demoGrid');
function renderDemos(filter){
  demoGrid.innerHTML = demos
    .filter(d => filter==='all' || d.cat===filter)
    .map((d,i) => \`
      <div class="rounded-xl overflow-hidden border hairline bg-white group">
        <div class="img-slot aspect-[4/3]" data-prompt="\${d.prompt}">
          <img src="https://picsum.photos/seed/puchup-demo-\${d.name.replace(/\\s/g,'')}/600/450" alt="\${d.name}">
          <span class="img-tag">imagen: \${d.cat}</span>
        </div>
        <div class="p-5 flex items-center justify-between">
          <div>
            <p class="font-display font-medium">\${d.name}</p>
            <p class="text-xs text-[var(--ink-faint)] font-mono mt-0.5">\${d.type}</p>
          </div>
          <a href="#" class="text-sm font-medium text-[var(--purple)] whitespace-nowrap ml-3">View ONE</a>
        </div>
      </div>
    \`).join('');
  demoGrid.querySelectorAll('.img-slot').forEach(generateImageForSlot);
}
renderDemos('all');

document.querySelectorAll('#filterTabs button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('#filterTabs button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderDemos(btn.dataset.filter);
  });
});

/* ---------- Google Business tabs ---------- */
document.querySelectorAll('[data-gtab]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('[data-gtab]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.gpanel').forEach(p=>p.classList.add('hidden'));
    document.getElementById('panel-'+btn.dataset.gtab).classList.remove('hidden');
  });
});

/* ---------- FAQ accordion ---------- */
const faqs = [
  { q:'One Page ต่างจาก Landing Page อย่างไร?', a:'Project ONE ไม่ได้ถูกออกแบบเพื่อขายสินค้าหรือแคมเปญเพียงอย่างเดียว แต่ถูกออกแบบให้เป็น "บ้านออนไลน์" ของธุรกิจ โดยรวมข้อมูลสำคัญทั้งหมดไว้ในประสบการณ์เดียว' },
  { q:'สามารถเพิ่มหน้าในอนาคตได้ไหม?', a:'ได้' },
  { q:'รองรับ Google Business ไหม?', a:'ได้' },
  { q:'เพิ่มบทความได้ไหม?', a:'ได้' },
  { q:'เพิ่มระบบจองได้ไหม?', a:'ได้' },
  { q:'เชื่อม LINE ได้ไหม?', a:'ได้' },
  { q:'ธุรกิจไม่มีระบบออนไลน์เลยทำได้ไหม?', a:'ได้' },
];
document.getElementById('faqList').innerHTML = faqs.map((f,i)=>\`
  <div class="border hairline rounded-xl bg-white overflow-hidden">
    <button class="faq-q w-full text-left px-5 py-4 flex items-center justify-between gap-4" data-idx="\${i}">
      <span class="font-medium">\${f.q}</span>
      <span class="faq-icon text-[var(--ink-faint)] font-mono transition-transform">+</span>
    </button>
    <div class="faq-a hidden px-5 pb-4 text-[var(--ink-soft)] text-sm">\${f.a}</div>
  </div>
\`).join('');
document.querySelectorAll('.faq-q').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const ans = btn.nextElementSibling;
    const icon = btn.querySelector('.faq-icon');
    const open = !ans.classList.contains('hidden');
    document.querySelectorAll('.faq-a').forEach(a=>a.classList.add('hidden'));
    document.querySelectorAll('.faq-icon').forEach(i=>i.textContent='+');
    if(!open){ ans.classList.remove('hidden'); icon.textContent='–'; }
  });
});

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
},{ threshold:.12 });
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ---------- Sticky nav shrink ---------- */
const nav = document.getElementById('mainnav');
window.addEventListener('scroll', ()=>{
  if(window.scrollY > 40){ nav.classList.add('shadow-sm'); } else { nav.classList.remove('shadow-sm'); }
});
`;
