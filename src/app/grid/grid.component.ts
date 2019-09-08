import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { GameConfig } from '../model/game-config';
import { Point, pointsEqual } from '../model/point';
import { Cell } from '../model/cell';
import { distance, bestScorePoint, surroundingPoints } from './logic/grid-logic';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit {

  gameConfig: GameConfig = {
    gridSize: { x: 3, y: 4 },
    start: { x: 0, y: 0 },
    target: { x: 2, y: 2 },
  };

  game: Cell[][];

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.initializeGame();
  }

  initializeGame() {
    this.game = new Array(this.gameConfig.gridSize.x).fill(null);
    this.game.forEach((_, idx) => this.game[idx] = new Array(this.gameConfig.gridSize.y).fill(null));

    const startCell = new Cell(0, distance(this.gameConfig.start, this.gameConfig.target));
    this.game[this.gameConfig.start.x][this.gameConfig.start.y] = startCell;

    this.changeDetector.markForCheck();
  }

  next() {
    this.evaluateSurrounding(bestScorePoint(this.game));


    const bestScoring = bestScorePoint(this.game);
    this.game[bestScoring.x][bestScoring.y].isPath = true;

    const foundTarget = pointsEqual(bestScorePoint(this.game), this.gameConfig.target);
    if (foundTarget) {
      this.initializeGame();
    }

    this.changeDetector.markForCheck();
  }


  evaluateSurrounding(point: Point) {
    surroundingPoints(point, this.gameConfig.gridSize)
      .forEach(neighbor => this.updateCell(neighbor));
  }

  private updateCell(point: Point) {
    const fromStart = distance(this.gameConfig.start, point);
    const toTarget = distance(this.gameConfig.target, point);

    const { x, y } = point;
    const cell = this.game[x][y];
    if (cell) {
      cell.fromStart = fromStart;
      cell.toEnd = toTarget;
    } else {
      this.game[x][y] = new Cell(fromStart, toTarget);
    }
  }

}
