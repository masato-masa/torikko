import type { Route } from './router.ts';
import type { Progress } from './storage.ts';

export interface Deps {
  store: Progress;
  go: (r: Route) => void;
}
