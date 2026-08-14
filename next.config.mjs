/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // As fotos ficam em /public/fotos e são servidas localmente.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
