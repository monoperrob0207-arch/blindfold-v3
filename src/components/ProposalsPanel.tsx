'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useBlindfoldStore } from '@/lib/store';
import { Check, X, Clock, AlertTriangle, Lightbulb, User, Target, Zap } from 'lucide-react';

const priorityConfig = {
  low: { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/30', icon: Clock },
  medium: { color: 'text-neon-blue', bg: 'bg-neon-blue/10', border: 'border-neon-blue/30', icon: Zap },
  high: { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30', icon: AlertTriangle },
  critical: { color: 'text-neon-red', bg: 'bg-neon-red/10', border: 'border-neon-red/30', icon: AlertTriangle },
};

export function ProposalsPanel() {
  const { 
    proposals, 
    showProposalsPanel, 
    toggleProposalsPanel, 
    approveProposal,
    agents 
  } = useBlindfoldStore();

  const pendingProposals = proposals.filter(p => p.status === 'pending');

  const getAgentColor = (agentName: string) => {
    const agent = agents.find(a => a.name === agentName);
    return agent?.color || '#00d4ff';
  };

  return (
    <AnimatePresence>
      {showProposalsPanel && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleProposalsPanel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-onyx-950 border-l border-white/10 shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neon-blue/20 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-neon-blue" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Propuestas de Agentes</h2>
                    <p className="text-sm text-gray-400">Tareas esperando tu aprobación</p>
                  </div>
                </div>
                <button
                  onClick={toggleProposalsPanel}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              {/* Stats */}
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-blue/10 border border-neon-blue/20">
                  <Clock className="w-4 h-4 text-neon-blue" />
                  <span className="text-sm text-neon-blue">{pendingProposals.length} pendientes</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-red/10 border border-neon-red/20">
                  <AlertTriangle className="w-4 h-4 text-neon-red" />
                  <span className="text-sm text-neon-red">
                    {pendingProposals.filter(p => p.priority === 'critical').length} críticas
                  </span>
                </div>
              </div>
            </div>

            {/* Proposals List */}
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {pendingProposals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Check className="w-12 h-12 mb-3 text-green-400" />
                  <p className="text-lg font-medium">¡Todo al día!</p>
                  <p className="text-sm">No hay propuestas pendientes</p>
                </div>
              ) : (
                pendingProposals.map((proposal, index) => {
                  const config = priorityConfig[proposal.priority];
                  const Icon = config.icon;
                  const agentColor = getAgentColor(proposal.agent);

                  return (
                    <motion.div
                      key={proposal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-onyx-800/60 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all"
                    >
                      {/* Agent & Priority */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: agentColor + '20', borderLeft: `2px solid ${agentColor}` }}
                          >
                            <User className="w-4 h-4" style={{ color: agentColor }} />
                          </div>
                          <span className="text-sm font-medium" style={{ color: agentColor }}>
                            {proposal.agent}
                          </span>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${config.bg} border ${config.border}`}>
                          <Icon className={`w-3 h-3 ${config.color}`} />
                          <span className={`text-xs font-medium ${config.color}`}>
                            {proposal.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Task */}
                      <div className="mb-3">
                        <h3 className="text-white font-medium mb-1">{proposal.task}</h3>
                      </div>

                      {/* Reason & Expected Outcome */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2 text-sm text-gray-400">
                          <Target className="w-4 h-4 text-neon-blue mt-0.5 flex-shrink-0" />
                          <span>
                            <span className="text-neon-blue font-medium">¿Por qué?: </span>
                            {proposal.reason}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-gray-400">
                          <Zap className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>
                            <span className="text-green-400 font-medium">Esperado: </span>
                            {proposal.expectedOutcome}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t border-white/5">
                        <button
                          onClick={() => approveProposal(proposal.id, true)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-400/20 border border-green-400/30 text-green-400 hover:bg-green-400/30 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          <span>Aprobar</span>
                        </button>
                        <button
                          onClick={() => approveProposal(proposal.id, false)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-neon-red/20 border border-neon-red/30 text-neon-red hover:bg-neon-red/30 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Denegar</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
