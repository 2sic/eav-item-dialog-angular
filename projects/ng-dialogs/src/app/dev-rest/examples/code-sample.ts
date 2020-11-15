export class CodeSample {
  constructor(
    public title: string,
    public description: string,
    public code: string,
    public wrap = false,
    public runInConsole = false) {

      // the code often has a leading new-line - so we'll trim this
      this.code = this.code.trim();
  }
}