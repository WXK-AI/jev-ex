import dotenv from 'dotenv';
dotenv.config();

const TYPESAFE_API_KEY = process.env.TYPESAFE_API_KEY || '';
const TYPESAFE_API_URL = 'https://api.typesafe.ai/v1/systemone';

// Supported assets for paper trading
export const SUPPORTED_ASSETS = [
  { symbol: 'BTCUSDT', name: 'Bitcoin', base: 'BTC', quote: 'USDT', decimals: 2, icon: '₿' },
  { symbol: 'ETHUSDT', name: 'Ethereum', base: 'ETH', quote: 'USDT', decimals: 2, icon: 'Ξ' },
  { symbol: 'SOLUSDT', name: 'Solana', base: 'SOL', quote: 'USDT', decimals: 2, icon: '◎' },
  { symbol: 'BNBUSDT', name: 'BNB', base: 'BNB', quote: 'USDT', decimals: 2, icon: '⬡' }
];

export class TradingEngine {
  constructor() {
    this.initialBalance = 100000; // $100,000 USDT paper capital
    this.cash = this.initialBalance;
    this.positions = []; // Array of open positions
    this.tradeHistory = []; // Array of closed trades
    this.orderLog = []; // Executed orders
    
    // Live Market Data Cache
    this.marketData = {};
    for (const asset of SUPPORTED_ASSETS) {
      this.marketData[asset.symbol] = {
        symbol: asset.symbol,
        name: asset.name,
        price: 0,
        change24h: 0,
        high24h: 0,
        low24h: 0,
        volume24h: 0,
        candles: [], // Array of { timestamp, open, high, low, close, volume }
        indicators: {
          rsi: 50,
          ema9: 0,
          ema21: 0,
          macd: { macd: 0, signal: 0, hist: 0 },
          bollinger: { upper: 0, middle: 0, lower: 0 }
        },
        lastUpdated: null
      };
      this.generateSyntheticCandles(asset.symbol);
    }

    // Bot Configuration & State
    this.botRunning = false;
    this.botIntervalMs = 3500; // 3.5-second autonomous reflex tick
    this.scanIndex = 0;
    this.activeSymbol = 'BTCUSDT';
    this.riskProfile = 'balanced'; // 'conservative' | 'balanced' | 'aggressive'
    this.maxPositionAllocationPct = 25; // max 25% portfolio per trade
    this.defaultStopLossPct = 1.8;
    this.defaultTakeProfitPct = 3.5;
    this.simulatedFeeRate = 0.0004; // 0.04% taker fee
    this.simulatedSlippageRate = 0.0002; // 0.02% slippage

    // Equity curve snapshots
    this.equityHistory = [
      { timestamp: Date.now() - 60000, equity: this.initialBalance, pnl: 0 },
      { timestamp: Date.now(), equity: this.initialBalance, pnl: 0 }
    ];
    this.lastEquityTime = Date.now();
    this.listeners = [];

    // Jev Telemetry & Latest Decisions
    this.latestJevReflex = null;
    this.marketDecisions = {}; // Latest decision for each supported asset
    this.decisionHistory = [];
    this.activityLogs = []; // Live execution audit log
    this.autonomousMode = true; // 100% Autonomous Jev Decision Maker
    this.totalJevCalls = 0;
    this.totalJevTokensUsed = 0;
    this.peakEquity = this.initialBalance;
    this.maxDrawdown = 0;

    // Timer handle
    this.botTimer = null;

    // Seed market data immediately
    this.initMarketData();
  }

