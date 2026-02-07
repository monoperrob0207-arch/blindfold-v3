'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GlassCard } from '@/components/ui/GlassComponents';

// Log entry type
export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error' | 'debug';
  message: string;
  source?: string;
  details?: any;
}

interface LiveTerminalProps {
  maxEntries?: number;
  autoScroll?: boolean;
  showTimestamp?: boolean;
  showLevel?: boolean;
  sources?: string[];
  onLogClick?: (log: LogEntry) => void;
}

// Predefined log patterns for simulation
const LOG_PATTERNS = [
  { level: 'info', prefix: '🔌', messages: [
    'ProMaxUI → Coder: "Create React component"',
    'Coder → LiquidGlass: "Apply Apple preset"',
    'LiquidGlass → ProMaxUI: "Component complete"',
    'Security Agent: "Reviewing generated code"',
    'Orchestrator: "Task assigned to worker"',
  ]},
  { level: 'success', prefix: '✅', messages: [
    'Task completed successfully',
    'Code review passed',
    'Deployment successful',
    'Memory indexed: 3 new chunks',
    'Agent registered: LiquidGlass',
  ]},
  { level: 'warning', prefix: '⚠️', messages: [
    'High memory usage detected',
    'Slow response time: 450ms',
    'Rate limit approaching',
    'Queue depth increasing',
  ]},
  { level: 'error', prefix: '❌', messages: [
    'Connection timeout',
    'Task failed: invalid response',
    'Agent disconnected: security-audit',
  ]},
  { level: 'debug', prefix: '🔧', messages: [
    'Initializing worker environment',
    'Loading configuration',
    'Parsing input parameters',
    'Compiling TypeScript types',
  ]},
];

export function LiveTerminal({
  maxEntries = 100,
  autoScroll = true,
  showTimestamp = true,
  showLevel = true,
  sources = ['all'],
  onLogClick
}: LiveTerminalProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'info' | 'success' | 'warning' | 'error'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Generate random log entry
  const generateLog = useCallback((): LogEntry => {
    const pattern = LOG_PATTERNS[Math.floor(Math.random() * LOG_PATTERNS.length)];
    const message = pattern.messages[Math.floor(Math.random() * pattern.messages.length)];
    const source = ['ProMaxUI', 'Coder', 'LiquidGlass', 'Security', 'Orchestrator', 'Memory', 'Worker'][Math.floor(Math.random() * 7)];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      level: pattern.level as LogEntry['level'],
      message,
      source,
    };
  }, []);

  // Add log entry
  const addLog = useCallback((entry: LogEntry) => {
    setLogs(prev => {
      const next = [entry, ...prev].slice(0, maxEntries);
      return next;
    });
  }, [maxEntries]);

  // Simulate live logs
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      addLog(generateLog());
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [isPaused, generateLog, addLog]);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && terminalRef.current && !isPaused) {
      terminalRef.current.scrollTop = 0;
    }
  }, [logs, autoScroll, isPaused]);

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.level === filter;
    const matchesSearch = searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = sources.includes('all') || sources.includes(log.source || '');
    
    return matchesFilter && matchesSearch && matchesSource;
  });

  const getLevelColor = (level: LogEntry['level']) => {
    const colors = {
      info: 'text-blue-400',
      success: 'text-green-400',
      warning: 'text-yellow-400',
      error: 'text-red-400',
      debug: 'text-gray-400'
    };
    return colors[level];
  };

  const getLevelIcon = (level: LogEntry['level']) => {
    const icons = {
      info: '🔵',
      success: '✅',
      warning: '⚠️',
      error: '🔴',
      debug: '🔧'
    };
    return icons[level];
  };

  const clearLogs = () => setLogs([]);
  const copyLogs = () => {
    const text = filteredLogs.map(log => 
      `${log.timestamp} [${log.level.toUpperCase()}] ${log.source || ''}: ${log.message}`
    ).join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-white">📝 Live Terminal</h3>
          <span className="text-xs text-white/40">{filteredLogs.length} entries</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Filter buttons */}
          <div className="flex gap-1 glass rounded-lg p-0.5">
            {(['all', 'info', 'success', 'warning', 'error'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`
                  px-2 py-0.5 rounded text-xs transition-colors
                  ${filter === f ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'}
                `}
              >
                {f === 'all' ? 'All' : getLevelIcon(f)}
              </button>
            ))}
          </div>

          {/* Pause/Resume */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`glass px-2 py-1 rounded text-xs ${isPaused ? 'text-yellow-400' : 'text-white/60'}`}
          >
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>

          {/* Clear */}
          <button
            onClick={clearLogs}
            className="glass px-2 py-1 rounded text-xs text-white/60 hover:text-white"
          >
            🗑️
          </button>

          {/* Copy */}
          <button
            onClick={copyLogs}
            className="glass px-2 py-1 rounded text-xs text-white/60 hover:text-white"
          >
            📋
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="🔍 Search logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-glass text-sm py-1.5"
        />
      </div>

      {/* Terminal */}
      <div
        ref={terminalRef}
        className="flex-1 glass glass-apple rounded-lg overflow-hidden font-mono text-xs"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border-b border-white/10">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
          </div>
          <span className="text-white/30 ml-2">bash — agent-logs</span>
        </div>

        {/* Logs */}
        <div className="p-3 max-h-80 overflow-y-auto space-y-1 scrollbar-thin">
          {filteredLogs.length === 0 ? (
            <div className="text-white/30 text-center py-8">
              No logs to display
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => onLogClick?.(log)}
                className={`
                  flex items-start gap-2 py-0.5 px-2 rounded
                  hover:bg-white/5 cursor-pointer
                  ${getLevelColor(log.level)}
                `}
              >
                {showTimestamp && (
                  <span className="text-white/30 shrink-0 text-xs font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                )}
                {showLevel && (
                  <span className="shrink-0">{getLevelIcon(log.level)}</span>
                )}
                {log.source && (
                  <span className="text-white/40 shrink-0 text-xs">
                    [{log.source}]
                  </span>
                )}
                <span className="break-all">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ============ COMPACT TERMINAL ============

export function LiveTerminalCompact({ maxEntries = 10 }: { maxEntries?: number }) {
  return (
    <GlassCard preset="default" className="p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/60">Recent Activity</span>
        <span className="text-xs text-white/30">Live</span>
      </div>
      <div className="space-y-1">
        {[
          { time: '14:06:23', icon: '🔌', text: 'ProMaxUI → Coder', color: 'text-blue-400' },
          { time: '14:06:21', icon: '✅', text: 'Task completed', color: 'text-green-400' },
          { time: '14:06:18', icon: '🔧', text: 'LiquidGlass: Apple preset', color: 'text-cyan-400' },
          { time: '14:06:15', icon: '🧠', text: 'Memory: 3 chunks indexed', color: 'text-purple-400' },
          { time: '14:06:10', icon: '⚡', text: 'Orchestrator: 2.3s', color: 'text-yellow-400' },
        ].map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <span className="text-white/30 w-16">{entry.time}</span>
            <span>{entry.icon}</span>
            <span className={entry.color}>{entry.text}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
