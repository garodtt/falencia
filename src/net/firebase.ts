// Adaptador do Firebase Realtime Database com uma interface no estilo documento/coleção,
// que é o que online.js usa. Sem config válida, fb fica null e o jogo funciona só contra bots.
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

type Snap = firebase.database.DataSnapshot;
// o que é gravado: a mesa (com status/uids) ou uma ação de jogador
type DocData = { status?: string; updatedAt?: number; uids?: string[]; code?: string };
// leituras devolvem JSON cru do banco (any); quem lê diz o tipo
export interface Doc {
  id?: string;
  exists: boolean;
  data: () => any;
}

// vem do .env (veja .env.example)
const env = import.meta.env,
  CFG = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: env.VITE_FIREBASE_DATABASE_URL,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  };

function connect() {
  if (!CFG || !/firebaseio\.com|firebasedatabase\.app/.test(CFG.databaseURL || '')) return null;
  let rt: firebase.database.Database;
  try {
    firebase.initializeApp(CFG);
    rt = firebase.database();
  } catch (e) {
    console.warn('Firebase não iniciou', e);
    return null;
  }
  const key = (p: string) => String(p).replace(/[.#$[\]/]/g, '_');
  const ls = {
    get(k: string) {
      try {
        return localStorage.getItem(k);
      } catch (e) {
        return null;
      }
    },
    set(k: string, v: string) {
      try {
        localStorage.setItem(k, v);
      } catch (e) {}
    },
  };
  let uid = ls.get('fg_uid');
  if (!uid) {
    uid = 'u' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    ls.set('fg_uid', uid);
  }
  // caminhos: games/X -> g/X · games/X/acts -> a/X · games/X/acts/U -> a/X/U
  function map(path: string) {
    const s = path.split('/');
    if (s[0] !== 'games') throw new Error('caminho ' + path);
    if (s.length === 1) return 'g';
    if (s.length === 2) return 'g/' + key(s[1]);
    if (s[2] === 'acts') return 'a/' + key(s[1]) + (s[3] ? '/' + key(s[3]) : '');
    throw new Error('caminho ' + path);
  }
  const unpack = (v: any): any => (v && typeof v.j === 'string' ? JSON.parse(v.j) : v);
  const lastStatus: Record<string, string> = {};
  function doc(path: string) {
    const isGame = path.split('/').length === 2,
      r = rt.ref(map(path));
    return {
      id: path.split('/').pop(),
      set: async (data: object) => {
        const d = data as DocData;
        await r.set(
          isGame
            ? { j: JSON.stringify(d), s: d.status || '', t: d.updatedAt || Date.now() }
            : { j: JSON.stringify(d) },
        );
        if (isGame && Array.isArray(d.uids)) {
          const sig = d.status + '|' + d.uids.join(',');
          if (lastStatus[d.code!] !== sig) {
            lastStatus[d.code!] = sig;
            const up: Record<string, string> = {};
            d.uids.forEach((u) => {
              up['m/' + key(u) + '/' + key(d.code!)] = d.status || '';
            });
            rt.ref()
              .update(up)
              .catch(() => {});
          }
        }
      },
      get: async () => {
        const s = await r.get();
        return { exists: s.exists(), data: () => unpack(s.val()) };
      },
      onSnapshot: (next: (d: Doc) => void, err?: (e: Error) => void) => {
        const cb = (s: Snap) => next({ exists: s.exists(), data: () => unpack(s.val()) });
        r.on('value', cb, (e: Error) => err && err(e));
        return () => r.off('value', cb);
      },
    };
  }
  type Query = { docs: Doc[]; size: number; empty: boolean };
  function col(
    path: string,
    filters?: [string, string, string][],
  ): {
    doc: (id: string) => ReturnType<typeof doc>;
    where: (f: string, op: string, v: string) => ReturnType<typeof col>;
    onSnapshot: (next: (q: Query) => void, err?: (e: Error) => void) => () => void;
  } {
    filters = filters || [];
    return {
      doc: (id) => doc(path + '/' + id),
      where: (f, op, v) => col(path, filters!.concat([[f, op, v]])),
      onSnapshot: (next, err) => {
        const base = map(path),
          emit = (docs: Doc[]) => next({ docs, size: docs.length, empty: !docs.length });
        const toDocs = (s: Snap) => {
          const out: Doc[] = [];
          s.forEach((c) => {
            const v = unpack(c.val());
            out.push({ id: c.key, exists: true, data: () => v });
          });
          return out;
        };
        if (base === 'g') {
          const f = filters![0];
          if (f && f[0] === 'status' && f[1] === '==') {
            const q = rt.ref('g').orderByChild('s').equalTo(f[2]),
              cb = (s: Snap) => emit(toDocs(s));
            q.on('value', cb, (e: Error) => err && err(e));
            return () => q.off('value', cb);
          }
          if (f && f[0] === 'uids' && f[1] === 'array-contains') {
            const r = rt.ref('m/' + key(f[2]));
            let alive = true;
            const cb = async (s: Snap) => {
              const codes = Object.keys(s.val() || {}).filter((c) => (s.val() || {})[c] !== 'over'),
                docs: Doc[] = [];
              for (const c of codes) {
                try {
                  const g = await rt.ref('g/' + c).get();
                  if (g.exists()) {
                    const v = unpack(g.val());
                    docs.push({ id: c, exists: true, data: () => v });
                  }
                } catch (e) {}
              }
              if (alive) emit(docs);
            };
            r.on('value', cb, (e: Error) => err && err(e));
            return () => {
              alive = false;
              r.off('value', cb);
            };
          }
          return () => {};
        }
        const r = rt.ref(base),
          cb = (s: Snap) => emit(toDocs(s));
        r.on('value', cb, (e: Error) => err && err(e));
        return () => r.off('value', cb);
      },
    };
  }
  const db = { doc, collection: (p: string) => col(p) };
  const user = {
    id: async () => uid,
    can: async (_perm?: string) => true,
    profiles: async (ids: string[]) => {
      const out: Record<string, { id: string; name: string }> = {};
      await Promise.all(
        ([] as string[]).concat(ids).map(async (i) => {
          try {
            const s = await rt.ref('n/' + key(i)).get();
            out[i] = { id: i, name: s.val() || '' };
          } catch (e) {
            out[i] = { id: i, name: '' };
          }
        }),
      );
      return out;
    },
  };
  const getName = () => ls.get('fg_name') || '';
  const setName = (n: string) => {
    n = String(n || '')
      .trim()
      .slice(0, 20);
    ls.set('fg_name', n);
    if (n)
      rt.ref('n/' + key(uid))
        .set(n)
        .catch(() => {});
    return n;
  };
  return { db, user, getName, setName };
}

export const fb = connect();
export type Fb = NonNullable<typeof fb>;
