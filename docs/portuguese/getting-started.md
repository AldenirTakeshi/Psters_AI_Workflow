# Comece em 10 Minutos

Este guia ajuda voce a executar o workflow de ponta a ponta pela primeira vez.

## 1) Instalar plugin localmente

1. `./scripts/install-plugin-local.sh`
2. Reinicie o Cursor (ou recarregue a janela).

## 2) Comece com uma task real

Use uma feature/fix pequena, mas real, do backlog.

## 3) Execute o fluxo de comandos

1. `/brainstorm` para definir escopo, arquitetura e restricoes.
2. `/plan` para criar fases e tarefas executaveis.
3. `/work-plan` para executar uma fase por chat.
4. `/review` para encontrar riscos/regressoes e corrigir.
5. `/commit-changes` para gerar commits limpos e estruturados.

## 4) Quando usar `/work`

Use `/work` para:

- fixes pequenos
- ajustes menores
- mudancas de follow-up fora de plano formal

`/work` continua lendo docs primeiro e atualizando docs no proprio fluxo.

## 5) `/doc` vs `/compound`

- `/work` e `/work-plan` ja atualizam docs por padrao.
- Use `/doc` quando quiser forcar atualizacao de documentacao tecnica por escopo.
- Use `/compound` quando quiser forcar registro de aprendizado (problema/solucao ou padrao reutilizavel).

## 6) Validar setup do plugin

Execute:

- `node scripts/validate-template.mjs`
