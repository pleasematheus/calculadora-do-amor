"use client";

import {
  FormLayout,
  MultiSelector,
  Selector,
  Slider,
  Switch,
} from "@astryxdesign/core";
import {
  CENSO_2022,
  POR_CABELO,
  POR_EDUCACAO,
  POR_OLHOS,
  POR_RENDA,
} from "@/lib/dados";
import { QUALQUER, type Filtros as FiltrosValor } from "@/lib/calculo";

const SIM_NAO = [
  { value: QUALQUER, label: "Tanto faz" },
  { value: "sim", label: "Sim" },
  { value: "nao", label: "Não" },
];
const GENEROS = [
  { value: "mulher", label: "Mulher" },
  { value: "homem", label: "Homem" },
];
// As opções saem das próprias tabelas — rótulo digitado à mão vira filtro que
// não casa com nenhuma linha e zera a conta em silêncio.
const ETNIAS = Object.keys(CENSO_2022.porEtnia);
const CABELOS = Object.keys(POR_CABELO);
const OLHOS = Object.keys(POR_OLHOS);
const EDUCACAO = [
  { value: QUALQUER, label: "Tanto faz" },
  ...POR_EDUCACAO.map((n) => ({ value: n.nivel, label: n.nivel })),
];

// Paradas de renda tiradas da própria tabela: o slider vai de R$ 0 ao teto da
// última faixa publicada (R$ 985 mil) e para em cada borda de faixa, porque é
// só ali que o dado muda de resolução — entre duas bordas a conta interpola.
//
// A exceção é a primeira faixa: ela sozinha guarda 67% da população, então
// dentro dela as paradas são de R$ 500. Linear não serviria — de 0 a 985 mil,
// a faixa onde está quase todo mundo ocuparia 0,5% do trilho.
const BORDAS = [...new Set(POR_RENDA.map((f) => f.ate))]
  .filter((v) => v > 0)
  .sort((a, b) => a - b);
const PRIMEIRA = BORDAS[0]; // R$ 5.000 — topo da faixa que guarda 67% de todo mundo
const TETO = BORDAS[BORDAS.length - 1]; // R$ 985.000 — último valor da tabela
const ULTIMA_BORDA = BORDAS[BORDAS.length - 2]; // R$ 285.000 — antes do salto da cauda

const passo = (de: number, ate: number, salto: number) =>
  Array.from({ length: (ate - de) / salto + 1 }, (_, i) => de + i * salto);

const RENDAS = [
  ...passo(0, PRIMEIRA - 500, 500),
  ...passo(PRIMEIRA, ULTIMA_BORDA, 5_000),
  TETO,
];

// O filtro guarda reais, não índice — o cálculo trabalha com o limiar. Valor
// fora da lista cai na parada imediatamente acima em vez de zerar o slider.
const indiceRenda = (valor: number) => {
  const exato = RENDAS.indexOf(valor);
  if (exato >= 0) return exato;
  const acima = RENDAS.findIndex((r) => r >= valor);
  return acima >= 0 ? acima : RENDAS.length - 1;
};

const brl = (v: number) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

export type DefinirFiltro = <K extends keyof FiltrosValor>(
  chave: K,
) => (valor: FiltrosValor[K]) => void;

export function Filtros({
  filtros,
  set,
}: {
  filtros: FiltrosValor;
  set: DefinirFiltro;
}) {
  return (
    <FormLayout>
      <Selector
        label="Gênero"
        options={GENEROS}
        value={filtros.genero}
        onChange={set("genero")}
      />
      <Selector
        label="Quer crianças?"
        options={SIM_NAO}
        value={filtros.querCriancas}
        onChange={set("querCriancas")}
      />
      <Slider
        label="Idade"
        min={18}
        max={80}
        value={filtros.idade}
        onChange={set("idade")}
        valueDisplay="text"
        formatValue={(v) => `${v} anos`}
      />
      {/* Passo de 5 cm porque a tabela de altura é de 5 em 5 — de 1 em 1 o
          número ficaria parado em quatro de cada cinco passos. */}
      <Slider
        label="Altura"
        min={130}
        max={205}
        step={5}
        value={filtros.altura}
        onChange={set("altura")}
        valueDisplay="text"
        formatValue={(v) => `${v} cm`}
      />
      {/* O slider anda em índices de RENDAS; o filtro recebe o valor em reais. */}
      <Slider
        label="Renda mínima por mês"
        min={0}
        max={RENDAS.length - 1}
        step={1}
        value={indiceRenda(filtros.rendaMinima)}
        onChange={(i: number) => set("rendaMinima")(RENDAS[i])}
        valueDisplay="text"
        formatValue={(i: number) => brl(RENDAS[i])}
      />
      <MultiSelector
        label="Etnia"
        options={ETNIAS}
        value={filtros.etnia}
        onChange={set("etnia")}
        placeholder="Tanto faz"
      />
      <MultiSelector
        label="Cor do cabelo"
        options={CABELOS}
        value={filtros.corCabelo}
        onChange={set("corCabelo")}
        placeholder="Tanto faz"
      />
      <MultiSelector
        label="Cor dos olhos"
        options={OLHOS}
        value={filtros.corOlhos}
        onChange={set("corOlhos")}
        placeholder="Tanto faz"
      />
      <Selector
        label="Educação mínima"
        options={EDUCACAO}
        value={filtros.educacaoMinima}
        onChange={set("educacaoMinima")}
      />
      {/* Religião saiu: o Censo 2022 publicou taxa de fecundidade por credo,
          não quantas pessoas há em cada um — sem contagem não dá pra filtrar. */}
      <Selector
        label="Fuma?"
        options={SIM_NAO}
        value={filtros.fuma}
        onChange={set("fuma")}
      />
      <Selector
        label="Bebe álcool?"
        options={SIM_NAO}
        value={filtros.bebe}
        onChange={set("bebe")}
      />
      <Switch
        label="Excluir quem é casado"
        value={filtros.excluirCasados}
        onChange={set("excluirCasados")}
      />
      <Switch
        label="Excluir quem é obeso"
        value={filtros.excluirObesos}
        onChange={set("excluirObesos")}
      />
    </FormLayout>
  );
}
