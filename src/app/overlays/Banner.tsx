import { useUi } from '../store.ts';

const KIND_TEXT: Record<string, string> = {
  bad: 'text-bad',
  cool: 'text-text',
  pink: 'text-chaos',
};

// aviso grande no meio da tela ("Cravou!", "Perdeu"...). A chave nova a cada aviso faz a
// animação de entrada tocar de novo.
export function Banner() {
  const b = useUi((s) => s.banner);
  if (!b) return null;
  return (
    <div
      key={b.id}
      className="max-w-[calc(100vw-32px)] animate-pop rounded-2xl border border-line bg-surface/94 px-7 py-[18px] text-center shadow-dialog"
    >
      <b
        className={`block font-display text-[clamp(28px,4vw,44px)] leading-none ${KIND_TEXT[b.kind] || 'text-accent'}`}
      >
        {b.text}
      </b>
      {b.sub ? <small className="mt-1.5 block text-sm text-muted">{b.sub}</small> : null}
    </div>
  );
}
