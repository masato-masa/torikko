import { ALL_LEVELS } from '../../levels.ts';
import { iconGear } from '../icons.ts';
import { openDevSheet, openSettingsSheet } from '../sheets.ts';
import type { Deps } from '../types.ts';

/** ホームの絵。図形と数字だけ（絵素材なし）: 列の両端のカードを 2 人が取り合う様子。 */
const art = (): string => `
<div class="home-hero" aria-hidden="true">
  <span class="hh t me"><b>9</b></span>
  <span class="hh t"><b>3</b></span>
  <span class="hh t"><b>-4</b></span>
  <span class="hh t"><b>7</b></span>
  <span class="hh t cpu"><b>5</b></span>
</div>`;

export function renderHome(root: HTMLElement, deps: Deps): () => void {
  const { store } = deps;
  const draw = (): void => {
    const total = store.total();
    root.innerHTML = `
      <div class="app app-home home-screen">
        <div class="home-top">
          <button class="icon-btn settings-btn" type="button" aria-label="設定">${iconGear()}</button>
        </div>
        <div class="home">
          <div class="home-art">${art()}</div>
          <h1 class="home-title">とりっこ</h1>
          <p class="home-sub">はしっこを とって、CPU に かとう</p>
          <div class="home-buttons">
            <button class="home-btn primary resume-btn" type="button">${total > 0 ? 'つづきから' : 'はじめる'}</button>
            <button class="home-btn select-btn" type="button">ステージを えらぶ</button>
          </div>
          <p class="home-progress">★ ${total} / ${ALL_LEVELS.length * 3}</p>
        </div>
        <button class="dev-pill" type="button">テスト用</button>
      </div>`;
  };
  draw();
  const onClick = (ev: Event): void => {
    const t = ev.target as HTMLElement;
    if (t.closest('.resume-btn')) deps.go({ screen: 'play', levelId: store.firstUncleared() });
    else if (t.closest('.select-btn')) deps.go({ screen: 'select' });
    else if (t.closest('.settings-btn')) openSettingsSheet();
    else if (t.closest('.dev-pill')) openDevSheet(store, draw);
  };
  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}
