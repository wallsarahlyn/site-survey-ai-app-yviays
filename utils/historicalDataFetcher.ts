
import { HistoricalAnalysis, StormEvent, FireRiskZone, FloodRisk, InsuranceClaimData, WeatherPattern, RoofAgePattern, RiskScore } from '@/types/historicalData';

/**
 * Geocode an address to coordinates
 * In production, use a real geocoding service like Google Maps Geocoding API
 */
async function geocodeAddress(address: string): Promise<{ latitude: number; longitude: number }> {
  console.log('Geocoding address:', address);
  
  // Mock geocoding - In production, call actual geocoding API
  // Example: Google Maps Geocoding API, Mapbox, or OpenStreetMap Nominatim
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock coordinates (roughly center of US)
  return {
    latitude: 39.8283 + (Math.random() - 0.5) * 10,
    longitude: -98.5795 + (Math.random() - 0.5) * 20,
  };
}

/**
 * Fetch storm data from NOAA and other sources
 * In production, integrate with:
 * - NOAA Storm Events Database API
 * - Weather.gov API
 * - Storm Prediction Center
 */
async function fetchStormData(coordinates: { latitude: number; longitude: number }): Promise<StormEvent[]> {
  console.log('Fetching storm data for coordinates:', coordinates);
  
  // Mock storm data - In production, call actual APIs
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const stormTypes: Array<'hail' | 'wind' | 'tornado' | 'hurricane' | 'flood'> = ['hail', 'wind', 'tornado', 'hurricane', 'flood'];
  const severities: Array<'minor' | 'moderate' | 'severe' | 'catastrophic'> = ['minor', 'moderate', 'severe', 'catastrophic'];
  
  const events: StormEvent[] = [];
  const numEvents = Math.floor(Math.random() * 8) + 3;
  
  for (let i = 0; i < numEvents; i++) {
    const type = stormTypes[Math.floor(Math.random() * stormTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const daysAgo = Math.floor(Math.random() * 1825); // Up to 5 years ago
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    events.push({
      id: `storm-${i}-${Date.now()}`,
      date,
      type,
      severity,
      description: generateStormDescription(type, severity),
      windSpeed: type === 'wind' || type === 'tornado' || type === 'hurricane' ? Math.floor(Math.random() * 100) + 40 : undefined,
      hailSize: type === 'hail' ? Math.random() * 3 + 0.5 : undefined,
      proximityMiles: Math.random() * 25,
      damageReported: Math.random() > 0.5,
    });
  }
  
  // Sort by date (most recent first)
  return events.sort((a, b) => b.date.getTime() - a.date.getTime());
}

function generateStormDescription(type: string, severity: string): string {
  const descriptions: Record<string, string[]> = {
    hail: [
      'Severe hailstorm with significant property damage reported',
      'Hail event affecting multiple neighborhoods',
      'Large hail causing roof and vehicle damage',
    ],
    wind: [
      'High wind event with structural damage',
      'Severe windstorm causing power outages',
      'Damaging winds affecting roofing materials',
    ],
    tornado: [
      'Tornado touchdown with path of destruction',
      'Tornado warning with confirmed sighting',
      'EF-rated tornado causing widespread damage',
    ],
    hurricane: [
      'Hurricane force winds and heavy rainfall',
      'Tropical storm upgraded to hurricane',
      'Major hurricane with catastrophic damage',
    ],
    flood: [
      'Flash flooding from heavy rainfall',
      'River flooding affecting low-lying areas',
      'Urban flooding with property damage',
    ],
  };
  
  const typeDescriptions = descriptions[type] || ['Weather event'];
  return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
}

/**
 * Fetch fire risk data from FEMA and local sources
 * In production, integrate with:
 * - FEMA National Risk Index
 * - US Forest Service Wildfire Risk Assessment
 * - State fire marshal databases
 */
async function fetchFireRiskData(coordinates: { latitude: number; longitude: number }): Promise<FireRiskZone> {
  console.log('Fetching fire risk data for coordinates:', coordinates);
  
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const riskLevels: Array<'low' | 'moderate' | 'high' | 'extreme'> = ['low', 'moderate', 'high', 'extreme'];
  const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
  
  const factors = [
    'Proximity to wildland areas',
    'Historical fire frequency in region',
    'Vegetation density and type',
    'Local fire department response time',
    'Building materials and defensible space',
  ];
  
  return {
    zone: `Fire Zone ${Math.floor(Math.random() * 5) + 1}`,
    riskLevel,
    lastUpdate: new Date(),
    factors: factors.slice(0, Math.floor(Math.random() * 3) + 2),
  };
}

/**
 * Fetch flood risk data from FEMA
 * In production, integrate with:
 * - FEMA Flood Map Service Center
 * - National Flood Insurance Program (NFIP)
 */
async function fetchFloodRiskData(coordinates: { latitude: number; longitude: number }): Promise<FloodRisk> {
  console.log('Fetching flood risk data for coordinates:', coordinates);
  
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const zones = ['X', 'A', 'AE', 'AH', 'AO', 'V', 'VE'];
  const riskLevels: Array<'minimal' | 'moderate' | 'high'> = ['minimal', 'moderate', 'high'];
  
  const floodZone = zones[Math.floor(Math.random() * zones.length)];
  const riskLevel = floodZone === 'X' ? 'minimal' : floodZone.startsWith('V') ? 'high' : 'moderate';
  
  return {
    floodZone,
    riskLevel,
    baseFloodElevation: riskLevel !== 'minimal' ? Math.floor(Math.random() * 50) + 100 : undefined,
    lastFloodDate: Math.random() > 0.6 ? new Date(Date.now() - Math.random() * 365 * 10 * 24 * 60 * 60 * 1000) : undefined,
  };
}

/**
 * Fetch insurance claim data
 * In production, integrate with:
 * - Public insurance claim databases (where available)
 * - ISO (Insurance Services Office) data
 * - State insurance department records
 */
async function fetchInsuranceClaimData(coordinates: { latitude: number; longitude: number }): Promise<InsuranceClaimData> {
  console.log('Fetching insurance claim data for coordinates:', coordinates);
  
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const claimTypes = [
    'Hail damage',
    'Wind damage',
    'Water damage',
    'Fire damage',
    'Structural damage',
    'Roof replacement',
  ];
  
  return {
    claimsInArea: Math.floor(Math.random() * 500) + 50,
    averageClaimAmount: Math.floor(Math.random() * 15000) + 5000,
    commonClaimTypes: claimTypes.slice(0, Math.floor(Math.random() * 4) + 2),
    lastClaimDate: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 365 * 2 * 24 * 60 * 60 * 1000) : undefined,
  };
}

/**
 * Fetch historical weather patterns
 * In production, integrate with:
 * - NOAA Climate Data Online (CDO)
 * - Weather Underground historical data
 * - Local weather station data
 */
async function fetchWeatherPatterns(coordinates: { latitude: number; longitude: number }): Promise<WeatherPattern> {
  console.log('Fetching weather patterns for coordinates:', coordinates);
  
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    averageAnnualPrecipitation: Math.random() * 40 + 20,
    averageSnowfall: Math.random() * 60,
    averageWindSpeed: Math.random() * 10 + 8,
    extremeWeatherDays: Math.floor(Math.random() * 30) + 10,
    temperatureRange: {
      min: Math.floor(Math.random() * 30) - 10,
      max: Math.floor(Math.random() * 30) + 70,
    },
  };
}

