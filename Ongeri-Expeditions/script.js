/* HORIZON LEGACY — Luxury Safaris & Bespoke Travel — page interactions */
document.addEventListener('DOMContentLoaded', () => {
  headerShadow();
  mobileNav();
  navDropdowns();
  whenToGo();
  revealOnScroll();
  enquiryForm();
  newsletter();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* sticky header shadow */
function headerShadow() {
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* mobile menu */
function mobileNav() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const close = () => {
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* desktop hover menus + mobile tap-to-open */
function navDropdowns() {
  const items = document.querySelectorAll('.nav__item.has-menu');

  items.forEach((item) => {
    const btn = item.querySelector('.nav__link');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const open = !item.classList.contains('is-open');
      items.forEach((i) => i.classList.remove('is-open'));
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav__item')) {
      items.forEach((i) => i.classList.remove('is-open'));
    }
  });
}

/* month selector */
function whenToGo() {
  const wrap = document.getElementById('months');
  const note = document.getElementById('whenNote');
  if (!wrap || !note) return;
  const buttons = wrap.querySelectorAll('.month');

  buttons.forEach((btn) => {
    const show = () => {
      buttons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      note.textContent = `${btn.dataset.temp} — ${btn.dataset.note}`;
    };
    btn.addEventListener('mouseenter', show);
    btn.addEventListener('focus', show);
    btn.addEventListener('click', show);
  });
}

/* subtle reveal */
function revealOnScroll() {
  const targets = document.querySelectorAll(
    '.card, .dest, .review, .post, .steps li, .why__item, .story__media, .story__copy'
  );
  if (!('IntersectionObserver' in window)) return;

  targets.forEach((el) => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

  targets.forEach((el) => io.observe(el));
}

/* enquiry form → opens a prepared email */
function enquiryForm() {
  const form = document.getElementById('enquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').trim();
    const email = (data.get('email') || '').trim();

    let valid = true;
    form.querySelectorAll('[required]').forEach((field) => {
      const ok = field.value.trim() !== '' && (field.type !== 'email' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(field.value));
      field.classList.toggle('is-invalid', !ok);
      if (!ok) valid = false;
    });
    if (!valid) return;

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Destination: ${data.get('destination')}`,
      `Guests: ${data.get('guests')}`,
      `Travel month: ${data.get('when') || 'flexible'}`,
      `Journey: ${data.get('journey')}`,
      '',
      'Notes:',
      data.get('notes') || '—',
    ].join('\n');

    const subject = `New safari enquiry — ${data.get('journey')}`;
    window.location.href =
      `mailto:holidays@horizonlegacysafaris.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  form.addEventListener('input', (e) => e.target.classList.remove('is-invalid'));
}

/* newsletter */
function newsletter() {
  const form = document.getElementById('newsForm');
  const msg = document.getElementById('newsMsg');
  if (!form || !msg) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)) {
      msg.textContent = 'Please enter a valid email address.';
      return;
    }
    msg.textContent = 'Thank you — you are on the list.';
    form.reset();
  });
}
