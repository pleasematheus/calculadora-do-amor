/**
 * Dados oficiais do Brasil — IBGE, Censo Demográfico 2022.
 * https://censo2022.ibge.gov.br/
 *
 * As chaves batem com os valores dos seletores em app/page.tsx.
 *
 * ATENÇÃO ao universo de cada tabela: `porGenero`, `porEtnia`,
 * `porFaixaEtaria` e `POR_RENDA` cobrem a população inteira; altura é 20+,
 * educação 25+ e fumo/álcool/IMC são 18+. Por isso cada dimensão
 * vira fração com o denominador dela mesma (soma da coluna do gênero), nunca
 * com `populacaoTotal` — ver `fracaoCategoria` em calculo.ts.
 */
export const CENSO_2022 = {
  populacaoTotal: 203_080_756,
  porGenero: {
    // 51,48% e 48,52% do total.
    mulher: 104_548_325,
    homem: 98_532_431,
  },
  /** Cor ou raça autodeclarada. Números publicados são arredondados. */
  porEtnia: {
    Branca: 88_200_000, // 43,5%
    Preta: 20_600_000, // 10,2%
    // ponytail: derivada — o Censo publica 45,3%, mas aqui é o resto do total
    // pra soma fechar. Trocar pelo número oficial quando tiveres.
    Parda: 92_230_656, // 45,4%
    Amarela: 850_100, // 0,4%
    Indígena: 1_200_000, // 0,6%
  },
  /**
   * Faixas quinquenais, `min` e `max` inclusivos. Ordem crescente.
   * As colunas somam exatamente os totais de `porGenero`.
   */
  porFaixaEtaria: [
    { min: 0, max: 4, mulher: 6_243_171, homem: 6_461_689 },
    { min: 5, max: 9, mulher: 6_738_158, homem: 7_011_282 },
    { min: 10, max: 14, mulher: 6_682_215, homem: 6_992_746 },
    { min: 15, max: 19, mulher: 7_058_427, homem: 7_317_515 },
    { min: 20, max: 24, mulher: 7_699_157, homem: 7_767_306 },
    { min: 25, max: 29, mulher: 7_842_265, homem: 7_627_458 },
    { min: 30, max: 34, mulher: 7_935_832, homem: 7_537_285 },
    { min: 35, max: 39, mulher: 8_345_458, homem: 7_827_333 },
    { min: 40, max: 44, mulher: 8_291_111, homem: 7_781_059 },
    { min: 45, max: 49, mulher: 7_091_003, homem: 6_549_109 },
    { min: 50, max: 54, mulher: 6_584_190, homem: 6_014_391 },
    { min: 55, max: 59, mulher: 6_149_601, homem: 5_419_505 },
    { min: 60, max: 64, mulher: 5_338_555, homem: 4_605_834 },
    { min: 65, max: 69, mulher: 4_288_180, homem: 3_588_052 },
    { min: 70, max: 74, mulher: 3_243_186, homem: 2_615_350 },
    { min: 75, max: 79, mulher: 2_189_593, homem: 1_657_786 },
    { min: 80, max: 84, mulher: 1_465_178, homem: 1_009_852 },
    { min: 85, max: 89, mulher: 835_554, homem: 493_649 },
    { min: 90, max: 94, mulher: 385_388, homem: 194_341 },
    { min: 95, max: 99, mulher: 114_859, homem: 50_319 },
    // ponytail: o Censo publica "100 anos ou mais". Teto em 120 só pra faixa
    // fechar — o slider vai até 80, então nunca é tocada.
    { min: 100, max: 120, mulher: 27_244, homem: 10_570 },
  ],
} as const;

/**
 * Distribuição de estatura, em centímetros. Base: **adultos 20+**.
 * Fontes: ANAC (Projeto Conhecer), IBGE (POF) e Censo 2022.
 *
 * Cada linha é uma massa pontual no valor da altura, não um intervalo: quem
 * mede 1,72 m não existe nesta tabela. Como o passo é de 5 cm e o slider anda
 * de 1 em 1, mexer o limite em menos de 5 cm às vezes não muda o resultado.
 */
export const POR_ALTURA = [
  { cm: 130, homem: 40, mulher: 400 },
  { cm: 135, homem: 40, mulher: 11_000 },
  { cm: 140, homem: 1_000, mulher: 158_000 },
  { cm: 145, homem: 16_000, mulher: 1_294_000 },
  { cm: 150, homem: 164_000, mulher: 5_996_000 },
  { cm: 155, homem: 1_051_000, mulher: 15_811_000 },
  { cm: 160, homem: 4_325_000, mulher: 23_729_000 },
  { cm: 165, homem: 11_210_000, mulher: 20_244_000 },
  { cm: 170, homem: 18_607_000, mulher: 9_877_000 },
  { cm: 175, homem: 19_621_000, mulher: 2_714_000 },
  { cm: 180, homem: 13_210_000, mulher: 426_000 },
  { cm: 185, homem: 5_647_000, mulher: 38_000 },
  { cm: 190, homem: 1_552_000, mulher: 1_900 },
  { cm: 195, homem: 263_000, mulher: 50 },
  { cm: 200, homem: 27_000, mulher: 0 },
  { cm: 205, homem: 4_000, mulher: 0 },
] as const;

