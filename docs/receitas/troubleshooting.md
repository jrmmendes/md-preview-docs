---
title: Solução de problemas
sidebar_position: 4
description: Porta ocupada, token desconhecido, tema, Mermaid, imagens e comando não encontrado.
---

Comece pelas três verificações:

```bash
md-preview --version
md-preview daemon status
md-preview theme list
```

## Porta ocupada

```text
md-preview: daemon did not become ready on 127.0.0.1:8766
```

Veja quem está na porta:

```bash
ss -ltnp | grep 8766
```

Se for outro daemon do md-preview, pare-o; se for outro programa, use outra
porta:

```bash
md-preview daemon stop
MDPRV_PORT=8767 md-preview doc.md
```

## Token desconhecido

```text
md-preview: a daemon is running without a known token; restart it with `md-preview daemon stop`
```

Isso acontece quando o daemon está na porta configurada, mas o arquivo de estado
foi apagado ou substituído. A CLI não tem como autenticar sem o token.

```bash
md-preview daemon stop
md-preview doc.md
```

Se o processo continuar, encerre pelo PID e apague o estado:

```bash
pgrep -af "__serve"
kill <pid>
rm -f "${XDG_STATE_HOME:-$HOME/.local/state}/md-preview/daemon.json"
```

## Tema não aplicado

Confirme que o tema existe e é válido:

```bash
md-preview theme list | grep meu-tema
md-preview theme validate ~/.config/md-preview/themes/meu-tema.json
```

Lembre da precedência: `?theme=` vence o cookie, que vence `config.json` e
`MDPRV_THEME`. Um tema inválido é ignorado e o anterior continua valendo. O
catálogo com erros está em:

```bash
curl -s http://127.0.0.1:8766/__themes
```

## Mermaid não aparece

- o fence precisa ser exatamente `mermaid`;
- o JavaScript do navegador precisa estar habilitado;
- a página precisa vir do daemon, não de um arquivo `file://`;
- erros de sintaxe aparecem no console do navegador.

O asset é servido em `/__assets/mermaid.min.js`. Blocos Mermaid não têm botão de
copiar; use o lightbox.

## Imagem relativa bloqueada

| Verificação | Detalhe |
| --- | --- |
| O documento tem caminho? | `register --stdin` sem `--path` não tem diretório |
| A imagem está dentro do diretório? | `..` e symlinks externos retornam `404` |
| A extensão é de imagem? | Extensões desconhecidas são recusadas |
| O caminho é relativo? | URLs absolutas não passam por `/img/` |

```bash
curl -I "http://127.0.0.1:8766/img/docs/guia/assets/foto.png"
```

Um `404` confirma que o daemon não achou o arquivo; confira maiúsculas, espaços
e o diretório real do documento.

## `command not found`

`~/.local/bin` não está no `PATH` do shell ou do processo que chamou a CLI
(editores gráficos costumam ter outro ambiente):

```bash
export PATH="$HOME/.local/bin:$PATH"
command -v md-preview
```

Use o caminho completo `~/.local/bin/md-preview` em mapeamentos e tarefas de
editor. Se o binário não existe, repita a [Instalação](/primeiros-passos/instalacao).

Mais respostas curtas estão no [FAQ](/faq).
