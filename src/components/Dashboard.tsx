'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { useBlindfoldStore } from '@/lib/store';
import { AgentCard } from './AgentCard';
import { ProposalsPanel } from './ProposalsPanel';
import { TaskHistoryPanel } from './TaskHistoryPanel';
import { Users, Zap, RefreshCw, Play, Lightbulb, Calendar, MessageSquare } from 'lucide-react';

interface DashboardProps {
  initialAgents?: any[];
}

export function Dashboard({ initialAgents = [] }: DashboardProps) {
  const { 
    agents, setAgents,
    proposals, setProposals,
    tasks, setTasks,
    communication, setCommunication,
    stats, setStats,
    showProposalsPanel,
    toggleProposalsPanel,
    showHistoryPanel,
    toggleHistoryPanel,
    pendingProposals
  } = useBlindfoldStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [agentsRes, proposalsRes, tasksRes, commRes] = await Promise.all([
        fetch('/api/v3/agents'),
        fetch('/api/v3/proposals'),
        fetch('/api/v3/tasks'),
        fetch('/api/v3/communication'),
      ]);

      if (!agentsRes.ok) throw new Error('Failed to fetch agents');
      
      const agentsData = await agentsRes.json();
      const proposalsData = await proposalsRes.json();
      const tasksData = await tasksRes.json();
      const commData = await commRes.json();

      setAgents(agentsData.agents || []);
      setProposals(proposalsData.proposals || []);
      setTasks(tasksData.tasks || []);
      setCommunication(commData);
      setStats({
        totalAgents: agentsData.agents?.length || 0,
        activeAgents: agentsData.agents?.filter((a: any) => a.status !== 'idle').length || 0,
        pendingProposals: (proposalsData.proposals || []).filter((p: any) => p.status === 'pending').length,
        completedTasks: (tasksData.tasks || []).filter((t: any) => t.status === 'completed').length,
        successRate: 96,
        uptime: '2h 15m'
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [setAgents, setProposals, setTasks, setCommunication, setStats]);

  useEffect(() => {
    if (initialAgents.length > 0) {
      setAgents(initialAgents);
      setIsLoading(false);
    } else {
      fetchData();
    }
  }, [initialAgents, fetchData, setAgents]);

  useEffect(() => {
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const activeCount = agents.filter(a => a.status === 'active' || a.status === 'thinking' || a.status === 'collaborating').length;

  if (error && agents.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-neon-red">Error loading agents: {error}</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-neon-blue/20 border border-neon-blue/30 rounded-lg text-neon-blue hover:bg-neon-blue/30 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 lg:p-8"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Zap className="w-8 h-8 text-neon-blue" />
            Mission Control v3
          </h1>
          <p className="text-gray-400 mt-1">Agentes Proactivos con Sistema de Propuestas</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Proposals Button */}
          <button
            onClick={toggleProposalsPanel}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border
              ${pendingProposals().length > 0 
                ? 'bg-neon-blue/20 border-neon-blue/30 text-neon-blue animate-pulse' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Propuestas</span>
            {pendingProposals().length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-xs bg-neon-blue text-black font-bold">
                {pendingProposals().length}
              </span>
            )}
          </button>

          {/* History Button */}
          <button
            onClick={toggleHistoryPanel}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:bg-white/10 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Historial</span>
          </button>

          {/* Refresh */}
          <button
            onClick={fetchData}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-5 gap-3 mb-6"
      >
        <div className="text-center p-4 rounded-xl bg-onyx-800/40 border border-white/5 backdrop-blur-sm">
          <p className="text-2xl font-bold text-neon-blue">{stats.totalAgents}</p>
          <p className="text-xs text-gray-400 mt-1">Total Agentes</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-onyx-800/40 border border-white/5 backdrop-blur-sm">
          <p className="text-2xl font-bold text-neon-blue">{activeCount}</p>
          <p className="text-xs text-gray-400 mt-1">Activos</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-onyx-800/40 border border-white/5 backdrop-blur-sm">
          <p className="text-2xl font-bold text-yellow-400">{stats.pendingProposals}</p>
          <p className="text-xs text-gray-400 mt-1">Pendientes</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-onyx-800/40 border border-white/5 backdrop-blur-sm">
          <p className="text-2xl font-bold text-green-400">{stats.completedTasks}</p>
          <p className="text-xs text-gray-400 mt-1">Completadas</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-onyx-800/40 border border-white/5 backdrop-blur-sm">
          <p className="text-2xl font-bold text-neon-blue">{stats.successRate}%</p>
          <p className="text-xs text-gray-400 mt-1">Éxito</p>
        </div>
      </motion.div>

      {/* Agents Grid */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-neon-blue" />
          <h2 className="text-lg font-semibold text-white">Agentes Activos</h2>
          <span className="px-2 py-0.5 rounded-full text-xs bg-neon-blue/20 text-neon-blue border border-neon-blue/30">
            {activeCount} Activos
          </span>
        </div>

        {isLoading && agents.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="p-5 rounded-xl bg-onyx-800/60 border border-white/5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-white/5 shimmer" />
                  <div className="space-y-2">
                    <div className="w-24 h-4 rounded bg-white/5 shimmer" />
                    <div className="w-32 h-3 rounded bg-white/5 shimmer" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-3 rounded bg-white/5 shimmer" />
                  <div className="w-2/3 h-3 rounded bg-white/5 shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent, index) => (
              <AgentCard key={agent.id} agent={agent} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Panels */}
      <ProposalsPanel />
      <TaskHistoryPanel />
    </motion.div>
  );
}
