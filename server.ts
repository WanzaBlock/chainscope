/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client safely with User-Agent for tracking
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health status indicator
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    apiConfigured: !!apiKey,
    time: new Date().toISOString()
  });
});

// Chain AI analyzer route
app.post('/api/gemini/analyze', async (req, res) => {
  if (!aiClient) {
    return res.status(503).json({
      error: 'Gemini API is not configured. Please supply the GEMINI_API_KEY secret in AI Studio Settings.'
    });
  }

  const { chainName, tier, vmType, consensus, daLayer, funding, description, customPrompt } = req.body;

  if (!chainName) {
    return res.status(400).json({ error: 'chainName parameter is required' });
  }

  const prompt = `
     You are an expert blockchain architect representing the highest standard of institutional research.
     Execute an advanced, unbiased technical analysis for the following early-stage blockchain ecosystem:
     - Name: ${chainName}
     - Architecture Tier: ${tier}
     - Virtual Machine: ${vmType}
     - Consensus Protocol: ${consensus}
     - Data Availability (DA) Layer: ${daLayer || 'Self-hosted/Standard'}
     - Capital Backing/Funding: ${funding || 'Early community'}
     - Description: ${description || 'Early-stage project under development'}
     
     ${customPrompt ? `Additional User Inquiry Focus: ${customPrompt}` : ''}
     
     Analyze structural risks, scalability trade-offs (e.g. state bloat, shared sequencer trust assumptions, SVM contentions, or Parallel EVM synchronization overhead), decentralization metrics, and tech novelty compared to peers like Ethereum L1, Solana, Arbitrum, or Solana-VM rollups. Provide a safe and realistic scoring profile (scores from 1 to 100).
  `;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are ChainWatch AI, an analytical terminal that dissects emerging network architectures (L1, L2, L3) with high technical granularity. Reject developer marketing hype and compile detailed, realistic architectural risk ratings and assessments.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            safetyScore: { 
              type: Type.INTEGER, 
              description: 'Technical consensus safety, finality, and network vulnerability resistance score out of 100.' 
            },
            decentralizationScore: { 
              type: Type.INTEGER, 
              description: 'Real decentralization score out of 100, focusing on validator limits, centralized sequences, and multi-sigs.' 
            },
            techNoveltyScore: { 
              type: Type.INTEGER, 
              description: 'Innovation score out of 100 for virtual machines, consensus upgrades, or cryptographics.' 
            },
            ecosystemScore: { 
              type: Type.INTEGER, 
              description: 'Developer momentum and capital distribution score out of 100.' 
            },
            riskSummary: { 
              type: Type.STRING, 
              description: 'A 1-sentence critical risk assessment of the network in its present development stage.' 
            },
            bottlenecks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 actual technical bottlenecks or security attack vectors mapped to the chain.'
            },
            mitigations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 highly technical steps developers can take, or structural modifications core devs are planning, to mitigate the risks.'
            },
            aiAnalysisText: {
              type: Type.STRING,
              description: 'A rich, multi-paragraph markdown commentary comparing this architecture to established counterparts. Include sub-headers like "### Architectural Breakdown", "### Security & State Contention Profile", and "### Peer Positioning Analysis". Use professional developer-orientated vocabulary.'
            }
          },
          required: [
            'safetyScore', 
            'decentralizationScore', 
            'techNoveltyScore', 
            'ecosystemScore', 
            'riskSummary', 
            'bottlenecks', 
            'mitigations', 
            'aiAnalysisText'
          ]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Gemini model returned an empty response.');
    }

    const payload = JSON.parse(textOutput.trim());
    return res.json(payload);

  } catch (error: any) {
    console.error('Gemini API analysis failed:', error);
    return res.status(500).json({
      error: 'AI analysis aborted due to a server error or rate limitation.',
      details: error.message || error
    });
  }
});

// Setup Vite Dev server or Production static files
async function run() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ChainWatch Server] Connected on port http://localhost:${PORT}`);
  });
}

run().catch((err) => {
  console.error('[ChainWatch Server Boot Failure]:', err);
});
