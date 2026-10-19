import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';

type TipoComanda = 'manual' | 'digital';

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

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }
  wa(message: string) { return `https://wa.me/51991602920?text=${encodeURIComponent(message)}`; }

  actualizarPlatos(event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    this.platosDia = this.clamp(Number.isFinite(value) ? value : 1, 1, 2000);
  }

  actualizarMozos(event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    this.mozos = this.clamp(Number.isFinite(value) ? value : 1, 1, 100);
  }

  setTipoComanda(tipo: TipoComanda) {
    this.tipoComanda = tipo;
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

  get potencialRecuperable() {
    if (this.tipoComanda === 'digital') return 0;
    return Math.max(0, Math.round(this.calcularPerdidaMensual('manual') - this.calcularPerdidaMensual('digital')));
  }

  get mensajeResultado() {
    return this.tipoComanda === 'manual'
      ? 'Una operación mejor controlada podría reducir una parte importante de esta fuga.'
      : 'Ya tienes sistema digital. El siguiente paso es revisar si la operación realmente lo está aprovechando.';
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

  ngAfterViewInit() {
    const section = document.querySelector('#giros');
    const lead = section?.querySelector('.lead');
    if (lead) lead.textContent = 'Configuramos la solución alrededor de cómo realmente trabajas. Selecciona un rubro.';

    const style = document.createElement('style');
    style.textContent = `
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
