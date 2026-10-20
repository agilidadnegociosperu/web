(() => {
  let initialized = false;
  let rubro = null;

  const WA_NUMBER = '51991602920';
  const wa = (message) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

  const clamp = (value, min, max) => Math.min(Math.max(Number.isFinite(value) ? Math.round(value) : min, min), max);

  const init = () => {
    if (initialized) return;
    const calculator = document.querySelector('#calculadora');
    const requirements = calculator?.querySelector('.requirements-panel');
    const lossBottom = calculator?.querySelector('.loss-bottom');
    if (!calculator || !requirements || !lossBottom) return;

    initialized = true;

    // La antigua grilla de giros repetía la navegación y las secciones detalladas.
    document.querySelector('#giros')?.remove();

    const style = document.createElement('style');
    style.textContent = `
      .agne-rubro-gate{padding:10px 0 28px;text-align:center}
      .agne-rubro-gate .gate-eyebrow{display:block;font-size:12px;font-weight:950;letter-spacing:1.8px;color:#f57c00;margin-bottom:8px}
      .agne-rubro-gate h1{margin:0 auto 10px;max-width:900px;font-size:clamp(30px,4.8vw,58px);line-height:1.02;color:inherit}
      .agne-rubro-gate>p{margin:0 auto 22px;max-width:760px;line-height:1.6;opacity:.82}
      .agne-rubro-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;max-width:920px;margin:0 auto}
      .agne-rubro-option{appearance:none;border:2px solid rgba(255,255,255,.24);border-radius:22px;padding:22px;background:rgba(255,255,255,.08);color:inherit;text-align:left;cursor:pointer;min-height:150px;display:grid;grid-template-columns:58px minmax(0,1fr);gap:16px;align-items:center;transition:.18s ease}
      .agne-rubro-option:hover,.agne-rubro-option.active{transform:translateY(-3px);border-color:#f57c00;background:rgba(245,124,0,.13)}
      .agne-rubro-option:focus-visible{outline:3px solid rgba(245,124,0,.35);outline-offset:3px}
      .agne-rubro-icon{font-size:46px;line-height:1}
      .agne-rubro-option strong{display:block;font-size:clamp(20px,2.6vw,29px);margin-bottom:5px}
      .agne-rubro-option small{display:block;line-height:1.45;opacity:.8;font-size:13px}
      .agne-rubro-hint{margin-top:15px!important;font-size:12px;opacity:.65!important}

      .ferreteria-diagnostico{margin:10px 0 28px}
      .ferreteria-intro{text-align:center;max-width:850px;margin:0 auto 24px}
      .ferreteria-intro .eyebrow{display:block;color:#f57c00;font-size:12px;font-weight:950;letter-spacing:1.7px;margin-bottom:8px}
      .ferreteria-intro h2{margin:0 0 9px;font-size:clamp(28px,4vw,46px)}
      .ferreteria-intro p{margin:0;line-height:1.6;opacity:.8}
      .ferreteria-layout{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(280px,.95fr);gap:18px;align-items:stretch}
      .ferreteria-form,.ferreteria-result{border-radius:22px;padding:clamp(20px,3vw,30px);background:#fff;color:#00233f;border:1px solid #e5ecef;box-shadow:0 15px 40px rgba(0,35,63,.09)}
      .ferreteria-form label{display:block;margin-bottom:18px}
      .ferreteria-form label>span,.ferreteria-form fieldset legend{display:block;font-weight:900;margin-bottom:8px}
      .ferreteria-form input[type=number]{width:100%;box-sizing:border-box;min-height:52px;border:1px solid #cdd9df;border-radius:11px;padding:0 14px;font:inherit;color:#00233f;background:#fff}
      .ferreteria-form fieldset{border:0;padding:0;margin:0}
      .stock-mode{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
      .stock-mode label{margin:0;position:relative}
      .stock-mode input{position:absolute;opacity:0}
      .stock-mode span{display:flex;align-items:center;justify-content:center;min-height:48px;border:2px solid #d9e2e6;border-radius:11px;padding:8px 10px;text-align:center;font-weight:850;cursor:pointer}
      .stock-mode input:checked+span{border-color:#f57c00;background:#fff5ea;color:#a84e00}
      .ferreteria-result{display:flex;flex-direction:column;justify-content:center;text-align:center}
      .ferreteria-result small{font-weight:900;letter-spacing:1.2px;color:#667d89}
      .ferreteria-level{font-size:clamp(40px,5vw,64px);line-height:1;font-weight:950;margin:10px 0 12px;color:#f57c00}
      .ferreteria-result p{margin:0 auto 18px;max-width:520px;line-height:1.55;color:#526875}
      .ferreteria-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:auto}
      .ferreteria-metrics div{padding:12px 8px;border-radius:12px;background:#f4f7f8}
      .ferreteria-metrics b{display:block;font-size:19px}
      .ferreteria-metrics span{display:block;font-size:11px;color:#687d87;margin-top:3px}
      .ferreteria-cta{display:flex;justify-content:center;margin-top:18px}
      .ferreteria-cta a{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:0 22px;border-radius:12px;background:#f57c00;color:#fff;text-decoration:none;font-weight:950;text-align:center}
      .ferreteria-disclaimer{display:block;margin-top:12px;text-align:center;font-size:11px;opacity:.7}
      .scanner-extra{display:none}
      .rubro-ferreteria .scanner-extra{display:grid}

      @media(max-width:720px){
        .agne-rubro-options,.ferreteria-layout{grid-template-columns:1fr}
        .agne-rubro-option{min-height:126px;padding:17px;grid-template-columns:48px minmax(0,1fr)}
        .agne-rubro-icon{font-size:38px}
        .ferreteria-metrics{grid-template-columns:1fr}
      }
    `;
    document.head.appendChild(style);

    const gate = document.createElement('section');
    gate.className = 'agne-rubro-gate';
    gate.innerHTML = `
      <span class="gate-eyebrow">DIAGNÓSTICO AGNE</span>
      <h1>¿Qué tipo de negocio quieres analizar?</h1>
      <p>Elige tu rubro. No medimos igual un restaurante que una ferretería: cada operación tiene problemas y variables distintas.</p>
      <div class="agne-rubro-options">
        <button type="button" class="agne-rubro-option" data-rubro="restaurante">
          <span class="agne-rubro-icon" aria-hidden="true">🍽️</span>
          <span><strong>Restaurante / Cevichería</strong><small>Pedidos, mesas, mozos, comandas, demoras y cobros olvidados.</small></span>
        </button>
        <button type="button" class="agne-rubro-option" data-rubro="ferreteria">
          <span class="agne-rubro-icon" aria-hidden="true">🔧</span>
          <span><strong>Ferretería</strong><small>Catálogo amplio, movimiento de productos, stock básico y control de ventas.</small></span>
        </button>
      </div>
      <p class="agne-rubro-hint">Puedes cambiar de rubro en cualquier momento.</p>
    `;
    calculator.prepend(gate);

    const ferreteria = document.createElement('section');
    ferreteria.className = 'ferreteria-diagnostico';
    ferreteria.hidden = true;
    ferreteria.innerHTML = `
      <div class="ferreteria-intro">
        <span class="eyebrow">DIAGNÓSTICO RÁPIDO · FERRETERÍAS</span>
        <h2>¿Qué tan difícil se está volviendo controlar tu ferretería?</h2>
        <p>No estimamos pérdidas inventadas. Medimos la complejidad operativa según el tamaño de tu catálogo, movimiento diario y forma actual de controlar el stock.</p>
      </div>
      <div class="ferreteria-layout">
        <div class="ferreteria-form">
          <label>
            <span>1. ¿Cuántos productos diferentes manejas aproximadamente?</span>
            <input id="fer-productos" type="number" min="10" max="50000" step="50" value="1000" inputmode="numeric">
          </label>
          <label>
            <span>2. ¿Cuántas ventas o tickets haces al día aproximadamente?</span>
            <input id="fer-ventas" type="number" min="1" max="5000" step="5" value="40" inputmode="numeric">
          </label>
          <fieldset>
            <legend>3. ¿Cómo controlas actualmente el stock?</legend>
            <div class="stock-mode">
              <label><input type="radio" name="fer-stock" value="manual" checked><span>📝 Manual / memoria / Excel</span></label>
              <label><input type="radio" name="fer-stock" value="digital"><span>📱 Sistema digital</span></label>
            </div>
          </fieldset>
        </div>
        <div class="ferreteria-result" aria-live="polite">
          <small>COMPLEJIDAD OPERATIVA ESTIMADA</small>
          <div class="ferreteria-level">ATENCIÓN</div>
          <p class="ferreteria-copy"></p>
          <div class="ferreteria-metrics">
            <div><b class="fer-metric-productos">1,000</b><span>productos aprox.</span></div>
            <div><b class="fer-metric-ventas">40</b><span>ventas / día</span></div>
            <div><b class="fer-metric-control">MANUAL</b><span>control actual</span></div>
          </div>
        </div>
      </div>
      <div class="ferreteria-cta"><a href="#" target="_blank" rel="noopener">Quiero ordenar mi ferretería →</a></div>
      <small class="ferreteria-disclaimer">Diagnóstico orientativo. AGNE trabaja con ventas y stock básico por producto; no ofrecemos inventario avanzado ni control de materias primas.</small>
    `;
    requirements.before(ferreteria);

    const scannerCard = document.createElement('label');
    scannerCard.className = 'requirement-card scanner-extra';
    scannerCard.innerHTML = `
      <input type="checkbox" value="lector-codigo-barras">
      <span class="requirement-check" aria-hidden="true">✓</span>
      <span class="requirement-icon" aria-hidden="true">🔎</span>
      <span class="requirement-copy"><strong>Lector de códigos de barras</strong><small>Lo revisamos para confirmar compatibilidad y aprovecharlo si es posible.</small></span>
    `;
    requirements.querySelector('.requirements-grid')?.appendChild(scannerCard);
    scannerCard.querySelector('input')?.addEventListener('change', (event) => {
      const input = event.currentTarget;
      scannerCard.classList.toggle('selected', input.checked);
      setTimeout(updateWhatsappLinks, 0);
    });

    const restaurantNodes = [
      calculator.querySelector('.loss-intro'),
      calculator.querySelector('.loss-layout'),
      calculator.querySelector('.loss-breakdown'),
      calculator.querySelector('.loss-bottom'),
      calculator.querySelector('.loss-disclaimer')
    ].filter(Boolean);
    const conversion = calculator.querySelector('.conversion-block');
    const urgency = conversion?.querySelector('.urgency-panel');
    const plans = conversion?.querySelector('.plans-section');

    const planTitle = plans?.querySelector('.plans-heading h2');
    const planCopy = plans?.querySelector('.plans-heading p');
    const originalPlanTitle = planTitle?.textContent || '';
    const originalPlanCopy = planCopy?.textContent || '';

    const setVisibility = (element, visible) => {
      if (!element) return;
      element.style.display = visible ? '' : 'none';
    };

    const readEquipment = () => {
      const selected = [...requirements.querySelectorAll('input[type="checkbox"]:checked')]
        .map((input) => input.closest('.requirement-card')?.querySelector('.requirement-copy strong')?.textContent?.trim())
        .filter(Boolean);
      return selected.length ? selected.map((item) => `• ${item}`).join('\n') : '• No indicó equipos todavía';
    };

    const restaurantMessage = () => {
      const numberInputs = calculator.querySelectorAll('.loss-form input[type="number"]');
      const platos = numberInputs[0]?.value || '-';
      const mozos = numberInputs[1]?.value || '-';
      const mesas = calculator.querySelector('#mesas-input')?.value || '-';
      const comanda = calculator.querySelector('.loss-command-options button.active')?.textContent?.trim() || '-';
      const perdida = calculator.querySelector('.loss-money')?.textContent?.trim() || '-';
      return `Hola AGNE, hice el diagnóstico para mi restaurante/cevichería.\n\n📊 OPERACIÓN\n• Platos vendidos por día: ${platos}\n• Mozos por turno: ${mozos}\n• Mesas: ${mesas}\n• Comandas: ${comanda}\n\n📉 ESTIMACIÓN\n• Pérdida mensual mostrada: ${perdida}\n\n🧰 EQUIPAMIENTO QUE YA TENGO\n${readEquipment()}\n\nQuiero aprovechar lo compatible que ya tengo y saber qué equipos realmente me faltan.`;
    };

    const ferreteriaData = () => {
      const productosInput = ferreteria.querySelector('#fer-productos');
      const ventasInput = ferreteria.querySelector('#fer-ventas');
      const productos = clamp(Number(productosInput.value), 10, 50000);
      const ventas = clamp(Number(ventasInput.value), 1, 5000);
      productosInput.value = productos;
      ventasInput.value = ventas;
      const control = ferreteria.querySelector('input[name="fer-stock"]:checked')?.value || 'manual';
      return { productos, ventas, control };
    };

    const complexity = () => {
      const { productos, ventas, control } = ferreteriaData();
      let score = productos > 3000 ? 3 : productos > 1000 ? 2 : productos > 300 ? 1 : 0;
      score += ventas > 150 ? 3 : ventas > 60 ? 2 : ventas > 20 ? 1 : 0;
      if (control === 'manual') score += 2;
      if (score <= 2) return ['CONTROLABLE', 'Tu operación todavía puede manejarse con relativa facilidad, pero conviene ordenar la información antes de que el catálogo y las ventas sigan creciendo.'];
      if (score <= 4) return ['ATENCIÓN', 'Ya hay suficiente volumen de productos y movimiento diario como para que depender de memoria, papel o archivos separados empiece a generar puntos ciegos.'];
      if (score <= 6) return ['ALTA', 'Tu catálogo y movimiento ya justifican centralizar ventas y stock básico para saber qué productos se mueven y cuáles requieren revisión.'];
      return ['CRÍTICA', 'El volumen operativo ya es muy alto para depender de controles dispersos. Necesitas ordenar ventas, productos y stock básico para reducir errores y tiempo perdido.'];
    };

    const ferreteriaMessage = () => {
      const { productos, ventas, control } = ferreteriaData();
      const [nivel] = complexity();
      return `Hola AGNE, hice el diagnóstico para mi ferretería.\n\n🔧 OPERACIÓN\n• Productos diferentes aprox.: ${productos}\n• Ventas/tickets por día: ${ventas}\n• Control de stock actual: ${control === 'manual' ? 'Manual / memoria / Excel' : 'Sistema digital'}\n• Complejidad estimada: ${nivel}\n\n🧰 EQUIPAMIENTO QUE YA TENGO\n${readEquipment()}\n\nQuiero reutilizar todo lo compatible posible y que me propongan un paquete ajustado a mi operación.`;
    };

    const renderFerreteria = () => {
      const { productos, ventas, control } = ferreteriaData();
      const [nivel, copy] = complexity();
      ferreteria.querySelector('.ferreteria-level').textContent = nivel;
      ferreteria.querySelector('.ferreteria-copy').textContent = copy;
      ferreteria.querySelector('.fer-metric-productos').textContent = productos.toLocaleString('es-PE');
      ferreteria.querySelector('.fer-metric-ventas').textContent = ventas.toLocaleString('es-PE');
      ferreteria.querySelector('.fer-metric-control').textContent = control === 'manual' ? 'MANUAL' : 'DIGITAL';
      updateWhatsappLinks();
    };

    const updateWhatsappLinks = () => {
      if (!rubro) return;
      const message = rubro === 'restaurante' ? restaurantMessage() : ferreteriaMessage();
      const primary = rubro === 'restaurante'
        ? calculator.querySelector('.loss-bottom a')
        : ferreteria.querySelector('.ferreteria-cta a');
      if (primary) primary.href = wa(message);

      if (plans) {
        const full = plans.querySelector('.plan-full .plan-cta');
        const monthly = plans.querySelector('.plan-rent .plan-cta');
        if (full) full.href = wa(`${message}\n\n💬 INTERÉS\nQuiero información del Plan Full de S/ 2,500.`);
        if (monthly) monthly.href = wa(`${message}\n\n💬 INTERÉS\nQuiero información del Plan Mensual de S/ 100.`);
      }

      const floating = document.querySelector('.wa-float');
      const contact = document.querySelector('#contacto a');
      if (floating) floating.href = wa(message);
      if (contact) contact.href = wa(message);
    };

    const selectRubro = (next) => {
      rubro = next;
      calculator.classList.toggle('rubro-restaurante', next === 'restaurante');
      calculator.classList.toggle('rubro-ferreteria', next === 'ferreteria');
      gate.querySelectorAll('.agne-rubro-option').forEach((button) => button.classList.toggle('active', button.dataset.rubro === next));

      restaurantNodes.forEach((node) => setVisibility(node, next === 'restaurante'));
      ferreteria.hidden = next !== 'ferreteria';
      setVisibility(requirements, true);
      setVisibility(conversion, true);

      if (urgency) setVisibility(urgency, next === 'restaurante');
      if (plans) setVisibility(plans, true);

      if (next === 'ferreteria') {
        if (planTitle) planTitle.textContent = 'Empieza a ordenar tu ferretería sin comprar de más.';
        if (planCopy) planCopy.textContent = 'Primero aprovechamos el equipamiento compatible que ya tienes y cotizamos solo lo que realmente haga falta.';
        renderFerreteria();
      } else {
        if (planTitle) planTitle.textContent = originalPlanTitle;
        if (planCopy) planCopy.textContent = originalPlanCopy;
        updateWhatsappLinks();
      }
    };

    gate.querySelectorAll('.agne-rubro-option').forEach((button) => {
      button.addEventListener('click', () => {
        selectRubro(button.dataset.rubro);
        const target = rubro === 'restaurante' ? calculator.querySelector('.loss-intro') : ferreteria;
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    ferreteria.addEventListener('input', renderFerreteria);
    ferreteria.addEventListener('change', renderFerreteria);
    requirements.addEventListener('change', () => setTimeout(updateWhatsappLinks, 0));
    calculator.addEventListener('input', () => rubro === 'restaurante' && setTimeout(updateWhatsappLinks, 0));
    calculator.addEventListener('click', () => rubro === 'restaurante' && setTimeout(updateWhatsappLinks, 0));

    // Entrada neutral: primero se elige el rubro.
    restaurantNodes.forEach((node) => setVisibility(node, false));
    setVisibility(requirements, false);
    setVisibility(conversion, false);
    ferreteria.hidden = true;
  };

  const observer = new MutationObserver(() => {
    init();
    if (initialized) observer.disconnect();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  init();
})();