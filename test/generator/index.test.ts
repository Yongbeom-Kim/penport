import { generator } from "../../src/generator/generator";
import { parsePenpotFile } from "../../src/parser";

describe("parse Base Test Case penpot file", () => {
  it("should unzip a penpot file", () => {
    const filePath = "test/resources/Base Test Case.penpot";
    const cssOutputPath = "src/output.css";
    const parsedFile = parsePenpotFile(filePath);
    const generatedFiles = generator(parsedFile, { outputMode: "pure-css", cssOutputPath });
    expect(generatedFiles.length).toBe(1);
    expect(generatedFiles[0]!.path.toString()).toBe(cssOutputPath);
    expect(generatedFiles).toMatchSnapshot();
  });
});