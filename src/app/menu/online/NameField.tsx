import { G, NET } from '../../../game/state.ts';
import { fb } from '../../../net/firebase.ts';
import { render } from '../../render.ts';
import { INPUT } from '../../components/variants.ts';

// salva ao sair do campo ou dar Enter (não a cada tecla): cada salvamento grava no banco
function save(el: HTMLInputElement) {
  if (!fb || el.value === fb.getName()) return;
  const n = fb.setName(el.value);
  if (NET.uid) NET.names[NET.uid] = n;
  if (G) render();
}

// "Seu nome" (só aparece com o online ligado); começa com o nome salvo (initNet)
export function NameField() {
  if (!NET.db) return null;
  return (
    <div className="flex flex-wrap items-center gap-2.5" id="nameRow">
      <span className="text-muted">Seu nome</span>
      <input
        id="nameIn"
        className={`w-60 text-md ${INPUT}`}
        defaultValue={(NET.uid && NET.names[NET.uid]) || ''}
        onBlur={(e) => save(e.currentTarget)}
        onKeyDown={(e) => e.key === 'Enter' && save(e.currentTarget)}
        maxLength={20}
        placeholder="Como os amigos vão te ver"
        aria-label="Seu nome"
      />
    </div>
  );
}
