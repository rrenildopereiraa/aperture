# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-07-17

Initial release.

### Added

- Live, editable code frame with syntax highlighting (Shiki) across HTML, JavaScript, MJS, JSX, TypeScript, TSX, Astro, Vue, Svelte, Markdown, MDX, CSS, SCSS, and PHP
- Real editor indent/dedent: Tab indents the current line or every line of a selection, Shift+Tab dedents
- Multiple snippet tabs (up to 5), with add, close, and switch
- A random starting snippet on each load
- Export to PNG, JPG, WEBP, or SVG, and one-click copy to clipboard
- Per-corner border radius control, with a linked slider for uniform radii and an expandable split view for individual corners
- Two background patterns (diagonal stripes, left or right), plus grid lines and a bounding box overlay, all toggleable
- Font selection (Default, JetBrains Mono, Fira Code, IBM Plex Mono)
- Four built-in themes (Default, Eclipsa, Monochrome, Amber) and VS Code color theme import (`.json`)
- Full frame color customization (page, surface, border, text, tab, active tab, status bar background/text, active tab border) via a color picker popover with a live hex input
- Command palette (`Cmd/Ctrl+K`) with fuzzy search and keyboard navigation
- Keyboard shortcuts for export (`Cmd+S`), copy image (`Cmd+Shift+C`), and toggling the background pattern (`Cmd+B`)
- Toast notifications for export, copy, and theme-import feedback
- A full-height, scrollbar-free app shell that fits the viewport like a native app
- Styled end-to-end with [Yumma CSS](https://yummacss.com)

[Unreleased]: https://github.com/rrenildopereiraa/aperture/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/rrenildopereiraa/aperture/releases/tag/v0.1.0