  logActivity(icon, text, type = 'info') {
    const entry = {
      id: 'act-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      timestamp: Date.now(),
      icon,
      text,
      type
    };
    this.activityLogs.unshift(entry);
    if (this.activityLogs.length > 60) this.activityLogs.pop();
    this.notifyListeners();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners() {
    if (this.listeners.length === 0) return;
    const state = this.getState();
    for (const listener of this.listeners) {
      try { listener(state); } catch (e) {}
    }
  }

  // Calculate technical indicators on candle array
  calculateIndicators(candles) {
    if (!candles || candles.length < 20) {
      const lastClose = candles.length > 0 ? candles[candles.length - 1].close : 100;
      return {
        rsi: 50,
        ema9: lastClose,
        ema21: lastClose,
        macd: { macd: 0, signal: 0, hist: 0 },
        bollinger: { upper: lastClose * 1.02, middle: lastClose, lower: lastClose * 0.98 }
      };
    }

    const closes = candles.map(c => c.close);
    
    // EMA helper
    const calcEMA = (period, data) => {
      const k = 2 / (period + 1);
      let ema = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
      for (let i = period; i < data.length; i++) {
        ema = data[i] * k + ema * (1 - k);
      }
      return ema;
    };

    // RSI (14)
    let gains = 0;
    let losses = 0;
    for (let i = 1; i <= 14; i++) {
      const diff = closes[i] - closes[i - 1];
      if (diff >= 0) gains += diff;
      else losses -= diff;
    }
    let avgGain = gains / 14;
    let avgLoss = losses / 14;
    for (let i = 15; i < closes.length; i++) {
      const diff = closes[i] - closes[i - 1];
      const gain = diff > 0 ? diff : 0;
      const loss = diff < 0 ? -diff : 0;
      avgGain = (avgGain * 13 + gain) / 14;
      avgLoss = (avgLoss * 13 + loss) / 14;
    }
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = avgLoss === 0 ? 100 : Math.round((100 - (100 / (1 + rs))) * 10) / 10;

    // EMAs
    const ema9 = Math.round(calcEMA(9, closes) * 100) / 100;
    const ema21 = Math.round(calcEMA(21, closes) * 100) / 100;

    // Bollinger Bands (20 periods, 2 std dev)
    const recent20 = closes.slice(-20);
    const middle = recent20.reduce((a, b) => a + b, 0) / 20;
    const variance = recent20.reduce((a, b) => a + Math.pow(b - middle, 2), 0) / 20;
    const stdDev = Math.sqrt(variance);
    const upper = Math.round((middle + stdDev * 2) * 100) / 100;
    const lower = Math.round((middle - stdDev * 2) * 100) / 100;

    // Simple MACD
    const ema12 = calcEMA(12, closes);
    const ema26 = calcEMA(26, closes);
    const macdLine = Math.round((ema12 - ema26) * 100) / 100;
    const signalLine = Math.round(macdLine * 0.85 * 100) / 100;
    const hist = Math.round((macdLine - signalLine) * 100) / 100;

    return {
      rsi,
      ema9,
      ema21,
      macd: { macd: macdLine, signal: signalLine, hist },
      bollinger: { upper, middle: Math.round(middle * 100) / 100, lower }
    };
  }

  // Fetch live market data from Binance US Public API (with robust failover)
  async fetchLiveMarketData() {
    try {
      // 1. Fetch 24hr tickers from Binance US (or global fallback)
      const symbolsParam = JSON.stringify(SUPPORTED_ASSETS.map(a => a.symbol));
      let res = await fetch(`https://api.binance.us/api/v3/ticker/24hr?symbols=${encodeURIComponent(symbolsParam)}`, {
        signal: AbortSignal.timeout(6000)
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(symbolsParam)}`, {
          signal: AbortSignal.timeout(6000)
        }).catch(() => null);
      }
      
      if (res && res.ok) {
        const tickers = await res.json();
        if (Array.isArray(tickers)) {
          for (const t of tickers) {
            const item = this.marketData[t.symbol];
            if (item) {
              item.price = parseFloat(t.lastPrice);
              item.change24h = parseFloat(t.priceChangePercent);
              item.high24h = parseFloat(t.highPrice);
              item.low24h = parseFloat(t.lowPrice);
              item.volume24h = parseFloat(t.quoteVolume);
              item.lastUpdated = Date.now();
            }
          }
        }
      } else {
        this.simulatePriceFluctuation();
      }

      // 2. Fetch candles for active symbol
      await this.fetchCandlesForSymbol(this.activeSymbol);

      // 3. Mark positions to market and check Stop Loss / Take Profit
      this.evaluateOpenPositions();

    } catch (err) {
      console.warn('Live market data fetch fallback:', err.message);
      this.simulatePriceFluctuation();
    }
  }

  // Fetch 1m candles for a symbol
  async fetchCandlesForSymbol(symbol) {
    try {
      const coinbaseMap = {
        'BTCUSDT': 'BTC-USD',
        'ETHUSDT': 'ETH-USD',
        'SOLUSDT': 'SOL-USD'
      };

      // 1. Try Coinbase API for rich, institutional-grade liquid candles
      if (coinbaseMap[symbol]) {
        const cbProduct = coinbaseMap[symbol];
        const cbRes = await fetch(`https://api.exchange.coinbase.com/products/${cbProduct}/candles?granularity=60`, {
          signal: AbortSignal.timeout(5000),
          headers: { 'User-Agent': 'Mozilla/5.0' }
        }).catch(() => null);

        if (cbRes && cbRes.ok) {
          const data = await cbRes.json();
          // Coinbase format: [time, low, high, open, close, volume]
          if (Array.isArray(data) && data.length > 0) {
            const candles = data.slice(0, 40).reverse().map(d => ({
              timestamp: d[0] * 1000,
              low: parseFloat(d[1]),
              high: parseFloat(d[2]),
              open: parseFloat(d[3]),
              close: parseFloat(d[4]),
              volume: parseFloat(d[5])
            }));
            this.marketData[symbol].candles = candles;
            this.marketData[symbol].indicators = this.calculateIndicators(candles);
            if (!this.marketData[symbol].price || isNaN(this.marketData[symbol].price)) {
              this.marketData[symbol].price = candles[candles.length - 1].close;
            }
            return;
          }
        }
      }

      // 2. Fallback to Binance US (or global)
      let res = await fetch(`https://api.binance.us/api/v3/klines?symbol=${symbol}&interval=1m&limit=40`, {
        signal: AbortSignal.timeout(6000)
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=40`, {
          signal: AbortSignal.timeout(6000)
        }).catch(() => null);
      }

      if (res && res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const candles = data.map(d => {
            let open = parseFloat(d[1]);
            let high = parseFloat(d[2]);
            let low = parseFloat(d[3]);
            let close = parseFloat(d[4]);
            const volume = parseFloat(d[5]);

            // If candle has zero spread (illiquid minute), enrich with natural micro-wick
            const currentSpread = high - low;
            const minSpread = close * 0.0008;
            if (currentSpread < minSpread) {
              const half = (minSpread - currentSpread) / 2;
              high = Math.round((Math.max(high, open, close) + half) * 100) / 100;
              low = Math.round((Math.min(low, open, close) - half) * 100) / 100;
              if (open === close) {
                open = Math.round((close - half * 0.5) * 100) / 100;
              }
            }

            return {
              timestamp: d[0],
              open,
              high,
              low,
              close,
              volume
            };
          });

          this.marketData[symbol].candles = candles;
          this.marketData[symbol].indicators = this.calculateIndicators(candles);
          if (this.marketData[symbol].price === 0 || isNaN(this.marketData[symbol].price)) {
            this.marketData[symbol].price = candles[candles.length - 1].close;
          }
        }
      }
    } catch (err) {
      // If candle fetch fails, extrapolate from existing
      const item = this.marketData[symbol];
      if (item && (!item.candles || item.candles.length === 0)) {
        this.generateSyntheticCandles(symbol);
      }
    }
  }

  // Generate synthetic candles if completely offline
  generateSyntheticCandles(symbol) {
    const basePrice = symbol.startsWith('BTC') ? 76900 : symbol.startsWith('ETH') ? 2470 : symbol.startsWith('SOL') ? 102 : 730;
    const candles = [];
    let cur = basePrice;
    const now = Date.now();
    for (let i = 40; i >= 0; i--) {
      const delta = (Math.random() - 0.49) * (basePrice * 0.003);
      const open = cur;
      cur = Math.max(1, cur + delta);
      const high = Math.max(open, cur) + Math.random() * (basePrice * 0.001);
      const low = Math.min(open, cur) - Math.random() * (basePrice * 0.001);
      candles.push({
        timestamp: now - i * 60000,
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(cur * 100) / 100,
        volume: Math.round(Math.random() * 50 + 10)
      });
    }
    this.marketData[symbol].candles = candles;
    this.marketData[symbol].price = cur;
    this.marketData[symbol].indicators = this.calculateIndicators(candles);
    this.marketData[symbol].lastUpdated = now;
  }

  // Simulate small micro-fluctuations between live network ticks (orderbook bid-ask depth)
  simulatePriceFluctuation() {
    for (const symbol in this.marketData) {
      const asset = this.marketData[symbol];
      if (!asset.price || asset.price <= 0) {
        this.generateSyntheticCandles(symbol);
        continue;
      }
      const tickDelta = (Math.random() - 0.49) * (asset.price * 0.0006);
      asset.price = Math.round((asset.price + tickDelta) * 100) / 100;
      if (asset.candles && asset.candles.length > 0) {
        const last = asset.candles[asset.candles.length - 1];
        last.close = asset.price;
        if (asset.price > last.high) last.high = asset.price;
        if (asset.price < last.low) last.low = asset.price;
      }
    }
    this.evaluateOpenPositions();
  }

  // Initialize market data on startup
  async initMarketData() {
    for (const asset of SUPPORTED_ASSETS) {
      if (!this.marketData[asset.symbol].price || this.marketData[asset.symbol].price <= 0) {
        this.generateSyntheticCandles(asset.symbol);
      }
    }
    await this.fetchLiveMarketData();
    for (const asset of SUPPORTED_ASSETS) {
      if (!this.marketData[asset.symbol].candles || this.marketData[asset.symbol].candles.length === 0) {
        await this.fetchCandlesForSymbol(asset.symbol);
      }
    }

    // Set periodic price polling every 4 seconds from Binance US
    setInterval(() => {
      this.fetchLiveMarketData().catch(() => {});
    }, 4000);

    // Micro-tick orderbook fluctuation every 1.5 seconds for visible live activity
    setInterval(() => {
      this.simulatePriceFluctuation();
    }, 1500);
  }

  // Query TypeSafe Jev System-1 API for an ultra-fast trading decision
  async queryJevTradingReflex(symbol = this.activeSymbol, manualContext = null) {
    const asset = this.marketData[symbol];
    if (!asset || asset.price <= 0) {
      await this.fetchLiveMarketData();
    }

    const currentPrice = this.marketData[symbol].price;
    const indicators = this.marketData[symbol].indicators;
    const change24h = this.marketData[symbol].change24h;
    const existingPosition = this.positions.find(p => p.symbol === symbol);

    // Build market state string
    const state = `
[ROLE: FULL AUTONOMOUS QUANTITATIVE DECISION MAKER - ZERO HUMAN INTERVENTION]
You have 100% complete execution authority over this live crypto paper portfolio.
There is NO human in the loop. You determine all market entries, position exits, sizing, and risk cutoffs.

[TARGET ASSET: ${symbol}]
Current Mark Price: $${currentPrice.toLocaleString()}
24h Price Change: ${change24h > 0 ? '+' : ''}${change24h.toFixed(2)}%
RSI(14): ${indicators.rsi} (${indicators.rsi < 30 ? 'OVERSOLD - POTENTIAL MEAN REVERSION BOUNCE' : indicators.rsi > 70 ? 'OVERBOUGHT - EXHAUSTION REJECTION RISK' : 'NEUTRAL TREND ZONE'})
EMA(9): $${indicators.ema9} | EMA(21): $${indicators.ema21} (Trend Alignment: ${indicators.ema9 > indicators.ema21 ? 'BULLISH MOMENTUM' : 'BEARISH MOMENTUM'})
MACD Histogram: ${indicators.macd.hist} (Momentum Vector: ${indicators.macd.hist > 0 ? 'ACCELERATING POSITIVE' : 'ACCELERATING NEGATIVE'})
Bollinger Upper: $${indicators.bollinger.upper} | Lower: $${indicators.bollinger.lower}
Current Position on ${symbol}: ${existingPosition ? `${existingPosition.side} active with PnL $${existingPosition.unrealizedPnl} (${existingPosition.roi}%)` : 'No active position'}
Cash Available: $${Math.round(this.cash).toLocaleString()} USDT
Total Portfolio Value: $${Math.round(this.calculateTotalEquity()).toLocaleString()} USDT
Risk Setting: ${this.riskProfile}
${manualContext ? `Autonomous Note: ${manualContext}` : ''}
`.trim();

    const jevPayload = {
      state,
      model: 'jev-latest',
      questions: {
        action: {
          type: 'choice',
          instructions: `Determine the immediate quantitative trading action for ${symbol} based on momentum, RSI, Bollinger Bands, and current exposure.`,
          criteria: {
            BUY: 'Open LONG position or add to position: Bullish momentum, oversold bounce, or strong breakout confirmation',
            SELL: 'Open SHORT position or exit long: Bearish rejection, overbought exhaustion, or breakdown below support',
            HOLD: 'Wait in cash or hold current position: Insufficient confluence or mixed signals',
            TAKE_PROFIT: 'Lock in profits immediately if existing position has reached favorable target',
            STOP_LOSS: 'Emergency market exit if trend invalidated or adverse risk detected'
          }
        },
        conviction_level: {
          type: 'score',
          instructions: 'Rate the statistical edge and conviction score of this setup from 0 to 4',
          criteria: [
            '0 - Negligible edge / Low volume chop',
            '1 - Weak signal / High false-breakout probability',
            '2 - Moderate confluence / Standard technical trade',
            '3 - High conviction / Strong multi-indicator alignment',
            '4 - Institutional breakout / Extreme asymmetric risk-reward'
          ]
        },
        risk_allocation: {
          type: 'choice',
          instructions: 'Select recommended position sizing (% of portfolio capital)',
          criteria: {
            conservative_5pct: '5% capital allocation (low risk test entry)',
            moderate_12pct: '12% capital allocation (standard swing trade)',
            aggressive_25pct: '25% capital allocation (high conviction breakout entry)',
            minimum_hold: '0% capital allocation (do not deploy capital)'
          }
        },
        stop_loss_profile: {
          type: 'choice',
          instructions: 'Select optimal Stop Loss protection distance',
          criteria: {
            tight_1pct: 'Tight 1.0% stop loss (scalping / volatile market)',
            standard_2pct: 'Standard 2.0% stop loss (swing swing)',
            wide_3pct: 'Wide 3.5% stop loss (trend following with breathing room)'
          }
        },
        fast_reflex_valid: {
          type: 'noul',
          instructions: 'Does this trade have positive expected value (+EV)?'
        }
      }
    };

    const startTime = Date.now();
    let jevResponse;

    try {
      const resp = await fetch(TYPESAFE_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TYPESAFE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jevPayload),
        signal: AbortSignal.timeout(5000)
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Jev API error ${resp.status}: ${errText}`);
      }

      jevResponse = await resp.json();
    } catch (err) {
      console.error('TypeSafe Jev API call failed:', err.message);
      // Fallback algorithmic heuristic if network hiccup
      jevResponse = this.generateFallbackReflex(symbol, indicators);
    }

