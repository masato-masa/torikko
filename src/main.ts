import './styles/base.css';
import './styles/game.css';
import './styles/menu.css';
import { Router } from './ui/router.ts';
import { Progress } from './ui/storage.ts';
import { renderGame } from './ui/screens/game.ts';
import { renderHome } from './ui/screens/home.ts';
import { renderSelect } from './ui/screens/select.ts';

const app = document.querySelector<HTMLElement>('#app')!;
const store = new Progress();
const router = new Router();
let cleanup: (() => void) | null = null;
const go = (r: Parameters<Router['go']>[0]): void => router.go(r);

router.onChange((route) => {
  cleanup?.();
  cleanup = null;
  window.scrollTo(0, 0);
  const deps = { store, go };
  if (route.screen === 'home') cleanup = renderHome(app, deps);
  else if (route.screen === 'select') cleanup = renderSelect(app, deps);
  else cleanup = renderGame(app, route.levelId, deps);
});
router.start();
