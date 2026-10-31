// Classes de visual reaproveitado. O <button> sem classe já é o botão de destaque (amarelo,
// ver `button` em styles.css); estas são as outras variantes e as caixas que se repetem.
export const GHOST =
  'bg-transparent text-text inset-ring inset-ring-line hover:enabled:bg-surface-2';
export const RED = 'bg-red text-white';
// campo de texto (nome, código da mesa); quem usa põe a largura e o tamanho da letra
export const INPUT =
  'rounded-box border border-line bg-surface-2 px-3 py-2 font-ui font-semibold text-text';
// caixa de conteúdo do menu e da sala de espera
export const PANEL = 'grid gap-3 rounded-panel border border-line bg-surface p-4';
// janela por cima de tudo (modal, aviso de girar a tela) e o fundo escuro atrás dela
export const SCRIM = 'fixed inset-0 grid place-items-center bg-scrim/72 p-4';
export const DIALOG =
  'grid gap-3 rounded-2xl border border-line bg-surface shadow-dialog animate-rise';