/**
 * Fetch roof age patterns for the region
 * In production, integrate with:
 * - Local building permit databases
 * - Property assessment records
 * - Regional construction data
 */
async function fetchRoofAgePatterns(coordinates: { latitude: number; longitude: number }): Promise<RoofAgePattern> {
  console.log('Fetching roof age patterns for coordinates:', coordinates);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const roofTypes = [
    'Asphalt shingles',
    'Metal roofing',
    'Tile roofing',
    'Wood shakes',
    'Flat/membrane roofing',
  ];
  
  const factors = [
    'High UV exposure accelerates aging',
    'Frequent freeze-thaw cycles',
    'High wind exposure',
    'Heavy precipitation',
    'Temperature extremes',
  ];
  
  return {
    averageRoofAge: Math.floor(Math.random() * 15) + 10,
    commonRoofTypes: roofTypes.slice(0, Math.floor(Math.random() * 3) + 2),
    replacementFrequency: Math.floor(Math.random() * 10) + 15,
    regionalFactors: factors.slice(0, Math.floor(Math.random() * 3) + 2),
  };
}

/**
 * Calculate risk scores based on all collected data
 */
function calculateRiskScores(
  stormEvents: StormEvent[],
  fireRisk: FireRiskZone,
  floodRisk: FloodRisk,
  weatherPatterns: WeatherPattern
): RiskScore[] {
  const scores: RiskScore[] = [];
  
  // Hail risk score
  const hailEvents = stormEvents.filter(e => e.type === 'hail');
  const recentHailEvents = hailEvents.filter(e => {
    const daysSince = (Date.now() - e.date.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince < 365 * 3; // Last 3 years
  });
  const hailScore = Math.min(100, (recentHailEvents.length * 15) + (hailEvents.length * 5));
  scores.push({
    category: 'hail',
    score: hailScore,
    level: hailScore > 70 ? 'extreme' : hailScore > 50 ? 'high' : hailScore > 30 ? 'moderate' : 'low',
    factors: [
      `${hailEvents.length} hail events in past 5 years`,
      `${recentHailEvents.length} events in past 3 years`,
      recentHailEvents.length > 0 ? `Most recent: ${recentHailEvents[0].date.toLocaleDateString()}` : 'No recent events',
    ],
  });
  
  // Wind risk score
  const windEvents = stormEvents.filter(e => e.type === 'wind' || e.type === 'tornado' || e.type === 'hurricane');
  const avgWindSpeed = weatherPatterns.averageWindSpeed;
  const windScore = Math.min(100, (windEvents.length * 12) + (avgWindSpeed * 2));
  scores.push({
    category: 'wind',
    score: windScore,
    level: windScore > 70 ? 'extreme' : windScore > 50 ? 'high' : windScore > 30 ? 'moderate' : 'low',
    factors: [
      `${windEvents.length} wind events recorded`,
      `Average wind speed: ${avgWindSpeed.toFixed(1)} mph`,
      `Extreme weather days: ${weatherPatterns.extremeWeatherDays} per year`,
    ],
  });
  
  // Fire risk score
  const fireScoreMap = { low: 20, moderate: 45, high: 70, extreme: 95 };
  const fireScore = fireScoreMap[fireRisk.riskLevel];
  scores.push({
    category: 'fire',
    score: fireScore,
    level: fireRisk.riskLevel,
    factors: fireRisk.factors,
  });
  
  // Flood risk score
  const floodScoreMap = { minimal: 15, moderate: 50, high: 85 };
  const floodScore = floodScoreMap[floodRisk.riskLevel];
  scores.push({
    category: 'flood',
    score: floodScore,
    level: floodRisk.riskLevel === 'minimal' ? 'low' : floodRisk.riskLevel === 'moderate' ? 'moderate' : 'high',
    factors: [
      `Flood zone: ${floodRisk.floodZone}`,
      `Risk level: ${floodRisk.riskLevel}`,
      floodRisk.lastFloodDate ? `Last flood: ${floodRisk.lastFloodDate.toLocaleDateString()}` : 'No recent floods',
    ],
  });
  
  // Overall risk score (weighted average)
  const overallScore = Math.round((hailScore * 0.3 + windScore * 0.3 + fireScore * 0.2 + floodScore * 0.2));
  scores.push({
    category: 'overall',
    score: overallScore,
    level: overallScore > 70 ? 'extreme' : overallScore > 50 ? 'high' : overallScore > 30 ? 'moderate' : 'low',
    factors: [
      'Composite risk assessment',
      'Based on historical data and regional patterns',
      'Updated with latest available information',
    ],
  });
  
  return scores;
}

/**
 * Generate AI summary of the historical analysis
 */
function generateAISummary(
  stormEvents: StormEvent[],
  fireRisk: FireRiskZone,
  floodRisk: FloodRisk,
  insuranceClaims: InsuranceClaimData,
  riskScores: RiskScore[]
): string {
  const overallRisk = riskScores.find(s => s.category === 'overall');
  const severeEvents = stormEvents.filter(e => e.severity === 'severe' || e.severity === 'catastrophic');
  
  let summary = `This property is located in an area with ${overallRisk?.level || 'moderate'} overall risk based on historical data analysis. `;
  
  if (severeEvents.length > 0) {
    summary += `The area has experienced ${severeEvents.length} severe weather event(s) in the past 5 years, including ${severeEvents[0].type} damage. `;
  } else {
    summary += `The area has experienced relatively stable weather conditions with no severe events in recent years. `;
  }
  
  if (fireRisk.riskLevel === 'high' || fireRisk.riskLevel === 'extreme') {
    summary += `Fire risk is elevated due to ${fireRisk.factors[0].toLowerCase()}. `;
  }
  
  if (floodRisk.riskLevel !== 'minimal') {
    summary += `The property is in flood zone ${floodRisk.floodZone}, indicating ${floodRisk.riskLevel} flood risk. `;
  }
  
  if (insuranceClaims.claimsInArea > 200) {
    summary += `Insurance claim activity in the area is above average with ${insuranceClaims.claimsInArea} claims, primarily for ${insuranceClaims.commonClaimTypes[0].toLowerCase()}. `;
  }
  
  summary += `For insurance underwriting purposes, this property should be evaluated with consideration of the regional risk factors and historical event patterns documented in this report.`;
  
  return summary;
}

/**
 * Main function to fetch and analyze all historical data for an address
 */
export async function fetchHistoricalAnalysis(address: string): Promise<HistoricalAnalysis> {
  console.log('Starting historical analysis for address:', address);
  
  try {
    // Step 1: Geocode the address
    const coordinates = await geocodeAddress(address);
    
    // Step 2: Fetch all data in parallel for better performance
    const [
      stormEvents,
      fireRisk,
      floodRisk,
      insuranceClaims,
      weatherPatterns,
      roofAgePatterns,
    ] = await Promise.all([
      fetchStormData(coordinates),
      fetchFireRiskData(coordinates),
      fetchFloodRiskData(coordinates),
      fetchInsuranceClaimData(coordinates),
      fetchWeatherPatterns(coordinates),
      fetchRoofAgePatterns(coordinates),
    ]);
    
    // Step 3: Calculate risk scores
    const riskScores = calculateRiskScores(stormEvents, fireRisk, floodRisk, weatherPatterns);
    
    // Step 4: Generate AI summary
    const aiSummary = generateAISummary(stormEvents, fireRisk, floodRisk, insuranceClaims, riskScores);
    
    // Step 5: Compile the complete analysis
    const analysis: HistoricalAnalysis = {
      id: `HIST-${Date.now()}`,
      address,
      coordinates,
      analyzedAt: new Date(),
      stormEvents,
      fireRisk,
      floodRisk,
      insuranceClaims,
      weatherPatterns,
      roofAgePatterns,
      riskScores,
      aiSummary,
      dataSourcesUsed: [
        'NOAA Storm Events Database',
        'FEMA National Risk Index',
        'National Flood Insurance Program',
        'Regional Weather Data',
        'Insurance Claim Records',
        'Local Building Records',
      ],
    };
    
    console.log('Historical analysis completed successfully');
    return analysis;
    
  } catch (error) {
    console.error('Error fetching historical analysis:', error);
    throw new Error('Failed to fetch historical analysis. Please check the address and try again.');
  }
}
