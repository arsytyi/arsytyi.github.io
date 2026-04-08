/* ========================================================
   Artem Sytyi — Portfolio  |  Main JS
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- PRELOADER ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 600);
  });

  /* ---------- NAVIGATION ---------- */
  const nav      = document.getElementById('nav');
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links    = navLinks.querySelectorAll('.nav__link');

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('active');
    });
  });

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* Active nav link on scroll */
  const sections = document.querySelectorAll('.section, .hero');
  const observerNav = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { rootMargin: '-40% 0px -60% 0px' });
  sections.forEach(s => observerNav.observe(s));

  /* ---------- PARTICLES ---------- */
  const particleContainer = document.getElementById('particles');
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 12 + 4;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 6 + 5}s;
      animation-delay: ${Math.random() * 4}s;
    `;
    particleContainer.appendChild(p);
  }

  /* ---------- SCROLL REVEAL ---------- */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const observerReveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('revealed'), +delay);
        observerReveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach(el => observerReveal.observe(el));

  /* ---------- SKILL BAR ANIMATION ---------- */
  const skillFills = document.querySelectorAll('.skill-card__fill');
  const observerSkills = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        target.style.setProperty('--target-width', target.dataset.width + '%');
        target.classList.add('animate');
        observerSkills.unobserve(target);
      }
    });
  }, { threshold: 0.3 });
  skillFills.forEach(el => observerSkills.observe(el));

  /* ---------- COUNTER ANIMATION ---------- */
  const counters = document.querySelectorAll('.about__stat-number');
  const observerCount = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const end = +el.dataset.count;
        let current = 0;
        const step = Math.ceil(end / 40);
        const timer = setInterval(() => {
          current += step;
          if (current >= end) { current = end; clearInterval(timer); }
          el.textContent = current;
        }, 40);
        observerCount.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observerCount.observe(el));

  /* ---------- BACK TO TOP ---------- */
  const backBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backBtn.classList.toggle('visible', window.scrollY > 600);
  });
  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- YEAR ---------- */
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  /* ---------- DYNAMIC PORTFOLIO LOADER ---------- */
  loadDynamicPortfolio();
});


/**
 * Scans the assets directories for portfolio items and renders them.
 * Place files in:
 *   assets/images/portfolio/  — thumbnail images (.jpg, .png, .webp)
 *   assets/pdfs/              — project PDFs
 *   assets/videos/            — project videos (.mp4, .webm)
 *
 * Naming convention for auto-matching:
 *   Use the same base filename across folders, e.g.:
 *     assets/images/portfolio/my-project.jpg
 *     assets/pdfs/my-project.pdf
 *
 * Manually placed items in index.html (loyalty-analysis, taskflow-unit-economics)
 * are excluded from dynamic loading to avoid duplicates.
 */
async function loadDynamicPortfolio() {
  const container = document.getElementById('portfolioDynamic');
  if (!container) return;

  const knownProjects = new Set([
    'loyalty-analysis',
    'taskflow-unit-economics',
    'Artem_Sytyi_CV'
  ]);

  const extensions = {
    images: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    pdfs:   ['pdf'],
    videos: ['mp4', 'webm']
  };

  const discovered = new Map();

  async function probeFile(url) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      return res.ok;
    } catch { return false; }
  }

  function baseName(filename) {
    return filename.replace(/\.[^.]+$/, '');
  }

  function titleFromName(name) {
    return name
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  async function scanFolder(folder, type, exts) {
    for (const ext of exts) {
      for (let i = 1; i <= 20; i++) {
        const patterns = [
          `project-${i}.${ext}`,
          `project${i}.${ext}`,
        ];
        for (const filename of patterns) {
          const url = `${folder}/${filename}`;
          if (await probeFile(url)) {
            const base = baseName(filename);
            if (knownProjects.has(base)) continue;
            if (!discovered.has(base)) discovered.set(base, {});
            discovered.get(base)[type] = url;
            discovered.get(base).name = titleFromName(base);
          }
        }
      }
    }
  }

  await Promise.all([
    scanFolder('assets/images/portfolio', 'image', extensions.images),
    scanFolder('assets/pdfs', 'pdf', extensions.pdfs),
    scanFolder('assets/videos', 'video', extensions.videos),
  ]);

  if (discovered.size === 0) return;

  let html = '<div class="portfolio__grid">';
  discovered.forEach((item, key) => {
    html += `
      <article class="project-card reveal-up">
        <div class="project-card__image">
          ${item.image
            ? `<img src="${item.image}" alt="${item.name}" />`
            : item.video
              ? `<video src="${item.video}" muted loop playsinline onmouseenter="this.play()" onmouseleave="this.pause()" style="width:100%;height:100%;object-fit:cover"></video>`
              : `<div class="project-card__fallback-icon" style="display:flex"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg></div>`
          }
          ${item.pdf ? `<div class="project-card__overlay"><a href="${item.pdf}" class="project-card__btn" target="_blank" rel="noopener">View PDF <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></div>` : ''}
        </div>
        <div class="project-card__body">
          <span class="project-card__tag">Project</span>
          <h3 class="project-card__title">${item.name}</h3>
        </div>
      </article>`;
  });
  html += '</div>';
  container.innerHTML = html;

  container.querySelectorAll('.reveal-up').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    obs.observe(el);
  });
}
