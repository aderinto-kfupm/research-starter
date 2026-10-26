# Research workflow with Claude Code

Stages, the skill that drives each, and the artifact it leaves behind. Gate each stage on its artifact.

| # | Stage | Command | Artifact |
|---|---|---|---|
| 1 | Plan paper (type, venue, outline) | `/academic-paper` (plan / outline mode) | `docs/plan.md` (save the outline) |
| 2 | Literature survey | drop PDFs in `papers/`, run `/literature-review` | `review/ver{n}.tex` |
| 3 | Build the model/simulation | `/matlab-simulink` or Python in `src/python` | code in `src/`, figures in `figures/` |
| 4 | Draft | `/ieee-paper` per section (uses `review/ver*.tex` for Related Work) | `writeup/main.tex`, `writeup/references.bib` |
| 5 | Clean prose | `/humanize` on drafted sections | edited `writeup/main.tex` |
| 6 | Citation check | `/academic-paper citation-check` | fix `writeup/references.bib` |
| 7 | Internal peer review | `/academic-paper-reviewer` | `reviews/<round>/` (see [../reviews/README.md](../reviews/README.md)) |
| 8 | Revise / rebut | `/academic-paper revision`, `rebuttal-audit` | `reviews/<round>/response.md`, edits |
| 9 | Disclosure and submission | `/academic-paper disclosure`; [submission-checklist.md](submission-checklist.md); `make paper && make check` | final `writeup/main.pdf` |

## Conventions
- One stage, one branch or PR where practical; commit after each skill run so the diff shows what the agent changed.
- Tell the reviewer the venue and review mode explicitly; start with `full`, then `re-review` after revisions.
- Re-run `make reproduce && make paper` before every review so the reviewed PDF matches the code.
- The agent never overwrites `review/ver*.tex`; each run adds a new version.
