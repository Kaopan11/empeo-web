export interface Employee {
  id: string;
  full_name: string;
  email: string;
  department: string;
}

export type PerformanceTier = "HIGH" | "CORE" | "LOW";

export type BiasLabel = "Too lenient" | "Strict" | null;

export type EvaluationStatus = "PENDING" | "DRAFT" | "SUBMITTED" | "OVERDUE";

export interface TeamMember {
  userId: string;
  name: string;
  email: string;
  department: string;
  evaluationId: string | null;
  status: EvaluationStatus;
}

export interface TeamEvaluations {
  cycle: { id: string; name: string };
  members: TeamMember[];
}

export interface EvaluationWriteBody {
  technical: string;
  collaboration: string;
  feedback: string;
}

export interface EvaluationWriteResponse {
  id: string;
  status: "DRAFT" | "SUBMITTED";
  totalRawScore: number;
  submittedAt: string | null;
}

export interface Review {
  id: string;
  employee_id: string;
  reviewer_id: string;
  cycle: string;
  score: number;
  comment: string;
  created_at: string;
}

export interface HrDashboard {
  cycle: { id: string; name: string; endDate: string };
  kpis: {
    totalEmployees: number;
    departments: number;
    submitted: number;
    inProgress: number;
    overdue: number;
    completionRate: number;
    daysUntilEnd: number;
  };
  distribution: {
    low: { count: number; percent: number };
    core: { count: number; percent: number };
    high: { count: number; percent: number };
    averageNormalized: number | null;
    calibrationSpread: number | null;
    confidence: number;
  };
  managers: {
    managerId: string;
    name: string;
    department: string;
    reportCount: number;
    biasIndex: number | null;
    label: BiasLabel;
  }[];
  talent: {
    userId: string;
    name: string;
    department: string;
    rawScore: number | null;
    normalizedScore: number | null;
    tier: PerformanceTier | null;
    status: EvaluationStatus;
  }[];
}
