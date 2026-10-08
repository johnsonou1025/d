import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Flame,
  Trophy,
  Swords,
  History,
  TrendingUp,
  Crown,
  Headphones,
  Search,
  Bell,
  Wallet,
  ChevronRight,
  TrendingDown,
  Sparkles,
  Zap,
  Clock,
  Send,
  MessageSquare,
  Radio,
  SlidersHorizontal,
  ArrowUpRight,
  ShieldAlert,
  Volume2,
  VolumeX,
  RefreshCw,
  Dices,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Coins
} from 'lucide-react';

// --- Sound Synthesizer via Web Audio API (Zero external assets needed) ---
class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playClick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  playWin() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.15, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.22);
      });
    } catch {}
  }

  playSpin() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      for (let i = 0; i < 6; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300 + i * 80, now + i * 0.04);
        gain.gain.setValueAtTime(0.08, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.035);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.04);
      }
    } catch {}
  }
}

const sounds = new SoundManager();

// --- Types ---
interface StockCard {
  id: string;
  code: string;
  name: string;
  sector: string;
  estRoi: number;
  buyZone: number;
  targetHigh: number;
  stopLoss: number;
  winRate: number;
  multiplier: string;
  hotTag: string;
  tagColor: 'gold' | 'neon' | 'cyan' | 'purple';
  status: 'HOT' | 'ACCUMULATING' | 'EXPLODING' | 'BREAKOUT';
}

interface ActiveBet {
  code: string;
  name: string;
  days: number;
  entryPrice: number;
  currentPrice: number;
  shares: number;
  pnl: number;
  roi: number;
  trend: 'up' | 'down';
}

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  badge: string;
  badgeColor: string;
  time: string;
  text: string;
  isJackpot?: boolean;
}

