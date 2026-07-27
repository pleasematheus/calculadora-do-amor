import { defineTheme } from "@astryxdesign/core/theme";
import { neutralTheme } from "@astryxdesign/theme-neutral";

// Marca: acento #F08787 (coral), fundo #F4D8FF (lilás), cartão #F8FAB4 (amarelo),
// superfície discreta #FFC7A7 (pêssego).
// Toda a paleta é clara — exige texto escuro em cima, daí --color-on-accent.
// Hex fixo, sem light-dark(): esses tokens ficam claros mesmo se o SO estiver em
// dark. --color-text-primary continua light-dark(), e é por isso que o <html>
// carrega data-theme="light" (app/layout.tsx): com color-scheme travado em
// claro, light-dark() resolve sempre no valor claro e o texto continua legível
// sobre esses fundos. Sem isso, texto #fafafa no amarelo do cartão dava 1,04:1.
export default defineTheme({
  name: "amor",
  extends: neutralTheme,
  // A fonte vem do next/font (app/layout.tsx) via CSS var.
  typography: {
    body: { family: "var(--font-instrument-serif)", fallbacks: "Georgia, serif" },
    heading: { family: "var(--font-instrument-serif)", fallbacks: "Georgia, serif" },
  },
  tokens: {
    "--color-accent": "#F08787",
    "--color-on-accent": "#0A1317",
    "--color-accent-muted": "#F0878759",
    // Coral escuro: 6,6:1 no lilás, 7,9:1 no amarelo do cartão. Só texto —
    // --color-icon-accent saiu daqui porque nenhuma regra do Astryx lê esse
    // token: Icon color="accent" resolve para --color-accent. A cor dos ícones
    // do resultado vem por herança, pela faixa de raridade (app/globals.css).
    "--color-text-accent": "#8A2A2A",
    // Neutro cinza (#737373) dava 3,6:1 no lilás e 3,2:1 no pêssego — texto
    // secundário virava exceção proibida, e a página inteira acabou num tom só.
    // Este ameixa acinzentado passa nas três superfícies (5,9 / 7,1 / 5,1) e
    // devolve a hierarquia: 4,5:1 é o piso de texto corrido.
    "--color-text-secondary": "#6B4A55",
    // As 200 figuras apagadas são "o resto do Brasil", não controle desligado.
    // Cáqui no lugar do cinza-aço padrão: mesma presença (1,99:1 no cartão,
    // contra 2,03:1 do #A4B0BC), na temperatura da paleta.
    "--color-icon-disabled": "#C4AE83",
    // display-1 é exclusividade do número do resultado, e a escala parava em
    // 42px — 7px acima do título da página. Dois pesos iguais disputando a
    // mesma tela; quem manda no produto é o número. 64px abre a distância sem
    // estourar o cartão: o pior caso ("51,20%") ocupa ~195px dos ~264px que
    // sobram dentro do vidro em tela de 320px.
    "--text-display-1-size": "4rem",
    "--color-background-surface": "#F4D8FF",
    "--color-background-body": "#F4D8FF",
    "--color-background-card": "#F8FAB4",
    "--color-background-muted": "#FFC7A7",
  },
  // O Astryx não tem token de tracking; a 64px, a Instrument Serif com
  // espacejamento normal abre demais entre os dígitos e o número perde a
  // silhueta de bloco.
  components: {
    text: {
      "type:display-1": { letterSpacing: "-0.02em" },
    },
  },
});
