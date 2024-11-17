# Use Biome for Formatting and Linting

## Context and Problem Statement

We want to introduce automatic formatting and linting to enforce consistency of style and improve code quality.

## Considered Options

- [Prettier](https://prettier.io/): An opinionated code formatter
- [ESLint](https://eslint.org/): A linting tool for Javascript
- [Biome](https://biomejs.dev/): A new formatting and linting tool.
- [EditorConfig](https://editorconfig.org): A format for configuring basic styles such as indent size and whether to use tabs or space.

## Decision Outcome

Use Biome with EditorConfig integration, because

- EditorConfig automatically configure editors to avoid manually tweaking options. Popular editors and IDEs such as Webstorm and VSCode all have support for it.
- Biome has better performance due to being written in a native language instead of JavaScript.
- Using a single tool for both formatting and linting helps simplify configuration and CI pipeline.
