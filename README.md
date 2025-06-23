# Penport - Automated Design Token Export

[![npm version](https://badge.fury.io/js/penport.svg)](https://www.npmjs.com/package/penport)

**Transform Penpot designs into production-ready CSS and Tailwind configurations.**

Penport eliminates manual design token management by automatically extracting typography and color systems from Penpot files and generating clean, consistent CSS or Tailwind configurations.

```bash
penport export --format tailwind
# Generates complete Tailwind config from your Penpot design system
```

## Why Penport?

There is no real easy way to extract your design tokens from Penpot. Design systems drift out of sync, leading to inconsistencies and wasted developer time. There is [penpot-export](https://github.com/penpot/penpot-export), but it just takes so much set up, I don't understand it. Tool should be as easy as possible. 


Penport automates the entire process, ensuring your codebase always reflects your latest design decisions. Note that if your colors and/or typographies are not saved as assets, this tool will not extract them for you.

### Key Benefits

- **Automated Extraction** - Pull design tokens with a single command
- **Perfect Synchronization** - CSS automatically matches your designs  
- **Multiple Output Formats** - Generate pure CSS or Tailwind configurations
- **API Integration** - Works with local files or live Penpot projects

## Quick Start

```bash
# Installation
npm install --save-dev penport

# Configuration
penport init
# Follow the prompts to configure your Penpot connection

# Export your design tokens
penport export
# Generates CSS file with your design system
```

## Configuration

```bash
penport init
```

This command guides you through configuration by prompting for your Penpot file URL and access token.


## Usage

### Export Commands

```bash
# Standard CSS output
penport export
# Generates CSS custom properties and utility classes

# Tailwind CSS configuration
penport export --format tailwind  
# Creates tailwind.config.js and utility CSS

# Custom output paths
penport export --format tailwind \
  --config-output my-theme.config.js \
  --css-output my-styles.css
```

### Processing Pipeline

1. **Connect** - Fetches your latest Penpot design data
2. **Extract** - Parses typography and color token definitions  
3. **Transform** - Converts tokens to CSS or Tailwind format
4. **Generate** - Outputs production-ready files

## Output Examples

### CSS Output
```css
/* ✨ Generated automatically from your Penpot file */
:root {
  --color-primary: #3b82f6;
  --color-primary-50: rgba(59, 130, 246, 0.05);
  --typography-heading-font-family: 'Inter';
  --typography-heading-font-size: 2rem;
  --typography-heading-font-weight: 700;
  --typography-heading-line-height: 1.2;
}

.typography-heading {
  font-family: var(--typography-heading-font-family);
  font-size: var(--typography-heading-font-size);
  font-weight: var(--typography-heading-font-weight);
  line-height: var(--typography-heading-line-height);
}
```

### Or Tailwind
```javascript
// tailwind.config.js - Perfect for your workflow
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          50: 'rgba(59, 130, 246, 0.05)'
        }
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif']
      },
      fontSize: {
        'heading': ['2rem', { lineHeight: '1.2', fontWeight: '700' }]
      }
    }
  }
}
```

## ⚙️ Requirements

- **Node.js 16+** - Modern JavaScript runtime
- **pnpm 10.12.1+** - Fast, disk-efficient package manager  
- **TypeScript 5.8+** - For that sweet, sweet type safety
