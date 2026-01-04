
import React from 'react';
import { Annotation } from '../types';

interface ScrubberProps {
  annotations: Annotation[];
  currentTime: number;
  onSeek: (seconds: number) => void;
}

const Scrubber: React.FC<ScrubberProps> = ({ annotations, currentTime, onSeek }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Timeline</h3>
        <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
          {formatTime(currentTime)}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <div className="relative border-l border-white/10 ml-4 py-4 space-y-8">
          {annotations.map((ann, idx) => {
            const isActive = currentTime >= ann.timestamp && 
                            (idx === annotations.length - 1 || currentTime < annotations[idx+1].timestamp);
            
            return (
              <button
                key={ann.id}
                onClick={() => onSeek(ann.timestamp)}
                className={`w-full text-left relative group transition-all ${
                  isActive ? 'translate-x-1' : 'hover:translate-x-1'
                }`}
              >
                {/* Marker Dot */}
                <div className={`absolute -left-[1.3125rem] top-1 w-2.5 h-2.5 rounded-full border-2 border-[#0a0a0a] transition-colors ${
                  isActive ? 'bg-blue-500 scale-125' : 'bg-white/20 group-hover:bg-white/40'
                }`} />

                <div className="ml-6 pr-4">
                  <div className={`text-[10px] font-mono mb-0.5 transition-colors ${
                    isActive ? 'text-blue-400' : 'text-gray-500'
                  }`}>
                    {formatTime(ann.timestamp)}
                  </div>
                  <h4 className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                  }`}>
                    {ann.label}
                  </h4>
                  {ann.description && isActive && (
                    <p className="text-xs text-gray-500 mt-1 leading-tight animate-in fade-in slide-in-from-top-1 duration-300">
                      {ann.description}
                    </p>
                  )}
                </div>
              </button>
            );
          })}

          {annotations.length === 0 && (
            <div className="ml-6 py-10 text-gray-600 text-sm">
              No moments added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scrubber;
