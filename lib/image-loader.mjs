// Loader de imagens do next/image. As fotos são estáticas (sem otimização),
// então só precisamos acrescentar o prefixo do GitHub Pages ("/<repositório>").
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function imageLoader({ src }) {
  return src.startsWith("/") ? `${basePath}${src}` : src;
}
