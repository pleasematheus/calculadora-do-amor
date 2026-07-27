/**
 * Checagem da conta. Rodar: `bun lib/calculo.test.ts` (assert puro, sem
 * framework). Duas coisas não-triviais: o recorte proporcional das faixas
 * quinquenais de idade e o denominador de cada fração — toda tabela tem um
 * universo diferente, então "selecionar tudo" tem que deixar o total intacto.
 */
import assert from "node:assert/strict";
import {
  CENSO_2022,
  POR_CABELO,
  POR_EDUCACAO,
  POR_IMC,
  POR_OLHOS,
  POR_RENDA,
} from "./dados";
import { calcular, pct, QUALQUER, raridade, type Filtros } from "./calculo";

/** Nenhum filtro ativo: as faixas cobrem tudo e as listas estão vazias. */
const base: Filtros = {
  genero: "mulher",
  querCriancas: QUALQUER,
  idade: [0, 120],
  altura: [130, 205],
  rendaMinima: 0,
  etnia: [],
  corCabelo: [],
  corOlhos: [],
  educacaoMinima: QUALQUER,
  fuma: QUALQUER,
  bebe: QUALQUER,
  excluirCasados: false,
  excluirObesos: false,
};

const perto = (a: number, b: number, folga = 1) =>
  assert.ok(Math.abs(a - b) <= folga, `${a} ≠ ${b}`);

// Um ano só, dentro da faixa 15–19: exatamente 1/5 dela.
{
  const faixa = CENSO_2022.porFaixaEtaria.find((f) => f.min === 15)!;
  const { total } = calcular({ ...base, idade: [18, 18] });
  assert.equal(total, Math.round(faixa.mulher / 5));
}

// Faixa inteira, sem corte: o valor publicado, sem interpolação.
{
  const faixa = CENSO_2022.porFaixaEtaria.find((f) => f.min === 30)!;
  const { total } = calcular({ ...base, genero: "homem", idade: [30, 34] });
  assert.equal(total, faixa.homem);
}

// Duas faixas cortadas nas duas pontas: 18–22 = 2/5 de 15–19 + 3/5 de 20–24.
{
  const a = CENSO_2022.porFaixaEtaria.find((f) => f.min === 15)!;
  const b = CENSO_2022.porFaixaEtaria.find((f) => f.min === 20)!;
  const { total } = calcular({ ...base, idade: [18, 22] });
  assert.equal(total, Math.round((a.mulher * 2) / 5 + (b.mulher * 3) / 5));
}

// Sem nenhum filtro sobra a população feminina inteira — se algum denominador
// estivesse errado (populacaoTotal no lugar do universo da tabela), este
// número despencaria.
{
  const { total } = calcular(base);
  assert.equal(total, CENSO_2022.porGenero.mulher);
}

// Selecionar todas as categorias é o mesmo que não filtrar.
{
  const semFiltro = calcular({ ...base, idade: [25, 34] }).total;
  const tudoMarcado = calcular({
    ...base,
    idade: [25, 34],
    corCabelo: Object.keys(POR_CABELO),
    corOlhos: Object.keys(POR_OLHOS),
    educacaoMinima: POR_EDUCACAO[0].nivel,
  }).total;
  perto(tudoMarcado, semFiltro);
}

// Filtros de escolha única particionam o universo: sim + não = tudo.
{
  const todos = calcular({ ...base, idade: [25, 34] }).total;
  for (const chave of ["fuma", "bebe", "querCriancas"] as const) {
    const sim = calcular({ ...base, idade: [25, 34], [chave]: "sim" }).total;
    const nao = calcular({ ...base, idade: [25, 34], [chave]: "nao" }).total;
    perto(sim + nao, todos, 2);
  }
}

// Etnia recorta proporcionalmente.
{
  const semFiltro = calcular({ ...base, idade: [25, 34] });
  const comBranca = calcular({ ...base, idade: [25, 34], etnia: ["Branca"] });
  const fracao = CENSO_2022.porEtnia.Branca / CENSO_2022.populacaoTotal;
  assert.equal(comBranca.total, Math.round(semFiltro.total * fracao));
}

// Excluir obesas tira a fatia de obesidade do universo adulto feminino.
{
  const com = calcular({ ...base, idade: [25, 34] });
  const sem = calcular({ ...base, idade: [25, 34], excluirObesos: true });
  const adultas = Object.values(POR_IMC).reduce((s, l) => s + l.mulher, 0);
  const naoObesas = adultas - POR_IMC.Obesidade.mulher;
  perto(sem.total, Math.round((com.total * naoObesas) / adultas));
}

// Altura e renda estreitam o resultado, nunca aumentam.
{
  const largo = calcular({ ...base, idade: [25, 34] }).total;
  assert.ok(calcular({ ...base, idade: [25, 34], altura: [170, 205] }).total < largo);
  assert.ok(calcular({ ...base, idade: [25, 34], rendaMinima: 10_000 }).total < largo);
}

// Renda: limiar na borda de uma faixa corta ela inteira; no meio, corta metade.
{
  const universo = POR_RENDA.reduce((s, f) => s + f.mulher, 0);
  const largo = calcular({ ...base, idade: [25, 34] }).total;

  const acimaDe5k = POR_RENDA.filter((f) => f.de >= 5_000).reduce(
    (s, f) => s + f.mulher,
    0,
  );
  const cincoMil = calcular({ ...base, idade: [25, 34], rendaMinima: 5_000 }).total;
  perto(cincoMil, Math.round((largo * acimaDe5k) / universo), 2);

  // R$ 10 mil cai no meio da faixa 5–15 mil: entra metade dela.
  const faixa = POR_RENDA.find((f) => f.de === 5_000)!;
  const dezMil = calcular({ ...base, idade: [25, 34], rendaMinima: 10_000 }).total;
  const esperado = acimaDe5k - faixa.mulher / 2;
  perto(dezMil, Math.round((largo * esperado) / universo), 2);
}

// Gênero desconhecido não explode.
{
  assert.deepEqual(calcular({ ...base, genero: "xyz" }), {
    total: 0,
    percentual: 0,
  });
}

// Bordas da faixa de cor: quem está exatamente no corte fica na faixa de cima.
{
  assert.equal(raridade(1), "comum");
  assert.equal(raridade(0.05), "comum");
  assert.equal(raridade(0.0499), "seletivo");
  assert.equal(raridade(0.005), "seletivo");
  assert.equal(raridade(0.0049), "raro");
  assert.equal(raridade(0), "raro");
}

// Precisão do percentual: duas casas em cima, zeros à esquerda embaixo. O piso
// é uma pessoa em 203 milhões — se isso imprimir "0,00%", a calculadora está
// dizendo zero com gente sobrando.
{
  assert.equal(pct(0.384), "38,40%");
  assert.equal(pct(0.05), "5,00%");
  assert.equal(pct(0.0017656937), "0,18%");
  assert.equal(pct(0.0000032), "0,00032%");
  assert.equal(pct(1 / CENSO_2022.populacaoTotal), "0,00000049%");
}

console.log("ok");
