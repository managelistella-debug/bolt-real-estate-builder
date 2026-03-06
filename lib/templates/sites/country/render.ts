import { StartingPointTemplate } from '../../types';
import { TemplateCustomization, RenderedTemplate } from '../../renderTemplate';

const I = '/templates/country/images';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderCountrySite(
  _template: StartingPointTemplate,
  c: TemplateCustomization,
): RenderedTemplate {
  const agent = c.agentName || 'Your Name';
  const firstName = agent.split(' ')[0];
  const brokerage = c.brokerageName || '';
  const phone = c.phone || '(555) 000-0000';
  const phoneDigits = phone.replace(/\D/g, '');
  const email = c.email || 'hello@example.com';
  const office = c.officeAddress || '';
  const about1 = c.aboutMe
    || `Based in the local community, ${agent} pairs deep local knowledge with a strategic approach to real estate. Successful outcomes come from thoughtful pricing and smart marketing that puts a property in front of the right audience.`;
  const about2 = `With a focus on acreages, farms, and residential homes, ${agent} understands the nuances of rural real estate and manages each transaction with professionalism, care, and attention to detail.`;
  const areas = c.targetAreas || 'the surrounding area';
  const siteName = c.teamName || agent;
  const headerLogo = c.personalLogo
    ? `<img src="${esc(c.personalLogo)}" alt="${esc(siteName)}" style="height:60px;max-width:180px;object-fit:contain;" />`
    : `<span class="header-brand-text">${esc(siteName)}</span>`;
  const footerLogo = c.brokerageLogo
    ? `<img src="${esc(c.brokerageLogo)}" alt="${esc(brokerage || 'Brokerage')}" style="height:50px;max-width:180px;object-fit:contain;" />`
    : (brokerage ? `<span class="footer-brokerage-text">${esc(brokerage)}</span>` : '');
  const igLink = c.social?.instagram || '';
  const fbLink = c.social?.facebook || '';

  const sampleActive = [
    { price: '$1,200,000', addr: '33289 Lakeview Court', img: `${I}/featured-1.webp` },
    { price: '$1,350,000', addr: '22034 Lakeview Drive', img: `${I}/featured-2.webp` },
    { price: '$1,200,000', addr: '33291 Lakeview Court', img: `${I}/featured-3.webp` },
  ];
  const sampleSold = [
    { price: '$985,000', addr: '14422 Mountain View Road', img: `${I}/featured-1.webp` },
    { price: '$1,475,000', addr: '78901 Range Road 54', img: `${I}/featured-2.webp` },
    { price: '$2,100,000', addr: '55123 Foothills Drive', img: `${I}/featured-3.webp` },
  ];

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Buying', href: '/buying' },
    { label: 'Selling', href: '/selling' },
    { label: 'Estates', href: '/estates' },
    { label: 'Active Listings', href: '/listings/active' },
    { label: 'Sold', href: '/listings/sold' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];
  const footerNav = [
    { label: 'Home', href: '/' }, { label: 'Estates', href: '/estates' },
    { label: 'Active', href: '/listings/active' }, { label: 'Sold', href: '/listings/sold' },
    { label: 'Buying', href: '/buying' }, { label: 'Selling', href: '/selling' },
    { label: 'Blog', href: '/blog' }, { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const nav = navItems.map(n => `<a href="${n.href}" class="nav-link">${n.label}</a>`).join('');
  const fNav = footerNav.map(n => `<a href="${n.href}" class="footer-link">${n.label}</a>`).join('');

  const socialHtml = igLink
    ? `<a href="${esc(igLink)}" target="_blank" rel="noopener noreferrer" class="social-icon-link">
        <span class="social-circle"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><defs><linearGradient id="igG" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#daaf3a"/><stop offset="50%" stop-color="#ffebaf"/><stop offset="100%" stop-color="#9d7500"/></linearGradient></defs><rect x=".5" y=".5" width="13" height="13" rx="3" stroke="url(#igG)" stroke-width="1"/><circle cx="7" cy="7" r="3.5" stroke="url(#igG)" stroke-width="1"/><circle cx="10.5" cy="3.5" r="1" fill="url(#igG)"/></svg></span>
      </a>` : '';

  function listingCard(l: { price: string; addr: string; img: string }, badge: string) {
    return `<div class="listing-card" data-loop-item>
      <div class="listing-img-wrap"><img src="${l.img}" alt="${esc(l.addr)}" class="listing-img" data-cms /><div class="listing-badge gold-grad-bg"><span>${badge}</span></div></div>
      <div class="listing-info"><p class="listing-price font-h gold-grad-text" data-cms-text="Listings">${l.price}</p><p class="listing-addr" data-cms-text="Listings">${esc(l.addr)}</p></div>
    </div>`;
  }

  const header = `<header class="site-hdr">
  <div class="hdr-inner">
    <a href="/" class="hdr-logo">${headerLogo}</a>
    <nav class="hdr-nav">${nav}</nav>
    <div class="hdr-actions">
      <a href="tel:${phoneDigits}" class="cta gold-grad-bg">Call ${esc(firstName)}</a>
    </div>
    <button class="mobile-menu-btn" aria-label="Menu"><span></span><span></span><span></span></button>
  </div>
</header>`;

  const footer = `<footer class="site-ftr">
  <div class="ftr-inner">
    <div class="ftr-logos">${headerLogo}${footerLogo ? `<div class="ftr-brokerage-logo">${footerLogo}</div>` : ''}</div>
    <div class="ftr-mid">
      <div class="ftr-contact">
        <p class="ftr-name font-h gold-grad-text">${esc(agent)}</p>
        <a href="tel:${phoneDigits}">${esc(phone)}</a>
        <a href="mailto:${esc(email)}">${esc(email)}</a>
        ${igLink ? `<a href="${esc(igLink)}" target="_blank" rel="noopener noreferrer" class="ftr-ig">@${esc(igLink.split('/').pop() || 'instagram')}</a>` : ''}
      </div>
      <nav class="ftr-nav">${fNav}</nav>
    </div>
    <div class="ftr-bottom">
      <a href="/privacy" class="privacy-lnk">Privacy Policy</a>
      ${brokerage ? `<p class="ftr-disclaimer">${esc(brokerage)}. Each office is independently owned and operated.</p>` : ''}
    </div>
  </div>
</footer>`;

  /* ---- PAGES ---- */
  const pgHome = `<div data-page="/">
  <section class="hero"><div class="hero-bg parallax-bg" style="background-image:url(${I}/hero-bg.webp)"></div><div class="hero-ov"></div>
    <div class="hero-ct"><h1 class="font-h">Extraordinary Land. Exceptional Representation</h1>
      <p class="hero-sub">Specializing in ${esc(areas)}, ${esc(agent)} brings deep local expertise to every estate, ranch, and acreage transaction. Whether buying or selling, expect results rooted in strategy, care, and precision.</p>
      <div class="hero-btns"><a href="/estates" class="cta gold-grad-bg">View Estates</a><a href="/listings/active" class="cta cta-outline">View Listings</a></div>
    </div></section>
  <section class="services"><div class="srv-grid">
    <a href="/listings/active" class="srv-card"><img src="${I}/listings-card.webp" alt="Listings" class="srv-img"/><div class="srv-ov"></div><div class="srv-lbl"><h3 class="font-h">Listings</h3><div class="gold-line"></div></div></a>
    <a href="/selling" class="srv-card"><img src="${I}/selling-card.webp" alt="Selling" class="srv-img"/><div class="srv-ov"></div><div class="srv-lbl"><h3 class="font-h">Selling</h3><div class="gold-line"></div></div></a>
    <a href="/buying" class="srv-card"><img src="${I}/buying-card.webp" alt="Buying" class="srv-img"/><div class="srv-ov"></div><div class="srv-lbl"><h3 class="font-h">Buying</h3><div class="gold-line"></div></div></a>
  </div></section>
  <section class="testimonials"><div class="test-bg parallax-bg" style="background-image:url(${I}/homepage-testimonial-bg.webp)"></div><div class="test-ov"></div>
    <div class="test-ct"><h2 class="font-h gold-grad-text sec-title">Testimonials</h2>
      <div class="test-card"><img src="${I}/stars.svg" alt="5 stars" class="stars"/><p class="test-quote">"Working with ${esc(agent)} was an absolutely fantastic experience. Knowledgeable, responsive, and incredibly helpful throughout the entire process."</p><p class="test-author">Happy Client</p></div>
    </div></section>
  <section class="feat-listings" data-source="cms-listings"><div class="fl-container"><div class="fl-grid">${sampleActive.map(l => listingCard(l, 'For Sale')).join('')}</div><div class="fl-nav"><a href="/listings/active" class="view-all">View All Listings</a></div></div></section>
  <section class="about-sec"><div class="about-inner">
    <div class="about-img-wrap"><img src="${I}/about-image.webp" alt="${esc(agent)}" class="about-img"/></div>
    <div class="about-txt"><h2 class="font-h gold-grad-text">Meet ${esc(agent)}</h2><p>${esc(about1)}</p><p>${esc(about2)}</p><a href="/about" class="cta gold-grad-bg">Learn More</a></div>
  </div></section>
  <section class="contact-sec"><div class="ctc-bg parallax-bg" style="background-image:url(${I}/homepage-contact-bg.webp)"></div><div class="ctc-ov"></div>
    <div class="ctc-ct"><h2 class="font-h gold-grad-text sec-title" style="text-align:left">Get in Touch with ${esc(firstName)}</h2>
      <div class="ctc-grid">
        <form class="ctc-form" onsubmit="return false"><input type="text" placeholder="Name" class="fi"/><input type="email" placeholder="Email" class="fi"/><input type="tel" placeholder="Phone" class="fi"/><textarea placeholder="Message" class="fi fi-ta"></textarea><button type="submit" class="cta gold-grad-bg sub-btn">Submit</button></form>
        <div class="ctc-details"><h3 class="font-h gold-grad-text">Contact Details</h3><div class="gold-divider"></div>
          <div class="ctc-block"><p class="ctc-name font-h gold-grad-text">${esc(agent)}</p><p>${esc(phone)}</p><a href="mailto:${esc(email)}">${esc(email)}</a>${office ? `<p>${esc(office)}</p>` : ''}</div>
          ${brokerage ? `<div class="ctc-block"><p class="ctc-name font-h gold-grad-text">${esc(brokerage)}</p></div>` : ''}
          ${socialHtml ? `<div class="ctc-social">${socialHtml}</div>` : ''}
        </div>
      </div>
    </div></section>
</div>`;

  const pgAbout = `<div data-page="/about" style="display:none">
  <section class="pg-hero-split"><div class="pg-hero-img-side"><img src="${I}/about-image.webp" alt="${esc(agent)}" class="pg-hero-portrait"/></div>
    <div class="pg-hero-txt-side"><span class="font-h" style="font-size:16px;color:#fff">Meet Your Realtor</span><h1 class="font-h gold-grad-text" style="font-size:clamp(36px,5vw,64px);line-height:1.1;margin-top:12px">${esc(agent)}</h1><div class="gold-accent-line"></div><p class="hero-body">${esc(about1)}</p><p class="hero-body">${esc(about2)}</p></div></section>
  <section class="story-sec"><div class="story-grid">
    <div class="story-card"><span class="font-h gold-grad-text" style="font-size:15px">Professional Background</span><h2 class="font-h" style="font-size:clamp(24px,3vw,30px);color:#fff;margin-top:8px">Built on Experience</h2><div class="gold-accent-line"></div><p>${esc(agent)}'s career in real estate is rooted in a genuine passion for connecting people with the right property. Over the years, a reputation for being thorough, strategic, and deeply committed to clients' success has been developed.</p></div>
    <div class="story-card"><span class="font-h gold-grad-text" style="font-size:15px">Specialization</span><h2 class="font-h" style="font-size:clamp(24px,3vw,30px);color:#fff;margin-top:8px">Why Estates &amp; Ranch Properties</h2><div class="gold-accent-line"></div><p>Rural real estate requires a specialized understanding. ${esc(agent)} chose to focus on acreages, farms, and estate properties because of the unique complexities that come with land.</p></div>
    <div class="story-card"><span class="font-h gold-grad-text" style="font-size:15px">Philosophy</span><h2 class="font-h" style="font-size:clamp(24px,3vw,30px);color:#fff;margin-top:8px">Values That Guide Every Transaction</h2><div class="gold-accent-line"></div><p>Real estate is about more than buying and selling property — it's about trust, transparency, and building relationships that last well beyond closing day.</p></div>
  </div></section>
  <section class="about-test"><div class="about-test-inner"><h2 class="font-h gold-grad-text sec-title">What Clients Say</h2><div class="test-card"><img src="${I}/stars.svg" alt="5 stars" class="stars"/><p class="test-quote">"${esc(agent)} made the entire process of selling our family ranch seamless and stress-free. The understanding of the rural market is unmatched."</p><p class="test-author">Satisfied Client</p></div></div></section>
  <section class="about-cta"><div class="about-cta-bg parallax-bg" style="background-image:url(${I}/about-cta-bg.webp)"></div><div class="about-cta-ov"></div><div class="about-cta-ct"><h2 class="font-h gold-grad-text sec-title">Connect with ${esc(firstName)}</h2><p>Ready to start your real estate journey? Whether buying, selling, or simply exploring your options, ${esc(firstName)} is here to help.</p><div class="cta-row"><a href="/contact" class="cta gold-grad-bg">Get in Touch</a><a href="tel:${phoneDigits}" class="cta cta-outline">Call ${esc(phone)}</a></div></div></section>
</div>`;

  const pgBuying = `<div data-page="/buying" style="display:none">
  <section class="pg-hero"><div class="pg-hero-bg parallax-bg" style="background-image:url(${I}/buying-hero.webp)"></div><div class="pg-hero-ov"></div><div class="pg-hero-ct"><h1 class="font-h">Buying with ${esc(firstName)}</h1><p>Whether you're looking for a sprawling acreage, a working ranch, or the perfect residential property, ${esc(agent)} brings expert guidance to every step of your buying journey.</p><a href="#" class="cta gold-grad-bg">Get Started</a></div></section>
  <section class="process-sec"><div class="process-inner"><h2 class="font-h gold-grad-text" style="font-size:clamp(32px,4vw,50px)">Your Buying Journey</h2><p class="sec-sub">${esc(agent)} guides you through every stage of the buying process with expertise, transparency, and personal attention to detail.</p>
    <div class="steps">
      <div class="step active"><div class="step-num font-h gold-grad-text">Step 01</div><h3 class="font-h">Initial Consultation</h3><p>We start with a one-on-one conversation to understand your vision — whether it's a family home, a working ranch, or an investment property.</p></div>
      <div class="step"><div class="step-num font-h">Step 02</div><h3 class="font-h">Property Search &amp; Discovery</h3><p>Using deep local knowledge and access to both listed and off-market properties, options are curated that match your criteria.</p></div>
      <div class="step"><div class="step-num font-h">Step 03</div><h3 class="font-h">Due Diligence &amp; Evaluation</h3><p>Every property is carefully evaluated — zoning, land titles, water rights, soil conditions, and utility access.</p></div>
      <div class="step"><div class="step-num font-h">Step 04</div><h3 class="font-h">Negotiation &amp; Offer</h3><p>With a strategic approach to pricing and negotiation, ${esc(agent)} works to secure the best terms on your behalf.</p></div>
      <div class="step"><div class="step-num font-h">Step 05</div><h3 class="font-h">Closing &amp; Beyond</h3><p>From the accepted offer through to closing day, every detail is managed to ensure a smooth transaction.</p></div>
    </div>
  </div></section>
</div>`;

  const pgSelling = `<div data-page="/selling" style="display:none">
  <section class="pg-hero"><div class="pg-hero-bg parallax-bg" style="background-image:url(${I}/selling-hero.webp)"></div><div class="pg-hero-ov"></div><div class="pg-hero-ct"><h1 class="font-h">Selling with ${esc(firstName)}</h1><p>From strategic pricing to refined marketing, ${esc(agent)} delivers a tailored approach that positions your property in front of the right buyers — ensuring a confident, seamless sale.</p><div class="cta-row"><a href="#" class="cta gold-grad-bg">Our Approach</a><a href="/contact" class="cta cta-outline">Request Consult</a></div></div></section>
  <section class="mktg-sec"><div class="mktg-inner"><h2 class="font-h gold-grad-text" style="font-size:clamp(32px,4vw,50px)">${esc(firstName)}'s Marketing Approach</h2><p class="sec-sub">A comprehensive, multi-channel strategy designed to showcase your property to the right audience and maximize its value.</p>
    <div class="mktg-slider"><div class="mktg-img-side"><img src="${I}/photography.webp" alt="Marketing" class="mktg-img"/></div><div class="mktg-txt-side"><span class="font-h gold-grad-text" style="font-size:16px">Captivating</span><h3 class="font-h" style="font-size:clamp(28px,3vw,40px);color:#fff;margin-top:8px">Property Photography</h3><div class="gold-accent-line"></div><p>Skilled photographers expertly capture the unique character and allure of your property with stunning visuals for print and online.</p></div></div>
  </div></section>
  <section class="sell-process"><div class="sell-process-inner"><h2 class="font-h gold-grad-text sec-title" style="text-align:center">The Selling Process</h2><p class="sec-sub" style="text-align:center">A clear, structured approach from first conversation to final closing — so you always know what's next.</p>
    <div class="timeline">
      <div class="tl-step active"><div class="tl-node"></div><div class="tl-ct"><span class="font-h gold-grad-text" style="font-size:14px">Step 01</span><h3 class="font-h">Consultation</h3><p>A personalized conversation to understand your goals, timeline, and property.</p></div></div>
      <div class="tl-step"><div class="tl-node"></div><div class="tl-ct"><span class="font-h" style="font-size:14px;color:rgba(255,255,255,0.3)">Step 02</span><h3 class="font-h">Pricing Strategy</h3><p>Leveraging market data and local expertise to position your property at the optimal price point.</p></div></div>
      <div class="tl-step"><div class="tl-node"></div><div class="tl-ct"><span class="font-h" style="font-size:14px;color:rgba(255,255,255,0.3)">Step 03</span><h3 class="font-h">Preparation</h3><p>From staging guidance to professional photography, ensuring an unforgettable first impression.</p></div></div>
      <div class="tl-step"><div class="tl-node"></div><div class="tl-ct"><span class="font-h" style="font-size:14px;color:rgba(255,255,255,0.3)">Step 04</span><h3 class="font-h">Marketing Launch</h3><p>Multi-channel campaign — photography, video tours, social media, email outreach.</p></div></div>
      <div class="tl-step"><div class="tl-node"></div><div class="tl-ct"><span class="font-h" style="font-size:14px;color:rgba(255,255,255,0.3)">Step 05</span><h3 class="font-h">Negotiation</h3><p>Strategic approach to secure the best possible terms, protecting your interests at every turn.</p></div></div>
      <div class="tl-step"><div class="tl-node"></div><div class="tl-ct"><span class="font-h" style="font-size:14px;color:rgba(255,255,255,0.3)">Step 06</span><h3 class="font-h">Closing</h3><p>Managing every detail from accepted offer to final signature.</p></div></div>
    </div>
  </div></section>
  <section class="sell-cta"><div class="sell-cta-bg parallax-bg" style="background-image:url(${I}/selling-cta-bg.webp)"></div><div class="sell-cta-ov"></div><div class="sell-cta-ct"><h2 class="font-h gold-grad-text sec-title">Ready to Sell Your Property?</h2><p>Schedule a complimentary property consultation to discuss your goals, review your property's market position, and outline a personalized selling strategy.</p><div class="cta-row"><a href="/contact" class="cta gold-grad-bg">Request a Consultation</a><a href="tel:${phoneDigits}" class="cta cta-outline">Call ${esc(phone)}</a></div></div></section>
</div>`;

  const pgEstates = `<div data-page="/estates" style="display:none">
  <section class="pg-banner"><div class="pg-banner-bg parallax-bg" style="background-image:url(${I}/estate-hero.webp)"></div><div class="pg-banner-ov"></div><div class="pg-banner-ct"><h1 class="font-h">Estates &amp; Ranch Properties</h1><p>Explore exclusive estate and ranch properties in ${esc(areas)}.</p><span class="count-label">3 properties available</span></div></section>
  <section class="grid-sec" data-source="cms-listings"><div class="grid-inner"><div class="cards-grid cols-2">${sampleActive.map(l => listingCard(l, 'For Sale')).join('')}</div></div></section>
</div>`;

  const pgActiveListings = `<div data-page="/listings/active" style="display:none">
  <section class="pg-banner"><div class="pg-banner-bg parallax-bg" style="background-image:url(${I}/active-listings-banner.webp)"></div><div class="pg-banner-ov"></div><div class="pg-banner-ct"><h1 class="font-h">Active Listings</h1><p>Explore our current properties for sale in ${esc(areas)}.</p><span class="count-label">3 properties available</span></div></section>
  <section class="grid-sec" data-source="cms-listings"><div class="grid-inner"><div class="cards-grid cols-2">${sampleActive.map(l => listingCard(l, 'For Sale')).join('')}</div></div></section>
</div>`;

  const pgSoldListings = `<div data-page="/listings/sold" style="display:none">
  <section class="pg-banner"><div class="pg-banner-bg parallax-bg" style="background-image:url(${I}/sold-banner.webp)"></div><div class="pg-banner-ov"></div><div class="pg-banner-ct"><h1 class="font-h">Sold Properties</h1><p>A selection of properties successfully sold by ${esc(agent)}.</p><span class="count-label">3 properties sold</span></div></section>
  <section class="grid-sec" data-source="cms-listings"><div class="grid-inner"><div class="cards-grid cols-3">${sampleSold.map(l => listingCard(l, 'Sold')).join('')}</div></div></section>
</div>`;

  const pgBlog = `<div data-page="/blog" style="display:none">
  <section class="pg-banner"><div class="pg-banner-bg parallax-bg" style="background-image:url(${I}/blog-banner.webp)"></div><div class="pg-banner-ov"></div><div class="pg-banner-ct"><h1 class="font-h">Blog</h1><p>Insights, market updates, and expert advice on buying and selling properties.</p></div></section>
  <section class="grid-sec" data-source="cms-blogs"><div class="grid-inner"><div class="cards-grid cols-2">
    <div class="blog-card" data-loop-item><div class="blog-card-img"><img src="${I}/buying-hero.webp" alt="Blog post" data-cms /></div><div class="blog-card-ct"><span class="blog-cat gold-grad-text">Market Update</span><h3 class="font-h blog-title" data-cms-text="Blogs">Spring Market Trends in Rural Alberta</h3><p class="blog-date" data-cms-text="Blogs">March 2026</p><p class="blog-excerpt" data-cms-text="Blogs">A look at what's happening in the rural property market this spring.</p><span class="read-more">Read Now</span></div></div>
    <div class="blog-card" data-loop-item><div class="blog-card-img"><img src="${I}/selling-hero.webp" alt="Blog post" data-cms /></div><div class="blog-card-ct"><span class="blog-cat gold-grad-text">Selling Tips</span><h3 class="font-h blog-title" data-cms-text="Blogs">Preparing Your Acreage for Sale</h3><p class="blog-date" data-cms-text="Blogs">February 2026</p><p class="blog-excerpt" data-cms-text="Blogs">Key steps to maximize your property's appeal before listing.</p><span class="read-more">Read Now</span></div></div>
    <div class="blog-card" data-loop-item><div class="blog-card-img"><img src="${I}/estate-hero.webp" alt="Blog post" data-cms /></div><div class="blog-card-ct"><span class="blog-cat gold-grad-text">Buying Guide</span><h3 class="font-h blog-title" data-cms-text="Blogs">What to Know Before Buying Land</h3><p class="blog-date" data-cms-text="Blogs">January 2026</p><p class="blog-excerpt" data-cms-text="Blogs">Essential considerations for first-time land buyers.</p><span class="read-more">Read Now</span></div></div>
  </div></div></section>
</div>`;

  const pgContact = `<div data-page="/contact" style="display:none">
  <section class="pg-hero short"><div class="pg-hero-bg parallax-bg" style="background-image:url(${I}/contact-banner.webp)"></div><div class="pg-hero-ov"></div><div class="pg-hero-ct"><h1 class="font-h">Get in Touch</h1><p>Have a question or ready to start your real estate journey? ${esc(firstName)} would love to hear from you.</p></div></section>
  <section class="contact-page-sec"><div class="contact-page-inner">
    <div class="cp-form-side"><h2 class="font-h gold-grad-text" style="font-size:clamp(28px,3vw,42px)">Send a Message</h2><div class="gold-accent-line"></div>
      <form class="ctc-form" onsubmit="return false"><div class="form-row"><input type="text" placeholder="Full Name" class="fi"/><input type="email" placeholder="Email Address" class="fi"/></div><input type="tel" placeholder="Phone Number" class="fi"/><textarea placeholder="Your Message" class="fi fi-ta"></textarea><button type="submit" class="cta gold-grad-bg sub-btn">Send Message</button></form>
    </div>
    <div class="cp-details-side"><h3 class="font-h gold-grad-text" style="font-size:clamp(28px,3vw,34px)">Contact Details</h3><div class="gold-divider" style="margin-top:16px"></div>
      <div class="ctc-block" style="margin-top:32px"><p class="ctc-name font-h gold-grad-text">${esc(agent)}</p><a href="tel:${phoneDigits}">${esc(phone)}</a><a href="mailto:${esc(email)}">${esc(email)}</a></div>
      ${brokerage ? `<div class="ctc-block"><p class="ctc-name font-h gold-grad-text">${esc(brokerage)}</p>${office ? `<p>${esc(office)}</p>` : ''}</div>` : ''}
      ${socialHtml ? `<div class="ctc-social" style="margin-top:32px">${socialHtml}</div>` : ''}
    </div>
  </div></section>
</div>`;

  const pgPrivacy = `<div data-page="/privacy" style="display:none">
  <section class="pg-banner"><div class="pg-banner-bg parallax-bg" style="background-image:url(${I}/sold-banner.webp)"></div><div class="pg-banner-ov"></div><div class="pg-banner-ct"><h1 class="font-h">Privacy Policy</h1></div></section>
  <section class="privacy-sec"><div class="privacy-inner">
    <p class="privacy-date">Last updated: March 2026</p>
    <div class="privacy-block"><h2 class="font-h gold-grad-text">Overview</h2><p>${esc(agent)}, ${brokerage ? `operating under ${esc(brokerage)},` : ''} respects your privacy. This policy explains how personal information is collected, used, and protected when you use this website or contact us for real estate services.</p></div>
    <div class="privacy-block"><h2 class="font-h gold-grad-text">Information We Collect</h2><p>When you submit a contact form, we may collect your name, email address, phone number, and message content.</p></div>
    <div class="privacy-block"><h2 class="font-h gold-grad-text">How We Use Your Information</h2><p>Personal information is used solely for responding to your real estate inquiries and providing information about properties.</p></div>
    <div class="privacy-block"><h2 class="font-h gold-grad-text">Contact</h2><p>${esc(agent)}</p><p><a href="tel:${phoneDigits}">${esc(phone)}</a></p><p><a href="mailto:${esc(email)}">${esc(email)}</a></p></div>
  </div></section>
</div>`;

  const routerScript = `<script>
(function(){
  var root=document.querySelector('.site-root');
  var pages=root.querySelectorAll('[data-page]');
  var hdr=root.querySelector('.site-hdr');
  var menuBtn=root.querySelector('.mobile-menu-btn');
  var nav=root.querySelector('.hdr-nav');
  var menuOpen=false;
  if(menuBtn){menuBtn.addEventListener('click',function(){menuOpen=!menuOpen;menuBtn.classList.toggle('open',menuOpen);nav.classList.toggle('open',menuOpen);});}
  function go(path){
    pages.forEach(function(p){p.style.display=p.getAttribute('data-page')===path?'block':'none';});
    root.scrollTop=0;
    if(menuOpen&&menuBtn){menuOpen=false;menuBtn.classList.remove('open');nav.classList.remove('open');}
  }
  root.addEventListener('click',function(e){
    var a=e.target.closest('a[href]');if(!a)return;
    var h=a.getAttribute('href');
    if(!h||h.startsWith('http')||h.startsWith('mailto:')||h.startsWith('tel:')||h.startsWith('#'))return;
    var t=root.querySelector('[data-page="'+h+'"]');
    if(t){e.preventDefault();e.stopPropagation();go(h);}
  });
  go('/');
})();
<\/script>`;

  const previewHtml = `<main class="site-root">${header}${pgHome}${pgAbout}${pgBuying}${pgSelling}${pgEstates}${pgActiveListings}${pgSoldListings}${pgBlog}${pgContact}${pgPrivacy}${footer}</main>${routerScript}`;

  const previewCss = buildCss();

  return { previewHtml, previewCss, siteName };
}

function buildCss(): string {
  return `
@font-face{font-family:'Reckless Neue';src:url('/templates/country/fonts/RecklessNeue-Regular.ttf') format('truetype');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'Lato';src:url('/templates/country/fonts/Lato-Regular.ttf') format('truetype');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'Lato';src:url('/templates/country/fonts/Lato-Light.ttf') format('truetype');font-weight:300;font-style:normal;font-display:swap}
:root{--primary:#09312a;--darker:#113d35;--gold:#daaf3a;--fh:'Reckless Neue','Georgia',serif;--fb:'Lato',sans-serif}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:var(--primary);color:#fff;font-family:var(--fb);font-weight:300;line-height:1.6;overflow-x:hidden;-webkit-font-smoothing:antialiased}
a{text-decoration:none;color:inherit;cursor:pointer}
button{cursor:pointer;border:none;background:none}
img{max-width:100%;display:block}
.font-h{font-family:var(--fh);font-weight:400}
.gold-grad-text{background:linear-gradient(90deg,#daaf3a 0%,#e8c860 25%,#ffebaf 50%,#c9a84c 75%,#9d7500 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.gold-grad-bg{background:linear-gradient(90deg,#daaf3a 0%,#e8c860 25%,#ffebaf 50%,#c9a84c 75%,#9d7500 100%)}
.parallax-bg{background-attachment:fixed;background-position:center;background-size:cover;background-repeat:no-repeat}
@media(max-width:768px){.parallax-bg{background-attachment:scroll}}

/* HEADER */
.site-hdr{position:sticky;top:0;z-index:50;background:var(--primary)}
.hdr-inner{max-width:1440px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 60px;height:99px}
.hdr-logo{display:flex;align-items:center;flex-shrink:0}
.header-brand-text{font-family:var(--fh);font-size:22px;color:#fff;white-space:nowrap}
.hdr-nav{display:flex;align-items:center;gap:30px}
.nav-link{color:#fff;font-size:14px;font-weight:400;position:relative;padding-bottom:2px;transition:color .3s}
.nav-link:hover{color:var(--gold)}
.nav-link::after{content:'';position:absolute;bottom:-1px;left:0;width:0;height:1px;background:var(--gold);transition:width .3s}
.nav-link:hover::after{width:100%}
.hdr-actions{display:flex;align-items:center;gap:20px}
.cta{display:inline-flex;align-items:center;justify-content:center;height:47px;padding:0 28px;font-size:14px;font-weight:600;font-family:var(--fb);color:var(--primary);transition:opacity .3s;white-space:nowrap}
.cta:hover{opacity:.9}
.cta-outline{background:none!important;border:1px solid #fff;color:#fff}
.cta-outline:hover{background:rgba(255,255,255,.1)!important}
.mobile-menu-btn{display:none;flex-direction:column;gap:6px;width:44px;height:40px;align-items:center;justify-content:center;background:var(--darker);border:1px solid var(--gold)}
.mobile-menu-btn span{display:block;width:20px;height:1px;background:linear-gradient(90deg,#daaf3a,#ffebaf,#9d7500);transition:all .3s}

/* HERO */
.hero{position:relative;width:100%;min-height:824px;overflow:hidden;display:flex;align-items:center;justify-content:center}
.hero-bg,.test-bg,.ctc-bg,.pg-hero-bg,.pg-banner-bg,.about-cta-bg,.sell-cta-bg{position:absolute;inset:0}
.hero-ov,.test-ov,.pg-hero-ov{position:absolute;inset:0;background:rgba(0,0,0,.35)}
.ctc-ov,.about-cta-ov,.sell-cta-ov{position:absolute;inset:0;background:rgba(0,0,0,.6)}
.pg-banner-ov{position:absolute;inset:0;background:rgba(9,49,42,.85)}
.hero-ct{position:relative;z-index:1;text-align:center;padding:140px 60px 60px;max-width:970px}
.hero h1{font-size:74px;line-height:84px;color:#fff}
.hero-sub{margin-top:39px;font-size:16px;line-height:24px;max-width:696px;margin-left:auto;margin-right:auto}
.hero-btns,.cta-row{margin-top:39px;display:flex;align-items:center;justify-content:center;gap:39px}

/* SERVICES */
.services{background:var(--primary);padding:60px}
.srv-grid{max-width:1440px;margin:0 auto;display:flex;gap:16px;justify-content:space-between}
.srv-card{position:relative;display:block;width:422px;height:479px;overflow:hidden;flex-shrink:0}
.srv-img{width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(.25,.46,.45,.94)}
.srv-card:hover .srv-img{transform:scale(1.08)}
.srv-ov{position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(0,0,0,.15),rgba(0,0,0,.15)),linear-gradient(180deg,rgba(0,0,0,.3) 0%,rgba(0,0,0,0) 43%)}
.srv-lbl{position:absolute;top:0;left:0;padding:20px}
.srv-lbl h3{font-size:50px;color:#fff;line-height:60px}
.gold-line{height:2px;width:0;margin-top:8px;transition:width .6s cubic-bezier(.25,.46,.45,.94);background:linear-gradient(90deg,#daaf3a,#e8c860,#ffebaf,#c9a84c,#9d7500)}
.srv-card:hover .gold-line{width:100%}

/* TESTIMONIALS */
.testimonials,.about-test{position:relative;overflow:hidden}
.test-ct,.about-test-inner{position:relative;z-index:1;max-width:900px;margin:0 auto;padding:150px 60px;text-align:center}
.about-test-inner{padding:80px 60px}
.about-test{background:var(--primary)}
.sec-title{font-size:50px;line-height:60px;margin-bottom:60px}
.test-card{max-width:800px;margin:0 auto}
.stars{margin-bottom:32px;height:18px;display:inline-block}
.test-quote{font-size:16px;line-height:24px;font-style:italic;color:rgba(255,255,255,.8)}
.test-author{margin-top:32px;font-size:16px;line-height:24px}

/* FEATURED LISTINGS */
.feat-listings{background:var(--primary);padding:60px 0}
.fl-container{max-width:1440px;margin:0 auto;padding:0 60px}
.fl-grid{display:flex;gap:16px;justify-content:space-between}
.listing-card{width:422px;flex-shrink:0}
.listing-img-wrap{position:relative;width:100%;height:238px;overflow:hidden}
.listing-img{width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.25,.46,.45,.94)}
.listing-card:hover .listing-img{transform:scale(1.06)}
.listing-badge{position:absolute;top:8px;left:8px;z-index:1;padding:6px 16px}
.listing-badge span{color:var(--primary);font-size:16px;line-height:24px}
.listing-info{padding:16px 0;border-bottom:1px solid var(--gold)}
.listing-price{font-size:20px;line-height:28px}
.listing-addr{font-size:16px;line-height:24px;color:#fff}
.fl-nav{margin-top:60px;text-align:center}
.view-all{color:#fff;font-size:14px;border-bottom:1px solid rgba(255,255,255,.4);padding-bottom:2px;transition:all .3s}
.view-all:hover{color:var(--gold);border-color:var(--gold)}

/* ABOUT */
.about-sec{background:var(--darker);border-top:1px solid var(--gold);border-bottom:1px solid var(--gold)}
.about-inner{max-width:1440px;margin:0 auto;display:flex;align-items:stretch}
.about-img-wrap{width:696px;flex-shrink:0;overflow:hidden}
.about-img{width:100%;height:100%;min-height:652px;object-fit:cover;transition:transform .7s cubic-bezier(.25,.46,.45,.94)}
.about-img-wrap:hover .about-img{transform:scale(1.04)}
.about-txt{flex:1;display:flex;flex-direction:column;justify-content:center;padding:60px 60px 60px 96px}
.about-txt h2{font-size:50px;line-height:60px;margin-bottom:25px}
.about-txt p{font-size:16px;line-height:24px;margin-bottom:16px;color:rgba(255,255,255,.8)}
.about-txt .cta{margin-top:22px;width:178px}

/* CONTACT */
.contact-sec{position:relative;overflow:hidden}
.ctc-ct{position:relative;z-index:1;max-width:1440px;margin:0 auto;padding:80px 60px}
.ctc-grid{display:flex;gap:100px;align-items:flex-start;margin-top:53px}
.ctc-form{flex:1;display:flex;flex-direction:column;gap:12px}
.fi{width:100%;background:rgba(17,61,53,.2);border:1px solid var(--gold);padding:18px;color:#fff;font-size:16px;line-height:24px;font-family:var(--fb);outline:none}
.fi::placeholder{color:rgba(255,255,255,.4)}
.fi-ta{height:141px;resize:none}
.sub-btn{width:100%;margin-top:16px;letter-spacing:.5px}
.ctc-details{flex:1;padding-top:10px}
.ctc-details h3{font-size:34px;line-height:42px;margin-bottom:16px}
.gold-divider{height:1px;width:100%;background:linear-gradient(90deg,#daaf3a,#e8c860,#ffebaf,#c9a84c,#9d7500)}
.gold-accent-line{width:60px;height:2px;margin:24px 0;background:linear-gradient(90deg,#daaf3a,#e8c860,#ffebaf,#c9a84c,#9d7500)}
.ctc-block{margin-top:34px}
.ctc-name{font-size:20px;line-height:28px;margin-bottom:14px}
.ctc-block p,.ctc-block a{font-size:16px;line-height:24px;display:block;color:#fff}
.ctc-block a:hover{color:var(--gold)}
.ctc-social{margin-top:24px;display:flex;gap:16px}
.social-icon-link{display:inline-flex}
.social-circle{width:40px;height:40px;border:1px solid rgba(218,175,58,.3);border-radius:50%;display:flex;align-items:center;justify-content:center;transition:border-color .3s}
.social-icon-link:hover .social-circle{border-color:var(--gold)}

/* FOOTER */
.site-ftr{background:var(--primary);padding:60px 0}
.ftr-inner{max-width:1440px;margin:0 auto;padding:0 60px}
.ftr-logos{display:flex;align-items:center;justify-content:space-between;gap:32px;margin-bottom:55px}
.ftr-brokerage-logo{flex-shrink:0}
.footer-brokerage-text{font-size:16px;color:rgba(255,255,255,.6)}
.ftr-mid{display:flex;justify-content:space-between;align-items:flex-end;gap:40px}
.ftr-contact{max-width:360px}
.ftr-name{font-size:20px;line-height:28px;margin-bottom:14px}
.ftr-contact a{display:block;font-size:16px;line-height:24px;color:#fff;transition:color .3s}
.ftr-contact a:hover{color:var(--gold)}
.ftr-ig{text-decoration:underline}
.ftr-nav{display:flex;flex-wrap:wrap;gap:18px;align-items:flex-end}
.footer-link{color:#fff;font-size:14px;line-height:20px;border-bottom:1px solid #fff;padding-bottom:2px;transition:all .3s}
.footer-link:hover{color:var(--gold);border-color:var(--gold)}
.ftr-bottom{margin-top:40px;display:flex;justify-content:space-between;align-items:center}
.privacy-lnk{color:rgba(255,255,255,.4);font-size:8px;line-height:12px}
.privacy-lnk:hover{color:rgba(255,255,255,.6)}
.ftr-disclaimer{color:rgba(255,255,255,.5);font-size:8px;line-height:12px;max-width:600px}

/* PAGE HEROES */
.pg-hero{position:relative;width:100%;min-height:600px;overflow:hidden;display:flex;align-items:center;justify-content:center}
.pg-hero.short{min-height:400px}
.pg-hero-ct{position:relative;z-index:1;text-align:center;padding:120px 60px 60px;max-width:900px}
.pg-hero-ct h1{font-size:clamp(36px,5vw,74px);line-height:1.13;color:#fff}
.pg-hero-ct p{margin-top:24px;font-size:16px;line-height:24px;max-width:696px;margin-left:auto;margin-right:auto;color:rgba(255,255,255,.8)}
.pg-hero-split{background:var(--primary);display:flex;align-items:stretch}
.pg-hero-img-side{width:50%;flex-shrink:0;overflow:hidden;padding-top:99px}
.pg-hero-portrait{width:100%;height:100%;min-height:500px;object-fit:cover}
.pg-hero-txt-side{flex:1;display:flex;flex-direction:column;justify-content:center;padding:80px 60px 80px 80px}
.hero-body{margin-top:16px;font-size:16px;line-height:26px;color:rgba(255,255,255,.8);max-width:520px}
.pg-banner{position:relative;width:100%;padding:140px 0 60px;overflow:hidden}
.pg-banner-ct{position:relative;z-index:1;max-width:1440px;margin:0 auto;padding:0 60px}
.pg-banner-ct h1{font-size:clamp(36px,5vw,64px);line-height:1.13;color:#fff}
.pg-banner-ct p{margin-top:24px;font-size:16px;line-height:26px;color:rgba(255,255,255,.7);max-width:600px}
.count-label{display:block;margin-top:12px;font-size:14px;color:rgba(255,255,255,.4)}

/* STORY */
.story-sec{background:var(--darker);border-top:1px solid var(--gold);border-bottom:1px solid var(--gold);padding:100px 60px}
.story-grid{max-width:1440px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:32px}
.story-card{border:1px solid rgba(218,175,58,.25);padding:40px}
.story-card p{margin-top:16px;font-size:15px;line-height:26px;color:rgba(255,255,255,.7)}

/* ABOUT CTA */
.about-cta,.sell-cta{position:relative;overflow:hidden}
.about-cta-ct,.sell-cta-ct{position:relative;z-index:1;max-width:700px;margin:0 auto;text-align:center;padding:120px 60px}
.about-cta-ct p,.sell-cta-ct p{margin-top:32px;font-size:16px;line-height:28px;color:rgba(255,255,255,.8)}
.about-cta-ct .cta-row,.sell-cta-ct .cta-row{margin-top:48px}

/* PROCESS */
.process-sec{background:var(--primary);padding:80px 60px}
.process-inner{max-width:1440px;margin:0 auto}
.sec-sub{margin-top:24px;font-size:16px;line-height:26px;color:rgba(255,255,255,.8);max-width:700px}
.steps{margin-top:60px;display:flex;flex-direction:column;gap:8px}
.step{border-left:2px solid rgba(255,255,255,.2);padding:24px 0 24px 32px;transition:border-color .5s}
.step.active{border-color:var(--gold)}
.step-num{font-size:14px;text-transform:uppercase;color:rgba(255,255,255,.4)}
.step.active .step-num{color:inherit}
.step h3{font-size:clamp(22px,3vw,32px);color:rgba(255,255,255,.6);margin-top:8px;transition:color .5s}
.step.active h3{color:#fff}
.step p{font-size:15px;line-height:26px;color:rgba(255,255,255,.6);margin-top:12px;max-width:600px}
.step.active p{color:rgba(255,255,255,.8)}

/* MARKETING */
.mktg-sec{background:var(--primary);padding:80px 60px}
.mktg-inner{max-width:1440px;margin:0 auto}
.mktg-slider{margin-top:70px;display:flex;border:1px solid rgba(218,175,58,.2)}
.mktg-img-side{width:55%;position:relative;overflow:hidden;background:var(--darker)}
.mktg-img{width:100%;height:100%;min-height:480px;object-fit:cover}
.mktg-txt-side{flex:1;background:var(--darker);padding:60px;display:flex;flex-direction:column;justify-content:center}
.mktg-txt-side p{margin-top:16px;font-size:16px;line-height:26px;color:rgba(255,255,255,.75)}

/* SELLING PROCESS */
.sell-process{background:var(--darker);border-top:1px solid var(--gold);border-bottom:1px solid var(--gold);padding:80px 60px}
.sell-process-inner{max-width:1440px;margin:0 auto}
.timeline{margin-top:70px;max-width:700px;margin-left:10%;position:relative}
.timeline::before{content:'';position:absolute;left:21px;top:0;bottom:0;width:1px;background:rgba(255,255,255,.1)}
.tl-step{display:flex;gap:32px;padding-bottom:48px;position:relative}
.tl-node{width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;z-index:1;background:var(--darker)}
.tl-step.active .tl-node{border-color:var(--gold)}
.tl-node::after{content:'';width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.2)}
.tl-step.active .tl-node::after{width:12px;height:12px;background:linear-gradient(90deg,#daaf3a,#e8c860,#ffebaf,#c9a84c,#9d7500)}
.tl-ct{padding-top:8px}
.tl-ct h3{font-size:clamp(24px,3vw,36px);color:rgba(255,255,255,.4);margin-top:8px;transition:color .5s}
.tl-step.active .tl-ct h3{color:#fff}
.tl-ct p{font-size:15px;line-height:26px;color:rgba(255,255,255,.25);margin-top:12px;max-width:520px}
.tl-step.active .tl-ct p{color:rgba(255,255,255,.7)}

/* GRID SECTIONS */
.grid-sec{background:var(--primary);padding:60px 0}
.grid-inner{max-width:1440px;margin:0 auto;padding:0 60px}
.cards-grid{display:grid;gap:32px}
.cards-grid.cols-2{grid-template-columns:repeat(2,1fr)}
.cards-grid.cols-3{grid-template-columns:repeat(3,1fr)}
.cards-grid .listing-card{width:100%}
.cards-grid .listing-img-wrap{height:280px}

/* BLOG */
.blog-card{overflow:hidden}
.blog-card-img{position:relative;width:100%;aspect-ratio:16/10;overflow:hidden}
.blog-card-img img{width:100%;height:100%;object-fit:cover;transition:transform .5s cubic-bezier(.25,.46,.45,.94)}
.blog-card:hover .blog-card-img img{transform:scale(1.05)}
.blog-card-ct{padding:20px 0;border-bottom:1px solid rgba(255,255,255,.1)}
.blog-cat{font-size:12px;text-transform:uppercase;letter-spacing:.1em}
.blog-title{font-size:clamp(20px,2.5vw,24px);color:#fff;margin-top:8px;transition:color .3s}
.blog-card:hover .blog-title{color:var(--gold)}
.blog-date{margin-top:8px;font-size:13px;color:rgba(255,255,255,.5)}
.blog-excerpt{margin-top:12px;font-size:15px;line-height:24px;color:rgba(255,255,255,.6)}
.read-more{display:inline-block;margin-top:16px;font-size:14px;font-weight:600;color:var(--gold)}

/* CONTACT PAGE */
.contact-page-sec{background:var(--primary);padding:80px 0}
.contact-page-inner{max-width:1440px;margin:0 auto;padding:0 60px;display:flex;gap:100px;align-items:flex-start}
.cp-form-side{flex:1;min-width:0}
.cp-details-side{width:400px;flex-shrink:0}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}

/* PRIVACY */
.privacy-sec{background:var(--primary);padding:60px 0}
.privacy-inner{max-width:800px;margin:0 auto;padding:0 60px}
.privacy-date{font-size:14px;color:rgba(255,255,255,.5);margin-bottom:32px}
.privacy-block{margin-bottom:32px}
.privacy-block h2{font-size:26px;line-height:1.3;margin-bottom:12px}
.privacy-block p{font-size:16px;line-height:28px;color:rgba(255,255,255,.8)}
.privacy-block a{color:#fff}
.privacy-block a:hover{color:var(--gold)}

/* RESPONSIVE */
@media(max-width:1200px){
  .hdr-nav{display:none}
  .hdr-inner{padding:0 20px;height:70px}
  .mobile-menu-btn{display:flex}
  .hdr-nav.open{display:flex;flex-direction:column;position:fixed;top:70px;left:0;right:0;bottom:0;background:var(--primary);padding:40px 20px;gap:16px;z-index:100}
  .hdr-nav.open .nav-link{font-size:24px;font-family:var(--fh);padding:8px 0;border-bottom:1px solid rgba(255,255,255,.1)}
  .hero{min-height:600px}
  .hero h1{font-size:48px;line-height:56px}
  .hero-ct{padding:100px 20px 40px}
  .hero-btns,.cta-row{flex-direction:column;gap:16px}
  .services{padding:20px}
  .srv-grid{flex-direction:column;gap:16px}
  .srv-card{width:100%;height:300px}
  .srv-lbl h3{font-size:36px;line-height:44px}
  .sec-title{font-size:36px;line-height:44px}
  .test-ct,.about-test-inner{padding:60px 20px}
  .fl-container{padding:0 20px}
  .fl-grid{flex-direction:column}
  .listing-card{width:100%}
  .about-inner{flex-direction:column}
  .about-img-wrap{width:100%}
  .about-img{min-height:300px}
  .about-txt{padding:40px 20px}
  .about-txt h2{font-size:36px;line-height:44px}
  .ctc-ct{padding:40px 20px}
  .ctc-grid{flex-direction:column;gap:40px}
  .ctc-details h3{font-size:28px;line-height:36px}
  .ftr-inner{padding:0 20px}
  .ftr-logos{flex-direction:column;align-items:flex-start}
  .ftr-mid{flex-direction:column;align-items:flex-start}
  .ftr-bottom{flex-direction:column;align-items:flex-start;gap:8px}
  .pg-hero-ct{padding:100px 20px 40px}
  .pg-hero-split{flex-direction:column}
  .pg-hero-img-side{width:100%;padding-top:70px}
  .pg-hero-portrait{min-height:350px}
  .pg-hero-txt-side{padding:40px 20px}
  .pg-banner{padding:100px 0 40px}
  .pg-banner-ct{padding:0 20px}
  .story-sec{padding:60px 20px}
  .story-grid{grid-template-columns:1fr;gap:20px}
  .about-cta-ct,.sell-cta-ct{padding:60px 20px}
  .process-sec,.mktg-sec,.sell-process{padding:60px 20px}
  .mktg-slider{flex-direction:column}
  .mktg-img-side{width:100%;min-height:300px}
  .mktg-txt-side{padding:32px 20px}
  .timeline{margin-left:0}
  .cards-grid.cols-2,.cards-grid.cols-3{grid-template-columns:1fr}
  .grid-inner{padding:0 20px}
  .contact-page-inner{flex-direction:column;gap:40px;padding:0 20px}
  .cp-details-side{width:100%}
  .form-row{grid-template-columns:1fr}
  .privacy-inner{padding:0 20px}
}
`.trim();
}
