import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'motion/react';

declare const puter: any;
import { 
  Send, 
  Bot, 
  User, 
  Settings, 
  Layers, 
  ShieldCheck, 
  BarChart3, 
  Trash2, 
  Download,
  Moon,
  Sun,
  Zap,
  ChevronRight,
  Menu,
  X,
  Bug,
  Code2,
  Terminal,
  Activity,
  AlertTriangle,
  Fingerprint,
  Link2,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { cn } from './lib/utils';
import { Message, ModelId, AnalysisResult } from './types';
import { chatWithAI, analyzeText, safetyCheck } from './services/aiService';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [codeContext, setCodeContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<ModelId>('poolside/laguna-m.1:free');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [theme, setTheme] = useState<'ice' | 'dark' | 'neon'>('dark');
  const [activeTab, setActiveTab] = useState<'context' | 'chat'>('context');
  const [isLanding, setIsLanding] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check initial auth state
    if (typeof puter !== 'undefined' && puter.auth.isSignedIn()) {
      puter.auth.getUser().then(setUser);
    }
  }, []);

  const handleLogin = async () => {
    if (typeof puter === 'undefined') return;
    try {
      const user = await puter.auth.signIn();
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    if (typeof puter === 'undefined') return;
    puter.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (overrideInput?: string) => {
    const activeInput = overrideInput ?? input;
    if (!activeInput.trim() || isLoading) return;

    const userPrompt = activeInput.trim();
    const fullPrompt = codeContext.trim() 
      ? `CONTEXT CODE:\n${codeContext.trim()}\n\nQUERY:\n${userPrompt}` 
      : userPrompt;
    
    if (!overrideInput) setInput('');

    // Safety Layer
    const safety = safetyCheck(userPrompt);
    if (!safety.safe) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'user',
        content: userPrompt,
        timestamp: Date.now()
      }, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ ${safety.reason}`,
        timestamp: Date.now()
      }]);
      return;
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userPrompt,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await chatWithAI(fullPrompt, model);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Real-time Analysis
      const newAnalysis = analyzeText(response);
      setAnalysis(newAnalysis);

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I encountered an error connecting to the Ice Cube engine. Please check your connection or try again.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setAnalysis(null);
  };

  const exportChat = () => {
    const data = JSON.stringify(messages, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ice-cube-chat-${Date.now()}.json`;
    a.click();
  };

  const runDiagnosis = async () => {
    if (!codeContext.trim() || isLoading) return;
    const diagnosisPrompt = `CRITICAL FORENSIC AUDIT: 
1. Map entire logic tree and identify pattern anomalies.
2. Search for race conditions, non-deterministic flows, and state corruptions.
3. Identify silent logical failures and structural anti-patterns.
4. Output a comprehensive integrity report with actionable patches.`;
    handleSend(diagnosisPrompt);
  };

  return (
    <div className={cn(
      "min-h-screen w-full flex overflow-hidden font-sans text-slate-100 transition-all duration-700 bg-[#020617]",
      theme === 'neon' && "bg-[#050505] text-cyan-500",
      theme === 'ice' && "bg-[#f0f9ff] text-slate-900"
    )}>
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none design-gradient opacity-60" />

      <AnimatePresence mode="wait">
        {isLanding ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ scale: 1.1, filter: "blur(40px)", opacity: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-[#020617] text-white overflow-hidden p-4 sm:p-10"
          >
            {/* Advanced Background: Grid & Stochastic Patterns */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div 
                className="absolute inset-0 opacity-[0.15]" 
                style={{ 
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(6, 182, 212, 0.3) 1px, transparent 0)`,
                  backgroundSize: '40px 40px' 
                }} 
              />
              <motion.div 
                animate={{ 
                  backgroundPosition: ['0px 0px', '40px 40px'],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage: 'linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)',
                  backgroundSize: '100px 100px'
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,transparent_70%)]" />
            </div>

            <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center px-4 sm:px-0">
              {/* Left Column: Vision & Identity */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left"
              >
                <div className="flex items-center gap-4 mb-6 sm:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center backdrop-blur-xl shrink-0">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[9px] sm:text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">System v4</span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left">Active Runtime</span>
                  </div>
                </div>

                <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 sm:mb-8 leading-[0.85] bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/30 text-center lg:text-left">
                  CODE<br className="hidden sm:block"/> FORENSICS.
                </h1>

                <p className="text-slate-400 text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-md sm:max-w-lg mb-8 sm:mb-10 mx-auto lg:mx-0">
                  A high-integrity structural auditing engine designed to trace <span className="text-white">logical anomalies</span> and <span className="text-white">deterministic failures</span> across complex dependency chains.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsLanding(false)}
                    className="w-full sm:px-10 py-4 sm:py-5 bg-cyan-500 text-black font-black rounded-xl text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-[0_15px_50px_rgba(6,182,212,0.3)] active:scale-95"
                  >
                    Initiate Audit Terminal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={handleLogin}
                    className="w-full sm:px-10 py-4 sm:py-5 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 backdrop-blur-xl active:scale-95"
                  >
                    <Fingerprint className="w-4 h-4 text-cyan-400" />
                    Operator Login
                  </motion.button>
                </div>
              </motion.div>

              {/* Right Column: Code Simulation Overlay */}
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="hidden lg:block relative"
              >
                <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                  {/* Scanner Bar */}
                  <motion.div 
                    animate={{ y: [0, 400, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-0 h-10 bg-gradient-to-b from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 z-20 pointer-events-none"
                  />
                  
                  <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-500/50" />
                      <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 ml-4">LIVE_ANALYSIS_STREAM.sh</span>
                  </div>

                  <div className="space-y-4 font-mono text-[11px] leading-relaxed">
                    <div className="flex gap-4">
                      <span className="text-slate-600">01</span>
                      <span className="text-cyan-400">const</span>
                      <span className="text-white">auditChain = </span>
                      <span className="text-emerald-400">async</span>
                      <span className="text-white">() =&gt; &#123;</span>
                    </div>
                    <div className="flex gap-4 pl-4">
                      <span className="text-slate-600">02</span>
                      <span className="text-cyan-400">await</span>
                      <span className="text-white">pattern.trace(&apos;P0_ANOMALY&apos;);</span>
                    </div>
                    <div className="flex gap-4 pl-4 bg-red-500/10 border-y border-red-500/20 py-1">
                      <span className="text-red-500 font-bold">ERR</span>
                      <span className="text-white">Structural failure detected @ 0x4F2A</span>
                    </div>
                    <div className="flex gap-4 pl-4">
                      <span className="text-slate-600">04</span>
                      <span className="text-white">resolveIntegrity(state);</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-slate-600">05</span>
                      <span className="text-white">&#125;;</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Activity className="w-3 h-3 text-cyan-400" />
                        <span className="text-[8px] font-black text-cyan-500 uppercase">Detection</span>
                      </div>
                      <span className="text-xl font-black">99.8%</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span className="text-[8px] font-black text-emerald-500 uppercase">Resolved</span>
                      </div>
                      <span className="text-xl font-black">1.4s</span>
                    </div>
                  </div>
                </div>

                {/* Floating Orbitals */}
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-10 -right-10 w-40 h-40 border border-cyan-500/10 rounded-full border-dashed"
                />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-20 -left-20 w-60 h-60 border border-blue-500/10 rounded-full border-dashed"
                />
              </motion.div>
            </div>

            {/* Bottom Telemetry Bar */}
            <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
              <div className="flex items-start gap-8">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocol</span>
                  <span className="text-[11px] font-bold text-slate-400">ICE_CUBE_FORENSICS_CORE_V4</span>
                </div>
                <div className="hidden sm:flex flex-col gap-1">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Latency</span>
                  <span className="text-[11px] font-bold text-cyan-500">STOCHASTIC_READY</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 bg-cyan-500 rounded-sm"
                    />
                  ))}
                </div>
                <span className="text-[9px] font-mono text-slate-600">SYSTEM_NOMINAL_ENCRYPTED</span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <>
            {/* Mobile Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -256, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -256, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed lg:relative w-64 h-screen z-50 bg-white/5 backdrop-blur-3xl border-r border-white/10 flex flex-col p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold tracking-tight text-lg text-white">Ice Cube</span>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-1 text-slate-400 hover:text-white"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
              </div>

              <nav className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block ml-1">Ice Cube Instance</label>
                  <div className="p-4 rounded-xl bg-white/10 border border-white/20 ring-1 ring-white/10 flex flex-col gap-1 shadow-inner">
                    <span className="text-sm font-semibold text-white">Ice Cube Logic</span>
                    <span className="text-[10px] text-cyan-400 font-mono tracking-tighter opacity-80">STABLE-REV-03</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block ml-1">Navigation</label>
                  <div className="space-y-1">
                    <button onClick={clearChat} className="w-full flex items-center gap-3 text-sm text-slate-400 px-2 py-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all group">
                      <div className="w-5 h-5 flex items-center justify-center border border-slate-700 group-hover:border-white rounded text-[10px]">+</div>
                      <span>Initialize Session</span>
                    </button>
                    <button onClick={exportChat} className="w-full flex items-center gap-3 text-sm text-slate-400 px-2 py-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all">
                      <Download className="w-4 h-4" />
                      <span>Telemetry Export</span>
                    </button>
                  </div>
                </div>
              </nav>

              <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold uppercase tracking-widest">Protocol</span>
                  <span className="text-emerald-400 font-bold tracking-widest">ENCRYPTED</span>
                </div>
              </div>
              {/* User Profile */}
              <div className="pt-6 border-t border-white/5 space-y-4">
                {user ? (
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} className="w-8 h-8 rounded-full border border-cyan-400/30" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white truncate max-w-[100px]">{user.username}</span>
                        <span className="text-[9px] text-slate-500 uppercase">Researcher</span>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleLogin}
                    className="w-full py-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[10px] font-bold text-cyan-400 uppercase tracking-widest hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <User className="w-3 h-3" />
                    Authorize
                  </button>
                )}
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsLanding(true)}
                    className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 transition-all text-slate-400"
                  >
                    Back to Terminal
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen relative z-10 transition-all duration-500 overflow-hidden">
        {/* Header Bar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-black/20 backdrop-blur-sm border-b border-white/5 shrink-0 z-20">
          <div className="flex items-center gap-4 sm:gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-400 hover:text-white transition-all bg-white/5 rounded-lg border border-white/10"
            >
              <ChevronRight className={cn("w-5 h-5 transition-transform duration-500", sidebarOpen && "rotate-180")} />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden xs:inline-block">Ice Cube Framework: Active</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest xs:hidden">Active</span>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 items-center">
            {user && (
              <div className="hidden xs:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] text-cyan-400 font-bold">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                {user.username}
              </div>
            )}
            <div className="hidden sm:block px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] text-slate-300 font-mono">Sync: 12ms</div>
            <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] text-slate-300 font-mono uppercase tracking-tighter">Encrypted Cloud</div>
          </div>
        </header>

        {/* Split View Container */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* Mobile Tab Switcher */}
          <div className="lg:hidden flex border-b border-white/5 bg-black/40 shrink-0 p-1.5 gap-1.5 sticky top-0 z-40 backdrop-blur-md">
            <button 
              onClick={() => setActiveTab('context')}
              className={cn(
                "flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                activeTab === 'context' 
                  ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                  : "text-slate-500 border border-transparent"
              )}
            >
              <Code2 className="w-3.5 h-3.5" />
              Source
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={cn(
                "flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                activeTab === 'chat' 
                  ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                  : "text-slate-500 border border-transparent"
              )}
            >
              <Terminal className="w-3.5 h-3.5" />
              Audit
            </button>
          </div>
          
          {/* Left Panel: Code Workspace */}
          <div className={cn(
            "w-full lg:w-1/2 flex flex-col border-r border-white/5 bg-black/20 transition-all duration-300 relative",
            activeTab !== 'context' && "hidden lg:flex"
          )}>
            {/* Scanning Overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-cyan-500/5 z-20 pointer-events-none overflow-hidden"
                >
                  <motion.div 
                    animate={{ y: ['0%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="h-px w-full bg-cyan-400 shadow-[0_0_20px_#06b6d4] opacity-50"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-b border-white/5 bg-white/5 relative z-10">
              <div className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Context Engine</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={runDiagnosis}
                  disabled={!codeContext.trim() || isLoading}
                  className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-[9px] text-cyan-400 font-bold uppercase tracking-widest hover:bg-cyan-500/20 transition-all disabled:opacity-30 flex items-center gap-2 group shadow-[0_0_10px_rgba(6,182,212,0.1)] active:scale-95"
                >
                  <Activity className="w-3 h-3 group-hover:animate-pulse" />
                  <span>Diagnose</span>
                </motion.button>
                <div className="w-px h-4 bg-white/10" />
                {codeContext && (
                  <button 
                    onClick={() => setCodeContext('')}
                    className="p-1 text-red-400/40 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 rotate-90" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 relative overflow-hidden flex flex-col">
              <div className="flex-1 overflow-auto custom-scrollbar flex">
                {/* Line Numbers Simulation */}
                <div className="w-12 bg-black/40 border-r border-white/5 pt-6 px-2 text-right select-none sticky left-0 z-10 shrink-0">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div key={i} className="text-[9px] font-mono text-slate-800 leading-relaxed mb-0.5">{(i + 1).toString().padStart(2, '0')}</div>
                  ))}
                </div>
                <div className="relative flex-1">
                  <textarea
                    value={codeContext}
                    onChange={(e) => setCodeContext(e.target.value)}
                    placeholder="// Enter system logic or source code for deep inspection..."
                    className="w-full h-full min-h-[500px] lg:min-h-full bg-transparent p-6 text-xs sm:text-sm font-mono text-cyan-100/90 placeholder:text-slate-800 outline-none resize-none leading-relaxed"
                  />
                  
                  {/* Floating HUD over code */}
                  <div className="absolute bottom-6 right-6 flex flex-col gap-2 pointer-events-none opacity-40 hover:opacity-100 transition-opacity z-20">
                    <div className="px-3 py-1.5 rounded bg-black/80 border border-white/10 text-[9px] font-mono text-cyan-500 flex items-center gap-2 backdrop-blur-md">
                      <Activity className="w-3 h-3" />
                      INSPECT MODE: ACTIVE
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Chat Interface */}
          <div className={cn(
            "w-full lg:w-1/2 flex flex-col bg-black/10 relative transition-all duration-300",
            activeTab !== 'chat' && "hidden lg:flex"
          )}>
            <div className="lg:hidden px-6 py-2 border-b border-white/5 bg-black/40 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                 <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Instruction Console</span>
               </div>
            </div>
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 sm:px-10 py-8 space-y-10 scroll-smooth custom-scrollbar"
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                    <motion.div 
                      key="hero-icon"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,211,238,0.2)] p-[1px]"
                    >
                      <div className="w-full h-full rounded-[23px] bg-slate-950 flex items-center justify-center">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0]
                          }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Zap className="w-8 h-8 text-cyan-400" />
                        </motion.div>
                      </div>
                    </motion.div>
                    <h2 className="text-3xl font-bold tracking-tighter mb-4 text-white">Ice Cube 
                      <span className="text-cyan-500 ml-2 font-mono">FORENSICS</span>
                    </h2>
                    <p className="text-slate-400 text-[11px] leading-relaxed mb-10 opacity-70 max-w-xs">High-Accuracy Pattern Recognition & Forensic Code Audit. Deploying multi-threaded logical trace protocols for deep bug discovery.</p>
                    <div className="grid grid-cols-1 gap-3 w-full">
                      {[
                        "Trace implicit logic vulnerabilities",
                        "Audit state-machine transitions",
                        "Analyze asynchronous race conditions"
                      ].map(suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => handleSend(suggestion)}
                          className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all text-[10px] font-medium text-slate-400 hover:text-white text-left group flex items-center justify-between"
                        >
                          <span>{suggestion}</span>
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 text-cyan-400" />
                        </button>
                      ))}
                    </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={cn(
                      "flex flex-col gap-3",
                      msg.role === 'user' ? "items-end" : "items-start"
                    )}
                  >
                    <div className="flex items-center gap-2 px-1">
                      {msg.role === 'assistant' ? (
                        <>
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                          <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Ice Cube Response</span>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">User Instruction</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                        </>
                      )}
                    </div>
                    <div className={cn(
                      "max-w-[95%] px-6 py-4 rounded-2xl text-sm leading-relaxed shadow-xl relative group font-sans",
                      msg.role === 'user' 
                        ? "bg-slate-800/40 border border-white/5 text-slate-200" 
                        : "bg-cyan-500/[0.03] border border-cyan-500/20 text-cyan-50/90 backdrop-blur-md"
                    )}>
                      <div className="absolute -left-px top-4 bottom-4 w-0.5 bg-cyan-500/40 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
              {isLoading && (
                <div className="flex flex-col items-start gap-3">
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" />
                    <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Synthesizing Logic...</span>
                  </div>
                  <div className="bg-cyan-500/[0.03] border border-cyan-500/20 px-6 py-4 rounded-2xl flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse [animation-delay:0.4s]" />
                    </div>
                    <span className="text-[10px] text-cyan-400/60 font-mono tracking-widest">INGESTING DATASET</span>
                  </div>
                </div>
              )}
            </div>

            {/* Telemetry Floating Layer - Forensic Mode */}
            <AnimatePresence>
              {analysis && (
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className="absolute bottom-32 right-10 pointer-events-none w-64 hidden xl:block z-30"
                >
                  <div className="p-5 rounded-2xl bg-black/80 border border-cyan-500/30 backdrop-blur-3xl space-y-4 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <Fingerprint className="w-4 h-4 text-cyan-400" />
                        <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Audit Engine</span>
                      </div>
                      <Activity className="w-3 h-3 text-cyan-500 animate-pulse" />
                    </div>
                    
                    <div className="space-y-3">
                       <div className="flex justify-between items-center text-[10px]">
                         <span className="text-slate-500 uppercase tracking-tighter">Pattern Anomaly</span>
                         <span className="text-cyan-400 font-mono font-bold">DETECTED</span>
                       </div>
                       
                       <div className="relative h-12 w-full bg-white/5 rounded-lg overflow-hidden flex items-center justify-center">
                         <div className="absolute inset-x-0 h-px bg-cyan-500/20 top-1/4" />
                         <div className="absolute inset-x-0 h-px bg-cyan-500/20 top-2/4" />
                         <div className="absolute inset-x-0 h-px bg-cyan-500/20 top-3/4" />
                         <motion.div 
                           animate={{ 
                             x: [-100, 100],
                             opacity: [0, 1, 0]
                           }}
                           transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                           className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent skew-x-12"
                         />
                         <div className="flex gap-1 h-full items-end pb-2 px-2">
                           {[...Array(12)].map((_, i) => (
                             <motion.div 
                               key={i}
                               animate={{ height: [10, 20 + Math.random() * 20, 10] }}
                               transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                               className="w-1 bg-cyan-500/40 rounded-full"
                             />
                           ))}
                         </div>
                       </div>

                       <div className="flex justify-between items-center text-[10px] pt-1">
                         <span className="text-slate-500 uppercase tracking-tighter">Chain Persistence</span>
                         <span className="text-red-500 font-mono italic">HIGH_RISK</span>
                       </div>

                       <div className="grid grid-cols-2 gap-2 mt-4">
                         <div className="p-2 rounded bg-white/5 border border-white/10 flex flex-col items-center">
                           <ShieldCheck className="w-3 h-3 text-emerald-400 mb-1" />
                           <span className="text-[8px] text-slate-500">Integrity</span>
                         </div>
                         <div className="p-2 rounded bg-white/5 border border-white/10 flex flex-col items-center">
                           <Link2 className="w-3 h-3 text-cyan-400 mb-1" />
                           <span className="text-[8px] text-slate-500">Chains</span>
                         </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Engine */}
            <footer className="p-4 sm:p-8 bg-black/40 backdrop-blur-3xl border-t border-white/5">
              <div className="max-w-3xl mx-auto relative group px-2 sm:px-0">
                <AnimatePresence>
                  {codeContext.trim() && (
                    <motion.div 
                      initial={{ y: 5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 5, opacity: 0 }}
                      className="absolute -top-12 right-2 sm:right-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 shadow-lg backdrop-blur-md"
                    >
                      <ShieldCheck className="w-3 h-3 text-cyan-400" />
                      <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">Logic Loaded</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="relative bg-slate-900/80 border border-white/10 rounded-2xl h-14 flex items-center px-4 backdrop-blur-xl shadow-2xl focus-within:border-cyan-500/50 transition-all">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Instruct Ice Cube..."
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 outline-none"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSend()}
                    disabled={isLoading || !input.trim()}
                    className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center hover:bg-cyan-400 transition-all disabled:opacity-30 disabled:grayscale shadow-[0_0_15px_rgba(6,182,212,0.4)] ml-2"
                  >
                    <Send className="w-4 h-4 text-black" />
                  </motion.button>
                </div>
              </div>
              <div className="mt-3 flex justify-center gap-4 text-[9px] text-slate-700 font-bold uppercase tracking-tighter opacity-60">
                <span>Cloud Runtime</span>
                <span>•</span>
                <span>Encrypted Path</span>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
