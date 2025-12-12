import React, { useState, useRef, useEffect } from 'react';
import './EnhancedVerticalScrubber.css';

const EnhancedVerticalScrubber = ({ 
  annotations, 
  currentTime, 
  duration, 
  onSeek,
  onAddAnnotation,
  onUpdateAnnotation,
  onDeleteAnnotation
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState(0);
  const [nearestAnnotation, setNearestAnnotation] = useState(null);
  const [isSnapped, setIsSnapped] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [editingAnnotation, setEditingAnnotation] = useState(null);
  const [newAnnotationNote, setNewAnnotationNote] = useState('');
  const [newAnnotationCategory, setNewAnnotationCategory] = useState('general');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [annotationToDelete, setAnnotationToDelete] = useState(null);
  
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  
  // Touch/gesture state
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  
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
    if (!isDragging && !showAddMenu && !editingAnnotation && !showDeleteConfirm) {
      setIsActive(false);
    }
  };
  
  const handleMouseDown = (e) => {
    if (e.target.classList.contains('scrubber-thumb') || 
        e.target.classList.contains('scrubber-track')) {
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
    
    // Calculate tooltip position
    const tooltipY = Math.max(0, Math.min(100, percentage));
    setTooltipPosition(tooltipY);
  };
  
  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    if (e.target.classList.contains('scrubber-thumb') || 
        e.target.classList.contains('scrubber-track') ||
        e.target.classList.contains('event-marker')) {
      
      setTouchStartY(e.touches[0].clientY);
      setTouchStartTime(Date.now());
      
      // Start long press timer for adding annotations
      const timer = setTimeout(() => {
        if (!isDragging) {
          showAddAnnotationMenu(e);
        }
      }, 800);
      setLongPressTimer(timer);
    }
  };
  
  const handleTouchMove = (e) => {
    if (!isDragging && longPressTimer) {
      // Check if it's a swipe (vertical movement)
      const currentY = e.touches[0].clientY;
      const deltaY = Math.abs(currentY - touchStartY);
      
      if (deltaY > 10) {
        // It's a swipe, cancel long press
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
        setIsSwiping(true);
      }
    }
    
    if (isDragging) {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      handleMouseMove(mouseEvent);
    }
  };
  
  const handleTouchEnd = (e) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    if (isSwiping) {
      setIsSwiping(false);
      // Handle swipe gesture - could be used for deletion
      const currentY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - currentY;
      
      if (Math.abs(deltaY) > 50) {
        // Significant swipe detected
        const nearest = findNearestAnnotation((touchStartY / containerRef.current.getBoundingClientRect().height) * 100);
        if (nearest) {
          setAnnotationToDelete(nearest);
          setShowDeleteConfirm(true);
        }
      }
    }
    
    if (isDragging) {
      handleMouseUp();
    }
  };
  
  const showAddAnnotationMenu = (e) => {
    // Prevent default to avoid text selection
    e.preventDefault();
    
    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = Math.max(0, Math.min(100, (y / rect.height) * 100));
    const timestamp = (percentage / 100) * duration;
    
    setShowAddMenu(true);
    setDragPosition(percentage);
    setNewAnnotationNote(`Mark at ${formatTime(timestamp)}`);
  };
  
  const handleAddAnnotation = () => {
    const timestamp = (dragPosition / 100) * duration;
    onAddAnnotation({
      id: Date.now(),
      timestamp: timestamp,
      note: newAnnotationNote,
      category: newAnnotationCategory
    });
    
    setShowAddMenu(false);
    setNewAnnotationNote('');
    setNewAnnotationCategory('general');
  };
  
  const handleMarkerClick = (ann, e) => {
    e.stopPropagation();
    setEditingAnnotation(ann);
    setNewAnnotationNote(ann.note);
    setNewAnnotationCategory(ann.category);
  };
  
  const handleUpdateAnnotation = () => {
    if (editingAnnotation) {
      onUpdateAnnotation({
        ...editingAnnotation,
        note: newAnnotationNote,
        category: newAnnotationCategory
      });
      setEditingAnnotation(null);
      setNewAnnotationNote('');
      setNewAnnotationCategory('general');
    }
  };
  
  const handleDeleteAnnotation = () => {
    if (annotationToDelete) {
      onDeleteAnnotation(annotationToDelete.id);
      setShowDeleteConfirm(false);
      setAnnotationToDelete(null);
    }
  };
  
  const handleMarkerTouchStart = (ann, e) => {
    e.stopPropagation();
    // Start timer for long press to edit
    const timer = setTimeout(() => {
      handleMarkerClick(ann, e);
    }, 500);
    setLongPressTimer(timer);
  };
  
  const handleMarkerTouchEnd = (e) => {
    e.stopPropagation();
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
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
  
  // Calculate tooltip position
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
  
  // Calculate add menu position
  const addMenuStyle = {
    top: `${dragPosition}%`,
    transform: 'translateX(-100%) translateY(-50%)'
  };
  
  return (
    <div 
      className={`enhanced-scrubber-container ${isActive ? 'active' : ''}`}
      ref={containerRef}
      onMouseEnter={handleActivation}
      onMouseLeave={handleDeactivation}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
              onClick={(e) => handleMarkerClick(ann, e)}
              onTouchStart={(e) => handleMarkerTouchStart(ann, e)}
              onTouchEnd={handleMarkerTouchEnd}
            >
              {editingAnnotation?.id === ann.id && (
                <div className="marker-edit-indicator"></div>
              )}
            </div>
          );
        })}
        
        {/* Scrubber thumb */}
        <div 
          className="scrubber-thumb"
          ref={thumbRef}
          style={thumbStyle}
        />
        
        {/* Add marker button (plus sign) */}
        <div 
          className="add-marker-button"
          style={{ top: `${dragPosition}%` }}
          onClick={showAddAnnotationMenu}
        >
          <span>+</span>
        </div>
      </div>
      
      {/* Dynamic tooltip */}
      {(isActive || isDragging) && !showAddMenu && !editingAnnotation && (
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
      
      {/* Add annotation menu */}
      {showAddMenu && (
        <div className="annotation-menu" style={addMenuStyle}>
          <div className="menu-header">
            <h4>Add Annotation</h4>
            <button className="close-menu" onClick={() => setShowAddMenu(false)}>×</button>
          </div>
          <div className="menu-content">
            <input
              type="text"
              value={newAnnotationNote}
              onChange={(e) => setNewAnnotationNote(e.target.value)}
              placeholder="Annotation note..."
            />
            <select
              value={newAnnotationCategory}
              onChange={(e) => setNewAnnotationCategory(e.target.value)}
            >
              <option value="general">General</option>
              <option value="importante">Importante</option>
              <option value="pregunta">Pregunta</option>
              <option value="idea">Idea</option>
            </select>
            <button className="add-button" onClick={handleAddAnnotation}>Add</button>
          </div>
        </div>
      )}
      
      {/* Edit annotation menu */}
      {editingAnnotation && (
        <div className="annotation-menu edit-menu" style={addMenuStyle}>
          <div className="menu-header">
            <h4>Edit Annotation</h4>
            <button className="close-menu" onClick={() => setEditingAnnotation(null)}>×</button>
          </div>
          <div className="menu-content">
            <input
              type="text"
              value={newAnnotationNote}
              onChange={(e) => setNewAnnotationNote(e.target.value)}
              placeholder="Annotation note..."
            />
            <select
              value={newAnnotationCategory}
              onChange={(e) => setNewAnnotationCategory(e.target.value)}
            >
              <option value="general">General</option>
              <option value="importante">Importante</option>
              <option value="pregunta">Pregunta</option>
              <option value="idea">Idea</option>
            </select>
            <div className="edit-buttons">
              <button className="update-button" onClick={handleUpdateAnnotation}>Update</button>
              <button className="delete-button" onClick={() => {
                setAnnotationToDelete(editingAnnotation);
                setShowDeleteConfirm(true);
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <p>Delete this annotation?</p>
          <div className="confirm-buttons">
            <button className="confirm-delete" onClick={handleDeleteAnnotation}>Yes</button>
            <button className="cancel-delete" onClick={() => {
              setShowDeleteConfirm(false);
              setAnnotationToDelete(null);
              setEditingAnnotation(null);
            }}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedVerticalScrubber;