// Dados do jogo: goblins, reis e rainhas, itens, Caos e monstros.

// um goblin é um número: (território << 5) | valor
export type Gob = number;
export interface Monster {
  v: number;
  ts: number[];
  fx: MonsterFx | null;
  // passiva (bit da característica): goblins com ela valem 0 e reis com ela ficam desligados.
  // Só vale depois que o monstro acorda (antes, só quem usou a Luneta sabe)
  curse?: number;
}

export const rnd = (n: number) => Math.floor(Math.random() * n),
  pick = <T>(a: readonly T[]): T => a[rnd(a.length)];
export function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export const CH = 1,
  BA = 2,
  OC = 4,
  CN = 8,
  MA = 16,
  VE = 32,
  TRAITS: readonly number[] = [1, 2, 4, 8, 16, 32];
export const TNAME: Record<number, string> = {
  1: 'Chapéu',
  2: 'Cicatriz',
  4: 'Monóculo',
  8: 'Fedorento',
  16: 'Maluco',
  32: 'Pereba',
};
export const TICO: Record<number, string> = {
  1: 'hat',
  2: 'scar',
  4: 'monocle',
  8: 'stink',
  16: 'spiral',
  32: 'sore',
};
// características impressas: 2 por goblin (sem a herdada do rei ou rainha)
export const TR = [
  0,
  CN | MA,
  OC | MA,
  CH | OC,
  OC | CN,
  CH | MA,
  BA | VE,
  CH | BA,
  CN | VE,
  BA | CN,
  CH | VE,
];
for (let v = 11; v <= 20; v++) TR[v] = TR[21 - v];
export const gv = (g: Gob) => g & 31,
  gc = (g: Gob) => g >> 5,
  mk = (c: number, v: number): Gob => (c << 5) | v;
export const CLAN = ['Vermelho', 'Verde', 'Azul', 'Amarelo'];
export const traitNames = (t: number) =>
  TRAITS.filter((x) => t & x)
    .map((x) => TNAME[x])
    .join(' · ');
export interface King {
  name: string;
  short: string;
  tr: number; // a característica do rei ou rainha, herdada pelos goblins `heirs` da sua cor
  heirs: [lo: number, hi: number];
  text: string;
}
export const KINGS: King[] = [
  {
    name: 'Rei Quebra-Crânio',
    short: 'Fúria',
    tr: BA,
    heirs: [1, 5],
    text: 'Fúria: ao vencer por aproximação, elimina 2 cartas em vez de 1; ao cravar, além de roubar, elimina 1 carta.',
  },
  {
    name: 'Rainha Musgo-Podre',
    short: 'Brotar',
    tr: MA,
    heirs: [11, 15],
    text: 'Brotar: no início da rodada, se você tiver menos cartas que todos os rivais, o jogador à sua direita escolhe 1 carta do seu cemitério e ela volta para a sua mão.',
  },
  {
    name: 'Rei Olho-de-Vidro',
    short: 'Lente de Vidro',
    tr: OC,
    heirs: [6, 10],
    text: 'Lente de Vidro: sua margem é sempre ±1, com qualquer goblin; quando o monstro for do território Azul, é ±2.',
  },
  {
    name: 'Rainha Dente-de-Ouro',
    short: 'Mercadora',
    tr: VE,
    heirs: [16, 20],
    text: 'Mercadora: sempre que compra um item, compra 2 e fica com o melhor.',
  },
];
export const heirsTxt = (k: number) =>
  `goblins ${KINGS[k].heirs[0]} a ${KINGS[k].heirs[1]} ${['Vermelhos', 'Verdes', 'Azuis', 'Amarelos'][k]}`;
// a característica que o goblin herda do rei ou rainha da sua cor (fixa na carta, vale em qualquer mão)
export const crownOf = (g: Gob) => {
  const k = KINGS[gc(g)],
    v = gv(g);
  return v >= k.heirs[0] && v <= k.heirs[1] ? k.tr : 0;
};
// tudo o que está na carta: as 2 impressas e a herdada
export const cardTraits = (g: Gob) => TR[gv(g)] | crownOf(g);

