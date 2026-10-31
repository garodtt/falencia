// Ícones, botões, campos, caixas e etiquetas reaproveitados pelo jogo.
import { G } from '../../game/state.ts';
import { Badge } from '../../app/components/Badge.tsx';
import { ChiefCrown } from '../../app/components/ChiefCrown.tsx';
import { ColorDot } from '../../app/components/ColorDot.tsx';
import { Icon } from '../../app/components/Icon.tsx';
import { PlayerStats } from '../../app/components/PlayerStats.tsx';
import { ICONS } from '../../app/components/Sprites.tsx';
import { Chip } from '../../app/components/UsedChips.tsx';
import { DIALOG, GHOST, INPUT, PANEL, PRIMARY, RED } from '../../app/components/variants.ts';
import { Warn } from '../../app/components/Warn.tsx';
import { Amostra, Bloco, LINHA } from '../layout.tsx';

export function Pecas() {
  return (
    <>
      <Bloco
        titulo="Ícones"
        desc={'<Icon name="..." /> — ícone novo entra em ICONS (Sprites.tsx).'}
      >
        <div className={LINHA}>
          {Object.keys(ICONS).map((n) => (
            <Amostra key={n} nome={n}>
              <Icon name={n} style={{ width: 28, height: 28 }} />
            </Amostra>
          ))}
        </div>
      </Bloco>
      <Bloco
        titulo="Botões"
        desc="Variantes de variants.ts. O tamanho se ajusta com classes no uso (px-3, text-small...)."
      >
        <div className={LINHA}>
          <Amostra nome="PRIMARY">
            <button className={PRIMARY}>Jogar</button>
          </Amostra>
          <Amostra nome="GHOST">
            <button className={GHOST}>Limpar</button>
          </Amostra>
          <Amostra nome="RED">
            <button className={RED}>Sair</button>
          </Amostra>
          <Amostra nome="disabled">
            <button className={PRIMARY} disabled>
              Jogar
            </button>
          </Amostra>
          <Amostra nome="com ícone">
            <button className={GHOST}>
              <Icon name="book" />
              Regras
            </button>
          </Amostra>
        </div>
      </Bloco>
      <Bloco titulo="Campos e caixas">
        <div className={LINHA}>
          <Amostra nome="INPUT">
            <input className={`w-60 text-md ${INPUT}`} placeholder="Como os amigos vão te ver" />
          </Amostra>
          <Amostra nome="PANEL">
            <div className={`${PANEL} w-64`}>
              <b>Caixa de conteúdo</b>
              <span className="text-muted">Menu, sala de espera.</span>
            </div>
          </Amostra>
          <Amostra nome="DIALOG">
            <div className={`${DIALOG} w-72 p-5`}>
              <h3 className="m-0 font-display text-title font-semibold">Janela</h3>
              <p className="m-0 text-muted">É a caixa do modal e do aviso de girar a tela.</p>
            </div>
          </Amostra>
        </div>
      </Bloco>
      <Bloco titulo="Etiquetas e marcadores">
        <div className={LINHA}>
          <Amostra nome="Badge w">
            <Badge tone="w">Cravou</Badge>
          </Amostra>
          <Amostra nome="Badge l">
            <Badge tone="l">Faliu</Badge>
          </Amostra>
          <Amostra nome="Warn">
            <Warn>Zona Proibida: soma de 20 a 30 perde</Warn>
          </Amostra>
          <Amostra nome="ColorDot">
            <span className="flex gap-1.5">
              {[0, 1, 2, 3].map((c) => (
                <ColorDot key={c} color={c} />
              ))}
              <ColorDot />
            </span>
          </Amostra>
          <Amostra nome="ChiefCrown">
            <ChiefCrown />
          </Amostra>
        </div>
        <div className={LINHA}>
          <Amostra nome="Chip (item ☀)">
            <Chip u={{ k: 'PORRETE', d: 2 }} />
          </Amostra>
          <Amostra nome="Chip (item ☾)">
            <Chip u={{ k: 'BANDEIRA', c: 2 }} />
          </Amostra>
          <Amostra nome="Chip cancelado">
            <Chip u={{ k: 'AJUSTE', d: -3, x: 1 }} />
          </Amostra>
          <Amostra nome="PlayerStats">
            <PlayerStats p={G.players[1]} />
          </Amostra>
        </div>
      </Bloco>
    </>
  );
}
