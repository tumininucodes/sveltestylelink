# SvelteStyleLink

SvelteStyleLink is a VS Code extension that lets you jump from any class name used inside your Svelte components straight to the CSS/SCSS selector that styles it. No more hunting through `<style>` blocks or external stylesheets. Takes you exactly where you need to be.


## Table of Contents

- [SvelteStyleLink](#sveltestylelink)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [How It Works](#how-it-works)
  - [Configuration](#configuration)
  - [Roadmap](#roadmap)
  - [License](#license)

## Features

- **Jump to selector definitions** – highlight or place the caret inside `class="..."` and trigger VS Code’s “Go to Definition”. You’ll land on the matching `.your-class` selector.
- **Inline `<style>` awareness** – works with CSS/SCSS declared in the same `.svelte` file, including `<style lang="scss">`.
- **External stylesheet lookup** – scans workspace `*.css` and `*.scss` files and opens the first match. Ideal for shared utility sheets.
- **Zero configuration** – activate once and forget. The provider registers automatically for Svelte documents.
- **Plays nicely with standard gestures** – `F12`, `Cmd/Ctrl+Click`, and “Peek Definition” all use the provider.



## Installation
If installed via the extension manager, it just works. No configuration.

To install the project
```bash
git clone https://github.com/tumininucodes/sveltestylelink.git
cd sveltestylelink
npm install
```

To run it locally during development, press `F5` inside VS Code to launch an Extension Development Host. For distribution:

```bash
npm run package
```

This produces a `.vsix` you can install via `code --install-extension`.

## Usage

1. Open a Svelte project in VS Code with SvelteStyleLink enabled.
2. Open any `.svelte` file containing a `class=""` attribute.
3. Move the caret inside the class name (e.g. `hero-card`).
4. Press `F12`, `Cmd/Ctrl+Click`, or select “Peek Definition”.
5. VS Code navigates directly to the matching selector either in the same file’s `<style>` section or in the first external stylesheet match.

If no selector exists, VS Code stays put—no disruptive errors.

## How It Works

The extension registers a `DefinitionProvider` (see `src/SvelteCSSDefinitionProvider.ts`) for the Svelte language:

1. Confirms the caret is inside a `class=""` attribute.
2. Searches the current document’s `<style>` block for `.className`.
3. If not found, scans workspace CSS/SCSS files via `vscode.workspace.findFiles("**/*.{css,scss}")`, opens each, and checks for the selector.
4. Returns a `vscode.Location` corresponding to the first match, which VS Code opens for you.

This keeps lookups lightweight while covering the most common Svelte styling patterns.

## Configuration

No user settings are required.

## Roadmap

- Return multiple definition candidates when a class exists in several files.
- Provide settings for include/exclude globs and additional language modes.
- Recognize `class:` directives and utility-first conventions.
- Cache selector positions per document and invalidate on save for better performance.


## License

MIT © SvelteStyleLink contributors.

