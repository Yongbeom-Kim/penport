# Penpot Theme Exporter - Development Guide

## Project Overview
A tool to export themes from Penpot design files (.penpot files) and generate CSS output.

## Tech Stack
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Build Tool**: esbuild
- **Testing**: Jest
- **Dependencies**: commander (CLI), chalk (colors), axios (HTTP), adm-zip (ZIP handling), zod (validation), dotenv (env vars)

## Available Scripts
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode  
- `pnpm build` - Build the project to index.js
- `pnpm dev` - Build in watch mode
- `pnpm run export` - Run the export command
- `pnpm run check` - TypeScript type checking

## Key Commands for Development
- **Type checking**: `pnpm run check`
- **Testing**: `pnpm test`
- **Building**: `pnpm build`

## Project Structure
- `src/` - Source TypeScript files
- `src/api/` - API-related code
- `test/api/` - API tests
- `index.js` - Compiled output (generated, not tracked in git)

## Development Workflow
1. Run `pnpm run check` for type checking
2. Run `pnpm test` to ensure tests pass
3. Use `pnpm dev` for development with auto-rebuild

## IMPORTANT: Testing Requirements
After every unit of change, we must ensure that `pnpm test` and `pnpm run check` passes.