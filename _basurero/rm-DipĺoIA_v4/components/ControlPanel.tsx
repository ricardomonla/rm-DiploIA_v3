
import React, { useState, useEffect } from 'react';

interface ControlPanelProps {
  onUrlSubmit: (url: string) => void;
  onAutoSegment: () => void;
  onAddMoment: (label: string) => void;
  isAnalyzing: boolean;
  currentUrl: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onUrlSubmit, 
  onAutoSegment, 
  onAddMoment, 
  isAnalyzing,
  currentUrl 
}) => {
  const [url, setUrl] = useState(currentUrl);
  const [momentLabel, setMomentLabel] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUrl(currentUrl);
  }, [currentUrl]);

  const validateYouTubeUrl = (url: string) => {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[&?].*)?$/;
    return regExp.test(url);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError("Por favor, introduce una URL.");
      return;
    }

    if (!validateYouTubeUrl(url)) {
      setError("URL de YouTube no válida. Ejemplo: https://youtu.be/...");
      return;
    }

    onUrlSubmit(url);
  };

  const handleAddMoment = (e: React.FormEvent) => {
    e.preventDefault();
    if (momentLabel.trim()) {
      onAddMoment(momentLabel);
      setMomentLabel('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* URL Input Area */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-2">Fuente del Video</label>
          <form onSubmit={handleUrlSubmit} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Pega la URL de YouTube..."
                className={`flex-1 bg-black/40 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors`}
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-white text-black font-semibold rounded-lg text-sm hover:bg-gray-200 transition-colors shrink-0"
              >
                Cargar
              </button>
            </div>
            {error && <p className="text-[10px] text-red-400 font-medium px-1">{error}</p>}
          </form>
        </div>
        <div className="mt-4">
          <button 
            onClick={onAutoSegment}
            disabled={isAnalyzing}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              isAnalyzing 
                ? 'bg-blue-500/20 text-blue-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 active:scale-95'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                AI Analizando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Auto-Segmentar Momentos
              </>
            )}
          </button>
        </div>
      </div>

      {/* Manual Annotation Area */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-2">Marcar Momento Actual</label>
        <form onSubmit={handleAddMoment} className="space-y-3">
          <input 
            type="text" 
            value={momentLabel}
            onChange={(e) => setMomentLabel(e.target.value)}
            placeholder="Etiqueta (ej: Concepto clave)"
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button 
            type="submit"
            className="w-full py-2.5 bg-white/10 text-white font-semibold rounded-lg text-sm hover:bg-white/15 transition-all border border-white/10 active:scale-95"
          >
            Añadir Marca
          </button>
        </form>
        <p className="mt-3 text-[10px] text-gray-600 text-center italic">
          Guarda el segundo actual con tu etiqueta personalizada.
        </p>
      </div>
    </div>
  );
};

export default ControlPanel;
