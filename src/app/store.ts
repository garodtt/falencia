// Ponte entre o motor (que muta G, MENU, NET... no lugar) e o React, mais o estado que é só desta tela.
// Quem muda o estado do jogo chama render()/renderMenu(), que sobem `v`.
// Componentes leem o estado mutável direto e assinam `v` (useTick) para re-renderizar.
import type { ReactNode } from 'react';
import { create } from 'zustand';
import type { Gob } from '../game/data.ts';
import { MENU } from '../game/state.ts';
import type { AskValue } from '../game/types.ts';
import { TIPS } from '../ui/tips.ts';

export interface Opt<T> {
  label: string;
  value: T;
  cls?: string;
}
export interface Modal {
  title: string;
  text: string;
  options: Opt<AskValue>[];
  showcard?: ReactNode;
  resolve: (v: AskValue) => void;
}

interface UiStore {
  v: number;
  bump: () => void;
  tipsOn: boolean; // "Mostrar dicas de como jogar" no menu
  setTipsOn: (on: boolean) => void;
  sel: Gob[]; // goblins escolhidos na mão (antes de "Jogar")
  kingOpen: boolean; // cartão do rei expandido
  dealing: boolean; // a mão acabou de ser distribuída: cartas entram animadas
  modal: Modal | null;
  banner: { id: number; text: string; sub: string; kind: string } | null;
  toast: { id: number; msg: string } | null;
  tip: number; // sobe a cada tipPlace(): a dica se reposiciona
}

export const useUi = create<UiStore>()((set) => ({
  v: 0,
  bump: () => set((s) => ({ v: s.v + 1 })),
  tipsOn: true,
  setTipsOn: (tipsOn) => set({ tipsOn }),
  sel: [],
  kingOpen: false,
  dealing: false,
  modal: null,
  banner: null,
  toast: null,
  tip: 0,
}));

export const useTick = () => useUi((s) => s.v);
export const bump = () => useUi.getState().bump();

// MENU continua sendo a fonte (a rede lê MENU.n/MENU.color); aqui só avisamos o React
export function setMenu(patch: Partial<typeof MENU>) {
  Object.assign(MENU, patch);
  bump();
}

// toda partida (contra bots ou online) começa com as dicas zeradas, ligadas conforme o menu
export function resetTips() {
  TIPS.on = useUi.getState().tipsOn;
  TIPS.seen = new Set();
}
