import React from 'react';
import { motion } from 'framer-motion';
import { STATE_STRIP } from '../../data/indiaData';
import styles from './StateStrip.module.css';

// Simplified abstract state silhouette shapes using SVG paths
// These are stylized geometric shapes representing each region
const STATE_SHAPES = {
  'J&K':  'M10,2 L18,4 L22,10 L16,18 L10,20 L4,14 L2,8 Z',
  'HP':   'M8,4 L16,2 L20,10 L14,18 L6,16 L4,8 Z',
  'PB':   'M6,4 L18,6 L16,16 L8,18 L4,12 Z',
  'UK':   'M8,2 L16,4 L18,14 L10,18 L4,12 L6,6 Z',
  'UP':   'M4,6 L20,4 L22,12 L18,18 L6,16 L2,10 Z',
  'RJ':   'M6,4 L18,6 L16,18 L8,16 L4,10 Z',
  'HR':   'M8,4 L16,6 L14,16 L6,14 L4,8 Z',
  'DL':   'M10,4 L14,4 L16,10 L12,16 L8,16 L6,10 Z',
  'BR':   'M6,6 L18,4 L20,14 L14,18 L6,16 L4,10 Z',
  'JH':   'M8,4 L16,6 L18,14 L10,18 L4,12 Z',
  'WB':   'M10,2 L16,6 L14,18 L8,20 L6,12 L8,6 Z',
  'AS':   'M4,8 L20,4 L22,12 L16,16 L6,16 Z',
  'MP':   'M4,6 L20,6 L18,16 L8,18 L4,12 Z',
  'CG':   'M8,4 L16,6 L14,18 L6,16 L4,10 Z',
  'OD':   'M10,2 L16,8 L14,18 L8,18 L6,10 Z',
  'GJ':   'M6,6 L14,4 L18,12 L12,20 L4,16 L2,10 Z',
  'MH':   'M4,6 L20,4 L18,16 L10,20 L4,14 Z',
  'TS':   'M8,4 L16,6 L14,16 L6,14 Z',
  'AP':   'M6,4 L18,6 L16,18 L8,16 L4,10 Z',
  'KA':   'M8,4 L16,8 L14,20 L6,18 L4,12 Z',
  'KL':   'M10,2 L14,6 L12,22 L8,20 L8,6 Z',
  'TN':   'M8,4 L14,8 L12,22 L6,18 L4,12 Z',
  'PY':   'M9,6 L13,6 L12,16 L8,16 Z',
  'AN':   'M10,4 L14,8 L12,18 L9,16 Z',
  'NE':   'M6,4 L18,6 L20,14 L12,18 L4,12 Z',
};

export default function StateStrip() {
  return (
    <div className={styles.stripWrapper}>
      <div className={styles.stripScroll}>
        {STATE_STRIP.map((s, i) => (
          <motion.div
            key={s.name}
            className={`${styles.stateItem} ${s.label ? styles.labeled : ''}`}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
          >
            <div className={styles.svgWrapper} style={{ '--state-color': s.color }}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id={`sg-${s.name}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={s.color} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={s.color} stopOpacity="0.4" />
                  </linearGradient>
                  <filter id={`glow-${s.name}`}>
                    <feGaussianBlur stdDeviation="1" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d={STATE_SHAPES[s.name] || 'M6,4 L18,6 L16,18 L6,16 Z'}
                  fill={`url(#sg-${s.name})`}
                  stroke={s.color}
                  strokeWidth="0.6"
                  filter={`url(#glow-${s.name})`}
                />
              </svg>
            </div>
            {s.label ? (
              <span className={styles.pillLabel} style={{ '--state-color': s.color }}>
                {s.fullName}
              </span>
            ) : (
              <span className={styles.codeLabel}>{s.name}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
