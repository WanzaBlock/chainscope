/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ChainTier = 'L1' | 'L2' | 'L3' | 'Rollapp';
export type ChainStage = 'Devnet' | 'Testnet' | 'Early Mainnet' | 'Design Space';
export type VmType = 'EVM' | 'SVM' | 'MoveVM' | 'WASM' | 'Parallel EVM' | 'Custom';
export type RiskRating = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ChainMetricsHistory {
  timestamp: string;
  tps: number;
  gasPrice: number;
  blockTime: number;
  activeAddresses: number;
}

export interface ValidatorNode {
  id: string;
  name: string;
  status: 'Online' | 'Offline' | 'Syncing' | 'Jailed';
  ping: number; // in ms
  stake: number; // in tokens or percentage
  version: string;
  blockHeight: number;
  location: string;
}

export interface Chain {
  id: string;
  name: string;
  tier: ChainTier;
  stage: ChainStage;
  vmType: VmType;
  consensus: string;
  daLayer: string; // Celestia, Ethereum, EigenDA, Avail, self-hosted, etc.
  funding: string;
  description: string;
  tps: number;
  avgTps: number;
  peakTps: number;
  blockTime: number; // e.g. 0.9s
  gasPrice: number; // in gwei or chain equivalent
  validators: {
    active: number;
    total: number;
  };
  commitsPerWeek: number;
  activeAddresses24h: number;
  riskRating: RiskRating;
  explorerUrl?: string;
  githubUrl?: string;
  website?: string;
  isCustom?: boolean;
  history: ChainMetricsHistory[];
  validatorNodes?: ValidatorNode[];
}

export interface AlertRule {
  id: string;
  chainId: string;
  metric: 'tps' | 'gasPrice' | 'blockTime' | 'activeAddresses';
  condition: 'above' | 'below';
  value: number;
  isActive: boolean;
  alertName: string;
}

export interface AlertLog {
  id: string;
  chainId: string;
  chainName: string;
  metric: string;
  value: number;
  limitValue: number;
  condition: 'above' | 'below';
  timestamp: string;
  isRead: boolean;
  severity: 'warning' | 'critical';
}

export interface AiReport {
  id: string;
  chainId: string;
  timestamp: string;
  safetyScore: number; // 0-100
  decentralizationScore: number; // 0-100
  techNoveltyScore: number; // 0-100
  ecosystemScore: number; // 0-100
  riskSummary: string;
  bottlenecks: string[];
  mitigations: string[];
  aiAnalysisText: string;
}
