/* HORIZON LEGACY — Luxury Safaris & Bespoke Travel
   Page interactions: navigation, finder, itinerary sheet, destination map,
   safari curator, FAQ search, progress. */

document.addEventListener('DOMContentLoaded', () => {
  headerShadow();
  mobileNav();
  navDropdowns();
  whenToGo();
  revealOnScroll();
  enquiryForm();
  newsletter();
  scrollProgress();
  initImages();
  initHero();
  initJourneys();
  initMap();
  faqSearch();
  initCurator();
  document.getElementById('year').textContent = new Date().getFullYear();
});


/* --------------------------------------------------------------------------
   NAVIGATION
   -------------------------------------------------------------------------- */
function headerShadow() {
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

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
    if (!e.target.closest('.nav__item')) items.forEach((i) => i.classList.remove('is-open'));
  });
}

/* swap a deferred image's data-src / data-srcset into live attributes */
function loadImage(img) {
  if (!img || !img.dataset.src) return;
  if (img.dataset.srcset) img.srcset = img.dataset.srcset;
  img.src = img.dataset.src;
  delete img.dataset.src;
  delete img.dataset.srcset;
}

/* every image below the hero carries data-src instead of src, so a phone
   opens on the logo and first hero frame (~90 KB) rather than the whole
   page (~840 KB). Each is fetched once it comes within 200px of the view. */
function initImages() {
  const pending = Array.from(document.querySelectorAll('img[data-src]:not(.hero__img)'));
  if (!pending.length) return;

  if (!('IntersectionObserver' in window)) {
    pending.forEach(loadImage);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadImage(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '200px 0px' }
  );

  pending.forEach((img) => observer.observe(img));
}

/* hero rotator: three scenes, fading every 6.5s. Later scenes are only
   fetched once the first paint is done, so the phone stays light. */
function initHero() {
  const slides = Array.from(document.querySelectorAll('.hero__img'));
  const dots = Array.from(document.querySelectorAll('.hero__dot'));
  if (slides.length < 2) return;

  let index = 0;
  let timer = null;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const go = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    loadImage(slides[index]);
    if (!reduce) loadImage(slides[(index + 1) % slides.length]);
  };

  const start = () => {
    window.clearInterval(timer);
    if (!reduce) timer = window.setInterval(() => go(index + 1), 6500);
  };

  dots.forEach((dot, i) =>
    dot.addEventListener('click', () => {
      go(i);
      start();
    })
  );

  const arm = () => {
    if (!reduce) slides.slice(1).forEach(loadImage);
    start();
  };

  if (document.readyState === 'complete') window.setTimeout(arm, 900);
  else window.addEventListener('load', () => window.setTimeout(arm, 900), { once: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) window.clearInterval(timer);
    else start();
  });
}

