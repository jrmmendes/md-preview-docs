---
title: Segurança
sidebar_position: 4
description: Loopback, validação de Host e Origin, token, CSP com nonce e imagens restritas.
---

O daemon é um servidor HTTP local, mas continua acessível pelo navegador. O
modelo assume que outras páginas e abas podem tentar falar com
`127.0.0.1:8766`.

| Ameaça | Defesa |
| --- | --- |
| Acesso pela rede | Escuta só em `127.0.0.1`, nunca `0.0.0.0` |
| DNS rebinding | `Host` precisa ser `127.0.0.1`, `localhost` ou `::1` |
| Página de outro site | `Origin` não-loopback recebe `403` |
| Registro ou desligamento forjado | `PUT /__register` e `POST /__shutdown` exigem token |
| Leitura do token por outros usuários | Estado gravado com permissão `0600` |
| Script injetado no Markdown | CSP com nonce por página |
| Imagem fora do documento | `/img/` restrito ao diretório registrado |

## Token

O daemon gera um token aleatório na inicialização e grava o estado:

```json
{ "pid": 48211, "port": 8766, "token": "..." }
```

O arquivo fica em `${XDG_STATE_HOME:-~/.local/state}/md-preview/daemon.json`. A
CLI o lê para autenticar. Se o arquivo for apagado com o daemon rodando, a CLI
deixa de conhecer o token: pare o processo e inicie outro.

## CSP

Cada página recebe uma `Content-Security-Policy` com nonce novo.

| Permitido | Bloqueado |
| --- | --- |
| Scripts e estilos com o nonce da página | `<script>` sem nonce |
| HTML inline e estilos inline | Atributos `onclick`, `onerror` e similares |
| Imagens locais, `data:`, `blob:` e URLs externas | `javascript:` em links e imagens |
| Fontes da mesma origem e `data:` | Folhas externas, frames, formulários e plugins |

Um `<script>alert(1)</script>` no Markdown existe no DOM, mas não executa.

## Imagens

`/img/<slug>/<caminho>` exige que o documento tenha sido registrado com um
caminho em disco, que a imagem esteja dentro do diretório do documento e que a
extensão seja de imagem conhecida. `..` e symlinks que apontam para fora do
diretório retornam erro.

## O que não está protegido

O md-preview não protege contra um processo local com os mesmos privilégios do
seu usuário, malware que leia o estado `0600`, bugs do navegador explorados por
HTML inline ou a exposição deliberada da porta por proxy reverso ou túnel.

Não publique a porta `8766`. Se precisar compartilhar um documento, use outro
meio.
