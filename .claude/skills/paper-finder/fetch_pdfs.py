"""Download open-access PDFs for DOIs: OpenAlex -> Unpaywall -> Semantic Scholar.

Usage: python fetch_pdfs.py --email you@example.org [--out papers] DOI [DOI ...]
       python fetch_pdfs.py --selftest
Files land in --out as <surname><year>.pdf; DOIs with no free PDF go to <out>/needs_manual.md.
Standard library only.
"""
import argparse
import json
import re
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


def key(author, year):
    surname = re.sub(r"[^a-z]", "", author.split()[-1].lower()) if author.strip() else "unknown"
    return f"{surname}{year or ''}"


def get(url, **params):
    """GET -> bytes, or None on any HTTP/network error."""
    if params:
        url += "?" + urllib.parse.urlencode(params)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "paper-finder"})
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.read()
    except (urllib.error.URLError, TimeoutError, ValueError):
        return None


def get_json(url, **params):
    body = get(url, **params)
    try:
        return json.loads(body) if body else None
    except ValueError:
        return None


def candidates(doi, email):
    """Return (filename stem, [pdf urls]) from the three sources, best first."""
    urls, stem = [], doi.replace("/", "_")
    w = get_json(f"https://api.openalex.org/works/doi:{doi}", mailto=email)
    if w:
        urls.append((w.get("best_oa_location") or {}).get("pdf_url"))
        auth = ((w.get("authorships") or [{}])[0].get("author") or {}).get("display_name", "")
        stem = key(auth, w.get("publication_year"))
    j = get_json(f"https://api.unpaywall.org/v2/{doi}", email=email)
    if j:
        urls.append((j.get("best_oa_location") or {}).get("url_for_pdf"))
    j = get_json(f"https://api.semanticscholar.org/graph/v1/paper/DOI:{doi}", fields="openAccessPdf")
    if j:
        urls.append((j.get("openAccessPdf") or {}).get("url"))
    return stem, [u for u in urls if u]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("dois", nargs="*")
    ap.add_argument("--email", default="")
    ap.add_argument("--out", default="papers")
    ap.add_argument("--selftest", action="store_true")
    args = ap.parse_args()
    if args.selftest:
        assert key("Jane Q. Smith", 2021) == "smith2021"
        assert key("", None) == "unknown"
        print("selftest ok")
        return
    if not args.email:
        ap.error("--email is required (OpenAlex/Unpaywall polite pool)")
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    missing = []
    for doi in args.dois:
        stem, urls = candidates(doi, args.email)
        dest = out / f"{stem}.pdf"
        if dest.exists():  # same first author + year, different paper
            dest = out / f"{stem}_{doi.replace('/', '_')}.pdf"
        for u in urls:
            data = get(u)
            if data and data[:4] == b"%PDF":  # reject HTML landing pages
                dest.write_bytes(data)
                print(f"ok      {doi} -> {dest}")
                break
        else:
            print(f"missing {doi}")
            missing.append(doi)
    if missing:
        lines = [f"- {d} https://doi.org/{d}" for d in missing]
        (out / "needs_manual.md").write_text(
            "# Download manually (institutional library proxy)\n\n" + "\n".join(lines) + "\n", encoding="utf-8"
        )


if __name__ == "__main__":
    main()
