export type AgentCategory =
  | "research"
  | "writing"
  | "coding"
  | "design"
  | "marketing"
  | "data"
  | "automation"
  | "qa";

export type AgentStatus = "active" | "idle" | "busy";

export interface Agent {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: AgentCategory;
  provider: string;
  icon: string;
  gradient: string;
  rating: number;
  reviews: number;
  hires: number;
  pricePerTask: number;
  avgResponseTime: string;
  successRate: number;
  tags: string[];
  capabilities: string[];
  status: AgentStatus;
  featured?: boolean;
}

export type WorkflowStepStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed";

export interface WorkflowStep {
  id: string;
  order: number;
  agentId: string;
  agentName: string;
  agentIcon: string;
  description: string;
  output?: string;
  status: WorkflowStepStatus;
  cost: number;
  durationMs?: number;
}

export interface Workflow {
  id: string;
  goal: string;
  steps: WorkflowStep[];
  totalCost: number;
  estimatedDurationMs: number;
  createdAt: Date;
}

export interface HiredAgent {
  agentId: string;
  hiredAt: Date;
  tasksCompleted: number;
  tasksAssigned: number;
  totalSpent: number;
}

export interface UserStats {
  tasksThisMonth: number;
  tasksLimit: number;
  spendThisMonth: number;
  spendLimit: number;
  hiredAgents: HiredAgent[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "agent" | "system";
  content: string;
  agentName?: string;
  agentIcon?: string;
  timestamp: Date;
}

export interface PlatformStat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: string;
}

export interface AgentCategoryInfo {
  id: AgentCategory;
  label: string;
  icon: string;
  description: string;
  color: string;
}
