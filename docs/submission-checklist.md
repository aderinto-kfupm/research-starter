# Submission checklist

Copy the venue facts into the first block, then tick through the rest before submitting.

## Venue facts
- Venue / track / deadline:
- Template and class option (`[conference]` / `[journal]`):
- Page limit (incl. references?):
- Review mode: single-blind / double-blind (anonymize if double)
- Format of submission (PDF, source zip, supplementary):

## Manuscript
- [ ] `make paper` builds clean; `make check` shows no undefined refs/citations
- [ ] Page limit and font/margins untouched
- [ ] Abstract has no math or citations; keywords set
- [ ] Every figure is vector, legible at column width, and cited in the text
- [ ] Every claim is backed by a figure, table, or citation; notation matches `docs/methodology.md`
- [ ] References verified against sources (`/academic-paper citation-check`); DOIs present
- [ ] Self-citations anonymized and acknowledgements/funding removed (double-blind only)

## Reproducibility and ethics
- [ ] `make reproduce` regenerates all results from a clean clone
- [ ] Code/data availability statement written; release tagged and archived (Zenodo DOI added to `CITATION.cff`)
- [ ] AI-use disclosure per venue policy (`/academic-paper disclosure`)
- [ ] Ethics / conflict-of-interest statements if required
- [ ] Copyright / licensing form completed

## Internal review
- [ ] At least one `full` round and one `re-review` logged in `reviews/INDEX.md`
- [ ] All Major findings resolved or rebutted in `response.md`
- [ ] All co-authors approved the final PDF
