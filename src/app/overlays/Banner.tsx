import { useUi } from '../store.ts';

// aviso grande no meio da tela ("Cravou!", "Perdeu"...). A chave nova a cada aviso faz a
// animação de entrada tocar de novo.
export function Banner() {
  const b = useUi((s) => s.banner);
  if (!b) return null;
  return (
    <div key={b.id} className={`bn ${b.kind}`}>
      <b>{b.text}</b>
      {b.sub ? <small>{b.sub}</small> : null}
    </div>
  );
}
