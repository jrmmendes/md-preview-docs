---
title: FAQ
sidebar_position: 5
description: Respostas curtas e a lista do que o md-preview não faz.
---

## Está publicado no npm?

Não. O `package.json` é `private: true`. A instalação usa o binário da release,
como na [Instalação](/primeiros-passos/instalacao).

## Há binário para macOS ou Windows?

Não. As releases publicam `md-preview-linux-x64` e `md-preview-linux-arm64`.
Nesses sistemas, [compile do código-fonte](/primeiros-passos/compilacao).

## Preciso de Node.js?

Não em tempo de execução: o binário é compilado pelo Bun e não depende do Node.

## Preciso de um repositório Git?

Não. Sem Git, o slug é relativo a `$HOME` (ou `/`).

## Posso abrir mais de um documento?

Sim, registre vários em uma chamada. Cada um tem sua URL; a interface mostra um
por vez e o Recent alterna entre eles.

## Por que `/` retorna 404?

Porque não existe documento raiz nem índice automático. Abra a URL de um slug
registrado.

## Por que meu arquivo com acento virou `-`?

O slug mantém apenas `A-Z a-z 0-9 / . _ -`. Use `register --slug` para escolher
um slug manualmente.

## Onde ficam configuração e temas?

Em `${XDG_CONFIG_HOME:-~/.config}/md-preview/`. `md-preview theme path` imprime
os caminhos. Veja [Caminhos](/referencia/caminhos).

## Como defino uma porta fixa?

`MDPRV_PORT=9000 md-preview doc.md` ou `"port": 9000` no `config.json`. A
variável vence o arquivo.

## O daemon fica rodando para sempre?

Não. Ele encerra após 15 minutos ociosos. `MDPRV_IDLE` muda o limite e
`md-preview daemon stop` encerra agora.

## Por que o navegador não abriu?

Sem `--open-browser`, a CLI só imprime a URL. Se a flag falhar, o sistema não
tem `xdg-open`, `open` ou `explorer.exe`; copie a URL manualmente.

## Como faço um PDF?

O md-preview não exporta PDF nem HTML. A impressão do navegador gera um PDF
ocasional, mas não é um formato suportado.

## Há busca entre documentos?

Não. Use a busca do editor ou `grep`. O Recent lista apenas documentos
registrados, sem índice de conteúdo.

## O Recent é mantido entre reinícios?

Não. Ele vive em memória no daemon. Os arquivos continuam no disco; basta
registrá-los de novo.

## Posso usar imagens fora do diretório do documento?

Para caminhos relativos, não. O daemon só serve imagens dentro do diretório do
documento registrado. URLs absolutas são carregadas pelo navegador.

## `--pipe` e arquivos podem ser combinados?

Não. `--pipe` lê stdin e recusa arquivos posicionais na mesma invocação.

## O md-preview altera meus arquivos?

Não. Ele lê os documentos e grava só estado, temporários do `--pipe` e, na
primeira inicialização, os temas embutidos ausentes (se `seedThemes` estiver
ativo).

## O que o md-preview não faz

| Ausência | Impacto |
| --- | --- |
| Busca de texto completo | Encontrar conteúdo é manual |
| Exportação para PDF ou HTML | Compartilhar exige outra ferramenta |
| Admonitions (`:::note`), KaTeX e emoji | Markdown mais simples |
| Mermaid sem JavaScript | Diagramas aparecem como texto |
| Realce fora de nove linguagens | Outros fences ficam sem cor |
| Rota raiz | Toda visita precisa de um slug |
| Histórico persistente | Recent some ao reiniciar |
| Abas internas | Um documento por URL |
| Imagens fora do diretório | Sem recursos compartilhados |
| Acesso remoto, TLS e colaboração | Uso restrito à mesma máquina |
| Interface traduzida | Rótulos fixos, majoritariamente em inglês |

Não exponha a porta `8766`: o daemon foi feito para loopback.