// [nome, texto, quando usa (D = monstro dormindo, A = acordado), cópias no monte]
type ItemDef = [name: string, text: string, when: 'D' | 'A', copies: number];
export const ITEMS = {
  LUNETA: ['Luneta', 'Espie o valor do monstro.', 'D', 2],
  SACRIFICIO: [
    'Sacrifício',
    'Mande 1 goblin seu para o seu cemitério e pegue, às cegas, 1 carta da mão de um oponente.',
    'D',
    2,
  ],
  COROA: ['Coroa Trocada', 'Troque o seu rei ou rainha com o de outro jogador.', 'D', 2],
  PA: ['Pá de Coveiro', 'Puxe 1 carta à sua escolha do seu cemitério.', 'D', 2],
  CICATRIZ: [
    'Cicatrizes Compartilhadas',
    'Mande 1 goblin com Cicatriz da sua mão para o seu cemitério. Depois pegue, à sua escolha, 1 goblin com Cicatriz de qualquer cemitério.',
    'D',
    2,
  ],
  LADRAO: [
    'Ladrão de Túmulos',
    'Embaralhe o cemitério de outro jogador virado para baixo e puxe 1 carta às cegas.',
    'D',
    2,
  ],
  MAO_LEVE: ['Mão Leve', 'Roube, às cegas, 1 item da mão de um oponente.', 'D', 2],
  ISCA: [
    'Isca de Monstro',
    'Depois que o monstro acorda, troque-o pelo próximo do monte. O Caos da rodada continua valendo para o novo monstro.',
    'A',
    2,
  ],
  BANDEIRA: [
    'Bandeira',
    'Escolha um território: para você, o monstro também é desse território nesta rodada.',
    'D',
    2,
  ],
  DISFARCE: [
    'Disfarce',
    'Escolha uma característica: todos os goblins que você jogar nesta rodada a têm.',
    'D',
    2,
  ],
  TAMBOR: ['Tambor de Guerra', 'Nesta rodada você pode jogar até 4 goblins.', 'D', 2],
  SACO: ['Saco de Moedas', 'Compre 2 itens agora.', 'D', 2],
  PORRETE: ['Porrete', '+2 na sua soma.', 'A', 3],
  PE_CABRA: ['Pé de Cabra', '−2 na sua soma.', 'A', 3],
  AJUSTE: ['Ajuste Fino', 'De −3 a +3 na sua soma, à sua escolha.', 'A', 2],
  ESCUDO: ['Escudo de Panela', 'Nesta rodada ninguém rouba nem elimina cartas suas.', 'A', 2],
  AMULETO: ['Amuleto', 'Se você perder nesta rodada, não descarta nada.', 'A', 2],
  CHAPEU: ['Chapéu Pontudo', 'Se jogou goblin de Chapéu: até +2 na sua soma.', 'A', 2],
  OCULOS: ['Monóculo Polido', '+1 na sua soma para cada goblin de Monóculo jogado.', 'A', 2],
  NARIZ: ['Nariz de Ferro', 'Se jogou goblin Fedorento: até +3 na sua soma.', 'A', 2],
  POMADA: ['Pomada de Pereba', 'Se jogou goblin com Pereba: até −2 na sua soma.', 'A', 2],
  POCAO: ['Poção Maluca', '−1 na sua soma para cada goblin Maluco jogado.', 'A', 2],
  MACHUCADO: ['Machucado', 'Se jogou goblin com Cicatriz: até −3 na sua soma.', 'A', 2],
  CHINELO: [
    'Fuga Fedorenta',
    'Se você perder nesta rodada, um goblin Fedorento jogado, à sua escolha, volta para a mão.',
    'A',
    2,
  ],
  NAO: [
    'NÃO!',
    'Cancele um item de Monstro Acordado ou uma Armadilha de qualquer jogador. Pode ser respondido com outro NÃO!. O jogo pergunta na hora.',
    'A',
    4,
  ],
  ARMADILHA: [
    'Armadilha',
    'Reação: quando alguém roubar ou eliminar uma carta da sua mão, revele esta carta: quem atacou perde 1 carta (o jogador à direita dele escolhe qual, às cegas). O jogo pergunta na hora.',
    'A',
    2,
  ],
  GRITO: ['Grito de Guerra', 'O monstro vale +2 ou −2 para todos, à sua escolha.', 'A', 2],
  MAPA: [
    'Mapa do Tesouro',
    'Olhe o monte de itens, escolha 1 carta e fique com ela. Depois embaralhe o monte.',
    'D',
    2,
  ],
  PROFECIA: [
    'Profecia do Caos',
    'Olhe o monte de Caos e escolha a carta da próxima rodada. Embaralhe o resto e coloque a escolhida no topo.',
    'D',
    2,
  ],
} satisfies Record<string, ItemDef>;
export type ItemKey = keyof typeof ITEMS;
export const NUMERIC: ItemKey[] = [
  'PORRETE',
  'PE_CABRA',
  'AJUSTE',
  'CHAPEU',
  'OCULOS',
  'NARIZ',
  'POMADA',
  'POCAO',
  'MACHUCADO',
];
export const ARMS: ItemKey[] = ['ESCUDO', 'AMULETO', 'CHINELO'];
// reações: não têm botão, o jogo pergunta na hora
export const REACT: ItemKey[] = ['NAO', 'ARMADILHA'];
// os itens que dão efeito a cada característica
export const TRAIT_ITEM: Partial<Record<number, ItemKey[]>> = {
  [CH]: ['CHAPEU'],
  [BA]: ['MACHUCADO', 'CICATRIZ'],
  [OC]: ['OCULOS'],
  [CN]: ['CHINELO', 'NARIZ'],
  [MA]: ['POCAO'],
  [VE]: ['POMADA'],
};
export const PRIO: Record<ItemKey, number> = {
  MAPA: 7,
  PROFECIA: 4,
  NAO: 9,
  SACRIFICIO: 8,
  LUNETA: 8,
  PORRETE: 7,
  PE_CABRA: 7,
  AJUSTE: 8,
  ESCUDO: 7,
  AMULETO: 7,
  PA: 6,
  CICATRIZ: 6,
  LADRAO: 6,
  COROA: 5,
  GRITO: 6,
  TAMBOR: 5,
  BANDEIRA: 5,
  ARMADILHA: 5,
  CHAPEU: 6,
  OCULOS: 6,
  NARIZ: 6,
  POMADA: 6,
  POCAO: 6,
  MACHUCADO: 6,
  CHINELO: 3,
  MAO_LEVE: 4,
  ISCA: 3,
  DISFARCE: 3,
  SACO: 9,
};
// [nome, texto, cópias no monte]
type ChaosDef = [name: string, text: string, copies: number];
export const CHAOS = {
  ZONA: ['Zona Proibida', 'Somas de 20 a 30 perdem automaticamente.', 2],
  OPOSTOS: [
    'Monstros Opostos',
    'Puxe 2 monstros do topo do monte, virados para baixo. Na revelação, vale o mais perto da sua soma. Acertar em cheio rouba 1 carta (em vez de 2) e compra 1 item.',
    3,
  ],
  INVERSO: ['Mundo Invertido', 'Vence quem ficar mais longe do monstro. Ninguém crava.', 2],
  MENOR: [
    'Corrida dos Pequenos',
    'O monstro é ignorado: vence a menor soma. Todos jogam pelo menos 2 goblins (se tiverem). Ninguém crava.',
    2,
  ],
  MAIOR: ['Corrida dos Grandes', 'O monstro é ignorado: vence a maior soma. Ninguém crava.', 2],
  GIGANTE: ['Monstro Gigante', 'O monstro vale +10.', 2],
  ANAO: ['Monstro Anão', 'O monstro vale −6 (mínimo 1).', 2],
  CEGAS: [
    'Às Cegas',
    'Depois que todos jogam, o jogador à sua direita escolhe, às cegas, 1 dos seus goblins jogados e troca por 1 carta da sua mão.',
    3,
  ],
  ROLETA: [
    'Roleta',
    'Depois que todos jogam, cada um puxa às cegas 1 carta da mão do jogador à sua direita e soma ao seu palpite. No fim da rodada a carta volta para o dono.',
    2,
  ],
  MUTANTE: [
    'Monstro Mutante',
    'Na revelação, vire a carta do topo do monte de monstros. Se o número dela for par, o monstro da rodada vale +5; se for ímpar, vale −5. O efeito, a passiva e o território dela não valem. No fim da rodada, ela volta ao monte, que é embaralhado.',
    3,
  ],
  TROCA: [
    'Troca-Troca',
    'No início da rodada, todos passam a mão inteira para o jogador da esquerda.',
    2,
  ],
  ABERTO: [
    'Palpite Aberto',
    'Cada um joga na ordem, a partir do Chefe da Toca, vendo os palpites de quem jogou antes.',
    2,
  ],
  IGUAIS: ['Somas Iguais se Anulam', 'Jogadores com a mesma soma perdem todos.', 3],
  CACA: [
    'Caça ao Líder',
    'Quem tem mais cartas no início da rodada não pode vencer por aproximação; só se cravar.',
    2,
  ],
  DUELO: [
    'Duelo',
    'O Chefe da Toca escolhe dois jogadores para disputar; os outros não jogam. O vencedor rouba 1 carta do perdedor e compra 1 item.',
    2,
  ],
  PEDAGIO: [
    'Pedágio',
    'Antes de jogar, cada um escolhe 1 carta da mão para dar ao jogador da esquerda.',
    2,
  ],
  BANQUETE: [
    'Banquete',
    'As cartas que os perdedores descartariam vão para a mão dos vencedores.',
    2,
  ],
  IMA: ['Ímã', 'Somas de 20 a 30 contam como se estivessem 5 mais longe do monstro.', 3],
  VIZINHO: [
    'Soma do Vizinho',
    'Sua soma ganha metade da soma do jogador à sua esquerda (arredondando para baixo).',
    2,
  ],
  MINMAX: [
    'Mínimo Máximo',
    'Os valores dos goblins se invertem: 1 vale 20, 2 vale 19, 3 vale 18 … 20 vale 1.',
    3,
  ],
  FEIRA: ['Feira dos Goblins', 'No fim desta rodada, todos os jogadores compram 1 item.', 2],
  NECRO: [
    'Necromante',
    'Coloque seu cemitério na sua mão: nesta rodada você joga só com essas cartas. Quem vencer fica com as cartas que jogou; o resto volta para o cemitério. Quem não tem cemitério joga com a própria mão.',
    2,
  ],
} satisfies Record<string, ChaosDef>;
export type ChaosKey = keyof typeof CHAOS;
// estados salvos por versões antigas podem trazer cartas de Caos que não existem mais
const chaosOf = (k: string): ChaosDef | undefined => (CHAOS as Record<string, ChaosDef>)[k];
export const chaosTitle = (k: string) => (chaosOf(k) ? chaosOf(k)![0] : 'Caos antigo');
export const chaosDesc = (k: string) =>
  chaosOf(k) ? chaosOf(k)![1] : 'Carta da versão anterior, sem efeito.';