/**
 * Rendimento **mensal** em reais, por faixa `de`–`ate` (o `ate` é o topo da
 * faixa publicada). Fontes: IBGE (PNAD Contínua e Censo 2022).
 *
 * Universo: a **população inteira**, não só quem trabalha — a primeira linha é
 * quem não tem renda nenhuma (crianças inclusive), e as colunas somam quase
 * exatamente `porGenero`. Por isso esta tabela substituiu a de rendimento anual
 * da população ocupada: aquela obrigava a supor que a taxa de ocupação é igual
 * em todo recorte de idade.
 *
 * A última faixa junta a cauda de altíssima renda (uma dúzia de pessoas
 * espalhadas até R$ 985 mil/mês).
 */
export const POR_RENDA = [
  { de: 0, ate: 0, homem: 30_000_000, mulher: 31_000_000 },
  { de: 0, ate: 5_000, homem: 65_044_559, mulher: 71_453_544 },
  { de: 5_000, ate: 15_000, homem: 2_200_000, mulher: 1_464_568 },
  { de: 15_000, ate: 25_000, homem: 700_000, mulher: 400_000 },
  { de: 25_000, ate: 35_000, homem: 280_000, mulher: 120_000 },
  { de: 35_000, ate: 45_000, homem: 130_000, mulher: 40_000 },
  { de: 45_000, ate: 55_000, homem: 65_000, mulher: 15_000 },
  { de: 55_000, ate: 65_000, homem: 35_000, mulher: 5_000 },
  { de: 65_000, ate: 75_000, homem: 20_000, mulher: 1_000 },
  { de: 75_000, ate: 85_000, homem: 11_000, mulher: 500 },
  { de: 85_000, ate: 95_000, homem: 6_000, mulher: 200 },
  { de: 95_000, ate: 105_000, homem: 3_500, mulher: 100 },
  { de: 105_000, ate: 115_000, homem: 2_000, mulher: 50 },
  { de: 115_000, ate: 125_000, homem: 1_200, mulher: 20 },
  { de: 125_000, ate: 135_000, homem: 700, mulher: 10 },
  { de: 135_000, ate: 145_000, homem: 400, mulher: 5 },
  { de: 145_000, ate: 155_000, homem: 250, mulher: 2 },
  { de: 155_000, ate: 165_000, homem: 150, mulher: 1 },
  { de: 165_000, ate: 175_000, homem: 90, mulher: 0 },
  { de: 175_000, ate: 185_000, homem: 55, mulher: 0 },
  { de: 185_000, ate: 195_000, homem: 35, mulher: 0 },
  { de: 195_000, ate: 205_000, homem: 20, mulher: 0 },
  { de: 205_000, ate: 215_000, homem: 12, mulher: 0 },
  { de: 215_000, ate: 225_000, homem: 8, mulher: 0 },
  { de: 225_000, ate: 235_000, homem: 5, mulher: 0 },
  { de: 235_000, ate: 245_000, homem: 3, mulher: 0 },
  { de: 245_000, ate: 255_000, homem: 2, mulher: 0 },
  { de: 255_000, ate: 265_000, homem: 1, mulher: 0 },
  { de: 265_000, ate: 275_000, homem: 1, mulher: 0 },
  { de: 275_000, ate: 285_000, homem: 1, mulher: 0 },
  { de: 285_000, ate: 985_000, homem: 9, mulher: 0 },
] as const;

/**
 * Cor do cabelo. Base: estimativa sobre a população total, derivada da divisão
 * 48,5% / 51,5% — não é contagem do Censo.
 * Fontes: IBGE, Revista USP (genética), UOL (mercado cosmético).
 */
export const POR_CABELO = {
  Preto: { homem: 31_520_000, mulher: 33_440_000 },
  "Castanho Escuro": { homem: 31_520_000, mulher: 33_440_000 },
  "Castanho Claro": { homem: 10_835_000, mulher: 11_495_000 },
  Loiro: { homem: 3_940_000, mulher: 4_180_000 },
  "Grisalho/Branco": { homem: 4_432_500, mulher: 2_089_500 },
  Ruivo: { homem: 1_252_500, mulher: 1_855_500 },
} as const;

