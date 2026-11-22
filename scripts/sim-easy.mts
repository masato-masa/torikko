// やさしいモード（CPU がときどき最善でない手を打つ）の測定。人のタイプ別に、全面での勝率を ふつう／やさしい で比べる。
//   node --experimental-strip-types scripts/sim-easy.mts
import { EASY_MISTAKE, bestSide, cpuSide, hash01, initial, isOver, take, type Side, type State } from '../src/engine.ts';
import data from '../src/levels.json' with { type: 'json' };

const LEVELS = data.flatMap((w) => w.levels);
type Player = (s: State, rnd: () => number) => Side;
const players: Record<string, Player> = {
  '最善を打つ人': (s) => bestSide(s),
  '大きい端を取る人': (s) => (s.cards[s.r]! > s.cards[s.l]! ? 1 : 0),
  'でたらめな人': (_s, rnd) => (rnd() < 0.5 ? 0 : 1),
  '8 割が最善・2 割が大きい端の人': (s, rnd) => (rnd() < 0.8 ? bestSide(s) : s.cards[s.r]! > s.cards[s.l]! ? 1 : 0),
};
const play = (cards: number[], id: string, player: Player, easy: boolean, rnd: () => number): number => {
  let s = initial(cards);
  while (!isOver(s)) {
    if (s.turn === 0) s = take(s, player(s, rnd));
    else s = take(s, cpuSide(s, easy, `${id}:${s.l}:${s.r}`));
  }
  return s.score[0] - s.score[1];
};
console.log(`CPU の間違いの確率 ${EASY_MISTAKE}（最善と大きい端が違う手のとき）、${LEVELS.length} 面`);
console.log('人のタイプ'.padEnd(28), 'ふつう 勝率', 'やさしい 勝率');
let seed = 1;
const rnd = (): number => hash01(`r${seed++}`);
for (const [name, p] of Object.entries(players)) {
  const row: number[] = [];
  for (const easy of [false, true]) {
    let win = 0;
    let n = 0;
    for (const l of LEVELS) {
      const trials = name === 'でたらめな人' || name.startsWith('8 割') ? 400 : 1;
      for (let t = 0; t < trials; t++) {
        n++;
        if (play(l.cards, l.id, p, easy, rnd) > 0) win++;
      }
    }
    row.push((win / n) * 100);
  }
  console.log(name.padEnd(28), `${row[0]!.toFixed(1)}%`.padStart(8), `${row[1]!.toFixed(1)}%`.padStart(10));
}
