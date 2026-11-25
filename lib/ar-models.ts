// Modelos 3D procedurais dos itens do cardápio, montados com primitivas do
// three.js a partir da análise de cada foto (bases, recipientes e comidas).
// Convenção: Y para cima, o modelo fica apoiado em y = 0 e ocupa cerca de
// 1 unidade de largura (no AR, 1 unidade = largura da foto escaneada).
import * as THREE from "three";

type O = THREE.Object3D;

// ---------- Paleta ----------
const C = {
  wood: 0xb07a4a,
  woodDark: 0x7a4f2a,
  cloth: 0xf6f1e7,
  linen: 0xe9dcc3,
  black: 0x1b1a19,
  gold: 0xd4af37,
  silver: 0xc9ccd1,
  white: 0xfafafa,
  bun: 0xc98a3c,
  patty: 0x5a3420,
  cheese: 0xf2b632,
  cheeseCube: 0xf6dc8c,
  lettuce: 0x6aa84f,
  straw: 0xd7263d,
  grape: 0xb8d46a,
  tomato: 0xe0301e,
  basil: 0x3f8f3a,
  parma: 0xd9767a,
  salami: 0xa8323e,
  fried: 0xc9792b,
  pastry: 0xe3b26b,
  toast: 0xe8c98e,
  choc: 0x4a2818,
  cream: 0xf3ead8,
  egg: 0xf5d63d,
  pesto: 0x6b7a2a,
  pink: 0xf2a7b8,
  rose: 0xc2185b,
  yellow: 0xf4c430,
  blue: 0x1e88c8,
  green: 0x2e9e4f,
  meat: 0x8a5a3c,
  orange: 0xe8892c,
};

// ---------- Materiais e helpers ----------
const matCache = new Map<string, THREE.Material>();
function mat(color: number, opts: THREE.MeshStandardMaterialParameters = {}): THREE.Material {
  const key = `${color}|${JSON.stringify(opts)}`;
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: 0.65, metalness: 0, ...opts });
    matCache.set(key, m);
  }
  return m;
}
const glassMat = () =>
  mat(0xffffff, { transparent: true, opacity: 0.28, roughness: 0.05, metalness: 0.1, depthWrite: false });
const metal = (color: number) => mat(color, { metalness: 0.9, roughness: 0.25 });

function mesh(geo: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const o = new THREE.Mesh(geo, m);
  o.position.set(x, y, z);
  o.castShadow = true;
  o.receiveShadow = true;
  return o;
}
function group(...children: O[]): THREE.Group {
  const g = new THREE.Group();
  children.forEach((c) => g.add(c));
  return g;
}
function at<T extends O>(o: T, x: number, y: number, z: number, rotY = 0, s = 1): T {
  o.position.set(x, y, z);
  o.rotation.y = rotY;
  o.scale.setScalar(s);
  return o;
}
// Pseudo-aleatório determinístico: o mesmo prato sempre fica igual.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
// Distribui n objetos em grade centrada.
function grid(cols: number, rows: number, dx: number, dz: number, y: number, fn: (i: number, j: number) => O): THREE.Group {
  const g = new THREE.Group();
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      const o = fn(i, j);
      o.position.x += (i - (cols - 1) / 2) * dx;
      o.position.z += (j - (rows - 1) / 2) * dz;
      o.position.y += y;
      g.add(o);
    }
  return g;
}
function ring(n: number, r: number, y: number, fn: (k: number) => O): THREE.Group {
  const g = new THREE.Group();
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2;
    const o = fn(k);
    o.position.x += Math.cos(a) * r;
    o.position.z += Math.sin(a) * r;
    o.position.y += y;
    o.rotation.y += -a;
    g.add(o);
  }
  return g;
}

// ---------- Bases ----------
function board(w = 0.9, d = 0.62): THREE.Group {
  const g = group(mesh(new THREE.BoxGeometry(w, 0.05, d), mat(C.wood, { roughness: 0.8 }), 0, 0.025, 0));
  g.userData.top = 0.05;
  return g;
}
function blackBox(w = 0.92, d = 0.66, h = 0.08): THREE.Group {
  const m = mat(C.black, { roughness: 0.5 });
  const t = 0.02;
  const g = group(
    mesh(new THREE.BoxGeometry(w, t, d), m, 0, t / 2, 0),
    mesh(new THREE.BoxGeometry(w, h, t), m, 0, h / 2, d / 2 - t / 2),
    mesh(new THREE.BoxGeometry(w, h, t), m, 0, h / 2, -d / 2 + t / 2),
    mesh(new THREE.BoxGeometry(t, h, d), m, w / 2 - t / 2, h / 2, 0),
    mesh(new THREE.BoxGeometry(t, h, d), m, -w / 2 + t / 2, h / 2, 0),
    mesh(new THREE.BoxGeometry(w - 0.05, 0.004, d - 0.05), mat(C.white), 0, t + 0.002, 0)
  );
  g.userData.top = t + 0.004;
  return g;
}
function roundTray(r = 0.45, color = C.silver): THREE.Group {
  const g = group(
    mesh(new THREE.CylinderGeometry(r, r * 0.96, 0.025, 48), metal(color), 0, 0.0125, 0),
    mesh(new THREE.TorusGeometry(r, 0.012, 8, 48), metal(C.gold), 0, 0.025, 0)
  );
  g.children[1].rotation.x = Math.PI / 2;
  g.userData.top = 0.026;
  return g;
}
function mirrorTray(w = 0.94, d = 0.66): THREE.Group {
  const g = group(
    mesh(new THREE.BoxGeometry(w, 0.02, d), mat(0xdfe6ea, { metalness: 1, roughness: 0.08 }), 0, 0.01, 0),
    mesh(new THREE.BoxGeometry(w + 0.03, 0.03, 0.02), metal(C.gold), 0, 0.015, d / 2),
    mesh(new THREE.BoxGeometry(w + 0.03, 0.03, 0.02), metal(C.gold), 0, 0.015, -d / 2),
    mesh(new THREE.BoxGeometry(0.02, 0.03, d), metal(C.gold), w / 2, 0.015, 0),
    mesh(new THREE.BoxGeometry(0.02, 0.03, d), metal(C.gold), -w / 2, 0.015, 0)
  );
  g.userData.top = 0.02;
  return g;
}
function table(w = 1, d = 0.6, h = 0.22): THREE.Group {
  const g = group(
    mesh(new THREE.BoxGeometry(w, h, d), mat(C.cloth, { roughness: 0.95 }), 0, h / 2, 0),
    mesh(new THREE.BoxGeometry(w * 0.3, 0.004, d + 0.004), mat(C.linen, { roughness: 1 }), 0, h + 0.001, 0)
  );
  g.userData.top = h + 0.003;
  return g;
}
function cakeStand(r = 0.16, h = 0.14, color = C.gold): THREE.Group {
  const g = group(
    mesh(new THREE.CylinderGeometry(r * 0.45, r * 0.55, 0.015, 24), metal(color), 0, 0.0075, 0),
    mesh(new THREE.CylinderGeometry(0.015, 0.02, h, 12), metal(color), 0, h / 2, 0),
    mesh(new THREE.CylinderGeometry(r, r, 0.015, 32), metal(color), 0, h, 0)
  );
  g.userData.top = h + 0.008;
  return g;
}
function plate(r = 0.14, color = C.white): THREE.Group {
  const g = group(mesh(new THREE.CylinderGeometry(r, r * 0.8, 0.02, 32), mat(color, { roughness: 0.3 }), 0, 0.01, 0));
  g.userData.top = 0.02;
  return g;
}

