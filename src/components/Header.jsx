import React from 'react';
import { GitFork, Trophy, Code2, Calculator, Zap, Layers, TrendingUp } from 'lucide-react';

export default function Header({ 
  health, 
  activeView, 
  setActiveView, 
  onOpenMcp, 
  onOpenRoi 
}) {
  return (
    <header className="border-b border-slate-800 bg-[#0c1220]/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Branding & Model Tag */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-600 p-[1px] flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <div className="h-full w-full bg-dark-950 rounded-xl flex items-center justify-center">
              <GitFork className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white tracking-tight flex items-center">
                Jev <span className="text-emerald-400 ml-1">Quant Terminal</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                <Zap className="h-2.5 w-2.5 text-emerald-400 fill-emerald-400" />
                Live Paper Bot
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              TypeSafe Jev System-1 Neural Reflex Engine • <strong className="text-slate-200">Sub-Second Live Trading</strong>
            </p>
          </div>
        </div>

        {/* Center: View Switcher */}
        <div className="hidden md:flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveView('trading')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeView === 'trading'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            <span>Live Trading Bot</span>
          </button>

          <button
            onClick={() => setActiveView('pipeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeView === 'pipeline'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitFork className="h-3.5 w-3.5" />
            <span>Task Distribution</span>
          </button>

          <button
            onClick={() => setActiveView('leaderboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeView === 'leaderboard'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span>Benchmark Matrix</span>
          </button>
        </div>

        {/* Right: Controls & Modals */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* MCP Integration Button */}
          <button
            onClick={onOpenMcp}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-100 bg-gradient-to-r from-emerald-600/30 to-indigo-600/30 hover:from-emerald-600/40 hover:to-indigo-600/40 border border-emerald-500/40 transition-all flex items-center space-x-1.5 shadow-sm"
            title="Setup MCP for Claude Desktop, Claude Code & Codex"
          >
            <Code2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">MCP for Claude & Codex</span>
            <span className="sm:hidden">MCP</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          </button>

          {/* ROI Calculator Button */}
          <button
            onClick={onOpenRoi}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 transition-all flex items-center space-x-1.5"
            title="Calculate monthly savings"
          >
            <Calculator className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Savings</span>
          </button>

        </div>

      </div>
    </header>
  );
}
