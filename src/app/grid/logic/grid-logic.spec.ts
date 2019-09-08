import { distance, bestScorePoint, surroundingPoints } from './grid-logic';
import { Cell, CellType } from 'src/app/model/cell';
import { Point } from 'src/app/model/point';

describe('GridLogic', () => {

  describe('distance', () => {

    it('straight lines', () => {
      const start = { x: 0, y: 0 };
      const target1 = { x: 2, y: 0 };
      const target2 = { x: 0, y: 2 };

      expect(distance(start, target1)).toBe(20);
      expect(distance(start, target2)).toBe(20);
    })

    it('diagonales', () => {
      const start = { x: 0, y: 0 };
      const target1 = { x: 2, y: 2 };
      const target2 = { x: 2, y: 1 };
      const target3 = { x: 1, y: 2 };

      expect(distance(start, target1)).toBe(28); // 2 x diagonal
      expect(distance(start, target2)).toBe(24); // 1 x straight / 1 x diagonal
      expect(distance(start, target3)).toBe(24); // 1 x straight / 1 x diagonal
    })


  })


  describe('bestScorePoint', () => {

    const best = new Cell(10, 10, CellType.EVALUATED);
    const bestButTargetDistance = new Cell(0, 20, CellType.EVALUATED);
    const worst = new Cell(20, 10, CellType.EVALUATED);


    it('single best score', () => {
      const game = [
        [worst, best],
        [worst, worst]
      ];

      expect(bestScorePoint(game)).toEqual({ x: 0, y: 1 });
    });

    it('multiple same scores, but different distance to target', () => {
      const game = [
        [worst, best],
        [bestButTargetDistance, worst]
      ];

      expect(bestScorePoint(game)).toEqual({ x: 0, y: 1 });
    })

    it('ignores null values', () => {
      const game = [
        [null, null],
        [best, null]
      ];

      expect(bestScorePoint(game)).toEqual({ x: 1, y: 0 });
    })

    it('ignores excluded cells', () => {
      const bestPathCell = new Cell(5, 5, CellType.PATH);

      const game = [
        [worst, best],
        [bestPathCell, worst]
      ];

      expect(bestScorePoint(game, cell => cell.type === CellType.PATH)).toEqual({ x: 0, y: 1 });
    })

  });


  describe('surroundingPoints', () => {

    const gridSize: Point = { x: 3, y: 3 };

    it('middle point', () => {
      const points = surroundingPoints({ x: 1, y: 1 }, gridSize);
      expect(points).toEqual(jasmine.arrayContaining([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 1 }, { x: 2, y: 2 }]))
    });

    it('top left point', () => {
      const points = surroundingPoints({ x: 0, y: 0 }, gridSize);
      expect(points).toEqual(jasmine.arrayContaining([{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]))
    })

    it('bottom-right point', () => {
      const points = surroundingPoints({ x: 2, y: 2 }, gridSize);
      expect(points).toEqual(jasmine.arrayContaining([{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 1 }]))
    })

  });

})