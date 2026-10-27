// Tela de regras (aberta pelo botão "Regras" da barra do topo).
import { Fragment, useState } from 'react';
import type { ReactNode } from 'react';
import { CHAOS, CLAN, ITEMS, KINGS, REACT, lendTxt, traitNames } from '../../game/data.ts';
import type { ItemKey } from '../../game/data.ts';
import { Icon } from '../components/Icon.tsx';

// uma linha da legenda: ícone, nome e o que significa. O " — " fica no mesmo nó de texto da
// descrição (como no HTML original): separados, o navegador posiciona as letras com diferença
// de subpixel. Descrição com marcação (não-string) já começa com o " — ".
function L({ i, t, children }: { i: ReactNode; t: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="inline-flex w-[18px] flex-none justify-center pt-px text-text">{i}</span>
      <span>
        <b className="text-text">{t}</b>
        {typeof children === 'string' ? ` — ${children}` : children}
      </span>
    </div>
  );
}

function Section({ first, children }: { first?: boolean; children: ReactNode }) {
  return (
    <div className={`text-[11px] tracking-[0.06em] uppercase ${first ? '' : 'mt-1'}`}>
      {children}
    </div>
  );
}

const TABS = [
  ['rules', 'Regras'],
  ['items', 'Itens'],
  ['chaos', 'Caos'],
] as const;
type Tab = (typeof TABS)[number][0];

const total = (defs: readonly (readonly unknown[])[], i: number) =>
  defs.reduce((a, d) => a + (d[i] as number), 0);

