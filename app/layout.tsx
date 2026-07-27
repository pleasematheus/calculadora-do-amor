import type { Metadata } from "next";
import Image from "next/image";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import "./astryx-theme.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const TITULO = "Calculadora do Amor";
const DESCRICAO =
  "Filtre idade, altura, renda e o resto das suas exigências e veja que fatia da população brasileira sobra. Dados do IBGE e do Ministério da Saúde.";

export const metadata: Metadata = {
  // Sem metadataBase o Next resolve URL relativa contra o domínio que ele
  // adivinha do deploy — na Vercel, o endereço específico daquele build, que
  // muda a cada preview. Fixando aqui, og:image e canonical apontam sempre
  // para produção. Trocar esta linha ao ligar um domínio próprio.
  metadataBase: new URL("https://calculadora-do-amor-nine.vercel.app"),
  title: TITULO,
  description: DESCRICAO,
  // O link circula com sujeira grudada: ?fbclid= do Facebook e Instagram,
  // ?utm_* de qualquer campanha. Cada variação é uma URL diferente para o
  // buscador. O canonical junta todas numa só.
  alternates: { canonical: "/" },
  // O produto inteiro chega por link colado no WhatsApp, no Instagram e no X.
  // Sem estas tags o link vira um retângulo cinza — é o funil vazando na
  // primeira etapa. A imagem sai de app/opengraph-image.tsx.
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: TITULO,
    title: TITULO,
    description: DESCRICAO,
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRICAO,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-astryx-theme="amor"
      /* A paleta da marca é toda clara e os tokens de fundo são hex fixo. Sem
         travar o color-scheme, o SO em modo escuro resolvia --color-text-primary
         para #fafafa e o texto sumia no cartão amarelo (1,04:1). */
      data-theme="light"
      className={`h-full antialiased ${instrumentSerif.variable}`}
    >
      {/* Sem `h-full` no <body>: o Layout do Astryx com height="auto" pede
          `min-height: 100%`, e com o body travado na altura da janela isso
          virava 100vh. Quando as duas colunas da calculadora somavam menos que
          a tela, sobrava uma faixa de foto entre elas e as perguntas. Com a
          altura do body vindo do conteúdo, o percentual fica indefinido, o
          `min-height` resolve em zero e a moldura encolhe até o conteúdo. */}
      <body className="relative flex flex-col">
        {/* Fundo da viewport inteira. Fica aqui e não na página porque nenhum
            componente da moldura Astryx pinta fundo — o AppShell pintava, por
            isso saiu. */}
        {/* quality 60 em vez do padrão 75: a foto é quase toda bokeh e degradê
            macio, com um único assunto em foco — a faixa de qualidade onde a
            diferença não aparece. Voltar para 75 é trocar uma palavra. */}
        <Image
          src="/background.png"
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="fundo-fixo -z-10 object-cover"
        />
        {children}
      </body>
    </html>
  );
}