function scrollProgress() {
  const bar = document.getElementById('progress');
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = pct + '%';
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* --------------------------------------------------------------------------
   WHEN TO GO
   -------------------------------------------------------------------------- */
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

/* --------------------------------------------------------------------------
   JOURNEY DATA
   -------------------------------------------------------------------------- */
const JOURNEYS = [
  {
    title: 'Legends of Africa, the Pyramids to Victoria Falls',
    eyebrow: 'By private jet · 16 days',
    country: ['kenya'],
    nights: 15,
    price: 42000,
    tier: 'ultra',
    img: 'assets/images/nile',
    priceNote: 'Starting from USD 42,000 per person',
    days: [
      ['Days 1–2', 'Giza and Cairo — the pyramids, the museum, a private guide throughout.'],
      ['Days 3–6', 'Four nights on the Nile between Luxor and Aswan.'],
      ['Days 7–10', 'Maasai Mara — conservancy camps, balloon at dawn, the migration if in season.'],
      ['Days 11–13', 'Victoria Falls — the river, the rainforest walk, a sunset on the Zambezi.'],
      ['Days 14–16', 'Cape Town and home, with no commercial gate between Cairo and Johannesburg.'],
    ],
  },
  {
    title: 'Gorillas, the Crater, the Serengeti and the Maasai Mara',
    eyebrow: 'Rwanda · Tanzania · Kenya · 14 days',
    country: ['rwanda', 'tanzania', 'kenya'],
    nights: 13,
    price: 24650,
    tier: 'ultra',
    img: 'assets/images/gorilla',
    priceNote: 'Starting from USD 24,650 per person',
    days: [
      ['Days 1–2', 'Kigali and the road to Volcanoes National Park.'],
      ['Days 3–5', 'Gorilla trekking, permit included, with a second forest morning.'],
      ['Days 6–8', 'Ngorongoro Crater — the rim, the floor, the big tuskers.'],
      ['Days 9–11', 'Serengeti — private concession, night drives, walking.'],
      ['Days 12–14', 'Maasai Mara, then home from Nairobi.'],
    ],
  },
  {
    title: '8 Day Ultra Luxury Maasai Mara Safari',
    eyebrow: 'Angama Mara · Mara Plains Camp · 8 days',
    country: ['kenya'],
    nights: 8,
    price: 15150,
    tier: 'ultra',
    img: 'assets/images/mara-camp',
    priceNote: 'Low season from USD 15,150 per person',
    days: [
      ['Day 1', 'Nairobi — met at the airport, overnight before the bush.'],
      ['Days 2–5', 'Angama Mara above the Mara Triangle, with the complimentary fourth night.'],
      ['Days 6–8', 'Mara Plains Camp in the Olare Motorogi Conservancy — off-road, night drives.'],
    ],
  },
  {
    title: '9 Day Ultra Luxury Maasai Mara & Serengeti Safari',
    eyebrow: 'Two private reserves · 9 days',
    country: ['kenya', 'tanzania'],
    nights: 9,
    price: 23600,
    tier: 'ultra',
    img: 'assets/images/serengeti',
    priceNote: 'Low season from USD 23,600 per person',
    days: [
      ['Day 1', 'Nairobi arrival and overnight.'],
      ['Days 2–5', 'Mara Plains Camp — conservancy game, walking, the river.'],
      ['Day 6', 'Border crossing handled, then into the Grumeti Reserve.'],
      ['Days 7–9', 'Singita Sasakwa on the escarpment, with the plains below.'],
    ],
  },
  {
    title: 'The Ultimate East Africa Luxury Safari',
    eyebrow: 'Small group · 6 to 12 guests · 12 days',
    country: ['rwanda', 'kenya', 'tanzania'],
    nights: 11,
    price: 46200,
    tier: 'ultra',
    img: 'assets/images/group',
    priceNote: 'Starting from USD 46,200 per person',
    days: [
      ['Days 1–3', 'Kigali and Volcanoes National Park — gorilla trekking with permits.'],
      ['Days 4–7', 'Maasai Mara — one camp, one guide, no repacking.'],
      ['Days 8–11', 'Serengeti and the Ngorongoro Crater.'],
      ['Day 12', 'Fly out from Kilimanjaro or Nairobi.'],
    ],
  },
  {
    title: '12 Day Ultra Luxury Kenya & Tanzania Safari',
    eyebrow: 'Green season · save USD 13,500 · 12 days',
    country: ['kenya', 'tanzania'],
    nights: 11,
    price: 19400,
    tier: 'signature',
    img: 'assets/images/crater',
    priceNote: 'Green season from USD 19,400 per person',
    days: [
      ['Days 1–3', 'Amboseli — elephant herds beneath Kilimanjaro.'],
      ['Days 4–7', 'Maasai Mara — private conservancy.'],
      ['Days 8–10', 'Serengeti — the plains by season.'],
      ['Days 11–12', 'Ngorongoro Crater, then home.'],
    ],
  },
  {
    title: '9 Day Luxury Kenya Safari',
    eyebrow: 'Best seller · fly in · 9 days',
    country: ['kenya'],
    nights: 8,
    price: 16450,
    tier: 'signature',
    img: 'assets/images/amboseli',
    priceNote: 'Starting from USD 16,450 per person',
    days: [
      ['Days 1–3', 'Amboseli and the tuskers.'],
      ['Days 4–7', 'Maasai Mara — four nights instead of two.'],
      ['Days 8–9', 'Laikipia, then Nairobi and home.'],
    ],
  },
  {
    title: '8 Day Great Migration Safari',
    eyebrow: 'Kenya & Tanzania · July to October',
    country: ['kenya', 'tanzania'],
    nights: 7,
    price: 16750,
    tier: 'signature',
    img: 'assets/images/migration',
    priceNote: 'Starting from USD 16,750 per person',
    days: [
      ['Days 1–3', 'Northern Serengeti — river crossing camps.'],
      ['Day 4', 'Cross into Kenya, with the paperwork handled.'],
      ['Days 5–8', 'Maasai Mara — the herds, the cats, the balloon at dawn.'],
    ],
  },
  {
    title: 'Private Villa Family Safari',
    eyebrow: 'Exclusive use · 7 days',
    country: ['kenya'],
    nights: 6,
    price: 38450,
    tier: 'villa',
    img: 'assets/images/family',
    priceNote: 'Starting from USD 38,450 per family',
    days: [
      ['Days 1–2', 'Nairobi — Hemingways, the giraffe centre, early nights.'],
      ['Days 3–6', 'Ishara Mara private villa: two suites, a pool, childminding.'],
      ['Day 7', 'Fly back to Nairobi and home.'],
    ],
  },
  {
    title: '8 Day Tanzania Grand Circuit',
    eyebrow: 'Three private concessions · 8 days',
    country: ['tanzania'],
    nights: 7,
    price: 30100,
    tier: 'ultra',
    img: 'assets/images/kopje',
    priceNote: 'Starting from USD 30,100 per person',
    days: [
      ['Days 1–2', 'Ngorongoro Crater rim.'],
      ['Days 3–5', 'Grumeti — private reserve, river, big cats.'],
      ['Days 6–8', 'Mwiba among the granite kopjes of the southern Serengeti.'],
    ],
  },
  {
    title: '7 Day Mnemba Island Luxury Beach Safari',
    eyebrow: 'Private island · Zanzibar · 7 days',
    country: ['zanzibar', 'islands'],
    nights: 6,
    price: 12125,
    tier: 'signature',
    img: 'assets/images/island',
    priceNote: 'Starting from USD 12,125 per person',
    days: [
      ['Day 1', 'Arrive Zanzibar and transfer to the atoll.'],
      ['Days 2–6', 'Mnemba Island — twelve bandas, diving, dhow sailing, nothing scheduled.'],
      ['Day 7', 'Back to Stone Town and home.'],
    ],
  },
];

const INCLUDES = [
  'Private guide and vehicle throughout',
  'All camps, lodges and park fees',
  'Internal flights and road transfers',
  'Meals and game activities as each camp includes',
  'One named designer, from first call to last transfer',
];

/* --------------------------------------------------------------------------
   JOURNEY FINDER + ITINERARY SHEET
   -------------------------------------------------------------------------- */
function initJourneys() {
  const cards = Array.from(document.querySelectorAll('#journeys .cards .card'));
  const country = document.getElementById('fCountry');
  const nights = document.getElementById('fNights');
  const budget = document.getElementById('fBudget');
  const tier = document.getElementById('fTier');
  const count = document.getElementById('finderCount');
  const empty = document.getElementById('finderEmpty');
  const reset = document.getElementById('finderReset');

  cards.forEach((card, i) => {
    const data = JOURNEYS[i];
    card.dataset.country = data.country.join(' ');
    card.dataset.nights = data.nights;
    card.dataset.price = data.price;
    card.dataset.tier = data.tier;
    card.dataset.index = i;

    const foot = card.querySelector('.card__foot');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card__details';
    btn.textContent = 'View itinerary';
    btn.addEventListener('click', () => openSheet(i));
    foot.insertBefore(btn, foot.lastElementChild);
  });

  const apply = () => {
    const c = country.value;
    const n = nights.value;
    const b = budget.value;
    const t = tier.value;
    let shown = 0;

    cards.forEach((card) => {
      const tags = card.dataset.country.split(' ');
      const nightCount = Number(card.dataset.nights);
      const price = Number(card.dataset.price);

      const countryOk = c === 'all' || tags.includes(c);
      const nightOk =
        n === 'all' ||
        (n === 'short' && nightCount <= 7) ||
        (n === 'mid' && nightCount >= 8 && nightCount <= 10) ||
        (n === 'long' && nightCount >= 11);
      const budgetOk =
        b === 'all' ||
        (b === 'low' && price < 20000) ||
        (b === 'mid' && price >= 20000 && price < 35000) ||
        (b === 'high' && price >= 35000);
      const tierOk = t === 'all' || card.dataset.tier === t;

      const show = countryOk && nightOk && budgetOk && tierOk;
      card.classList.toggle('is-hidden', !show);
      if (show) shown++;
    });

    count.textContent = shown;
    empty.hidden = shown !== 0;
  };

  [country, nights, budget, tier].forEach((el) => el.addEventListener('change', apply));
  reset.addEventListener('click', () => {
    [country, nights, budget, tier].forEach((el) => (el.value = 'all'));
    apply();
  });

  /* itinerary sheet */
  const sheet = document.getElementById('sheet');
  const img = document.getElementById('sheetImg');
  const eyebrow = document.getElementById('sheetEyebrow');
  const title = document.getElementById('sheetTitle');
  const price = document.getElementById('sheetPrice');
  const days = document.getElementById('sheetDays');
  const includes = document.getElementById('sheetIncludes');
  const enquire = document.getElementById('sheetEnquire');

  function closeSheet() {
    sheet.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function openSheet(i) {
    const d = JOURNEYS[i];
    const base = d.img;
    img.src = base + '-960.webp';
    img.srcset =
      base + '-480.webp 480w, ' + base + '-720.webp 720w, ' + base + '-960.webp 960w';
    img.sizes = '(min-width:520px) 520px, 100vw';
    img.alt = d.title;
    eyebrow.textContent = d.eyebrow;
    title.textContent = d.title;
    price.innerHTML = '<span>Rate</span>' + d.priceNote;

    days.innerHTML = d.days
      .map(([range, text]) => `<li><b>${range}</b><span>${text}</span></li>`)
      .join('');

    includes.innerHTML = INCLUDES.map((x) => `<li>${x}</li>`).join('');
    enquire.href =
      'mailto:horizonlegacy.safaris@gmail.com?subject=' +
      encodeURIComponent('Enquiry — ' + d.title);

    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    sheet.querySelector('.sheet__close').focus();
  }

  sheet.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeSheet));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sheet.classList.contains('is-open')) closeSheet();
  });
}

