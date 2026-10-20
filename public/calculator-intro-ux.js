(() => {
  const INFO_TEXT = 'Ingresa 4 datos y obtén una estimación rápida de cuánto podrías estar dejando de ganar cada mes por errores, cobros olvidados y ventas que no llegan a concretarse.';

  const style = document.createElement('style');
  style.textContent = `
    #calculadora .calc-intro-tools{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:14px;
      margin:16px 0 10px;
      max-width:790px;
    }
    #calculadora .calc-info-details{position:relative;z-index:40}
    #calculadora .calc-info-details>summary{
      list-style:none;
      width:34px;
      height:34px;
      border-radius:999px;
      border:1px solid rgba(255,255,255,.28);
      background:rgba(255,255,255,.09);
      color:#fff;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:17px;
      font-weight:950;
      cursor:pointer;
      user-select:none;
      box-shadow:0 5px 16px rgba(0,0,0,.12);
      transition:.18s ease;
    }
    #calculadora .calc-info-details>summary::-webkit-details-marker{display:none}
    #calculadora .calc-info-details>summary:hover,
    #calculadora .calc-info-details>summary:focus-visible,
    #calculadora .calc-info-details[open]>summary{
      background:#f57c00;
      border-color:#f57c00;
      outline:none;
      transform:translateY(-1px);
    }
    #calculadora .calc-info-popover{
      position:absolute;
      left:0;
      top:44px;
      width:min(520px,calc(100vw - 50px));
      padding:15px 16px;
      border-radius:14px;
      background:#fff;
      color:#17384f;
      border:1px solid #dce6eb;
      box-shadow:0 18px 48px rgba(0,0,0,.28);
      font-size:15px;
      line-height:1.55;
      font-weight:500;
      text-align:left;
    }
    #calculadora .calc-start-cta{
      margin-left:auto;
      display:inline-flex;
      align-items:center;
      gap:9px;
      padding:9px 13px;
      border-radius:999px;
      color:#ffad63;
      font-size:11px;
      font-weight:950;
      letter-spacing:1.2px;
      text-decoration:none;
      text-transform:uppercase;
      border:1px solid rgba(255,173,99,.35);
      background:rgba(245,124,0,.08);
      box-shadow:0 0 0 0 rgba(245,124,0,.34);
      animation:agneStartPulse 1.25s ease-in-out infinite;
    }
    #calculadora .calc-start-cta .calc-start-arrow{
      display:inline-block;
      color:#f57c00;
      font-size:28px;
      line-height:.7;
      font-weight:950;
      animation:agneArrowBounce .8s ease-in-out infinite alternate;
    }
    #calculadora #calc-first-input{scroll-margin-top:110px}
    @keyframes agneStartPulse{
      0%,100%{box-shadow:0 0 0 0 rgba(245,124,0,.28);filter:brightness(1)}
      50%{box-shadow:0 0 0 7px rgba(245,124,0,0);filter:brightness(1.12)}
    }
    @keyframes agneArrowBounce{
      from{transform:translateY(-2px);opacity:.75}
      to{transform:translateY(5px);opacity:1}
    }
    @media(max-width:560px){
      #calculadora .calc-intro-tools{margin:12px 0 10px}
      #calculadora .calc-info-details>summary{width:32px;height:32px;font-size:16px}
      #calculadora .calc-info-popover{
        position:fixed;
        left:18px;
        right:18px;
        top:auto;
        bottom:24px;
        width:auto;
        max-width:none;
        z-index:2147483640;
        font-size:14px;
      }
      #calculadora .calc-start-cta{padding:9px 11px;font-size:10px;letter-spacing:1px}
      #calculadora .calc-start-cta .calc-start-arrow{font-size:26px}
    }
    @media(prefers-reduced-motion:reduce){
      #calculadora .calc-start-cta,
      #calculadora .calc-start-cta .calc-start-arrow{animation:none}
    }
  `;
  document.head.appendChild(style);

  const setup = () => {
    const calculator = document.querySelector('#calculadora');
    const intro = calculator?.querySelector('.loss-intro');
    const layout = calculator?.querySelector('.loss-layout');
    const form = calculator?.querySelector('.loss-form');
    const firstInput = form?.querySelector('input[type="number"]');
    const introParagraph = intro?.querySelector(':scope > p');
    if (!calculator || !intro || !layout || !form || !firstInput) return false;
    if (calculator.querySelector('.calc-intro-tools')) return true;

    if (introParagraph) introParagraph.remove();
    firstInput.id = 'calc-first-input';

    const tools = document.createElement('div');
    tools.className = 'calc-intro-tools';
    tools.innerHTML = `
      <details class="calc-info-details">
        <summary aria-label="Cómo funciona esta estimación" title="Cómo funciona esta estimación">i</summary>
        <div class="calc-info-popover">${INFO_TEXT}</div>
      </details>
      <a class="calc-start-cta" href="#calc-first-input" aria-label="Empezar la calculadora">
        <span>Empieza aquí</span><span class="calc-start-arrow" aria-hidden="true">↓</span>
      </a>
    `;

    const note = intro.querySelector('.loss-note');
    if (note) note.insertAdjacentElement('beforebegin', tools);
    else intro.appendChild(tools);

    const start = tools.querySelector('.calc-start-cta');
    start?.addEventListener('click', (event) => {
      event.preventDefault();
      firstInput.scrollIntoView({ behavior:'smooth', block:'center' });
      window.setTimeout(() => firstInput.focus({ preventScroll:true }), 450);
    });

    document.addEventListener('click', (event) => {
      const details = tools.querySelector('.calc-info-details');
      if (details?.hasAttribute('open') && !details.contains(event.target)) details.removeAttribute('open');
    });

    return true;
  };

  let tries = 0;
  const boot = () => {
    if (setup()) return;
    tries += 1;
    if (tries < 80) window.setTimeout(boot, 100);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();
