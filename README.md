# tsc-error-files

A CLI tool for listing TypeScript files where errors have occurred.

## Installation

```sh
npm install --global tsc-error-files
```

## Usage

### Open all files with errors in VSCode at once

```sh
code $(tsc-error-files)
```

### Print a list of files where errors have occurred

```sh
tsc-error-files
```