/* --------------------------------------------------------------------------
   DESTINATION MAP
   -------------------------------------------------------------------------- */
const PLACES = {
  kenya: {
    name: 'Kenya',
    months: 'Jul–Oct for the migration · Jan–Feb for clear skies',
    from: 'USD 7,500 per person',
    regions: 'Maasai Mara · Amboseli · Laikipia · Samburu · Tsavo · the coast',
    note: 'Our home country, and the easiest place to begin. Mara and Amboseli are a short flight apart.',
  },
  tanzania: {
    name: 'Tanzania',
    months: 'Dec–Mar for the calving · Jul–Oct for the crossings',
    from: 'USD 9,000 per person',
    regions: 'Serengeti · Ngorongoro Crater · Tarangire · Grumeti · Mwiba',
    note: 'The crater in a single morning, the Serengeti by season, and the southern plains when the herds calve.',
  },
  rwanda: {
    name: 'Rwanda',
    months: 'Jun–Sep · Dec–Feb',
    from: 'USD 21,950 per person',
    regions: 'Volcanoes National Park · Nyungwe · Akagera',
    note: 'Mountain gorillas two hours from Kigali, with permits secured the moment you confirm.',
  },
  uganda: {
    name: 'Uganda',
    months: 'Jun–Sep · Dec–Feb',
    from: 'USD 8,750 per person',
    regions: 'Bwindi Impenetrable Forest · Kibale · Queen Elizabeth',
    note: 'Gorillas in Bwindi and chimpanzees in Kibale, for travellers who want the forest without the crowd.',
  },
  zanzibar: {
    name: 'Zanzibar',
    months: 'Jun–Oct · Dec–Feb',
    from: 'USD 12,125 per person',
    regions: 'Mnemba Island · Nungwi and Kendwa · Stone Town',
    note: 'The beach finish. A short flight from the Mara, and the right way round after a week of early starts.',
  },
  seychelles: {
    name: 'The Seychelles',
    months: 'Apr–May · Oct–Nov',
    from: 'USD 12,250 per person',
    regions: 'Mahé · Praslin · La Digue · private island resorts',
    note: 'Granite, quiet water and no safari dust. The longer flight, and the reward for taking it.',
  },
  mauritius: {
    name: 'Mauritius',
    months: 'May to December',
    from: 'USD 12,250 per person',
    regions: 'The north coast · Belle Mare · Le Morne',
    note: 'Malaria free, resort led and easy with toddlers — often paired with a short Kenyan safari.',
  },
};

