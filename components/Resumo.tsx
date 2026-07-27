"use client";

import { HStack, Section, Text } from "@astryxdesign/core";
import { pct, raridade } from "@/lib/calculo";

/**
 * Leitura viva do resultado, só no celular.
 *
 * No layout de duas colunas o número está sempre à vista enquanto o dedo mexe
 * no filtro. Empilhado ele sairia da tela justo no momento em que interessa —
 * então a barra gruda no topo (`sticky`) e acompanha a rolagem dos filtros.
 * Fica em pêssego para se destacar do lilás que rola por baixo.
 *
 * Entra na página logo abaixo do cartão, em fluxo normal — em tela alta ela já
 * aparece de saída, como um resumo da linha de cima — e passa a flutuar assim
 * que o cartão sobe. O recuo lateral é o mesmo 6 das outras seções; só a altura
 * é curta, para não comer a tela dos filtros.
 *
 * `role="status"` porque isto é o estado do sistema: quem usa leitor de tela
 * ouve o número novo depois de soltar o controle, sem precisar procurar.
 */
export function Resumo({
  total,
  percentual,
}: {
  total: number;
  percentual: number;
}) {
  return (
    <Section
      variant="muted"
      padding={6}
      paddingBlock={3}
      role="status"
      /* Mesma faixa de cor do cartão: rolando os filtros, a barra é o cartão
         resumido — inclusive na cor, que é o que se percebe antes de ler o
         número. */
      className={`faixa-${raridade(percentual)} sticky top-0 z-10`}
    >
      {/* wrap: o pior caso real é "51,20%" ao lado de "103.999.999
          brasileiros" — em 320px os dois não cabem na mesma linha, e sem isso
          um deles seria cortado. */}
      <HStack gap={3} align="center" justify="between" wrap="wrap">
        {/* Zerado, a barra fala como o cartão. Rolando os filtros ela é a única
            coisa na tela, e "0% · 0 brasileiros" é justamente a leitura que o
            estado vazio existe para substituir — inclusive no leitor de tela. */}
        {total === 0 ? (
          <Text type="display-3" color="accent">
            Ninguém.
          </Text>
        ) : (
          <>
            <Text type="display-3" color="accent">
              {pct(percentual)}
            </Text>
            <Text type="supporting" color="secondary">
              {total.toLocaleString("pt-BR")} brasileiros
            </Text>
          </>
        )}
      </HStack>
    </Section>
  );
}