// ---------- Recipientes ----------
type Layer = { color: number; h: number };
function cup(r = 0.05, h = 0.1, layers: Layer[] = [], topping?: O, footed = false): THREE.Group {
  const g = new THREE.Group();
  let base = 0;
  if (footed) {
    g.add(mesh(new THREE.CylinderGeometry(r * 0.7, r * 0.8, 0.01, 20), glassMat(), 0, 0.005, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.01, 0.012, 0.04, 10), glassMat(), 0, 0.03, 0));
    base = 0.05;
  }
  g.add(mesh(new THREE.CylinderGeometry(r, r * 0.85, h, 24, 1, true), glassMat(), 0, base + h / 2, 0));
  let y = base + 0.004;
  for (const l of layers) {
    g.add(mesh(new THREE.CylinderGeometry(r * 0.95, r * 0.82, l.h, 24), mat(l.color, { roughness: 0.4 }), 0, y + l.h / 2, 0));
    y += l.h;
  }
  if (topping) g.add(at(topping, 0, y, 0));
  g.userData.top = base + h;
  return g;
}
function martini(r = 0.07, contents?: O, fill?: number): THREE.Group {
  const g = new THREE.Group();
  const bowlH = r * 1.1;
  g.add(mesh(new THREE.CylinderGeometry(r * 0.7, r * 0.75, 0.008, 20), glassMat(), 0, 0.004, 0));
  g.add(mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.12, 8), glassMat(), 0, 0.064, 0));
  const bowl = mesh(new THREE.ConeGeometry(r, bowlH, 24, 1, true), glassMat(), 0, 0.124 + bowlH / 2, 0);
  bowl.rotation.x = Math.PI;
  g.add(bowl);
  if (fill !== undefined) {
    const fh = bowlH * 0.6;
    const f = mesh(new THREE.ConeGeometry(r * 0.6, fh, 24), mat(fill, { roughness: 0.35 }), 0, 0.124 + fh / 2, 0);
    f.rotation.x = Math.PI;
    g.add(f);
  }
  if (contents) g.add(at(contents, 0, 0.124 + bowlH * 0.6, 0));
  g.userData.top = 0.124 + bowlH;
  return g;
}
function glassBowl(r = 0.1, contents?: O): THREE.Group {
  const g = group(
    mesh(new THREE.CylinderGeometry(r * 0.4, r * 0.5, 0.012, 20), glassMat(), 0, 0.006, 0),
    mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.05, 10), glassMat(), 0, 0.035, 0),
    mesh(new THREE.SphereGeometry(r, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), glassMat(), 0, 0.06 + r, 0)
  );
  if (contents) g.add(at(contents, 0, 0.06 + r * 0.55, 0));
  return g;
}
function bowl(r = 0.07, fill = C.pesto, color = C.white): THREE.Group {
  return group(
    mesh(new THREE.CylinderGeometry(r, r * 0.7, r * 0.6, 24, 1, true), mat(color, { roughness: 0.3, side: THREE.DoubleSide }), 0, r * 0.3, 0),
    mesh(new THREE.CylinderGeometry(r * 0.7, r * 0.7, 0.01, 24), mat(color), 0, 0.005, 0),
    mesh(new THREE.CylinderGeometry(r * 0.95, r * 0.95, 0.01, 24), mat(fill, { roughness: 0.9 }), 0, r * 0.5, 0)
  );
}
function jar(color = C.choc, lid = C.white): THREE.Group {
  return group(
    mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 24), mat(color, { roughness: 0.3 }), 0, 0.06, 0),
    mesh(new THREE.CylinderGeometry(0.051, 0.051, 0.05, 24), mat(C.white, { roughness: 0.6 }), 0, 0.06, 0),
    mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.025, 24), mat(lid), 0, 0.132, 0)
  );
}
function paperCup(color: number, content: O): THREE.Group {
  return group(
    mesh(new THREE.CylinderGeometry(0.028, 0.02, 0.02, 14, 1, true), mat(color, { side: THREE.DoubleSide }), 0, 0.01, 0),
    at(content, 0, 0.022, 0)
  );
}

