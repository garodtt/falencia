// Forma comum a toda carta (frente, verso, monstro, texto): tamanho via --cw/--ch (quem a usa
// define esses dois, por ex. #hand no tamanho padrão, .oplay numa carta pequena).
export const CARD_BASE =
  'relative flex-none select-none w-(--cw) h-(--ch) rounded-[calc(var(--cw)*0.13)] shadow-card';

// cor do território (c0 vermelho, c1 verde, c2 azul, c3 amarelo): classe de fundo, o texto que
// combina com ela e a cor crua (para style, quando a cor é dinâmica e não cabe numa classe)
export const CLAN_BG = ['bg-red', 'bg-green', 'bg-blue', 'bg-yellow'];
export const CLAN_TEXT = ['text-white', 'text-white', 'text-white', 'text-on-yellow'];
export const CLAN_COLOR = [
  'var(--color-red)',
  'var(--color-green)',
  'var(--color-blue)',
  'var(--color-yellow)',
];
// cor do território como texto, e um fundo clarinho dela (coroa do rei)
export const CLAN_FG = ['text-red', 'text-green', 'text-blue', 'text-yellow'];
export const CLAN_TINT = ['bg-red/22', 'bg-green/22', 'bg-blue/22', 'bg-yellow/22'];
