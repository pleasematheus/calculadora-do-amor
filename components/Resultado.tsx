"use client";

import { useMemo } from "react";
import { User, UserX } from "lucide-react";
import {
  Button,
  Card,
  EmptyState,
  Grid,
  Icon,
  Text,
  VStack,
  VisuallyHidden,
} from "@astryxdesign/core";
import GlassSurface from "./GlassSurface";
import { pct, raridade } from "@/lib/calculo";
import { CENSO_2022 } from "@/lib/dados";

// 200 figuras, uma para cada 0,5% da população. COLUNAS é o teto, não um
// número fixo: em tela estreita a grade usa menos colunas e mais linhas em vez
// de estourar a largura do cartão.
const COLUNAS = 20;
const LINHAS = 10;
const CELULAS = COLUNAS * LINHAS;
const LARGURA_MAXIMA = 520;
// Piso de altura: mantém o quadrado de 520 do desktop agora que a altura vem
// do conteúdo. Sem ele o vidro encolheria junto com a grade.
const ALTURA_MINIMA = 520;

export function Resultado({
  total,
  percentual,
  onReset,
}: {
  total: number;
  percentual: number;
  onReset: () => void;
}) {
  // Arredondar sozinho apagaria a grade inteira em percentuais pequenos —
  // se sobrou alguém, pelo menos um ícone acende.
  const acesos =
    total > 0 ? Math.max(1, Math.round(percentual * CELULAS)) : 0;

  // 200 SVGs remontados a cada render. Com a chave em `acesos`, arrastar um
  // controle dentro do mesmo patamar (altura anda de 5 em 5 cm, renda de 500
  // em 500) não mexe na grade.
  //
  // ponytail: o teto disso é baixo — na maioria dos passos `acesos` muda e a
  // grade é refeita do mesmo jeito. E o custo por frame que domina não é este,
  // é o repaint do backdrop-filter + filtro SVG do vidro. Só um profile em
  // aparelho real diz se vale um React.memo por figura; sem medida, não dá pra
  // afirmar que vale.
  const figuras = useMemo(
    () =>
      Array.from({ length: CELULAS }, (_, i) => (
        <Icon
          key={i}
          icon={User}
          size="xsm"
          /* "inherit" e não "accent": no Astryx, Icon color="accent" aponta
             para --color-accent (o coral do botão, 2,3:1 no cartão amarelo).
             Herdando, a figura acesa pega a faixa de raridade. */
          color={i < acesos ? "inherit" : "disabled"}
        />
      )),
    [acesos],
  );

  return (
    // Largura fluida com teto: no painel do desktop o vidro para em 520, e no
    // celular ele acompanha a coluna em vez de empurrar a página para fora da
    // tela. A altura sai do conteúdo — com 520 fixo a grade estreita sobrava
    // espaço vazio embaixo.
    <VStack
      width="100%"
      maxWidth={LARGURA_MAXIMA}
      /* A faixa entra aqui em cima e desce por herança: o número, as figuras
         acesas e o ícone do estado vazio pegam a mesma cor sem nenhum deles
         precisar saber qual é. */
      className={`faixa-${raridade(percentual)}`}
    >
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={24}
        mixBlendMode="normal"
      >
        {/* O vidro é transparente e o texto disputava com a foto que passa por
            trás. O Card dá fundo opaco (#F8FAB4) e fica menor que o vidro — o
            padding do VStack é a moldura de vidro em volta. */}
        <VStack padding={3} width="100%" minHeight={ALTURA_MINIMA}>
          <Card padding={4}>
            {/* Zero é o desfecho mais provável desta calculadora, não um caso
                raro: com dez filtros ligados a conta chega lá rápido. Mostrar
                "0,00% · 0 brasileiros" com a grade toda apagada era deixar o
                visitante sem saber se aquilo é resposta ou defeito. */}
            {total === 0 ? (
              <EmptyState
                headingLevel={2}
                icon={<Icon icon={UserX} size="lg" color="inherit" />}
                title="Ninguém."
                description="Nenhum brasileiro passa por todas essas exigências ao mesmo tempo. Vale a ressalva de sempre: a conta multiplica cada filtro como se um não tivesse nada a ver com o outro, e na vida real eles andam juntos — então este zero é mais duro que a realidade. Afrouxe uma exigência e veja o que acontece."
                actions={
                  <Button
                    label="Voltar ao padrão"
                    variant="primary"
                    onClick={onReset}
                  />
                }
              />
            ) : (
              <VStack gap={4} align="center">
                <VStack gap={1} align="center">
                  {/* "0,18%" cabe em 64px; "0,00000049%" não — são 11 glifos
                      contra os ~216px que sobram dentro do cartão em tela de
                      320px, e o número não tem espaço onde quebrar. Passando de
                      7 glifos ele desce um degrau da escala em vez de vazar. */}
                  <Text
                    type={pct(percentual).length > 7 ? "display-2" : "display-1"}
                    color="accent"
                  >
                    {pct(percentual)}
                  </Text>
                  {/* O denominador escrito por extenso: o percentual é sobre a
                      população inteira, então escolher "Mulher" trava o teto
                      perto de 51% e nada dizia isso. No celular o cabeçalho já
                      rolou para fora quando o cartão está em tela — o cartão
                      tem que se explicar sozinho. */}
                  <Text type="large" textWrap="balance" justify="center">
                    {total.toLocaleString("pt-BR")} de{" "}
                    {CENSO_2022.populacaoTotal.toLocaleString("pt-BR")}{" "}
                    brasileiros
                  </Text>
                </VStack>

                {/* minWidth 12 = o tamanho do ícone xsm. A grade preenche
                    quantas colunas couberem até o teto de 20: 20 no desktop,
                    menos no celular, e nunca uma linha mais larga que o
                    cartão.

                    width="100%" não é enfeite: o pai é um VStack com
                    align="center", que dá largura de conteúdo aos filhos. Sem
                    largura definida, `repeat(auto-fill, …)` vira uma repetição
                    só por especificação — as 200 figuras desciam em fila
                    única e o cartão virava uma tira do tamanho da página. */}
                <Grid
                  columns={{ minWidth: 12, max: COLUNAS }}
                  gap={0.5}
                  width="100%"
                >
                  {figuras}
                </Grid>
                <VisuallyHidden>
                  {acesos} de {CELULAS} figuras acesas, uma para cada{" "}
                  {(100 / CELULAS).toLocaleString("pt-BR")}% da população.
                </VisuallyHidden>

                <Text type="supporting" color="secondary">
                  Estimativa: cada filtro entra como uma fatia independente, e
                  na vida real eles andam juntos (escolaridade puxa renda, e por
                  aí vai).
                </Text>
              </VStack>
            )}
          </Card>
        </VStack>
      </GlassSurface>
    </VStack>
  );
}
