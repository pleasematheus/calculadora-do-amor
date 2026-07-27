# Calculadora do Amor

Quantos brasileiros sobram depois das suas exigências?

Você marca o que procura num parceiro — idade, altura, renda, escolaridade, se fuma, se bebe — e a calculadora mostra que fatia da população brasileira ainda cabe na lista. O número encolhe a cada filtro ligado.

Existem calculadoras parecidas rodando sobre dados dos EUA. Esta roda sobre a demografia brasileira: Censo Demográfico 2022 do IBGE, PNAD Contínua, POF, PNS 2019 e Vigitel 2023.

## Como o cálculo funciona

O ponto do projeto é ser honesto com a estatística, então vale explicar o método antes de qualquer outra coisa.

**Cada filtro é calculado dentro do universo da pesquisa que o alimenta**, não sobre a população inteira. Altura é medida em adultos de 20 anos ou mais; escolaridade, em 25+; fumo, álcool e peso, em 18+. Idade, gênero, etnia e renda cobrem a população toda. Cada fração usa o denominador da própria tabela — misturar tudo num denominador só daria um número errado e mais bonito.

**As faixas etárias são fatiadas proporcionalmente.** O Censo publica idade em faixas de cinco anos. Quando o recorte escolhido cai no meio de uma faixa, a parcela é interpolada dentro dela.

**Os filtros se multiplicam como se fossem independentes — e não são.** Escolaridade puxa renda; fumo anda junto com álcool. Com muitos filtros ligados, o resultado sai mais baixo que a realidade. Essa ressalva aparece na própria interface, ao lado do resultado: é parte do produto, não uma nota de rodapé.

**Cabelo e cor dos olhos são estimativa.** O Censo não pergunta isso; os percentuais vêm de estudos de genética populacional brasileira. É a parte menos firme da calculadora, e a interface diz isso.

**Não há filtro de religião.** O Censo 2022 publicou taxa de fecundidade por credo, mas não a contagem de pessoas em cada um. Sem contagem, não dá para filtrar.

## Dados

Todos os números e links de fonte vivem em `lib/dados.ts`, e as referências aparecem listadas na própria página.

Fontes: IBGE (Censo 2022, PNAD Contínua, POF, PNS 2019, Registro Civil), Ministério da Saúde (Vigitel 2023), ANAC (Projeto Conhecer), Revista da USP, Agência FAPESP, Sérgio Pena (perfil genético da população brasileira) e Revista Brasileira de Estudos de População.

## Rodando

```bash
bun install
bun dev
```

Abra <http://localhost:3000>.

## Scripts

| comando | o que faz |
|---|---|
| `bun dev` | servidor de desenvolvimento |
| `bun run build` | build de produção |
| `bun run start` | serve o build |
| `bun run lint` | ESLint |
| `bun run theme` | regenera `app/astryx-theme.css` a partir de `theme.ts` |

Os testes são `assert` puro, sem framework:

```bash
bun lib/calculo.test.ts
```

Cobrem as duas partes não-triviais da conta: o fatiamento proporcional das faixas etárias e o denominador de cada fração.

## Estrutura

```
app/
  page.tsx              a calculadora (client component, cálculo no navegador)
  layout.tsx            metadata, fonte, imagem de fundo
  opengraph-image.tsx   cartão que aparece quando o link é colado numa rede social
components/             Filtros, Resumo, Resultado, Perguntas, Referencias, Rodape
lib/
  dados.ts              as tabelas do IBGE e demais fontes
  calculo.ts            a conta
  calculo.test.ts       checagem da conta
theme.ts                tema Astryx (fonte de app/astryx-theme.css)
```

Uma página só, cálculo inteiro no cliente, recalculado a cada mudança de filtro. Sem backend, sem cadastro, sem estado persistido — nada do que você escolhe sai do navegador.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Astryx como design system, Tailwind v4 para utilitários pontuais, Instrument Serif via `next/font`. Gerenciador de pacotes: Bun.

O Astryx faz todo o layout e espaçamento por componente, então o código de interface quase não tem `<div>` nem CSS solto. As convenções estão em `AGENTS.md`.

## Autoria

Matheus — [github.com/pleasematheus](https://github.com/pleasematheus).
