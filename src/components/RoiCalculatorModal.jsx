import React, { useState } from 'react';
import { X, Calculator, DollarSign, TrendingDown, Sparkles, CheckCircle2 } from 'lucide-react';

export default function RoiCalculatorModal({ isOpen, onClose }) {
  const [monthlyVolume, setMonthlyVolume] = useState(25000);
  const [percentFast, setPercentFast] = useState(85); // 85% of typical queries can be handled by fast models

  if (!isOpen) return null;

  // Pricing assumptions (typical 400 prompt tokens + 300 response tokens)
  // Claude 3.7 Sonnet: $3/M in, $15/M out -> avg $0.0057 per call
  // Claude 3.5 Haiku: $0.80/M in, $4/M out -> avg $0.0015 per call
  // Jev Router inference: $0.042/M in -> $0.00002 per call
  const avgFrontierCost = 0.0057;
  const avgFastCost = 0.0015;
  const jevCost = 0.00002;

  const costWithoutRouter = monthlyVolume * avgFrontierCost;
  const fastCalls = monthlyVolume * (percentFast / 100);
  const frontierCalls = monthlyVolume * ((100 - percentFast) / 100);

  const costWithRouter = (fastCalls * avgFastCost) + (frontierCalls * avgFrontierCost) + (monthlyVolume * jevCost);
  const monthlySavings = Math.max(0, costWithoutRouter - costWithRouter);
  const annualSavings = monthlySavings * 12;
  const savingsPct = costWithoutRouter > 0 ? Math.round((monthlySavings / costWithoutRouter) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700/80 bg-[#0d1424] shadow-2xl p-6 relative flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                LLM Bill Savings Calculator
              </h3>
              <p className="text-xs text-slate-400">
                Projected savings by routing simple prompts away from expensive frontier models
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

        {/* Sliders */}
        <div className="py-4 space-y-4 border-b border-slate-800">
          
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-300">
                Monthly AI Invocations / Queries
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {monthlyVolume.toLocaleString()} queries/mo
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="200000"
              step="2000"
              value={monthlyVolume}
              onChange={(e) => setMonthlyVolume(parseInt(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-300">
                Routine / Non-Reasoning Prompt Ratio
              </span>
              <span className="font-mono font-bold text-cyan-400">
                {percentFast}% of queries
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={percentFast}
              onChange={(e) => setPercentFast(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Industry average: ~80-90% of user prompts do not require high-parameter frontier reasoning.
            </p>
          </div>

        </div>

        {/* Results Banner */}
        <div className="py-5 space-y-3">
          
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/50 via-[#0a1820] to-emerald-950/50 border border-emerald-500/40 text-center">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 block mb-1">
              Estimated Net Monthly Savings
            </span>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
              ${Math.round(monthlySavings).toLocaleString()} <span className="text-sm font-normal text-emerald-400 font-sans">/ month</span>
            </div>
            <div className="text-xs text-emerald-400/90 font-medium mt-1">
              Save ${Math.round(annualSavings).toLocaleString()} annually ({savingsPct}% cost reduction)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block mb-0.5">Without Router:</span>
              <span className="font-mono font-bold text-rose-400 text-sm">
                ${Math.round(costWithoutRouter).toLocaleString()} / mo
              </span>
              <span className="text-[10px] text-slate-500 block">All Claude 3.7 / GPT-4o</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block mb-0.5">With SmartPrompt Router:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                ${Math.round(costWithRouter).toLocaleString()} / mo
              </span>
              <span className="text-[10px] text-slate-500 block">Including Jev inference fees</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
