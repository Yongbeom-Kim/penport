import { AssertionError } from "../types/errors";
import { getCssName } from "./css_generator";
import {
  getColorCssName,
  getColorValue,
  pxToRem,
  mapFontWeight,
  sanitizeCssIdentifier,
} from "./utils";
import { OutputFile, TailwindGeneratorOptions } from "../types/generator";
import { Color, Typography } from "../types/penpot";

export const tailwindGenerator = (
  theme: {
    typographies: Typography[];
    colors: Color[];
  },
  options: TailwindGeneratorOptions
): OutputFile[] => {
  if (!options.configOutputPath.toString().endsWith(".js")) {
    throw new AssertionError(
      `Config output path must end with .js, path: ${options.configOutputPath}`
    );
  }

  if (!options.cssOutputPath.toString().endsWith(".css")) {
    throw new AssertionError(
      `CSS output path must end with .css, path: ${options.cssOutputPath}`
    );
  }

  const outputs: OutputFile[] = [];

  // Generate Tailwind config file
  const configContent = generateTailwindConfig(
    theme.colors,
    theme.typographies
  );
  outputs.push({
    path: options.configOutputPath,
    contents: configContent,
  });

  // Generate typography CSS file
  const cssContent = generateTailwindTypography(theme.typographies);
  outputs.push({
    path: options.cssOutputPath,
    contents: cssContent,
  });

  return outputs;
};

function generateTailwindConfig(
  colors: Color[],
  typographies: Typography[]
): string {
  const colorEntries = colors.map((color) => {
    const colorValue = `"${getColorValue(color)}"`;
    const colorName = getColorCssName(color);
    return `"${colorName}": ${colorValue}`;
  });

  // Extract unique font families and create sanitized font family names
  const uniqueFontFamilies = [
    ...new Set(typographies.map((t) => t.fontFamily)),
  ];
  const fontFamilyEntries = uniqueFontFamilies.map((fontFamily) => {
    const sanitizedName = sanitizeFontFamilyName(fontFamily);
    return `"${sanitizedName}": ["${fontFamily}", "sans-serif"]`;
  });

  return `module.exports = {
  theme: {
    extend: {
      colors: {
${colorEntries.join(",\n")}
      },
      fontFamily: {
${fontFamilyEntries.join(",\n")}
      }
    }
  }
};`;
}

function generateTailwindTypography(typographies: Typography[]): string {
  const utilityClasses = typographies.map((typography) => {
    const fontSize = pxToRem(typography.fontSize);
    const lineHeight = typography.lineHeight; // Use unitless value directly
    const fontWeight = mapFontWeight(typography.fontWeight);
    const letterSpacing = formatLetterSpacing(
      typography.letterSpacing / typography.fontSize
    );
    const fontFamily = mapCustomFontFamily(typography.fontFamily);
    const textTransform = mapTextTransform(typography.textTransform);
    const sanitizedName = getCssName(typography.path ?? "", typography.name);

    const applyClasses = [
      `text-[${fontSize}rem]`,
      `leading-[${lineHeight}]`,
      fontWeight,
      `tracking-[${letterSpacing}em]`,
      fontFamily,
      textTransform,
    ]
      .filter(Boolean)
      .join(" ");

    return `.text-${sanitizedName} {
  @apply ${applyClasses};
}`;
  });

  return `@tailwind base;
@tailwind components;
@tailwind utilities;

${utilityClasses.join("\n\n")}`;
}

// Helper functions
function sanitizeFontFamilyName(fontFamily: string): string {
  return sanitizeCssIdentifier(fontFamily);
}

function mapCustomFontFamily(fontFamily: string): string {
  const sanitizedName = sanitizeFontFamilyName(fontFamily);
  return `font-${sanitizedName}`;
}

function mapTextTransform(textTransform: string): string {
  const transformMap: Record<string, string> = {
    none: "",
    capitalize: "capitalize",
    uppercase: "uppercase",
    lowercase: "lowercase",
  };

  return transformMap[textTransform] || "";
}

function formatLetterSpacing(spacing: number): string {
  // Round to 4 decimal places to avoid overly long decimals
  return spacing.toFixed(4).replace(/\.?0+$/, "");
}
