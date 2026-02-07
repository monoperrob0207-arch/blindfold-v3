// 📊 TypeScript Interfaces para la Plataforma Agéntica

// ============ AGENT TYPES ============

export type AgentStatus = 'active' | 'idle' | 'busy' | 'error' | 'offline';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  description?: string;
  tools?: string[];
  currentTask?: string;
  project?: string;
  lastActive: string;
  metrics?: AgentMetrics;
  icon?: string;
  starred?: boolean;
  color?: string; // For compatibility with old Agent type
}

export interface AgentMetrics {
  tasksCompleted: number;
  tasksInProgress: number;
  avgResponseTime: number; // ms
  successRate: number; // percentage
}

export interface AgentCommunication {
  fromAgent: string;
  toAgent: string;
  messageType: string;
  timestamp: string;
  direction: '→' | '←' | '↔';
  payload?: any;
}

// ============ WORKER TYPES ============

export type WorkerStatus = 'running' | 'idle' | 'error' | 'queued';

export interface Worker {
  id: string;
  name: string;
  category: WorkerCategory;
  status: WorkerStatus;
  project?: string;
  taskId?: string;
  progress?: number; // 0-100
  description?: string;
  startedAt?: string;
  subAgents?: string[]; // Agentes/sub-agentes que están comunicando
  icon?: string;
  starred?: boolean;
}

export type WorkerCategory = 
  | 'development'
  | 'specialized'
  | 'tool'
  | 'ai'
  | 'integration'
  | 'design';

export interface WorkerDetail extends Worker {
  logs: WorkerLog[];
  metrics: WorkerMetrics;
  communications: AgentCommunication[];
}

export interface WorkerLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

export interface WorkerMetrics {
  cpuUsage: number;
  memoryUsage: number;
  executionTime: number; // seconds
  tasksCompleted: number;
}

// ============ SKILL TYPES ============

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  location: string;
  installed: boolean;
  version?: string;
  dependencies?: string[];
  icon?: string;
}

export type SkillCategory = 
  | 'memory'
  | 'development'
  | 'design'
  | 'social'
  | 'video'
  | 'utility';

// ============ MEMORY TYPES ============

export interface MemoryStatus {
  totalChunks: number;
  indexedToday: number;
  lastBackup: string;
  storageUsed: string;
  collection: string;
  autoIndexEnabled: boolean;
}

export interface MemoryChunk {
  id: string;
  content: string;
  category: 'preferencia' | 'decision' | 'deployment' | 'solucion' | 'general';
  timestamp: string;
  embedding?: number[];
}

// ============ PROCESS & TASK TYPES ============

export interface ProcessQueue {
  running: Process[];
  queued: Process[];
  completed: Process[];
  failed: Process[];
}

export interface Process {
  id: string;
  name: string;
  agent: string;
  project: string;
  status: 'running' | 'queued' | 'completed' | 'failed';
  progress: number;
  startedAt: string;
  completedAt?: string;
  logs: WorkerLog[];
}

// ============ METRICS TYPES ============

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
  value: number;
}

// ============ EVENT TYPES ============

export type EventType = 
  | 'task_start'
  | 'task_complete'
  | 'task_error'
  | 'message_sent'
  | 'message_received'
  | 'worker_start'
  | 'worker_stop'
  | 'memory_index'
  | 'agent_register'
  | 'agent_unregister';

export interface SystemEvent {
  type: EventType;
  agentId?: string;
  workerId?: string;
  timestamp: string;
  payload: any;
  level: 'info' | 'success' | 'warning' | 'error';
}

// ============ WEBSOCKET TYPES ============

export interface WSMessage {
  type: 'agent_update' | 'worker_update' | 'metrics_update' | 'log' | 'event';
  payload: any;
  timestamp: string;
}

// ============ DASHBOARD TYPES ============

export interface DashboardConfig {
  refreshInterval: number; // milliseconds
  theme: 'light' | 'dark' | 'system';
  showNotifications: boolean;
  soundEnabled: boolean;
}

export interface DashboardState {
  agents: Map<string, Agent>;
  workers: Map<string, Worker>;
  skills: Map<string, Skill>;
  memory: MemoryStatus;
  metrics: SystemMetrics;
  events: SystemEvent[];
  isConnected: boolean;
}

// ============ UI HELPER TYPES ============

export type StatusColor = 'green' | 'yellow' | 'red' | 'gray' | 'blue';

export const STATUS_COLORS: Record<string, StatusColor> = {
  active: 'green',
  running: 'green',
  idle: 'gray',
  busy: 'yellow',
  error: 'red',
  offline: 'gray',
  queued: 'blue',
  completed: 'green',
  failed: 'red'
};

export const STATUS_LABELS: Record<string, string> = {
  active: '🟢 Active',
  running: '🟢 Running',
  idle: '⚪ Idle',
  busy: '🟡 Busy',
  error: '🔴 Error',
  offline: '⚫ Offline',
  queued: '🔵 Queued',
  completed: '✅ Completed',
  failed: '❌ Failed'
};
