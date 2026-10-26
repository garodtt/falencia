// HTML das cartas e pequenos ajudantes de tela.
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

// os ids são os do index.html; quem precisa de um input pede: $<HTMLInputElement>('codeIn')
export const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T;
export const fmt = (s: unknown) => String(s).replace(/\[\[p(\d)\]\]/g, (_, i) => nameOf(+i));
export const esc = (s: unknown) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' } as Record<string, string>)[c],
  );
export const ic = (n: string, cls = '') =>
  `<svg class="i ${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
export const CCSS = ['var(--red)', 'var(--green)', 'var(--blue)', 'var(--yellow)'];
export const traitIcons = (t: number) =>
  TRAITS.filter((x) => t & x)
    .map((x) => ic(TICO[x]))
    .join('');
export function gobCard(g: Gob, cls = '', attrs = '', eff?: number, kingLend?: boolean) {
  const v = gv(g),
    e = eff !== undefined && eff !== v ? `<span class="eff">${eff}</span>` : '';
  return `<div class="card gob c${gc(g)} ${cls}" ${attrs} title="${traitNames(TR[v])}">${e}${kingLend ? `<span class="kb">${ic('crown')}</span>` : ''}<span class="s">${v}</span><span class="n">${v}</span><span class="t">${traitIcons(TR[v])}</span></div>`;
}
export const backCard = (cls = '') =>
  `<div class="card back ${cls}"><span class="bk">F</span></div>`;
export const itemBack = () => `<div class="card back item">${ic('bag')}</div>`;
export const chaosBack = () => `<div class="card back chaos">${ic('bolt')}</div>`;
export const monBack = (inner = '') => `<div class="card mback">${ic('moon')}${inner}</div>`;
export const itemCard = (k: ItemKey) =>
  `<div class="card txtcard icard ${ITEMS[k][2]}"><i>${ic(ITEMS[k][2] === 'D' ? 'moon' : 'sun')}${ITEMS[k][2] === 'D' ? 'Monstro dormindo' : 'Monstro acordado'}</i><b>${ITEMS[k][0]}</b><span>${ITEMS[k][1]}</span></div>`;
export const chaosCard = (k: string, curse?: number) =>
  `<div class="card txtcard ccard"><i>${ic(chaosIc(k))}Caos · para todos</i><b>${chaosTitle(k, curse)}</b><span>${chaosDesc(k, curse)}</span></div>`;
