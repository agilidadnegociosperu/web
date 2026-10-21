(() => {
  const BASE = '/web/';
  const ROUTES = new Set(['inicio', 'restaurantes', 'ferreterias', 'bodegas', 'salones']);
  const META = {
    inicio: {
      title: 'AGNE | Gestión y control para negocios en Perú',
      description: 'AGNE ayuda a restaurantes, ferreterías, bodegas, minimarkets y salones de belleza a ordenar ventas, operación y control con soluciones prácticas.',
      canonical: 'https://agilidadnegociosperu.github.io/web/'
    },
    restaurantes: {
      title: 'Sistema para restaurantes en Perú | AGNE',
      description: 'Sistema para restaurantes y cevicherías en Perú: comandas, pedidos, ventas y control operativo con implementación y acompañamiento de AGNE.',
      canonical: 'https://agilidadnegociosperu.github.io/web/restaurantes/'
    },
    ferreterias: {
      title: 'Sistema para ferreterías pequeñas en Perú | AGNE',
      description: 'Organiza ventas, catálogo, códigos de barras y stock básico por producto para ferreterías pequeñas en Perú con AGNE.',
      canonical: 'https://agilidadnegociosperu.github.io/web/ferreterias/'
    },
    bodegas: {
      title: 'Sistema para bodegas y minimarkets en Perú | AGNE',
      description: 'Organiza ventas, catálogo y stock simple por unidad para bodegas y minimarkets en Perú con AGNE.',
      canonical: 'https://agilidadnegociosperu.github.io/web/bodegas/'
    },
    salones: {
      title: 'Gestión para salones de belleza en Perú | AGNE',
      description: 'Organiza clientes, servicios, ventas e historial de atención para salones de belleza en Perú con AGNE.',
      canonical: 'https://agilidadnegociosperu.github.io/web/salones/'
    }
  };

  const pathToRoute = () => {
    const clean = window.location.pathname.replace(/\/+$/, '');
    const base = BASE.replace(/\/+$/, '');
    if (clean === base || clean === '') return 'inicio';
    const slug = clean.startsWith(base + '/') ? clean.slice(base.length + 1).split('/')[0] : '';
    return ROUTES.has(slug) ? slug : 'inicio';
  };

  const hashToRoute = () => {
    const slug = window.location.hash.replace(/^#\/?/, '').split(/[/?]/)[0].toLowerCase();
    return ROUTES.has(slug) ? slug : (slug === '' ? 'inicio' : null);
  };

  const cleanUrl = route => route === 'inicio' ? BASE : `${BASE}${route}/`;

  const updateMeta = route => {
    const meta = META[route] || META.inicio;
    document.title = meta.title;
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.setAttribute('name', 'description');
      document.head.appendChild(description);
    }
    description.setAttribute('content', meta.description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', meta.canonical);

    const ogValues = {
      'og:title': meta.title,
      'og:description': meta.description,
      'og:url': meta.canonical
    };
    Object.entries(ogValues).forEach(([property, value]) => {
      let node = document.querySelector(`meta[property="${property}"]`);
      if (!node) {
        node = document.createElement('meta');
        node.setAttribute('property', property);
        document.head.appendChild(node);
      }
      node.setAttribute('content', value);
    });
  };

  const routeFromHref = href => {
    if (!href) return null;
    if (href.startsWith('#/')) {
      const slug = href.slice(2).split(/[/?]/)[0].toLowerCase();
      return ROUTES.has(slug) ? slug : null;
    }
    try {
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return null;
      const clean = url.pathname.replace(/\/+$/, '');
      const base = BASE.replace(/\/+$/, '');
      if (clean === base) return 'inicio';
      if (!clean.startsWith(base + '/')) return null;
      const slug = clean.slice(base.length + 1).split('/')[0];
      return ROUTES.has(slug) ? slug : null;
    } catch {
      return null;
    }
  };

  const rewriteLinks = root => {
    const scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll('a[href]').forEach(a => {
      const route = routeFromHref(a.getAttribute('href'));
      if (route) a.setAttribute('href', cleanUrl(route));
    });
  };

  const notifyAngular = route => {
    const targetHash = route === 'inicio' ? '#/inicio' : `#/${route}`;
    const finalUrl = cleanUrl(route);
    history.replaceState(history.state, '', `${BASE}${targetHash}`);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    history.replaceState(history.state, '', finalUrl);
    updateMeta(route);
    rewriteLinks(document);
  };

  const initialRoute = hashToRoute() || pathToRoute();
  if (initialRoute !== 'inicio' || window.location.hash) {
    document.documentElement.classList.add('route-booting');
  }

  document.addEventListener('DOMContentLoaded', () => {
    notifyAngular(initialRoute);
    document.documentElement.classList.remove('route-booting');
    rewriteLinks(document);

    const observer = new MutationObserver(records => {
      for (const record of records) {
        record.addedNodes.forEach(node => {
          if (node.nodeType === 1) rewriteLinks(node);
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });

  document.addEventListener('click', event => {
    const anchor = event.target.closest && event.target.closest('a[href]');
    if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;
    const route = routeFromHref(anchor.getAttribute('href'));
    if (!route) return;
    event.preventDefault();
    const destination = cleanUrl(route);
    if (window.location.pathname !== destination) history.pushState({ route }, '', destination);
    notifyAngular(route);
  }, true);

  window.addEventListener('popstate', () => {
    notifyAngular(pathToRoute());
  });
})();
