'use client';

import { create } from 'zustand';
import { Agent, Proposal, Task, AgentCommunication, SystemStats } from '@/lib/types';

interface BlindfoldStore {
  // Agents
  agents: Agent[];
  setAgents: (agents: Agent[]) => void;
  selectedAgent: string | null;
  selectAgent: (id: string | null) => void;
  
  // Proposals
  proposals: Proposal[];
  setProposals: (proposals: Proposal[]) => void;
  pendingProposals: () => Proposal[];
  approvedProposals: () => Proposal[];
  
  // Tasks
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  activeTasks: () => Task[];
  completedTasks: () => Task[];
  
  // Communication
  communication: AgentCommunication | null;
  setCommunication: (comm: AgentCommunication | null) => void;
  
  // UI State
  showProposalsPanel: boolean;
  toggleProposalsPanel: () => void;
  showHistoryPanel: boolean;
  toggleHistoryPanel: () => void;
  
  // Stats
  stats: SystemStats;
  setStats: (stats: SystemStats) => void;
  
  // Actions
  approveProposal: (id: string, approved: boolean) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
}

export const useBlindfoldStore = create<BlindfoldStore>((set, get) => ({
  // Agents
  agents: [],
  setAgents: (agents) => set({ agents }),
  selectedAgent: null,
  selectAgent: (id) => set({ selectedAgent: id }),
  
  // Proposals
  proposals: [],
  setProposals: (proposals) => set({ proposals }),
  pendingProposals: () => get().proposals.filter(p => p.status === 'pending'),
  approvedProposals: () => get().proposals.filter(p => p.status === 'approved'),
  
  // Tasks
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  activeTasks: () => get().tasks.filter(t => t.status === 'in_progress'),
  completedTasks: () => get().tasks.filter(t => t.status === 'completed'),
  
  // Communication
  communication: null,
  setCommunication: (comm) => set({ communication: comm }),
  
  // UI State
  showProposalsPanel: false,
  toggleProposalsPanel: () => set(state => ({ showProposalsPanel: !state.showProposalsPanel })),
  showHistoryPanel: false,
  toggleHistoryPanel: () => set(state => ({ showHistoryPanel: !state.showHistoryPanel })),
  
  // Stats
  stats: {
    totalAgents: 0,
    activeAgents: 0,
    pendingProposals: 0,
    completedTasks: 0,
    successRate: 0,
    uptime: '0h'
  },
  setStats: (stats) => set({ stats }),
  
  // Actions
  approveProposal: (id, approved) => {
    set(state => ({
      proposals: state.proposals.map(p => 
        p.id === id 
          ? { ...p, status: approved ? 'approved' : 'rejected', approvedAt: new Date().toISOString() }
          : p
      )
    }));
  },
  
  addTask: (task) => {
    set(state => ({ tasks: [task, ...state.tasks] }));
  },
  
  updateTask: (id, updates) => {
    set(state => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  }
}));