// tela de regras com abas: regras, tabela de itens e tabela de Caos
export function Rules() {
  const [tab, setTab] = useState<Tab>('rules');
  return (
    <div className="grid w-full gap-2 text-left">
      <div role="tablist" className="flex gap-1 border-b border-line">
        {TABS.map(([k, t]) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`-mb-px cursor-pointer border-b-2 bg-transparent px-3 py-1.5 font-ui text-[13px] font-bold ${tab === k ? 'border-accent text-text' : 'border-transparent text-muted'}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === 'rules' ? <RulesText /> : tab === 'items' ? <ItemTable /> : <ChaosTable />}
    </div>
  );
}

// uma carta da tabela: nome, cópias, quando usa (itens) e o texto
function CardRow({
  name,
  copies,
  when,
  text,
}: {
  name: string;
  copies: number;
  when?: ReactNode;
  text: string;
}) {
  return (
    <div className="grid gap-0.5 border-b border-line py-1.5 last:border-b-0">
      <div className="flex items-center gap-2">
        <b className="text-text">{name}</b>
        {when ? <span className="inline-flex items-center gap-1 text-[11px]">{when}</span> : null}
        <span className="ml-auto flex-none text-[11px] font-bold text-accent">{`×${copies}`}</span>
      </div>
      <span>{text}</span>
    </div>
  );
}

const WHEN_ORDER = (k: ItemKey) =>
  k === 'SACO' ? 1 : REACT.includes(k) ? 3 : ITEMS[k][2] === 'D' ? 0 : 2;
function whenOf(k: ItemKey) {
  if (k === 'SACO') return 'Na hora';
  if (REACT.includes(k)) return 'Reação';
  return ITEMS[k][2] === 'D' ? (
    <>
      <Icon name="moon" />
      Dormindo
    </>
  ) : (
    <>
      <Icon name="sun" />
      Acordado
    </>
  );
}

function ItemTable() {
  const keys = (Object.keys(ITEMS) as ItemKey[]).sort(
    (a, b) => WHEN_ORDER(a) - WHEN_ORDER(b) || ITEMS[a][0].localeCompare(ITEMS[b][0], 'pt'),
  );
  return (
    <div className="max-h-[60vh] overflow-auto text-[13px] text-muted">
      <p className="m-0 mb-1">{`${total(Object.values(ITEMS), 3)} cartas no monte de itens. No máximo 3 na mão.`}</p>
      {keys.map((k) => (
        <CardRow
          key={k}
          name={ITEMS[k][0]}
          copies={ITEMS[k][3]}
          when={whenOf(k)}
          text={ITEMS[k][1]}
        />
      ))}
    </div>
  );
}

function ChaosTable() {
  const keys = Object.keys(CHAOS) as (keyof typeof CHAOS)[];
  return (
    <div className="max-h-[60vh] overflow-auto text-[13px] text-muted">
      <p className="m-0 mb-1">{`${total(Object.values(CHAOS), 2)} cartas no monte de Caos. A carta revelada vale na rodada seguinte, para todos.`}</p>
      {keys
        .sort((a, b) => CHAOS[a][0].localeCompare(CHAOS[b][0], 'pt'))
        .map((k) => (
          <CardRow key={k} name={CHAOS[k][0]} copies={CHAOS[k][2]} text={CHAOS[k][1]} />
        ))}
    </div>
  );
}

function RulesText() {
  return (
    <div className="grid w-full gap-2 text-left text-[13px] text-muted max-h-[60vh] overflow-auto">
      <p className="m-0">
        <b className="text-text">O que cada ícone significa</b>
      </p>
      <div className="grid gap-[5px] rounded-[10px] border border-line px-3 py-2.5">
        <Section first>Características dos goblins (canto da carta)</Section>
        <L i={<Icon name="hat" />} t="Chapéu">
          característica usada por itens (Chapéu Pontudo, Disfarce) e pela Maldição.
        </L>
        <L i={<Icon name="scar" />} t="Cicatriz">
          característica usada pelos itens Machucado e Cicatrizes Compartilhadas; o Rei
          Quebra-Crânio empresta Cicatriz aos goblins pares.
        </L>
        <L i={<Icon name="monocle" />} t="Monóculo">
          característica usada pelo item Monóculo Polido.
        </L>
        <L i={<Icon name="stink" />} t="Fedorento">
          característica usada pelos itens Fuga Fedorenta e Nariz de Ferro.
        </L>
        <L i={<Icon name="spiral" />} t="Maluco">
          característica usada pela Poção Maluca.
        </L>
        <L i={<Icon name="sore" />} t="Pereba">
          característica usada pela Pomada de Pereba.
        </L>
        <Section>Mesa e jogadores</Section>
        <L
          i={
            <span className="text-accent">
              <Icon name="crown" />
            </span>
          }
          t="Coroa ao lado do nome"
        >
          esse jogador é o Chefe da Toca: começa a janela de itens e escolhe o Duelo.
        </L>
        <L i={<Icon name="crown" />} t="Coroa na carta">
          o goblin recebe as características do seu rei ou rainha nesta jogada.
        </L>
        <L i={<Icon name="crown" />} t="Botão do rei">
          na sua área; toque para ver a habilidade. Apagado = desligado nesta rodada.
        </L>
        <L i={<Icon name="cards" />} t="Cartas">
          quantos goblins o jogador tem na mão.
        </L>
        <L i={<Icon name="bag" />} t="Itens">
          quantos itens o jogador tem. Também é o verso do monte de itens.
        </L>
        <L i={<Icon name="grave" />} t="Cemitério">
          quantas cartas o jogador já perdeu.
        </L>
        <L i={<Icon name="bot" />} t="Bot">
          jogador controlado pelo computador.
        </L>
        <L i={<Icon name="bolt" />} t="Caos">
          a faixa do topo mostra a regra da rodada (ou a da próxima). Também é o verso do monte de
          Caos.
        </L>
        <L i={<Icon name="skull" />} t="Necromante">
          carta de Caos em que cada um joga com as cartas do próprio cemitério.
        </L>
        <L i={<Icon name="moon" />} t="Monstro Dormindo">
          item que se usa antes de revelar o monstro.
        </L>
        <L i={<Icon name="sun" />} t="Monstro Acordado">
          item que se usa depois da revelação, na janela de itens.
        </L>
        <L i={<Icon name="alert" />} t="Aviso">
          sua soma cai na Zona Proibida ou no Ímã.
        </L>
        <L i={<Icon name="info" />} t="Dica">
          explica o que fazer neste momento (desligue em “Mostrar dicas”).
        </L>
        <Section>Barra do topo</Section>
        <L i={<Icon name="book" />} t="Regras">
          abre esta tela.
        </L>
        <L i={<Icon name="list" />} t="Histórico">
          tudo o que aconteceu na partida, rodada a rodada.
        </L>
        <L i={<Icon name="gauge" />} t="Normal / Rápido">
          {' — só muda a velocidade das animações e pausas na sua tela. '}
          <b className="text-text">Normal</b>: cartas voando, avisos e resultados com tempo para
          ler. <b className="text-text">Rápido</b>: tudo dura menos da metade do tempo (cerca de 2×
          mais rápido), bom quando você já conhece o jogo. As regras e as jogadas dos bots são as
          mesmas nos dois. Online, a escolha de quem criou a mesa define o ritmo da partida; a sua
          muda só as animações na sua tela.
        </L>
        <L i={<Icon name="home" />} t="Menu">
          volta para a tela inicial.
        </L>
      </div>
      <p>
        <b className="text-text">Objetivo:</b> ser o último jogador com cartas na mão.
      </p>
      <p>
        <b className="text-text">Rodada:</b> monstro dormindo (escolha até 3 goblins; itens de lua)
        → monstro acordado (revela; itens de sol; resultado) → revela o Caos da próxima rodada.
      </p>
      <p>
        <b className="text-text">Cravou</b> (diferença 0): rouba 2 cartas às cegas e compra 1 item.
        Se alguém cravar, só quem cravou ganha.
        <br />
        <b className="text-text">Aproximação</b> (ninguém cravou): quem chegou mais perto, para cima
        ou para baixo, elimina 1 carta às cegas de um rival e compra 1 item.
        <br />
        <b className="text-text">Perdeu:</b> descarta as cartas jogadas no próprio cemitério.
        Vencedores pegam as cartas de volta.
        <br />
        <b className="text-text">Última carta:</b> se só restam 2 jogadores com 1 carta cada, quem
        perde por aproximação não descarta.
      </p>
      <p>
        <b className="text-text">Itens:</b> no máximo 3 na mão. Se comprar o 4º, escolha 1 para
        mandar para o fundo do monte de itens.
        <br />
        <b className="text-text">Itens de característica</b> (☀, só se você jogou goblin com a
        característica): Chapéu Pontudo +2, Monóculo Polido +1 por goblin de Monóculo, Nariz de
        Ferro +3 (Fedorento); Pomada de Pereba −2, Poção Maluca −1 por goblin Maluco, Machucado −3
        (Cicatriz).
      </p>
      <p>
        <b className="text-text">Viradas:</b> <b className="text-text">Vingança do Cemitério</b> —
        no início da rodada, quem tem o maior cemitério compra 1 item.{' '}
        <b className="text-text">Cravada do Azarão</b> — quem crava tendo a menor mão da mesa rouba
        3 cartas em vez de 2. <b className="text-text">Pressa não Compensa</b> — quem perde tendo
        jogado 3 goblins ou mais compra 1 item.
      </p>
      <p>
        <b className="text-text">Monstros com efeito:</b> alguns monstros têm um efeito, revelado
        quando acordam. <b className="text-text">Amigo dos Fracos</b> (10, 15, 20, 25, 30, 35 e 40):
        quando alguém vence a rodada, quem compra o item é o jogador com menos itens na mão (empate:
        todos os empatados).
      </p>
      <p>
        <b className="text-text">Território:</b> se algum goblin jogado for de um território do
        monstro, você tem margem de ±1.
      </p>
      <p>
        <b className="text-text">Reis e rainhas:</b>
        {KINGS.map((k, i) => (
          <Fragment key={i}>
            <br />
            {`${CLAN[i]} — ${k.name} (${traitNames(k.tr)}, empresta aos ${lendTxt(i)}): ${k.text}`}
          </Fragment>
        ))}
        <br />A Maldição desliga o rei que tiver a característica sorteada.
      </p>
      <p>
        <b className="text-text">Cartas:</b> veja as abas <b className="text-text">Itens</b> e{' '}
        <b className="text-text">Caos</b> para a lista completa, com cópias e textos.
      </p>
    </div>
  );
}