    const latencyMs = Date.now() - startTime;
    this.totalJevCalls++;
    const tokens = (jevResponse.usage?.input_tokens || 450) + (jevResponse.usage?.output_tokens || 90);
    this.totalJevTokensUsed += tokens;

    const answers = jevResponse.answers || {};
    const actionChoice = answers.action?.choice || 'HOLD';
    const convictionScore = answers.conviction_level?.score ?? 2.0;
    const riskChoice = answers.risk_allocation?.choice || 'moderate_12pct';
    const stopLossChoice = answers.stop_loss_profile?.choice || 'standard_2pct';
    const evProb = answers.fast_reflex_valid?.noul ?? 0.55;

    // Parse sizing
    let allocationPct = 10;
    if (riskChoice.includes('25pct')) allocationPct = 25;
    else if (riskChoice.includes('12pct')) allocationPct = 12;
    else if (riskChoice.includes('5pct')) allocationPct = 5;
    else if (riskChoice.includes('minimum_hold')) allocationPct = 0;

    // Parse stop loss
    let stopLossPct = 2.0;
    if (stopLossChoice.includes('1pct')) stopLossPct = 1.0;
    else if (stopLossChoice.includes('3pct')) stopLossPct = 3.5;

    const takeProfitPct = Math.round(stopLossPct * 2.2 * 10) / 10; // 2.2:1 risk/reward

