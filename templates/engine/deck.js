// ═══════════════════════════════════════════════════════════════════
// Slides Squad — motor de navegação para palco, telão e LED
// Não depende de rede: funciona abrindo o .html direto (file://).
// ═══════════════════════════════════════════════════════════════════
(() => {
  const stage = document.getElementById('stage');
  const slides = [...stage.querySelectorAll('.slide')];
  const W = +(stage.dataset.w || 1920), H = +(stage.dataset.h || 1080);
  const params = new URLSearchParams(location.search);
  const presenter = params.has('presenter');
  // ?snap: estado final de cada slide sem esperar animações (QA por screenshot, scripts/snapshot.py)
  const snap = params.has('snap');
  const loop = document.body.hasAttribute('data-loop');
  let cur = -1, timers = [];

  stage.style.width = W + 'px';
  stage.style.height = H + 'px';
  if (presenter) document.body.classList.add('presenter');
  if (params.has('show')) document.body.classList.add('show-mode');
  if (snap) document.body.classList.add('snap');

  // ---------- Escala do palco para qualquer tela ----------
  function fit() {
    if (presenter) {
      const s = Math.min((innerWidth * .66 - 48) / W, (innerHeight - 48) / H);
      stage.style.transform = `scale(${s})`;
      stage.style.transformOrigin = '0 0';
      stage.style.left = stage.style.top = '24px';
      return;
    }
    const s = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = `scale(${s}) translate(-50%, -50%)`;
  }
  addEventListener('resize', fit);
  fit();

  // ---------- Preparação de elementos ----------
  const progress = stage.querySelector('.progress');
  if (progress) slides.forEach(() => progress.appendChild(document.createElement('i')));

  // Texto palavra a palavra
  stage.querySelectorAll('[data-words]').forEach(el => {
    let i = 0;
    // Texto com gradiente (.grad-text) precisa da classe em cada palavra, senão o recorte do fundo some
    const walk = (node, extra = '') => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const s = document.createElement('span');
            s.className = ('w ' + extra).trim(); s.style.setProperty('--i', i++); s.textContent = part;
            frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('w')) walk(n, n.classList.contains('grad-text') ? 'grad-text' : extra);
      });
    };
    walk(el);
  });

  // Partículas
  stage.querySelectorAll('.sparks').forEach(box => {
    for (let n = 0; n < 46; n++) {
      const p = document.createElement('span');
      p.style.left = (8 + Math.random() * 84) + '%';
      p.style.top = (55 + Math.random() * 45) + '%';
      p.style.animationDelay = (Math.random() * 6).toFixed(2) + 's';
      p.style.animationDuration = (4 + Math.random() * 5).toFixed(2) + 's';
      box.appendChild(p);
    }
  });

  // Overlays de operação
  document.body.insertAdjacentHTML('beforeend', '<div id="blackout"></div>');
  stage.insertAdjacentHTML('beforeend', '<div id="safe-guide"></div>');
  if (!document.querySelector('.help')) {
    document.body.insertAdjacentHTML('beforeend', `<div class="help">
      <kbd>→</kbd><kbd>Espaço</kbd><kbd>Clique</kbd> avançar · <kbd>←</kbd> voltar<br>
      <kbd>F</kbd> tela cheia · <kbd>B</kbd> tela preta · <kbd>R</kbd> repetir animação<br>
      <kbd>1-9</kbd> ir ao slide · <kbd>Home</kbd>/<kbd>End</kbd> início/fim<br>
      <kbd>C</kbd> esconder dicas de mídia · <kbd>G</kbd> guia de área segura<br>
      <kbd>P</kbd> abrir modo apresentador · <kbd>H</kbd> esta ajuda</div>`);
  }

  // ---------- Modo apresentador ----------
  const t0 = Date.now();
  let pv;
  if (presenter) {
    document.body.insertAdjacentHTML('beforeend', `<div class="pv">
      <div class="box timer"><span id="pv-clock">00:00</span><small id="pv-count"></small></div>
      <div class="box next"><h4>Próximo</h4><div id="pv-next"></div></div>
      <div class="box notes"><h4>Notas</h4><div id="pv-notes"></div></div>
      <div class="box keys">Abra o mesmo arquivo sem "?presenter" no telão: os dois ficam sincronizados.<br>→ avança · ← volta · B tela preta · R repete</div>
    </div>`);
    pv = { clock: document.getElementById('pv-clock'), count: document.getElementById('pv-count'), next: document.getElementById('pv-next'), notes: document.getElementById('pv-notes') };
    setInterval(() => {
      const s = Math.floor((Date.now() - t0) / 1000);
      pv.clock.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    }, 500);
  }
  const titleOf = s => s ? (s.dataset.title || s.querySelector('h1,h2,blockquote')?.textContent.trim().slice(0, 80) || '—') : 'Fim';
  const notesOf = s => s.querySelector('aside.notes')?.innerText.trim() || s.dataset.notes || '';

  // ---------- Sincronização entre janelas (telão + apresentador) ----------
  const key = 'deck-sync:' + location.pathname;
  let bc = null;
  try { bc = new BroadcastChannel(key); } catch (e) {}
  let remote = false;
  function broadcast(msg) {
    if (remote) return;
    const data = JSON.stringify({ ...msg, at: Date.now() });
    try { bc && bc.postMessage(data); } catch (e) {}
    try { localStorage.setItem(key, data); } catch (e) {}
  }
  function receive(raw) {
    let m; try { m = JSON.parse(raw); } catch (e) { return; }
    remote = true;
    if (m.type === 'go') go(m.i, false, m.step);
    if (m.type === 'blackout') document.body.classList.toggle('blackout', m.on);
    remote = false;
  }
  if (bc) bc.onmessage = e => receive(e.data);
  addEventListener('storage', e => { if (e.key === key && e.newValue) receive(e.newValue); });

  // ---------- Navegação ----------
  const steps = s => [...s.querySelectorAll('[data-step]')].sort((a, b) => a.dataset.step - b.dataset.step);
  const pendingStep = s => steps(s).find(el => !el.classList.contains('shown'));

  function restart(el) {
    el.classList.remove('active');
    void el.offsetWidth;
    el.classList.add('active');
  }

  function go(i, force, stepCount = 0) {
    if (loop) i = (i + slides.length) % slides.length;
    i = Math.max(0, Math.min(slides.length - 1, i));
    if (i === cur && !force && !stepCount) return;
    const entering = i !== cur || force;
    const s = slides[i];
    steps(s).forEach((el, k) => el.classList.toggle('shown', snap || k < stepCount));
    if (entering) {
      timers.forEach(clearTimeout); timers = [];
      slides.forEach((x, k) => { if (k !== i) x.classList.remove('active'); });
      restart(s);
      stage.dataset.horizon = s.dataset.horizon || 'off';
      stage.dataset.chrome = s.dataset.chrome || 'on';
      if (progress) [...progress.children].forEach((d, k) => d.classList.toggle('on', k === i));
      document.querySelectorAll('video.media').forEach(v => {
        if (s.contains(v)) { v.currentTime = 0; v.play().catch(() => {}); } else v.pause();
      });
      stage.querySelectorAll('.eq[data-focus-at]').forEach(eq => eq.classList.remove('focus'));
      s.querySelectorAll('.eq[data-focus-at]').forEach(eq => {
        timers.push(setTimeout(() => eq.classList.add('focus'), snap ? 0 : parseFloat(eq.dataset.focusAt) * 1000));
      });
      // Avanço automático (loops de espera, vinhetas)
      if (s.dataset.auto && !snap) timers.push(setTimeout(() => next(), parseFloat(s.dataset.auto) * 1000));
    }

    cur = i;
    history.replaceState(null, '', location.search + '#' + (i + 1));
    if (pv) {
      pv.count.textContent = `${i + 1} / ${slides.length}`;
      const p = pendingStep(s);
      pv.next.textContent = p ? `▶ build: ${p.dataset.stepLabel || 'próximo elemento'}` : titleOf(slides[i + 1]);
      pv.notes.textContent = notesOf(s) || '(sem notas)';
    }
    broadcast({ type: 'go', i, step: steps(s).filter(el => el.classList.contains('shown')).length });
  }

  function next() {
    const s = slides[cur], p = pendingStep(s);
    if (p) {
      p.classList.add('shown');
      if (pv) { const q = pendingStep(s); pv.next.textContent = q ? `▶ build: ${q.dataset.stepLabel || 'próximo elemento'}` : titleOf(slides[cur + 1]); }
      broadcast({ type: 'go', i: cur, step: steps(s).filter(el => el.classList.contains('shown')).length });
      return;
    }
    go(cur + 1);
  }
  const prev = () => go(cur - 1);

  function toggleBlackout() {
    const on = !document.body.classList.contains('blackout');
    document.body.classList.toggle('blackout', on);
    broadcast({ type: 'blackout', on });
  }

  // Mantém a tela acordada durante a apresentação
  let lock = null;
  async function wake() { try { lock = await navigator.wakeLock?.request('screen'); } catch (e) {} }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && lock) wake(); });

  addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter', 'n'].includes(k)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev(); }
    else if (k === 'Home') go(0);
    else if (k === 'End') go(slides.length - 1);
    else if (k === 'r' || k === 'R') go(cur, true);
    else if (k === 'b' || k === 'B' || k === '.') toggleBlackout();
    else if (k === 'f' || k === 'F') {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen().then(wake).catch(() => {});
    }
    else if (k === 'c' || k === 'C') document.body.classList.toggle('show-mode');
    else if (k === 'g' || k === 'G') document.body.classList.toggle('guide');
    else if (k === 'h' || k === 'H' || k === '?') document.querySelector('.help')?.classList.toggle('show');
    else if ((k === 'p' || k === 'P') && !presenter) window.open(location.pathname + '?presenter' + location.hash, 'presenter');
    else if (/^[1-9]$/.test(k)) go(+k - 1);
  });
  stage.addEventListener('click', e => { if (e.button === 0) next(); });
  addEventListener('contextmenu', e => { e.preventDefault(); prev(); });
  addEventListener('hashchange', () => { const n = parseInt(location.hash.slice(1), 10); if (n && n - 1 !== cur) go(n - 1); });

  let ct;
  addEventListener('mousemove', () => {
    document.body.classList.remove('hide-cursor');
    clearTimeout(ct);
    ct = setTimeout(() => document.body.classList.add('hide-cursor'), 2000);
  });

  // ---------- Mídias: media/<nome>.(mp4|webm|mov|gif|png|jpg|jpeg|webp) ----------
  const EXT = ['mp4', 'webm', 'mov', 'gif', 'png', 'jpg', 'jpeg', 'webp'];
  const isVideo = ext => ['mp4', 'webm', 'mov'].includes(ext);

  function mount(slot, url, video) {
    slot.querySelector('.media')?.remove();
    const el = document.createElement(video ? 'video' : 'img');
    el.className = 'media ok';
    if (video) Object.assign(el, { muted: true, loop: true, playsInline: true, autoplay: true, preload: 'auto' });
    el.src = url;
    slot.prepend(el);
    slot.classList.add('has-media');
    if (video && slot.closest('.slide')?.classList.contains('active')) el.play().catch(() => {});
  }

  function tryLoad(slot, base, i = 0) {
    if (i >= EXT.length) return;
    const ext = EXT[i], url = `${base}.${ext}`;
    const el = document.createElement(isVideo(ext) ? 'video' : 'img');
    const ok = () => mount(slot, url, isVideo(ext));
    const fail = () => tryLoad(slot, base, i + 1);
    if (isVideo(ext)) { el.preload = 'metadata'; el.onloadedmetadata = ok; el.onerror = fail; }
    else { el.onload = ok; el.onerror = fail; }
    el.src = url;
  }

  stage.querySelectorAll('.slot[data-src]').forEach(slot => {
    tryLoad(slot, slot.dataset.src);
    slot.addEventListener('dragover', e => { e.preventDefault(); slot.closest('.slide').classList.add('dragging'); });
    slot.addEventListener('dragleave', () => slot.closest('.slide').classList.remove('dragging'));
    slot.addEventListener('drop', e => {
      e.preventDefault();
      slot.closest('.slide').classList.remove('dragging');
      const f = e.dataTransfer.files[0];
      if (f) mount(slot, URL.createObjectURL(f), f.type.startsWith('video'));
    });
  });
  addEventListener('dragover', e => e.preventDefault());
  addEventListener('drop', e => e.preventDefault());

  // ---------- Contagem regressiva: <span class="clock" data-countdown="5"> (minutos) ou "16:00" ----------
  stage.querySelectorAll('[data-countdown]').forEach(el => {
    const v = el.dataset.countdown;
    let end;
    if (v.includes(':')) { const [h, m] = v.split(':').map(Number); end = new Date(); end.setHours(h, m, 0, 0); }
    else end = new Date(Date.now() + parseFloat(v) * 60000);
    const tick = () => {
      const s = Math.max(0, Math.round((end - Date.now()) / 1000));
      el.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    };
    tick(); setInterval(tick, 500);
  });

  // ---------- Visualizações animadas (viz.js) como fallback de mídia ----------
  const live = [];
  stage.querySelectorAll('canvas[data-viz]').forEach(cv => {
    const fn = window.DeckViz?.[cv.dataset.viz];
    if (fn) live.push({ cv, ctx: cv.getContext('2d'), fn, pts: [] });
  });
  function frame(t) {
    for (const v of live) {
      if (!v.cv.closest('.slide').classList.contains('active') || v.cv.closest('.has-media')) continue;
      const dpr = devicePixelRatio || 1, w = v.cv.offsetWidth, h = v.cv.offsetHeight;
      if (v.cv.width !== Math.round(w * dpr)) { v.cv.width = Math.round(w * dpr); v.cv.height = Math.round(h * dpr); }
      v.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      v.fn(v.ctx, w, h, t, v.pts);
    }
    requestAnimationFrame(frame);
  }
  if (live.length) requestAnimationFrame(frame);

  // ---------- Início ----------
  const start = parseInt(location.hash.slice(1), 10);
  go(Number.isFinite(start) ? start - 1 : 0);
})();
