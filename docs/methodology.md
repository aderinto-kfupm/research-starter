# Methodology and reproducibility

Living companion to `writeup/main.tex`. Keep it in sync with the code.

## Problem statement
One paragraph. State what is given, what is sought, and the performance criterion.

## Assumptions
| ID | Assumption | Where used |
|---|---|---|
| A1 | | |

## Notation
| Symbol | Meaning | Units | Code name |
|---|---|---|---|
| | | | |

## Equation-to-code map
| Eq. in paper | File and function |
|---|---|
| | |

## Experiments
| ID | Purpose | Entry | Seed | Output |
|---|---|---|---|---|
| E1 | | | 0 | `figures/e1.pdf` |

## Reproducibility checklist
- [ ] Clean clone + `make reproduce` regenerates every figure and table.
- [ ] Seeds fixed; solver, step size, and tolerances stated in paper and code.
- [ ] Software versions recorded in [environments.md](environments.md).
- [ ] Data provenance and license documented in `data/README.md`.
- [ ] Hyperparameters and tuning ranges listed in `config`.
- [ ] Baselines run with identical settings and budgets.
