
export interface UploadedImage {
  id: string;
  uri: string;
  width: number;
  height: number;
  fileName: string;
  uploadedAt: Date;
}

export interface AIAnalysisResult {
  roofDamage: {
    detected: boolean;
    severity: 'none' | 'minor' | 'moderate' | 'severe';
    issues: string[];
    confidence: number;
  };
  structuralIssues: {
    detected: boolean;
    issues: string[];
    confidence: number;
  };
  solarCompatibility: {
    suitable: boolean;
    score: number;
    factors: string[];
    estimatedCapacity: string;
  };
  inspectionConcerns: {
    detected: boolean;
    concerns: string[];
    recommendations: string[];
  };
  overallCondition: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface RoofFacet {
  id: string;
  points: { x: number; y: number }[];
  pitch: number;
  area: number;
  label: string;
  measurements: {
    width: number;
    height: number;
    perimeter: number;
  };
}

export interface RoofDiagram {
  id: string;
  facets: RoofFacet[];
  totalArea: number;
  createdAt: Date;
  updatedAt: Date;
  mapSnapshot?: string;
}

export interface ServiceQuote {
  roofing: {
    estimatedCost: number;
    laborCost: number;
    materialCost: number;
    timeline: string;
  };
  solar: {
    estimatedCost: number;
    systemSize: string;
    estimatedSavings: number;
    paybackPeriod: string;
  };
  repairs: {
    estimatedCost: number;
    urgency: 'low' | 'medium' | 'high';
    timeline: string;
  };
  totalEstimate: number;
}

export interface InspectionReport {
  id: string;
  propertyAddress: string;
  inspectionDate: Date;
  images: UploadedImage[];
  aiAnalysis: AIAnalysisResult;
  roofDiagram?: RoofDiagram;
  quote: ServiceQuote;
  notes: string;
}