// ---------- Comidas ----------
function burger(s = 1): THREE.Group {
  const g = group(
    mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.018, 20), mat(C.bun), 0, 0.009, 0),
    mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.006, 20), mat(C.lettuce), 0, 0.021, 0),
    mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.016, 20), mat(C.patty, { roughness: 0.9 }), 0, 0.032, 0),
    mesh(new THREE.BoxGeometry(0.07, 0.004, 0.07), mat(C.cheese), 0, 0.042, 0),
    mesh(new THREE.SphereGeometry(0.046, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(C.bun, { roughness: 0.5 }), 0, 0.044, 0),
    mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.09, 6), mat(C.cream), 0, 0.075, 0),
    mesh(new THREE.SphereGeometry(0.008, 10, 8), mat(C.tomato), 0, 0.118, 0)
  );
  g.children[3].rotation.y = Math.PI / 4;
  g.children[4].scale.y = 0.65;
  g.scale.setScalar(s);
  return g;
}
function ball(r: number, color: number, grainy = false): THREE.Mesh {
  const geo = grainy ? new THREE.IcosahedronGeometry(r, 2) : new THREE.SphereGeometry(r, 18, 12);
  const m = mesh(geo, mat(color, { roughness: grainy ? 1 : 0.6, flatShading: grainy }));
  m.position.y = r * 0.9;
  return m;
}
function strawberry(s = 1, halved = false): THREE.Group {
  const body = mesh(new THREE.ConeGeometry(0.022, 0.045, 14), mat(C.straw, { roughness: 0.35 }), 0, 0.022, 0);
  body.rotation.x = Math.PI;
  const leaf = mesh(new THREE.ConeGeometry(0.02, 0.008, 6), mat(C.basil), 0, 0.047, 0);
  const g = group(body, leaf);
  if (halved) g.rotation.z = Math.PI / 2.2;
  g.scale.setScalar(s);
  return g;
}
function grapes(n = 7, seed = 1): THREE.Group {
  const r = rng(seed);
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const d = r() * 0.035;
    g.add(mesh(new THREE.SphereGeometry(0.016, 12, 10), mat(C.grape, { roughness: 0.3 }), Math.cos(a) * d, 0.015 + (i % 3) * 0.012, Math.sin(a) * d));
  }
  return g;
}
function tomato(s = 1): THREE.Group {
  const g = group(
    mesh(new THREE.SphereGeometry(0.016, 14, 10), mat(C.tomato, { roughness: 0.25 }), 0, 0.016, 0),
    mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.003, 5), mat(C.basil), 0, 0.032, 0)
  );
  g.scale.setScalar(s);
  return g;
}
function leaf(s = 1, color = C.basil): THREE.Mesh {
  const m = mesh(new THREE.SphereGeometry(0.02, 10, 6), mat(color, { roughness: 0.5 }));
  m.scale.set(1 * s, 0.12 * s, 0.45 * s);
  m.position.y = 0.004;
  return m;
}
function toast(w = 0.08, topping?: O): THREE.Group {
  const g = group(mesh(new THREE.BoxGeometry(w, 0.014, w * 0.75), mat(C.toast, { roughness: 0.95 }), 0, 0.007, 0));
  if (topping) g.add(at(topping, 0, 0.014, 0));
  return g;
}
function cheeseCube(s = 0.03): THREE.Mesh {
  return mesh(new THREE.BoxGeometry(s, s, s), mat(C.cheeseCube, { roughness: 0.7 }), 0, s / 2, 0);
}
function salamiFan(n = 6, r = 0.035): THREE.Group {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) {
    const s = mesh(new THREE.CylinderGeometry(r, r, 0.004, 20), mat(C.salami, { roughness: 0.7 }), i * r * 0.55, 0.006 + i * 0.003, 0);
    s.rotation.z = -0.35;
    g.add(s);
  }
  g.position.x = -((n - 1) * r * 0.55) / 2;
  return group(g);
}
function burrata(s = 1): THREE.Group {
  const body = mesh(new THREE.SphereGeometry(0.075, 24, 16), mat(C.white, { roughness: 0.35 }), 0, 0.05, 0);
  body.scale.y = 0.72;
  const g = group(body, at(tomato(1.1), 0, 0.098, 0));
  for (let k = 0; k < 6; k++) {
    const l = leaf(1.1);
    l.position.set(Math.cos((k / 6) * Math.PI * 2) * 0.03, 0.1, Math.sin((k / 6) * Math.PI * 2) * 0.03);
    l.rotation.y = -(k / 6) * Math.PI * 2;
    g.add(l);
  }
  g.scale.setScalar(s);
  return g;
}
function quiche(r = 0.05, top = C.egg): THREE.Group {
  return group(
    mesh(new THREE.CylinderGeometry(r, r * 0.85, r * 0.45, 24), mat(C.pastry, { roughness: 0.9 }), 0, r * 0.225, 0),
    mesh(new THREE.CylinderGeometry(r * 0.85, r * 0.85, 0.006, 24), mat(top, { roughness: 0.8 }), 0, r * 0.45, 0),
    mesh(new THREE.SphereGeometry(r * 0.12, 6, 4), mat(C.basil), r * 0.3, r * 0.47, 0),
    mesh(new THREE.SphereGeometry(r * 0.12, 6, 4), mat(C.tomato), -r * 0.3, r * 0.47, r * 0.2)
  );
}
function tartlet(topping: O): THREE.Group {
  return group(
    mesh(new THREE.CylinderGeometry(0.035, 0.028, 0.03, 8), mat(C.pastry, { roughness: 1, flatShading: true }), 0, 0.015, 0),
    at(topping, 0, 0.03, 0)
  );
}
function canudo(): THREE.Group {
  const c = mesh(new THREE.ConeGeometry(0.022, 0.1, 14), mat(C.pastry, { roughness: 0.9 }), 0, 0, 0);
  c.rotation.z = Math.PI / 2;
  const f = mesh(new THREE.SphereGeometry(0.02, 12, 8), mat(C.cream), -0.05, 0, 0);
  const g = group(c, f, mesh(new THREE.SphereGeometry(0.006, 6, 4), mat(C.basil), -0.06, 0.012, 0));
  g.position.y = 0.022;
  return group(g);
}
function salgado(color = C.fried): THREE.Group {
  const b = mesh(new THREE.SphereGeometry(0.025, 14, 10), mat(color, { roughness: 1 }), 0, 0.024, 0);
  const t = mesh(new THREE.ConeGeometry(0.018, 0.03, 12), mat(color, { roughness: 1 }), 0, 0.055, 0);
  return group(b, t);
}
function enroladinho(): THREE.Group {
  const m = mesh(new THREE.CapsuleGeometry(0.014, 0.06, 4, 10), mat(C.pastry, { roughness: 0.9 }), 0, 0.016, 0);
  m.rotation.z = Math.PI / 2;
  return group(m);
}
function folhado(): THREE.Group {
  const g = new THREE.Group();
  for (let i = 0; i < 4; i++)
    g.add(mesh(new THREE.BoxGeometry(0.06 - i * 0.003, 0.008, 0.045), mat(i % 2 ? C.pastry : 0xd99f55, { roughness: 1 }), 0, 0.004 + i * 0.008, 0));
  return g;
}
function shrimp(): THREE.Group {
  const t = mesh(new THREE.TorusGeometry(0.025, 0.012, 8, 16, Math.PI * 1.3), mat(C.fried, { roughness: 1 }), 0, 0.03, 0);
  t.rotation.z = Math.PI / 2;
  return group(t);
}
function potato(): THREE.Group {
  const b = mesh(new THREE.SphereGeometry(0.035, 16, 12), mat(0xd8b480, { roughness: 1 }), 0, 0.025, 0);
  b.scale.y = 0.75;
  return group(b, mesh(new THREE.SphereGeometry(0.022, 12, 8), mat(C.cheese, { roughness: 0.4 }), 0, 0.045, 0));
}
function roundSandwich(): THREE.Group {
  return group(
    mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.014, 20), mat(C.cream, { roughness: 1 }), 0, 0.007, 0),
    mesh(new THREE.CylinderGeometry(0.041, 0.041, 0.01, 20), mat(C.pink), 0, 0.019, 0),
    mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.014, 20), mat(C.cream, { roughness: 1 }), 0, 0.031, 0),
    mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.04, 6), mat(C.tomato, { transparent: true, opacity: 0.8 }), 0, 0.055, 0)
  );
}
function sausages(): THREE.Group {
  const g = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const s = mesh(new THREE.CapsuleGeometry(0.012, 0.03, 4, 8), mat(0x8e3b23, { roughness: 0.4 }), (i - 1) * 0.028, 0.013, 0);
    s.rotation.x = Math.PI / 2;
    g.add(s);
  }
  return g;
}
function fries(n = 8, seed = 3): THREE.Group {
  const r = rng(seed);
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) {
    const f = mesh(new THREE.BoxGeometry(0.008, 0.06, 0.008), mat(0xf0c050, { roughness: 0.9 }), (r() - 0.5) * 0.04, 0.03, (r() - 0.5) * 0.04);
    f.rotation.set((r() - 0.5) * 0.6, r(), (r() - 0.5) * 0.6);
    g.add(f);
  }
  return g;
}
function shredded(color = C.meat, r = 0.03): THREE.Mesh {
  const m = mesh(new THREE.IcosahedronGeometry(r, 1), mat(color, { roughness: 1, flatShading: true }), 0, r * 0.5, 0);
  m.scale.y = 0.6;
  return m;
}
function popcorn(n = 14, seed = 5, color = 0xf3e2b0): THREE.Group {
  const r = rng(seed);
  const g = new THREE.Group();
  for (let i = 0; i < n; i++)
    g.add(mesh(new THREE.DodecahedronGeometry(0.011, 0), mat(i % 3 ? color : 0xc8863a, { roughness: 1, flatShading: true }), (r() - 0.5) * 0.06, r() * 0.03, (r() - 0.5) * 0.06));
  return g;
}
function brigadeiro(color = C.choc, grainy = true): THREE.Group {
  return paperCup(C.choc, ball(0.02, color, grainy));
}
function flowers(n = 7, color = C.pink, h = 0.18, seed = 9): THREE.Group {
  const r = rng(seed);
  const g = group(mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.06, 16), mat(C.gold, { metalness: 0.7, roughness: 0.3 }), 0, 0.03, 0));
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const d = r() * 0.05;
    const hh = h * (0.7 + r() * 0.4);
    g.add(mesh(new THREE.CylinderGeometry(0.003, 0.003, hh, 5), mat(C.basil), Math.cos(a) * d * 0.5, hh / 2, Math.sin(a) * d * 0.5));
    g.add(mesh(new THREE.IcosahedronGeometry(0.028, 1), mat(i % 3 === 0 ? C.white : color, { roughness: 0.8, flatShading: true }), Math.cos(a) * d, hh, Math.sin(a) * d));
    g.add(at(leaf(1.2), Math.cos(a) * d * 0.6, hh * 0.6, Math.sin(a) * d * 0.6, a));
  }
  return g;
}
function parmaArch(w = 0.86, h = 0.5): THREE.Group {
  const wood = mat(C.woodDark, { roughness: 0.8 });
  const g = group(
    mesh(new THREE.BoxGeometry(0.035, h, 0.035), wood, -w / 2, h / 2, -0.2),
    mesh(new THREE.BoxGeometry(0.035, h, 0.035), wood, w / 2, h / 2, -0.2),
    mesh(new THREE.CylinderGeometry(0.01, 0.01, w, 8), wood, 0, h - 0.01, -0.2)
  );
  g.children[2].rotation.z = Math.PI / 2;
  const n = 7;
  const r = rng(11);
  for (let i = 0; i < n; i++) {
    const sw = (w - 0.06) / n + 0.03;
    const sh = 0.2 + r() * 0.08;
    const geo = new THREE.PlaneGeometry(sw, sh, 6, 8);
    const pos = geo.attributes.position;
    for (let v = 0; v < pos.count; v++) {
      const y = pos.getY(v);
      const x = pos.getX(v);
      pos.setZ(v, Math.sin(x * 40 + i) * 0.01 + (0.5 - (y + sh / 2) / sh) * 0.02);
    }
    geo.computeVertexNormals();
    const m = mesh(geo, mat(i % 2 ? C.parma : 0xe08a8c, { roughness: 0.55, side: THREE.DoubleSide }), -w / 2 + 0.04 + i * ((w - 0.08) / (n - 1)), h - sh / 2 - 0.005, -0.2 + 0.012);
    g.add(m);
  }
  return g;
}
function trophy(): THREE.Group {
  const gold = metal(C.gold);
  const prof = [
    new THREE.Vector2(0.02, 0),
    new THREE.Vector2(0.05, 0.02),
    new THREE.Vector2(0.06, 0.1),
    new THREE.Vector2(0.03, 0.14),
    new THREE.Vector2(0.07, 0.16),
    new THREE.Vector2(0.0, 0.17),
  ];
  return group(
    mesh(new THREE.BoxGeometry(0.12, 0.05, 0.1), mat(C.black, { roughness: 0.3 }), 0, 0.025, 0),
    at(mesh(new THREE.LatheGeometry(prof, 24), mat(0x222222, { metalness: 0.6, roughness: 0.3 })), 0, 0.05, 0),
    mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 24), gold, 0, 0.23, 0),
    mesh(new THREE.SphereGeometry(0.015, 12, 8), gold, 0.01, 0.255, 0),
    mesh(new THREE.CapsuleGeometry(0.018, 0.12, 4, 10), gold, 0, 0.33, 0),
    mesh(new THREE.SphereGeometry(0.016, 12, 8), gold, 0, 0.42, 0)
  );
}
function candle(): THREE.Group {
  return group(
    mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.03, 16), mat(C.white), 0, 0.015, 0),
    mesh(new THREE.SphereGeometry(0.007, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffc94d }), 0, 0.04, 0)
  );
}
function spoon(): THREE.Mesh {
  const m = mesh(new THREE.CylinderGeometry(0.003, 0.004, 0.09, 6), metal(C.silver), 0.02, 0.0, 0);
  m.rotation.z = -1.1;
  return m;
}
function whiteDisc(): THREE.Mesh {
  return mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.012, 28), mat(0xf7f3ea, { roughness: 0.6 }), 0, 0.006, 0);
}

