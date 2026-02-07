'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { SystemEvent, Agent, Worker, SystemMetrics } from '@/lib/types';

// ============ WEBSOCKET HOOK ============

interface UseWebSocketOptions {
  url?: string;
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: any | null;
  sendMessage: (message: any) => void;
  reconnect: () => void;
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'error';
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    url = 'ws://localhost:8000/ws',
    autoConnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setConnectionState('connecting');

    try {
      // En producción, esto sería un WebSocket real
      // wsRef.current = new WebSocket(url);
      
      // Simulación para demo
      setConnectionState('connected');
      setIsConnected(true);
      setReconnectAttempts(0);
    } catch (error) {
      setConnectionState('error');
      setIsConnected(false);
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    setIsConnected(false);
    setConnectionState('disconnected');
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const reconnect = useCallback(() => {
    setReconnectAttempts(0);
    connect();
  }, [connect]);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    reconnect,
    connectionState,
    reconnectAttempts
  };
}

// ============ REAL-TIME EVENTS HOOK ============

interface UseEventsOptions {
  maxEvents?: number;
}

export function useEvents(options: UseEventsOptions = {}) {
  const { maxEvents = 100 } = options;
  
  const [events, setEvents] = useState<SystemEvent[]>([]);

  const addEvent = useCallback((event: SystemEvent) => {
    setEvents(prev => [event, ...prev].slice(0, maxEvents));
  }, [maxEvents]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const getEventsByType = useCallback((type: SystemEvent['type']) => {
    return events.filter(e => e.type === type);
  }, [events]);

  return {
    events,
    addEvent,
    clearEvents,
    getEventsByType
  };
}

// ============ AGENT STATUS HOOK ============

export function useAgentStatus() {
  const [agents, setAgents] = useState<Map<string, Agent>>(new Map());
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const updateAgent = useCallback((agent: Agent) => {
    setAgents(prev => {
      const next = new Map(prev);
      next.set(agent.id, agent);
      return next;
    });
    setLastUpdate(new Date());
  }, []);

  const updateAgentStatus = useCallback((id: string, status: Agent['status']) => {
    setAgents(prev => {
      const agent = prev.get(id);
      if (agent) {
        const next = new Map(prev);
        next.set(id, { ...agent, status, lastActive: new Date().toISOString() });
        return next;
      }
      return prev;
    });
  }, []);

  const getAgent = useCallback((id: string) => {
    return agents.get(id);
  }, [agents]);

  const getActiveAgents = useCallback(() => {
    return Array.from(agents.values()).filter(a => a.status === 'active' || a.status === 'busy');
  }, [agents]);

  return {
    agents,
    updateAgent,
    updateAgentStatus,
    getAgent,
    getActiveAgents,
    lastUpdate
  };
}

// ============ WORKER STATUS HOOK ============

export function useWorkerStatus() {
  const [workers, setWorkers] = useState<Map<string, Worker>>(new Map());
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const updateWorker = useCallback((worker: Worker) => {
    setWorkers(prev => {
      const next = new Map(prev);
      next.set(worker.id, worker);
      return next;
    });
    setLastUpdate(new Date());
  }, []);

  const updateWorkerProgress = useCallback((id: string, progress: number) => {
    setWorkers(prev => {
      const worker = prev.get(id);
      if (worker) {
        const next = new Map(prev);
        next.set(id, { ...worker, progress });
        return next;
      }
      return prev;
    });
  }, []);

  const updateWorkerStatus = useCallback((id: string, status: Worker['status']) => {
    setWorkers(prev => {
      const worker = prev.get(id);
      if (worker) {
        const next = new Map(prev);
        next.set(id, { ...worker, status });
        return next;
      }
      return prev;
    });
  }, []);

  const getWorker = useCallback((id: string) => {
    return workers.get(id);
  }, [workers]);

  const getRunningWorkers = useCallback(() => {
    return Array.from(workers.values()).filter(w => w.status === 'running');
  }, [workers]);

  const getIdleWorkers = useCallback(() => {
    return Array.from(workers.values()).filter(w => w.status === 'idle');
  }, [workers]);

  return {
    workers,
    updateWorker,
    updateWorkerProgress,
    updateWorkerStatus,
    getWorker,
    getRunningWorkers,
    getIdleWorkers,
    lastUpdate
  };
}

// ============ METRICS HOOK ============

interface MetricsHistory {
  cpu: { timestamp: number; value: number }[];
  memory: { timestamp: number; value: number }[];
  requests: { timestamp: number; value: number }[];
  latency: { timestamp: number; value: number }[];
}

export function useMetrics(maxPoints: number = 60) {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: { in: 0, out: 0 },
    requestsPerSecond: 0,
    latency: 0,
    uptime: 0,
    errorsLastHour: 0
  });

  const [history, setHistory] = useState<MetricsHistory>({
    cpu: [],
    memory: [],
    requests: [],
    latency: []
  });

  const updateMetrics = useCallback((newMetrics: Partial<SystemMetrics>) => {
    setMetrics(prev => {
      const next = { ...prev, ...newMetrics };
      
      // Update history
      setHistory(prevHistory => {
        const now = Date.now();
        return {
          cpu: [...prevHistory.cpu.slice(-maxPoints + 1), { timestamp: now, value: next.cpu }],
          memory: [...prevHistory.memory.slice(-maxPoints + 1), { timestamp: now, value: next.memory }],
          requests: [...prevHistory.requests.slice(-maxPoints + 1), { timestamp: now, value: next.requestsPerSecond }],
          latency: [...prevHistory.latency.slice(-maxPoints + 1), { timestamp: now, value: next.latency }]
        };
      });
      
      return next;
    });
  }, [maxPoints]);

  const getAverage = useCallback((metric: keyof MetricsHistory) => {
    const points = history[metric];
    if (points.length === 0) return 0;
    return points.reduce((sum, p) => sum + p.value, 0) / points.length;
  }, [history]);

  const reset = useCallback(() => {
    setMetrics({
      cpu: 0,
      memory: 0,
      disk: 0,
      network: { in: 0, out: 0 },
      requestsPerSecond: 0,
      latency: 0,
      uptime: 0,
      errorsLastHour: 0
    });
    setHistory({
      cpu: [],
      memory: [],
      requests: [],
      latency: []
    });
  }, []);

  return {
    metrics,
    history,
    updateMetrics,
    getAverage,
    reset
  };
}

