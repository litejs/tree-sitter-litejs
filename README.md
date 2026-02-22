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
