// 遊びかた・設定・開発者メニュー。素の DOM で、開くときに作って body に足し、閉じるときに外す。
import { isOn, setOn, sfx } from './sfx.ts';
import { settings } from './storage.ts';
import type { Progress } from './storage.ts';

function openSheet(body: string, wire?: (root: HTMLElement, close: () => void) => void): void {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `<div class="sheet">${body}</div>`;
  document.body.appendChild(overlay);
  const close = (): void => {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (ev: KeyboardEvent): void => {
    if (ev.key === 'Escape') close();
  };
  document.addEventListener('keydown', onKey);
  overlay.addEventListener('click', (ev) => {
    const t = ev.target as HTMLElement;
    if (t === overlay || t.closest('.sheet-close')) close();
  });
  wire?.(overlay, close);
}

export function openHelpSheet(): void {
  openSheet(
    `<h2 class="sheet-title">遊びかた</h2>
     <ul class="help-list">
       <li>カードが 1 列に ならぶ。あなたと CPU が かわりばんこに、上か 下の「はしっこ」を 1 まい とる。</li>
       <li>盤の 上半分を タップ = 上を とる。下半分を タップ = 下を とる。</li>
       <li>とった カードの 数字が 点数。ぜんぶ とって、CPU より 多ければ かち。</li>
       <li>マイナスの カードは とると 減る。でも 端に あれば、いつか だれかが とらされる。</li>
       <li>CPU は いつも いちばん いい 手を えらぶ。さいぜんの さを だせたら ★3。</li>
     </ul>
     <button class="sheet-btn sheet-close" type="button">とじる</button>`,
  );
}

export function openSettingsSheet(): void {
  openSheet(
    `<h2 class="sheet-title">設定</h2>
     <div class="sheet-row static">
       <span>効果音</span>
       <button class="switch mute-toggle" type="button" role="switch" aria-checked="${isOn()}" aria-label="効果音の入切"></button>
     </div>
     <div class="sheet-row static">
       <span>やさしいモード<small class="row-note">CPU が たまに まちがえる（★は 2 まで）</small></span>
       <button class="switch easy-toggle" type="button" role="switch" aria-checked="${settings.easy()}" aria-label="やさしいモードの入切"></button>
     </div>
     <button class="sheet-btn sheet-close" type="button">とじる</button>`,
    (root) => {
      const t = root.querySelector<HTMLButtonElement>('.mute-toggle')!;
      t.addEventListener('click', () => {
        const next = !isOn();
        setOn(next);
        t.setAttribute('aria-checked', String(next));
        if (next) sfx.take(5, false);
      });
      const e = root.querySelector<HTMLButtonElement>('.easy-toggle')!;
      e.addEventListener('click', () => {
        const next = !settings.easy();
        settings.setEasy(next);
        e.setAttribute('aria-checked', String(next));
      });
    },
  );
}

export function openDevSheet(store: Progress, refresh: () => void): void {
  openSheet(
    `<h2 class="sheet-title">テストツール</h2>
     <p class="dev-note">本番では使わない、動作確認用のボタンです。</p>
     <button class="sheet-row unlock-all" type="button">全ステージ開放</button>
     <button class="sheet-row danger clear-all" type="button">きろくを ぜんぶ けす</button>
     <p class="dev-status"></p>
     <button class="sheet-link sheet-close" type="button">とじる</button>`,
    (root) => {
      const status = root.querySelector<HTMLElement>('.dev-status')!;
      root.querySelector('.unlock-all')!.addEventListener('click', () => {
        store.unlockAll();
        status.textContent = '全ステージを開放しました。';
        refresh();
      });
      root.querySelector('.clear-all')!.addEventListener('click', () => {
        if (!window.confirm('きろくを ぜんぶ けしますか？')) return;
        store.clear();
        status.textContent = 'きろくを消しました。';
        refresh();
      });
    },
  );
}
