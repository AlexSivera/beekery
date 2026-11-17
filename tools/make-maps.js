// Uso:
//   1) Descargar los datos de OpenStreetMap de la zona en tools/osm.json:
//      curl -A "map-demo/1.0" --data-urlencode 'data=[out:json][timeout:90];(way["building"](38.8325,0.0845,38.8475,0.1065);way["highway"](38.8325,0.0845,38.8475,0.1065);way["waterway"](38.8325,0.0845,38.8475,0.1065);way["natural"~"water|coastline"](38.8325,0.0845,38.8475,0.1065);way["leisure"~"park|garden|pitch"](38.8325,0.0845,38.8475,0.1065);way["landuse"~"grass|cemetery|recreation_ground|farmland|meadow|orchard"](38.8325,0.0845,38.8475,0.1065);nwr["name"]["amenity"](38.8325,0.0845,38.8475,0.1065);nwr["name"]["shop"~"supermarket|mall"](38.8325,0.0845,38.8475,0.1065););out geom tags;' https://overpass-api.de/api/interpreter -o tools/osm.json
//   2) cd tools && node make-maps.js ../assets/v3
//   Imprime las posiciones (%) del pin y de las etiquetas para copiarlas al HTML.
//   Los datos son © colaboradores de OpenStreetMap (ODbL): mantener la atribución en la web.
// Genera mapas ilustrados en SVG a partir de datos de OpenStreetMap (© colaboradores de OSM, ODbL).
const fs = require("fs");
const path = require("path");
const osm = require("./osm.json");
const OUT = process.argv[2];

const G = { lat: 38.8414804, lon: 0.0982755 };   // Av. de Gandia, 25
const M = { lat: 38.8380039, lon: 0.0923819 };   // Ptda. Madrigueres Sud, 26

const W = 1000, H = 750;               // metros que abarca cada mapa
const C = { // colores Beekery
  bg: "#FBF7EF", green: "#DDE3C9", green2: "#D2DABB", water: "#7FA9B8",
  bFill: "#F1DCB0", bStroke: "#9A5B37",
  minor: "#7E3D22", major: "#B4472F", majorCase: "#7E3D22", foot: "#CDAE86"
};

function proj(center) {
  const k = 111320, cos = Math.cos(center.lat * Math.PI / 180);
  return (lat, lon) => [ (lon - center.lon) * k * cos, -(lat - center.lat) * k ];
}

function makeMap(name, shop, other, labels) {
  // centro desplazado hacia el otro obrador para que se vean los dos
  const center = { lat: shop.lat + (other.lat - shop.lat) * 0.2, lon: shop.lon + (other.lon - shop.lon) * 0.2 };
  const p = proj(center);
  const inBox = (pts) => pts.some(([x, y]) => Math.abs(x) < W / 2 + 80 && Math.abs(y) < H / 2 + 80);
  const pathOf = (geom, close) => {
    const pts = geom.map(g => p(g.lat, g.lon));
    if (!inBox(pts)) return null;
    return "M" + pts.map(([x, y]) => Math.round(x) + " " + Math.round(y)).join("L") + (close ? "Z" : "");
  };

  const layers = { green: [], green2: [], water: [], waterLine: [], build: [], foot: [], minor: [], majorCase: [], major: [] };
  for (const e of osm.elements) {
    if (e.type !== "way" || !e.geometry || !e.tags) continue;
    const t = e.tags;
    if (t.building) { const d = pathOf(e.geometry, true); if (d) layers.build.push(d); continue; }
    if (t.highway) {
      const hw = t.highway;
      if (/proposed|construction/.test(hw)) continue;
      const d = pathOf(e.geometry, false); if (!d) continue;
      if (/primary|secondary|trunk|tertiary/.test(hw)) { layers.majorCase.push(d); layers.major.push(d); }
      else if (/footway|path|steps|cycleway|track|pedestrian/.test(hw)) layers.foot.push(d);
      else layers.minor.push(d);
      continue;
    }
    if (t.waterway) { const d = pathOf(e.geometry, false); if (d) layers.waterLine.push(d); continue; }
    if (t.natural === "water") { const d = pathOf(e.geometry, true); if (d) layers.water.push(d); continue; }
    if (t.leisure || t.landuse) {
      const d = pathOf(e.geometry, true); if (!d) continue;
      (t.landuse === "cemetery" || t.leisure === "pitch" ? layers.green2 : layers.green).push(d);
    }
  }

  const g = (d, attrs) => d.length ? `<path d="${d.join("")}" ${attrs}/>` : "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-W / 2} ${-H / 2} ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<rect x="${-W / 2}" y="${-H / 2}" width="${W}" height="${H}" fill="${C.bg}"/>
${g(layers.green, `fill="${C.green}"`)}
${g(layers.green2, `fill="${C.green2}"`)}
${g(layers.water, `fill="${C.water}"`)}
${g(layers.waterLine, `fill="none" stroke="${C.water}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`)}
${g(layers.foot, `fill="none" stroke="${C.foot}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"`)}
${g(layers.minor, `fill="none" stroke="${C.minor}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"`)}
${g(layers.build, `fill="${C.bFill}" stroke="${C.bStroke}" stroke-width="1" stroke-linejoin="round"`)}
${g(layers.majorCase, `fill="none" stroke="${C.majorCase}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"`)}
${g(layers.major, `fill="none" stroke="${C.major}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"`)}
</svg>`;
  fs.writeFileSync(path.join(OUT, `map-${name}.svg`), svg.replace(/\n+/g, "\n"));

  // posiciones (en %) para el pin y las etiquetas HTML
  const pct = (lat, lon) => { const [x, y] = p(lat, lon); return { left: +(((x + W / 2) / W) * 100).toFixed(1), top: +(((y + H / 2) / H) * 100).toFixed(1) }; };
  const out = { shop: pct(shop.lat, shop.lon), other: pct(other.lat, other.lon), labels: {} };
  for (const [label, lat, lon] of labels) out.labels[label] = pct(lat, lon);
  return out;
}

// Coordenadas de referencias sacadas de los propios datos de OSM
const find = (re) => {
  const e = osm.elements.find(e => e.tags && e.tags.name && re.test(e.tags.name) && !e.tags.highway);
  if (!e) return null;
  if (e.lat) return [e.lat, e.lon];
  if (e.bounds) return [(e.bounds.minlat + e.bounds.maxlat) / 2, (e.bounds.minlon + e.bounds.maxlon) / 2];
  const gs = e.geometry; return [gs.reduce((a, g) => a + g.lat, 0) / gs.length, gs.reduce((a, g) => a + g.lon, 0) / gs.length];
};
const L = (label, re) => { const c = find(re); return c ? [label, c[0], c[1]] : null; };

const res = {
  gandia: makeMap("gandia", G, M, [
    L("Guardia Civil", /^Guardia Civil$/),
    L("Col·legi Llebeig", /Llebeig/),
    L("IES Maria Ibars", /Maria Ibars/),
    L("Hiper Dénia", /^Hiper Dénia$/)
  ].filter(Boolean)),
  madrigueres: makeMap("madrigueres", M, G, [
    L("Hospital San Carlos", /HLA San Carlos/),
    L("Lidl", /^Lidl$/),
    L("Carrefour", /^Carrefour$/),
    L("Cementeri", /Cementeri de Dénia/)
  ].filter(Boolean))
};
console.log(JSON.stringify(res, null, 1));
for (const n of ["gandia", "madrigueres"]) console.log(n, fs.statSync(path.join(OUT, `map-${n}.svg`)).size);