// monstros com efeito: [nome, texto]
export const MFX = {
  FRACOS: [
    'Amigo dos Fracos',
    'Quando derrotado, quem compra o item é o jogador com menos itens na mão (empate: todos os empatados compram).',
  ],
  VINGANCA: [
    'Vingança do Cemitério',
    'Quando acorda, quem tem o maior cemitério compra 1 item (empate: todos os empatados compram).',
  ],
  AZARAO: [
    'Cravada do Azarão',
    'Quem cravar tendo a menor mão da mesa (no início da rodada) rouba 4 cartas em vez de 2. Não vale se todos tinham o mesmo número de cartas.',
  ],
} satisfies Record<string, [name: string, text: string]>;
export type MonsterFx = keyof typeof MFX;
// o Necromante tem ícone próprio; o resto do Caos usa o raio
export const chaosIc = (k: string) => (k === 'NECRO' ? 'skull' : 'bolt');
// efeito e passiva impressos em cada monstro (o Amigo dos Fracos é dos múltiplos de 5)
export const MON_FX: Partial<Record<number, MonsterFx>> = {
  13: 'AZARAO',
  18: 'AZARAO',
  21: 'AZARAO',
  32: 'AZARAO',
  17: 'VINGANCA',
  26: 'VINGANCA',
  31: 'VINGANCA',
  38: 'VINGANCA',
};
export const MON_CURSE: Partial<Record<number, number>> = {
  11: CH,
  16: BA,
  22: OC,
  27: CN,
  33: MA,
  37: VE,
};
export const curseTxt = (t: number) =>
  `Goblins com ${TNAME[t]} valem 0. Reis e rainhas com ${TNAME[t]} ficam desligados (sem habilidade).`;
export function makeMonsters() {
  const out: Monster[] = [];
  for (let v = 10; v <= 40; v++) {
    const t1 = (v - 10) % 4,
      ts = [t1];
    if (v % 3 === 1) ts.push((t1 + 1 + (v % 2)) % 4);
    out.push({
      v,
      ts,
      fx: v % 5 === 0 ? 'FRACOS' : MON_FX[v] || null,
      curse: MON_CURSE[v] || 0,
    });
  }
  return out;
}
