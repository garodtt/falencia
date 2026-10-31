import { AlertDialog } from 'radix-ui';
import { useRef } from 'react';
import { DIALOG, GHOST, RED, SCRIM, PRIMARY } from '../components/variants.ts';
import { useUi } from '../store.ts';
import { answerModal } from './modal.ts';

// 'ghost'/'red' são o nome do estilo do botão (quem pergunta escolhe, em game/ui); aqui é onde
// esse nome vira classe de verdade.
const VARIANT: Record<string, string> = { ghost: GHOST, red: RED };

// janela de escolha aberta por askLocal(): título, conteúdo opcional (cartas, regras) e opções.
// É um AlertDialog do Radix (foco preso na janela, volta ao fechar). Só fecha escolhendo uma
// opção: nem Esc nem clique fora, porque o jogo está esperando a resposta.
export function Modal() {
  const m = useUi((s) => s.modal);
  const first = useRef<HTMLButtonElement>(null);
  if (!m) return null;
  return (
    <AlertDialog.Root open>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={`${SCRIM} z-modal overflow-y-auto`}>
          <AlertDialog.Content
            className={`${DIALOG} w-[min(500px,100%)] p-5`}
            onEscapeKeyDown={(e) => e.preventDefault()}
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              first.current?.focus();
            }}
            {...(m.text ? {} : { 'aria-describedby': undefined })}
          >
            <AlertDialog.Title className="m-0 font-display text-title font-semibold">
              {m.title}
            </AlertDialog.Title>
            {m.showcard ? (
              <div className="flex flex-wrap justify-center gap-2.5 [--cw:150px] max-sm:[--cw:min(120px,28vw)]">
                {m.showcard}
              </div>
            ) : null}
            {m.text ? (
              <AlertDialog.Description className="m-0 text-muted">{m.text}</AlertDialog.Description>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {m.options.map((o, i) => (
                <button
                  key={i}
                  ref={i === 0 ? first : undefined}
                  className={`px-3.5 py-2 ${VARIANT[o.cls || (m.options.length > 3 ? 'ghost' : '')] || PRIMARY}`}
                  onClick={() => answerModal(o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </AlertDialog.Content>
        </AlertDialog.Overlay>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
