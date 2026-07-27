import type { MetadataRoute } from "next";

/**
 * Uma página só, tudo liberado — que já era o comportamento sem arquivo
 * nenhum. O que este arquivo acrescenta é o lugar explícito para restringir
 * depois (bloquear GPTBot e afins, por exemplo) sem ter de inventar a
 * estrutura na hora.
 *
 * Sem `sitemap` de propósito: não existe app/sitemap.ts, e apontar para um
 * /sitemap.xml inexistente é pior que não apontar. Com uma URL só, o buscador
 * chega por qualquer link de entrada.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
  };
}
