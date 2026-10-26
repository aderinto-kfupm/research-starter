# Onboarding

Goal: from clone to a built paper and a reproduced figure in under 30 minutes.

## 1. Prerequisites
- Git, a TeX distribution with `latexmk` (MiKTeX or TeX Live), `make` (Git Bash on Windows is fine).
- Python 3.10+ **or** MATLAB R2023b+ (+ toolboxes listed in [environments.md](environments.md)).

## 2. Build the paper
```bash
make paper     # produces writeup/main.pdf
```

## 3. Reproduce the results
```bash
make env && make reproduce     # Python
make matlab                    # MATLAB
```
Figures land in `figures/`; numbers in `results/`.

## 4. Read in this order
1. `writeup/main.tex` (abstract, then contributions in the introduction).
2. [methodology.md](methodology.md): notation, assumptions, and mapping from equations to code.
3. `src/` entry point: `src/python/paperlib/run.py` or `src/matlab/run_all.m`.
4. `reviews/INDEX.md`: what reviewers already said and how we responded.

## 5. Extending the work
- Add an experiment: new function in `src/`, call it from the entry point, write a figure to `figures/`, cite it in `writeup/main.tex`, note it in `methodology.md`.
- Open an issue before large changes. See [../CONTRIBUTING.md](../CONTRIBUTING.md).

## 6. Glossary
Fill in project-specific terms and symbols here as the paper matures.
