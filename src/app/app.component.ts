import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  menuOpen = false;
  whatsapp = 'https://wa.me/51991602920?text=Hola%20AGNE,%20quisiera%20información%20para%20mi%20negocio.';

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }
  wa(message: string) { return `https://wa.me/51991602920?text=${encodeURIComponent(message)}`; }

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
