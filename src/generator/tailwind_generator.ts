import { AssertionError } from "../types/errors";
import { OutputFile, TailwindGeneratorOptions } from "../types/generator";
import { Color, Typography } from "../types/penpot";


export const tailwindGenerator = (theme: {
  typographies: Typography[],
  colors: Color[]
}, options: TailwindGeneratorOptions): OutputFile[] => {
  if (!options.configOutputPath.toString().endsWith(".js")) {
    throw new AssertionError(`Config output path must end with .js, path: ${options.configOutputPath}`);
  }

  if (!options.cssOutputPath.toString().endsWith(".css")) {
    throw new AssertionError(`CSS output path must end with .css, path: ${options.cssOutputPath}`);
  }

  const outputs: OutputFile[] = [];

  // Generate Tailwind config file
  const configContent = generateTailwindConfig(theme.colors);
  outputs.push({
    path: options.configOutputPath,
    contents: configContent
  });

  // Generate typography CSS file
  const cssContent = generateTypographyCSS(theme.typographies);
  outputs.push({
    path: options.cssOutputPath,
    contents: cssContent
  });

  return outputs;
};

function generateTailwindConfig(colors: Color[]): string {
  const colorEntries = colors.map(color => {
    const colorValue = color.opacity === 1 
      ? `"${color.color}"`
      : `"rgba(${hexToRgb(color.color)}, ${color.opacity})"`;
    
    return `    "${color.name}": ${colorValue}`;
  });

  return `module.exports = {
  theme: {
    extend: {
      colors: {
${colorEntries.join(',\n')}
      }
    }
  }
};`;
}

function generateTypographyCSS(typographies: Typography[]): string {
  const utilityClasses = typographies.map(typography => {
    const fontSize = pxToRem(typography.fontSize);
    const lineHeight = pxToRem(typography.lineHeight);
    const fontWeight = mapFontWeight(typography.fontWeight);
    const letterSpacing = `${typography.letterSpacing / typography.fontSize}em`;
    const fontFamily = mapFontFamily(typography.fontFamily);

    return `.text-${typography.name} {
  @apply text-[${fontSize}rem] leading-[${lineHeight}rem] ${fontWeight} tracking-[${letterSpacing}] ${fontFamily};
}`;
  });

  return `@tailwind base;
@tailwind components;
@tailwind utilities;

${utilityClasses.join('\n\n')}`;
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

function pxToRem(px: number): number {
  return px / 16;
}

function mapFontWeight(weight: string): string {
  const weightMap: Record<string, string> = {
    "100": "font-thin",
    "200": "font-extralight", 
    "300": "font-light",
    "400": "font-normal",
    "500": "font-medium",
    "600": "font-semibold",
    "700": "font-bold",
    "800": "font-extrabold",
    "900": "font-black"
  };
  
  return weightMap[weight] || "font-normal";
}

function mapFontFamily(family: string): string {
  // Default to font-sans for common sans-serif fonts
  const sansSerifFonts = ["Inter", "Arial", "Helvetica", "sans-serif"];
  const serifFonts = ["Times", "Georgia", "serif"];
  const monoFonts = ["Monaco", "Consolas", "monospace"];
  
  if (sansSerifFonts.some(font => family.toLowerCase().includes(font.toLowerCase()))) {
    return "font-sans";
  }
  if (serifFonts.some(font => family.toLowerCase().includes(font.toLowerCase()))) {
    return "font-serif";
  }
  if (monoFonts.some(font => family.toLowerCase().includes(font.toLowerCase()))) {
    return "font-mono";
  }
  
  return "font-sans"; // Default fallback
}