function initMap() {
  const pins = document.querySelectorAll('.map__pin');
  const title = document.querySelector('.map__title');
  const body = document.querySelector('.map__body');
  const facts = document.getElementById('mapFacts');
  if (!pins.length) return;

  pins.forEach((pin) => {
    pin.addEventListener('click', () => {
      const p = PLACES[pin.dataset.place];
      if (!p) return;
      pins.forEach((x) => x.classList.remove('is-active'));
      pin.classList.add('is-active');
      title.textContent = p.name;
      body.textContent = p.note;
      facts.innerHTML = `
        <div><dt>Best months</dt><dd>${p.months}</dd></div>
        <div><dt>Journeys from</dt><dd>${p.from}</dd></div>
        <div><dt>Where to go</dt><dd>${p.regions}</dd></div>`;
    });
  });
}

/* --------------------------------------------------------------------------
   FAQ SEARCH
   -------------------------------------------------------------------------- */
function faqSearch() {
  const input = document.getElementById('faqSearch');
  const counter = document.getElementById('faqCount');
  if (!input) return;
  const items = Array.from(document.querySelectorAll('#faq .acc'));

  const run = () => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;

    items.forEach((item) => {
      const match = !q || item.textContent.toLowerCase().includes(q);
      item.classList.toggle('is-hidden', !match);
      if (match) shown++;
      if (q && match) item.open = true;
      if (!q) item.open = false;
    });

    if (!q) items[0].open = true;
    counter.textContent = q ? `${shown} of ${items.length}` : `${items.length} questions`;
  };

  input.addEventListener('input', run);
  run();
}

