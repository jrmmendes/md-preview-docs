---
title: Neovim
sidebar_position: 3
description: Plugin de referência do nvim-v2 e um mapeamento mínimo para abrir o preview do buffer atual.
---

A integração não depende de extensão: basta rodar a CLI com o caminho do
arquivo. Execute uma vez por arquivo e deixe o daemon observar o disco.

A CLI lê o arquivo salvo. O plugin do `nvim-v2` registra o buffer não salvo por
`TextChanged`, então o preview acompanha o texto em memória; o mapeamento mínimo
abaixo salva antes de registrar.

## Plugin do nvim-v2

O plugin de referência vive em `core/custom/md-preview/` do
[`jrmmendes/nvim-v2`](https://github.com/jrmmendes/nvim-v2). Com ele carregado:

| Comando | Ação |
| --- | --- |
| `:MD` | Abre o buffer atual ou os arquivos passados |
| `:MD stop` | Encerra o daemon usado pelo plugin |
| `:MD pipe` | Registra o buffer como temporário (`--pipe`) |
| `:MD reload` | Recarrega o plugin e reabre o buffer |

Opções em `opts`:

```lua
require("md-preview").setup({
  binary = "~/.local/bin/md-preview", -- opcional; usa o PATH por padrão
  port = 8766,                        -- usada ao iniciar o daemon
  theme = "auto",
  loader = "classic",
  open_browser = true,
})
```

O plugin lê `~/.local/state/md-preview/daemon.json` para descobrir a porta do
daemon em execução. `port` só importa quando o plugin inicia o processo; não
repita o valor padrão da CLI em outro lugar.

## Mapeamento mínimo

```lua
vim.keymap.set("n", "<leader>mp", function()
  local file = vim.api.nvim_buf_get_name(0)
  if file == "" then
    vim.notify("md-preview: buffer sem arquivo", vim.log.levels.WARN)
    return
  end
  if vim.bo.modified then
    vim.cmd.write()
  end
  vim.fn.jobstart({ "md-preview", file, "--open-browser" }, { detach = true })
end, { desc = "md-preview" })
```

Sem abrir o navegador, capture a URL:

```lua
local out = vim.fn.system({ "md-preview", file })
local url = vim.trim(out):match("http://[^%s]+")
if url then
  vim.fn.setreg("+", url)
  vim.notify("md-preview: " .. url)
end
```

Se o Neovim for iniciado por uma interface gráfica, o `PATH` pode não incluir
`~/.local/bin`. Use o caminho absoluto no `jobstart` ou defina `binary` no
plugin.
