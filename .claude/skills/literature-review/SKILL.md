---
name: literature-review
description: >
  Conducts a structured academic literature review from a folder of papers (PDFs or other documents).
  Use this skill whenever the user wants to review, synthesize, or analyze a collection of research papers —
  even if they don't say "literature review" explicitly. Trigger on phrases like "review my papers",
  "summarize what these papers say", "synthesize papers in [folder]", "what do these papers cover",
  "analyze the papers in this directory", "/literature-review", or "write a lit review from [folder]".
  Especially important for PhD students, researchers, and academics working with paper collections.
  Always use this skill when a folder of research papers is mentioned alongside any review, analysis,
  or synthesis task — don't just read papers ad hoc.
---

# Literature Review Skill

You are helping a researcher conduct a systematic literature review from a collection of papers stored in a folder. Your job is to read, extract, and synthesize information from those papers into a well-structured review document.

## Step 1: Discover the Papers

1. Ask the user for the folder path if not already provided.
2. List all files in the folder (use Glob or Bash `ls`). Look for: `.pdf`, `.txt`, `.md`, `.docx`, `.html`.
3. Report how many papers you found and list their filenames. If the folder is empty or the path is wrong, stop and ask the user to clarify.

## Step 2: Ask About Review Focus (if not already clear)

Before diving in, quickly confirm:
- **Research topic / thesis focus**: What specific problem is the researcher working on? This is more precise than just a subject area — e.g., not "UGV navigation" but "fuzzy-logic-based speed control for UGVs in unstructured terrain". The more specific this is, the more targeted the relevance screening and gap analysis will be.
- **Review style** (default: thematic):
  - *Thematic* — grouped by research theme/topic (best for most reviews)
  - *Chronological* — ordered by publication year to show evolution of ideas
  - *Methodological* — grouped by research method (experimental, simulation, survey, etc.)

If the user says "just go ahead" or gives you a folder without more detail, use thematic review and infer the topic from the paper titles and content. In that case, state your inferred topic at the top of the review so the user can correct it next time.

Keep the stated research topic in mind throughout — it is the lens through which relevance, themes, and gaps are all evaluated.

## Step 3: Read, Extract, and Screen Each Paper

For each paper, read it using the Read tool. PDFs are supported directly.

