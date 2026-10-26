// Tela de regras (aberta pelo botão "Regras" da barra do topo).
import { Fragment } from 'react';
import type { ReactNode } from 'react';
import { CHAOS, CLAN, KINGS, lendTxt, traitNames } from '../../game/data.ts';
import { Icon } from '../components/Icon.tsx';

const strong = { color: 'var(--text)' };

// uma linha da legenda: ícone, nome e o que significa. O " — " fica no mesmo nó de texto da
// descrição (como no HTML original): separados, o navegador posiciona as letras com diferença
// de subpixel. Descrição com marcação (não-string) já começa com o " — ".
function L({ i, t, children }: { i: ReactNode; t: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
      <span
        style={{
          color: 'var(--text)',
          flex: 'none',
          width: 18,
          display: 'inline-flex',
          justifyContent: 'center',
          paddingTop: 1,
        }}
      >
        {i}
      </span>
      <span>
        <b style={strong}>{t}</b>
        {typeof children === 'string' ? ` — ${children}` : children}
      </span>
    </div>
  );
}

function Section({ first, children }: { first?: boolean; children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        letterSpacing: '.06em',
        textTransform: 'uppercase',
        marginTop: first ? undefined : 4,
      }}
    >
      {children}
    </div>
  );
}

export function Rules() {
  return (
    <div
      style={{
        textAlign: 'left',
        fontSize: 13,
        maxHeight: '60vh',
        overflow: 'auto',
        width: '100%',
        color: 'var(--muted)',
        display: 'grid',
        gap: 8,
      }}
    >
      <p style={{ margin: 0 }}>
        <b style={strong}>O que cada ícone significa</b>
      </p>
      <div
        style={{
          display: 'grid',
          gap: 5,
          padding: '10px 12px',
          border: '1px solid var(--line, rgba(255,255,255,.12))',
          borderRadius: 10,
        }}
      >
        <Section first>Características dos goblins (canto da carta)</Section>
        <L i={<Icon name="hat" />} t="Chapéu">
          característica usada por itens (Chapéu Pontudo, Disfarce) e pela Maldição.
        </L>
        <L i={<Icon name="beard" />} t="Barba">
          característica; o Rei Quebra-Crânio empresta Barba aos goblins pares.
        </L>
        <L i={<Icon name="glasses" />} t="Óculos">
          característica usada pelo item Óculos de Grau.
        </L>
        <L i={<Icon name="sandal" />} t="Chinelo">
          característica usada pelo item Chinelo Veloz.
        </L>
        <L i={<Icon name="spiral" />} t="Maluco">
          característica usada pela Poção Maluca.
        </L>
        <L i={<Icon name="wart" />} t="Verruga">
          característica usada pela Pomada de Verruga.
        </L>
        <Section>Mesa e jogadores</Section>
        <L
          i={
            <span style={{ color: 'var(--accent)' }}>
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
          <b style={strong}>Normal</b>: cartas voando, avisos e resultados com tempo para ler.{' '}
          <b style={strong}>Rápido</b>: tudo dura menos da metade do tempo (cerca de 2× mais
          rápido), bom quando você já conhece o jogo. As regras e as jogadas dos bots são as mesmas
          nos dois. Online, a escolha de quem criou a mesa define o ritmo da partida; a sua muda só
          as animações na sua tela.
        </L>
        <L i={<Icon name="home" />} t="Menu">
          volta para a tela inicial.
        </L>
      </div>
      <p>
        <b style={strong}>Objetivo:</b> ser o último jogador com cartas na mão.
      </p>
      <p>
        <b style={strong}>Rodada:</b> monstro dormindo (escolha até 3 goblins; itens de lua) →
        monstro acordado (revela; itens de sol; resultado) → revela o Caos da próxima rodada.
      </p>
      <p>
        <b style={strong}>Cravou</b> (diferença 0): rouba 2 cartas às cegas e compra 1 item. Se
        alguém cravar, só quem cravou ganha.
        <br />
        <b style={strong}>Aproximação</b> (ninguém cravou): quem chegou mais perto, para cima ou
        para baixo, elimina 1 carta às cegas de um rival e compra 1 item.
        <br />
        <b style={strong}>Perdeu:</b> descarta as cartas jogadas no próprio cemitério. Vencedores
        pegam as cartas de volta.
        <br />
        <b style={strong}>Última carta:</b> se só restam 2 jogadores com 1 carta cada, quem perde
        por aproximação não descarta.
      </p>
      <p>
        <b style={strong}>Itens:</b> no máximo 3 na mão. Se comprar o 4º, escolha 1 para mandar para
        o fundo do monte de itens.
      </p>
      <p>
        <b style={strong}>Viradas:</b> <b style={strong}>Vingança do Cemitério</b> — no início da
        rodada, quem tem o maior cemitério compra 1 item. <b style={strong}>Cravada do Azarão</b> —
        quem crava tendo a menor mão da mesa rouba 3 cartas em vez de 2.{' '}
        <b style={strong}>Pressa não Compensa</b> — quem perde tendo jogado 3 goblins ou mais compra
        1 item.
      </p>
      <p>
        <b style={strong}>Monstros com efeito:</b> alguns monstros têm um efeito, revelado quando
        acordam. <b style={strong}>Amigo dos Fracos</b> (10, 15, 20, 25, 30, 35 e 40): quando alguém
        vence a rodada, quem compra o item é o jogador com menos itens na mão (empate: todos os
        empatados).
      </p>
      <p>
        <b style={strong}>Território:</b> se algum goblin jogado for de um território do monstro,
        você tem margem de ±1.
      </p>
      <p>
        <b style={strong}>Reis e rainhas:</b>
        {KINGS.map((k, i) => (
          <Fragment key={i}>
            <br />
            {`${CLAN[i]} — ${k.name} (${traitNames(k.tr)}, empresta aos ${lendTxt(i)}): ${k.text}`}
          </Fragment>
        ))}
        <br />A Maldição desliga o rei que tiver a característica sorteada.
      </p>
      <p>
        <b style={strong}>Caos (50 cartas):</b>
      </p>
      <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 4 }}>
        {Object.entries(CHAOS).map(([k, c]) => (
          <li key={k}>
            <b>{c[0]}</b>
            {` (${c[2]}) — ${c[1]}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
