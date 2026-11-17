# Beekery v2 — Dirección artística

Rama: `rediseno-v2`. La v1 está intacta en `main` (etiqueta `v1-web-actual`).

## Concepto: «Bodegón de obrador»

Beekery ya tiene su mejor material: fotos de estudio de producto sobre blanco (la hogaza cenital, el semifrío amarillo, la coca, el tiramisú) y un color de marca muy reconocible, el azul del logo «B Obrador». La v2 trata cada pan y cada tarta como un objeto de bodegón: producto aislado sobre campos de color planos sacados del propio mundo de Beekery, con tipografía condensada muy grande, como la que se imprime en un saco de harina.

Frente a la v1 (crema cálido, serif display, tarjetas redondeadas, hogaza en círculo), la v2 es plana, gráfica y de color: esquinas rectas, sin sombras y sin tarjetas.

## Lo que la hace distinta
- **«Hoy en el horno»** pasa de ser un detalle a ser la segunda pantalla: el día de hoy en tipografía gigante sobre amarillo, con selector de días. Es lo que más diferencia a Beekery (cada pan sale un día concreto) y lo más útil para el cliente.
- **La vitrina**: en escritorio, un escenario fijo cambia de color y de producto mientras recorres la carta (azul para el pan, amarillo para los semifríos, teja para las cocas, mantequilla para la bollería, cacao para las tartas, verde para la temporada). En móvil cada categoría es su propio bloque de color.

## Sistema
| | |
|---|---|
| Tipografía display | Archivo con eje de anchura al 62 % (extracondensada), peso 800, mayúsculas |
| Texto | Archivo con anchura normal, 400/500 |
| Voz humana | Newsreader en cursiva, solo en frases cortas |
| Harina (fondo) | `#F3F1EC` |
| Tinta / corteza | `#22160F` |
| Azul obrador | `#356F85` (el azul del logo, un punto más profundo para que el contraste pase AA) |
| Amarillo semifrío | `#F2C21B` |
| Teja (cocas) | `#C4512F` |
| Cacao (tartas) | `#4A2C1E` |
| Verde Montgó (temporada) | `#2F5D3A` |

Los botones son rectángulos sólidos con una flecha y se desplazan al pasar el cursor. Las imágenes van a sangre o enmarcadas como una copia de estudio.

## Referencias (visitadas el 17/11/2026)
- **Lajoya** (lajoya-foods.com, mención de honor en Awwwards): un campo de color plano y saturado, display gigante y producto recortado flotando. → principio: el producto como objeto sobre el color.
- **Agrumea Farm** (agrumeafarm.it, Site of the Day en Awwwards): un producto por pantalla y tipografía enorme detrás. → principio: dar a cada producto su escenario.
- **Theobroma** (theobromachocolat.com, mención de honor): mayúsculas grotescas y bloques de color por sección. → principio: el color organiza la navegación.
- **Delta Cafés** (deltacafes.com, Site of the Day): hero fotográfico a sangre con titular claro. → principio: la foto real abre la web.
- **Impasto Forno Antico** (impastofornoantico.com): un nombre de pan por pantalla. Las imágenes WebGL no llegaron a renderizar en mi navegador; tomé solo el ritmo.
- **FIX Chocolatier**: aprendizaje en negativo. El loader con porcentaje retrasa el contenido; la v2 no tiene loader.

## Movimiento
Contenido: un ligero parallax en el hero y en el Montgó, el cambio de escenario de la vitrina y apariciones suaves de los elementos. Con `prefers-reduced-motion` se desactiva todo.
