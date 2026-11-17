# Beekery v2 — Dirección artística: «La madrugada del obrador»

Rama: `rediseno-v2`. La v1 está en `main` (etiqueta `v1-web-actual`). El primer intento de la v2, «Bodegón gráfico», está guardado en la etiqueta `v2-bodegon-grafico`.

## Por qué cambió
El primer intento usaba tipografía condensada en mayúsculas y bloques de color saturado. Sacó sus referencias de marcas de producto envasado (mermeladas, chocolate, latas) y el resultado parecía una marca de moda o de festival, no una panadería. Esta versión parte de una investigación con Playwright centrada en panaderías y cafés reales.

## Concepto
Lo que no ve el cliente: la madrugada en el obrador, con harina, manos, masa madre y horno. Y lo que sí ve cada mañana: la pizarra con el pan del día, las etiquetas de papel de las baldas y la vitrina.

## Sistema
| | |
|---|---|
| Titulares | Libre Caslon Display, con mayúsculas normales. Es una serif clásica emparentada con el logo de Beekery |
| Acentos | Libre Caslon Text en cursiva (siempre en azul o en oro) |
| Texto | Hanken Grotesk |
| Etiquetas y tickets | Courier Prime, como la máquina de escribir de los tickets del obrador |
| Papel | `#F5EEE1` · harina `#FBF7EF` · trigo `#EADBC0` |
| Corteza (texto) | `#2E1D13` · secundario `#6B5444` |
| Azul Beekery | `#3D7488`, el del logo, como acento |
| Oro / miel | `#E6BE6A` / `#B9792F` |
| Noche (madrugada) | `#1C1410` · pizarra `#2A2621` · cacao `#3A2418` |
| Salvia (Too Good To Go) | `#56704F` |

Motivos:
- **Arco de horno**: fotos con la parte superior redondeada, como la boca de un horno.
- **Hojas de trigo**: el ornamento de su logo, dibujado como SVG.
- **Grano de papel**: textura sutil en toda la página.
- **Etiqueta de papel** con agujero, para «Hoy en el horno».
- **Pizarra con marco de madera** para la agenda de pan.

## Secciones
1. **Hero**: titular serif «Pan sin prisa, *desde la madrugada*», la hogaza real en un arco y una etiqueta con el pan de hoy.
2. **La pizarra**: el pan del día en una pizarra, con selector de días y botón de WhatsApp para que te guarden uno.
3. **La madrugada** (sección nueva): franja oscura con fotos de proceso (harina, masa madre, formado, miga) que se recorre en horizontal.
4. **Del Montgó al horno**: Blat de la Marina, con su lema real.
5. **La vitrina**: escenario fijo que cambia a tonos suaves de horno por categoría, con fotos en arco y la carta como un menú impreso.
6. **Nosotros**: Raquel y Luis, sus logros y una reseña real.
7. **Encargos**: fondo cacao y formulario que prepara el mensaje de WhatsApp.
8. **Dos obradores en Dénia**, Too Good To Go y el pie con «Beekery» en serif grande.

## Referencias visitadas con Playwright (17/11/2026, escritorio 1440 px y móvil 390 px)
| Web | Awwwards | Principio que tomo |
|---|---|---|
| Hart Bageri (hartbageri.com) | – | Fotografía documental de manos, masa y baldas con etiquetas de precio |
| Sonoma Bakery (sonomabakery.com) | Mención de honor 2022 | Neutros cálidos, cortes de miga y contención |
| Poilâne (poilane.com) | – | Una persona y la tradición familiar; el azul funciona en panadería |
| Bäckerei Welling (baeckerei-welling.de) | Nominada 2024 | Serif Caslon, ilustración de trigo, fotos en arco |
| Flora Café (florawellnesscafe.com) | Mención de honor 2026 | Papel crema, Caslon cursiva y mono, la carta como menú impreso |
| Tartine (tartinebakery.com) | – | Máquina de escribir y fotos del oficio |
| Lune Croissanterie (lunecroissanterie.com) | – | Macro del hojaldre y dramatismo en el producto |
| Bernice Bakery (bernicebakery.com) | Mención de honor 2025 | Producto en abundancia y marcos en arco (pero demasiado juguetona) |
| Café Binocle (cafebinocle.com) | Mención de honor 2026 | Ejemplo en negativo: demasiado marca gráfica |
| Nine Times Bakery (ninetimesbakery.com) | Nominada 2022 | Ejemplo en negativo: plantilla genérica |

Wildwood Bakery (mención de honor 2021) ya no tiene el dominio activo.
