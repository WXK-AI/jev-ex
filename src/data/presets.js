export const PRESETS = [
  {
    id: 'byzantine-ledger',
    title: '🛡️ Byzantine Fault-Tolerant Distributed Ledger',
    subtitle: 'Decomposes across Claude Agent (SWE-bench 70.3%), Codex Agent (AIME 87.3%) & Jev Reflex',
    prompt: 'Build a production-grade Byzantine Fault Tolerant distributed ledger service in TypeScript. Require a formal mathematical proof of safety and liveness under partial synchrony, a complete multi-file consensus engine with scaffolded vitest tests, and automated OpenAPI 3.1 documentation schemas.'
  },
  {
    id: 'hft-matching-engine',
    title: '⚡ HFT Lock-Free Matching Engine with Formal Proof',
    subtitle: 'Decomposes into Concurrency Math (Codex o3-mini), C++20 Core (Claude 3.7) & Pre-Commit Reflex Gate',
    prompt: 'Architect a sub-microsecond electronic order matching engine in C++20. Include a rigorous formal proof of lock-free queue invariance and non-blocking FIFO order matching, cacheline-padded atomic ring buffers, and a sub-millisecond reflex gatekeeper for incoming order anomaly rejection.'
  },
  {
    id: 'genomic-graph-engine',
    title: '🧬 Genomic Sequence Alignment & Graph Search',
    subtitle: 'Decomposes into PhD Biology / GPQA Analysis (OpenAI o1), Rust SIMD Engine & Fast CLI Schema',
    prompt: 'Develop a high-throughput biological DNA sequence aligner using de Bruijn graphs. Requires graduate-level biophysical scoring calibration (GPQA Diamond criteria), an optimized multi-threaded Rust implementation with SIMD AVX2 acceleration, and clean JSON/CLI output formatting.'
  },
  {
    id: 'fast-data-pipeline',
    title: '🚀 Routine Web Extraction & Schema Normalizer',
    subtitle: 'Atomic Fast Task: Routes 100% to Lightweight Claude 3.5 Haiku (165 t/s, 96% cost reduction)',
    prompt: 'Parse this raw HTML table of customer invoices, clean unformatted telephone numbers into international E.164 format, and output a validated JSON array matching our schema.'
  }
];
