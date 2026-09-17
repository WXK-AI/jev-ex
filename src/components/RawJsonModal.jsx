import React, { useState } from 'react';
import { X, FileJson, Copy, Check } from 'lucide-react';

export default function RawJsonModal({ isOpen, onClose, result }) {
  const [tab, setTab] = useState('response');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !result) return null;

  const content = tab === 'response' 
    ? JSON.stringify(result.raw_response || result, null, 2)
    : JSON.stringify(result.raw_request || {}, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700/80 bg-[#0d1424] shadow-2xl p-6 relative max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
              <FileJson className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Raw TypeSafe Jev System-1 Payload
              </h3>
              <p className="text-xs text-slate-400">
                Inspect exact input questions and typed answers from the API
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

        {/* Tabs & Copy */}
        <div className="flex items-center justify-between pt-4 pb-2 shrink-0">
          <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setTab('response')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                tab === 'response' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Jev Response ({result.telemetry?.model || 'jev-latest'})
            </button>
            <button
              onClick={() => setTab('request')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                tab === 'request' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sent Request Payload
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 flex items-center gap-1.5 hover:bg-slate-800 transition-all"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
        </div>

        {/* Code view */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-slate-800 bg-[#060910] p-4 font-mono text-xs text-slate-200 whitespace-pre leading-relaxed">
          {content}
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
