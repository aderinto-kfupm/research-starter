---
name: paper-finder
description: >
  Gets verified DOIs for the research papers the user needs (the researcher then downloads them manually).
  Discovery via the Consensus MCP tools (free or paid plan) with automatic fallback to OpenAlex, Semantic
  Scholar and Crossref when Consensus is limited or down; verification via Crossref; optional legal
  open-access PDF download. Never invents a paper. Use when the user wants to
  find papers, look for citations, check what the evidence says, expand the literature review, back a claim
  with references, verify that a citation is real, or get PDFs into papers/. Trigger on "/paper-finder",
  "find papers on", "search consensus", "find citations for", "is this paper real", "verify these references",
  "download these papers", "what does the literature say about". Use it before adding anything to
  writeup/references.bib or papers/ that did not come from the user.
---

# Paper finder

**The deliverable is a list of verified DOIs.** The researcher downloads the papers manually from them. Automatic PDF download is a bonus, never the goal.

Pipeline: **discover (Consensus, else fallback) -> record -> verify (Crossref) -> hand over DOI list (+ optional PDFs)**.

Consensus is the preferred discoverer (best relevance ranking) but nothing depends on it: `search_dois.py` (next to this file) finds DOIs from OpenAlex, Semantic Scholar and Crossref with no account and no quota that matters.

Consensus is a **search and synthesis** service. It returns paper records (title, authors, year, journal, citations, abstract, link). **It cannot download PDFs.** Paid plans add DOI links, paging, and full-text excerpts; the `create_thread` agent reads full text internally but returns only a cited synthesis.

## Iron rules (anti-hallucination)

1. A paper exists only if a tool result (or the user) supplied it **in this session**. Never add a paper, author, year, venue, DOI, or quote from memory.
2. Copy bibliographic fields verbatim from the tool result. If a field is missing (free plan has no DOI), leave it blank and mark it `UNVERIFIED`. Never guess it.
3. Nothing enters `writeup/references.bib` until it passes **Verify** below. Candidates live in `review/consensus/`, not in the bib.
4. Quote only text the tool returned (`get_thread` markers `[N.M]` = quote M of paper N). Keep markers exactly; do not paraphrase them away.
5. Zero results is a valid answer. Say so and broaden the query; do not fill the gap with plausible papers.

## Step 1: Detect the Consensus plan (once per session, cheaply)

Run one `search` with just `query`. Read the footer message the tool returns (sign-up / upgrade / usage counter, which you must repeat word for word to the user at the end of your reply).

| Signal | Mode |
|---|---|
| Upgrade/sign-up prompt, search counter, no DOI in records | **free** |
| DOI present, `page>0` works, no counter | **paid** |

If the counter shows few searches left, say how many remain before spending any.

### Fallback: switch away from Consensus when any of these hold
- tool missing, not signed in, or erroring; rate-limit error twice in a row; search quota exhausted;
- results are off-topic or garbled (e.g. author field wrong) after one reworded query;
- the user wants DOIs for many papers or known titles (Consensus returns no DOI on free).

Then run, from the repo root (standard library only, nothing to install; add `--email <user email>` for the OpenAlex/Crossref polite pool; use the email from context or ask, never invent one):

```
python -I .claude/skills/paper-finder/search_dois.py "<query>" --n 10
```

It tries OpenAlex, then Semantic Scholar, then Crossref, and stops at the first source that returns DOIs (`--source openalex|s2|crossref` forces one). Output is `DOI | year | first author | title | venue | citations`. If every source fails, say so and ask the user for DOIs or titles; never fill in from memory. Fallback results are real records, so rules 1-5 still apply and they still go through Step 3 and Step 4. Note in the candidates file which source each paper came from (`Source: openalex "<query>"`).

Known titles but no DOIs: run `search_dois.py "<exact title>" --source crossref --n 3` per title.

## Step 2: Pick the route

