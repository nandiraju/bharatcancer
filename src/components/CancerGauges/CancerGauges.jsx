import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRibbon, FaLungs, FaTooth, FaDna, FaPills, FaSyringe } from 'react-icons/fa6';
import { MdBiotech } from 'react-icons/md';
import Gauge from '../Gauge';
import { CANCER_TYPES } from '../../data/indiaData';
import styles from './CancerGauges.module.css';

// Map cancer type colours to Gauge component color themes
// (Gauge supports: 'red' | 'blue' | 'green' | 'orange' | 'yellow')
const TYPE_TO_GAUGE_COLOR = {
  'Breast':      'red',
  'Lung':        'blue',
  'Oral':        'blue',
  'Cervix':      'red',
  'Colorectal':  'orange',
};

// Precise health icons per cancer type (react-icons FA6 + Material Design)
const CANCER_ICONS = {
  'Breast':     { Icon: FaRibbon,   color: '#ff2244' },  // Pink ribbon — breast cancer awareness
  'Lung':       { Icon: FaLungs,    color: '#00aaff' },  // FA6 lung anatomy icon
  'Oral':       { Icon: FaTooth,    color: '#3b82f6' },  // FA6 tooth — oral/mouth cancers
  'Cervix':     { Icon: FaDna,      color: '#ec4899' },  // DNA helix — gynaecological/genomic
  'Colorectal': { Icon: FaPills,    color: '#ff7700' },  // Pills — chemotherapy/colorectal
};

export default function CancerGauges() {
  // Animate the gauge values in on mount
  const [liveValues, setLiveValues] = useState(
    Object.fromEntries(CANCER_TYPES.map((t) => [t.name, 0]))
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLiveValues(Object.fromEntries(CANCER_TYPES.map((t) => [t.name, t.pct])));
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${styles.wrapper} glass-card`}>
      <div className={styles.header}>
        <span className="section-label">Leading Cancer Sites — % Share of New Cases</span>
        <span className={styles.source}>GLOBOCAN 2022 · India</span>
      </div>

      <div className={styles.gaugeGrid}>
        {CANCER_TYPES.map((ct, i) => (
          <motion.div
            key={ct.name}
            className={styles.gaugeItem}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
          >
            <div className={styles.gaugeIcon}>
              {(() => {
                const { Icon, color } = CANCER_ICONS[ct.name] || {};
                return Icon ? <Icon size={20} color={color} strokeWidth={1.5} /> : null;
              })()}
            </div>

            {/* The skeuomorphic Gauge from /Guages workspace */}
            <Gauge
              value={liveValues[ct.name]}
              min={0}
              max={20}
              color={TYPE_TO_GAUGE_COLOR[ct.name]}
              label={ct.name}
              unit="%"
              size={130}
              animated={true}
              dangerZone={15}
              tickCount={6}
              isDark={true}
            />

            <div className={styles.caseCount}>
              <span className={styles.caseNum}>{(ct.cases / 1000).toFixed(1)}K</span>
              <span className={styles.caseLabel}>est. cases</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className={styles.footnote}>
        Gauge shows % share of estimated new cancer cases (GLOBOCAN 2022). Needle sweeps to data value on load.
      </div>
    </div>
  );
}
