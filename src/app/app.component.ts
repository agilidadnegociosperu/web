import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';

type TipoComanda = 'manual' | 'digital';
type NivelUrgencia = 'controlable' | 'atencion' | 'alto' | 'critico';

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
  tipoComanda: TipoComanda = 'manual';
  readonly precioPromedio = 30;
  readonly precioPlanFull = 2500;
  readonly precioArrendamiento = 100;

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

  setTipoComanda(tipo: TipoComanda) {
    this.tipoComanda = tipo;
    this.renderConversionBlock();
  }

  get cargaPorMozo() {
    return this.platosDia / Math.max(this.mozos, 1);
  }

  get factorPresion() {
    const carga = this.cargaPorMozo;
    if (carga <= 25) return 0.85;
    if (carga <= 40) return 1;
    if (carga <= 60) return 1.15;
    return 1.3;
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

  get perdidaDiaria() {
    return this.perdidaMensual / 30;
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

  get diasEquivalentePlanFull() {
    if (this.perdidaDiaria <= 0) return 0;
    return Math.max(1, Math.ceil(this.precioPlanFull / this.perdidaDiaria));
  }

  get mensualidadesEquivalentes() {
    return Math.max(0, Math.round(this.perdidaMensual / this.precioArrendamiento));
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

  private configureCalculatorInputs() {
    const inputs = document.querySelectorAll<HTMLInputElement>('#calculadora .loss-form input[type="number"]');
    const platosInput = inputs.item(0);
    const mozosInput = inputs.item(1);

    const setupStepper = (input: HTMLInputElement | null, min: number, max: number, step: number, label: string) => {
      if (!input) return;

      input.min = String(min);
      input.max = String(max);
      input.step = String(step);

      if (input.parentElement?.querySelector('.number-stepper')) return;

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
          <div>
            <small>NIVEL DE FUGA ESTIMADA</small>
            <strong class="urgency-label">CRÍTICO</strong>
          </div>
          <span class="urgency-dot" aria-hidden="true"></span>
        </div>
        <div class="urgency-scale" aria-hidden="true">
          <span></span><span></span><span></span><span></span>
          <i class="urgency-marker"></i>
        </div>
        <p class="urgency-copy"></p>
        <div class="urgency-comparison">
          <strong class="full-equivalent"></strong>
          <span class="rent-equivalent"></span>
        </div>
        <small class="urgency-note">Comparación referencial basada en el resultado de esta calculadora; no constituye una auditoría financiera.</small>
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
            <a class="plan-cta plan-cta-primary" href="${this.wa('Hola AGNE, vi la calculadora de pérdidas y quiero información del Plan Full de S/ 2,500.') }" target="_blank" rel="noopener">Quiero el Plan Full →</a>
          </article>

          <article class="plan-card plan-rent">
            <span class="plan-badge">ARRENDAMIENTO MENSUAL</span>
            <h3>Plan Mensual</h3>
            <div class="plan-price"><small>S/</small><strong>100</strong></div>
            <p class="plan-period">al mes</p>
            <p>Para empezar con una inversión mensual mucho más baja y poner la operación en orden desde ahora.</p>
            <a class="plan-cta" href="${this.wa('Hola AGNE, vi la calculadora de pérdidas y quiero información del arrendamiento de S/ 100 mensuales.') }" target="_blank" rel="noopener">Quiero empezar por S/ 100 →</a>
          </article>
        </div>
        <small class="plans-note">Consulta por WhatsApp el alcance, condiciones y qué incluye cada modalidad.</small>
      </section>
    `;

    lossBottom.before(block);
    this.renderConversionBlock();
  }

  private renderConversionBlock() {
    const block = document.querySelector<HTMLElement>('.conversion-block');
    if (!block) return;

    const panel = block.querySelector<HTMLElement>('.urgency-panel');
    const label = block.querySelector<HTMLElement>('.urgency-label');
    const copy = block.querySelector<HTMLElement>('.urgency-copy');
    const fullEquivalent = block.querySelector<HTMLElement>('.full-equivalent');
    const rentEquivalent = block.querySelector<HTMLElement>('.rent-equivalent');

    if (!panel || !label || !copy || !fullEquivalent || !rentEquivalent) return;

    panel.classList.remove('urgency-controlable', 'urgency-atencion', 'urgency-alto', 'urgency-critico');
    panel.classList.add(`urgency-${this.nivelUrgencia}`);
    label.textContent = this.nivelUrgenciaLabel;
    copy.textContent = this.mensajeUrgencia;

    fullEquivalent.textContent = this.diasEquivalentePlanFull > 0
      ? `A este ritmo estimado, en ${this.diasEquivalentePlanFull} días la fuga podría equivaler a S/ 2,500.`
      : 'Revisa tu operación antes de que la fuga aumente.';

    rentEquivalent.textContent = this.mensualidadesEquivalentes > 0
      ? `La fuga mensual estimada equivale a unas ${this.mensualidadesEquivalentes} mensualidades de S/ 100.`
      : 'El plan mensual permite empezar con S/ 100 al mes.';
  }

  ngAfterViewInit() {
    this.configureCalculatorInputs();
    this.ensureConversionBlock();

    const section = document.querySelector('#giros');
    const lead = section?.querySelector('.lead');
    if (lead) lead.textContent = 'Configuramos la solución alrededor de cómo realmente trabajas. Selecciona un rubro.';

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
      .number-stepper-btn:first-child {
        border-radius: 0 10px 0 0;
        border-bottom: 0;
      }
      .number-stepper-btn:last-child {
        border-radius: 0 0 10px 0;
      }
      .number-stepper-btn:hover { background: #dc6d00; }
      .number-stepper-btn:active { transform: scale(.96); }
      .number-stepper-btn:focus-visible {
        outline: 3px solid rgba(245,124,0,.3);
        outline-offset: 2px;
        z-index: 2;
      }
      #giros > div > a {
        position: relative;
        overflow: hidden;
        transform-style: preserve-3d;
        will-change: transform, box-shadow;
        transition: transform .28s cubic-bezier(.2,.8,.2,1), box-shadow .28s ease, border-color .28s ease, background .28s ease;
      }
      #giros > div > a::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(245,124,0,.12), transparent 58%);
        opacity: 0;
        transition: opacity .28s ease;
        pointer-events: none;
      }
      #giros > div > a:hover {
        transform: translateY(-9px) scale(1.035);
        border-color: #f57c00 !important;
        background: #fffaf4 !important;
        box-shadow: 0 18px 42px rgba(0,35,63,.16) !important;
      }
      #giros > div > a:hover::before { opacity: 1; }
      #giros > div > a:hover span {
        transform: scale(1.16) rotate(-6deg);
      }
      #giros > div > a span {
        display: inline-block;
        transition: transform .28s cubic-bezier(.2,.8,.2,1);
      }
      #giros > div > a.is-spinning {
        animation: giroRubro .62s cubic-bezier(.2,.8,.2,1);
      }
      @keyframes giroRubro {
        0% { transform: translateY(-7px) rotateY(0deg) scale(1.03); }
        48% { transform: translateY(-7px) rotateY(180deg) scale(1.08); }
        100% { transform: translateY(-7px) rotateY(360deg) scale(1.03); }
      }
      @media (prefers-reduced-motion: reduce) {
        #giros > div > a, #giros > div > a span { transition: none; }
        #giros > div > a.is-spinning { animation: none; }
      }
    `;
    document.head.appendChild(style);

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
