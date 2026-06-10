/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Chain, AiReport } from '../types';
import { Brain, Sparkles, AlertTriangle, CheckCircle2, Terminal, ShieldAlert, Zap, ArrowRight, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AiAnalystProps {
  chain: Chain;
  cachedReports: Record<string, AiReport>;
  onSaveReport: (chainId: string, report: AiReport) => void;
}

export default function AiAnalyst({ chain, cachedReports, onSaveReport }: AiAnalystProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [scanningMessage, setScanningMessage] = useState('');

  const activeReport = cachedReports[chain.id];

  const analysisPhases = [
    'Scanning GitHub repository for developer activity...',
    'Analyzing consensus engine state machine parameters...',
    'Evaluating Data Availability (DA) bridge integrity...',
    'Measuring SVM/EVM parallel execution contentions...',
    'Modeling Byzantine fault tolerance against validator collusion...',
    'Formulating final risk metrics and comparative breakdown with peers...'
  ];

  useEffect(() => {
    if (!loading) return;
    
    let phaseIndex = 0;
    setScanningMessage(analysisPhases[0]);

    const interval = setInterval(() => {
      phaseIndex = (phaseIndex + 1) % analysisPhases.length;
      setScanningMessage(analysisPhases[phaseIndex]);
    }, 2800);

    return () => clearInterval(interval);
  }, [loading]);

  const runAiResearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chainName: chain.name,
          tier: chain.tier,
          vmType: chain.vmType,
          consensus: chain.consensus,
          daLayer: chain.daLayer,
          funding: chain.funding,
          description: chain.description,
          customPrompt: customPrompt || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server returned error ${response.status}`);
      }

      const reportData = await response.json();
      
      const compiledReport: AiReport = {
        id: `report-${Date.now()}`,
        chainId: chain.id,
        timestamp: new Date().toLocaleTimeString(),
        safetyScore: reportData.safetyScore || 50,
        decentralizationScore: reportData.decentralizationScore || 50,
        techNoveltyScore: reportData.techNoveltyScore || 50,
        ecosystemScore: reportData.ecosystemScore || 50,
        riskSummary: reportData.riskSummary || 'Early-stage network validation underway.',
        bottlenecks: reportData.bottlenecks || [],
        mitigations: reportData.mitigations || [],
        aiAnalysisText: reportData.aiAnalysisText || 'Deep-dive analytical data successfully loaded.'
      };

      onSaveReport(chain.id, compiledReport);
      setCustomPrompt('');

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Verification aborted due to a network or rate-limiting issue.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-800/80 bg-emerald-950/25';
    if (score >= 50) return 'text-amber-400 border-amber-800/80 bg-amber-955/25';
    return 'text-red-400 border-red-800/80 bg-red-950/25';
  };

  const scoreDescriptions = {
    safety: 'Byzantine fault-tolerance, client vulnerability surfaces, and state partition resistance.',
    decentralization: 'Concentration risks, Gini index of stake distribution, and active nodes.',
    techNovelty: 'VM architectures, parallel execution pipelining, and DA optimizations.',
    ecosystem: 'Core repository activity, developer inflow, and capital backing.'
  };

  return (
    <div className="space-y-6" id={`ai-analyst-panel-${chain.id}`}>
      {/* Search Grounding and Run Command Panel */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-3xs">
        <div className="max-w-xl">
          <div className="flex items-center gap-1.5 text-xs text-white font-bold uppercase tracking-wider mb-1 font-display">
            <Brain className="w-4 h-4 text-violet-400" />
            Ecosystem Security Intelligence Core
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            Run automated threat-modeling and security analysis on {chain.name}. Provide a structured inquiry focus or run consensus state-machine audits backed by Gemini.
          </p>
        </div>

        <button
          id="btn-trigger-ai-audit"
          onClick={runAiResearch}
          disabled={loading}
          className="px-4 py-2.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-750 disabled:bg-slate-900 disabled:text-slate-500 rounded-xl flex items-center gap-1.5 shrink-0 select-none cursor-pointer border-0 shadow-xs shadow-violet-600/10"
        >
          <Sparkles className="w-4 h-4 fill-current text-white" />
          {activeReport ? 'Re-run AI Analysis' : 'Initialize AI Analysis'}
        </button>
      </div>

      {/* Loading Block Scans */}
      {loading && (
        <div id="ai-loading-screen" className="bg-[#0e1626] border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] text-center space-y-4 relative overflow-hidden shadow-3xs">
          <div className="absolute inset-0 bg-radial-gradient from-violet-500/5 to-transparent pointer-events-none" />
          <Terminal className="w-10 h-10 text-violet-400 animate-pulse" />
          <div>
            <span className="text-white text-sm font-bold tracking-wide block font-display">Executing ChainWatch Audit Engine</span>
            <span className="text-[10px] text-slate-405 mt-2 block font-mono font-bold h-5">{scanningMessage}</span>
          </div>
          <div className="w-48 bg-slate-900 h-1 rounded-full overflow-hidden block">
            <div className="bg-[#7c3aed] h-full w-2/3 rounded-full animate-[loading_10s_infinite_linear]" style={{
              backgroundImage: 'linear-gradient(90deg, #7c3aed 0%, #4f46e5 100%)'
            }} />
          </div>
        </div>
      )}

      {/* Network Error Display */}
      {error && !loading && (
        <div id="ai-error-banner" className="p-4 bg-red-950/30 border border-red-900 text-red-200 rounded-2xl text-xs flex gap-3 shadow-3xs">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <span className="font-bold block mb-1">Audit Protocol Interrupted</span>
            <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">{error}</p>
            <button
              onClick={runAiResearch}
              className="mt-3.5 px-3.5 py-1.5 bg-red-900 hover:bg-red-950 text-white font-bold rounded-lg text-[10px]"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Audit Report Container */}
      {!loading && !error && (
        activeReport ? (
          <div className="space-y-6" id="ai-report-active-container">
            {/* Metric Score Cards (Four points of focus) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Safety Score */}
              <div className={`border rounded-2xl p-4.5 flex flex-col justify-between shadow-3xs hover:shadow-2xs transition-all ${getScoreColor(activeReport.safetyScore)}`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold">Consensus Safety</span>
                    <span className="text-xl font-extrabold font-mono">{activeReport.safetyScore}<span className="text-[11px] opacity-70">/100</span></span>
                  </div>
                  <p className="text-[10px] leading-relaxed font-semibold">{scoreDescriptions.safety}</p>
                </div>
              </div>

              {/* Decentralization Index */}
              <div className={`border rounded-2xl p-4.5 flex flex-col justify-between shadow-3xs hover:shadow-2xs transition-all ${getScoreColor(activeReport.decentralizationScore)}`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold">Decentralization</span>
                    <span className="text-xl font-extrabold font-mono">{activeReport.decentralizationScore}<span className="text-[11px] opacity-70">/100</span></span>
                  </div>
                  <p className="text-[10px] leading-relaxed font-semibold">{scoreDescriptions.decentralization}</p>
                </div>
              </div>

              {/* Tech Novelty Score */}
              <div className={`border rounded-2xl p-4.5 flex flex-col justify-between shadow-3xs hover:shadow-2xs transition-all ${getScoreColor(activeReport.techNoveltyScore)}`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold">Tech Novelty</span>
                    <span className="text-xl font-extrabold font-mono">{activeReport.techNoveltyScore}<span className="text-[11px] opacity-70">/100</span></span>
                  </div>
                  <p className="text-[10px] leading-relaxed font-semibold">{scoreDescriptions.techNovelty}</p>
                </div>
              </div>

              {/* Developer Traction */}
              <div className={`border rounded-2xl p-4.5 flex flex-col justify-between shadow-3xs hover:shadow-2xs transition-all ${getScoreColor(activeReport.ecosystemScore)}`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold">Ecosystem Build</span>
                    <span className="text-xl font-extrabold font-mono">{activeReport.ecosystemScore}<span className="text-[11px] opacity-70">/100</span></span>
                  </div>
                  <p className="text-[10px] leading-relaxed font-semibold">{scoreDescriptions.ecosystem}</p>
                </div>
              </div>
            </div>

            {/* Crucial Risk Summary Highlight Card */}
            <div className="p-4 bg-[#0e1626] border border-slate-800 border-l-4 border-l-amber-500 rounded-2xl text-xs flex gap-3.5 shadow-3xs hover:shadow-2xs transition-all">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="font-bold text-amber-400 block mb-1 uppercase tracking-wider text-[10px]">Identified Ecosystem Risk Summary</span>
                <p className="text-[11px] leading-relaxed text-slate-350 font-semibold">{activeReport.riskSummary}</p>
              </div>
            </div>

            {/* Core Bottlenecks vs Suggested Mitigations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bottlenecks */}
              <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-3xs">
                <div>
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5 font-display">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    Architectural Vulnerabilities (Bottlenecks)
                  </h4>
                  <div className="space-y-3">
                    {activeReport.bottlenecks.map((bottleneck, idx) => (
                      <div key={idx} className="flex gap-2.5 text-xs leading-normal">
                        <span className="text-red-400 text-[10px] font-mono font-bold shrink-0 mt-0.5">[{idx + 1}]</span>
                        <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{bottleneck}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mitigations */}
              <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-3xs">
                <div>
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5 font-display">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Recommended Mitigations (Builders)
                  </h4>
                  <div className="space-y-3">
                    {activeReport.mitigations.map((mitigation, idx) => (
                      <div key={idx} className="flex gap-2.5 text-xs leading-normal">
                        <span className="text-emerald-505 text-[10px] font-mono font-bold shrink-0 mt-0.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /></span>
                        <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{mitigation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Markdown Narrative Essay */}
            <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 shadow-3xs">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5 font-display">
                <Terminal className="w-4 h-4 text-violet-400" />
                Technical Analysis & Structural Diagnostic
              </h4>
              <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-4 prose max-w-none">
                <ReactMarkdown
                  components={{
                    h3: ({ node, ...props }) => <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-1.5 mt-6 mb-3.5 flex items-center gap-1.5 font-display" {...props} />,
                    p: ({ node, ...props }) => <p className="text-[11px] text-slate-300 leading-relaxed mt-2 font-medium" {...props} />,
                    li: ({ node, ...props }) => <li className="text-[11px] text-slate-300 mt-1.5 font-medium list-disc list-inside" {...props} />,
                    strong: ({ node, ...props }) => <strong className="text-white font-bold" {...props} />
                  }}
                >
                  {activeReport.aiAnalysisText}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          /* Report Missing State (Trigger CTA) */
          <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] text-center space-y-4 shadow-3xs">
            <div className="p-3 bg-violet-950/40 text-violet-400 rounded-full">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <span className="text-white text-xs font-bold tracking-wider uppercase block font-display">No AI Risk Model Loaded</span>
              <p className="text-[11px] text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed font-medium">
                Synchronize directly with the ChainWatch intelligence engine powered by Gemini to inspect live SVM/EVM thread contentions, finality times, and threat models.
              </p>
            </div>
            <button
              onClick={runAiResearch}
              className="mt-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs shadow-violet-600/10 cursor-pointer"
            >
              Analyze {chain.name} Architecture <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      )}

      {/* Custom prompt focus input */}
      <div className="p-4.5 bg-[#0e1626] border border-slate-800 rounded-2xl space-y-3 shadow-3xs">
        <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-violet-400" />
          Specify inquiry focus (Custom Diagnostic Query)
        </label>
        <div className="flex gap-2.5">
          <input
            type="text"
            placeholder="e.g. Compare block state execution models vs CometBFT consensus rules..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={loading}
            className="flex-1 bg-[#131b2c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 font-semibold focus:outline-none focus:border-violet-500 focus:bg-[#1a243c] transition-all disabled:opacity-50"
          />
          <button
            onClick={runAiResearch}
            disabled={loading || !customPrompt.trim()}
            className="px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-750 disabled:bg-slate-900 disabled:text-slate-500 rounded-xl transition-all shadow-xs shadow-violet-600/10 cursor-pointer"
          >
            Ask AI
          </button>
        </div>
      </div>
    </div>
  );
}
