import { PathLike } from "node:fs";
import { Color } from "./penpot";

import { Typography } from "./penpot";
import { AssertionError } from "./errors";

export interface OutputFile {
  path: PathLike;
  contents: string;
}

export type GeneratorOptions = {
  cssOutputPath: PathLike;
  outputMode: "pure-css";
  typography: {
    fallbackToSansSerif: boolean; // default: true
  }
}

export type Generator = (data: {
  typographies: Typography[],
  colors: Color[]
}, options: GeneratorOptions) => OutputFile[];

export class CSSDeclaration {
  constructor(
    private _name: string,
    private _value: string | number,
    public readonly comment?: string,
  ) {
    if (this._name.includes(" ")) {
      throw new AssertionError(`CSS declaration name cannot contain spaces, name: ${this._name}`);
    }
    if (this._name.includes(".")) {
      throw new AssertionError(`CSS declaration name cannot contain dots, name: ${this._name}`);
    }
    if (this._name !== this._name.toLowerCase()) {
      throw new AssertionError(`CSS declaration name must be lowercase, name: ${this._name}`);
    }
  }

  toString() {
    return `${this.name}: ${this.value}; ${this.comment ? `/* ${this.comment} */` : ""}`;
  }

  get name() {
    return this._name;
  }

  get value() {
    return this._value;
  }
}

export class EmptyCSSDeclaration extends CSSDeclaration {
  constructor(comment?: string) {
    super("", "", comment);
  }

  override toString() {
    if (this.comment) {
      return `/* ${this.comment} */`;
    }
    return "";
  }
}

export class CSSVariable extends CSSDeclaration {
  constructor(name: string, value: string | number) {
    super(`--${name}`, value);
  }
}

export class CSSDeclarationBlock {
  constructor(
    public readonly selector: string,
    public readonly declarations: CSSDeclaration[],
  ) {}

  static merge(...blocks: CSSDeclarationBlock[]): CSSDeclarationBlock[] {
    if (blocks.length === 0) {
      throw new AssertionError("Cannot merge empty blocks");
    }
    const blocksBySelector: Record<string, CSSDeclarationBlock[]> = {};
    for (const block of blocks) {
      blocksBySelector[block.selector] = [...(blocksBySelector[block.selector] || []), block];
    }

    return Object.values(blocksBySelector).map(blocks => this._mergeSameSelector(...blocks));
  }

  static _mergeSameSelector(...blocks: CSSDeclarationBlock[]): CSSDeclarationBlock {
    if (blocks.length === 0) {
      throw new AssertionError("Cannot merge empty blocks");
    }
    if ((new Set(blocks.map(block => block.selector))).size !== 1) {
      throw new AssertionError(`Cannot merge blocks with different selectors. Selectors: ${blocks.map(block => block.selector).join(", ")}`);
    }

    const finalBlock = new CSSDeclarationBlock(blocks[0]!.selector, []);

    for (const block of blocks) {
      if (finalBlock.declarations.length !== 0) {
        finalBlock.declarations.push(new EmptyCSSDeclaration())
      }
      finalBlock.declarations.push(...block.declarations);
    }

    return finalBlock;
  }

  toString() {
    return this.selector + " {\n" +
      "  " + this.declarations.map((declaration) => declaration.toString()).join("\n  ") + "\n" +
      "}";
  }
}

export class CSSClass extends CSSDeclarationBlock {
  constructor(
    className: string,
    declarations: CSSDeclaration[],
  ) {
    super(`.${className}`, declarations);
    if (className.includes(" ")) {
      throw new AssertionError(`CSS class name cannot contain spaces, name: ${className}`);
    }
    if (className.includes(".")) {
      throw new AssertionError(`CSS class name cannot contain dots, name: ${className}`);
    }
  }
}

export class RootCSSDeclarationBlock extends CSSDeclarationBlock {
  constructor(
    declarations: CSSDeclaration[],
  ) {
    super(":root", declarations);
  }
}