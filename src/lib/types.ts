// Blindfold v3 Types

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'active' | 'thinking' | 'collaborating';
  color: string;
  capabilities: string[];
  currentTask: string | null;
  lastActive: string;
  suggestionCount: number;
}

export interface Proposal {
  id: string;
  agent: string;
  agentId: string;
  task: string;
  reason: string;
  expectedOutcome: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  votes: AgentVote[];
  dependencies: string[];
}

export interface AgentVote {
  agent: string;
  vote: 'support' | 'oppose' | 'abstain';
  comment?: string;
  timestamp: string;
}

export interface Task {
  id: string;
  proposalId: string;
  agent: string;
  task: string;
  reason: string;
  expectedOutcome: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt?: string;
  startedAt?: string;
  completedAt?: string;
  result?: string;
}

export interface AgentMessage {
  id: string;
  from: string;
  to?: string;
  type: 'proposal' | 'collaboration_request' | 'feedback' | 'task_assigned' | 'task_completed' | 'system';
  content: string;
  timestamp: string;
  proposalId?: string;
  taskId?: string;
  rating?: number;
}

export interface AgentFeedback {
  id: string;
  from: string;
  to: string;
  aboutTask: string;
  feedback: string;
  rating: number;
  timestamp: string;
}

export interface AgentCommunication {
  messages: AgentMessage[];
  feedbacks: AgentFeedback[];
  updatedAt: string;
}

export interface SystemStats {
  totalAgents: number;
  activeAgents: number;
  pendingProposals: number;
  completedTasks: number;
  successRate: number;
  uptime: string;
}
