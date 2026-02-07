'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassComponents';
import { GlassBadge } from '@/components/ui/GlassComponents';
import { GlassProgress } from '@/components/ui/GlassComponents';
import { GlassModal } from '@/components/ui/GlassComponents';
import { GlassTerminal } from '@/components/ui/GlassComponents';
import type { Worker, WorkerStatus } from '@/lib/types';

// Datos de workers hardcodeados
const INITIAL_WORKERS: Worker[] = [
  {
    id: 'web-architect',
    name: 'web-architect',
    category: 'development',
    status: 'running',
    project: 'blindfold-v3',
    taskId: 'task_8f2k',
    progress: 45,
    description: 'Building frontend components',
    startedAt: new Date(Date.now() - 300000).toISOString(),
    subAgents: ['coder', 'liquid-glass']
  },
  {
    id: 'backend-architect',
    name: 'backend-architect',
    category: 'development',
    status: 'idle'
  },
  {
    id: 'ai-ml-engineer',
    name: 'ai-ml-engineer',
    category: 'ai',
    status: 'idle'
  },
  {
    id: 'mobile-developer',
    name: 'mobile-developer',
    category: 'development',
    status: 'idle'
  },
  {
    id: 'devops-eng',
    name: 'devops-eng',
    category: 'tool',
    status: 'running',
    project: 'deployment-v3',
    taskId: 'task_9a3m',
    progress: 70,
    description: 'Deploying to Vercel',
    startedAt: new Date(Date.now() - 600000).toISOString(),
    subAgents: []
  },
  {
    id: 'security-architect',
    name: 'security-architect',
    category: 'specialized',
    status: 'idle'
  },
  {
    id: 'data-engineer',
    name: 'data-engineer',
    category: 'tool',
    status: 'idle'
  },
  {
    id: 'ui-ux-designer',
    name: 'ui-ux-designer',
    category: 'design',
    status: 'running',
    project: 'blindfold-v3',
    taskId: 'task_7b1n',
    progress: 30,
    description: 'Designing dashboard layout',
    startedAt: new Date(Date.now() - 200000).toISOString(),
    subAgents: ['liquid-glass']
  },
  {
    id: 'technical-writer',
    name: 'technical-writer',
    category: 'tool',
    status: 'idle'
  },
  {
    id: 'seo-specialist',
    name: 'seo-specialist',
    category: 'tool',
    status: 'idle'
  },
  {
    id: 'browser-automation',
    name: 'browser-automation',
    category: 'tool',
    status: 'running',
    project: 'research-v3',
    taskId: 'task_4e8r',
    progress: 85,
    description: 'Scraping competitor data',
    startedAt: new Date(Date.now() - 500000).toISOString(),
    subAgents: ['researcher']
  },
  {
    id: 'document-suite',
    name: 'document-suite',
    category: 'tool',
    status: 'idle'
  },
  {
    id: 'web-search',
    name: 'web-search',
    category: 'tool',
    status: 'idle'
  },
  {
    id: 'web-testing',
    name: 'web-testing',
    category: 'tool',
    status: 'idle'
  },
  {
    id: 'code-review',
    name: 'code-review',
    category: 'tool',
    status: 'idle'
  },
  {
    id: 'remotion',
    name: 'remotion',
    category: 'ai',
    status: 'idle'
  },
  {
    id: 'find-skills',
    name: 'find-skills',
    category: 'tool',
    status: 'idle'
  },
  {
    id: 'vercel-react',
    name: 'vercel-react',
    category: 'development',
    status: 'idle'
  },
  {
    id: 'python-optimization',
    name: 'python-optimization',
    category: 'development',
    status: 'idle'
  },
  {
    id: 'voice-cloning',
    name: 'voice-cloning',
    category: 'ai',
    status: 'idle'
  },
  {
    id: 'video-generation',
    name: 'video-generation',
    category: 'ai',
    status: 'idle'
  },
  {
    id: 'promaxui',
    name: 'promaxui ⭐',
    category: 'ai',
    status: 'running',
    project: 'blindfold-v3',
    taskId: 'task_6c4p',
    progress: 60,
    description: 'Creating Liquid Glass components',
    startedAt: new Date(Date.now() - 400000).toISOString(),
    subAgents: ['coder', 'liquid-glass', 'security'],
    starred: true
  },
  {
    id: 'liquid-glass',
    name: 'liquid-glass ⭐',
    category: 'ai',
    status: 'running',
    project: 'blindfold-v3',
    taskId: 'task_5d2q',
    progress: 20,
    description: 'Applying Apple preset to components',
    startedAt: new Date(Date.now() - 100000).toISOString(),
    subAgents: []
  }
];

