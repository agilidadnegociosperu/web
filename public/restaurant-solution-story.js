(() => {
  const STYLE_ID = 'restaurant-solution-story-style';

  const ensureStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .restaurant-mobile-story{display:none}
      @media(max-width:560px){
        .restaurant-solution .hero-copy>.trust,
        .restaurant-solution .hero-copy>.solution-photo,
        .restaurant-solution>.solution-media{display:none!important}
        .restaurant-mobile-story{display:grid;gap:18px;margin-top:24px}
        .restaurant-story-item{display:grid;gap:12px}
        .restaurant-story-copy{margin:0;padding:0 2px;color:#65756e;font-size:18px;line-height:1.5;font-weight:650}
        .restaurant-story-copy strong{color:#3f514b;font-weight:800}
        .restaurant-story-photo{width:100%;overflow:hidden;border-radius:20px;background:#fff;box-shadow:0 14px 34px rgba(0,35,63,.10)}
        .restaurant-story-photo img{display:block;width:100%;height:auto;aspect-ratio:4/5;object-fit:cover;object-position:center}
        .restaurant-story-item:nth-child(1) .restaurant-story-photo img{object-position:center}
        .restaurant-story-item:nth-child(2) .restaurant-story-photo img{object-position:center}
        .restaurant-story-item:nth-child(3) .restaurant-story-photo img{object-position:center}
        .restaurant-story-extra{margin:-4px 2px 0;color:#65756e;font-size:16px;line-height:1.45;font-weight:650}
      }
    `;
    document.head.appendChild(style);
  };

  const buildStory = () => {
    if (!location.hash.toLowerCase().includes('restaurante')) return;
    const section = document.querySelector('.restaurant-solution');
    const heroCopy = section?.querySelector('.hero-copy');
    if (!section || !heroCopy || heroCopy.querySelector('.restaurant-mobile-story')) return;

    const intro = heroCopy.querySelector(':scope > p');
    if (!intro) return;

    const story = document.createElement('div');
    story.className = 'restaurant-mobile-story';
    story.innerHTML = `
      <div class="restaurant-story-item">
        <p class="restaurant-story-copy">✓ <strong>Pedidos claros:</strong> menos errores y olvidos</p>
        <div class="restaurant-story-photo"><img src="restaurantes/08_chef_celebra.png" alt="Cocinero recibiendo una comanda clara en cocina" loading="lazy"></div>
      </div>
      <div class="restaurant-story-item">
        <p class="restaurant-story-copy">✓ <strong>Mejor atención:</strong> más rapidez para el cliente</p>
        <div class="restaurant-story-photo"><img src="restaurantes/07_Pedido_feliz_cevicheria.png" alt="Azafata tomando un pedido con una tablet" loading="lazy"></div>
      </div>
      <div class="restaurant-story-item">
        <p class="restaurant-story-copy">✓ <strong>Ventas registradas:</strong> cuentas que sí cuadran</p>
        <div class="restaurant-story-photo"><img src="restaurantes/09_dueño_feliz.png" alt="Dueño revisando ingresos desde su celular" loading="lazy"></div>
        <p class="restaurant-story-extra">✓ Controla tus ingresos desde tu celular.</p>
      </div>
    `;

    intro.insertAdjacentElement('afterend', story);
  };

  const sync = () => {
    ensureStyles();
    buildStory();
  };

  document.addEventListener('DOMContentLoaded', sync);
  window.addEventListener('hashchange', () => requestAnimationFrame(sync));
  new MutationObserver(() => requestAnimationFrame(sync)).observe(document.documentElement, { childList: true, subtree: true });
})();
