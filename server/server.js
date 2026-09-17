import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { tradingEngine } from './tradingEngine.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');
const mcpScriptPath = path.resolve(__dirname, '../mcp-server.js');

const app = express();
const PORT = process.env.PORT || 3001;
const TYPESAFE_API_KEY = process.env.TYPESAFE_API_KEY || '';
const TYPESAFE_API_URL = 'https://api.typesafe.ai/v1/systemone';

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Health Check & Model Ping
app.get('/api/health', async (req, res) => {
  const startTime = Date.now();
  try {
    const response = await fetch(TYPESAFE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TYPESAFE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        state: 'Ping check for system status',
        model: 'jev-latest',
        questions: {
          status: {
            type: 'noul',
            instructions: 'Is the system operational?'
          }
        }
      })
    });

    const latency = Date.now() - startTime;
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        status: 'error',
        message: 'TypeSafe API error',
        details: errText,
        latency_ms: latency
      });
    }

    const data = await response.json();
    return res.json({
      status: 'online',
      provider: 'TypeSafe AI',
      model: data.model || 'jev-latest',
      latency_ms: latency,
      connected: true,
      mcp_path: mcpScriptPath
    });
  } catch (error) {
    return res.status(500).json({
      status: 'offline',
      error: error.message,
      latency_ms: Date.now() - startTime
    });
  }
});

