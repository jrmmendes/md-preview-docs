---
title: Segurança e daemon
sidebar_position: 7
description: Loopback, validação de Host e Origin, token, CSP com nonce, imagens restritas e o modelo de ameaças.
---

O md-preview é um serviço local, mas continua sendo um servidor HTTP acessível
pelo navegador. O modelo de segurança assume que **outras páginas e outras abas**
podem tentar falar com `127.0.0.1:8766`.

## Superfície de rede

| Controle | Comportamento |
| --- | --- |
| Escuta | Só `127.0.0.1` |
| Host permitido | `127.0.0.1`, `localhost`, `::1` |
| Origin não-loopback | Rejeitado com `403` |
| Métodos | `GET`/`HEAD` para conteúdo; `PUT`/`POST` apenas nos endpoints internos |

A validação de `Host` bloqueia **DNS rebinding**: um domínio externo que resolva
para `127.0.0.1` não consegue usar o daemon como se fosse local. A validação de
`Origin` impede que uma página aberta em outro site faça requisições ao daemon.

O daemon não escuta em `0.0.0.0`. Não há TLS porque não há tráfego saindo da
máquina.

## Token de operação

Na inicialização, o daemon gera um token aleatório e grava o estado:

```json
{
  "pid": 48211,
  "port": 8766,
  "token": "..."
}
```

O arquivo fica em `${XDG_STATE_HOME:-~/.local/state}/md-preview/daemon.json`, com
permissão **`0600`**. A CLI lê esse arquivo para se autenticar.

| Endpoint | Método | Token | Sem token |
| --- | --- | --- | --- |
| `/__register` | `PUT` | Obrigatório | `401` |
| `/__shutdown` | `POST` | Obrigatório | `401` |
| `/__health` | `GET` | Não | `200` |
| `/__events` | `GET` | Não | `200` |
| `/__themes` | `GET` | Não | `200` |
| `/__fonts` | `GET` | Não | `200` |

Somente as operações que **alteram estado** exigem o token. Leitura de documentos
já registrados continua disponível para a própria página.

:::warning[Não apague o estado com o daemon rodando]
Sem o arquivo, a CLI não conhece o token e não consegue registrar nem encerrar o
daemon. Nesse caso, finalize o processo antigo e inicie outro.
:::

## CSP com nonce

Cada página recebe uma `Content-Security-Policy` com um nonce novo. O objetivo é
permitir HTML rico no Markdown sem permitir execução arbitrária de script.

| Permitido | Bloqueado |
| --- | --- |
| Scripts e estilos com o nonce da página | `<script>` sem nonce |
| HTML inline de formatação e estilos inline | Atributos `onclick`, `onerror` e similares |
| Imagens locais, `data:`, `blob:` e URLs externas | `javascript:` em links e imagens |
| Fontes da mesma origem e `data:` | Folhas de estilo externas |
| — | Frames externos, formulários e plugins |

Por isso um `<script>alert(1)</script>` no Markdown não executa: a tag existe no
DOM, mas a CSP impede a execução.

## Imagens

Imagens relativas são servidas por `/img/<slug>/<caminho>` com três restrições:

1. o documento precisa ter sido registrado com um caminho em disco;
2. a imagem precisa estar **dentro do diretório do documento**;
3. a extensão precisa ser de imagem conhecida.

O caminho é normalizado e symlinks são resolvidos. Tentativas de travessia de
diretórios (`../`) e symlinks que apontam para fora do diretório retornam erro,
não conteúdo.

## Fontes do Google

O proxy de fontes é opcional e restrito:

- só busca a folha de estilo `css2` do Google;
- só baixa `.woff2` de `fonts.gstatic.com`;
- reescreve as URLs para o próprio daemon;
- a CSP permanece `font-src 'self' data:`.

A página nunca abre conexão direta com o Google.

## O que ainda pode acontecer

O md-preview **não** protege contra:

- um processo local com os mesmos privilégios do seu usuário;
- malware que leia o arquivo de estado `0600`;
- HTML inline malicioso que explore um bug do navegador;
- exposição deliberada da porta via proxy reverso ou túnel.

O último ponto importa: se você publicar a porta `8766`, estará expondo um
serviço pensado para loopback. Não faça isso.

## Boas práticas

- mantenha o daemon em `127.0.0.1`;
- não compartilhe o conteúdo de `daemon.json`;
- evite executar o md-preview como root;
- revise HTML inline em documentos de terceiros;
- pare o daemon quando não estiver usando (`md-preview daemon stop`).

Para os endpoints em detalhe, veja [Daemon e endpoints](/referencia/daemon).
