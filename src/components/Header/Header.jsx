import React from 'react';
import { motion } from 'framer-motion';
import { FaHeartbeat } from 'react-icons/fa';
import { FaDna, FaHospital, FaLocationDot } from 'react-icons/fa6';
import StateStrip from './StateStrip';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <StateStrip />

      <div className={styles.titleSection}>
        {/* Decorative left line */}
        <div className={styles.sideDeco}>
          <div className={styles.decoLine} />
          <FaHeartbeat size={16} color="#d946ef" />
          <div className={styles.decoLine} />
        </div>

        {/* Main title block */}
        <motion.div
          className={styles.titleBlock}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Icon row */}
          <div className={styles.iconRow}>
            <FaDna size={18} color="#7c3aed" />
            <span className={styles.topTag}>OFFICIAL PUBLIC HEALTH DATA</span>
            <FaLocationDot size={18} color="#ec4899" />
          </div>

          <h1 className={styles.mainTitle}>
            <span className={styles.titleIndia}>INDIA</span>
            {' '}
            <span className={styles.titleCancer}>CANCER</span>
            {' '}
            <span className={styles.titleStats}>STATISTICS</span>
          </h1>

          <p className={styles.subtitle}>
            ICMR-NCRP / GLOBOCAN PUBLIC DATA DASHBOARD
          </p>

          <div className={styles.pills}>
            <span className="pill pill-bright">2022–2024</span>
            <span className="pill">All Cancers</span>
            <span className="pill">State-Wise</span>
            <span className="pill">GLOBOCAN 2022</span>
            <span className="pill">ICMR-NCRP</span>
            <span className="pill">NCDIR</span>
          </div>
        </motion.div>

        {/* Decorative right line */}
        <div className={styles.sideDeco}>
          <div className={styles.decoLine} />
          <FaHospital size={16} color="#3b82f6" />
          <div className={styles.decoLine} />
        </div>
      </div>
    </header>
  );
}
