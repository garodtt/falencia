// Janela de escolha (askLocal): quem pergunta espera a resposta numa promise.
import type { ReactNode } from 'react';
import { G, LOCAL, ME } from '../../game/state.ts';
import type { AskValue } from '../../game/types.ts';
import { useUi } from '../store.ts';
import type { Opt } from '../store.ts';

// abre o modal e devolve o valor da opção escolhida (null se o modal foi fechado por fora)
export function askLocal<T extends AskValue>(
  title: string,
  text: string,
  options: Opt<T>[],
  showcard?: ReactNode,
) {
  return new Promise<T | null>((res) => {
    useUi.setState({
      modal: { title, text, options, showcard, resolve: res as (v: AskValue) => void },
    });
  });
}

export function answerModal(v: AskValue) {
  const m = useUi.getState().modal;
  if (!m) return;
  useUi.setState({ modal: null });
  LOCAL.modalNonce = null;
  m.resolve(v);
}

// o modal era a resposta de um pedido que já foi resolvido por outro caminho: fecha com null
export function closeStaleModal() {
  const m = useUi.getState().modal;
  if (!LOCAL.modalNonce || !m) return;
  const pe = G && G.pend && G.pend[ME];
  if (pe && pe.nonce === LOCAL.modalNonce) return;
  LOCAL.modalNonce = null;
  useUi.setState({ modal: null });
  m.resolve(null);
}
