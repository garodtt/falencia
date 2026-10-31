// Testes de tela importam daqui, não de '@testing-library/react': o render já vem com o que o
// App põe em volta de tudo (o TooltipProvider do Radix).
import { render as rtlRender } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { TooltipProvider } from './app/components/tooltip/Tooltip.tsx';

export * from '@testing-library/react';
export const render = (ui: ReactElement, options?: RenderOptions) =>
  rtlRender(ui, { wrapper: TooltipProvider, ...options });
