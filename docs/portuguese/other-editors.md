# Usando o Workflow Fora do Cursor

> **Recomendacao: use o Cursor.**
> Este workflow e distribuido como um plugin nativo do Cursor. No Cursor, os slash commands, hooks e sub-agentes funcionam automaticamente sem nenhuma configuracao manual. Quando o plugin chegar ao Cursor Marketplace, as atualizacoes serao entregues automaticamente dentro do proprio Cursor — sem precisar tocar no terminal.
>
> Enquanto o plugin ainda nao esta publicado no Marketplace, atualize fazendo pull do repositorio e rodando o script de instalacao novamente. O script e idempotente e seguro para rodar qualquer numero de vezes:
>
> ```bash
> git pull
> ./scripts/install-plugin-local.sh
> ```

Se voce nao pode usar o Cursor, esta pagina explica como adaptar o workflow para outras ferramentas de IA.

A metodologia central — brainstorm, plan, work-plan, review, commit — e agnostica de ferramenta. Cada comando e um arquivo markdown simples com um prompt estruturado. Esses arquivos funcionam em qualquer ferramenta que aceite prompts longos.

---

## Comparativo de funcionalidades

| Funcionalidade | Cursor | Claude Code | Windsurf | VS Code + Copilot |
|----------------|--------|-------------|----------|-------------------|
| Slash commands nativos | ✅ | ✅ | ❌ | ❌ |
| Regras / contexto global | ✅ | ✅ via `CLAUDE.md` | ✅ via `.windsurfrules` | ✅ via `copilot-instructions.md` |
| Hooks (guardrails de automacao) | ✅ | ❌ | ❌ | ❌ |
| Sub-agentes (pesquisa paralela) | ✅ | Parcial | ❌ | ❌ |
| Atualizacoes automaticas | ✅ Marketplace | Manual | Manual | Manual |

---

## Claude Code

[Claude Code](https://docs.anthropic.com/en/docs/claude-code) e a alternativa mais proxima do Cursor para este workflow. Ele usa o mesmo mecanismo de slash commands: arquivos markdown em `.claude/commands/` sao invocados com `/nome-do-comando`.

### Configuracao

1. Clone este repositorio:

   ```bash
   git clone https://github.com/J-Pster/Psters_AI_Workflow.git
   ```

2. No seu projeto, crie o diretorio de comandos e copie os comandos do workflow:

   ```bash
   mkdir -p .claude/commands
   cp /caminho/para/Psters_AI_Workflow/plugins/psters-ai-workflow/commands/*.md .claude/commands/
   ```

3. Crie ou adicione ao `CLAUDE.md` na raiz do seu projeto para carregar as regras do workflow como contexto global. Copie o conteudo das regras desejadas — comece com `context7-documentation.mdc` e `commits.mdc`:

   ```bash
   # Cria CLAUDE.md se nao existir
   touch CLAUDE.md
   ```

   Em seguida, cole o conteudo dos arquivos de regra desejados de `plugins/psters-ai-workflow/rules/` no `CLAUDE.md`.

### Uso

Rode o workflow no Claude Code exatamente como no Cursor:

```
/brainstorm adicionar autenticacao de usuario com JWT
/plan
/work-plan
/review
/commit-changes
```

### O que funciona no Claude Code

- **Todos os slash commands funcionam nativamente.** O formato de comando e identico ao Cursor.
- **Regras funcionam** via `CLAUDE.md` (arquivo de contexto global lido automaticamente).
- **Hooks nao funcionam.** O Claude Code nao tem sistema de hooks. A disciplina de documentacao e aplicada manualmente.
- **Sub-agentes sao parciais.** Comandos que disparam multiplos agentes de pesquisa os executam sequencialmente na conversa, em vez de em paralelo.

### Manter comandos atualizados

```bash
cd Psters_AI_Workflow && git pull
cp plugins/psters-ai-workflow/commands/*.md /caminho/para/seu-projeto/.claude/commands/
```

---

## Windsurf

[Windsurf](https://codeium.com/windsurf) (da Codeium) nao tem um sistema de slash commands nativo equivalente ao Cursor. Os comandos sao usados como prompts manuais no chat do Cascade.

### Configuracao

Copie o conteudo dos arquivos de regras para `.windsurfrules` na raiz do seu projeto:

```bash
touch .windsurfrules
# Cole o conteudo das regras desejadas de:
# plugins/psters-ai-workflow/rules/
```

### Uso

1. Abra o arquivo de comando para a etapa desejada. Eles ficam em:
   `plugins/psters-ai-workflow/commands/<comando>.md`

2. Copie o conteudo do arquivo e cole no chat do Cascade como prompt.

3. Siga a saida e avance para a proxima etapa.

### Sequencia recomendada

```
[Cole conteudo de brainstorm.md] -> [Cole conteudo de plan.md] -> [Cole conteudo de work-plan.md] -> [Cole conteudo de review.md] -> [Cole conteudo de commit-changes.md]
```

---

## VS Code + GitHub Copilot

O GitHub Copilot nao suporta slash commands personalizados equivalentes ao Cursor. Os comandos sao usados como prompts manuais no Copilot Chat.

### Configuracao

Adicione o contexto do workflow como instrucoes personalizadas:

1. Crie `.github/copilot-instructions.md` no seu projeto.
2. Cole o conteudo das regras desejadas de `plugins/psters-ai-workflow/rules/` nesse arquivo.

### Uso

1. Abra o arquivo de comando para a etapa: `plugins/psters-ai-workflow/commands/<comando>.md`
2. Copie o conteudo e cole no Copilot Chat.
3. Siga a saida e continue para a proxima etapa.

A metodologia funciona exatamente do mesmo jeito — o sistema de slash commands e apenas uma camada de conveniencia.

---

## Qualquer outra ferramenta de IA

Para qualquer ferramenta de IA que aceite prompts longos:

1. Abra o arquivo de comando para a etapa desejada: `plugins/psters-ai-workflow/commands/<comando>.md`
2. Copie o conteudo completo e cole como seu prompt.
3. Siga a saida e repita para a proxima etapa.

A sequencia do workflow nao depende da ferramenta:

```
brainstorm -> plan -> work-plan (por fase) -> review -> commit-changes
```

---

## Resumo

O caminho mais facil e o Cursor. Se voce nao pode usar o Cursor, **o Claude Code e a melhor alternativa** — ele preserva a experiencia de slash commands com configuracao minima. Para todas as outras ferramentas, use os arquivos de comando como prompts manuais: a metodologia continua funcionando, apenas a camada de conveniencia muda.