// ---------- Composições usadas em vários pratos ----------
const pannaCotta = () => {
  const c = cup(0.042, 0.09, [{ color: C.white, h: 0.055 }, { color: 0xb3122c, h: 0.018 }], strawberry(1, true), true);
  c.add(at(spoon(), 0.03, c.userData.top, 0));
  return c;
};
const shrimpMartini = () => martini(0.065, at(shrimp(), 0.02, 0, 0), C.yellow);
const fruitMix = (seed = 1) =>
  group(at(grapes(8, seed), -0.03, 0, 0), at(strawberry(), 0.03, 0, 0.02), at(strawberry(), 0.035, 0, -0.03), at(grapes(5, seed + 1), 0, 0, 0.05));
const charcuterie = (seed = 1) =>
  group(
    at(salamiFan(6), -0.2, 0, -0.12),
    at(salamiFan(5), 0.15, 0, 0.15, 0.6),
    grid(3, 2, 0.04, 0.04, 0, () => cheeseCube()).translateX(0.18).translateZ(-0.12),
    grid(2, 2, 0.04, 0.04, 0, () => cheeseCube(0.028)).translateX(-0.2).translateZ(0.14),
    at(fruitMix(seed), 0, 0, 0),
    at(toast(0.07), -0.05, 0, 0.18, 0.2),
    at(toast(0.07), 0.02, 0.014, 0.19, -0.2)
  );

