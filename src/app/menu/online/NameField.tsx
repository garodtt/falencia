import { useEffect, useRef } from 'react';
import { G, NET } from '../../../game/state.ts';
import { fb } from '../../../net/firebase.ts';
import { render } from '../../../ui/render.ts';

// "Seu nome" (só aparece com o online ligado). O valor inicial é preenchido pelo initNet
// direto no input; o nome é salvo no evento "change" nativo (ao sair do campo ou dar Enter),
// não a cada tecla, porque cada salvamento grava no banco.
export function NameField() {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const save = () => {
      if (!fb) return;
      const n = fb.setName(el.value);
      if (NET.uid) NET.names[NET.uid] = n;
      if (G) render();
    };
    el.addEventListener('change', save);
    return () => el.removeEventListener('change', save);
  }, []);
  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${NET.db ? '' : '!hidden'}`} id="nameRow">
      <span className="text-muted">Seu nome</span>
      <input
        ref={ref}
        id="nameIn"
        className="w-60 rounded-[10px] border border-line bg-surface-2 px-3 py-[9px] font-ui text-[15px] font-semibold text-text"
        maxLength={20}
        placeholder="Como os amigos vão te ver"
        aria-label="Seu nome"
      />
    </div>
  );
}
