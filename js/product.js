// ============================================================
//  WEBSURPRISE STORE — PRODUCT.JS
//  Handles: reading template from URL, rendering product page,
//           thumbnail/video toggle, pricing + CTA buttons
// ============================================================


// ── THEME TOGGLE ─────────────────────────────────────────────

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function loadTheme() {
  const saved = localStorage.getItem('ws-theme');
  if (saved === 'light') {
    html.classList.add('light');
    if (themeToggle) themeToggle.textContent = '☀️';
  } else {
    html.classList.remove('light');
    if (themeToggle) themeToggle.textContent = '🌙';
  }
}

function toggleTheme() {
  const isLight = html.classList.toggle('light');
  localStorage.setItem('ws-theme', isLight ? 'light' : 'dark');
  if (themeToggle) themeToggle.textContent = isLight ? '☀️' : '🌙';
}

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
loadTheme();


// ── GET TEMPLATE FROM URL ─────────────────────────────────────

function getTemplateFromURL() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id || typeof TEMPLATES === 'undefined') return null;
  return TEMPLATES.find(t => t.id === id) || null;
}


// ── THUMBNAIL / VIDEO TOGGLE ──────────────────────────────────

let videoPlaying = false;

function initMediaToggle(template) {
  const toggleBtn  = document.getElementById('demoToggleBtn');
  const thumbnail  = document.getElementById('mediaThumbnail');
  const videoFrame = document.getElementById('mediaVideo');

  if (!toggleBtn) return;

  if (!template.youtubeId) {
    toggleBtn.textContent = '⚠️ Demo video not added yet';
    toggleBtn.style.opacity = '0.5';
    toggleBtn.style.cursor = 'not-allowed';
    return;
  }

  toggleBtn.addEventListener('click', () => {
    if (!videoPlaying) {
      videoFrame.src = `https://www.youtube.com/embed/${template.youtubeId}?autoplay=1&rel=0&modestbranding=1`;
      videoFrame.style.display = 'block';
      if (thumbnail) thumbnail.style.opacity = '0';
      toggleBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
        </svg>
        See Thumbnail`;
      toggleBtn.classList.add('playing');
      videoPlaying = true;
    } else {
      videoFrame.src = '';
      videoFrame.style.display = 'none';
      if (thumbnail) thumbnail.style.opacity = '1';
      toggleBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5,3 19,12 5,21"/>
        </svg>
        ▶ Video Demo`;
      toggleBtn.classList.remove('playing');
      videoPlaying = false;
    }
  });
}


// ── RENDER PRODUCT PAGE ───────────────────────────────────────

function renderProduct(template) {
  document.title = `${template.name} — WebSurprise`;

  // Thumbnail
  const thumb = document.getElementById('mediaThumbnail');
  if (thumb) {
    if (template.thumbnail) { thumb.src = template.thumbnail; thumb.alt = template.name; }
    else { thumb.style.display = 'none'; }
  }

  // Category badge
  const badge = document.getElementById('productBadge');
  if (badge) {
    const cat = CATEGORIES.find(c => c.key === template.category);
    badge.textContent = cat ? cat.label : template.category;
    badge.className = `card-badge product-badge ${getCategoryBadgeClass(template.category)}`;
  }

  // NEW badge
  const newBadge = document.getElementById('newBadge');
  if (newBadge) newBadge.style.display = template.isNew ? 'inline-flex' : 'none';

  // Name & description
  const nameEl = document.getElementById('productName');
  const descEl = document.getElementById('productDesc');
  if (nameEl) nameEl.textContent = template.name;
  if (descEl) descEl.textContent = template.description;

  // Features
  const featuresList = document.getElementById('featuresList');
  if (featuresList && template.features) {
    template.features.forEach(f => {
      const li = document.createElement('div');
      li.className = 'feature-item';
      li.innerHTML = `<span class="feature-check">✓</span><span>${f}</span>`;
      featuresList.appendChild(li);
    });
  }

  // ── PRICING BOX ───────────────────────────────────────────
  const priceDisplay    = document.getElementById('priceDisplay');
  const originalPrice   = document.getElementById('originalPrice');
  const saveBadge       = document.getElementById('saveBadge');
  const limitedBadge    = document.getElementById('limitedBadge');

  if (priceDisplay)  priceDisplay.textContent  = template.price;
  if (originalPrice) originalPrice.textContent = template.originalPrice;
  if (saveBadge)     saveBadge.textContent      = template.saveText;
  if (limitedBadge)  limitedBadge.style.display = template.limitedOffer ? 'inline-flex' : 'none';

  // Price in customize button
  const priceDisplayBtn = document.getElementById('priceDisplayBtn');
  if (priceDisplayBtn) priceDisplayBtn.textContent = template.price;

  // ── CTA BUTTONS ───────────────────────────────────────────

  // View Live Preview
  const viewLiveBtn = document.getElementById('viewLiveBtn');
  if (viewLiveBtn) {
    if (template.liveUrl) {
      viewLiveBtn.href = template.liveUrl;
    } else {
      viewLiveBtn.style.display = 'none';
    }
  }

  // Customize It
  const customizeBtn = document.getElementById('customizeBtn');
  if (customizeBtn) {
    if (template.customizeUrl) {
      customizeBtn.href = template.customizeUrl;
    } else {
      customizeBtn.style.opacity = '0.5';
      customizeBtn.style.pointerEvents = 'none';
    }
  }

  // Init video toggle
  initMediaToggle(template);
}


// ── HELPER: badge class ───────────────────────────────────────

function getCategoryBadgeClass(category) {
  const map = {
    birthday:    'badge-birthday',
    anniversary: 'badge-anniversary',
    proposal:    'badge-proposal',
    love:        'badge-love',
    parents:     'badge-parents',
    farewell:    'badge-farewell',
  };
  return map[category] || 'badge-birthday';
}


// ── SCROLL ANIMATIONS ─────────────────────────────────────────

function observeFadeIns() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) el.classList.add('visible');
  });
}


// ── HAMBURGER MENU ────────────────────────────────────────────

function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('mobile-open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('mobile-open'));
  });
}


// ── FAQ ACCORDION ─────────────────────────────────────────────

function toggleFaq(el) {
  const item = el.parentElement;
  document.querySelectorAll('.faq-item.open').forEach(other => {
    if (other !== item) other.classList.remove('open');
  });
  item.classList.toggle('open');
}


// ── INIT ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const template = getTemplateFromURL();

  if (!template) {
    document.getElementById('productContent').innerHTML = `
      <div style="text-align:center; padding:80px 20px;">
        <p style="font-size:3rem; margin-bottom:16px;">😕</p>
        <h2 style="margin-bottom:12px;">Template not found</h2>
        <a href="index.html" style="color:var(--pink); font-weight:700;">← Back to Templates</a>
      </div>`;
    return;
  }

  initHamburger();
  renderProduct(template);
  observeFadeIns();
});
