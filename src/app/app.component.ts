import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';

type TipoComanda = 'manual' | 'digital';
type NivelUrgencia = 'controlable' | 'atencion' | 'alto' | 'critico';
type EquipoId = 'android' | 'ios' | 'pc' | 'impresora-red' | 'impresora-otra' | 'wifi' | 'router' | 'impresora-desconocida';

interface EquipoOpcion {
  id: EquipoId;
  icono: string;
  etiqueta: string;
  detalle: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  menuOpen = false;
  whatsapp = 'https://wa.me/51991602920?text=Hola%20AGNE,%20quisiera%20información%20para%20mi%20negocio.';

  platosDia = 100;
  mozos = 4;
  mesas = 15;
  tipoComanda: TipoComanda = 'manual';
  readonly precioPromedio = 20;
  readonly precioPlanFull = 2500;
  readonly precioArrendamiento = 100;

  readonly equiposOpciones: EquipoOpcion[] = [
    { id: 'android', icono: '📱', etiqueta: 'Celular o tablet Android', detalle: 'Podría reutilizarse como terminal de venta si es compatible.' },
    { id: 'ios', icono: '📲', etiqueta: 'iPhone o iPad', detalle: 'Podría reutilizarse como terminal de venta si es compatible.' },
    { id: 'pc', icono: '💻', etiqueta: 'PC o laptop', detalle: 'Útil para reportes y configuración; no reemplaza el POS móvil.' },
    { id: 'impresora-red', icono: '🧾', etiqueta: 'Impresora Ethernet / red', detalle: 'La opción preferida para cocina o tickets, sujeta a compatibilidad.' },
    { id: 'impresora-otra', icono: '🔌', etiqueta: 'Impresora USB o Bluetooth', detalle: 'La revisamos antes de incluirla como equipo reutilizable.' },
    { id: 'wifi', icono: '📶', etiqueta: 'Internet con WiFi', detalle: 'Permite sincronización y administración remota.' },
    { id: 'router', icono: '🌐', etiqueta: 'Router / red local', detalle: 'Puede aprovecharse si la red es estable y suficiente.' },
    { id: 'impresora-desconocida', icono: '❓', etiqueta: 'Tengo impresora, pero no sé qué conexión usa', detalle: 'La identificamos antes de cotizar hardware.' }
  ];

