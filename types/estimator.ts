
export interface CostModel {
  id: string;
  name: string;
  category: 'roofing' | 'solar' | 'repair';
  baseRate: number;
  unit: 'sqft' | 'linear-ft' | 'unit' | 'hour';
  laborRate: number;
  materialRate: number;
  overheadPercentage: number;
  profitMarginPercentage: number;
}

export interface EstimateItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  laborCost: number;
  materialCost: number;
  totalCost: number;
}

export interface ProposalTemplate {
  id: string;
  name: string;
  tier: 'good' | 'better' | 'best';
  description: string;
  items: EstimateItem[];
  totalCost: number;
  warranty: string;
  timeline: string;
  terms: string;
}

export interface Estimate {
  id: string;
  projectName: string;
  address: string;
  clientName: string;
  createdAt: Date;
  validUntil: Date;
  costModel: CostModel;
  items: EstimateItem[];
  subtotal: number;
  tax: number;
  total: number;
  marginAdjustment: number;
  proposals: ProposalTemplate[];
  notes: string;
}
