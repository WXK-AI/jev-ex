import React from 'react';
import { X, Inbox, CheckCircle2, ShieldX, Clock, AlertTriangle, Trash2 } from 'lucide-react';

export default function QuarantineQueue({ 
  isOpen, 
  onClose, 
  queue, 
  onApprove, 
  onReject, 
  onClear 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700/80 bg-[#0d1424] shadow-2xl p-6 relative max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <Inbox className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  Quarantine Approval Queue
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-semibold">
                  {queue.length} Pending
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Human-in-the-loop review for actions exceeding autonomous safety thresholds
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {queue.length > 0 && (
              <button
                onClick={onClear}
                className="px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors flex items-center gap-1"
                title="Clear all queued items"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {queue.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mb-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-500/60" />
              </div>
              <p className="text-sm font-medium text-slate-300">Quarantine Queue is Clean</p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                When an action is evaluated as QUARANTINE by Jev, click "Send to Queue" to hold it for operator review.
              </p>
            </div>
          ) : (
            queue.map((item) => (
              <div 
                key={item.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {item.environment}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        tool: {item.tool}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Blast Radius: <strong className="text-white font-mono">{item.blastScore?.toFixed(2)}</strong> | 
                      Destructive Prob: <strong className="text-rose-400 font-mono">{((item.destructiveProb ?? 0) * 100).toFixed(0)}%</strong>
                    </p>
                  </div>

                  {/* Operator Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => onApprove(item.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => onReject(item.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-all flex items-center gap-1"
                    >
                      <ShieldX className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>

                {/* Code payload */}
                <div className="bg-[#070b14] p-2.5 rounded-lg border border-slate-900 font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre-wrap">
                  {item.action}
                </div>

                {item.reasons && item.reasons.length > 0 && (
                  <div className="text-[11px] text-amber-300/80 flex items-center gap-1.5">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    <span>{item.reasons[0]}</span>
                  </div>
                )}
              </div>
            ))
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
