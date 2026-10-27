---
title: Solução de problemas
sidebar_position: 5
description: "Diagnóstico dos problemas mais comuns: porta, daemon, token, temas, imagens, Mermaid, recarga e fontes."
---

Comece por três verificações:

```bash
md-preview --version
md-preview daemon status
md-preview theme list
```

Se o daemon estiver parado, rode `md-preview doc.md` para subi-lo. Muitos
sintomas desaparecem porque o processo encerrou por inatividade.

## Porta ocupada

Sintoma:

```text
md-preview: daemon did not become ready on 127.0.0.1:8766
```

Diagnóstico:

```bash
curl -s http://127.0.0.1:8766/__health
```

Uma resposta `{"status":"ok","version":"..."}` indica que já existe um daemon
saudável na porta. Se for o mesmo usuário, a CLI normalmente reutiliza o estado.
Se o token não for conhecido:

```text
md-preview: a daemon is running without a known token; restart it with `md-preview daemon stop`
```

Solução: pare o processo ou use outra porta.

```bash
md-preview daemon stop
MDPRV_PORT=8767 md-preview doc.md
```

Se outro programa estiver usando a porta:

```bash
ss -ltnp | grep 8766
```

## Daemon não para

```bash
md-preview daemon status   # código 1 quando parado
md-preview daemon stop
```

Se o arquivo de estado foi apagado, `daemon stop` responde
`md-preview daemon is not running`, mas o processo pode continuar até o idle.
Nesse caso, finalize o PID pelo sistema:

```bash
pgrep -af "__serve"
kill <pid>
```

## `401 unauthorized` ao registrar

O token do estado e o token do daemon não coincidem. Normalmente acontece após
remover `daemon.json` com o processo vivo.

```bash
md-preview daemon stop
md-preview doc.md
```

Se o `stop` não resolver, mate o processo e apague o estado:

```bash
rm -f "${XDG_STATE_HOME:-$HOME/.local/state}/md-preview/daemon.json"
```

## `403 forbidden`

A requisição não passou na validação de `Host` ou `Origin`.

| Causa | Correção |
| --- | --- |
| Acesso por IP da rede | Use `127.0.0.1` ou `localhost` |
| Proxy reverso com Host externo | Não exponha o daemon |
| Origin de outro site | Abra a URL diretamente |

## Tema não é aplicado

1. Confirme que o tema existe:

   ```bash
   md-preview theme list | grep meu-tema
   ```

2. Valide o arquivo:

   ```bash
   md-preview theme validate ~/.config/md-preview/themes/meu-tema.json
   ```

3. Verifique a precedência: `?theme=` vence o cookie, que vence o `config.json`.

4. Um tema inválido é ignorado silenciosamente na página (com erro no catálogo).
   O valor anterior continua valendo.

```bash
curl -s http://127.0.0.1:8766/__themes
```

A resposta lista os temas carregados e os erros de validação.

## Tema `auto` não alterna

- `auto` segue `prefers-color-scheme` do **sistema operacional**, não o tema do
  site nem o do editor.
- Se `?theme=auto` estiver na URL, o comportamento é o mesmo; o parâmetro só
  força a escolha de `auto`.
- Um tema de usuário chamado `auto` pode ter variantes quebradas; valide.

## Imagem não carrega

| Verificação | Detalhe |
| --- | --- |
| O documento tem caminho? | `register` sem `--path` não tem diretório |
| A imagem está dentro do diretório? | `../` e symlinks externos são bloqueados |
| A extensão é de imagem? | Extensões desconhecidas são recusadas |
| O caminho é relativo? | URLs absolutas não passam por `/img/` |

```bash
curl -I "http://127.0.0.1:8766/img/docs/guia/assets/foto.png"
```

Um `404` confirma que o daemon não encontrou o arquivo; verifique maiúsculas,
espaços e o diretório real do documento.

## Mermaid não aparece

- Mermaid exige JavaScript habilitado.
- O bloco precisa usar o fence `mermaid` exatamente.
- Erros de sintaxe aparecem no console do navegador.
- Blocos Mermaid não têm botão de copiar; use o lightbox.
- Se a página foi aberta como arquivo local (`file://`), o asset
  `/__assets/mermaid.min.js` não existe. Use a URL do daemon.

## Live reload não funciona

| Causa | Correção |
| --- | --- |
| Documento via `register` sem `--path` | Registre com `--path` |
| Arquivo não salvo | Salve no editor |
| Daemon encerrado | Rode a CLI de novo |
| SSE bloqueado | Verifique extensões/proxy |
| Pipe gerado uma vez | Editar o original não afeta a cópia |

Confirme que o daemon está vivo:

```bash
md-preview daemon status
```

## Navegador não abre

`--open-browser` usa `xdg-open` (Linux), `open` (macOS) ou `explorer.exe`
(Windows). Em ambientes sem um utilitário para abrir o navegador, a CLI avisa e
imprime a URL:

```text
md-preview: could not open a browser
```

Copie a URL manualmente. Em containers ou sessões remotas, o utilitário pode não
existir.

## Slug inesperado

Lembre das regras:

- a raiz é o topo do repositório Git que contém o arquivo;
- fora do Git, a raiz é `$HOME` (ou `/`);
- a extensão é removida;
- espaços e acentos viram `-`.

Se o slug não servir, use `register --slug`:

```bash
cat doc.md | md-preview register --stdin --slug meu/slug --path doc.md
```

## `/` retorna 404

É o comportamento esperado. Não existe documento raiz. Abra uma URL de slug
específica, por exemplo `http://127.0.0.1:8766/README`.

## Fontes indisponíveis

```bash
command -v fc-list
```

Se `fc-list` não existir, `GET /__fonts` responde com `available: false` e só
as seis famílias genéricas. Instale `fontconfig` ou use as genéricas. Para
invalidar o cache de 5 minutos:

```text
http://127.0.0.1:8766/__fonts?refresh=1
```

## `unsupported file extension`

Apenas `.md`, `.markdown` e `.mdc` são aceitos. Renomeie o arquivo ou gere o
conteúdo por `--pipe`.

## `--pipe` falha no terminal

`--pipe` exige stdin redirecionado:

```bash
echo '# teste' | md-preview --pipe
```

Rodar `md-preview --pipe` sem pipe resulta em
`--pipe requires piped stdin (received a TTY)`.

## Build falha

| Erro | Correção |
| --- | --- |
| `bun: command not found` | Instale Bun 1.x |
| Versão antiga de Bun | Use a versão do `packageManager` (1.4.3) |
| `dist/client` ausente | Rode `bun run build`, não só o binário |
| Typecheck falha | `bun run typecheck` mostra o projeto com erro |

```bash
bun --version
bun install
bun run build
```

Se nada resolver, limpe o daemon e repita:

```bash
md-preview daemon stop
rm -f "${XDG_STATE_HOME:-$HOME/.local/state}/md-preview/daemon.json"
```
