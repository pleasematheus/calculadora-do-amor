import { Center, Link, Section, Text } from "@astryxdesign/core";

// ponytail: URL chutada a partir do usuário do git. Trocar pelo portfólio.
const AUTOR = {
  nome: "Matheus",
  portfolio: "https://github.com/pleasematheus",
};

export function Rodape() {
  return (
    // Section não aceita `as`, então o papel de rodapé vem pelo role.
    <Section role="contentinfo" variant="section" padding={6}>
      <Center axis="horizontal">
        {/* Uma linha só: quem fez. A origem dos dados está dita no cabeçalho e
            listada inteira na seção de referências, logo acima. */}
        <Text type="body">
          Feito por{" "}
          <Link href={AUTOR.portfolio} target="_blank" rel="noopener noreferrer" isExternalLink>
            {AUTOR.nome}
          </Link>
        </Text>
      </Center>
    </Section>
  );
}
