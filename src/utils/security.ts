/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chain, RiskRating } from "../types";

export interface RiskFactor {
  label: string;
  points: number;
}

export interface PositiveSignal {
  label: string;
  impact: string;
}

export interface SecurityStatus {
  score: number; // 0 (safest) to 100 (riskiest)
  rating: RiskRating;
  breakdown: RiskFactor[];
  positiveSignals: PositiveSignal[];
  exploitLikelihood: number; // 0% to 100%
  exploitDrivers: string[];
  summary: string;
  anomalies: string[];
  confidenceScore: number;
  confidenceReason: string;
  riskTrend: "↑ Increasing" | "↓ Decreasing" | "→ Stable";
  riskTrendReason: string;
  verdict: string;
}

/**
 * Deterministically computes comprehensive security vectors for a blockchain ecosystem.
 * Formulated to reflect real-world exploit dynamics.
 */
export function calculateSecurityStatus(chain: Chain): SecurityStatus {
  const breakdown: RiskFactor[] = [];
  const positiveSignals: PositiveSignal[] = [];
  const anomalies: string[] = [];

  // --- 1. Validator Decentralization Metrics (Weak Decentralization: +20 to +30) ---
  const activeValidators = chain.validators?.active || 10;
  if (activeValidators <= 15) {
    breakdown.push({
      label: `Centralized Validator Set (${activeValidators} active)`,
      points: 28,
    });
  } else if (activeValidators <= 50) {
    breakdown.push({
      label: `Limited Validator decentralization (${activeValidators} active)`,
      points: 20,
    });
  } else if (activeValidators <= 100) {
    breakdown.push({
      label: `Moderate Validator set size (${activeValidators} active)`,
      points: 10,
    });
  } else {
    // High decentralization is a positive signal
    positiveSignals.push({
      label: `Robust Node Decentralization`,
      impact: `Validator Strength: ${activeValidators} active. Reduces risk substantially (-10 equivalent protection).`,
    });
  }

  // --- 2. Dev Activity (Commits per week) ---
  const commits = chain.commitsPerWeek || 0;
  if (commits < 50) {
    breakdown.push({
      label: `Dormant developer repository (${commits} commits/wk)`,
      points: 18,
    });
  } else if (commits < 150) {
    breakdown.push({
      label: `Moderate codebase iteration rate (${commits} commits/wk)`,
      points: 10,
    });
  } else {
    positiveSignals.push({
      label: `High Development Activity`,
      impact: `Active developer commits (${commits}/wk). Ensures rapid security patches and code audits (-15 equivalent protection).`,
    });
  }

  // --- 3. Deployment Stage & Centralization Proxy (Testnet: +5 to +10) ---
  if (chain.stage === "Design Space") {
    breakdown.push({
      label: "Conceptual Design Stage (No production rules verified)",
      points: 25,
    });
  } else if (chain.stage === "Devnet") {
    breakdown.push({
      label: "Unstable Devnet Stage (Single sequencer node)",
      points: 20,
    });
  } else if (chain.stage === "Testnet") {
    breakdown.push({ label: "Public Testnet Stage", points: 8 });
  } else if (chain.stage === "Early Mainnet") {
    breakdown.push({
      label: "Early Mainnet (Restricted guardrails active)",
      points: 4,
    });
  }

  // --- 4. Bridge Presence (High hack vector: +20 to +30) ---
  const hasBridge =
    chain.id === "monad" ||
    chain.id === "berachain" ||
    chain.id === "movement" ||
    chain.id === "eclipse" ||
    (chain as any).bridgePresence === "Yes";
  if (hasBridge) {
    breakdown.push({
      label: "Active lock-and-mint bridge contract deployed",
      points: 24,
    });
  } else {
    positiveSignals.push({
      label: "Zero Bridge Exposure",
      impact:
        "No standard asset custodian bridges detected. Minimizes external composite hack surface.",
    });
  }

  // --- 5. Upgradeability State (Admin keys power: +15 to +25) ---
  const upgradePercent =
    (chain as any).upgradeableContractsPercent !== undefined
      ? (chain as any).upgradeableContractsPercent
      : chain.stage === "Devnet"
        ? 90
        : chain.stage === "Testnet"
          ? 70
          : 40;

  if (upgradePercent >= 80) {
    breakdown.push({
      label: `High Multisig / Owner contract upgradeability (${upgradePercent}%)`,
      points: 22,
    });
  } else if (upgradePercent >= 50) {
    breakdown.push({
      label: `Moderate admin proxy contract control (${upgradePercent}%)`,
      points: 15,
    });
  } else if (upgradePercent > 0) {
    breakdown.push({
      label: `Limited contract upgrade parameters (${upgradePercent}%)`,
      points: 5,
    });
  } else {
    positiveSignals.push({
      label: "Highly Immutable Smart Contracts",
      impact:
        "Fully immutable or multi-sig timelocked bytecode. Disarms dynamic owner key hazard.",
    });
  }

  // --- 6. Oracle Dependencies (No premium risk; 0 to +3 unless custom/centralized) ---
  const oracleType =
    (chain as any).oracleDependencies ||
    (chain.vmType === "SVM" ? "Pyth" : "Chainlink");
  if (oracleType === "None") {
    // Low risk oracle state
    positiveSignals.push({
      label: "No Oracle Dependencies",
      impact:
        "Ecosystem operates on immutable localized logs with minimal exogenous feeds.",
    });
  } else if (
    oracleType.toLowerCase().includes("native") ||
    oracleType.toLowerCase().includes("custom") ||
    oracleType.toLowerCase().includes("centralized")
  ) {
    breakdown.push({
      label: `Custom/Centralized Oracle dependency (${oracleType})`,
      points: 3,
    });
  } else {
    positiveSignals.push({
      label: `Industry Standard Oracle Feeds`,
      impact: `Oracle: ${oracleType}. Decentralized feeds with low risk profile.`,
    });
  }

  // --- Compute Normalized Total Risk Score ---
  // Risk Score = Sum of weighted risk factors (capped at 100, min 5)
  let rawScore = breakdown.reduce((acc, factor) => acc + factor.points, 0);
  const score = Math.max(5, Math.min(100, rawScore));

  // Determine Risk Rating: 0–30 → Low | 31–60 → Medium | 61–100 → High
  let rating: RiskRating = "Low";
  if (score >= 61) rating = "High";
  else if (score >= 31) rating = "Medium";
  else rating = "Low";

  // --- Exploit Likelihood Calculation & Dynamic Exploit Drivers ---
  let exploitPoints = 0;
  const exploitDrivers: string[] = [];

  if (activeValidators < 15) {
    exploitPoints += 30;
    exploitDrivers.push(
      "Extremely sparse validator count increases risk of economic consensus collusion or sequencer hacks",
    );
  } else if (activeValidators < 50) {
    exploitPoints += 15;
    exploitDrivers.push(
      "Moderate consensus decentralization leaves protocol open to private validation cartels",
    );
  } else {
    exploitDrivers.push(
      "Strong decentralized consensus reduces probability of coordination exploits",
    );
  }

  if (upgradePercent > 75) {
    exploitPoints += 25;
    exploitDrivers.push(
      "Highly upgradeable contract wrappers expose system rule administration to single-point-of-failure compromise",
    );
  } else if (upgradePercent > 45) {
    exploitPoints += 12;
    exploitDrivers.push(
      "Assignable proxy architecture introduces potential multi-signature governance exploit targets",
    );
  } else {
    exploitDrivers.push(
      "High smart contract immutability restricts administrative update pathways",
    );
  }

  if (hasBridge) {
    exploitPoints += 25;
    exploitDrivers.push(
      "Bridge exposure introduces continuous cross-chain smart contract vulnerability vectors",
    );
  } else {
    exploitDrivers.push(
      "Absence of bridges shields ecosystem from severe liquidity outflow or lock-mint drain incidents",
    );
  }

  if (commits < 80) {
    exploitPoints += 18;
    exploitDrivers.push(
      "Restricted developer commits signal slow mitigation and patch times against zero-day discovery",
    );
  }

  const exploitLikelihood = Math.max(5, Math.min(98, exploitPoints));

  // --- 7. Confidence Score & Reason ---
  let confidenceScore = 80;
  let confidenceReason = "";

  if (chain.stage === "Design Space") {
    confidenceScore = 45;
    confidenceReason =
      "Conceptual architecture: Zero active telemetry pipelines or production code deployments.";
  } else if (chain.stage === "Devnet") {
    confidenceScore = 68;
    confidenceReason =
      "Limited validator telemetry: Staging environments and single sequencer reports only.";
  } else if (chain.stage === "Testnet") {
    confidenceScore = 74;
    confidenceReason =
      "Partial visibility: Evaluated via virtual consensus parameters with limited live validator telemetry.";
  } else {
    confidenceScore = 92;
    confidenceReason =
      "Verified metrics: Real-time decentralization telemetry, open-source codebase, and mainnet execution blocks.";
  }

  // --- 8. Dynamic Risk Trend & Reason ---
  let riskTrend: "↑ Increasing" | "↓ Decreasing" | "→ Stable" = "→ Stable";
  let riskTrendReason = "";

  if (hasBridge && upgradePercent >= 70) {
    riskTrend = "↑ Increasing";
    riskTrendReason =
      "Active asset bridge connected in combination with volatile upgrade contracts (currently at " +
      upgradePercent +
      "%).";
  } else if (commits < 40) {
    riskTrend = "↑ Increasing";
    riskTrendReason =
      "Dev activity is sliding down below critical thresholds, delaying critical security response times.";
  } else if (activeValidators > 100 && upgradePercent <= 30) {
    riskTrend = "↓ Decreasing";
    riskTrendReason =
      "Validator set is decentralizing and contracts are migrating to immutable timelock rules.";
  } else {
    riskTrend = "→ Stable";
    riskTrendReason =
      "Consensus nodes are stable and no structural contract code modification triggers identified.";
  }

  // --- 9. Dynamic Anomaly Detection (using live metrics) ---
  const avg = chain.avgTps || 50;
  if (chain.tps > avg * 4 && chain.tps > 20) {
    anomalies.push(
      `⚠️ TPS surge detected (${chain.tps.toFixed(1)} vs avg ${avg}) without transaction growth`,
    );
  }
  // Unexpected gas congestion
  if (chain.gasPrice > 60 && chain.id !== "berachain") {
    anomalies.push(
      `⚠️ Volatile GAS price spike detected (${chain.gasPrice} Gwei)`,
    );
  } else if (chain.id === "berachain" && chain.gasPrice > 160) {
    anomalies.push(
      `⚠️ Extreme liquidity gas congestion spike (${chain.gasPrice} Gwei)`,
    );
  }
  // Low commits alert
  if (commits < 30) {
    anomalies.push(`⚠️ Critical code commit dry-spell (< 30 commits/wk)`);
  }
  // Sudden delay block times
  if (chain.history && chain.history.length > 1) {
    const lastHistory = chain.history[chain.history.length - 1];
    const prevHistory = chain.history[chain.history.length - 2];
    if (lastHistory.blockTime > prevHistory.blockTime * 1.5) {
      anomalies.push(
        `⚠️ Network latency anomaly: block times inflated by ${((lastHistory.blockTime / prevHistory.blockTime - 1) * 100).toFixed(0)}%`,
      );
    }
  }

  // --- 10. Decisive Security Verdict ---
  let verdict = "";
  if (rating === "Low") {
    verdict =
      "Low risk. Structure is solid. Recommended for general web3 production scaling.";
  } else if (rating === "Medium") {
    verdict =
      "Moderate risk. Suitable for standard testing, dApp sandboxes, and non-custodial tools.";
  } else {
    verdict =
      "Elevated risk surface. Suitable for development and testing, not recommended for high-value assets.";
  }

  // --- 11. Decisive Security Summary ---
  let summary = "";
  const bridgeText = hasBridge
    ? "active bridge exposure"
    : "no bridge exposure";
  const stageLower = chain.stage.toLowerCase();

  summary = `${chain.stage} environment with ${upgradePercent}% upgradeability parameters and ${bridgeText}. Suitable for testing, not recommended for high-value production deployment.`;

  if (rating === "Low" && chain.stage === "Early Mainnet") {
    summary = `Production-grade mainnet environment featuring robust decentralization, immutable contract rules, and highly active developers. Ready for institutional-scale deployment.`;
  }

  return {
    score,
    rating,
    breakdown,
    positiveSignals,
    exploitLikelihood,
    exploitDrivers,
    summary,
    anomalies,
    confidenceScore,
    confidenceReason,
    riskTrend,
    riskTrendReason,
    verdict,
  };
}

