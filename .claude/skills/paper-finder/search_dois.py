"""Find DOIs for a topic or title without Consensus: OpenAlex -> Semantic Scholar -> Crossref.

Usage: python search_dois.py "query" [--source openalex|s2|crossref] [--n 10] [--email you@x.org]
       python search_dois.py --doi 10.1109/87.974344     (Crossref metadata for one DOI)
       python search_dois.py --selftest
Without --source it stops at the first source that returns DOIs. Standard library only.
Output, one line per paper: DOI | year | first author | title | venue | citations
Verify a Consensus paper: --source crossref "<exact title>" and compare title/author/year.
"""
import argparse
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request


def get_json(url, **params):
    if params:
        url += "?" + urllib.parse.urlencode(params)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "paper-finder"})
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read())
    except (urllib.error.URLError, TimeoutError, ValueError):
        return None


def row(doi, year, author, title, venue, cites):
    doi = re.sub(r"^https?://(dx\.)?doi\.org/", "", doi or "")
    return dict(doi=doi, year=year, author=author or "?", title=" ".join((title or "").split()),
                venue=venue or "", cites=cites)


def openalex(q, n, email):
    j = get_json("https://api.openalex.org/works", search=q, mailto=email, **{"per-page": n})
    for w in (j or {}).get("results", []):
        a = ((w.get("authorships") or [{}])[0].get("author")) or {}
        src = ((w.get("primary_location") or {}).get("source")) or {}
        yield row(w.get("doi"), w.get("publication_year"), a.get("display_name"), w.get("title"),
                  src.get("display_name"), w.get("cited_by_count"))


def s2(q, n, email):
    j = get_json("https://api.semanticscholar.org/graph/v1/paper/search", query=q, limit=n,
                 fields="title,year,authors,venue,citationCount,externalIds")
    for p in (j or {}).get("data", []):
        a = ((p.get("authors") or [{}])[0]).get("name")
        yield row((p.get("externalIds") or {}).get("DOI"), p.get("year"), a, p.get("title"),
                  p.get("venue"), p.get("citationCount"))


def _crossref_row(w):
    a = (w.get("author") or [{}])[0]
    year = ((w.get("issued") or {}).get("date-parts") or [[None]])[0][0]
    return row(w.get("DOI"), year, a.get("family"), " ".join(w.get("title") or []),
               " ".join(w.get("container-title") or []), w.get("is-referenced-by-count"))


def crossref(q, n, email):
    j = get_json("https://api.crossref.org/works", rows=n, mailto=email, **{"query.bibliographic": q})
    for w in ((j or {}).get("message") or {}).get("items", []):
        yield _crossref_row(w)


def by_doi(doi, email):
    j = get_json(f"https://api.crossref.org/works/{doi}", mailto=email)
    return [_crossref_row(j["message"])] if j else []


SOURCES = {"openalex": openalex, "s2": s2, "crossref": crossref}


def show(rows):
    for r in rows:
        print(" | ".join(str(r[k]) for k in ("doi", "year", "author", "title", "venue", "cites")))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("query", nargs="?")
    ap.add_argument("--source", choices=SOURCES)
    ap.add_argument("--n", type=int, default=10)
    ap.add_argument("--email", default="")
    ap.add_argument("--doi")
    ap.add_argument("--selftest", action="store_true")
    args = ap.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")
    if args.selftest:
        r = row("https://doi.org/10.1/x", 2020, None, " A  b ", None, 1)
        assert r == dict(doi="10.1/x", year=2020, author="?", title="A b", venue="", cites=1)
        print("selftest ok")
        return
    if args.doi:
        show(by_doi(args.doi, args.email))
        return
    if not args.query:
        ap.error("give a query, --doi, or --selftest")
    for name in [args.source] if args.source else SOURCES:
        rows = [r for r in SOURCES[name](args.query, args.n, args.email) if r["doi"]]
        if rows:
            print(f"# source: {name}")
            show(rows)
            return
    print("# no source returned DOIs: retry later or ask the user for the DOI")


if __name__ == "__main__":
    main()
