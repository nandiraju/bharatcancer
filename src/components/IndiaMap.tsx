import React, { useState, useRef, useEffect } from "react";
import india from "@svg-maps/india";
import { cancerData } from "../data/cancerData";

interface IndiaMapProps {
  activeStateId: string | null;
  onSelectState: (stateId: string | null) => void;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({ activeStateId, onSelectState }) => {
  const [hoveredState, setHoveredState] = useState<{
    id: string;
    name: string;
    rate: number;
    cases: number;
    x: number;
    y: number;
  } | null>(null);

  // Zoom and Pan state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [dragged, setDragged] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  // Helper to determine state color based on cancer rate per 100k
  const getStateColor = (id: string, isActive: boolean) => {
    if (isActive) return "rgba(0, 240, 255, 0.35)"; // Holographic selected fill

    const stateDetail = cancerData.states[id];
    if (!stateDetail) return "#040b17"; // Dark background for states with no detail

    const rate = stateDetail.ratePer100k;
    if (rate >= 130) return "rgba(236, 72, 153, 0.22)"; // Pink tint
    if (rate >= 115) return "rgba(139, 92, 246, 0.22)"; // Purple tint
    return "rgba(0, 126, 255, 0.15)";                  // Blue tint
  };

  // Bind wheel zoom listener to container ref (passive: false is required to block browser scroll)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scaleFactor = 1.15;
      
      setScale((prevScale) => {
        const nextScale = Math.max(1, Math.min(8, e.deltaY < 0 ? prevScale * scaleFactor : prevScale / scaleFactor));
        if (nextScale === 1) {
          setPosition({ x: 0, y: 0 });
        } else {
          setPosition((prevPos) => {
            const rect = containerRef.current?.getBoundingClientRect();
            const width = rect ? rect.width : 500;
            const height = rect ? rect.height : 500;
            const maxPanX = (nextScale - 1) * (width / 2);
            const maxPanY = (nextScale - 1) * (height / 2);
            return {
              x: Math.max(-maxPanX, Math.min(maxPanX, prevPos.x)),
              y: Math.max(-maxPanY, Math.min(maxPanY, prevPos.y))
            };
          });
        }
        return nextScale;
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only allow left-click dragging
    setIsPanning(true);
    setDragged(false);
    startPos.current = { x: e.clientX, y: e.clientY };
    setPanStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMoveContainer = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = Math.abs(e.clientX - startPos.current.x);
    const dy = Math.abs(e.clientY - startPos.current.y);
    
    if (dx > 4 || dy > 4) {
      setDragged(true);
    }

    const newX = e.clientX - panStart.x;
    const newY = e.clientY - panStart.y;

    // Constrain panning relative to zoom scale and container size
    const rect = containerRef.current?.getBoundingClientRect();
    const width = rect ? rect.width : 500;
    const height = rect ? rect.height : 500;
    const maxPanX = (scale - 1) * (width / 2);
    const maxPanY = (scale - 1) * (height / 2);

    setPosition({
      x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
      y: Math.max(-maxPanY, Math.min(maxPanY, newY))
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const zoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.min(8, prev * 1.3));
  };

  const zoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => {
      const next = Math.max(1, prev / 1.3);
      if (next === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const resetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGPathElement>, id: string, name: string) => {
    const stateDetail = cancerData.states[id];
    const rate = stateDetail ? stateDetail.ratePer100k : 0;
    const cases = stateDetail ? stateDetail.incidence : 0;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const xVal = e.clientX - rect.left + 20;
    const yVal = e.clientY - rect.top - 20;

    // Clamp coordinates so the tooltip never overflows the container boundaries
    const clampedX = Math.max(5, Math.min(rect.width - 150, xVal));
    const clampedY = Math.max(5, Math.min(rect.height - 70, yVal));

    setHoveredState({ id, name, rate, cases, x: clampedX, y: clampedY });
  };

  const handleMouseLeave = () => {
    setHoveredState(null);
  };

  return (
    <div className="relative w-full h-full select-none overflow-visible p-2 flex flex-col justify-center">
      {/* Dynamic Grid Background Layer behind the Map */}
      <div className="absolute inset-0 hud-dots-bg opacity-30 pointer-events-none rounded-xl" />
      <div className="absolute inset-0 bg-brand-cyan/2 blur-[60px] rounded-full pointer-events-none" />

      {/* Interactive SVG Heatmap Viewport */}
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden rounded border border-brand-border/10 bg-[#020d20]/30 shadow-inner select-none flex items-center justify-center"
        style={{ cursor: isPanning ? "grabbing" : "grab" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMoveContainer}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={india.viewBox}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
            transformOrigin: "center center",
            transition: isPanning ? "none" : "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
          }}
          aria-label={india.label}
        >
          {india.locations.map((loc) => {
            const isActive = activeStateId === loc.id;
            const isHovered = hoveredState?.id === loc.id;
            const isPulseActive = isActive || isHovered;

            return (
              <path
                key={loc.id}
                d={loc.path}
                id={loc.id}
                name={loc.name}
                fill={getStateColor(loc.id, isActive)}
                stroke={isActive ? "#00f0ff" : isHovered ? "rgba(0, 240, 255, 0.8)" : "rgba(0, 240, 255, 0.25)"}
                strokeWidth={isActive ? 1.8 : isHovered ? 1.2 : 0.7}
                className={`transition-all duration-300 cursor-pointer outline-none ${
                  isPulseActive ? "hud-state-pulse" : ""
                }`}
                style={{
                  filter: isPulseActive ? undefined : "none",
                  transform: isActive 
                    ? "scale(1.02)" 
                    : isHovered 
                      ? "scale(1.01)" 
                      : "scale(1)",
                  transformOrigin: "center"
                }}
                onClick={() => {
                  if (!dragged) {
                    onSelectState(loc.id === activeStateId ? null : loc.id);
                  }
                }}
                onMouseMove={(e) => handleMouseMove(e, loc.id, loc.name)}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </svg>

        {/* HUD Interactive Heatmap Coordinate Tag */}
        <div className="absolute top-2 left-2 text-[8px] font-mono text-brand-cyan/40 select-none">
          RADAR_INDEX: IND_GRID_v2.0
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-30 font-mono select-none">
          <button
            onClick={zoomIn}
            className="w-6 h-6 flex items-center justify-center bg-brand-dark/80 border border-brand-cyan/35 text-brand-cyan text-xs font-bold rounded hover:bg-brand-cyan/20 active:scale-95 transition-all shadow-md shadow-brand-cyan/5 cursor-pointer"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={zoomOut}
            className="w-6 h-6 flex items-center justify-center bg-brand-dark/80 border border-brand-cyan/35 text-brand-cyan text-xs font-bold rounded hover:bg-brand-cyan/20 active:scale-95 transition-all shadow-md shadow-brand-cyan/5 cursor-pointer"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={resetZoom}
            className="w-6 h-6 flex items-center justify-center bg-brand-dark/80 border border-brand-cyan/35 text-brand-cyan text-[10px] font-bold rounded hover:bg-brand-cyan/20 active:scale-95 transition-all shadow-md shadow-brand-cyan/5 cursor-pointer"
            title="Reset View"
          >
            ⟲
          </button>
        </div>

        {/* Hover Tooltip styled in premium high-tech monospace */}
        {hoveredState && (
          <div
            className="absolute z-50 pointer-events-none rounded border border-brand-cyan bg-[#010a17]/95 px-3 py-2 text-left font-mono shadow-[0_0_15px_rgba(0,240,255,0.25)] backdrop-blur-md"
            style={{
              left: hoveredState.x,
              top: hoveredState.y,
              transform: "translate3d(0, 0, 0)"
            }}
          >
            <div className="text-[11px] font-bold text-white border-b border-brand-cyan/20 pb-1 mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
              {hoveredState.name.toUpperCase()}
            </div>
            {hoveredState.rate > 0 ? (
              <div className="flex flex-col gap-0.5 text-[9px]">
                <div className="flex justify-between gap-6">
                  <span className="text-brand-cyan/60">INCIDENCE_RATE:</span>
                  <span className="font-bold text-brand-cyan">{hoveredState.rate}/100k</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span className="text-brand-cyan/60">ANNUAL_BURDEN:</span>
                  <span className="font-bold text-white">{hoveredState.cases.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="text-[9px] text-brand-cyan/50 italic">STANDBY // NO_COORD_DATA</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndiaMap;

