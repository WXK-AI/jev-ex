import React, { useEffect } from 'react';
import { Sparkles, Send, RotateCcw, GitFork, Cpu, Layers, ShieldAlert } from 'lucide-react';
import { PRESETS } from '../data/presets';

const ECOSYSTEMS = [
  { 
    id: 'hybrid_frontier', 
    name: 'Hybrid Federation', 
    icon: '🌐',
    badge: 'Cross-Agent Pareto Optimal',
    desc: 'Assigns each sub-task to the global leader across Claude 3.7, o3-mini, and Haiku'
  },
  { 
    id: 'claude_focused', 
    name: 'Claude Connected Agent', 
    icon: '🟣',
    badge: 'Claude Desktop / Code',
    desc: 'Distributes within Anthropic: Claude 3.7 Sonnet (SWE-bench 70.3%) & Claude 3.5 Haiku'
  },
  { 
    id: 'codex_focused', 
    name: 'Codex / GPT Connected Agent', 
    icon: '🟢',
    badge: 'Cursor / OpenAI',
    desc: 'Distributes within OpenAI: o3-mini (AIME 87.3%), o1, GPT-4o, and 4o-mini'
  },
  { 
    id: 'gemini_focused', 
    name: 'Gemini Connected Agent', 
    icon: '🔷',
    badge: 'Google AI Studio',
    desc: 'Distributes within Google: Gemini 2.0 Flash Thinking (Reasoning) & Flash (1M Context)'
  }
];

export default function ActionConsole({
  prompt,
  setPrompt,
  ecosystem,
  setEcosystem,
  onEvaluate,
  isLoading
}) {

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isLoading && prompt.trim()) {
          onEvaluate();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prompt, isLoading, onEvaluate]);

  const handleSelectPreset = (preset) => {
    setPrompt(preset.prompt);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0d1424]/90 p-5 shadow-xl shadow-black/40 flex flex-col h-full">
      
      {/* Top bar: Target Model Ecosystem Selector */}
      <div className="pb-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-emerald-400" />
            <span>Target Connected Agent Ecosystem:</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            SWE-bench & AIME Benchmark Routing
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {ECOSYSTEMS.map((eco) => {
            const isSelected = ecosystem === eco.id;
            return (
              <button
                key={eco.id}
                onClick={() => setEcosystem(eco.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/40 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold text-xs text-white mb-0.5">
                  <span>{eco.icon}</span>
                  <span className="truncate">{eco.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  {eco.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset Scenarios Strip */}
      <div className="py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            Try Multi-Task Engineering Projects:
          </span>
          <span className="text-[11px] text-slate-500">
            Click to load scenario
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className="p-2.5 rounded-xl text-left border border-slate-800 bg-slate-950/60 hover:bg-slate-900 hover:border-slate-700 transition-all group"
            >
              <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                {preset.title}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                {preset.subtitle}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt / Objective Text Area */}
      <div className="flex-1 flex flex-col relative rounded-xl border border-slate-800 bg-[#060910] overflow-hidden focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all mt-1">
        
        {/* Editor Sub-Header */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border-b border-slate-800/80 text-[11px] font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-slate-700"></span>
            <span>project_objective.txt</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>{prompt.length} chars</span>
            {prompt && (
              <button
                onClick={() => setPrompt('')}
                className="hover:text-slate-200 transition-colors"
                title="Clear input"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your technical objective, feature request, or complex multi-task project..."
          rows={6}
          className="w-full flex-1 bg-transparent p-3.5 font-sans text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed"
        />

        {/* Bottom Hint */}
        <div className="px-3 py-1.5 bg-slate-950/60 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">⌘</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">Enter</kbd> to distribute</span>
          <span className="text-emerald-400/80 font-sans">TypeSafe Jev System-1 Reflex (&lt; 200ms)</span>
        </div>

      </div>

      {/* Trigger Button */}
      <div className="pt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-400 hidden sm:block">
          Decomposes project and maps sub-tasks to <strong className="text-purple-300">Claude 3.7</strong>, <strong className="text-emerald-300">o3-mini</strong>, and <strong className="text-teal-300">Haiku</strong>.
        </p>

        <button
          onClick={onEvaluate}
          disabled={isLoading || !prompt.trim()}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
              <span>Decomposing with Jev...</span>
            </>
          ) : (
            <>
              <GitFork className="h-4 w-4" />
              <span>Distribute & Route Tasks</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
