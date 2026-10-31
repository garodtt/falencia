import { NET } from '../../../game/state.ts';
import { Icon } from '../../components/Icon.tsx';
import { JoinByCode } from './JoinByCode.tsx';
import { NameField } from './NameField.tsx';
import { TableList } from './TableList.tsx';

// "Jogar online com amigos" (a lógica das mesas fica em net/online.ts)
export function OnlinePanel() {
  return (
    <div className="grid gap-3 rounded-panel border border-line bg-surface p-4">
      <h3 className="m-0 font-display text-lg font-semibold">
        <Icon name="users" /> Jogar online com amigos
      </h3>
      <NameField />
      <div id="onlineBox">
        {!NET.db ? (
          <p className="m-0 text-muted">
            As mesas online estão desligadas: falta preencher o arquivo .env com a configuração do
            Firebase (veja o .env.example). O jogo contra bots funciona normalmente.
          </p>
        ) : (
          <>
            <JoinByCode />
            {/* mesas em que eu já estou (para voltar) */}
            <TableList
              tables={NET.mine}
              label={(g) =>
                `Voltar para a mesa ${g.code} · ${g.status === 'lobby' ? 'esperando' : 'em jogo'}`
              }
            />
            {/* mesas abertas de outras pessoas */}
            <TableList
              title="Mesas abertas:"
              tables={NET.lobbies.filter((l) => !(l.uids || []).includes(NET.uid!))}
              label={(l) =>
                `Mesa ${l.code} · ${(l.seats || []).length}/${l.n} · de ${NET.names[l.hostUid!] || 'alguém'}`
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
