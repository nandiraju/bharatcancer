// ─── ICMR-NCRP / NCDIR / GLOBOCAN 2022 Public Data ──────────────────────────
// Sources: GLOBOCAN 2022, ICMR-NCRP State Cancer Registry reports,
//          NCDIR India-specific fact sheets, Government of India estimates.

export const SUMMARY_STATS = {
  newCases: {
    value: '14.61L',
    raw: 1461427,
    label: 'Estimated New Cases',
    sublabel: 'India, 2022',
    source: 'GLOBOCAN 2022',
  },
  mortality: {
    value: '8.08L',
    raw: 808558,
    label: 'Estimated Cancer Mortality',
    sublabel: 'India, 2022',
    source: 'GLOBOCAN 2022',
    malePct: 50.2,
    femalePct: 49.8,
  },
  lifetimeRisk: {
    value: '1 in 9',
    label: 'Lifetime Cancer Risk',
    sublabel: 'Likely to develop cancer in lifetime',
    source: 'ICMR-NCRP',
  },
  crudeIncidenceRate: {
    value: '100.4',
    label: 'Crude Incidence Rate',
    sublabel: 'Per 100,000 population',
    source: 'GLOBOCAN 2022',
  },
};

// Estimated new cases trend (ICMR/NCRP estimates)
export const CASE_TREND = [
  { year: '2020', cases: 1392179, label: '13.92L' },
  { year: '2021', cases: 1426803, label: '14.27L' },
  { year: '2022', cases: 1461427, label: '14.61L' },
  { year: '2023', cases: 1496000, label: '14.96L' },
  { year: '2024', cases: 1533000, label: '15.33L' },
];

// GLOBOCAN 2022 leading cancer sites, India (both sexes combined)
export const CANCER_TYPES = [
  { name: 'Breast', pct: 13.5, cases: 197310, color: '#ff00aa', icon: '🩺' },
  { name: 'Lung',   pct: 5.8,  cases:  84781, color: '#7c3aed', icon: '🫁' },
  { name: 'Oral',   pct: 8.1,  cases: 118375, color: '#3b82f6', icon: '👄' },
  { name: 'Cervix', pct: 6.9,  cases: 100769, color: '#ec4899', icon: '🔬' },
  { name: 'Colorectal', pct: 4.2, cases: 61380, color: '#f97316', icon: '🧬' },
];

// Cancer burden node-link data
export const BURDEN_NODES = [
  { id: 'center', label: 'Cancer\nBurden', x: 50, y: 50, size: 36, color: '#7c3aed' },
  { id: 'breast',      label: 'Breast Cancer',          x: 20, y: 18, size: 22, color: '#ff00aa' },
  { id: 'lung',        label: 'Lung Cancer',             x: 78, y: 20, size: 20, color: '#7c3aed' },
  { id: 'oral',        label: 'Oral Cancer',             x: 10, y: 55, size: 21, color: '#3b82f6' },
  { id: 'cervical',    label: 'Cervical Cancer',         x: 82, y: 58, size: 19, color: '#ec4899' },
  { id: 'colorectal',  label: 'Colorectal Cancer',       x: 28, y: 82, size: 18, color: '#f97316' },
  { id: 'tobacco',     label: 'Tobacco-related',         x: 72, y: 84, size: 20, color: '#a78bfa' },
];

// State-wise incidence burden (ICMR-NCRP estimated incidence 2022)
// Values represent estimated new cases (approximate, from NCRP state reports)
export const STATE_DATA = [
  { state: 'Uttar Pradesh', code: 'UP', cases: 164000, rank: 1, pct: 100 },
  { state: 'Maharashtra',   code: 'MH', cases: 143000, rank: 2, pct: 87  },
  { state: 'West Bengal',   code: 'WB', cases: 118000, rank: 3, pct: 72  },
  { state: 'Bihar',         code: 'BR', cases:  96000, rank: 4, pct: 59  },
  { state: 'Tamil Nadu',    code: 'TN', cases:  93000, rank: 5, pct: 57  },
  { state: 'Karnataka',     code: 'KA', cases:  88000, rank: 6, pct: 54  },
  { state: 'Delhi',         code: 'DL', cases:  64000, rank: 7, pct: 39  },
  { state: 'Kerala',        code: 'KL', cases:  61000, rank: 8, pct: 37  },
  { state: 'Assam',         code: 'AS', cases:  54000, rank: 9, pct: 33  },
  { state: 'Rajasthan',     code: 'RJ', cases:  51000, rank: 10, pct: 31 },
];

