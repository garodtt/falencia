// Forma comum a toda carta (frente, verso, monstro, texto): tamanho via --cw/--ch (quem a usa
// define esses dois, por ex. #hand no tamanho padrão, .oplay numa carta pequena).
export const CARD_BASE =
  'relative flex-none select-none w-(--cw) h-(--ch) rounded-[calc(var(--cw)*0.13)] shadow-[0_4px_12px_rgba(0,0,0,0.35)]';

// cor do território (c0 vermelho, c1 verde, c2 azul, c3 amarelo) e o texto que combina com ela
export const CLAN_BG = ['bg-red', 'bg-green', 'bg-blue', 'bg-yellow'];
export const CLAN_TEXT = ['text-white', 'text-white', 'text-white', 'text-[#2a1f00]'];
