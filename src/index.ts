#!/usr/bin/env node
import { program } from "commander";
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { initCommand } from './scripts/init';
import { validateEnvironment, getAccessToken, getFileId } from './utils/config';
import { getFile } from './api/request';
import { generator } from './generator/generator';

program
  .command("init")
  .description("Initialize penport configuration")
  .action(initCommand);

program
  .command("export")
  .description("Export all themes from Penpot")
  .option("--format <format>", "Output format: css or tailwind", "css")
  .option("--config-output <path>", "Output path for Tailwind config (tailwind format only)", "penpot.tailwind.config.js")
  .option("--css-output <path>", "Output path for CSS file", "styles.css")
  .action(async (options) => {
    try {
      // Validate configuration files exist
      console.log("Validating configuration...");
      validateEnvironment();
      
      // Fetch data from Penpot API
      console.log("Fetching themes from Penpot...");
      const penpotFile = await getFile(getFileId(), getAccessToken());
      
      // Transform API response to theme format
      const theme = {
        typographies: Object.values(penpotFile.data.typographies),
        colors: Object.values(penpotFile.data.colors)
      };
      
      console.log(`Found ${theme.typographies.length} typographies and ${theme.colors.length} colors`);
      
      // Generate output files
      console.log(`Generating ${options.format} output...`);
      const generatorOptions = options.format === "tailwind" 
        ? {
            outputMode: "tailwind" as const,
            configOutputPath: options.configOutput,
            cssOutputPath: options.cssOutput
          }
        : {
            outputMode: "pure-css" as const,
            cssOutputPath: options.cssOutput
          };
      
      const outputFiles = generator(theme, generatorOptions);
      
      // Write files to disk
      for (const file of outputFiles) {
        const dirPath = dirname(file.path.toString());
        mkdirSync(dirPath, { recursive: true });
        writeFileSync(file.path.toString(), file.contents, 'utf-8');
        console.log(`Generated: ${file.path}`);
      }
      
      console.log("Export completed successfully!");
      
    } catch (error) {
      console.error("Export failed:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse(process.argv);