/* --------------------------------------------------------------------------
   SAFARI CURATOR
   -------------------------------------------------------------------------- */
const WHERE_META = {
  kenya: { label: 'Kenya' },
  tanzania: { label: 'Tanzania' },
  rwanda: { label: 'Rwanda' },
  zanzibar: { label: 'Zanzibar' },
  combo: { label: 'Kenya, Tanzania and Zanzibar' },
  open: { label: "Designer's choice" },
};
const SEASON_LABEL = {
  4: 'green season',
  5: 'green season',
  7: 'peak season',
  8: 'peak season',
  9: 'peak season',
  10: 'peak season',
  11: 'green season',
  12: 'peak season',
};
const WHO_LABEL = {
  couple: 'Two of us',
  honeymoon: 'Honeymoon',
  family: 'Family with children',
  multigen: 'Three generations',
  friends: 'A group of friends',
  solo: 'Travelling solo',
};
const TIER_LABEL = { signature: 'Signature luxury', ultra: 'Ultra luxury', villa: 'Exclusive-use villa' };
const MONTH_NAME = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const state = { who: 'couple', where: 'kenya', nights: 7, tier: 'signature', month: 7, extras: [], guests: 2 };

function initCurator() {
  const steps = Array.from(document.querySelectorAll('.cstep'));
  const dots = Array.from(document.querySelectorAll('.cdot'));
  const label = document.getElementById('cLabel');
  const back = document.getElementById('cBack');
  const next = document.getElementById('cNext');
  const guests = document.getElementById('cGuests');
  if (!steps.length) return;

  let step = 1;

  document.querySelectorAll('.chips').forEach((group) => {
    const field = group.dataset.field;
    const multi = group.dataset.multi === 'true';

    group.querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const value = chip.dataset.value;

        if (multi) {
          chip.classList.toggle('is-selected');
          const on = chip.classList.contains('is-selected');
          state.extras = state.extras.filter((x) => x !== value);
          if (on) state.extras.push(value);
        } else {
          group.querySelectorAll('.chip').forEach((c) => c.classList.remove('is-selected'));
          chip.classList.add('is-selected');
          if (field === 'nights' || field === 'month') state[field] = Number(value);
          else state[field] = value;
        }

        if (field === 'where' && value === 'open') shuffle();
        render();
      });
    });
  });

  guests.addEventListener('input', () => {
    const n = Math.max(1, Math.min(12, Number(guests.value) || 1));
    state.guests = n;
    render();
  });

  function show(n) {
    step = Math.max(1, Math.min(6, n));
    steps.forEach((s) => s.classList.toggle('is-active', Number(s.dataset.step) === step));
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i + 1 === step);
      d.classList.toggle('is-done', i + 1 < step);
    });
    label.textContent = step === 6 ? 'Your sketch' : `Step ${step} of 5`;
    back.disabled = step === 1;
    next.style.display = step === 6 ? 'none' : 'inline-flex';
    next.innerHTML = step === 5 ? 'See my journey <span class="arrow">→</span>' : 'Continue <span class="arrow">→</span>';
    if (step === 6) buildResult();
  }

  dots.forEach((d, i) => d.addEventListener('click', () => show(i + 1)));
  next.addEventListener('click', () => show(step + 1));
  back.addEventListener('click', () => show(step - 1));

  document.getElementById('cAgain').addEventListener('click', () => {
    state.extras = [];
    document.querySelectorAll('.chips[data-multi] .chip').forEach((c) => c.classList.remove('is-selected'));
    show(1);
  });

  function shuffle() {
    const wheres = ['kenya', 'tanzania', 'rwanda', 'combo'];
    const nights = [6, 7, 9, 11];
    const tiers = ['signature', 'ultra'];
    state.where = wheres[Math.floor(Math.random() * wheres.length)];
    state.nights = nights[Math.floor(Math.random() * nights.length)];
    state.tier = tiers[Math.floor(Math.random() * tiers.length)];
    state.month = 1 + Math.floor(Math.random() * 12);

    syncChips('where', String(state.where));
    syncChips('nights', String(state.nights));
    syncChips('tier', state.tier);
    syncChips('month', String(state.month));
  }

  function syncChips(field, value) {
    const group = document.querySelector(`.chips[data-field="${field}"]`);
    if (!group) return;
    group.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-selected', c.dataset.value === value));
  }

  render();
  show(1);
}

