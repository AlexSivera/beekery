// Servidor local solo para previsualizar (no se sube al hosting).
// Uso: node tools/serve.js  →  http://localhost:8765
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".pdf": "application/pdf", ".json": "application/json"
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  const file = path.join(root, p);
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end("404"); }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(buf);
  });
}).listen(8765, () => console.log("http://localhost:8765"));
