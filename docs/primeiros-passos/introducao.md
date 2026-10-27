---
title: Introdução
sidebar_position: 1
description: O que é o md-preview, o problema que ele resolve, como funciona e por onde começar.
---

**md-preview** é uma CLI e um daemon local que renderizam Markdown no navegador.
Você aponta para um arquivo, recebe uma URL em `127.0.0.1:8766` e continua
editando: a cada salvamento, a página recarrega.

Diferente de um servidor de documentação, ele exibe **um documento por vez** e
não exige configuração de projeto. Diferente também de um visualizador de
editor, oferece temas completos, realce de sintaxe, diagramas Mermaid, árvores
de diretórios interativas e um painel de configurações.

<figure>
  <img src="/img/features/ui-overview.png" alt="Tela do md-preview com sumário à esquerda, documento ao centro e histórico Recent à direita" />
  <figcaption>Layout de três colunas: sumário, documento ativo e documentos recentes.</figcaption>
</figure>

## O problema que ele resolve

Escrever Markdown é simples; **conferir o resultado** costuma não ser. Editores
mostram uma aproximação, geradores de site exigem build, e visualizadores
genéricos ignoram particularidades como frontmatter, imagens relativas e blocos
Mermaid.

O md-preview ocupa o espaço entre o editor e o navegador:

- lê o arquivo direto do disco, sem etapa de build;
- resolve imagens relativas a partir do diretório do documento;
- aplica o mesmo tema em código, diagramas e interface;
- mantém o preview vivo enquanto você edita;
- roda inteiramente na sua máquina.

## Como funciona

1. A CLI valida os arquivos e calcula um **slug** a partir do caminho.
2. Se necessário, inicia o **daemon** em segundo plano e registra o documento.
3. O daemon renderiza o Markdown no servidor e serve a página em
   `http://127.0.0.1:8766/<slug>`.
4. Um único canal SSE (`/__events`) avisa o navegador sobre mudanças no disco,
   novos documentos e temas.

Sem `--open-browser`, a CLI só imprime uma URL por arquivo. Esse é o
comportamento padrão e o que permite integrar o md-preview a scripts e editores.

## O que está incluído

| Área | Recursos |
| --- | --- |
| Entrada | Arquivos `.md`, `.markdown`, `.mdc`; múltiplos arquivos; stdin com `--pipe`; registro via `register` |
| Markdown | GFM, tabelas, listas de tarefas, notas de rodapé, HTML inline, linkify, typographer, âncoras |
| Código | Shiki com 9 linguagens e saída dupla clara/escura |
| Diagramas | Mermaid renderizado no navegador, lightbox com zoom e arrastar |
| Estrutura | Tree fences interativas, frontmatter, imagens relativas |
| Temas | 9 embutidos, temas de usuário em JSON, `auto` por `prefers-color-scheme` |
| Interface | TOC, Recent, fontes, seis loaders, modo zen, largura ajustável |
| Operação | Daemon com início automático, inatividade de 15 min, arquivo de estado `0600` e token |

:::tip[Primeiro contato]
Se você só quer ver funcionando, siga o [Início rápido](/primeiros-passos/inicio-rapido).
Para entender o modelo mental antes de usar, leia [Conceitos](/primeiros-passos/conceitos).
:::

## O que ele não é

O md-preview não é um gerador de site, não faz busca de texto completo entre
documentos e não exporta PDF ou HTML. Não há rota raiz: `/` responde `404`,
porque não existe "documento inicial". A lista completa está em
[Limitações](/limitacoes).

## Comece por aqui

<div className="card-grid">
  <a href="/primeiros-passos/instalacao">
    <strong>Instalação</strong>
    <span>Compile o binário com Bun e coloque no PATH.</span>
  </a>
  <a href="/primeiros-passos/inicio-rapido">
    <strong>Início rápido</strong>
    <span>Do arquivo vazio ao preview com live reload em cinco minutos.</span>
  </a>
  <a href="/guias/markdown">
    <strong>Markdown suportado</strong>
    <span>O que renderiza, o que não renderiza e como usar cada extensão.</span>
  </a>
  <a href="/referencia/cli">
    <strong>Referência da CLI</strong>
    <span>Todos os comandos, opções e códigos de saída.</span>
  </a>
</div>
