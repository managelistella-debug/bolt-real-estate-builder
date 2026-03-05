import { StartingPointTemplate } from '../../types';
import { TemplateCustomization, RenderedTemplate } from '../../renderTemplate';

const IMG = '/templates/country/images';

function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderCountrySite(
  template: StartingPointTemplate,
  c: TemplateCustomization,
): RenderedTemplate {
  const agent = c.agentName || 'Your Name';
  const brokerage = c.brokerageName || '';
  const phone = c.phone || '(555) 000-0000';
  const email = c.email || 'hello@example.com';
  const office = c.officeAddress || '';
  const aboutText = c.aboutMe
    || `With deep roots in the local community, ${agent} understands the land, the market, and what it takes to achieve exceptional results for every client.`;
  const areas = c.targetAreas || 'the surrounding area';

  const primary = c.primaryColor || template.colors.primary;
  const accent = c.secondaryColor || template.colors.secondary;
  const fontH = c.fontHeading || template.fonts.heading;
  const fontB = c.fontBody || template.fonts.body;

  const siteName = c.teamName || agent;

  const socialLinks: string[] = [];
  if (c.social?.instagram) socialLinks.push(`<a href="${esc(c.social.instagram)}" target="_blank" rel="noopener noreferrer" class="social-link">Instagram</a>`);
  if (c.social?.facebook) socialLinks.push(`<a href="${esc(c.social.facebook)}" target="_blank" rel="noopener noreferrer" class="social-link">Facebook</a>`);
  if (c.social?.linkedin) socialLinks.push(`<a href="${esc(c.social.linkedin)}" target="_blank" rel="noopener noreferrer" class="social-link">LinkedIn</a>`);
  if (c.social?.youtube) socialLinks.push(`<a href="${esc(c.social.youtube)}" target="_blank" rel="noopener noreferrer" class="social-link">YouTube</a>`);
  if (c.social?.tiktok) socialLinks.push(`<a href="${esc(c.social.tiktok)}" target="_blank" rel="noopener noreferrer" class="social-link">TikTok</a>`);

  const listings = [
    { price: '$1,200,000', address: '33289 Lakeview Court', img: `${IMG}/featured-1.webp`, badge: 'For Sale' },
    { price: '$1,350,000', address: '22034 Lakeview Drive', img: `${IMG}/featured-2.webp`, badge: 'For Sale' },
    { price: '$1,200,000', address: '33291 Lakeview Court', img: `${IMG}/featured-3.webp`, badge: 'For Sale' },
  ];

  const testimonials = [
    { quote: `"Working with ${agent} was an absolutely fantastic experience. Knowledgeable, responsive, and incredibly helpful throughout the entire process."`, author: 'Happy Client' },
    { quote: `"${agent} made the entire process of selling our property seamless and stress-free. Her understanding of the market is unmatched."`, author: 'Satisfied Seller' },
    { quote: `"As first-time buyers, we had a lot of questions. ${agent} guided us through every step with patience and expertise."`, author: 'New Homeowner' },
  ];

  const services = [
    { title: 'Listings', img: `${IMG}/listings-card.webp`, href: '/listings/active' },
    { title: 'Selling', img: `${IMG}/selling-card.webp`, href: '/selling' },
    { title: 'Buying', img: `${IMG}/buying-card.webp`, href: '/buying' },
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

  const footerNavItems = [
    { label: 'Home', href: '/' },
    { label: 'Estates', href: '/estates' },
    { label: 'Active', href: '/listings/active' },
    { label: 'Sold', href: '/listings/sold' },
    { label: 'Buying', href: '/buying' },
    { label: 'Selling', href: '/selling' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const previewHtml = `
<main class="site-root">
  <!-- HEADER -->
  <header class="site-header">
    <div class="header-inner">
      <a href="/" class="header-brand">${esc(siteName)}</a>
      <nav class="header-nav">
        ${navItems.map((n) => `<a href="${n.href}" class="nav-link">${n.label}</a>`).join('\n        ')}
      </nav>
      <div class="header-actions">
        <a href="tel:${phone.replace(/\D/g, '')}" class="cta-btn gold-gradient-bg">Call ${esc(agent.split(' ')[0])}</a>
      </div>
    </div>
  </header>

  <!-- HERO -->
  <section class="hero">
    <div class="hero-bg parallax-bg" style="background-image:url(${IMG}/hero-bg.webp)"></div>
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1 class="font-heading">Extraordinary Land. Exceptional Representation</h1>
      <p class="hero-sub">Specializing in ${esc(areas)}, ${esc(agent)} brings deep local expertise to every estate, ranch, and acreage transaction. Whether buying or selling, expect results rooted in strategy, care, and precision.</p>
      <div class="hero-btns">
        <a href="/estates" class="cta-btn gold-gradient-bg">View Estates</a>
        <a href="/listings/active" class="cta-btn cta-outline">View Listings</a>
      </div>
    </div>
  </section>

  <!-- SERVICE CARDS -->
  <section class="services">
    <div class="services-grid">
      ${services.map((s) => `
      <a href="${s.href}" class="service-card">
        <img src="${s.img}" alt="${s.title}" class="service-img" />
        <div class="service-overlay"></div>
        <div class="service-label">
          <h3 class="font-heading">${s.title}</h3>
          <div class="gold-line"></div>
        </div>
      </a>`).join('')}
    </div>
  </section>

  <!-- TESTIMONIALS -->
  <section class="testimonials">
    <div class="testimonials-bg parallax-bg" style="background-image:url(${IMG}/homepage-testimonial-bg.webp)"></div>
    <div class="testimonials-overlay"></div>
    <div class="testimonials-content">
      <h2 class="font-heading gold-gradient-text section-title">Testimonials</h2>
      <div class="testimonial-card">
        <img src="${IMG}/stars.svg" alt="5 stars" class="stars-img" />
        <p class="testimonial-quote">${testimonials[0].quote}</p>
        <p class="testimonial-author">${testimonials[0].author}</p>
      </div>
    </div>
  </section>

  <!-- FEATURED LISTINGS -->
  <section class="featured-listings" data-source="cms-listings">
    <div class="listings-container">
      <div class="listings-grid">
        ${listings.map((l) => `
        <div class="listing-card" data-loop-item>
          <div class="listing-img-wrap">
            <img src="${l.img}" alt="${esc(l.address)}" class="listing-img" data-cms />
            <div class="listing-badge gold-gradient-bg"><span>${l.badge}</span></div>
          </div>
          <div class="listing-info">
            <p class="listing-price font-heading gold-gradient-text" data-cms-text="Listings">${l.price}</p>
            <p class="listing-address" data-cms-text="Listings">${esc(l.address)}</p>
          </div>
        </div>`).join('')}
      </div>
      <div class="listings-nav">
        <a href="/listings/active" class="view-all-link">View All Listings</a>
      </div>
    </div>
  </section>

  <!-- ABOUT -->
  <section class="about-section">
    <div class="about-inner">
      <div class="about-image-wrap">
        <img src="${IMG}/about-image.webp" alt="${esc(agent)}" class="about-img" />
      </div>
      <div class="about-text">
        <h2 class="font-heading gold-gradient-text">Meet ${esc(agent)}</h2>
        <p>${esc(aboutText)}</p>
        <a href="/about" class="cta-btn gold-gradient-bg">Learn More</a>
      </div>
    </div>
  </section>

  <!-- CONTACT -->
  <section class="contact-section">
    <div class="contact-bg parallax-bg" style="background-image:url(${IMG}/homepage-contact-bg.webp)"></div>
    <div class="contact-overlay"></div>
    <div class="contact-content">
      <h2 class="font-heading gold-gradient-text section-title">Get in Touch with ${esc(agent.split(' ')[0])}</h2>
      <div class="contact-grid">
        <form class="contact-form" onsubmit="return false">
          <input type="text" placeholder="Name" class="form-input" />
          <input type="email" placeholder="Email" class="form-input" />
          <input type="tel" placeholder="Phone" class="form-input" />
          <textarea placeholder="Message" class="form-input form-textarea"></textarea>
          <button type="submit" class="cta-btn gold-gradient-bg submit-btn">Submit</button>
        </form>
        <div class="contact-details">
          <h3 class="font-heading gold-gradient-text">Contact Details</h3>
          <div class="gold-divider"></div>
          <div class="contact-info-block">
            <p class="contact-name font-heading gold-gradient-text">${esc(agent)}</p>
            <p>${esc(phone)}</p>
            <a href="mailto:${esc(email)}">${esc(email)}</a>
            ${office ? `<p>${esc(office)}</p>` : ''}
          </div>
          ${brokerage ? `
          <div class="contact-info-block">
            <p class="contact-name font-heading gold-gradient-text">${esc(brokerage)}</p>
          </div>` : ''}
          ${socialLinks.length > 0 ? `<div class="social-links">${socialLinks.join('')}</div>` : ''}
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-top">
        <span class="footer-brand font-heading">${esc(siteName)}</span>
      </div>
      <div class="footer-mid">
        <div class="footer-contact-info">
          <p class="footer-name font-heading gold-gradient-text">${esc(agent)}</p>
          <a href="tel:${phone.replace(/\D/g, '')}">${esc(phone)}</a>
          <a href="mailto:${esc(email)}">${esc(email)}</a>
        </div>
        <nav class="footer-nav">
          ${footerNavItems.map((n) => `<a href="${n.href}" class="footer-link">${n.label}</a>`).join('\n          ')}
        </nav>
      </div>
      <div class="footer-bottom">
        <a href="/privacy" class="privacy-link">Privacy Policy</a>
      </div>
    </div>
  </footer>
</main>`.trim();

  const previewCss = `
@font-face {
  font-family: 'Reckless Neue';
  src: url('/templates/country/fonts/RecklessNeue-Regular.ttf') format('truetype');
  font-weight: 400; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Lato';
  src: url('/templates/country/fonts/Lato-Regular.ttf') format('truetype');
  font-weight: 400; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Lato';
  src: url('/templates/country/fonts/Lato-Light.ttf') format('truetype');
  font-weight: 300; font-style: normal; font-display: swap;
}

:root {
  --primary: ${primary};
  --accent: ${accent};
  --darker: #113d35;
  --font-heading: '${fontH}', 'Georgia', serif;
  --font-body: '${fontB}', sans-serif;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  background: var(--primary);
  color: #fff;
  font-family: var(--font-body);
  font-weight: 300;
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
a { text-decoration: none; color: inherit; cursor: pointer; }
button { cursor: pointer; }
.font-heading { font-family: var(--font-heading); font-weight: 400; }

.gold-gradient-text {
  background: linear-gradient(90deg, ${accent} 0%, #e8c860 25%, #ffebaf 50%, #c9a84c 75%, #9d7500 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.gold-gradient-bg {
  background: linear-gradient(90deg, ${accent} 0%, #e8c860 25%, #ffebaf 50%, #c9a84c 75%, #9d7500 100%);
}
.parallax-bg {
  background-attachment: fixed; background-position: center; background-size: cover; background-repeat: no-repeat;
}
@media (max-width: 768px) { .parallax-bg { background-attachment: scroll; } }

/* HEADER */
.site-header {
  position: sticky; top: 0; z-index: 50;
  background: var(--primary); transition: background 0.5s;
}
.header-inner {
  max-width: 1440px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 60px; height: 99px;
}
.header-brand { font-family: var(--font-heading); font-size: 22px; color: #fff; white-space: nowrap; }
.header-nav { display: flex; align-items: center; gap: 30px; }
.nav-link {
  color: #fff; font-size: 14px; font-weight: 400; transition: color 0.3s;
  position: relative; padding-bottom: 2px;
}
.nav-link:hover { color: var(--accent); }
.nav-link::after {
  content: ''; position: absolute; bottom: -1px; left: 0; width: 0; height: 1px;
  background: var(--accent); transition: width 0.3s;
}
.nav-link:hover::after { width: 100%; }
.header-actions { display: flex; align-items: center; gap: 20px; }
.cta-btn {
  display: inline-flex; align-items: center; justify-content: center;
  height: 47px; padding: 0 28px; font-size: 14px; font-weight: 600;
  font-family: var(--font-body); color: var(--primary); transition: opacity 0.3s;
}
.cta-btn:hover { opacity: 0.9; }
.cta-outline {
  background: none; border: 1px solid #fff; color: #fff;
}
.cta-outline:hover { background: rgba(255,255,255,0.1); }

/* HERO */
.hero { position: relative; width: 100%; min-height: 824px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.hero-bg { position: absolute; inset: 0; }
.hero-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.35); }
.hero-content {
  position: relative; z-index: 1; text-align: center;
  padding: 140px 60px 60px; max-width: 970px;
}
.hero h1 { font-size: 74px; line-height: 84px; color: #fff; }
.hero-sub { margin-top: 39px; font-size: 16px; line-height: 24px; max-width: 696px; margin-left: auto; margin-right: auto; }
.hero-btns { margin-top: 39px; display: flex; align-items: center; justify-content: center; gap: 39px; }

/* SERVICES */
.services { background: var(--primary); padding: 60px; }
.services-grid { max-width: 1440px; margin: 0 auto; display: flex; gap: 16px; justify-content: space-between; }
.service-card {
  position: relative; display: block; width: 422px; height: 479px; overflow: hidden; flex-shrink: 0;
}
.service-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s cubic-bezier(.25,.46,.45,.94); }
.service-card:hover .service-img { transform: scale(1.08); }
.service-overlay {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(90deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15)), linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 43%);
}
.service-label { position: absolute; top: 0; left: 0; padding: 20px; }
.service-label h3 { font-size: 50px; color: #fff; line-height: 60px; }
.gold-line { height: 2px; width: 0; margin-top: 8px; transition: width 0.6s cubic-bezier(.25,.46,.45,.94); }
.service-card:hover .gold-line { width: 100%; }
.gold-line { background: linear-gradient(90deg, ${accent}, #e8c860, #ffebaf, #c9a84c, #9d7500); }

/* TESTIMONIALS */
.testimonials { position: relative; overflow: hidden; }
.testimonials-bg { position: absolute; inset: 0; }
.testimonials-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); }
.testimonials-content {
  position: relative; z-index: 1; max-width: 900px; margin: 0 auto;
  padding: 150px 60px; text-align: center;
}
.section-title { font-size: 50px; line-height: 60px; margin-bottom: 60px; }
.testimonial-card { max-width: 800px; margin: 0 auto; }
.stars-img { margin-bottom: 32px; height: 18px; }
.testimonial-quote { font-size: 16px; line-height: 24px; font-weight: 400; }
.testimonial-author { margin-top: 32px; font-size: 16px; line-height: 24px; }

/* FEATURED LISTINGS */
.featured-listings { background: var(--primary); padding: 60px 0; }
.listings-container { max-width: 1440px; margin: 0 auto; padding: 0 60px; }
.listings-grid { display: flex; gap: 16px; justify-content: space-between; }
.listing-card { width: 422px; flex-shrink: 0; }
.listing-img-wrap { position: relative; width: 100%; height: 238px; overflow: hidden; }
.listing-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(.25,.46,.45,.94); }
.listing-card:hover .listing-img { transform: scale(1.06); }
.listing-badge { position: absolute; top: 8px; left: 8px; z-index: 1; padding: 6px 16px; }
.listing-badge span { color: var(--primary); font-size: 16px; line-height: 24px; }
.listing-info { padding: 16px 0; border-bottom: 1px solid var(--accent); }
.listing-price { font-size: 20px; line-height: 28px; }
.listing-address { font-size: 16px; line-height: 24px; color: #fff; }
.listings-nav { margin-top: 60px; text-align: center; }
.view-all-link { color: #fff; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.4); padding-bottom: 2px; transition: all 0.3s; }
.view-all-link:hover { color: var(--accent); border-color: var(--accent); }

/* ABOUT */
.about-section { background: var(--darker); border-top: 1px solid var(--accent); border-bottom: 1px solid var(--accent); }
.about-inner { max-width: 1440px; margin: 0 auto; display: flex; align-items: stretch; }
.about-image-wrap { width: 696px; flex-shrink: 0; overflow: hidden; }
.about-img { width: 100%; height: 100%; min-height: 652px; object-fit: cover; transition: transform 0.7s cubic-bezier(.25,.46,.45,.94); }
.about-image-wrap:hover .about-img { transform: scale(1.04); }
.about-text { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 60px 60px 60px 96px; }
.about-text h2 { font-size: 50px; line-height: 60px; margin-bottom: 25px; }
.about-text p { font-size: 16px; line-height: 24px; margin-bottom: 16px; }
.about-text .cta-btn { margin-top: 22px; width: 178px; }

/* CONTACT */
.contact-section { position: relative; overflow: hidden; }
.contact-bg { position: absolute; inset: 0; }
.contact-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); }
.contact-content { position: relative; z-index: 1; max-width: 1440px; margin: 0 auto; padding: 80px 60px; }
.contact-content .section-title { text-align: left; margin-bottom: 53px; }
.contact-grid { display: flex; gap: 100px; align-items: flex-start; }
.contact-form { flex: 1; display: flex; flex-direction: column; gap: 12px; }
.form-input {
  width: 100%; background: rgba(17,61,53,0.2); border: 1px solid var(--accent);
  padding: 18px; color: #fff; font-size: 16px; line-height: 24px;
  font-family: var(--font-body); outline: none;
}
.form-input::placeholder { color: rgba(255,255,255,0.5); }
.form-textarea { height: 141px; resize: none; }
.submit-btn { width: 100%; margin-top: 16px; letter-spacing: 0.5px; }
.contact-details { flex: 1; padding-top: 10px; }
.contact-details h3 { font-size: 34px; line-height: 42px; margin-bottom: 16px; }
.gold-divider { height: 1px; width: 100%; background: linear-gradient(90deg, ${accent}, #e8c860, #ffebaf, #c9a84c, #9d7500); }
.contact-info-block { margin-top: 34px; }
.contact-name { font-size: 20px; line-height: 28px; margin-bottom: 14px; }
.contact-info-block p, .contact-info-block a { font-size: 16px; line-height: 24px; display: block; }
.contact-info-block a:hover { color: var(--accent); }
.social-links { margin-top: 24px; display: flex; gap: 16px; }
.social-link {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 8px 16px; border: 1px solid var(--accent); font-size: 13px;
  color: #fff; transition: all 0.3s;
}
.social-link:hover { color: var(--accent); }

/* FOOTER */
.site-footer { background: var(--primary); padding: 60px 0; }
.footer-inner { max-width: 1440px; margin: 0 auto; padding: 0 60px; }
.footer-top { margin-bottom: 55px; }
.footer-brand { font-size: 28px; color: #fff; }
.footer-mid { display: flex; justify-content: space-between; align-items: flex-end; gap: 40px; }
.footer-contact-info { max-width: 360px; }
.footer-name { font-size: 20px; line-height: 28px; margin-bottom: 14px; }
.footer-contact-info a { display: block; font-size: 16px; line-height: 24px; color: #fff; transition: color 0.3s; }
.footer-contact-info a:hover { color: var(--accent); }
.footer-nav { display: flex; flex-wrap: wrap; gap: 18px; align-items: flex-end; }
.footer-link { color: #fff; font-size: 14px; line-height: 20px; border-bottom: 1px solid #fff; padding-bottom: 2px; transition: all 0.3s; }
.footer-link:hover { color: var(--accent); border-color: var(--accent); }
.footer-bottom { margin-top: 40px; text-align: right; }
.privacy-link { color: rgba(255,255,255,0.4); font-size: 8px; line-height: 12px; }
.privacy-link:hover { color: rgba(255,255,255,0.6); }

/* RESPONSIVE */
@media (max-width: 1200px) {
  .header-nav { display: none; }
  .header-inner { padding: 0 20px; height: 70px; }
  .hero h1 { font-size: 48px; line-height: 56px; }
  .hero-content { padding: 100px 20px 40px; }
  .hero { min-height: 600px; }
  .services { padding: 20px; }
  .services-grid { flex-direction: column; gap: 16px; }
  .service-card { width: 100%; height: 300px; }
  .service-label h3 { font-size: 36px; line-height: 44px; }
  .section-title { font-size: 36px; line-height: 44px; }
  .testimonials-content { padding: 80px 20px; }
  .listings-container { padding: 0 20px; }
  .listings-grid { flex-direction: column; }
  .listing-card { width: 100%; }
  .about-inner { flex-direction: column; }
  .about-image-wrap { width: 100%; }
  .about-img { min-height: 300px; }
  .about-text { padding: 40px 20px; }
  .about-text h2 { font-size: 36px; line-height: 44px; }
  .contact-content { padding: 40px 20px; }
  .contact-grid { flex-direction: column; gap: 40px; }
  .contact-details h3 { font-size: 28px; line-height: 36px; }
  .footer-inner { padding: 0 20px; }
  .footer-mid { flex-direction: column; align-items: flex-start; }
  .footer-bottom { text-align: left; }
  .hero-btns { flex-direction: column; gap: 16px; }
}
`.trim();

  return { previewHtml, previewCss, siteName };
}