function computeJourney() {
  const beach = state.extras.includes('beach');
  return {
    nights: state.nights + (beach ? 4 : 0),
    guests: state.guests,
    seasonLabel: SEASON_LABEL[state.month] || '',
  };
}

function itineraryStops() {
  const n = state.nights;
  const stops = [];
  const push = (name, nights, note) => stops.push({ name, nights, note });

  if (state.where === 'kenya') {
    if (n <= 5) {
      push('Maasai Mara', n, 'One camp, no repacking, two game drives a day.');
    } else {
      const m = Math.ceil(n * 0.6);
      push('Maasai Mara', m, 'Private conservancy — off-road driving and night drives.');
      push('Amboseli', n - m, 'Elephant herds beneath Kilimanjaro.');
    }
  } else if (state.where === 'tanzania') {
    if (n <= 5) {
      push('Serengeti', n, 'A single camp in the path of the herds.');
    } else {
      const s = Math.ceil(n * 0.55);
      const c = Math.ceil(n * 0.3);
      push('Serengeti', s, 'Seasonal camp chosen for where the herds will be.');
      push('Ngorongoro Crater', c, 'The rim, then a full morning on the crater floor.');
      if (n - s - c > 0) push('Tarangire', n - s - c, 'Baobabs and elephant families.');
    }
  } else if (state.where === 'rwanda') {
    const kigali = 1;
    const volcanoes = Math.max(2, Math.ceil((n - kigali) * 0.65));
    push('Kigali', kigali, 'Arrival, the Genocide Memorial, an early night.');
    push('Volcanoes National Park', volcanoes, 'Gorilla trekking with permits included.');
    if (n - kigali - volcanoes > 0) push('Akagera', n - kigali - volcanoes, 'Big Five country on the eastern plains.');
  } else if (state.where === 'zanzibar') {
    if (n >= 5) push('Stone Town', 1, 'The old town, spice route and the harbour.');
    push(n >= 5 ? 'North east coast' : 'The island', n >= 5 ? n - 1 : n, 'Beach, dhow sailing and nothing scheduled.');
  } else if (state.where === 'combo') {
    const mara = Math.max(3, Math.ceil(n * 0.4));
    const serengeti = Math.max(2, Math.ceil(n * 0.32));
    push('Maasai Mara', mara, 'Kenya first, while everyone has energy for five o\'clock starts.');
    push('Serengeti', serengeti, 'Across the border, with the paperwork handled.');
    push('Zanzibar', Math.max(2, n - mara - serengeti), 'The beach finish, flown in one hop.');
  } else {
    const m = Math.max(3, Math.ceil(n * 0.55));
    push('Maasai Mara', m, 'Our pick when you cannot decide: the Mara in season.');
    push('Indian Ocean', n - m, 'Four nights of doing nothing at all.');
  }

  if (state.extras.includes('beach') && state.where !== 'zanzibar' && state.where !== 'combo') {
    push('Zanzibar', 4, 'Beach finish added — four nights on the Indian Ocean.');
  }
  return stops;
}