/**
 * Cor dos olhos. Base: estimativa sobre a população total.
 * Fontes: IBGE, Agência FAPESP, perfil genético (Sérgio Pena).
 */
export const POR_OLHOS = {
  Castanho: { homem: 84_710_000, mulher: 89_870_000 },
  Azul: { homem: 7_880_000, mulher: 8_360_000 },
  Verde: { homem: 3_940_000, mulher: 4_180_000 },
  "Mel, cinza ou âmbar": { homem: 1_970_000, mulher: 2_090_000 },
} as const;

/**
 * Nível de instrução, em ordem crescente. Base: **adultos 25+**.
 * Fontes: IBGE (PNAD Contínua e Censo 2022).
 *
 * A ordem importa: o filtro é "no mínimo este nível", então soma daqui pra
 * baixo na lista.
 */
export const POR_EDUCACAO = [
  {
    nivel: "Sem instrução / Fundamental incompleto",
    homem: 25_200_000,
    mulher: 24_100_000,
  },
  {
    nivel: "Fundamental completo / Médio incompleto",
    homem: 10_200_000,
    mulher: 9_000_000,
  },
  {
    nivel: "Médio completo / Superior incompleto",
    homem: 22_600_000,
    mulher: 26_300_000,
  },
  { nivel: "Superior completo", homem: 10_200_000, mulher: 15_900_000 },
] as const;

/**
 * Tabagismo. Base: **adultos 18+**.
 * Fontes: Vigitel 2023 (Min. Saúde), IBGE (PNS 2019 e Censo 2022).
 */
export const POR_TABAGISMO = {
  "Fumante atual": { homem: 9_204_000, mulher: 6_375_000 },
  "Ex-fumante": { homem: 21_060_000, mulher: 13_600_000 },
  "Nunca fumou": { homem: 47_736_000, mulher: 65_025_000 },
} as const;

/**
 * Consumo de álcool. Base: **adultos 18+**.
 * Fontes: Vigitel 2023 (Min. Saúde), IBGE (PNS 2019 e Censo 2022).
 */
export const POR_ALCOOL = {
  "Não bebe": { homem: 30_020_000, mulher: 48_690_000 },
  "Bebedor moderado ou ocasional": { homem: 31_630_000, mulher: 26_940_000 },
  "Bebedor abusivo": { homem: 17_350_000, mulher: 8_370_000 },
} as const;

/**
 * Faixa de IMC. Base: **adultos 18+**.
 * Fontes: IBGE (PNS 2019), Vigitel 2023 (Min. Saúde), Censo 2022.
 *
 * Série da obesidade, pra contexto: 11,8% (2006) → 22,4% (2021) → 24,3% (2023).
 */
export const POR_IMC = {
  "Baixo peso": { homem: 1_000_000, mulher: 2_000_000 },
  "Peso normal": { homem: 27_000_000, mulher: 32_700_000 },
  Sobrepeso: { homem: 30_700_000, mulher: 27_000_000 },
  Obesidade: { homem: 20_300_000, mulher: 22_300_000 },
} as const;

/**
 * De onde vem cada número, agrupado pelo filtro que ele alimenta.
 * `nota` existe quando a origem não é contagem oficial — vale dizer isso na
 * tela em vez de deixar tudo parecendo Censo.
 */
