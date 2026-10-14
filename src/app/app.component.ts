import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {
  menuOpen = false;
  whatsapp = 'https://wa.me/51991602920?text=Hola%20AGNE,%20quisiera%20información%20para%20mi%20negocio.';

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }
  wa(message: string) { return `https://wa.me/51991602920?text=${encodeURIComponent(message)}`; }

  animateCard(event: MouseEvent) {
    const card = event.currentTarget as HTMLElement;
    card.classList.remove('is-spinning');
    void card.offsetWidth;
    card.classList.add('is-spinning');
    setTimeout(() => card.classList.remove('is-spinning'), 620);
  }
}
