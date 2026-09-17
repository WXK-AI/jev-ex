import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ActionConsole from './components/ActionConsole';
import TaskPipelineView from './components/TaskPipelineView';
import BenchmarkLeaderboardView from './components/BenchmarkLeaderboardView';
import TradingDashboardView from './components/TradingDashboardView';
import McpModal from './components/McpModal';
import RoiCalculatorModal from './components/RoiCalculatorModal';
import RawJsonModal from './components/RawJsonModal';
import { PRESETS } from './data/presets';
import { History, GitFork, Trophy, Zap, AlertCircle, TrendingUp } from 'lucide-react';

export default function App() {
  const [health, setHealth] = useState(null);
  const [activeView, setActiveView] = useState('trading'); // 'trading' | 'pipeline' | 'leaderboard'
  
  // Default to Byzantine Distributed Ledger preset
  const defaultPreset = PRESETS[0];
  const [prompt, setPrompt] = useState(defaultPreset.prompt);
  const [ecosystem, setEcosystem] = useState('hybrid_frontier');

  // State for Evaluations & History
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  // Modals
  const [isMcpOpen, setIsMcpOpen] = useState(false);
  const [isRoiOpen, setIsRoiOpen] = useState(false);
  const [isRawJsonOpen, setIsRawJsonOpen] = useState(false);

  // Fetch health check on mount
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => setHealth({ status: 'offline', error: err.message }));
  }, []);

  // Main task distribution call
  const handleEvaluate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/distribute-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          target_ecosystem: ecosystem
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      setResult(data);

      const historyItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        prompt,
        ecosystem,
        phases_count: data.phases?.length || 1,
        complexity_score: data.complexity_score,
        latency_ms: data.latency_ms,
        data
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 7)]);

    } catch (err) {
      console.error('Task distribution failed:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = (item) => {
    setPrompt(item.prompt);
    setEcosystem(item.ecosystem);
    setResult(item.data);
    setActiveView('pipeline');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Top Header */}
      <Header 
        health={health}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenMcp={() => setIsMcpOpen(true)}
        onOpenRoi={() => setIsRoiOpen(true)}
      />

      {/* Sub-Header Concept Bar */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-slate-950 via-[#0a1520] to-slate-950 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-white">
              TypeSafe Jev System-1 Autonomous Live Trading & Quant Engine
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">
              Real-time Binance market feeds • Sub-second neural reflex decisions • $100k USDT zero-risk paper portfolio
            </span>
          </div>

          <div className="flex items-center space-x-3 font-mono text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold">Live Reflex ~150ms</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">$0.042 / 1M Tokens</span>
          </div>

        </div>
      </div>

      {/* Mobile View Switcher */}
      <div className="md:hidden flex items-center justify-center p-2 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl">
          <button
            onClick={() => setActiveView('trading')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              activeView === 'trading' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400'
            }`}
          >
            Live Trading
          </button>
          <button
            onClick={() => setActiveView('pipeline')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              activeView === 'pipeline' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400'
            }`}
          >
            Task Distribution
          </button>
          <button
            onClick={() => setActiveView('leaderboard')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              activeView === 'leaderboard' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400'
            }`}
          >
            Benchmark Matrix
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col space-y-6">
        
        {/* Error Banner */}
        {error && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span><strong>Orchestration Error:</strong> {error}</span>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-white font-semibold underline text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View 0: Live Paper Trading Dashboard Terminal */}
        {activeView === 'trading' && (
          <TradingDashboardView />
        )}

        {/* View 1: Task Distribution Studio */}
        {activeView === 'pipeline' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Project Input Console (5 cols on lg) */}
            <div className="lg:col-span-5 flex flex-col h-full">
              <ActionConsole 
                prompt={prompt}
                setPrompt={setPrompt}
                ecosystem={ecosystem}
                setEcosystem={setEcosystem}
                onEvaluate={handleEvaluate}
                isLoading={isLoading}
              />
            </div>

            {/* Right Column: Distributed Pipeline Graph (7 cols on lg) */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <TaskPipelineView 
                result={result}
                isLoading={isLoading}
                onViewRawJson={() => setIsRawJsonOpen(true)}
              />
            </div>

          </div>
        )}

        {/* View 2: Verified Benchmark Leaderboard */}
        {activeView === 'leaderboard' && (
          <BenchmarkLeaderboardView />
        )}

        {/* Session History */}
        {history.length > 0 && activeView === 'pipeline' && (
          <div className="rounded-2xl border border-slate-800 bg-[#0d1424]/60 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center space-x-2">
                <History className="h-4 w-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Session Distribution History ({history.length})
                </h4>
              </div>
              <span className="text-[11px] text-slate-500">
                Click any project to reload multi-model execution graph
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectHistoryItem(item)}
                  className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:bg-slate-900/60 hover:border-slate-700 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border text-emerald-300 border-emerald-500/30 bg-emerald-500/10">
                      {item.phases_count} Stages
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">
                      {item.latency_ms}ms
                    </span>
                  </div>
                  <div className="font-sans text-xs text-slate-300 truncate group-hover:text-white transition-colors">
                    {item.prompt}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                    <span>Complexity: {item.complexity_score?.toFixed(1)}</span>
                    <span className="text-emerald-400">Distributed Plan</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-dark-950/80 py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Jev Benchmark Orchestrator • Powered by TypeSafe AI <strong>System-1 Model</strong>
          </span>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>Model: <code className="text-emerald-300 font-mono">{health?.model || 'jev-latest'}</code></span>
            <span>Speed: <code className="text-emerald-300 font-mono">~150ms</code></span>
            <span>Benchmarks: <code className="text-emerald-300 font-mono">SWE-bench • AIME • GPQA</code></span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <McpModal 
        isOpen={isMcpOpen}
        onClose={() => setIsMcpOpen(false)}
      />

      <RoiCalculatorModal 
        isOpen={isRoiOpen}
        onClose={() => setIsRoiOpen(false)}
      />

      <RawJsonModal 
        isOpen={isRawJsonOpen}
        onClose={() => setIsRawJsonOpen(false)}
        result={result}
      />

    </div>
  );
}
