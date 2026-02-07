// Blindfold v3 Types

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'active' | 'busy' | 'error' | 'thinking' | 'collaborating';
  description?: string;
  tools?: string[];
  color: string;
  capabilities: string[];
  currentTask?: string | null;
  project?: string;
  lastActive: string;
  suggestionCount: number;
  metrics?: {
    tasksCompleted: number;
    tasksInProgress: number;
    avgResponseTime: number;
    successRate: number;
  };
  starred?: boolean;
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
  fromAgent: string;
  toAgent: string;
  messageType: string;
  timestamp: string;
  direction: '→' | '←' | '↔';
  payload?: any;
}

export interface SystemStats {
  totalAgents: number;
  activeAgents: number;
  pendingProposals: number;
  completedTasks: number;
  successRate: number;
  uptime: string;
}

// Worker types for WorkerMonitor
export type WorkerStatus = 'running' | 'idle' | 'error' | 'queued';
export type WorkerCategory = 'development' | 'specialized' | 'tool' | 'ai' | 'integration' | 'design';

export interface Worker {
  id: string;
  name: string;
  category: WorkerCategory;
  status: WorkerStatus;
  project?: string;
  taskId?: string;
  progress?: number;
  description?: string;
  startedAt?: string;
  subAgents?: string[];
  icon?: string;
  starred?: boolean;
}

export interface WorkerLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

// System Metrics types
export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    in: number;
    out: number;
  };
  uptime: number;
  requestsPerSecond: number;
  latency: number;
  errorsLastHour: number;
}

export interface MetricHistory {
  timestamp: string;
  cpu: number;
  memory: number;
  requestsPerSecond: number;
  latency: number;
}

// System Event type
export interface SystemEvent {
  id: string;
  type: 'task_start' | 'task_complete' | 'message_sent' | 'message_received' | 'worker_start' | 'worker_stop' | 'error' | 'warning';
  agent?: string;
  worker?: string;
  taskId?: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'success';
}
