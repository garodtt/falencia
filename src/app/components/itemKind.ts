// Quando um item se usa, do jeito que a tela mostra. O motor só guarda 'D'/'A' (ITEMS[k][2]);
// NÃO! e Armadilha são reações (REACT: o jogo pergunta na hora) e o Saco de Moedas é usado assim
// que entra na mão. Toda tela que mostra "quando usar" passa por aqui.
import { ITEMS, REACT } from '../../game/data.ts';
import type { ItemKey } from '../../game/data.ts';

export type ItemKind = 'dormindo' | 'acordado' | 'reacao' | 'nahora';

export const itemKind = (k: ItemKey): ItemKind =>
  k === 'SACO'
    ? 'nahora'
    : REACT.includes(k)
      ? 'reacao'
      : ITEMS[k][2] === 'D'
        ? 'dormindo'
        : 'acordado';

export const KIND: Record<
  ItemKind,
  {
    label: string; // na carta
    short: string; // na tabela das regras
    sub: string; // no balão
    icon: string;
    text: string; // classe da cor
    tint: string; // fundo clarinho + cor (chip, ícone da bandeja)
    accent: string; // lombada do balão (style)
  }
> = {
  dormindo: {
    label: 'Monstro dormindo',
    short: 'Dormindo',
    sub: 'Monstro dormindo: use antes de o monstro acordar',
    icon: 'moon',
    text: 'text-moon',
    tint: 'bg-moon/18 text-moon',
    accent: 'var(--color-moon)',
  },
  acordado: {
    label: 'Monstro acordado',
    short: 'Acordado',
    sub: 'Monstro acordado: use na janela de itens',
    icon: 'sun',
    text: 'text-sun',
    tint: 'bg-sun/16 text-sun',
    accent: 'var(--color-sun)',
  },
  reacao: {
    label: 'Reação',
    short: 'Reação',
    sub: 'Reação: fica escondida na mão e o jogo pergunta na hora certa',
    icon: 'alert',
    text: 'text-bad',
    tint: 'bg-bad/16 text-bad',
    accent: 'var(--color-bad)',
  },
  nahora: {
    label: 'Na hora',
    short: 'Na hora',
    sub: 'Na hora: é usado assim que entra na sua mão',
    icon: 'bag',
    text: 'text-accent',
    tint: 'bg-accent/16 text-accent',
    accent: 'var(--color-accent)',
  },
};
