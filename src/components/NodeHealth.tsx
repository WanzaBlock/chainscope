/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Chain, ValidatorNode } from '../types';
import { ShieldCheck, Server, AlertOctagon, Info, Sparkles, Signal, MapPin } from 'lucide-react';

interface NodeHealthProps {
  chain: Chain;
}

export default function NodeHealth({ chain }: NodeHealthProps) {
  const [topValidatorWeight, setTopValidatorWeight] = useState<number>(25); // percentage controlled by top 3 validators
  const [validatorCount, setValidatorCount] = useState<number>(chain.validators?.active || 50);

  const getStatusColor = (status: ValidatorNode['status']) => {
    switch (status) {
      case 'Online':
        return 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/60';
      case 'Syncing':
        return 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/60';
      case 'Offline':
        return 'text-red-400 bg-red-950/40 border border-red-800/60';
      case 'Jailed':
        return 'text-orange-400 bg-orange-950/40 border border-orange-850/65 animate-pulse';
      default:
        return 'text-slate-400 bg-slate-900 border border-slate-800';
    }
  };

  // Safe Math calculations for Attack Simulation
  const computeAttackProfile = () => {
    const totalPower = 100;
    const top3Power = topValidatorWeight;
    const remainingPower = totalPower - top3Power;
    
    let state = 'secure';
    let summaryText = 'Distribution is secure';
    let actionItem = 'Ideal decentralization bounds for early launch stability.';

    if (top3Power >= 51) {
      state = 'critical';
      summaryText = 'Critical: 51% Consensus Attack Risk!';
      actionItem = 'Top 3 validators can rewrite chain state, censor transactions, and trigger double-spend attacks unilaterally.';
    } else if (top3Power >= 33) {
      state = 'warning';
      summaryText = 'Halt Risk: 33% Liveness Threshold!';
      actionItem = '33% of validators colluding or dropping connection simultaneously can halt BFT-consensus block finality.';
    } else if (validatorCount < 15) {
      state = 'warning';
      summaryText = 'Centralization Concern: Low Active Nodes';
      actionItem = 'Fewer than 15 validator slots makes cheap off-chain coordination possible. Recruit more testnet participants.';
    }

    return { state, summaryText, actionItem };
  };

  const attackProfile = computeAttackProfile();

  return (
    <div className="space-y-6" id={`node-health-panel-${chain.id}`}>
      {/* Node Distribution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Validator Health list */}
        <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 md:col-span-2 flex flex-col h-[400px] shadow-3xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-display">
              <Server className="w-4 h-4 text-violet-400" />
              Live Validator Node Telemetry
            </h4>
            <span className="text-[10px] text-slate-405 font-mono font-bold">Sync: Stable</span>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2 pr-1">
            {!chain.validatorNodes || chain.validatorNodes.length === 0 ? (
              <div className="text-center py-10 text-slate-550 text-xs font-mono">
                No advanced node telemetry logs configured for {chain.name}. Custom registered chain is running simulated genesis nodes.
              </div>
            ) : (
              chain.validatorNodes.map((node) => (
                <div
                  key={node.id}
                  className="bg-[#121927] border border-slate-850 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 hover:bg-[#172134] transition-all shadow-3xs"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${node.status === 'Online' ? 'bg-emerald-500 animate-pulse' : node.status === 'Syncing' ? 'bg-cyan-500 animate-pulse' : 'bg-red-500'}`} />
                    <div>
                      <span className="text-xs font-bold text-slate-200">{node.name}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-450 font-mono mt-0.5">
                        <span className="flex items-center gap-0.5 font-sans font-medium text-slate-400">
                          <MapPin className="w-3 h-3 text-slate-500" /> {node.location}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span>Client: {node.version}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right shrink-0">
                    <div className="font-mono text-left sm:text-right">
                      <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">Height</span>
                      <span className="text-xs text-slate-350 font-bold">{node.blockHeight.toLocaleString()}</span>
                    </div>
                    <div className="font-mono text-left sm:text-right min-w-[50px]">
                      <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">Latency</span>
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-0.5 justify-end">
                        <Signal className={`w-3 h-3 ${node.ping < 50 ? 'text-emerald-500' : 'text-amber-500'}`} />
                        {node.ping > 0 ? `${node.ping}ms` : '—'}
                      </span>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 font-bold border rounded-full shrink-0 ${getStatusColor(node.status)}`}>
                      {node.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic Attack Simulator */}
        <div id="attack-simulator-panel" className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 flex flex-col h-[400px] overflow-hidden justify-between shadow-3xs">
          <div>
            <div className="flex items-center gap-1.5 text-slate-105 font-bold text-xs uppercase tracking-wider mb-2 font-display">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              Consensus Adversary Simulator
            </div>
            <p className="text-[11px] text-slate-400 leading-normal mb-4">
              Simulate adversarial scenarios to stress-test consensus thresholds and network centralization parameters:
            </p>

            <div className="space-y-4">
              {/* Slider 1 */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1.5 font-bold">
                  <span className="text-slate-450 font-medium font-sans">Top 3 Validator Stake</span>
                  <span className={`font-mono font-bold text-xs ${topValidatorWeight >= 51 ? 'text-red-400' : topValidatorWeight >= 33 ? 'text-amber-400' : 'text-violet-400'}`}>
                    {topValidatorWeight}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={topValidatorWeight}
                  onChange={(e) => setTopValidatorWeight(Number(e.target.value))}
                  className="w-full accent-violet-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer pointer-events-auto"
                />
              </div>

              {/* Slider 2 */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1.5 font-bold">
                  <span className="text-slate-450 font-medium font-sans">Active Node Pool</span>
                  <span className="text-slate-200 font-bold font-mono text-xs">{validatorCount} Nodes</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  value={validatorCount}
                  onChange={(e) => setValidatorCount(Number(e.target.value))}
                  className="w-full accent-violet-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer pointer-events-auto"
                />
              </div>
            </div>
          </div>

          {/* Adversary Verdict */}
          <div className={`mt-4 p-3 rounded-xl border flex flex-col text-xs leading-normal ${
            attackProfile.state === 'critical'
              ? 'bg-red-950/40 border-red-900 text-red-300'
              : attackProfile.state === 'warning'
              ? 'bg-amber-955/40 border-amber-900 text-amber-300'
              : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
          }`}>
            <div className="flex items-center gap-1.5 font-extrabold text-[11px] uppercase tracking-wide">
              <AlertOctagon className={`w-4 h-4 shrink-0 ${
                attackProfile.state === 'critical' ? 'text-red-400' : attackProfile.state === 'warning' ? 'text-amber-405' : 'text-emerald-400'
              }`} />
              {attackProfile.summaryText}
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium leading-relaxed">
              {attackProfile.actionItem}
            </p>
          </div>

          <div className="pt-3.5 border-t border-slate-800 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-[9px] text-slate-500 leading-snug font-medium">
              Evaluates secure thresholds of PoS consensus algorithms including PBFT and CometBFT.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
