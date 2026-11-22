// 全面の再検証: 最善の得点差が best と一致・勝てる最初の 1 手が唯一（もう片方は負ける）・「大きい端を取り続ける」では勝てない。
//   npm test
import { greedyMargin, initial, optimalMargin, sideValues } from '../src/engine.ts';
import data from '../src/levels.json' with { type: 'json' };

const ALL = data.flatMap((w) => w.levels);
let ng = 0;
const t0 = Date.now();
for (const l of ALL) {
  const problems: string[] = [];
  const best = optimalMargin(l.cards);
  if (best !== l.best) problems.push(`最善の差が不一致（解いた結果 ${best}、面の値 ${l.best}）`);
  if (best <= 0) problems.push('最善でも勝てない');
  const [up, down] = sideValues(initial(l.cards));
  if (Math.max(up, down) !== best) problems.push('最善の 1 手の値が合わない');
  if (Math.min(up, down) >= 0) problems.push('もう片方の端でも勝てる（唯一の勝ち筋でない）');
  if (greedyMargin(l.cards) > 0) problems.push('大きい端を取り続けるだけで勝てる');
  if (l.cards.includes(0)) problems.push('0 のカードがある');
  if (problems.length) {
    ng++;
    console.log(`NG ${l.id}: ${problems.join(' / ')}`);
  }
}
console.log(`${ALL.length} 面、NG ${ng}（${Date.now() - t0}ms）`);
process.exit(ng ? 1 : 0);
