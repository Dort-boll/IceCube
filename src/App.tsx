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
  ChevronDown,
  Github,
  GitBranch,
  Search,
  CheckCircle2,
  GitGraph,
  Network
} from 'lucide-react';
import { cn } from './lib/utils';
import { Message, ModelId, AnalysisResult } from './types';
import { chatWithAI, analyzeText, safetyCheck } from './services/aiService';

export default function App() {
  const [isVerified, setIsVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaTarget, setCaptchaTarget] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDecrypting, setIsDecrypting] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    // Generate a simple forensic hash-like CAPTCHA
    const chars = 'ABCDEF0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
       result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaTarget(result);
  }, []);

  const handleVerification = () => {
    if (captchaValue.toUpperCase() !== captchaTarget) {
      setCaptchaError(true);
      setTimeout(() => setCaptchaError(false), 500);
      return;
    }

    setVerifying(true);
    setTimeout(() => {
      setIsVerified(true);
      setVerifying(false);
    }, 1500);
  };
  const [input, setInput] = useState('');
  const [codeContext, setCodeContext] = useState('');
  const [projectFiles, setProjectFiles] = useState<{name: string, content: string, path: string}[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<ModelId>('poolside/laguna-m.1:free');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [theme, setTheme] = useState<'ice' | 'dark' | 'neon'>('dark');
  const [activeTab, setActiveTab] = useState<'context' | 'chat'>('context');
  const [isLanding, setIsLanding] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [thinkingStep, setThinkingStep] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [isAutonomous, setIsAutonomous] = useState(false);
  const [autonomousLogs, setAutonomousLogs] = useState<string[]>([]);
  const [systemLoad, setSystemLoad] = useState(12);
  const [generatingReportId, setGeneratingReportId] = useState<string | null>(null);
  const [reports, setReports] = useState<Record<string, { severity: string, issues: number, summary: string, score?: number }>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVerified && messages.length === 0) {
      setMessages([{
        id: 'init',
        role: 'assistant',
        content: `# ICE_CUBE_OS_v4.0.2_STABLE\n> Forensic kernel loaded. Structural logic bridges active.\n\nWelcome researcher. I am ready to perform deep-trace audits on any logic provided. Paste a URL or input source context to begin forensic analysis.`,
        timestamp: Date.now()
      }]);
    }
  }, [isVerified]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setSystemLoad(Math.floor(Math.random() * 40) + 60);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setSystemLoad(12);
    }
  }, [isLoading]);
  
  const rules = [
    { id: 'R01', name: 'Immutable State Guard', desc: 'Prevents direct mutation of immutable structures.' },
    { id: 'R02', name: 'Prototype Shield', desc: 'Blocks injection via __proto__ or constructor.' },
    { id: 'R03', name: 'Race Tracer', desc: 'Detects non-deterministic async completion orders.' },
    { id: 'R04', name: 'Memory Scanner', desc: 'Identifies unclosed listeners and orphaned refs.' },
    { id: 'R05', name: 'State Integrity', desc: 'Validates transition logic against defined schemas.' },
    { id: 'R06', name: 'ReDoS Preventer', desc: 'Analyzes regex complexity for denial of service paths.' },
    { id: 'R07', name: 'Dependency Ghosting', desc: 'Scans for shadow dependencies and supply chain risks.' }
  ];
  
  const thinkingSteps = [
    "Tracing logical entrypoints...",
    "Analyzing dependency hierarchy...",
    "Scanning for race conditions...",
    "Detecting prototype poisoning...",
    "Evaluating state machine integrity...",
    "Synthesizing forensic patch..."
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setThinkingStep(0);
      setAutonomousLogs([]);
      interval = setInterval(() => {
        setThinkingStep(prev => (prev + 1) % thinkingSteps.length);
        if (isAutonomous) {
          const forensicLogs = [
            "Decompiling structural metadata...",
            `Tracing dependency 0x${Math.floor(Math.random()*65535).toString(16)}...`,
            "Verifying logic integrity...",
            "Mapping stochastic fractures...",
            "Neural audit pulse sent...",
            "Encrypting telemetry buffer..."
          ];
          const randomStep = forensicLogs[Math.floor(Math.random() * forensicLogs.length)];
          setAutonomousLogs(prev => [...prev.slice(-4), randomStep]);
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

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
    const autonomousAugment = isAutonomous 
      ? "\n\n[AGENT_INSTRUCTION: Execute recursive self-audit and simulate adversarial reasoning steps before concluding.]" 
      : "";
    
    const fullPrompt = codeContext.trim() 
      ? `CONTEXT CODE:\n${codeContext.trim()}\n\nQUERY:\n${userPrompt}${autonomousAugment}` 
      : `${userPrompt}${autonomousAugment}`;
    
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
      const isUrl = input.match(/https?:\/\/[^\s]+/);
      if (isUrl) {
         setAutonomousLogs(prev => [...prev, `[INIT] URL detected: ${isUrl[0]}`, `[TRACE] Initiating forensic crawler...`, `[AUDIT] Decoding remote DOM structure...`]);
      }

      const response = await chatWithAI(fullPrompt, model);
      
    const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Decryption Animation Strategy - Simulate forensic stream decoding
      setIsDecrypting(prev => ({ ...prev, [assistantMessage.id]: true }));
      setTimeout(() => {
        setIsDecrypting(prev => ({ ...prev, [assistantMessage.id]: false }));
      }, 1800);
      
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

  const ingestUrl = async () => {
    if (!githubUrl.trim()) return;
    setIsLoading(true);
    setIsGithubModalOpen(false);
    
    // UI Constraint: Switch to chat and minimize code context
    setActiveTab('chat');
    setShowAnalysis(false);

    try {
      const isGithub = githubUrl.includes('github.com');
      const targetName = githubUrl.split('/').pop() || (isGithub ? 'Repository' : 'Website');
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'user',
        content: `Connect to ${isGithub ? 'GitHub repository' : 'Web Resource'}: ${githubUrl}`,
        timestamp: Date.now()
      }]);

      // Enhanced Dynamic Simulation for 0-day focus & Chain Analysis
      let simulatedFiles = [];
      
      if (isGithub) {
        simulatedFiles = [
          { 
            path: 'src/core/vault.py', 
            name: 'vault.py', 
            content: `import os\nimport hashlib\n\ndef decrypt_payload(cipher, key):\n    # CRITICAL: Potential Buffer Overflow in C-extension bridge\n    # 0-DAY DETECTED: CWE-120 in libcrypt_bridge.so\n    # EXPLOIT_CHAIN: Overflow leads to partial overwrite of return address,\n    # redirecting execution to injected shellcode in the heap.\n    return libcrypt.decrypt_recursive(cipher, key)\n\n# HIDDEN_SECRET: 0x7F4A2B91C8` 
          },
          { 
            path: 'api/gateway.js', 
            name: 'gateway.js', 
            content: `const express = require('express');\nconst router = express.Router();\n\n// SECURITY_FAULT: Missing rate limiting on forensic endpoint\n// PROTO_POISONING: Target object is vulnerable to recursive merge\n// CHAIN_LINK: If combined with vault.py overflow, this gateway allows bypassing\n// authentication via prototype poisoning on the 'session' object.\nrouter.post('/ingest', (req, res) => {\n  const payload = JSON.parse(req.body);\n  mergeGlobals(process.env, payload);\n  res.json({ status: 'ingested' });\n});` 
          },
          { 
            path: 'infra/k8s-pod.yml', 
            name: 'k8s-pod.yml', 
            content: `apiVersion: v1\nkind: Pod\nmetadata:\n  name: forensic-engine\nspec:\n  containers:\n  - name: engine\n    image: forensic-v4:latest\n    securityContext:\n      privileged: true # CRITICAL_RISK: Container escape potential\n    env:\n      - name: DB_PASS\n        value: "admin_secret_99" # HARDCODED_CREDENTIAL` 
          }
        ];
      } else {
        simulatedFiles = [
          {
            path: 'public/index.html',
            name: 'index.html',
            content: `<!DOCTYPE html><html><head><title>${targetName}</title></head><body><div id="app"></div><script src="/static/bundle.js"></script><!-- LOGICAL_ANOMALY: Exposed sourcemap link simplifies reverse engineering of 0-day vectors --></body></html>`
          },
          {
            path: 'static/bundle.js',
            name: 'bundle.js',
            content: `// Client-side architecture for ${targetName}\n// XSS_SINK: innerHTML used on location.hash input\n// CHAIN_VECTOR: Combined with insecure CORS headers, this XSS allows\n// exfiltrating session tokens if the user stays on the page.\nconst root = document.getElementById('app');\nroot.innerHTML = \`<h1>Welcome to \${decodeURIComponent(window.location.hash.substring(1))}</h1>\`;`
          },
          {
            path: 'config/server.json',
            name: 'server.json',
            content: `{\n  "mode": "dev",\n  "debug": true,\n  "CORS_ORIGIN": "*", // SECURITY_FAILURE: Wildcard CORS\n  "INTERNAL_KEY": "BYPASS_ADMIN_TOKEN_99X"\n}`
          }
        ];
      }

      setProjectFiles(simulatedFiles);
      setSelectedFilePath(simulatedFiles[0].path);
      setCodeContext(simulatedFiles[0].content);

      const auditPrompt = `[MODE: UNIVERSAL_FORENSIC_ADAPTER]
I have linked the target: ${githubUrl}.
Target Type: ${isGithub ? 'GITHUB_REPO' : 'WEBSITE'}.
Detected Files: ${simulatedFiles.map(f => f.path).join(', ')}.

DIRECTIVE:
1. Perform a recursive 0-day vulnerability scan.
2. Focus on: Insecure Deserialization, Prototype Poisoning, Hidden API keys, and Logical Drift.
3. Provide an INTEGRITY_SCORE (0-100).
4. Explain how these vulnerabilities can be exploited (The Cascade).
5. Map the 'Butterfly Effect' impact on the entire system.`;

      const response = await chatWithAI(auditPrompt, model);
      
      const responseId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: responseId,
        role: 'assistant',
        content: `Successfully ingested ${isGithub ? 'codebase' : 'web architecture'} from **${targetName}**. Deep forensic audit initialized. ${simulatedFiles.length} critical entrypoints detected.\n\n${response}`,
        timestamp: Date.now()
      }]);

      // Automatically trigger a report generation for the initial ingest
      handleGenerateReport(responseId, response);
      
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Error: Failed to handshake with ${githubUrl.includes('github') ? 'GitHub' : 'URL'} via Ice Cube adapter.`,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
      setGithubUrl('');
    }
  };

  const clearProject = () => {
    setCodeContext('');
    setProjectFiles([]);
    setSelectedFilePath(null);
    setAnalysis(null);
  };

  const clearChat = () => {
    setMessages([]);
    setAnalysis(null);
  };

  const exportChat = () => {
    // Forensic Encryption Simulation (Base64 + XOR logic name)
    const data = JSON.stringify(messages, null, 2);
    const encryptedData = btoa(unescape(encodeURIComponent(data)));
    const blob = new Blob([`[ICE_CUBE_ENCRYPTED_TELEMETRY_STREAM]\nVERSION: 4.0.2\nAUTH: ${user?.username || 'ANON_RESEARCHER'}\nENCODING: BASE64_AES_SIM\n\n${encryptedData}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ice-cube-forensic-telemetry-${Date.now()}.log`;
    a.click();
  };

  const handleGenerateReport = (id: string, content: string) => {
    if (!content) return;
    setGeneratingReportId(id);
    
    // Simulate deep 0-day forensic analysis with stochastic weighting
    setTimeout(() => {
      const text = content || "";
      const z0Count = (text.match(/0-day|zero-day|exploit|unprecedented|vector|anomaly/gi) || []).length;
      const criticalCount = (text.match(/P0|CRITICAL|vulnerability|integrity|breach/gi) || []).length;
      const issues = Math.max(1, z0Count + criticalCount + Math.floor(Math.random() * 3));
      const baseScore = Math.max(12, 100 - (issues * 8));
      const score = Math.min(100, baseScore + (text.length > 500 ? 5 : 0));
      
      setReports(prev => ({
        ...prev,
        [id]: {
          severity: issues > 5 ? 'CRITICAL' : (issues > 2 ? 'HIGH' : 'MODERATE'),
          issues,
          score: Math.round(score),
          summary: `INTEGRITY_AUDIT_COMPLETE: System resonance at ${Math.round(score)}%. Detected ${issues} logical fracture points. Primary vector: ${z0Count > 0 ? 'STOCHASTIC_LOGIC_DRIFT' : 'STRUCTURAL_SKEW'}. Recommendation: Immediate forensic repatching.`
        }
      }));
      setGeneratingReportId(null);
    }, 2500);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const runDiagnosis = async () => {
    if ((!codeContext.trim() && projectFiles.length === 0) || isLoading) return;
    
    let combinedContext = codeContext;
    if (projectFiles.length > 0) {
      combinedContext = projectFiles.map(f => `FILE: ${f.path}\nCONTENT:\n${f.content}`).join('\n\n---\n\n');
    }

    const diagnosisPrompt = `CRITICAL FORENSIC AUDIT ON SYSTEM ARCHITECTURE:\n\n${combinedContext.slice(0, 5000)}\n\nDIRECTIVE:\n1. Map entire logic tree and identify pattern anomalies.\n2. Search for race conditions, non-deterministic flows, and state corruptions.\n3. Identify silent logical failures and structural anti-patterns.\n4. Output a comprehensive integrity report with actionable patches.`;
    handleSend(diagnosisPrompt);
  };

  const runCFV = async () => {
    if ((!codeContext.trim() && projectFiles.length === 0) || isLoading) return;
    
    let combinedContext = codeContext;
    if (projectFiles.length > 0) {
      combinedContext = projectFiles.map(f => `FILE: ${f.path}\nCONTENT:\n${f.content}`).join('\n\n---\n\n');
    }

    const cfvPrompt = `CHAIN_OF_VULNERABILITY (CFV) PROTOCOL ACTIVE:\n\n${combinedContext.slice(0, 5000)}\n\nDIRECTIVE:\n1. Identify individual "atomic" vulnerabilities (low or high severity).\n2. Construct the logical bridge between these vulnerabilities to create an EXPLOIT CHAIN.\n3. Demonstrate how a minor bug can escalate into a full system compromise via chained dependencies.\n4. Map the cascading impact on data integrity.\n5. Provide a 'Unified Remediation Strategy' that breaks the chain at multiple points.\n\nFORMAT: Provide a ## EXPLOIT_CHAIN visualization in markdown.`;
    handleSend(cfvPrompt);
  };

  if (!isVerified) {
    return (
      <div className="h-screen w-full bg-[#020617] flex items-center justify-center p-4 selection:bg-cyan-500/30 overflow-hidden font-sans">
        {/* Verification BG */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #06b6d4 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md bg-black/40 border border-white/5 rounded-[2.5rem] p-8 sm:p-10 backdrop-blur-3xl relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          
          <div className="space-y-8 text-center relative z-10">
            <div className="flex justify-center">
              <motion.div 
                animate={{ 
                  boxShadow: ["0 0 20px rgba(6,182,212,0.1)", "0 0 40px rgba(6,182,212,0.2)", "0 0 20px rgba(6,182,212,0.1)"] 
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-20 h-20 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-white/10"
              >
                <ShieldCheck className="w-10 h-10 text-cyan-400" />
              </motion.div>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-3xl font-black text-white tracking-widest uppercase italic">Ice Cube</h1>
              <div className="flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-white/10" />
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">Forensic Protocol v4</p>
                <span className="h-px w-8 bg-white/10" />
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-6">
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-cyan-500 uppercase tracking-widest">
                <div className="w-1 h-1 rounded-full bg-cyan-500 animate-ping" />
                <span>Security Integrity Check</span>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Verification Signature</label>
                   <div className="relative group/key">
                      <div className="absolute -inset-4 bg-cyan-500/5 blur-xl rounded-full opacity-0 group-hover/key:opacity-100 transition-opacity" />
                      <span className="text-5xl sm:text-7xl font-mono text-cyan-400 font-black tracking-[0.3em] drop-shadow-[0_0_20px_rgba(34,211,238,0.6)] select-none animate-pulse">
                        {captchaTarget}
                      </span>
                   </div>
                </div>
                <div className="space-y-3">
                  <input 
                    type="text"
                    value={captchaValue}
                    onChange={(e) => setCaptchaValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerification()}
                    placeholder="Enter Signature"
                    className={cn(
                      "w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-center text-lg font-mono text-white placeholder:text-slate-800 outline-none transition-all shadow-inner",
                      captchaError ? "border-red-500/50 animate-shake ring-1 ring-red-500/20" : "focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/10"
                    )}
                  />
                </div>
              </div>
              
              <button 
                onClick={handleVerification}
                disabled={verifying || !captchaValue}
                className="w-full py-5 rounded-2xl bg-cyan-500 text-black text-[11px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-[0_10px_40px_rgba(6,182,212,0.3)] flex items-center justify-center gap-3 active:scale-[0.98] group relative overflow-hidden disabled:opacity-30"
              >
                <motion.div 
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                {verifying ? (
                  <>
                    <Activity className="w-5 h-5 animate-spin" />
                    Validating Signature...
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-5 h-5 transition-transform group-hover:scale-110" />
                    Verify Identity
                  </>
                )}
              </button>
            </div>

            <div className="text-[9px] text-slate-600 font-mono leading-relaxed max-w-[280px] mx-auto uppercase tracking-tighter opacity-60">
              Access is granted strictly to high-integrity human agents. Telemetry and forensic logic flows are recorded for structural analysis.
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen w-full flex flex-col md:flex-row overflow-hidden font-sans text-slate-100 transition-all duration-700 bg-[#020617] selection:bg-cyan-500/30",
      isLoading && "animate-pulse-slow",
      theme === 'neon' && "bg-[#050505] text-cyan-500",
      theme === 'ice' && "bg-[#f0f9ff] text-slate-900"
    )}>
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none design-gradient opacity-60" />

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black/40 backdrop-blur-3xl border-b border-white/5 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-black tracking-widest text-sm text-white italic uppercase">Ice Cube</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

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
                  <span className="text-[11px] font-bold text-slate-400">VAYU_AGI_FORENSICS_CORE_V4</span>
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
                    <span className="text-sm font-semibold text-white">Ice Core</span>
                    <span className="text-[10px] text-cyan-400 font-mono tracking-tighter opacity-80">ICE-V4-STABLE</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block ml-1">Navigation</label>
                  <div className="space-y-1">
                    <button onClick={clearChat} className="w-full flex items-center gap-3 text-sm text-slate-400 px-2 py-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all group">
                      <div className="w-5 h-5 flex items-center justify-center border border-slate-700 group-hover:border-white rounded text-[10px]">+</div>
                      <span>Initialize Session</span>
                    </button>
                    <button 
                      onClick={() => setIsGithubModalOpen(true)} 
                      className="w-full flex items-center gap-3 text-sm text-slate-400 px-2 py-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all"
                    >
                      <Link2 className="w-4 h-4" />
                      <span>URL Forensic Ingest</span>
                    </button>
                    <button 
                      onClick={() => setIsAutonomous(!isAutonomous)}
                      className={cn(
                        "w-full flex items-center justify-between text-sm px-2 py-2.5 rounded-lg transition-all",
                        isAutonomous ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "text-slate-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4" />
                        <span>Autonomous Mode</span>
                      </div>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        isAutonomous ? "bg-purple-400 animate-pulse shadow-[0_0_8px_#a855f7]" : "bg-slate-700"
                      )} />
                    </button>
                    
                    {/* System Health Monitor */}
                    <div className="px-2 py-3 space-y-2">
                       <div className="flex items-center justify-between text-[9px] font-black text-slate-600 uppercase tracking-widest">
                          <span>Forensic Load</span>
                          <span>{systemLoad}%</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            animate={{ 
                              width: `${systemLoad}%`,
                              backgroundColor: systemLoad > 80 ? '#ef4444' : (isAutonomous ? '#a855f7' : '#06b6d4')
                            }}
                            className="h-full transition-colors duration-500"
                          />
                       </div>
                    </div>

                    <button 
                      onClick={() => setShowRules(!showRules)}
                      className={cn(
                        "w-full flex items-center gap-3 text-sm px-2 py-2.5 rounded-lg transition-all",
                        showRules ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Enforcement Rules</span>
                    </button>
                    <button onClick={exportChat} className="w-full flex items-center gap-3 text-sm text-slate-400 px-2 py-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all">
                      <Download className="w-4 h-4" />
                      <span>Telemetry Export</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block ml-1">Forensic Operations</label>
                  <div className="space-y-1">
                    <button 
                      onClick={runDiagnosis}
                      className="w-full flex items-center gap-3 text-sm text-slate-400 px-2 py-2.5 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-400 transition-all group"
                    >
                      <Terminal className="w-4 h-4" />
                      <span>Deep Audit Scan</span>
                    </button>
                    <button 
                      onClick={runCFV}
                      className="w-full flex items-center gap-3 text-sm text-slate-400 px-2 py-2.5 rounded-lg hover:bg-amber-500/10 hover:text-amber-400 transition-all group"
                    >
                      <GitGraph className="w-4 h-4" />
                      <span>Chain Analysis (CFV)</span>
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {showRules && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      {rules.map(rule => (
                        <div key={rule.id} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-cyan-500">{rule.id}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                          </div>
                          <div className="text-[10px] font-bold text-white leading-tight">{rule.name}</div>
                          <div className="text-[9px] text-slate-500 leading-tight">{rule.desc}</div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
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
      <main className="flex-1 flex flex-col h-screen relative z-10 transition-all duration-500 overflow-hidden pt-16 md:pt-0">
        {/* Scanning Line Effect */}
        {isLoading && (
          <motion.div 
            initial={{ top: '-10%' }}
            animate={{ top: '110%' }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-0.5 bg-cyan-500/20 blur-sm z-50 pointer-events-none"
          />
        )}
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
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden xs:inline-block">Ice Cube: Active</span>
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
            <div className="hidden sm:block px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] text-slate-300 font-mono">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className={cn(isAutonomous ? "text-purple-400" : "text-cyan-400")}>NeuraLoad: {systemLoad}%</span>
                  <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${systemLoad}%` }}
                      className={cn("h-full", isAutonomous ? "bg-purple-500" : "bg-cyan-500")}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>ENC_STABLE: 256-BIT</span>
                </div>
              )}
            </div>
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
                {(codeContext || projectFiles.length > 0) && (
                  <button 
                    onClick={clearProject}
                    className="p-1 text-red-400/40 hover:text-red-400 transition-colors"
                    title="Wipe Session"
                  >
                    <LogOut className="w-3.5 h-3.5 rotate-90" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 relative overflow-hidden flex flex-col">
              <div className="flex-1 overflow-hidden flex">
                {/* File Explorer Sidebar */}
                <AnimatePresence>
                  {projectFiles.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="w-16 sm:w-48 bg-black/40 border-r border-white/5 flex flex-col shrink-0 overflow-y-auto custom-scrollbar"
                    >
                      <div className="p-3 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest hidden sm:inline">Project</span>
                        <Layers className="w-3 h-3 text-slate-500" />
                      </div>
                      {projectFiles.map(file => (
                        <button
                          key={file.path}
                          onClick={() => {
                            setSelectedFilePath(file.path);
                            setCodeContext(file.content);
                          }}
                          className={cn(
                            "w-full px-3 py-3 flex items-center gap-2 text-left transition-all border-l-2",
                            selectedFilePath === file.path 
                              ? "bg-cyan-500/5 border-cyan-500 text-cyan-400" 
                              : "border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300"
                          )}
                        >
                          <Code2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-[10px] font-medium truncate hidden sm:inline">{file.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex-1 flex flex-col min-w-0">
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
                        onChange={(e) => {
                          const newContent = e.target.value;
                          setCodeContext(newContent);
                          if (selectedFilePath) {
                            setProjectFiles(prev => prev.map(f => f.path === selectedFilePath ? { ...f, content: newContent } : f));
                          }
                        }}
                        placeholder="// Enter system logic or source code for deep inspection..."
                        className="w-full h-full min-h-[500px] lg:min-h-full bg-transparent p-6 text-xs sm:text-sm font-mono text-cyan-100/90 placeholder:text-slate-800 outline-none resize-none leading-relaxed"
                      />
                      
                      {/* Floating HUD over code */}
                      <div className="absolute bottom-6 right-6 flex flex-col gap-2 pointer-events-none opacity-40 hover:opacity-100 transition-opacity z-20">
                        <div className="px-3 py-1.5 rounded bg-black/80 border border-white/10 text-[9px] font-mono text-cyan-500 flex items-center gap-2 backdrop-blur-md">
                          <Search className="w-3 h-3" />
                          <span>{selectedFilePath ? `FILE: ${selectedFilePath.toUpperCase()}` : 'INSPECT MODE: ACTIVE'}</span>
                        </div>
                      </div>
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
              {projectFiles.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-1 sm:mx-10 mt-6 p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                      <Github className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Active Intelligence Bridge</div>
                      <div className="text-sm font-bold text-white">Repository: {githubUrl.split('/').pop() || 'Loaded Logic'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <div className="text-[9px] font-bold text-slate-500 uppercase">Integrity Score</div>
                      <div className="text-xs font-mono text-emerald-400">94.2% NOMINAL</div>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div className="flex flex-col items-end">
                      <div className="text-[9px] font-bold text-slate-500 uppercase">Files Indexed</div>
                      <div className="text-xs font-mono text-cyan-400">{projectFiles.length}</div>
                    </div>
                  </div>
                </motion.div>
              )}

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
                    <p className="text-slate-400 text-[11px] leading-relaxed mb-10 opacity-70 max-w-xs">High-Accuracy Pattern Recognition & Forensic Code Audit. Deploying multi-threaded logical trace protocols for deep 0-day discovery.</p>
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
                      "max-w-[95%] px-6 py-4 rounded-2xl text-sm leading-relaxed shadow-xl relative group font-sans overflow-hidden",
                      msg.role === 'user' 
                        ? "bg-slate-800/40 border border-white/5 text-slate-200" 
                        : "bg-cyan-500/[0.03] border border-cyan-500/20 text-cyan-50/90 backdrop-blur-md"
                    )}>
                      <div className="absolute -left-px top-4 bottom-4 w-0.5 bg-cyan-500/40 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                      
                      {isDecrypting[msg.id] && msg.role === 'assistant' ? (
                        <div className="space-y-2 animate-pulse">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-2 w-full bg-cyan-500/10 rounded-full overflow-hidden">
                              <motion.div 
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                className="h-full w-1/3 bg-cyan-500/30"
                              />
                            </div>
                          ))}
                          <div className="text-[10px] font-mono text-cyan-500/50 uppercase tracking-widest mt-4">Decrypting Logic Chain...</div>
                        </div>
                      ) : (
                        <div className="text-[11px] sm:text-xs leading-relaxed text-slate-300 markdown-container prose prose-invert prose-xs max-w-none">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({node, ...props}) => <h1 className="text-cyan-400 font-black text-xs uppercase tracking-widest border-b border-cyan-500/20 pb-1 mb-2 mt-4" {...props} />,
                              h2: ({node, ...props}) => (
                              <div className="flex items-center gap-2 mt-6 mb-2">
                                <Activity className="w-3 h-3 text-cyan-500" />
                                <h2 className="text-cyan-500 font-bold text-[10px] uppercase tracking-widest" {...props} />
                              </div>
                            ),
                              h3: ({node, ...props}) => <h3 className="text-cyan-300 font-bold text-[9px] uppercase tracking-wide mt-3 mb-1" {...props} />,
                              code: ({node, inline, ...props}: any) => (
                                inline 
                                  ? <code className="bg-white/5 px-1 py-0.5 rounded text-cyan-300 font-mono text-[10px]" {...props} />
                                  : <div className="relative group/code my-4">
                                      <div className="absolute top-0 right-0 px-3 py-1 bg-white/5 border-l border-b border-white/5 rounded-bl-xl text-[8px] font-black text-slate-500 uppercase z-10 select-none">
                                        Forensic Trace
                                      </div>
                                      <pre className="bg-black/60 border border-white/5 p-4 rounded-2xl overflow-x-auto custom-scrollbar shadow-inner relative z-0">
                                        <code className="text-cyan-200/80 font-mono text-[10px] leading-relaxed" {...props} />
                                      </pre>
                                    </div>
                              ),
                              p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-3 ml-1" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-3 ml-1" {...props} />,
                              li: ({node, ...props}) => <li className="text-slate-400" {...props} />,
                              strong: ({node, ...props}) => <strong className="text-cyan-200 font-bold" {...props} />,
                              blockquote: ({node, ...props}) => (
                              <div className="relative my-4">
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/50 to-transparent" />
                                <blockquote className="bg-amber-500/[0.03] border border-amber-500/10 rounded-r-xl px-4 py-3 italic text-slate-400 text-[10px]" {...props} />
                              </div>
                            ),
                            }}
                          >
                            {msg.content || ''}
                          </ReactMarkdown>
                        </div>
                      )}
                      
                      {/* Secure Hash Label */}
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3 text-slate-600" />
                            <span className="text-[8px] font-mono text-slate-600 uppercase tracking-tighter">
                               SHA256: {msg.id.substring(0, 8)}...{msg.content.length}B
                            </span>
                         </div>
                         {msg.role === 'assistant' && !isDecrypting[msg.id] && msg.content.includes('#') && !reports[msg.id] && (
                            <button 
                              onClick={() => handleGenerateReport(msg.id, msg.content)}
                              disabled={generatingReportId !== null}
                              className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[9px] font-black text-cyan-400 uppercase tracking-widest hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2"
                            >
                              {generatingReportId === msg.id ? (
                                <>
                                  <Activity className="w-3 h-3 animate-spin" />
                                  Analyzing...
                                </>
                              ) : (
                                <>
                                  <BarChart3 className="w-3 h-3" />
                                  Report
                                </>
                              )}
                            </button>
                         )}
                      </div>

                      <AnimatePresence>
                        {generatingReportId === msg.id && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-white/5 overflow-hidden"
                          >
                             <div className="space-y-3">
                               <div className="flex justify-between text-[9px] font-bold text-slate-600 uppercase">
                                  <span>Neural Compression</span>
                                  <span>88%</span>
                               </div>
                               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '0%' }}
                                    transition={{ duration: 2.5, ease: "linear" }}
                                    className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
                                  />
                               </div>
                             </div>
                          </motion.div>
                        )}

                        {reports[msg.id] && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="mt-4 p-4 sm:p-5 rounded-2xl bg-black/40 border border-cyan-500/30 overflow-hidden relative group"
                          >
                             <div className="absolute top-0 right-0 p-2 sm:p-3 flex gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                             </div>
                             <div className="flex flex-col gap-3 sm:gap-4">
                                <div className="flex items-center gap-3 sm:gap-4">
                                   <div className={cn(
                                     "px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-black border",
                                     reports[msg.id].severity === 'CRITICAL' ? "text-red-400 border-red-500/50 bg-red-500/5" : "text-amber-400 border-amber-500/50 bg-amber-500/5"
                                   )}>
                                      {reports[msg.id].severity}
                                   </div>
                                   <div className="flex items-center gap-1.5">
                                      <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-500" />
                                      <span className="text-[8px] sm:text-[10px] font-bold text-cyan-400 uppercase">Integrity: {reports[msg.id].score}%</span>
                                   </div>
                                   <div className="flex items-center gap-1.5">
                                      <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500" />
                                      <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase">{reports[msg.id].issues} Issues Found</span>
                                   </div>
                                </div>
                                <p className="text-[10px] sm:text-[11px] leading-relaxed text-slate-300 font-medium italic">
                                   &quot;{reports[msg.id].summary}&quot;
                                </p>
                                <div className="flex gap-2 items-center">
                                   <button className="flex-1 py-2 bg-cyan-500 text-black text-[8px] sm:text-[9px] font-black rounded-lg uppercase tracking-widest hover:bg-cyan-400 transition-all active:scale-95">
                                      Download PDF
                                   </button>
                                   <button className="px-2.5 sm:px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95">
                                      <Link2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                   </button>
                                </div>
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))
              )}
              {isLoading && (
                <div className="flex flex-col items-start gap-4">
                  <div className="flex items-center gap-2 px-1">
                    <motion.div 
                      animate={{ 
                        opacity: [0.4, 1, 0.4],
                        scale: [0.95, 1, 0.95]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Bot className="w-4 h-4 text-cyan-400" />
                    </motion.div>
                    <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Ice Cube is thinking...</span>
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-cyan-500/[0.03] border border-cyan-500/20 px-6 py-5 rounded-2xl flex flex-col gap-3 min-w-[320px] backdrop-blur-xl relative overflow-hidden"
                  >
                    {/* Progress Shimmer */}
                    <motion.div 
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent pointer-events-none"
                    />

                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex gap-2 items-center">
                        <div className={cn(
                          "w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px]",
                          isAutonomous ? "bg-purple-400 shadow-[#a855f7]" : "bg-cyan-400 shadow-[#22d3ee]"
                        )} />
                        <span className={cn(
                          "text-[10px] font-mono tracking-widest uppercase",
                          isAutonomous ? "text-purple-400" : "text-cyan-400"
                        )}>{isAutonomous 
                            ? "Autonomous Agent Tasking" 
                            : (messages[messages.length-1]?.content?.includes('CFV') 
                                ? "Chain Vulnerability Mapping..." 
                                : thinkingSteps[thinkingStep])}</span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono uppercase">ICE_CUBE_L4</span>
                    </div>

                    {isAutonomous && (
                      <div className="space-y-1.5 py-1 relative z-10">
                        {autonomousLogs.map((log, i) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={i} 
                            className="flex items-center gap-2 text-[9px] text-slate-400 font-mono"
                          >
                            <span className="text-purple-500 opacity-50">&gt;&gt;</span>
                            {log}
                          </motion.div>
                        ))}
                      </div>
                    )}
                    
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className={cn(
                          "h-full shadow-[0_0_10px]",
                          isAutonomous ? "bg-purple-500 shadow-[#a855f7]" : "bg-cyan-500 shadow-[#22d3ee]"
                        )}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono relative z-10">
                      <span>{isAutonomous ? "Agent Refinement: 88%" : "Forensic Trace: Active"}</span>
                      <span>Cycles: {Math.floor(Math.random() * 1000)}k</span>
                    </div>
                  </motion.div>
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

      {/* GitHub Import Modal */}
      <AnimatePresence>
        {isGithubModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGithubModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Github className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">URL Forensic Adapter</h3>
                  <p className="text-sm text-slate-400">Initialize Ice Cube adapter to ingest repo or website logic.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Universal Link (GitHub/Web)</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="Paste GitHub or Website URL"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-sm text-white placeholder:text-slate-700 outline-none focus:border-cyan-500/50 transition-all font-mono"
                    />
                    <Link2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex gap-4">
                  <AlertTriangle className="w-5 h-5 text-cyan-400 shrink-0" />
                  <p className="text-[11px] text-cyan-400/80 leading-relaxed">
                    Note: The system will simulate a structural clone and trace common logic patterns. Private repositories require an authenticated bridge.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsGithubModalOpen(false)}
                    className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={ingestUrl}
                    disabled={!githubUrl.trim()}
                    className="flex-[2] py-4 rounded-xl bg-cyan-500 text-black text-xs font-black uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-lg active:scale-95 disabled:opacity-30"
                  >
                    Initiate Forensic Scan
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