function buildResult() {
  const calc = computeJourney();
  const stops = itineraryStops();

  document.getElementById('rTotal').textContent = `${calc.nights} nights`;
  document.getElementById('rPer').textContent =
    `${calc.guests} travelling · ${MONTH_NAME[state.month - 1]}` +
    (calc.seasonLabel ? ` · ${calc.seasonLabel}` : '') +
    ' · quotation on request';

  const daysEl = document.getElementById('rDays');
  let day = 1;
  daysEl.innerHTML = stops
    .map((s) => {
      const from = day;
      const to = day + s.nights - 1;
      day = to + 1;
      const label = s.nights === 1 ? `Day ${from}` : `Days ${from}–${to}`;
      return `<li><b>${label}</b><span>${s.name}<span>${s.note}</span></span></li>`;
    })
    .join('');

  const summary =
    `Safari sketch — ${WHO_LABEL[state.who]}, ${calc.guests} travelling\n` +
    `Where: ${WHERE_META[state.where].label}\n` +
    `Nights: ${calc.nights}\n` +
    `Style: ${TIER_LABEL[state.tier]}\n` +
    `Month: ${MONTH_NAME[state.month - 1]}\n` +
    `Extras: ${state.extras.length ? state.extras.join(', ') : 'none'}\n` +
    `Itinerary: ${stops.map((s) => `${s.name} (${s.nights}n)`).join(' → ')}\n` +
    'Please send me a quotation for this journey.';

  document.getElementById('rWhats').href = 'https://wa.me/254791038070?text=' + encodeURIComponent(summary);
  document.getElementById('rMail').href =
    'mailto:horizonlegacy.safaris@gmail.com?subject=' +
    encodeURIComponent('Safari sketch — ' + WHERE_META[state.where].label) +
    '&body=' +
    encodeURIComponent(summary);
}

function render() {
  const calc = computeJourney();
  const extras = state.extras.length
    ? state.extras.map((e) => ({ balloon: 'Sunrise balloon', gorilla: 'Gorilla permit', beach: 'Beach finish' }[e])).join(', ')
    : 'None';

  const rows = [
    ['Travelling', WHO_LABEL[state.who] + ` · ${state.guests}`],
    ['Where', WHERE_META[state.where].label],
    ['Nights', String(calc.nights)],
    ['Style', TIER_LABEL[state.tier]],
    ['When', MONTH_NAME[state.month - 1]],
    ['Extras', extras],
  ];

  document.getElementById('cSummary').innerHTML = rows
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
    .join('');
  document.getElementById('cSumPrice').textContent = `${calc.nights} nights`;
}

/* --------------------------------------------------------------------------
   REVEAL, FORMS
   -------------------------------------------------------------------------- */
function revealOnScroll() {
  const targets = document.querySelectorAll(
    '.card, .dest, .review, .post, .steps li, .why__item, .story__media, .story__copy, .style-card, .curator__panel, .curator__summary, .map, .finder'
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
      `mailto:horizonlegacy.safaris@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  form.addEventListener('input', (e) => e.target.classList.remove('is-invalid'));
}

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
