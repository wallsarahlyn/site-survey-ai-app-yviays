
export interface StormEvent {
  id: string;
  date: Date;
  type: 'hail' | 'wind' | 'tornado' | 'hurricane' | 'flood';
  severity: 'minor' | 'moderate' | 'severe' | 'catastrophic';
  description: string;
  windSpeed?: number; // mph
  hailSize?: number; // inches
  proximityMiles: number;
  damageReported: boolean;
}

export interface FireRiskZone {
  zone: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'extreme';
  lastUpdate: Date;
  factors: string[];
}

export interface FloodRisk {
  floodZone: string;
  riskLevel: 'minimal' | 'moderate' | 'high';
  baseFloodElevation?: number;
  lastFloodDate?: Date;
}

export interface InsuranceClaimData {
  claimsInArea: number;
  averageClaimAmount: number;
  commonClaimTypes: string[];
  lastClaimDate?: Date;
}

export interface WeatherPattern {
  averageAnnualPrecipitation: number; // inches
  averageSnowfall: number; // inches
  averageWindSpeed: number; // mph
  extremeWeatherDays: number; // days per year
  temperatureRange: {
    min: number;
    max: number;
  };
}

export interface RoofAgePattern {
  averageRoofAge: number; // years
  commonRoofTypes: string[];
  replacementFrequency: number; // years
  regionalFactors: string[];
}

export interface RiskScore {
  category: 'hail' | 'wind' | 'fire' | 'flood' | 'overall';
  score: number; // 0-100
  level: 'low' | 'moderate' | 'high' | 'extreme';
  factors: string[];
}

export interface HistoricalAnalysis {
  id: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  analyzedAt: Date;
  stormEvents: StormEvent[];
  fireRisk: FireRiskZone;
  floodRisk: FloodRisk;
  insuranceClaims: InsuranceClaimData;
  weatherPatterns: WeatherPattern;
  roofAgePatterns: RoofAgePattern;
  riskScores: RiskScore[];
  aiSummary: string;
  dataSourcesUsed: string[];
}

export interface HistoricalReportOptions {
  includeTimeline: boolean;
  includeMaps: boolean;
  includeTables: boolean;
  reportType: 'standalone' | 'integrated';
}
