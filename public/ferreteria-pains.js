(() => {
  const STYLE_ID = 'ferreteria-problems-style';
  const SECTION_ID = 'ferreteria-problemas';

  const problems = [
    {
      number: '01',
      title: 'Dueño esclavo',
      image: 'ferreterias/dueno-esclavo.webp',
      alt: 'Dueño de ferretería sobrecargado porque todo depende de él'
    },
    {
      number: '02',
      title: 'Stock desordenado',
      image: 'ferreterias/stock-desordenado.webp',
      alt: 'Ferretería con stock desordenado y dificultad para encontrar productos'
    },
    {
      number: '03',
      title: 'Ventas perdidas',
      image: 'ferreterias/ventas-perdidas.webp',
      alt: 'Cliente retirándose de una ferretería porque no encontraron el producto'
    },
    {
      number: '04',
      title: 'Compras a ciegas',
      image: 'ferreterias/compras-a-ciegas.webp',
      alt: 'Dueño de ferretería revisando compras sin saber qué productos rotan'
    },
    {
      number: '05',
      title: 'Dinero dormido',
      image: 'ferreterias/Dinero%20Dormido%20en%20la%20Ferreter%C3%ADa.png',
      alt: 'Producto de ferretería de baja rotación que representa dinero inmovilizado'
    }
  ];

  const isFerreteriaRoute = () => {
    const path = location.pathname.toLowerCase();
    const hash = location.hash.toLowerCase();
    return /\/ferreterias\/?$/.test(path) || hash.includes('ferreter');
  };

  const addStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .page-hero.fer-page-hero{display:block!important;grid-template-columns:1fr!important;gap:0!important;padding-bottom:42px!important}
      .page-hero.fer-page-hero>div:first-child{max-width:1180px!important}
      .page-hero.fer-page-hero .page-hero-icon,.page-hero.fer-page-hero .fer-hero-image{display:none!important}
      .fer-problems{padding:18px max(7vw,28px) 72px;background:#fff}
      .fer-problems-inner{max-width:1180px;margin:0 auto}
      .fer-problems-head{max-width:820px;margin:0 0 34px}
      .fer-problems-head .eyebrow{display:block;margin-bottom:10px}
      .fer-problems-head h2{margin:0 0 12px;color:#00233f;font-size:clamp(36px,5vw,62px);line-height:1;letter-spacing:-2.5px}
      .fer-problems-head p{margin:0;color:#5f727d;font-size:17px;line-height:1.6}
      .fer-problem{display:grid;grid-template-columns:minmax(170px,220px) minmax(0,1fr);gap:38px;align-items:center;margin:18px 0;padding:26px;border:1px solid #e4eaed;border-radius:24px;background:#fff;box-shadow:0 16px 42px rgba(0,35,63,.07)}
      .fer-problem.is-reverse{grid-template-columns:minmax(0,1fr) minmax(170px,220px)}
      .fer-problem.is-reverse .fer-problem-media{order:2}
      .fer-problem.is-reverse .fer-problem-copy{order:1}
      .fer-problem-media{display:flex;justify-content:center}
      .fer-problem-media img{display:block;width:100%;max-width:220px;height:auto;aspect-ratio:9/16;object-fit:cover;border-radius:18px;box-shadow:0 14px 34px rgba(0,0,0,.12);background:#eef2f4}
      .fer-problem-copy{max-width:720px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center}
      .fer-problem-number{display:inline-flex;align-items:center;justify-content:center;min-width:48px;height:29px;padding:0 10px;border-radius:999px;background:#00233f;color:#fff;font-size:11px;font-weight:950;letter-spacing:1.2px}
      .fer-problem h3{margin:12px 0 0;color:#00233f;font-size:clamp(30px,4vw,46px);line-height:1;letter-spacing:-1.8px}
      .fer-problem:first-of-type{border-color:#f0b37d;background:linear-gradient(135deg,#fff9f2 0%,#fff 58%)}
      .fer-problem:first-of-type .fer-problem-number{background:#f57c00}
      @media(max-width:700px){
        .page-hero.fer-page-hero{padding-bottom:30px!important}
        .fer-problems{padding:8px 18px 52px}
        .fer-problems-head{margin-bottom:24px}
        .fer-problems-head h2{font-size:38px;letter-spacing:-1.8px}
        .fer-problems-head p{font-size:15px}
        .fer-problem,.fer-problem.is-reverse{grid-template-columns:1fr;gap:20px;padding:18px;margin:14px 0;border-radius:20px}
        .fer-problem.is-reverse .fer-problem-media,.fer-problem.is-reverse .fer-problem-copy{order:initial}
        .fer-problem-media img{max-width:220px}
        .fer-problem h3{font-size:32px;letter-spacing:-1.2px}
      }
    `;
    document.head.appendChild(style);
  };

  const findHero = () => Array.from(document.querySelectorAll('.page-hero')).find(section => {
    const text = (section.textContent || '').toLowerCase();
    return text.includes('ferreterías') && text.includes('plata no se quede dormida');
  });

  const mount = () => {
    if (!isFerreteriaRoute()) return;
    addStyles();

    const hero = findHero();
    const diagnostic = document.querySelector('.diagnostic-section');
    if (!hero || !diagnostic) return;

    hero.classList.add('fer-page-hero');
    if (document.getElementById(SECTION_ID)) return;

    const section = document.createElement('section');
    section.id = SECTION_ID;
    section.className = 'fer-problems';
    section.innerHTML = `
      <div class="fer-problems-inner">
        <div class="fer-problems-head">
          <span class="eyebrow">PROBLEMAS REALES DE UNA FERRETERÍA</span>
          <h2>El desorden te roba tiempo, ventas y libertad.</h2>
          <p>Antes de hablar de sistemas, identifica qué está haciendo más pesada tu operación diaria.</p>
        </div>
        ${problems.map((problem, index) => `
          <article class="fer-problem${index % 2 ? ' is-reverse' : ''}">
            <div class="fer-problem-media"><img src="${problem.image}" width="220" height="391" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async" alt="${problem.alt}"></div>
            <div class="fer-problem-copy"><span class="fer-problem-number">${problem.number}</span><h3>${problem.title}</h3></div>
          </article>
        `).join('')}
      </div>
    `;
    diagnostic.before(section);
  };

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      mount();
    });
  };

  window.addEventListener('hashchange', schedule);
  window.addEventListener('popstate', schedule);
  document.addEventListener('DOMContentLoaded', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  schedule();
})();