  private equiposSeleccionados = new Set<EquipoId>();

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }
  wa(message: string) { return `https://wa.me/51991602920?text=${encodeURIComponent(message)}`; }

  actualizarPlatos(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    this.platosDia = this.clamp(Number.isFinite(value) ? value : 10, 10, 2000);
    input.value = String(this.platosDia);
    this.renderConversionBlock();
  }

  actualizarMozos(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    this.mozos = this.clamp(Number.isFinite(value) ? value : 1, 1, 100);
    input.value = String(this.mozos);
    this.renderConversionBlock();
  }

  private actualizarMesas(value: number, input?: HTMLInputElement) {
    this.mesas = this.clamp(Number.isFinite(value) ? value : 1, 1, 500);
    if (input) input.value = String(this.mesas);
    this.renderConversionBlock();
  }

  setTipoComanda(tipo: TipoComanda) {
    this.tipoComanda = tipo;
    this.renderConversionBlock();
  }

  get cargaPorMozo() {
    return this.platosDia / Math.max(this.mozos, 1);
  }

  get cargaPorMesa() {
    return this.platosDia / Math.max(this.mesas, 1);
  }

  private get factorMozos() {
    const carga = this.cargaPorMozo;
    if (carga <= 25) return 0.85;
    if (carga <= 40) return 1;
    if (carga <= 60) return 1.15;
    return 1.3;
  }

  private get factorMesas() {
    const carga = this.cargaPorMesa;
    if (carga <= 4) return 0.85;
    if (carga <= 7) return 1;
    if (carga <= 10) return 1.12;
    return 1.25;
  }

  get factorPresion() {
    // La carga por mozo pesa más porque afecta directamente toma de pedidos y cobro.
    // Las mesas agregan presión de rotación sin crear una pérdida independiente.
    const combinado = (this.factorMozos * 0.70) + (this.factorMesas * 0.30);
    return Math.min(1.30, Math.max(0.85, combinado));
  }

  get pedidosEquivocadosSemana() {
    return Math.round(this.platosDia * 7 * this.tasasActuales.pedidos * this.factorPresion);
  }

  get cobrosOlvidadosSemana() {
    return Math.round(this.platosDia * 7 * this.tasasActuales.cobros * this.factorPresion);
  }

  get ventasPerdidasSemana() {
    return Math.round(this.platosDia * 7 * this.tasasActuales.demoras * this.factorPresion);
  }

  get perdidaMensual() {
    return Math.round(this.calcularPerdidaMensual(this.tipoComanda));
  }

  get perdidaAnual() {
    return this.perdidaMensual * 12;
  }

  get potencialRecuperable() {
    if (this.tipoComanda === 'digital') return 0;
    return Math.max(0, Math.round(this.calcularPerdidaMensual('manual') - this.calcularPerdidaMensual('digital')));
  }

  get mensajeResultado() {
    return this.tipoComanda === 'manual'
      ? 'Una operación mejor controlada podría reducir una parte importante de esta fuga.'
      : 'Ya tienes sistema digital. El siguiente paso es revisar si la operación realmente lo está aprovechando.';
  }

  get nivelUrgencia(): NivelUrgencia {
    if (this.perdidaMensual < 500) return 'controlable';
    if (this.perdidaMensual < 1200) return 'atencion';
    if (this.perdidaMensual < 2500) return 'alto';
    return 'critico';
  }

  get nivelUrgenciaLabel() {
    switch (this.nivelUrgencia) {
      case 'controlable': return 'CONTROLABLE';
      case 'atencion': return 'ATENCIÓN';
      case 'alto': return 'ALTO';
      default: return 'CRÍTICO';
    }
  }

  get nivelUrgenciaEmoji() {
    switch (this.nivelUrgencia) {
      case 'controlable': return '🙂';
      case 'atencion': return '😕';
      case 'alto': return '😟';
      default: return '😣';
    }
  }

  get mensajeUrgencia() {
    switch (this.nivelUrgencia) {
      case 'controlable':
        return 'La fuga estimada todavía es contenida, pero dejarla crecer mes a mes termina convirtiéndola en una pérdida importante.';
      case 'atencion':
        return 'Ya hay suficiente dinero escapándose como para revisar la operación antes de que el problema siga creciendo.';
      case 'alto':
        return 'La fuga estimada ya representa una cantidad importante cada mes. Corregir la operación ahora evita seguir acumulándola.';
      default:
        return 'La fuga estimada ya supera un nivel crítico. Cada semana que pasa puede seguir acumulando dinero que el negocio ya generó.';
    }
  }

  private get tasasActuales() {
    return this.tipoComanda === 'manual'
      ? { pedidos: 0.018, cobros: 0.012, demoras: 0.025 }
      : { pedidos: 0.006, cobros: 0.004, demoras: 0.012 };
  }

  private calcularPerdidaMensual(tipo: TipoComanda) {
    const tasas = tipo === 'manual'
      ? { pedidos: 0.018, cobros: 0.012, demoras: 0.025 }
      : { pedidos: 0.006, cobros: 0.004, demoras: 0.012 };

    const perdidaPorPlato =
      (tasas.pedidos * this.precioPromedio * 0.60) +
      (tasas.cobros * this.precioPromedio * 0.25) +
      (tasas.demoras * this.precioPromedio);

    return this.platosDia * 30 * this.factorPresion * perdidaPorPlato;
  }

  private clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(Math.round(value), min), max);
  }

  private ensureMesasInput() {
    const form = document.querySelector<HTMLElement>('#calculadora .loss-form');
    const command = form?.querySelector<HTMLElement>('.loss-command');
    if (!form || !command || form.querySelector('#mesas-input')) return;

    const label = document.createElement('label');
    label.className = 'mesas-field';
    label.innerHTML = `
      <span>3. ¿Cuántas mesas tiene el restaurante?</span>
      <input id="mesas-input" type="number" min="1" max="500" step="1" value="${this.mesas}" inputmode="numeric">
    `;
    form.insertBefore(label, command);

    const commandTitle = command.querySelector(':scope > span');
    if (commandTitle) commandTitle.textContent = '4. ¿Cómo toman las comandas?';

    const input = label.querySelector<HTMLInputElement>('#mesas-input');
    input?.addEventListener('input', () => this.actualizarMesas(Number(input.value), input));
  }

  private configureCalculatorInputs() {
    const inputs = document.querySelectorAll<HTMLInputElement>('#calculadora .loss-form input[type="number"]');
    const platosInput = inputs.item(0);
    const mozosInput = inputs.item(1);
    const mesasInput = document.querySelector<HTMLInputElement>('#mesas-input');

    const setupStepper = (input: HTMLInputElement | null, min: number, max: number, step: number, label: string) => {
      if (!input) return;

      input.min = String(min);
      input.max = String(max);
      input.step = String(step);

      if (input.parentElement?.querySelector('.number-stepper-controls')) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'number-stepper';
      input.parentNode?.insertBefore(wrapper, input);
      wrapper.appendChild(input);

      const controls = document.createElement('div');
      controls.className = 'number-stepper-controls';

      const up = document.createElement('button');
      up.type = 'button';
      up.className = 'number-stepper-btn';
      up.textContent = '▲';
      up.setAttribute('aria-label', `Aumentar ${label}`);
      up.title = `Aumentar ${step}`;

      const down = document.createElement('button');
      down.type = 'button';
      down.className = 'number-stepper-btn';
      down.textContent = '▼';
      down.setAttribute('aria-label', `Disminuir ${label}`);
      down.title = `Disminuir ${step}`;

      up.addEventListener('click', () => {
        input.stepUp();
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });

      down.addEventListener('click', () => {
        input.stepDown();
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });

      controls.append(up, down);
      wrapper.appendChild(controls);
    };

    setupStepper(platosInput, 10, 2000, 10, 'cantidad de platos');
    setupStepper(mozosInput, 1, 100, 1, 'cantidad de mozos');
    setupStepper(mesasInput, 1, 500, 1, 'cantidad de mesas');
  }

  private ensureRequirementsChecklist() {
    const calculator = document.querySelector('#calculadora');
    const lossBottom = calculator?.querySelector('.loss-bottom');
    if (!calculator || !lossBottom || calculator.querySelector('.requirements-panel')) return;

    const panel = document.createElement('section');
    panel.className = 'requirements-panel';
    panel.innerHTML = `
      <div class="requirements-heading">
        <span class="requirements-eyebrow">APROVECHEMOS LO QUE YA TIENES</span>
        <h2>¿Con qué equipos cuentas actualmente?</h2>
        <p>Marca todas las opciones que correspondan. Con esta información podemos proponerte un paquete sin hacerte comprar equipos que quizá ya podemos reutilizar.</p>
      </div>
      <div class="requirements-grid">
        ${this.equiposOpciones.map(equipo => `
          <label class="requirement-card" data-equipo="${equipo.id}">
            <input type="checkbox" value="${equipo.id}">
            <span class="requirement-check" aria-hidden="true">✓</span>
            <span class="requirement-icon" aria-hidden="true">${equipo.icono}</span>
            <span class="requirement-copy">
              <strong>${equipo.etiqueta}</strong>
              <small>${equipo.detalle}</small>
            </span>
          </label>
        `).join('')}
      </div>
      <div class="requirements-note">La selección no garantiza compatibilidad. AGNE verifica modelo, conexión y estado antes de considerar un equipo reutilizable.</div>
    `;

    lossBottom.before(panel);

    panel.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach(input => {
      input.addEventListener('change', () => {
        const id = input.value as EquipoId;
        if (input.checked) this.equiposSeleccionados.add(id);
        else this.equiposSeleccionados.delete(id);
        input.closest('.requirement-card')?.classList.toggle('selected', input.checked);
        this.renderWhatsappLinks();
      });
    });
  }

  private get equiposSeleccionadosTexto() {
    const seleccionados = this.equiposOpciones.filter(equipo => this.equiposSeleccionados.has(equipo.id));
    if (!seleccionados.length) return '• No indicó equipos todavía';
    return seleccionados.map(equipo => `• ${equipo.etiqueta}`).join('\n');
  }

  private mensajeDiagnosticoWhatsapp(interes?: string) {
    const comanda = this.tipoComanda === 'manual' ? 'Manual / papel' : 'Sistema digital';
    const interesTexto = interes ? `\n\n💬 INTERÉS\n${interes}` : '';

    return `Hola AGNE, hice el diagnóstico en su web y quisiera una propuesta para mi restaurante.\n\n📊 OPERACIÓN\n• Platos vendidos por día: ${this.platosDia}\n• Mozos por turno: ${this.mozos}\n• Mesas: ${this.mesas}\n• Comandas: ${comanda}\n• Carga estimada: ${Math.round(this.cargaPorMozo)} platos por mozo/día\n• Presión por mesa: ${this.cargaPorMesa.toFixed(1)} platos por mesa/día\n\n📉 ESTIMACIÓN\n• Pérdida estimada: S/ ${this.perdidaMensual} al mes\n• Nivel: ${this.nivelUrgenciaLabel}\n\n🧰 EQUIPAMIENTO QUE YA TENGO\n${this.equiposSeleccionadosTexto}${interesTexto}\n\nQuiero aprovechar todo lo compatible que ya tengo y que me indiquen qué equipos realmente me faltan.`;
  }

  private renderWhatsappLinks() {
    const diagnostico = this.mensajeDiagnosticoWhatsapp();
    const analysisLink = document.querySelector<HTMLAnchorElement>('#calculadora .loss-bottom a');
    const fullLink = document.querySelector<HTMLAnchorElement>('.plan-card.plan-full .plan-cta');
    const rentLink = document.querySelector<HTMLAnchorElement>('.plan-card.plan-rent .plan-cta');
    const floating = document.querySelector<HTMLAnchorElement>('.wa-float');
    const contact = document.querySelector<HTMLAnchorElement>('#contacto a');

    if (analysisLink) analysisLink.href = this.wa(diagnostico);
    if (fullLink) fullLink.href = this.wa(this.mensajeDiagnosticoWhatsapp('Quiero información del Plan Full de S/ 2,500.'));
    if (rentLink) rentLink.href = this.wa(this.mensajeDiagnosticoWhatsapp('Quiero información del Plan Mensual de S/ 100.'));

    this.whatsapp = this.wa(diagnostico);
    if (floating) floating.href = this.whatsapp;
    if (contact) contact.href = this.whatsapp;
  }

  private ensureConversionBlock() {
    const calculator = document.querySelector('#calculadora');
    const lossBottom = calculator?.querySelector('.loss-bottom');
    if (!calculator || !lossBottom || calculator.querySelector('.conversion-block')) return;

    const block = document.createElement('div');
    block.className = 'conversion-block';
    block.innerHTML = `
      <section class="urgency-panel" aria-live="polite">
        <div class="urgency-heading">
          <small>NIVEL DE FUGA ESTIMADA</small>
          <div class="urgency-status">
            <span class="urgency-emoji" aria-hidden="true">😟</span>
            <strong class="urgency-label">ALTO</strong>
          </div>
        </div>

        <div class="urgency-meter" aria-label="Medidor del nivel de fuga estimada">
          <div class="urgency-pointer" aria-hidden="true">
            <span>TU NIVEL</span>
            <b>▼</b>
          </div>
          <div class="urgency-scale" aria-hidden="true">
            <span></span><span></span><span></span><span></span>
          </div>
          <div class="urgency-scale-labels" aria-hidden="true">
            <span>CONTROLABLE</span>
            <span>ATENCIÓN</span>
            <span>ALTO</span>
            <span>CRÍTICO</span>
          </div>
        </div>

        <p class="urgency-copy"></p>
        <small class="urgency-note">Estimación referencial basada en los datos ingresados; no constituye una auditoría financiera.</small>
      </section>

      <section id="planes" class="plans-section">
        <div class="plans-heading">
          <span>ELIGE CÓMO EMPEZAR</span>
          <h2>Deja de postergarlo. Empieza a corregir la fuga.</h2>
          <p>Dos modalidades para comenzar según la forma en que quieras invertir en tu operación.</p>
        </div>
        <div class="plans-grid">
          <article class="plan-card plan-full">
            <span class="plan-badge">PAGO ÚNICO · FULL</span>
            <h3>Plan Full</h3>
            <div class="plan-price"><small>S/</small><strong>2,500</strong></div>
            <p class="plan-period">pago único</p>
            <p>Para quienes prefieren realizar una sola inversión y empezar con la modalidad completa.</p>
            <a class="plan-cta plan-cta-primary" href="#" target="_blank" rel="noopener">Quiero el Plan Full →</a>
          </article>

          <article class="plan-card plan-rent">
            <span class="plan-badge">ARRENDAMIENTO MENSUAL</span>
            <h3>Plan Mensual</h3>
            <div class="plan-price"><small>S/</small><strong>100</strong></div>
            <p class="plan-period">al mes</p>
            <p>Para empezar con una inversión mensual mucho más baja y poner la operación en orden desde ahora.</p>
            <a class="plan-cta" href="#" target="_blank" rel="noopener">Quiero empezar por S/ 100 →</a>
          </article>
        </div>
        <small class="plans-note">El hardware se define según compatibilidad y necesidad. Aprovechamos equipos existentes cuando sea técnicamente viable.</small>
      </section>
    `;

    lossBottom.before(block);
    this.renderConversionBlock();
  }

  private renderConversionBlock() {
    const block = document.querySelector<HTMLElement>('.conversion-block');
    if (block) {
      const panel = block.querySelector<HTMLElement>('.urgency-panel');
      const label = block.querySelector<HTMLElement>('.urgency-label');
      const emoji = block.querySelector<HTMLElement>('.urgency-emoji');
      const copy = block.querySelector<HTMLElement>('.urgency-copy');

      if (panel && label && emoji && copy) {
        panel.classList.remove('urgency-controlable', 'urgency-atencion', 'urgency-alto', 'urgency-critico');
        panel.classList.add(`urgency-${this.nivelUrgencia}`);
        label.textContent = this.nivelUrgenciaLabel;
        emoji.textContent = this.nivelUrgenciaEmoji;
        copy.textContent = this.mensajeUrgencia;
      }
    }

    const load = document.querySelector<HTMLElement>('#calculadora .loss-load');
    if (load) {
      load.innerHTML = `
        <span>Carga estimada</span>
        <strong>${Math.round(this.cargaPorMozo)} platos por mozo / día</strong>
        <small>${this.cargaPorMesa.toFixed(1)} platos por mesa / día</small>
      `;
    }

    this.renderWhatsappLinks();
  }

  private injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .number-stepper {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 52px;
        width: 100%;
        min-width: 0;
      }
      .number-stepper input[type="number"] {
        min-width: 0;
        border-radius: 10px 0 0 10px !important;
        border-right: 0 !important;
      }
      .number-stepper-controls {
        display: grid;
        grid-template-rows: 1fr 1fr;
        height: 54px;
      }
      .number-stepper-btn {
        appearance: none;
        -webkit-appearance: none;
        border: 1px solid rgba(255,255,255,.18);
        background: #f57c00;
        color: #fff;
        font: inherit;
        font-size: 11px;
        font-weight: 900;
        line-height: 1;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        transition: background .16s ease, transform .08s ease;
      }
      .number-stepper-btn:first-child { border-radius: 0 10px 0 0; border-bottom: 0; }
      .number-stepper-btn:last-child { border-radius: 0 0 10px 0; }
      .number-stepper-btn:hover { background: #dc6d00; }
      .number-stepper-btn:active { transform: scale(.96); }
      .number-stepper-btn:focus-visible { outline: 3px solid rgba(245,124,0,.3); outline-offset: 2px; z-index: 2; }

      #calculadora .loss-load small {
        display: block;
        margin-top: 4px;
        color: inherit;
        opacity: .78;
        font-size: 12px;
      }

      .requirements-panel {
        margin: 34px 0;
        padding: clamp(22px,4vw,38px);
        border-radius: 24px;
        background: #fff;
        color: #00233f;
        box-shadow: 0 18px 50px rgba(0,35,63,.10);
        border: 1px solid #e5ecef;
      }
      .requirements-heading { max-width: 850px; margin-bottom: 22px; }
      .requirements-eyebrow {
        display: block;
        color: #f57c00;
        font-size: 12px;
        font-weight: 950;
        letter-spacing: 1.7px;
        margin-bottom: 8px;
      }
      .requirements-heading h2 { margin: 0 0 10px; font-size: clamp(26px,3.4vw,40px); }
      .requirements-heading p { margin: 0; line-height: 1.6; color: #526875; }
      .requirements-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0,1fr));
        gap: 12px;
      }
      .requirement-card {
        position: relative;
        display: grid;
        grid-template-columns: 26px 42px minmax(0,1fr);
        gap: 12px;
        align-items: center;
        min-height: 92px;
        padding: 15px;
        border: 2px solid #e5ecef;
        border-radius: 16px;
        background: #fff;
        cursor: pointer;
        transition: border-color .18s ease, background .18s ease, transform .18s ease, box-shadow .18s ease;
      }
      .requirement-card:hover { transform: translateY(-2px); border-color: #f7b56f; box-shadow: 0 8px 22px rgba(0,35,63,.08); }
      .requirement-card.selected { border-color: #f57c00; background: #fff8f0; }
      .requirement-card input { position: absolute; opacity: 0; pointer-events: none; }
      .requirement-check {
        width: 25px;
        height: 25px;
        border: 2px solid #b7c4cb;
        border-radius: 7px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: transparent;
        font-size: 15px;
        font-weight: 950;
        background: #fff;
      }
      .requirement-card.selected .requirement-check { background: #f57c00; border-color: #f57c00; color: #fff; }
      .requirement-icon { font-size: 32px; line-height: 1; text-align: center; }
      .requirement-copy strong { display: block; font-size: 15px; margin-bottom: 4px; }
      .requirement-copy small { display: block; color: #637782; line-height: 1.35; font-size: 12px; }
      .requirements-note {
        margin-top: 16px;
        padding: 12px 14px;
        border-radius: 12px;
        background: #f4f7f8;
        color: #526875;
        font-size: 12px;
        line-height: 1.45;
      }

      .urgency-panel { padding: 30px 30px 24px; }
      .urgency-heading { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 8px; }
      .urgency-heading > small { font-size: 12px; letter-spacing: 1.8px; }
      .urgency-heading .urgency-status { display: flex; align-items: center; justify-content: center; gap: 12px; }
      .urgency-emoji { display: inline-flex; align-items: center; justify-content: center; font-size: clamp(38px, 4.2vw, 56px); line-height: 1; filter: drop-shadow(0 5px 8px rgba(0,0,0,.08)); }
      .urgency-label { font-size: clamp(42px, 5.8vw, 68px); letter-spacing: -2px; text-align: center; }
      .urgency-meter { position: relative; padding-top: 58px; margin: 12px 0 24px; }
      .urgency-scale { margin: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; }
      .urgency-scale > span { height: 16px; }
      .urgency-pointer { position: absolute; top: 0; left: 12.5%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; z-index: 5; transition: left .25s ease; }
      .urgency-pointer span { padding: 7px 11px; border-radius: 999px; background: #00233f; color: #fff; font-size: 10px; line-height: 1; font-weight: 950; letter-spacing: 1px; box-shadow: 0 7px 18px rgba(0,35,63,.18); white-space: nowrap; }
      .urgency-pointer b { display: block; margin-top: 2px; color: var(--urgency); font-size: 32px; line-height: .8; animation: urgencyPointerPulse 1.5s ease-in-out infinite; }
      .urgency-atencion .urgency-pointer { left: 37.5%; }
      .urgency-alto .urgency-pointer { left: 62.5%; }
      .urgency-critico .urgency-pointer { left: 87.5%; }
      .urgency-scale-labels { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; margin-top: 9px; color: #6d7f8b; font-size: 10px; font-weight: 900; letter-spacing: .45px; text-align: center; }
      .urgency-copy { max-width: 920px; margin: 0 auto; text-align: center; font-size: 18px; line-height: 1.55; }
      .urgency-note { margin-top: 15px; text-align: center; }
      @keyframes urgencyPointerPulse { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }

      #giros > div > a { position: relative; overflow: hidden; transform-style: preserve-3d; will-change: transform, box-shadow; transition: transform .28s cubic-bezier(.2,.8,.2,1), box-shadow .28s ease, border-color .28s ease, background .28s ease; }
      #giros > div > a::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(245,124,0,.12), transparent 58%); opacity: 0; transition: opacity .28s ease; pointer-events: none; }
      #giros > div > a:hover { transform: translateY(-9px) scale(1.035); border-color: #f57c00 !important; background: #fffaf4 !important; box-shadow: 0 18px 42px rgba(0,35,63,.16) !important; }
      #giros > div > a:hover::before { opacity: 1; }
      #giros > div > a:hover span { transform: scale(1.16) rotate(-6deg); }
      #giros > div > a span { display: inline-block; transition: transform .28s cubic-bezier(.2,.8,.2,1); }
      #giros > div > a.is-spinning { animation: giroRubro .62s cubic-bezier(.2,.8,.2,1); }
      @keyframes giroRubro { 0% { transform: translateY(-7px) rotateY(0deg) scale(1.03); } 48% { transform: translateY(-7px) rotateY(180deg) scale(1.08); } 100% { transform: translateY(-7px) rotateY(360deg) scale(1.03); } }

      @media (max-width: 700px) {
        .requirements-grid { grid-template-columns: 1fr; }
        .requirement-card { min-height: 82px; grid-template-columns: 26px 38px minmax(0,1fr); padding: 13px; }
      }
      @media (max-width: 560px) {
        .urgency-panel { padding: 24px 16px 20px; }
        .urgency-heading .urgency-status { gap: 8px; }
        .urgency-emoji { font-size: 38px; }
        .urgency-label { font-size: 44px; }
        .urgency-meter { padding-top: 54px; margin-top: 8px; }
        .urgency-scale { gap: 4px; }
        .urgency-scale > span { height: 14px; }
        .urgency-pointer span { font-size: 9px; padding: 6px 8px; }
        .urgency-pointer b { font-size: 28px; }
        .urgency-scale-labels { gap: 3px; font-size: 8px; letter-spacing: 0; }
        .urgency-copy { font-size: 16px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .urgency-pointer b { animation: none; }
        #giros > div > a, #giros > div > a span { transition: none; }
        #giros > div > a.is-spinning { animation: none; }
      }
    `;
    document.head.appendChild(style);
  }

  ngAfterViewInit() {
    const intro = document.querySelector<HTMLElement>('#calculadora .loss-intro p');
    if (intro) intro.textContent = 'Ingresa 4 datos y obtén una estimación rápida de cuánto podrías estar dejando de ganar cada mes por errores, cobros olvidados y ventas que no llegan a concretarse.';

    this.ensureMesasInput();
    this.configureCalculatorInputs();
    this.ensureRequirementsChecklist();
    this.ensureConversionBlock();
    this.injectStyles();
    this.renderConversionBlock();

    const section = document.querySelector('#giros');
    const lead = section?.querySelector('.lead');
    if (lead) lead.textContent = 'Configuramos la solución alrededor de cómo realmente trabajas. Selecciona un rubro.';

    section?.querySelectorAll<HTMLAnchorElement>(':scope > div > a').forEach(card => {
      card.addEventListener('click', event => {
        event.preventDefault();
        card.classList.remove('is-spinning');
        void card.offsetWidth;
        card.classList.add('is-spinning');
        const destination = card.getAttribute('href');
        window.setTimeout(() => {
          card.classList.remove('is-spinning');
          if (destination) document.querySelector(destination)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 560);
      });
    });
  }
}
