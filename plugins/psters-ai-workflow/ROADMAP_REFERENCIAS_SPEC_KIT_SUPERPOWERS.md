# Roadmap de Evolucao do psters-ai-workflow

## Objetivo

Consolidar, priorizar e transformar em backlog executavel tudo que pode ser importado/adaptado de:

- `references/spec-kit-main/`
- `references/superpowers-main/`

para elevar a qualidade do plugin `plugins/psters-ai-workflow/` em previsibilidade, profundidade de analise, qualidade de entrega e governanca de workflow.

---

## Resumo Executivo

As duas referencias se complementam muito bem:

- `spec-kit-main` fortalece **spec-first discipline** (clarify, checklist, analyze, handoffs, estrutura de tasks rastreavel).
- `superpowers-main` fortalece **execution discipline** (verification-before-completion, systematic-debugging, meta-skill de invocacao, loops de revisao com subagentes).

O maior ganho para o plugin vem de um plano em camadas:

1. corrigir inconsistencias internas do plugin (P0),
2. adicionar quality gates e fluxo de clarificacao/analise (P1),
3. profissionalizar execucao com subagentes e debug disciplinado (P2),
4. escalar com presets/extensoes/configurabilidade/testes (P3/P4).

---

## Principios de Adaptacao

- Adaptar, nao copiar literalmente: manter conventions do `psters-ai-workflow`.
- Preservar fluxo atual (`/brainstorm -> /plan -> /work-plan`) e evoluir incrementalmente.
- Priorizar melhorias com alto impacto e baixo risco primeiro.
- Cada fase precisa de criterios de aceitacao objetivos.

---

## Fase P0 (Critico) - Estabilizar o Core Atual

Foco: corrigir lacunas/inconsistencias internas antes de ampliar escopo.

### P0.1 Integrar `plan-sync` no fluxo real

- **Fonte/inspiracao:** coerencia de fluxo do spec-kit + disciplina de fechamento do superpowers
- **Problema atual:** `agents/docs/plan-sync.md` existe, mas nao eh invocado em `commands/work.md` e `commands/work-plan.md`.
- **Adaptacao:** invocar `plan-sync` junto com `doc-shepherd` nos pontos finais de `/work` e `/work-plan`.
- **Arquivos alvo:**  
  - `plugins/psters-ai-workflow/commands/work.md`  
  - `plugins/psters-ai-workflow/commands/work-plan.md`  
  - `plugins/psters-ai-workflow/agents/docs/plan-sync.md`
- **Impacto:** Alto
- **Esforco:** Baixo
- **Criterio de aceitacao:** toda execucao de work/work-plan atualiza automaticamente checklist e execution log do plano correspondente.

### P0.2 Remover referencia quebrada a `phase-micro-planner`

- **Problema atual:** agente citado sem existir.
- **Adaptacao:** substituir por agente/comando real ou remover referencia.
- **Arquivo alvo:** `plugins/psters-ai-workflow/agents/docs/plan-sync.md`
- **Impacto:** Alto
- **Esforco:** Muito baixo
- **Criterio de aceitacao:** zero referencias a agentes inexistentes.

### P0.3 Unificar comportamento de documentacao para Lambda

- **Problema atual:** `/work-plan` usa `lambda-doc-writer`, `/work` nao padroniza igual.
- **Adaptacao:** padrao unico para qualquer mudanca em Lambda.
- **Arquivos alvo:**  
  - `plugins/psters-ai-workflow/commands/work.md`  
  - `plugins/psters-ai-workflow/commands/work-plan.md`
- **Impacto:** Alto
- **Esforco:** Baixo
- **Criterio de aceitacao:** ambos comandos aplicam o mesmo gate de documentacao para Lambdas.

### P0.4 Guardrail de versionamento de release

- **Problema atual:** risco de drift entre `.cursor-plugin/plugin.json` e `.cursor-plugin/marketplace.json`.
- **Adaptacao:** release script validar/sincronizar ambos.
- **Arquivos alvo:**  
  - `plugins/psters-ai-workflow/scripts/release-plugin.sh`  
  - `plugins/psters-ai-workflow/.cursor-plugin/plugin.json`  
  - `plugins/psters-ai-workflow/.cursor-plugin/marketplace.json`
