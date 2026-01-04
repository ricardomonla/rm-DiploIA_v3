
import React, { useState } from 'react';
import { Course, Annotation } from '../types';
import Scrubber from './Scrubber';

interface SidebarProps {
  courses: Course[];
  activeCourseId: string;
  activeClassId: string;
  mode: 'courses' | 'timeline';
  annotations: Annotation[];
  currentTime: number;
  onSelectClass: (courseId: string, classId: string) => void;
  onAddCourse: (title: string) => void;
  onSetMode: (mode: 'courses' | 'timeline') => void;
  onSeek: (seconds: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  courses, activeCourseId, activeClassId, mode, 
  annotations, currentTime, onSelectClass, onAddCourse, 
  onSetMode, onSeek 
}) => {
  const [newCourseTitle, setNewCourseTitle] = useState('');

  return (
    <div className="w-80 border-r border-white/5 bg-[#0a0a0a] flex flex-col shrink-0">
      {/* Selector de Modo */}
      <div className="flex border-b border-white/5">
        <button 
          onClick={() => onSetMode('courses')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
            mode === 'courses' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Cursos
        </button>
        <button 
          onClick={() => onSetMode('timeline')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
            mode === 'timeline' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Clase Actual
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {mode === 'courses' ? (
          <div className="p-4 space-y-6">
            {/* Formulario Nuevo Curso */}
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="Nuevo curso..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
                onKeyDown={(e) => {
                  if(e.key === 'Enter' && newCourseTitle.trim()) {
                    onAddCourse(newCourseTitle);
                    setNewCourseTitle('');
                  }
                }}
              />
            </div>

            {/* Lista de Cursos */}
            <div className="space-y-4">
              {courses.map(course => (
                <div key={course.id} className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-tighter px-2">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    {course.title}
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {course.classes.map(cl => (
                      <button
                        key={cl.id}
                        onClick={() => onSelectClass(course.id, cl.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-3 ${
                          cl.id === activeClassId 
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                            : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${cl.id === activeClassId ? 'bg-blue-500' : 'bg-gray-700'}`} />
                        <span className="truncate">{cl.title}</span>
                      </button>
                    ))}
                    {course.classes.length === 0 && (
                      <div className="text-[10px] text-gray-600 px-8 py-1 italic">Sin clases aún</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Scrubber 
            annotations={annotations} 
            currentTime={currentTime} 
            onSeek={onSeek} 
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
