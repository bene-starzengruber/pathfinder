import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { GameConfig } from '../model/game-config';
import { Point } from '../model/point';
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
    gridSize: { x: 10, y: 10 },
    start: { x: 0, y: 0 },
    target: { x: 9, y: 9 },
  };

  game: Cell[][];

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
  }

  startGame() {
    this.game = new Array(this.gameConfig.gridSize.x).fill(null);
    this.game.forEach((_, idx) => this.game[idx] = new Array(this.gameConfig.gridSize.y));

    const startCell = new Cell(0, distance(this.gameConfig.start, this.gameConfig.target));
    this.game[this.gameConfig.start.x][this.gameConfig.start.y] = startCell;

    this.changeDetector.markForCheck();
  }

  next() {
    this.evaluateSurrounding(bestScorePoint(this.game));
    this.changeDetector.markForCheck();
  }


  evaluateSurrounding(point: Point) {
    surroundingPoints(point, this.gameConfig.gridSize)
      .forEach(neighbor => {
        const fromStart = distance(this.gameConfig.start, neighbor);
        const toTarget = distance(this.gameConfig.target, neighbor);
        const { x, y } = neighbor;
        this.game[x][y] = new Cell(fromStart, toTarget);
      })
  }

}
