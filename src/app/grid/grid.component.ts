import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { GameConfig } from '../model/game-config';
import { Point } from '../model/point';
import { Cell } from '../model/cell';

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

    const startCell = new Cell(0, this.distance(this.gameConfig.start, this.gameConfig.target));
    this.game[this.gameConfig.start.x][this.gameConfig.start.y] = startCell;

    this.changeDetector.markForCheck();
  }

  next() {
    const pointsToEvaluate = this.bestScoreCells();
    pointsToEvaluate.forEach(point => this.evaluateSurrounding(point));
    this.changeDetector.markForCheck();
  }


  evaluateSurrounding(point: Point) {
    for (let x = point.x - 1; x <= point.x + 1; x++) {
      for (let y = point.y - 1; y <= point.y + 1; y++) {
        if (x >= 0 && x < this.gameConfig.gridSize.x && y >= 0 && y < this.gameConfig.gridSize.y) {
          const sibling = { x: x, y: y };
          const fromStart = this.distance(this.gameConfig.start, sibling);
          const toTarget = this.distance(this.gameConfig.target, sibling);
          this.game[x][y] = new Cell(fromStart, toTarget);
        }
      }
    }
  }

  bestScoreCells(): Point[] {
    const score = Number.MAX_VALUE;
    let points: Point[] = [];

    this.game.forEach((_, x) => {
      this.game[x].forEach((_, y) => {
        const currentScore = this.game[x][y].score;
        if (currentScore <= score) {
          const currentPoint = { x: x, y: y };
          if (currentScore === score) {
            points.push(currentPoint);
          } else {
            points = [currentPoint];
          }
        }
      })
    })

    return points;
  }

  distance(start: Point, target: Point): number {
    const deltaX = Math.abs(start.x - target.x);
    const deltaY = Math.abs(start.y - target.y);
    return deltaX + deltaY;
  }

}
