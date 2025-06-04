import { program } from "commander";

program
  .command("export")
  .description("Export alls themes from Penpot")
  .action(async () => {
    console.log("Exporting themes...");
  });

program.parse(process.argv);