// Helper to query TypeSafe Jev API
async function queryJevSystemOne(statePayload) {
  const response = await fetch(TYPESAFE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TYPESAFE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(statePayload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let parsed;
    try { parsed = JSON.parse(errorBody); } catch { parsed = errorBody; }
    const err = new Error(`TypeSafe API error (${response.status})`);
    err.details = parsed;
    err.status = response.status;
    throw err;
  }

  return await response.json();
}

// Distribute & Route Endpoint (Benchmark-Driven Task Decomposition Organized by Connected Agent)
app.post('/api/distribute-route', async (req, res) => {
  const startTime = Date.now();
  const { prompt, target_ecosystem = 'hybrid_frontier' } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "prompt" parameter' });
  }

  const jevRequestPayload = {
    state: `Task / Project Objective:
\`\`\`
${prompt}
\`\`\``,
    model: 'jev-latest',
    questions: {
      requires_task_distribution: {
        type: 'noul',
        instructions: 'Does this project consist of distinct sub-tasks that should be distributed across specialized models rather than handled by a single model?'
      },
      primary_benchmark_category: {
        type: 'choice',
        instructions: 'Which AI benchmark category represents the most critical discipline of this task?',
        criteria: {
          swe_bench: 'SWE-bench Verified: multi-file codebases, software architecture, refactoring',
          aime_math_logic: 'AIME / MATH 500: formal algorithmic proofs, discrete math, complex constraints',
          gpqa_science: 'GPQA Diamond: graduate-level scientific reasoning (physics, biology, chemistry)',
          ifeval_formatting: 'IFEval: strict instruction following, schema generation, clean extraction'
        }
      },
      complexity_score: {
        type: 'score',
        instructions: 'Rate the technical complexity on an ordered rubric from 0 to 4',
        criteria: [
          'Trivial: Simple single-file script or routine question',
          'Low: Standard API endpoint or straightforward transformation',
          'Moderate: Standard feature with unit tests and clear patterns',
          'High: Multi-file architecture, state machine, or complex concurrency',
          'Extreme: Novel consensus algorithm, formal proof, or graduate research'
        ]
      }
    }
  };

  try {
    const jevResponse = await queryJevSystemOne(jevRequestPayload);
    const latency_ms = Date.now() - startTime;

    const answers = jevResponse.answers || {};
    const distributionProb = answers.requires_task_distribution?.noul ?? 0.5;
    const shouldDistribute = distributionProb >= 0.5;
    const primaryCategory = answers.primary_benchmark_category?.choice || 'swe_bench';
    const complexityData = answers.complexity_score || { score: 2.5, confidence: 1 };
    const complexity = complexityData.score ?? 2.5;

    // Construct the Distributed Execution Plan based on Connected Agent Ecosystem
    const phases = [];

    if (shouldDistribute && complexity >= 1.8) {
      if (target_ecosystem === 'claude_focused') {
        // Claude Connected Agent Pipeline (Anthropic toolchain)
        phases.push({
          id: 'phase-1-claude-math',
          title: 'Algorithmic Proof & Constraint Invariants',
          assigned_agent: '🟣 Claude Agent',
          benchmark_name: 'AIME 2024: 80.0% (Extended Thinking)',
          benchmark_score: '80.0%',
          model_name: 'Claude 3.7 Sonnet (Reasoning)',
          model_provider: 'Anthropic',
          reasoning_mode: 'Test-Time Extended Thinking',
          cost_rate: '$3.00 / $15.00',
          rationale: 'Allocated to Claude 3.7 Sonnet in Extended Thinking mode for deterministic math and logic proofs within the Claude toolchain.'
        });

        phases.push({
          id: 'phase-2-claude-swe',
          title: 'Multi-File Architecture & Test Scaffolding',
          assigned_agent: '🟣 Claude Agent',
          benchmark_name: 'SWE-bench Verified: 70.3% (#1 Global)',
          benchmark_score: '70.3%',
          model_name: 'Claude 3.7 Sonnet (Reasoning)',
          model_provider: 'Anthropic',
          reasoning_mode: 'Agentic Multi-File Refactor',
          cost_rate: '$3.00 / $15.00',
          rationale: 'Anthropic flagship model; #1 worldwide on SWE-bench Verified for agentic repository refactoring and multi-file cohesion.'
        });

        phases.push({
          id: 'phase-3-claude-haiku',
          title: 'OpenAPI Schemas & Fast Documentation',
          assigned_agent: '🟣 Claude Agent',
          benchmark_name: 'IFEval: 89.4% (Fast Stream)',
          benchmark_score: '89.4%',
          model_name: 'Claude 3.5 Haiku',
          model_provider: 'Anthropic',
          reasoning_mode: 'High-Throughput Fast Stream',
          cost_rate: '$0.80 / $4.00 (96% cheaper)',
          rationale: 'High throughput (165 t/s) and sub-second TTFT (0.65s). Generates strictly validated typings without burning expensive reasoning tokens.'
        });

        phases.push({
          id: 'phase-4-jev-reflex',
          title: 'Pre-Commit Reflex Gatekeeper & Secret Guard',
          assigned_agent: '🟡 Jev Reflex Engine',
          benchmark_name: 'System-1 Reflex Latency (150ms)',
          benchmark_score: '150ms / $0.042',
          model_name: 'TypeSafe Jev',
          model_provider: 'TypeSafe AI',
          reasoning_mode: 'Single-Pass Parallel Verification',
          cost_rate: '$0.042 / 1M (Free Output)',
          rationale: 'Sub-second semantic gatekeeper verifies no secrets are leaked and syntax constraints are satisfied before commit.'
        });

      } else if (target_ecosystem === 'codex_focused') {
        // Codex / GPT Connected Agent Pipeline (OpenAI toolchain)
        phases.push({
          id: 'phase-1-codex-math',
          title: 'Algorithmic Proof & Discrete Math Solving',
          assigned_agent: '🟢 Codex Agent',
          benchmark_name: 'AIME 2024: 87.3% (#1 Global Math Leader)',
          benchmark_score: '87.3%',
          model_name: 'OpenAI o3-mini (High)',
          model_provider: 'OpenAI',
          reasoning_mode: 'High-Compute Reasoning (210 t/s)',
          cost_rate: '$1.10 / $4.40',
          rationale: 'ArtificialAnalysis.ai #1 math reasoner with 210 t/s generation speed; excels at discrete algorithms and invariants.'
        });

        phases.push({
          id: 'phase-2-codex-arch',
          title: 'Multi-File Architecture & System Workflows',
          assigned_agent: '🟢 Codex Agent',
          benchmark_name: 'GDPval-AA v2: 79.1% & Terminal Tools',
          benchmark_score: '79.1%',
          model_name: 'GPT-4o (Omni Frontier)',
          model_provider: 'OpenAI',
          reasoning_mode: 'Tool-Augmented System Execution',
          cost_rate: '$2.50 / $10.00',
          rationale: 'Superior execution in terminal shell tasks, file modifications, and multi-disciplinary software engineering in Codex.'
        });

        phases.push({
          id: 'phase-3-codex-mini',
          title: 'Fast Schema Extraction & Utility Typings',
          assigned_agent: '🟢 Codex Agent',
          benchmark_name: 'IFEval: 83.0% (Fast Utility)',
          benchmark_score: '83.0%',
          model_name: 'GPT-4o-mini',
          model_provider: 'OpenAI',
          reasoning_mode: 'High-Throughput Fast Inference',
          cost_rate: '$0.15 / $0.60',
          rationale: 'Ultra-low cost utility model (190 t/s) for quick schema transformations and unit test scaffold formatting.'
        });

        phases.push({
          id: 'phase-4-jev-reflex',
          title: 'Pre-Commit Reflex Gatekeeper & Policy Enforcement',
          assigned_agent: '🟡 Jev Reflex Engine',
          benchmark_name: 'System-1 Reflex Latency (150ms)',
          benchmark_score: '150ms / $0.042',
          model_name: 'TypeSafe Jev',
          model_provider: 'TypeSafe AI',
          reasoning_mode: 'Single-Pass Parallel Verification',
          cost_rate: '$0.042 / 1M (Free Output)',
          rationale: 'Sub-second semantic gatekeeper verifies code safety and schema adherence in 150ms before merging.'
        });

      } else if (target_ecosystem === 'gemini_focused') {
        // Gemini Connected Agent Pipeline (Google toolchain)
        phases.push({
          id: 'phase-1-gemini-reasoning',
          title: 'Multimodal Logic & Algorithmic Design',
          assigned_agent: '🔷 Gemini Agent',
          benchmark_name: 'AIME 2024: 74.0% & Multimodal Logic',
          benchmark_score: '74.0%',
          model_name: 'Gemini 2.0 Flash Thinking',
          model_provider: 'Google',
          reasoning_mode: 'Thinking Chain Inference',
          cost_rate: '$0.40 / $1.60',
          rationale: 'High throughput (130 t/s) combined with deep thinking chains for mathematical and algorithmic design.'
        });

        phases.push({
          id: 'phase-2-gemini-context',
          title: 'Whole-Repo Architecture & Full-Context Ingestion',
          assigned_agent: '🔷 Gemini Agent',
          benchmark_name: '2,000,000 Token Context Leader',
          benchmark_score: '2M Tokens',
          model_name: 'Gemini 1.5 Pro',
          model_provider: 'Google',
          reasoning_mode: 'Ultra-Long Context Synthesis',
          cost_rate: '$1.25 / $5.00',
          rationale: 'Loads the entire repository, documentation, and legacy codebase simultaneously with 0 needle retrieval errors.'
        });

        phases.push({
          id: 'phase-3-gemini-flash',
          title: 'High-Throughput Schemas & Documentation',
          assigned_agent: '🔷 Gemini Agent',
          benchmark_name: 'IFEval: 85.4% (220 tokens/sec)',
          benchmark_score: '85.4%',
          model_name: 'Gemini 2.0 Flash',
          model_provider: 'Google',
          reasoning_mode: 'Extreme Throughput Generation',
          cost_rate: '$0.10 / $0.40',
          rationale: 'Blistering 220 t/s generation speed at $0.175/1M blended cost for instantaneous schema rendering.'
        });

        phases.push({
          id: 'phase-4-jev-reflex',
          title: 'Pre-Commit Reflex Gatekeeper & Policy Enforcement',
          assigned_agent: '🟡 Jev Reflex Engine',
          benchmark_name: 'System-1 Reflex Latency (150ms)',
          benchmark_score: '150ms / $0.042',
          model_name: 'TypeSafe Jev',
          model_provider: 'TypeSafe AI',
          reasoning_mode: 'Single-Pass Parallel Verification',
          cost_rate: '$0.042 / 1M (Free Output)',
          rationale: 'Sub-second semantic gatekeeper verifies safety policies and formatting rules before execution.'
        });

      } else {
        // Hybrid Frontier Federation (Global Pareto Leaders)
        phases.push({
          id: 'phase-1-formal-math',
          title: 'Algorithmic Proof & Constraint Solving',
          assigned_agent: '🟢 Codex Agent',
          benchmark_name: 'AIME 2024 / 2025: 87.3% (#1 Global Math)',
          benchmark_score: '87.3%',
          model_name: 'OpenAI o3-mini (High Compute)',
          model_provider: 'OpenAI',
          reasoning_mode: 'Test-Time Extended Thinking',
          cost_rate: '$1.10 / $4.40',
          rationale: 'ArtificialAnalysis.ai #1 math reasoner with 210 t/s generation speed; provides deductive mathematical proofs with zero hallucination.'
        });

        phases.push({
          id: 'phase-2-agentic-coding',
          title: 'Multi-File Architecture & Test Scaffolding',
          assigned_agent: '🟣 Claude Agent',
          benchmark_name: 'SWE-bench Verified: 70.3% (#1 Global Coding)',
          benchmark_score: '70.3%',
          model_name: 'Claude 3.7 Sonnet (Reasoning)',
          model_provider: 'Anthropic',
          reasoning_mode: 'Scaffolded Multi-File Synthesis',
          cost_rate: '$3.00 / $15.00',
          rationale: 'Undisputed #1 global leader on SWE-bench Verified. Excels at repository-wide refactors and comprehensive vitest test suites.'
        });

        phases.push({
          id: 'phase-3-schema-docs',
          title: 'OpenAPI 3.1 Schemas & Documentation',
          assigned_agent: '🟣 Claude Agent',
          benchmark_name: 'IFEval: 89.4% (Precision Formatting)',
          benchmark_score: '89.4%',
          model_name: 'Claude 3.5 Haiku',
          model_provider: 'Anthropic',
          reasoning_mode: 'High-Throughput Fast Stream',
          cost_rate: '$0.80 / $4.00 (96% cheaper)',
          rationale: 'Produces strictly validated JSON/YAML specifications and client SDK typings at 165 t/s without wasting frontier compute.'
        });

        phases.push({
          id: 'phase-4-precommit-reflex',
          title: 'Pre-Commit Reflex Gatekeeper & Policy Enforcement',
          assigned_agent: '🟡 Jev Reflex Engine',
          benchmark_name: 'System-1 Reflex Latency (150ms)',
          benchmark_score: '150ms / $0.042',
          model_name: 'TypeSafe Jev',
          model_provider: 'TypeSafe AI',
          reasoning_mode: 'Single-Pass Parallel Verification',
          cost_rate: '$0.042 / 1M (Free Output)',
          rationale: 'Sub-second semantic gatekeeper verifies no secrets are leaked and syntax constraints are satisfied before commit.'
        });
      }

    } else {
      // Single atomic task
      let assignedModel = 'Claude 3.5 Haiku';
      let assignedAgent = '🟣 Claude Agent';
      let benchmarkTag = 'IFEval: 89.4%';
      let provider = 'Anthropic';

      if (complexity >= 2.5) {
        if (target_ecosystem === 'codex_focused' || primaryCategory === 'aime_math_logic') {
          assignedModel = 'OpenAI o3-mini (High)';
          assignedAgent = '🟢 Codex Agent';
          benchmarkTag = 'AIME 2024: 87.3%';
          provider = 'OpenAI';
        } else {
          assignedModel = 'Claude 3.7 Sonnet';
          assignedAgent = '🟣 Claude Agent';
          benchmarkTag = 'SWE-bench Verified: 70.3%';
          provider = 'Anthropic';
        }
      }

      phases.push({
        id: 'phase-single',
        title: 'Unified Direct Execution',
        assigned_agent: assignedAgent,
        benchmark_name: benchmarkTag,
        benchmark_score: 'Optimal',
        model_name: assignedModel,
        model_provider: provider,
        reasoning_mode: complexity >= 2.5 ? 'Extended Reasoning' : 'Standard Inference',
        cost_rate: complexity >= 2.5 ? '$3.00 / $15.00' : '$0.80 / $4.00',
        rationale: 'Atomic prompt scope does not require multi-task distribution; routed directly to the connected agent category leader.'
      });
    }

    return res.json({
      status: 'success',
      is_distributed: shouldDistribute,
      distribution_probability: distributionProb,
      primary_category: primaryCategory,
      complexity_score: complexity,
      target_ecosystem,
      latency_ms,
      phases,
      telemetry: {
        model: jevResponse.model,
        usage: jevResponse.usage,
        jev_cost_usd: (jevResponse.usage?.input_tokens || 0) * (0.042 / 1000000)
      },
      answers,
      raw_request: jevRequestPayload,
      raw_response: jevResponse
    });

  } catch (err) {
    const latency_ms = Date.now() - startTime;
    console.error('Error distributing task with Jev:', err);
    return res.status(err.status || 500).json({
      error: err.message,
      details: err.details,
      latency_ms
    });
  }
});

