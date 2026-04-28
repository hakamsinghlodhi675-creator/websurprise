// ============================================================
//  WEBSURPRISE STORE — MAIN.JS
//  Handles: theme toggle, particle canvas, filter bar,
//           template card rendering, scroll animations
// ============================================================


// ── THEME TOGGLE ─────────────────────────────────────────────

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme from localStorage (remembers user preference)
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


// ── PARTICLE CANVAS (starfield background on hero) ───────────

function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  // Each particle = a tiny glowing dot
  function createParticle() {
    return {
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      r:      Math.random() * 2.2 + 0.8,        // bigger dots
      alpha:  Math.random() * 0.5 + 0.35,       // brighter — min 0.35
      speed:  Math.random() * 0.3 + 0.06,
      drift:  (Math.random() - 0.5) * 0.18,
      isPink: Math.random() < 0.15,              // 15% pink glow dots
      twinkle: Math.random() * Math.PI * 2,      // random phase for twinkle
    };
  }

  function init() {
    resize();
    // Number of particles — increase for denser starfield
    const count = Math.floor((canvas.width * canvas.height) / 5000);
    particles = Array.from({ length: count }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isLight = document.documentElement.classList.contains('light');
    const now = Date.now();

    particles.forEach(p => {
      // Twinkle: gently pulse alpha
      p.twinkle += 0.012;
      const twinkleAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.twinkle));

      if (p.isPink) {
        // Pink glow halo
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        grad.addColorStop(0, `rgba(255,77,141,${twinkleAlpha * 0.8})`);
        grad.addColorStop(0.4, `rgba(255,77,141,${twinkleAlpha * 0.3})`);
        grad.addColorStop(1, 'rgba(255,77,141,0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        // Core pink dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,120,170,${twinkleAlpha})`;
        ctx.fill();
      } else {
        // White star dot (purple tint in light mode)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isLight
          ? `rgba(80,50,140,${twinkleAlpha * 0.55})`
          : `rgba(255,255,255,${twinkleAlpha})`;
        ctx.fill();
      }

      p.y -= p.speed;
      p.x += p.drift;

      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }
    });

    animId = requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', init);
}

initParticles();


// ── FILTER BAR ───────────────────────────────────────────────

let activeFilter = 'all'; // currently selected category

function initFilters() {
  const filterBar = document.getElementById('filterBar');
  if (!filterBar || typeof CATEGORIES === 'undefined') return;

  // ── DESKTOP: pill buttons (shown on screens > 640px) ──
  const pillsContainer = document.createElement('div');
  pillsContainer.className = 'filter-pills';
  pillsContainer.id = 'filterPills';

  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (cat.key === 'all' ? ' active' : '');
    btn.textContent = cat.label;
    btn.dataset.filter = cat.key;
    btn.addEventListener('click', () => setFilter(cat.key));
    pillsContainer.appendChild(btn);
  });

  // ── MOBILE: dropdown select (shown on screens <= 640px) ──
  const mobileWrap = document.createElement('div');
  mobileWrap.className = 'filter-dropdown-wrap';

  const select = document.createElement('select');
  select.className = 'filter-dropdown';
  select.id = 'filterDropdown';
  select.setAttribute('aria-label', 'Filter by category');

  CATEGORIES.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.key;
    opt.textContent = cat.label;
    if (cat.key === 'all') opt.selected = true;
    select.appendChild(opt);
  });

  // Dropdown arrow decoration
  const arrow = document.createElement('span');
  arrow.className = 'filter-dropdown-arrow';
  arrow.textContent = '▾';

  select.addEventListener('change', () => setFilter(select.value));

  mobileWrap.appendChild(select);
  mobileWrap.appendChild(arrow);

  filterBar.appendChild(pillsContainer);
  filterBar.appendChild(mobileWrap);
}

function setFilter(key) {
  activeFilter = key;

  // Sync pills
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === key);
  });

  // Sync dropdown
  const dd = document.getElementById('filterDropdown');
  if (dd) dd.value = key;

  renderTemplates();
}


