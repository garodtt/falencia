// Liga o React no #root do index.html e escolhe a página pela URL: o jogo, ou o sandbox
// (#/sandbox), que só é baixado quando alguém abre essa página.
import { StrictMode, Suspense, lazy, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import { TooltipProvider } from './components/tooltip/Tooltip.tsx';

const Sandbox = lazy(() => import('../sandbox/Sandbox.tsx'));
const Scene = lazy(() => import('../sandbox/Scene.tsx'));

const onHash = (cb: () => void) => {
  addEventListener('hashchange', cb);
  return () => removeEventListener('hashchange', cb);
};
export const isSandbox = () => location.hash.startsWith('#/sandbox');

function Page() {
  const hash = useSyncExternalStore(onHash, () => location.hash);
  if (hash.startsWith('#/sandbox/cena/')) return <Scene />;
  if (hash.startsWith('#/sandbox')) return <Sandbox />;
  return <App />;
}

export function mountApp() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <TooltipProvider>
        <Suspense>
          <Page />
        </Suspense>
      </TooltipProvider>
    </StrictMode>,
  );
}
