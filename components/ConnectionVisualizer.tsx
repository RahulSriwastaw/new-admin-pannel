import React from 'react';
import { RepoConfig, ConnectionStatus } from '../types';
import { Server, LayoutDashboard, Database, ArrowRight, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface ConnectionVisualizerProps {
  repos: RepoConfig[];
  status: ConnectionStatus;
  onFix: () => void;
  isFixing: boolean;
}

export const ConnectionVisualizer: React.FC<ConnectionVisualizerProps> = ({ repos, status, onFix, isFixing }) => {
  const backend = repos.find(r => r.type === 'backend');
  const frontend = repos.find(r => r.type === 'frontend');

  const getStatusColor = () => {
    switch (status) {
      case ConnectionStatus.CONNECTED: return 'text-green-500 border-green-500/50 bg-green-500/10';
      case ConnectionStatus.ERROR: return 'text-red-500 border-red-500/50 bg-red-500/10';
      case ConnectionStatus.CONNECTING: return 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10';
      default: return 'text-gray-500 border-gray-500/50 bg-gray-500/10';
    }
  };

  const getLineColor = () => {
      switch (status) {
      case ConnectionStatus.CONNECTED: return 'bg-green-500';
      case ConnectionStatus.ERROR: return 'bg-red-500';
      case ConnectionStatus.CONNECTING: return 'bg-yellow-500 animate-pulse';
      default: return 'bg-gray-700';
    }
  }

  return (
    <div className="w-full bg-gray-900 rounded-xl p-8 border border-gray-800 flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="flex items-center justify-between w-full max-w-4xl relative z-10">
        
        {/* Backend Node */}
        <div className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-500 bg-gray-950 ${status === ConnectionStatus.ERROR ? 'border-red-500/30' : 'border-blue-500/30'}`}>
          <div className="w-16 h-16 rounded-full bg-blue-900/30 flex items-center justify-center mb-4">
            <Database size={32} className="text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-200">Backend API</h3>
          <p className="text-xs text-gray-500 max-w-[200px] truncate">{backend?.url}</p>
          <span className={`mt-2 px-2 py-0.5 text-xs rounded-full border ${status === ConnectionStatus.CONNECTED ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
             {status === ConnectionStatus.CONNECTED ? 'Online' : 'Service Fault'}
          </span>
        </div>

        {/* Connection Line */}
        <div className="flex-1 h-1 mx-4 relative">
          <div className={`absolute inset-0 ${getLineColor()} h-0.5 top-1/2 -translate-y-1/2 rounded-full transition-colors duration-500`}></div>
          {status === ConnectionStatus.ERROR && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-900 border-2 border-red-500 rounded-full flex items-center justify-center z-20">
               <AlertTriangle size={16} className="text-red-500" />
            </div>
          )}
           {status === ConnectionStatus.CONNECTED && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-900 border-2 border-green-500 rounded-full flex items-center justify-center z-20 shadow-[0_0_15px_rgba(34,197,94,0.5)]">
               <CheckCircle size={16} className="text-green-500" />
            </div>
          )}
        </div>

        {/* Frontend Node */}
        <div className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-500 bg-gray-950 ${status === ConnectionStatus.ERROR ? 'border-red-500/30' : 'border-indigo-500/30'}`}>
           <div className="w-16 h-16 rounded-full bg-indigo-900/30 flex items-center justify-center mb-4">
            <LayoutDashboard size={32} className="text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-200">Admin Panel</h3>
          <p className="text-xs text-gray-500 max-w-[200px] truncate">{frontend?.url}</p>
          <span className={`mt-2 px-2 py-0.5 text-xs rounded-full border ${status === ConnectionStatus.CONNECTED ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}`}>
             {status === ConnectionStatus.CONNECTED ? 'Active' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="z-10 flex flex-col items-center gap-4">
        <div className={`px-4 py-2 rounded-md font-mono text-sm border ${getStatusColor()} flex items-center gap-2`}>
           <div className={`w-2 h-2 rounded-full ${status === ConnectionStatus.CONNECTED ? 'bg-green-500' : 'bg-red-500'}`}></div>
           Status: {status}
        </div>
        
        {status === ConnectionStatus.ERROR && (
          <button 
            onClick={onFix}
            disabled={isFixing}
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-indigo-600 px-6 font-medium text-white transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2">
              {isFixing ? 'Analyzing & Patching...' : 'Auto-Fix Connection'}
            </span>
             {!isFixing && <Zap size={18} className="group-hover:text-yellow-300 transition-colors" />}
          </button>
        )}
      </div>

    </div>
  );
};