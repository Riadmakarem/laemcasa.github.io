"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { menu, type MenuItem } from "@/lib/data";
import { buildDishModel, disposeModel } from "@/lib/ar-models";
import { whatsappLink, withBase } from "@/lib/site";

// Arquivos gerados para o reconhecimento das fotos (ver scripts/compile-ar-targets.cjs).
const MINDAR_URL = withBase("/ar/mindar/mindar-image.prod.js");
const TARGETS_URL = withBase("/ar/targets.mind");
const TARGETS_INDEX_URL = withBase("/ar/targets.json");

type Mode = "preview" | "scan";
type ScanStatus = "idle" | "loading" | "scanning" | "found" | "error";

function addLights(scene: THREE.Scene, shadows: boolean) {
  scene.add(new THREE.HemisphereLight(0xfff6e8, 0x3a2c20, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(1.5, 3, 2);
  sun.castShadow = shadows;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.02;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 8;
  const s = sun.shadow.camera as THREE.OrthographicCamera;
  s.left = s.bottom = -1;
  s.right = s.top = 1;
  scene.add(sun);
}

function makeRenderer(alpha: boolean) {
  const r = new THREE.WebGLRenderer({ antialias: true, alpha });
  r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  r.shadowMap.enabled = true;
  r.shadowMap.type = THREE.PCFShadowMap;
  r.outputColorSpace = THREE.SRGBColorSpace;
  return r;
}

// ---------------- Visualizador 3D (sem câmera) ----------------
function Preview({ item }: { item: MenuItem }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{ scene: THREE.Scene; holder: THREE.Group } | null>(null);

  useEffect(() => {
    const host = hostRef.current!;
    const renderer = makeRenderer(true);
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    addLights(scene, true);
    const ground = new THREE.Mesh(new THREE.CircleGeometry(1.2, 48), new THREE.ShadowMaterial({ opacity: 0.25 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    const holder = new THREE.Group();
    scene.add(holder);
    sceneRef.current = { scene, holder };

    const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 50);
    camera.position.set(0, 1.05, 1.95);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.15, 0);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.6;
    controls.minDistance = 0.5;
    controls.maxDistance = 3;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.enablePan = false;

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });

    return () => {
      ro.disconnect();
      renderer.setAnimationLoop(null);
      controls.dispose();
      holder.children.forEach(disposeModel);
      renderer.dispose();
      renderer.domElement.remove();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;
    ctx.holder.children.forEach((c) => {
      disposeModel(c);
      ctx.holder.remove(c);
    });
    ctx.holder.add(buildDishModel(item.slug));
  }, [item.slug]);

  return <div ref={hostRef} className="m3d-stage" aria-label={`Modelo 3D: ${item.title}`} role="img" />;
}

// ---------------- Scanner AR (câmera do dispositivo) ----------------
function Scanner({ onFound }: { onFound: (item: MenuItem | null) => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<ScanStatus>("loading");
  const [error, setError] = useState("");
  const onFoundRef = useRef(onFound);
  onFoundRef.current = onFound;

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current!;
    let stream: MediaStream | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let controller: any = null;
    const renderer = makeRenderer(true);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    addLights(scene, false);
    const video = document.createElement("video");
    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");
    video.muted = true;
    video.autoplay = true;
    video.className = "m3d-video";

    // Âncora seguindo a foto; a sombra deixa o prato "apoiado" sobre ela.
    const anchor = new THREE.Group();
    anchor.matrixAutoUpdate = false;
    anchor.visible = false;
    scene.add(anchor);
    const upright = new THREE.Group();
    upright.rotation.x = Math.PI / 2; // Y do modelo -> para fora da foto
    anchor.add(upright);
    // Sombra suave fixa (as unidades do AR são grandes demais para shadow map).
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.55, 40),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.002;
    shadow.scale.z = 0.8;
    upright.add(shadow);
    let current: { index: number; model: THREE.Group } | null = null;
    let popT = 1;

    let slugs: string[] = [];
    let postMatrices: THREE.Matrix4[] = [];
    let lastIndex = -1;

    const resize = () => {
      if (!controller || !video.videoWidth) return;
      const cw = host.clientWidth;
      const ch = host.clientHeight;
      const va = video.videoWidth / video.videoHeight;
      const ca = cw / ch;
      // Vídeo em "cover"
      let vw: number, vh: number;
      if (va > ca) {
        vh = ch;
        vw = vh * va;
      } else {
        vw = cw;
        vh = vw / va;
      }
      video.style.width = `${vw}px`;
      video.style.height = `${vh}px`;
      video.style.left = `${-(vw - cw) / 2}px`;
      video.style.top = `${-(vh - ch) / 2}px`;
      // Câmera virtual com o mesmo campo de visão do vídeo (lógica do MindAR).
      const m = controller.getProjectionMatrix();
      const fov = (2 * Math.atan((1 / m[5]) * (ch / vh)) * 180) / Math.PI;
      camera.fov = fov;
      camera.near = m[14] / (m[10] - 1);
      camera.far = m[14] / (m[10] + 1);
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);
    };

    const showTarget = (index: number) => {
      if (current?.index === index) return;
      if (current) {
        disposeModel(current.model);
        upright.remove(current.model);
      }
      const slug = slugs[index];
      const model = buildDishModel(slug);
      upright.add(model);
      current = { index, model };
      popT = 0;
    };

    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Este navegador não permite acessar a câmera. Abra o site pelo Chrome ou Safari, em HTTPS.");
        }
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (cancelled) return;
        video.srcObject = stream;
        await new Promise<void>((res) => (video.readyState >= 1 ? res() : video.addEventListener("loadedmetadata", () => res(), { once: true })));
        await video.play().catch(() => undefined);
        // O MindAR lê os atributos width/height do vídeo para capturar os quadros.
        video.setAttribute("width", String(video.videoWidth));
        video.setAttribute("height", String(video.videoHeight));
        host.prepend(video);
        host.appendChild(renderer.domElement);
        renderer.domElement.classList.add("m3d-canvas");

        const [mod, index] = await Promise.all([
          import(/* webpackIgnore: true */ MINDAR_URL as string),
          fetch(TARGETS_INDEX_URL).then((r) => r.json() as Promise<string[]>),
        ]);
        if (cancelled) return;
        slugs = index;
        controller = new mod.Controller({
          inputWidth: video.videoWidth,
          inputHeight: video.videoHeight,
          maxTrack: 1,
          filterMinCF: 0.0001,
          filterBeta: 0.001,
          warmupTolerance: 3,
          missTolerance: 6,
          onUpdate: (data: { type: string; targetIndex: number; worldMatrix: number[] | null }) => {
            if (data.type !== "updateMatrix") return;
            const { targetIndex, worldMatrix } = data;
            if (worldMatrix) {
              showTarget(targetIndex);
              anchor.matrix.fromArray(worldMatrix).multiply(postMatrices[targetIndex]);
              anchor.visible = true;
              if (lastIndex !== targetIndex) {
                lastIndex = targetIndex;
                setStatus("found");
                onFoundRef.current(menu.find((m) => m.slug === slugs[targetIndex]) ?? null);
              }
            } else if (targetIndex === lastIndex) {
              anchor.visible = false;
              lastIndex = -1;
              setStatus("scanning");
              onFoundRef.current(null);
            }
          },
        });
        const { dimensions } = (await controller.addImageTargets(TARGETS_URL)) as { dimensions: [number, number][] };
        if (cancelled) return;
        // Origem no centro da foto, 1 unidade = largura da foto.
        postMatrices = dimensions.map(([w, h]) =>
          new THREE.Matrix4().compose(new THREE.Vector3(w / 2, h / 2, 0), new THREE.Quaternion(), new THREE.Vector3(w, w, w))
        );
        resize();
        await controller.dummyRun(video);
        if (cancelled) return;
        controller.processVideo(video);
        setStatus("scanning");

        renderer.setAnimationLoop(() => {
          if (current && popT < 1) {
            popT = Math.min(1, popT + 0.06);
            const e = 1 - Math.pow(1 - popT, 3);
            current.model.scale.setScalar(current.model.userData.baseScale * e);
          }
          renderer.render(scene, camera);
        });
      } catch (e) {
        if (cancelled) return;
        const msg =
          e instanceof DOMException && e.name === "NotAllowedError"
            ? "Permissão da câmera negada. Libere o acesso à câmera nas configurações do navegador."
            : e instanceof Error
              ? e.message
              : "Não foi possível iniciar a câmera.";
        setError(msg);
        setStatus("error");
      }
    })();

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    return () => {
      cancelled = true;
      ro.disconnect();
      renderer.setAnimationLoop(null);
      try {
        controller?.stopProcessVideo();
      } catch {
        /* já parado */
      }
      stream?.getTracks().forEach((t) => t.stop());
      video.remove();
      if (current) disposeModel(current.model);
      renderer.dispose();
      renderer.domElement.remove();
      onFoundRef.current(null);
    };
  }, []);

  return (
    <div ref={hostRef} className="m3d-stage m3d-scan">
      {status === "loading" && <div className="m3d-overlay">Preparando a câmera e o reconhecimento...</div>}
      {status === "scanning" && (
        <div className="m3d-overlay m3d-hint">
          Aponte a câmera para uma foto do cardápio
        </div>
      )}
      {status === "error" && <div className="m3d-overlay m3d-error">{error}</div>}
    </div>
  );
}

