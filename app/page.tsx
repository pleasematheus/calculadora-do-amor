"use client";

import { useState } from "react";
import {
  Center,
  Layout,
  LayoutContent,
  LayoutPanel,
  Section,
  Text,
  VStack,
  useMediaQuery,
} from "@astryxdesign/core";
import { CENSO_2022 } from "@/lib/dados";
import { calcular, QUALQUER, type Filtros as FiltrosValor } from "@/lib/calculo";
import { Filtros } from "@/components/Filtros";
import { Resumo } from "@/components/Resumo";
import { Resultado } from "@/components/Resultado";
import { Perguntas } from "@/components/Perguntas";
import { Referencias } from "@/components/Referencias";
import { Rodape } from "@/components/Rodape";

const PADRAO: FiltrosValor = {
  genero: "mulher",
  querCriancas: QUALQUER,
  idade: [25, 40] as [number, number],
  altura: [160, 190] as [number, number],
  rendaMinima: 5000,
  etnia: [],
  corCabelo: [],
  corOlhos: [],
  educacaoMinima: QUALQUER,
  fuma: QUALQUER,
  bebe: QUALQUER,
  excluirCasados: false,
  excluirObesos: false,
};

// Contrato responsivo:
//   >= 1024px  painel de filtros 480 | resultado centralizado ao lado
//   <  1024px  coluna única: título, cartão do resultado, barra fixa com o
//              número, filtros. O painel do Astryx é `flex-shrink: 0`, então
//              abaixo disso ele não cede espaço — empilhar é a única saída, e
//              o número precisa continuar visível durante o arrasto.
const DESKTOP = "(min-width: 1024px)";

export default function Home() {
  const [filtros, setFiltros] = useState<FiltrosValor>(PADRAO);
  // serverDefault = false: o HTML do servidor sai empilhado. Quem chega pelo
  // link compartilhado está no celular e recebe o layout certo já na primeira
  // pintura; o desktop troca de moldura uma vez, logo depois da hidratação.
  const ehDesktop = useMediaQuery(DESKTOP, false);

  const set =
    <K extends keyof FiltrosValor>(chave: K) =>
    (valor: FiltrosValor[K]) =>
      setFiltros((atual) => ({ ...atual, [chave]: valor }));

  // Recalcula a cada render — é aritmética sobre 21 faixas, não precisa de memo
  // nem de botão pra disparar.
  const resultado = calcular(filtros);

  const cabecalho = (
    <VStack gap={1}>
      <Text type="display-2" as="h1">
        Calculadora do Amor
      </Text>
      <Text type="supporting" color="secondary">
        Escolha os filtros e descubra quantas pessoas sobram.
      </Text>
      <Text type="supporting" color="secondary">
        Base: {CENSO_2022.populacaoTotal.toLocaleString("pt-BR")} pessoas · IBGE,
        Censo 2022
      </Text>
    </VStack>
  );

  const formulario = <Filtros filtros={filtros} set={set} />;
  const cartao = (
    <Resultado
      total={resultado.total}
      percentual={resultado.percentual}
      onReset={() => setFiltros(PADRAO)}
    />
  );

  return (
    <>
      {ehDesktop ? (
        /* height="auto" (min-height: 100%) em vez de "fill": a calculadora
           ocupa a primeira tela e o documento cresce com as seções abaixo. Com
           "fill" o Layout travava em 100% e o resto não caberia. */
        <Layout
          height="auto"
          start={
            <LayoutPanel
              width={480}
              padding={0}
              hasDivider
              role="complementary"
              label="Filtros"
            >
              {/* Section é quem pinta o fundo — LayoutPanel é transparente e
                  deixaria a imagem passar por baixo do formulário. */}
              <Section variant="section" padding={6} minHeight="100%">
                <VStack gap={6}>
                  {cabecalho}
                  {formulario}
                </VStack>
              </Section>
            </LayoutPanel>
          }
          content={
            <LayoutContent padding={6} role="main" isScrollable={false}>
              <Center height="100%" minHeight={560}>
                {cartao}
              </Center>
            </LayoutContent>
          }
        />
      ) : (
        /* A ordem é o desenho: o cartão inteiro abre a página (é o que se vê e
           o que se manda para alguém). A barra nasce logo abaixo dele, em
           fluxo normal, e gruda no topo assim que o cartão passa — daí para
           baixo é ela que mostra o número enquanto o dedo mexe nos filtros.

           A barra fica fora das Sections com padding para encostar nas duas
           bordas, e nenhum ancestral pode rolar sozinho: `sticky` morre dentro
           de qualquer overflow que não seja o do documento. */
        <VStack role="main">
          <Section variant="section" padding={6}>
            <VStack gap={6}>
              {cabecalho}
              <Center axis="horizontal">{cartao}</Center>
            </VStack>
          </Section>

          <Resumo total={resultado.total} percentual={resultado.percentual} />

          <Section variant="section" padding={6}>{formulario}</Section>
        </VStack>
      )}
      <Perguntas />
      <Referencias />
      <Rodape />
    </>
  );
}
