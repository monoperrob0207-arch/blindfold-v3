'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useBlindfoldStore } from '@/lib/store';
import { X, CheckCircle2, Clock, Calendar, User, ArrowRight } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

export function TaskHistoryPanel() {
  const { 
    tasks, 
    showHistoryPanel, 
    toggleHistoryPanel,
    agents 
  } = useBlindfoldStore();

  const completedTasks = tasks.filter(t => t.status === 'completed');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');

  const getAgentColor = (agentName: string) => {
    const agent = agents.find(a => a.name === agentName);
    return agent?.color || '#00d4ff';
  };

  return (
    <AnimatePresence>
      {showHistoryPanel && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleHistoryPanel}
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
                  <div className="w-10 h-10 rounded-xl bg-green-400/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Historial de Tareas</h2>
                    <p className="text-sm text-gray-400">Todas las tareas completadas</p>
                  </div>
                </div>
                <button
                  onClick={toggleHistoryPanel}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-400/10 border border-green-400/20">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">{completedTasks.length} completadas</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-blue/10 border border-neon-blue/20">
                  <Clock className="w-4 h-4 text-neon-blue" />
                  <span className="text-sm text-neon-blue">{inProgressTasks.length} en progreso</span>
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-lg font-medium">Sin historial aún</p>
                  <p className="text-sm">Las tareas completadas aparecerán aquí</p>
                </div>
              ) : (
                [...inProgressTasks, ...completedTasks].map((task, index) => {
                  const agentColor = getAgentColor(task.agent);
                  const isCompleted = task.status === 'completed';

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`bg-onyx-800/60 border rounded-xl p-4 transition-all
                        ${isCompleted 
                          ? 'border-green-400/20' 
                          : 'border-neon-blue/20'
                        }`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: agentColor + '20', borderLeft: `2px solid ${agentColor}` }}
                          >
                            <User className="w-4 h-4" style={{ color: agentColor }} />
                          </div>
                          <div>
                            <span className="text-sm font-medium" style={{ color: agentColor }}>
                              {task.agent}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(task.startedAt || task.createdAt || new Date().toISOString()), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium
                          ${isCompleted 
                            ? 'bg-green-400/10 text-green-400' 
                            : 'bg-neon-blue/10 text-neon-blue'
                          }`}>
                          {isCompleted ? 'Completada' : 'En progreso'}
                        </div>
                      </div>

                      {/* Task */}
                      <h3 className="text-white font-medium mb-2">{task.task}</h3>

                      {/* Reason */}
                      <p className="text-sm text-gray-400 mb-3">{task.reason}</p>

                      {/* Expected Outcome */}
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                        <span className="text-neon-blue">Esperado:</span>
                        <span>{task.expectedOutcome}</span>
                      </div>

                      {/* Result (if completed) */}
                      {isCompleted && task.result && (
                        <div className="pt-3 border-t border-white/5">
                          <div className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-green-400 font-medium">Resultado: </span>
                              <span className="text-gray-300">{task.result}</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            Completada {formatDistanceToNow(new Date(task.completedAt || ''), { addSuffix: true })}
                          </div>
                        </div>
                      )}

                      {/* Progress bar for in-progress */}
                      {!isCompleted && (
                        <div className="pt-3 border-t border-white/5">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progreso</span>
                            <span>75%</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: '75%' }}
                              transition={{ duration: 0.5 }}
                              className="h-full bg-neon-blue"
                            />
                          </div>
                        </div>
                      )}
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
