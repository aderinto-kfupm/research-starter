# Agent guide for this paper repo

This repo holds one research paper plus the code that produces its results. Read `README.md` for layout.

## Hard rules
- The paper is `writeup/main.tex` + `writeup/references.bib`. Run `/ieee-paper` from inside `writeup/` (it looks for `main.tex` in the working directory); its literature input is `../review/ver*.tex`. Never create other `.tex`/`.bib` entry points.
- Every number, table, and figure in the paper must come from code in `src/` via `make reproduce`. No hand-pasted results.
- Figures are written to `figures/` by code. Prefer vector PDF.
- Never fabricate citations. Every `\cite{key}` needs a real, verified entry in `writeup/references.bib` (DOI where possible).
- Seeds are fixed in code and recorded in `results/` metadata. Raw data in `data/raw/` is read-only.
- Do not commit anything under `papers/`, `data/raw/`, or `results/` (except `.gitkeep`).

## Skills and where their output goes
| Task | Skill | Output location |
|---|---|---|
| Write/edit the paper | `/ieee-paper` (or `/academic-paper` for planning, abstract, citation-check, revision, rebuttal) | `writeup/main.tex`, `writeup/references.bib` |
| Find / verify / download papers | `/paper-finder` (Consensus + Crossref + OpenAlex/Unpaywall) | candidates in `review/consensus/`, PDFs in `papers/`, verified entries to `writeup/references.bib` |
| Survey related work | `/literature-review` over `papers/` | `review/ver{n}.tex` (never overwrite) |
| Simulation / analysis (MATLAB) | `/matlab-simulink` | `src/matlab/`, models in `src/matlab/models/` |
| In-house peer review | `/academic-paper-reviewer` | `reviews/YYYY-MM-DD_<mode>/` (see `reviews/README.md`) |
| De-AI the prose | `/humanize` | edit in place on a branch |

## Reviewer discipline
- `/academic-paper-reviewer` has no default output folder. Always invoke it like: `/academic-paper-reviewer full review of writeup/main.tex, venue: <venue>. Save every report to reviews/<YYYY-MM-DD>_full/ (reports/, decision.md); do not edit the manuscript.` Then create `meta.md` and `manuscript.pdf` per `reviews/README.md`.
- `review/` (singular) = literature review. `reviews/` (plural) = peer reviews of **our** manuscript. Do not mix them.
- The reviewer is read-only on `writeup/main.tex`: reports go to `reviews/`, never into the manuscript.
- Before a review, snapshot the manuscript state: record `git rev-parse --short HEAD` and the PDF hash in the report header.
- After a review, triage findings into `reviews/<round>/response.md`; only then edit `writeup/main.tex`.

## Build and verify
`make paper` must succeed with no undefined citations/references before any commit that touches `writeup/main.tex`.