- **Impacto:** Alto
- **Esforco:** Baixo
- **Criterio de aceitacao:** release bloqueia automaticamente se versoes divergirem.

---

## Fase P1 (Altissima Prioridade) - Quality Gates de Planejamento

Foco: trazer os pilares mais valiosos do spec-kit.

### P1.1 Novo comando `/clarify` (inspirado em `templates/commands/clarify.md`)

- **Importar de:** `references/spec-kit-main/templates/commands/clarify.md`
- **Adaptar para:** antes de fechar plano, fazer perguntas de alto impacto (escopo, dados, NFR, edge cases, integrações).
- **Saida esperada:** arquivo de clarificacoes (ou secao no plano).
- **Arquivos alvo sugeridos:**  
  - `plugins/psters-ai-workflow/commands/clarify.md` (novo)  
  - `plugins/psters-ai-workflow/commands/plan.md`
- **Impacto:** Muito alto
- **Esforco:** Medio
- **Criterio de aceitacao:** planos novos incluem clarificacoes quando houver ambiguidade relevante.

### P1.2 Novo comando `/checklist` de qualidade de requisitos

- **Importar de:** `references/spec-kit-main/templates/commands/checklist.md`
- **Adaptar para:** checklists por dimensao (API, UX, Security, Data, Observability), focando qualidade de requisitos (nao implementacao).
- **Arquivos alvo sugeridos:**  
  - `plugins/psters-ai-workflow/commands/checklist.md` (novo)
- **Impacto:** Muito alto
- **Esforco:** Medio
- **Criterio de aceitacao:** cada plano relevante pode gerar checklist objetivo e rastreavel.

### P1.3 Novo comando `/analyze` cross-artifact

- **Importar de:** `references/spec-kit-main/templates/commands/analyze.md`
- **Adaptar para:** analise read-only de consistencia entre plano, docs de feature/modulo e tasks.
- **Detectar:** gaps, duplicacoes, requisitos sem task, task sem requisito, termos inconsistentes.
- **Arquivos alvo sugeridos:**  
  - `plugins/psters-ai-workflow/commands/analyze.md` (novo)
- **Impacto:** Muito alto
- **Esforco:** Medio
- **Criterio de aceitacao:** output padronizado com lista de inconsistencias e recomendacoes priorizadas.

### P1.4 Estrutura de task mais rastreavel (T001, [P], [USx], path)

- **Importar de:** `references/spec-kit-main/templates/commands/tasks.md`
- **Adaptar para:** padrao no `/plan` e `/work-plan`:
  - IDs sequenciais (`T001`, `T002`)
  - marcador `[P]` para paralelizavel
  - marcador `[US1]` opcional para story
  - caminho de arquivo por task
- **Arquivos alvo:**  
  - `plugins/psters-ai-workflow/commands/plan.md`  
  - `plugins/psters-ai-workflow/commands/work-plan.md`
- **Impacto:** Alto
- **Esforco:** Baixo
- **Criterio de aceitacao:** todo novo plano segue o formato padrao.

### P1.5 Handoffs explicitos entre comandos

- **Importar de:** `references/spec-kit-main/templates/commands/specify.md` (`handoffs`)
- **Adaptar para:** secoes de "proximo passo recomendado" com prompts prontos:
  - `/brainstorm -> /plan`
  - `/plan -> /work-plan`
  - `/work-plan -> /review -> /commit-changes`
- **Arquivos alvo:** todos os comandos principais em `plugins/psters-ai-workflow/commands/`
- **Impacto:** Alto
- **Esforco:** Baixo
- **Criterio de aceitacao:** cada comando termina com 2-4 proximos passos claros.

---

## Fase P2 (Alta Prioridade) - Disciplina de Execucao (Superpowers)

Foco: qualidade operacional durante implementacao e debug.

### P2.1 Skill `verification-before-completion`

