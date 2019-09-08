export enum CellType {
  START, PATH, OBSTACLE, EVALUATED, FINAL_PATH
}

export class Cell {

  constructor(public fromStart: number, public toEnd: number, public type: CellType, public previousCell: Cell = null) { }

  get score() {
    return this.fromStart + this.toEnd;
  }

  betterScoreThan(other: Cell) {
    if (!other) {
      return true;
    }

    if (this.score === other.score) {
      return this.toEnd < other.toEnd;
    }

    return this.score < other.score;
  }
}