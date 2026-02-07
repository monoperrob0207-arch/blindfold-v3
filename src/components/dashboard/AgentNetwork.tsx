'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GlassCard } from '@/components/ui/GlassComponents';
import { GlassBadge } from '@/components/ui/GlassComponents';
import { GlassProgress } from '@/components/ui/GlassComponents';
import { GlassStatus } from '@/components/ui/GlassComponents';
import type { Agent, AgentCommunication } from '@/lib/types';

// Datos de agentes hardcodeados (luego vendrán del backend)
const INITIAL_AGENTS: Agent[] = [
  {
    id: 'promaxui',
    name: 'ProMaxUI',
    role: 'Ultra AI Development Agent',
    status: 'active',
    description: 'Multi-LLM orchestration, workflows visuales, UI/UX design',
    tools: ['promaxui_cli', 'superui_design', 'workflow_builder', 'component_gen'],
    currentTask: 'Creating dashboard components',
    project: 'blindfold-v3',
    lastActive: new Date().toISOString(),
    starred: true,
    metrics: { tasksCompleted: 12, tasksInProgress: 2, avgResponseTime: 450, successRate: 98 }
  },
  {
    id: 'liquid-glass',
    name: 'LiquidGlass ⭐',
    role: 'Liquid Glass Effects Specialist',
    status: 'active',
    description: 'Apple-style liquid glass effects, WebGL shaders, liquidGL integration',
    tools: ['css_glass', 'react_glass', 'webgl_glass', 'liquidgl_lib'],
    currentTask: 'Applying Apple preset to GlassCard',
    project: 'blindfold-v3',
    lastActive: new Date().toISOString(),
    starred: true,
    metrics: { tasksCompleted: 8, tasksInProgress: 1, avgResponseTime: 320, successRate: 100 }
  },
  {
    id: 'coder',
    name: 'Coder',
    role: 'Code Generation Agent',
    status: 'active',
    description: 'Genera código en múltiples lenguajes',
    tools: ['code_generate', 'refactor', 'debug'],
    currentTask: 'Generating React components',
    project: 'blindfold-v3',
    lastActive: new Date().toISOString(),
    metrics: { tasksCompleted: 45, tasksInProgress: 3, avgResponseTime: 280, successRate: 96 }
  },
  {
    id: 'security',
    name: 'Security',
    role: 'Security Auditor',
    status: 'idle',
    description: 'Revisión de seguridad de código',
    tools: ['security_audit', 'vulnerability_scan'],
    lastActive: new Date(Date.now() - 3600000).toISOString(),
    metrics: { tasksCompleted: 23, tasksInProgress: 0, avgResponseTime: 890, successRate: 99 }
  },
  {
    id: 'researcher',
    name: 'Researcher',
    role: 'Research Agent',
    status: 'busy',
    description: 'Investigación y búsqueda de información',
    tools: ['web_search', 'content_fetch'],
    currentTask: 'Researching React 19 features',
    lastActive: new Date().toISOString(),
    metrics: { tasksCompleted: 67, tasksInProgress: 2, avgResponseTime: 1200, successRate: 94 }
  },
  {
    id: 'analyst',
    name: 'Analyst',
    role: 'Data Analysis Agent',
    status: 'idle',
    description: 'Análisis de datos y métricas',
    tools: ['data_analysis', 'kpi_calculation'],
    lastActive: new Date(Date.now() - 7200000).toISOString(),
    metrics: { tasksCompleted: 34, tasksInProgress: 0, avgResponseTime: 650, successRate: 97 }
  }
];

const INITIAL_COMMUNICATIONS: AgentCommunication[] = [
  { fromAgent: 'promaxui', toAgent: 'coder', messageType: 'task', timestamp: new Date().toISOString(), direction: '→' },
  { fromAgent: 'coder', toAgent: 'liquid-glass', messageType: 'result', timestamp: new Date().toISOString(), direction: '→' },
  { fromAgent: 'liquid-glass', toAgent: 'promaxui', messageType: 'complete', timestamp: new Date().toISOString(), direction: '←' },
  { fromAgent: 'promaxui', toAgent: 'security', messageType: 'review', timestamp: new Date().toISOString(), direction: '→' },
];

interface AgentNetworkProps {
  agents?: Agent[];
  communications?: AgentCommunication[];
}

