export interface Farm {
  id: string;
  name: string;
  description?: string | null;
  lat?: number | null;
  lng?: number | null;
  areaHa?: number | null;
  country?: string | null;
  region?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Plot {
  id: string;
  farmId: string;
  name: string;
  soilType?: string | null;
  areaHa?: number | null;
  geoJson?: string | null;
  notes?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface FarmSummary {
  farmId: string;
  farmName: string;
  totalAreaHa: number;
  totalPlots: number;
  activePlots: number;
  activeCropCount: number;
  totalCostCurrentMonth: number;
  unresolvedAlertCount: number;
}

export interface PlotGeo {
  id: string;
  name: string;
  geoJson?: string | null;
  areaHa?: number | null;
  currentCropType?: string | null;
  status?: string | null;
}

export interface Crop {
  id: string;
  plotId: string;
  cropType: string;
  variety?: string | null;
  plantedAt: string;
  estimatedHarvest?: string | null;
  harvestedAt?: string | null;
  status: string;
  yieldKg?: number | null;
  notes?: string | null;
  createdAt: string;
}

export interface CropComparison {
  id: string;
  cropType: string;
  variety?: string | null;
  plotName: string;
  status: string;
  yieldKg?: number | null;
  totalCost: number;
}

export interface CropPrediction {
  predictedYieldKg?: number | null;
  yieldBasis?: string | null;
  predictedHarvestDate?: string | null;
  harvestBasis?: string | null;
}

export interface MonthlyCost {
  year: number;
  month: number;
  fertilizationCost: number;
  laborCost: number;
  totalCost: number;
}

export interface YieldHistoryPoint {
  year: number;
  month: number;
  totalYieldKg: number;
  harvestedCropCount: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface Irrigation {
  id: string;
  cropId: string;
  method: string;
  volumeLiters?: number | null;
  durationMin?: number | null;
  appliedAt: string;
  notes?: string | null;
  createdAt: string;
}

export interface Fertilization {
  id: string;
  cropId: string;
  productName: string;
  productType?: string | null;
  doseKgHa?: number | null;
  totalKg?: number | null;
  method?: string | null;
  cost?: number | null;
  appliedAt: string;
  nextApplication?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface Labor {
  id: string;
  cropId: string;
  activityType: string;
  hoursWorked?: number | null;
  workersCount: number;
  cost?: number | null;
  performedAt: string;
  notes?: string | null;
  createdAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
}
