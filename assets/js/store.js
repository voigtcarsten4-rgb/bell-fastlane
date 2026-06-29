/* =====================================================================
   BELL FASTLANE — Shared Store (Demo)
   localStorage als Demo-"Datenbank", Cross-Tab-Sync, Produktkatalog,
   Event-Modi, Bestell-/Status-/Chat-Logik.
   KEINE echte Zahlung · KEINE echten Kundendaten.
   ===================================================================== */
(function (global) {
  'use strict';

  const KEYS = {
    orders:   'bellfl_orders_v1',
    settings: 'bellfl_settings_v1',
    seq:      'bellfl_seq_v1',
    seeded:   'bellfl_seeded_v1'
  };

  /* ---------- Status flow ---------- */
  const STATUS = ['received', 'prep', 'grill', 'almost', 'ready', 'done'];
  const STATUS_LABEL = {
    received: 'Bestellung eingegangen',
    prep:     'In Vorbereitung',
    grill:    'Auf dem Grill',
    almost:   'Fast fertig',
    ready:    'Abholbereit',
    done:     'Abgeschlossen'
  };
  const STATUS_SHORT = {
    received: 'Eingegangen', prep: 'In Vorbereitung', grill: 'Auf dem Grill',
    almost: 'Fast fertig', ready: 'Abholbereit', done: 'Abgeschlossen'
  };

  /* ---------- Product artwork (eigene SVGs, keine Fremdbilder) ---------- */
  function art(id) {
    const bg = (c1, c2) => `<defs><radialGradient id="g_${id}" cx="50%" cy="30%" r="80%"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></radialGradient></defs><rect width="96" height="96" rx="14" fill="url(#g_${id})"/>`;
    const A = {
      kloepfer: `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">${bg('#FFE7D2','#FFD0A8')}
        <ellipse cx="48" cy="62" rx="34" ry="13" fill="#E8B57E"/><ellipse cx="48" cy="59" rx="34" ry="12" fill="#F6CE97"/>
        <path d="M16 56 q32 -20 64 0 q-32 8 -64 0Z" fill="#C8722E"/>
        <rect x="18" y="40" width="60" height="17" rx="8.5" fill="#9B3F1E"/>
        <rect x="18" y="38" width="60" height="15" rx="7.5" fill="#B8542A"/>
        <path d="M27 45h6M40 45h6M53 45h6M66 45h6" stroke="#7C2E14" stroke-width="3" stroke-linecap="round" opacity=".6"/></svg>`,
      joggeli: `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">${bg('#FFE7D2','#FFCB9E')}
        <rect x="14" y="40" width="68" height="15" rx="7.5" fill="#C46A38" transform="rotate(-7 48 47)"/>
        <rect x="14" y="38" width="68" height="13" rx="6.5" fill="#DA8551" transform="rotate(-7 48 47)"/>
        <rect x="14" y="52" width="68" height="15" rx="7.5" fill="#B85C2E" transform="rotate(7 48 59)"/>
        <rect x="14" y="50" width="68" height="13" rx="6.5" fill="#D27B47" transform="rotate(7 48 59)"/></svg>`,
      kalbsbratwurst: `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">${bg('#FFEEDD','#FFD9B3')}
        <ellipse cx="48" cy="64" rx="35" ry="12" fill="#E3B27C"/><ellipse cx="48" cy="61" rx="35" ry="11" fill="#F3CB97"/>
        <rect x="16" y="38" width="64" height="21" rx="10.5" fill="#D9B98C"/>
        <rect x="16" y="36" width="64" height="19" rx="9.5" fill="#EAD3A9"/>
        <path d="M24 45.5h48M24 50h48" stroke="#C9A877" stroke-width="2.4" stroke-linecap="round" opacity=".7"/></svg>`,
      schnitzelbrot: `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">${bg('#FFEAD6','#FFCFA6')}
        <path d="M20 58 q28 -16 56 0 l-4 8 q-24 8 -48 0Z" fill="#CE8444"/>
        <path d="M20 56 q28 -16 56 0 q-28 6 -56 0Z" fill="#E7A85F"/>
        <path d="M22 50 q26 -10 52 0 q-26 7 -52 0Z" fill="#B9742F"/>
        <path d="M30 47 q18 -8 36 0 q-18 6 -36 0Z" fill="#7FA84B"/>
        <ellipse cx="48" cy="44" rx="20" ry="7" fill="#D9A24A"/>
        <path d="M30 44 q18 -7 36 0" stroke="#A86A2B" stroke-width="2" fill="none" opacity=".5"/></svg>`,
      sandwich: `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">${bg('#FFF0DC','#FFD9AE')}
        <path d="M24 30 L72 30 L66 40 L30 40Z" fill="#E7A85F"/>
        <rect x="26" y="40" width="44" height="6" fill="#F4D7A0"/>
        <rect x="26" y="46" width="44" height="5" fill="#8FB85A"/>
        <rect x="26" y="51" width="44" height="6" fill="#C7553B"/>
        <rect x="26" y="57" width="44" height="5" fill="#F4D7A0"/>
        <path d="M26 62 L70 62 L62 70 L34 70Z" fill="#E7A85F"/></svg>`,
      wasser: `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">${bg('#DCF1FB','#B6E0F5')}
        <rect x="36" y="20" width="24" height="10" rx="3" fill="#9FC9DE"/>
        <path d="M34 32 q14 -6 28 0 v34 a8 8 0 0 1 -8 8 H42 a8 8 0 0 1 -8 -8Z" fill="#CDEAF7"/>
        <path d="M34 50 q14 -6 28 0 v16 a8 8 0 0 1 -8 8 H42 a8 8 0 0 1 -8 -8Z" fill="#7FC3E6"/>
        <circle cx="44" cy="58" r="2.4" fill="#fff" opacity=".8"/><circle cx="52" cy="64" r="1.8" fill="#fff" opacity=".8"/><circle cx="48" cy="52" r="1.5" fill="#fff" opacity=".8"/></svg>`,
      cola: `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">${bg('#FBE0DE','#F4C0BC')}
        <rect x="46" y="14" width="5" height="40" rx="2.5" fill="#E2001A" transform="rotate(12 48 34)"/>
        <path d="M32 36 h32 l-4 36 a6 6 0 0 1 -6 5 H42 a6 6 0 0 1 -6 -5Z" fill="#6B3A2E"/>
        <path d="M33 38 h30 l-1 9 H34Z" fill="#8A4E3C"/>
        <rect x="32" y="34" width="32" height="6" rx="3" fill="#C9C2BC"/></svg>`,
      feldi: `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">${bg('#FFF3D6','#FBE0A6')}
        <path d="M34 30 h28 l-3 44 a7 7 0 0 1 -7 6 H44 a7 7 0 0 1 -7 -6Z" fill="#F4B731"/>
        <path d="M35 40 h26 l-2 32 a5 5 0 0 1 -5 5 H42 a5 5 0 0 1 -5 -5Z" fill="#F7C94B"/>
        <ellipse cx="48" cy="30" rx="14" ry="6" fill="#fff"/><ellipse cx="40" cy="27" rx="6" ry="5" fill="#fff"/><ellipse cx="54" cy="27" rx="6" ry="5" fill="#fff"/><ellipse cx="48" cy="25" rx="6" ry="5" fill="#fff"/>
        <rect x="40" y="48" width="16" height="14" rx="2" fill="#E2001A"/></svg>`,
      feldi_af: `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">${bg('#EAF6E9','#C9E9C6')}
        <path d="M34 30 h28 l-3 44 a7 7 0 0 1 -7 6 H44 a7 7 0 0 1 -7 -6Z" fill="#E9C24A"/>
        <path d="M35 40 h26 l-2 32 a5 5 0 0 1 -5 5 H42 a5 5 0 0 1 -5 -5Z" fill="#F2D873"/>
        <ellipse cx="48" cy="30" rx="14" ry="6" fill="#fff"/><ellipse cx="40" cy="27" rx="6" ry="5" fill="#fff"/><ellipse cx="54" cy="27" rx="6" ry="5" fill="#fff"/>
        <circle cx="48" cy="56" r="13" fill="#15924E"/><text x="48" y="61" font-size="13" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial">0.0</text></svg>`
    };
    return A[id] || `<svg viewBox="0 0 96 96">${bg('#EEE','#DDD')}</svg>`;
  }

  /* ---------- Product catalog (CHF, inkl. MwSt) ---------- */
  const PRODUCTS = [
    { id: 'kloepfer',       name: 'Klöpfer',                  cat: 'grill', price: 6.50, desc: 'Der Schweizer Cervelat-Klassiker, frisch vom Grill – mit knusprigem Bürli.', tags: ['Klassiker'] },
    { id: 'joggeli',        name: 'Joggeli-Wurst',            cat: 'grill', price: 6.00, desc: 'Feine Brüh-Spezialität, knackig grilliert. Der Favorit fürs schnelle Znüni.', tags: [] },
    { id: 'kalbsbratwurst', name: 'Kalbsbratwurst',           cat: 'grill', price: 7.50, desc: 'St. Galler Art aus zartem Schweizer Kalbfleisch – mit Bürli.', tags: ['Beliebt'] },
    { id: 'schnitzelbrot',  name: 'Schnitzelbrot',            cat: 'snack', price: 9.50, desc: 'Knuspriges Schnitzel im frischen Brot, mit Salat und Sauce.', tags: ['hot'] },
    { id: 'sandwich',       name: 'Sandwich',                 cat: 'snack', price: 7.00, desc: 'Frisches Sandwich mit feiner Bell Charcuterie und Salat.', tags: [] },
    { id: 'wasser',         name: 'Wasser',                   cat: 'drink', price: 3.50, desc: 'Schweizer Mineralwasser – mit oder ohne Kohlensäure.', tags: ['cold'] },
    { id: 'cola',           name: 'Cola / Softdrink',         cat: 'drink', price: 4.00, desc: 'Eisgekühlte Erfrischung in verschiedenen Sorten.', tags: ['cold'] },
    { id: 'feldi',          name: 'Feldschlösschen Bier',     cat: 'beer',  price: 5.50, desc: 'Original, eisgekühlt gezapft. 4.8 % vol.', tags: ['18+'] },
    { id: 'feldi_af',       name: 'Feldschlösschen alkoholfrei', cat: 'beer', price: 5.00, desc: 'Voller Biergenuss, alkoholfrei. Auch für die Fahrer:innen.', tags: ['0.0'] }
  ];
  PRODUCTS.forEach(p => { p.art = art(p.id); });

  const CATEGORIES = [
    { id: 'grill', name: 'Vom Grill',        icon: '🔥' },
    { id: 'snack', name: 'Snacks & Brote',   icon: '🥪' },
    { id: 'drink', name: 'Alkoholfrei',      icon: '🥤' },
    { id: 'beer',  name: 'Bier',             icon: '🍺' }
  ];

  /* ---------- Event modes ---------- */
  const EVENTS = {
    football: {
      id: 'football', name: 'Fussballmatch', venue: 'St. Jakob-Park', city: 'Basel',
      tagline: 'Heimspiel-Genuss – ohne den Anpfiff zu verpassen.',
      stands: [
        { id: 'st-n', name: 'Bell Grillstand · Sektor B', meta: 'Nordtribüne, Gate 4' },
        { id: 'st-s', name: 'Bell Brutzelwagen · Fanzone', meta: 'Süd-Esplanade' }
      ],
      products: ['kloepfer', 'joggeli', 'kalbsbratwurst', 'cola', 'wasser', 'feldi', 'feldi_af']
    },
    stadium: {
      id: 'stadium', name: 'Stadionverkauf', venue: 'Stadion', city: 'Schweiz',
      tagline: 'Schnell versorgt – mehr vom Spiel.',
      stands: [
        { id: 'st-o', name: 'Bell Grillstand · Oberrang', meta: 'Ebene 3, Block O' },
        { id: 'st-u', name: 'Bell Grillstand · Unterrang', meta: 'Ebene 1, Block C' }
      ],
      products: ['kloepfer', 'joggeli', 'kalbsbratwurst', 'cola', 'wasser', 'feldi', 'feldi_af']
    },
    jodlerfest: {
      id: 'jodlerfest', name: 'Jodlerfest', venue: 'Festgelände', city: 'Innerschweiz',
      tagline: 'Tradition trifft Genuss – e güeti Gabe vom Bell-Stand.',
      stands: [
        { id: 'st-fz', name: 'Bell Festzelt-Stand', meta: 'Beim Hauptzelt' },
        { id: 'st-pl', name: 'Bell Brutzelwagen · Festplatz', meta: 'Beim Festplatz-Eingang' }
      ],
      products: ['sandwich', 'schnitzelbrot', 'kloepfer', 'wasser', 'cola', 'feldi_af', 'feldi']
    },
    corporate: {
      id: 'corporate', name: 'Firmenevent', venue: 'Firmenareal', city: 'Zürich',
      tagline: 'Mitarbeiter-Catering vom Feinsten – schnell und unkompliziert.',
      stands: [
        { id: 'st-hof', name: 'Bell Eventteam · Innenhof', meta: 'Beim Haupteingang' },
        { id: 'st-ter', name: 'Bell Grillstation · Terrasse', meta: 'Dachterrasse' }
      ],
      products: ['kalbsbratwurst', 'kloepfer', 'schnitzelbrot', 'sandwich', 'wasser', 'cola', 'feldi', 'feldi_af']
    },
    festival: {
      id: 'festival', name: 'Festival / Open Air', venue: 'Open-Air-Gelände', city: 'Schweiz',
      tagline: 'Festival-Hunger? Scannen, bestellen, weiterfeiern.',
      stands: [
        { id: 'st-main', name: 'Bell Foodtruck · Mainstage', meta: 'Links der Hauptbühne' },
        { id: 'st-camp', name: 'Bell Grillwagen · Campingzone', meta: 'Beim Camping-Eingang' }
      ],
      products: ['kloepfer', 'joggeli', 'kalbsbratwurst', 'schnitzelbrot', 'sandwich', 'wasser', 'cola', 'feldi', 'feldi_af']
    }
  };

  /* ---------- Storage helpers ---------- */
  function read(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
    try { localStorage.setItem('bellfl_ping', String(Date.now())); } catch (e) {}
    emit();
  }

  const listeners = [];
  function onChange(fn) { listeners.push(fn); }
  function emit() { listeners.forEach(fn => { try { fn(); } catch (e) {} }); }
  global.addEventListener('storage', (e) => {
    if (e.key && (e.key.indexOf('bellfl_') === 0)) emit();
  });

  /* ---------- Settings ---------- */
  function getSettings() {
    return read(KEYS.settings, { eventId: 'football', standId: null });
  }
  function setSettings(patch) {
    const s = Object.assign(getSettings(), patch);
    write(KEYS.settings, s);
    return s;
  }
  function currentEvent() { return EVENTS[getSettings().eventId] || EVENTS.football; }
  function eventProducts(evId) {
    const ev = EVENTS[evId || getSettings().eventId] || EVENTS.football;
    return ev.products.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  }

  /* ---------- Orders ---------- */
  function getOrders() { return read(KEYS.orders, []); }
  function saveOrders(list) { write(KEYS.orders, list); }
  function getOrder(id) { return getOrders().find(o => o.id === id) || null; }

  function nextPickup() {
    let n = read(KEYS.seq, 104);
    write(KEYS.seq, n + 1);
    return 'B-' + n;
  }

  function uid() { return 'o_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  function createOrder(data) {
    const now = Date.now();
    const order = {
      id: uid(),
      pickup: nextPickup(),
      eventId: data.eventId,
      standId: data.standId,
      standName: data.standName,
      items: data.items,
      subtotal: data.subtotal,
      total: data.total,
      payMethod: data.payMethod,
      payLabel: data.payLabel,
      status: 'received',
      statusTimes: { received: now },
      createdAt: now,
      messages: [],
      unreadStaff: 0,
      unreadGuest: 0,
      source: data.source || 'guest'
    };
    const list = getOrders();
    list.push(order);
    saveOrders(list);
    return order;
  }

  function setStatus(id, status) {
    const list = getOrders();
    const o = list.find(x => x.id === id);
    if (!o) return null;
    o.status = status;
    o.statusTimes = o.statusTimes || {};
    if (!o.statusTimes[status]) o.statusTimes[status] = Date.now();
    saveOrders(list);
    return o;
  }
  function advanceStatus(id) {
    const o = getOrder(id);
    if (!o) return null;
    const i = STATUS.indexOf(o.status);
    if (i < STATUS.length - 1) return setStatus(id, STATUS[i + 1]);
    return o;
  }

  function addMessage(id, from, text) {
    const list = getOrders();
    const o = list.find(x => x.id === id);
    if (!o) return null;
    o.messages = o.messages || [];
    o.messages.push({ from, text, ts: Date.now(), read: false });
    if (from === 'guest') o.unreadStaff = (o.unreadStaff || 0) + 1;
    else o.unreadGuest = (o.unreadGuest || 0) + 1;
    saveOrders(list);
    return o;
  }
  function markRead(id, side) {
    const list = getOrders();
    const o = list.find(x => x.id === id);
    if (!o) return;
    if (side === 'staff') o.unreadStaff = 0; else o.unreadGuest = 0;
    (o.messages || []).forEach(m => {
      if (side === 'staff' && m.from === 'guest') m.read = true;
      if (side === 'guest' && m.from === 'staff') m.read = true;
    });
    saveOrders(list);
  }

  function resetDemo() {
    [KEYS.orders, KEYS.seq, KEYS.seeded].forEach(k => { try { localStorage.removeItem(k); } catch (e) {} });
    seed(true);
    write(KEYS.orders, getOrders());
  }

  /* ---------- Seed demo orders ---------- */
  function seed(force) {
    if (!force && read(KEYS.seeded, false)) return;
    const ev = currentEvent();
    const sName = (ev.stands[0] || {}).name || 'Bell Grillstand';
    const P = id => PRODUCTS.find(p => p.id === id);
    const mk = (pickup, items, status, mins, pay, payLabel, msgs) => {
      const created = Date.now() - mins * 60000;
      const li = items.map(([id, q]) => { const p = P(id); return { id, name: p.name, price: p.price, qty: q }; });
      const sub = li.reduce((s, x) => s + x.price * x.qty, 0);
      const times = {}; let acc = created;
      const idx = STATUS.indexOf(status);
      for (let i = 0; i <= idx; i++) { times[STATUS[i]] = acc; acc += Math.round(mins * 60000 / (idx + 1.5)); }
      return {
        id: uid(), pickup, eventId: ev.id, standId: (ev.stands[0] || {}).id, standName: sName,
        items: li, subtotal: sub, total: sub, payMethod: pay, payLabel,
        status, statusTimes: times, createdAt: created,
        messages: msgs || [], unreadStaff: (msgs || []).filter(m => m.from === 'guest' && !m.read).length, unreadGuest: 0,
        source: 'demo'
      };
    };
    const orders = [
      mk('B-101', [['kloepfer', 2], ['feldi', 1]], 'grill', 7, 'twint', 'TWINT', []),
      mk('B-102', [['kalbsbratwurst', 1], ['cola', 1]], 'ready', 11, 'applepay', 'Apple Pay', []),
      mk('B-103', [['schnitzelbrot', 1], ['feldi_af', 1]], 'received', 2, 'card', 'Kreditkarte',
         [{ from: 'guest', text: 'Bitte ohne Zwiebeln 🙏', ts: Date.now() - 90000, read: false }])
    ];
    write(KEYS.seq, 104);
    write(KEYS.orders, orders);
    write(KEYS.seeded, true);
  }

  /* ---------- Formatting utils ---------- */
  function chf(n) { return 'CHF ' + Number(n).toFixed(2); }
  function timeAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return 'gerade eben';
    const m = Math.floor(s / 60);
    if (m < 60) return 'vor ' + m + ' Min';
    const h = Math.floor(m / 60);
    return 'vor ' + h + ' Std';
  }
  function clock(ts) {
    const d = new Date(ts);
    return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  }
  function minsAgo(ts) { return Math.floor((Date.now() - ts) / 60000); }

  /* ---------- Quick messages ---------- */
  const QUICK_MSGS = [
    'Ohne Zwiebeln', 'Ohne Senf', 'Bitte etwas später', 'Wo finde ich den Stand?',
    'Ich bin direkt vorne beim Bell-Wagen', 'Kann ich noch etwas ergänzen?'
  ];

  /* ---------- Expose ---------- */
  global.BELL = {
    KEYS, STATUS, STATUS_LABEL, STATUS_SHORT,
    PRODUCTS, CATEGORIES, EVENTS, QUICK_MSGS,
    art,
    getSettings, setSettings, currentEvent, eventProducts,
    getOrders, getOrder, createOrder, setStatus, advanceStatus,
    addMessage, markRead, resetDemo, seed,
    onChange, chf, timeAgo, clock, minsAgo
  };

  // Seed on first load (any page)
  seed(false);

})(window);
