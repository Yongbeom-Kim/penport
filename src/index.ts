import { program } from "commander";

program
  .command("export")
  .description("Export all themes from Penpot")
  .option("--format <format>", "Output format: css or tailwind", "css")
  .option("--config-output <path>", "Output path for Tailwind config (tailwind format only)", "penpot.tailwind.config.js")
  .option("--css-output <path>", "Output path for CSS file", "styles.css")
  .action(async (options) => {
    console.log("Exporting themes...");
    console.log(`Format: ${options.format}`);
    console.log(`CSS Output: ${options.cssOutput}`);
    if (options.format === "tailwind") {
      console.log(`Config Output: ${options.configOutput}`);
    }
  });

program.parse(process.argv);
