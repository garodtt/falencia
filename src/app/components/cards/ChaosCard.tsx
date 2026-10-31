import { chaosDesc, chaosIc, chaosTitle } from '../../../game/data.ts';
import { TextCard } from './TextCard.tsx';

// carta de Caos com nome e regra
export function ChaosCard({ k }: { k: string }) {
  return (
    <TextCard
      icon={chaosIc(k)}
      label="Caos · para todos"
      labelCls="text-chaos"
      title={chaosTitle(k)}
      text={chaosDesc(k)}
      className="border border-chaos/50 [background:color-mix(in_srgb,var(--color-chaos)_18%,var(--color-surface-2))]"
    />
  );
}
