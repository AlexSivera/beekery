# Beekery v3: dirección artística «Obrador Beekery»

Rama: `rediseno-v3`. Las demás versiones siguen guardadas:
- La v1 está en `main` (etiqueta `v1-web-actual`).
- La v2, «La madrugada del obrador», está en `rediseno-v2`.
- El primer intento de la v2 está en la etiqueta `v2-bodegon-grafico`.

## Punto de partida
Al cliente le gustó **Bäckerei Welling** (baeckerei-welling.de, nominada en Awwwards). El 17/11/2026 la estudié con Playwright: la recorrí entera en escritorio (1440 px) y en móvil (390 px). Lo que la hace funcionar:

1. **Hero oscuro y cálido.** El fondo es un desenfoque de tonos tostados. El nombre va en una serif de alto contraste, en versales y a tamaño gigante, y se monta sobre una hogaza recortada que sale por el borde de la pantalla.
2. **Fondo kraft con espigas dibujadas en línea.** Los títulos combinan una palabra manuscrita encima de otra en versales («Unsere / AUSWAHL»).
3. **Categorías en tarjetas escalonadas.** Hay fotos en arco, un sello circular de texto («Backtradition seit 1962») y palabras fantasma enormes detrás de las tarjetas.
4. **Bandas partidas al 50 %.** Una mitad es foto y la otra un color de tierra (ocre, verde, marrón, azul). Una palabra blanca gigante cruza las dos mitades y un rótulo vertical acompaña el bloque.
5. **Pie oscuro y sobrio.**

## Qué tomo y qué cambio
Tomo los principios: el contraste entre la noche y el kraft, la combinación de manuscrita y versales, las bandas que cruza una palabra, las espigas y el sello circular.

No copio los textos, la marca, las fotos, la composición exacta ni sus tipografías comerciales. Lo propio de Beekery:
- **Su hogaza real** presentada como un disco, con un anillo de texto girando alrededor («Masa madre · Trigo de la Marina Alta · Dénia · Desde 2019»).
- **Palabras de su historia** para las bandas: MADRUGADA (el oficio), MONTGÓ (Blat de la Marina), HERMANOS (Raquel y Luis) y ENCARGOS.
- **Su paleta.** El azul del logo y la salvia del Montgó sustituyen a los colores de Welling.
- **La funcionalidad real de la v2:**
  - el estado abierto/cerrado;
  - el pan de cada día, con su selector;
  - la carta completa en pestañas;
  - el encargo por WhatsApp;
  - los dos obradores;
  - Too Good To Go;
  - la barra de acciones en móvil.

## Sistema
| | |
|---|---|
| Display | Bodoni Moda 600, en versales y con óptica de titular (opsz 40) |
| Manuscrita | Mrs Saint Delafield, solo para acentos («obrador», «el pan», «nuestra», «dos») |
| Texto | Hanken Grotesk |
| Noche | `#17110D` (hero, pie) |
| Kraft | `#CDB991` (vitrina) · crema `#F6EFE2` · papel `#FBF7EF` |
| Café | `#6A3B1C` (titulares sobre claro) · caramelo `#A8794C` (manuscrita) |
| Oro | `#E3BC6C` (CTA principal, anillo, manuscrita sobre oscuro) |
| Bandas | miel `#94592A` · salvia `#56693F` · cacao `#4A2A17` · azul Beekery `#3D7488` |

## Estructura
1. **Hero (noche):** «obrador / BEEKERY», la hogaza en disco con el anillo de texto y la etiqueta con el pan de hoy.
2. **El pan de hoy (crema):** selector de días y botón de WhatsApp para que te guarden un pan.
3. **Nuestra vitrina (kraft):**
   - seis tarjetas escalonadas, con un sello circular y la palabra fantasma «Panadería / Pastelería»;
   - debajo, la carta completa en pestañas;
   - cada tarjeta abre su pestaña.
4. **Bandas:**
   - MADRUGADA (miel): el proceso, con tres fotos pequeñas;
   - MONTGÓ (salvia): Blat de la Marina;
   - HERMANOS (cacao): foto real en blanco y negro, los logros y una reseña;
   - ENCARGOS (azul): el formulario de WhatsApp.
5. **Dos obradores (crema):** horario, los dos locales, Too Good To Go y el mapa.
6. **Pie (noche).**

## Movimiento
- El anillo de texto gira despacio.
- La hogaza rota un poco al hacer scroll.
- Las palabras gigantes se deslizan en horizontal.
- Las fotos de las bandas tienen un parallax suave.
- Todo el movimiento se desactiva con `prefers-reduced-motion`.

## Referencias anteriores (v2)
Hart Bageri, Sonoma Bakery, Poilâne, Bäckerei Welling, Flora Café, Tartine, Lune, Bernice, Café Binocle y Nine Times. Están documentadas en la rama `rediseno-v2`.
