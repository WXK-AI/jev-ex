import React, { useState } from 'react';
import { X, PlayCircle, Zap, Timer, DollarSign, Activity, CheckCircle2, AlertTriangle, ShieldX, RefreshCw } from 'lucide-react';

export default function BatchBenchmarkModal({ isOpen, onClose }) {
  const [isRunning, setIsRunning] = useState(false);
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const runBenchmark = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const response = await fetch('/api/gatekeeper/batch-benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (!response.ok) {
        throw new Error(`Benchmark failed with status ${response.status}`);
      }
      const data = await response.json();
      setBenchmarkData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-700/80 bg-[#0d1424] shadow-2xl p-6 relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Parallel Reflex Stress Benchmark
              </h3>
              <p className="text-xs text-slate-400">
                Dispatches 8 concurrent agent actions to TypeSafe Jev in parallel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action / Telemetry Summary */}
        <div className="py-4 space-y-4 shrink-0">
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Measures parallel throughput, single-pass latency, and calibrated accuracy across diverse payloads.
            </span>
            <button
              onClick={runBenchmark}
              disabled={isRunning}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Benchmarking...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="h-3.5 w-3.5" />
                  <span>{benchmarkData ? 'Re-run Benchmark' : 'Start 8x Parallel Test'}</span>
                </>
              )}
            </button>
          </div>

          {/* Aggregated Stats Cards */}
          {benchmarkData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                  <Timer className="h-3.5 w-3.5 text-cyan-400" />
                  Avg Latency
                </div>
                <div className="text-lg font-mono font-bold text-white">
                  {benchmarkData.avg_latency_ms} <span className="text-xs font-normal text-slate-400">ms</span>
                </div>
                <div className="text-[10px] text-emerald-400">Parallel single-pass</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5 text-indigo-400" />
                  Total Duration
                </div>
                <div className="text-lg font-mono font-bold text-white">
                  {benchmarkData.parallel_execution_time_ms} <span className="text-xs font-normal text-slate-400">ms</span>
                </div>
                <div className="text-[10px] text-slate-400">for 8 parallel tasks</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                  Total Cost
                </div>
                <div className="text-lg font-mono font-bold text-emerald-400">
                  ${(benchmarkData.total_cost_usd).toFixed(6)}
                </div>
                <div className="text-[10px] text-slate-400">{benchmarkData.total_tokens} tokens</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[11px] text-slate-400 mb-1">
                  Verdict Breakdown
                </div>
                <div className="flex items-center space-x-2 text-xs font-mono font-bold mt-1">
                  <span className="text-emerald-400">{benchmarkData.verdict_counts.ALLOW} OK</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-amber-400">{benchmarkData.verdict_counts.QUARANTINE} HOLD</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-rose-400">{benchmarkData.verdict_counts.BLOCK} BLK</span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Results Table */}
        <div className="flex-1 overflow-y-auto border-t border-slate-800 pt-3">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 mb-3">
              Error running benchmark: {error}
            </div>
          )}

          {!benchmarkData && !isRunning && (
            <div className="py-12 text-center text-xs text-slate-500">
              Click <strong>Start 8x Parallel Test</strong> to execute concurrent calls to TypeSafe Jev.
            </div>
          )}

          {benchmarkData && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-2 px-3">Scenario</th>
                  <th className="py-2 px-3">Env</th>
                  <th className="py-2 px-3">Blast Radius</th>
                  <th className="py-2 px-3">Destructive Prob</th>
                  <th className="py-2 px-3">Latency</th>
                  <th className="py-2 px-3 text-right">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {benchmarkData.results.map((r, i) => {
                  let verdictBadge = 'bg-slate-800 text-slate-300';
                  if (r.verdict === 'ALLOW') verdictBadge = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
                  if (r.verdict === 'QUARANTINE') verdictBadge = 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
                  if (r.verdict === 'BLOCK') verdictBadge = 'bg-rose-500/20 text-rose-300 border border-rose-500/40';

                  return (
                    <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-200">{r.name}</div>
                        <div className="font-mono text-[10px] text-slate-500 truncate max-w-xs">{r.action}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400 uppercase">
                        {r.environment}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-300">
                        {r.blast_radius_score?.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-300">
                        {((r.destructive_prob ?? 0) * 100).toFixed(0)}%
                      </td>
                      <td className="py-2.5 px-3 font-mono text-cyan-400">
                        {r.latency_ms}ms
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${verdictBadge}`}>
                          {r.verdict}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
