import React from 'react';
import { Layers, Zap, BrainCircuit, Info } from 'lucide-react';

const COMPLEXITY_LEVELS = [
  { level: '0', name: 'Level 0: Trivial / Casual Greeting', desc: 'Hello, simple acknowledgments, small talk', color: 'bg-emerald-500' },
  { level: '1', name: 'Level 1: Basic Formatting & Retrieval', desc: 'JSON formatting, translation, table transforms, facts', color: 'bg-teal-500' },
  { level: '2', name: 'Level 2: Standard Content & Scripts', desc: 'Summaries, standard email drafting, basic bug fixes', color: 'bg-cyan-500' },
  { level: '3', name: 'Level 3: Multi-step Logic & Architecture', desc: 'Advanced coding, system design, math proofs', color: 'bg-amber-500' },
  { level: '4', name: 'Level 4: Cutting-Edge Formal Logic', desc: 'Novel algorithms, lock-free concurrency, deep research', color: 'bg-purple-500' },
];

export default function RubricDistribution({ result }) {
  if (!result) return null;

  const complexityAnswers = result.answers?.complexity_tier || {};
  const complexityProbs = complexityAnswers.probabilities || {};
  const recommendedTier = result.answers?.recommended_tier || {};
  const tierProbs = recommendedTier.probabilities || {};

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0d1424]/90 p-5 shadow-xl">
      
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center space-x-2">
          <Layers className="h-4 w-4 text-emerald-400" />
          <h4 className="text-sm font-semibold text-white">
            Calibrated Task Complexity Breakdown
          </h4>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Jev Confidence: {((complexityAnswers.confidence ?? 1) * 100).toFixed(0)}%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Complexity Tiers */}
        <div>
          <span className="text-xs font-medium text-slate-300 block mb-2.5">
            5-Tier Cognitive Complexity Distribution (Score Primitive)
          </span>

          <div className="space-y-2.5">
            {COMPLEXITY_LEVELS.map((tier) => {
              const prob = complexityProbs[tier.level] ?? 0;
              const percent = (prob * 100).toFixed(1);
              const isDominant = prob >= 0.4;

              return (
                <div key={tier.level} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${isDominant ? 'text-white' : 'text-slate-400'}`}>
                      {tier.name}
                    </span>
                    <span className="font-mono text-[11px] text-slate-300">
                      {percent}%
                    </span>
                  </div>
                  
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full ${tier.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${Math.max(prob * 100, prob > 0 ? 3 : 0)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">
                    {tier.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Model Tier Probability & Why It Matters */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-slate-300 block mb-2.5">
              Routing Destination Probability (Choice Primitive)
            </span>

            <div className="space-y-3">
              
              {/* Fast Cheap */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                    <Zap className="h-3.5 w-3.5" />
                    Fast & Cheap Model Tier
                  </span>
                  <span className="font-mono font-bold text-white">
                    {((tierProbs.fast_cheap ?? (result.verdict === 'FAST_CHEAP' ? 0.99 : 0.01)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${(tierProbs.fast_cheap ?? (result.verdict === 'FAST_CHEAP' ? 0.99 : 0.01)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Frontier Reasoning */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 font-semibold text-purple-400">
                    <BrainCircuit className="h-3.5 w-3.5" />
                    Frontier Reasoning Tier
                  </span>
                  <span className="font-mono font-bold text-white">
                    {((tierProbs.frontier_reasoning ?? (result.verdict === 'FRONTIER_REASONING' ? 0.99 : 0.01)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all duration-500" 
                    style={{ width: `${(tierProbs.frontier_reasoning ?? (result.verdict === 'FRONTIER_REASONING' ? 0.99 : 0.01)) * 100}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* System 1 Calibrated Decisions Explanation */}
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-200/90 flex items-start gap-2">
            <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Zero Token-Generation Bottleneck:</strong> Because TypeSafe Jev evaluates inputs in a single parallel pass rather than word-by-word streaming, prompt routing occurs in <strong>~150ms</strong> instead of adding a 3-second LLM delay.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
