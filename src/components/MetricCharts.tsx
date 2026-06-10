/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Chain } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Flame, Clock, Play, Pause, Zap, DollarSign, Cpu, Network, Info } from 'lucide-react';

interface MetricChartsProps {
  chain: Chain;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onTriggerSpike: () => void;
}

export default function MetricCharts({ chain, isSimulating, onToggleSimulation, onTriggerSpike }: MetricChartsProps) {
  if (!chain) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-[#0e1626] border border-slate-800 rounded-2xl p-8 text-slate-400 text-xs shadow-xs">
        Select an ecosystem to inspect telemetries.
      </div>
    );
  }

  return (
    <div id={`chain-telemetry-panel-${chain.id}`} className="space-y-6">
      {/* Simulation Controls & Status Header */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-3xs">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSimulating ? 'bg-violet-500' : 'bg-slate-550'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isSimulating ? 'bg-violet-500' : 'bg-slate-600'}`}></span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">Environment Feed Status</span>
          </div>
          <h3 className="font-display font-bold text-white mt-1 text-sm md:text-base">
            Monitoring {chain.name} {chain.stage} metrics
          </h3>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            id="btn-toggle-simulation"
            onClick={onToggleSimulation}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold shadow-2xs border transition-all cursor-pointer ${
              isSimulating
                ? 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-850'
                : 'bg-violet-950/40 text-violet-300 border-violet-850 hover:bg-violet-950'
            }`}
          >
            {isSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5 text-slate-400" /> Freeze Stream
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-violet-400" /> Start Stream
              </>
            )}
          </button>

          <button
            id="btn-inject-tps-spike"
            onClick={onTriggerSpike}
            disabled={!isSimulating}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs shadow-violet-600/10 cursor-pointer ${
              isSimulating
                ? 'bg-violet-600 hover:bg-violet-700 text-white'
                : 'bg-slate-900 text-slate-500 border border-slate-950 cursor-not-allowed shadow-none'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current text-white/90" />
            Inject Stress Load
          </button>
        </div>
      </div>

      {/* Numerical Quick Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-3xs hover:shadow-2xs transition-all">
          <div className="p-2.5 bg-violet-950/40 text-violet-400 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">Current TPS</span>
            <span className="text-base font-extrabold font-mono text-white mt-0.5 block">{chain.tps?.toFixed(1) || '0.0'}</span>
          </div>
        </div>

        <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-3xs hover:shadow-2xs transition-all">
          <div className="p-2.5 bg-violet-950/40 text-violet-400 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">Block Time</span>
            <span className="text-base font-extrabold font-mono text-white mt-0.5 block">{chain.blockTime}s</span>
          </div>
        </div>

        <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-3xs hover:shadow-2xs transition-all">
          <div className="p-2.5 bg-violet-950/40 text-violet-400 rounded-xl">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">Gas Price</span>
            <span className="text-base font-extrabold font-mono text-white mt-0.5 block">{chain.gasPrice} Gwei</span>
          </div>
        </div>

        <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-3xs hover:shadow-2xs transition-all">
          <div className="p-2.5 bg-violet-950/40 text-violet-400 rounded-xl">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">Active Nodes</span>
            <span className="text-base font-extrabold font-mono text-white mt-0.5 block">
              {chain.validators?.active} <span className="text-[11px] text-slate-500 font-medium">/ {chain.validators?.total}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TPS Chart */}
        <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 flex flex-col shadow-3xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-slate-250 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-display">
              <Activity className="w-4 h-4 text-violet-400 animate-pulse-slow" />
              Throughput (TPS Rate)
            </h4>
            <span className="text-[10px] font-mono font-bold text-slate-500">Peak Cap: {chain.peakTps} TPS</span>
          </div>
          <div className="h-48 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chain.history} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0e1626', borderColor: '#334155', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.4)' }}
                  labelStyle={{ fontSize: '9px', color: '#94a3b8', fontWeight: 'bold' }}
                  itemStyle={{ fontSize: '11px', color: '#a78bfa', fontWeight: 'bold' }}
                />
                <Line
                  type="monotone"
                  dataKey="tps"
                   stroke="#a78bfa"
                  strokeWidth={2.5}
                  dot={{ r: 3, strokeWidth: 1 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gas Price Chart */}
        <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 flex flex-col shadow-3xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-slate-250 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-display">
              <Flame className="w-4 h-4 text-violet-400" />
              Gas price range (Gwei)
            </h4>
            <span className="text-[10px] font-mono font-bold text-slate-500">Target: {chain.tier === 'L2' ? '<15 Gwei' : '10-100 Gwei'}</span>
          </div>
          <div className="h-48 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chain.history} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0e1626', borderColor: '#334155', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.4)' }}
                  labelStyle={{ fontSize: '9px', color: '#94a3b8', fontWeight: 'bold' }}
                  itemStyle={{ fontSize: '11px', color: '#818cf8', fontWeight: 'bold' }}
                />
                <Line
                  type="monotone"
                  dataKey="gasPrice"
                  stroke="#818cf8"
                  strokeWidth={2.5}
                  dot={{ r: 3, strokeWidth: 1 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Structural Metadata (Chain Properties) */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 shadow-3xs">
        <h4 className="text-slate-200 text-xs font-bold uppercase tracking-wider mb-3.5 flex items-center gap-1.5 font-display">
          <Info className="w-4 h-4 text-violet-400" />
          Ecosystem Profile & Technical Architecture
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4.5 bg-[#090d18] border border-slate-800/60 rounded-xl">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Consensus Method</span>
            <span className="text-xs font-semibold text-slate-300 mt-1 block">{chain.consensus}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Data Availability (DA)</span>
            <span className="text-xs font-semibold text-slate-300 mt-1 block">{chain.daLayer}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Execution Engine</span>
            <span className="text-xs font-semibold text-slate-300 mt-1 block">{chain.vmType}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Ecosystem Funding</span>
            <span className="text-xs font-bold text-violet-300 mt-1 block">{chain.funding}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
