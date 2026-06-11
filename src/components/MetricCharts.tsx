/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Chain } from "../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  Flame,
  Clock,
  Play,
  Pause,
  Zap,
  DollarSign,
  Cpu,
  Network,
  Info,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRightLeft,
  GitBranch,
  Terminal,
  Layers,
  Star,
  TrendingUp,
  HelpCircle,
} from "lucide-react";
import { calculateSecurityStatus, calculateTrends } from "../utils/security";

interface MetricChartsProps {
  chain: Chain;
  allChains: Chain[];
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onTriggerSpike: () => void;
}

export default function MetricCharts({
  chain,
  allChains = [],
  isSimulating,
  onToggleSimulation,
  onTriggerSpike,
}: MetricChartsProps) {
  const [compareChainId, setCompareChainId] = useState<string>("");

  if (!chain) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-[#0e1626] border border-slate-800 rounded-2xl p-8 text-slate-400 text-xs shadow-xs text-center">
        Select an ecosystem sandbox from the tracking roster to inspect system
        telemetries.
      </div>
    );
  }

  // Calculate dynamic security vectors
  const security = calculateSecurityStatus(chain);
  const trends = calculateTrends(chain);
  const compareChain = allChains.find((c) => c.id === compareChainId);

  // Helper colors for risk labels
  const getRiskColor = (rating: string) => {
    switch (rating) {
      case "Low":
        return "text-emerald-400 bg-emerald-950/40 border border-emerald-900/40";
      case "Medium":
        return "text-amber-400 bg-amber-950/40 border border-amber-900/40";
      case "High":
        return "text-orange-400 bg-orange-950/40 border border-[#b25e04]/40";
      case "Critical":
        return "text-red-400 bg-red-950/40 border border-red-900/40 animate-pulse";
      default:
        return "text-slate-400 bg-slate-900";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "↑ Increasing":
        return "text-rose-400 font-bold";
      case "↓ Decreasing":
        return "text-emerald-400 font-bold";
      default:
        return "text-slate-400 font-medium";
    }
  };

  return (
    <div id={`chain-telemetry-panel-${chain.id}`} className="space-y-6">
      {/* Simulation Controls & Status Header */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-3xs">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSimulating ? "bg-violet-500" : "bg-slate-500"}`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${isSimulating ? "bg-violet-500" : "bg-slate-600"}`}
              ></span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">
              Environment Feed Status
            </span>
          </div>
          <h3 className="font-display font-bold text-white mt-1 text-sm md:text-base">
            Monitoring {chain.name} {chain.stage} telemetry feed
          </h3>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            id="btn-toggle-simulation"
            onClick={onToggleSimulation}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold shadow-2xs border transition-all cursor-pointer ${
              isSimulating
                ? "bg-[#121926] text-slate-200 border-slate-800 hover:bg-[#182335]"
                : "bg-violet-950/40 text-violet-300 border-violet-850 hover:bg-violet-950"
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
                ? "bg-violet-600 hover:bg-violet-700 text-white border-0"
                : "bg-[#121a2c] text-slate-500 border border-slate-800 cursor-not-allowed shadow-none"
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current text-white/90" />
            Inject Stress Load
          </button>
        </div>
      </div>

      {/* Numeric Live Dashboard metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-3xs transition-all">
          <div className="p-2.5 bg-violet-950/40 text-violet-400 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">
              Current TPS
            </span>
            <span className="text-base font-extrabold font-mono text-white mt-0.5 block">
              {chain.tps?.toFixed(1) || "0.0"}
            </span>
          </div>
        </div>

        <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-3xs transition-all">
          <div className="p-2.5 bg-violet-950/40 text-violet-400 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">
              Block Time
            </span>
            <span className="text-base font-extrabold font-mono text-white mt-0.5 block">
              {chain.blockTime}s
            </span>
          </div>
        </div>

        <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-3xs transition-all">
          <div className="p-2.5 bg-violet-950/40 text-violet-400 rounded-xl">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">
              Gas Price
            </span>
            <span className="text-base font-extrabold font-mono text-white mt-0.5 block">
              {chain.gasPrice} Gwei
            </span>
          </div>
        </div>

        <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-3xs transition-all">
          <div className="p-2.5 bg-violet-950/40 text-violet-400 rounded-xl">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">
              Active Nodes
            </span>
            <span className="text-base font-extrabold font-mono text-white mt-0.5 block">
              {chain.validators?.active}{" "}
              <span className="text-[11px] text-slate-500 font-medium font-sans">
                / {chain.validators?.total}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Standardized Security Audit Panel (Consistent Layout) */}
      <div
        className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 space-y-5 shadow-sm"
        id={`security-dashboard-${chain.id}`}
      >
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-400" />
            <h4 className="text-slate-200 text-sm font-bold uppercase tracking-wider font-display">
              Ecosystem Safety & Security Audit Panel
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Risk Assessment:</span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold tracking-wider uppercase ${getRiskColor(security.rating)}`}
            >
              {security.rating} Risk (Score {security.score})
            </span>
          </div>
        </div>

        {/* Dynamic Alerts (Anomaly Detector module) */}
        {security.anomalies.length > 0 && (
          <div
            className="bg-red-950/20 border border-red-900/40 rounded-xl p-3.5 space-y-2 animate-pulse"
            id="anomalies-box"
          >
            <div className="flex items-center gap-2 text-red-405 text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Detected Telemetry Anomalies
              </span>
            </div>
            <div className="space-y-1.5">
              {security.anomalies.map((anomaly, idx) => (
                <div
                  key={idx}
                  className="text-xs text-slate-305 text-slate-300 font-medium flex items-center gap-2 font-mono bg-red-950/15 p-1 px-2.5 rounded border border-red-900/10"
                >
                  <span className="text-red-400 shrink-0">•</span> {anomaly}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Primary Standardized Reporting Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Module 1: Deterministic Risk score & Exploit Likelihood */}
          <div className="md:col-span-4 space-y-4">
            <div className="bg-[#090d18] border border-slate-850 rounded-xl p-4.5 space-y-3">
              <div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>Risk Score</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.2 rounded ${getRiskColor(security.rating)}`}
                  >
                    {security.rating}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-extrabold text-white font-mono">
                    {security.score}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    / 100
                  </span>
                </div>
                <p className="text-[9.5px] text-slate-500 font-medium mt-1 leading-normal">
                  Sum of weighted risk factors (capped at 100). scale:
                  <br />
                  <span className="font-semibold text-emerald-400">
                    0–30 Low
                  </span>{" "}
                  |{" "}
                  <span className="font-semibold text-amber-400">
                    31–60 Medium
                  </span>{" "}
                  |{" "}
                  <span className="font-semibold text-red-400">
                    61–100 High
                  </span>
                </p>
              </div>

              <div className="border-t border-slate-800/60 pt-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Exploit Likelihood
                </span>
                <span className="text-3xl font-extrabold text-[#fbbf24] font-mono mt-0.5 block">
                  {security.exploitLikelihood}%
                </span>

                {/* Dynamically formulated Drivers to explain probability */}
                <div className="mt-2 space-y-1 bg-[#121926]/40 p-2.5 rounded-lg border border-slate-850">
                  <span className="text-[8.5px] text-yellow-450 text-amber-500 font-bold uppercase tracking-wider block">
                    Key Vulnerability Drivers:
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-[9.5px] text-slate-400 font-sans leading-normal">
                    {security.exploitDrivers.map((driver, idx) => (
                      <li key={idx}>
                        <span className="font-medium text-slate-300">
                          {driver}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Module 2: Security summaries, Verdicts & Trends */}
          <div className="md:col-span-4 space-y-4">
            {/* Security Verdict Block */}
            <div className="bg-[#090d18] border border-slate-850 rounded-xl p-4.5 space-y-2">
              <span className="text-[10px] text-violet-400 font-bold tracking-wider uppercase block">
                Security Decision Verdict
              </span>
              <p className="text-xs font-bold text-slate-200 bg-violet-950/20 p-2 rounded border border-violet-900/20">
                {security.verdict}
              </p>

              <div className="pt-1.5 space-y-1">
                <span className="text-[10px] text-slate-450 text-slate-405 font-bold uppercase tracking-wider block">
                  Security Summary
                </span>
                <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                  {security.summary}
                </p>
              </div>
            </div>

            {/* Dynamic Confidence Score & Trend Block */}
            <div className="bg-[#090d18] border border-slate-850 rounded-xl p-4 flex flex-col justify-between space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span className="text-slate-400">Confidence Score:</span>
                <span className="text-violet-400 text-xs font-mono font-bold bg-violet-950/30 px-1.5 py-0.2 rounded border border-violet-900/20">
                  {security.confidenceScore}%
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">
                Reasoning:{" "}
                <span className="text-slate-300 font-medium">
                  {security.confidenceReason}
                </span>
              </p>

              <div className="border-t border-slate-800/60 pt-2 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span className="text-slate-400">Risk Trend Indicator:</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded uppercase ${getTrendColor(security.riskTrend)}`}
                >
                  {security.riskTrend}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">
                Reason:{" "}
                <span className="text-slate-300 font-medium">
                  {security.riskTrendReason}
                </span>
              </p>
            </div>
          </div>

          {/* Module 3: Grouped Risk factors breakdown (Positive vs Negatives) */}
          <div
            className="md:col-span-4 space-y-3"
            id="explainability-breakdown"
          >
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-violet-400" />
              Explainable Attribution Signals
            </span>

            <div className="bg-[#090d18] border border-slate-850 rounded-xl p-4 space-y-3.5 max-h-[295px] overflow-y-auto scrollbar-thin">
              {/* Part 1: Defenses & Positive Signals (Risk Reductions) */}
              <div className="space-y-1.5">
                <span className="text-[8.5px] text-emerald-400 font-black uppercase tracking-wider block">
                  Positive Signals (Risk Reduction / Defenses)
                </span>
                {security.positiveSignals.length === 0 ? (
                  <div className="text-[10px] text-slate-500 italic">
                    No offsets or standard defense protections verified.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {security.positiveSignals.map((signal, idx) => (
                      <div
                        key={idx}
                        className="bg-emerald-950/15 p-2 rounded border border-emerald-900/10 text-[9.5px]"
                      >
                        <span className="font-bold text-emerald-400 block">
                          {signal.label}
                        </span>
                        <span className="text-slate-300 font-sans leading-normal block mt-0.5">
                          {signal.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Part 2: System Deficiencies & Penalties (Risk Factors) */}
              <div className="space-y-1.5 border-t border-slate-850 pt-2.5">
                <span className="text-[8.5px] text-rose-450 text-rose-400 font-black uppercase tracking-wider block">
                  Risk Factors (Vulnerabilities / Penalties)
                </span>
                {security.breakdown.length === 0 ? (
                  <div className="text-[10px] text-slate-500 italic">
                    No outstanding risk factors identified.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {security.breakdown.map((factor, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-[10px] py-1 border-b border-slate-850/30 last:border-0 font-medium"
                      >
                        <span className="text-slate-300">{factor.label}</span>
                        <span className="text-rose-400 font-mono font-bold shrink-0 bg-rose-950/15 px-1 rounded">
                          +{factor.points} Risk
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Attack Surface Analysis sub-deck (Correct Terminology) */}
        <div className="border-t border-slate-800/80 pt-4.5 space-y-3">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            Attack Surface Analysis
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Decentralization Indicator */}
            <div className="bg-[#090d18] border border-slate-850 rounded-xl p-3.5 flex flex-col">
              <span className="text-[9px] text-slate-405 text-slate-450 uppercase font-mono font-bold">
                Consensus Decentralization
              </span>
              <span className="text-xs font-bold text-slate-200 mt-1">
                {chain.validators?.active} active validator nodes
              </span>
              <span className="text-[10px] text-slate-405 text-slate-500 mt-0.5 leading-snug">
                {chain.validators?.active >= 100
                  ? "Strong consensus validation offset. Minimal collusion threat."
                  : chain.validators?.active >= 35
                    ? "Limited decentralization; moderate validator coordination risk."
                    : "Collusive consensus sequencer vulnerabilities are highly active."}
              </span>
            </div>

            {/* Smart Upgradeability Indicator */}
            <div className="bg-[#090d18] border border-slate-850 rounded-xl p-3.5 flex flex-col">
              <span className="text-[9px] text-slate-450 uppercase font-mono font-bold font-sans">
                Smart Contract Governance
              </span>
              {(() => {
                const percent =
                  (chain as any).upgradeableContractsPercent !== undefined
                    ? (chain as any).upgradeableContractsPercent
                    : chain.stage === "Devnet"
                      ? 90
                      : chain.stage === "Testnet"
                        ? 70
                        : 40;
                return (
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-200 font-mono">
                      <span>{percent}% admin proxy keys</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${percent > 75 ? "bg-red-400" : percent > 45 ? "bg-amber-400" : "bg-emerald-400"}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <span className="text-[9.5px] text-slate-500 block leading-tight mt-1">
                      {percent > 75
                        ? "High upgrade power introduces potential developer administrative exploitation vectors."
                        : "Low admin upgrade powers; reduced administrative keys drift."}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Bridges Indicator */}
            <div className="bg-[#090d18] border border-slate-850 rounded-xl p-3.5 flex flex-col">
              <span className="text-[9px] text-slate-405 text-slate-450 uppercase font-mono font-bold">
                Bridges Exposure
              </span>
              {(() => {
                const hasBridge =
                  chain.id === "monad" ||
                  chain.id === "berachain" ||
                  chain.id === "movement" ||
                  chain.id === "eclipse" ||
                  (chain as any).bridgePresence === "Yes";
                return (
                  <>
                    <span
                      className={`text-xs font-bold mt-1 ${hasBridge ? "text-amber-400" : "text-emerald-400"}`}
                    >
                      {hasBridge
                        ? "Active (Native Lock/Mint Asset custodian)"
                        : "No Core Bridges Configured"}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 leading-snug">
                      {hasBridge
                        ? "⚠️ Continuous risk of smart contract cross-chain bridging hacks."
                        : "🛡️ Zero external system asset exit risk vectors."}
                    </span>
                  </>
                );
              })()}
            </div>

            {/* Simplified and Clean Oracle Section */}
            <div className="bg-[#090d18] border border-slate-850 rounded-xl p-3.5 flex flex-col">
              <span className="text-[9px] text-slate-450 uppercase font-mono font-bold">
                Oracle Feeds Dependency
              </span>
              {(() => {
                const dep =
                  (chain as any).oracleDependencies ||
                  (chain.vmType === "SVM" ? "Pyth" : "Chainlink");
                const isIndustry =
                  dep === "Chainlink" ||
                  dep === "Pyth" ||
                  dep === "Pyth Network";
                return (
                  <>
                    <span
                      className={`text-xs font-bold mt-1 ${isIndustry ? "text-emerald-400" : "text-amber-400"}`}
                    >
                      Oracle: {dep}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 leading-snug">
                      {isIndustry
                        ? "Risk: Low (industry standard, decentralized feeds)."
                        : "Risk: Moderate (custom native or restricted data dependencies)."}
                    </span>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TPS Chart */}
        <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 flex flex-col shadow-3xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-display text-slate-200">
              <Activity className="w-4 h-4 text-violet-400" />
              Throughput (TPS Rate)
            </h4>
            <span className="text-[10px] font-mono font-bold text-slate-500">
              Peak Cap: {chain.peakTps} TPS
            </span>
          </div>
          <div className="h-48 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chain.history}
                margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  stroke="#64748b"
                  fontSize={9}
                  tickLine={false}
                />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0e1626",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.4)",
                  }}
                  labelStyle={{
                    fontSize: "9px",
                    color: "#94a3b8",
                    fontWeight: "bold",
                  }}
                  itemStyle={{
                    fontSize: "11px",
                    color: "#a78bfa",
                    fontWeight: "bold",
                  }}
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
            <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-display text-slate-200">
              <Flame className="w-4 h-4 text-violet-400" />
              Gas price range (Gwei)
            </h4>
            <span className="text-[10px] font-mono font-bold text-slate-500 font-sans">
              Target: {chain.tier === "L2" ? "<15 Gwei" : "10-100 Gwei"}
            </span>
          </div>
          <div className="h-48 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chain.history}
                margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  stroke="#64748b"
                  fontSize={9}
                  tickLine={false}
                />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0e1626",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.4)",
                  }}
                  labelStyle={{
                    fontSize: "9px",
                    color: "#94a3b8",
                    fontWeight: "bold",
                  }}
                  itemStyle={{
                    fontSize: "11px",
                    color: "#818cf8",
                    fontWeight: "bold",
                  }}
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

      {/* Side-by-Side Ecosystem Comparison Deck */}
      <div
        className="bg-[#0e1626] border border-[#1e293b] rounded-2xl p-5 shadow-sm space-y-4"
        id="comparison-deck"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3.5">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4.5 h-4.5 text-violet-400" />
            <h4 className="text-slate-200 text-xs font-bold uppercase tracking-wider font-display">
              Ecosystem Cross-Comparison Engine
            </h4>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-405 text-slate-400 font-medium">
              Compare {chain.name} with:
            </span>
            <select
              value={compareChainId}
              onChange={(e) => setCompareChainId(e.target.value)}
              className="bg-[#121926] border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-violet-500 shadow-3xs cursor-pointer"
            >
              <option value="">-- Choose Ecosystem --</option>
              {allChains
                .filter((c) => c.id !== chain.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.stage})
                  </option>
                ))}
            </select>
          </div>
        </div>

        {!compareChain ? (
          <div className="py-8 bg-[#090d18] rounded-xl flex items-center justify-center text-xs text-slate-500 gap-2 border border-slate-850/60 border-dashed">
            <Info className="w-4 h-4 text-slate-600" />
            Select another active sandbox on the dropdown above to load
            real-time side-by-side telemetry audits.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-850 bg-[#090d18] scrollbar-thin">
            <table className="w-full text-left border-collapse text-xs font-medium">
              <thead>
                <tr className="bg-[#121926]/65 border-b border-slate-850 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                  <th className="p-3.5 pl-4">Security Audits</th>
                  <th className="p-3.5 bg-violet-950/15 text-violet-300">
                    {chain.name} (Active view)
                  </th>
                  <th className="p-3.5">{compareChain.name} (Comparison)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/50">
                <tr>
                  <td className="p-3.5 pl-4 text-slate-205 text-slate-200 bg-[#0c1221]/50 font-bold">
                    Consensus Model
                  </td>
                  <td className="p-3.5 bg-violet-950/5 text-slate-300 font-medium">
                    {chain.consensus}
                  </td>
                  <td className="p-3.5 text-slate-300">
                    {compareChain.consensus}
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 pl-4 text-slate-200 bg-[#0c1221]/50 font-bold font-sans">
                    Deterministic Risk Score
                  </td>
                  <td className="p-3.5 bg-violet-950/5 font-mono text-sm">
                    <span className="font-bold text-white block">
                      {calculateSecurityStatus(chain).score} / 100
                    </span>
                    <span
                      className={`text-[10px] font-bold ${getRiskColor(calculateSecurityStatus(chain).rating)} rounded-full px-2 py-0.2 mt-1 inline-block`}
                    >
                      {calculateSecurityStatus(chain).rating} Risk
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-sm">
                    <span className="font-bold text-white block">
                      {calculateSecurityStatus(compareChain).score} / 100
                    </span>
                    <span
                      className={`text-[10px] font-bold ${getRiskColor(calculateSecurityStatus(compareChain).rating)} rounded-full px-2 py-0.2 mt-1 inline-block`}
                    >
                      {calculateSecurityStatus(compareChain).rating} Risk
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 pl-4 text-slate-200 bg-[#0c1221]/50 font-bold font-sans">
                    Exploit Likelihood Score
                  </td>
                  <td className="p-3.5 bg-violet-950/5 font-mono text-[#fbbf24] font-bold text-sm">
                    {calculateSecurityStatus(chain).exploitLikelihood}%
                  </td>
                  <td className="p-3.5 font-mono text-[#fbbf24] font-bold text-sm">
                    {calculateSecurityStatus(compareChain).exploitLikelihood}%
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 pl-4 text-slate-200 bg-[#0c1221]/50 font-bold font-sans">
                    Confidence Index
                  </td>
                  <td className="p-3.5 bg-violet-950/5 font-mono text-slate-300 font-bold">
                    {calculateSecurityStatus(chain).confidenceScore}%
                  </td>
                  <td className="p-3.5 font-mono text-slate-300 font-bold">
                    {calculateSecurityStatus(compareChain).confidenceScore}%
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 pl-4 text-slate-200 bg-[#0c1221]/50 font-bold font-sans">
                    Confidence Reason
                  </td>
                  <td className="p-3.5 bg-violet-950/5 text-slate-400 font-sans leading-normal">
                    {calculateSecurityStatus(chain).confidenceReason}
                  </td>
                  <td className="p-3.5 text-slate-400 font-sans leading-normal">
                    {calculateSecurityStatus(compareChain).confidenceReason}
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 pl-4 text-slate-200 bg-[#0c1221]/50 font-bold font-sans">
                    Risk Trend
                  </td>
                  <td
                    className={`p-3.5 bg-violet-950/5 font-mono font-bold ${getTrendColor(calculateSecurityStatus(chain).riskTrend)}`}
                  >
                    {calculateSecurityStatus(chain).riskTrend}
                  </td>
                  <td
                    className={`p-3.5 font-mono font-bold ${getTrendColor(calculateSecurityStatus(compareChain).riskTrend)}`}
                  >
                    {calculateSecurityStatus(compareChain).riskTrend}
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 pl-4 text-slate-200 bg-[#0c1221]/50 font-bold font-sans">
                    Active Validators
                  </td>
                  <td className="p-3.5 bg-violet-950/5 font-mono font-bold text-white">
                    {chain.validators?.active} units
                  </td>
                  <td className="p-3.5 font-mono font-bold text-white">
                    {compareChain.validators?.active} units
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 pl-4 text-slate-200 bg-[#0c1221]/50 font-bold font-sans">
                    Smart Admin Upgradeability
                  </td>
                  <td className="p-3.5 bg-violet-950/5 font-mono font-bold">
                    {(chain as any).upgradeableContractsPercent !== undefined
                      ? (chain as any).upgradeableContractsPercent
                      : chain.stage === "Devnet"
                        ? 90
                        : chain.stage === "Testnet"
                          ? 70
                          : 40}
                    %
                  </td>
                  <td className="p-3.5 font-mono font-bold">
                    {(compareChain as any).upgradeableContractsPercent !==
                    undefined
                      ? (compareChain as any).upgradeableContractsPercent
                      : compareChain.stage === "Devnet"
                        ? 90
                        : compareChain.stage === "Testnet"
                          ? 70
                          : 40}
                    %
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 pl-4 text-slate-200 bg-[#0c1221]/50 font-bold font-sans">
                    Active Bridges presence
                  </td>
                  <td className="p-3.5 bg-violet-950/5">
                    {chain.id === "monad" ||
                    chain.id === "berachain" ||
                    chain.id === "movement" ||
                    chain.id === "eclipse" ||
                    (chain as any).bridgePresence === "Yes"
                      ? "⚠️ Yes (Lock/Mint contracts)"
                      : "🛡️ No"}
                  </td>
                  <td className="p-3.5">
                    {compareChain.id === "monad" ||
                    compareChain.id === "berachain" ||
                    compareChain.id === "movement" ||
                    compareChain.id === "eclipse" ||
                    (compareChain as any).bridgePresence === "Yes"
                      ? "⚠️ Yes (Lock/Mint contracts)"
                      : "🛡️ No"}
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 pl-4 text-slate-200 bg-[#0c1221]/50 font-bold font-sans">
                    Oracle Feeds Feed
                  </td>
                  <td className="p-3.5 bg-violet-950/5 font-sans">
                    {(chain as any).oracleDependencies ||
                      (chain.vmType === "SVM" ? "Pyth Network" : "Chainlink")}
                  </td>
                  <td className="p-3.5 font-sans">
                    {(compareChain as any).oracleDependencies ||
                      (compareChain.vmType === "SVM"
                        ? "Pyth Network"
                        : "Chainlink")}
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 pl-4 text-slate-200 bg-[#0c1221]/50 font-bold">
                    Current Live TPS
                  </td>
                  <td className="p-3.5 bg-violet-950/5 font-mono text-violet-400 font-bold">
                    {chain.tps?.toFixed(1)}
                  </td>
                  <td className="p-3.5 font-mono text-violet-400 font-bold">
                    {compareChain.tps?.toFixed(1)}
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 pl-4 text-slate-200 bg-[#0c1221]/50 font-bold">
                    Current Gas Price
                  </td>
                  <td className="p-3.5 bg-violet-950/5 font-mono font-bold text-white">
                    {chain.gasPrice} Gwei
                  </td>
                  <td className="p-3.5 font-mono font-bold text-white">
                    {compareChain.gasPrice} Gwei
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 pl-4 text-slate-200 bg-[#0c1221]/50 font-bold">
                    VC Funding Backing
                  </td>
                  <td className="p-3.5 bg-violet-950/5 font-bold text-violet-300">
                    {chain.funding}
                  </td>
                  <td className="p-3.5 font-bold text-violet-300">
                    {compareChain.funding}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
