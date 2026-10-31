import { Icon } from '../Icon.tsx';
import { CARD_BASE } from './cardBase.ts';

const iconSize = { width: 'calc(var(--cw) * 0.09)', height: 'calc(var(--cw) * 0.09)' };

// a letra do texto diminui com o comprimento, para o texto inteiro caber na carta em qualquer
// tamanho (tudo é proporcional a --cw). Conferido no sandbox (Cartas) de 40 a 160px: mudou um
// texto de item ou de Caos? Confira lá se ainda cabe.
function bodySize(text: string) {
  if (text.length > 220) return 'text-[calc(var(--cw)*0.058)]';
  if (text.length > 150) return 'text-[calc(var(--cw)*0.066)]';
  if (text.length > 100) return 'text-[calc(var(--cw)*0.072)]';
  if (text.length > 80) return 'text-[calc(var(--cw)*0.08)]';
  return 'text-[calc(var(--cw)*0.085)]';
}
// o título quebra entre palavras, mas uma palavra comprida sozinha ("Compartilhadas") não cabe
// na largura da carta: aí o título todo diminui
const titleSize = (title: string) =>
  Math.max(...title.split(' ').map((w) => w.length)) > 11
    ? 'text-[calc(var(--cw)*0.095)]'
    : 'text-[calc(var(--cw)*0.12)]';

// carta de texto (item ou Caos): rótulo com ícone, título e o texto da regra
export function TextCard({
  icon,
  label,
  labelCls,
  title,
  text,
  className,
}: {
  icon: string;
  label: string;
  labelCls: string; // cor do rótulo
  title: string;
  text: string;
  className: string; // fundo e borda
}) {
  return (
    <div
      data-card
      className={`${CARD_BASE} grid content-start gap-[calc(var(--cw)*0.035)] overflow-hidden p-[calc(var(--cw)*0.09)] text-left leading-[1.25] ${className}`}
    >
      <i
        className={`flex items-center gap-1 text-[calc(var(--cw)*0.07)] font-bold not-italic tracking-[0.06em] uppercase ${labelCls}`}
      >
        <Icon name={icon} style={iconSize} />
        {label}
      </i>
      <b className={`font-display leading-[1.1] font-semibold ${titleSize(title)}`}>{title}</b>
      <span className={bodySize(text)}>{text}</span>
    </div>
  );
}
