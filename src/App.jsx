import React, { useState, useMemo, useCallback } from 'react';
import {
  FaMap, FaHeartPulse, FaLocationDot, FaChartBar,
  FaMicroscope, FaVial, FaRibbon, FaDna,
  FaHospital,
} from 'react-icons/fa6';
import {
  Layers, Mars, Venus, Building2, Trees, ListOrdered,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { STATES, NATIONAL_TOTALS } from './data/stateData';
import IndiaMap from './components/IndiaMap';
import Gauge from './components/Gauge';
import { SkeuButton, SkeuButtonGroup } from './components/SkeuButton';
import './index.css';

// ── helpers ──────────────────────────────────────────────
function cirToColor(cir) {
  if (!cir) return '#1e2030';
  if (cir >= 200) return '#c0392b';
  if (cir >= 140) return '#e05a28';
  if (cir >= 100) return '#e38c2e';
  if (cir >=  80) return '#1a6aad';
  if (cir >=  65) return '#1b5080';
  if (cir >=  50) return '#1d3a5c';
  return '#1a2340';
}

function cirToGrade(cir) {
  if (cir >= 200) return { label: 'Critical',      color: '#c0392b' };
  if (cir >= 140) return { label: 'Very High',     color: '#e05a28' };
  if (cir >= 100) return { label: 'High',          color: '#e38c2e' };
  if (cir >=  80) return { label: 'Moderate-High', color: '#6366f1' };
  if (cir >=  65) return { label: 'Moderate',      color: '#06b6d4' };
  return              { label: 'Below Avg',     color: '#10b981' };
}

function fmt(n) {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)  return `${(n / 1000).toFixed(1)}K`;
  return n?.toString() ?? '—';
}

function rankColor(rank) {
  if (rank <= 3)  return '#f59e0b';
  if (rank <= 10) return '#6366f1';
  return 'rgba(255,255,255,0.25)';
}

// Pick the best Gauge colour theme for a given CIR value
function cirGaugeTheme(cir) {
  if (cir >= 200) return 'red';
  if (cir >= 100) return 'orange';
  if (cir >=  65) return 'blue';
  return 'green';
}