- **Importar de:** `references/superpowers-main/skills/verification-before-completion/SKILL.md`
- **Adaptar para:** obrigar evidencia real antes de declarar conclusao (lint/test/build/comando relevante).
- **Arquivos alvo sugeridos:**  
  - `plugins/psters-ai-workflow/skills/verification-before-completion/SKILL.md` (novo)  
  - `plugins/psters-ai-workflow/commands/work.md`  
  - `plugins/psters-ai-workflow/commands/work-plan.md`
- **Impacto:** Muito alto
- **Esforco:** Baixo
- **Criterio de aceitacao:** respostas finais de execucao incluem evidencias verificaveis ou limitacoes explicitas.

### P2.2 Skill `systematic-debugging`

- **Importar de:** `references/superpowers-main/skills/systematic-debugging/SKILL.md`
- **Adaptar para:** 4 fases padrao:
  1. root-cause,
  2. pattern identification,
  3. hypothesis test,
  4. minimal fix + validation.
- **Arquivos alvo sugeridos:**  
  - `plugins/psters-ai-workflow/skills/systematic-debugging/SKILL.md` (novo)
- **Impacto:** Muito alto
- **Esforco:** Baixo/Medio
- **Criterio de aceitacao:** bugs relevantes passam por fluxo de debug estruturado.

### P2.3 Meta-skill de invocacao (`using-psters-workflow`)

- **Importar de:** `references/superpowers-main/skills/using-superpowers/SKILL.md`
- **Adaptar para:** regra mestre para detectar red flags e acionar skills adequadas automaticamente.
- **Arquivos alvo sugeridos:**  
  - `plugins/psters-ai-workflow/skills/using-psters-workflow/SKILL.md` (novo)
- **Impacto:** Alto
- **Esforco:** Medio
- **Criterio de aceitacao:** reducao de bypass de skills obrigatorias.

### P2.4 Loop de revisao de plano/especificacao com subagente

- **Importar de:**  
  - `references/superpowers-main/skills/writing-plans/plan-document-reviewer-prompt.md`  
  - `references/superpowers-main/skills/brainstorming/SKILL.md`
- **Adaptar para:** sempre revisar plano apos escrita com no maximo 2-3 iteracoes.
- **Arquivos alvo:**  
  - `plugins/psters-ai-workflow/commands/plan.md`  
  - opcional: novo agente `agents/workflow/plan-document-reviewer.md`
- **Impacto:** Alto
- **Esforco:** Medio
- **Criterio de aceitacao:** planos passam por revisao formal antes de virar execucao.

### P2.5 Fechamento de branch/worktree disciplinado

- **Importar de:** `references/superpowers-main/skills/finishing-a-development-branch/SKILL.md`
- **Adaptar para:** checklist de finalizacao com opcoes de merge/PR/keep/discard + cleanup de worktree.
- **Arquivos alvo sugeridos:**  
  - `plugins/psters-ai-workflow/skills/finishing-a-development-branch/SKILL.md` (novo)  
  - `plugins/psters-ai-workflow/skills/git-worktree/SKILL.md`
- **Impacto:** Medio/Alto
- **Esforco:** Baixo
- **Criterio de aceitacao:** encerramento de fluxo reduz branches/worktrees pendentes.

---

## Fase P3 (Media Prioridade) - Escalabilidade e Governanca Tecnica

Foco: tornar o plugin sustentavel a longo prazo.

### P3.1 Validacao de referencias cruzadas no validador
IGNORE NAO FACA ESSE

### P3.2 Harden de hooks (paths absolutos + payload validation)

- **Problema:** risco por path relativo e payload sem validacao robusta.
- **Arquivos alvo:**  
  - `plugins/psters-ai-workflow/hooks/track-edit.mjs`  
  - `plugins/psters-ai-workflow/hooks/doc-guard-stop.mjs`  
  - `plugins/psters-ai-workflow/hooks/commit-convention-reminder.mjs`  
  - `plugins/psters-ai-workflow/hooks/migration-atomic-reminder.mjs`
- **Impacto:** Medio/Alto
- **Esforco:** Medio
- **Criterio de aceitacao:** hooks estaveis em diferentes CWDs e com validacao defensiva.

### P3.3 DRY de regras operacionais repetidas

