import React from 'react';
import { motion } from 'framer-motion';
import { BURDEN_NODES } from '../../data/indiaData';
import styles from './CancerBurdenGraph.module.css';

// Curved SVG path between two points
function curvePath(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const off = Math.sqrt(dx * dx + dy * dy) * 0.2;
  const cx1 = mx - dy * 0.15;
  const cy1 = my + dx * 0.15;
  return `M${x1},${y1} Q${cx1},${cy1} ${x2},${y2}`;
}

export default function CancerBurdenGraph() {
  const center = BURDEN_NODES[0];
  const leaves  = BURDEN_NODES.slice(1);

  // Convert percentage coords to SVG units (500×500 viewBox)
  const toSVG = (pct) => (pct / 100) * 500;

  const cx = toSVG(center.x);
  const cy = toSVG(center.y);

  return (
    <div className={`${styles.wrapper} glass-card`}>
      <div className={styles.header}>
        <span className="section-label">Cancer Burden — Leading Sites</span>
        <span className={styles.source}>ICMR-NCRP 2022</span>
      </div>

      <div className={styles.svgContainer}>
        <svg viewBox="0 0 500 500" className={styles.svg} xmlns="http://www.w3.org/2000/svg">
          <defs>
            {BURDEN_NODES.map((n) => (
              <radialGradient key={`rg-${n.id}`} id={`rg-${n.id}`} cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor={n.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={n.color} stopOpacity="0.3" />
              </radialGradient>
            ))}
            {leaves.map((n) => (
              <linearGradient key={`lg-${n.id}`} id={`lg-${n.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={center.color} stopOpacity="0.6" />
                <stop offset="100%" stopColor={n.color} stopOpacity="0.6" />
              </linearGradient>
            ))}
            <filter id="glow-filter">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Connector lines */}
          {leaves.map((n, i) => {
            const nx = toSVG(n.x);
            const ny = toSVG(n.y);
            return (
              <motion.path
                key={`line-${n.id}`}
                d={curvePath(cx, cy, nx, ny)}
                fill="none"
                stroke={`url(#lg-${n.id})`}
                strokeWidth="1.5"
                strokeLinecap="round"
                filter="url(#glow-filter)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: 'easeOut' }}
              />
            );
          })}

          {/* Leaf nodes */}
          {leaves.map((n, i) => {
            const nx = toSVG(n.x);
            const ny = toSVG(n.y);
            const r  = n.size * 1.6;
            return (
              <motion.g
                key={n.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.15 }}
                style={{ transformOrigin: `${nx}px ${ny}px` }}
              >
                {/* Outer glow ring */}
                <circle cx={nx} cy={ny} r={r + 6} fill={n.color} fillOpacity="0.08" />
                <circle cx={nx} cy={ny} r={r + 3} fill="none" stroke={n.color} strokeWidth="0.8" strokeOpacity="0.4" />
                {/* Main circle */}
                <circle cx={nx} cy={ny} r={r} fill={`url(#rg-${n.id})`} stroke={n.color} strokeWidth="1" filter="url(#glow-filter)" />
                {/* Label */}
                {n.label.split('\n').map((line, li) => (
                  <text
                    key={li}
                    x={nx}
                    y={ny + (li - (n.label.split('\n').length - 1) / 2) * 10}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="8"
                    fontFamily="Rajdhani, sans-serif"
                    fontWeight="700"
                    letterSpacing="0.5"
                  >
                    {line}
                  </text>
                ))}
              </motion.g>
            );
          })}

          {/* Center node */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          >
            <circle cx={cx} cy={cy} r={center.size + 14} fill={center.color} fillOpacity="0.1" />
            <circle cx={cx} cy={cy} r={center.size + 8} fill="none" stroke={center.color} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 3" />
            <circle cx={cx} cy={cy} r={center.size} fill={`url(#rg-${center.id})`} stroke={center.color} strokeWidth="1.5" filter="url(#glow-filter)" />
            {center.label.split('\n').map((line, li) => (
              <text
                key={li}
                x={cx}
                y={cy + (li - 0.5) * 13}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="11"
                fontFamily="Orbitron, monospace"
                fontWeight="700"
              >
                {line}
              </text>
            ))}
          </motion.g>
        </svg>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        {leaves.map((n) => (
          <div key={n.id} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: n.color, boxShadow: `0 0 6px ${n.color}` }} />
            <span className={styles.legendLabel}>{n.label.replace('\n', ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
