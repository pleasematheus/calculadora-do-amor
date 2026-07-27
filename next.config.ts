import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF primeiro: o fundo é um campo desfocado com um degradê de céu enorme,
    // e é exatamente aí que o WebP mostra bandas. AVIF segura o degradê melhor
    // e sai ~20% menor. O preço é o encode, ~50% mais lento na primeira
    // requisição — daí o cache longo logo abaixo.
    formats: ["image/avif", "image/webp"],

    // O padrão do Next termina em 2048 e 3840. Com `sizes="100vw"`, um laptop
    // retina de 1440 pede 2880 e cai no candidato de 3840 — a maior variante
    // possível de uma foto que está fora de foco de propósito. Teto em 1920:
    // numa imagem borrada ninguém enxerga a diferença, e o pior caso despenca.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],

    // 60 para o fundo (ver app/layout.tsx); 75 fica disponível para qualquer
    // imagem futura com detalhe fino. A partir do Next 16 a lista é
    // obrigatória: sem ela, só 75 passa.
    qualities: [60, 75],

    // Padrão é 4 horas. O fundo nunca muda, e cada expiração paga de novo o
    // encode do AVIF. 31 dias.
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
