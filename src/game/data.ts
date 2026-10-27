// Dados do jogo: goblins, reis e rainhas, itens, Caos e monstros.

// um goblin é um número: (território << 5) | valor
export type Gob = number;
export interface Monster {
  v: number;
  ts: number[];
  fx: MonsterFx | null;
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
export const TR = [
  0,
  CH | CN | VE,
  OC | CN | MA,
  CH | BA | OC,
  OC | CN | VE,
  CH | BA | CN,
  BA | MA | VE,
  CH | OC | MA,
  BA | OC | VE,
  BA | CN | MA,
  CH | MA | VE,
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
type LendKey = 'par' | 'impar' | 'baixo' | 'alto';
export interface King {
  name: string;
  short: string;
  tr: number;
  lend: LendKey;
  text: string;
}
export const KINGS: King[] = [
  {
    name: 'Rei Quebra-Crânio',
    short: 'Fúria',
    tr: CH | BA,
    lend: 'par',
    text: 'Fúria: ao vencer por aproximação, elimina 2 cartas em vez de 1; ao cravar, além de roubar, elimina 1 carta.',
  },
  {
    name: 'Rainha Musgo-Podre',
    short: 'Brotar',
    tr: VE | MA,
    lend: 'baixo',
    text: 'Brotar: no início da rodada, se você tiver menos cartas que todos os rivais, o jogador à sua direita escolhe 1 carta do seu cemitério e ela volta para a sua mão.',
  },
  {
    name: 'Rei Olho-de-Vidro',
    short: 'Lente de Vidro',
    tr: OC | CN,
    lend: 'impar',
    text: 'Lente de Vidro: quando o monstro for do território Azul, sua margem é ±2, jogando qualquer goblin.',
  },
  {
    name: 'Rainha Dente-de-Ouro',
    short: 'Mercadora',
    tr: CH | VE,
    lend: 'alto',
    text: 'Mercadora: sempre que compra um item, compra 2 e fica com o melhor.',
  },
];
export const LEND: Record<LendKey, [string, (v: number) => boolean]> = {
  par: ['goblins pares', (v) => v % 2 === 0],
  impar: ['goblins ímpares', (v) => v % 2 === 1],
  baixo: ['goblins de 1 a 10', (v) => v <= 10],
  alto: ['goblins de 11 a 20', (v) => v >= 11],
};
export const lendTxt = (k: number) => LEND[KINGS[k].lend][0];

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
  PORRETE: ['Porrete', '+2 na sua soma.', 'A', 2],
  PE_CABRA: ['Pé de Cabra', '−2 na sua soma.', 'A', 2],
  AJUSTE: ['Ajuste Fino', 'De −3 a +3 na sua soma, à sua escolha.', 'A', 1],
  ESCUDO: ['Escudo de Panela', 'Nesta rodada ninguém rouba nem elimina cartas suas.', 'A', 2],
  AMULETO: ['Amuleto', 'Se você perder nesta rodada, não descarta nada.', 'A', 2],
  OCULOS: ['Monóculo Polido', 'Cada goblin de Monóculo jogado vale até +2.', 'A', 1],
  CHAPEU: ['Chapéu Pontudo', 'Cada goblin de Chapéu jogado vale até ±2.', 'A', 2],
  POCAO: ['Poção Maluca', 'Um goblin Maluco jogado vale o dobro ou a metade.', 'A', 1],
  POMADA: ['Pomada de Pereba', 'Se jogou goblin com Pereba: de −3 a +3 na sua soma.', 'A', 2],
  CHINELO: [
    'Fuga Fedorenta',
    'Se você perder nesta rodada, um goblin Fedorento jogado, à sua escolha, volta para a mão.',
    'A',
    1,
  ],
  NAO: [
    'NÃO!',
    'Cancele um item de Monstro Acordado ou uma Armadilha de qualquer jogador. Pode ser respondido com outro NÃO!. O jogo pergunta na hora.',
    'A',
    3,
  ],
  ARMADILHA: [
    'Armadilha',
    'Reação: quando alguém roubar ou eliminar uma carta da sua mão, revele esta carta: quem atacou perde 1 carta (o jogador à direita dele escolhe qual, às cegas). O jogo pergunta na hora.',
    'A',
    2,
  ],
  GRITO: ['Grito de Guerra', 'O monstro vale +2 ou −2 para todos, à sua escolha.', 'A', 1],
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
  'OCULOS',
  'CHAPEU',
  'POCAO',
  'POMADA',
];
export const ARMS: ItemKey[] = ['ESCUDO', 'AMULETO', 'CHINELO'];
// reações: não têm botão, o jogo pergunta na hora
export const REACT: ItemKey[] = ['NAO', 'ARMADILHA'];
// o item que dá efeito a cada característica
export const TRAIT_ITEM: Partial<Record<number, ItemKey>> = {
  [CH]: 'CHAPEU',
  [BA]: 'CICATRIZ',
  [OC]: 'OCULOS',
  [CN]: 'CHINELO',
  [MA]: 'POCAO',
  [VE]: 'POMADA',
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
  OCULOS: 4,
  CHAPEU: 5,
  POCAO: 4,
  POMADA: 5,
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
    'Dois monstros: um baixo (até 24) e um alto (26 ou mais). Vale o mais perto da sua soma. Acertar um deles conta como aproximação: elimina 1 carta, não rouba.',
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
  ANAO: ['Monstro Anão', 'O monstro vale −6.', 2],
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
    'Na revelação vira um segundo monstro: se for par, o monstro vale +5; se for ímpar, −5.',
    2,
  ],
  MALDICAO: [
    'Maldição',
    'Uma característica sorteada vale 0. Reis e rainhas com ela ficam desligados.',
    2,
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
    2,
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
export const chaosTitle = (k: string, curse?: number) =>
  !chaosOf(k)
    ? 'Caos antigo'
    : k === 'MALDICAO' && curse
      ? `Maldição: ${TNAME[curse]}`
      : chaosOf(k)![0];
export const chaosDesc = (k: string, curse?: number) =>
  !chaosOf(k)
    ? 'Carta da versão anterior, sem efeito.'
    : k === 'MALDICAO' && curse
      ? `Goblins com ${TNAME[curse]} valem 0. Reis e rainhas com ${TNAME[curse]} ficam desligados.`
      : chaosOf(k)![1];
// monstros com efeito: [nome, texto]
export const MFX = {
  FRACOS: [
    'Amigo dos Fracos',
    'Quando derrotado, quem compra o item é o jogador com menos itens na mão (empate: todos os empatados compram).',
  ],
} satisfies Record<string, [name: string, text: string]>;
export type MonsterFx = keyof typeof MFX;
// o Necromante tem ícone próprio; o resto do Caos usa o raio
export const chaosIc = (k: string) => (k === 'NECRO' ? 'skull' : 'bolt');
export function makeMonsters() {
  const out: Monster[] = [];
  for (let v = 10; v <= 40; v++) {
    const t1 = (v - 10) % 4,
      ts = [t1];
    if (v % 3 === 1) ts.push((t1 + 1 + (v % 2)) % 4);
    out.push({ v, ts, fx: v % 5 === 0 ? 'FRACOS' : null });
  }
  return out;
}
