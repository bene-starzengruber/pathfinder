import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { GameConfig } from '../model/game-config';
import { Point, pointsEqual } from '../model/point';
import { Cell, CellType } from '../model/cell';
import { distance, bestScorePoint, surroundingPoints } from './logic/grid-logic';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit {

  gameConfig: GameConfig = {
    gridSize: { x: 50, y: 50 },
    start: { x: 0, y: 0 },
    target: { x: 49, y: 42 },
    obstales: [
      { x: 1, y: 3 }, { x: 1, y: 5 }, { x: 1, y: 4 },
      { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 },
      { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 }, { x: 9, y: 6 }
    ]
  };

  game: Cell[][];

  cellTypes = CellType;

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.initializeGame();
  }

  initializeGame() {
    this.game = new Array(this.gameConfig.gridSize.x).fill(null);
    this.game.forEach((_, idx) => this.game[idx] = new Array(this.gameConfig.gridSize.y).fill(null));

    const startCell = new Cell(0, distance(this.gameConfig.start, this.gameConfig.target), CellType.START);
    this.game[this.gameConfig.start.x][this.gameConfig.start.y] = startCell;

    this.gameConfig.obstales.forEach(obstacle => this.game[obstacle.x][obstacle.y] = new Cell(Number.MAX_VALUE, Number.MAX_VALUE, CellType.OBSTACLE));

    this.changeDetector.markForCheck();
  }

  next() {

    // 1. find best scoring cell 
    // 2. must not be the same as last time
    // 2. must not be start



    const bestPrevious = bestScorePoint(this.game, cell => cell.type === CellType.PATH);
    this.evaluateSurrounding(bestPrevious);

    this.game[bestPrevious.x][bestPrevious.y].type = CellType.PATH;

    const bestNow = bestScorePoint(this.game, cell => cell.type === CellType.PATH);
    const foundTarget = pointsEqual(bestNow, this.gameConfig.target);

    if (!foundTarget) {
      this.next()
    } else {
      let prevCell = this.game[bestNow.x][bestNow.y];
      while (prevCell.previousCell) {
        prevCell.type = CellType.FINAL_PATH;
        prevCell = prevCell.previousCell;
      }
      this.changeDetector.markForCheck();
    }


  }


  evaluateSurrounding(point: Point) {
    surroundingPoints(point, this.gameConfig.gridSize)
      .forEach(neighbor => this.updateCell(neighbor, point));
  }

  private updateCell(point: Point, previousPoint: Point) {
    const previousCell = this.game[previousPoint.x][previousPoint.y];
    const fromStart = previousCell.fromStart + distance(previousPoint, point);
    const toTarget = distance(this.gameConfig.target, point);

    const { x, y } = point;
    const cell = this.game[x][y];

    if (cell && cell.type === CellType.OBSTACLE) {
      return;
    }

    if (cell) {
      cell.fromStart = fromStart;
      cell.toEnd = toTarget;
    } else {
      this.game[x][y] = new Cell(fromStart, toTarget, CellType.EVALUATED, previousCell);
    }
  }

}