export default function JoinjoCasinoDashboard() {
  // Navigation & filter state
  const [activeTab, setActiveTab] = useState<'tw' | 'us' | 'crypto'>('tw');
  const [activeNav, setActiveNav] = useState('lobby');
  const [selectedFilter, setSelectedFilter] = useState('hot');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  // Live countdown state (Market Close 13:30:00)
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 22, seconds: 45 });

  // Right sidebar tab state: 'feed' or 'chat'
  const [rightPanelTab, setRightPanelTab] = useState<'feed' | 'chat'>('feed');

  // Chat message input state
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'AlphaTrader_88',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      badge: 'VIP 5',
      badgeColor: 'bg-amber-500 text-black',
      time: '11:42',
      text: '南亞科這波洗盤很漂亮，剛剛在 428.5 加碼 10 張！🎰'
    },
    {
      id: '2',
      user: 'CryptoWhale_TW',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      badge: 'WHALE',
      badgeColor: 'bg-emerald-500 text-black',
      time: '11:43',
      text: '今天大盤攻破 49,700 關卡，多頭莊家全壓了 🚀🚀🚀'
    },
    {
      id: '3',
      user: 'JOINJO_Bot',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      badge: 'SYSTEM',
      badgeColor: 'bg-purple-500 text-white',
      time: '11:44',
      text: '🎉 系統廣播：儒鴻 (2404) 觸及第二停利點，單筆出場獲利 +$190,000！',
      isJackpot: true
    },
    {
      id: '4',
      user: 'QuantMaster',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      badge: 'VIP 3',
      badgeColor: 'bg-amber-500 text-black',
      time: '11:46',
      text: '看好祥碩下午直接鎖死漲停，賠率 4.2x 穩得像送錢 💰'
    }
  ]);

  // Feed updates
  const [liveFeeds, setLiveFeeds] = useState([
    {
      id: 'f1',
      time: '11:47:12',
      type: 'EXIT',
      text: '儒鴻 (2404) 觸及停利點，單筆出場獲利 +$190,000 NTD！',
      badge: '+12.62%',
      color: 'text-[#00e701]'
    },
    {
      id: 'f2',
      time: '11:46:05',
      type: 'BIG_WIN',
      text: '玩家 @Trader_Alpha 在 祥碩 (5269) 獲利翻倍 +84.5%！',
      badge: '+$1,270,000',
      color: 'text-[#ffb800]'
    },
    {
      id: 'f3',
      time: '11:45:20',
      type: 'WHALE',
      text: '巨鯨進場：聯發科 (2454) 湧入 500 口大額多單！',
      badge: '量能爆增 320%',
      color: 'text-cyan-400'
    },
    {
      id: 'f4',
      time: '11:43:55',
      type: 'SIGNAL',
      text: '世芯-KY (3661) 突破波段壓力線，觸發「極速暴賺」波段訊號！',
      badge: 'TARGET 4150',
      color: 'text-fuchsia-400'
    }
  ]);

  // Stock Cards Data (Casino Slot Cards)
  const stockCards: StockCard[] = useMemo(
    () => [
      {
        id: 's1',
        code: '2408.TW',
        name: '南亞科',
        sector: 'DRAM記憶體',
        estRoi: 20.52,
        buyZone: 426.5,
        targetHigh: 514.0,
        stopLoss: 405.0,
        winRate: 88.5,
        multiplier: '3.8x',
        hotTag: '🔥 HOT MULTIPLIER',
        tagColor: 'gold',
        status: 'EXPLODING'
      },
      {
        id: 's2',
        code: '5269.TW',
        name: '祥碩',
        sector: '高速傳輸 IC',
        estRoi: 34.8,
        buyZone: 1880.0,
        targetHigh: 2535.0,
        stopLoss: 1750.0,
        winRate: 91.2,
        multiplier: '4.5x',
        hotTag: '💎 巨鯨重壓',
        tagColor: 'cyan',
        status: 'BREAKOUT'
      },
      {
        id: 's3',
        code: '3661.TW',
        name: '世芯-KY',
        sector: 'ASIC 客製晶片',
        estRoi: 42.15,
        buyZone: 2920.0,
        targetHigh: 4150.0,
        stopLoss: 2720.0,
        winRate: 84.9,
        multiplier: '5.2x',
        hotTag: '🎰 爆擊波段',
        tagColor: 'neon',
        status: 'HOT'
      },
      {
        id: 's4',
        code: '2404.TW',
        name: '儒鴻',
        sector: '機能紡織龍頭',
        estRoi: 16.4,
        buyZone: 512.0,
        targetHigh: 596.0,
        stopLoss: 488.0,
        winRate: 89.7,
        multiplier: '2.9x',
        hotTag: '🛡️ 停損防護盾',
        tagColor: 'purple',
        status: 'ACCUMULATING'
      }
    ],
    []
  );

  // Active Bets Table Data
  const activeBets: ActiveBet[] = useMemo(
    () => [
      {
        code: '2408',
        name: '南亞科',
        days: 12,
        entryPrice: 428.0,
        currentPrice: 502.0,
        shares: 5000,
        pnl: 370000,
        roi: 17.29,
        trend: 'up'
      },
      {
        code: '5269',
        name: '祥碩',
        days: 24,
        entryPrice: 1750.0,
        currentPrice: 2385.0,
        shares: 2000,
        pnl: 1270000,
        roi: 36.29,
        trend: 'up'
      },
      {
        code: '2404',
        name: '儒鴻',
        days: 8,
        entryPrice: 515.0,
        currentPrice: 580.0,
        shares: 3000,
        pnl: 195000,
        roi: 12.62,
        trend: 'up'
      },
      {
        code: '2330',
        name: '台積電',
        days: 45,
        entryPrice: 920.0,
        currentPrice: 1065.0,
        shares: 10000,
        pnl: 1450000,
        roi: 15.76,
        trend: 'up'
      },
      {
        code: '3661',
        name: '世芯-KY',
        days: 3,
        entryPrice: 2980.0,
        currentPrice: 2910.0,
        shares: 1000,
        pnl: -70000,
        roi: -2.35,
        trend: 'down'
      }
    ],
    []
  );

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Audio mute toggle
  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    sounds.enabled = !next;
    if (!next) sounds.playClick();
  };

  // Simulate slot shuffle
  const triggerSlotShuffle = () => {
    sounds.playSpin();
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
      sounds.playWin();
    }, 700);
  };

  // Handle Send Chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    sounds.playClick();
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      user: 'You (Lv.35)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      badge: 'VIP PRO',
      badgeColor: 'bg-[#00e701] text-black',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: chatInput.trim()
    };
    setMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Automated Casino Bot response simulation
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        user: 'CasinoDealer_AI',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        badge: 'AI BOT',
        badgeColor: 'bg-cyan-500 text-black',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: '🔥 收到下注共鳴！目前全服資金強烈聚集中小型半導體族群，勝率模型持續看好！'
      };
      setMessages(p => [...p, botMsg]);
    }, 1200);
  };

  // Navigation menu definitions
  const navItems = [
    { id: 'lobby', label: '戰情大廳', icon: Dices, badge: 'HOT', badgeColor: 'bg-[#ffb800] text-black' },
    { id: 'hotpicks', label: '飆股輪盤', icon: Flame, badge: '98%', badgeColor: 'bg-[#00e701] text-black' },
    { id: 'winnings', label: '爆擊獲利', icon: Trophy, badge: '10x+', badgeColor: 'bg-amber-500/20 text-[#ffb800] border border-[#ffb800]/40' },
    { id: 'activebets', label: '進場中戰局', icon: Swords, badge: '35 檔', badgeColor: 'bg-white/10 text-emerald-400' },
    { id: 'settled', label: '已結算彩池', icon: History },
    { id: 'arena', label: '多空競技場', icon: TrendingUp },
    { id: 'vip', label: 'VIP 策略', icon: Crown, isGold: true },
    { id: 'support', label: '24/7 在線客服', icon: Headphones, isLive: true }
  ];

  return (
    <div className="min-h-screen bg-[#0A0F14] text-slate-100 font-sans selection:bg-[#00e701] selection:text-black flex flex-col antialiased">
      {/* =========================================================================
          1. GLOBAL TOPBAR (Casino VIP Header)
      ========================================================================= */}
      <header className="sticky top-0 z-50 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-white/10 px-4 lg:px-6 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 min-w-[240px]">
          <div className="relative group cursor-pointer flex items-center gap-2.5" onClick={() => sounds.playClick()}>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 p-[1.5px] shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#0A0F14] rounded-[10px] flex items-center justify-center">
                <Crown className="w-5 h-5 text-[#FFB800] drop-shadow-[0_0_8px_rgba(255,184,0,0.8)]" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 font-mono">
                  JOINJO
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-black rounded tracking-widest bg-[#00E701]/10 text-[#00E701] border border-[#00E701]/40 shadow-[0_0_10px_rgba(0,231,1,0.3)]">
                  BET PRO
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-tight">
                量化高勝率彩池平台
              </span>
            </div>
          </div>
        </div>

        {/* Center: Market Chips & Search */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-2xl mx-6">
          {/* Market Chips */}
          <div className="flex items-center p-1 bg-[#151C24] rounded-xl border border-white/10 shadow-inner">
            <button
              onClick={() => {
                setActiveTab('tw');
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'tw'
                  ? 'bg-gradient-to-r from-[#00E701]/20 to-[#00E701]/10 text-[#00E701] border border-[#00E701]/40 shadow-[0_0_12px_rgba(0,231,1,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#00E701] animate-pulse"></span>
              台股現貨
            </button>
            <button
              onClick={() => {
                setActiveTab('us');
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'us'
                  ? 'bg-gradient-to-r from-[#00E701]/20 to-[#00E701]/10 text-[#00E701] border border-[#00E701]/40 shadow-[0_0_12px_rgba(0,231,1,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              美股期貨
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 group">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[#00E701] transition-colors" />
            <input
              type="text"
              placeholder="搜尋飆股代碼 / 翻倍標的 / 策略 (例: 2408 南亞科)..."
              className="w-full bg-[#151C24] text-xs text-white placeholder-slate-500 pl-9 pr-14 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-[#00E701]/60 focus:ring-1 focus:ring-[#00E701]/40 transition-all font-mono"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] text-slate-400 font-mono">
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right: Trader Level EXP Bar, Vault Wallet & Avatar */}
        <div className="flex items-center gap-4">
          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={soundMuted ? '開啟賭場音效' : '靜音'}
            className="p-2 rounded-xl bg-[#151C24] border border-white/10 text-slate-400 hover:text-white hover:border-[#00E701]/40 transition-all"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#00E701]" />}
          </button>

          {/* Trader Level Bar */}
          <div className="hidden xl:flex flex-col items-end gap-1 min-w-[130px]">
            <div className="flex items-center justify-between w-full text-[11px] font-mono font-bold">
              <span className="text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                Lv.35 專業操盤手
              </span>
              <span className="text-slate-400">850/1000</span>
            </div>
            <div className="w-full h-1.5 bg-[#151C24] rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-[#00E701] to-[#00E701] rounded-full shadow-[0_0_8px_#00E701]"
                style={{ width: '85%' }}
              ></div>
            </div>
          </div>

          {/* Vault Wallet (金庫錢包) */}
          <div
            onClick={() => {
              sounds.playWin();
            }}
            className="cursor-pointer group flex items-center gap-2.5 bg-gradient-to-r from-[#151C24] to-[#1A232E] px-3.5 py-1.5 rounded-xl border border-amber-500/30 hover:border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#FFB800] group-hover:scale-105 transition-transform">
              <Wallet className="w-4 h-4 drop-shadow-[0_0_6px_rgba(255,184,0,0.8)]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/80">
                累積總獲利
              </span>
              <span className="text-xs sm:text-sm font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#FFB800] to-yellow-300 drop-shadow-[0_0_8px_rgba(255,184,0,0.4)]">
                $31,483,990 <span className="text-[10px] text-amber-300 font-sans font-normal">NTD</span>
              </span>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-1 border-l border-white/10">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl overflow-hidden p-[1px] bg-gradient-to-br from-[#00E701] to-cyan-500 shadow-[0_0_12px_rgba(0,231,1,0.4)] cursor-pointer hover:scale-105 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                  alt="Trader Avatar"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00E701] border-2 border-[#0A0F14] rounded-full"></span>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN THREE-COLUMN LAYOUT
      ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* =========================================================================
            2. LEFT SIDEBAR NAVIGATION (Classic Dark Casino Bar)
        ========================================================================= */}
        <aside
          className={`${
            sidebarCollapsed ? 'w-20' : 'w-64'
          } shrink-0 bg-[#0D1117] border-r border-white/10 flex flex-col justify-between transition-all duration-300 z-40 hidden md:flex`}
        >
          {/* Nav List */}
          <div className="p-3 space-y-1.5 overflow-y-auto">
            <div className="px-3 py-2 flex items-center justify-between text-slate-500 text-[11px] font-bold tracking-wider uppercase">
              {!sidebarCollapsed && <span>戰術大廳導航</span>}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1 hover:text-white rounded hover:bg-white/5 transition-colors"
                title={sidebarCollapsed ? '展開選單' : '收合選單'}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>

            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    sounds.playClick();
                  }}
                  className={`w-full flex items-center ${
                    sidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'
                  } py-2.5 rounded-xl font-medium text-xs transition-all group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00E701]/15 to-[#00E701]/5 text-[#00E701] border border-[#00E701]/40 shadow-[0_0_15px_rgba(0,231,1,0.25)]'
                      : 'text-slate-400 hover:text-white hover:bg-[#151C24] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'text-[#00E701] drop-shadow-[0_0_8px_#00E701]'
                          : item.isGold
                          ? 'text-[#FFB800] drop-shadow-[0_0_6px_#FFB800]'
                          : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                    {!sidebarCollapsed && (
                      <span className={`tracking-wide ${isActive ? 'font-black text-white' : ''}`}>
                        {item.label}
                      </span>
                    )}
                  </div>

                  {!sidebarCollapsed && (
                    <div>
                      {item.badge && (
                        <span className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                      {item.isLive && (
                        <span className="flex items-center gap-1 text-[10px] text-[#00E701] font-mono font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00E701] animate-ping"></span>
                          24/7
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Bottom Banner & Status */}
          <div className="p-3 border-t border-white/10 space-y-3">
            {!sidebarCollapsed && (
              <div className="p-3 rounded-xl bg-gradient-to-b from-[#151C24] to-[#0A0F14] border border-amber-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl -mr-6 -mt-6 pointer-events-none"></div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                  <Coins className="w-4 h-4 text-amber-400" />
                  VIP 專屬狂暴返水
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  單日跟單達 3 筆，享有交易手續費 0.08% 自動彩金返水！
                </p>
              </div>
            )}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
              {!sidebarCollapsed && <span>FEED LATENCY</span>}
              <span className="text-[#00E701] flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 bg-[#00E701] rounded-full"></span>
                18 ms
              </span>
            </div>
          </div>
        </aside>

        {/* =========================================================================
            3. CENTER MAIN CONTENT HUB
        ========================================================================= */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-7 py-6 space-y-6">
          {/* =====================================================================
              A. HERO DUAL BANNERS (Promotion & Highest Gain Jackpot)
          ===================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Hero Card: Market Rally */}
            <div className="lg:col-span-7 relative rounded-2xl bg-gradient-to-br from-[#121922] via-[#0F141C] to-[#0A0F14] border border-white/10 p-6 sm:p-7 overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.6)] group">
              {/* Background Glows & Laser Grid lines */}
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#00E701]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00E701]/25 transition-all duration-700"></div>
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

              <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E701]/10 border border-[#00E701]/40 text-[#00E701] text-xs font-mono font-bold tracking-wide shadow-[0_0_15px_rgba(0,231,1,0.2)]">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>BULL RUN ACTIVE // 極度強勢週期</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-sans drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                    MARKET RALLY:{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E701] via-emerald-300 to-cyan-400">
                      全面進攻號角
                    </span>
                  </h1>
                  <p className="text-sm text-slate-300 max-w-xl font-medium leading-relaxed">
                    大盤處於絕對安全牛市，三大法人買超破千億！量化強勢策略全軍出擊，鎖定波段漲幅超過 +35% 爆擊標的！
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  {/* Neon Green 3D CTA Button */}
                  <button
                    onClick={() => {
                      sounds.playWin();
                    }}
                    className="relative group/btn overflow-hidden px-6 py-3 rounded-xl bg-[#00E701] text-black font-black text-sm tracking-wide shadow-[0_0_30px_rgba(0,231,1,0.5)] hover:shadow-[0_0_45px_rgba(0,231,1,0.8)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 flex items-center gap-2.5"
                  >
                    <div className="absolute inset-0 bg-white/30 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-200"></div>
                    <Zap className="w-4 h-4 fill-black text-black group-hover/btn:animate-bounce" />
                    <span className="relative z-10">查看今日推薦買進 (3 檔)</span>
                    <ChevronRight className="w-4 h-4 relative z-10" />
                  </button>

                  <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 bg-black/40 px-3 py-2 rounded-lg border border-white/5">
                      <span className="text-slate-500">勝率預期</span>
                      <span className="text-[#00E701] font-bold">92.4%</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 px-3 py-2 rounded-lg border border-white/5">
                      <span className="text-slate-500">外資動能</span>
                      <span className="text-[#FFB800] font-bold">+$48.2B</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Card: Highest Gain Jackpot Timer */}
            <div className="lg:col-span-5 relative rounded-2xl bg-gradient-to-br from-[#18151D] via-[#14121A] to-[#0A0F14] border border-amber-500/30 p-6 sm:p-7 overflow-hidden shadow-[0_10px_35px_rgba(245,158,11,0.15)] flex flex-col justify-between group">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/30 transition-all duration-700"></div>

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wide">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>DAILY JACKPOT // 暴擊累積彩金</span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-300/80 animate-pulse">
                    ● 即時浮動滾動中
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-medium">TODAY'S HIGHEST GAIN POOL</span>
                  {/* Slot Machine Large Rolling Number Display */}
                  <div className="mt-1 flex items-baseline gap-2 font-mono">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-600 drop-shadow-[0_0_20px_rgba(255,184,0,0.5)]">
                      $6,196,200
                    </span>
                    <span className="text-xs font-bold text-amber-400">NTD</span>
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="p-3 rounded-xl bg-black/50 border border-amber-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>距離收盤結算倒數:</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-sm font-black text-amber-400">
                    <span className="px-2 py-0.5 rounded bg-[#1A1822] border border-amber-500/30">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span>:</span>
                    <span className="px-2 py-0.5 rounded bg-[#1A1822] border border-amber-500/30">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span>:</span>
                    <span className="px-2 py-0.5 rounded bg-[#1A1822] border border-amber-500/30 text-[#00E701]">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="relative z-10 pt-4">
                <button
                  onClick={() => {
                    sounds.playSpin();
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs sm:text-sm tracking-wider uppercase hover:brightness-110 active:scale-[0.99] shadow-[0_0_20px_rgba(255,184,0,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>立即參與下注分配彩池</span>
                </button>
              </div>
            </div>
          </div>

          {/* =====================================================================
              B. STRATEGY FILTER PILLS & SHUFFLE
          ===================================================================== */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: 'hot', label: '🔥 今日強勢' },
                { id: 'double', label: '🎰 波段翻倍' },
                { id: 'whale', label: '💎 外資重壓' },
                { id: 'fixed', label: '⚡ 單筆定額 2000NT' },
                { id: 'shield', label: '🛡️ 停損防護' }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setSelectedFilter(filter.id);
                    sounds.playClick();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    selectedFilter === filter.id
                      ? 'bg-gradient-to-r from-[#00E701]/20 to-[#00E701]/10 text-[#00E701] border border-[#00E701]/50 shadow-[0_0_15px_rgba(0,231,1,0.25)]'
                      : 'bg-[#151C24] text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <button
              onClick={triggerSlotShuffle}
              disabled={isSpinning}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#151C24] hover:bg-[#1E2733] border border-white/10 hover:border-[#00E701]/40 text-xs font-bold text-slate-300 hover:text-white transition-all self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#00E701] ${isSpinning ? 'animate-spin' : ''}`} />
              <span>拉霸洗牌推薦</span>
            </button>
          </div>

          {/* =====================================================================
              C. SLOT-STYLE STOCK GRID (強勢股展示卡槽)
          ===================================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {stockCards.map(card => {
              return (
                <div
                  key={card.id}
                  className={`relative rounded-2xl bg-[#151C24] border border-white/10 p-5 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1.5 hover:shadow-[0_12px_35px_rgba(0,231,1,0.2)] hover:border-[#00E701]/60 ${
                    isSpinning ? 'scale-95 blur-[0.5px] opacity-70' : 'scale-100 opacity-100'
                  }`}
                >
                  {/* Subtle top indicator bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00E701]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl"></div>

                  {/* Header: Tag & Odds */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-md tracking-wider bg-amber-500/10 text-[#FFB800] border border-amber-500/30 shadow-[0_0_8px_rgba(255,184,0,0.2)]">
                        {card.hotTag}
                      </span>
                      <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {card.multiplier}
                      </span>
                    </div>

                    {/* Stock Name & Code */}
                    <div className="space-y-0.5">
                      <div className="flex items-baseline justify-between">
                        <h3 className="text-lg font-black text-white group-hover:text-[#00E701] transition-colors">
                          {card.name}
                        </h3>
                        <span className="text-xs font-mono text-slate-400 font-semibold">{card.code}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">{card.sector}</p>
                    </div>

                    {/* Expected ROI Big Numbers */}
                    <div className="mt-4 p-3 rounded-xl bg-[#0D1117] border border-white/5 flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">預估獲利波段</span>
                        <span className="text-2xl font-black font-mono text-[#00E701] drop-shadow-[0_0_12px_rgba(0,231,1,0.4)]">
                          +{card.estRoi}%
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 font-bold block">模型勝率</span>
                        <span className="text-xs font-mono font-bold text-slate-200">{card.winRate}%</span>
                      </div>
                    </div>

                    {/* Slot Machine Metrics */}
                    <div className="mt-4 space-y-2 text-xs font-mono">
                      <div className="flex justify-between items-center text-slate-400">
                        <span>買進區間 (Buy Zone)</span>
                        <span className="font-bold text-white">{card.buyZone.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>目標高點 (Target)</span>
                        <span className="font-bold text-[#FFB800]">{card.targetHigh.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>停損防線 (Stop)</span>
                        <span className="font-bold text-[#FF3366]">{card.stopLoss.toFixed(1)}</span>
                      </div>

                      {/* Visual Progress Bar */}
                      <div className="pt-1">
                        <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full bg-gradient-to-r from-[#00E701] to-[#FFB800] rounded-full"
                            style={{ width: `${Math.min(100, (card.buyZone / card.targetHigh) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bet CTA Button */}
                  <div className="mt-5">
                    <button
                      onClick={() => {
                        sounds.playWin();
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00E701]/20 to-[#00E701]/10 hover:from-[#00E701] hover:to-[#22C55E] text-[#00E701] hover:text-black font-black text-xs tracking-wider border border-[#00E701]/40 hover:border-[#00E701] shadow-[0_0_15px_rgba(0,231,1,0.2)] hover:shadow-[0_0_25px_rgba(0,231,1,0.6)] transition-all duration-200 flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>立即下注跟單 (BET)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* =====================================================================
              D. ROULETTE SENTIMENT (多空雷達指針)
          ===================================================================== */}
          <div className="rounded-2xl bg-[#151C24] border border-white/10 p-6 relative overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              {/* Left Info: Index Point */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00E701] animate-ping"></div>
                  <span className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase">
                    ROULETTE SENTIMENT // 多空雷達儀表
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00E701]/20 text-[#00E701] border border-[#00E701]/30">
                    多頭主控燈號 🟢
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                    49,716.83
                  </span>
                  <span className="text-sm font-mono font-bold text-[#00E701] flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    +1.85% (+905.21)
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  當前多方動能佔比 82.4%，大盤接近歷史壓力突破帶，建議強勢持股續抱！
                </p>
              </div>

              {/* Right Gauge Scale Bar */}
              <div className="flex-1 max-w-xl space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-slate-400">
                    支撐防線: <span className="text-white">45,511.49</span>
                  </span>
                  <span className="text-[#00E701] flex items-center gap-1">
                    <span>● 當前位置 (88% 貪婪)</span>
                  </span>
                  <span className="text-[#FF3366]">
                    壓力關卡: <span className="text-white">49,822.55</span>
                  </span>
                </div>

                {/* Horizontal scale line */}
                <div className="relative w-full h-3 bg-[#0D1117] rounded-full border border-white/10 p-0.5">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-[#00E701] relative">
                    {/* Pin Marker */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-[#00E701] shadow-[0_0_15px_#00E701] flex items-center justify-center cursor-pointer"
                      style={{ left: '84%' }}
                    >
                      <div className="w-1.5 h-1.5 bg-[#00E701] rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>超跌恐慌 (0)</span>
                  <span>中性平衡 (50)</span>
                  <span className="text-[#00E701] font-bold">極度亢奮 (100)</span>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              E. ACTIVE BETS TABLE (持倉戰績表格)
          ===================================================================== */}
          <div className="rounded-2xl bg-[#151C24] border border-white/10 overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-[#00E701] border border-emerald-500/20">
                  <Swords className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    進場中持倉戰績 (ACTIVE BETS)
                    <span className="text-xs font-mono font-black px-2 py-0.5 rounded-full bg-[#00E701]/10 text-[#00E701] border border-[#00E701]/30">
                      35 檔全勝進行中
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">即時盯盤與部位動態盈虧</p>
                </div>
              </div>
              <button
                onClick={() => sounds.playClick()}
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>匯出下注報表</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0D1117] text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-white/5">
                    <th className="py-3 px-4">股票標的 / 代號</th>
                    <th className="py-3 px-4">持有天數</th>
                    <th className="py-3 px-4 text-right">買進均價 (Entry)</th>
                    <th className="py-3 px-4 text-right">目前現價 (Current)</th>
                    <th className="py-3 px-4 text-right">部位股數 (Chips)</th>
                    <th className="py-3 px-4 text-right">未實現損益 (PnL)</th>
                    <th className="py-3 px-4 text-center">報酬率 (ROI)</th>
                    <th className="py-3 px-4 text-right">操盤行動</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs font-mono">
                  {activeBets.map(bet => {
                    const isPositive = bet.roi >= 0;
                    return (
                      <tr
                        key={bet.code}
                        className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                        onClick={() => sounds.playClick()}
                      >
                        <td className="py-3.5 px-4 font-sans">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#00E701]"></span>
                            <span className="font-bold text-white group-hover:text-[#00E701] transition-colors">
                              {bet.name}
                            </span>
                            <span className="text-slate-400 text-xs font-mono">({bet.code})</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">{bet.days} 天</td>
                        <td className="py-3.5 px-4 text-right font-medium text-slate-300">
                          {bet.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-white">
                          {bet.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-400">
                          {bet.shares.toLocaleString()} 股
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold">
                          <span className={isPositive ? 'text-[#00E701]' : 'text-[#FF3366]'}>
                            {isPositive ? '+' : ''}${bet.pnl.toLocaleString()} NTD
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full font-black text-xs font-mono shadow-sm ${
                              isPositive
                                ? 'bg-[#00E701]/15 text-[#00E701] border border-[#00E701]/40 shadow-[0_0_10px_rgba(0,231,1,0.2)]'
                                : 'bg-[#FF3366]/15 text-[#FF3366] border border-[#FF3366]/40 shadow-[0_0_10px_rgba(255,51,102,0.2)]'
                            }`}
                          >
                            {isPositive ? '+' : ''}{bet.roi.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                sounds.playWin();
                              }}
                              className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-[#00E701] text-[#00E701] hover:text-black border border-emerald-500/20 font-bold text-[11px] transition-all"
                            >
                              鎖利出場
                            </button>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                sounds.playClick();
                              }}
                              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-[11px] transition-all"
                            >
                              加碼
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* =========================================================================
            4. RIGHT SIDEBAR (Live Casino Feed & Interactive Community Chat)
        ========================================================================= */}
        <aside className="w-80 shrink-0 bg-[#0D1117] border-l border-white/10 flex flex-col justify-between hidden xl:flex z-40">
          {/* Header Switch: Live Feed vs Chat */}
          <div className="p-3 border-b border-white/10">
            <div className="grid grid-cols-2 p-1 bg-[#151C24] rounded-xl border border-white/5 text-xs font-bold">
              <button
                onClick={() => {
                  setRightPanelTab('feed');
                  sounds.playClick();
                }}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  rightPanelTab === 'feed'
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-[#FFB800] border border-amber-500/40 shadow-[0_0_10px_rgba(255,184,0,0.2)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>即時大獎戰報</span>
              </button>
              <button
                onClick={() => {
                  setRightPanelTab('chat');
                  sounds.playClick();
                }}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  rightPanelTab === 'chat'
                    ? 'bg-gradient-to-r from-[#00E701]/20 to-[#00E701]/10 text-[#00E701] border border-[#00E701]/40 shadow-[0_0_10px_rgba(0,231,1,0.2)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>高玩交流區</span>
              </button>
            </div>
          </div>

          {/* Body Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {rightPanelTab === 'feed' ? (
              // Live Casino Winnings Ticker
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    LIVE JACKPOT TICKER
                  </span>
                  <span>1,842 在線操盤</span>
                </div>

                {liveFeeds.map(feed => (
                  <div
                    key={feed.id}
                    className="p-3 rounded-xl bg-[#151C24] border border-white/5 hover:border-amber-500/30 transition-all space-y-1.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-500">{feed.time}</span>
                      <span className={`font-black px-1.5 py-0.2 rounded bg-black/40 ${feed.color}`}>
                        {feed.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed">{feed.text}</p>
                  </div>
                ))}

                <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/20 text-center space-y-1">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                    ★ 今日榮譽榜最高單筆獲利 ★
                  </span>
                  <div className="text-xl font-black font-mono text-[#FFB800] drop-shadow-[0_0_8px_rgba(255,184,0,0.5)]">
                    +$1,450,000 NTD
                  </div>
                  <span className="text-[11px] text-slate-400">玩家 @TitanTrader (台積電 10張波段)</span>
                </div>
              </div>
            ) : (
              // Live Interactive Community Chat (Stake / Roobet Style)
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                  <span className="text-[#00E701] font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00E701] animate-ping"></span>
                    STAKE VIP CHAT
                  </span>
                  <span className="text-slate-500">延遲: 12ms</span>
                </div>

                <div className="space-y-2.5">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`p-2.5 rounded-xl border text-xs transition-all ${
                        msg.isJackpot
                          ? 'bg-purple-950/30 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                          : 'bg-[#151C24] border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={msg.avatar}
                            alt={msg.user}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className="font-bold text-slate-200 text-[11px]">{msg.user}</span>
                          <span className={`text-[9px] font-mono font-black px-1 rounded ${msg.badgeColor}`}>
                            {msg.badge}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{msg.time}</span>
                      </div>
                      <p className="text-slate-300 font-normal leading-relaxed text-[11px]">{msg.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Interactive Chat Input */}
          <div className="p-3 border-t border-white/10 bg-[#0D1117]">
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="發送操盤觀點 / 喊單..."
                className="w-full bg-[#151C24] text-xs text-white placeholder-slate-500 pl-3 pr-10 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#00E701]/60 focus:ring-1 focus:ring-[#00E701]/30 transition-all font-mono"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#00E701] text-black hover:brightness-110 active:scale-95 transition-all shadow-[0_0_10px_#00E701]"
              >
                <Send className="w-3.5 h-3.5 fill-black" />
              </button>
            </form>
            <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-500">
              <span>快捷表情: 🚀 🔥 🎰 💎</span>
              <span className="text-slate-400 font-mono">ENTER 發送</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

