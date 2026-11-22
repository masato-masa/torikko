import { ALL_LEVELS, WORLDS } from '../../levels.ts';
import { iconBack } from '../icons.ts';
import type { Deps } from '../types.ts';

export function renderSelect(root: HTMLElement, deps: Deps): () => void {
  const { store } = deps;
  const worlds = WORLDS.map((w) => {
    const unlockedAny = w.levels.some((l) => store.isUnlocked(l.id));
    const cards = w.levels
      .map((l) => {
        const open = store.isUnlocked(l.id);
        const stars = store.stars(l.id);
        const num = l.id.split('-')[1];
        return `<button class="level-card${open ? '' : ' locked'}${stars === 3 ? ' perfect' : ''}" type="button" data-level="${l.id}"${open ? '' : ' aria-disabled="true"'}>
            <span class="level-num">${num}</span>
            <span class="level-stars">${open ? [0, 1, 2].map((i) => `<span class="star${i < stars ? ' on' : ''}">★</span>`).join('') : '<span class="lock">🔒</span>'}</span>
          </button>`;
      })
      .join('');
    return `<section class="world">
      <h2 class="world-head"><span class="world-name">${w.id} ${w.name}</span>${unlockedAny ? `<span class="world-stars">★ ${store.worldStars(w.levels.map((l) => l.id))} / ${w.levels.length * 3}</span>` : ''}</h2>
      <div class="level-grid">${cards}</div>
    </section>`;
  }).join('');
  root.innerHTML = `
    <div class="app select-screen">
      <header class="header">
        <div class="header-row">
          <div class="header-left"><button class="icon-btn back-btn" type="button" aria-label="もどる">${iconBack()}</button></div>
          <h1 class="title">ステージ</h1>
          <div class="header-actions"></div>
        </div>
        <div class="status-bar"><span class="stat"><span class="stat-label">★</span><span class="stat-num">${store.total()}</span><span class="stat-label">/ ${ALL_LEVELS.length * 3}</span></span></div>
      </header>
      <div class="worlds">${worlds}</div>
    </div>`;
  const onClick = (ev: Event): void => {
    const t = ev.target as HTMLElement;
    if (t.closest('.back-btn')) deps.go({ screen: 'home' });
    const card = t.closest<HTMLElement>('.level-card');
    if (card && !card.classList.contains('locked')) deps.go({ screen: 'play', levelId: card.dataset.level! });
  };
  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}
