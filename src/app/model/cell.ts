export class Cell {

  constructor(public fromStart: number, public toEnd: number) { }

  get score() {
    return this.fromStart + this.toEnd;
  }

}