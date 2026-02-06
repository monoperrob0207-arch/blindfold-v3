'use client';

import { motion } from 'framer-motion';
import { useBlindfoldStore } from '@/lib/store';
import { Terminal, Zap, Users, MessageSquare, Lightbulb, ArrowRight } from 'lucide-react';

const statusConfig = {
  active: { color: 'bg-neon-blue', label: 'Activo', glow: 'shadow-neon-blue' },
  idle: { color: 'bg-gray-500', label: 'Inactivo', glow: 'shadow-gray-500' },
  thinking: { color: 'bg-purple-500', label: 'Pensando', glow: 'shadow-purple-500' },
  collaborating: { color: 'bg-green-500', label: 'Colaborando', glow: 'shadow-green-500' },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bot: Terminal,
  Terminal: Terminal,
  Layout: Terminal,
  Server: Terminal,
  Database: Terminal,
  Settings: Terminal,
  Shield: Terminal,
  Search: Terminal,
};

interface AgentCardProps {
  agent: any;
  index: number;
}

export function AgentCard({ agent, index }: AgentCardProps) {
  const { selectAgent, selectedAgent, showProposalsPanel, toggleProposalsPanel } = useBlindfoldStore();
  const status = statusConfig[agent.status as keyof typeof statusConfig] || statusConfig.idle;
  const Icon = iconMap[agent.icon] || Terminal;
  const isSelected = selectedAgent === agent.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => selectAgent(isSelected ? null : agent.id)}
      className={`relative overflow-hidden rounded-xl bg-onyx-800/60 border backdrop-blur-sm p-5 cursor-pointer
                 transition-all duration-300 card-hover
                 ${isSelected ? 'border-neon-blue/50' : 'border-white/5'}`}
    >
      {/* Status indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${status.color} relative`}>
          {(agent.status === 'active' || agent.status === 'thinking' || agent.status === 'collaborating') && (
            <span className={`absolute inset-0 rounded-full animate-ping ${status.color} opacity-75`} />
          )}
        </div>
        <span className="text-xs text-gray-400">{status.label}</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          whileHover={{ rotate: 10 }}
          className={`w-12 h-12 rounded-lg flex items-center justify-center
                     bg-gradient-to-br from-white/5 to-white/0 border border-white/10`}
          style={{ borderLeft: `3px solid ${agent.color}` }}
        >
          <div style={{ color: agent.color }}>
            <Icon className="w-6 h-6" />
          </div>
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
          <p className="text-sm text-gray-400">{agent.role}</p>
        </div>
      </div>

      {/* Capabilities */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {agent.capabilities?.slice(0, 3).map((cap: string) => (
            <span 
              key={cap}
              className="px-2 py-0.5 rounded text-xs bg-white/5 text-gray-400"
            >
              {cap}
            </span>
          ))}
          {agent.capabilities?.length > 3 && (
            <span className="px-2 py-0.5 rounded text-xs bg-white/5 text-neon-blue">
              +{agent.capabilities.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Current Activity */}
      {agent.status === 'thinking' && (
        <div className="mb-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <div className="flex items-center gap-2 text-purple-400 text-sm mb-1">
            <Lightbulb className="w-4 h-4" />
            <span className="font-medium">Pensando...</span>
          </div>
          <p className="text-sm text-gray-400">Analizando tareas pendientes</p>
        </div>
      )}

      {agent.status === 'collaborating' && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 text-green-400 text-sm mb-1">
            <Users className="w-4 h-4" />
            <span className="font-medium">Colaborando...</span>
          </div>
          <p className="text-sm text-gray-400">Working with other agents</p>
        </div>
      )}

      {/* Suggestion count */}
      {agent.suggestionCount > 0 && (
        <div 
          onClick={(e) => {
            e.stopPropagation();
            toggleProposalsPanel();
          }}
          className="mb-4 p-3 rounded-lg bg-neon-blue/10 border border-neon-blue/20 cursor-pointer hover:bg-neon-blue/20 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neon-blue text-sm">
              <MessageSquare className="w-4 h-4" />
              <span>{agent.suggestionCount} propuesta(s)</span>
            </div>
            <ArrowRight className="w-4 h-4 text-neon-blue" />
          </div>
        </div>
      )}

      {/* Last active */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Zap className="w-3 h-3" />
        <span>Último activo: {new Date(agent.lastActive).toLocaleTimeString()}</span>
      </div>
    </motion.div>
  );
}
