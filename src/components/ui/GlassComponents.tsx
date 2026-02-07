// 📦 Liquid Glass UI Components - Apple Style Design System

'use client';

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  preset?: 'default' | 'apple' | 'alien' | 'frost' | 'crystal' | 'blur';
  interactive?: boolean;
  onClick?: () => void;
}

const PRESETS = {
  default: {
    blur: 20,
    opacity: 0.1,
    border: 0.2,
    shadow: true,
  },
  apple: {
    blur: 12,
    opacity: 0.08,
    border: 0.15,
    shadow: true,
  },
  alien: {
    blur: 8,
    opacity: 0.15,
    border: 0.25,
    shadow: true,
  },
  frost: {
    blur: 40,
    opacity: 0.2,
    border: 0.1,
    shadow: true,
  },
  crystal: {
    blur: 4,
    opacity: 0.05,
    border: 0.3,
    shadow: true,
  },
  blur: {
    blur: 60,
    opacity: 0.3,
    border: 0.05,
    shadow: false,
  },
};

export function GlassCard({
  children,
  className = '',
  preset = 'default',
  interactive = false,
  onClick,
}: GlassCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const styles = PRESETS[preset];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const baseStyles = {
    '--glass-blur': `${styles.blur}px`,
    '--glass-opacity': styles.opacity,
    '--glass-border': styles.border,
  } as React.CSSProperties;

  return (
    <div
      className={`
        glass
        glass-${preset}
        ${interactive ? 'glass-interactive' : ''}
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={interactive ? handleMouseMove : undefined}
      style={{
        ...baseStyles,
        backdropFilter: `blur(${styles.blur}px)`,
        WebkitBackdropFilter: `blur(${styles.blur}px)`,
        background: `rgba(255, 255, 255, ${isHovered ? styles.opacity + 0.05 : styles.opacity})`,
        border: `1px solid rgba(255, 255, 255, ${styles.border})`,
        borderRadius: '16px',
        boxShadow: styles.shadow
          ? '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
          : 'none',
        transition: 'all 0.3s ease',
        transform: isHovered && interactive ? 'translateY(-4px)' : 'translateY(0)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {children}
    </div>
  );
}

// ============ GLASS BUTTON ============

interface GlassButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function GlassButton({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
}: GlassButtonProps) {
  const variants = {
    primary: 'bg-white/20 border-white/30 hover:bg-white/30',
    secondary: 'bg-white/10 border-white/20 hover:bg-white/20',
    ghost: 'bg-transparent border-transparent hover:bg-white/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`
        glass
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '12px',
        transition: 'all 0.2s ease',
      }}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

// ============ GLASS BADGE ============

interface GlassBadgeProps {
  children: React.ReactNode;
  status?: 'success' | 'warning' | 'error' | 'info' | 'default';
}

export function GlassBadge({ children, status = 'default' }: GlassBadgeProps) {
  const statuses = {
    success: 'bg-green-500/30 border-green-400/30 text-green-200',
    warning: 'bg-yellow-500/30 border-yellow-400/30 text-yellow-200',
    error: 'bg-red-500/30 border-red-400/30 text-red-200',
    info: 'bg-blue-500/30 border-blue-400/30 text-blue-200',
    default: 'bg-white/20 border-white/20 text-white/80',
  };

  return (
    <span
      className={`
        ${statuses[status]}
        px-2.5 py-0.5 rounded-full text-xs font-medium border
      `}
      style={{ backdropFilter: 'blur(8px)' }}
    >
      {children}
    </span>
  );
}

// ============ GLASS PROGRESS BAR ============

interface GlassProgressProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  color?: 'green' | 'blue' | 'yellow' | 'red';
}

export function GlassProgress({
  value,
  max = 100,
  showLabel = true,
  color = 'green',
}: GlassProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const colors = {
    green: 'from-green-400/50 to-green-600/30',
    blue: 'from-blue-400/50 to-blue-600/30',
    yellow: 'from-yellow-400/50 to-yellow-600/30',
    red: 'from-red-400/50 to-red-600/30',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1 text-xs text-white/60">
          <span>Progress</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div
        className="h-2 rounded-full overflow-hidden bg-white/10"
        style={{ backdropFilter: 'blur(4px)' }}
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colors[color]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ============ GLASS MODAL ============

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function GlassModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: GlassModalProps) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        style={{ backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div
        className={`
          glass glass-apple
          ${sizes[size]}
          w-full
          rounded-2xl
          shadow-2xl
          overflow-hidden
          animate-in fade-in zoom-in duration-200
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Body */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============ GLASS TERMINAL ============

interface GlassTerminalProps {
  logs: { timestamp: string; message: string; type?: string }[];
}

export function GlassTerminal({ logs }: GlassTerminalProps) {
  const terminalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-white/80';
    }
  };

  return (
    <div
      className="glass glass-apple rounded-lg overflow-hidden font-mono text-xs"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div className="px-3 py-2 bg-white/10 border-b border-white/10 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <div className="w-3 h-3 rounded-full bg-green-400/80" />
        </div>
        <span className="text-white/40 ml-2">terminal</span>
      </div>
      <div
        ref={terminalRef}
        className="p-3 max-h-64 overflow-y-auto space-y-1"
      >
        {logs.map((log, index) => (
          <div key={index} className="flex gap-2">
            <span className="text-white/30 shrink-0">{log.timestamp}</span>
            <span className={`${getTypeColor(log.type)} break-all`}>
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ GLASS STATUS INDICATOR ============

interface GlassStatusProps {
  status: 'online' | 'offline' | 'busy' | 'error';
  pulse?: boolean;
}

export function GlassStatus({ status, pulse = false }: GlassStatusProps) {
  const colors = {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    busy: 'bg-yellow-400',
    error: 'bg-red-400',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${pulse ? 'animate-pulse' : ''}`}>
        <div className={`w-2.5 h-2.5 rounded-full ${colors[status]}`} />
        {pulse && (
          <div className={`absolute inset-0 ${colors[status]} rounded-full animate-ping opacity-75`} />
        )}
      </div>
      <span className="text-xs text-white/60 capitalize">{status}</span>
    </div>
  );
}
