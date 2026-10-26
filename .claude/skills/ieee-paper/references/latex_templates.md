# LaTeX Templates for IEEE Papers

## Table of Contents
1. [Main Template (main.tex)](#1-main-template-maintex)
2. [main.bbl Template](#2-mainbbl-template)
3. [Author Block Patterns](#3-author-block-patterns)
4. [Section Templates](#4-section-templates)
5. [Equation Snippets](#5-equation-snippets)
6. [Algorithm Block](#6-algorithm-block)

---

## 1. Main Template (main.tex)

Use this exactly when creating a new `main.tex`. Fill in the placeholders marked `[...]`.

```latex
\documentclass[conference]{IEEEtran}
\IEEEoverridecommandlockouts

% ---- Core packages ----
\usepackage{cite}                 % Compressed, sorted citation ranges [1]–[3]
\usepackage{amsmath,amssymb,amsfonts}
\usepackage{algorithmic}
\usepackage{algorithm}
\usepackage{graphicx}
\usepackage{textcomp}
\usepackage{xcolor}
\usepackage{booktabs}             % Professional tables (\toprule, \midrule, \bottomrule)
\usepackage{multirow}             % Multi-row table cells
\usepackage{subfig}               % Sub-figures: \subfloat
\usepackage{hyperref}             % Clickable cross-refs (disable for camera-ready if needed)

\def\BibTeX{{\rm B\kern-.05em{\sc i\kern-.025em b}\kern-.08em
    T\kern-.1667em\lower.7ex\hbox{E}\kern-.125emX}}

% ============================================================
\begin{document}
% ============================================================

\title{[Paper Title — No Symbols, No Math, No Subtitle]}

% See references/latex_templates.md § Author Block Patterns for multi-author variants
\author{
\IEEEauthorblockN{1\textsuperscript{st} [Given Name Surname]}
\IEEEauthorblockA{
    \textit{[Department Name]} \\
    \textit{[Institution Name]} \\
    [City, Country] \\
    [email@domain.com]}
\and
\IEEEauthorblockN{2\textsuperscript{nd} [Given Name Surname]}
\IEEEauthorblockA{
    \textit{[Department Name]} \\
    \textit{[Institution Name]} \\
    [City, Country] \\
    [email@domain.com]}
}

\maketitle

% ---- Funding footnote (delete if no funding) ----
\thanks{[Identify applicable funding agency here. If none, delete this.]}

% ---- Abstract: NO math, NO symbols, NO special chars ----
\begin{abstract}
[Abstract text here — 150–250 words. Plain text only.]
\end{abstract}

\begin{IEEEkeywords}
[keyword1, keyword2, keyword3, keyword4, keyword5]
\end{IEEEkeywords}

% ============================================================
\section{Introduction}
% ============================================================

\IEEEPARstart{[F]}{irst} word of first paragraph continues here...

[Introduction body. End with a clear statement of contributions,
e.g., "The main contributions of this paper are as follows:"]

\begin{itemize}
    \item [Contribution 1]
    \item [Contribution 2]
    \item [Contribution 3]
\end{itemize}

The remainder of this paper is organized as follows.
Section~\ref{sec:related} reviews the related work.
Section~\ref{sec:method} presents the proposed method.
Section~\ref{sec:results} discusses the simulation results.
Section~\ref{sec:conclusion} concludes the paper.

% ============================================================
\section{Related Work}
\label{sec:related}
% ============================================================

[Related work — synthesized from literature review output if available.]

% ============================================================
\section{System Model and Problem Formulation}
\label{sec:model}
% ============================================================

[System description, mathematical model, problem statement.]

% ============================================================
\section{Proposed Method}
\label{sec:method}
% ============================================================

[Controller/algorithm design, theoretical analysis, block diagram.]

% ============================================================
\section{Simulation Results}
\label{sec:results}
% ============================================================

[Simulation setup, results, comparison table, performance analysis.]

% ============================================================
\section{Conclusion}
\label{sec:conclusion}
% ============================================================

[Summary of findings, limitations, future work.]

% ============================================================
\section*{Acknowledgment}   % unnumbered
% ============================================================

[Acknowledgment of funding, collaborators, etc.]

% ============================================================
% REFERENCES — managed via main.bbl
% ============================================================
\input{main.bbl}

\end{document}
```

---

## 2. main.bbl Template

`main.bbl` is the standalone bibliography file. It is `\input{}`'d into `main.tex`.
Maintain all references here — never scatter `\bibitem` entries inside `main.tex`.

```latex
% =========================================================
% main.bbl — IEEE Reference List
% Paper: [Paper Title]
% 
% Format: IEEEtran \bibitem style
% Key convention: firstauthorYYYY (e.g., ma2025, garg2022)
% 
% Rules:
%   - Paper titles: only first word and proper nouns capitalized
%   - Acronyms: wrap in {braces} to preserve caps: {UAV}, {PSO}
%   - Use ~ (non-breaking space) between initials: J.~Doe
%   - Page ranges: pp.~Z1--Z2 (en-dash)
%   - Journal names: IEEE standard abbreviations
%   - ≤5 authors: list all; ≥6: first author + et~al.
% =========================================================

\begin{thebibliography}{00}

% ---- Add entries below, sorted by citation order in text ----

% Journal article template:
% \bibitem{key}
% A.~Author and B.~Author,
% ``Title with only first word capitalized,''
% \textit{Journal Abbrev.}, vol.~X, no.~Y, pp.~Z1--Z2, Mon. Year.

% Conference paper template:
% \bibitem{key}
% A.~Author, B.~Author, and C.~Author,
% ``Conference paper title,''
% in \textit{Proc. Conf. Name Abbrev.}, City, Country, Year, pp.~Z1--Z2.

\end{thebibliography}
```

---

## 3. Author Block Patterns

### Single author
```latex
\author{
\IEEEauthorblockN{Author Name}
\IEEEauthorblockA{
    \textit{Dept. Systems \& Control Engineering} \\
    \textit{King Fahd University of Petroleum \& Minerals} \\
    Dhahran, Saudi Arabia \\
    authorname@kfupm.edu.sa}
}
```

### Two authors, same institution
```latex
\author{
\IEEEauthorblockN{First Author\IEEEauthorrefmark{1}, Second Author\IEEEauthorrefmark{1}}
\IEEEauthorblockA{\IEEEauthorrefmark{1}
    \textit{Dept. Systems \& Control Engineering,
    King Fahd University of Petroleum \& Minerals,
    Dhahran, Saudi Arabia} \\
    \{first.author, second.author\}@kfupm.edu.sa}
}
```

### Three authors, mixed institutions
```latex
\author{
\IEEEauthorblockN{1\textsuperscript{st} First Author}
\IEEEauthorblockA{
    \textit{Dept. A} \\ \textit{Institution A} \\
    City, Country \\ email1@inst.edu}
\and
\IEEEauthorblockN{2\textsuperscript{nd} Second Author}
\IEEEauthorblockA{
    \textit{Dept. B} \\ \textit{Institution B} \\
    City, Country \\ email2@inst.edu}
\and
\IEEEauthorblockN{3\textsuperscript{rd} Third Author}
\IEEEauthorblockA{
    \textit{Dept. A} \\ \textit{Institution A} \\
    City, Country \\ email3@inst.edu}
}
```

---

## 4. Section Templates

### Introduction opening
```latex
\section{Introduction}

\IEEEPARstart{U}{nmanned} ground vehicles (UGVs) have emerged as a critical
platform for search and rescue, surveillance, and hazardous environment
operations [1], [2]. The integration of soft computing techniques — including
fuzzy logic, neural networks, and swarm intelligence — has significantly
enhanced their autonomous decision-making capabilities [3].

Despite recent advances, several challenges remain: ...

The main contributions of this paper are:
\begin{itemize}
    \item A novel fuzzy-tuned PID controller for UGV speed regulation;
    \item A PSO-based parameter optimization framework minimizing ITAE;
    \item Simulation validation against conventional PID under dynamic conditions.
\end{itemize}
```

### Related Work paragraph structure
```latex
\section{Related Work}
\label{sec:related}

% Paragraph per theme from literature review
Early approaches to multi-robot coordination relied on centralized task
allocation, where a master node assigned tasks based on static pre-defined
rules [4], [5]. While computationally simple, these methods fail to adapt
to dynamic environments [6].

Swarm intelligence methods have been increasingly applied to overcome these
limitations. Garg~et~al. [7] proposed a distributed robotic PSO algorithm
for dynamic target search with limited intercommunication, achieving over
80\% detection rates. Qiu~et~al. [8] extended PSO within a game-theoretic
framework for collision-free 3D path planning. However, both approaches
validate exclusively in simulation, leaving real-world applicability open.

% Gap → motivation
None of the reviewed methods address [specific gap relevant to proposed work].
This paper proposes [proposed solution] to fill this gap.
```

### Results section with table and figure
```latex
\section{Simulation Results}
\label{sec:results}

\subsection{Simulation Setup}
Simulations were conducted in MATLAB R2024a using the Simulink model
described in Section~\ref{sec:method}. The UGV parameters are listed in
Table~\ref{tab:params}. A unit step reference was applied at $t = 0$~s,
and each controller was evaluated over a 10~s horizon.

\begin{table}[t]
\caption{UGV System Parameters}
\label{tab:params}
\begin{center}
\begin{tabular}{lcc}
\toprule
\textbf{Parameter} & \textbf{Symbol} & \textbf{Value} \\
\midrule
Vehicle mass       & $m$    & 8~kg \\
Max. speed         & $v_{\max}$ & 2.5~m/s \\
Sampling period    & $T_s$  & 0.01~s \\
\bottomrule
\end{tabular}
\end{center}
\end{table}

\subsection{Performance Comparison}
The step responses of all three controllers are shown in Fig.~\ref{fig:step}.
Performance metrics are summarized in Table~\ref{tab:metrics}.

\begin{figure}[t]
\centerline{\includegraphics[width=\columnwidth]{figs/step_response.pdf}}
\caption{Step response comparison: conventional PID, fuzzy PID, and PSO-tuned PID.}
\label{fig:step}
\end{figure}

The proposed fuzzy PID achieves a rise time of 0.87~s — a 30\% improvement
over conventional PID — while reducing overshoot from 12.3\% to 4.1\%.
The ITAE metric confirms superior tracking performance across the
entire simulation horizon, as quantified in Table~\ref{tab:metrics}.
```

---

## 5. Equation Snippets

### State-space model
```latex
The UGV dynamics are modeled as a second-order system:
\begin{align}
    \dot{\mathbf{x}}(t) &= A\mathbf{x}(t) + Bu(t), \label{eq:state} \\
    y(t)                &= C\mathbf{x}(t),           \label{eq:output}
\end{align}
where $\mathbf{x} = [v, \dot{v}]^\top$ is the state vector,
$u$ is the control input, and $y$ is the measured output.
```

### Fuzzy control rule
```latex
The fuzzy inference follows Mamdani's method. A representative rule is:
\begin{equation}
    \text{IF } e \text{ is } \tilde{N}B \text{ AND } \dot{e} \text{ is } \tilde{N}B
    \text{ THEN } u \text{ is } \tilde{N}B,
    \label{eq:fuzzy_rule}
\end{equation}
where $\tilde{N}B$ denotes the "Negative Big" linguistic variable.
```

### PSO update equations
```latex
The velocity and position update equations of PSO are:
\begin{align}
    v_i^{k+1} &= w v_i^k + c_1 r_1 (p_i^k - x_i^k)
                          + c_2 r_2 (g^k   - x_i^k), \label{eq:pso_vel} \\
    x_i^{k+1} &= x_i^k + v_i^{k+1},                  \label{eq:pso_pos}
\end{align}
where $w$ is the inertia weight, $c_1$ and $c_2$ are cognitive and social
coefficients, and $r_1, r_2 \sim \mathcal{U}(0,1)$.
```

### ITAE cost function
```latex
The optimization objective is the Integral of Time-weighted Absolute Error (ITAE):
\begin{equation}
    J_{\text{ITAE}} = \int_0^{T} t \, |e(t)| \, \mathrm{d}t,
    \label{eq:itae}
\end{equation}
where $e(t) = r(t) - y(t)$ is the tracking error and $T$ is the
simulation horizon.
```

---

## 6. Algorithm Block

```latex
\begin{algorithm}
\caption{PSO-Based PID Parameter Optimization}
\label{alg:pso}
\begin{algorithmic}[1]
\REQUIRE Cost function $J(\cdot)$, bounds $[\mathbf{lb}, \mathbf{ub}]$, $N$, $K_{\max}$
\ENSURE Optimal gains $[K_p^*, K_i^*, K_d^*]$
\STATE Initialize particle positions $\mathbf{x}_i \sim \mathcal{U}(\mathbf{lb}, \mathbf{ub})$
\STATE Initialize velocities $\mathbf{v}_i \leftarrow \mathbf{0}$
\STATE $\mathbf{p}_i \leftarrow \mathbf{x}_i$, $\mathbf{g} \leftarrow \arg\min_i J(\mathbf{x}_i)$
\FOR{$k = 1$ \TO $K_{\max}$}
    \FOR{$i = 1$ \TO $N$}
        \STATE Update $\mathbf{v}_i$ via \eqref{eq:pso_vel}
        \STATE Update $\mathbf{x}_i$ via \eqref{eq:pso_pos}; clamp to $[\mathbf{lb}, \mathbf{ub}]$
        \IF{$J(\mathbf{x}_i) < J(\mathbf{p}_i)$}
            \STATE $\mathbf{p}_i \leftarrow \mathbf{x}_i$
            \IF{$J(\mathbf{x}_i) < J(\mathbf{g})$}
                \STATE $\mathbf{g} \leftarrow \mathbf{x}_i$
            \ENDIF
        \ENDIF
    \ENDFOR
\ENDFOR
\RETURN $\mathbf{g}$
\end{algorithmic}
\end{algorithm}
```
