# LLM Pattern Catalogue — What to Remove

Every pattern here is a flag. The more of them appear together, the higher the
AI detection score. Eliminate as many as possible without sacrificing meaning.

---

## 1. Stock Opening Phrases

These are the single most reliably detected LLM markers. Never start a sentence
or paragraph with any of these:

### Transition starters
- "Furthermore,"
- "Moreover,"
- "Additionally,"
- "In addition,"
- "Similarly,"
- "Likewise,"
- "Consequently,"
- "Therefore," *(occasional use is fine; constant use is a flag)*
- "Thus," *(same)*
- "Hence,"
- "Accordingly,"
- "Subsequently,"
- "Nevertheless,"
- "Nonetheless,"
- "In contrast,"
- "On the other hand," *(fine once; a flag if used repeatedly)*
- "It is worth noting that"
- "It should be noted that"
- "It is important to note that"
- "Notably,"
- "Significantly,"
- "Importantly,"
- "Interestingly,"
- "Surprisingly,"
- "Crucially,"
- "Evidently,"
- "Undoubtedly,"
- "Certainly,"
- "Of course,"

### Conclusion starters
- "In conclusion,"
- "In summary,"
- "To summarize,"
- "To conclude,"
- "Overall,"
- "In essence,"
- "Ultimately,"
- "In short,"
- "All in all,"
- "To sum up,"

### Introduction starters
- "In recent years,"  *(extremely common LLM opener — avoid)*
- "With the rapid development of"
- "With the advent of"
- "In the context of"
- "In the realm of"
- "In today's world,"
- "As technology continues to advance,"

---

## 2. Hollow Qualifiers and Filler Phrases

These add length without adding meaning. Cut or replace with specifics:

- "essentially"
- "basically"
- "fundamentally"
- "inherently"
- "intrinsically"
- "it could be argued that"
- "it can be seen that"
- "it is clear that"
- "it is evident that"
- "it is apparent that"
- "this allows for"
- "this enables"  *(fine once; overused by LLMs)*
- "this ensures"  *(same)*
- "plays a crucial role"
- "plays a key role"
- "plays an important role"
- "is of paramount importance"
- "is of utmost importance"
- "cannot be overstated"
- "a wide range of"
- "a variety of"
- "a number of"  *(replace with the actual number or "several")*
- "various" *(as a vague catch-all)*
- "numerous"  *(same)*
- "multifaceted"
- "comprehensive"  *(when applied to the author's own work)*
- "robust"  *(LLM favorite — use only when technically accurate)*
- "novel"  *(overused — only when genuinely new)*
- "state-of-the-art"  *(only when citing specific benchmarks)*
- "cutting-edge"
- "innovative"  *(applied to one's own work is a red flag)*
- "powerful"  *(applied to algorithms without quantification)*
- "delve into"  *(very strong LLM tell — never use)*
- "dive into"
- "shed light on"
- "underscore"  *(overused)*
- "underscore the importance of"
- "highlight"  *(fine occasionally; not in every paragraph)*
- "showcase"
- "leverage"  *(business jargon — especially flagged)*
- "utilize"  *(almost always just "use")*
- "facilitate"  *(usually just "help" or "enable")*
- "demonstrate" *(fine in academic writing; not in every sentence)*

---

## 3. Structural Patterns

### The Perfect Three-Part List
LLMs love lists of exactly three items with parallel grammatical structure and
roughly equal length. Humans don't actually think in threes — they think in
whatever number the topic naturally produces. Break this by:
- Using 2 or 4 items
- Making items deliberately unequal in length
- Not bulleting when prose would work fine

### The Balanced Paragraph
Every paragraph has: topic sentence → 2-3 supporting sentences → summary sentence.
This mechanical structure is readable but robotic. Humans sometimes skip the topic
sentence, sometimes skip the wrap-up, sometimes let a point breathe across two short
paragraphs instead of one long one.

### Comprehensive Coverage
LLMs address every angle. Humans focus on what they find interesting or important.
If a section covers every possible consideration with equal weight, it reads as
machine-generated. Cut the less important points or make the prioritization explicit:
"The two factors that matter most here are X and Y."

### Symmetry in Pro/Con Analysis
"While X offers advantages A and B, it also faces limitations C and D." This exact
structure, repeated, is detectable. Vary how you handle trade-offs — sometimes lead
with the limitation, sometimes frame the whole thing as a question.

### Every Sentence Starting with a Different Subject
LLMs vary sentence subjects mechanically to avoid repetition. Real writing sometimes
repeats a subject because that's what the paragraph is about. A paragraph about
"the fuzzy controller" can say "the fuzzy controller" three times.

---

## 4. Sentence-Level Patterns

### Uniform Sentence Length
If all sentences are 15–25 words, that's a flag. Real writing mixes:
- Short (3–8 words). Emphatic.
- Medium (10–20 words): the workhorse of academic prose.
- Long (25–40 words): for complex technical relationships that require full elaboration.

### Passive Voice Everywhere
Academic writing uses passive voice, but not exclusively. "The results show" is fine.
"The results were shown to be consistent with" is not — prefer "Results confirm."
The flag is passive voice applied to every action in the text.

### The Academic Hedge Stack
"It could potentially be argued that this approach may possibly offer some advantages."
Real hedging is specific: "This works well for speeds below 2 m/s; beyond that, the
response degrades." Specific hedging > vague hedging.

### The Citation as Punctuation
`blah blah blah [1]. Blah blah blah [2]. Blah blah blah [3].` — citations at the
end of every sentence, uniformly distributed. Real writers cite clusters of work
together, or cite one key paper and discuss it, not tag every sentence.

---

## 5. Academic Paper Specific Patterns

### Abstract Patterns
- "This paper presents a novel approach to..."
- "In this paper, we propose..."  *(fine once; opening with it is a flag)*
- "The proposed method achieves superior performance..."
- "Extensive simulations demonstrate..."
- "The results demonstrate the effectiveness of the proposed approach."
  *(extremely common last sentence of LLM abstracts)*

### Introduction Patterns
- Paragraph 1: general field motivation
- Paragraph 2: specific problem
- Paragraph 3: "However, existing methods suffer from X, Y, and Z."
- Paragraph 4: "To address these limitations, this paper proposes..."
- Paragraph 5: contributions list
- Paragraph 6: paper organization

This is the canonical LLM introduction structure. It is detectable because it is
*too clean*. Real introductions meander slightly, emphasize differently, might spend
two paragraphs on motivation and one line on organization.

### Conclusion Patterns
- "In this paper, we proposed..."  *(summarizing what was said, verbatim)*
- "The simulation results demonstrate..."
- "Future work will explore..."  *(acceptable but generic)*
- Ending with "the proposed method shows great promise for future applications."

### Related Work Patterns
- Every paragraph covering exactly one paper (or one group)
- Each paragraph ending with a limitation of that paper
- Perfect logical flow from most-general to most-specific
- "However, none of the above methods address [exact gap your paper fills]."
  *(as the literal last sentence of Related Work — very common LLM tell)*
