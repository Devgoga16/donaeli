# Doña Eli Empanadas — web en Astro

Sitio estático hecho con [Astro](https://astro.build). Carta digital, combos y "Arma tu pedido" por WhatsApp.

## Trabajar en local

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera la web final en dist/
npm run preview    # revisa dist/ antes de publicar
```

## Dónde se edita cada cosa
| Qué | Archivo |
|---|---|
| WhatsApp, dirección, horario, delivery, pagos | `src/data/negocio.ts` → `config` |
| Productos, precios, descripciones, fotos | `src/data/negocio.ts` → `productos` |
| Promociones y combos con precio | `src/data/negocio.ts` → `promociones` |
| Historia de Doña Eli | `src/components/Nosotros.astro` |
| Colores y estilos | `src/styles/global.css` (tokens en `:root`) |
| Fotos | `src/assets/ig/` (Astro las convierte a WebP y las redimensiona) |
| Logo y favicon | `public/img/` |
| Dominio final (SEO / imagen al compartir) | `astro.config.mjs` → `site` |

Lo que quede vacío se muestra como "Por confirmar". Cuando todos los productos del pedido tienen precio, el total aparece solo.

## Publicar

**Netlify (lo más simple)**
- Opción rápida: `npm run build` y arrastra la carpeta `dist/` a https://app.netlify.com/drop
- Opción con actualizaciones automáticas: sube el proyecto a GitHub y en Netlify elige *Add new site → Import from Git*. El archivo `netlify.toml` ya trae la configuración (build `npm run build`, carpeta `dist`).

**Cloudflare Pages o Vercel**: importa el repositorio y elige el preset *Astro* (build `npm run build`, salida `dist`).

**Hosting tradicional (cPanel)**: `npm run build` y sube el contenido de `dist/` a `public_html`.

Después de publicar, actualiza `site` en `astro.config.mjs` con el dominio real y vuelve a compilar.

## Otras carpetas
- `presentacion/` — presentación de venta (PDF y su HTML). No se publica.
- `version-estatica/` — la primera versión en HTML puro, como respaldo. No se publica.
