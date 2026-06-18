import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { FaHospitalUser, FaHeartPulse, FaMicroscope, FaChartBar, FaPerson, FaPersonArrowUpFromLine } from 'react-icons/fa6';
import { SUMMARY_STATS, CASE_TREND } from '../../data/indiaData';
import styles from './StatCards.module.css';

function AnimatedNumber({ target, prefix = '', suffix = '', delay = 0 }) {
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const timer = setTimeout(() => {
      const start = performance.now();
      const duration = 1800;
      const frame = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        if (typeof target === 'string') {
          setDisplay(target);
        } else {
          setDisplay(Math.floor(eased * target).toLocaleString('en-IN'));
        }
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, delay]);

  return <span>{prefix}{display}{suffix}</span>;
}

function MiniBar({ value, maxValue, color, label, year }) {
  const pct = (value / maxValue) * 100;
  return (
    <div className={styles.miniBarRow}>
      <span className={styles.miniBarYear}>{year || label}</span>
      <div className={styles.miniBarTrack}>
        <motion.div
          className={styles.miniBarFill}
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
      <span className={styles.miniBarVal}>{label}</span>
    </div>
  );
}

// Card 1: New Cases
function NewCasesCard() {
  const bars = CASE_TREND.slice(0, 3);
  return (
    <div className={`${styles.card} glass-card`}>
      <div className={styles.cardInner}>
        <div className={styles.cardTop}>
          <div className={styles.iconBadge} style={{ '--c': '#d946ef' }}>
            <FaHospitalUser size={18} color="#d946ef" />
          </div>
          <span className="section-label">Estimated New Cases</span>
        </div>

        <div className={styles.bigNum}>
          <span className="stat-number">
            <AnimatedNumber target="14.61L" delay={300} />
          </span>
          <span className={styles.numUnit}>cases</span>
        </div>
        <p className={styles.sublabel}>India, 2022 · GLOBOCAN</p>

        <div className={styles.miniBars}>
          {bars.map((b) => (
            <MiniBar
              key={b.year}
              year={b.year}
              label={b.label}
              value={b.cases}
              maxValue={1600000}
              color="linear-gradient(90deg, #7c3aed, #d946ef)"
            />
          ))}
        </div>

        <div className={styles.trendBadge}>
          <TrendingUp size={12} color="#10b981" />
          <span>↑ Rising Trend 2020–2022</span>
        </div>
      </div>
    </div>
  );
}

// Card 2: Mortality
function MortalityCard() {
  return (
    <div className={`${styles.card} glass-card`}>
      <div className={styles.cardInner}>
        <div className={styles.cardTop}>
          <div className={styles.iconBadge} style={{ '--c': '#ec4899' }}>
            <FaHeartPulse size={18} color="#ec4899" />
          </div>
          <span className="section-label">Estimated Mortality</span>
        </div>

        <div className={styles.bigNum}>
          <span className="stat-number" style={{
            background: 'linear-gradient(135deg, #ec4899, #f97316)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            <AnimatedNumber target="8.08L" delay={400} />
          </span>
          <span className={styles.numUnit}>deaths</span>
        </div>
        <p className={styles.sublabel}>India, 2022 · GLOBOCAN</p>

        <div className={styles.genderBars}>
          {[
            { label: 'Male', pct: 50.2, color: 'linear-gradient(90deg, #3b82f6, #7c3aed)' },
            { label: 'Female', pct: 49.8, color: 'linear-gradient(90deg, #ec4899, #d946ef)' },
            { label: 'Total', pct: 100, color: 'linear-gradient(90deg, #7c3aed, #f97316)' },
          ].map((g) => (
            <div key={g.label} className={styles.genderBarRow}>
              <span className={styles.genderLabel}>{g.label}</span>
              <div className={styles.miniBarTrack}>
                <motion.div
                  className={styles.miniBarFill}
                  style={{ background: g.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${g.pct}%` }}
                  transition={{ duration: 1.2, delay: 0.7, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
              <span className={styles.miniBarVal}>{g.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Card 3: Lifetime Risk
function LifetimeRiskCard() {
  return (
    <div className={`${styles.card} glass-card`}>
      <div className={styles.cardInner}>
        <div className={styles.cardTop}>
          <div className={styles.iconBadge} style={{ '--c': '#3b82f6' }}>
            <FaMicroscope size={18} color="#3b82f6" />
          </div>
          <span className="section-label">Lifetime Cancer Risk</span>
        </div>

        <div className={styles.riskBlock}>
          <div className={styles.riskFraction}>
            <span className={styles.riskNum} style={{
              background: 'linear-gradient(135deg, #3b82f6, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>1</span>
            <div className={styles.riskDivider} />
            <span className={styles.riskDenom}>9</span>
          </div>
          <div className={styles.humanIcons}>
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className={styles.humanIcon}
                style={{ display: 'flex', filter: i === 0 ? 'drop-shadow(0 0 8px #d946ef)' : 'none' }}
              >
                {i === 0
                  ? <FaPersonArrowUpFromLine size={18} color="#d946ef" />
                  : <FaPerson size={16} color="rgba(167,139,250,0.25)" />}
              </span>
            ))}
          </div>
        </div>
        <p className={styles.sublabel}>Likely to develop cancer in lifetime</p>
        <p className={styles.sourceTag}>ICMR-NCRP Estimate</p>
      </div>
    </div>
  );
}

// Card 4: Crude Incidence Rate
function CrudeRateCard() {
  const years = ['2018', '2019', '2020', '2021', '2022'];
  const vals =  [  92.4,   95.1,   97.2,   98.8,  100.4];
  const maxV = 110;
  return (
    <div className={`${styles.card} glass-card`}>
      <div className={styles.cardInner}>
        <div className={styles.cardTop}>
          <div className={styles.iconBadge} style={{ '--c': '#f97316' }}>
            <FaChartBar size={18} color="#f97316" />
          </div>
          <span className="section-label">Crude Incidence Rate</span>
        </div>

        <div className={styles.bigNum}>
          <span className="stat-number" style={{
            background: 'linear-gradient(135deg, #f97316, #d946ef)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            <AnimatedNumber target="100.4" delay={500} />
          </span>
          <span className={styles.numUnit}>per 100k</span>
        </div>
        <p className={styles.sublabel}>Population, India 2022</p>

        <div className={styles.microBars}>
          {years.map((y, i) => (
            <div key={y} className={styles.microBarCol}>
              <div className={styles.microBarTrack}>
                <motion.div
                  className={styles.microBarFill}
                  style={{ background: 'linear-gradient(180deg, #f97316, #d946ef)' }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(vals[i] / maxV) * 100}%` }}
                  transition={{ duration: 1, delay: 0.4 + i * 0.1, ease: [0.4,0,0.2,1] }}
                />
              </div>
              <span className={styles.microBarLabel}>{y.slice(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StatCards() {
  return (
    <div className={styles.grid}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <NewCasesCard />
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
        <MortalityCard />
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
        <LifetimeRiskCard />
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
        <CrudeRateCard />
      </motion.div>
    </div>
  );
}