// Worker Modal Component
interface WorkerDetailModalProps {
  worker: Worker | null;
  isOpen: boolean;
  onClose: () => void;
}

export function WorkerDetailModal({ worker, isOpen, onClose }: WorkerDetailModalProps) {
  if (!worker) return null;

  const logs = [
    { timestamp: '14:01:23', message: `[${worker.name}] Task started: ${worker.taskId}`, type: 'info' },
    { timestamp: '14:02:15', message: `Initializing ${worker.category} environment...`, type: 'info' },
    { timestamp: '14:03:42', message: `Progress: ${Math.floor((worker.progress ?? 0) / 4) * 25}%`, type: 'info' },
    { timestamp: '14:04:18', message: worker.description || 'Processing...', type: 'info' },
    { timestamp: '14:05:33', message: `Progress: ${worker.progress ?? 0}%`, type: 'success' },
  ];

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={`👷 Worker: ${worker.name}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Status and Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-4 rounded-xl">
            <div className="text-white/40 text-xs mb-1">Status</div>
            <GlassBadge status={worker.status === 'running' ? 'success' : worker.status === 'error' ? 'error' : 'default'}>
              {worker.status.toUpperCase()}
            </GlassBadge>
          </div>
          <div className="glass p-4 rounded-xl">
            <div className="text-white/40 text-xs mb-1">Project</div>
            <div className="text-white font-semibold">{worker.project || '-'}</div>
          </div>
          <div className="glass p-4 rounded-xl">
            <div className="text-white/40 text-xs mb-1">Task ID</div>
            <div className="text-white font-mono text-sm">{worker.taskId || '-'}</div>
          </div>
          <div className="glass p-4 rounded-xl">
            <div className="text-white/40 text-xs mb-1">Category</div>
            <div className="text-white capitalize">{worker.category}</div>
          </div>
        </div>

        {/* Progress */}
        {worker.status === 'running' && (
          <div className="glass p-4 rounded-xl">
            <div className="text-white/60 text-sm mb-2">Progress</div>
            <GlassProgress value={worker.progress ?? 0} color="blue" />
            <div className="text-right text-xs text-white/40 mt-1">{worker.progress ?? 0}%</div>
          </div>
        )}

        {/* Started */}
        {worker.startedAt && (
          <div className="glass p-4 rounded-xl">
            <div className="text-white/40 text-xs mb-1">Started</div>
            <div className="text-white">
              {new Date(worker.startedAt).toLocaleTimeString()} 
              <span className="text-white/40 ml-2">
                ({Math.floor((Date.now() - new Date(worker.startedAt).getTime()) / 60000)} min ago)
              </span>
            </div>
          </div>
        )}

        {/* Description */}
        {worker.description && (
          <div className="glass p-4 rounded-xl">
            <div className="text-white/40 text-xs mb-1">Description</div>
            <div className="text-white">{worker.description}</div>
          </div>
        )}

        {/* Sub-Agents */}
        {worker.subAgents && worker.subAgents.length > 0 && (
          <div className="glass p-4 rounded-xl">
            <div className="text-white/40 text-xs mb-2">Communicating with</div>
            <div className="flex flex-wrap gap-2">
              {worker.subAgents.map(agent => (
                <GlassBadge key={agent} status="info">
                  {agent}
                </GlassBadge>
              ))}
            </div>
          </div>
        )}

        {/* Logs */}
        <div>
          <div className="text-white/60 text-sm mb-2">Live Logs</div>
          <GlassTerminal logs={logs} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <button className="glass px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">
            ⏸️ Pausar
          </button>
          <button className="glass px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">
            ⏹️ Detener
          </button>
          <button className="glass px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">
            🔄 Reiniciar
          </button>
          <button className="glass px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">
            📄 Ver Logs
          </button>
        </div>
      </div>
    </GlassModal>
  );
}

// Worker Row Component
interface WorkerRowProps {
  worker: Worker;
  onClick: () => void;
}

function WorkerRow({ worker, onClick }: WorkerRowProps) {
  const statusIcons: Record<WorkerStatus, string> = {
    'running': '🟢',
    'idle': '⚪',
    'error': '🔴',
    'queued': '🔵'
  };

  return (
    <div
      onClick={onClick}
      className={`
        glass p-3 rounded-lg cursor-pointer transition-all
        hover:bg-white/10 hover:scale-[1.01]
        ${worker.starred ? 'ring-1 ring-yellow-400/30' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        {/* Status */}
        <span className="text-lg">{statusIcons[worker.status]}</span>
        
        {/* Name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white truncate">
              {worker.name}
            </span>
            {worker.starred && <span className="text-yellow-400">⭐</span>}
          </div>
        </div>

        {/* Project */}
        <div className="text-sm text-white/40 w-32 truncate">
          {worker.project || '-'}
        </div>

        {/* Task ID */}
        <div className="font-mono text-xs text-white/30 w-28 truncate">
          {worker.taskId || '-'}
        </div>

        {/* Progress */}
        <div className="w-32">
          {worker.status === 'running' ? (
            <GlassProgress value={worker.progress ?? 0} showLabel={false} color="blue" />
          ) : (
            <span className="text-xs text-white/30">-</span>
          )}
        </div>

        {/* Status Label */}
        <GlassBadge status={
          worker.status === 'running' ? 'success' :
          worker.status === 'error' ? 'error' : 'default'
        }>
          {worker.status}
        </GlassBadge>
      </div>
    </div>
  );
}

// Main Worker Monitor Component
export function WorkerMonitor() {
  const [workers] = useState(INITIAL_WORKERS);
  const [filter, setFilter] = useState<'all' | 'running' | 'idle' | 'error'>('all');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter workers
  const filteredWorkers = workers.filter(w => {
    const matchesFilter = filter === 'all' || w.status === filter;
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (w.project?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesFilter && matchesSearch;
  });

  // Stats
  const stats = {
    total: workers.length,
    running: workers.filter(w => w.status === 'running').length,
    idle: workers.filter(w => w.status === 'idle').length,
    error: workers.filter(w => w.status === 'error').length
  };

  return (
    <div className="space-y-4">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">👷 Workers Monitor</h2>
        <div className="flex gap-4 text-sm">
          <span className="text-white/60">Total: <span className="text-white font-semibold">{stats.total}</span></span>
          <span className="text-green-400">Running: <span className="text-white font-semibold">{stats.running}</span></span>
          <span className="text-white/40">Idle: <span className="text-white font-semibold">{stats.idle}</span></span>
          <span className="text-red-400">Error: <span className="text-white font-semibold">{stats.error}</span></span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="🔍 Search workers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-glass flex-1 max-w-xs"
        />
        <div className="flex gap-1 glass rounded-lg p-1">
          {(['all', 'running', 'idle', 'error'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-3 py-1.5 rounded-md text-sm transition-colors capitalize
                ${filter === f ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'}
              `}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Workers List */}
      <div className="space-y-2">
        {filteredWorkers.map((worker) => (
          <WorkerRow
            key={worker.id}
            worker={worker}
            onClick={() => setSelectedWorker(worker)}
          />
        ))}
      </div>

      {/* Modal */}
      <WorkerDetailModal
        worker={selectedWorker}
        isOpen={!!selectedWorker}
        onClose={() => setSelectedWorker(null)}
      />
    </div>
  );
}

// Compact Worker Status for Dashboard
export function WorkerStatusCompact() {
  const [workers] = useState(INITIAL_WORKERS);
  
  const runningWorkers = workers.filter(w => w.status === 'running').slice(0, 4);
  const idleWorkers = workers.filter(w => w.status === 'idle').length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/60">Workers</span>
        <span className="text-white/40">{workers.length} total</span>
      </div>
      
      {runningWorkers.map((w) => (
        <div key={w.id} className="flex items-center gap-2">
          <span className="text-green-400">●</span>
          <span className="text-sm text-white flex-1 truncate">{w.name}</span>
          <span className="text-xs text-white/40">{w.progress}%</span>
        </div>
      ))}
      
      {idleWorkers > 0 && (
        <div className="flex items-center gap-2 text-white/30">
          <span>●</span>
          <span className="text-sm">{idleWorkers} idle</span>
        </div>
      )}
    </div>
  );
}
