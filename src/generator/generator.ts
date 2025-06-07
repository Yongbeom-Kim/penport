import { AssertionError } from "../types/errors";
import { GeneratorOptions } from "../types/generator";
import { Color } from "../types/penpot";
import { Typography } from "../types/penpot";
import { deepMerge, DeepPartial } from "../types/utils";
import { pureCssGenerator } from "./css_generator";


const defaultGeneratorOptions: GeneratorOptions = {
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
      return pureCssGenerator(theme, completeOptions);
    default:
      throw new AssertionError(`Unsupported output mode: ${completeOptions.outputMode}`);
  }
}