- **Problema:** AWS CLI/SSO e quality gates repetidos em varios arquivos.
- **Adaptacao:** centralizar blocos normativos em 1 fonte e referenciar.
- **Impacto:** Medio
- **Esforco:** Baixo/Medio
- **Criterio de aceitacao:** queda de duplicacao textual e menor drift de instrucoes.

### P3.4 Adicionar `deployment-verification-agent` e `agent-native-reviewer` no fluxo

- **Problema:** agentes existem, mas sao subutilizados.
- **Arquivos alvo:**  
  - `plugins/psters-ai-workflow/commands/review.md`  
  - `plugins/psters-ai-workflow/commands/work.md`
- **Impacto:** Medio
- **Esforco:** Baixo
- **Criterio de aceitacao:** review cobre riscos de deploy e paridade agent-native quando aplicavel.

### P3.5 Testes para hooks/scripts

- **Importar inspiracao de:** suites de testes em `references/superpowers-main/tests/`
- **Adaptar para:** testes de regressao para hooks e scripts criticos do plugin.
- **Impacto:** Medio/Alto
- **Esforco:** Medio
- **Criterio de aceitacao:** suite minima valida comportamento essencial antes de release.

---

## Fase P4 (Menor Prioridade, Alto Potencial) - Plataforma de Workflow

Foco: capacidades avancadas e customizacao por contexto/projeto.

### P4.1 Presets de workflow (por stack/cenario)

- **Importar de:** `references/spec-kit-main/presets/`
- **Adaptar para:** presets como:
  - `nestjs-api`,
  - `angular-feature`,
  - `lambda-pipeline`,
  - `bugfix-hotfix`.
- **Impacto:** Alto (longo prazo)
- **Esforco:** Alto
- **Criterio de aceitacao:** comandos geram output contextual por preset sem duplicar base.

### P4.2 Sistema de extensoes/hook points

- **Importar de:** `references/spec-kit-main/extensions/`
- **Adaptar para:** arquitetura de extensao para adicionar comportamentos sem alterar core.
- **Impacto:** Alto
- **Esforco:** Alto
- **Criterio de aceitacao:** ao menos 1 extensao piloto funcionando em hook point definido.

### P4.3 Companion visual opcional no brainstorm

- **Importar de:** `references/superpowers-main/skills/brainstorming/visual-companion.md` + scripts
- **Adaptar para:** somente quando contexto for realmente visual.
- **Impacto:** Medio
- **Esforco:** Alto
- **Criterio de aceitacao:** fluxo visual acionado sob demanda, sem custo desnecessario em cenarios textuais.

### P4.4 Telemetria basica opt-in de uso de comandos/agentes

- **Objetivo:** orientar evolucao por dados reais.
- **Impacto:** Medio
- **Esforco:** Alto
- **Criterio de aceitacao:** painel/log local anonimo com eventos basicos, sem violar privacidade.

---

## Backlog Consolidado (Importar + Adaptar)

Legenda:
- **Origem:** `SK` (spec-kit) / `SP` (superpowers) / `MIX`
- **Prioridade:** P0 > P1 > P2 > P3 > P4

| Prioridade | Iniciativa | Origem | Impacto | Esforco |
|---|---|---|---|---|
| P0 | Integrar `plan-sync` no `/work` e `/work-plan` | MIX | Alto | Baixo |
| P0 | Remover referencia `phase-micro-planner` | MIX | Alto | Muito baixo |
| P0 | Unificar fluxo de doc de Lambda | MIX | Alto | Baixo |
| P0 | Guardrail de versionamento release | MIX | Alto | Baixo |
| P1 | Novo `/clarify` | SK | Muito alto | Medio |
| P1 | Novo `/checklist` | SK | Muito alto | Medio |
| P1 | Novo `/analyze` | SK | Muito alto | Medio |
| P1 | Formato de tasks rastreavel (T001/[P]/[USx]/path) | SK | Alto | Baixo |
| P1 | Handoffs/proximos passos entre comandos | SK | Alto | Baixo |
| P2 | Skill `verification-before-completion` | SP | Muito alto | Baixo |
| P2 | Skill `systematic-debugging` | SP | Muito alto | Baixo/Medio |
| P2 | Meta-skill `using-psters-workflow` | SP | Alto | Medio |
| P2 | Loop de revisao de plano com subagente | SP | Alto | Medio |
| P2 | Fechamento disciplinado de branch/worktree | SP | Medio/Alto | Baixo |
| P3 | Validacao de referencias cruzadas no validador | MIX | Alto | Medio |
| P3 | Harden dos hooks | MIX | Medio/Alto | Medio |
| P3 | DRY de instrucoes repetidas | MIX | Medio | Baixo/Medio |
| P3 | Integrar agentes de review subutilizados | MIX | Medio | Baixo |
| P3 | Testes para hooks/scripts | SP | Medio/Alto | Medio |
| P4 | Presets por stack/cenario | SK | Alto (longo prazo) | Alto |
| P4 | Sistema de extensoes | SK | Alto (longo prazo) | Alto |
| P4 | Companion visual opcional | SP | Medio | Alto |
| P4 | Telemetria opt-in | MIX | Medio | Alto |

