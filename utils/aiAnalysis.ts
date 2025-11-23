
import { AIAnalysisResult } from '@/types/inspection';

// Mock AI analysis - In production, this would call an actual AI service
export async function analyzeImages(imageUris: string[]): Promise<AIAnalysisResult> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate mock analysis based on random factors
  const roofDamageDetected = Math.random() > 0.5;
  const structuralIssuesDetected = Math.random() > 0.7;
  const solarSuitable = Math.random() > 0.3;

  const severityOptions: Array<'none' | 'minor' | 'moderate' | 'severe'> = ['none', 'minor', 'moderate', 'severe'];
  const severity = roofDamageDetected 
    ? severityOptions[Math.floor(Math.random() * 3) + 1] 
    : 'none';

  const roofIssues = roofDamageDetected ? [
    'Missing or damaged shingles detected',
    'Potential water damage on north-facing slope',
    'Granule loss observed in multiple areas',
  ] : [];

  const structuralIssues = structuralIssuesDetected ? [
    'Sagging detected in roof line',
    'Possible foundation settling',
  ] : [];

  const solarFactors = solarSuitable ? [
    'South-facing roof orientation optimal',
    'Minimal shading from surrounding structures',
    'Adequate roof space for panel installation',
    'Roof structure appears sound',
  ] : [
    'Excessive shading from trees',
    'Roof orientation not ideal',
    'Roof repairs needed before installation',
  ];

  const concerns = [
    'Gutter cleaning recommended',
    'Flashing inspection needed around chimney',
    'Ventilation assessment recommended',
  ];

  const recommendations = [
    'Schedule detailed roof inspection within 30 days',
    'Consider preventive maintenance program',
    'Review insurance coverage for roof damage',
  ];

  const conditionOptions: Array<'excellent' | 'good' | 'fair' | 'poor'> = ['excellent', 'good', 'fair', 'poor'];
  const overallCondition = severity === 'none' ? 'excellent' 
    : severity === 'minor' ? 'good'
    : severity === 'moderate' ? 'fair'
    : 'poor';

  return {
    roofDamage: {
      detected: roofDamageDetected,
      severity,
      issues: roofIssues,
      confidence: 0.85 + Math.random() * 0.1,
    },
    structuralIssues: {
      detected: structuralIssuesDetected,
      issues: structuralIssues,
      confidence: 0.78 + Math.random() * 0.15,
    },
    solarCompatibility: {
      suitable: solarSuitable,
      score: solarSuitable ? 75 + Math.random() * 20 : 40 + Math.random() * 30,
      factors: solarFactors,
      estimatedCapacity: solarSuitable ? '8-12 kW' : '4-6 kW',
    },
    inspectionConcerns: {
      detected: true,
      concerns,
      recommendations,
    },
    overallCondition,
  };
}