// ---------------- Página ----------------
export default function Menu3D() {
  const [mode, setMode] = useState<Mode>("preview");
  const [slug, setSlug] = useState(menu[0].slug);
  const [found, setFound] = useState<MenuItem | null>(null);
  const item = menu.find((m) => m.slug === slug) ?? menu[0];

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get("item");
    if (s && menu.some((m) => m.slug === s)) setSlug(s);
    if (q.get("modo") === "camera") setMode("scan");
  }, []);

  const handleFound = useCallback((m: MenuItem | null) => setFound(m), []);
  const shown = mode === "scan" ? found : item;

  return (
    <section className="section m3d">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Cardápio 3D</p>
          <h2>Veja nossos pratos em 3D</h2>
          <p>
            Gire os modelos na tela ou use a câmera do celular: aponte para qualquer
            foto do nosso cardápio (impressa ou em outra tela) e o prato aparece em 3D
            sobre ela.
          </p>
        </div>

        <div className="menu-filters" role="tablist" aria-label="Modo do cardápio 3D">
          <button role="tab" aria-selected={mode === "preview"} className={`chip ${mode === "preview" ? "chip-active" : ""}`} onClick={() => setMode("preview")}>
            Ver em 3D
          </button>
          <button role="tab" aria-selected={mode === "scan"} className={`chip ${mode === "scan" ? "chip-active" : ""}`} onClick={() => setMode("scan")}>
            Escanear com a câmera
          </button>
        </div>

        <div className="m3d-layout">
          <div className="m3d-view">
            {mode === "preview" ? <Preview item={item} /> : <Scanner onFound={handleFound} />}
          </div>

          <aside className="m3d-info">
            {shown ? (
              <>
                <h3>{shown.title}</h3>
                <p>{shown.description}</p>
                <div className="m3d-actions">
                  <Link href={`/cardapio/${shown.slug}`} className="btn btn-dark">
                    Ver detalhes
                  </Link>
                  <a
                    href={whatsappLink(`Olá! Vi o item "${shown.title}" no cardápio 3D e quero fazer um pedido.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Pedir no WhatsApp
                  </a>
                </div>
              </>
            ) : (
              <p className="m3d-muted">
                Nenhuma foto reconhecida ainda. Segure o celular a uns 30 cm da foto,
                com boa iluminação.
              </p>
            )}
          </aside>
        </div>

        {mode === "preview" && (
          <div className="m3d-picker" aria-label="Escolha um item">
            {menu.map((m) => (
              <button
                key={m.slug}
                className={`m3d-thumb ${m.slug === slug ? "is-active" : ""}`}
                onClick={() => setSlug(m.slug)}
                aria-pressed={m.slug === slug}
                title={m.title}
              >
                <Image src={m.src} alt={m.title} width={96} height={96} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
