import React from 'react';
import { motion } from 'framer-motion';
import { FaVial, FaArrowTrendUp } from 'react-icons/fa6';
import { CASE_TREND } from '../../data/indiaData';
import styles from './TrendChart.module.css';

export default function TrendChart() {
  const maxVal = Math.max(...CASE_TREND.map(d => d.cases)) * 1.08;

  return (
    <div className={`${styles.wrapper} glass-card`}>
      <div className={styles.header}>
        <span className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FaVial size={11} color="rgba(167,139,250,0.6)" />
          Estimated Cases Trend
        </span>
        <span className={styles.sourceTag}>ICMR-NCRP / GLOBOCAN</span>
      </div>

      {/* Hero number */}
      <div className={styles.heroBlock}>
        <div className={styles.heroNumber}>15.33L</div>
        <div className={styles.heroCaption}>Projected / reported estimate, 2024</div>
      </div>

      {/* Bar chart */}
      <div className={styles.chartArea}>
        {CASE_TREND.map((d, i) => {
          const heightPct = (d.cases / maxVal) * 100;
          const isLast = i === CASE_TREND.length - 1;
          return (
            <div key={d.year} className={styles.barGroup}>
              <div className={styles.barLabel}>{d.label}</div>
              <div className={styles.barTrack}>
                <motion.div
                  className={styles.barFill}
                  style={{
                    background: isLast
                      ? 'linear-gradient(180deg, #ff0080, #f97316)'
                      : `linear-gradient(180deg, #d946ef ${i * 18}%, #7c3aed)`,
                    boxShadow: isLast ? '0 0 12px rgba(255,0,128,0.5)' : '0 0 8px rgba(124,58,237,0.4)',
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 1.1, delay: 0.3 + i * 0.12, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
              <div className={styles.barYear}>{d.year}</div>
            </div>
          );
        })}
      </div>

      {/* Mini axis */}
      <div className={styles.axisTicks}>
        {['0', '5L', '10L', '15L'].map(t => (
          <span key={t} className={styles.axisTick}>{t}</span>
        ))}
      </div>

      <div className={styles.footer}>
        <span className={styles.footerPill}>
          <FaArrowTrendUp size={10} />
          {' '}10.1% growth 2020–2024
        </span>
      </div>
    </div>
  );
}
