import React from 'react';
import { 
  Zap, 
  BrainCircuit, 
  Timer, 
  DollarSign, 
  TrendingDown, 
  FileJson, 
  Copy, 
  Check, 
  Layers, 
  Sparkles,
  Gauge
} from 'lucide-react';

export default function VerdictPanel({ 
  result, 
  isLoading, 
  onViewRawJson 
}) {
  const [copied, setCopied] = React.useState(false);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-[#0d1424]/90 p-8 shadow-xl flex flex-col items-center justify-center min-h-[380px] text-center">
        <div className="relative mb-6">
          <div className="h-16 w-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="h-6 w-6 text-emerald-400 animate-pulse" />
          </div>
        </div>
        <h3 className="text-base font-semibold text-white mb-1">
          Evaluating Prompt Complexity in Parallel...
        </h3>
        <p className="text-xs text-slate-400 max-w-sm">
          TypeSafe Jev is analyzing reasoning necessity, algorithmic complexity, and optimal model tier in a single pass (&lt; 200ms).
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 bg-[#0a0f1c]/50 p-8 text-center flex flex-col items-center justify-center min-h-[380px]">
        <div className="h-14 w-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
          <BrainCircuit className="h-7 w-7" />
        </div>
        <h3 className="text-sm font-semibold text-slate-300 mb-1">
          Awaiting Prompt to Route
        </h3>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          Select any preset or type a prompt on the left and click <strong>Route Prompt with Jev</strong> to observe sub-second routing and cost savings.
        </p>
      </div>
    );
  }

  const isFastCheap = result.verdict === 'FAST_CHEAP';
  const targetModel = result.target_model || 'Fast Model';
  const savingsPct = result.savings_percentage ?? 0;
  const latencyMs = result.latency_ms ?? 0;
  const complexityScore = result.complexity_score ?? 1.0;
  const reasoningProb = result.reasoning_necessity ?? 0.2;
  const category = result.category || 'general';

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-2xl border ${
      isFastCheap ? 'border-emerald-500/40 bg-[#0c1a1b]/95 glow-emerald' : 'border-purple-500/40 bg-[#160e29]/95'
    } p-5 shadow-2xl flex flex-col transition-all duration-300`}>
      
      {/* Top Banner: Route Recommendation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        
        <div className="flex items-center space-x-3">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
            isFastCheap ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30' : 'bg-purple-500 text-white shadow-purple-500/30'
          } shadow-lg`}>
            {isFastCheap ? <Zap className="h-6 w-6" /> : <BrainCircuit className="h-6 w-6" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400">
                RECOMMENDED DISPATCH:
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 uppercase">
                {category}
              </span>
            </div>
            <h3 className="text-xl font-extrabold tracking-tight text-white mt-0.5">
              {targetModel}
            </h3>
            <p className="text-xs text-slate-400">
              {isFastCheap 
                ? 'Optimal efficiency: prompt does not require heavy frontier reasoning.' 
                : 'Heavy architectural or multi-step logic detected; frontier reasoning warranted.'}
            </p>
          </div>
        </div>

        {/* Latency Telemetry */}
        <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <Timer className="h-4 w-4 text-emerald-400" />
          <div>
            <div className="text-xs font-mono font-bold text-white">
              {latencyMs} <span className="text-slate-400 font-normal">ms</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-sans">
              System-1 Reflex
            </div>
          </div>
        </div>

      </div>

      {/* Cost & Savings Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
        
        {/* Cost Savings Card */}
        <div className="rounded-xl bg-slate-950/70 border border-slate-800/80 p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
              Direct Cost Reduction
            </span>
            <span className={`text-sm font-mono font-bold ${savingsPct > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
              {savingsPct > 0 ? `-${savingsPct}%` : 'Standard Rate'}
            </span>
          </div>

          <div className="flex items-baseline space-x-2 my-1">
            <span className="text-lg font-mono font-extrabold text-white">
              ${(result.cost_target_usd || 0).toFixed(6)}
            </span>
            <span className="text-xs text-slate-500 line-through">
              ${(result.cost_frontier_usd || 0).toFixed(6)}
            </span>
            <span className="text-[11px] text-slate-400 font-sans">per invocation</span>
          </div>

          <p className="text-[11px] text-emerald-400 font-sans">
            {savingsPct > 0 ? `Saves $${(result.cost_saved_usd * 1000).toFixed(2)} per 1,000 queries` : 'High reasoning complexity justified'}
          </p>
        </div>

        {/* Complexity & Reasoning Level */}
        <div className="rounded-xl bg-slate-950/70 border border-slate-800/80 p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-cyan-400" />
              Complexity Level (score)
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {complexityScore.toFixed(2)} <span className="text-slate-400 font-normal">/ 4.0</span>
            </span>
          </div>

          {/* Visual Rubric Bars */}
          <div className="grid grid-cols-5 gap-1 mb-1.5">
            {[0, 1, 2, 3, 4].map((lvl) => {
              const active = complexityScore >= lvl - 0.25;
              const color = lvl >= 3 ? 'bg-purple-500' : lvl === 2 ? 'bg-amber-500' : 'bg-emerald-500';
              return (
                <div 
                  key={lvl}
                  className={`h-2 rounded-sm transition-all duration-300 ${active ? color : 'bg-slate-800'}`}
                  title={`Level ${lvl}`}
                />
              );
            })}
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Trivial (0)</span>
            <span>Reasoning prob: {(reasoningProb * 100).toFixed(0)}%</span>
            <span>Cutting-edge (4)</span>
          </div>
        </div>

      </div>

      {/* Integration Code / Fast Copy */}
      <div className="bg-slate-950/60 rounded-xl border border-slate-800/80 p-3 mb-4 font-mono text-xs">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
          MCP Tool Output Payload:
        </span>
        <div className="text-slate-300 text-[11px] leading-relaxed">
          <span>route_prompt(prompt) ➔ </span>
          <strong className={isFastCheap ? 'text-emerald-400' : 'text-purple-400'}>
            {targetModel}
          </strong>
          <span className="text-slate-500"> ({latencyMs}ms, {savingsPct > 0 ? `${savingsPct}% savings` : 'frontier logic'})</span>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
        
        {/* Token & Jev Cost */}
        <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-3">
          <span>Jev Tokens: {result.telemetry?.usage?.input_tokens || 0}</span>
          <span>Jev Router Cost: ~${(result.telemetry?.jev_inference_cost_usd || 0).toFixed(6)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          
          <button
            onClick={onViewRawJson}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center space-x-1.5 transition-all"
            title="Inspect exact JSON request & response from Jev"
          >
            <FileJson className="h-3.5 w-3.5 text-cyan-400" />
            <span>Raw Jev Payload</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center space-x-1 transition-all"
            title="Copy decision JSON"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>

        </div>

      </div>

    </div>
  );
}