export const FONTES = [
  {
    tema: "Idade, gênero e etnia",
    nota: "Contagem do Censo Demográfico 2022.",
    links: [
      {
        nome: "IBGE — Censo 2022, o retrato atualizado do Brasil",
        url: "https://educa.ibge.gov.br/jovens/conheca-o-brasil/populacao/22005-censo-2022-o-retrato-atualizado-do-brasil.html",
      },
      {
        nome: "IBGE — Quantidade de homens e mulheres",
        url: "https://educa.ibge.gov.br/jovens/conheca-o-brasil/populacao/18320-quantidade-de-homens-e-mulheres.html",
      },
      {
        nome: "IBGE — Pirâmide etária",
        url: "https://educa.ibge.gov.br/jovens/conheca-o-brasil/populacao/18318-piramide-etaria.html",
      },
      {
        nome: "IBGE — Cor ou raça",
        url: "https://educa.ibge.gov.br/jovens/conheca-o-brasil/populacao/18319-cor-ou-raca.html",
      },
    ],
  },
  {
    tema: "Altura",
    nota: "Inquéritos antropométricos com adultos de 20 anos ou mais.",
    links: [
      {
        nome: "ANAC — Projeto Conhecer (relatório final)",
        url: "https://www2.anac.gov.br/arquivos/pdf/Relatorio_Final_Projeto_Conhecer.pdf",
      },
      {
        nome: "IBGE — Pesquisa de Orçamentos Familiares (POF)",
        url: "https://www.ibge.gov.br/estatisticas/sociais/saude/9050-pesquisa-de-orcamentos-familiares.html",
      },
    ],
  },
  {
    tema: "Renda",
    nota: "IBGE (PNAD Contínua e Censo 2022); as reportagens abaixo trazem os recortes já tabulados.",
    links: [
      {
        nome: "IBGE — Rendimento médio da população brasileira",
        url: "https://agenciadenoticias.ibge.gov.br/agencia-noticias/2012-agencia-de-noticias/noticias/46579-rendimento-medio-da-populacao-brasileira-atinge-r-3-367-em-2025",
      },
      {
        nome: "G1 — Um terço dos trabalhadores recebe até um salário mínimo (Censo 2022)",
        url: "https://g1.globo.com/economia/censo/noticia/2025/10/09/mais-de-um-terco-dos-trabalhadores-do-pais-recebe-ate-um-salario-minimo-diz-ibge.ghtml",
      },
      {
        nome: "G1 — Quanto é preciso ganhar para entrar no topo da renda",
        url: "https://g1.globo.com/economia/noticia/2026/05/08/veja-quanto-e-preciso-ganhar-para-entrar-no-topo-da-renda.ghtml",
      },
      {
        nome: "Investidor10 — Pirâmide salarial do Brasil",
        url: "https://investidor10.com.br/conteudo/piramide-salarial-brasil-descubra-como-funciona-116965",
      },
    ],
  },
  {
    tema: "Escolaridade",
    nota: "População de 25 anos ou mais.",
    links: [
      {
        nome: "IBGE — PNAD Contínua",
        url: "https://www.ibge.gov.br/estatisticas/sociais/educacao/17270-pnad-continua.html",
      },
      {
        nome: "IBGE — Censo Demográfico 2022",
        url: "https://www.ibge.gov.br/estatisticas/sociais/populacao/22827-censo-demografico-2022.html",
      },
    ],
  },
  {
    tema: "Cor do cabelo e cor dos olhos",
    nota: "Estimativa a partir de estudos de genética populacional — o Censo não pergunta isso. É a parte menos firme da calculadora.",
    links: [
      {
        nome: "Revista da USP — Genética da população brasileira",
        url: "https://www.revistas.usp.br/revuspsp/article/view/13620",
      },
      {
        nome: "Agência FAPESP — DNA de brasileiros revela alta mistura genética",
        url: "https://agencia.fapesp.br/dna-de-brasileiros-revela-alta-mistura-genetica/16916/",
      },
      {
        nome: "Sérgio Pena — The genomic ancestry of individuals from different geographical regions of Brazil",
        url: "https://genoma.ib.usp.br/sites/default/files/inline-files/Pena_2011_Genetic_Profile.pdf",
      },
      {
        nome: "UOL — Quantas mulheres pintam o cabelo no Brasil",
        url: "https://www.uol.com.br/equilibrio/noticias/redacao/2023/05/15/quantas-mulheres-pintam-o-cabelo-no-brasil.htm",
      },
    ],
  },
  {
    tema: "Fumo, álcool e peso",
    nota: "Adultos de 18 anos ou mais, nas capitais.",
    links: [
      {
        nome: "Ministério da Saúde — Vigitel Brasil 2023",
        url: "https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/svsa/vigitel/vigitel-brasil-2023.pdf",
      },
      {
        nome: "IBGE — Pesquisa Nacional de Saúde 2019",
        url: "https://www.ibge.gov.br/estatisticas/sociais/saude/27646-pesquisa-nacional-de-saude-2019.html",
      },
    ],
  },
  {
    tema: "Casamentos",
    links: [
      {
        nome: "IBGE — Estatísticas do Registro Civil",
        url: "https://agenciadenoticias.ibge.gov.br/media/com_mediaibge/arquivos/ceae9194efd93875393399287b9d34f6.pdf",
      },
    ],
  },
  {
    tema: "Vontade de ter filhos",
    links: [
      {
        nome: "Revista Brasileira de Estudos de População — Intenções reprodutivas",
        url: "https://www.scielo.br/j/rbepop/a/DQ6vDZDXPZR4jxVKcQy7x8q/?lang=pt",
      },
    ],
  },
] as const;

/**
 * Taxas que só existem como percentual do total, sem recorte por gênero.
 */
export const TAXAS = {
  /** Intenção reprodutiva declarada. Fonte: Rev. Bras. de Estudos de População. */
  querFilhos: 0.83,
  /**
   * Casados no civil, 31,3% (63.564.277 pessoas). Fonte: IBGE, Registro Civil.
   * ponytail: é percentual da população **inteira**, crianças incluídas. Sobre
   * um recorte de 18–80 subestima o tanto de gente casada. Trocar quando houver
   * estado civil por faixa etária.
   */
  casados: 0.313,
} as const;
