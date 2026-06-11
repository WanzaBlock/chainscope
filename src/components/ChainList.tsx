/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Chain, ChainTier, ChainStage, VmType, RiskRating } from "../types";
import {
  Layers,
  Cpu,
  Compass,
  Plus,
  SlidersHorizontal,
  AlertTriangle,
  ExternalLink,
  Globe,
  Github,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

interface ChainListProps {
  chains: Chain[];
  selectedChainId: string;
  onSelectChain: (id: string) => void;
  onAddChain: (newChain: Chain) => void;
  onDeleteChain: (id: string) => void;
  onUpdateChain: (updatedChain: Chain) => void;
}

export default function ChainList({
  chains,
  selectedChainId,
  onSelectChain,
  onAddChain,
  onDeleteChain,
  onUpdateChain,
}: ChainListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(
    null,
  );

  // State for editing chain
  const [editingChain, setEditingChain] = useState<Chain | null>(null);
  const [editName, setEditName] = useState("");
  const [editTier, setEditTier] = useState<ChainTier>("L2");
  const [editStage, setEditStage] = useState<ChainStage>("Testnet");
  const [editVm, setEditVm] = useState<VmType>("Parallel EVM");
  const [editConsensus, setEditConsensus] = useState("");
  const [editDa, setEditDa] = useState("");
  const [editFunding, setEditFunding] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editGithub, setEditGithub] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editRisk, setEditRisk] = useState<RiskRating>("High");
  const [editBlockTime, setEditBlockTime] = useState(1.5);
  const [editCommits, setEditCommits] = useState(12);
  const [editPeakTps, setEditPeakTps] = useState(1000);
  const [filterTier, setFilterTier] = useState<string>("All");
  const [filterStage, setFilterStage] = useState<string>("All");
  const [filterVm, setFilterVm] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Form states for adding custom chain
  const [newChainName, setNewChainName] = useState("");
  const [newChainTier, setNewChainTier] = useState<ChainTier>("L2");
  const [newChainStage, setNewChainStage] = useState<ChainStage>("Testnet");
  const [newChainVm, setNewChainVm] = useState<VmType>("Parallel EVM");
  const [newChainConsensus, setNewChainConsensus] = useState("");
  const [newChainDa, setNewChainDa] = useState("");
  const [newChainFunding, setNewChainFunding] = useState("");
  const [newChainDesc, setNewChainDesc] = useState("");
  const [newChainGithub, setNewChainGithub] = useState("");
  const [newChainWebsite, setNewChainWebsite] = useState("");

  const handleCreateChain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChainName.trim()) return;

    const newId = newChainName.toLowerCase().replace(/\s+/g, "-");
    const customChain: Chain = {
      id: newId,
      name: newChainName,
      tier: newChainTier,
      stage: newChainStage,
      vmType: newChainVm,
      consensus: newChainConsensus || "Delegated Proof of Stake",
      daLayer: newChainDa || "Self-hosted Protocol Core",
      funding: newChainFunding || "Bootstrapped Devnet",
      description:
        newChainDesc ||
        "Early stage chain registration under simulation telemetry.",
      tps: 15,
      avgTps: 15,
      peakTps: 1000,
      blockTime: 1.5,
      gasPrice: 10,
      validators: {
        active: 10,
        total: 10,
      },
      commitsPerWeek: 12,
      activeAddresses24h: 3400,
      riskRating: "High",
      explorerUrl: "",
      githubUrl: newChainGithub || "https://github.com",
      website: newChainWebsite || "https://example.org",
      isCustom: true,
      history: [
        {
          timestamp: "18:00",
          tps: 15,
          gasPrice: 10,
          blockTime: 1.5,
          activeAddresses: 3400,
        },
      ],
      validatorNodes: [
        {
          id: `${newId}-node-1`,
          name: "Genesis-Custom-HQ",
          status: "Online",
          ping: 45,
          stake: 50,
          version: "v0.0.1-dev",
          blockHeight: 102,
          location: "Dublin, IE",
        },
        {
          id: `${newId}-node-2`,
          name: "Community-Node-2",
          status: "Syncing",
          ping: 110,
          stake: 50,
          version: "v0.0.1-dev",
          blockHeight: 90,
          location: "Virginia, US",
        },
      ],
    };

    onAddChain(customChain);
    setShowAddForm(false);

    // Reset Form
    setNewChainName("");
    setNewChainConsensus("");
    setNewChainDa("");
    setNewChainFunding("");
    setNewChainDesc("");
    setNewChainGithub("");
    setNewChainWebsite("");
  };

  const handleStartEdit = (chain: Chain) => {
    setEditingChain(chain);
    setEditName(chain.name);
    setEditTier(chain.tier);
    setEditStage(chain.stage);
    setEditVm(chain.vmType);
    setEditConsensus(chain.consensus);
    setEditDa(chain.daLayer);
    setEditFunding(chain.funding);
    setEditDesc(chain.description);
    setEditGithub(chain.githubUrl || "");
    setEditWebsite(chain.website || "");
    setEditRisk(chain.riskRating);
    setEditBlockTime(chain.blockTime || 1.5);
    setEditCommits(chain.commitsPerWeek || 12);
    setEditPeakTps(chain.peakTps || 1000);
    setShowAddForm(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChain || !editName.trim()) return;

    const updatedChain: Chain = {
      ...editingChain,
      name: editName,
      tier: editTier,
      stage: editStage,
      vmType: editVm,
      consensus: editConsensus || "Delegated Proof of Stake",
      daLayer: editDa || "Self-hosted Protocol Core",
      funding: editFunding || "Ecosystem Native Integration",
      description: editDesc || "Ecosystem under security tracking.",
      githubUrl: editGithub || "https://github.com",
      website: editWebsite || "https://example.org",
      riskRating: editRisk,
      blockTime: editBlockTime,
      commitsPerWeek: editCommits,
      peakTps: editPeakTps,
    };

    onUpdateChain(updatedChain);
    setEditingChain(null);
  };

  // Filter chains based on search and parameters
  const filteredChains = chains.filter((c) => {
    const queryMatch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const tierMatch = filterTier === "All" || c.tier === filterTier;
    const stageMatch = filterStage === "All" || c.stage === filterStage;
    const vmMatch = filterVm === "All" || c.vmType === filterVm;
    return queryMatch && tierMatch && stageMatch && vmMatch;
  });

  const getRiskLabelColor = (rating: string) => {
    switch (rating) {
      case "Low":
        return "bg-emerald-950/40 text-emerald-450 border border-emerald-800/60";
      case "Medium":
        return "bg-amber-950/40 text-amber-450 border border-amber-800/60";
      case "High":
        return "bg-orange-950/40 text-orange-450 border border-orange-800/60";
      case "Critical":
        return "bg-red-950/40 text-red-450 border border-red-800/60 animate-pulse";
      default:
        return "bg-slate-900 text-slate-400 border border-slate-800";
    }
  };

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case "Devnet":
        return "bg-cyan-950/40 text-cyan-400 border border-cyan-800/60";
      case "Testnet":
        return "bg-violet-950/40 text-violet-350 border border-violet-850/60";
      case "Early Mainnet":
        return "bg-emerald-950/40 text-[#10b981] border border-emerald-850/60";
      default:
        return "bg-slate-900 text-slate-400 border border-slate-800";
    }
  };

  return (
    <div
      id="chain-explorer-section"
      className="flex flex-col bg-[#0e1626] border border-slate-800 rounded-2xl h-full overflow-hidden shadow-xs"
    >
      {/* Header */}
      <div className="p-4.5 border-b border-slate-800 flex items-center justify-between bg-[#121a2a]">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-violet-400" id="explorer-icon" />
          <h2 className="font-display font-bold text-slate-100 text-sm">
            Emerging Ecosystems
          </h2>
        </div>
        <button
          id="btn-register-chain"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 shadow-xs shadow-violet-600/10 transition-colors pointer-events-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Register
        </button>
      </div>

      {/* Registration Form Overlay */}
      {showAddForm && (
        <div
          id="registration-modal"
          className="p-4 bg-[#141e30] border-b border-slate-800 max-h-[360px] overflow-y-auto scrollbar-thin"
        >
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-slate-100 text-xs font-bold uppercase tracking-wider">
              Register a New Ecosystem
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-200 text-[11px] font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleCreateChain} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  Chain Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monad"
                  value={newChainName}
                  onChange={(e) => setNewChainName(e.target.value)}
                  className="w-full bg-[#1e293b] border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  Virtual Machine
                </label>
                <select
                  value={newChainVm}
                  onChange={(e) => setNewChainVm(e.target.value as VmType)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs"
                >
                  <option value="Parallel EVM">Parallel EVM</option>
                  <option value="EVM">EVM</option>
                  <option value="SVM">SVM</option>
                  <option value="MoveVM">MoveVM</option>
                  <option value="WASM">WASM</option>
                  <option value="Custom">Custom Architecture</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  Architecture Tier
                </label>
                <select
                  value={newChainTier}
                  onChange={(e) => setNewChainTier(e.target.value as ChainTier)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs"
                >
                  <option value="L1">Layer-1 (L1)</option>
                  <option value="L2">Layer-2 Rollup (L2)</option>
                  <option value="L3">Layer-3 (L3 Appchain)</option>
                  <option value="Rollapp">Rollapp</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  Deployment Stage
                </label>
                <select
                  value={newChainStage}
                  onChange={(e) =>
                    setNewChainStage(e.target.value as ChainStage)
                  }
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs"
                >
                  <option value="Devnet">Devnet</option>
                  <option value="Testnet">Testnet</option>
                  <option value="Early Mainnet">Early Mainnet</option>
                  <option value="Design Space">
                    Design (No Live Telemetry)
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  Consensus
                </label>
                <input
                  type="text"
                  placeholder="e.g. CometBFT"
                  value={newChainConsensus}
                  onChange={(e) => setNewChainConsensus(e.target.value)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  Data Availability (DA)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Celestia"
                  value={newChainDa}
                  onChange={(e) => setNewChainDa(e.target.value)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  VC Funding
                </label>
                <input
                  type="text"
                  placeholder="e.g. $10M raised"
                  value={newChainFunding}
                  onChange={(e) => setNewChainFunding(e.target.value)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  GitHub Endpoint
                </label>
                <input
                  type="text"
                  placeholder="GitHub URL"
                  value={newChainGithub}
                  onChange={(e) => setNewChainGithub(e.target.value)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                Ecosystem Description
              </label>
              <textarea
                placeholder="Briefly detail what makes this early blockchain unique..."
                value={newChainDesc}
                onChange={(e) => setNewChainDesc(e.target.value)}
                className="w-full h-14 bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs resize-none placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-violet-605 text-white bg-violet-600 hover:bg-violet-700 text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Add to Ecosystem Tracker
            </button>
          </form>
        </div>
      )}

      {/* Edit Form Overlay */}
      {editingChain && (
        <div
          id="editing-modal"
          className="p-4 bg-[#141e30] border-b border-slate-800 max-h-[360px] overflow-y-auto scrollbar-thin"
        >
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-slate-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Pencil className="w-3.5 h-3.5 text-violet-400" />
              Edit Ecosystem: {editingChain.name}
            </h3>
            <button
              onClick={() => setEditingChain(null)}
              className="text-slate-400 hover:text-slate-200 text-[11px] font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleSaveEdit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  Chain Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monad"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#1e293b] border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  Virtual Machine
                </label>
                <select
                  value={editVm}
                  onChange={(e) => setEditVm(e.target.value as VmType)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs"
                >
                  <option value="Parallel EVM">Parallel EVM</option>
                  <option value="EVM">EVM</option>
                  <option value="SVM">SVM</option>
                  <option value="MoveVM">MoveVM</option>
                  <option value="WASM">WASM</option>
                  <option value="Custom">Custom Architecture</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  Architecture Tier
                </label>
                <select
                  value={editTier}
                  onChange={(e) => setEditTier(e.target.value as ChainTier)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs"
                >
                  <option value="L1">Layer-1 (L1)</option>
                  <option value="L2">Layer-2 Rollup (L2)</option>
                  <option value="L3">Layer-3 (L3 Appchain)</option>
                  <option value="Rollapp">Rollapp</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  Deployment Stage
                </label>
                <select
                  value={editStage}
                  onChange={(e) => setEditStage(e.target.value as ChainStage)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs"
                >
                  <option value="Devnet">Devnet</option>
                  <option value="Testnet">Testnet</option>
                  <option value="Early Mainnet">Early Mainnet</option>
                  <option value="Design Space">
                    Design (No Live Telemetry)
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  Consensus
                </label>
                <input
                  type="text"
                  placeholder="e.g. CometBFT"
                  value={editConsensus}
                  onChange={(e) => setEditConsensus(e.target.value)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  Data Availability (DA)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Celestia"
                  value={editDa}
                  onChange={(e) => setEditDa(e.target.value)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  Risk Rating
                </label>
                <select
                  value={editRisk}
                  onChange={(e) => setEditRisk(e.target.value as RiskRating)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs"
                >
                  <option value="Low">Low Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="High">High Risk</option>
                  <option value="Critical">Critical Risk</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  VC Funding
                </label>
                <input
                  type="text"
                  placeholder="e.g. $10M raised"
                  value={editFunding}
                  onChange={(e) => setEditFunding(e.target.value)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  GitHub Endpoint
                </label>
                <input
                  type="text"
                  placeholder="GitHub URL"
                  value={editGithub}
                  onChange={(e) => setEditGithub(e.target.value)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  placeholder="Website URL"
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[9px] text-slate-400 font-semibold mb-1">
                  Block Time (s)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={editBlockTime}
                  onChange={(e) =>
                    setEditBlockTime(parseFloat(e.target.value) || 1.5)
                  }
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-[9px] text-slate-400 font-semibold mb-1">
                  Commits / Wk
                </label>
                <input
                  type="number"
                  min="0"
                  value={editCommits}
                  onChange={(e) =>
                    setEditCommits(parseInt(e.target.value) || 0)
                  }
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-[9px] text-slate-400 font-semibold mb-1">
                  Peak TPS
                </label>
                <input
                  type="number"
                  min="1"
                  value={editPeakTps}
                  onChange={(e) =>
                    setEditPeakTps(parseInt(e.target.value) || 1000)
                  }
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                Ecosystem Description
              </label>
              <textarea
                placeholder="Briefly detail what makes this early blockchain unique..."
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full h-14 bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 shadow-xs resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Filters Segment */}
      <div className="p-3.5 border-b border-slate-800 bg-[#0c1221] space-y-2">
        <input
          type="text"
          id="explorer-search"
          placeholder="Search by name or VM type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#141b2c] border border-slate-800 rounded-lg px-3 py-1.75 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500 shadow-3xs"
        />

        <div className="grid grid-cols-3 gap-1.5">
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="bg-[#141b2c] border border-slate-800 text-[10px] text-slate-300 rounded-md p-1.5 focus:outline-none focus:border-violet-500 shadow-3xs"
          >
            <option value="All">All Tiers</option>
            <option value="L1">Layer 1</option>
            <option value="L2">Layer 2</option>
          </select>
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="bg-[#141b2c] border border-slate-800 text-[10px] text-slate-300 rounded-md p-1.5 focus:outline-none focus:border-violet-500 shadow-3xs"
          >
            <option value="All">All Stages</option>
            <option value="Early Mainnet">Mainnet</option>
            <option value="Testnet">Testnet</option>
            <option value="Devnet">Devnet</option>
          </select>
          <select
            value={filterVm}
            onChange={(e) => setFilterVm(e.target.value)}
            className="bg-[#141b2c] border border-slate-800 text-[10px] text-slate-300 rounded-md p-1.5 focus:outline-none focus:border-violet-500 shadow-3xs"
          >
            <option value="All">All VMs</option>
            <option value="Parallel EVM">Parallel EVM</option>
            <option value="EVM">EVM</option>
            <option value="SVM">SVM</option>
            <option value="MoveVM">MoveVM</option>
            <option value="WASM">WASM</option>
          </select>
        </div>
      </div>

      {/* Main Chains Scroll Container */}
      <div
        className="flex-1 overflow-y-auto scrollbar-thin space-y-2 p-3.5 bg-[#090e18]"
        id="chains-scroll-list"
      >
        {filteredChains.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No emerging ecosystems match search criteria.
          </div>
        ) : (
          filteredChains.map((chain) => {
            const isSelected = chain.id === selectedChainId;
            return (
              <div
                key={chain.id}
                id={`chain-card-${chain.id}`}
                onClick={() => onSelectChain(chain.id)}
                className={`group relative flex flex-col p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#161e2e]/90 border-violet-600 shadow-xs ring-1 ring-violet-600/35"
                    : "bg-[#0f1624] border-slate-850 hover:bg-[#151c2d] hover:border-slate-800"
                }`}
              >
                {/* Delete Confirmation Overlay inside card */}
                {confirmingDeleteId === chain.id ? (
                  <div className="absolute inset-0 bg-[#0e1625]/95 rounded-xl flex flex-col items-center justify-center p-3.5 z-20 text-center space-y-2.5">
                    <span className="text-red-400 text-xs font-bold leading-tight">
                      Delete "{chain.name}"?
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChain(chain.id);
                          setConfirmingDeleteId(null);
                        }}
                        className="px-3 py-1 bg-red-650 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold border-0 transition-colors cursor-pointer"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmingDeleteId(null);
                        }}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-705 text-slate-300 rounded-lg text-[10px] font-bold border-0 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Horizontal Title segment */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 max-w-[65%]">
                    <div
                      className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                        isSelected
                          ? "text-violet-400 bg-violet-950/40"
                          : "bg-[#182030] text-slate-400 group-hover:text-violet-400 group-hover:bg-violet-950/40"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <h3 className="font-display font-bold text-xs text-slate-100 leading-snug group-hover:text-violet-300 transition-colors truncate">
                        {chain.name}
                        {chain.isCustom && (
                          <span className="ml-1.5 text-[9px] px-1.5 py-0.2 bg-violet-950/60 text-violet-300 border border-violet-900 rounded-full font-semibold">
                            Custom
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[10px] text-slate-450 font-bold tracking-wide uppercase">
                          {chain.tier}
                        </span>
                        <span className="text-[9px] text-slate-600 font-medium">
                          •
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">
                          {chain.vmType}
                        </span>
                        <span className="text-[9px] text-slate-600 font-medium">
                          •
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 font-bold rounded-full border ${getStageBadge(chain.stage)}`}
                        >
                          {chain.stage}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center gap-0.5 bg-[#141b2c] border border-slate-800 rounded-lg p-0.5 shadow-2xs">
                      <button
                        title="Edit Ecosystem"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(chain);
                        }}
                        className="p-1 hover:text-violet-400 hover:bg-slate-800 rounded-md transition-colors border-0 bg-transparent text-slate-400 cursor-pointer flex items-center justify-center"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Delete Ecosystem"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmingDeleteId(chain.id);
                        }}
                        className="p-1 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors border-0 bg-transparent text-slate-400 cursor-pointer flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span
                      className={`text-[9px] px-1.5 py-0.5 font-bold rounded-full ${getRiskLabelColor(chain.riskRating)}`}
                    >
                      {chain.riskRating}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed transition-colors">
                  {chain.description}
                </p>

                {/* Micro Metric Rail */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 font-mono text-[9px]">
                  <div>
                    <span className="block text-slate-550 font-semibold uppercase text-[8px] tracking-wider">
                      TPS Live
                    </span>
                    <span className="font-bold text-violet-400 text-xs mt-0.5 block">
                      {chain.tps?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-550 font-semibold uppercase text-[8px] tracking-wider">
                      Gas Price
                    </span>
                    <span className="font-bold text-slate-300 text-xs mt-0.5 block">
                      {chain.gasPrice || "0"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-550 font-semibold uppercase text-[8px] tracking-wider">
                      Commits
                    </span>
                    <span className="font-bold text-slate-300 text-xs mt-0.5 block">
                      {chain.commitsPerWeek}/wk
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-3.5 border-t border-slate-800 bg-[#0d1320] font-sans text-[10px] text-slate-400 flex gap-4 justify-between font-medium select-none">
        <span>
          Active Testnets:{" "}
          {chains.filter((c) => c.stage !== "Design Space").length}
        </span>
        <span>Registered Peers: {chains.length}</span>
      </div>
    </div>
  );
}
