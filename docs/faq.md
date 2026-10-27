---
title: Perguntas frequentes
sidebar_position: 21
description: Respostas curtas sobre instalação, daemon, temas, Mermaid, imagens, histórico e exportação.
---

## O md-preview está publicado no npm?

O `package.json` do projeto é `private: true`. A instalação normal é pelo
código-fonte, com `bun install` e `bun run build`, gerando `bin/md-preview`.
Veja [Instalação](/primeiros-passos/instalacao).

## Preciso de Node.js?

Não em tempo de execução: o binário é gerado pelo Bun. O Node pode existir na
máquina, mas o md-preview não depende dele para rodar.

## Preciso de um repositório Git?

Não. Sem Git, a raiz do slug passa a ser `$HOME` (ou `/`, para caminhos fora de
`$HOME`).

## Posso abrir mais de um documento?

Sim, registre vários. Cada um tem sua URL. A interface mostra **um por vez**, e o
Recent permite alternar. Não há abas internas.

## Por que `/` retorna 404?

Porque não existe documento raiz. O md-preview não gera índice nem escolhe um
arquivo padrão. Abra a URL de um slug registrado.

## Por que meu arquivo com acento virou `-`?

O slug mantém apenas `A-Z a-z 0-9 / . _ -`. Espaços e acentos são substituídos
por `-`. Use `register --slug` para escolher um slug manualmente.

## Onde ficam configuração e temas?

Em `${XDG_CONFIG_HOME:-~/.config}/md-preview/`. O comando `md-preview theme path`
imprime os caminhos exatos. Veja
[Caminhos de configuração](/referencia/caminhos).

## Como defino uma porta fixa?

```bash
MDPRV_PORT=9000 md-preview doc.md
```

Ou defina `"port": 9000` no `config.json`. A variável de ambiente vence o
arquivo.

## O daemon fica rodando para sempre?

Não. Ele encerra após 15 minutos ociosos por padrão. `MDPRV_IDLE` muda o limite,
e `md-preview daemon stop` encerra imediatamente.

## Por que o navegador não abriu?

Sem `--open-browser`, a CLI só imprime a URL. Esse é o comportamento padrão. Se
`--open-browser` falhar, o sistema não tem `xdg-open`, `open` ou
`explorer.exe` disponível.

## O tema mudou, mas o código continua com as cores antigas

Recarregue a página. A troca de tema via painel já recarrega; editar um
`theme.json` dispara o evento e recarrega a aba quando o tema atual é afetado.
Se não recarregar, valide o arquivo com `theme validate`.

## Posso usar um tema só para um documento?

Sim, com `?theme=` na URL ou `--theme` na CLI. O cookie é global para o
navegador; a query vence o cookie. A precedência está em
[Temas embutidos](/guias/temas-embutidos).

## Mermaid funciona offline?

Sim. A biblioteca é servida localmente em `/__assets/mermaid.min.js`. Não há CDN.
Mas o JavaScript precisa estar habilitado no navegador.

## Posso usar Mermaid sem JavaScript?

Não. O diagrama é renderizado no cliente.

## Como faço um PDF?

O md-preview não exporta PDF nem HTML. Use a impressão do navegador se precisar
de um PDF ocasional, ciente de que não é um recurso suportado. Para exportação
real, use uma ferramenta dedicada.

## Há busca entre documentos?

Não. Use a busca do editor ou `grep`. O Recent lista apenas documentos
registrados, sem índice de conteúdo.

## O Recent é mantido entre reinícios?

Não. Ele vive em memória no daemon e some ao reiniciar. Os arquivos continuam no
disco; basta registrá-los de novo.

## Posso usar imagens fora do diretório do documento?

Para caminhos relativos, não. O daemon só serve imagens dentro do diretório do
documento registrado e bloqueia travessia de diretórios e symlinks externos. URLs
absolutas são carregadas diretamente pelo navegador, se a CSP permitir.

## `--pipe` e arquivos podem ser combinados?

Não. `--pipe` lê stdin e não aceita arquivos posicionais na mesma invocação.

## O que acontece se eu editar o arquivo temporário do pipe?

O preview recarrega, porque o temporário é observado como qualquer documento.
Editar o arquivo original que gerou o pipe **não** afeta o preview.

## Posso registrar conteúdo sem gravar em disco?

Sim, com `register --stdin`. Sem `--path`, não há live reload nem imagens
relativas.

## O md-preview altera meus arquivos?

Não. Ele lê os documentos e grava só o estado, os temporários do `--pipe` e, na
primeira inicialização do daemon, os temas embutidos ausentes (quando
`seedThemes` está ativo). O binário e `dist/client` são artefatos de build.

## Como desinstalar?

```bash
md-preview daemon stop
rm -f "$HOME/.local/bin/md-preview"
rm -rf "${XDG_CONFIG_HOME:-$HOME/.config}/md-preview"
rm -rf "${XDG_STATE_HOME:-$HOME/.local/state}/md-preview"
rm -rf "${XDG_CACHE_HOME:-$HOME/.cache}/md-preview"
```

Faça backup dos temas de usuário antes de remover a configuração.

## Onde reporto um bug?

No repositório do projeto. Inclua a versão (`md-preview --version`), o sistema,
o comando executado e a saída de `md-preview daemon status`. Para falhas visuais,
informe o tema e se o problema ocorre em claro e escuro.