// ── Main App ─────────────────────────────────────────────
export default function App() {
  const [selected,    setSelected]   = useState(null);
  const [sortKey,     setSortKey]    = useState('newCases');
  const [search,      setSearch]     = useState('');
  const [filterMode,  setFilterMode] = useState('all');
  const [showRanks,   setShowRanks]  = useState(false);

  // Flatten state data for the active filter mode
  const activeStates = useMemo(() =>
    STATES.map(s => ({
      ...s,
      newCases:  s[filterMode].newCases,
      deaths:    s[filterMode].deaths,
      cir:       s[filterMode].cir,
      topCancer: s[filterMode].topCancer,
    })), [filterMode]);

  const maxCases   = useMemo(() => Math.max(...activeStates.map(s => s.newCases)), [activeStates]);
  const statesById = useMemo(() => Object.fromEntries(activeStates.map(s => [s.id, s])), [activeStates]);

  // Ranked by new cases for current filter — rank 1 = highest burden
  const sortedAll = useMemo(() =>
    [...activeStates].sort((a, b) => b.newCases - a.newCases), [activeStates]);

  // Map: stateId → rank number (1-based)
  const stateRankMap = useMemo(() =>
    Object.fromEntries(sortedAll.map((s, i) => [s.id, i + 1])),
  [sortedAll]);

  const sorted = useMemo(() => {
    const filtered = search.trim()
      ? activeStates.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
      : [...activeStates];
    return filtered.sort((a, b) => b[sortKey] - a[sortKey]);
  }, [sortKey, search, activeStates]);

  const selectedState = useMemo(() =>
    selected ? activeStates.find(s => s.id === selected) : null, [selected, activeStates]);

  const selectedRank = useMemo(() =>
    selected ? sortedAll.findIndex(s => s.id === selected) + 1 : null, [selected, sortedAll]);

  const handleSelect = useCallback((id) => {
    setSelected(prev => prev === id ? null : id);
  }, []);

  // Derived gauge values (only when a state is selected)
  const national = NATIONAL_TOTALS[filterMode];
  const gaugeData = useMemo(() => {
    if (!selectedState) return null;
    const cfr    = +((selectedState.deaths / selectedState.newCases) * 100).toFixed(1);
    const share  = +((selectedState.newCases / national.newCases) * 100).toFixed(1);
    const burden = Math.round(((sortedAll.length - selectedRank) / (sortedAll.length - 1)) * 100);
    return { cfr, share, burden };
  }, [selectedState, selectedRank, sortedAll, national]);

  return (
    <div className="dashboard">
      {/* ── Top bar ───────────────────────────────────────── */}
      <header className="topbar">
        <div className="topbar-brand">
          <img
            src="/logo.png"
            alt="India Cancer Atlas"
            style={{ height: 48, width: 'auto', display: 'block', objectFit: 'contain' }}
          />
        </div>
        <div className="topbar-pills">
          <SkeuButtonGroup gap={6}>
            {[
              { id: 'all',    label: 'All Cancers', icon: <Layers   size={15} strokeWidth={1.6} /> },
              { id: 'male',   label: 'Male',        icon: <Mars     size={15} strokeWidth={1.6} /> },
              { id: 'female', label: 'Female',      icon: <Venus    size={15} strokeWidth={1.6} /> },
              { id: 'urban',  label: 'Urban',       icon: <Building2 size={15} strokeWidth={1.6} /> },
              { id: 'rural',  label: 'Rural',       icon: <Trees    size={15} strokeWidth={1.6} /> },
            ].map(({ id, label, icon }) => (
              <div key={id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <SkeuButton
                  size="sm"
                  icon={icon}
                  label={label}
                  active={filterMode === id}
                  onClick={() => setFilterMode(id)}
                />
                <span style={{
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: filterMode === id ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.28)',
                  transition: 'color 0.15s',
                  userSelect: 'none',
                }}>
                  {label}
                </span>
              </div>
            ))}
          </SkeuButtonGroup>
        </div>
        <div className="topbar-meta">
          {/* Rank toggle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <SkeuButton
              size="sm"
              icon={<ListOrdered size={15} strokeWidth={1.6} />}
              label="Rank by State"
              active={showRanks}
              onClick={() => setShowRanks(p => !p)}
            />
            <span style={{
              fontSize: 9, fontWeight: 600, letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: showRanks ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.28)',
              transition: 'color 0.15s', userSelect: 'none',
            }}>Rank</span>
          </div>
          <span>2022</span>
          <span className="topbar-badge">Public Data</span>
        </div>
      </header>

      {/* ── Left: State List ──────────────────────────────── */}
      <aside className="panel-left">
        <div className="panel-header">
          <div className="panel-header-row">
            <span className="panel-title">States &amp; UTs</span>
            <div className="sort-btn-group">
              {[
                { key: 'newCases', label: 'Cases' },
                { key: 'cir',      label: 'CIR'   },
                { key: 'deaths',   label: 'Deaths' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className={`sort-btn ${sortKey === key ? 'active' : ''}`}
                  onClick={() => setSortKey(key)}
                >{label}</button>
              ))}
            </div>
          </div>
          <input
            className="search-input"
            placeholder="Search state…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="state-list">
          {sorted.map((s, i) => {
            const rank       = sortedAll.findIndex(x => x.id === s.id) + 1;
            const barPct     = (s.newCases / maxCases) * 100;
            const isSelected = selected === s.id;
            return (
              <motion.div
                key={s.id}
                className={`state-row ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(s.id)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.012, duration: 0.2 }}
              >
                <span className="state-rank" style={{ color: rankColor(rank) }}>{rank}</span>
                <div className="state-info">
                  <div className="state-name-row">{s.name}</div>
                  <div className="state-bar-wrap">
                    <motion.div
                      className="state-bar-fill"
                      style={{ background: `linear-gradient(90deg, ${cirToColor(s.cir)}, ${cirToColor(s.cir)}88)` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${barPct}%` }}
                      transition={{ duration: 0.7, delay: 0.1 + i * 0.015 }}
                    />
                  </div>
                </div>
                <span className="state-stat">
                  {sortKey === 'cir' ? s.cir : fmt(s[sortKey])}
                </span>
              </motion.div>
            );
          })}
        </div>
      </aside>

      {/* ── Center: KPI + Map ─────────────────────────────── */}
      <main className="panel-center">
        <div className="kpi-strip">
          {[
            { icon: <FaHospital size={10} color="var(--indigo)" />,    label: 'Total New Cases',  val: fmt(national.newCases), sub: 'India · 2022 · GLOBOCAN',        color: 'var(--indigo)'   },
            { icon: <FaHeartPulse size={10} color="var(--rose)" />,    label: 'Est. Mortality',   val: fmt(national.deaths),   sub: 'Cancer deaths · India · 2022',   color: 'var(--rose)'     },
            { icon: <FaVial size={10} color="var(--amber)" />,         label: 'Crude Incidence',  val: national.cir,           sub: 'Per 100,000 population',         color: 'var(--amber)'    },
            { icon: <FaLocationDot size={10} color="var(--emerald)" />,label: 'States + UTs',     val: NATIONAL_TOTALS.states, sub: 'Covered in this atlas',          color: 'var(--emerald)'  },
          ].map(({ icon, label, val, sub, color }) => (
            <div key={label} className="kpi-card">
              <div className="kpi-label">{icon}{label}</div>
              <div className="kpi-value" style={{ color }}>{val}</div>
              <div className="kpi-sub">{sub}</div>
            </div>
          ))}
        </div>

        {/* Real India Map via react-simple-maps */}
        <div className="map-area">
          <IndiaMap
            statesById={statesById}
            selected={selected}
            onSelect={handleSelect}
            showRanks={showRanks}
            stateRankMap={stateRankMap}
          />
        </div>

        {/* Legend */}
        <div className="map-legend">
          <span className="legend-label">CIR per 100K:</span>
          <div className="legend-scale">
            {[
              { color: '#1a2340', label: '<50'     },
              { color: '#1d3a5c', label: '50–65'   },
              { color: '#1b5080', label: '65–80'   },
              { color: '#1a6aad', label: '80–100'  },
              { color: '#e38c2e', label: '100–140' },
              { color: '#e05a28', label: '140–200' },
              { color: '#c0392b', label: '200+'    },
            ].map(({ color, label }) => (
              <React.Fragment key={label}>
                <div className="legend-swatch" style={{ background: color }} />
                <span className="legend-tick">{label}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </main>

      {/* ── Right: State Detail + Gauges ──────────────────── */}
      <aside className="panel-right">
        <AnimatePresence mode="wait">
          {!selectedState ? (
            <motion.div
              key="empty"
              className="detail-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FaMap size={32} />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-2)', marginBottom: 4 }}>
                  Select a state
                </div>
                <div style={{ fontSize: 12 }}>
                  Click on the map or the state list to see detailed cancer statistics and live gauges.
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={selectedState.id}
              className="detail-scroll"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              {/* ── Header ── */}
              <div className="detail-header">
                <div className="detail-region-tag">
                  <FaLocationDot size={10} />
                  {selectedState.region} India
                </div>
                <div className="detail-state-name">{selectedState.name}</div>
                <div
                  className="detail-cir-badge"
                  style={{
                    background: `${cirToColor(selectedState.cir)}22`,
                    border:     `1px solid ${cirToColor(selectedState.cir)}66`,
                    color:       cirToColor(selectedState.cir),
                  }}
                >
                  <FaVial size={9} />
                  CIR {selectedState.cir} · {cirToGrade(selectedState.cir).label}
                </div>
              </div>

              {/* ── Rank callout ── */}
              <div className="rank-callout">
                <div className="rank-number">#{selectedRank}</div>
                <div className="rank-text">
                  Ranked <strong>#{selectedRank}</strong> nationally<br />
                  by estimated new cases<br />
                  out of {NATIONAL_TOTALS.states} states &amp; UTs
                </div>
              </div>

              {/* ════════════════════════════════════════════
                  GAUGE ROW 1 — CIR  ·  Case-Fatality Rate
                  ════════════════════════════════════════════ */}
              <div className="detail-section-title">Live Gauges</div>
              <div className="gauge-grid">
                {/* Gauge 1: Crude Incidence Rate */}
                <div className="gauge-cell">
                  <Gauge
                    value={selectedState.cir}
                    min={0}
                    max={280}
                    color={cirGaugeTheme(selectedState.cir)}
                    label="CIR / 100K"
                    unit=""
                    size={130}
                    dangerZone={140}
                    tickCount={8}
                    animated
                  />
                </div>

                {/* Gauge 2: Case-Fatality Rate (%) */}
                <div className="gauge-cell">
                  <Gauge
                    value={gaugeData.cfr}
                    min={0}
                    max={80}
                    color="red"
                    label="Fatality %"
                    unit="%"
                    size={130}
                    dangerZone={60}
                    tickCount={9}
                    animated
                  />
                </div>
              </div>

              {/* ════════════════════════════════════════════
                  GAUGE ROW 2 — National Share  ·  Burden
                  ════════════════════════════════════════════ */}
              <div className="gauge-grid">
                {/* Gauge 3: Share of national cases (%) */}
                <div className="gauge-cell">
                  <Gauge
                    value={gaugeData.share}
                    min={0}
                    max={15}
                    color="blue"
                    label="India Share"
                    unit="%"
                    size={130}
                    dangerZone={8}
                    tickCount={6}
                    animated
                  />
                </div>

                {/* Gauge 4: Relative Burden Score (rank-inverted, 0–100) */}
                <div className="gauge-cell">
                  <Gauge
                    value={gaugeData.burden}
                    min={0}
                    max={100}
                    color="orange"
                    label="Burden Score"
                    unit=""
                    size={130}
                    dangerZone={70}
                    tickCount={6}
                    animated
                  />
                </div>
              </div>

              {/* ── Key stats grid ── */}
              <div>
                <div className="detail-section-title">Key Statistics · 2022</div>
                <div className="detail-grid" style={{ marginTop: 10 }}>
                  {[
                    { icon: <FaHospital size={9} color="var(--indigo)" />,   label: 'New Cases', val: fmt(selectedState.newCases), sub: `${((selectedState.newCases / national.newCases) * 100).toFixed(1)}% of India`, color: 'var(--indigo)'  },
                    { icon: <FaHeartPulse size={9} color="var(--rose)" />,   label: 'Deaths',    val: fmt(selectedState.deaths),   sub: `${gaugeData.cfr}% case-fatality`,                                                   color: 'var(--rose)'    },
                    { icon: <FaChartBar size={9} color="var(--amber)" />,    label: 'Rank',       val: `#${selectedRank}`,          sub: `of ${NATIONAL_TOTALS.states} states`,                                               color: 'var(--amber)'   },
                    { icon: <FaMicroscope size={9} color="var(--emerald)" />,label: 'CIR',        val: selectedState.cir,           sub: 'per 100K pop.',                                                                      color: 'var(--emerald)' },
                  ].map(({ icon, label, val, sub, color }) => (
                    <div key={label} className="detail-stat">
                      <div className="detail-stat-label">{icon}{label}</div>
                      <div className="detail-stat-value" style={{ color }}>{val}</div>
                      <div className="detail-stat-sub">{sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Leading cancers ── */}
              <div>
                <div className="detail-section-title">Leading Cancer Sites</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {[
                    { label: 'Overall',   value: selectedState.topCancer, icon: <FaRibbon size={10} /> },
                    { label: 'In Males',  value: selectedState.topMale,   icon: <FaDna    size={10} /> },
                    { label: 'In Females',value: selectedState.topFemale, icon: <FaVial   size={10} /> },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="cancer-type-row">
                      <span className="cancer-type-label">{icon}{label}</span>
                      <span className="cancer-type-tag">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: 10, color: 'var(--text-3)', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                Data: ICMR-NCRP · GLOBOCAN 2022. Estimates for public health planning only.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
}
