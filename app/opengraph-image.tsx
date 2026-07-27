import { ImageResponse } from "next/og";

/**
 * Cartão que aparece quando alguém cola o link no WhatsApp, no Instagram ou no
 * X — o único canal de distribuição do produto.
 *
 * Arquivo autocontido de propósito: não importa nada de `lib/` nem do tema.
 * Isto aqui é Satori, não o navegador — não existe Tailwind, não existe CSS do
 * Astryx, não existem variáveis de tema. Por isso `style` inline e hex da
 * marca escritos à mão são a única API possível, e não valem como exceção às
 * regras do resto do projeto. Se o build quebrar aqui, apagar este arquivo
 * resolve: as tags de openGraph em app/layout.tsx continuam funcionando.
 */

export const alt = "Calculadora do Amor — quantos brasileiros sobram depois das suas exigências";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LILAS = "#F4D8FF";
const TINTA = "#171717";
const CORAL_ESCURO = "#8A2A2A";
// Mesmas duas cores da grade na página: aceso na faixa mais farta da rampa de
// raridade, apagado no cáqui do "resto do Brasil" (app/globals.css, theme.ts).
const ACESO = "#B23A3A";
const APAGADO = "#C4AE83";

/**
 * Instrument Serif direto do Google. Se a rede do build não colaborar ou o
 * Google responder erro, a função devolve `undefined` e o cartão sai na fonte
 * padrão do Satori — feio, mas nunca quebrado.
 *
 * `fetch` só rejeita quando a conexão falha: um 404 ou um 503 chegam aqui como
 * resposta normal. Sem checar `ok`, o corpo da página de erro passava por CSS
 * (nenhum `src: url()` para casar) e, pior, os bytes do HTML de erro viravam
 * "fonte" — o `ImageResponse` estoura fora deste try e o cartão inteiro morre.
 */
async function instrumentSerif(): Promise<ArrayBuffer | undefined> {
  try {
    const respostaCss = await fetch(
      // impeccable-disable-next-line overused-font: é a tipografia da marca, já fixada em theme.ts — o cartão tem de bater com a página
      "https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0" } },
    );
    if (!respostaCss.ok) return undefined;

    const css = await respostaCss.text();
    const url = css.match(/src: url\((https:[^)]+\.woff2?)\)/)?.[1];
    if (!url) return undefined;

    const respostaFonte = await fetch(url);
    if (!respostaFonte.ok) return undefined;

    return await respostaFonte.arrayBuffer();
  } catch {
    return undefined;
  }
}

export default async function Image() {
  const fonte = await instrumentSerif();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: LILAS,
          padding: 72,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 92, color: TINTA, lineHeight: 1.05 }}>
            Calculadora do Amor
          </div>
          <div style={{ fontSize: 40, color: CORAL_ESCURO, lineHeight: 1.3 }}>
            Quantos brasileiros sobram depois das suas exigências?
          </div>
        </div>

        {/* Uma linha das 200 figuras da grade, com as primeiras acesas: é a
            assinatura visual da calculadora, reconhecível em miniatura. */}
        <div style={{ display: "flex", gap: 10 }}>
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                background: i < 3 ? ACESO : APAGADO,
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", fontSize: 28, color: TINTA }}>
          Censo 2022 do IBGE · PNAD Contínua · POF · PNS · Vigitel
        </div>
      </div>
    ),
    {
      ...size,
      ...(fonte
        ? { fonts: [{ name: "Instrument Serif", data: fonte, style: "normal" as const }] }
        : {}),
    },
  );
}
