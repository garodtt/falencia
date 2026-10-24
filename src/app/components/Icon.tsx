import { TICO, TRAITS } from '../../game/data.ts';

// ícones do sprite <svg> do index.html (#i-crown, #i-moon...)
export function Icon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <svg className={`i ${className}`} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

// as características de um goblin (bitmask) como ícones
export function TraitIcons({ t }: { t: number }) {
  return TRAITS.filter((x) => t & x).map((x) => <Icon key={x} name={TICO[x]} />);
}
