# Human Writing Patterns — What to Introduce

These are the techniques, structures, and habits that make text read as
authentically written by a thinking person. Use these as the replacement
vocabulary for everything removed by `llm_patterns.md`.

---

## 1. Sentence Rhythm Variation

The most powerful single technique. Use all three lengths in every paragraph.

### Short sentences for emphasis
After a long technical explanation, land the conclusion hard:
> "...the inertia weight governs the trade-off between global and local search.
> Get it wrong and the swarm stagnates."

### The mid-length workhorse
The 12–20 word sentence carries most of the argument. It is direct without
being curt.

### Long sentences for complex relationships
Use when two or more ideas are genuinely intertwined and separating them would
require repeating context:
> "Unlike decoupled methods that treat each robot's path as an independent
> subproblem — accepting the suboptimality that follows — the hybrid approach
> coordinates planning globally while preserving each robot's computational
> autonomy."

### Fragment for punch
> "The results were better than expected. Significantly better."

Fragments read naturally in academic writing when used sparingly (once per section, maximum).

---

## 2. Transition Replacement

Replace stock connectives with alternatives that feel more deliberate:

| Remove | Replace with |
|--------|-------------|
| "Furthermore," | Start a new sentence directly. Context implies connection. |
| "Moreover," | "Beyond this," / "What's more important," / just continue |
| "Additionally," | "There's also" / "Another factor:" / fold into prior sentence |
| "In contrast," | "The opposite is true for X." / "X behaves differently — " |
| "On the other hand," | "That said," / "Though" mid-sentence / new paragraph |
| "Therefore," | "So" (informal) / "This means" / restructure causally |
| "Consequently," | restructure: "X causes Y directly" |
| "It is worth noting" | Just say the thing. If it's worth noting, note it. |
| "In conclusion," | Begin the conclusion paragraph without a label. |
| "This demonstrates" | "The data show" / "This confirms" / "These numbers suggest" |

---

## 3. Authorial Stance Markers

Real writers take positions. These phrases signal a human perspective:

- "The interesting question here is..."
- "What this actually means is..."
- "The real problem, though, is..."
- "This is where it gets complicated."
- "That said, [counterpoint]."
- "In practice, this rarely holds."
- "Whether this generalizes beyond simulation is an open question."
- "Arguably, the more useful metric is..."
- "The comparison is instructive."
- "This is not a minor distinction."

Note: these should express *genuine* uncertainty or emphasis about the content,
not be inserted randomly. They work because they sound like someone who has
actually thought about the problem.

---

## 4. Specificity Over Generality

LLMs generalize. Humans remember specifics. Replace vague references with
concrete ones wherever possible:

| Vague (LLM) | Specific (Human) |
|-------------|-----------------|
| "Several studies have shown..." | "Garg et al. [2] and Qiu et al. [3] both show..." |
| "The algorithm performs well" | "Detection rates exceed 80% across all tested map sizes" |
| "significant improvement" | "30% reduction in rise time" |
| "various optimization methods" | "PSO, ACO, and genetic algorithms" |
| "traditional approaches" | "fixed-priority task assignment used in [4]–[6]" |
| "extensive simulations" | "200 Monte Carlo runs across three environment types" |

---

## 5. Before / After Rewrites by Context

### Academic paper — Introduction paragraph

**Before (LLM):**
> In recent years, unmanned ground vehicles (UGVs) have garnered significant
> attention in the field of robotics and autonomous systems. Furthermore, the
> integration of soft computing techniques, such as fuzzy logic and neural
> networks, has enabled more robust and adaptive control strategies.
> Additionally, particle swarm optimization (PSO) has emerged as a powerful
> tool for parameter tuning. It is worth noting that existing methods often
> fail to address the dynamic nature of real-world environments. Therefore,
> this paper proposes a novel fuzzy PID controller optimized via PSO.

**After (human):**
> Autonomous ground vehicles operating in unstructured terrain face a specific
> problem: standard PID controllers, tuned for nominal conditions, degrade
> quickly when the environment changes. Fuzzy logic addresses this by encoding
> the kind of rule-based reasoning a skilled operator would apply — but selecting
> the right membership function parameters still requires either expert knowledge
> or systematic optimization. PSO offers a data-driven path to that optimization.
> The approach here combines both: a Mamdani fuzzy controller whose parameters
> are tuned offline by PSO minimizing ITAE, then deployed in closed-loop simulation.

---

### Related Work paragraph

