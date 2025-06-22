import { AssertionError } from "../types/errors";
import { GeneratorOptions, PureCSSGeneratorOptions } from "../types/generator";
import { Color } from "../types/penpot";
import { Typography } from "../types/penpot";
import { deepMerge, DeepPartial } from "../types/utils";
import { pureCssGenerator } from "./css_generator";
import { tailwindGenerator } from "./tailwind_generator";


const defaultGeneratorOptions: PureCSSGeneratorOptions = {
  cssOutputPath: "styles.css",
  outputMode: "pure-css",
  typography: {
    fallbackToSansSerif: true,
  },
}

export const generator = (theme: {
  typographies: Typography[],
  colors: Color[]
}, options: DeepPartial<GeneratorOptions>) => {
  const completeOptions = deepMerge(defaultGeneratorOptions, options ?? {});

  if (!completeOptions.cssOutputPath.toString().endsWith(".css")) {
    throw new AssertionError(`CSS output path must end with .css, path: ${completeOptions.cssOutputPath}`);
  }

  switch (completeOptions.outputMode) {
    case "pure-css":
      return pureCssGenerator(theme, completeOptions as PureCSSGeneratorOptions);
    case "tailwind":
      const tailwindOptions = completeOptions as any;
      return tailwindGenerator(theme, {
        configOutputPath: tailwindOptions.configOutputPath || "penpot.tailwind.config.js",
        cssOutputPath: completeOptions.cssOutputPath.toString(),
        outputMode: "tailwind"
      });
    default:
      throw new AssertionError(`Unsupported output mode: ${(completeOptions as any).outputMode}`);
  }
}