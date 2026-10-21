// ═══════════════════════════════════════════════════════════════════
// Slides Squad — visualizações animadas em canvas
// Usadas como fallback enquanto o vídeo/GIF real não chega, ou como
// ilustração própria. Cores vêm dos tokens do tema (--glow, --glow-2, --ink).
// Uso: <canvas data-viz="pointcloud"></canvas>
// Para criar uma nova: DeckViz.nome = (ctx, w, h, t, pts) => { ... }
// ═══════════════════════════════════════════════════════════════════
(() => {
  const TAU = Math.PI * 2;
  const css = getComputedStyle(document.documentElement);
  const rgb = name => (css.getPropertyValue(name).trim() || '34 193 255').split(/\s+/).join(',');
  const G = rgb('--glow'), G2 = rgb('--glow-2'), G3 = rgb('--glow-3');
  const FONT = css.getPropertyValue('--font').trim() || 'sans-serif';
  const c = (rgbStr, a) => `rgba(${rgbStr},${a})`;

  const V = {};

  // Edifício em nuvem de pontos girando
  V.pointcloud = (ctx, w, h, t, pts) => {
    if (!pts.length) {
      for (let n = 0; n < 2600; n++) {
        const f = Math.floor(Math.random() * 6), u = Math.random() * 2 - 1, v = Math.random();
        const Wd = 1, D = .7, Ht = 1.6;
        let x, y, z;
        if (f === 0) { x = u * Wd; z = D; y = v * Ht; }
        else if (f === 1) { x = u * Wd; z = -D; y = v * Ht; }
        else if (f === 2) { x = Wd; z = u * D; y = v * Ht; }
        else if (f === 3) { x = -Wd; z = u * D; y = v * Ht; }
        else if (f === 4) { x = u * Wd; z = (Math.random() * 2 - 1) * D; y = Math.floor(v * 6) / 6 * Ht; }
        else { x = (Math.random() * 2 - 1) * 2.4; z = (Math.random() * 2 - 1) * 2; y = 0; }
        pts.push([x, y, z, Math.random()]);
      }
    }
    ctx.clearRect(0, 0, w, h);
    const a = t * .00025, ca = Math.cos(a), sa = Math.sin(a);
    const sc = Math.min(w, h) * .32, cx = w / 2, cy = h * .72;
    for (const [x, y, z, r] of pts) {
      const X = x * ca - z * sa, Z = x * sa + z * ca;
      const Y = y * Math.cos(.38) - Z * Math.sin(.38) * .5;
      const d = 3.2 / (3.2 + Z * .6);
      ctx.fillStyle = c(r > .5 ? G : G2, .45 + r * .5);
      ctx.fillRect(cx + X * sc * d, cy - Y * sc * d, 2.2 * d, 2.2 * d);
    }
  };

  // Esfera 360° em wireframe
  V.sphere = (ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h * .45, R = Math.min(w, h) * .3, a = t * .0004;
    ctx.lineWidth = 1.2;
    for (let lat = -75; lat <= 75; lat += 15) {
      const r = R * Math.cos(lat * Math.PI / 180), y = cy - R * Math.sin(lat * Math.PI / 180);
      ctx.strokeStyle = c(G, .35);
      ctx.beginPath(); ctx.ellipse(cx, y, r, r * .28, 0, 0, TAU); ctx.stroke();
    }
    for (let k = 0; k < 12; k++) {
      const ang = a + k * Math.PI / 12;
      ctx.strokeStyle = c(G, .2 + .5 * Math.abs(Math.sin(ang)));
      ctx.beginPath(); ctx.ellipse(cx, cy, Math.abs(Math.cos(ang)) * R, R, 0, 0, TAU); ctx.stroke();
    }
    ctx.fillStyle = '#fff'; ctx.font = `600 ${R * .42}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('360°', cx, cy);
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  };

  // Drone sobrevoando com cone de varredura
  V.drone = (ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const gx = w / 2, gy = h * .78;
    ctx.strokeStyle = c(G, .25); ctx.lineWidth = 1;
    for (let k = -8; k <= 8; k++) { ctx.beginPath(); ctx.moveTo(gx + k * w * .06, gy); ctx.lineTo(gx + k * w * .14, h); ctx.stroke(); }
    for (let k = 0; k < 5; k++) { const y = gy + k * k * (h - gy) / 16; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    const dx = w / 2 + Math.sin(t * .0007) * w * .22, dy = h * .3 + Math.sin(t * .0013) * 10;
    ctx.fillStyle = c(G2, .18);
    ctx.beginPath(); ctx.moveTo(dx, dy + 14); ctx.lineTo(dx - w * .16, gy + 20); ctx.lineTo(dx + w * .16, gy + 20); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
    const s = Math.min(w, h) * .05;
    ctx.beginPath(); ctx.moveTo(dx - s, dy - s * .5); ctx.lineTo(dx + s, dy + s * .5); ctx.moveTo(dx + s, dy - s * .5); ctx.lineTo(dx - s, dy + s * .5); ctx.stroke();
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([i, j]) => { ctx.beginPath(); ctx.ellipse(dx + i * s, dy + j * s * .5, s * .6, s * .16, 0, 0, TAU); ctx.stroke(); });
    ctx.fillStyle = c(G, 1); ctx.beginPath(); ctx.arc(dx, dy, s * .28, 0, TAU); ctx.fill();
  };

  // Projeto sobreposto à realidade, com cortina deslizante
  V.overlay = (ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const p = (Math.sin(t * .0008) + 1) / 2, sx = w * (.15 + .7 * p);
    const box = (ox, oy, col, dash) => {
      ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.setLineDash(dash);
      const BW = w * .4, BH = h * .5, d = w * .1;
      ctx.strokeRect(ox, oy, BW, BH);
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + d, oy - d * .5); ctx.lineTo(ox + BW + d, oy - d * .5); ctx.lineTo(ox + BW, oy);
      ctx.moveTo(ox + BW + d, oy - d * .5); ctx.lineTo(ox + BW + d, oy + BH - d * .5); ctx.lineTo(ox + BW, oy + BH); ctx.stroke();
      for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(ox, oy + BH * k / 4); ctx.lineTo(ox + BW, oy + BH * k / 4); ctx.stroke(); }
      ctx.setLineDash([]);
    };
    box(w * .26, h * .32, 'rgba(255,255,255,.55)', []);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, sx, h); ctx.clip();
    box(w * .27, h * .3, c(G, 1), [10, 8]);
    ctx.restore();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, h); ctx.stroke();
    ctx.font = `500 ${h * .04}px ${FONT}`; ctx.fillStyle = c(G, 1); ctx.fillText('PROJETO', 30, h * .08);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'right'; ctx.fillText('REAL', w - 30, h * .08); ctx.textAlign = 'left';
  };

  // Volume (pilha) sendo medido
  V.volume = (ctx, w, h, t, pts) => {
    if (!pts.length) for (let n = 0; n < 2200; n++) { const r = Math.sqrt(Math.random()), a = Math.random() * TAU; pts.push([r * Math.cos(a), r * Math.sin(a), Math.random()]); }
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h * .66, R = w * .3, HH = h * .42, rot = t * .0003;
    const fill = Math.min(1, (t % 6000) / 4000);
    for (const [x, z, r] of pts) {
      const X = x * Math.cos(rot) - z * Math.sin(rot), Z = x * Math.sin(rot) + z * Math.cos(rot);
      const y = Math.max(0, 1 - Math.hypot(x, z) ** 1.6) * HH;
      ctx.fillStyle = y / HH < fill ? c(r > .5 ? G : G2, .85) : 'rgba(255,255,255,.25)';
      ctx.fillRect(cx + X * R, cy + Z * R * .35 - y, 2.2, 2.2);
    }
    ctx.font = `600 ${h * .09}px ${FONT}`; ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
    ctx.fillText(`${(fill * 1284).toFixed(0)} m³`, cx, h * .17); ctx.textAlign = 'left';
  };

  // Linha do tempo de vídeo com frames passando
  V.video = (ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const n = 7, fw = w * .16, fh = fw * .62, y = h * .38, off = (t * .06) % (fw + 20);
    for (let k = -1; k < n; k++) {
      const x = k * (fw + 20) - off + 30;
      ctx.strokeStyle = c(G, .6); ctx.lineWidth = 2; ctx.strokeRect(x, y, fw, fh);
      ctx.fillStyle = c(G2, .12); ctx.fillRect(x, y, fw, fh);
      ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.moveTo(x + fw * .1, y + fh * .85); ctx.lineTo(x + fw * .4, y + fh * .4); ctx.lineTo(x + fw * .6, y + fh * .65); ctx.lineTo(x + fw * .9, y + fh * .3); ctx.stroke();
    }
    const p = (t % 8000) / 8000;
    ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(30, h * .78, w - 60, 6);
    ctx.fillStyle = c(G, 1); ctx.fillRect(30, h * .78, (w - 60) * p, 6);
    ctx.beginPath(); ctx.arc(30 + (w - 60) * p, h * .78 + 3, 11, 0, TAU); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.fillStyle = '#ff3b5c'; ctx.beginPath(); ctx.arc(46, h * .12, 10, 0, TAU); ctx.fill();
    ctx.font = `500 ${h * .045}px ${FONT}`; ctx.fillStyle = '#fff'; ctx.fillText('REC', 66, h * .12 + h * .016);
  };

  // Painel de dados: barras crescendo + linha de tendência
  V.dashboard = (ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const n = 12, bw = w * .8 / n, base = h * .82, p = Math.min(1, (t % 7000) / 2500);
    for (let k = 0; k < n; k++) {
      const v = .25 + .6 * (0.5 + 0.5 * Math.sin(k * .9 + 1.3)) * (k / n * .6 + .4);
      const bh = v * h * .6 * Math.min(1, Math.max(0, p * n - k * .6));
      ctx.fillStyle = c(k === n - 1 ? G : G2, k === n - 1 ? .95 : .55);
      ctx.fillRect(w * .1 + k * bw + bw * .15, base - bh, bw * .7, bh);
    }
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath();
    for (let k = 0; k <= 40 * p; k++) { const x = w * .1 + k / 40 * w * .8, y = base - h * (.2 + .45 * k / 40) - Math.sin(k * .5) * h * .03; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(w * .1, base); ctx.lineTo(w * .9, base); ctx.stroke();
  };

  // Rede de nós conectados (IA, integrações, comunidade)
  V.network = (ctx, w, h, t, pts) => {
    if (!pts.length) for (let k = 0; k < 46; k++) pts.push({ x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .00012, vy: (Math.random() - .5) * .00012, r: 2 + Math.random() * 4 });
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) { p.x = (p.x + p.vx * 16 + 1) % 1; p.y = (p.y + p.vy * 16 + 1) % 1; }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i], b = pts[j], d = Math.hypot((a.x - b.x) * w, (a.y - b.y) * h);
      if (d < w * .16) { ctx.strokeStyle = c(G, .5 * (1 - d / (w * .16))); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x * w, a.y * h); ctx.lineTo(b.x * w, b.y * h); ctx.stroke(); }
    }
    for (const p of pts) { ctx.fillStyle = c(p.r > 4.5 ? G : G3, .9); ctx.beginPath(); ctx.arc(p.x * w, p.y * h, p.r, 0, TAU); ctx.fill(); }
  };

  // Ondas de som / voz (podcast, entrevista, áudio)
  V.wave = (ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const bars = 64, bw = w / bars;
    for (let k = 0; k < bars; k++) {
      const a = Math.abs(Math.sin(k * .35 + t * .004) * Math.sin(k * .08 + t * .0017)) * h * .55 + 6;
      ctx.fillStyle = c(k % 4 ? G2 : G, .85);
      ctx.fillRect(k * bw + bw * .2, h / 2 - a / 2, bw * .6, a);
    }
  };

  window.DeckViz = V;
})();
