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

export interface SoilAnalysis {
  id: string;
  plotId: string;
  analyzedAt: string;
  ph?: number | null;
  nitrogenPct?: number | null;
  phosphorusPct?: number | null;
  potassiumPct?: number | null;
  organicMatterPct?: number | null;
  notes?: string | null;
  createdAt: string;
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
  areaHa?: number | null;
  yieldPerHa?: number | null;
  costPerHa?: number | null;
  totalRevenue: number;
  margin: number;
  marginPerHa?: number | null;
}

export interface PestDiagnosisSummary {
  condition: string;
  count: number;
  lastDetectedAt: string;
}

export interface PendingCostActivity {
  id: string;
  activityType: 'Irrigation' | 'Fertilization' | 'Labor';
  cropId: string;
  cropType: string;
  plotName?: string | null;
  date: string;
  description: string;
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
  irrigationCost: number;
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

export interface Task {
  id: string;
  createdBy: string;
  assignedTo: string;
  assigneeName: string;
  creatorName: string;
  plotId?: string | null;
  plotName?: string | null;
  cropId?: string | null;
  cropName?: string | null;
  title: string;
  description?: string | null;
  priority: string;
  status: string;
  taskType: string;
  dueDate: string;
  completedAt?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface TaskTemplate {
  id: string;
  createdBy: string;
  creatorName: string;
  plotId?: string | null;
  plotName?: string | null;
  cropId?: string | null;
  cropName?: string | null;
  title: string;
  description?: string | null;
  taskType: string;
  priority: string;
  shift: string;
  recurrenceType: string;
  weekDays?: string | null;
  startDate: string;
  endDate?: string | null;
  requiredPhenologyStage?: string | null;
  isActive: boolean;
  occurrenceCount: number;
  createdAt: string;
}

export interface PhenologyTemplate {
  id: string;
  cropType: string;
  stageName: string;
  stageOrder: number;
  description?: string | null;
  minDays: number;
  maxDays: number;
  icon?: string | null;
  recommendations?: string | null;
}

export interface TaskOccurrence {
  id: string;
  templateId: string;
  templateTitle: string;
  taskType: string;
  priority: string;
  assignedTo?: string | null;
  assigneeName?: string | null;
  plotName?: string | null;
  cropName?: string | null;
  scheduledDate: string;
  shift: string;
  status: string;
  completedAt?: string | null;
  notes?: string | null;
}
