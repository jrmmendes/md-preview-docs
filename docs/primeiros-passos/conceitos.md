---
title: Conceitos
sidebar_position: 4
description: Slug, registro, daemon e documento ativo — o modelo mental por trás do md-preview.
---

Quatro conceitos explicam quase todo o comportamento do md-preview: **slug**,
**registro**, **daemon** e **documento ativo**.

## Slug

O slug é a identidade do documento na URL. Ele deriva do caminho absoluto:

1. a raiz é o topo do repositório Git que contém o arquivo; se não houver Git, é
   `$HOME` (ou `/`, para caminhos fora de `$HOME`);
2. o caminho relativo é calculado a partir dessa raiz;
3. a extensão (`.md`, `.markdown`, `.mdc`) é removida;
4. espaços viram `-`; caracteres fora de `A-Z a-z 0-9 / . _ -` também viram `-`;
5. barras repetidas são colapsadas e a barra inicial é removida.

| Caminho do arquivo | Raiz | Slug | URL |
| --- | --- | --- | --- |
| `/home/ana/projeto/docs/guia.md` | `/home/ana/projeto` (Git) | `docs/guia` | `/docs/guia` |
| `/home/ana/projeto/README.markdown` | `/home/ana/projeto` (Git) | `README` | `/README` |
| `/home/ana/notas/ideia.md` | `/home/ana` | `notas/ideia` | `/notas/ideia` |
| `/home/ana/notas/meu guia rápido.md` | `/home/ana` | `notas/meu-guia-r-pido` | `/notas/meu-guia-r-pido` |
| `/etc/exemplo.md` | `/` | `etc/exemplo` | `/etc/exemplo` |

Consequências úteis:

- mover o repositório não muda o slug, porque a raiz acompanha o arquivo;
- o mesmo arquivo aberto por caminho relativo, absoluto ou symlink gera o mesmo
  slug, pois o md-preview resolve o caminho real;
- acentos são substituídos por `-`, não transliterados.

:::warning[Slug não dá acesso a arquivos]
A URL não expõe o sistema de arquivos. O daemon só serve documentos que foram
explicitamente registrados. Qualquer slug desconhecido — incluindo `/` — responde
`404`.
:::

`register --slug` permite escolher o slug manualmente, independentemente do
caminho:

```bash
echo '# Rascunho' | md-preview register --stdin --slug receitas/rascunho
```

Documentos vindos de `--pipe` usam outro formato: o slug é o nome do arquivo
temporário, incluindo a extensão — por exemplo `temp-3f2c...-a1.md`.

## Registro

**Registrar** significa entregar conteúdo ao daemon. Há três origens:

| Origem | Comando | Tempo de vida | Live reload |
| --- | --- | --- | --- |
| Arquivo | `md-preview arquivo.md` | Enquanto o daemon viver | Sim, observa o disco |
| Conteúdo via stdin | `--pipe` | Enquanto o daemon viver | Sim, observa o temporário |
| Conteúdo avulso | `register --stdin` | Enquanto o daemon viver | Só com `--path` |

Registrar não abre o navegador. Quem abre é `--open-browser`, uma única vez,
depois que todos os arquivos foram registrados.

## Daemon

O daemon é um servidor HTTP local que renderiza e serve as páginas. A CLI o
inicia automaticamente; você não precisa gerenciá-lo no dia a dia.

| Propriedade | Valor |
| --- | --- |
| Endereço | `127.0.0.1` (só loopback) |
| Porta padrão | `8766` (`MDPRV_PORT`) |
| Início automático | Sim, na primeira invocação que precisa dele |
| Inatividade | 15 minutos sem atividade (`MDPRV_IDLE`) |
| Arquivo de estado | `${XDG_STATE_HOME:-~/.local/state}/md-preview/daemon.json` |
| Conteúdo do arquivo | `{ pid, port, token }`, gravado com permissão `0600` |
| Token | Gerado a cada início; exigido por `PUT /__register` e `POST /__shutdown` |

Ciclo de vida:

```bash
md-preview daemon start    # sobe agora, se ainda não estiver rodando
md-preview daemon status   # código 0 rodando, código 1 parado
md-preview daemon stop     # encerra e remove o estado
```

Se o arquivo de estado sumir enquanto o daemon roda, a CLI deixa de conseguir
autenticar. Pare o processo antigo e inicie outro.

## Documento ativo

O preview exibe **um documento por vez**. Cada slug tem sua própria URL, e a
navegação entre documentos acontece por links normais.

- Ao registrar vários arquivos, todos ficam disponíveis, mas o navegador abre
  apenas o primeiro quando `--open-browser` é usado.
- A coluna **Recent** lista os documentos registrados, do mais recente para o
  mais antigo, com o título do frontmatter ou o nome do arquivo.
- O daemon mantém o histórico **em memória**. Reiniciar o daemon limpa a lista.
- A interface não usa abas internas: o documento ativo é o da URL atual.

## Eventos SSE

Toda atualização em tempo real passa por um único endpoint, `GET /__events`. O
navegador abre uma conexão e recebe eventos nomeados:

| Evento | Quando ocorre | Efeito |
| --- | --- | --- |
| `snapshot` | Ao conectar | Envia versões e lista de slugs |
| `version` | Conteúdo do documento muda no disco | Recarrega a página atual |
| `slugs` | Documento é registrado | Atualiza o Recent |
| `themes` | Tema de usuário é criado, editado ou removido | Recarrega se o tema atual mudou |
| `ping` | A cada 20 segundos | Mantém a conexão viva |

O mesmo canal alimenta o Recent, o live reload e a atualização de temas. Não há
polling de conteúdo.

## Como as peças se encaixam

```text
arquivo no disco
      │
      ▼
CLI ──registra──▶ daemon ──renderiza──▶ HTML + scripts de hidratação
      │              │                        │
      │              ├── SSE /__events ◀──────┘
      │              │        │
      │              │        └── recarrega / atualiza Recent
      │              └── estado { pid, port, token }
      └── imprime http://127.0.0.1:8766/<slug>
```

Agora que o modelo está claro, siga para [Markdown suportado](/guias/markdown)
ou para a [Referência da CLI](/referencia/cli).
