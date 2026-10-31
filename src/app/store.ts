// Ponte entre o motor (que muta G, MENU, NET... no lugar) e o React, mais o estado que é só desta tela.
// Quem muda o estado do jogo chama render() (mesa, app/render.ts) ou bump() (menu), que sobem `v`.
// Componentes leem o estado mutável direto e assinam `v` (useTick) para re-renderizar.
import type { ReactNode } from 'react';
import { create } from 'zustand';
import type { Gob } from '../game/data.ts';
import { MENU } from '../game/state.ts';
import type { AskValue } from '../game/types.ts';
import { TIPS } from './tips.ts';

export type Screen = 'menu' | 'lobby' | 'game';

// carta voando de um lugar a outro da tela (fx.tsx); `done` libera quem esperava a animação
export interface Flight {
  id: number;
  card: ReactNode;
  from: DOMRect;
  to: DOMRect;
  dur: number;
  rot: number;
  delay: number;
  done: () => void;
}
// balãozinho que sobe de um assento ("+1 item", "−2 cartas")
export interface Pop {
  id: number;
  x: number;
  y: number;
  text: string;
  good?: boolean;
}
// um papelzinho do confete (sorteado fora do render)
export interface Confetto {
  id: number;
  left: number;
  color: string;
  dur: number;
  delay: number;
}

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
  screen: Screen; // menu, sala de espera online ou mesa
  logOpen: boolean; // gaveta do histórico aberta
  shake: boolean; // a mesa treme (você perdeu a rodada)
  flights: Flight[];
  pops: Pop[];
  confetti: Confetto[];
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
  screen: 'menu',
  logOpen: false,
  shake: false,
  flights: [],
  pops: [],
  confetti: [],
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
