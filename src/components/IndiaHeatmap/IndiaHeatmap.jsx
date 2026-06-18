import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapLocationDot } from 'react-icons/fa6';
import { STATE_DATA } from '../../data/indiaData';
import styles from './IndiaHeatmap.module.css';

// SVG paths for Indian states — simplified but recognisable regional shapes
// Coordinates mapped to a 500×560 viewBox (roughly correct proportions)
const INDIA_SVG_STATES = [
  { name: 'Jammu & Kashmir', path: 'M120,20 L200,10 L240,30 L220,70 L180,80 L140,60 Z', cx: 180, cy: 45 },
  { name: 'Himachal Pradesh', path: 'M200,70 L240,60 L260,90 L230,110 L195,100 Z', cx: 228, cy: 88 },
  { name: 'Punjab',    path: 'M155,80 L200,70 L195,110 L165,120 L145,100 Z', cx: 172, cy: 98 },
  { name: 'Uttarakhand', path: 'M240,90 L280,80 L295,110 L265,130 L235,120 Z', cx: 265, cy: 108 },
  { name: 'Haryana',   path: 'M165,120 L200,108 L208,140 L180,155 L158,142 Z', cx: 183, cy: 135 },
  { name: 'Delhi',     path: 'M202,130 L215,128 L218,145 L202,147 Z', cx: 210, cy: 138 },
  { name: 'Rajasthan', path: 'M120,130 L170,120 L210,145 L200,210 L155,240 L110,220 L100,170 Z', cx: 155, cy: 185 },
  { name: 'Uttar Pradesh', path: 'M210,110 L300,100 L335,130 L315,180 L260,195 L210,175 Z', cx: 268, cy: 148 },
  { name: 'Bihar',     path: 'M300,160 L355,150 L365,185 L330,205 L295,195 Z', cx: 330, cy: 178 },
  { name: 'West Bengal', path: 'M355,155 L390,145 L400,200 L375,250 L350,240 L345,195 Z', cx: 372, cy: 197 },
  { name: 'Assam',     path: 'M390,145 L440,135 L455,160 L430,175 L395,168 Z', cx: 425, cy: 157 },
  { name: 'Arunachal Pradesh', path: 'M430,110 L490,100 L500,135 L450,140 L425,128 Z', cx: 462, cy: 120 },
  { name: 'Nagaland',  path: 'M448,158 L475,150 L480,175 L450,180 Z', cx: 463, cy: 165 },
  { name: 'Manipur',   path: 'M455,178 L480,172 L482,200 L455,205 Z', cx: 468, cy: 190 },
  { name: 'Mizoram',   path: 'M448,205 L472,198 L474,225 L446,228 Z', cx: 460, cy: 213 },
  { name: 'Tripura',   path: 'M420,210 L438,205 L440,228 L418,232 Z', cx: 429, cy: 218 },
  { name: 'Meghalaya', path: 'M395,172 L432,165 L435,188 L398,194 Z', cx: 415, cy: 180 },
  { name: 'Jharkhand', path: 'M320,195 L365,185 L368,228 L330,240 L310,228 Z', cx: 338, cy: 215 },
  { name: 'Odisha',    path: 'M330,238 L375,228 L380,280 L345,305 L318,285 Z', cx: 350, cy: 268 },
  { name: 'Madhya Pradesh', path: 'M180,210 L310,200 L320,260 L280,290 L200,275 L170,248 Z', cx: 248, cy: 248 },
  { name: 'Chhattisgarh', path: 'M295,255 L340,245 L348,308 L315,330 L285,315 Z', cx: 317, cy: 290 },
  { name: 'Gujarat',   path: 'M95,195 L155,205 L160,260 L130,295 L88,278 L75,240 Z', cx: 120, cy: 248 },
  { name: 'Maharashtra', path: 'M150,265 L285,260 L290,315 L250,350 L175,338 L138,308 Z', cx: 218, cy: 308 },
  { name: 'Telangana', path: 'M270,310 L330,300 L335,350 L295,372 L260,355 Z', cx: 298, cy: 338 },
  { name: 'Andhra Pradesh', path: 'M255,350 L335,338 L345,398 L295,420 L245,400 Z', cx: 298, cy: 382 },
  { name: 'Karnataka', path: 'M175,338 L262,325 L268,390 L235,420 L180,408 L158,375 Z', cx: 215, cy: 375 },
  { name: 'Goa',       path: 'M158,378 L175,372 L178,392 L158,396 Z', cx: 168, cy: 385 },
  { name: 'Kerala',    path: 'M185,410 L218,402 L215,470 L188,468 Z', cx: 202, cy: 438 },
  { name: 'Tamil Nadu', path: 'M218,398 L295,382 L288,455 L248,480 L210,468 Z', cx: 252, cy: 436 },
  { name: 'Puducherry', path: 'M290,428 L302,425 L303,440 L290,442 Z', cx: 296, cy: 434 },
  { name: 'Sikkim',    path: 'M378,133 L395,128 L397,148 L375,150 Z', cx: 386, cy: 140 },
];

