'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard, Bell, Settings, Users, Activity } from 'lucide-react';
import { useBlindfoldStore } from '@/lib/store';

export function Sidebar() {
  const { toggleProposalsPanel, toggleHistoryPanel, stats } = useBlindfoldStore();

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-20 lg:w-64 h-screen flex flex-col bg-onyx-950/80 border-r border-white/5"
    >
      {/* Logo */}
      <div className="p-4 lg:p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-red to-neon-blue flex items-center justify-center shadow-lg neon-glow-blue">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-white"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div className="hidden lg:block">
            <h1 className="font-bold text-white text-lg">Blindfold</h1>
            <p className="text-xs text-gray-500">Mission Control v3</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 lg:p-4 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl bg-neon-blue/10 border border-neon-blue/30 text-neon-blue">
          <LayoutDashboard className="w-5 h-5" />
          <span className="hidden lg:block font-medium">Dashboard</span>
        </button>

        <button
          onClick={toggleProposalsPanel}
          className="w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        >
          <Users className="w-5 h-5" />
          <span className="hidden lg:block font-medium">Propuestas</span>
          {stats.pendingProposals > 0 && (
            <span className="hidden lg:flex ml-auto px-2 py-0.5 rounded-full text-xs bg-neon-blue text-black font-bold">
              {stats.pendingProposals}
            </span>
          )}
        </button>

        <button
          onClick={toggleHistoryPanel}
          className="w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        >
          <Activity className="w-5 h-5" />
          <span className="hidden lg:block font-medium">Historial</span>
        </button>

        <button className="w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
          <Bell className="w-5 h-5" />
          <span className="hidden lg:block font-medium">Notificaciones</span>
        </button>

        <button className="w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
          <Settings className="w-5 h-5" />
          <span className="hidden lg:block font-medium">Settings</span>
        </button>
      </nav>

      {/* System Status */}
      <div className="hidden lg:block p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/5 mt-4 mx-3 mb-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
          <span className="text-xs text-gray-400">System Status</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div>
            <p className="text-lg font-bold text-neon-blue">{stats.totalAgents}</p>
            <p className="text-xs text-gray-500">Agentes</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-400">{stats.completedTasks}</p>
            <p className="text-xs text-gray-500">Tareas</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
