import React, { useState, useRef, useEffect, useCallback } from 'react';
import india from '@svg-maps/india';
import { motion, AnimatePresence } from 'framer-motion';

// ── @svg-maps/india id → our stateData id ─────────────────
const SVG_TO_STATE = {
  an: 'andaman-nicobar',
  ap: 'andhra-pradesh',
  ar: 'arunachal-pradesh',
  as: 'assam',
  br: 'bihar',
  ch: null,               // Chandigarh – UT, no separate data
  ct: 'chhattisgarh',
  dn: null,               // Dadra & Nagar Haveli
  dd: null,               // Daman & Diu
  dl: 'delhi',
  ga: 'goa',
  gj: 'gujarat',
  hr: 'haryana',
  hp: 'himachal-pradesh',
  jk: 'jammu-kashmir',
  jh: 'jharkhand',
  ka: 'karnataka',
  kl: 'kerala',
  ld: 'lakshadweep',
  mp: 'madhya-pradesh',
  mh: 'maharashtra',
  mn: 'manipur',
  ml: 'meghalaya',
  mz: 'mizoram',
  nl: 'nagaland',
  or: 'odisha',
  py: 'puducherry',
  pb: 'punjab',
  rj: 'rajasthan',
  sk: 'sikkim',
  tn: 'tamil-nadu',
  tg: 'telangana',
  tr: 'tripura',
  up: 'uttar-pradesh',
  ut: 'uttarakhand',
  wb: 'west-bengal',
};

// ── Choropleth colour scale (CIR per 100K) ────────────────
function cirToFill(cir) {
  if (!cir) return 'rgba(20, 30, 55, 0.92)';
  if (cir >= 200) return 'rgba(192, 57, 43, 0.82)';
  if (cir >= 140) return 'rgba(224, 90, 40, 0.82)';
  if (cir >= 100) return 'rgba(227, 140, 46, 0.78)';
  if (cir >=  80) return 'rgba(26, 106, 173, 0.82)';
  if (cir >=  65) return 'rgba(27, 80, 128, 0.82)';
  if (cir >=  50) return 'rgba(29, 58, 92, 0.82)';
  return 'rgba(22, 33, 60, 0.82)';
}

function cirToHoverFill(cir) {
  if (!cir) return 'rgba(35, 50, 90, 0.95)';
  if (cir >= 200) return 'rgba(231, 76, 60, 0.95)';
  if (cir >= 140) return 'rgba(255, 106, 56, 0.95)';
  if (cir >= 100) return 'rgba(240, 168, 64, 0.95)';
  if (cir >=  80) return 'rgba(41, 128, 185, 0.95)';
  if (cir >=  65) return 'rgba(36, 113, 163, 0.95)';
  if (cir >=  50) return 'rgba(31, 97, 141, 0.95)';
  return 'rgba(40, 60, 100, 0.95)';
}

function fmtN(n) {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)  return `${(n / 1000).toFixed(1)}K`;
  return n?.toString() ?? '—';
}

// ── Rank badge colour ─────────────────────────────────────────
function rankBadgeColor(rank) {
  if (rank <= 3)  return { bg: 'rgba(245,158,11,0.92)',  text: '#1a1000' };
  if (rank <= 10) return { bg: 'rgba(99,102,241,0.92)',  text: '#fff'    };
  return              { bg: 'rgba(30,35,55,0.88)',    text: 'rgba(255,255,255,0.80)' };
}

