
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Annotation, Course, Class } from './types';
import VideoPlayer from './components/VideoPlayer';
import Scrubber from './components/Scrubber';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import Sidebar from './components/Sidebar';
import { analyzeVideoWithGemini } from './services/geminiService';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = storageService.loadCourses();
    if (saved.length > 0) return saved;
    return [{
      id: 'default-course',
      title: 'Mi Primer Curso',
      classes: [{
        id: 'default-class',
        title: 'Introducción',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoId: 'dQw4w9WgXcQ',
        annotations: []
      }]
    }];
  });

  const [activeCourseId, setActiveCourseId] = useState<string>(courses[0].id);
  const [activeClassId, setActiveClassId] = useState<string>(courses[0].classes[0].id);
  const [currentTime, setCurrentTime] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'courses' | 'timeline'>('courses');
  
  const playerRef = useRef<any>(null);

  useEffect(() => {
    storageService.saveCourses(courses);
  }, [courses]);

  const activeCourse = useMemo(() => 
    courses.find(c => c.id === activeCourseId) || courses[0], 
  [courses, activeCourseId]);

  const activeClass = useMemo(() => 
    activeCourse.classes.find(cl => cl.id === activeClassId) || activeCourse.classes[0],
  [activeCourse, activeClassId]);

  const extractVideoId = (url: string) => {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[&?].*)?$/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const handleAddClass = (url: string, title: string) => {
    const vId = extractVideoId(url);
    if (!vId) return;

    const newClass: Class = {
      id: Math.random().toString(36).substr(2, 9),
      title: title || 'Nueva Clase',
      url,
      videoId: vId,
      annotations: []
    };

    setCourses(prev => prev.map(course => 
      course.id === activeCourseId 
        ? { ...course, classes: [...course.classes, newClass] }
        : course
    ));
    setActiveClassId(newClass.id);
  };

  const handleAddCourse = (title: string) => {
    const newCourse: Course = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      classes: []
    };
    setCourses(prev => [...prev, newCourse]);
    setActiveCourseId(newCourse.id);
    setSidebarMode('courses');
  };

  const handleAutoSegment = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeVideoWithGemini(activeClass.url);
      if (result && result.annotations) {
        setCourses(prev => prev.map(course => ({
          ...course,
          classes: course.classes.map(cl => 
            cl.id === activeClassId ? { ...cl, annotations: result.annotations } : cl
          )
        })));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addAnnotation = (label: string) => {
    const newAnn: Annotation = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Math.floor(currentTime),
      label,
      description: 'Nota de estudio'
    };
    
    setCourses(prev => prev.map(course => ({
      ...course,
      classes: course.classes.map(cl => 
        cl.id === activeClassId 
          ? { ...cl, annotations: [...cl.annotations, newAnn].sort((a,b) => a.timestamp - b.timestamp) } 
          : cl
      )
    })));
  };

  const handleSeek = (seconds: number) => {
    if (playerRef.current) playerRef.current.seekTo(seconds, true);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#050505] text-gray-200">
      <Header />
      
      <main className="flex flex-1 overflow-hidden">
        <Sidebar 
          courses={courses}
          activeCourseId={activeCourseId}
          activeClassId={activeClassId}
          mode={sidebarMode}
          onSelectClass={(courseId, classId) => {
            setActiveCourseId(courseId);
            setActiveClassId(classId);
            setSidebarMode('timeline');
          }}
          onAddCourse={handleAddCourse}
          onSetMode={setSidebarMode}
          annotations={activeClass.annotations}
          currentTime={currentTime}
          onSeek={handleSeek}
        />

        <div className="flex-1 flex flex-col bg-[#050505] p-6 gap-6 overflow-y-auto custom-scrollbar">
          <div className="w-full max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-2xl font-bold text-white">{activeClass.title}</h2>
                <p className="text-sm text-gray-500">{activeCourse.title}</p>
              </div>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
              <VideoPlayer 
                videoId={activeClass.videoId} 
                onReady={(player) => playerRef.current = player}
                onProgress={(time) => setCurrentTime(time)}
              />
            </div>

            <ControlPanel 
              onUrlSubmit={(url) => handleAddClass(url, "Clase #" + (activeCourse.classes.length + 1))}
              onAutoSegment={handleAutoSegment}
              onAddMoment={addAnnotation}
              isAnalyzing={isAnalyzing}
              currentUrl={activeClass.url}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