**Before (LLM):**
> Garg et al. [2] proposed a distributed cooperative approach for dynamic target
> search using particle swarm optimization with limited intercommunication.
> The authors demonstrated that their method achieves a detection rate of over
> 80%. However, their approach is validated only in simulation and does not
> consider heterogeneous robot teams. Similarly, Qiu et al. [3] presented a
> hybrid method combining game theory and PSO for 3D path planning. While their
> results show promising performance, the method has not been tested in
> real-world environments. None of the above methods address the specific
> challenge of dynamic task reallocation in GPS-denied environments.

**After (human):**
> Two papers are directly relevant here. Garg et al. [2] built a distributed
> robotic PSO for multi-target search under limited communication — the key
> result being >80% detection maintained even when inter-robot bandwidth was
> constrained. Qiu et al. [3] approached a related problem (3D path planning)
> by embedding PSO inside a game-theoretic framework, using Nash equilibrium
> as the convergence criterion. Both methods work. Both also stay in simulation,
> with idealized communication ranges and no GPS degradation. The question this
> paper asks is whether PSO-based coordination holds when those assumptions
> are removed.

---

### General document — Explanation paragraph

**Before (LLM):**
> The fuzzy logic controller operates by taking crisp inputs and fuzzifying them
> into linguistic variables. Subsequently, the inference engine applies the
> fuzzy rules to generate a fuzzy output. Finally, the defuzzification process
> converts this fuzzy output into a crisp control signal. This comprehensive
> process enables the controller to handle uncertainty and imprecision in a
> robust manner, making it particularly suitable for complex control tasks.

**After (human):**
> A fuzzy controller works in three stages. First, the crisp sensor inputs —
> say, speed error and its rate of change — get mapped to linguistic labels
> like "large negative" or "small positive." Then a rule table (essentially
> a lookup of expert intuition) determines the output label. Finally, that
> label is converted back to a number the actuator can use. The whole point
> is to encode the kind of judgment a skilled operator develops over time,
> without requiring a precise mathematical model of the system.

---

### Code comments

**Before (LLM):**
```python
# This function implements the Particle Swarm Optimization algorithm.
# It takes the cost function, parameter bounds, and configuration as inputs.
# The function iterates through the specified number of generations,
# updating particle velocities and positions according to the PSO update rules.
# It returns the best solution found and its corresponding cost value.
def run_pso(cost_fn, lb, ub, cfg):
    # Initialize particle positions randomly within the bounds
    pos = lb + np.random.rand(cfg.n, len(lb)) * (ub - lb)
    # Initialize particle velocities to zero
    vel = np.zeros_like(pos)
```

**After (human):**
```python
# PSO — minimizes cost_fn over [lb, ub]
# w=0.7 worked better than adaptive variants for this problem
def run_pso(cost_fn, lb, ub, cfg):
    pos = lb + np.random.rand(cfg.n, len(lb)) * (ub - lb)
    vel = np.zeros_like(pos)  # start stationary, let the swarm drift naturally
```

---

## 6. Structural Variation Techniques

### Break the symmetry
If three consecutive paragraphs all start with a cited claim, start the fourth
with a question, a concrete observation, or a direct assertion.

### Let some points breathe alone
Not every claim needs a supporting sentence. If something is clear from context
or from a citation, state it and move on. Over-explanation is an LLM tell.

### Vary how you introduce evidence
- "X shows this directly — [evidence]."
- "[Evidence]. X is the reason."
- "The numbers make this concrete: [evidence]."
- "[Citation] puts it plainly: '[direct quote if available].'"

### Use the dash
Em-dashes create a natural aside rhythm that LLMs underuse. They signal a
thinking-aloud quality:
> "The real bottleneck — and this is where most methods fail — is not the
> optimization but the communication model."

### Rhetorical questions (use sparingly, once per section max)
> "The question, then, is not whether fuzzy logic outperforms PID in all cases
> — it does not — but under what conditions the gap is meaningful."

---

## 7. Domain-Specific Register Guide

### IEEE conference paper
- First person plural: "We propose," "We observe," "Our results show"
- Do not use contractions
- Hedging is specific: "for speeds below 2 m/s," not "in some cases"
- Direct result statements: "Rise time decreases by 30%" not "a significant reduction was achieved"
- Authorial commentary is fine: "The improvement is modest but consistent."

### Thesis / dissertation
- First person singular acceptable: "I adopt," "In this work, I argue"
- Can be slightly more conversational in motivation sections
- Allowed to show uncertainty explicitly: "At the time of writing, no comparable
  benchmark exists for this specific configuration."

### Technical report
- Direct, functional. No rhetorical questions.
- Use "we" for collaborative work, "the system" or "the algorithm" for passive
  descriptions of the artifact.

### General / blog-style document
- Contractions throughout
- Shorter paragraphs (3–5 sentences)
- Can use "you" to address reader directly
- Em-dashes and parentheticals freely
