## CURRENT
- Allow export to tailwind
    - Export to penpot.tailwind.config.js
    - Standard module.exports = {...}
    - Allow user to import in normal tailwind.config.js, and
  - For COLORS:
    - Standard theme.extend
  - For FONTS:
    - Requirement: font Family, font size, line height, font weight, letter spacing, must be coupled together.
    - Create src/typography.css, something like:
      ```css
      @tailwind base;
      @tailwind components;
      @tailwind utilities;

      .text-desktop-main-header {
        @apply text-[2.25rem] leading-[2.75rem] font-bold tracking-[-0.01em] font-sans;
      }
      ```


## FUTURE
- 