// Endpoint to fetch MCP Status
app.get('/api/mcp/status', (req, res) => {
  res.json({
    status: 'ready',
    protocol: 'modelcontextprotocol',
    version: '1.30.0',
    server_path: mcpScriptPath,
    transport: 'stdio',
    supported_agents: ['Claude Desktop', 'Claude Code', 'Cursor / Codex', 'Antigravity IDE'],
    available_tools: [
      'distribute_and_route_task',
      'get_benchmark_matrix',
      'route_single_prompt',
      'system_one_reflex'
    ]
  });
});

// ==========================================
// 📈 JEV QUANT LIVE PAPER TRADING ENDPOINTS
// ==========================================

// Get full paper trading state & market data
app.get('/api/trading/state', (req, res) => {
  try {
    const state = tradingEngine.getState();
    res.json(state);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start or Pause the autonomous bot
app.post('/api/trading/toggle', (req, res) => {
  const { running } = req.body;
  if (running) {
    tradingEngine.startBot();
  } else {
    tradingEngine.stopBot();
  }
  res.json({ botRunning: tradingEngine.botRunning, state: tradingEngine.getState() });
});

// Trigger immediate TypeSafe Jev AI reflex for a symbol
app.post('/api/trading/trigger', async (req, res) => {
  try {
    const { symbol = tradingEngine.activeSymbol, context } = req.body;
    const decision = await tradingEngine.queryJevTradingReflex(symbol, context);
    res.json({
      success: true,
      decision,
      state: tradingEngine.getState()
    });
  } catch (err) {
    console.error('Reflex trigger failed:', err);
    res.status(500).json({ error: err.message });
  }
});

// Close a specific open position
app.post('/api/trading/close-position', (req, res) => {
  const { positionId, reason } = req.body;
  if (!positionId) {
    return res.status(400).json({ error: 'Missing positionId' });
  }
  const closed = tradingEngine.closePosition(positionId, reason || 'Manual User Close');
  if (!closed) {
    return res.status(404).json({ error: 'Position not found' });
  }
  res.json({ success: true, closed, state: tradingEngine.getState() });
});

// Open a manual position
app.post('/api/trading/order', (req, res) => {
  const { symbol, side, amount, stopLossPct = 2.0, takeProfitPct = 4.0 } = req.body;
  if (!symbol || !side || !amount) {
    return res.status(400).json({ error: 'Missing required fields: symbol, side, amount' });
  }
  const pos = tradingEngine.openPosition(symbol, side, Number(amount), Number(stopLossPct), Number(takeProfitPct), 'Manual Trader Order');
  if (!pos) {
    return res.status(400).json({ error: 'Could not open position. Check balance and market data.' });
  }
  res.json({ success: true, position: pos, state: tradingEngine.getState() });
});

// Reset paper portfolio
app.post('/api/trading/reset', (req, res) => {
  const state = tradingEngine.resetAccount();
  res.json({ success: true, state });
});

// Stress test market shock injection
app.post('/api/trading/shock', async (req, res) => {
  try {
    const { symbol = tradingEngine.activeSymbol, percentChange = -3.5, label } = req.body;
    const decision = await tradingEngine.injectMarketShock(symbol, Number(percentChange), label);
    res.json({ success: true, decision, state: tradingEngine.getState() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Configure bot parameters
app.post('/api/trading/config', (req, res) => {
  const { activeSymbol, riskProfile, botIntervalMs } = req.body;
  if (activeSymbol) tradingEngine.activeSymbol = activeSymbol;
  if (riskProfile) tradingEngine.riskProfile = riskProfile;
  if (botIntervalMs) tradingEngine.botIntervalMs = Number(botIntervalMs);
  res.json({ success: true, state: tradingEngine.getState() });
});

// Real-time Server-Sent Events (SSE) push stream
app.get('/api/trading/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial state immediately
  res.write(`data: ${JSON.stringify(tradingEngine.getState())}\n\n`);

  const unsubscribe = tradingEngine.subscribe((state) => {
    try {
      res.write(`data: ${JSON.stringify(state)}\n\n`);
    } catch (e) {}
  });

  req.on('close', () => {
    unsubscribe();
  });
});

// CSV Export Endpoint
app.get('/api/trading/export-csv', (req, res) => {
  const csvData = tradingEngine.getTradesCsv();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="jev_paper_trades_${Date.now()}.csv"`);
  res.send(csvData);
});

// Serve static frontend files in production
app.use(express.static(distPath));

// Fallback to index.html for SPA client routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Jev Benchmark Orchestrator running on http://localhost:${PORT}`);
  console.log(`⚡ Connected to TypeSafe Jev System-1 API`);
  console.log(`🔌 MCP Server executable at: ${mcpScriptPath}`);
  
  // Auto-start live paper trading bot
  tradingEngine.startBot();
});
