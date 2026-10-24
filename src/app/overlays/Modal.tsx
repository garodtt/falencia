import { useEffect, useRef } from 'react';
import { useUi } from '../store.ts';
import { answerModal } from './modal.ts';

// janela de escolha aberta por askLocal(): título, conteúdo opcional (cartas, regras) e opções
export function Modal() {
  const m = useUi((s) => s.modal);
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    first.current?.focus();
  }, [m]);
  if (!m) return null;
  return (
    <div className="back2">
      <div className="box">
        <h3>{m.title}</h3>
        {m.showcard ? <div className="showcard">{m.showcard}</div> : null}
        {m.text ? <p>{m.text}</p> : null}
        <div className="btns">
          {m.options.map((o, i) => (
            <button
              key={i}
              ref={i === 0 ? first : undefined}
              className={o.cls || (m.options.length > 3 ? 'ghost' : '')}
              onClick={() => answerModal(o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
