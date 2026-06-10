/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chain } from './types';

export const INITIAL_CHAINS: Chain[] = [
  {
    id: 'monad',
    name: 'Monad',
    tier: 'L1',
    stage: 'Testnet',
    vmType: 'Parallel EVM',
    consensus: 'MonadBFT',
    daLayer: 'Self-Hosted / High-throughput consensus',
    funding: '$225M Series A (Paradigm, Coinbase, IOSG)',
    description: 'A revolutionary ultra-high performance parallel execution EVM layer-1 blockchain. Achieves up to 10,000 real-world TPS by splitting execution and consensus (pipelined architecture) and utilizing a custom database engine (MonadDB).',
    tps: 342,
    avgTps: 350,
    peakTps: 10000,
    blockTime: 1.0,
    gasPrice: 15,
    validators: {
      active: 135,
      total: 150
    },
    commitsPerWeek: 452,
    activeAddresses24h: 341050,
    riskRating: 'Low',
    explorerUrl: 'https://testnet.monadexplorer.com',
    githubUrl: 'https://github.com/monad-labs',
    website: 'https://monad.xyz',
    history: [
      { timestamp: '10:00', tps: 290, gasPrice: 12, blockTime: 1.0, activeAddresses: 320000 },
      { timestamp: '12:00', tps: 310, gasPrice: 14, blockTime: 1.0, activeAddresses: 328000 },
      { timestamp: '14:00', tps: 410, gasPrice: 18, blockTime: 1.0, activeAddresses: 341000 },
      { timestamp: '16:00', tps: 330, gasPrice: 15, blockTime: 1.0, activeAddresses: 339000 },
      { timestamp: '18:00', tps: 342, gasPrice: 15, blockTime: 1.0, activeAddresses: 341050 }
    ],
    validatorNodes: [
      { id: 'm-val-1', name: 'Monad-HQ-North', status: 'Online', ping: 32, stake: 8.5, version: 'v0.7.2-beta', blockHeight: 9481204, location: 'New York, US' },
      { id: 'm-val-2', name: 'Validator-Zero', status: 'Online', ping: 45, stake: 6.2, version: 'v0.7.2-beta', blockHeight: 9481204, location: 'Frankfurt, DE' },
      { id: 'm-val-3', name: 'Apex-Consensus', status: 'Online', ping: 21, stake: 5.9, version: 'v0.7.2-beta', blockHeight: 9481200, location: 'Tokyo, JP' },
      { id: 'm-val-4', name: 'Banyan-Stake', status: 'Syncing', ping: 120, stake: 4.1, version: 'v0.7.1-beta', blockHeight: 9481180, location: 'Mumbai, IN' },
      { id: 'm-val-5', name: 'Node-Whisper', status: 'Jailed', ping: 999, stake: 0.1, version: 'v0.6.9-beta', blockHeight: 9480102, location: 'London, UK' }
    ]
  },
  {
    id: 'berachain',
    name: 'Berachain',
    tier: 'L1',
    stage: 'Testnet',
    vmType: 'EVM',
    consensus: 'Proof of Liquidity (Beacon-kit)',
    daLayer: 'Beacon Chain consensus DA',
    funding: '$142M Series B (Brevan Howard, Polychain)',
    description: 'An EVM-compatible Layer 1 blockchain built on Cosmos SDK using Beacon-Kit, powered by Proof-of-Liquidity consensus. Its unique economic model separates gas token (BERA) from governance (BGT) and stablecoin (HONEY).',
    tps: 64,
    avgTps: 58,
    peakTps: 1200,
    blockTime: 3.8,
    gasPrice: 85,
    validators: {
      active: 82,
      total: 100
    },
    commitsPerWeek: 184,
    activeAddresses24h: 189200,
    riskRating: 'Medium',
    explorerUrl: 'https://artio.beratrail.io',
    githubUrl: 'https://github.com/berachain',
    website: 'https://berachain.com',
    history: [
      { timestamp: '10:00', tps: 45, gasPrice: 90, blockTime: 3.9, activeAddresses: 175000 },
      { timestamp: '12:00', tps: 52, gasPrice: 88, blockTime: 3.8, activeAddresses: 180000 },
      { timestamp: '14:00', tps: 72, gasPrice: 92, blockTime: 3.8, activeAddresses: 188000 },
      { timestamp: '16:00', tps: 68, gasPrice: 82, blockTime: 3.8, activeAddresses: 189000 },
      { timestamp: '18:00', tps: 64, gasPrice: 85, blockTime: 3.8, activeAddresses: 189200 }
    ],
    validatorNodes: [
      { id: 'b-val-1', name: 'Honey-Pool-Node', status: 'Online', ping: 54, stake: 12.1, version: 'v1.12-prod', blockHeight: 7352109, location: 'Paris, FR' },
      { id: 'b-val-2', name: 'Smokey-Capital', status: 'Online', ping: 38, stake: 10.4, version: 'v1.12-prod', blockHeight: 7352109, location: 'San Francisco, US' },
      { id: 'b-val-3', name: 'Grizzly-Staking', status: 'Online', ping: 62, stake: 9.8, version: 'v1.12-prod', blockHeight: 7352107, location: 'Singapore, SG' },
      { id: 'b-val-4', name: 'Validator-Bong', status: 'Offline', ping: 0, stake: 4.8, version: 'v1.11-beta', blockHeight: 7352002, location: 'Amsterdam, NL' }
    ]
  },
  {
    id: 'movement',
    name: 'Movement',
    tier: 'L2',
    stage: 'Testnet',
    vmType: 'MoveVM',
    consensus: 'Snowman / Aptos-core',
    daLayer: 'Celestia / Alt-DA',
    funding: '$38M Series A (Polychain, Hack VC)',
    description: 'A network of Move-based blockchains, launching the first Move-EVM L2 on Ethereum (M2). Movement combines the safety and speed of Aptos-style MoveVM with Ethereum execution liquidity.',
    tps: 185,
    avgTps: 190,
    peakTps: 5000,
    blockTime: 0.8,
    gasPrice: 2,
    validators: {
      active: 45,
      total: 50
    },
    commitsPerWeek: 210,
    activeAddresses24h: 112000,
    riskRating: 'Medium',
    explorerUrl: 'https://explorer.movementlabs.xyz',
    githubUrl: 'https://github.com/movementlabsxyz',
    website: 'https://movementlabs.xyz',
    history: [
      { timestamp: '10:00', tps: 140, gasPrice: 1.8, blockTime: 0.8, activeAddresses: 98000 },
      { timestamp: '12:00', tps: 165, gasPrice: 2.1, blockTime: 0.8, activeAddresses: 104000 },
      { timestamp: '14:00', tps: 220, gasPrice: 2.5, blockTime: 0.8, activeAddresses: 115000 },
      { timestamp: '16:00', tps: 192, gasPrice: 2.0, blockTime: 0.8, activeAddresses: 111000 },
      { timestamp: '18:00', tps: 185, gasPrice: 2.0, blockTime: 0.8, activeAddresses: 112000 }
    ],
    validatorNodes: [
      { id: 'mv-val-1', name: 'Movement-Genesis', status: 'Online', ping: 42, stake: 15.5, version: 'v0.3.4-alpha', blockHeight: 4120803, location: 'New York, US' },
      { id: 'mv-val-2', name: 'M2-Sequencer-A', status: 'Online', ping: 18, stake: 22.1, version: 'v0.3.4-alpha', blockHeight: 4120803, location: 'Dublin, IE' },
      { id: 'mv-val-3', name: 'Celestia-Bridge-Agent', status: 'Online', ping: 65, stake: 11.2, version: 'v0.3.3-alpha', blockHeight: 4120799, location: 'Frankfurt, DE' }
    ]
  },
  {
    id: 'megaeth',
    name: 'MegaETH',
    tier: 'L2',
    stage: 'Devnet',
    vmType: 'Parallel EVM',
    consensus: 'Centralized Sequencer / Decentralized Provers',
    daLayer: 'EigenDA',
    funding: '$20M Seed (Dragonfly, Vitalik Buterin)',
    description: 'The first "real-time L2" blockchain under active development. Strives to process 100,000 transactions per second with sub-millisecond feedback loops. Offloads state storage to high-end server nodes and leverages parallel, memory-mapped compilation of EVM bytecode.',
    tps: 642,
    avgTps: 580,
    peakTps: 100000,
    blockTime: 0.1,
    gasPrice: 1,
    validators: {
      active: 12,
      total: 12
    },
    commitsPerWeek: 120,
    activeAddresses24h: 31000,
    riskRating: 'High',
    explorerUrl: '',
    githubUrl: 'https://github.com/megaeth-labs',
    website: 'https://megaeth.systems',
    history: [
      { timestamp: '10:00', tps: 450, gasPrice: 0.8, blockTime: 0.1, activeAddresses: 25000 },
      { timestamp: '12:00', tps: 580, gasPrice: 1.0, blockTime: 0.1, activeAddresses: 28000 },
      { timestamp: '14:00', tps: 710, gasPrice: 1.2, blockTime: 0.1, activeAddresses: 32000 },
      { timestamp: '16:00', tps: 615, gasPrice: 0.9, blockTime: 0.1, activeAddresses: 30500 },
      { timestamp: '18:00', tps: 642, gasPrice: 1.0, blockTime: 0.1, activeAddresses: 31000 }
    ],
    validatorNodes: [
      { id: 'me-val-1', name: 'HyperSequencer-HQ-1', status: 'Online', ping: 12, stake: 45.0, version: 'v0.1.0-alpha', blockHeight: 18402910, location: 'Virginia, US' },
      { id: 'me-val-2', name: 'EigenDA-Disperser-A', status: 'Online', ping: 25, stake: 25.0, version: 'v0.1.0-alpha', blockHeight: 18402908, location: 'Frankfurt, DE' },
      { id: 'me-val-3', name: 'Prover-Optimistic-Beta', status: 'Syncing', ping: 84, stake: 10.0, version: 'v0.0.9-alpha', blockHeight: 18402800, location: 'Seoul, KR' }
    ]
  },
  {
    id: 'story',
    name: 'Story Protocol',
    tier: 'L1',
    stage: 'Testnet',
    vmType: 'WASM',
    consensus: 'CometBFT (IP-Engine)',
    daLayer: 'Self-Hosted',
    funding: '$140M VC backing (a16z Crypto, Polychain)',
    description: 'An early-stage Layer-1 blockchain specializing in on-chain Intellectual Property. Builds an "IP Engine" leveraging Cosmos-based consensus wrapped inside a WASM execution framework, enabling seamless licensing, royalties, and tracking of creative assets.',
    tps: 42,
    avgTps: 38,
    peakTps: 800,
    blockTime: 2.2,
    gasPrice: 40,
    validators: {
      active: 64,
      total: 80
    },
    commitsPerWeek: 165,
    activeAddresses24h: 54000,
    riskRating: 'Medium',
    explorerUrl: 'https://storyscan.xyz',
    githubUrl: 'https://github.com/storyprotocol',
    website: 'https://story.foundation',
    history: [
      { timestamp: '10:00', tps: 30, gasPrice: 38, blockTime: 2.2, activeAddresses: 48000 },
      { timestamp: '12:00', tps: 34, gasPrice: 42, blockTime: 2.2, activeAddresses: 51000 },
      { timestamp: '14:00', tps: 58, gasPrice: 45, blockTime: 2.1, activeAddresses: 56000 },
      { timestamp: '16:00', tps: 45, gasPrice: 38, blockTime: 2.2, activeAddresses: 53200 },
      { timestamp: '18:00', tps: 42, gasPrice: 40, blockTime: 2.2, activeAddresses: 54000 }
    ],
    validatorNodes: [
      { id: 's-val-1', name: 'Story-HQ-Sequencer', status: 'Online', ping: 35, stake: 18.2, version: 'v0.9.1', blockHeight: 2840912, location: 'New York, US' },
      { id: 's-val-2', name: 'IP-Staking-Validator', status: 'Online', ping: 48, stake: 12.8, version: 'v0.9.1', blockHeight: 2840912, location: 'Frankfurt, DE' },
      { id: 's-val-3', name: 'Decentralized-Creative', status: 'Online', ping: 58, stake: 9.5, version: 'v0.8.9', blockHeight: 2840909, location: 'Tokyo, JP' }
    ]
  },
  {
    id: 'eclipse',
    name: 'Eclipse',
    tier: 'L2',
    stage: 'Early Mainnet',
    vmType: 'SVM',
    consensus: 'SVM Parallel Executor',
    daLayer: 'Celestia',
    funding: '$500M Valuation ($65M raised)',
    description: 'Ethereum’s first SVM L2, combining the speed of the Solana Virtual Machine (SVM) with Ethereum’s liquidity. Uses Celestia for highly scalable Data Availability.',
    tps: 210,
    avgTps: 180,
    peakTps: 3500,
    blockTime: 0.4,
    gasPrice: 8,
    validators: {
      active: 32,
      total: 35
    },
    commitsPerWeek: 154,
    activeAddresses24h: 124000,
    riskRating: 'Low',
    explorerUrl: 'https://explorer.eclipse.xyz',
    githubUrl: 'https://github.com/Eclipse-Laboratories-Inc',
    website: 'https://eclipse.xyz',
    history: [
      { timestamp: '10:00', tps: 150, gasPrice: 7, blockTime: 0.4, activeAddresses: 110000 },
      { timestamp: '12:00', tps: 175, gasPrice: 9, blockTime: 0.4, activeAddresses: 115000 },
      { timestamp: '14:00', tps: 240, gasPrice: 8, blockTime: 0.4, activeAddresses: 128000 },
      { timestamp: '16:00', tps: 195, gasPrice: 8, blockTime: 0.4, activeAddresses: 122000 },
      { timestamp: '18:00', tps: 210, gasPrice: 8, blockTime: 0.4, activeAddresses: 124000 }
    ],
    validatorNodes: [
      { id: 'ec-val-1', name: 'Eclipse-SVM-Leader', status: 'Online', ping: 25, stake: 35.1, version: 'v1.17.6', blockHeight: 1294801, location: 'Virginia, US' },
      { id: 'ec-val-2', name: 'Bridge-Deposit-Guard', status: 'Online', ping: 31, stake: 25.4, version: 'v1.17.6', blockHeight: 1294801, location: 'Dublin, IE' }
    ]
  }
];

export const TECHNICAL_GUIDELINES = [
  {
    title: 'Data Availability (DA) Vulnerabilities',
    description: 'Early L2s relying on external Alt-DA layers like Celestia must monitor the bridge state and consensus latency. Alt-DAs reduce posting costs by 99% but introduce an extra trust assumption.'
  },
  {
    title: 'Centralization of Sequencers',
    description: 'During early testnets and bootstrap phases, nearly all rollups feature a single centralized sequencer managed by the core developer DAO. A failure in the sequencer halts the transaction flow immediately, raising risk margins.'
  },
  {
    title: 'State Contention & Lockups',
    description: 'Parallel execution engines (Parallel EVM & MoveVM) utilize optimistic concurrent access or strict static state access declaration. Monad and Movement use state-contention resolution software when transactions concurrently edit the same Uniswap pool state.'
  }
];
