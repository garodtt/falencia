import { cleanup } from '@testing-library/react';
import { afterEach } from 'vite-plus/test';

afterEach(cleanup);

// o jsdom não mede layout: a mão usa a largura padrão
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
