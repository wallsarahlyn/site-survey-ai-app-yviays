
import { HistoricalAnalysis } from '@/types/historicalData';

export async function fetchHistoricalAnalysis(
  address: string,
  coordinates?: { latitude: number; longitude: number } | null
): Promise<HistoricalAnalysis> {
  console.log('Fetching historical analysis for:', address);
  console.log('Coordinates:', coordinates);

  // In a real implementation, this would call a Supabase Edge Function
  // that uses the coordinates to fetch actual historical data from various APIs
  
  // For now, return mock data with realistic patterns
  // The coordinates would be used to fetch region-specific data
  
  const mockData: HistoricalAnalysis = {
    address,
    coordinates: coordinates || { latitude: 30.2672, longitude: -97.7431 }, // Default to Austin, TX
    analysisDate: new Date(),
    weatherPatterns: {
      averageAnnualRainfall: 34.2,
      averageAnnualSnowfall: 0.4,
      averageWindSpeed: 8.9,
      extremeTemperatures: {
        recordHigh: 112,
        recordLow: -2,
        averageHigh: 81,
        averageLow: 62,
      },
      severeWeatherDays: 15,
    },
    stormEvents: [
      {
        date: new Date('2023-05-15'),
        type: 'Hail',
        severity: 'Moderate',
        description: 'Golf ball sized hail reported in the area',
        damageEstimate: 15000,
      },
      {
        date: new Date('2022-08-20'),
        type: 'Wind',
        severity: 'Severe',
        description: 'Straight-line winds up to 70 mph',
        damageEstimate: 25000,
      },
      {
        date: new Date('2021-02-15'),
        type: 'Winter Storm',
        severity: 'Severe',
        description: 'Historic winter storm with prolonged freezing temperatures',
        damageEstimate: 50000,
      },
    ],
    riskAssessment: {
      floodRisk: 'Low',
      fireRisk: 'Moderate',
      windRisk: 'Moderate',
      hailRisk: 'High',
      earthquakeRisk: 'Low',
      overallRiskScore: 6.5,
    },
    insuranceData: {
      averageClaimAmount: 12500,
      claimFrequency: 0.08,
      commonClaimTypes: ['Hail Damage', 'Wind Damage', 'Water Damage'],
      regionalPremiumIndex: 1.15,
    },
    roofingData: {
      averageRoofAge: 12,
      commonRoofTypes: ['Asphalt Shingle', 'Metal', 'Tile'],
      averageReplacementCost: 15000,
      recommendedMaintenanceInterval: 2,
    },
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  return mockData;
}