function onTop(base: THREE.Group, ...items: O[]): THREE.Group {
  const top = base.userData.top ?? 0;
  const g = group(base);
  items.forEach((it) => {
    it.position.y += top;
    g.add(it);
  });
  return g;
}

// ---------- Receitas por item do cardápio ----------
const recipes: Record<string, () => O> = {
  "buffet-completo": () =>
    onTop(
      table(),
      at(onTop(board(0.36, 0.24), charcuterie(2)), -0.28, 0, 0.1, 0, 0.6),
      at(onTop(roundTray(0.13), fruitMix(3), at(fruitMix(4), 0.05, 0, -0.05)), 0.27, 0, 0.12),
      at(onTop(cakeStand(0.12), ring(6, 0.07, 0, () => salgado()), salgado()), 0.05, 0, -0.12),
      at(quiche(0.07), -0.3, 0, -0.16),
      at(flowers(6, C.pink, 0.16), 0.36, 0, -0.17)
    ),
  "mesa-elegante": () =>
    onTop(
      table(),
      at(flowers(10, C.pink, 0.28, 2), 0, 0, -0.12),
      at(onTop(cakeStand(0.11, 0.16), ring(7, 0.07, 0, () => brigadeiro()), brigadeiro()), -0.27, 0, -0.08),
      at(onTop(cakeStand(0.11, 0.1, C.silver), ring(6, 0.065, 0, () => canudo()), salgado()), 0.27, 0, -0.08),
      grid(4, 1, 0.09, 0, 0, () => pannaCotta()).translateZ(0.17),
      at(onTop(board(0.3, 0.18), at(salamiFan(5), 0, 0, 0), at(grapes(6), 0.09, 0, 0)), 0.34, 0, 0.17, 0, 0.6)
    ),
  "mini-hamburgueres-salgados": () =>
    onTop(roundTray(0.46), grid(3, 3, 0.11, 0.11, 0, () => burger()), ring(10, 0.36, 0, () => salgado())),
  "tabua-charcutaria": () => onTop(board(), charcuterie(5), at(bowl(0.05, 0x7a1f2b), 0, 0, 0.12)),
  "verrine-morango": () =>
    onTop(plate(0.36, 0xf1ece4), grid(3, 1, 0.16, 0, 0, () => cup(0.06, 0.16, [{ color: C.white, h: 0.06 }, { color: 0xd94c5c, h: 0.03 }, { color: C.cream, h: 0.04 }, { color: 0xb3122c, h: 0.015 }], strawberry(1.4)))),
  "tabuas-frios-queijos": () =>
    group(at(onTop(board(0.48, 0.5), charcuterie(1)), -0.25, 0, 0, 0.1, 0.9), at(onTop(board(0.48, 0.5), charcuterie(7)), 0.25, 0, 0.02, -0.1, 0.9)),
  "mesa-finger-food": () =>
    onTop(
      table(),
      at(onTop(roundTray(0.16), grid(3, 3, 0.08, 0.08, 0, () => burger(0.8))), -0.27, 0, 0.05),
      at(onTop(roundTray(0.16, C.gold), ring(8, 0.1, 0, () => canudo()), salgado()), 0.27, 0, 0.05),
      at(onTop(cakeStand(0.11), ring(6, 0.065, 0, () => salgado()), salgado()), 0, 0, -0.15),
      at(flowers(6), 0, 0, 0.16, 0, 0.8)
    ),
  "buffet-frios-frutas": () =>
    onTop(
      table(),
      at(onTop(board(0.5, 0.32), charcuterie(3)), -0.22, 0, 0.05, 0, 0.75),
      at(onTop(roundTray(0.16), fruitMix(5), at(fruitMix(6), 0.07, 0, -0.06), at(fruitMix(8), -0.06, 0, 0.06)), 0.25, 0, 0.06),
      at(glassBowl(0.08, grid(3, 2, 0.03, 0.03, 0, () => tomato())), 0.05, 0, -0.17),
      at(flowers(6, C.white), -0.36, 0, -0.18, 0, 0.8)
    ),
  "frios-frutas-bruschettas": () =>
    onTop(
      board(),
      grid(4, 2, 0.1, 0.08, 0, () => toast(0.085, group(at(tomato(0.9), -0.015, 0, 0), at(tomato(0.9), 0.02, 0, 0.005), at(leaf(0.8), 0, 0.02, 0)))).translateZ(-0.15),
      at(salamiFan(7), -0.18, 0, 0.13),
      at(fruitMix(9), 0.22, 0, 0.12)
    ),
  "canudos-camarao": () =>
    group(
      onTop(roundTray(0.3, C.gold), ring(10, 0.19, 0, () => canudo()), ring(5, 0.08, 0, () => canudo())),
      at(shrimpMartini(), 0.38, 0, -0.18),
      at(shrimpMartini(), 0.4, 0, 0.0),
      at(shrimpMartini(), 0.36, 0, 0.18)
    ),
  "estrogonofe-torradas": () =>
    onTop(board(), at(bowl(0.14, 0xb7652d, 0xf6f1e7), -0.12, 0, 0), ring(8, 0.13, 0, () => toast(0.07)).translateX(0.25), at(leaf(1.5), -0.12, 0.085, 0)),
  "verrines-morango-camarao": () =>
    onTop(mirrorTray(), grid(4, 2, 0.11, 0.13, 0, () => pannaCotta()).translateX(-0.18), grid(2, 2, 0.15, 0.17, 0, () => shrimpMartini()).translateX(0.3)),
  "panna-cotta-morango": () => onTop(mirrorTray(), grid(6, 4, 0.14, 0.14, 0, () => pannaCotta())),
  "quiche-artesanal": () => onTop(board(0.8, 0.7), at(quiche(0.28), 0, 0, 0), at(leaf(2), 0.33, 0, 0.25), at(tomato(1.4), 0.3, 0, -0.27)),
  "mini-burgers-canapes": () =>
    onTop(
      mirrorTray(),
      grid(3, 2, 0.12, 0.12, 0, () => burger()).translateX(-0.22),
      grid(3, 3, 0.1, 0.1, 0, () => toast(0.07, group(shredded(C.pink, 0.02), at(tomato(0.7), 0, 0.012, 0)))).translateX(0.22)
    ),
  "tacas-parma-queijo-frutas": () =>
    onTop(
      plate(0.44, 0xf1ece4),
      grid(3, 2, 0.24, 0.28, 0, (i, j) =>
        martini(0.08, group(at(cheeseCube(0.025), -0.015, 0, 0), at(grapes(4, i + j), 0.02, 0, 0), at(mesh(new THREE.TorusGeometry(0.02, 0.01, 8, 14), mat(C.parma)), 0, 0.03, 0)))
      )
    ),
  "tabua-parma-burrata": () =>
    onTop(
      board(0.9, 0.7),
      parmaArch(),
      at(burrata(1.1), -0.2, 0, 0.17),
      at(burrata(0.9), 0.0, 0, 0.03),
      at(glassBowl(0.09, grid(3, 3, 0.03, 0.03, 0, () => tomato())), 0.18, 0, -0.08),
      at(bowl(0.08, C.pesto, 0xe9f2f3), 0.26, 0, 0.12),
      grid(2, 3, 0.08, 0.07, 0, () => toast(0.075)).translateX(-0.2).translateZ(-0.13),
      at(leaf(2), 0.08, 0, 0.22, 0.4),
      at(leaf(2), 0.12, 0, 0.18, -0.6)
    ),
  "tabua-gourmet-assinada": () =>
    onTop(board(0.95, 0.65), charcuterie(12), at(bowl(0.05, 0xe0a030), 0.02, 0, -0.15), at(bowl(0.05, C.pesto), -0.02, 0, 0.13), at(burrata(0.6), 0.3, 0, 0.0)),
  "batatas-recheadas-salgados": () =>
    onTop(roundTray(0.46, C.gold), grid(3, 3, 0.11, 0.11, 0, () => potato()), ring(12, 0.36, 0, (k) => (k % 2 ? salgado() : enroladinho()))),
  "box-cafe-da-manha": () =>
    onTop(
      blackBox(),
      grid(2, 2, 0.1, 0.1, 0, () => roundSandwich()).translateX(-0.3).translateZ(-0.15),
      at(jar(C.choc), 0.33, 0, -0.2),
      at(cup(0.04, 0.1, [{ color: C.orange, h: 0.08 }]), 0.2, 0, -0.2),
      at(fruitMix(4), 0.0, 0, -0.17),
      grid(3, 1, 0.09, 0, 0, () => tartlet(strawberry(0.9, true))).translateZ(0.05),
      grid(4, 1, 0.08, 0, 0, () => cheeseCube(0.035)).translateZ(0.2),
      at(whiteDisc(), 0.33, 0, 0.1)
    ),
  "pave-saladas-pote": () =>
    onTop(
      plate(0.42, 0xf1ece4),
      grid(3, 1, 0.13, 0, 0, () => cup(0.05, 0.16, [{ color: C.choc, h: 0.03 }, { color: C.cream, h: 0.04 }, { color: 0x8a5a2a, h: 0.02 }, { color: C.cream, h: 0.04 }], ball(0.012, C.choc))).translateZ(-0.12),
      grid(3, 1, 0.13, 0, 0, () => cup(0.05, 0.16, [{ color: C.tomato, h: 0.03 }, { color: C.egg, h: 0.03 }, { color: C.lettuce, h: 0.05 }, { color: 0xf0e0b0, h: 0.02 }], leaf(1, C.lettuce))).translateZ(0.12)
    ),
  "pates-torradas-carne": () =>
    onTop(
      board(),
      at(bowl(0.07, 0xf0e6c8), -0.25, 0, -0.12),
      at(bowl(0.07, 0xd88c8c), 0, 0, -0.14),
      at(bowl(0.07, C.pesto), 0.25, 0, -0.12),
      at(onTop(plate(0.1), shredded(C.meat, 0.06)), 0.25, 0, 0.14),
      grid(4, 2, 0.08, 0.07, 0, () => toast(0.07)).translateX(-0.1).translateZ(0.14)
    ),
  "grande-mesa-festa": () =>
    onTop(
      table(1, 0.66, 0.2),
      at(flowers(12, C.rose, 0.3, 4), 0, 0, -0.18),
      at(onTop(cakeStand(0.12, 0.2), ring(7, 0.08, 0, () => brigadeiro()), brigadeiro()), -0.3, 0, -0.15),
      at(onTop(cakeStand(0.12, 0.12, C.silver), ring(7, 0.08, 0, () => salgado()), salgado()), 0.3, 0, -0.15),
      at(onTop(board(0.3, 0.2), at(salamiFan(5), -0.04, 0, 0), at(grapes(6), 0.09, 0, 0)), -0.3, 0, 0.15),
      at(onTop(roundTray(0.12), grid(2, 2, 0.08, 0.08, 0, () => burger(0.8))), 0.02, 0, 0.12),
      grid(2, 2, 0.08, 0.1, 0, () => pannaCotta()).translateX(0.32).translateZ(0.15),
      at(candle(), -0.12, 0, 0.0),
      at(candle(), 0.14, 0, 0.0)
    ),
  "pipoca-gourmet-cremes": () =>
    onTop(
      plate(0.44, 0xf1ece4),
      grid(3, 1, 0.14, 0, 0, () => cup(0.055, 0.12, [], popcorn())).translateZ(-0.12),
      grid(3, 1, 0.14, 0, 0, (i) => cup(0.05, 0.09, [{ color: [C.choc, C.cream, 0xe8a0b0][i], h: 0.07 }], ball(0.012, C.straw), true)).translateZ(0.13)
    ),
  "buffet-corporativo": () =>
    onTop(
      table(),
      at(onTop(roundTray(0.15), ring(8, 0.1, 0, () => salgado()), salgado()), -0.28, 0, 0.04),
      at(onTop(roundTray(0.15, C.gold), grid(3, 3, 0.08, 0.08, 0, () => roundSandwich())), 0.03, 0, 0.06),
      at(onTop(board(0.25, 0.25), at(fruitMix(2), 0, 0, 0)), 0.32, 0, 0.06),
      grid(5, 1, 0.08, 0, 0, () => cup(0.03, 0.09, [{ color: C.orange, h: 0.07 }])).translateZ(-0.18)
    ),
  "box-parabens": () =>
    onTop(
      blackBox(),
      at(group(mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 32), mat(C.pink, { roughness: 0.7 }), 0, 0.05, 0), mesh(new THREE.CylinderGeometry(0.122, 0.122, 0.012, 32), mat(C.white), 0, 0.1, 0), at(candle(), 0, 0.105, 0), ring(6, 0.08, 0.105, () => strawberry(0.8))), -0.22, 0, 0),
      grid(3, 3, 0.07, 0.07, 0, () => brigadeiro()).translateX(0.18).translateZ(-0.08),
      grid(4, 1, 0.07, 0, 0, () => strawberry()).translateX(0.18).translateZ(0.2)
    ),
  "box-gourmet-completo": () =>
    onTop(
      blackBox(),
      grid(2, 1, 0.1, 0, 0, () => burger(1.05)).translateX(-0.32).translateZ(-0.22),
      grid(3, 2, 0.06, 0.06, 0, () => group(mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.05, 10), mat(C.pastry), 0, 0.025, 0), at(shredded(0xf6e7b0, 0.022), 0, 0.05, 0))).translateX(-0.05).translateZ(-0.22),
      at(jar(), 0.33, 0, -0.22),
      at(whiteDisc(), -0.02, 0, -0.05),
      at(sausages(), 0.18, 0, -0.08),
      at(fruitMix(2), 0.32, 0, -0.04),
      grid(2, 1, 0.08, 0, 0, () => tartlet(strawberry(1, true))).translateX(0.06).translateZ(0.08),
      grid(2, 2, 0.08, 0.07, 0, () => toast(0.065, group(at(shredded(0xe8cfa0, 0.016), 0, 0, 0), at(tomato(0.7), 0, 0.01, 0)))).translateX(-0.3).translateZ(0.0),
      grid(2, 1, 0.13, 0, 0, () => group(mesh(new THREE.BoxGeometry(0.11, 0.035, 0.09), mat(C.white, { transparent: true, opacity: 0.4 }), 0, 0.0175, 0), at(shredded(C.egg, 0.035), -0.025, 0.02, 0), at(shredded(C.meat, 0.035), 0.025, 0.02, 0))).translateX(-0.22).translateZ(0.21),
      grid(2, 1, 0.09, 0, 0, () => roundSandwich()).translateX(0.3).translateZ(0.18)
    ),
  "mini-burgers-tabule": () =>
    onTop(
      mirrorTray(),
      grid(3, 2, 0.12, 0.13, 0, () => burger()).translateX(-0.22),
      grid(3, 2, 0.1, 0.13, 0, () => cup(0.04, 0.08, [{ color: 0xd9c38a, h: 0.03 }, { color: C.lettuce, h: 0.02 }], group(at(tomato(0.6), 0.01, 0, 0), at(leaf(0.6), -0.01, 0, 0)))).translateX(0.24)
    ),
  "enroladinhos-quiches": () =>
    onTop(roundTray(0.46), grid(3, 3, 0.11, 0.11, 0, () => quiche(0.045)), ring(14, 0.36, 0, () => enroladinho())),
  "box-presente-rosa": () =>
    onTop(
      blackBox(),
      at(flowers(1, C.rose, 0.2, 7), -0.3, 0, 0),
      grid(3, 2, 0.07, 0.07, 0, (i) => brigadeiro(i % 2 ? C.choc : C.white)).translateX(0.0).translateZ(-0.12),
      at(jar(C.choc, C.rose), 0.3, 0, -0.15),
      grid(4, 1, 0.07, 0, 0, () => strawberry()).translateX(0.1).translateZ(0.15)
    ),
  "folhados-canudos": () =>
    onTop(mirrorTray(), grid(4, 3, 0.09, 0.09, 0, () => folhado()).translateX(-0.22), grid(2, 5, 0.12, 0.11, 0, () => canudo()).translateX(0.27)),
  "mesa-salgados-frutas": () =>
    onTop(
      table(),
      at(onTop(roundTray(0.16), ring(9, 0.11, 0, () => salgado()), salgado()), -0.27, 0, 0.05),
      at(onTop(roundTray(0.16, C.gold), fruitMix(1), at(fruitMix(2), 0.07, 0, -0.05), at(fruitMix(3), -0.06, 0, 0.07)), 0.27, 0, 0.05),
      at(onTop(cakeStand(0.11), ring(7, 0.07, 0, () => enroladinho())), 0, 0, -0.14),
      at(flowers(6, C.pink), 0, 0, 0.17, 0, 0.7)
    ),
  "tortinhas-pates": () =>
    onTop(
      board(),
      grid(4, 2, 0.1, 0.1, 0, (i) => tartlet(i % 2 ? group(shredded(0xd88c8c, 0.02), at(leaf(0.6), 0, 0.012, 0)) : group(shredded(0xf0e6c8, 0.02), at(tomato(0.6), 0, 0.012, 0)))).translateZ(-0.1),
      at(bowl(0.06, 0xf0e6c8), -0.2, 0, 0.17),
      at(bowl(0.06, 0xd88c8c), 0, 0, 0.17),
      at(bowl(0.06, C.pesto), 0.2, 0, 0.17)
    ),
  "carne-desfiada-fritas-taca": () =>
    onTop(plate(0.44, 0xf1ece4), grid(3, 2, 0.22, 0.26, 0, () => cup(0.05, 0.12, [{ color: C.meat, h: 0.05 }], fries(), true))),
  "brigadeiros-tematicos": () => {
    const sprinkles = [C.yellow, C.blue, C.green];
    const m = (k: number) =>
      martini(0.085, group(at(ball(0.03, sprinkles[k % 3], true), -0.022, 0, 0), at(ball(0.03, sprinkles[(k + 1) % 3], true), 0.025, 0, 0.01), at(ball(0.03, sprinkles[(k + 2) % 3], true), 0, 0.035, -0.01)));
    return onTop(roundTray(0.46, C.black), trophy(), ring(6, 0.29, 0, (k) => m(k)));
  },
  "bolinhas-crocantes-taca": () =>
    onTop(
      plate(0.44, 0xf1ece4),
      grid(3, 2, 0.22, 0.26, 0, () =>
        martini(0.08, group(at(ball(0.022, C.fried, true), -0.02, 0, 0), at(ball(0.022, C.fried, true), 0.022, 0, 0.01), at(ball(0.022, C.fried, true), 0, 0.025, 0), mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.08, 5), mat(C.cream), 0, 0.06, 0)))
      )
    ),
  "mosaico-finger-foods": () => {
    const makers = [() => burger(0.9), () => salgado(), () => canudo(), () => tartlet(strawberry(0.9, true)), () => roundSandwich(), () => quiche(0.04), () => enroladinho(), () => brigadeiro()];
    return onTop(mirrorTray(), grid(7, 5, 0.125, 0.12, 0, (i, j) => makers[(i + j * 3) % makers.length]()));
  },
};

// Modelo genérico para itens novos que ainda não têm receita.
function fallback(): O {
  return onTop(roundTray(0.4), ring(8, 0.25, 0, () => salgado()), grid(2, 2, 0.12, 0.12, 0, () => burger()));
}

export function hasDishModel(slug: string): boolean {
  return slug in recipes;
}

export function buildDishModel(slug: string): THREE.Group {
  const inner = (recipes[slug] ?? fallback)();
  // Centraliza e normaliza para ~1 unidade de largura.
  const box = new THREE.Box3().setFromObject(inner);
  const size = box.getSize(new THREE.Vector3());
  const s = 1 / Math.max(size.x, size.z, 0.0001);
  const center = box.getCenter(new THREE.Vector3());
  inner.position.set(-center.x, -box.min.y, -center.z);
  const root = new THREE.Group();
  root.add(inner);
  root.scale.setScalar(s);
  root.userData.baseScale = s;
  root.name = slug;
  return root;
}

// Libera as geometrias (os materiais são compartilhados e ficam em cache).
export function disposeModel(o: THREE.Object3D) {
  o.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).geometry.dispose();
  });
}
