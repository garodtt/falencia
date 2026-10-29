import { useEffect, useRef } from 'react';
import { GHOST, RED } from '../components/buttonVariants.ts';
import { useUi } from '../store.ts';
import { answerModal } from './modal.ts';

// 'ghost'/'red' são o nome do estilo do botão (quem pergunta escolhe, em game/ui); aqui é onde
// esse nome vira classe de verdade.
const VARIANT: Record<string, string> = { ghost: GHOST, red: RED };

// janela de escolha aberta por askLocal(): título, conteúdo opcional (cartas, regras) e opções
export function Modal() {
  const m = useUi((s) => s.modal);
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    first.current?.focus();
  }, [m]);
  if (!m) return null;
  return (
    <div className="fixed inset-0 z-[45] grid place-items-center bg-[rgba(10,11,14,0.72)] p-4">
      <div className="grid w-[min(500px,100%)] max-h-[92vh] gap-3 overflow-auto rounded-2xl border border-line bg-surface p-5 shadow-[0_30px_60px_rgba(0,0,0,0.6)] animate-rise">
        <h3 className="m-0 font-display text-[22px] font-semibold">{m.title}</h3>
        {m.showcard ? (
          <div className="flex flex-wrap justify-center gap-2.5 [--cw:150px] max-sm:[--cw:min(120px,28vw)]">
            {m.showcard}
          </div>
        ) : null}
        {m.text ? <p className="m-0 text-muted">{m.text}</p> : null}
        <div className="flex flex-wrap gap-2">
          {m.options.map((o, i) => (
            <button
              key={i}
              ref={i === 0 ? first : undefined}
              className={`px-3.5 py-2 ${VARIANT[o.cls || (m.options.length > 3 ? 'ghost' : '')] || ''}`}
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
