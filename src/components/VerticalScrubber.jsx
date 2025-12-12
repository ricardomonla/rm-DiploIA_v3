import React, { useState, useRef, useEffect } from 'react';
import './VerticalScrubber.css';

const VerticalScrubber = ({ 
  annotations, 
  currentTime, 
  duration, 
  onSeek 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState(0);
  const [nearestAnnotation, setNearestAnnotation] = useState(null);
  const [isSnapped, setIsSnapped] = useState(false);
  
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  
  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  // Convert timestamp to MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Find nearest annotation to current position
  const findNearestAnnotation = (position) => {
    if (!annotations || annotations.length === 0) return null;
    
    const time = (position / 100) * duration;
    
    // Find the closest annotation
    let closest = null;
    let minDiff = Infinity;
    
    annotations.forEach(ann => {
      const diff = Math.abs(ann.timestamp - time);
      if (diff < minDiff) {
        minDiff = diff;
        closest = ann;
      }
    });
    
    return closest;
  };
  
  // Handle mouse/touch activation
  const handleActivation = () => {
    setIsActive(true);
  };
  
  const handleDeactivation = () => {
    if (!isDragging) {
      setIsActive(false);
    }
  };
  
  const handleMouseDown = (e) => {
    if (e.target.classList.contains('scrubber-thumb') || 
        e.target.classList.contains('scrubber-track') ||
        e.target.classList.contains('event-marker')) {
      setIsDragging(true);
      setIsActive(true);
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
      
      // Check if we should snap to nearest annotation
      const nearest = findNearestAnnotation(dragPosition);
      if (nearest && Math.abs(nearest.timestamp - newTime) < 2) {
        setIsSnapped(true);
        setTimeout(() => setIsSnapped(false), 500);
      }
    }
  };
  
  const updatePosition = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = Math.max(0, Math.min(100, (y / rect.height) * 100));
    
    setDragPosition(percentage);
    
    // Find nearest annotation for tooltip
    const nearest = findNearestAnnotation(percentage);
    setNearestAnnotation(nearest);
    
    // Calculate tooltip position (clamped to viewport) - using top positioning
    const tooltipY = Math.max(0, Math.min(100, percentage));
    setTooltipPosition(tooltipY);
  };
  
  const handleMarkerClick = (timestamp) => {
    onSeek(timestamp);
    setIsSnapped(true);
    setTimeout(() => setIsSnapped(false), 500);
  };
  
  useEffect(() => {
    if (!isDragging) {
      setDragPosition(progressPercentage);
      
      // Update nearest annotation for current position
      const nearest = findNearestAnnotation(progressPercentage);
      setNearestAnnotation(nearest);
      setTooltipPosition(progressPercentage);
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
  
  // Calculate tooltip position with viewport clamping
  const tooltipStyle = {
    top: `${tooltipPosition}%`,
    transform: 'translateX(-100%)'
  };
  
  // Calculate thumb position with snap animation
  const thumbStyle = {
    top: `${isDragging ? dragPosition : progressPercentage}%`,
    transition: isDragging ? 'none' : 'top 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isSnapped ? 'scale(1.2)' : 'scale(1)'
  };
  
  return (
    <div 
      className={`vertical-scrubber-container ${isActive ? 'active' : ''}`}
      ref={containerRef}
      onMouseEnter={handleActivation}
      onMouseLeave={handleDeactivation}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Invisible track that becomes visible when active */}
      <div 
        className={`scrubber-track ${isActive ? 'visible' : ''}`}
        ref={trackRef}
      >
        {/* Progress indicator */}
        <div 
          className="scrubber-progress"
          style={{ height: `${progressPercentage}%` }}
        />
        
        {/* Event markers (annotations) */}
        {annotations.map((ann) => {
          const position = duration > 0 ? (ann.timestamp / duration) * 100 : 0;
          return (
            <div
              key={ann.id}
              className={`event-marker ${ann.category}`}
              style={{ top: `${position}%` }}
              onClick={() => handleMarkerClick(ann.timestamp)}
            />
          );
        })}
        
        {/* Scrubber thumb */}
        <div 
          className="scrubber-thumb"
          ref={thumbRef}
          style={thumbStyle}
        />
      </div>
      
      {/* Dynamic tooltip */}
      {(isActive || isDragging) && (
        <div className="scrubber-tooltip" style={tooltipStyle}>
          <div className="tooltip-time">
            {formatTime((isDragging ? dragPosition : progressPercentage) / 100 * duration)}
          </div>
          {nearestAnnotation && (
            <div className="tooltip-label">
              {nearestAnnotation.note.substring(0, 30)}{nearestAnnotation.note.length > 30 ? '...' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerticalScrubber;