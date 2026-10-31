import { CLAN, KINGS, TNAME, TRAITS, heirsTxt, traitNames } from '../../../game/data.ts';
import { monCurse } from '../../../game/rules.ts';
import { CLAN_COLOR } from '../cards/cardBase.ts';
import { TraitIcons } from '../Icon.tsx';
import { TipBody, TipNote, TipRow } from '../tooltip/TipBody.tsx';

// O rei ou rainha: a habilidade, a característica herdada e se a passiva do monstro o desligou
export function KingTip({ king, on = true }: { king: number; on?: boolean }) {
  const k = KINGS[king];
  return (
    <TipBody accent={CLAN_COLOR[king]} title={k.name} sub={`Território ${CLAN[king]}`}>
      <TipNote>{k.text}</TipNote>
      <TipRow icon={<TraitIcons t={k.tr} />} name={`Característica: ${traitNames(k.tr)}`}>
        {`Herdada pelos ${heirsTxt(king)} (marcados com uma coroa). Fica no goblin em qualquer mão.`}
      </TipRow>
      {on ? null : (
        <TipNote warn>{`Desligado nesta rodada: a passiva do monstro pegou ${TRAITS.filter(
          (x) => k.tr & x & monCurse(),
        )
          .map((x) => TNAME[x])
          .join(' e ')}.`}</TipNote>
      )}
    </TipBody>
  );
}
