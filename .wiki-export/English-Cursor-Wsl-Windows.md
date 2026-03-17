> Source: `docs/english/cursor-wsl-windows.md`

# Cursor on Windows + WSL: plugin not visible

If you installed the workflow plugin from a **WSL terminal** but Cursor on **Windows** does not show the plugin or commands, this page explains why and how to fix it.

## Why this happens

- **Cursor on Windows (local window)** loads configuration, plugins, and skills from the **Windows user profile**, typically:
  - `%USERPROFILE%\.cursor\` (e.g. `C:\Users\YourName\.cursor\`)
- The install script copies the plugin to:
  - `$HOME/.cursor/plugins/local/` — and when you run it **inside WSL**, `$HOME` is your **Linux** home (e.g. `/home/you/`).

Those are **different filesystems**. The Windows app does not read `~/.cursor` inside your Linux distro by default, so the plugin looks “missing” even though the install succeeded in WSL.

## Symptoms

- `./scripts/install-plugin-local.sh` completed without errors.
- Files exist under WSL at `~/.cursor/plugins/local/psters-ai-workflow/`.
- Cursor opened as a normal Windows app does **not** list the plugin or expose `/brainstorm`, `/work`, etc.

## Recommended fix: use Cursor attached to WSL (Remote-WSL)

Use the same environment where the plugin was installed (Linux home).

1. In Cursor, click the **remote indicator** in the **bottom-left** (often green/blue).
2. Choose **Connect to WSL** (or pick your distro), **or** from a WSL shell run:
   - `cursor .`  
   from your project directory so Cursor opens that folder **in the WSL context**.
3. After the window is connected to WSL, Cursor uses the Linux `~/.cursor` tree — your plugin and skills should load.
4. If needed: **Developer: Reload Window** or restart Cursor while still in the WSL-connected window.

**Rule of thumb:** If you install via WSL, **work in a WSL-connected Cursor window** for that project.

## Alternative: Windows-native Cursor (plugin under Windows profile)

If you want the plugin only in **Windows-local** Cursor (no Remote-WSL):

- Run `./scripts/install-plugin-local.sh` from a shell whose **`HOME` is your Windows user profile** — for example **Git Bash** on Windows with the repo cloned on a Windows path (e.g. `C:\Users\You\Repos\...`). The script will install to `%USERPROFILE%\.cursor\plugins\local\`.
- Or manually copy the `plugins/psters-ai-workflow` folder from the repo into `%USERPROFILE%\.cursor\plugins\local\psters-ai-workflow\` (same layout the script produces).

You would then maintain **two copies** if you also use WSL — pick one primary environment or repeat install in both places after updates.

## Related

- [Getting started](getting-started.md) — install and first run
- [Using the workflow outside Cursor](other-editors.md)