// Regional burden (ICMR-NCRP zonal estimate, 2022)
export const REGION_DATA = [
  { region: 'North',     burden: 38, color: '#7c3aed' },
  { region: 'South',     burden: 25, color: '#ec4899' },
  { region: 'East',      burden: 20, color: '#3b82f6' },
  { region: 'West',      burden: 12, color: '#f97316' },
  { region: 'North-East',burden: 5,  color: '#a78bfa' },
];

// Gender split (GLOBOCAN 2022, India)
export const GENDER_SPLIT = {
  female: 51,
  male: 49,
  label: 'Estimated Case Distribution',
  source: 'GLOBOCAN 2022',
};

// Top states for heatmap coloring
export const HIGH_BURDEN_STATES = ['Uttar Pradesh', 'Maharashtra', 'West Bengal', 'Bihar', 'Tamil Nadu', 'Karnataka'];
export const MEDIUM_BURDEN_STATES = ['Delhi', 'Kerala', 'Assam', 'Rajasthan', 'Andhra Pradesh', 'Telangana'];

// State strip — all major states + UTs
export const STATE_STRIP = [
  { name: 'J&K',   fullName: 'Jammu & Kashmir',   color: '#7c3aed' },
  { name: 'HP',    fullName: 'Himachal Pradesh',   color: '#ec4899' },
  { name: 'PB',    fullName: 'Punjab',             color: '#3b82f6' },
  { name: 'UK',    fullName: 'Uttarakhand',        color: '#f97316' },
  { name: 'UP',    fullName: 'Uttar Pradesh',      color: '#ff00aa', label: true },
  { name: 'RJ',    fullName: 'Rajasthan',          color: '#a78bfa', label: true },
  { name: 'HR',    fullName: 'Haryana',            color: '#7c3aed' },
  { name: 'DL',    fullName: 'Delhi',              color: '#ec4899', label: true },
  { name: 'BR',    fullName: 'Bihar',              color: '#3b82f6', label: true },
  { name: 'JH',    fullName: 'Jharkhand',          color: '#f97316' },
  { name: 'WB',    fullName: 'West Bengal',        color: '#ff00aa', label: true },
  { name: 'AS',    fullName: 'Assam',              color: '#7c3aed' },
  { name: 'MP',    fullName: 'Madhya Pradesh',     color: '#a78bfa' },
  { name: 'CG',    fullName: 'Chhattisgarh',       color: '#ec4899' },
  { name: 'OD',    fullName: 'Odisha',             color: '#3b82f6' },
  { name: 'GJ',    fullName: 'Gujarat',            color: '#f97316', label: true },
  { name: 'MH',    fullName: 'Maharashtra',        color: '#ff00aa', label: true },
  { name: 'TS',    fullName: 'Telangana',          color: '#7c3aed' },
  { name: 'AP',    fullName: 'Andhra Pradesh',     color: '#a78bfa' },
  { name: 'KA',    fullName: 'Karnataka',          color: '#ec4899', label: true },
  { name: 'KL',    fullName: 'Kerala',             color: '#3b82f6', label: true },
  { name: 'TN',    fullName: 'Tamil Nadu',         color: '#f97316', label: true },
  { name: 'PY',    fullName: 'Puducherry',         color: '#ff00aa' },
  { name: 'AN',    fullName: 'A&N Islands',        color: '#7c3aed' },
  { name: 'NE',    fullName: 'North-East States',  color: '#a78bfa' },
];
