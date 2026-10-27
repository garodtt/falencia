// HTML das cartas e pequenos ajudantes de tela. As classes espelham as dos componentes React
// (src/app/components/cards/*) porque estas strings viram cartas "voando" fora do React
// (effects.ts) — têm que ficar idênticas.
import {
  ITEMS,
  TICO,
  TR,
  TRAITS,
  chaosDesc,
  chaosIc,
  chaosTitle,
  gc,
  gv,
  traitNames,
} from '../game/data.ts';
import { nameOf } from '../game/state.ts';
import type { Gob, ItemKey } from '../game/data.ts';
import { CARD_BASE, CLAN_BG, CLAN_TEXT } from '../app/components/cards/cardBase.ts';

// os ids são os do index.html; quem precisa de um input pede: $<HTMLInputElement>('codeIn')
export const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T;
export const fmt = (s: unknown) => String(s).replace(/\[\[p(\d)\]\]/g, (_, i) => nameOf(+i));
export const esc = (s: unknown) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' } as Record<string, string>)[c],
  );
export const ic = (n: string, cls = '', style = '') =>
  `<svg class="inline-block flex-none align-[-3px] fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] ${cls}" style="width:16px;height:16px;stroke-width:1.8;${style}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
export const CCSS = [
  'var(--color-red)',
  'var(--color-green)',
  'var(--color-blue)',
  'var(--color-yellow)',
];
export const traitIcons = (t: number) =>
  TRAITS.filter((x) => t & x)
    .map((x) =>
      ic(TICO[x], '', 'width:calc(var(--cw)*0.17);height:calc(var(--cw)*0.17);stroke-width:2.2'),
    )
    .join('');
// `sm` esconde valor/traços/selos (voando, ou virada pequena do rival) — igual ao GobCard
export function gobCard(g: Gob, sm = false, attrs = '', eff?: number, kingLend?: boolean) {
  const v = gv(g),
    clan = gc(g),
    e =
      !sm && eff !== undefined && eff !== v
        ? `<span class="absolute -top-[7px] -right-[7px] z-[2] rounded-full border border-accent bg-bg px-1.5 font-ui text-xs font-extrabold text-accent">${eff}</span>`
        : '',
    kb =
      !sm && kingLend
        ? `<span class="absolute -top-2 -left-1.5 z-[2] grid size-[18px] place-items-center rounded-full bg-bg text-accent">${ic('crown', '', 'width:12px;height:12px')}</span>`
        : '',
    s = !sm
      ? `<span class="font-ui text-[calc(var(--cw)*0.16)] leading-none font-bold opacity-[0.85]">${v}</span>`
      : '',
    t = !sm
      ? `<span class="flex justify-center gap-[calc(var(--cw)*0.04)] opacity-90">${traitIcons(TR[v])}</span>`
      : '';
  return `<div class="${CARD_BASE} ${CLAN_BG[clan]} ${CLAN_TEXT[clan]} grid grid-rows-[auto_1fr_auto] border border-white/[0.14] p-[calc(var(--cw)*0.1)]" ${attrs} title="${traitNames(TR[v])}">${e}${kb}${s}<span class="place-self-center font-display text-[calc(var(--cw)*0.52)] leading-none font-extrabold tracking-[-1px]">${v}</span>${t}</div>`;
}
export const backCard = () =>
  `<div class="${CARD_BASE} grid place-items-center border border-[#40444c] bg-surface-3 text-[#6b717c]"><span class="font-display text-[calc(var(--cw)*0.38)] font-extrabold text-[#555a64]">F</span></div>`;
export const itemBack = () =>
  `<div class="${CARD_BASE} grid place-items-center border border-[#40444c] bg-surface-3 text-sun">${ic('bag')}</div>`;
export const chaosBack = () =>
  `<div class="${CARD_BASE} grid place-items-center border border-[#40444c] bg-surface-3 text-chaos">${ic('bolt')}</div>`;
export const monBack = (inner = '') =>
  `<div class="${CARD_BASE} grid place-items-center border border-[#45425e] bg-[linear-gradient(170deg,#2b2a3a,#1c1b26)] text-moon">${ic('moon', '', 'width:calc(var(--cw)*0.36);height:calc(var(--cw)*0.36);stroke-width:1.4')}${inner}</div>`;
export const itemCard = (k: ItemKey) => {
  const [name, text, when] = ITEMS[k],
    color = when === 'D' ? 'text-moon' : 'text-sun';
  return `<div class="${CARD_BASE} grid content-start gap-1 border border-line bg-surface-2 p-[calc(var(--cw)*0.09)] text-left text-[calc(var(--cw)*0.085)] leading-[1.25]"><i class="flex items-center gap-1 text-[calc(var(--cw)*0.07)] font-bold not-italic tracking-[0.06em] uppercase ${color}">${ic(when === 'D' ? 'moon' : 'sun', '', 'width:calc(var(--cw)*0.09);height:calc(var(--cw)*0.09)')}${when === 'D' ? 'Monstro dormindo' : 'Monstro acordado'}</i><b class="font-display text-[calc(var(--cw)*0.12)] leading-[1.1] font-semibold">${name}</b><span>${text}</span></div>`;
};
export const chaosCard = (k: string, curse?: number) =>
  `<div class="${CARD_BASE} grid content-start gap-1 p-[calc(var(--cw)*0.09)] text-left text-[calc(var(--cw)*0.085)] leading-[1.25] [background:color-mix(in_srgb,var(--color-chaos)_18%,var(--color-surface-2))] [border:1px_solid_color-mix(in_srgb,var(--color-chaos)_50%,transparent)]"><i class="flex items-center gap-1 text-[calc(var(--cw)*0.07)] font-bold not-italic tracking-[0.06em] uppercase text-chaos">${ic(chaosIc(k), '', 'width:calc(var(--cw)*0.09);height:calc(var(--cw)*0.09)')}Caos · para todos</i><b class="font-display text-[calc(var(--cw)*0.12)] leading-[1.1] font-semibold">${chaosTitle(k, curse)}</b><span>${chaosDesc(k, curse)}</span></div>`;