/**
 * Calculates trend indicators (time-based) compared to previous states
 */
export interface TrendState {
  tpsTrend: "up" | "down" | "stable";
  gasTrend: "up" | "down" | "stable";
  devTrend: "up" | "down" | "stable";
}

export function calculateTrends(chain: Chain): TrendState {
  if (!chain.history || chain.history.length < 2) {
    return { tpsTrend: "stable", gasTrend: "stable", devTrend: "stable" };
  }

  const latest = chain.history[chain.history.length - 1];
  const previous = chain.history[chain.history.length - 2];

  let tpsTrend: "up" | "down" | "stable" = "stable";
  if (latest.tps > previous.tps * 1.05) tpsTrend = "up";
  else if (latest.tps < previous.tps * 0.95) tpsTrend = "down";

  let gasTrend: "up" | "down" | "stable" = "stable";
  if (latest.gasPrice > previous.gasPrice * 1.05) gasTrend = "up";
  else if (latest.gasPrice < previous.gasPrice * 0.95) gasTrend = "down";

  // Commits trend is stable or custom based on length
  let devTrend: "up" | "down" | "stable" = "stable";
  if (chain.commitsPerWeek > 200) devTrend = "up";
  else if (chain.commitsPerWeek < 60) devTrend = "down";

  return { tpsTrend, gasTrend, devTrend };
}
