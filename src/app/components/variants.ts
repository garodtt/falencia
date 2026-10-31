// Classes de visual reaproveitado. Botão: todo <button> com cara de botão usa uma destas (a forma
// é a classe .btn de styles.css; o tamanho dá para ajustar com px-3, text-small... no uso).
export const PRIMARY = 'btn bg-accent text-on-accent';
export const GHOST =
  'btn bg-transparent text-text inset-ring inset-ring-line hover:enabled:bg-surface-2';
export const RED = 'btn bg-red text-white';
// campo de texto (nome, código da mesa); quem usa põe a largura e o tamanho da letra
export const INPUT =
  'rounded-box border border-line bg-surface-2 px-3 py-2 font-ui font-semibold text-text';
// caixa de conteúdo do menu e da sala de espera
export const PANEL = 'grid gap-3 rounded-panel border border-line bg-surface p-4';
// janela por cima de tudo (modal, aviso de girar a tela) e o fundo escuro atrás dela
export const SCRIM = 'fixed inset-0 grid place-items-center bg-scrim/72 p-4';
export const DIALOG =
  'grid gap-3 rounded-2xl border border-line bg-surface shadow-dialog animate-rise';
