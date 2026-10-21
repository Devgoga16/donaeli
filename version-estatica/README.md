# Doña Eli Empanadas — propuesta web

Sitio estático (HTML + CSS + JS, sin dependencias). Abre `index.html` o sírvelo con:

```bash
python -m http.server 5510
```

## Estructura
- `index.html` — secciones: portada, carta, combos ("El mejor plan"), cómo pedir, nosotros, momentos, contacto.
- `css/styles.css` — estilos y paleta (tokens en `:root`).
- `js/data.js` — **todo el contenido editable**: datos de contacto, productos, precios y promociones.
- `js/app.js` — carta con pestañas, "Arma tu pedido" y envío por WhatsApp.
- `img/ig/` — fotos tomadas del Instagram (640 px, solo para la maqueta).

## Pendiente de confirmar con el cliente (en `js/data.js`)
| Dato | Campo |
|---|---|
| Número de WhatsApp | `config.whatsapp` |
| Dirección y enlace de Maps | `config.direccion`, `config.mapaUrl` |
| Horario | `config.horario` |
| Zonas / condiciones de delivery | `config.entregas` |
| Medios de pago | `config.pagos` |
| Precios | `productos[].precio` |
| Promociones y combos con precio | `promociones` |
| Historia de Doña Eli | sección `#nosotros` en `index.html` |
| Fotos originales en alta resolución | reemplazar archivos en `img/ig/` |

Mientras un dato esté vacío, la web muestra "Por confirmar". Cuando todos los productos del pedido tienen precio, el panel y el mensaje de WhatsApp muestran el total automáticamente.

Solo se usan variedades que aparecen en Instagram: empanadas de pollo, carne, salchicha huachana, mixta y queso (huarochirano); alfajores; chicha morada y jugos.
