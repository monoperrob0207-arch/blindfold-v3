'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '@/components/ui/GlassComponents';
import { GlassProgress } from '@/components/ui/GlassComponents';

// Simulated real-time metrics
interface MetricPoint {
  timestamp: number;
  value: number;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  networkIn: number;
  networkOut: number;
  requestsPerSecond: number;
  latency: number;
  uptime: number;
}

const generateMetricHistory = (baseValue: number, variance: number, points: number = 30): MetricPoint[] => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    timestamp: now - (points - i) * 1000,
    value: Math.max(0, Math.min(100, baseValue + (Math.random() - 0.5) * variance))
  }));
};

export function LiveMetrics() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    disk: 34,
    networkIn: 1250,
    networkOut: 890,
    requestsPerSecond: 127,
    latency: 12.4,
    uptime: 86400
  });

  const [history, setHistory] = useState<{
    cpu: MetricPoint[];
    memory: MetricPoint[];
    requests: MetricPoint[];
  }>({
    cpu: generateMetricHistory(45, 20),
    memory: generateMetricHistory(62, 10),
    requests: generateMetricHistory(127, 50)
  });

  // Update metrics every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      
      setMetrics(prev => ({
        cpu: Math.max(10, Math.min(95, prev.cpu + (Math.random() - 0.5) * 15)),
        memory: Math.max(30, Math.min(90, prev.memory + (Math.random() - 0.5) * 5)),
        disk: prev.disk + 0.01,
        networkIn: Math.max(100, prev.networkIn + (Math.random() - 0.5) * 500),
        networkOut: Math.max(100, prev.networkOut + (Math.random() - 0.5) * 400),
        requestsPerSecond: Math.max(10, Math.min(200, prev.requestsPerSecond + (Math.random() - 0.5) * 30)),
        latency: Math.max(5, Math.min(50, prev.latency + (Math.random() - 0.5) * 5)),
        uptime: prev.uptime + 1
      }));

      setHistory(prev => ({
        cpu: [...prev.cpu.slice(-29), { timestamp: now, value: metrics.cpu }],
        memory: [...prev.memory.slice(-29), { timestamp: now, value: metrics.memory }],
        requests: [...prev.requests.slice(-29), { timestamp: now, value: metrics.requestsPerSecond }]
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [metrics]);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h ${mins}m`;
    return `${hours}h ${mins}m`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes.toFixed(0)} B/s`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB/s`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB/s`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">📊 Live Metrics</h2>

      {/* Uptime */}
      <GlassCard preset="apple" className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-sm">Uptime</span>
          <span className="text-2xl font-mono text-green-400">
            ⏱️ {formatUptime(metrics.uptime)}
          </span>
        </div>
      </GlassCard>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* CPU */}
        <GlassCard preset="default" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">CPU</span>
            <span className={`text-lg font-semibold ${
              metrics.cpu > 80 ? 'text-red-400' :
              metrics.cpu > 50 ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {metrics.cpu.toFixed(0)}%
            </span>
          </div>
          <SimpleBarChart data={history.cpu} color="#00d4ff" />
        </GlassCard>

        {/* Memory */}
        <GlassCard preset="default" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Memory</span>
            <span className={`text-lg font-semibold ${
              metrics.memory > 80 ? 'text-red-400' :
              metrics.memory > 50 ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {metrics.memory.toFixed(0)}%
            </span>
          </div>
          <SimpleBarChart data={history.memory} color="#10b981" />
        </GlassCard>

        {/* Network */}
        <GlassCard preset="default" className="p-4">
          <div className="text-white/60 text-sm mb-2">Network</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-400">↓ In</span>
              <span className="text-white">{formatBytes(metrics.networkIn)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-purple-400">↑ Out</span>
              <span className="text-white">{formatBytes(metrics.networkOut)}</span>
            </div>
          </div>
        </GlassCard>

        {/* Requests & Latency */}
        <GlassCard preset="default" className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-white/60 text-xs">Requests/s</div>
              <div className="text-xl font-semibold text-green-400">
                {metrics.requestsPerSecond.toFixed(1)}
              </div>
            </div>
            <div>
              <div className="text-white/60 text-xs">Latency</div>
              <div className="text-xl font-semibold text-yellow-400">
                {metrics.latency.toFixed(1)}ms
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Errors */}
      <GlassCard preset="apple" className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-sm">Errors (last hour)</span>
          <span className="text-green-400 font-semibold">0</span>
        </div>
      </GlassCard>
    </div>
  );
}

// Simple Bar Chart Component
function SimpleBarChart({ data, color }: { data: MetricPoint[]; color: string }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="h-12 flex items-end gap-0.5">
      {data.slice(-20).map((point, index) => (
        <div
          key={index}
          className="flex-1 rounded-t"
          style={{
            height: `${(point.value / maxValue) * 100}%`,
            backgroundColor: color,
            opacity: 0.6 + (index / 20) * 0.4,
            transition: 'height 0.3s ease'
          }}
        />
      ))}
    </div>
  );
}

// Compact Metrics for Dashboard Header
export function MetricsCompact() {
  const [metrics, setMetrics] = useState({
    cpu: 45,
    memory: 62,
    requests: 127,
    latency: 12.4
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(10, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(90, prev.memory + (Math.random() - 0.5) * 3)),
        requests: Math.max(50, Math.min(200, prev.requests + (Math.random() - 0.5) * 20)),
        latency: Math.max(5, Math.min(30, prev.latency + (Math.random() - 0.5) * 3))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 text-xs">
      <div className="flex items-center gap-1">
        <span className="text-white/40">CPU</span>
        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${metrics.cpu}%` }}
          />
        </div>
        <span className="text-white/60 w-8 text-right">{metrics.cpu.toFixed(0)}%</span>
      </div>
      
      <div className="flex items-center gap-1">
        <span className="text-white/40">MEM</span>
        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-400 rounded-full transition-all duration-500"
            style={{ width: `${metrics.memory}%` }}
          />
        </div>
        <span className="text-white/60 w-8 text-right">{metrics.memory.toFixed(0)}%</span>
      </div>
      
      <div className="flex items-center gap-1">
        <span className="text-white/40">RPS</span>
        <span className="text-white/60">{metrics.requests.toFixed(0)}</span>
      </div>
      
      <div className="flex items-center gap-1">
        <span className="text-white/40">LAT</span>
        <span className="text-white/60">{metrics.latency.toFixed(1)}ms</span>
      </div>
    </div>
  );
}

// Circular Progress Component
interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export function CircularProgress({ 
  value, 
  size = 80, 
  strokeWidth = 6,
  color = '#00d4ff',
  label 
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold text-white">{value.toFixed(0)}%</span>
        {label && <span className="text-xs text-white/40">{label}</span>}
      </div>
    </div>
  );
}
