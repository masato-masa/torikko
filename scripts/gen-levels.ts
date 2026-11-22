// 面を「手筋を先に決めて」探す。ワールドごとの手筋（SPEC）を満たす並びだけを、スロット番号をシードにした
// 決定的な乱数で探し、ソルバー（最善手の表）で「勝てる最初の 1 手が唯一」を確かめて src/levels.json に書く。
//   node --experimental-strip-types scripts/gen-levels.ts
import { writeFileSync } from 'node:fs';
import { greedyMargin, optimalMargin, sideValues, initial } from '../src/engine.ts';

const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return (): number => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

interface Spec {
  name: string;
  trick: string;
  n: number[];
  lo: number;
  hi: number;
  /** 最善の得点差の範囲 */
  margin: [number, number];
  /** マイナスのカードの枚数 */
  negatives: [number, number];
  /** 「大きい端を取り続ける」が最善より何点以上悪いか */
  greedyGap: number;
  /** 同じ数が隣り合って並ぶ組が 1 つ以上ある */
  adjacentEqual?: boolean;
  /** 両端のカードが同じ数（どちらを取っても今は同点。取ったあとに残る列で決まる） */
  endsEqual?: boolean;
}

const SPEC: Spec[] = [
  { name: 'はしの えらび', trick: '大きい方の端を取るのが正解とは限らない。取ったあと相手に何が残るかを読む', n: [6, 6, 7, 7], lo: 1, hi: 9, margin: [1, 4], negatives: [0, 0], greedyGap: 3 },
  { name: 'マイナスの わな', trick: 'マイナスのカードを相手に取らせる。端に出てきたら、押しつける順番を読む', n: [7, 7, 8, 8], lo: -6, hi: 9, margin: [2, 6], negatives: [2, 3], greedyGap: 4 },
  { name: 'ながい よみ', trick: '10 枚前後。3 手先より深く読まないと、唯一の勝ち筋を外す', n: [9, 9, 10, 10], lo: -6, hi: 9, margin: [2, 7], negatives: [2, 3], greedyGap: 5 },
  { name: 'ならぶ おなじ かず', trick: '同じ数が並ぶ。どちらの端を取っても同じに見えるが、残りの形が変わる。偶数枚と奇数枚で、最初の端の選びかたが変わる', n: [8, 9, 10, 11], lo: -5, hi: 9, margin: [1, 6], negatives: [2, 4], greedyGap: 3, adjacentEqual: true },
  { name: 'おなじ はし', trick: '両端のカードが同じ数。どちらを取っても今は同点なので、取ったあとに残る列を比べて選ぶ', n: [7, 8, 9, 10], lo: -5, hi: 9, margin: [1, 6], negatives: [1, 3], greedyGap: 2, endsEqual: true },
];

interface Found {
  cards: number[];
  best: number;
}

function find(spec: Spec, slot: number, n: number): Found | null {
  const rnd = mulberry32(0x51ed270b ^ (slot * 104729));
  for (let attempt = 0; attempt < 400000; attempt++) {
    const cards: number[] = [];
    let neg = 0;
    for (let i = 0; i < n; i++) {
      let v = spec.lo + Math.floor(rnd() * (spec.hi - spec.lo + 1));
      if (v === 0) v = 1;
      if (v < 0) neg++;
      cards.push(v);
    }
    if (spec.endsEqual) {
      cards[n - 1] = cards[0]!;
      neg = cards.filter((v) => v < 0).length;
    }
    if (neg < spec.negatives[0] || neg > spec.negatives[1]) continue;
    const best = optimalMargin(cards);
    if (best < spec.margin[0] || best > spec.margin[1]) continue;
    // 勝てる最初の 1 手が唯一: 片方は最善（best）、もう片方は負ける
    const [up, down] = sideValues(initial(cards));
    const hi = Math.max(up, down);
    const lo = Math.min(up, down);
    if (hi !== best || lo >= 0) continue;
    if (best - greedyMargin(cards) < spec.greedyGap) continue;
    if (spec.adjacentEqual && !cards.some((v, i) => i > 0 && v === cards[i - 1])) continue;
    return { cards, best };
  }
  return null;
}

const out = SPEC.map((w, wi) => ({
  name: w.name,
  trick: w.trick,
  levels: w.n.map((n, li) => {
    const f = find(w, wi * 10 + li + 1, n);
    if (!f) throw new Error(`見つからない: W${wi + 1}-${li + 1}`);
    console.log(`W${wi + 1}-${li + 1} n=${n} 最善の差 ${f.best}`, f.cards.join(','));
    return { id: `${wi + 1}-${li + 1}`, cards: f.cards, best: f.best };
  }),
}));
writeFileSync(new URL('../src/levels.json', import.meta.url), JSON.stringify(out, null, 1));
console.log('書き出した');
