/** @type {import('next').NextConfig} */

// No GitHub Pages o site fica em https://<dono>.github.io/<repositório>/,
// então todas as rotas e arquivos precisam do prefixo "/<repositório>".
// Em `next dev` e em builds locais o prefixo fica vazio.
const onPages = process.env.GITHUB_ACTIONS === "true";
const repo = (process.env.GITHUB_REPOSITORY ?? "").split("/")[1] ?? "";
const basePath = onPages && repo ? `/${repo}` : "";

const nextConfig = {
  reactStrictMode: true,
  // GitHub Pages só serve arquivos estáticos: gera a pasta /out no build.
  output: "export",
  basePath,
  env: {
    // Usado por código que monta URLs manualmente (ex.: modelos 3D em /ar).
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    // Sem servidor de imagens: o loader só acrescenta o prefixo do basePath.
    loader: "custom",
    loaderFile: "./lib/image-loader.mjs",
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
