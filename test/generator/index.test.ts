import { getFile } from "../../src/api/request";
import { generator } from "../../src/generator/generator";
import { parsePenpotFile } from "../../src/parser";
import dotenv from 'dotenv';

dotenv.config({
  path: '.penpot-secret'
});

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN: string;
    }
  }
}


const cssOutputPath = "test/output.css";

describe("parse Base Test Case penpot file", () => {
  it("should unzip a penpot file", () => {
    const filePath = "test/resources/Base Test Case.penpot";
    const parsedFile = parsePenpotFile(filePath);
    const generatedFiles = generator(parsedFile, { outputMode: "pure-css", cssOutputPath });
    expect(generatedFiles.length).toBe(1);
    expect(generatedFiles[0]!.path.toString()).toBe(cssOutputPath);
    expect(generatedFiles).toMatchSnapshot();
  });
});


describe("generate Code from Penpot API", () => {
  it("should generate code from penpot api", async () => {
    const PROJECT_ID = '4ad2a2f5-64b0-80be-8006-4a0c775086b1';
    const file = await getFile(PROJECT_ID, process.env.ACCESS_TOKEN);
    const generatedFiles = generator({typographies: Object.values(file.data.typographies), colors: Object.values(file.data.colors)}, { outputMode: "pure-css", cssOutputPath });
    expect(generatedFiles.length).toBe(1);
    expect(generatedFiles[0]!.path.toString()).toBe(cssOutputPath);
    expect(generatedFiles).toMatchSnapshot();
  });
})