    const decisionRecord = {
      id: 'jev-' + Date.now(),
      timestamp: Date.now(),
      symbol,
      price: currentPrice,
      action: actionChoice,
      conviction_score: convictionScore,
      action_probabilities: answers.action?.probabilities || { BUY: 0.33, SELL: 0.33, HOLD: 0.34 },
      confidence: answers.action?.confidence || 0.85,
      allocation_pct: allocationPct,
      stop_loss_pct: stopLossPct,
      take_profit_pct: takeProfitPct,
      expected_value_prob: evProb,
      latency_ms: latencyMs,
      tokens,
      cost_usd: (tokens * 0.042) / 1000000,
      model: jevResponse.model || 'jev-latest',
      state_snapshot: state
    };

    this.latestJevReflex = decisionRecord;
    this.marketDecisions[symbol] = decisionRecord;
    this.decisionHistory.unshift(decisionRecord);
    if (this.decisionHistory.length > 50) this.decisionHistory.pop();

    this.logActivity(
      actionChoice === 'BUY' ? '⚡' : actionChoice === 'SELL' ? '🔻' : actionChoice === 'TAKE_PROFIT' ? '🎯' : '⏸️',
      `Jev Reflex [${symbol}]: ${actionChoice} | Conviction: ${convictionScore.toFixed(2)}/4.0 | Latency: ${latencyMs}ms | Model: ${decisionRecord.model}`,
      actionChoice === 'BUY' ? 'order' : actionChoice === 'SELL' ? 'order' : 'decision'
    );

