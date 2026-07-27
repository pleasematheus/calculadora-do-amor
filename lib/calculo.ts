import {
  CENSO_2022,
  POR_ALCOOL,
  POR_ALTURA,
  POR_CABELO,
  POR_EDUCACAO,
  POR_IMC,
  POR_OLHOS,
  POR_RENDA,
  POR_TABAGISMO,
  TAXAS,
} from "./dados";

/** Valor de "não filtrar" em todo seletor de escolha única. */
export const QUALQUER = "qualquer";

/**
 * Formato do percentual. Vive aqui porque o mesmo número aparece em dois
 * lugares no celular — a barra fixa e o cartão — e os dois têm de escrevê-lo
 * igual.
 */
export const pct = (v: number) => {
  const p = v * 100;
  // Duas casas dão conta de 0,18%, mas com muitos filtros ligados o resultado
  // desce para 0,0000018% — e "0,00%" seria a calculadora dizendo zero onde
  // ainda sobra gente. Abaixo de 1% a precisão acompanha os zeros à esquerda e
  // sempre entrega dois dígitos significativos. Teto de 20 porque é o limite
  // do Intl; o pior caso real (1 pessoa em 203 milhões) precisa de 8.
  const casas =
    p > 0 && p < 1 ? Math.min(20, Math.floor(-Math.log10(p)) + 2) : 2;

  return v.toLocaleString("pt-BR", {
    style: "percent",
    // Mínimo de 2 para o zero final não sumir ("38,40%", não "38,4%"): o
    // número é redesenhado a cada arrasto de filtro, e casa que aparece e some
    // faz a largura pular.
    minimumFractionDigits: 2,
    maximumFractionDigits: casas,
  });
};

/**
 * Faixa de raridade do resultado — é o que dá cor ao número e à grade.
 *
 * O corte de 0,5% não é redondo por acaso: é uma figura de 200, o ponto em que
 * a grade deixa de conseguir mostrar o resultado com honestidade e passa a
 * acender um ícone por arredondamento. 5% é a outra virada, de "dá para
 * procurar" para "é preciso sorte".
 */
export const raridade = (percentual: number) =>
  percentual >= 0.05 ? "comum" : percentual >= 0.005 ? "seletivo" : "raro";

export type Filtros = {
  genero: string;
  querCriancas: string;
  idade: [number, number];
  altura: [number, number];
  /** Renda mínima **mensal**, em reais. */
  rendaMinima: number;
  etnia: string[];
  corCabelo: string[];
  corOlhos: string[];
  educacaoMinima: string;
  fuma: string;
  bebe: string;
  excluirCasados: boolean;
  excluirObesos: boolean;
};

type Genero = keyof typeof CENSO_2022.porGenero;
type Linha = { readonly homem: number; readonly mulher: number };
type Distribuicao = Readonly<Record<string, Linha>>;

const ehGenero = (v: string): v is Genero => v in CENSO_2022.porGenero;

/**
 * Quantas pessoas do gênero caem entre `de` e `ate` (anos, inclusivos).
 * As faixas do Censo são quinquenais, então as das pontas entram
 * proporcionalmente: 15–19 cortada em 18 rende 2 dos 5 anos.
 */
function porIdade(genero: Genero, de: number, ate: number): number {
  return CENSO_2022.porFaixaEtaria.reduce((soma, faixa) => {
    const inicio = Math.max(faixa.min, de);
    const fim = Math.min(faixa.max, ate);
    if (fim < inicio) return soma;

    const anosNaFaixa = faixa.max - faixa.min + 1;
    const anosPegos = fim - inicio + 1;
    return soma + (faixa[genero] * anosPegos) / anosNaFaixa;
  }, 0);
}

/**
 * Fatia da coluna do gênero que satisfaz `dentro`.
 *
 * O denominador é a soma da própria lista, nunca `populacaoTotal`: cada tabela
 * tem o universo dela (altura é 20+, educação 25+, fumo e peso 18+). Dividir
 * pelo total do país encolheria o resultado pelo tamanho do recorte.
 */
function fracao<T extends Linha>(
  linhas: readonly T[],
  genero: Genero,
  dentro: (linha: T) => boolean,
): number {
  let selecionado = 0;
  let universo = 0;
  for (const linha of linhas) {
    universo += linha[genero];
    if (dentro(linha)) selecionado += linha[genero];
  }
  return universo === 0 ? 1 : selecionado / universo;
}

