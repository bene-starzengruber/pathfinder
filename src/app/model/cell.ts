export class Cell {

  constructor(public fromStart: number, public toEnd: number) { }

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