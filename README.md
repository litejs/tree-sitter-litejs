# tree-sitter-litejs

Tree-sitter grammar for [LiteJS](https://litejs.com) UI templates (`.ui` files).

## Editor Setup

### Helix

Add to `~/.config/helix/languages.toml`:

```toml
[[language]]
name = "litejs"
scope = "source.litejs"
file-types = ["ui"]
comment-token = "/"
indent = { tab-width = 4, unit = "\t" }

[[grammar]]
name = "litejs"
source = { git = "https://github.com/litejs/tree-sitter-litejs", rev = "main" }
```

Build and install queries:

```sh
hx --grammar fetch && hx --grammar build
mkdir -p ~/.config/helix/runtime/queries/litejs
cp queries/*.scm ~/.config/helix/runtime/queries/litejs/
```

### Zed

Install from the [Zed extension registry](https://zed.dev/extensions) by searching for "LiteJS",
or install as a dev extension from the `editors/zed` directory.

To build the grammar locally for development:

```sh
cd editors/zed
mkdir -p grammars/litejs
cd grammars/litejs
git clone https://github.com/litejs/tree-sitter-litejs .
npx tree-sitter generate
npx tree-sitter build --wasm -o ../../litejs.wasm
```

### Neovim

Add to `init.lua` (requires [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter)):

```lua
local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
parser_config.litejs = {
  install_info = {
    url = "https://github.com/litejs/tree-sitter-litejs",
    files = { "src/parser.c", "src/scanner.c" },
    branch = "main",
  },
  filetype = "litejs",
}

vim.filetype.add({ extension = { ui = "litejs" } })
```

Then `:TSInstall litejs` and link queries:

```sh
ln -s /path/to/tree-sitter-litejs/queries ~/.config/nvim/queries/litejs
```

## Development

```sh
npm install
npx tree-sitter generate
npx tree-sitter parse test/main.ui
```

## License

MIT
