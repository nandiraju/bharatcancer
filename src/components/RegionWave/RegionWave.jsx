import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { FaChartArea } from 'react-icons/fa6';
import { REGION_DATA } from '../../data/indiaData';
import styles from './RegionWave.module.css';

// Generate wave data across 12 artificial time points for each region
function buildWaveData() {
  const points = Array.from({ length: 12 }, (_, i) => ({ x: i }));
  return points.map((p, i) => {
    const t = i / 11;
    return {
      x:       i,
      North:    Math.round(38 + Math.sin(t * Math.PI * 2.5) * 6),
      South:    Math.round(25 + Math.sin(t * Math.PI * 2 + 1) * 4),
      East:     Math.round(20 + Math.sin(t * Math.PI * 3 + 2) * 3),
      West:     Math.round(12 + Math.sin(t * Math.PI * 1.8 + 0.5) * 2),
      NorthEast:Math.round(5  + Math.sin(t * Math.PI * 4 + 1.5) * 1),
    };
  });
}

const waveData = buildWaveData();

const REGION_COLORS = {
  North:     '#7c3aed',
  South:     '#ec4899',
  East:      '#3b82f6',
  West:      '#f97316',
  NorthEast: '#a78bfa',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      {payload.map((p) => (
        <div key={p.name} className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: p.color }} />
          <span className={styles.tooltipLabel}>{p.name}:</span>
          <span className={styles.tooltipVal}>{p.value}%</span>
        </div>
      ))}
    </div>
  );
};

export default function RegionWave() {
  return (
    <div className={`${styles.wrapper} glass-card`}>
      <div className={styles.header}>
        <span className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FaChartArea size={11} color="rgba(167,139,250,0.6)" />
          Cancer Burden by Region
        </span>
        <span className={styles.source}>ICMR-NCRP Zonal Estimate 2022</span>
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={waveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {Object.entries(REGION_COLORS).map(([region, color]) => (
                <linearGradient key={region} id={`wave-${region}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={color} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                </linearGradient>
              ))}
            </defs>
            <XAxis hide />
            <YAxis
              tick={{ fill: 'rgba(167,139,250,0.4)', fontSize: 9, fontFamily: 'Rajdhani' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            {Object.entries(REGION_COLORS).map(([region, color]) => (
              <Area
                key={region}
                type="monotone"
                dataKey={region}
                stroke={color}
                strokeWidth={1.5}
                fill={`url(#wave-${region})`}
                fillOpacity={1}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.legend}>
        {REGION_DATA.map((r) => (
          <div key={r.region} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: r.color, boxShadow: `0 0 5px ${r.color}` }} />
            <span className={styles.legendLabel}>{r.region}</span>
            <span className={styles.legendPct}>{r.burden}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
