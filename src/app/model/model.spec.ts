import { Cell } from './cell';
import { pointsEqual } from './point';

describe('Cell', () => {

  it('calculates score', () => {
    expect(new Cell(0, 10).score).toBe(10);
    expect(new Cell(10, 0).score).toBe(10);
    expect(new Cell(10, 10).score).toBe(20);
  })

  it('compares score', () => {
    const cell = new Cell(10, 10);
    const lessScore = new Cell(20, 10);
    const same = new Cell(10, 10);
    const diffTargetDistance = new Cell(0, 20);

    expect(cell.betterScoreThan(undefined)).toBe(true);
    expect(cell.betterScoreThan(lessScore)).toBe(true);
    expect(cell.betterScoreThan(same)).toBe(false);
    expect(cell.betterScoreThan(diffTargetDistance)).toBe(true);
  })

})

describe('Point', () => {

  it('equals', () => {
    expect(pointsEqual({ x: 1, y: 1 }, { x: 1, y: 1 })).toBe(true);
    expect(pointsEqual({ x: 1, y: 2 }, { x: 1, y: 1 })).toBe(false);

    expect(pointsEqual({ x: 1, y: 1 }, undefined)).toBe(false);
    expect(pointsEqual(undefined, { x: 1, y: 1 })).toBe(false);
    expect(pointsEqual(undefined, undefined)).toBe(true);
  })
})
