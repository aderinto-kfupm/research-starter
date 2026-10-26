# IEEE Conference Paper Conventions

## Table of Contents
1. [Heading Levels](#1-heading-levels)
2. [Prose Rules](#2-prose-rules)
3. [Abstract & Index Terms](#3-abstract--index-terms)
4. [Equations](#4-equations)
5. [Figures & Tables](#5-figures--tables)
6. [Reference Formats](#6-reference-formats)
7. [Common Mistakes](#7-common-mistakes)

---

## 1. Heading Levels

| Level | LaTeX command | Display style | Example |
|-------|--------------|---------------|---------|
| Section | `\section{}` | Bold, centered, Roman numeral | **I. INTRODUCTION** |
| Subsection | `\subsection{}` | Italic, left-aligned, letter | *A. System Model* |
| Subsubsection | `\subsubsection{}` | Italic, run-in | *1) State equations:* |
| Acknowledgment | `\section*{Acknowledgment}` | No number | ACKNOWLEDGMENT |
| References | automatic | No number | REFERENCES |

Do not number headings manually — LaTeX does it. Do not use a subheading unless there
are at least two subheadings at that level.

---

## 2. Prose Rules

**Citations:**
- Use numbered brackets: `\cite{key}` → [1]
- Punctuation follows the bracket: "...as shown in prior work [3]."
- At the start of a sentence: "Reference [3] was the first to..."
- Never write "Ref. [3]" or "reference [3]" mid-sentence — just "[3]"
- Never leave an uncited claim in Related Work or Introduction

**Abbreviations:**
- Define on first use in the text (even if defined in abstract): "fuzzy logic controller (FLC)"
- IEEE, SI, MKS, CGS, ac, dc, rms — no definition needed
- Do not abbreviate in titles or headings unless unavoidable

**Numbers and units:**
- SI units preferred; English units in parentheses as secondary
- Zero before decimal: "0.25" not ".25"
- Use "cm³" not "cc"; spell out units in text ("a few henries" not "a few H")
- Do not mix SI and CGS in the same equation

**Cross-references:**
- Equations: `\eqref{eq:label}` → (1); "Equation (1)" at sentence start
- Figures: "Fig. 1" (abbreviated, even at sentence start)
- Tables: "Table I" (Roman numeral, never abbreviated)
- Sections: "Section II" or "Section II-A"

**Writing style:**
- "data" is plural
- No "essentially" as synonym for "approximately"
- No "alternately" when you mean "alternatively"
- "et al." has no period after "et"; no italic required in IEEE style
- "nonlinear" not "non-linear"; "feedforward" not "feed-forward"
- Subscript 0 in µ₀ is zero, not letter "o"

---

## 3. Abstract & Index Terms

**Abstract rules (IEEE strict):**
- No math symbols, no special characters, no footnotes
- No abbreviations that aren't defined (or are IEEE standard)
- No citations
- 150–250 words typical for conference papers
- Begins: `\textit{Abstract}—` (em-dash, not hyphen)

**Index Terms:**
- 4–6 terms, comma-separated
- Lowercase except proper nouns (e.g., "IEEE", "MATLAB")
- Format: `\begin{IEEEkeywords} term1, term2, term3 \end{IEEEkeywords}`

---

## 4. Equations

```latex
% Single equation — use equation, not eqnarray
\begin{equation}
    \dot{x} = Ax + Bu \label{eq:state_space}
\end{equation}

% Multiple aligned equations — use align or IEEEeqnarray
\begin{align}
    \dot{x} &= Ax + Bu \label{eq:state} \\
    y       &= Cx + Du \label{eq:output}
\end{align}

% Subequations
\begin{subequations}
\begin{align}
    \dot{x}_1 &= x_2 \label{eq:x1} \\
    \dot{x}_2 &= -ax_1 - bx_2 + u \label{eq:x2}
\end{align}
\end{subequations}

% Cross-reference — always \eqref, never hardcode (1)
As shown in \eqref{eq:state_space}, the system...
```

**Rules:**
- Never use `{eqnarray}` — it produces ugly spacing around `=`
- Place `\label` after the equation content, never before `\caption` for figures
- Punctuate equations as part of sentences: comma or period after, as appropriate
- Italicize Roman symbols for quantities (automatically done in math mode)
- Greek symbols: not italicized — correct in math mode by default

---

## 5. Figures & Tables

```latex
% Single-column figure
\begin{figure}[htbp]
\centerline{\includegraphics[width=\columnwidth]{figs/result_plot.pdf}}
\caption{Step response of the fuzzy PID controller vs. conventional PID.}
\label{fig:step_response}
\end{figure}

% Double-column (spanning) figure
\begin{figure*}[t]
\centerline{\includegraphics[width=\textwidth]{figs/system_overview.pdf}}
\caption{Overview of the proposed UAV-UGV collaborative search architecture.}
\label{fig:architecture}
\end{figure*}

% Table — caption ABOVE
\begin{table}[htbp]
\caption{Performance Metrics Comparison}   % <-- caption above for tables
\label{tab:metrics}
\begin{center}
\begin{tabular}{lccc}
\hline
\textbf{Method} & \textbf{Rise Time (s)} & \textbf{Overshoot (\%)} & \textbf{ITAE} \\
\hline
PID          & 1.24 & 12.3 & 4.51 \\
Fuzzy PID    & 0.87 & 4.1  & 2.18 \\
PSO-PID      & 0.91 & 6.2  & 2.73 \\
\hline
\end{tabular}
\end{center}
\end{table}
```

**Rules:**
- Figures: caption **below** (`\caption` after `\includegraphics`)
- Tables: caption **above** (`\caption` before `\begin{tabular}`)
- `\label` always **after** `\caption` — never before
- Always cite the figure/table in text before it appears: "as shown in Fig. 1..."
- Figure axis labels: 8pt Times New Roman; write "Velocity (m/s)" not just "m/s"
- Large figures/tables: use `figure*` / `table*` to span both columns
- Preferred positions: `[t]` (top of column) or `[b]` (bottom) — avoid `[h]` alone

---

## 6. Reference Formats

**Citation key pattern:** `firstauthorYYYY` (e.g., `ma2025`, `garg2022`)

### Journal article
```latex
\bibitem{ma2025}
Z.~Ma, J.~Xiong, H.~Gong, and X.~Wang,
``Adaptive depth graph neural network-based dynamic task allocation for {UAV}-{UGV}s
under complex environments,''
\textit{IEEE Trans. Intell. Veh.}, vol.~10, no.~5, pp.~3573--3589, May 2025.
```

### Conference paper
```latex
\bibitem{xie2023}
Q.~Xie, W.~Chen, and Y.~Zhuang,
``Research on task planning and efficiency evaluation of multi-agent collaborative
search based on ant colony optimization,''
in \textit{Proc. 3rd Int. Signal Process., Commun. Eng. Manage. Conf. (ISPCEM)},
Wuhan, China, 2023, pp.~302--306.
```

### Book
```latex
\bibitem{ogata2010}
K.~Ogata,
\textit{Modern Control Engineering}, 5th~ed.
Upper Saddle River, NJ, USA: Prentice Hall, 2010.
```

### Book chapter
```latex
\bibitem{jacobs1963}
I.~S. Jacobs and C.~P. Bean,
``Fine particles, thin films and exchange anisotropy,''
in \textit{Magnetism}, vol.~III, G.~T. Rado and H.~Suhl, Eds.
New York, NY, USA: Academic, 1963, pp.~271--350.
```

### PhD thesis
```latex
\bibitem{doe2023}
J.~Doe,
``Fuzzy logic control for unmanned ground vehicles in unstructured terrain,''
Ph.D. dissertation, Dept. Syst. Control Eng., King Fahd Univ. Petroleum Minerals,
Dhahran, Saudi Arabia, 2023.
```

### arXiv preprint
```latex
\bibitem{hickling2026}
T.~Hickling, M.~Hogan, A.~Tammam, and N.~Aouf,
``Deep reinforcement learning based autonomous decision-making for cooperative {UAV}s:
A search and rescue real world application,''
\textit{arXiv preprint arXiv:2502.20326}, Feb. 2026.
```

### Website / standard
```latex
\bibitem{ieee2021}
IEEE, ``{IEEE} author center,'' 2021. [Online].
Available: https://ieeeauthorcenter.ieee.org
```

### Unpublished / submitted
```latex
\bibitem{smith2025}
A.~Smith, ``Title of paper if known,'' unpublished.
```

**Reference title rules:**
- Capitalize only the **first word** and **proper nouns** in paper titles
- Acronyms in titles: wrap in `{...}` to preserve caps: `{UAV}`, `{PSO}`, `{MATLAB}`
- Use `~` (non-breaking space) between initials and surnames: `J.~Doe`
- Use `--` (en-dash) for page ranges: `pp.~302--306`
- Journal names: use standard IEEE abbreviations (Trans., Proc., Lett., J.)
- Unless ≥6 authors: list all; at 6+: first author `et~al.`

---

## 7. Common Mistakes (from IEEE Template)

| Wrong | Right |
|-------|-------|
| `.25` | `0.25` |
| `eqnarray` | `align` or `IEEEeqnarray` |
| `(1)` as cross-ref | `\eqref{eq:label}` |
| `Ref. [3]` mid-sentence | `[3]` |
| "data is" | "data are" |
| "essentially" meaning "approximately" | "approximately" |
| "alternately" meaning "alternatively" | "alternatively" |
| "non-linear", "feed-forward" | "nonlinear", "feedforward" |
| `\label` before `\caption` | `\caption` then `\label` |
| Table caption below | Table caption **above** |
| Figure caption above | Figure caption **below** |
| Subtitle on paper | No subtitles (not captured in Xplore) |
| Math/symbols in abstract | Plain text only |
| `et al.` with period after "et" | `et al.` (no period after "et") |
| Mixing SI and CGS | Use SI throughout |
