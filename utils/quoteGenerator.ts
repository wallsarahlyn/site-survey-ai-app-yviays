
import { ServiceQuote, AIAnalysisResult } from '@/types/inspection';

export function generateQuote(
  aiAnalysis: AIAnalysisResult,
  roofArea: number = 2000
): ServiceQuote {
  // Base costs per square foot
  const roofingCostPerSqFt = 5.5;
  const solarCostPerWatt = 2.8;
  
  // Calculate roofing costs based on damage severity
  let roofingMultiplier = 1.0;
  if (aiAnalysis.roofDamage.severity === 'minor') roofingMultiplier = 1.2;
  if (aiAnalysis.roofDamage.severity === 'moderate') roofingMultiplier = 1.5;
  if (aiAnalysis.roofDamage.severity === 'severe') roofingMultiplier = 2.0;

  const roofingMaterialCost = roofArea * roofingCostPerSqFt * roofingMultiplier;
  const roofingLaborCost = roofingMaterialCost * 0.6;
  const totalRoofingCost = roofingMaterialCost + roofingLaborCost;

  // Calculate solar costs
  const systemSizeKw = aiAnalysis.solarCompatibility.suitable ? 10 : 6;
  const systemSizeWatts = systemSizeKw * 1000;
  const solarCost = systemSizeWatts * solarCostPerWatt;
  const annualSavings = systemSizeKw * 1200; // $1200 per kW per year
  const paybackYears = Math.round(solarCost / annualSavings);

  // Calculate repair costs
  const repairCost = aiAnalysis.roofDamage.issues.length * 800 + 
                     aiAnalysis.structuralIssues.issues.length * 1500;
  const repairUrgency = aiAnalysis.roofDamage.severity === 'severe' ? 'high'
    : aiAnalysis.roofDamage.severity === 'moderate' ? 'medium'
    : 'low';

  const totalEstimate = totalRoofingCost + (aiAnalysis.solarCompatibility.suitable ? solarCost : 0) + repairCost;

  return {
    roofing: {
      estimatedCost: Math.round(totalRoofingCost),
      laborCost: Math.round(roofingLaborCost),
      materialCost: Math.round(roofingMaterialCost),
      timeline: aiAnalysis.roofDamage.severity === 'severe' ? '1-2 weeks' : '2-4 weeks',
    },
    solar: {
      estimatedCost: Math.round(solarCost),
      systemSize: `${systemSizeKw} kW`,
      estimatedSavings: Math.round(annualSavings),
      paybackPeriod: `${paybackYears} years`,
    },
    repairs: {
      estimatedCost: Math.round(repairCost),
      urgency: repairUrgency,
      timeline: repairUrgency === 'high' ? '1-3 days' : '1-2 weeks',
    },
    totalEstimate: Math.round(totalEstimate),
  };
}