// ============ SIMULATION HOOK (for demo) ============

export function useSimulation() {
  const [isRunning, setIsRunning] = useState(true);

  const start = useCallback(() => setIsRunning(true), []);
  const stop = useCallback(() => setIsRunning(false), []);

  useEffect(() => {
    if (!isRunning) return;

    // Simulate agent communications
    const commInterval = setInterval(() => {
      const events = useEvents();
      events.addEvent({
        type: ['task_start', 'task_complete', 'message_sent', 'message_received'][Math.floor(Math.random() * 4)] as SystemEvent['type'],
        agentId: ['promaxui', 'coder', 'liquid-glass', 'security'][Math.floor(Math.random() * 4)],
        timestamp: new Date().toISOString(),
        payload: {},
        level: ['info', 'success'][Math.floor(Math.random() * 2)] as 'info' | 'success'
      });
    }, 3000);

    return () => clearInterval(commInterval);
  }, [isRunning]);

  return {
    isRunning,
    start,
    stop
  };
}

// ============ STORAGE HOOK ============

interface UseStorageOptions<T> {
  key: string;
  defaultValue: T;
  storageType?: 'local' | 'session';
}

export function useStorage<T>(options: UseStorageOptions<T>) {
  const { key, defaultValue, storageType = 'local' } = options;
  const storage = storageType === 'local' ? localStorage : sessionStorage;

  const [value, setValue] = useState<T>(() => {
    try {
      const stored = storage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const set = useCallback((newValue: T | ((prev: T) => T)) => {
    const nextValue = typeof newValue === 'function' 
      ? (newValue as (prev: T) => T)(value)
      : newValue;
    
    setValue(nextValue);
    storage.setItem(key, JSON.stringify(nextValue));
  }, [key, value, storage]);

  const remove = useCallback(() => {
    storage.removeItem(key);
    setValue(defaultValue);
  }, [key, defaultValue, storage]);

  return [value, set, remove] as const;
}
