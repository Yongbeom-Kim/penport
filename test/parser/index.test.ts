import { parsePenpotFile } from "../../src/parser";

describe("parse Base Test Case penpot file", () => {
  it("should unzip a penpot file", () => {
    const filePath = "test/resources/Base Test Case.penpot";
    const result = parsePenpotFile(filePath);
    expect(result.typographies.length).not.toBe(0);
    expect(result.colors.length).not.toBe(0);
    expect(result).toMatchSnapshot();
  });
});