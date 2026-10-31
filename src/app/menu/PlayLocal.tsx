import { startLocal } from './startLocal.ts';
import { Icon } from '../components/Icon.tsx';
import { resetTips, useUi } from '../store.ts';
import { PRIMARY } from '../components/variants.ts';

// "Jogar contra bots" e a opção de mostrar as dicas
export function PlayLocal() {
  const tipsOn = useUi((s) => s.tipsOn);
  const setTipsOn = useUi((s) => s.setTipsOn);
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        className={PRIMARY}
        id="btnPlay"
        onClick={() => {
          resetTips();
          startLocal();
        }}
      >
        <Icon name="bot" />
        Jogar contra bots
      </button>
      <label className="text-muted">
        <input
          type="checkbox"
          id="cfgTips"
          checked={tipsOn}
          onChange={(e) => setTipsOn(e.target.checked)}
        />{' '}
        Mostrar dicas de como jogar
      </label>
    </div>
  );
}