---

## Riscos de Adocao e Mitigacoes

### Risco 1 - Aumento de complexidade operacional

- **Onde aparece:** novos comandos (`/clarify`, `/checklist`, `/analyze`) + meta-skill
- **Mitigacao:** rollout progressivo por feature flag/manual opt-in nas fases iniciais.

### Risco 2 - Latencia/custo por uso intensivo de subagentes

- **Onde aparece:** loops de revisao e execucao multi-subagente
- **Mitigacao:** aplicar apenas em mudancas grandes/criticas; fast path mantido para tarefas simples.

### Risco 3 - Conflito com convencoes locais existentes

- **Onde aparece:** copiar regras de referencias sem ajuste
- **Mitigacao:** priorizar adaptacao por principio, manter `rules/` locais como fonte de verdade.

### Risco 4 - Fragmentacao de documentacao

- **Onde aparece:** criacao de novos comandos/skills sem padronizacao
- **Mitigacao:** gate no `validate-template.mjs` + checklist de consistencia de docs.

---

## Plano de Execucao Recomendado (Sequencia Pragmatica)

1. **Sprint 1 (P0 completo):** estabilizacao do core e coerencia de fluxo.
2. **Sprint 2 (P1 principal):** implementar `/clarify` + `/checklist` + formato de tasks + handoffs.
3. **Sprint 3 (P1 restante + P2 inicio):** implementar `/analyze` + `verification-before-completion`.
4. **Sprint 4 (P2 completo):** `systematic-debugging`, meta-skill e review loop.
5. **Sprint 5 (P3):** hardening (validador/hook/tests/DRY).
6. **Backlog estrategico (P4):** presets, extensoes e companion visual.

---

## Definicao de Sucesso

O roadmap sera considerado bem-sucedido quando:

- planos ficarem mais completos e menos ambiguos antes da execucao,
- work/work-plan tiverem evidencias verificaveis de conclusao,
- regressao por inconsistencia de docs/plans cair perceptivelmente,
- revisoes capturarem mais riscos antes de commit/release,
- o plugin evoluir sem aumentar fragilidade de manutencao.

---

## Referencias Mapeadas (Principais)

- `references/spec-kit-main/templates/commands/clarify.md`
- `references/spec-kit-main/templates/commands/checklist.md`
- `references/spec-kit-main/templates/commands/analyze.md`
- `references/spec-kit-main/templates/commands/specify.md`
- `references/spec-kit-main/templates/commands/tasks.md`
- `references/spec-kit-main/extensions/EXTENSION-API-REFERENCE.md`
- `references/spec-kit-main/presets/ARCHITECTURE.md`
- `references/superpowers-main/skills/using-superpowers/SKILL.md`
- `references/superpowers-main/skills/verification-before-completion/SKILL.md`
- `references/superpowers-main/skills/systematic-debugging/SKILL.md`
- `references/superpowers-main/skills/subagent-driven-development/SKILL.md`
- `references/superpowers-main/skills/writing-plans/plan-document-reviewer-prompt.md`
- `references/superpowers-main/skills/finishing-a-development-branch/SKILL.md`
- `references/superpowers-main/skills/using-git-worktrees/SKILL.md`
- `references/superpowers-main/skills/brainstorming/visual-companion.md`

