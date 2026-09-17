import React from 'react';
import { X, Sliders, ShieldCheck, ShieldAlert, Sparkles, RotateCcw } from 'lucide-react';

export default function PolicySettingsModal({ isOpen, onClose, policy, setPolicy }) {
  if (!isOpen) return null;

  const applyPreset = (presetName) => {
    if (presetName === 'strict') {
      setPolicy({
        sensitivity: 'strict',
        destructiveThreshold: 0.40,
        maxAllowedBlastRadius: 1.4,
        autoBlockExfiltration: true,
        requireHumanForProduction: true
      });
    } else if (presetName === 'balanced') {
      setPolicy({
        sensitivity: 'balanced',
        destructiveThreshold: 0.70,
        maxAllowedBlastRadius: 2.2,
        autoBlockExfiltration: true,
        requireHumanForProduction: true
      });
    } else if (presetName === 'permissive') {
      setPolicy({
        sensitivity: 'permissive',
        destructiveThreshold: 0.88,
        maxAllowedBlastRadius: 3.2,
        autoBlockExfiltration: true,
        requireHumanForProduction: false
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-slate-700/80 bg-[#0d1424] shadow-2xl p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Circuit Breaker Policy Rules
              </h3>
              <p className="text-xs text-slate-400">
                Configure deterministic thresholds evaluated over Jev's calibrated probabilities
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

        {/* Preset Profiles */}
        <div className="py-4 border-b border-slate-800/80">
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            Safety Sensitivity Profile:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'strict', label: 'Strict Security', desc: 'Zero tolerance; sensitive ops quarantined' },
              { id: 'balanced', label: 'Balanced (Standard)', desc: 'Optimal trade-off for dev velocity & safety' },
              { id: 'permissive', label: 'Permissive (Dev)', desc: 'High autonomy for local sandboxes' },
            ].map((p) => {
              const active = policy.sensitivity === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    active
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-white mb-0.5">{p.label}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{p.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Sliders */}
        <div className="py-4 space-y-5">
          
          {/* Destructive Probability Threshold */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-300">
                Destructive Probability Cutoff (<code className="text-cyan-300">noul</code>)
              </span>
              <span className="font-mono font-bold text-rose-400">
                {(policy.destructiveThreshold * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.20"
              max="0.95"
              step="0.05"
              value={policy.destructiveThreshold}
              onChange={(e) => setPolicy(prev => ({ ...prev, destructiveThreshold: parseFloat(e.target.value), sensitivity: 'custom' }))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Actions with destructive / data exfiltration probability at or above this value are blocked immediately.
            </p>
          </div>

          {/* Max Allowed Blast Radius */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-300">
                Max Blast Radius for Auto-Allow (<code className="text-cyan-300">score</code>)
              </span>
              <span className="font-mono font-bold text-amber-400">
                {policy.maxAllowedBlastRadius.toFixed(1)} / 4.0
              </span>
            </div>
            <input
              type="range"
              min="0.8"
              max="3.5"
              step="0.1"
              value={policy.maxAllowedBlastRadius}
              onChange={(e) => setPolicy(prev => ({ ...prev, maxAllowedBlastRadius: parseFloat(e.target.value), sensitivity: 'custom' }))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Actions scoring higher than this level require human confirmation (quarantine) before executing.
            </p>
          </div>

          {/* Toggle Safeguards */}
          <div className="space-y-3 pt-2">
            
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:bg-slate-900/60 transition-colors">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Auto-Block Credential Exfiltration
                </span>
                <span className="text-[11px] text-slate-400">
                  Instantly terminate any command reading SSH keys or environment secrets
                </span>
              </div>
              <input
                type="checkbox"
                checked={policy.autoBlockExfiltration}
                onChange={(e) => setPolicy(prev => ({ ...prev, autoBlockExfiltration: e.target.checked, sensitivity: 'custom' }))}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/50"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:bg-slate-900/60 transition-colors">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Production Environment Safeguard
                </span>
                <span className="text-[11px] text-slate-400">
                  Always require human operator sign-off for mutations targeting production
                </span>
              </div>
              <input
                type="checkbox"
                checked={policy.requireHumanForProduction}
                onChange={(e) => setPolicy(prev => ({ ...prev, requireHumanForProduction: e.target.checked, sensitivity: 'custom' }))}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/50"
              />
            </label>

          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md transition-all"
          >
            Apply Policy Rules
          </button>
        </div>

      </div>
    </div>
  );
}
