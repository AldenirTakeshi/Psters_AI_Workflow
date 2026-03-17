# Cursor no Windows + WSL: plugin nao aparece

Se voce instalou o plugin do workflow pelo **terminal WSL**, mas o Cursor no **Windows** nao mostra o plugin nem os comandos, esta pagina explica o motivo e como resolver.

## Por que acontece

- O **Cursor no Windows (janela local)** carrega configuracao, plugins e skills do **perfil de usuario do Windows**, em geral:
  - `%USERPROFILE%\.cursor\` (ex.: `C:\Users\SeuNome\.cursor\`)
- O script de instalacao copia o plugin para:
  - `$HOME/.cursor/plugins/local/` — e quando voce roda **dentro do WSL**, `$HOME` e o home **Linux** (ex.: `/home/voce/`).

Sao **sistemas de arquivos diferentes**. O app Windows nao le o `~/.cursor` da sua distro Linux por padrao, entao o plugin parece “sumir” mesmo com a instalacao ok no WSL.

## Sintomas

- `./scripts/install-plugin-local.sh` terminou sem erro.
- Os arquivos existem no WSL em `~/.cursor/plugins/local/psters-ai-workflow/`.
- O Cursor aberto como app Windows **nao** lista o plugin nem expoe `/brainstorm`, `/work`, etc.

## Solucao recomendada: Cursor ligado ao WSL (Remote-WSL)

Use o mesmo ambiente onde o plugin foi instalado (home Linux).

1. No Cursor, clique no **indicador remoto** no **canto inferior esquerdo** (costuma ser verde/azul).
2. Escolha **Connect to WSL** (ou sua distro), **ou**, num shell WSL, rode:
   - `cursor .`  
   na pasta do projeto para o Cursor abrir **no contexto WSL**.
3. Com a janela conectada ao WSL, o Cursor usa o `~/.cursor` do Linux — plugin e skills devem carregar.
4. Se precisar: **Developer: Reload Window** ou reinicie o Cursor mantendo a janela conectada ao WSL.

**Resumo:** instalou pelo WSL → use **janela do Cursor conectada ao WSL** nesse projeto.

## Alternativa: Cursor so Windows (plugin no perfil Windows)

Se quiser o plugin apenas no Cursor **local Windows** (sem Remote-WSL):

- Rode `./scripts/install-plugin-local.sh` num shell cujo **`HOME` seja o perfil Windows** — por exemplo **Git Bash** no Windows com o repo clonado em caminho Windows (ex.: `C:\Users\Voce\Repos\...`). O script instalara em `%USERPROFILE%\.cursor\plugins\local\`.
- Ou copie manualmente a pasta `plugins/psters-ai-workflow` do repo para `%USERPROFILE%\.cursor\plugins\local\psters-ai-workflow\` (mesmo layout que o script gera).

Se tambem usar WSL, voce pode acabar com **duas copias** — escolha um ambiente principal ou reinstale nos dois depois de atualizar.

## Veja tambem

- [Comece em 10 minutos](getting-started.md) — instalacao e primeiro uso
- [Usando o workflow fora do Cursor](other-editors.md)
