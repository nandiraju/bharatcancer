import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cancerData } from "./data/cancerData";
import IndiaMap from "./components/IndiaMap";
import ForceGraph from "./components/ForceGraph";

// Styled HUD panel component matching the cockpit double-bracket style
interface HudPanelProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const HudPanel: React.FC<HudPanelProps> = ({ title, subtitle, children, className = "" }) => {
  return (
    <div className={`glass-panel p-4 rounded border border-brand-border/25 relative flex flex-col justify-between ${className}`}>
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-brand-cyan/15 pb-1.5 mb-3 font-mono select-none">
        <div className="flex items-center gap-1">
          <span className="text-brand-cyan text-[10px] font-bold mr-0.5 select-none">⦗</span>
          <h3 className="text-[10px] font-black uppercase tracking-wider text-white inline-block">{title}</h3>
          <span className="text-brand-cyan text-[10px] font-bold ml-0.5 select-none">⦘</span>
        </div>
        {subtitle && <span className="text-brand-cyan/35 text-[8px] uppercase tracking-widest font-bold">{subtitle}</span>}
      </div>
      
      <div className="flex-1 flex flex-col justify-between min-h-0">
        {children}
      </div>
    </div>
  );
};

export default function App() {
  const [activeStateId, setActiveStateId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState("");
  
  // Resizable split-pane states
  const [leftWidth, setLeftWidth] = useState(50); // percentage width for left column
  const [isDragging, setIsDragging] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeState = activeStateId ? cancerData.states[activeStateId] : null;

  // Track window size to disable split-pane resizer on mobile
  useEffect(() => {
    const checkSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // Real-time digital clock effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const yr = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, "0");
      const dy = String(now.getDate()).padStart(2, "0");
      const hr = String(now.getHours()).padStart(2, "0");
      const min = String(now.getMinutes()).padStart(2, "0");
      const sec = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${yr}-${mo}-${dy}  ${hr}:${min}:${sec}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Split-pane dragging handlers
  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      
      let percentage = ((clientX - containerRect.left) / containerRect.width) * 100;
      percentage = Math.max(30, Math.min(70, percentage)); // Constrain columns between 30% and 70%
      setLeftWidth(percentage);
    };

    const stopDrag = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", stopDrag);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", stopDrag);
    };
  }, [isDragging]);

  const leftColumnContent = (
    <div className="flex flex-col justify-between h-full relative w-full">
      {/* Top middle-left indicator dials overlapping map space */}
      <div className="absolute top-2 left-4 flex items-center gap-5 z-20 font-mono text-[9px] select-none">
        
        {/* Registry Feed Active Dial */}
        <div className="flex items-center gap-2 bg-[#010915]/65 border border-brand-cyan/15 rounded px-2 py-1 backdrop-blur-sm shadow-sm shadow-brand-cyan/5">
          <div className="w-6 h-6 relative shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="12" fill="transparent" stroke="rgba(0, 240, 255, 0.05)" strokeWidth="2.5" />
              <circle cx="16" cy="16" r="12" fill="transparent" stroke="#00ff66" strokeWidth="2.5"
                strokeDasharray="60 75" strokeLinecap="round" className="animate-pulse" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[7px] text-[#00ff66]">
              ●
            </div>
          </div>
          <div className="text-left">
            <div className="text-brand-cyan/55 text-[7.5px] uppercase leading-none">Registry Feed</div>
            <div className="font-bold text-[#00ff66] text-glow-green text-[9px] mt-0.5 leading-none">Active</div>
          </div>
        </div>

        {/* Burden Level Stable Dial */}
        <div className="flex items-center gap-2 bg-[#010915]/65 border border-brand-cyan/15 rounded px-2 py-1 backdrop-blur-sm shadow-sm shadow-brand-cyan/5">
          <div className="w-6 h-6 relative shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="12" fill="transparent" stroke="rgba(0, 240, 255, 0.05)" strokeWidth="2.5" />
              <circle cx="16" cy="16" r="12" fill="transparent" stroke="#ffb703" strokeWidth="2.5"
                strokeDasharray="45 75" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[7px] text-[#ffb703]">
              ▲
            </div>
          </div>
          <div className="text-left">
            <div className="text-brand-cyan/55 text-[7.5px] uppercase leading-none">Burden Trend</div>
            <div className="font-bold text-[#ffb703] text-glow-gold text-[9px] mt-0.5 leading-none">Moderate</div>
          </div>
        </div>

      </div>

      {/* Interactive Indian Map projection canvas */}
      <div className="flex-1 w-full h-full flex items-center justify-center min-h-0 py-2">
        <IndiaMap activeStateId={activeStateId} onSelectState={setActiveStateId} />
      </div>

      {/* Floating tactical coordinates overlay next to the map area */}
      <AnimatePresence mode="wait">
        {activeState && (
          <motion.div
            key={activeStateId}
            initial={{ opacity: 0, scale: 0.96, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.96, x: -10 }}
            transition={{ duration: 0.25 }}
            className="absolute top-14 right-4 w-60 glass-panel border border-brand-cyan/60 p-3 rounded font-mono text-[9px] text-left z-20 shadow-[0_0_20px_rgba(0,240,255,0.18)]"
          >
            
            <div className="flex items-center justify-between border-b border-brand-cyan/25 pb-1 mb-2">
              <span className="font-black text-brand-cyan text-[9.5px] uppercase text-glow-cyan">COORD_INDEX: {activeState.name}</span>
              <button 
                onClick={() => setActiveStateId(null)} 
                className="text-brand-pink border border-brand-pink/30 px-1 rounded hover:bg-brand-pink/10 transition-colors text-[8px]"
              >
                RESET
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="p-1 bg-white/5 border border-white/5 rounded">
                <span className="text-[7.5px] text-brand-cyan/55 leading-none block">INCIDENCE_RATE</span>
                <div className="font-extrabold text-white text-[10px] mt-0.5">{activeState.incidence.toLocaleString()}</div>
              </div>
              <div className="p-1 bg-white/5 border border-white/5 rounded">
                <span className="text-[7.5px] text-brand-cyan/55 leading-none block">RATE_PER_100K</span>
                <div className="font-extrabold text-brand-pink text-[10px] mt-0.5 text-glow-pink">{activeState.ratePer100k}</div>
              </div>
            </div>
            
            <div className="p-1.5 bg-brand-cyan/5 border border-brand-cyan/15 rounded mb-2">
              <span className="text-[7.5px] text-brand-cyan/55 leading-none block">PRIMARY_DIAGNOSIS</span>
              <div className="font-bold text-white text-[9.5px] mt-0.5">{activeState.mostCommon}</div>
            </div>
            
            {activeState.notes && (
              <div className="p-1.5 bg-[#020d20] border border-brand-border/15 rounded mb-2 text-gray-300 text-[8px] leading-tight">
                {activeState.notes}
              </div>
            )}
            
            <div className="flex flex-col gap-1 max-h-[60px] overflow-y-auto pr-0.5 scrollbar-thin">
              <span className="font-bold text-[7.5px] text-brand-cyan/60 uppercase leading-none block">Oncology Registries</span>
              {activeState.hospitals.map((h, i) => (
                <div key={i} className="text-[8px] text-gray-300 leading-tight py-0.5 border-l border-brand-cyan/35 pl-1.5 truncate">
                  {h}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom command console navigator trapezoid tab group */}
      <div className="flex justify-center w-full z-20 pb-1">
        <div className="flex items-center gap-1 bg-[#020d20] border border-brand-cyan/35 rounded-t-xl px-4 py-1.5 shadow-[0_-5px_15px_rgba(0,240,255,0.06)] relative select-none">
          
          {[
            { id: null, label: "Overview" },
            { id: "dl", label: "Delhi" },
            { id: "mh", label: "Maharashtra" },
            { id: "mz", label: "Mizoram" },
            { id: "kl", label: "Kerala" },
            { id: "as", label: "Assam" }
          ].map((tab) => {
            const isActive = activeStateId === tab.id;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveStateId(tab.id)}
                className={`px-3 py-1 text-[8px] font-mono font-bold tracking-wider uppercase transition-all duration-300 relative ${
                  isActive 
                    ? "bg-brand-cyan/15 border border-brand-cyan/50 text-brand-cyan text-glow-cyan" 
                    : "border border-brand-border/10 text-brand-cyan/50 hover:text-white hover:bg-white/5"
                }`}
                style={{ clipPath: "polygon(6px 0%, calc(100% - 6px) 0%, 100% 100%, 0% 100%)" }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const rightColumnContent = (
    <div className="flex flex-col h-full w-full">
      {/* D3 Force-Directed Graph taking up full panel height */}
      <HudPanel title="Oncology Attribute Network" subtitle="SYS_NET_01" className="h-full w-full">
        <div className="flex-1 w-full h-full relative overflow-hidden bg-[#020d20]/50 border border-brand-border/15 rounded shadow-inner shadow-brand-cyan/5">
          <ForceGraph activeStateId={activeStateId} />
        </div>
      </HudPanel>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-brand-dark text-white font-sans selection:bg-brand-cyan selection:text-brand-dark relative overflow-hidden flex flex-col justify-between hud-grid-bg">
      
      {/* Laser Scanning Overlay Line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-brand-cyan/15 to-transparent blur-[1px] pointer-events-none z-30 laser-scan-line" />

      {/* Background visual glows */}
      <div className="absolute top-[15%] left-[20%] w-[35%] h-[35%] bg-brand-cyan/2 rounded-full filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[15%] right-[20%] w-[35%] h-[35%] bg-brand-purple/2 rounded-full filter blur-[120px] pointer-events-none z-0" />

      {/* Top Header HUD Bar */}
      <header className="w-full h-12 flex items-center justify-between px-6 border-b border-brand-cyan/15 bg-brand-dark/80 relative z-30 font-mono select-none">
        
        {/* Left Logo */}
        <div className="flex items-center">
          <img src="/logo-full-light.png" alt="Bharat Cancer" className="h-6 object-contain" />
        </div>

        {/* Center Title Trapezoid */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 top-0 h-10 px-8 flex items-center justify-center bg-[#020d20] border-b border-x border-brand-cyan/35 shadow-lg shadow-brand-cyan/5"
          style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 15px) 100%, 15px 100%)" }}
        >
          <img src="/logo-mark.png" alt="Bharat Cancer Logo" className="w-3.5 h-3.5 object-contain mr-2.5 animate-pulse brightness-110" />
          <span className="text-[11px] font-black tracking-widest text-glow-cyan text-brand-cyan">
            BHARAT CANCER VISUALIZATION
          </span>
        </div>

        {/* Right Digital Clock */}
        <div className="text-[10px] text-brand-cyan/85 font-bold tracking-widest">
          {currentTime}
        </div>
      </header>

      {/* Resizable Widescreen Split Grid / Mobile Column Stack */}
      {isLargeScreen ? (
        <main 
          ref={containerRef}
          className="flex-1 flex gap-0 px-4 py-3 h-[calc(100vh-3rem)] overflow-hidden relative z-20 select-none"
          style={{ userSelect: isDragging ? "none" : "auto" }}
        >
          {/* ================= LEFT COLUMN: INDIA MAP HEATMAP ================= */}
          <div 
            className="h-full relative shrink-0 pr-2"
            style={{ width: `${leftWidth}%` }}
          >
            {leftColumnContent}
          </div>

          {/* ================= RESIZABLE DIVIDER ================= */}
          <div 
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            className={`w-3 h-full cursor-col-resize flex items-center justify-center relative select-none shrink-0 transition-colors z-30 group ${
              isDragging ? "bg-brand-cyan/20" : "hover:bg-brand-cyan/10"
            }`}
          >
            <div className={`w-[1px] h-full transition-colors ${
              isDragging ? "bg-brand-cyan" : "bg-brand-border/40 group-hover:bg-brand-cyan/60"
            }`} />
            <div className={`absolute w-1.5 h-6 rounded-full border border-brand-cyan/50 bg-[#020d20] flex flex-col items-center justify-center gap-[2px] transition-all ${
              isDragging ? "shadow-[0_0_8px_#00f0ff] scale-y-110" : "group-hover:scale-y-110"
            }`}>
              <span className="w-[3px] h-[1px] bg-brand-cyan/70" />
              <span className="w-[3px] h-[1px] bg-brand-cyan/70" />
              <span className="w-[3px] h-[1px] bg-brand-cyan/70" />
            </div>
          </div>

          {/* ================= RIGHT COLUMN: D3 FORCE GRAPH ================= */}
          <div 
            className="h-full pb-1.5 shrink-0 pl-2"
            style={{ width: `${100 - leftWidth}%` }}
          >
            {rightColumnContent}
          </div>
        </main>
      ) : (
        <main className="flex-1 flex flex-col gap-6 px-4 py-3 overflow-y-auto relative z-20">
          <div className="w-full relative min-h-[500px]">
            {leftColumnContent}
          </div>
          <div className="w-full pb-1.5 min-h-[500px]">
            {rightColumnContent}
          </div>
        </main>
      )}

      {/* Cockpit footer status */}
      <footer className="w-full py-2.5 border-t border-brand-cyan/15 bg-[#010815] text-[8.5px] text-brand-cyan/50 font-mono flex items-center justify-between px-6 select-none z-30">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
          <span>SYSTEM VERIFICATION: SECURE (100%)</span>
        </div>
        <div>
          <span>© 2026 BHARATCANCER.COM // IN PARTNERSHIP WITH 1CELL.AI™</span>
        </div>
        <div className="flex items-center gap-3">
          <span>LOC_INDEX: IND_RCC_NET</span>
          <span>SYS_v4.2.1</span>
        </div>
      </footer>
      
    </div>
  );
}
