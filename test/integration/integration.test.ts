import { parsePenpotFile } from "../../src/parser";
import { generator } from "../../src/generator/generator";
import { getFile } from "../../src/api/request";
import { TailwindGeneratorOptions } from "../../src/types/generator";
import { getAccessToken, getFileId, validateEnvironment } from '../../src/utils/config';

describe("Integration Tests", () => {
  const defaultTailwindOptions: TailwindGeneratorOptions = {
    configOutputPath: "penpot.tailwind.config.js",
    cssOutputPath: "src/typography.css",
    outputMode: "tailwind"
  };

  const cssOutputPath = "test/output.css";

  describe("File to Tailwind", () => {
    it("should parse penpot file and generate complete tailwind output", () => {
      const filePath = "test/resources/Base Test Case.penpot";
      const parsedData = parsePenpotFile(filePath);
      
      expect(parsedData.typographies.length).toBeGreaterThan(0);
      expect(parsedData.colors.length).toBeGreaterThan(0);

      const result = generator(parsedData, defaultTailwindOptions);

      expect(result).toHaveLength(2);
      
      const configFile = result.find((file: any) => file.path.toString().endsWith("penpot.tailwind.config.js"));
      const cssFile = result.find((file: any) => file.path.toString().endsWith("typography.css"));
      
      expect(configFile).toBeDefined();
      expect(cssFile).toBeDefined();
      
      expect({
        config: configFile!.contents,
        css: cssFile!.contents,
        metadata: {
          colorCount: parsedData.colors.length,
          typographyCount: parsedData.typographies.length
        }
      }).toMatchSnapshot();
    });

    it("should handle custom output paths", () => {
      const filePath = "test/resources/Base Test Case.penpot";
      const parsedData = parsePenpotFile(filePath);
      
      const customOptions: TailwindGeneratorOptions = {
        configOutputPath: "custom.tailwind.config.js",
        cssOutputPath: "custom/typography.css",
        outputMode: "tailwind"
      };

      const result = generator(parsedData, customOptions);

      const configFile = result.find((file: any) => file.path.toString().endsWith("custom.tailwind.config.js"));
      const cssFile = result.find((file: any) => file.path.toString().endsWith("custom/typography.css"));
      
      expect(configFile).toBeDefined();
      expect(cssFile).toBeDefined();
      expect(configFile!.path).toBe("custom.tailwind.config.js");
      expect(cssFile!.path).toBe("custom/typography.css");
    });
  });

  describe("File to CSS", () => {
    it("should parse penpot file and generate pure CSS output", () => {
      const filePath = "test/resources/Base Test Case.penpot";
      const parsedFile = parsePenpotFile(filePath);
      const generatedFiles = generator(parsedFile, { outputMode: "pure-css", cssOutputPath });
      
      expect(generatedFiles.length).toBe(1);
      expect(generatedFiles[0]!.path.toString()).toBe(cssOutputPath);
      expect(generatedFiles).toMatchSnapshot();
    });
  });

  describe("API to Tailwind", () => {
    beforeAll(() => {
      validateEnvironment();
    });

    it("should fetch from API and generate complete tailwind output", async () => {
      const penpotFile = await getFile(getFileId(), getAccessToken());
      
      // Convert API response to the format expected by generator
      const typographies = Object.values(penpotFile.data.typographies);
      const colors = Object.values(penpotFile.data.colors);
      
      expect(typographies.length).toBeGreaterThan(0);
      expect(colors.length).toBeGreaterThan(0);

      const result = generator({ typographies, colors }, defaultTailwindOptions);

      expect(result).toHaveLength(2);
      
      const configFile = result.find((file: any) => file.path.toString().endsWith("penpot.tailwind.config.js"));
      const cssFile = result.find((file: any) => file.path.toString().endsWith("typography.css"));
      
      expect(configFile).toBeDefined();
      expect(cssFile).toBeDefined();
      
      expect({
        config: configFile!.contents,
        css: cssFile!.contents,
        metadata: {
          colorCount: colors.length,
          typographyCount: typographies.length,
          fileId: penpotFile.id
        }
      }).toMatchSnapshot();
    });

    it("should handle API errors gracefully", async () => {
      await expect(getFile('invalid-file-id', getAccessToken()))
        .rejects.toThrow();
      
      await expect(getFile(getFileId(), 'invalid-token'))
        .rejects.toThrow();
    });
  });

  describe("API to CSS", () => {
    beforeAll(() => {
      validateEnvironment();
    });

    it("should fetch from API and generate pure CSS output", async () => {
      const file = await getFile(getFileId(), getAccessToken());
      const generatedFiles = generator(
        { 
          typographies: Object.values(file.data.typographies), 
          colors: Object.values(file.data.colors) 
        }, 
        { outputMode: "pure-css", cssOutputPath }
      );
      
      expect(generatedFiles.length).toBe(1);
      expect(generatedFiles[0]!.path.toString()).toBe(cssOutputPath);
      expect(generatedFiles).toMatchSnapshot();
    });
  });
});