// ── TEMPLATE CARDS RENDERER ───────────────────────────────────

function getCategoryBadgeClass(category) {
  // Maps category key to CSS badge class — add more here if needed
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

function getCategoryLabel(key) {
  // Returns display label from CATEGORIES for a given key
  const cat = CATEGORIES.find(c => c.key === key);
  return cat ? cat.label : key;
}

function renderTemplates() {
  const grid = document.getElementById('templatesGrid');
  if (!grid || typeof TEMPLATES === 'undefined') return;

  // Filter by active category
  const filtered = activeFilter === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeFilter);

  grid.innerHTML = '';

  if (filtered.length === 0) {
    // Empty state
    grid.innerHTML = `
      <div class="no-results fade-in">
        <p style="font-size:2rem;">🥺</p>
        <p>No templates in this category yet — coming soon!</p>
      </div>`;
    return;
  }

  filtered.forEach((template, i) => {
    const card = document.createElement('div');
    card.className = 'template-card fade-in';
    card.style.transitionDelay = `${i * 0.07}s`;

    // Build thumbnail HTML
    // isNew badge overlaid on top-left of thumbnail when isNew: true
    const newBadgeHTML = template.isNew
      ? `<div class="card-new-badge">✨ NEW</div>`
      : '';

    const thumbHTML = template.thumbnail
      ? `<div class="card-thumb-wrap">
           <img class="card-thumb" src="${template.thumbnail}" alt="${template.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
           <div class="card-thumb-placeholder" style="display:none;">🎉</div>
           ${newBadgeHTML}
         </div>`
      : `<div class="card-thumb-wrap">
           <div class="card-thumb-placeholder">🎉</div>
           ${newBadgeHTML}
         </div>`;

    card.innerHTML = `
      ${thumbHTML}
      <div class="card-body">
        <span class="card-badge ${getCategoryBadgeClass(template.category)}">
          ${getCategoryLabel(template.category)}
        </span>
        <div class="card-name">${template.name}</div>
        <div class="card-tagline">${template.tagline}</div>
        <div class="card-footer">
          <div class="card-price-group">
            <div class="card-price">${template.price}</div>
            <div class="card-price-original">${template.originalPrice}</div>
            <div class="card-save-tag">${template.saveText}</div>
          </div>
          <div class="card-cta-btn">Customize →</div>
        </div>
      </div>
    `;

    // Click → go to product page with template ID in URL
    card.addEventListener('click', () => {
      window.location.href = `product.html?id=${template.id}`;
    });

    grid.appendChild(card);
  });

  // Trigger scroll observer on newly created cards
  observeFadeIns();
}


// ── SCROLL ANIMATIONS ─────────────────────────────────────────

function observeFadeIns() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // Check if already in viewport on load too
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
    // Immediately show if already visible
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) el.classList.add('visible');
  });
}


// ── STATS BAR ─────────────────────────────────────────────────

function renderStats() {
  const grid = document.getElementById('statsGrid');
  if (!grid || typeof STATS === 'undefined') return;

  STATS.forEach(stat => {
    const div = document.createElement('div');
    div.className = 'fade-in';
    div.innerHTML = `
      <div class="stat-value">${stat.value}</div>
      <div class="stat-label">${stat.label}</div>
    `;
    grid.appendChild(div);
  });
}



// ── HAMBURGER MENU ────────────────────────────────────────────
// Toggles mobile nav links open/close on hamburger click
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('mobile-open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('mobile-open'));
  });
}


// ── HOME PAGE FAQ ACCORDION ───────────────────────────────────
// Called onclick from .faq-q elements in index.html

function toggleHomeFaq(el) {
  const item = el.parentElement;
  document.querySelectorAll('.faq-item.open').forEach(other => {
    if (other !== item) other.classList.remove('open');
  });
  item.classList.toggle('open');
}

// ── INIT ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  initFilters();
  renderTemplates();
  renderStats();
  observeFadeIns();

  // Smooth scroll to templates on CTA click
  const exploreCta = document.getElementById('exploreCta');
  if (exploreCta) {
    exploreCta.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
});
