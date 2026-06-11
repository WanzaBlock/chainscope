/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { INITIAL_CHAINS, TECHNICAL_GUIDELINES } from "./data";
import { Chain, AlertRule, AlertLog, AiReport } from "./types";
import ChainList from "./components/ChainList";
import MetricCharts from "./components/MetricCharts";
import NodeHealth from "./components/NodeHealth";
import AlertConfig from "./components/AlertConfig";
import AiAnalyst from "./components/AiAnalyst";
import {
  Bell,
  Activity,
  Brain,
  Server,
  Shield,
  Layers,
  HelpCircle,
  HardDrive,
  Network,
  GitMerge,
  ChevronDown,
} from "lucide-react";

export default function App() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [selectedChainId, setSelectedChainId] = useState<string>("monad");
  const [isSimulating, setIsSimulating] = useState(true);
  const [spikeChainId, setSpikeChainId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "telemetry" | "nodes" | "alerts" | "ai"
  >("telemetry");

  // Persistent Custom Chains, Alert Rules, Alert Logs, & Cached AI Reports
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>([]);
  const [cachedReports, setCachedReports] = useState<Record<string, AiReport>>(
    {},
  );
  const [showGlossary, setShowGlossary] = useState(false);

  // Initialize data on component mount
  useEffect(() => {
    // 1. Load chains (merge initial + custom storage / load full)
    const storedAll = localStorage.getItem("chainwatch_all_chains");
    let mergedChains: Chain[] = [];
    if (storedAll) {
      mergedChains = JSON.parse(storedAll);
    } else {
      const storedCustom = localStorage.getItem("chainwatch_custom_chains");
      const customChains: Chain[] = storedCustom
        ? JSON.parse(storedCustom)
        : [];
      mergedChains = [...INITIAL_CHAINS, ...customChains];
      localStorage.setItem(
        "chainwatch_all_chains",
        JSON.stringify(mergedChains),
      );
    }
    setChains(mergedChains);

    // 2. Load alert rules or set defaults
    const storedRules = localStorage.getItem("chainwatch_alert_rules");
    if (storedRules) {
      setAlertRules(JSON.parse(storedRules));
    } else {
      const defaultRules: AlertRule[] = [
        {
          id: "rule-1",
          chainId: "monad",
          metric: "gasPrice",
          condition: "above",
          value: 25,
          isActive: true,
          alertName: "Monad Gas Congestion",
        },
        {
          id: "rule-2",
          chainId: "berachain",
          metric: "gasPrice",
          condition: "above",
          value: 100,
          isActive: true,
          alertName: "Bera Gas Surge",
        },
        {
          id: "rule-3",
          chainId: "movement",
          metric: "tps",
          condition: "below",
          value: 80,
          isActive: true,
          alertName: "Movement Low Throughput",
        },
        {
          id: "rule-4",
          chainId: "megaeth",
          metric: "tps",
          condition: "above",
          value: 2000,
          isActive: true,
          alertName: "MegaETH Hyper TPS Check",
        },
      ];
      setAlertRules(defaultRules);
      localStorage.setItem(
        "chainwatch_alert_rules",
        JSON.stringify(defaultRules),
      );
    }

    // 3. Load alert logs
    const storedLogs = localStorage.getItem("chainwatch_alert_logs");
    if (storedLogs) {
      setAlertLogs(JSON.parse(storedLogs));
    }

    // 4. Load AI Reports
    const storedReports = localStorage.getItem("chainwatch_ai_reports");
    if (storedReports) {
      setCachedReports(JSON.parse(storedReports));
    }
  }, []);

  // Save changes to localStorage
  const saveAllChains = (updatedChains: Chain[]) => {
    localStorage.setItem(
      "chainwatch_all_chains",
      JSON.stringify(updatedChains),
    );
  };

  const handleAddChain = (newChain: Chain) => {
    const updated = [...chains, newChain];
    setChains(updated);
    saveAllChains(updated);
    setSelectedChainId(newChain.id);
  };

  const handleDeleteChain = (chainIdToDelete: string) => {
    const updated = chains.filter((c) => c.id !== chainIdToDelete);
    setChains(updated);
    saveAllChains(updated);
    if (selectedChainId === chainIdToDelete) {
      if (updated.length > 0) {
        setSelectedChainId(updated[0].id);
      } else {
        setSelectedChainId("");
      }
    }
  };

  const handleUpdateChain = (updatedChain: Chain) => {
    const updated = chains.map((c) =>
      c.id === updatedChain.id ? updatedChain : c,
    );
    setChains(updated);
    saveAllChains(updated);
  };

  const handleAddRule = (newRule: AlertRule) => {
    const updated = [newRule, ...alertRules];
    setAlertRules(updated);
    localStorage.setItem("chainwatch_alert_rules", JSON.stringify(updated));
  };

  const handleDeleteRule = (id: string) => {
    const updated = alertRules.filter((r) => r.id !== id);
    setAlertRules(updated);
    localStorage.setItem("chainwatch_alert_rules", JSON.stringify(updated));
  };

  const handleToggleRule = (id: string) => {
    const updated = alertRules.map((r) =>
      r.id === id ? { ...r, isActive: !r.isActive } : r,
    );
    setAlertRules(updated);
    localStorage.setItem("chainwatch_alert_rules", JSON.stringify(updated));
  };

  const handleClearLogs = () => {
    setAlertLogs([]);
    localStorage.removeItem("chainwatch_alert_logs");
  };

  const handleSaveReport = (chainId: string, report: AiReport) => {
    const updated = { ...cachedReports, [chainId]: report };
    setCachedReports(updated);
    localStorage.setItem("chainwatch_ai_reports", JSON.stringify(updated));
  };

  // Live Telemetry Simulation Engine Loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setChains((currentChains) => {
        const nextChains = currentChains.map((chain) => {
          // Compute raw telemetry metrics noise
          let tpsNoise = (Math.random() - 0.5) * (chain.tps * 0.1);
          let nextTps = Math.max(1.5, chain.tps + tpsNoise);

          // Handle custom simulated load injection
          if (spikeChainId === chain.id) {
            nextTps = chain.peakTps * (0.65 + Math.random() * 0.25);
          }

          let gasNoise = (Math.random() - 0.5) * (chain.gasPrice * 0.12);
          let nextGas = Math.max(1, Math.round(chain.gasPrice + gasNoise));

          // Simulate slight jitter in validator Heights and latencies
          const nextValidatorNodes = chain.validatorNodes?.map((node) => {
            let latencyNoise = (Math.random() - 0.5) * 6;
            let nextPing =
              node.status === "Online"
                ? Math.max(8, Math.round(node.ping + latencyNoise))
                : node.ping;
            let currentBlockHeight =
              node.status === "Online"
                ? node.blockHeight + 1
                : node.blockHeight;
            return {
              ...node,
              ping: nextPing,
              blockHeight: currentBlockHeight,
            };
          });

          // Prepend metrics history record
          const lastHistory = [...chain.history];
          if (lastHistory.length > 6) lastHistory.shift();
          const nextTimestamp = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          const nextHistory = [
            ...lastHistory,
            {
              timestamp: nextTimestamp,
              tps: nextTps,
              gasPrice: nextGas,
              blockTime: chain.blockTime,
              activeAddresses: chain.activeAddresses24h,
            },
          ];

          const updatedNodeChain = {
            ...chain,
            tps: nextTps,
            gasPrice: nextGas,
            history: nextHistory,
            validatorNodes: nextValidatorNodes,
          };

          // Check if metric overrides custom Alert rules
          const activeChainRules = alertRules.filter(
            (r) => r.chainId === chain.id && r.isActive,
          );
          activeChainRules.forEach((rule) => {
            let checkValue = 0;
            if (rule.metric === "tps") checkValue = nextTps;
            if (rule.metric === "gasPrice") checkValue = nextGas;
            if (rule.metric === "blockTime") checkValue = chain.blockTime;
            if (rule.metric === "activeAddresses")
              checkValue = chain.activeAddresses24h;

            const triggersAlert =
              rule.condition === "above"
                ? checkValue > rule.value
                : checkValue < rule.value;

            if (triggersAlert) {
              setAlertLogs((currentLogs) => {
                const isLogged = currentLogs.some(
                  (l) =>
                    l.metric === rule.metric.toUpperCase() &&
                    l.chainId === chain.id &&
                    l.timestamp === nextTimestamp,
                );
                if (isLogged) return currentLogs;

                const newLog: AlertLog = {
                  id: `log-${Date.now()}-${Math.random()}`,
                  chainId: chain.id,
                  chainName: chain.name,
                  metric: rule.metric.toUpperCase(),
                  value: Math.round(checkValue * 10) / 10,
                  limitValue: rule.value,
                  condition: rule.condition,
                  timestamp: nextTimestamp,
                  isRead: false,
                  severity:
                    rule.metric === "tps" && rule.condition === "below"
                      ? "critical"
                      : "warning",
                };
                const updatedLogs = [newLog, ...currentLogs].slice(0, 30);
                localStorage.setItem(
                  "chainwatch_alert_logs",
                  JSON.stringify(updatedLogs),
                );
                return updatedLogs;
              });
            }
          });

          return updatedNodeChain;
        });

        // Clear spike after application cycle
        if (spikeChainId) {
          setSpikeChainId(null);
        }

        return nextChains;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating, alertRules, spikeChainId]);

  const handleTriggerSpike = () => {
    setSpikeChainId(selectedChainId);
  };

  const selectedChain =
    chains.find((c) => c.id === selectedChainId) || chains[0];

  return (
    <div className="min-h-screen bg-[#0b111e] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] text-slate-200 flex flex-col antialiased font-sans">
      {/* Global Status Bar */}
      <div className="bg-violet-600 text-white font-mono text-[10px] py-1.5 px-4 flex justify-between select-none font-semibold tracking-wider">
        <span>● LIVE MONITOR ACTIVE: EARLY ECOSYSTEM FEEDS</span>
        <span>
          UTC CLOCK:{" "}
          {new Date().toISOString().replace("T", " ").substring(0, 19)}
        </span>
      </div>

      {/* Main Terminal Header */}
      <header
        className="border-b border-slate-800 bg-[#0e1626]/90 backdrop-blur-md p-5 pb-6 sticky top-0 z-40 shadow-xs"
        id="app-header"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-600 text-white rounded-xl shadow-lg shadow-violet-600/20">
              <Layers className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl text-slate-105 tracking-tight flex items-center gap-2">
                ChainWatch{" "}
                <span className="text-[10px] text-violet-350 bg-violet-950/60 border border-violet-800/80 px-2.5 py-0.5 rounded-full font-mono font-semibold">
                  Early Ecosystem L1/L2
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                Modern high-fidelity telemetry, adversarial risk modeling, and
                on-chain diagnostics node analyzer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="font-mono text-xs text-right hidden sm:block">
              <span className="block text-slate-500 text-[10px] uppercase font-semibold">
                Tracked Networks
              </span>
              <span className="font-bold text-slate-300 text-sm">
                {chains.length} Registered
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800 hidden sm:block" />
            <button
              id="glossary-toggle"
              onClick={() => setShowGlossary(!showGlossary)}
              className="px-4 py-2 text-xs border border-slate-800 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-200 font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer pointer-events-auto"
            >
              <HelpCircle className="w-4 h-4 text-violet-450 animate-pulse-slow" />
              Ecosystem Glossary
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Left Hand: Emerging Chains Registry list */}
        <section
          className="w-full lg:w-85 shrink-0 h-auto lg:h-[740px]"
          id="left-explorer-column"
        >
          <ChainList
            chains={chains}
            selectedChainId={selectedChainId}
            onSelectChain={setSelectedChainId}
            onAddChain={handleAddChain}
            onDeleteChain={handleDeleteChain}
            onUpdateChain={handleUpdateChain}
          />
        </section>

        {/* Right Hand: Interactive Tab-routed Viewports */}
        <section
          className="flex-1 flex flex-col h-auto lg:h-[740px] overflow-hidden"
          id="right-control-column"
        >
          {/* Tabs navigation row */}
          <div
            className="flex border-b border-slate-800 p-1 gap-2 bg-[#121927] rounded-xl max-w-md md:max-w-lg mb-4"
            id="tab-navigation-rails"
          >
            <button
              id="tab-telemetry"
              onClick={() => setActiveTab("telemetry")}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer select-none transition-all pointer-events-auto ${
                activeTab === "telemetry"
                  ? "bg-slate-800 text-violet-300 font-bold shadow-xs border border-slate-700/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Telemetry
            </button>

            <button
              id="tab-nodes"
              onClick={() => setActiveTab("nodes")}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer select-none transition-all pointer-events-auto ${
                activeTab === "nodes"
                  ? "bg-slate-800 text-violet-300 font-bold shadow-xs border border-slate-700/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              Node Health
            </button>

            <button
              id="tab-alerts"
              onClick={() => setActiveTab("alerts")}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer select-none transition-all pointer-events-auto ${
                activeTab === "alerts"
                  ? "bg-slate-800 text-violet-300 font-bold shadow-xs border border-slate-700/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              Guardrails
            </button>

            <button
              id="tab-ai"
              onClick={() => setActiveTab("ai")}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer select-none transition-all pointer-events-auto ${
                activeTab === "ai"
                  ? "bg-slate-800 text-violet-300 font-bold shadow-xs border border-slate-700/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              AI Risk Analyst
            </button>
          </div>

          {/* Tab Content Viewport wrapper */}
          <div className="flex-1 overflow-y-auto scrollbar-thin min-h-[480px]">
            {!selectedChain ? (
              <div className="flex flex-col items-center justify-center h-[400px] bg-[#0e1626] border border-slate-800 rounded-2xl p-8 text-slate-400 text-xs shadow-xs text-center space-y-4">
                <Layers className="w-8 h-8 text-slate-600 animate-pulse" />
                <div>
                  <span className="font-bold text-slate-200 text-sm block">
                    No Chains Registered
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block max-w-sm mx-auto">
                    Please click "Register" on the left explorer rail to track a
                    blockchain or reset your parameters.
                  </span>
                </div>
              </div>
            ) : (
              <>
                {activeTab === "telemetry" && (
                  <MetricCharts
                    chain={selectedChain}
                    isSimulating={isSimulating}
                    onToggleSimulation={() => setIsSimulating(!isSimulating)}
                    onTriggerSpike={handleTriggerSpike}
                  />
                )}

                {activeTab === "nodes" && <NodeHealth chain={selectedChain} />}

                {activeTab === "alerts" && (
                  <AlertConfig
                    chain={selectedChain}
                    rules={alertRules.filter(
                      (r) => r.chainId === selectedChainId,
                    )}
                    logs={alertLogs.filter(
                      (l) => l.chainId === selectedChainId,
                    )}
                    onAddRule={handleAddRule}
                    onDeleteRule={handleDeleteRule}
                    onToggleRule={handleToggleRule}
                    onClearLogs={handleClearLogs}
                  />
                )}

                {activeTab === "ai" && (
                  <AiAnalyst
                    chain={selectedChain}
                    cachedReports={cachedReports}
                    onSaveReport={handleSaveReport}
                  />
                )}
              </>
            )}
          </div>
        </section>
      </main>

      {/* Expandable Technical Glossary Drawer */}
      {showGlossary && (
        <section
          id="glossary-drawer"
          className="bg-[#0e1626] border-t border-slate-800 p-6 md:p-8 shadow-inner animate-in slide-in-from-bottom duration-300"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3 mb-6">
              <h3 className="font-display font-bold text-sm text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
                <HelpCircle className="w-4 h-4 text-violet-400" />
                Technical Architectural Terms & Risk Guidelines
              </h3>
              <button
                onClick={() => setShowGlossary(false)}
                className="text-xs text-slate-400 hover:text-slate-200 font-semibold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
              {TECHNICAL_GUIDELINES.map((guideline, index) => (
                <div
                  key={index}
                  className="space-y-2 p-4 bg-[#141d2f] border border-slate-800/80 rounded-xl shadow-xs"
                >
                  <header className="font-display font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
                    <span className="w-1.5 h-1.5 bg-violet-500 rounded-full shrink-0" />
                    {guideline.title}
                  </header>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    {guideline.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* InstitutionalFooter indicator */}
      <footer className="border-t border-slate-850 px-4 py-5 mt-auto bg-[#080d15] select-none text-[10px] text-slate-500 text-center font-mono">
        ChainWatch Diagnostic Terminal. All simulated metrics are dynamically
        generated under Cosmos-SDK, Parallel-EVM, and SVM BFT-consensus
        specifications.
      </footer>
    </div>
  );
}
