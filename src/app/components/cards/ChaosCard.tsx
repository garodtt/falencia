import { chaosDesc, chaosIc, chaosTitle } from '../../../game/data.ts';
import { Icon } from '../Icon.tsx';

// carta de Caos com nome e regra
export function ChaosCard({ k, curse }: { k: string; curse?: number }) {
  return (
    <div className="card txtcard ccard">
      <i>
        <Icon name={chaosIc(k)} />
        Caos · para todos
      </i>
      <b>{chaosTitle(k, curse)}</b>
      <span>{chaosDesc(k, curse)}</span>
    </div>
  );
}
