(() => {
  const STYLE_ID = 'ferreteria-diagnostic-style';

  const addStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .fer-approx-note{margin:0 0 2px;padding:10px 12px;border-radius:10px;background:#fff7ef;color:#7a4a20;font-size:12px;font-weight:800;line-height:1.4}
      .fer-agnescore{width:100%;display:grid;gap:18px;align-items:center;justify-items:center;padding:4px 0 8px}
      .fer-agnescore-head{text-align:center;display:grid;gap:5px}
      .fer-agnescore-head small{font-size:10px;letter-spacing:1.5px;font-weight:950;color:#60706a}
      .fer-agnescore-head strong{font-size:18px;color:#00233f}
      .fer-ring{--score:0;--ring:#2fb36f;position:relative;width:min(230px,62vw);aspect-ratio:1;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--ring) calc(var(--score)*1%),#e9eef1 0);box-shadow:0 18px 45px rgba(0,35,63,.12);transition:background .35s ease,transform .25s ease}
      .fer-ring::before{content:'';position:absolute;width:74%;height:74%;border-radius:50%;background:#fff;box-shadow:inset 0 0 0 1px #e8eef1}
      .fer-ring-core{position:relative;z-index:1;text-align:center;display:grid;gap:2px}
      .fer-ring-core strong{font-size:clamp(48px,8vw,72px);line-height:.9;letter-spacing:-3px;color:var(--ring);transition:color .25s ease}
      .fer-ring-core span{font-size:10px;font-weight:950;letter-spacing:1.2px;color:#60706a}
      .fer-agnescore-status{text-align:center;display:grid;gap:7px;max-width:560px}
      .fer-agnescore-status strong{font-size:clamp(27px,4vw,38px);letter-spacing:-1px;color:var(--ring)}
      .fer-agnescore-status p{margin:0;color:#526875;line-height:1.5;font-size:14px}
      .fer-agnescore-factors{width:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
      .fer-agnescore-factors div{padding:12px 9px;border-radius:12px;background:#f4f7f8;display:grid;gap:4px;text-align:center}
      .fer-agnescore-factors b{font-size:12px;color:#00233f}
      .fer-agnescore-factors span{font-size:11px;color:#657984;font-weight:800}
      .fer-agnescore-note{font-size:10px!important;color:#84959f!important;line-height:1.4!important;margin:0!important;text-align:center}
      .diagnostic-result.fer-enhanced>small,.diagnostic-result.fer-enhanced>strong,.diagnostic-result.fer-enhanced>p,.diagnostic-result.fer-enhanced>.diagnostic-metrics{display:none!important}
      .diagnostic-result.fer-enhanced>.btn{margin-top:4px}
      .fer-ring.is-pulsing{animation:ferPulse .42s ease-out}
      @keyframes ferPulse{0%{transform:scale(.97)}55%{transform:scale(1.035)}100%{transform:scale(1)}}
      @media(max-width:560px){.fer-agnescore-factors{grid-template-columns:1fr}.fer-ring{width:min(210px,68vw)}}
      @media(prefers-reduced-motion:reduce){.fer-ring{transition:none}.fer-ring.is-pulsing{animation:none}}
    `;
    document.head.appendChild(style);
  };

  const productPoints = (products) => {
    if (products <= 100) return 15;
    if (products <= 300) return 30;
    if (products <= 700) return 48;
    if (products <= 1500) return 65;
    if (products <= 3000) return 75;
    if (products <= 10000) return 82;
    return 88;
  };

  const salesPoints = (sales) => {
    if (sales <= 10) return 4;
    if (sales <= 30) return 8;
    if (sales <= 60) return 12;
    if (sales <= 150) return 16;
    return 20;
  };

  const levelData = (score) => {
    if (score < 40) return { label: 'COMPLEJIDAD BAJA', color: '#2fb36f', copy: 'El volumen todavía permite un control relativamente simple, aunque conviene ordenar la información antes de que el catálogo crezca.' };
    if (score < 65) return { label: 'COMPLEJIDAD MEDIA', color: '#d9b51b', copy: 'Ya existe suficiente variedad y movimiento como para que los errores de reposición y los puntos ciegos empiecen a aparecer.' };
    if (score < 85) return { label: 'COMPLEJIDAD ALTA', color: '#ef8b2c', copy: 'Controlar existencias, reposición y productos de baja rotación se vuelve difícil si la información está dispersa o depende de memoria.' };
    return { label: 'COMPLEJIDAD MUY ALTA', color: '#d83a3a', copy: 'Con este volumen, mantener un abastecimiento consistente sin apoyo digital exige demasiado control manual y aumenta el riesgo de faltantes o sobrestock.' };
  };

  const describeCatalog = (points) => points >= 75 ? 'MUY ALTO' : points >= 60 ? 'ALTO' : points >= 35 ? 'MEDIO' : 'BAJO';
  const describeSales = (points) => points >= 16 ? 'ALTO' : points >= 10 ? 'MEDIO' : 'BAJO';

  const ensureQuestionCopy = (section) => {
    const form = section.querySelector('.diagnostic-form');
    if (!form) return;

    const labels = form.querySelectorAll('label>span');
    if (labels[0]) labels[0].textContent = '1. ¿Cuántos productos diferentes manejas aproximadamente?';
    if (labels[1]) labels[1].textContent = '2. ¿Cuántas ventas aproximado haces al día?';

    let note = form.querySelector('.fer-approx-note');
    if (!note) {
      note = document.createElement('p');
      note.className = 'fer-approx-note';
      note.textContent = 'No necesitas cifras exactas: responde con valores aproximados.';
      form.insertBefore(note, form.firstChild);
    }
  };

  const ensureWidget = () => {
    if (!location.hash.toLowerCase().includes('ferreter')) return null;
    const section = document.querySelector('.diagnostic-section');
    const result = section?.querySelector('.diagnostic-result');
    if (!section || !result) return null;

    ensureQuestionCopy(section);

    let widget = result.querySelector('.fer-agnescore');
    if (!widget) {
      widget = document.createElement('div');
      widget.className = 'fer-agnescore';
      widget.innerHTML = `
        <div class="fer-agnescore-head"><small>ÍNDICE AGNE</small><strong>Dificultad para controlar el stock sin una gestión digital ordenada</strong></div>
        <div class="fer-ring" role="img" aria-label="Índice AGNE de complejidad"><div class="fer-ring-core"><strong class="fer-score-value">0%</strong><span>COMPLEJIDAD</span></div></div>
        <div class="fer-agnescore-status"><strong class="fer-score-label">—</strong><p class="fer-score-copy"></p></div>
        <div class="fer-agnescore-factors">
          <div><b>📦 CATÁLOGO</b><span class="fer-catalog-level">—</span></div>
          <div><b>🧾 MOVIMIENTO</b><span class="fer-sales-level">—</span></div>
          <div><b>🧠 CONTROL ACTUAL</b><span class="fer-control-level">—</span></div>
        </div>
        <p class="fer-agnescore-note">Índice orientativo de AGNE basado en cantidad de referencias, movimiento diario y forma actual de control. No es una medición financiera ni estadística.</p>
      `;
      result.insertBefore(widget, result.firstChild);
      result.classList.add('fer-enhanced');
    }
    return { section, result, widget };
  };

  const sync = () => {
    addStyles();
    const found = ensureWidget();
    if (!found) return;
    const { section, widget } = found;
    const inputs = section.querySelectorAll('.diagnostic-form input[type="number"]');
    if (inputs.length < 2) return;

    const products = Math.max(0, Number(inputs[0].value) || 0);
    const sales = Math.max(0, Number(inputs[1].value) || 0);
    const buttons = section.querySelectorAll('.choice-row button');
    const digital = Array.from(buttons).some(btn => btn.classList.contains('active') && /digital/i.test(btn.textContent || ''));

    const pPoints = productPoints(products);
    const sPoints = salesPoints(sales);
    const controlPoints = digital ? 0 : 10;
    const score = Math.min(100, pPoints + sPoints + controlPoints);
    const level = levelData(score);

    const ring = widget.querySelector('.fer-ring');
    ring.style.setProperty('--score', String(score));
    ring.style.setProperty('--ring', level.color);
    ring.setAttribute('aria-label', `Índice AGNE de complejidad: ${score}%`);
    widget.querySelector('.fer-score-value').textContent = `${score}%`;
    widget.querySelector('.fer-score-label').textContent = level.label;
    widget.querySelector('.fer-score-label').style.color = level.color;
    widget.querySelector('.fer-score-copy').textContent = level.copy;
    widget.querySelector('.fer-catalog-level').textContent = describeCatalog(pPoints);
    widget.querySelector('.fer-sales-level').textContent = describeSales(sPoints);
    widget.querySelector('.fer-control-level').textContent = digital ? 'DIGITAL' : 'MANUAL · +10 pts';

    ring.classList.remove('is-pulsing');
    void ring.offsetWidth;
    ring.classList.add('is-pulsing');
  };

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      sync();
    });
  };

  document.addEventListener('input', (event) => {
    if (event.target instanceof Element && event.target.closest('.diagnostic-section')) schedule();
  }, true);
  document.addEventListener('change', (event) => {
    if (event.target instanceof Element && event.target.closest('.diagnostic-section')) schedule();
  }, true);
  document.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('.diagnostic-section')) setTimeout(schedule, 0);
  }, true);
  window.addEventListener('hashchange', schedule);
  document.addEventListener('DOMContentLoaded', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();