| Need | Free | Paid |
|---|---|---|
| A handful of papers on a topic | `search`, query only, 1 call | same, `page` 1+ if asked |
| Many angles / broad coverage | 2-3 distinct `search` calls (max 3 in parallel), then dedupe | `create_thread` (pro) with one full brief |
| Synthesis, "what does evidence say" | Summarize only from returned abstracts; state it is abstract-level | `create_thread` pro, poll `get_thread` every 30 s+ |
| Exhaustive review / audit of a draft | Not available: do `search` batches, tell the user | `create_thread` with `mode: deep` + `skill` (`literature-review`, `find-citations`, `verify-citations`, `citation-snowballing`). **Only when the user explicitly asks for deep.** |
| Evidence quotes | Abstract only | `search` with `include_full_text_chunks` only if the user asks |

Filters: apply none unless the user asked (Consensus tool rule). `exclude_preprints` only for "peer-reviewed"; `year_min` only for "recent".
Query craft: specific academic terms, under 500 chars, one concept per query (e.g. `fuzzy logic speed control unmanned ground vehicle unstructured terrain`). For `create_thread`, put the whole brief in a single call; never chain calls yourself.

## Step 3: Record candidates

Write results to `review/consensus/YYYY-MM-DD_<slug>.md` (create dir if missing, never overwrite). One block per paper:

```
## [N] <Title verbatim>
- Authors / Year / Venue: ...
- Link: <exact url from tool>      DOI: <from tool | UNVERIFIED>
- Citations: <n>    Source: search "<query>" | thread <id>
- Relevance to topic: High/Med/Low (one line)
- Status: candidate | verified | rejected
```

Present the shortlist inline with `[N]` numbers and hyperlinked titles using the exact URLs returned.

## Step 4: Verify (required before bib or download)

For each paper to be cited:
- **DOI in hand** (Consensus paid, user, or fallback): `python -I .claude/skills/paper-finder/search_dois.py --doi <doi>` and confirm title + first author + year match the source record.
- **No DOI** (Consensus free): `python -I .claude/skills/paper-finder/search_dois.py "<exact title>" --source crossref --n 3`; accept only an exact title and author/year match, then take the DOI from that row. No match -> status `UNVERIFIED`, do not cite; tell the user.
- Fallback records come from OpenAlex/Semantic Scholar, so still cross-check them once against Crossref with the commands above.
- Mismatch on title, authors, or year = `rejected`.

Only `verified` entries go into `writeup/references.bib` (via `/ieee-paper`), with the DOI. Key = first-author surname + year, same as `/literature-review`.

## Step 5: Hand over the DOIs (Consensus cannot download PDFs)

Always finish the candidates file with a `## Download list` section: one `https://doi.org/<doi>` link per `verified` paper, with first author and year. The researcher downloads from it (institutional library proxy / Zotero connector, or email the author). Do not use Sci-Hub or other shadow libraries, and do not scrape paywalls.

Optional, only if the user wants it: try open-access PDFs automatically. Run from the repo root with the `verified` DOIs only:

```
python -I .claude/skills/paper-finder/fetch_pdfs.py --email <user email> --out papers <doi> [<doi> ...]
```

It tries OpenAlex, then Unpaywall, then Semantic Scholar; accepts only responses that start with `%PDF`; saves `papers/<surname><year>.pdf`; and writes the DOIs with no free PDF to `papers/needs_manual.md`. `python fetch_pdfs.py --selftest` checks the filename logic.

For `needs_manual.md` entries tell the user to download via the institutional library proxy / Zotero connector or email the author. Do not use Sci-Hub or other shadow libraries, and do not scrape paywalls.

`papers/` is gitignored; the PDFs then feed `/literature-review`. Report which DOIs downloaded and which need manual download.

## Reply format

Numbered shortlist with linked titles `(Authors, Year, Venue, Citations)`, what was verified vs `UNVERIFIED`, downloaded vs manual, path of the candidates file, and last the Consensus sign-up/upgrade/usage message word for word.
