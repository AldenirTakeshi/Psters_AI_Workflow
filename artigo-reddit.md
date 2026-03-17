# Como eu uso IA atraves de um workflow repetivel e programavel, pra parar de resolver o mesmo erro toda semana

Eu nao criei esse workflow pra pagar de genio de prompt e nem pra fazer textao bonito. Criei porque eu tava perdendo tempo.

Era sempre o mesmo ciclo: eu explicava tudo pra IA, ela devolvia algo bonitinho, mas quando ia pro projeto real vinha problema. Modal com estilo diferente do resto, implementacao ignorando service que ja existia, padrao quebrado, retrabalho.

Antes eu fazia igual quase todo mundo: pedia X, Y e Z, via o resultado, pedia ajuste, e seguia. So que os mesmos erros voltavam toda hora.

A ideia desse fluxo nao nasceu pronta, foi evoluindo no uso real. Primeiro vieram alguns comandos, depois rules, depois skills. Quando o Cursor lancou sub agents eu integrei. Quando plugins apareceram, eu vi ideias como Compound Engineering, aproveitei o que fazia sentido e adaptei pra minha realidade.

A versao que ta no repo hoje eu uso de forma mais completa faz uns 2 meses, mas isso vem sendo refinado ha mais tempo e ainda vai mudar bastante.

O que mudou de verdade foi: parei de tratar IA como atalho e comecei a tratar como processo.

Hoje eu faco assim:
1. `/brainstorm` pra definir ideia, escopo, arquitetura e restricoes.
2. `/plan` pra quebrar em phases e tasks executaveis.
3. `/work-plan` pra implementar uma phase por vez.
4. `/review` pra revisar tudo, ajustar, testar e so depois commitar.

Se for coisa pequena, eu uso `/work`, mas sem pular revisao.

Outra virada de chave foi contexto. Eu nao deixo IA codar no escuro. Antes ela le docs, padroes do projeto e decisoes anteriores. Isso corta muita resposta generica.

Tambem parei de usar o mesmo modelo pra tudo:
- pra planejar, modelo mais forte
- pra executar, modelo medio costuma bastar

Isso equilibra custo e qualidade.

No repositorio tem commands, agents, skills e hooks. Foi feito para Cursor, mas da pra adaptar pra outra IDE sem drama.

Em resultado pratico: ja teve dia de eu entregar 25 tasks (pequenas, medias e grandes), porque o processo reduz retrabalho e evita ficar voltando nos mesmos erros.

Se alguem discordar, tranquilo. Critica tecnica e bem-vinda.
Se voce usa IA pesado no dia a dia e achar ponto fraco no workflow, ajusta e manda PR. Vou ler com prazer.

Mais detalhes aqui:
https://github.com/J-Pster/Psters_AI_Workflow

Se quiser o artigo mais longo/original, ta aqui:
https://www.linkedin.com/pulse/gasto-mais-de-r1500m%C3%AAs-em-ia-e-faturo-r40000m%C3%AAs-o-segredo-viana-fglwf
