import React from 'react';
import { 
  GitFork, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Zap, 
  BrainCircuit, 
  Code2, 
  Sparkles, 
  Timer, 
  DollarSign, 
  FileJson, 
  Copy, 
  Check, 
  TrendingDown,
  Cpu
} from 'lucide-react';
import { AGENT_ECOSYSTEMS } from '../data/benchmarks';

export default function TaskPipelineView({ result, isLoading, onViewRawJson }) {
  const [copied, setCopied] = React.useState(false);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-[#0d1424]/90 p-8 shadow-xl flex flex-col items-center justify-center min-h-[420px] text-center">
        <div className="relative mb-6">
          <div className="h-16 w-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <GitFork className="h-6 w-6 text-emerald-400 animate-pulse" />
          </div>
        </div>
        <h3 className="text-base font-semibold text-white mb-1">
          Decomposing & Distributing Project with Jev...
        </h3>
        <p className="text-xs text-slate-400 max-w-md">
          TypeSafe Jev is evaluating your multi-task project in a single parallel reflex pass (&lt; 200ms) and assigning sub-tasks to the verified champion models of your connected agent ecosystem.
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 bg-[#0a0f1c]/50 p-8 text-center flex flex-col items-center justify-center min-h-[420px]">
        <div className="h-14 w-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
          <GitFork className="h-7 w-7 text-emerald-500/70" />
        </div>
        <h3 className="text-sm font-semibold text-slate-300 mb-1">
          Awaiting Project Objective
        </h3>
        <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
          Select a multi-task scenario on the left or write a custom project and click <strong>Distribute & Route Tasks with Jev</strong>.
        </p>
      </div>
    );
  }

  const { phases = [], latency_ms, complexity_score, is_distributed, distribution_probability, target_ecosystem } = result;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-emerald-500/40 bg-[#0c1420]/95 p-5 shadow-2xl glow-emerald flex flex-col space-y-4">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-300">
              {is_distributed ? 'DISTRIBUTED AGENT PIPELINE' : 'DIRECT SINGLE EXECUTION'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
              Score: {complexity_score?.toFixed(1)} / 4.0
            </span>
            {target_ecosystem && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {target_ecosystem === 'claude_focused' ? '🟣 Claude Agent Mode' : target_ecosystem === 'codex_focused' ? '🟢 Codex Agent Mode' : '🌐 Hybrid Federation'}
              </span>
            )}
          </div>
          <h3 className="text-lg font-extrabold text-white mt-0.5">
            {is_distributed ? `${phases.length}-Stage Agent-Optimized Execution Plan` : 'Direct Agent Assignment'}
          </h3>
        </div>

        {/* Speed & Reflex Telemetry */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Timer className="h-4 w-4 text-emerald-400" />
            <div>
              <div className="font-mono font-bold text-white leading-none">
                {latency_ms} ms
              </div>
              <div className="text-[10px] text-emerald-400 font-sans">
                Jev Reflex Triage
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Cards Stream */}
      <div className="space-y-3">
        {phases.map((phase, idx) => {
          // Identify agent ecosystem
          let agentBadge = '🟣 Claude Agent';
          let agentStyle = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
          let modelColor = 'text-purple-300';

          if (phase.assigned_agent) {
            agentBadge = phase.assigned_agent;
          } else if (phase.model_name.includes('Claude') || phase.model_name.includes('Haiku')) {
            agentBadge = '🟣 Claude Agent';
            agentStyle = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
            modelColor = 'text-purple-300';
          } else if (phase.model_name.includes('o3-mini') || phase.model_name.includes('o1') || phase.model_name.includes('GPT')) {
            agentBadge = '🟢 Codex Agent';
            agentStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
            modelColor = 'text-emerald-300';
          } else if (phase.model_name.includes('Gemini')) {
            agentBadge = '🔷 Gemini Agent';
            agentStyle = 'bg-sky-500/20 text-sky-300 border-sky-500/40';
            modelColor = 'text-sky-300';
          } else if (phase.model_name.includes('DeepSeek')) {
            agentBadge = '🔵 DeepSeek Agent';
            agentStyle = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
            modelColor = 'text-cyan-300';
          } else if (phase.model_name.includes('Jev')) {
            agentBadge = '🟡 Jev Reflex Engine';
            agentStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
            modelColor = 'text-amber-300';
          }

          return (
            <div 
              key={phase.id || idx}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col space-y-2 relative group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="h-5 w-5 rounded-full bg-slate-900 border border-slate-700 text-[11px] font-mono font-bold flex items-center justify-center text-slate-300">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {phase.title}
                  </span>
                </div>

                {/* Connected Agent & Benchmark Leader Badges */}
                <div className="flex items-center space-x-1.5">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${agentStyle}`}>
                    {agentBadge}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-900 border border-slate-700 text-slate-300">
                    {phase.benchmark_name}
                  </span>
                </div>
              </div>

              {/* Model & Reasoning Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-slate-900">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">Assigned Model:</span>
                  <span className={`font-mono font-bold ${modelColor}`}>
                    {phase.model_name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">({phase.reasoning_mode})</span>
                </div>

                <div className="text-[11px] font-mono text-slate-400">
                  Rate: <span className="text-slate-200">{phase.cost_rate}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {phase.rationale}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
        <div className="text-[11px] text-slate-400 font-mono">
          <span>Decomposition Confidence: {((distribution_probability || 0.9) * 100).toFixed(0)}%</span>
          <span className="mx-2">•</span>
          <span>Jev Inference Fee: ~$0.00003</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onViewRawJson}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center space-x-1.5 transition-all"
          >
            <FileJson className="h-3.5 w-3.5 text-emerald-400" />
            <span>Raw Jev JSON</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center space-x-1 transition-all"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

    </div>
  );
}