const STATE_BURDEN = {
  'Uttar Pradesh': { level: 5, cases: '1.64L' },
  'Maharashtra':   { level: 5, cases: '1.43L' },
  'West Bengal':   { level: 4, cases: '1.18L' },
  'Bihar':         { level: 4, cases: '0.96L' },
  'Tamil Nadu':    { level: 4, cases: '0.93L' },
  'Karnataka':     { level: 4, cases: '0.88L' },
  'Delhi':         { level: 3, cases: '0.64L' },
  'Kerala':        { level: 3, cases: '0.61L' },
  'Assam':         { level: 3, cases: '0.54L' },
  'Rajasthan':     { level: 3, cases: '0.51L' },
  'Madhya Pradesh':{ level: 3, cases: '0.48L' },
  'Andhra Pradesh':{ level: 3, cases: '0.46L' },
  'Gujarat':       { level: 3, cases: '0.44L' },
  'Odisha':        { level: 2, cases: '0.38L' },
  'Jharkhand':     { level: 2, cases: '0.32L' },
  'Telangana':     { level: 2, cases: '0.31L' },
};

const LEVEL_COLORS = {
  5: { fill: '#ff0080', stroke: '#ff44aa', glow: 'rgba(255,0,128,0.6)' },
  4: { fill: '#d946ef', stroke: '#ec4899', glow: 'rgba(217,70,239,0.5)' },
  3: { fill: '#7c3aed', stroke: '#a78bfa', glow: 'rgba(124,58,237,0.4)' },
  2: { fill: '#3b82f6', stroke: '#60a5fa', glow: 'rgba(59,130,246,0.35)' },
  1: { fill: '#1e3a5f', stroke: '#2d4a7a', glow: 'rgba(30,58,95,0.2)' },
};

export default function IndiaHeatmap() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className={`${styles.wrapper} glass-card`}>
      <div className={styles.header}>
        <div>
          <span className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FaMapLocationDot size={11} color="rgba(167,139,250,0.6)" />
            State-wise Incidence Burden
          </span>
          <p className={styles.subtitle}>Estimated new cases, India 2022 · ICMR-NCRP</p>
        </div>
        <div className={styles.legend}>
          {[5,4,3,2,1].map(l => (
            <div key={l} className={styles.legendItem}>
              <span className={styles.legendSwatch} style={{ background: LEVEL_COLORS[l].fill, boxShadow: `0 0 5px ${LEVEL_COLORS[l].glow}` }} />
              <span className={styles.legendText}>{l === 5 ? 'Very High' : l === 4 ? 'High' : l === 3 ? 'Medium' : l === 2 ? 'Low' : 'Very Low'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Choropleth Map */}
      <div className={styles.mapContainer}>
        <svg viewBox="0 0 540 520" className={styles.mapSvg} xmlns="http://www.w3.org/2000/svg">
          <defs>
            {Object.entries(LEVEL_COLORS).map(([level, c]) => (
              <radialGradient key={`mg${level}`} id={`mapgrad${level}`} cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor={c.fill} stopOpacity="0.9" />
                <stop offset="100%" stopColor={c.fill} stopOpacity="0.5" />
              </radialGradient>
            ))}
            <filter id="mapglow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {INDIA_SVG_STATES.map((s, i) => {
            const burden = STATE_BURDEN[s.name];
            const level  = burden ? burden.level : 1;
            const col    = LEVEL_COLORS[level];
            const isHov  = hovered === s.name;

            return (
              <motion.g
                key={s.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                onMouseEnter={() => setHovered(s.name)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                <path
                  d={s.path}
                  fill={`url(#mapgrad${level})`}
                  stroke={col.stroke}
                  strokeWidth={isHov ? 1.5 : 0.8}
                  filter={isHov || level >= 4 ? 'url(#mapglow)' : undefined}
                  style={{
                    transition: 'all 0.2s ease',
                    filter: isHov ? `drop-shadow(0 0 8px ${col.glow})` : undefined,
                  }}
                />
                {/* Tooltip on hover */}
                {isHov && burden && (
                  <g>
                    <rect x={s.cx - 28} y={s.cy - 22} width={56} height={18} rx={4} fill="rgba(10,5,20,0.9)" stroke={col.stroke} strokeWidth="0.8" />
                    <text x={s.cx} y={s.cy - 10} textAnchor="middle" fill="white" fontSize="7" fontFamily="Orbitron, monospace" fontWeight="700">{burden.cases}</text>
                  </g>
                )}
              </motion.g>
            );
          })}

          {/* India label */}
          <text x="270" y="510" textAnchor="middle" fill="rgba(167,139,250,0.3)" fontSize="10" fontFamily="Rajdhani, sans-serif" fontWeight="600" letterSpacing="3">INDIA</text>
        </svg>
      </div>

      {/* Ranking bars */}
      <div className={styles.rankingSection}>
        <span className="section-label" style={{ marginBottom: 8, display: 'block' }}>State Ranking — Estimated New Cases</span>
        {STATE_DATA.map((s, i) => (
          <motion.div
            key={s.state}
            className={styles.rankRow}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.07 }}
          >
            <span className={styles.rankNum}>#{s.rank}</span>
            <span className={styles.rankState}>{s.state}</span>
            <div className={styles.rankBarTrack}>
              <motion.div
                className={styles.rankBarFill}
                style={{
                  background: `linear-gradient(90deg, ${i < 2 ? '#ff0080, #f97316' : i < 4 ? '#d946ef, #ec4899' : i < 6 ? '#7c3aed, #a78bfa' : '#3b82f6, #7c3aed'})`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${s.pct}%` }}
                transition={{ duration: 1.2, delay: 0.5 + i * 0.07 }}
              />
            </div>
            <span className={styles.rankCases}>{s.cases.toLocaleString('en-IN')}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
