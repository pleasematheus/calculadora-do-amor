"use client";

import {
  Center,
  Collapsible,
  CollapsibleGroup,
  Section,
  Text,
  VStack,
} from "@astryxdesign/core";

const PERGUNTAS = [
  {
    id: "precisao",
    pergunta: "O resultado é preciso?",
    resposta:
      "Chega perto, mas não é exato. Cada filtro entra como uma fatia independente do anterior, e na vida real eles andam juntos: quem tem ensino superior costuma ganhar mais, quem fuma costuma beber. Com muitos filtros ligados ao mesmo tempo, o número sai mais baixo do que a realidade. Vale só para o Brasil.",
  },
  {
    id: "fontes",
    pergunta: "De onde vêm os dados?",
    resposta:
      "Idade, gênero e etnia vêm da contagem do Censo 2022 (IBGE). Escolaridade e renda vêm da PNAD Contínua. Altura vem da POF/IBGE e do Projeto Conhecer da ANAC. Fumo, álcool e peso vêm do Vigitel 2023 (Ministério da Saúde) e da PNS 2019. Cor de cabelo e cor dos olhos são estimativa a partir de estudos de genética populacional — o Censo não pergunta isso.",
  },
  {
    id: "universo",
    pergunta: "Por que algumas pesquisas não cobrem todo mundo?",
    resposta:
      "Cada pesquisa tem seu recorte: altura é medida em adultos de 20 anos ou mais, escolaridade a partir dos 25 e fumo, álcool e peso a partir dos 18. Cada filtro é calculado dentro do universo da pesquisa dele, e não sobre os 203 milhões de brasileiros.",
  },
  {
    id: "genero",
    pergunta: "Serve para homens ou para mulheres?",
    resposta:
      "Para os dois. Todas as tabelas têm coluna de homem e de mulher, então a conta muda conforme o gênero que você escolhe procurar.",
  },
  {
    id: "cadastro",
    pergunta: "Preciso me cadastrar?",
    resposta: "Não. Abriu, usou.",
  },
  {
    id: "privacidade",
    pergunta: "Vocês guardam o que eu escolho?",
    resposta:
      "Não. A conta acontece inteira no seu navegador e nada é enviado para lugar nenhum.",
  },
  {
    id: "probabilidade",
    pergunta: "Então esta é a minha chance de encontrar essa pessoa?",
    resposta:
      "Não exatamente. O que aparece é o percentual da população que bate com os seus critérios. A sua chance de verdade depende de outras coisas: quanto você procura, onde procura e o quanto essas pessoas também querem você.",
  }
];

export function Perguntas() {
  return (
    <Section variant="section" padding={6}>
      <Center axis="horizontal">
        {/* Uma pergunta por linha e nada antes delas: o que a calculadora faz
            já está dito no cabeçalho da página, e repetir aqui era só encher a
            rolagem entre o resultado e as fontes. */}
        <VStack gap={2} maxWidth={720}>
          <Text type="display-3" as="h2">
            Perguntas frequentes
          </Text>
          {/* Grupo com divisórias em vez de um Card por pergunta: é lista
              densa, não widget. */}
          <CollapsibleGroup type="single" hasDividers>
            {PERGUNTAS.map((p) => (
              <Collapsible
                key={p.id}
                value={p.id}
                trigger={
                  // Text não aceita h3; o título da seção já é h2, então cada
                  // pergunta fica como texto dentro do botão do Collapsible.
                  <Text type="label">{p.pergunta}</Text>
                }
              >
                <Text type="body" color="secondary">
                  {p.resposta}
                </Text>
              </Collapsible>
            ))}
          </CollapsibleGroup>
        </VStack>
      </Center>
    </Section>
  );
}
