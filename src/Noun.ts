export class Noun {
  str: string;
  phrasal: boolean;

  constructor(str:string) {
    this.str = str;
    this.phrasal = /\s/.test(str);
  }

  get lastWord() {
    return this.str.slice(this.str.lastIndexOf(' ') + 1);
  }
}