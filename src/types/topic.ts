export type SubjectGroup = "STEM" | "Applied STEM";
export type ServiceType = "IA" | "EE";
export type Level = "SL" | "HL";
export type Complexity = "Low" | "Moderate" | "High";
export type DataAvailability = "High" | "Moderate" | "Low";
export type MethodologyType = "Quantitative" | "Qualitative" | "Mixed";
export type InventoryType = "Pre-Built" | "Custom";
export type TargetBand = 5 | 6 | 7;

export interface Topic {
  id: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  programme: string;
  subjectGroup: SubjectGroup;
  subject: string;
  serviceType: ServiceType;
  level: Level;
  inventoryType: InventoryType;
  topicTitle: string;
  topicArea: string;
  draftRQ: string;
  rationale: string;
  whyItWorks: string;
  keyTheory: string[];
  targetBand: TargetBand[];
  feasibility: number;
  innovation: number;
  complexity: Complexity;
  interdisciplinary: boolean;
  dataAvailability: DataAvailability;
  methodology: string;
  methodologyType: MethodologyType;
  primarySource: string;
  dataComfort: string;
  recommendedFor: string;
  prerequisiteSkills: string[];
  riskFlags: string[];
  estimatedHours: number;
  status: string;
  shortlisted: boolean;
  convertedToRQ: boolean;
  mentorNote: string;
}

export interface FilterState {
  subjectGroup: SubjectGroup | null;
  subject: string | null;
  level: Level | null;
  targetBand: TargetBand | null;
  serviceType: ServiceType | null;
  methodologyType: MethodologyType | null;
  inventoryType: InventoryType | null;
}
