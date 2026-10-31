import { useState } from 'react';
import { createTable } from '../../../net/online.ts';
import { GHOST, PRIMARY } from '../../components/variants.ts';
import { resetTips } from '../../store.ts';
import { joinWithTips } from './join.ts';

// criar uma mesa, ou entrar numa pelo código de 5 letras
export function JoinByCode() {
  const [code, setCode] = useState('');
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        className={PRIMARY}
        id="btnCreate"
        onClick={() => {
          resetTips();
          void createTable();
        }}
      >
        Criar mesa
      </button>
      <span className="text-muted">ou entre com um código</span>
      <input
        id="codeIn"
        className="w-[130px] rounded-box border border-line bg-surface-2 px-3 py-[9px] text-center font-ui text-base font-bold tracking-[3px] text-text uppercase"
        maxLength={5}
        placeholder="CÓDIGO"
        aria-label="Código da mesa"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button className={GHOST} id="btnJoin" onClick={() => joinWithTips(code)}>
        Entrar
      </button>
    </div>
  );
}
