import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist/agne-web/browser');
const indexPath = path.join(root, 'index.html');
const source = fs.readFileSync(indexPath, 'utf8');

const routes = {
  restaurantes: {
    title: 'Sistema para restaurantes en Perú | AGNE',
    description: 'Sistema para restaurantes y cevicherías en Perú: comandas, pedidos, ventas y control operativo con implementación y acompañamiento de AGNE.'
  },
  ferreterias: {
    title: 'Sistema para ferreterías pequeñas en Perú | AGNE',
    description: 'Organiza ventas, catálogo, códigos de barras y stock básico por producto para ferreterías pequeñas en Perú con AGNE.'
  },
  bodegas: {
    title: 'Sistema para bodegas y minimarkets en Perú | AGNE',
    description: 'Organiza ventas, catálogo y stock simple por unidad para bodegas y minimarkets en Perú con AGNE.'
  },
  salones: {
    title: 'Gestión para salones de belleza en Perú | AGNE',
    description: 'Organiza clientes, servicios, ventas e historial de atención para salones de belleza en Perú con AGNE.'
  }
};

function replaceMeta(html, route, data) {
  const url = `https://agilidadnegociosperu.github.io/web/${route}/`;
  return html
    .replace(/<title>[^<]*<\/title>/i, `<title>${data.title}</title>`)
    .replace(/<meta name="description" content="[^"]*">/i, `<meta name="description" content="${data.description}">`)
    .replace(/<link rel="canonical" href="[^"]*">/i, `<link rel="canonical" href="${url}">`)
    .replace(/<meta property="og:title" content="[^"]*">/i, `<meta property="og:title" content="${data.title}">`)
    .replace(/<meta property="og:description" content="[^"]*">/i, `<meta property="og:description" content="${data.description}">`)
    .replace(/<meta property="og:url" content="[^"]*">/i, `<meta property="og:url" content="${url}">`);
}

for (const [route, data] of Object.entries(routes)) {
  const dir = path.join(root, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), replaceMeta(source, route, data));
}

fs.copyFileSync(indexPath, path.join(root, '404.html'));
console.log('Prepared clean-route entry points:', Object.keys(routes).join(', '));