/**
 * Fatia do gênero que ganha pelo menos `limiar` por mês.
 *
 * As faixas de renda são largas (R$ 10 mil), então a que fica em cima do
 * limiar entra proporcionalmente, supondo renda espalhada por igual dentro
 * dela — mesma ideia da interpolação por idade. Sem isso, arrastar o slider
 * de R$ 5 mil para R$ 6 mil não mudaria nada e de R$ 4.999 para R$ 5.000
 * derrubaria dezenas de milhões de uma vez.
 *
 * ponytail: "espalhada por igual" é otimista na primeira faixa (0 a R$ 5 mil),
 * onde quase todo mundo está perto do piso — limiar de R$ 2 mil sai
 * superestimado. Corrigir exige a distribuição fina dentro da faixa.
 */
function fracaoRenda(genero: Genero, limiar: number): number {
  let selecionado = 0;
  let universo = 0;
  for (const faixa of POR_RENDA) {
    universo += faixa[genero];
    const largura = faixa.ate - faixa.de;
    // Faixa sem largura é a linha "sem renda nenhuma".
    const acima =
      largura <= 0
        ? limiar <= faixa.de
          ? 1
          : 0
        : Math.min(1, Math.max(0, (faixa.ate - limiar) / largura));
    selecionado += faixa[genero] * acima;
  }
  return universo === 0 ? 1 : selecionado / universo;
}

/** Idem, para as tabelas indexadas por nome. Lista vazia = sem filtro. */
function fracaoCategoria(
  dist: Distribuicao,
  genero: Genero,
  selecionados: readonly string[],
): number {
  if (selecionados.length === 0) return 1;
  const linhas = Object.entries(dist).map(([nome, valores]) => ({
    nome,
    ...valores,
  }));
  return fracao(linhas, genero, (l) => selecionados.includes(l.nome));
}

/**
 * Ponto de partida: quanta gente do gênero existe na faixa de idade. Todo o
 * resto multiplica esse número por uma fração.
 *
 * ponytail: as frações entram como se os filtros fossem independentes, e não
 * são — escolaridade puxa renda, quem fuma tende a beber. Com dez filtros o
 * erro acumula e o resultado sai baixo demais. Corrigir exigiria tabelas
 * cruzadas que o IBGE não publica abertamente; enquanto isso, é estimativa.
 */
export function calcular(f: Filtros): { total: number; percentual: number } {
  if (!ehGenero(f.genero)) return { total: 0, percentual: 0 };
  const genero = f.genero;

  const [de, ate] = f.idade;
  let total = porIdade(genero, de, ate);

  const [baixa, alta] = f.altura;
  total *= fracao(POR_ALTURA, genero, (l) => l.cm >= baixa && l.cm <= alta);

  total *= fracaoRenda(genero, f.rendaMinima);

  // ponytail: porEtnia é população total, sem recorte por gênero nem idade.
  // Aplicar como fração assume que etnia independe dos dois — não é verdade,
  // mas é o que dá pra fazer com o dado que existe.
  if (f.etnia.length > 0) {
    const selecionada = f.etnia.reduce(
      (soma, nome) =>
        soma + (CENSO_2022.porEtnia[nome as keyof typeof CENSO_2022.porEtnia] ?? 0),
      0,
    );
    total *= selecionada / CENSO_2022.populacaoTotal;
  }

  total *= fracaoCategoria(POR_CABELO, genero, f.corCabelo);
  total *= fracaoCategoria(POR_OLHOS, genero, f.corOlhos);

  if (f.educacaoMinima !== QUALQUER) {
    const minimo = POR_EDUCACAO.findIndex((n) => n.nivel === f.educacaoMinima);
    if (minimo >= 0) {
      total *= fracao(POR_EDUCACAO, genero, (l) => POR_EDUCACAO.indexOf(l) >= minimo);
    }
  }

  if (f.fuma !== QUALQUER) {
    const fumantes = ["Fumante atual"];
    const naoFumantes = ["Ex-fumante", "Nunca fumou"];
    total *= fracaoCategoria(
      POR_TABAGISMO,
      genero,
      f.fuma === "sim" ? fumantes : naoFumantes,
    );
  }

  if (f.bebe !== QUALQUER) {
    const bebem = ["Bebedor moderado ou ocasional", "Bebedor abusivo"];
    total *= fracaoCategoria(POR_ALCOOL, genero, f.bebe === "sim" ? bebem : ["Não bebe"]);
  }

  if (f.querCriancas !== QUALQUER) {
    total *= f.querCriancas === "sim" ? TAXAS.querFilhos : 1 - TAXAS.querFilhos;
  }

  if (f.excluirCasados) total *= 1 - TAXAS.casados;

  if (f.excluirObesos) {
    total *= fracaoCategoria(POR_IMC, genero, [
      "Baixo peso",
      "Peso normal",
      "Sobrepeso",
    ]);
  }

  return {
    total: Math.round(total),
    percentual: total / CENSO_2022.populacaoTotal,
  };
}
