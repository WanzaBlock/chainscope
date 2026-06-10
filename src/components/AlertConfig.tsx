/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Chain, AlertRule, AlertLog } from '../types';
import { Bell, ShieldAlert, Sliders, Play, Trash2, CheckCircle, Plus, Info } from 'lucide-react';

interface AlertConfigProps {
  chain: Chain;
  rules: AlertRule[];
  logs: AlertLog[];
  onAddRule: (rule: AlertRule) => void;
  onDeleteRule: (id: string) => void;
  onClearLogs: () => void;
  onToggleRule: (id: string) => void;
}

export default function AlertConfig({
  chain,
  rules,
  logs,
  onAddRule,
  onDeleteRule,
  onClearLogs,
  onToggleRule
}: AlertConfigProps) {
  const [metric, setMetric] = useState<'tps' | 'gasPrice' | 'blockTime' | 'activeAddresses'>('tps');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [thresholdValue, setThresholdValue] = useState<number>(100);
  const [customAlertName, setCustomAlertName] = useState<string>('');

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `rule-${Date.now()}`;
    const name = customAlertName.trim() || `${chain.name} ${metric} ${condition} ${thresholdValue}`;
    
    const newRule: AlertRule = {
      id,
      chainId: chain.id,
      metric,
      condition,
      value: thresholdValue,
      isActive: true,
      alertName: name
    };

    onAddRule(newRule);
    setCustomAlertName('');
  };

  const getSeverityBadgeColor = (severity: string) => {
    return severity === 'critical'
      ? 'bg-red-950/40 text-red-400 border border-red-800/60'
      : 'bg-amber-955/40 text-amber-400 border border-amber-800/60';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="alerts-config-grid">
      {/* Configure Alert Rules */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-[420px] shadow-3xs">
        <div>
          <div className="flex items-center gap-1.5 text-white font-bold text-xs uppercase tracking-wider mb-2 font-display">
            <Sliders className="w-4 h-4 text-violet-400" />
            Integrate Alert Rules
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-4 font-medium font-sans">
            Configure telemetry triggers to send alerts if TPS rates or gas fluctuations violate safety limits.
          </p>

          <form onSubmit={handleCreateRule} className="space-y-3.5">
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Target Metric</label>
              <select
                value={metric}
                onChange={(e) => {
                  const m = e.target.value as any;
                  setMetric(m);
                  if (m === 'tps') setThresholdValue(100);
                  if (m === 'gasPrice') setThresholdValue(50);
                  if (m === 'blockTime') setThresholdValue(2.0);
                  if (m === 'activeAddresses') setThresholdValue(5000);
                }}
                className="w-full bg-[#131b2c] border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-100 font-semibold focus:outline-none focus:border-violet-500 focus:bg-[#1a243c] transition-all cursor-pointer"
              >
                <option value="tps">Throughput (TPS Rate)</option>
                <option value="gasPrice">Gas Market (Gwei)</option>
                <option value="blockTime">Consensus Block Time (sec)</option>
                <option value="activeAddresses">Daily Active Addresses (Count)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full bg-[#131b2c] border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-100 font-semibold focus:outline-none focus:border-violet-500 focus:bg-[#1a243c] transition-all cursor-pointer"
                >
                  <option value="above">Above (&gt;)</option>
                  <option value="below">Below (&lt;)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Value Limit</label>
                <input
                  type="number"
                  step="any"
                  value={thresholdValue}
                  onChange={(e) => setThresholdValue(Number(e.target.value))}
                  className="w-full bg-[#131b2c] border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-100 font-mono font-semibold focus:outline-none focus:border-violet-500 focus:bg-[#1a243c] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Custom Label (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Host Gas Congestion"
                value={customAlertName}
                onChange={(e) => setCustomAlertName(e.target.value)}
                className="w-full bg-[#131b2c] border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 font-semibold focus:outline-none focus:border-violet-500 focus:bg-[#1a243c] transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs shadow-violet-600/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Save Guardrail Rule
            </button>
          </form>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center gap-1.5 text-[9px] text-slate-500 font-semibold">
          <Info className="w-3.5 h-3.5 text-slate-500" />
          Bound to the specific telemetry of {chain.name}.
        </div>
      </div>

      {/* Active Rules List */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 flex flex-col h-[420px] shadow-3xs">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-display">
            <Bell className="w-4 h-4 text-violet-400" />
            Configured Policies ({rules.length})
          </h4>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2.5 pr-1" id="rules-scroll-list">
          {rules.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs font-mono">
              No alert policies defined for {chain.name}. Create one on the left panel.
            </div>
          ) : (
            rules.map((rule) => {
              const ruleMetricLabel = rule.metric === 'tps' ? 'TPS' : rule.metric === 'gasPrice' ? 'Gwei' : rule.metric === 'blockTime' ? 'sec' : 'addresses';
              return (
                <div
                  key={rule.id}
                  className="w-full p-3 rounded-xl border border-slate-850 bg-[#121927] flex items-center justify-between gap-3"
                >
                  <div className="truncate">
                    <span className="text-xs text-slate-200 font-bold block truncate">{rule.alertName}</span>
                    <span className="text-[10px] text-slate-450 block mt-0.5 font-mono font-bold">
                      {rule.metric} {rule.condition === 'above' ? '>' : '<'} {rule.value} {ruleMetricLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onToggleRule(rule.id)}
                      className={`text-[9px] px-2 py-0.5 font-bold rounded-full border cursor-pointer select-none transition-all ${
                        rule.isActive
                          ? 'bg-violet-950/45 text-violet-300 border-violet-850'
                          : 'bg-slate-900 text-slate-505 border-slate-800'
                      }`}
                    >
                      {rule.isActive ? 'Active' : 'Disabled'}
                    </button>
                    <button
                      onClick={() => onDeleteRule(rule.id)}
                      className="p-1 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Delete rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Triggered Alert Reports */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 flex flex-col h-[420px] shadow-3xs">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-display">
            <ShieldAlert className="w-4 h-4 text-violet-400" />
            Triggered Incidents ({logs.length})
          </h4>
          {logs.length > 0 && (
            <button
              onClick={onClearLogs}
              className="text-[10px] text-slate-400 hover:text-slate-200 font-bold uppercase tracking-wider cursor-pointer"
            >
              Clear Logs
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2.5 pr-1" id="alerts-scroll-list">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-xs font-mono text-center">
              <CheckCircle className="w-7 h-7 text-emerald-505/50 mb-3 animate-pulse" />
              Ecosystem safe.<br />No parameter anomalies reported.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className={`p-3 rounded-xl border flex items-start gap-2 ${
                  log.severity === 'critical'
                    ? 'border-red-900 bg-red-950/30 text-red-100'
                    : 'border-amber-900 bg-amber-955/35 text-amber-100'
                }`}
              >
                <div className="flex flex-col gap-1 w-full text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white">{log.chainName} Status</span>
                    <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.2 border rounded-full shrink-0 ${getSeverityBadgeColor(log.severity)}`}>
                      {log.severity}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-300 mt-1.5 leading-relaxed font-semibold">
                    Metric: <span className="font-mono text-violet-300 bg-[#131b2c] px-1 py-0.5 rounded border border-slate-800">{log.metric}</span> hit <span className="font-bold text-white">{log.value}</span> (Limit: {log.condition === 'above' ? '>' : '<'} {log.limitValue})
                  </p>
                  <span className="text-[9px] font-mono font-bold text-slate-500 mt-2 align-bottom self-end">
                    {log.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
