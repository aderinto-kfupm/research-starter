# In-house peer reviews

Reports from `/academic-paper-reviewer` on **our own manuscript**. (Literature-review output lives in `review/`, singular.)

## Layout

One folder per review round, named `YYYY-MM-DD_<mode>` where mode is `full`, `re-review`, `quick`, `methodology`, `guided` or `calibration`:

```
reviews/
  INDEX.md                       # one row per round (update after each)
  templates/                     # report / decision / response templates
  2026-11-02_full/
    meta.md                      # commit hash, PDF sha256, venue profile, mode, model
    manuscript.pdf               # frozen snapshot that was actually reviewed
    reports/                     # one file per reviewer seat (EIC, R1, R2, R3, DA)
    decision.md                  # editorial decision letter + revision roadmap
    response.md                  # our triage: each comment -> accept / rebut / defer, with commit refs
  2026-11-20_re-review/
    ...
```

## Procedure

1. Commit the manuscript, then create the round folder and fill `meta.md` (copy block below).
2. Copy the built `writeup/main.pdf` to `manuscript.pdf`.
3. Run `/academic-paper-reviewer` (the skill has no default output folder, so say where to save). Paste-ready prompt:
   `/academic-paper-reviewer full review of writeup/main.tex, venue: <venue>. Save every reviewer report to reviews/<round>/reports/ and the decision letter to reviews/<round>/decision.md. Do not edit the manuscript.`
4. Triage every comment in `response.md` using `templates/revision_response_template.md`.
5. Make edits to `writeup/main.tex` in separate commits that reference the round (`paper: address R2.3 (reviews/2026-11-02_full)`).
6. For the next round use `re-review` mode and point it at the previous round's `decision.md` and `response.md`.
7. Add a row to `INDEX.md`.

`meta.md` block:

```
date: YYYY-MM-DD
mode: full
commit: <git rev-parse --short HEAD>
pdf_sha256: <sha256sum writeup/main.pdf>
venue_profile: <e.g. IEEE conference, CDC>
model: <model id used for the panel>
human_owner: <who is accountable for acting on the review>
```

## Rules
- Reviews are advisory and AI-generated; a human triages every finding. Do not paste review text into the manuscript.
- Never edit files inside a finished round except `response.md`. Corrections go in a new round.
- Keep rounds in git (they are small text). Large PDFs are fine here; they are the audit trail.
