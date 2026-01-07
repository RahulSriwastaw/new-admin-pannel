import React, { useEffect, useRef } from 'react';
import { LogEntry, LogLevel } from '../types';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalProps {
  logs: LogEntry[];
  title?: string;
  className?: string;
}

export const Terminal: React.FC<TerminalProps> = ({ logs, title = "System Output", className = "" }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.INFO: return 'text-blue-400';
      case LogLevel.WARN: return 'text-yellow-400';
      case LogLevel.ERROR: return 'text-red-500';
      case LogLevel.SUCCESS: return 'text-green-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className={`flex flex-col bg-gray-950 rounded-lg border border-gray-800 shadow-2xl overflow-hidden font-mono text-sm ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2 text-gray-400">
          <TerminalIcon size={16} />
          <span className="font-medium text-xs uppercase tracking-wider">{title}</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto max-h-[400px] scrollbar-hide">
        {logs.map((log) => (
          <div key={log.id} className="mb-1 font-mono break-all hover:bg-white/5 p-0.5 rounded">
            <span className="text-gray-600 mr-2">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
            <span className={`font-bold mr-2 w-16 inline-block ${getColor(log.level)}`}>{log.level}</span>
            <span className="text-purple-400 mr-2">[{log.source}]</span>
            <span className="text-gray-300">{log.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};