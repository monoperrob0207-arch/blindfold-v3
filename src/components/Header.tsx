'use client';

import { motion } from 'framer-motion';
import { useBlindfoldStore } from '@/lib/store';
import { Settings } from 'lucide-react';

export function Header() {
  const { stats } = useBlindfoldStore();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-16 bg-onyx-950/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30"
    >
      {/* Stats Bar */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
          <span className="text-sm text-gray-400">System Online</span>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400">
            <span className="text-neon-blue font-semibold">{stats.activeAgents}</span>
            <span className="text-gray-500"> activos</span>
          </span>
          <span className="text-gray-400">
            <span className="text-yellow-400 font-semibold">{stats.pendingProposals}</span>
            <span className="text-gray-500"> pendientes</span>
          </span>
          <span className="text-gray-400">
            <span className="text-green-400 font-semibold">{stats.completedTasks}</span>
            <span className="text-gray-500"> completadas</span>
          </span>
          <span className="text-gray-400">
            <span className="text-neon-white font-semibold">{stats.successRate}%</span>
            <span className="text-gray-500"> éxito</span>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <span className="hidden lg:block text-sm text-gray-500">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <Settings className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </motion.header>
  );
}