export function AgentNetwork({ 
  agents = INITIAL_AGENTS, 
  communications = INITIAL_COMMUNICATIONS 
}: AgentNetworkProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [animatedComms, setAnimatedComms] = useState<AgentCommunication[]>([]);

  // Simular comunicaciones en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      const randomComm: AgentCommunication = {
        fromAgent: agents[Math.floor(Math.random() * agents.length)].id,
        toAgent: agents[Math.floor(Math.random() * agents.length)].id,
        messageType: ['task', 'result', 'complete', 'review'][Math.floor(Math.random() * 4)],
        timestamp: new Date().toISOString(),
        direction: Math.random() > 0.5 ? '→' : '↔'
      };
      setAnimatedComms(prev => [...prev.slice(-10), randomComm]);
    }, 3000);

    return () => clearInterval(interval);
  }, [agents]);

  const getAgentPosition = (id: string) => {
    const positions: Record<string, { x: number; y: number }> = {
      'promaxui': { x: 50, y: 15 },
      'coder': { x: 25, y: 45 },
      'liquid-glass': { x: 75, y: 45 },
      'security': { x: 25, y: 75 },
      'researcher': { x: 50, y: 60 },
      'analyst': { x: 75, y: 75 }
    };
    return positions[id] || { x: 50, y: 50 };
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': '#10b981',
      'running': '#10b981',
      'idle': '#6b7280',
      'busy': '#f59e0b',
      'error': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="relative w-full h-96">
      {/* SVG Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Connection lines between agents */}
        {communications.map((comm, index) => {
          const from = getAgentPosition(comm.fromAgent);
          const to = getAgentPosition(comm.toAgent);
          return (
            <line
              key={index}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke="rgba(0, 212, 255, 0.3)"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
          );
        })}
        
        {/* Animated dots on lines */}
        {animatedComms.map((comm, index) => {
          const from = getAgentPosition(comm.fromAgent);
          const to = getAgentPosition(comm.toAgent);
          return (
            <circle
              key={`anim-${index}`}
              r="4"
              fill="#00d4ff"
              className="animate-ping"
            >
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                path={`M${from.x},${from.y} L${to.x},${to.y}`}
              />
            </circle>
          );
        })}
      </svg>

      {/* Agent Nodes */}
      {agents.map((agent) => {
        const pos = getAgentPosition(agent.id);
        const isSelected = selectedAgent === agent.id;
        
        return (
          <div
            key={agent.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            onClick={() => setSelectedAgent(isSelected ? null : agent.id)}
          >
            <GlassCard
              preset={agent.status === 'active' || agent.status === 'busy' ? 'apple' : 'default'}
              interactive={true}
              className={`
                ${isSelected ? 'ring-2 ring-cyan-400 scale-110 z-10' : ''}
                min-w-[160px] p-3
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: getStatusColor(agent.status) }}
                />
                <span className="text-xs font-medium text-white/60">
                  {agent.metrics?.tasksCompleted ?? 0} tasks
                </span>
              </div>
              
              <div className="font-semibold text-white text-sm">
                {agent.name}
              </div>
              
              <div className="text-xs text-white/50 mt-1">
                {agent.role}
              </div>

              {agent.starred && (
                <div className="absolute -top-1 -right-1 text-yellow-400">
                  ⭐
                </div>
              )}
            </GlassCard>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-2 right-2 glass p-2 rounded-lg text-xs">
        <div className="flex items-center gap-4 text-white/60">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400" /> Active
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400" /> Busy
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-400" /> Idle
          </span>
        </div>
      </div>
    </div>
  );
}

// ============ AGENT CARD COMPONENT ============

interface AgentCardProps {
  agent: Agent;
  onClick?: () => void;
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
  const statusColors: Record<string, 'success' | 'default' | 'warning' | 'error'> = {
    active: 'success',
    idle: 'default',
    busy: 'warning',
    error: 'error',
    offline: 'default'
  };

  return (
    <GlassCard
      preset={agent.status === 'active' ? 'apple' : 'default'}
      interactive={true}
      onClick={onClick}
      className="p-4 hover:ring-2 hover:ring-cyan-400/50"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div 
            className={`w-3 h-3 rounded-full animate-pulse ${
              agent.status === 'active' ? 'bg-green-400' :
              agent.status === 'busy' ? 'bg-yellow-400' :
              agent.status === 'error' ? 'bg-red-400' : 'bg-gray-400'
            }`}
          />
          <span className="font-semibold text-white">{agent.name}</span>
          {agent.starred && <span className="text-yellow-400">⭐</span>}
        </div>
        <GlassBadge status={statusColors[agent.status]}>
          {agent.status.toUpperCase()}
        </GlassBadge>
      </div>

      <p className="text-xs text-white/60 mb-3">{agent.role}</p>

      {agent.currentTask && (
        <div className="mb-3">
          <div className="text-xs text-white/40 mb-1">Current Task</div>
          <div className="text-xs text-white/80">{agent.currentTask}</div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="glass-content">
          <div className="text-white/40">Completed</div>
          <div className="text-white font-semibold">{agent.metrics?.tasksCompleted ?? 0}</div>
        </div>
        <div className="glass-content">
          <div className="text-white/40">Success Rate</div>
          <div className="text-white font-semibold">{agent.metrics?.successRate ?? 0}%</div>
        </div>
      </div>
    </GlassCard>
  );
}

// ============ AGENTS GRID COMPONENT ============

export function AgentsGrid() {
  const [agents] = useState(INITIAL_AGENTS);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
