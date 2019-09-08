import { Point } from './point';

export interface GameConfig {
  gridSize: Point,
  start: Point,
  target: Point,
  obstales: Point[]
};

