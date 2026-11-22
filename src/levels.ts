import data from './levels.json';

export interface LevelDef {
  id: string;
  cards: number[];
  /** あなたが最善を尽くしたときの得点差（ソルバーで証明）。★3 の条件。 */
  best: number;
}
export interface WorldDef {
  id: string;
  name: string;
  trick: string;
  levels: LevelDef[];
}

export const WORLDS: WorldDef[] = data.map((w, i) => ({ id: `W${i + 1}`, name: w.name, trick: w.trick, levels: w.levels }));
export const ALL_LEVELS: LevelDef[] = WORLDS.flatMap((w) => w.levels);
export const getLevel = (id: string): LevelDef | undefined => ALL_LEVELS.find((l) => l.id === id);
export const nextLevelId = (id: string): string | null => {
  const i = ALL_LEVELS.findIndex((l) => l.id === id);
  return i >= 0 && i + 1 < ALL_LEVELS.length ? ALL_LEVELS[i + 1]!.id : null;
};
