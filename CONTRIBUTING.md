# Contributing

Thanks for helping. This repo is a research paper; contributions are held to the standard of reproducibility, not just correctness.

## Ways to contribute
- **Issues:** report errors in results, derivations, or code; propose extensions (use the issue templates).
- **Pull requests:** fixes, additional experiments, clearer docs, new baselines.
- **Reviews:** comments on the manuscript are welcome as issues labelled `review`.

## Workflow
1. Open an issue first for anything beyond a typo.
2. Branch from `main`: `feat/<topic>`, `fix/<topic>`, `exp/<topic>`, `docs/<topic>`, `paper/<section>`.
3. Make focused commits using [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `paper:`, `exp:`).
4. Open a PR using the template. CI must pass.

## Definition of done for a PR
- [ ] `make reproduce` regenerates all affected figures/results from a clean checkout.
- [ ] `make test` passes (Python) or MATLAB `run_all` completes (MATLAB).
- [ ] `make paper` builds with no undefined references or citations.
- [ ] New citations are in `writeup/references.bib` with DOI/URL, and were checked against the source.
- [ ] No large binaries, raw data, secrets, or `results/` outputs committed.
- [ ] Changed behaviour is explained in `docs/` or the PR description.

## Code standards
- **Python:** Python 3.10+, formatted and linted with `ruff`, tests in `tests/` with `pytest`. Seeds explicit.
- **MATLAB:** one function per file in `src/matlab/lib/`, header comment with units and I/O, no hard-coded absolute paths, entry point `run_all.m`.
- Parameters live in one config place (`src/python/paperlib/config.py` or `src/matlab/lib/config.m`), not scattered.

## Writing standards
- LaTeX: one sentence per source line (clean diffs), `\ref` for cross-refs, `booktabs` tables, vector figures.
- Define symbols once (notation table in `docs/methodology.md`); keep notation consistent with the code.
- Citations via `writeup/references.bib` only; BibTeX keys as `firstauthorYEARkeyword`.

## Authorship and credit
Substantial contributions (new experiments, derivations, analysis) are discussed for co-authorship **before** merging. Smaller contributions are acknowledged in the paper's acknowledgements and `CITATION.cff` if agreed.

## Use of AI assistance
AI tools (including Claude Code) are used in drafting, review, and code. Authors remain accountable for every claim and citation. Disclose AI use in line with the target venue's policy; `/academic-paper disclosure` can draft the statement.

## Conduct
See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
