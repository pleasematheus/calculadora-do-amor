# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Público geral brasileiro que chega pelo link compartilhado — Instagram, TikTok, X, grupo de WhatsApp. Sessão curta, quase sempre no celular: a pessoa mexe nos filtros por alguns minutos, vê o número encolher, tira print e manda para alguém. Uso único, sem cadastro e sem expectativa de retorno.

## Product Purpose

Mostrar que fatia da população brasileira sobra depois que alguém aplica a própria lista de exigências para um parceiro — idade, altura, renda, etnia, cor de cabelo e olhos, escolaridade, fumo, álcool, estado civil e peso.

O projeto é, ao mesmo tempo, **ferramenta de dados e experimento técnico**: precisa ser honesto com a estatística (fonte citada, universo de cada pesquisa explicado, ressalva sobre a suposição de independência entre filtros) e serve como exercício de Next.js, do design system Astryx e de tratamento de dados públicos. Sucesso é o visitante entender o próprio número e confiar de onde ele veio.

## Positioning

Existem calculadoras equivalentes rodando sobre dados dos EUA (US Census, CDC). Esta roda sobre o **Censo Demográfico 2022 do IBGE, PNAD Contínua, POF, PNS 2019 e Vigitel 2023** — a demografia brasileira real, com recorte por gênero em cada tabela e cada filtro calculado dentro do universo da pesquisa que o alimenta, não sobre a população inteira. Nenhum equivalente estrangeiro pode reivindicar isso.

## Operating Context

Uma página só. Painel de filtros à esquerda, resultado à direita (percentual, contagem absoluta e grade de 200 figuras), e abaixo as seções de perguntas frequentes, referências e rodapé. Cálculo inteiro no cliente, recalculado a cada mudança de filtro — sem botão de "calcular", sem backend, sem estado persistido.

O visitante chega por link, provavelmente no celular, quase sempre sem contexto prévio sobre o que a ferramenta faz.

## Capabilities and Constraints

- **Filtros com dado por trás:** gênero, vontade de ter filhos, idade, altura, renda mensal mínima, etnia, cor do cabelo, cor dos olhos, escolaridade mínima, fumo, álcool, excluir casados, excluir obesos.
- **Sem filtro de religião:** o Censo 2022 publicou taxa de fecundidade por credo, não a contagem de pessoas em cada um. Sem contagem não existe filtro — não reintroduzir sem o dado.
- **Universos diferentes por tabela:** altura é medida em adultos 20+, escolaridade 25+, fumo/álcool/peso 18+. Idade, gênero, etnia e renda cobrem a população inteira. Cada fração usa o denominador da própria tabela.
- **Cabelo e cor dos olhos são estimativa**, derivada de estudos de genética populacional — o Censo não pergunta isso. É a parte menos firme da calculadora e precisa continuar declarada como estimativa na interface.
- **Os filtros se multiplicam como se fossem independentes**, e não são (escolaridade puxa renda, fumo anda com álcool). Com muitos filtros ligados o resultado sai mais baixo que a realidade. A ressalva é parte do produto, não uma nota de rodapé opcional.
- Sem cadastro, sem login, sem backend, sem coleta: nada do que o visitante escolhe sai do navegador.
- Só português do Brasil; internacionalização não está prevista.
- Destinado a deploy público — precisa aguentar link compartilhado e pico de tráfego.
- Stack: Next.js 16 (App Router), React 19, design system Astryx, tipografia Instrument Serif.

## Brand Commitments

- Nome: **Calculadora do Amor**.
- Voz: coloquial brasileira, direta, com humor seco. Fala "brasileiros", não "indivíduos"; admite as limitações do próprio número em vez de esconder.
- Autoria de Matheus, com link para portfólio no rodapé. **Em aberto:** a URL do portfólio ainda não foi confirmada — hoje está `github.com/pleasematheus`, reconstruída a partir do git.

## Evidence on Hand

Números e links de fonte vivem em `lib/dados.ts` (constantes `CENSO_2022`, `POR_ALTURA`, `POR_RENDA`, `POR_CABELO`, `POR_OLHOS`, `POR_EDUCACAO`, `POR_TABAGISMO`, `POR_ALCOOL`, `POR_IMC`, `TAXAS`, `FONTES`), compilados a partir do vault do Obsidian do autor.

19 links de referência reais, publicados na própria página: IBGE (Censo 2022, PNAD Contínua, POF, PNS 2019, Registro Civil), Ministério da Saúde (Vigitel 2023), ANAC (Projeto Conhecer), Revista da USP, Agência FAPESP, Sérgio Pena (perfil genético), Revista Brasileira de Estudos de População, além de reportagens de G1, UOL e Investidor10 usadas como recorte já tabulado de dado do IBGE.

Não há testemunho, cliente, benchmark, número de acessos nem prêmio — nada disso pode ser inventado em trabalho futuro.

## Product Principles

1. **Todo número tem fonte na tela.** Se não dá para citar de onde veio, não entra na calculadora.
2. **Declarar a fraqueza do dado é parte do produto.** Estimativa se chama estimativa; universo restrito se explica; a suposição de independência aparece junto do resultado.
3. **O visitante não precisa de instrução.** Abriu, mexeu, entendeu — sem cadastro, sem tutorial, sem botão de calcular.
4. **O tema é leve, o método não é.** Humor na linguagem, rigor na aritmética.
5. **Mobile primeiro na prática, não na intenção.** O tráfego chega de link em rede social; o celular é o cenário real de uso.

## Accessibility & Inclusion

Sem exigência normativa estabelecida pelo usuário. Padrão adotado no código até aqui: contraste mínimo de 4,5:1 para texto, verificado contra as cores reais do tema, e o conteúdo da grade de figuras duplicado em texto para leitor de tela.