    // Execute the paper trading action based on Jev decision
    this.executeJevDecision(decisionRecord);

    return decisionRecord;
  }

  // Fallback heuristic if API is unreachable
  generateFallbackReflex(symbol, indicators) {
    let action = 'HOLD';
    if (indicators.rsi < 32 && indicators.macd.hist > 0) action = 'BUY';
    else if (indicators.rsi > 68 && indicators.macd.hist < 0) action = 'SELL';
    
    return {
      model: 'jev-reflex-local-guard',
      answers: {
        action: { choice: action, confidence: 0.78, probabilities: { BUY: action === 'BUY' ? 0.7 : 0.15, SELL: action === 'SELL' ? 0.7 : 0.15, HOLD: 0.3 } },
        conviction_level: { score: 2.3, confidence: 0.65 },
        risk_allocation: { choice: 'moderate_12pct' },
        stop_loss_profile: { choice: 'standard_2pct' },
        fast_reflex_valid: { noul: 0.62 }
      },
      usage: { input_tokens: 420, output_tokens: 80 }
    };
  }

  // Execute paper trading action derived from Jev System-1 Reflex
  executeJevDecision(decision) {
    const { symbol, action, conviction_score, allocation_pct, stop_loss_pct, take_profit_pct, price } = decision;
    const existingPosition = this.positions.find(p => p.symbol === symbol);

    // If an existing position is open for this asset:
    if (existingPosition) {
      // Reversal or Take Profit or Scalp target
      if (action === 'TAKE_PROFIT' || 
         (action === 'SELL' && existingPosition.side === 'LONG' && conviction_score >= 1.2) ||
         (action === 'BUY' && existingPosition.side === 'SHORT' && conviction_score >= 1.2) ||
         (existingPosition.roi >= 1.2 && action !== existingPosition.side)) {
        this.closePosition(existingPosition.id, `Jev AI Autonomous Signal: ${action} (Conviction: ${conviction_score.toFixed(1)}/4.0)`);
      } else if (action === 'STOP_LOSS') {
        this.closePosition(existingPosition.id, 'Jev AI Emergency Protective Stop Loss');
      }
      return { executed: true };
    }

    // If NO position exists for this asset:
    // Only execute if conviction is high enough (>= 1.15 out of 4)
    if (conviction_score < 1.15 && action !== 'STOP_LOSS' && action !== 'TAKE_PROFIT') {
      return { executed: false, reason: 'Conviction below threshold' };
    }

    const effectiveAlloc = allocation_pct > 0 ? allocation_pct : 12;
    const capitalToUse = Math.min(this.cash * 0.35, Math.max(1000, this.cash * (effectiveAlloc / 100)));

    if (action === 'BUY') {
      if (this.cash >= 1000) {
        this.openPosition(symbol, 'LONG', capitalToUse, stop_loss_pct, take_profit_pct, 'Jev AI Bullish Confluence');
      }
    } else if (action === 'SELL') {
      if (this.cash >= 1000) {
        this.openPosition(symbol, 'SHORT', capitalToUse, stop_loss_pct, take_profit_pct, 'Jev AI Bearish Momentum');
      }
    }

    return { executed: true };
  }

  // Open a paper position
  openPosition(symbol, side, marginAmount, stopLossPct, takeProfitPct, reason = 'Manual Order') {
    const asset = this.marketData[symbol];
    if (!asset || asset.price <= 0) return null;

    // Apply simulated slippage
    const slippage = side === 'LONG' 
      ? asset.price * (1 + this.simulatedSlippageRate)
      : asset.price * (1 - this.simulatedSlippageRate);
    
    const entryPrice = Math.round(slippage * 100) / 100;
    const fee = Math.round(marginAmount * this.simulatedFeeRate * 100) / 100;

    if (this.cash < marginAmount + fee) {
      return null; // Insufficient cash
    }

    this.cash -= (marginAmount + fee);

    const quantity = marginAmount / entryPrice;
    
    // Stop Loss & Take Profit absolute prices
    const slPrice = side === 'LONG'
      ? entryPrice * (1 - (stopLossPct / 100))
      : entryPrice * (1 + (stopLossPct / 100));

    const tpPrice = side === 'LONG'
      ? entryPrice * (1 + (takeProfitPct / 100))
      : entryPrice * (1 - (takeProfitPct / 100));

    const position = {
      id: 'pos-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      symbol,
      side, // 'LONG' or 'SHORT'
      margin: Math.round(marginAmount * 100) / 100,
      quantity,
      entryPrice,
      currentPrice: entryPrice,
      stopLossPrice: Math.round(slPrice * 100) / 100,
      takeProfitPrice: Math.round(tpPrice * 100) / 100,
      stopLossPct,
      takeProfitPct,
      highestPrice: entryPrice,
      lowestPrice: entryPrice,
      trailingActive: false,
      unrealizedPnl: 0,
      roi: 0,
      feesPaid: fee,
      openedAt: Date.now(),
      entryReason: reason
    };

    this.positions.push(position);
    this.logActivity(
      side === 'LONG' ? '🚀' : '📉',
      `AUTONOMOUS ORDER: Opened ${side} on ${symbol} @ $${entryPrice} (Margin: $${Math.round(marginAmount).toLocaleString()} USDT) | SL: $${position.stopLossPrice} | TP: $${position.takeProfitPrice}`,
      'order'
    );
    this.notifyListeners();

    this.orderLog.unshift({
      id: 'ord-' + Date.now(),
      timestamp: Date.now(),
      symbol,
      type: 'MARKET_OPEN',
      side,
      price: entryPrice,
      margin: marginAmount,
      fee,
      reason
    });

    return position;
  }

  // Close an open position
  closePosition(positionId, reason = 'Market Close') {
    const idx = this.positions.findIndex(p => p.id === positionId);
    if (idx === -1) return null;

    const pos = this.positions[idx];
    const asset = this.marketData[pos.symbol];
    const currentPrice = asset ? asset.price : pos.currentPrice;

    // Apply slippage on exit
    const exitPrice = pos.side === 'LONG'
      ? currentPrice * (1 - this.simulatedSlippageRate)
      : currentPrice * (1 + this.simulatedSlippageRate);

    const priceDiff = pos.side === 'LONG'
      ? (exitPrice - pos.entryPrice)
      : (pos.entryPrice - exitPrice);

    const exitFee = (pos.margin * this.simulatedFeeRate);
    const rawProfit = (priceDiff / pos.entryPrice) * pos.margin;
    const netProfit = Math.round((rawProfit - exitFee) * 100) / 100;
    const totalReturned = Math.max(0, pos.margin + netProfit);

    this.cash += totalReturned;

    const closedTrade = {
      id: pos.id,
      symbol: pos.symbol,
      side: pos.side,
      margin: pos.margin,
      entryPrice: pos.entryPrice,
      exitPrice: Math.round(exitPrice * 100) / 100,
      netProfit,
      roi: Math.round((netProfit / pos.margin) * 10000) / 100,
      openedAt: pos.openedAt,
      closedAt: Date.now(),
      durationSec: Math.round((Date.now() - pos.openedAt) / 1000),
      exitReason: reason,
      totalFees: Math.round((pos.feesPaid + exitFee) * 100) / 100
    };

    this.logActivity(
      netProfit >= 0 ? '💰' : '🛡️',
      `AUTONOMOUS EXIT: Closed ${pos.symbol} ${pos.side} @ $${Math.round(exitPrice * 100) / 100} (PnL: ${netProfit >= 0 ? '+' : ''}$${netProfit} / ROI: ${closedTrade.roi}%) [${reason}]`,
      netProfit >= 0 ? 'tp' : 'sl'
    );

    this.positions.splice(idx, 1);
    this.tradeHistory.unshift(closedTrade);
    if (this.tradeHistory.length > 100) this.tradeHistory.pop();

    this.orderLog.unshift({
      id: 'ord-' + Date.now(),
      timestamp: Date.now(),
      symbol: pos.symbol,
      type: 'MARKET_CLOSE',
      side: pos.side === 'LONG' ? 'SELL' : 'BUY',
      price: Math.round(exitPrice * 100) / 100,
      profit: netProfit,
      reason
    });

    return closedTrade;
  }

  // Mark all positions to market and evaluate automated SL/TP
  evaluateOpenPositions() {
    for (let i = this.positions.length - 1; i >= 0; i--) {
      const pos = this.positions[i];
      const asset = this.marketData[pos.symbol];
      if (!asset || asset.price <= 0) continue;

      pos.currentPrice = asset.price;
      const priceDiff = pos.side === 'LONG'
        ? (pos.currentPrice - pos.entryPrice)
        : (pos.entryPrice - pos.currentPrice);

      pos.unrealizedPnl = Math.round(((priceDiff / pos.entryPrice) * pos.margin) * 100) / 100;
      pos.roi = Math.round((pos.unrealizedPnl / pos.margin) * 10000) / 100;

      // Trailing Stop Loss Dynamic Ratchet
      if (pos.side === 'LONG') {
        if (!pos.highestPrice || pos.currentPrice > pos.highestPrice) {
          pos.highestPrice = pos.currentPrice;
          if (pos.currentPrice > pos.entryPrice * 1.008) {
            pos.trailingActive = true;
            const newSL = Math.round(pos.highestPrice * (1 - (pos.stopLossPct / 100)) * 100) / 100;
            if (newSL > pos.stopLossPrice) {
              pos.stopLossPrice = newSL;
            }
          }
        }
      } else if (pos.side === 'SHORT') {
        if (!pos.lowestPrice || pos.currentPrice < pos.lowestPrice) {
          pos.lowestPrice = pos.currentPrice;
          if (pos.currentPrice < pos.entryPrice * 0.992) {
            pos.trailingActive = true;
            const newSL = Math.round(pos.lowestPrice * (1 + (pos.stopLossPct / 100)) * 100) / 100;
            if (newSL < pos.stopLossPrice) {
              pos.stopLossPrice = newSL;
            }
          }
        }
      }

      // Check Take Profit trigger
      if (pos.side === 'LONG' && pos.currentPrice >= pos.takeProfitPrice) {
        this.closePosition(pos.id, `Take Profit Hit ($${pos.takeProfitPrice})`);
        continue;
      } else if (pos.side === 'SHORT' && pos.currentPrice <= pos.takeProfitPrice) {
        this.closePosition(pos.id, `Take Profit Hit ($${pos.takeProfitPrice})`);
        continue;
      }

      // Check Stop Loss trigger
      if (pos.side === 'LONG' && pos.currentPrice <= pos.stopLossPrice) {
        const exitMsg = pos.trailingActive ? `Trailing Stop Triggered ($${pos.stopLossPrice})` : `Stop Loss Hit ($${pos.stopLossPrice})`;
        this.closePosition(pos.id, exitMsg);
        continue;
      } else if (pos.side === 'SHORT' && pos.currentPrice >= pos.stopLossPrice) {
        const exitMsg = pos.trailingActive ? `Trailing Stop Triggered ($${pos.stopLossPrice})` : `Stop Loss Hit ($${pos.stopLossPrice})`;
        this.closePosition(pos.id, exitMsg);
        continue;
      }
    }

    // Update peak equity and max drawdown
    const currentEquity = this.calculateTotalEquity();
    if (currentEquity > this.peakEquity) {
      this.peakEquity = currentEquity;
    }
    const currentDD = ((this.peakEquity - currentEquity) / this.peakEquity) * 100;
    if (currentDD > this.maxDrawdown) {
      this.maxDrawdown = Math.round(currentDD * 100) / 100;
    }

    // Update equity history
    const now = Date.now();
    if (!this.lastEquityTime || now - this.lastEquityTime >= 4000) {
      this.lastEquityTime = now;
      this.equityHistory.push({
        timestamp: now,
        equity: currentEquity,
        pnl: Math.round((currentEquity - this.initialBalance) * 100) / 100
      });
      if (this.equityHistory.length > 60) this.equityHistory.shift();
    }

    this.notifyListeners();
  }

  // Calculate total equity (cash + unrealized PnL of all open positions)
  calculateTotalEquity() {
    let positionEquity = 0;
    for (const pos of this.positions) {
      positionEquity += (pos.margin + pos.unrealizedPnl);
    }
    return Math.round((this.cash + positionEquity) * 100) / 100;
  }

  // Start Autonomous Trading Loop (100% Autonomous, Zero Human Needed)
  startBot() {
    if (this.botRunning) return;
    this.botRunning = true;
    this.scanIndex = 0;
    console.log('🤖 100% Autonomous Jev Paper Trading Bot ACTIVATED (Zero Human Needed)');
    this.logActivity('🤖', '100% Autonomous Jev Quant Bot ACTIVATED — Continuous Multi-Asset Scanning', 'scan');

    // Trigger immediate first step
    this.stepAutonomousBrain().catch(console.error);

    // Step every 3.5 seconds
    this.botTimer = setInterval(async () => {
      if (!this.botRunning) return;
      try {
        await this.stepAutonomousBrain();
      } catch (err) {
        console.error('Autonomous bot step error:', err);
      }
    }, this.botIntervalMs);
  }

  // Step autonomous brain on next target in rotation
  async stepAutonomousBrain() {
    const asset = SUPPORTED_ASSETS[this.scanIndex % SUPPORTED_ASSETS.length];
    this.scanIndex++;
    const symbol = asset.symbol;

    const existingPosition = this.positions.find(p => p.symbol === symbol);
    const context = existingPosition
      ? `Autonomous Position Review: ${symbol} ${existingPosition.side} (PnL: $${existingPosition.unrealizedPnl}, ROI: ${existingPosition.roi}%)`
      : `Autonomous Opportunity Basket Scan for ${symbol}`;

    try {
      await this.queryJevTradingReflex(symbol, context);
    } catch (e) {
      console.warn(`Autonomous step error for ${symbol}:`, e.message);
    }
  }

  // Full autonomous multi-asset scan cycle (can be triggered on-demand)
  async runAutonomousScanCycle() {
    await this.fetchLiveMarketData();
    for (const asset of SUPPORTED_ASSETS) {
      try {
        await this.queryJevTradingReflex(asset.symbol, 'Autonomous Full Basket Refresh');
        await new Promise(r => setTimeout(r, 300));
      } catch (e) {
        console.warn(`Autonomous scan error for ${asset.symbol}:`, e.message);
      }
    }
  }

  // Stop Autonomous Trading Loop
  stopBot() {
    this.botRunning = false;
    if (this.botTimer) {
      clearInterval(this.botTimer);
      this.botTimer = null;
    }
    this.logActivity('⏸️', 'Autonomous Jev Bot PAUSED by operator', 'info');
    console.log('⏸️ Autonomous Jev Paper Trading Bot PAUSED');
  }

  // Inject a market shock (stress test Jev's emergency reflex)
  async injectMarketShock(symbol = this.activeSymbol, percentChange = -3.5, label = 'Flash Crash Shock') {
    let asset = this.marketData[symbol];
    if (!asset || asset.price <= 0) {
      await this.fetchLiveMarketData();
      asset = this.marketData[symbol];
    }
    if (!asset || asset.price <= 0) return null;

    const multiplier = 1 + (percentChange / 100);
    asset.price = Math.round(asset.price * multiplier * 100) / 100;
    asset.change24h += percentChange;

    if (asset.candles && asset.candles.length > 0) {
      const last = asset.candles[asset.candles.length - 1];
      last.close = asset.price;
      if (asset.price < last.low) last.low = asset.price;
      if (asset.price > last.high) last.high = asset.price;
    }

    asset.indicators = this.calculateIndicators(asset.candles);

    this.evaluateOpenPositions();

    // Trigger instant Jev emergency reflex
    return await this.queryJevTradingReflex(symbol, `${label} (${percentChange > 0 ? '+' : ''}${percentChange}% price dislocation)`);
  }

  // Reset paper portfolio
  resetAccount() {
    this.positions = [];
    this.tradeHistory = [];
    this.orderLog = [];
    this.activityLogs = [];
    this.cash = this.initialBalance;
    this.peakEquity = this.initialBalance;
    this.maxDrawdown = 0;
    this.latestJevReflex = null;
    this.marketDecisions = {};
    this.logActivity('🔄', 'Paper Portfolio Reset to $100,000 USDT — Autonomous Brain Ready', 'info');
    return this.getState();
  }

  // Get full serializable state for dashboard
  getState() {
    const totalEquity = this.calculateTotalEquity();
    const totalPnL = Math.round((totalEquity - this.initialBalance) * 100) / 100;
    const totalPnLPct = Math.round((totalPnL / this.initialBalance) * 10000) / 100;

    // Performance metrics
    const wins = this.tradeHistory.filter(t => t.netProfit > 0);
    const losses = this.tradeHistory.filter(t => t.netProfit < 0);
    const winRate = this.tradeHistory.length > 0 
      ? Math.round((wins.length / this.tradeHistory.length) * 1000) / 10 
      : 0;

    const grossProfit = wins.reduce((acc, t) => acc + t.netProfit, 0);
    const grossLoss = Math.abs(losses.reduce((acc, t) => acc + t.netProfit, 0));
    const profitFactor = grossLoss === 0 
      ? (grossProfit > 0 ? 99.9 : 1.0) 
      : Math.round((grossProfit / grossLoss) * 100) / 100;

    return {
      botRunning: this.botRunning,
      botIntervalMs: this.botIntervalMs,
      activeSymbol: this.activeSymbol,
      riskProfile: this.riskProfile,
      portfolio: {
        totalEquity,
        cash: Math.round(this.cash * 100) / 100,
        initialBalance: this.initialBalance,
        totalPnL,
        totalPnLPct,
        peakEquity: Math.round(this.peakEquity * 100) / 100,
        maxDrawdownPct: this.maxDrawdown,
        winRate,
        profitFactor,
        totalTrades: this.tradeHistory.length,
        winningTrades: wins.length,
        losingTrades: losses.length,
        equityHistory: this.equityHistory
      },
      positions: this.positions,
      tradeHistory: this.tradeHistory.slice(0, 25),
      orderLog: this.orderLog.slice(0, 25),
      activityLogs: this.activityLogs.slice(0, 40),
      scanIndex: this.scanIndex,
      activeMarket: this.marketData[this.activeSymbol] || {},
      allMarkets: Object.values(this.marketData).map(m => ({
        symbol: m.symbol,
        name: m.name,
        price: m.price,
        change24h: m.change24h,
        high24h: m.high24h,
        low24h: m.low24h,
        volume24h: m.volume24h,
        candles: m.candles || [],
        indicators: m.indicators
      })),
      latestJevReflex: this.latestJevReflex,
      marketDecisions: this.marketDecisions,
      autonomousMode: this.autonomousMode,
      decisionHistory: this.decisionHistory.slice(0, 20),
      telemetry: {
        totalCalls: this.totalJevCalls,
        totalTokens: this.totalJevTokensUsed,
        totalCostUsd: Math.round(((this.totalJevTokensUsed * 0.042) / 1000000) * 10000) / 10000,
        averageLatencyMs: this.decisionHistory.length > 0
          ? Math.round(this.decisionHistory.reduce((acc, d) => acc + d.latency_ms, 0) / this.decisionHistory.length)
          : 150
      }
    };
  }

  getTradesCsv() {
    const headers = ['ID', 'Symbol', 'Side', 'Margin_USDT', 'Entry_Price', 'Exit_Price', 'Net_Profit_USDT', 'ROI_Pct', 'Duration_Sec', 'Exit_Reason'];
    const rows = this.tradeHistory.map(t => [
      t.id,
      t.symbol,
      t.side,
      t.margin,
      t.entryPrice,
      t.exitPrice,
      t.netProfit,
      t.roi,
      t.durationSec,
      `"${(t.exitReason || '').replace(/"/g, '""')}"`
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}

// Export singleton instance
export const tradingEngine = new TradingEngine();
