import { ToggleGroup } from 'radix-ui';
import { GHOST } from '../app/components/variants.ts';
import { CINZAS, DESTAQUES, PADRAO, escolher, useTema } from './tema.ts';

// uma fileira de escalas do Radix para escolher; a bolinha mostra o tom 9 (a cor cheia) sobre o 3
function Escalas({
  nome,
  opcoes,
  valor,
  onPick,
}: {
  nome: string;
  opcoes: string[];
  valor: string;
  onPick: (v: string) => void;
}) {
  return (
    <ToggleGroup.Root
      type="single"
      aria-label={nome}
      value={valor}
      onValueChange={(v) => v && onPick(v)}
      className="flex flex-wrap items-center gap-1"
    >
      <span className="mr-1 text-muted">{nome}</span>
      {opcoes.map((o) => (
        <ToggleGroup.Item
          key={o}
          value={o}
          className="flex items-center gap-1.5 rounded-full px-2 py-1 text-xs text-muted data-[state=on]:bg-surface-3 data-[state=on]:text-text"
        >
          <span
            className="size-3.5 rounded-full inset-ring inset-ring-line"
            style={{ background: `linear-gradient(135deg, var(--${o}-3) 50%, var(--${o}-9) 50%)` }}
          />
          {o}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}

// tema do sandbox: cinza e destaque, aplicados ao vivo em tudo (inclusive na mesa)
export function SeletorTema() {
  const t = useTema();
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-small">
      <Escalas
        nome="Cinza"
        opcoes={CINZAS}
        valor={t.cinza}
        onPick={(cinza) => escolher({ cinza })}
      />
      <Escalas
        nome="Destaque"
        opcoes={DESTAQUES}
        valor={t.destaque}
        onPick={(destaque) => escolher({ destaque })}
      />
      <button className={`${GHOST} px-2.5 py-1 text-xs`} onClick={() => escolher(PADRAO)}>
        tema do jogo
      </button>
    </div>
  );
}
