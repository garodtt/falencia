import { useState } from 'react';
import { createTable } from '../../../net/online.ts';
import { resetTips } from '../../store.ts';
import { joinWithTips } from './join.ts';

// criar uma mesa, ou entrar numa pelo código de 5 letras
export function JoinByCode() {
  const [code, setCode] = useState('');
  return (
    <div className="row">
      <button
        id="btnCreate"
        onClick={() => {
          resetTips();
          void createTable();
        }}
      >
        Criar mesa
      </button>
      <span className="muted">ou entre com um código</span>
      <input
        id="codeIn"
        maxLength={5}
        placeholder="CÓDIGO"
        aria-label="Código da mesa"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button className="ghost" id="btnJoin" onClick={() => joinWithTips(code)}>
        Entrar
      </button>
    </div>
  );
}
