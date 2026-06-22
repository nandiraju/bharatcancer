import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaMap, FaHeartPulse, FaLocationDot, FaChartBar,
  FaMicroscope, FaVial, FaRibbon, FaDna,
  FaHospital, FaDatabase,
} from 'react-icons/fa6';
import {
  Layers, Mars, Venus, Building2, Trees, ListOrdered,
  Map, List, BarChart2, Info
} from 'lucide-react';
import Gauge from './Gauge';
import './AboutOverlay.css';

export default function AboutOverlay({ onClose }) {
  const [activeTab, setActiveTab] = useState('metrics'); // 'metrics' | 'gauges' | 'charts'
  const [mockValue, setMockValue] = useState(115); // mock value for interactive gauge

  // Custom function to return appropriate theme for mock CIR
  const getMockTheme = (val) => {
    if (val >= 200) return 'red';
    if (val >= 100) return 'orange';
    if (val >= 65) return 'blue';
    return 'green';
  };

  return (
    <motion.div
      className="about-overlay-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="about-terminal-bezel"
        initial={{ scale: 0.92, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bezel Corner Screws */}
        <div className="terminal-screw top-left" />
        <div className="terminal-screw top-right" />
        <div className="terminal-screw bottom-left" />
        <div className="terminal-screw bottom-right" />

        {/* Header section */}
        <header className="terminal-header">
          <div className="terminal-brand">
            <div className="terminal-logo-placeholder">
              <FaRibbon size={24} />
            </div>
            <div className="terminal-title-block">
              <h2>Diagnostic Reference Manual</h2>
              <p>SYSTEM ATLAS v1.2 · INDIA CANCER STATISTICS</p>
            </div>
          </div>

          {/* Emergency mechanical close button */}
          <button 
            className="emergency-close-wrap" 
            onClick={onClose}
            title="Press to Exit Atlas Guide"
          >
            <div className="emergency-plunger">EXIT</div>
          </button>
        </header>

        {/* Skeuomorphic Tab Tray */}
        <div className="terminal-tabs-tray">
          <button
            className={`terminal-tab ${activeTab === 'metrics' ? 'active' : ''}`}
            onClick={() => setActiveTab('metrics')}
          >
            <div className="led-dot" />
            <span>Key Metrics</span>
          </button>
          <button
            className={`terminal-tab ${activeTab === 'gauges' ? 'active' : ''}`}
            onClick={() => setActiveTab('gauges')}
          >
            <div className="led-dot" />
            <span>Diagnostic Gauges</span>
          </button>
          <button
            className={`terminal-tab ${activeTab === 'charts' ? 'active' : ''}`}
            onClick={() => setActiveTab('charts')}
          >
            <div className="led-dot" />
            <span>Advanced Charts</span>
          </button>
          <button
            className={`terminal-tab ${activeTab === 'sources' ? 'active' : ''}`}
            onClick={() => setActiveTab('sources')}
          >
            <div className="led-dot" />
            <span>Data Sources</span>
          </button>
        </div>

        {/* Viewport for tab contents */}
        <div className="terminal-viewport">
          
          {/* TAB 1: KEY METRICS */}
          {activeTab === 'metrics' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="recessed-well">
                <div className="recessed-title">
                  <FaChartBar size={14} />
                  <span>National KPI Summary &amp; Demographics</span>
                </div>
                <div className="grid-two-col">
                  <div className="stat-explain-card">
                    <div className="stat-explain-header">
                      <div className="stat-explain-icon" style={{ color: 'var(--indigo)' }}>
                        <FaHospital size={11} />
                      </div>
                      <span className="stat-explain-title">Total New Cases (Incidence)</span>
                    </div>
                    <p className="stat-explain-desc">
                      The total number of estimated new cancer cases diagnosed annually across the selected state or nationwide. This represents the total absolute case volume.
                    </p>
                    <span className="stat-explain-meta">DATA SOURCE: GLOBOCAN 2022 / ICMR-NCRP</span>
                  </div>

                  <div className="stat-explain-card">
                    <div className="stat-explain-header">
                      <div className="stat-explain-icon" style={{ color: 'var(--rose)' }}>
                        <FaHeartPulse size={11} />
                      </div>
                      <span className="stat-explain-title">Est. Mortality (Annual Deaths)</span>
                    </div>
                    <p className="stat-explain-desc">
                      The estimated number of deaths caused by cancer in the selected region per year. Essential for monitoring disease outcome severity and healthcare efficacy.
                    </p>
                    <span className="stat-explain-meta">DATA SOURCE: GLOBOCAN 2022</span>
                  </div>
                </div>
              </div>

              <div className="recessed-well">
                <div className="grid-two-col">
                  <div className="stat-explain-card">
                    <div className="stat-explain-header">
                      <div className="stat-explain-icon" style={{ color: 'var(--amber)' }}>
                        <FaVial size={11} />
                      </div>
                      <span className="stat-explain-title">Crude Incidence Rate (CIR per 100K)</span>
                    </div>
                    <p className="stat-explain-desc">
                      Calculates cancer frequency relative to population: <strong>(Cases / Population) × 100,000</strong>. Unlike absolute cases, CIR permits direct geographical comparison across states of varying sizes.
                    </p>
                    <span className="stat-explain-meta">CRITICAL INDEX FOR REGIONAL RISK ASSESSMENT</span>
                  </div>

                  <div className="stat-explain-card">
                    <div className="stat-explain-header">
                      <div className="stat-explain-icon" style={{ color: 'var(--emerald)' }}>
                        <FaLocationDot size={11} />
                      </div>
                      <span className="stat-explain-title">States &amp; Union Territories (UTs)</span>
                    </div>
                    <p className="stat-explain-desc">
                      The geographical units mapped in the atlas. Clickable regions on the interactive map filter the right-hand diagnostic panel to local state-level records.
                    </p>
                    <span className="stat-explain-meta">GEOGRAPHICAL COVERAGE: 36 STATES + UTS</span>
                  </div>
                </div>
              </div>

              <div className="recessed-well">
                <div className="recessed-title">
                  <Layers size={14} />
                  <span>Demographic &amp; Locality Filters</span>
                </div>
                <div className="grid-three-col" style={{ fontSize: '11.5px', gap: '12px' }}>
                  <div>
                    <strong style={{ color: 'var(--indigo)', display: 'block', marginBottom: '4px' }}>All Cancers</strong>
                    Aggregated figures for both sexes across all types of cancers to represent the total baseline public health burden.
                  </div>
                  <div>
                    <strong style={{ color: '#82d2ff', display: 'block', marginBottom: '4px' }}>Male / Female</strong>
                    Filters the statistics to highlight gender-specific prevalence, e.g. leading sites like Breast and Cervix in females vs. Lip/Oral Cavity and Lung in males.
                  </div>
                  <div>
                    <strong style={{ color: 'var(--cyan)', display: 'block', marginBottom: '4px' }}>Urban / Rural</strong>
                    Segregates data by density. Rural rates reveal accessibility-associated late stages; urban rates highlight exposure and screening trends.
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: DIAGNOSTIC GAUGES */}
          {activeTab === 'gauges' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="recessed-well">
                <div className="recessed-title">
                  <FaMicroscope size={14} />
                  <span>Interactive Gauge Calibration &amp; Live Test</span>
                </div>
                
                <div className="interactive-gauge-layout">
                  <div className="interactive-gauge-cell">
                    <Gauge
                      value={mockValue}
                      min={0}
                      max={280}
                      color={getMockTheme(mockValue)}
                      label="CIR / 100K"
                      unit=""
                      size={130}
                      dangerZone={140}
                      tickCount={8}
                      animated={false}
                    />
                  </div>

                  <div className="gauge-control-panel">
                    <div className="mock-slider-title">Interact to Calibrate Needle Thresholds:</div>
                    <div className="mock-slider-row">
                      <input
                        type="range"
                        className="mock-slider"
                        min="0"
                        max="280"
                        value={mockValue}
                        onChange={(e) => setMockValue(parseInt(e.target.value))}
                      />
                      <span className="mock-slider-value">{mockValue}</span>
                    </div>
                    <p style={{ fontSize: '11.5px', margin: 0, color: 'var(--text-2)', lineHeight: '1.4' }}>
                      Drag the slider dial to see the skeuomorphic needle rotate. 
                      Values below <strong>65</strong> display as green (Below Avg). 
                      Values between <strong>65–100</strong> are blue (Moderate). 
                      Values between <strong>100–140</strong> are orange (High), and values <strong>&gt; 140</strong> trigger red (Critical Danger).
                    </p>
                  </div>
                </div>
              </div>

              <div className="recessed-well">
                <div className="recessed-title">
                  <Info size={14} />
                  <span>The 6 Core Diagnostic Gauges Explained</span>
                </div>

                <div className="gauge-desc-grid">
                  <div className="gauge-desc-item">
                    <div className="gauge-desc-name">
                      <span>1. Crude Incidence (CIR)</span>
                      <span className="gauge-desc-tag">0 - 280 / 100K</span>
                    </div>
                    Density of cancer cases in the population. Highly elevated in regions with urban lifestyles or older average age profiles.
                  </div>

                  <div className="gauge-desc-item">
                    <div className="gauge-desc-name">
                      <span>2. Fatality Rate (CFR %)</span>
                      <span className="gauge-desc-tag">0% - 80%</span>
                    </div>
                    The percentage of cancer patients who die from the disease. Calculated as <strong>(Deaths / Cases) × 100%</strong>. Higher ratios reveal gaps in survival care.
                  </div>

                  <div className="gauge-desc-item">
                    <div className="gauge-desc-name">
                      <span>3. Late Stage Diagnosis %</span>
                      <span className="gauge-desc-tag">0% - 100%</span>
                    </div>
                    Percentage of cases first diagnosed at Stage III or IV. Indicates delayed healthcare seeking or absence of early detection programs.
                  </div>

                  <div className="gauge-desc-item">
                    <div className="gauge-desc-name">
                      <span>4. National Share</span>
                      <span className="gauge-desc-tag">0% - 15%</span>
                    </div>
                    The proportion of overall Indian cancer cases contributed by this state. Larger, populous states naturally represent higher shares of the national burden.
                  </div>

                  <div className="gauge-desc-item">
                    <div className="gauge-desc-name">
                      <span>5. Burden Score</span>
                      <span className="gauge-desc-tag">0 - 100 Index</span>
                    </div>
                    A normalized relative volume rank. A score of 100 indicates the state with the highest absolute incidence burden nationwide.
                  </div>

                  <div className="gauge-desc-item">
                    <div className="gauge-desc-name">
                      <span>6. Lifetime Risk %</span>
                      <span className="gauge-desc-tag">0% - 25%</span>
                    </div>
                    The cumulative probability of an individual developing cancer before age 75. A risk of 10% translates to a 1-in-10 lifetime likelihood.
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: ADVANCED CHARTS */}
          {activeTab === 'charts' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="recessed-well">
                <div className="chart-explain-row">
                  <div className="chart-explain-preview">
                    <div className="chart-preview-header">3D Burden Spheres</div>
                    <div className="chart-preview-gfx">
                      <svg width="100" height="100" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.6))' }}>
                        <defs>
                          <radialGradient id="sphereGrad" cx="30%" cy="30%" r="70%">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="50%" stopColor="#4f46e5" />
                            <stop offset="100%" stopColor="#1e1b4b" />
                          </radialGradient>
                          <radialGradient id="sphereGrad2" cx="30%" cy="30%" r="70%">
                            <stop offset="0%" stopColor="#fda4af" />
                            <stop offset="50%" stopColor="#f43f5e" />
                            <stop offset="100%" stopColor="#881337" />
                          </radialGradient>
                        </defs>
                        <circle cx="50" cy="50" r="30" fill="url(#sphereGrad)" />
                        <circle cx="70" cy="30" r="18" fill="url(#sphereGrad2)" />
                      </svg>
                    </div>
                  </div>
                  <div className="chart-explain-info">
                    <div className="chart-explain-title">Leading Site Burdens (Bubble Chart)</div>
                    <div className="chart-explain-body">
                      This component renders a multi-layered 3D bubble chart showing the top 3 cancer sites (e.g., Breast, Cervix, Lung) for the selected region.
                    </div>
                    <ul className="chart-explain-bullets">
                      <li><strong>Bubble Size:</strong> Represents the proportional share of cases that organ site contributes to the region's overall burden.</li>
                      <li><strong>3D Shading:</strong> Radial gradients emulate realistic physical glass or metal spheres, drawing immediate visual focus to leading diagnoses.</li>
                    </ul>
                  </div>
                </div>

                <div className="chart-explain-row">
                  <div className="chart-explain-preview">
                    <div className="chart-preview-header">Pathway Funnel</div>
                    <div className="chart-preview-gfx">
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        <polygon points="10,15 90,15 70,35 30,35" fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.6)" strokeWidth="1.5" />
                        <polygon points="30,40 70,40 60,60 40,60" fill="rgba(245,158,11,0.2)" stroke="rgba(245,158,11,0.6)" strokeWidth="1.5" />
                        <polygon points="40,65 60,65 53,85 47,85" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.6)" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                  <div className="chart-explain-info">
                    <div className="chart-explain-title">Care Pathway Cascade (Funnel Chart)</div>
                    <div className="chart-explain-body">
                      Visualizes patient attrition across the 4 critical checkpoints in the oncology care continuum, modeling typical clinical drop-offs:
                    </div>
                    <ul className="chart-explain-bullets">
                      <li><strong>1. Screened:</strong> The initial target population screened for oncology indications.</li>
                      <li><strong>2. Diagnosed:</strong> Percentage of screened cases with confirmed diagnosis.</li>
                      <li><strong>3. Treated:</strong> Confirmed cases that initiated therapy (surgery, chemotherapy, or radiotherapy).</li>
                      <li><strong>4. 5-Yr Survival:</strong> Percentage of patients surviving 5 years post-diagnosis.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: DATA SOURCES */}
          {activeTab === 'sources' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="recessed-well">
                <div className="recessed-title">
                  <FaDatabase size={14} style={{ color: 'var(--emerald)' }} />
                  <span>Oncology Data Inventories &amp; Registries</span>
                </div>
                
                <div className="grid-two-col">
                  <div className="stat-explain-card">
                    <div className="stat-explain-header">
                      <div className="led-dot" style={{ background: 'var(--emerald)', boxShadow: '0 0 8px var(--emerald)' }} />
                      <span className="stat-explain-title" style={{ fontSize: '13px' }}>GLOBOCAN 2022 (WHO / IARC)</span>
                    </div>
                    <p className="stat-explain-desc" style={{ marginTop: '8px' }}>
                      Maintained by the International Agency for Research on Cancer (IARC) and the World Health Organization (WHO). It provides the primary country-level estimates for cancer burden.
                    </p>
                    <ul className="chart-explain-bullets" style={{ marginTop: '8px' }}>
                      <li><strong>Primary Use:</strong> Populates baseline state and national indicators including Crude Incidence Rates (CIR), expected mortality levels, and lifetime risk projections.</li>
                      <li><strong>Methodology:</strong> Standardized age-specific incidence and mortality patterns are modeled and applied to regional demographic distributions for 36 cancer sites.</li>
                    </ul>
                  </div>

                  <div className="stat-explain-card">
                    <div className="stat-explain-header">
                      <div className="led-dot" style={{ background: 'var(--indigo)', boxShadow: '0 0 8px var(--indigo)' }} />
                      <span className="stat-explain-title" style={{ fontSize: '13px' }}>ICMR-NCRP Registry Network</span>
                    </div>
                    <p className="stat-explain-desc" style={{ marginTop: '8px' }}>
                      Overseen by the National Centre for Disease Informatics and Research (NCDIR) under the Indian Council of Medical Research (ICMR).
                    </p>
                    <ul className="chart-explain-bullets" style={{ marginTop: '8px' }}>
                      <li><strong>Primary Use:</strong> Supplying indices for care cascade pathways, clinical diagnosis delays (late-stage percentage), and survival trends.</li>
                      <li><strong>Network Scope:</strong> Utilizes network registry records from Population-Based Cancer Registries (PBCR) and Hospital-Based Cancer Registries (HBCR) across major states.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="recessed-well">
                <div className="recessed-title">
                  <Info size={14} style={{ color: 'var(--amber)' }} />
                  <span>Clinical Integration &amp; Mathematical Modeling</span>
                </div>
                <p className="stat-explain-desc" style={{ marginBottom: '12px' }}>
                  Since comprehensive cancer registry coverage varies geographically across India, the India Cancer Atlas utilizes a unified mathematical mapping layer:
                </p>
                <div className="grid-three-col" style={{ fontSize: '11px', gap: '12px', background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
                  <div>
                    <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>Extrapolation Layer</strong>
                    State-specific demographics are integrated with age-standardized rates from nearest PBCR/HBCR nodes to calculate relative crude incidence.
                  </div>
                  <div>
                    <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>Case-Fatality Calibration</strong>
                    The Case Fatality Rate (CFR %) is derived by matching state-wise mortalities with projected new cases to verify prognosis gaps.
                  </div>
                  <div>
                    <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>Care Pathway Modeling</strong>
                    Care continuum percentages (Screened, Diagnosed, Treated, Survived) are normalized from clinical trials data and NCRP annual reports.
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>

        {/* Footer info */}
        <footer className="terminal-footer">
          <div className="footer-led">
            <div className="led-dot led-blink" />
            <span>REFERENCE SYSTEM ONLINE</span>
          </div>
          <span>1cell stats engine - IDiscover</span>
        </footer>
      </motion.div>
    </motion.div>
  );
}
