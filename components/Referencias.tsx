import { Center, Item, Link, List, Section, Text, VStack } from "@astryxdesign/core";
import { FONTES } from "@/lib/dados";

export function Referencias() {
  return (
    // variant="muted" (pêssego) só para separar das perguntas, que já usam o
    // lilás de superfície — dois blocos iguais colados viram um só.
    <Section variant="muted" padding={6}>
      <Center axis="horizontal">
        <VStack gap={6} maxWidth={720}>
          <VStack gap={2}>
            <Text type="display-3" as="h2">
              Referências
            </Text>
            <Text type="body" color="secondary">
              Todo número desta calculadora sai de pesquisa pública. Onde a
              origem não é contagem oficial, está dito na linha do tema.
            </Text>
          </VStack>

          {FONTES.map((fonte) => (
            <VStack key={fonte.tema} gap={1}>
              <Text type="large" as="h3">
                {fonte.tema}
              </Text>
              {"nota" in fonte && (
                <Text type="body" color="secondary">
                  {fonte.nota}
                </Text>
              )}
              <List hasDividers>
                {fonte.links.map((link) => (
                  <Item
                    key={link.url}
                    as="li"
                    label={
                      <Link
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        isExternalLink
                      >
                        {link.nome}
                      </Link>
                    }
                  />
                ))}
              </List>
            </VStack>
          ))}
        </VStack>
      </Center>
    </Section>
  );
}
