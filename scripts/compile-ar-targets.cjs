// Gera public/ar/targets.mind (reconhecimento das fotos pela câmera) e
// public/ar/targets.json (ordem dos itens) a partir de lib/data.ts.
// Rode sempre que adicionar/trocar fotos do cardápio:
//
//   npm i --no-save mind-ar puppeteer-core --ignore-scripts
//   node scripts/compile-ar-targets.cjs
//
// Usa o Edge/Chrome instalado (defina BROWSER=caminho\do\navegador se preciso).
const http = require("http");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const ROOT = path.resolve(__dirname, "..");
const PUB = path.join(ROOT, "public");
const MINDAR = path.join(ROOT, "node_modules", "mind-ar", "dist");
const WIDTH = 300; // largura usada no reconhecimento (maior = arquivo maior)

const data = fs.readFileSync(path.join(ROOT, "lib", "data.ts"), "utf8");
const items = [...data.matchAll(/slug: "([^"]+)",\s*src: "([^"]+)"/g)].map((m) => ({ slug: m[1], src: m[2] }));
if (!items.length) throw new Error("Nenhum item encontrado em lib/data.ts");

const browsers = [
  process.env.BROWSER,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter((p) => p && fs.existsSync(p));
if (!browsers.length) throw new Error("Navegador não encontrado. Defina BROWSER=...");

const html = `<html><body><script type="module">
import { Compiler } from "/dist/mindar-image.prod.js";
window.run = async (urls, W) => {
  const imgs = [];
  for (const u of urls) {
    const i = new Image(); i.src = u; await i.decode();
    const k = Math.min(1, W / i.naturalWidth), cv = document.createElement("canvas");
    cv.width = Math.round(i.naturalWidth * k); cv.height = Math.round(i.naturalHeight * k);
    cv.getContext("2d").drawImage(i, 0, 0, cv.width, cv.height);
    imgs.push(cv);
  }
  const c = new Compiler();
  await c.compileImageTargets(imgs, (p) => (window.prog = p));
  const b = new Uint8Array(await c.exportData());
  let s = ""; for (let i = 0; i < b.length; i += 8192) s += String.fromCharCode.apply(null, b.subarray(i, i + 8192));
  return btoa(s);
};
window.ready = true;
</script></body></html>`;

const server = http
  .createServer((req, res) => {
    const u = decodeURIComponent(req.url.split("?")[0]);
    if (u === "/") return res.end(html);
    const file = u.startsWith("/dist/") ? path.join(MINDAR, u.slice(6)) : path.join(PUB, u);
    if (!file.startsWith(MINDAR) && !file.startsWith(PUB)) return res.writeHead(403).end();
    if (!fs.existsSync(file)) return res.writeHead(404).end();
    res.setHeader("content-type", file.endsWith(".js") ? "text/javascript" : "image/jpeg");
    res.end(fs.readFileSync(file));
  })
  .listen(0, "127.0.0.1", async () => {
    const port = server.address().port;
    const browser = await puppeteer.launch({ executablePath: browsers[0], headless: true, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
    try {
      const page = await browser.newPage();
      page.on("pageerror", (e) => console.error(e.message));
      await page.goto(`http://127.0.0.1:${port}/`);
      await page.waitForFunction("window.ready", { timeout: 60000 });
      const timer = setInterval(async () => console.log(`progresso: ${Math.round(await page.evaluate("window.prog || 0"))}%`), 15000);
      const b64 = await page.evaluate((u, w) => window.run(u, w), items.map((i) => i.src), WIDTH);
      clearInterval(timer);
      fs.mkdirSync(path.join(PUB, "ar"), { recursive: true });
      fs.writeFileSync(path.join(PUB, "ar", "targets.mind"), Buffer.from(b64, "base64"));
      fs.writeFileSync(path.join(PUB, "ar", "targets.json"), JSON.stringify(items.map((i) => i.slug)));
      console.log(`OK: ${items.length} fotos compiladas.`);
    } finally {
      await browser.close();
      server.close();
    }
  });
