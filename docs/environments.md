# Environments

Pick **one** per paper, then delete the other tree (`src/python` or `src/matlab`) and the unused Make lines.

## Python
- Version: 3.10+. Dependencies are declared in `src/python/pyproject.toml` (runtime: numpy, scipy, matplotlib, control; dev: pytest, ruff).
- Setup: `make env`, then activate `.venv`.
- Entry point: `python -m paperlib.run` (writes `figures/*.pdf` and `results/*.csv`).
- Pin exact versions for the camera-ready: `pip freeze > requirements.lock.txt` and commit it.

## MATLAB / Simulink
- Version: record the exact release you used here: `R20XXx`.
- Toolboxes: list each one (e.g. Control System Toolbox, Optimization Toolbox). Verify with `license('test', ...)` in `run_all.m`.
- Entry point: `src/matlab/run_all.m` (calls `startup.m` for paths, seeds the RNG, writes `figures/` and `results/`).
- Simulink models in `src/matlab/models/`; save as `.slx`, and set the model's fixed-step solver and step size explicitly. Keep generated `slprj/` and `*.slxc` out of git.

- CI: `.github/workflows/matlab.yml` installs MATLAB on a GitHub runner. Free for **public** repos; a private repo needs MathWorks batch licensing (token as a secret) or a self-hosted runner. List every toolbox in its `products:` field.

## LaTeX
- Class `IEEEtran`, BibTeX. Build: `make paper`. CI builds on every push.
- Switch `[conference]` to `[journal]` in `writeup/main.tex` for transactions.
