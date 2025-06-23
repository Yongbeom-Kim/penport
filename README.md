# Penport - Penpot Theme Exporter

A TypeScript CLI tool for exporting design themes from Penpot design files (.penpot) and generating CSS/Tailwind CSS configurations.

## Features

- **Multiple Export Formats**: Generate pure CSS or Tailwind CSS configurations
- **Local File Support**: Parse local .penpot files directly
- **API Integration**: Fetch themes directly from Penpot projects via API
- **Typography & Colors**: Extract and export typography styles and color palettes
- **TypeScript**: Fully typed with strict TypeScript configuration
- **Comprehensive Testing**: Unit and integration tests with snapshot testing

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd penpot-theme-exporter

# Install dependencies
pnpm install

# Build the project
pnpm build
```

## Configuration

### Quick Setup

Run the initialization command to configure Penport:

```bash
node index.js init
```

This will prompt you for:
- Your Penpot access token
- Your Penpot file URL (from the browser address bar)

### Manual Setup

1. Create a `.penport-secret` file in the project root:
```
ACCESS_TOKEN=your-penpot-access-token
```

2. Configure `penport.config.json`:
```json
{
  "teamId": "your-team-id",
  "fileId": "your-file-id",
  "pageId": "your-page-id"
}
```

> **Note**: You can find these IDs in your Penpot file URL: `https://design.penpot.app/#/workspace?team-id=...&file-id=...&page-id=...`

## Usage

### Command Line Interface

Initialize configuration:
```bash
# Set up Penport configuration interactively
penport init
```

Export themes with various options:

```bash
# Export as CSS (default)
penport export

# Export as Tailwind CSS
penport export --format tailwind

# Custom output paths
penport export --format css --css-output custom-styles.css
penport export --format tailwind --config-output custom.tailwind.config.js --css-output styles.css
```

## Project Structure

```
src/
├── api/                    # API integration for Penpot
│   └── request.ts         # HTTP requests to Penpot API
├── generator/             # Theme generation
│   ├── css_generator.ts   # Pure CSS output generator
│   ├── tailwind_generator.ts # Tailwind CSS generator
│   ├── generator.ts       # Main generator logic
│   └── utils.ts          # Shared generator utilities
├── parser/                # .penpot file parsing
│   ├── file_parser.ts     # ZIP file handling
│   ├── data_parser.ts     # JSON data parsing
│   └── parser.ts          # Main parsing logic
├── types/                 # TypeScript definitions
│   ├── penpot.ts         # Penpot data structures
│   ├── generator.ts       # Generator options
│   └── errors.ts         # Custom error types
├── scripts/               # CLI commands
│   └── init.ts           # Configuration initialization
├── utils/                 # Utilities
│   └── config.ts         # Configuration management
└── index.ts              # CLI entry point
```

## Development

### Available Scripts

- `pnpm test` - Run all tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm build` - Build the project
- `pnpm dev` - Build in watch mode
- `pnpm run check` - TypeScript type checking
- `pnpm run export` - Run the export command

### Development Workflow

1. **Type Checking**: Always run `pnpm run check` before committing
2. **Testing**: Ensure `pnpm test` passes after changes
3. **Watch Mode**: Use `pnpm dev` for development with auto-rebuild

### Testing

The project includes comprehensive testing:

- **Unit Tests**: Individual component testing
- **Integration Tests**: End-to-end workflow testing
- **Snapshot Tests**: Output consistency verification
- **API Tests**: Penpot API integration testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test -- --coverage

# Run specific test file
pnpm test -- parser.test.ts
```

## Output Formats

### Pure CSS
Generates standard CSS custom properties and utility classes:

```css
:root {
  --color-primary: #3b82f6;
  --typography-heading-font-family: 'Inter';
  --typography-heading-font-size: 2rem;
}

.typography-heading {
  font-family: var(--typography-heading-font-family);
  font-size: var(--typography-heading-font-size);
}
```

### Tailwind CSS
Generates Tailwind configuration and utility CSS:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6'
      },
      fontFamily: {
        heading: ['Inter']
      }
    }
  }
}
```

## API Integration

The tool supports fetching themes directly from Penpot projects:

```typescript
import { getFile } from './src/api/request';
import { getAccessToken, getFileId } from './src/utils/config';

const penpotData = await getFile(getFileId(), getAccessToken());
const theme = {
  typographies: Object.values(penpotData.data.typographies),
  colors: Object.values(penpotData.data.colors)
};
```

## Error Handling

The tool includes comprehensive error handling for:
- Invalid .penpot file formats
- Missing configuration files
- API authentication failures
- Invalid output paths
- Malformed theme data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm run check` and `pnpm test`
5. Commit with descriptive messages (one-line format)
6. Submit a pull request

## Requirements

- Node.js 16+
- pnpm 10.12.1+
- TypeScript 5.8+

## License

ISC License