export interface Point {
  x: number,
  y: number
}

export function pointsEqual(point1: Point, point2: Point): boolean {
  if (!point1 || !point2) {
    return point1 === point2;
  }
  return point1.x === point2.x && point1.y === point2.y;
}