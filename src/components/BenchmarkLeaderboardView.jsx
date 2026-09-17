import React, { useState, useMemo } from 'react';
import { 
  ARTIFICIAL_ANALYSIS_LEADERBOARD, 
  AGENT_ECOSYSTEMS, 
  BENCHMARK_CATEGORIES, 
  ARTIFICIAL_ANALYSIS_METRICS_INFO 
} from '../data/benchmarks';
import { 
  Trophy, Award, Zap, Gauge, DollarSign, Timer, ExternalLink, 
  ShieldCheck, Activity, BrainCircuit, Search, Layers, Cpu, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function BenchmarkLeaderboardView() {
  const [selectedEcosystem, setSelectedEcosystem] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('intelligenceIndex');
  const [sortAsc, setSortAsc] = useState(false);

  // Filtered & Sorted models
  const filteredModels = useMemo(() => {
    return ARTIFICIAL_ANALYSIS_LEADERBOARD
      .filter(m => {
        const matchesEcosystem = selectedEcosystem === 'all' || m.agentEcosystem === selectedEcosystem;
        const matchesSearch = !searchQuery.trim() || 
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.bestFor.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesEcosystem && matchesSearch;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        // Handle string percentages / special formats
        if (typeof valA === 'string' && valA.endsWith('%')) {
          valA = parseFloat(valA);
        }
        if (typeof valB === 'string' && valB.endsWith('%')) {
          valB = parseFloat(valB);
        }
        if (typeof valA === 'string' && valA.startsWith('$')) {
          valA = parseFloat(valA.replace('$', '').split(' ')[0]);
        }
        if (typeof valB === 'string' && valB.startsWith('$')) {
          valB = parseFloat(valB.replace('$', '').split(' ')[0]);
        }
        if (valA === 'Reflex N/A' || valA === 'Reflex Gate') valA = -999;
        if (valB === 'Reflex N/A' || valB === 'Reflex Gate') valB = -999;

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [selectedEcosystem, searchQuery, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Grounded in ArtificialAnalysis.ai with Ecosystem Focus */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#0c1824] via-[#0d1424] to-[#0c1824] p-6 shadow-xl relative overflow-hidden">
        
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-md">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-white">
                  ArtificialAnalysis.ai Official Model Matrix & Connected Agent Ecosystems
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  v4.3 Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Organized by connected agent integrations (Claude, Codex/GPT, DeepSeek, Gemini, Jev Reflex) across all ArtificialAnalysis.ai evaluation domains
              </p>
            </div>
          </div>

          <a 
            href="https://artificialanalysis.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-all hover:border-slate-500 shadow"
          >
            <span>Visit ArtificialAnalysis.ai</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* 5 Connected Agent Ecosystem Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
          
          <div 
            onClick={() => setSelectedEcosystem(selectedEcosystem === 'claude' ? 'all' : 'claude')}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              selectedEcosystem === 'claude'
                ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/30'
                : 'bg-slate-950/70 border-slate-800/80 hover:border-purple-500/40'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-purple-400 mb-1">
              <span>🟣 Claude Connected</span>
              <span className="text-[10px] bg-purple-500/20 px-1.5 py-0.5 rounded">Anthropic</span>
            </div>
            <div className="text-xs font-bold text-white">#1 Coding Agents</div>
            <div className="text-[10px] text-purple-300 font-mono mt-0.5">SWE-bench: 70.3% • Intel: 18</div>
            <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">Claude 3.7 Sonnet, Haiku, Opus</div>
          </div>

          <div 
            onClick={() => setSelectedEcosystem(selectedEcosystem === 'codex' ? 'all' : 'codex')}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              selectedEcosystem === 'codex'
                ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                : 'bg-slate-950/70 border-slate-800/80 hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-emerald-400 mb-1">
              <span>🟢 Codex Connected</span>
              <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded">OpenAI</span>
            </div>
            <div className="text-xs font-bold text-white">#1 Math & Logic</div>
            <div className="text-[10px] text-emerald-300 font-mono mt-0.5">AIME: 87.3% • 210 t/s</div>
            <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">o3-mini, o1, GPT-4o, 4o-mini</div>
          </div>

          <div 
            onClick={() => setSelectedEcosystem(selectedEcosystem === 'deepseek' ? 'all' : 'deepseek')}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              selectedEcosystem === 'deepseek'
                ? 'bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                : 'bg-slate-950/70 border-slate-800/80 hover:border-cyan-500/40'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-cyan-400 mb-1">
              <span>🔵 DeepSeek</span>
              <span className="text-[10px] bg-cyan-500/20 px-1.5 py-0.5 rounded">Open</span>
            </div>
            <div className="text-xs font-bold text-white">Cost-per-Intelligence</div>
            <div className="text-[10px] text-cyan-300 font-mono mt-0.5">$0.96 / 1M • AIME: 79.8%</div>
            <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">DeepSeek-R1, DeepSeek-V3</div>
          </div>

          <div 
            onClick={() => setSelectedEcosystem(selectedEcosystem === 'gemini' ? 'all' : 'gemini')}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              selectedEcosystem === 'gemini'
                ? 'bg-sky-950/40 border-sky-500 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/30'
                : 'bg-slate-950/70 border-slate-800/80 hover:border-sky-500/40'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-sky-400 mb-1">
              <span>🔷 Gemini Connected</span>
              <span className="text-[10px] bg-sky-500/20 px-1.5 py-0.5 rounded">Google</span>
            </div>
            <div className="text-xs font-bold text-white">#1 Context & Speed</div>
            <div className="text-[10px] text-sky-300 font-mono mt-0.5">2M Context • 220 t/s</div>
            <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">Gemini 2.0 Flash, Flash Thinking</div>
          </div>

          <div 
            onClick={() => setSelectedEcosystem(selectedEcosystem === 'jev' ? 'all' : 'jev')}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              selectedEcosystem === 'jev'
                ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                : 'bg-slate-950/70 border-slate-800/80 hover:border-amber-500/40'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-400 mb-1">
              <span>🟡 Jev Reflex Engine</span>
              <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded">TypeSafe</span>
            </div>
            <div className="text-xs font-bold text-white">#1 Reflex Triage</div>
            <div className="text-[10px] text-amber-300 font-mono mt-0.5">150ms TTFT • $0.0315/1M</div>
            <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">1-pass parallel, free outputs</div>
          </div>

        </div>

      </div>

      {/* Primary Filter Bar: Connected Agent Ecosystems */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-mono uppercase text-slate-400 mr-2 flex items-center gap-1">
            <Cpu className="h-3.5 w-3.5 text-emerald-400" />
            <span>Agent Ecosystem:</span>
          </span>

          {Object.values(AGENT_ECOSYSTEMS).map(eco => (
            <button
              key={eco.id}
              onClick={() => setSelectedEcosystem(eco.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                selectedEcosystem === eco.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {eco.id === 'all' ? 'All Connected Agents (16)' : eco.name}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search model, capability, or provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

      </div>

      {/* Secondary Category Filter: Benchmark Evaluation Domains */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {BENCHMARK_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-850 hover:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Comprehensive Leaderboard Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d1424]/90 p-5 shadow-xl overflow-hidden">
        
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center space-x-2 font-mono">
            <span>Showing <strong className="text-white">{filteredModels.length}</strong> models</span>
            {selectedEcosystem !== 'all' && (
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 text-[11px]">
                Filtered: {AGENT_ECOSYSTEMS[selectedEcosystem]?.name}
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Click column headers to sort by benchmark score
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400 select-none">
                
                <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                  Model & Connected Agent
                </th>

                {/* OVERVIEW CATEGORY */}
                {selectedCategory === 'overview' && (
                  <>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('intelligenceIndex')}>
                      AA Intel Index
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('sweBenchVerified')}>
                      SWE-bench
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('aime2024')}>
                      AIME 2024
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('outputSpeed')}>
                      Speed (TPS)
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('blendedPrice')}>
                      Blended Price
                    </th>
                    <th className="py-2.5 px-3">Pareto Frontier Status</th>
                  </>
                )}

                {/* CODING & AGENTIC CATEGORY */}
                {selectedCategory === 'coding' && (
                  <>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('sweBenchVerified')}>
                      SWE-bench Verified
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('codingAgentsScore')}>
                      Coding Agents Score
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('intelligenceIndex')}>
                      Intelligence Index
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('contextWindow')}>
                      Context Window
                    </th>
                    <th className="py-2.5 px-3">Primary Engineering Use Case</th>
                  </>
                )}

                {/* MATH & SCIENCE CATEGORY */}
                {selectedCategory === 'math_science' && (
                  <>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('aime2024')}>
                      AIME 2024 (Math)
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('gpqaDiamond')}>
                      GPQA Diamond (PhD)
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('hleScore')}>
                      Humanity's Last Exam (HLE)
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('mmluPro')}>
                      MMLU-Pro (Grad QA)
                    </th>
                    <th className="py-2.5 px-3">Reasoning Mode</th>
                  </>
                )}

                {/* REAL WORLD & INSTRUCTION CATEGORY */}
                {selectedCategory === 'real_world' && (
                  <>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('gdpvalScore')}>
                      GDPval-AA v2 (44 Jobs)
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('ifEvalScore')}>
                      IFEval (Formatting)
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('outputSpeed')}>
                      Output TPS
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('ttft')}>
                      TTFT Latency
                    </th>
                    <th className="py-2.5 px-3">Instruction Strengths</th>
                  </>
                )}

                {/* SPEED & LATENCY CATEGORY */}
                {selectedCategory === 'speed' && (
                  <>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('outputSpeed')}>
                      Output Speed (TPS)
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('ttft')}>
                      TTFT / TTFAT Latency
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('contextWindow')}>
                      Context Window
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('intelligenceIndex')}>
                      Intel Index
                    </th>
                    <th className="py-2.5 px-3">Throughput Tier</th>
                  </>
                )}

                {/* PRICING & COST EFFICIENCY */}
                {selectedCategory === 'pricing' && (
                  <>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('blendedPrice')}>
                      Blended Price (3:1)
                    </th>
                    <th className="py-2.5 px-3">Input / Output Rate</th>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('intelligenceIndex')}>
                      Intel Index
                    </th>
                    <th className="py-2.5 px-3">Pareto Frontier Position</th>
                    <th className="py-2.5 px-3">Cost Optimization Tip</th>
                  </>
                )}

              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-850">
              {filteredModels.map((m) => {
                const eco = AGENT_ECOSYSTEMS[m.agentEcosystem] || AGENT_ECOSYSTEMS.all;

                return (
                  <tr key={m.id} className="hover:bg-slate-900/50 transition-colors">
                    
                    {/* Model Name & Connected Agent Tag */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{m.name}</span>
                        {m.id === 'claude-3-7-sonnet-reasoning' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">#1 CODING</span>
                        )}
                        {m.id === 'openai-o3-mini-high' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">#1 MATH</span>
                        )}
                        {m.id === 'typesafe-jev' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">#1 REFLEX</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border ${eco.color}`}>
                          {eco.badge}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{m.provider}</span>
                      </div>
                    </td>

                    {/* OVERVIEW CELLS */}
                    {selectedCategory === 'overview' && (
                      <>
                        <td className="py-3 px-3 font-mono font-extrabold text-slate-200">
                          <span className={m.intelligenceIndex === 18 ? 'text-purple-400 text-sm font-black' : m.intelligenceIndex === 15 ? 'text-blue-400 text-sm' : m.intelligenceIndex === 13 ? 'text-emerald-400 text-sm' : ''}>
                            {m.intelligenceIndex}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-slate-300">
                          <span className={m.sweBenchVerified === '70.3%' ? 'text-purple-400 font-black' : ''}>
                            {m.sweBenchVerified}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-slate-300">
                          <span className={m.aime2024 === '87.3%' ? 'text-emerald-400 font-black' : ''}>
                            {m.aime2024}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-cyan-400 font-semibold">
                          {m.outputSpeed}
                        </td>
                        <td className="py-3 px-3 font-mono text-emerald-400 font-bold">
                          {m.blendedPrice}
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-300 max-w-xs font-sans">
                          {m.paretoStatus}
                        </td>
                      </>
                    )}

                    {/* CODING CELLS */}
                    {selectedCategory === 'coding' && (
                      <>
                        <td className="py-3 px-3 font-mono font-black text-purple-400 text-sm">
                          {m.sweBenchVerified}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-200">
                          {m.codingAgentsScore}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-300">
                          {m.intelligenceIndex}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-400">
                          {m.contextWindow}
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-300 max-w-sm">
                          {m.bestFor}
                        </td>
                      </>
                    )}

                    {/* MATH & SCIENCE CELLS */}
                    {selectedCategory === 'math_science' && (
                      <>
                        <td className="py-3 px-3 font-mono font-black text-emerald-400 text-sm">
                          {m.aime2024}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-blue-400">
                          {m.gpqaDiamond}
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-purple-300">
                          {m.hleScore}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-300">
                          {m.mmluPro}
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-300 max-w-sm">
                          {m.ttft.includes('TTFAT') ? 'Deep Test-Time Thinking Chain' : 'Standard Direct Inference'}
                        </td>
                      </>
                    )}

                    {/* REAL-WORLD CELLS */}
                    {selectedCategory === 'real_world' && (
                      <>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-300 text-sm">
                          {m.gdpvalScore}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-teal-300">
                          {m.ifEvalScore}
                        </td>
                        <td className="py-3 px-3 font-mono text-cyan-400">
                          {m.outputSpeed}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-400">
                          {m.ttft}
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-300 max-w-sm">
                          {m.bestFor}
                        </td>
                      </>
                    )}

                    {/* SPEED & LATENCY CELLS */}
                    {selectedCategory === 'speed' && (
                      <>
                        <td className="py-3 px-3 font-mono font-black text-cyan-400 text-sm">
                          {m.outputSpeed}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-300">
                          {m.ttft}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-400">
                          {m.contextWindow}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-300">
                          {m.intelligenceIndex}
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-300">
                          {m.id === 'typesafe-jev' ? 'Ultra-Fast Reflex (<200ms)' : m.outputSpeed.includes('2') ? 'Extreme Throughput (>200 t/s)' : 'High Reasoning Density'}
                        </td>
                      </>
                    )}

                    {/* PRICING CELLS */}
                    {selectedCategory === 'pricing' && (
                      <>
                        <td className="py-3 px-3 font-mono font-black text-emerald-400 text-sm">
                          {m.blendedPrice}
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                          {m.costInput} in / {m.costOutput} out
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-300">
                          {m.intelligenceIndex}
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-300">
                          {m.paretoStatus}
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-400 max-w-xs">
                          {m.blendedPrice.includes('$0.') ? 'High-volume offload tier' : 'Reserve strictly for complex reasoning'}
                        </td>
                      </>
                    )}

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Connected Agent Architectural Mapping */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d1424]/90 p-5 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider mb-2">
          <Activity className="h-4 w-4 text-emerald-400" />
          <span>Connected Agent Specialization Matrix (ArtificialAnalysis.ai)</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          When you connect via Model Context Protocol (MCP), TypeSafe Jev routes sub-tasks specifically to the model family of your active agent or federates across agents:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          
          <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-400"></span>
              <span className="text-purple-300 font-bold">When Connected to Claude Agent</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Decomposes repo-level coding to <strong>Claude 3.7 Sonnet (Reasoning)</strong> (AA #1 SWE-bench 70.3%) and offloads OpenAPI documentation and schemas to <strong>Claude 3.5 Haiku</strong> (165 t/s, 96% cost reduction).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-emerald-300 font-bold">When Connected to Codex / GPT Agent</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Routes competition mathematics and algorithmic logic to <strong>OpenAI o3-mini (High)</strong> (AA #1 AIME 87.3%), terminal system execution to <strong>GPT-4o</strong>, and PhD science to <strong>o1</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400"></span>
              <span className="text-amber-300 font-bold">TypeSafe Jev System-1 Reflex Layer</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Acts as the sub-second (150ms) classification, task decomposition, and pre-commit security gatekeeper before dispatching to any generative reasoning models.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