// ── IndiaMap ──────────────────────────────────────────────
function IndiaMap({ statesById, selected, onSelect, showRanks = false, stateRankMap = {} }) {
  const containerRef = useRef(null);
  const svgRef       = useRef(null);

  // True SVG-coordinate centroids via getBBox() after first paint
  const [centroids, setCentroids] = useState({});
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const map = {};
    india.locations.forEach(loc => {
      const el = svg.querySelector(`[data-id="${loc.id}"]`);
      if (el) {
        const b = el.getBBox();
        map[loc.id] = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
      }
    });
    setCentroids(map);
  }, []);

  // Zoom + pan
  const [scale,     setScale]     = useState(1);
  const [position,  setPosition]  = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragged,   setDragged]   = useState(false);
  const panStart   = useRef({ x: 0, y: 0 });
  const startPos   = useRef({ x: 0, y: 0 });

  // Tooltip
  const [hovered, setHovered] = useState(null); // { svgId, data, x, y }

  // Wheel zoom (must be non-passive to call preventDefault)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const factor = 1.15;
      setScale(prev => {
        const next = Math.max(1, Math.min(8, e.deltaY < 0 ? prev * factor : prev / factor));
        if (next === 1) setPosition({ x: 0, y: 0 });
        return next;
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    setDragged(false);
    startPos.current = { x: e.clientX, y: e.clientY };
    panStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  }, [position]);

  const onMouseMove = useCallback((e) => {
    if (!isPanning) return;
    const dx = Math.abs(e.clientX - startPos.current.x);
    const dy = Math.abs(e.clientY - startPos.current.y);
    if (dx > 4 || dy > 4) setDragged(true);

    const rect = containerRef.current?.getBoundingClientRect();
    const w = rect?.width  ?? 500;
    const h = rect?.height ?? 500;
    const maxX = (scale - 1) * (w / 2);
    const maxY = (scale - 1) * (h / 2);
    setPosition({
      x: Math.max(-maxX, Math.min(maxX, e.clientX - panStart.current.x)),
      y: Math.max(-maxY, Math.min(maxY, e.clientY - panStart.current.y)),
    });
  }, [isPanning, scale]);

  const onMouseUp = useCallback(() => setIsPanning(false), []);

  const zoomIn    = useCallback((e) => { e.stopPropagation(); setScale(p => Math.min(8, p * 1.3)); }, []);
  const zoomOut   = useCallback((e) => { e.stopPropagation(); setScale(p => { const n = Math.max(1, p / 1.3); if (n === 1) setPosition({ x: 0, y: 0 }); return n; }); }, []);
  const resetZoom = useCallback((e) => { e.stopPropagation(); setScale(1); setPosition({ x: 0, y: 0 }); }, []);

  const handleStateMouseMove = useCallback((e, svgId) => {
    const stateId = SVG_TO_STATE[svgId];
    const data    = stateId ? statesById[stateId] : null;
    const rect    = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(e.clientX - rect.left + 20, rect.width  - 200);
    const y = Math.max(e.clientY - rect.top  - 20, 5);
    setHovered({ svgId, data, x, y });
  }, [statesById]);

  const handleStateLeave = useCallback(() => setHovered(null), []);

  const handleStateClick = useCallback((svgId) => {
    if (dragged) return;
    const stateId = SVG_TO_STATE[svgId];
    if (stateId) onSelect(stateId);
  }, [dragged, onSelect]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Subtle dot grid background */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 8,
        backgroundImage: 'radial-gradient(rgba(99,102,241,0.08) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
        pointerEvents: 'none',
      }} />

      {/* Map container — pan/zoom host */}
      <div
        ref={containerRef}
        style={{
          position: 'relative', width: '100%', height: '100%',
          overflow: 'hidden', borderRadius: 8,
          cursor: isPanning ? 'grabbing' : 'grab',
          background: 'transparent',
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* SVG map */}
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={india.viewBox}
          preserveAspectRatio="xMidYMid meet"
          style={{
            width: '100%', height: '100%',
            display: 'block',
            transform: `translate3d(${position.x}px,${position.y}px,0) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.2s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        >
          <defs>

            {/* Selected state glow */}
            <filter id="state-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
              <feFlood floodColor="#ffffff" floodOpacity="0.55" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Subtle emboss for all states */}
            <filter id="state-emboss" x="-4%" y="-4%" width="110%" height="110%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="blur" />
              <feSpecularLighting in="blur" surfaceScale="3" specularConstant="0.6"
                specularExponent="18" result="spec" lightingColor="rgba(255,255,255,0.35)">
                <fePointLight x="200" y="80" z="220" />
              </feSpecularLighting>
              <feComposite in="spec" in2="SourceAlpha" operator="in" result="litSpec" />
              <feComposite in="SourceGraphic" in2="litSpec" operator="arithmetic"
                k1="0" k2="1" k3="0.35" k4="0" />
            </filter>
          </defs>



          {/* Render all 36 state paths */}
          {india.locations.map(loc => {
            const stateId  = SVG_TO_STATE[loc.id];
            const data     = stateId ? statesById[stateId] : null;
            const isActive = selected === stateId && stateId !== null;
            const isHov    = hovered?.svgId === loc.id;
            const fill     = isHov ? cirToHoverFill(data?.cir) : cirToFill(data?.cir);

            return (
              <g key={loc.id}>
                {/* Drop shadow */}
                <path
                  d={loc.path}
                  fill="rgba(0,0,0,0.4)"
                  transform="translate(1.5,3.5)"
                  style={{ pointerEvents: 'none' }}
                />

                {/* State body */}
                <path
                  data-id={loc.id}
                  d={loc.path}
                  fill={fill}
                  stroke={
                    isActive ? '#ffffff' :
                    isHov    ? 'rgba(255,255,255,0.55)' :
                               'rgba(255,255,255,0.12)'
                  }
                  strokeWidth={isActive ? 1.8 : isHov ? 1.0 : 0.45}
                  strokeLinejoin="round"
                  filter={isActive ? 'url(#state-glow)' : 'url(#state-emboss)'}
                  style={{
                    cursor:     stateId ? 'pointer' : 'default',
                    transition: 'fill 0.15s ease, stroke-width 0.1s ease',
                  }}
                  onClick={() => handleStateClick(loc.id)}
                  onMouseMove={e => handleStateMouseMove(e, loc.id)}
                  onMouseLeave={handleStateLeave}
                />

                {/* Top-edge highlight sheen */}
                <path
                  d={loc.path}
                  fill="none"
                  stroke="rgba(255,255,255,0.10)"
                  strokeWidth="0.7"
                  style={{ pointerEvents: 'none' }}
                />

                {/* ── Rank badge ── */}
                {showRanks && stateId && stateRankMap[stateId] != null && centroids[loc.id] && (() => {
                  const rank   = stateRankMap[stateId];
                  const { x, y } = centroids[loc.id];
                  const { bg, text } = rankBadgeColor(rank);
                  const label  = String(rank);
                  const w      = label.length > 1 ? 13 : 10;
                  return (
                    <g style={{ pointerEvents: 'none' }}>
                      {/* Pill background */}
                      <rect
                        x={x - w / 2} y={y - 5}
                        width={w} height={10}
                        rx={5} ry={5}
                        fill={bg}
                        stroke="rgba(0,0,0,0.4)"
                        strokeWidth={0.6}
                      />
                      {/* Rank number */}
                      <text
                        x={x} y={y + 0.5}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={text}
                        fontSize={rank <= 9 ? 6.5 : 5.5}
                        fontWeight="800"
                        fontFamily="JetBrains Mono, monospace"
                        letterSpacing="0"
                      >
                        {rank}
                      </text>
                    </g>
                  );
                })()}
              </g>
            );
          })}
        </svg>

        {/* ── Zoom controls ─────────────────────────── */}
        <div style={{
          position: 'absolute', bottom: 12, right: 12,
          display: 'flex', flexDirection: 'column', gap: 4, zIndex: 30,
        }}>
          {[
            { label: '+', fn: zoomIn,    title: 'Zoom In'    },
            { label: '−', fn: zoomOut,   title: 'Zoom Out'   },
            { label: '⟲', fn: resetZoom, title: 'Reset View' },
          ].map(({ label, fn, title }) => (
            <button key={label} onClick={fn} title={title} className="zoom-btn">
              {label}
            </button>
          ))}
        </div>

        {/* ── Map corner tag ────────────────────────── */}
        <div style={{
          position: 'absolute', top: 8, left: 10,
          fontSize: 9, fontFamily: 'JetBrains Mono, monospace',
          color: 'rgba(99,102,241,0.5)', letterSpacing: 2,
          pointerEvents: 'none',
        }}>
          INDIA · CANCER ATLAS
        </div>

        {/* ── In-container tooltip ──────────────────── */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="map-tooltip"
              style={{ position: 'absolute', left: hovered.x, top: hovered.y, pointerEvents: 'none' }}
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{    opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.1 }}
            >
              <div className="tooltip-name">
                {india.locations.find(l => l.id === hovered.svgId)?.name ?? hovered.svgId}
              </div>
              {hovered.data ? (
                <>
                  <div className="tooltip-row">
                    <span>New Cases</span>
                    <span className="tooltip-val">{fmtN(hovered.data.newCases)}</span>
                  </div>
                  <div className="tooltip-row">
                    <span>Deaths</span>
                    <span className="tooltip-val">{fmtN(hovered.data.deaths)}</span>
                  </div>
                  <div className="tooltip-row">
                    <span>CIR / 100K</span>
                    <span className="tooltip-val">{hovered.data.cir}</span>
                  </div>
                  <div className="tooltip-row">
                    <span>Top Cancer</span>
                    <span className="tooltip-val">{hovered.data.topCancer}</span>
                  </div>
                  {showRanks && stateRankMap[SVG_TO_STATE[hovered.svgId]] != null && (
                    <div className="tooltip-row">
                      <span>Rank</span>
                      <span className="tooltip-val" style={{ color: stateRankMap[SVG_TO_STATE[hovered.svgId]] <= 3 ? '#f59e0b' : 'var(--text)' }}>
                        #{stateRankMap[SVG_TO_STATE[hovered.svgId]]}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="tooltip-row">
                  <span style={{ color: 'var(--text-3)' }}>No data available</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default IndiaMap;
