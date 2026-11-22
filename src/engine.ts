// とりっこ: 数字のカードが 1 列に並ぶ。あなたと CPU が交代で、列の「はしっこ」（上か下）のカードを 1 枚ずつ取る。
// 取ったカードの数字が自分の得点。全部取り終わったとき、得点が多い方が勝ち。CPU は常に最善手を打つ。
// 画面にもソルバーにも依存しない純粋な計算。

export interface State {
  /** カードの数字（上から下）。マイナスもある。 */
  cards: number[];
  /** まだ列に残っている範囲（両端を含む）。l > r で空。 */
  l: number;
  r: number;
  /** 誰が取ったか。-1=まだ、0=あなた、1=CPU */
  owner: number[];
  /** 得点 [あなた, CPU] */
  score: [number, number];
  /** いま取る番。0=あなた、1=CPU */
  turn: 0 | 1;
}

export const initial = (cards: number[]): State => ({
  cards,
  l: 0,
  r: cards.length - 1,
  owner: cards.map(() => -1),
  score: [0, 0],
  turn: 0,
});

export const isOver = (s: State): boolean => s.l > s.r;

/** 取る側: 0 = 上（はしっこ l）、1 = 下（はしっこ r） */
export type Side = 0 | 1;

export function take(s: State, side: Side): State {
  if (isOver(s)) return s;
  const i = side === 0 ? s.l : s.r;
  const owner = s.owner.slice();
  owner[i] = s.turn;
  const score: [number, number] = [s.score[0], s.score[1]];
  score[s.turn] += s.cards[i]!;
  return {
    cards: s.cards,
    l: side === 0 ? s.l + 1 : s.l,
    r: side === 1 ? s.r - 1 : s.r,
    owner,
    score,
    turn: s.turn === 0 ? 1 : 0,
  };
}

/** best[l][r] = 範囲 l..r が残っているとき、いま取る番の人が（自分の得点 − 相手の得点）を最大にした値。 */
export function table(cards: number[]): (l: number, r: number) => number {
  const n = cards.length;
  const memo = new Map<number, number>();
  const f = (l: number, r: number): number => {
    if (l > r) return 0;
    const key = l * 64 + r;
    const hit = memo.get(key);
    if (hit !== undefined) return hit;
    const v = Math.max(cards[l]! - f(l + 1, r), cards[r]! - f(l, r - 1));
    memo.set(key, v);
    return v;
  };
  void n;
  return f;
}

/** その場の最善の側。同点なら上。 */
export function bestSide(s: State): Side {
  const f = table(s.cards);
  const up = s.cards[s.l]! - f(s.l + 1, s.r);
  const down = s.cards[s.r]! - f(s.l, s.r - 1);
  return down > up ? 1 : 0;
}

/** 各側を取ったときの「そこから最善を尽くした最終の差（取る人 − 相手）」。 */
export function sideValues(s: State): [number, number] {
  const f = table(s.cards);
  if (s.l === s.r) return [s.cards[s.l]!, s.cards[s.l]!];
  return [s.cards[s.l]! - f(s.l + 1, s.r), s.cards[s.r]! - f(s.l, s.r - 1)];
}

/** あなたが最初から最善を尽くしたときの得点差（あなた − CPU）。 */
export const optimalMargin = (cards: number[]): number => table(cards)(0, cards.length - 1);

/** あなたが常に「大きい方の端」を取り続けたときの最終の得点差（CPU は最善）。同じ大きさなら上。 */
export function greedyMargin(cards: number[]): number {
  let s = initial(cards);
  while (!isOver(s)) {
    if (s.turn === 0) s = take(s, s.cards[s.r]! > s.cards[s.l]! ? 1 : 0);
    else s = take(s, bestSide(s));
  }
  return s.score[0] - s.score[1];
}

/** ★: 最善の差（optimal）以上で 3、勝てば 2、それ以外は 0（負け）。 */
export const starsFor = (margin: number, optimal: number): 0 | 2 | 3 => (margin >= optimal ? 3 : margin > 0 ? 2 : 0);
