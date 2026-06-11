export interface CancerDetail {
  name: string;
  incidence: number;
  ratePer100k: number;
  mostCommon: string;
  hospitals: string[];
  notes?: string;
}

export interface NationalStats {
  totalIncidence: number;
  mortalityRate: string;
  projected2030: number;
  topCancers: {
    male: { type: string; percentage: number }[];
    female: { type: string; percentage: number }[];
  };
  riskFactors: { factor: string; percentage: number; color: string }[];
  yearlyTrends: { year: number; cases: number }[];
}

export interface CancerDataset {
  national: NationalStats;
  states: Record<string, CancerDetail>;
}

export const cancerData: CancerDataset = {
  national: {
    totalIncidence: 1461420,
    mortalityRate: "55.4%",
    projected2030: 1780000,
    topCancers: {
      male: [
        { type: "Lung", percentage: 10.6 },
        { type: "Oral/Mouth", percentage: 10.1 },
        { type: "Stomach", percentage: 7.2 },
        { type: "Colorectal", percentage: 6.8 },
        { type: "Esophagus", percentage: 5.9 }
      ],
      female: [
        { type: "Breast", percentage: 26.3 },
        { type: "Cervical", percentage: 18.3 },
        { type: "Ovary", percentage: 6.7 },
        { type: "Oral/Mouth", percentage: 4.8 },
        { type: "Colorectal", percentage: 4.5 }
      ]
    },
    riskFactors: [
      { factor: "Tobacco Use (Smoking & Chewing)", percentage: 35.0, color: "#ec4899" }, // Accent Pink
      { factor: "Unhealthy Diet & Obesity", percentage: 15.0, color: "#8b5cf6" }, // Brand Purple
      { factor: "Viral Infections (HPV/HBV)", percentage: 12.0, color: "#06b6d4" }, // Brand Cyan
      { factor: "Environmental Pollution", percentage: 10.0, color: "#10b981" }, // Emerald
      { factor: "Alcohol Consumption", percentage: 8.0, color: "#f59e0b" }, // Amber
      { factor: "Genetic / Other Factors", percentage: 20.0, color: "#6b7280" } // Gray
    ],
    yearlyTrends: [
      { year: 2020, cases: 1392179 },
      { year: 2021, cases: 1426447 },
      { year: 2022, cases: 1461420 },
      { year: 2023, cases: 1496972 },
      { year: 2024, cases: 1533125 },
      { year: 2025, cases: 1570138 },
      { year: 2026, cases: 1608000 },
      { year: 2028, cases: 1690000 },
      { year: 2030, cases: 1780000 }
    ]
  },
  states: {
    an: {
      name: "Andaman and Nicobar Islands",
      incidence: 650,
      ratePer100k: 85.2,
      mostCommon: "Lung Cancer",
      hospitals: ["G.B. Pant Hospital, Port Blair"]
    },
    ap: {
      name: "Andhra Pradesh",
      incidence: 72500,
      ratePer100k: 92.4,
      mostCommon: "Breast Cancer",
      hospitals: ["MNJ Institute of Oncology, Hyderabad (linked)", "Apollo Cancer Centre, Visakhapatnam", "HCG Cancer Centre, Vijayawada"]
    },
    ar: {
      name: "Arunachal Pradesh",
      incidence: 1800,
      ratePer100k: 118.5,
      mostCommon: "Stomach Cancer",
      hospitals: ["State Cancer Institute, Pasighat", "Tomo Riba Institute of Health & Medical Sciences, Naharlagun"],
      notes: "Northeastern states report significantly higher rates of stomach and oral cancers due to local dietary habits, including consumed fermented products and smoked meats."
    },
    as: {
      name: "Assam",
      incidence: 36200,
      ratePer100k: 105.7,
      mostCommon: "Esophageal Cancer",
      hospitals: ["Dr. B. Borooah Cancer Institute, Guwahati", "State Cancer Institute, GMCH, Guwahati", "Cachar Cancer Hospital, Silchar"],
      notes: "Assam has some of the highest esophageal cancer rates in India, heavily correlated with betel nut chewing and tobacco use."
    },
    br: {
      name: "Bihar",
      incidence: 112000,
      ratePer100k: 88.6,
      mostCommon: "Oral/Mouth Cancer",
      hospitals: ["Mahavir Cancer Sansthan, Patna", "Indira Gandhi Institute of Medical Sciences (IGIMS), Patna", "Homi Bhabha Cancer Hospital, Muzaffarpur"],
      notes: "Oral and cervical cancers form the vast majority of the cancer burden in Bihar. Tobacco chewing (gutka) is a leading cause among men."
    },
    ch: {
      name: "Chandigarh",
      incidence: 1950,
      ratePer100k: 115.8,
      mostCommon: "Breast Cancer",
      hospitals: ["Post Graduate Institute of Medical Education & Research (PGIMER), Chandigarh"]
    },
    ct: {
      name: "Chhattisgarh",
      incidence: 28400,
      ratePer100k: 91.2,
      mostCommon: "Cervical Cancer",
      hospitals: ["Regional Cancer Centre, Raipur", "Bharat Cancer Hospital, Raipur"]
    },
    dn: {
      name: "Dadra and Nagar Haveli",
      incidence: 450,
      ratePer100k: 78.4,
      mostCommon: "Oral/Mouth Cancer",
      hospitals: ["Shri Vinoba Bhave Civil Hospital, Silvassa"]
    },
    dd: {
      name: "Daman and Diu",
      incidence: 300,
      ratePer100k: 72.8,
      mostCommon: "Oral/Mouth Cancer",
      hospitals: ["Government Hospital, Daman"]
    },
    dl: {
      name: "Delhi",
      incidence: 28500,
      ratePer100k: 124.6,
      mostCommon: "Breast Cancer",
      hospitals: ["All India Institute of Medical Sciences (AIIMS), New Delhi", "Rajiv Gandhi Cancer Institute & Research Centre, Delhi", "Max Super Specialty Cancer Hospital, Saket"],
      notes: "Delhi shows the highest cancer incidence rate among major urban centers, driven by aggressive screening, air pollution, and urban lifestyle factors."
    },
    ga: {
      name: "Goa",
      incidence: 1850,
      ratePer100k: 112.5,
      mostCommon: "Breast Cancer",
      hospitals: ["Goa Medical College (GMC), Bambolim", "Manipal Hospital, Dona Paula"]
    },
    gj: {
      name: "Gujarat",
      incidence: 75400,
      ratePer100k: 95.8,
      mostCommon: "Oral/Mouth Cancer",
      hospitals: ["Gujarat Cancer & Research Institute (GCRI), Ahmedabad", "HCG Cancer Centre, Vadodara", "Sterling Cancer Hospital, Rajkot"],
      notes: "Gujarat exhibits high rates of head and neck cancers, specifically oral cavity cancers, linked directly to tobacco chewing habits (Mawa/Gutka)."
    },
    hr: {
      name: "Haryana",
      incidence: 31200,
      ratePer100k: 98.7,
      mostCommon: "Breast Cancer",
      hospitals: ["National Cancer Institute (AIIMS Campus), Jhajjar", "Post Graduate Institute of Medical Sciences (PGIMS), Rohtak"]
    },
    hp: {
      name: "Himachal Pradesh",
      incidence: 8900,
      ratePer100k: 104.2,
      mostCommon: "Lung Cancer",
      hospitals: ["Indira Gandhi Medical College (IGMC), Shimla", "Super Specialty Cancer Hospital, Chamiana"]
    },
    jk: {
      name: "Jammu and Kashmir",
      incidence: 14800,
      ratePer100k: 96.5,
      mostCommon: "Stomach Cancer",
      hospitals: ["Sher-i-Kashmir Institute of Medical Sciences (SKIMS), Srinagar", "Government Medical College (GMC), Jammu"],
      notes: "High prevalence of stomach and esophageal cancers, attributed to traditional salty pink tea (Nun Chai) and consumption of smoked foods."
    },
    jh: {
      name: "Jharkhand",
      incidence: 32400,
      ratePer100k: 85.3,
      mostCommon: "Oral/Mouth Cancer",
      hospitals: ["Ranchi Cancer Hospital & Research Centre", "Tata Main Hospital, Jamshedpur"]
    },
    ka: {
      name: "Karnataka",
      incidence: 84600,
      ratePer100k: 110.8,
      mostCommon: "Breast Cancer",
      hospitals: ["Kidwai Memorial Institute of Oncology, Bengaluru", "HCG Cancer Centre, Bengaluru", "Mazumdar Shaw Cancer Centre, Narayana Health, Bengaluru"],
      notes: "State-wide cancer registry data shows a steep rise in breast and colorectal cancers in metropolitan Bengaluru, aligning with modern lifestyle indicators."
    },
    kl: {
      name: "Kerala",
      incidence: 61500,
      ratePer100k: 122.3,
      mostCommon: "Breast Cancer",
      hospitals: ["Regional Cancer Centre (RCC), Trivandrum", "Malabar Cancer Centre, Thalassery", "Aster Medcity, Kochi"],
      notes: "Kerala displays a unique epidemiological pattern with higher colorectal, thyroid, and breast cancers, and relatively low cervical cancer rates due to high health literacy."
    },
    ld: {
      name: "Lakshadweep",
      incidence: 95,
      ratePer100k: 64.5,
      mostCommon: "Lung Cancer",
      hospitals: ["Indira Gandhi Specialty Hospital, Kavaratti"]
    },
    mp: {
      name: "Madhya Pradesh",
      incidence: 82100,
      ratePer100k: 90.5,
      mostCommon: "Oral/Mouth Cancer",
      hospitals: ["Cancer Hospital & Research Institute, Gwalior", "Jawaharlal Nehru Cancer Hospital, Bhopal", "Sri Aurobindo Institute of Medical Sciences, Indore"]
    },
    mh: {
      name: "Maharashtra",
      incidence: 128400,
      ratePer100k: 99.2,
      mostCommon: "Breast Cancer",
      hospitals: ["Tata Memorial Hospital, Mumbai", "ACTREC (Advanced Centre for Treatment, Research and Education in Cancer), Navi Mumbai", "Kokilaben Dhirubhai Ambani Hospital Cancer Centre, Mumbai"],
      notes: "Maharashtra accounts for one of the largest volumes of cancer patients. Tata Memorial Hospital is the premier national hub for cancer care and clinical research in India."
    },
    mn: {
      name: "Manipur",
      incidence: 3400,
      ratePer100k: 104.8,
      mostCommon: "Lung Cancer",
      hospitals: ["Regional Institute of Medical Sciences (RIMS), Imphal", "Shija Hospitals, Imphal"]
    },
    ml: {
      name: "Meghalaya",
      incidence: 3800,
      ratePer100k: 114.2,
      mostCommon: "Esophageal Cancer",
      hospitals: ["Civil Hospital Shillong (Cancer Wing)", "NEIGRIHMS, Shillong"],
      notes: "Meghalaya records very high rates of tobacco-related cancers, particularly esophageal and hypopharyngeal cancers, linked to extensive betel nut and tobacco consumption."
    },
    mz: {
      name: "Mizoram",
      incidence: 2200,
      ratePer100k: 186.4,
      mostCommon: "Stomach Cancer",
      hospitals: ["Mizoram State Cancer Institute, Aizawl"],
      notes: "Mizoram reports the highest cancer incidence rate in India. Stomach, lung, and cervical cancers are highly prevalent. Key risk factors include tobacco usage, smoked meats, and genetic traits."
    },
    nl: {
      name: "Nagaland",
      incidence: 2400,
      ratePer100k: 109.5,
      mostCommon: "Nasopharyngeal Cancer",
      hospitals: ["Christian Institute of Health Sciences and Research (CIHSR), Dimapur", "Naga Hospital Authority, Kohima"]
    },
    or: {
      name: "Odisha",
      incidence: 48500,
      ratePer100k: 89.2,
      mostCommon: "Oral/Mouth Cancer",
      hospitals: ["Acharya Harihar Post Graduate Institute of Cancer (AHPGIC), Cuttack", "AIIMS Bhubaneswar", "KIMS Cancer Center, Bhubaneswar"]
    },
    py: {
      name: "Puducherry",
      incidence: 1600,
      ratePer100k: 114.6,
      mostCommon: "Breast Cancer",
      hospitals: ["JIPMER (Jawaharlal Institute of Postgraduate Medical Education & Research), Puducherry"]
    },
    pb: {
      name: "Punjab",
      incidence: 38500,
      ratePer100k: 112.4,
      mostCommon: "Breast Cancer",
      hospitals: ["Homi Bhabha Cancer Hospital, Sangrur", "Max Cancer Centre, Bathinda", "Sri Guru Ram Das Rotary Cancer Hospital, Amritsar"],
      notes: "Southern Punjab (Malwa region) reports elevated cancer rates, which local studies link to agricultural pesticide contamination of groundwater, often dubbed the 'Cancer Train' route."
    },
    rj: {
      name: "Rajasthan",
      incidence: 81400,
      ratePer100k: 87.8,
      mostCommon: "Oral/Mouth Cancer",
      hospitals: ["Acharya Tulsi Regional Cancer Trust & Research Institute, Bikaner", "Sawai Man Singh (SMS) Medical College Cancer Center, Jaipur", "Bhagwan Mahaveer Cancer Hospital, Jaipur"]
    },
    sk: {
      name: "Sikkim",
      incidence: 850,
      ratePer100k: 114.5,
      mostCommon: "Stomach Cancer",
      hospitals: ["Sir Thutob Namgyal Memorial (STNM) Hospital, Gangtok"]
    },
    tn: {
      name: "Tamil Nadu",
      incidence: 88400,
      ratePer100k: 102.5,
      mostCommon: "Breast Cancer",
      hospitals: ["Cancer Institute (WIA) Adyar, Chennai", "Apollo Proton Cancer Centre, Chennai", "G. Kuppuswamy Naidu Memorial Hospital, Coimbatore"],
      notes: "Tamil Nadu hosts Asia's first proton therapy facility in Chennai. The state has an active screening program for breast and cervical cancers."
    },
    tg: {
      name: "Telangana",
      incidence: 45600,
      ratePer100k: 94.6,
      mostCommon: "Breast Cancer",
      hospitals: ["MNJ Institute of Oncology & Regional Cancer Centre, Hyderabad", "Basavatarakam Indo-American Cancer Hospital, Hyderabad", "AIG Hospitals, Hyderabad"]
    },
    tr: {
      name: "Tripura",
      incidence: 3500,
      ratePer100k: 88.5,
      mostCommon: "Cervical Cancer",
      hospitals: ["Regional Cancer Centre, Agartala"]
    },
    up: {
      name: "Uttar Pradesh",
      incidence: 210000,
      ratePer100k: 86.8,
      mostCommon: "Oral/Mouth Cancer",
      hospitals: ["Kalyan Singh Super Specialty Cancer Institute, Lucknow", "Sanjay Gandhi Post Graduate Institute of Medical Sciences (SGPGIMS), Lucknow", "Kamala Nehru Memorial Hospital, Prayagraj"],
      notes: "Uttar Pradesh has the highest total volume of cancer diagnoses in India. Tobacco-related head and neck cancers make up over 40% of male cases."
    },
    ut: {
      name: "Uttarakhand",
      incidence: 11200,
      ratePer100k: 94.2,
      mostCommon: "Breast Cancer",
      hospitals: ["All India Institute of Medical Sciences (AIIMS), Rishikesh", "Himalayan Institute of Medical Sciences, Dehradur"]
    },
    wb: {
      name: "West Bengal",
      incidence: 108500,
      ratePer100k: 97.4,
      mostCommon: "Breast Cancer",
      hospitals: ["Chittaranjan National Cancer Institute (CNCI), Kolkata", "Tata Medical Center, Rajarhat, Kolkata", "Saroj Gupta Cancer Centre & Research Institute, Thakurpukur"],
      notes: "West Bengal has elevated rates of lung and urinary bladder cancers, which are linked to chronic arsenic contamination of drinking groundwater in rural pockets."
    }
  }
};
