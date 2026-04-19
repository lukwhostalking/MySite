// Timeline data — three card kinds: project | text | image
// project: hero visual + title
// text:    headline only
// image:   headline + image
window.TIMELINE_DATA = [
  {
    id: "eval-harness",
    date: "2026-04-14",
    kind: "project",
    title: "A scrappy eval harness for agent tool-use",
    hero: { type: "gradient", from: "oklch(0.72 0.12 38)", to: "oklch(0.55 0.10 25)", label: "evals.py" },
    tags: ["evals", "agents"],
    body: `
      <p>I kept shipping agent changes and then finding out three days later that tool-calling regressed on the boring cases. So I built a 200-line eval harness. It runs a fixed set of scripted conversations, diffs tool calls against expected, and writes a markdown report.</p>
      <p>The unlock wasn't the harness itself — it was deciding that <em>a failing eval blocks merge</em>. Once that rule existed, the evals started earning their keep.</p>
      <h3>What I'd do differently</h3>
      <ul>
        <li>Start with 5 evals, not 50. You will throw the first batch out.</li>
        <li>Log full traces to disk from day one. Debugging without them is misery.</li>
        <li>Don't bother with LLM-as-judge until deterministic checks are exhausted.</li>
      </ul>
    `,
  },
  {
    id: "context-rot",
    date: "2026-04-02",
    kind: "text",
    title: "Context rot is the new tech debt",
    tags: ["prompting"],
    body: `
      <p>Long-lived prompts accumulate cruft the same way codebases do. Every bug report adds a sentence. Every edge case adds a clause. Six months in, the prompt is 4,000 tokens of defensive posture and nobody remembers which rules still matter.</p>
      <p>I've started treating the system prompt like a doc: dated sections, explicit deprecations, and a quarterly cleanup pass where I delete anything I can't justify.</p>
    `,
  },
  {
    id: "drafting-ui",
    date: "2026-03-21",
    kind: "image",
    title: "Drafting: a writing surface that leaves the model at the door",
    image: { type: "mock", variant: "editor" },
    tags: ["ui", "writing"],
    body: `
      <p>Most AI writing tools put the model in the foreground — a chat, a sidebar, a button. I wanted the opposite: a plain text editor where the AI only shows up when I ask, and never interrupts the cursor.</p>
      <p>The rule I settled on: <strong>the model may suggest, never insert.</strong> Suggestions appear as gutter notes. Accepting one is a deliberate keystroke. It's slower than autocomplete. That's the point.</p>
      <p>Two weeks in, I've written more and edited less. Unclear if that's the tool or the novelty.</p>
    `,
  },
  {
    id: "small-models",
    date: "2026-03-09",
    kind: "text",
    title: "The small-model gap is smaller than I thought",
    tags: ["models", "cost"],
    body: `
      <p>Ran the same classification workload on a frontier model and a 4B open-weight model. The frontier model was 3 points more accurate and 40× more expensive. For the specific job — tagging incoming support tickets — 3 points did not matter.</p>
      <p>The lesson isn't "small models are good enough." It's "match the model to the job." I keep forgetting this and reaching for the biggest thing available.</p>
    `,
  },
  {
    id: "rag-retrospective",
    date: "2026-02-17",
    kind: "project",
    title: "A year of RAG, in retrospect",
    hero: { type: "gradient", from: "oklch(0.72 0.08 200)", to: "oklch(0.50 0.09 240)", label: "retrieval" },
    tags: ["rag", "essay"],
    body: `
      <p>I've shipped four production RAG systems in the last year. Here's what I wish someone had told me.</p>
      <h3>Chunking is the whole game</h3>
      <p>The embedding model matters less than you think. The reranker matters more than you think. But the chunking strategy — where you cut, how much overlap, what you attach as metadata — determines whether the system works at all.</p>
      <h3>Hybrid search, always</h3>
      <p>Dense + BM25 with a simple rank fusion beats dense-only on every corpus I've tried. No exceptions.</p>
    `,
  },
  {
    id: "prompt-diffs",
    date: "2026-02-03",
    kind: "image",
    title: "Prompt diffs: a git-for-prompts prototype",
    image: { type: "mock", variant: "diff" },
    tags: ["tooling"],
    body: `
      <p>A weekend prototype. It wraps your prompt in a tiny repo — every edit is a commit, every run is tagged with the prompt hash, and you can diff two versions side by side with the eval deltas shown in a margin.</p>
      <p>Works surprisingly well. I've been using it on a real project for two weeks and I'm no longer losing track of which version I shipped.</p>
    `,
  },
  {
    id: "agent-loops",
    date: "2026-01-22",
    kind: "text",
    title: "Three shapes of agent loops I keep seeing",
    tags: ["agents", "patterns"],
    body: `
      <p>After building a handful of agents, the control flow almost always lands in one of three shapes:</p>
      <ol>
        <li><strong>Scripted + escape hatch.</strong> Hand-written steps with an LLM call to handle the 10% of cases the script doesn't cover.</li>
        <li><strong>Loop-until-done.</strong> One prompt, one tool set, repeat until the model calls <code>finish()</code>. Simple and shockingly effective.</li>
        <li><strong>Planner + executor.</strong> First call produces a plan, second set of calls executes it. Good when steps are expensive.</li>
      </ol>
    `,
  },
  {
    id: "streaming-ui",
    date: "2026-01-08",
    kind: "project",
    title: "Streaming UI patterns for tool-using agents",
    hero: { type: "gradient", from: "oklch(0.78 0.10 95)", to: "oklch(0.58 0.14 60)", label: "living transcript" },
    tags: ["ui", "streaming"],
    body: `
      <p>Streaming text is solved. Streaming a sequence of tool calls, results, and intermediate thoughts — while keeping the user oriented — is not.</p>
      <p>I've been sketching a pattern I call "the living transcript": a single scrollable column where tool calls render as collapsed blocks, results fold in underneath, and text streams into the gaps. The key is that <em>every block has a stable identity</em> from the moment it starts streaming — no reflow, no content-shift, no lost scroll position.</p>
    `,
  },
  {
    id: "year-end",
    date: "2025-12-28",
    kind: "text",
    title: "What I got wrong about AI in 2025",
    tags: ["essay", "reflection"],
    body: `
      <p>A short list of things I was confident about in January and wrong about by December.</p>
      <p><strong>I thought agents would feel magical by now.</strong> They mostly feel like well-tuned cron jobs. That's not a complaint — the cron jobs are useful. But the "it thinks" feeling hasn't arrived, and I no longer expect it from scaling alone.</p>
      <p><strong>I thought context windows would keep mattering.</strong> Past ~200k, the returns collapsed for my workloads. Retrieval came back into fashion for good reason.</p>
    `,
  },
  {
    id: "first-post",
    date: "2025-11-30",
    kind: "text",
    title: "Starting this log",
    tags: ["meta"],
    body: `
      <p>A place to put the projects, half-thoughts, and lessons from building with AI. Nothing fancy — dated entries, one column, click to read.</p>
      <p>If you're reading this, hello.</p>
    `,
  },
];
