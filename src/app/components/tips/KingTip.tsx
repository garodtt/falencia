import { CLAN, KINGS, TNAME, TRAITS, lendTxt, traitNames } from '../../../game/data.ts';
import { monCurse } from '../../../game/rules.ts';
import { CCSS } from '../../../ui/html.ts';
import { TraitIcons } from '../Icon.tsx';
import { TipBody, TipNote, TipRow } from '../tooltip/TipBody.tsx';

// O rei ou rainha: a habilidade, o que empresta e se a passiva do monstro o desligou nesta rodada
export function KingTip({ king, on = true }: { king: number; on?: boolean }) {
  const k = KINGS[king];
  return (
    <TipBody accent={CCSS[king]} title={k.name} sub={`Território ${CLAN[king]}`}>
      <TipNote>{k.text}</TipNote>
      <TipRow icon={<TraitIcons t={k.tr} />} name={`Empresta ${traitNames(k.tr)}`}>
        {`Aos ${lendTxt(king)}: eles ganham essas características (marcados com uma coroa).`}
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
