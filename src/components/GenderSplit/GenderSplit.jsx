import React from 'react';
import { motion } from 'framer-motion';
import { FaVenus, FaMars, FaVenusMars } from 'react-icons/fa6';
import { MdPersonOutline } from 'react-icons/md';
import { GENDER_SPLIT } from '../../data/indiaData';
import styles from './GenderSplit.module.css';

export default function GenderSplit() {
  return (
    <div className={`${styles.wrapper} glass-card`}>
      <div className={styles.header}>
        <span className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FaVenusMars size={11} color="rgba(167,139,250,0.6)" />
          Gender Distribution
        </span>
        <span className={styles.source}>GLOBOCAN 2022</span>
      </div>

      <div className={styles.body}>
        {/* Female */}
        <motion.div
          className={styles.genderBlock}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={styles.iconWrap} style={{ '--gc': '#ec4899', '--gs': 'rgba(236,72,153,0.25)' }}>
            <FaVenus size={32} color="#ec4899" style={{ filter: 'drop-shadow(0 0 10px #ec4899)' }} />
          </div>
          <div className={styles.pctDisplay} style={{ '--gc': '#ec4899' }}>
            <motion.span
              className={styles.pctNum}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {GENDER_SPLIT.female}%
            </motion.span>
            <span className={styles.pctLabel}>Female</span>
          </div>
          <div className={styles.barTrack}>
            <motion.div
              className={styles.barFill}
              style={{ background: 'linear-gradient(90deg, #ec4899, #d946ef)', boxShadow: '0 0 10px rgba(236,72,153,0.5)' }}
              initial={{ width: 0 }}
              animate={{ width: `${GENDER_SPLIT.female}%` }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Divider */}
        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerLabel}>VS</span>
          <div className={styles.dividerLine} />
        </div>

        {/* Male */}
        <motion.div
          className={styles.genderBlock}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className={styles.iconWrap} style={{ '--gc': '#3b82f6', '--gs': 'rgba(59,130,246,0.25)' }}>
            <FaMars size={32} color="#3b82f6" style={{ filter: 'drop-shadow(0 0 10px #3b82f6)' }} />
          </div>
          <div className={styles.pctDisplay} style={{ '--gc': '#3b82f6' }}>
            <motion.span
              className={styles.pctNum}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {GENDER_SPLIT.male}%
            </motion.span>
            <span className={styles.pctLabel}>Male</span>
          </div>
          <div className={styles.barTrack}>
            <motion.div
              className={styles.barFill}
              style={{ background: 'linear-gradient(90deg, #3b82f6, #7c3aed)', boxShadow: '0 0 10px rgba(59,130,246,0.5)' }}
              initial={{ width: 0 }}
              animate={{ width: `${GENDER_SPLIT.male}%` }}
              transition={{ duration: 1.2, delay: 0.6 }}
            />
          </div>
        </motion.div>
      </div>

      <div className={styles.caption}>
        <span className="section-label">{GENDER_SPLIT.label}</span>
        <span className={styles.captionSub}>Source: {GENDER_SPLIT.source}</span>
      </div>
    </div>
  );
}
