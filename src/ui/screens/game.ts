import { type Side, type State, bestSide, initial, isOver, sideValues, starsFor, take } from '../../engine.ts';
import { getLevel, nextLevelId } from '../../levels.ts';
import { iconBack, iconGear, iconHelp, iconHint, iconReset, iconUndo } from '../icons.ts';
import { openHelpSheet, openSettingsSheet } from '../sheets.ts';
import { sfx } from '../sfx.ts';
import type { Deps } from '../types.ts';

/** CPU が取るまでの間（ms）。短すぎると何が起きたか追えない */
const CPU_WAIT = 520;

export function renderGame(root: HTMLElement, levelId: string, deps: Deps): () => void {
  const def = getLevel(levelId);
  if (!def) {
    deps.go({ screen: 'home' });
    return () => {};
  }
  const level = def;
  const n = level.cards.length;
  const next = nextLevelId(level.id);
  let state: State = initial(level.cards);
  /** あなたの番の直前の状態（もどす用） */
  const history: State[] = [];
  let busy = false;
  let cpuTimer = 0;
  let winTimer = 0;
  let toastTimer = 0;
  let hintTimer = 0;
  let disposed = false;
  let over = false;

  let tiles = '';
  for (let i = 0; i < n; i++) tiles += `<div class="tile" data-i="${i}"><b${level.cards[i]! < 0 ? ' class="neg"' : ''}>${level.cards[i]}</b></div>`;

  root.innerHTML = `
    <div class="app app-game game-screen">
      <header class="header">
        <div class="header-row">
          <div class="header-left"><button class="icon-btn back-btn" type="button" aria-label="もどる">${iconBack()}</button></div>
          <h1 class="title">${level.id}</h1>
          <div class="header-actions">
            <button class="icon-btn help-btn" type="button" aria-label="遊びかた">${iconHelp()}</button>
            <button class="icon-btn settings-btn" type="button" aria-label="設定">${iconGear()}</button>
          </div>
        </div>
        <div class="status-bar">
          <span class="stat me"><span class="stat-label">あなた</span><span class="stat-num score0">0</span></span>
          <span class="stat cpu"><span class="stat-label">CPU</span><span class="stat-num score1">0</span></span>
        </div>
      </header>
      <div class="board-wrap">
        <div class="board" style="--n:${n}">
          ${tiles}
          <div class="toast" hidden></div>
        </div>
      </div>
      <footer class="footer">
        <button class="tool undo-btn" type="button" aria-label="もどす" disabled>${iconUndo()}</button>
        <button class="tool retry-btn" type="button" aria-label="やりなおし">${iconReset()}</button>
        <button class="tool hint-btn" type="button" aria-label="ヒント">${iconHint()}</button>
      </footer>
      <div class="overlay game-message" hidden>
        <div class="sheet message-card">
          <p class="message-title"></p>
          <div class="stars"></div>
          <p class="message-moves"></p>
          <div class="message-buttons">
            <button class="sheet-btn next-btn" type="button">つぎへ</button>
            <button class="sheet-btn quiet again-btn" type="button">もういちど</button>
            <button class="sheet-btn quiet select-btn" type="button">ステージせんたく</button>
          </div>
        </div>
      </div>
    </div>`;

  const q = <T extends HTMLElement>(sel: string): T => root.querySelector<T>(sel)!;
  const boardEl = q('.board');
  const toastEl = q('.toast');
  const s0 = q('.score0');
  const s1 = q('.score1');
  const undoBtn = q<HTMLButtonElement>('.undo-btn');
  const msg = q('.game-message');
  const tileEls = Array.from(boardEl.querySelectorAll<HTMLElement>('.tile'));
  if (!next) q('.next-btn').setAttribute('hidden', '');

  const sign = (v: number): string => (v > 0 ? `+${v}` : String(v));

  function render(): void {
    for (let i = 0; i < n; i++) {
      const el = tileEls[i]!;
      const o = state.owner[i]!;
      el.dataset.owner = String(o);
      const open = i >= state.l && i <= state.r;
      const endTop = open && i === state.l;
      const endBottom = open && i === state.r;
      el.classList.toggle('open', open);
      el.classList.toggle('end', (endTop || endBottom) && !isOver(state) && state.turn === 0 && !busy);
      el.dataset.end = endTop ? 'top' : endBottom ? 'bottom' : '';
    }
    s0.textContent = String(state.score[0]);
    s1.textContent = String(state.score[1]);
    root.classList.toggle('turn-cpu', state.turn === 1 && !isOver(state));
    undoBtn.disabled = history.length === 0 || busy;
  }
  render();

  const toast = (t: string): void => {
    toastEl.textContent = t;
    toastEl.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => (toastEl.hidden = true), 1800);
  };

  function popTile(i: number): void {
    const el = tileEls[i]!;
    el.classList.remove('taken');
    void el.offsetWidth;
    el.classList.add('taken');
  }

  function finish(): void {
    over = true;
    const margin = state.score[0] - state.score[1];
    const stars = starsFor(margin, level.best);
    winTimer = window.setTimeout(() => {
      if (disposed) return;
      q('.message-title').textContent = stars > 0 ? 'かち!' : 'まけ…';
      q('.stars').innerHTML = stars > 0 ? [0, 1, 2].map((i) => `<span class="star${i < stars ? ' on' : ''}" style="--i:${i}">★</span>`).join('') : '';
      q('.message-moves').textContent =
        stars === 3
          ? `${state.score[0]} 対 ${state.score[1]}（${sign(margin)}）— さいぜん!`
          : stars === 2
            ? `${state.score[0]} 対 ${state.score[1]}（${sign(margin)}）。さいぜんは ${sign(level.best)}`
            : `${state.score[0]} 対 ${state.score[1]}。はしの えらびかたを かえてみよう`;
      q('.next-btn').toggleAttribute('hidden', stars === 0 || !next);
      if (stars > 0) {
        deps.store.record(level.id, stars as 2 | 3, margin);
        sfx.clear();
      } else sfx.lose();
      msg.hidden = false;
    }, 520);
  }

  function cpuTurn(): void {
    busy = true;
    render();
    cpuTimer = window.setTimeout(() => {
      if (disposed) return;
      const side = bestSide(state);
      const i = side === 0 ? state.l : state.r;
      state = take(state, side);
      popTile(i);
      sfx.take(level.cards[i]!, true);
      busy = false;
      render();
      if (isOver(state)) finish();
    }, CPU_WAIT);
  }

  function play(side: Side): void {
    if (busy || over || !msg.hidden || state.turn !== 0 || isOver(state)) return;
    clearHint();
    history.push(state);
    const i = side === 0 ? state.l : state.r;
    state = take(state, side);
    popTile(i);
    sfx.take(level.cards[i]!, false);
    render();
    if (isOver(state)) finish();
    else cpuTurn();
  }

  function reset(): void {
    window.clearTimeout(cpuTimer);
    window.clearTimeout(winTimer);
    state = initial(level.cards);
    history.length = 0;
    busy = false;
    over = false;
    msg.hidden = true;
    clearHint();
    tileEls.forEach((e) => e.classList.remove('taken'));
    render();
  }

  function undo(): void {
    if (!history.length || busy || !msg.hidden) return;
    state = history.pop()!;
    over = false;
    sfx.undo();
    clearHint();
    tileEls.forEach((e) => e.classList.remove('taken'));
    render();
  }

  function clearHint(): void {
    tileEls.forEach((e) => e.classList.remove('hint'));
    window.clearTimeout(hintTimer);
  }

  const hint = (): void => {
    if (busy || over || !msg.hidden || state.turn !== 0 || isOver(state)) return;
    clearHint();
    const side = bestSide(state);
    const [up, down] = sideValues(state);
    const i = side === 0 ? state.l : state.r;
    tileEls[i]!.classList.add('hint');
    toast(state.l === state.r ? 'さいごの 1 まい' : `${side === 0 ? '上' : '下'}を とると、さいごの さが ${sign(Math.max(up, down))}`);
    hintTimer = window.setTimeout(clearHint, 3000);
  };

  // 盤の上半分をタップ = 上のはしっこ、下半分 = 下のはしっこ。小さい画面でも押し先が大きい。
  const onPointerDown = (ev: PointerEvent): void => {
    if (!boardEl.contains(ev.target as Node)) return;
    ev.preventDefault();
    const r = boardEl.getBoundingClientRect();
    play(ev.clientY < r.top + r.height / 2 ? 0 : 1);
  };
  boardEl.addEventListener('pointerdown', onPointerDown);

  const onClick = (ev: Event): void => {
    const t = ev.target as HTMLElement;
    if (t.closest('.back-btn')) deps.go({ screen: 'select' });
    else if (t.closest('.help-btn')) openHelpSheet();
    else if (t.closest('.settings-btn')) openSettingsSheet();
    else if (t.closest('.undo-btn')) undo();
    else if (t.closest('.retry-btn')) reset();
    else if (t.closest('.hint-btn')) hint();
    else if (t.closest('.next-btn') && next) deps.go({ screen: 'play', levelId: next });
    else if (t.closest('.again-btn')) reset();
    else if (t.closest('.select-btn')) deps.go({ screen: 'select' });
  };
  root.addEventListener('click', onClick);
  const onKey = (ev: KeyboardEvent): void => {
    if (ev.key === 'z' || ev.key === 'Backspace') undo();
    if (ev.key === 'ArrowUp') play(0);
    if (ev.key === 'ArrowDown') play(1);
  };
  window.addEventListener('keydown', onKey);

  return () => {
    disposed = true;
    window.clearTimeout(cpuTimer);
    window.clearTimeout(winTimer);
    window.clearTimeout(toastTimer);
    window.clearTimeout(hintTimer);
    boardEl.removeEventListener('pointerdown', onPointerDown);
    root.removeEventListener('click', onClick);
    window.removeEventListener('keydown', onKey);
  };
}
