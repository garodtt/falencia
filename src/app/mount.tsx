// Liga as telas React nos seus lugares do index.html. Cada uma é uma "ilha" React; a barra do topo
// e a sala de espera online ainda são HTML fixo (src/ui/) até mexermos no online.
import { FloatingDelayGroup } from '@floating-ui/react';
import { StrictMode } from 'react';
import type { ComponentType } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { $ } from '../ui/html.ts';
import { Menu } from './menu/Menu.tsx';
import { Banner } from './overlays/Banner.tsx';
import { LogList } from './overlays/LogList.tsx';
import { Modal } from './overlays/Modal.tsx';
import { RotateHint } from './overlays/RotateHint.tsx';
import { Toast } from './overlays/Toast.tsx';
import { Tips } from './overlays/Tips.tsx';
import { Table } from './table/Table.tsx';

const ISLANDS: [string, ComponentType][] = [
  ['menu', Menu],
  ['game', Table],
  ['logList', LogList],
  ['banner', Banner],
  ['modal', Modal],
  ['toast', Toast],
  ['tut', Tips],
  ['rotate', RotateHint],
];

export function mountApp() {
  // síncrono: o initNet preenche o #nameIn logo em seguida e precisa encontrá-lo
  flushSync(() => {
    for (const [id, Island] of ISLANDS)
      createRoot($(id)).render(
        <StrictMode>
          {/* balões vizinhos: o primeiro espera, os seguintes abrem na hora */}
          <FloatingDelayGroup delay={{ open: 350, close: 80 }}>
            <Island />
          </FloatingDelayGroup>
        </StrictMode>,
      );
  });
}