Extract the following for each paper and store it as an internal structured note (you don't need to show this to the user yet — it feeds into the synthesis):

```
Title: ...
Authors: ...
Year: ...
Venue (journal/conference): ...
Research Question / Objective: ...
Methodology: ...
Key Findings: ...
Contributions: ...
Limitations / Future Work: ...
Keywords / Themes: ...
Relevance: [High / Medium / Low / Excluded] — see below
Relevance Reason: one sentence explaining the relevance verdict
```

If a paper is very long (>50 pages), focus on: abstract, introduction, conclusion, and section headings. If a field can't be found, mark it as "N/A".

### Relevance Screening

After extracting the above for each paper, assess its relevance to the stated research topic:

- **High**: Directly addresses the research topic — same problem, similar methods, or results that directly inform the researcher's work.
- **Medium**: Tangentially related — covers an adjacent problem, a component technique, or provides useful background that a reader of this specific topic would benefit from knowing.
- **Low**: Only loosely connected — shares a keyword or application domain but does not meaningfully contribute to understanding the research topic.
- **Excluded**: Clearly outside scope — included in the folder by mistake or covers an entirely different domain.

Be honest about this. A paper on general autonomous navigation is Medium for a review focused on multi-robot task allocation; it is High if the review is about navigation itself. Apply the research topic as a filter, not just the folder contents.

**In the summary table**, add a Relevance column. **In the thematic sections**, give more weight and depth to High and Medium papers. Low-relevance papers should be noted briefly (one sentence) in the summary table and may be grouped into a short "Peripheral References" subsection at the end of the thematic analysis rather than given equal treatment. Excluded papers are listed in a footnote only.

**Tip**: Don't try to read all papers before starting to think about structure — as you read, you'll naturally notice recurring themes. Keep a running mental model of the thematic clusters forming.

## Step 4: Identify Themes and Structure

After reading all papers, organize them into 3–6 thematic clusters based on what you've seen. Good themes are:
- Specific enough to be meaningful (not just "methods" or "results")
- Broad enough to contain multiple papers
- Named clearly (e.g., "Fuzzy Logic for Speed Control", "Sensor Fusion Approaches", "Simulation-Based Evaluation")

If doing a chronological review, identify key "eras" or turning points in the literature.
If doing a methodological review, identify the main methodological families.

## Step 5: Determine Output File Path

Before writing, determine the versioned output path:

1. Look for a `review/` directory relative to the papers folder (e.g., if papers are in `PAPERS/`, check for `PAPERS/../review/` or a `review/` sibling). If the `review/` directory doesn't exist, create it.
2. Scan for existing `ver*.tex` files in that directory (e.g., `ver1.tex`, `ver2.tex`).
3. Set `n` to one higher than the highest existing version number. If no files exist yet, start at `ver1.tex`.
4. The output file is always `review/ver{n}.tex` — never overwrite an existing version.

Tell the user the path before writing: "Saving to `review/ver2.tex`."

## Step 6: Write the Literature Review

Write the full review as a **LaTeX document** using the structure below. Save it to `review/ver{n}.tex`.

---

### Output Document Structure (LaTeX)

```latex
\documentclass[12pt,a4paper]{article}

% --- Packages ---
\usepackage[margin=2.5cm]{geometry}
\usepackage{booktabs}
\usepackage{longtable}
\usepackage{array}
\usepackage{hyperref}
\usepackage{parskip}
\usepackage{titlesec}
\usepackage{cite}
\usepackage{setspace}

\onehalfspacing

\title{Literature Review: [Topic]}
\author{Model-Assisted Review}
\date{[Today's date]}

\begin{document}
\maketitle

\begin{abstract}
One-paragraph overview of what this review covers, how many papers, the time range, and the stated research topic it is written in service of.
\end{abstract}

\tableofcontents
\newpage

% -------------------------------------------------------
\section{Introduction}
% -------------------------------------------------------
Frame the review topic, why it matters, and what this review covers.
Mention the scope (number of papers, time range, domains covered) and the
specific research topic this review is written to inform.

% -------------------------------------------------------
\section{Summary of Reviewed Papers}
% -------------------------------------------------------

\begin{longtable}{p{0.3\textwidth} p{0.12\textwidth} p{0.12\textwidth} p{0.25\textwidth} p{0.1\textwidth}}
\toprule
\textbf{Title} & \textbf{Authors} & \textbf{Year} & \textbf{Method / Key Contribution} & \textbf{Relevance} \\
\midrule
\endfirsthead
\toprule
\textbf{Title} & \textbf{Authors} & \textbf{Year} & \textbf{Method / Key Contribution} & \textbf{Relevance} \\
\midrule
\endhead
Paper title & Author et al. & 2024 & Brief method and contribution & High \\
\bottomrule
\end{longtable}

% -------------------------------------------------------
\section{Thematic Analysis}
% (or Chronological Analysis / Methodological Analysis)
% -------------------------------------------------------

\subsection{[Theme Name]}
Explain what papers fall under this theme and what they share in common.
Discuss findings, agreements, contradictions, and progression within this theme.
Cite papers inline: \cite{key2024}.

\subsection{[Theme Name]}
...

% Repeat for each theme (3--6 subsections)

\subsection*{Peripheral References}
% Brief notes on Low-relevance papers — one sentence each.

% -------------------------------------------------------
\section{Research Trends and Evolution}
% -------------------------------------------------------
What directions has the field been moving? What approaches have become dominant?
What has fallen out of fashion? Connect the dots across themes.

% -------------------------------------------------------
\section{Research Gaps and Open Problems}
% -------------------------------------------------------

\subsection{Field-Level Gaps}
What questions remain unanswered in the literature at large?
What limitations appear repeatedly? Where is the field heading?

\subsection{Gaps Relative to the Research Topic}
% This is the most important section for the researcher.
% Tie each gap directly to the stated research topic.
% Each gap should name a specific method, environment, or condition
% that was NOT addressed in the reviewed papers but is relevant to the researcher's work.

\begin{enumerate}
    \item \textbf{Gap title}: Precise description tying it to the research topic\ldots
    \item \textbf{Gap title}: \ldots
    \item \textbf{Gap title}: \ldots
\end{enumerate}

% -------------------------------------------------------
\section{Comparative Analysis}
% -------------------------------------------------------

\begin{table}[h!]
\centering
\caption{Comparison of approaches across key dimensions}
\begin{tabular}{p{0.2\textwidth} p{0.2\textwidth} p{0.2\textwidth} p{0.2\textwidth}}
\toprule
\textbf{Aspect} & \textbf{Approach A} & \textbf{Approach B} & \textbf{Approach C} \\
\midrule
Metric 1 & ... & ... & ... \\
Metric 2 & ... & ... & ... \\
\bottomrule
\end{tabular}
\end{table}

% -------------------------------------------------------
\section{Conclusion}
% -------------------------------------------------------
Synthesize the main takeaways. What does the body of literature tell us overall?
What should a researcher entering this field know first?

% -------------------------------------------------------
\bibliographystyle{IEEEtran}
\begin{thebibliography}{99}

\bibitem{key2024}
A.~Author, B.~Author, ``Title of the paper,'' \textit{Journal/Conference}, vol.~X, no.~Y, pp.~Z1--Z2, Year.

% Add one \bibitem per paper reviewed

\end{thebibliography}

\end{document}
```

**LaTeX notes:**
- Use `\cite{key}` for inline citations throughout the text. Derive citation keys from first-author surname + year (e.g., `ma2025`, `garg2022`).
- Escape special LaTeX characters in titles and text: `&` → `\&`, `%` → `\%`, `_` → `\_`, `#` → `\#`.
- For very long paper titles in the summary table, use a shortened version to keep the table readable.
- The `longtable` package handles the summary table across page breaks automatically — no adjustments needed.
- Use `\textbf{}` for gap titles in the enumerated list to make them scannable.

---

## Writing Quality Guidelines

**Be analytical, not just descriptive.** Don't just list what each paper says — explain how papers relate to each other, where they agree, where they conflict, and what the pattern of evidence suggests overall.

**Cite inline.** When making a claim about a paper's findings or methods, reference it: "Smith et al. (2021) found that..." or "Three papers use particle swarm optimization [Jones 2019, Kim 2020, Patel 2022]."

**Identify gaps actively.** Don't just copy the "future work" section of each paper — look for patterns: if all papers avoid real-world testing, that's a systemic gap worth naming.

**Keep the summary table complete.** Every paper in the folder should appear in the summary table, even if it only gets a brief mention in the thematic sections.

**Tone**: Academic but readable. Avoid overly dense jargon. Write as if this review will be read by a researcher new to the specific sub-area.

---

## Handling Edge Cases

- **Non-English papers**: Note the language in the table; extract what you can from abstract/figures if translated.
- **Very long PDFs (books, theses)**: Treat as a single reference; focus on abstract, intro, and conclusion chapters.
- **Duplicate or near-duplicate papers** (e.g., conference + journal version): Note the duplication and treat as one entry.
- **Papers clearly outside scope**: Mark as "Excluded" in relevance screening, list in a brief footnote at the end, and do not include in thematic sections. Briefly explain why (e.g., "covers UAV communication protocols only — no connection to path planning or task allocation").
- **Unreadable files**: List them in the References section as "[Unreadable: filename]" and move on.

---

## Final Checklist Before Saving

- [ ] Output is a valid `.tex` file saved to `review/ver{n}.tex` (correct version number, never overwrites existing)
- [ ] The `review/` directory was created if it didn't exist
- [ ] Every paper in the folder appears in the summary table with a Relevance rating
- [ ] The research topic is stated in the abstract and introduction
- [ ] Relevance screening is reflected — any Low or Excluded papers have a one-sentence reason and are not given full thematic treatment
- [ ] All themes have at least 2 papers; Low-relevance papers are in the `\subsection*{Peripheral References}` block
- [ ] Section 5.1 (field-level gaps) names at least 3 specific gaps
- [ ] Section 5.2 (topic-specific gaps) names at least 3 gaps tied directly to the researcher's stated topic — not generic field gaps reworded
- [ ] All claims in the thematic sections use `\cite{key}` inline citations
- [ ] Every reviewed paper has a `\bibitem` entry in the bibliography
- [ ] Special LaTeX characters are escaped throughout (`&`, `%`, `_`, `#`)
- [ ] The file compiles without errors (no unclosed braces, no missing `\end{}`)
