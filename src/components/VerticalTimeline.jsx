import React, { useState, useRef, useEffect } from 'react';
import './VerticalTimeline.css';

const VerticalTimeline = ({ 
  annotations, 
  currentTime, 
  duration, 
  onSeek 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const timelineRef = useRef(null);
  const containerRef = useRef(null);
  
  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  const handleMouseDown = (e) => {
    if (e.target.classList.contains('timeline-progress') || 
        e.target.classList.contains('timeline-thumb')) {
      setIsDragging(true);
      updatePosition(e);
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDragging) {
      updatePosition(e);
    }
  };
  
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Seek to the new position
      const newTime = (dragPosition / 100) * duration;
      onSeek(newTime);
    }
  };
  
  const updatePosition = (e) => {
    const rect = timelineRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = Math.max(0, Math.min(100, (y / rect.height) * 100));
    setDragPosition(percentage);
  };
  
  const handleDotClick = (timestamp) => {
    onSeek(timestamp);
  };
  
  useEffect(() => {
    if (!isDragging) {
      setDragPosition(progressPercentage);
    }
  }, [currentTime, duration, isDragging, progressPercentage]);
  
  useEffect(() => {
    const handleMouseUpGlobal = () => handleMouseUp();
    const handleMouseMoveGlobal = (e) => handleMouseMove(e);
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMoveGlobal);
      document.addEventListener('mouseup', handleMouseUpGlobal);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMoveGlobal);
      document.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [isDragging]);
  
  return (
    <div 
      className="vertical-timeline-container"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ height: '100%' }}
    >
      <div className="vertical-timeline" ref={timelineRef}>
        {/* Progress track */}
        <div className="timeline-track">
          <div 
            className="timeline-progress"
            style={{ height: `${progressPercentage}%` }}
          />
          <div 
            className="timeline-thumb"
            style={{ bottom: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Annotation dots */}
        {annotations.map((ann) => {
          const position = duration > 0 ? (ann.timestamp / duration) * 100 : 0;
          return (
            <div
              key={ann.id}
              className={`timeline-dot ${ann.category}`}
              style={{ bottom: `${position}%` }}
              onClick={() => handleDotClick(ann.timestamp)}
            />
          );
        })}
        
        {/* Current time indicator */}
        <div 
          className="timeline-current-indicator"
          style={{ bottom: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default VerticalTimeline;