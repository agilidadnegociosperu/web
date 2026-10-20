(() => {
  const style = document.createElement('style');
  style.textContent = `
    /* Todos los botones informativos: la i en cursiva */
    #calculadora .calc-info-details > summary,
    .agne-info-btn {
      font-style: italic !important;
    }

    /* Los cuadros informativos flotan por encima de toda la interfaz */
    #calculadora .calc-info-details,
    .agne-info-wrap.open {
      z-index: 2147483646 !important;
    }

    #calculadora .calc-info-popover,
    .agne-info-tooltip {
      position: fixed !important;
      left: auto;
      right: auto !important;
      top: auto;
      bottom: auto !important;
      z-index: 2147483647 !important;
      max-width: calc(100vw - 24px) !important;
      box-sizing: border-box;
    }

    #calculadora .calc-info-popover {
      width: min(420px, calc(100vw - 24px)) !important;
    }

    .agne-info-tooltip {
      width: min(360px, calc(100vw - 24px)) !important;
    }
  `;
  document.head.appendChild(style);

  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

  const placeFloating = (button, panel, preferRight) => {
    if (!button || !panel) return;

    const margin = 12;
    const gap = 10;
    const buttonRect = button.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const panelWidth = Math.min(panelRect.width || 360, window.innerWidth - margin * 2);
    const panelHeight = panelRect.height || 120;

    let left;
    const fitsRight = buttonRect.right + gap + panelWidth <= window.innerWidth - margin;
    const fitsLeft = buttonRect.left - gap - panelWidth >= margin;

    if (preferRight && fitsRight) {
      left = buttonRect.right + gap;
    } else if (!preferRight && fitsLeft) {
      left = buttonRect.left - gap - panelWidth;
    } else if (fitsRight) {
      left = buttonRect.right + gap;
    } else if (fitsLeft) {
      left = buttonRect.left - gap - panelWidth;
    } else {
      left = margin;
    }

    const top = clamp(
      buttonRect.top,
      margin,
      Math.max(margin, window.innerHeight - panelHeight - margin)
    );

    panel.style.left = `${Math.round(left)}px`;
    panel.style.top = `${Math.round(top)}px`;
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
  };

  const positionCalculatorInfo = (details) => {
    if (!details?.open) return;
    const button = details.querySelector(':scope > summary');
    const panel = details.querySelector('.calc-info-popover');
    window.requestAnimationFrame(() => placeFloating(button, panel, true));
  };

  const positionResultInfo = (wrap) => {
    if (!wrap?.classList.contains('open')) return;
    const button = wrap.querySelector('.agne-info-btn');
    const panel = wrap.querySelector('.agne-info-tooltip');
    window.requestAnimationFrame(() => placeFloating(button, panel, false));
  };

  const repositionOpen = () => {
    document.querySelectorAll('.calc-info-details[open]').forEach(positionCalculatorInfo);
    document.querySelectorAll('.agne-info-wrap.open').forEach(positionResultInfo);
  };

  document.addEventListener('click', (event) => {
    const calcButton = event.target.closest?.('.calc-info-details > summary');
    if (calcButton) {
      const details = calcButton.closest('.calc-info-details');
      window.setTimeout(() => positionCalculatorInfo(details), 0);
    }

    const resultButton = event.target.closest?.('.agne-info-btn');
    if (resultButton) {
      const wrap = resultButton.closest('.agne-info-wrap');
      window.setTimeout(() => positionResultInfo(wrap), 0);
    }
  }, true);

  document.addEventListener('focusin', (event) => {
    const calcButton = event.target.closest?.('.calc-info-details > summary');
    if (calcButton) positionCalculatorInfo(calcButton.closest('.calc-info-details'));

    const resultButton = event.target.closest?.('.agne-info-btn');
    if (resultButton) positionResultInfo(resultButton.closest('.agne-info-wrap'));
  });

  document.addEventListener('mouseover', (event) => {
    const resultButton = event.target.closest?.('.agne-info-btn');
    if (resultButton) {
      const wrap = resultButton.closest('.agne-info-wrap');
      window.requestAnimationFrame(() => {
        const panel = wrap?.querySelector('.agne-info-tooltip');
        placeFloating(resultButton, panel, false);
      });
    }
  });

  window.addEventListener('resize', repositionOpen, { passive: true });
  window.addEventListener('scroll', repositionOpen, { passive: true, capture: true });
})();
