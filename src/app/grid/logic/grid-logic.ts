import { Point } from 'src/app/model/point';
import { Cell } from 'src/app/model/cell';

/**
 * Calculates the distance between 2 points
 * A straight line is 10, a diagonal is 14 (approximation of c²=a²+b²)
 */
export function distance(point1: Point, point2: Point): number {
  const deltaX = Math.abs(point1.x - point2.x);
  const deltaY = Math.abs(point1.y - point2.y);

  if (deltaX === 0 || deltaY === 0) {
    return (deltaX + deltaY) * 10;
  }

  const distance = Math.max(deltaX, deltaY) + (Math.min(deltaX, deltaY) * 0.4)
  return distance * 10;
}

/**
 * Returns the point with the lowest score.
 * If the score is equal between cells, the cell with the smaller distance to the target is chosen.
 * If there are multiple cells with the exact same score, the first one is chosen
 */
export function bestScorePoint(cells: Cell[][], excludeFn: (cell: Cell) => boolean = () => false): Point {
  let bestCell = null;
  let bestCellPoint: Point;

  cells.forEach((_, x) => {
    cells[x].forEach((_, y) => {
      const cell = cells[x][y];

      if (cell && cell.betterScoreThan(bestCell) && !excludeFn(cell)) {
        bestCell = cell;
        bestCellPoint = { x: x, y: y }
      }
    })
  })

  return bestCellPoint;
}

/**
 * Gets all surrounding points for given Point.
 * Filters out invalid values like -1 or too high values for given grid size.
 */
export function surroundingPoints(point: Point, gridSize: Point): Point[] {
  const points: Point[] = [];

  for (let x = point.x - 1; x <= point.x + 1; x++) {
    for (let y = point.y - 1; y <= point.y + 1; y++) {
      if (x >= 0 && x < gridSize.x && y >= 0 && y < gridSize.y) {
        points.push({ x: x, y: y });
      }
    }
  }

  return points;
}