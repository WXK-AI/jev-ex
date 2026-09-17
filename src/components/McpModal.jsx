import React, { useState } from 'react';
import { X, Code2, Copy, Check, Terminal, FileCode, CheckCircle2, Zap, ArrowRight, ExternalLink, Cpu } from 'lucide-react';

export default function McpModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('claude_desktop');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const serverPath = '/path/to/jev-ex/mcp-server.js';
  const apiKey = 'YOUR_TYPESAFE_API_KEY';

  const configs = {
    claude_desktop: {
      title: 'Claude Desktop Integration',
      file: '~/Library/Application Support/Claude/claude_desktop_config.json',
      desc: 'Enables Claude Desktop to automatically call Jev for benchmark task distribution, routing to Claude 3.7 Sonnet (SWE-bench 70.3%) & Haiku.',
      snippet: JSON.stringify({
        "mcpServers": {
          "jev-orchestrator": {
            "command": "node",
            "args": [serverPath],
            "env": {
              "TYPESAFE_API_KEY": apiKey
            }
          }
        }
      }, null, 2)
    },
    claude_code: {
      title: 'Claude Code (Terminal Agent)',
      file: 'Terminal / Shell Command',
      desc: 'Installs the orchestrator directly into the Claude Code terminal agent tool registry.',
      snippet: `claude mcp add jev-orchestrator node "${serverPath}" -e TYPESAFE_API_KEY="${apiKey}"`
    },
    cursor_codex: {
      title: 'Codex / Cursor / VS Code',
      file: '.cursor/mcp.json or VS Code MCP Settings',
      desc: 'Allows Codex / Cursor agents to route discrete math and logic to OpenAI o3-mini (AIME 87.3%) and terminal execution to GPT-4o.',
      snippet: JSON.stringify({
        "mcpServers": {
          "jev-orchestrator": {
            "command": "node",
            "args": [serverPath],
            "env": {
              "TYPESAFE_API_KEY": apiKey
            }
          }
        }
      }, null, 2)
    }
  };

  const current = configs[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700/80 bg-[#0d1424] shadow-2xl p-6 relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  Model Context Protocol (MCP) Setup
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  v3.0 Stdio Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Connected Agent Integration for <strong>Claude</strong> & <strong>Codex</strong>
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

        {/* Tab Selection */}
        <div className="flex items-center space-x-2 pt-4 pb-2 shrink-0">
          {[
            { id: 'claude_desktop', label: '🟣 Claude Desktop' },
            { id: 'claude_code', label: '🟣 Claude Code (CLI)' },
            { id: 'cursor_codex', label: '🟢 Codex / Cursor' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-3 py-2">
          
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div>
              <strong className="text-white">{current.title}</strong>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">{current.file}</div>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 border border-slate-700/80 flex items-center gap-1.5 hover:bg-slate-800 transition-all shadow-sm"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Config'}</span>
            </button>
          </div>

          {/* Snippet Display */}
          <div className="rounded-xl border border-slate-800 bg-[#060910] p-4 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
            {current.snippet}
          </div>

          <p className="text-xs text-slate-400">
            {current.desc}
          </p>

          {/* Available Tools in this MCP */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              4 Tools Registered in this MCP:
            </span>
            <div className="space-y-2">
              
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <div className="flex items-center justify-between font-mono font-bold text-white mb-0.5">
                  <span className="text-emerald-400">distribute_and_route_task(task_or_prompt, connected_agent)</span>
                  <span className="text-[10px] text-emerald-400 font-sans font-normal">~150ms reflex</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Decomposes engineering projects in ~150ms and maps sub-tasks to the verified benchmark leaders of your active agent (Claude 3.7 Sonnet for SWE-bench 70.3%, o3-mini for AIME 87.3%, Haiku for IFEval).
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <div className="flex items-center justify-between font-mono font-bold text-white mb-0.5">
                  <span className="text-purple-400">get_benchmark_matrix(agent_ecosystem, focus_metric)</span>
                  <span className="text-[10px] text-slate-500 font-sans font-normal">16 models matrix</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Returns the official ArtificialAnalysis.ai Intelligence Index, TPS throughput, TTFT latency, and $/1M blended rates filtered by connected agent (Claude, Codex, DeepSeek, Gemini, Jev).
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <div className="flex items-center justify-between font-mono font-bold text-white mb-0.5">
                  <span className="text-cyan-400">route_single_prompt(prompt, connected_agent)</span>
                  <span className="text-[10px] text-slate-500 font-sans font-normal">Fast sub-second</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Instant classification of queries to prevent burning frontier compute on routine questions.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <div className="flex items-center justify-between font-mono font-bold text-white mb-0.5">
                  <span className="text-amber-400">system_one_reflex(state, decision_type, instructions, options)</span>
                  <span className="text-[10px] text-amber-400 font-sans font-normal">Direct Jev Primitives</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Direct universal access to TypeSafe Jev for custom continuous score rubrics, choices, or boolean noul probability evaluations without streaming delays.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center shrink-0">
          <span className="text-[11px] text-slate-500 font-mono truncate max-w-xs">
            Path: {serverPath}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
