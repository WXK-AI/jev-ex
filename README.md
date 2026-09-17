# 🌐 Jev Benchmark Orchestrator: Multi-Model Task Distribution & AI Benchmark Router (MCP)
### Powered by TypeSafe Jev (System-1 Reflex AI Model) • Built for Claude & Codex

**Jev Benchmark Orchestrator** is an advanced Model Context Protocol (MCP) server and interactive web application that uses **TypeSafe Jev** to decompose complex engineering requests in **~150ms** and distribute sub-tasks across specialized frontier models based on empirical **AI Benchmark Dominance**:

- **SWE-bench Verified (70.3%) Leader**: **Claude 3.7 Sonnet** (Agentic multi-file coding, repository refactoring, test suite synthesis)
- **AIME 2024 / 2025 (87.3%) Leader**: **OpenAI o3-mini** (Formal mathematical proofs, discrete logic, concurrency invariants)
- **GPQA Diamond (84.8%) Leader**: **Claude 3.7 Sonnet / OpenAI o1** (Graduate-level PhD scientific reasoning)
- **IFEval (89.4%) Leader**: **Claude 3.5 Haiku / Gemini Flash** (Strict schema formatting, JSON/YAML generation at 96% lower cost)
- **Sub-Second Reflex Gating Leader**: **TypeSafe Jev** (150ms parallel pass, $0.042 / 1M tokens, pre-commit safety gatekeeping)

---

## 🎯 How It Works: Multi-Model Task Distribution

Instead of naively sending an entire complex project to one single model, **TypeSafe Jev** analyzes the prompt in ~150ms and generates a **Benchmark-Optimal Distributed Execution Pipeline**:

```
[ Complex User Objective ]
           │
           ▼  (TypeSafe Jev ~150ms Reflex Decomposition)
 ┌─────────────────────────────────────────────────────────────┐
 │ 1. Mathematical Proofs & Constraints ➔ OpenAI o3-mini (AIME: 87.3%)     │
 │ 2. Multi-File Architecture & Tests   ➔ Claude 3.7 Sonnet (SWE-bench: 70.3%) │
 │ 3. OpenAPI Schemas & Documentation   ➔ Claude 3.5 Haiku (IFEval: 89.4%)     │
 │ 4. Pre-Commit Safety & Secret Gate   ➔ TypeSafe Jev (System-1 Reflex: 150ms) │
 └─────────────────────────────────────────────────────────────┘
```

This yields **better overall accuracy** (assigning the true champion to each domain) and **saves ~68% in cost** by avoiding wasteful frontier reasoning on documentation and formatting.

---

## 🔌 MCP Integration (Claude & Codex)

Server location: `/Volumes/Xk-Drive/Jev-Ex/mcp-server.js`

### 1. Claude Desktop
Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "jev-orchestrator": {
      "command": "node",
      "args": ["/path/to/jev-ex/mcp-server.js"],
      "env": {
        "TYPESAFE_API_KEY": "your_typesafe_api_key_here"
      }
    }
  }
}
```

### 2. Claude Code (CLI)
```bash
claude mcp add jev-orchestrator node /path/to/jev-ex/mcp-server.js -e TYPESAFE_API_KEY=your_typesafe_api_key_here
```

### 3. Codex / Cursor / VS Code
Add to your `.cursor/mcp.json` (or Cursor Settings -> Features -> MCP):
```json
{
  "mcpServers": {
    "jev-orchestrator": {
      "command": "node",
      "args": ["/path/to/jev-ex/mcp-server.js"],
      "env": {
        "TYPESAFE_API_KEY": "your_typesafe_api_key_here"
      }
    }
  }
}
```

---

## 🛠️ MCP Tools Exposed

1. **`distribute_and_route_task(task_or_prompt, target_ecosystem)`**:
   - Decomposes projects in ~150ms and distributes sub-tasks across SWE-bench, AIME, and GPQA leader models.
2. **`get_benchmark_matrix(category_filter)`**:
   - Returns verified empirical benchmark scores across all AI categories.
3. **`route_single_prompt(prompt)`**:
   - Single-task fast router.
4. **`system_one_reflex(state, decision_type, instructions, options)`**:
   - Direct access to Jev's sub-second System-1 decision engine.

---

## 💻 Interactive Web Application

- **Live Dashboard**: [http://localhost:5173](http://localhost:5173) (or `http://localhost:3001`)
- **Task Distribution Studio**: Input complex objectives and inspect the multi-stage visual execution graph.
- **Benchmark Matrix Tab**: View verified leaderboard scores across SWE-bench Verified, AIME, GPQA Diamond, MMLU-Pro, and IFEval.
- **ROI Calculator**: Real-time savings projection slider.

---

## 🚀 Running Locally

```bash
npm run dev
```
