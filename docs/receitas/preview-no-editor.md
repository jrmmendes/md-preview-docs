---
title: Preview a partir do editor
sidebar_position: 4
description: Integre o md-preview ao Neovim, ao VS Code ou a qualquer editor que saiba executar um comando com o arquivo atual.
---

A integração com editores não depende de extensão: basta executar a CLI passando
o caminho do arquivo atual. O md-preview cuida do daemon, do slug e do live
reload.

## A regra básica

```bash
md-preview /caminho/absoluto/do/arquivo.md --open-browser
```

| Editor faz | md-preview faz |
| --- | --- |
| Envia o caminho do buffer | Registra o documento |
| Executa uma vez por arquivo | Sobe o daemon se necessário |
| Continua salvando no disco | Observa e recarrega |

Não é necessário reiniciar o comando a cada salvamento. Execute **uma vez** por
arquivo e deixe o daemon observar.

:::note[Salve antes de executar]
O md-preview lê o arquivo do disco. Se o buffer tiver alterações não salvas, o
preview mostra a última versão salva.
:::

## Neovim

Adicione ao seu `init.lua`:

```lua
local function md_preview()
  local file = vim.api.nvim_buf_get_name(0)
  if file == "" then
    vim.notify("md-preview: buffer sem arquivo", vim.log.levels.WARN)
    return
  end
  if vim.bo.modified then
    vim.cmd.write()
  end
  vim.fn.jobstart({ "md-preview", file, "--open-browser" }, { detach = true })
end

vim.keymap.set("n", "<leader>mp", md_preview, { desc = "md-preview" })
```

Se o Neovim for iniciado por uma interface gráfica, o `PATH` pode não incluir o
binário. Use o caminho absoluto:

```lua
vim.fn.jobstart({ vim.fn.expand("~/.local/bin/md-preview"), file, "--open-browser" },
  { detach = true })
```

Para não abrir o navegador a cada uso e capturar a URL:

```lua
local out = vim.fn.system({ "md-preview", file })
local url = vim.trim(out):match("http://[^%s]+")
if url then
  vim.fn.setreg("+", url)
  vim.notify("md-preview: " .. url)
end
```

## VS Code

Crie `.vscode/tasks.json` no projeto:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "md-preview",
      "type": "shell",
      "command": "md-preview",
      "args": ["${file}", "--open-browser"],
      "presentation": {
        "reveal": "silent",
        "panel": "dedicated",
        "clear": true
      },
      "problemMatcher": []
    }
  ]
}
```

Execute com **Terminal → Run Task → md-preview**. Para um atalho, adicione em
`.vscode/keybindings.json`:

```json
[
  {
    "key": "ctrl+alt+m",
    "command": "workbench.action.tasks.runTask",
    "args": "md-preview"
  }
]
```

Sem abrir o navegador (útil para copiar a URL):

```json
"args": ["${file}"]
```

## Outros editores

Qualquer editor com “executar comando externo” funciona. Use estas regras:

| Item | Valor |
| --- | --- |
| Comando | `md-preview` (ou caminho absoluto) |
| Argumento 1 | Caminho absoluto do arquivo atual |
| Argumento 2 (opcional) | `--open-browser` |
| Frequência | Uma vez por documento, não a cada tecla |

Se o editor só oferece “executar ao salvar”, você pode rodar a CLI novamente:
o daemon deduplica o documento e o preview continua funcionando. É redundante,
mas inofensivo.

## Preview dentro do editor

Editores com painel web podem apontar para a URL do daemon. Duas abordagens:

1. **URL fixa por arquivo**: rode `md-preview arquivo.md`, copie a URL e abra no
   painel. O slug não muda enquanto o caminho não mudar.
2. **Captura da saída**: execute a CLI, leia a última linha de stdout e navegue
   até ela. `register` imprime só o slug, o que simplifica a leitura da saída.

```bash
slug=$(cat arquivo.md | md-preview register --stdin --slug docs/arquivo --path arquivo.md)
echo "http://127.0.0.1:8766/$slug"
```

## Live reload no editor

O reload depende de o daemon observar o **arquivo salvo**. Configurações de
“salvar automaticamente” funcionam bem; buffers nunca salvos não.

Se o editor grava por rename atômico (arquivo temporário + rename), o observador
continua acompanhando o caminho registrado. Se o editor apagar e recriar o
arquivo, o preview pode precisar de uma nova invocação da CLI.

## Solução de problemas

| Sintoma | Verifique |
| --- | --- |
| `command not found` | `PATH` do processo do editor |
| Abre a URL errada | Caminho relativo vs. absoluto do buffer |
| Não recarrega | Arquivo salvo? `register` foi usado sem `--path`? |
| Duas abas | Duas invocações com `--open-browser` |
| Preview antigo | Daemon com estado velho; rode `md-preview daemon status` |

Mais casos em [Solução de problemas](/receitas/troubleshooting).
