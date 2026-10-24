import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { G, NET } from '../../../game/state.ts';
import { fb } from '../../../net/firebase.ts';
import { render } from '../../../ui/render.ts';

const style: CSSProperties = {
  font: '600 15px var(--ui)',
  padding: '9px 12px',
  borderRadius: 10,
  border: '1px solid var(--line)',
  background: 'var(--surface2)',
  color: 'var(--text)',
  width: 240,
};

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
    <div className={`row ${NET.db ? '' : 'hidden'}`} id="nameRow">
      <span className="muted">Seu nome</span>
      <input
        ref={ref}
        id="nameIn"
        maxLength={20}
        placeholder="Como os amigos vão te ver"
        aria-label="Seu nome"
        style={style}
      />
    </div>
  );
}
