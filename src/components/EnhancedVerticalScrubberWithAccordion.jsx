import React, { useState, useRef, useEffect } from 'react';
import './EnhancedVerticalScrubberWithAccordion.css';

const EnhancedVerticalScrubberWithAccordion = ({
  annotations,
  currentTime,
  duration,
  onSeek,
  onAddAnnotation,
  onUpdateAnnotation,
  onDeleteAnnotation,
  videoUrl = '',
  onUrlChange
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
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [focusedMarkerIndex, setFocusedMarkerIndex] = useState(-1);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const markerRefs = useRef({});
  
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
      setHoveredMarker(null);
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
      
      setIsDragging(true);
      setIsActive(true);
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      handleMouseDown(mouseEvent);
    }
  };
  
  const handleTouchMove = (e) => {
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
    if (isDragging) {
      const touch = e.changedTouches[0];
      const mouseEvent = new MouseEvent('mouseup', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      handleMouseUp(mouseEvent);
    }
  };
  
  const showAddAnnotationMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
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
  
  const handleMarkerMouseEnter = (ann) => {
    setHoveredMarker(ann);
  };
  
  const handleMarkerMouseLeave = () => {
    if (!editingAnnotation) {
      setHoveredMarker(null);
    }
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isActive || annotations.length === 0) return;
      
      // Arrow key navigation
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        let newIndex = focusedMarkerIndex;
        
        if (e.key === 'ArrowUp') {
          newIndex = Math.max(0, focusedMarkerIndex - 1);
        } else {
          newIndex = Math.min(annotations.length - 1, focusedMarkerIndex + 1);
        }
        
        setFocusedMarkerIndex(newIndex);
        
        // Scroll marker into view if needed
        const markerId = annotations[newIndex].id;
        if (markerRefs.current[markerId]) {
          markerRefs.current[markerId].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          });
        }
      }
      
      // Enter key to edit
      if (e.key === 'Enter' && focusedMarkerIndex >= 0) {
        e.preventDefault();
        handleMarkerClick(annotations[focusedMarkerIndex], e);
      }
      
      // Escape key to close menus
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowAddMenu(false);
        setEditingAnnotation(null);
        setShowDeleteConfirm(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, annotations, focusedMarkerIndex]);
  
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
      tabIndex={0}
    >
      {/* Video URL Marker at the start of progress bar */}
      <div
        className={`url-marker ${isEditingUrl ? 'editing' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsEditingUrl(true);
        }}
      >
        {!isEditingUrl ? (
          <div className="url-marker-content">
            <span className="url-icon">🔗</span>
            {videoUrl ? (
              <span className="url-preview">
                {videoUrl.substring(0, 20)}{videoUrl.length > 20 ? '...' : ''}
              </span>
            ) : (
              <span className="url-placeholder">Add Video URL</span>
            )}
          </div>
        ) : (
          <input
            type="text"
            className="url-edit-input"
            value={videoUrl}
            onChange={onUrlChange}
            onBlur={() => setIsEditingUrl(false)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        )}
      </div>
      
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
        {annotations.map((ann, index) => {
          const position = duration > 0 ? (ann.timestamp / duration) * 100 : 0;
          const isFocused = focusedMarkerIndex === index;
          const isHovered = hoveredMarker?.id === ann.id;
          
          return (
            <div
              key={ann.id}
              ref={el => markerRefs.current[ann.id] = el}
              className={`event-marker ${ann.category} ${isFocused ? 'focused' : ''} ${isHovered ? 'hovered' : ''}`}
              style={{ top: `${position}%` }}
              onClick={(e) => handleMarkerClick(ann, e)}
              onMouseEnter={() => handleMarkerMouseEnter(ann)}
              onMouseLeave={handleMarkerMouseLeave}
              tabIndex={0}
              aria-label={`Annotation at ${formatTime(ann.timestamp)}: ${ann.note}`}
            >
              {editingAnnotation?.id === ann.id && (
                <div className="marker-edit-indicator"></div>
              )}
              
              {/* Accordion panel for marker details */}
              {(isHovered || isFocused) && !editingAnnotation && (
                <div 
                  className="marker-accordion-panel"
                  style={{ top: `${position}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkerClick(ann, e);
                  }}
                >
                  <div className="accordion-header">
                    <span className="accordion-time">{formatTime(ann.timestamp)}</span>
                    <span className="accordion-title">{ann.note.substring(0, 40)}{ann.note.length > 40 ? '...' : ''}</span>
                  </div>
                  <div className="accordion-content">
                    <span className={`category-badge ${ann.category}`}>{ann.category}</span>
                    <span className="edit-hint">Click to edit</span>
                  </div>
                </div>
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
          aria-label="Add new annotation"
        >
          <span>+</span>
        </div>
      </div>
      
      {/* Dynamic tooltip */}
      {(isActive || isDragging) && !showAddMenu && !editingAnnotation && !hoveredMarker && (
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
            <button className="close-menu" onClick={() => setShowAddMenu(false)} aria-label="Close menu">×</button>
          </div>
          <div className="menu-content">
            <input
              type="text"
              value={newAnnotationNote}
              onChange={(e) => setNewAnnotationNote(e.target.value)}
              placeholder="Annotation note..."
              aria-label="Annotation note"
            />
            <select
              value={newAnnotationCategory}
              onChange={(e) => setNewAnnotationCategory(e.target.value)}
              aria-label="Annotation category"
            >
              <option value="general">General</option>
              <option value="importante">Importante</option>
              <option value="pregunta">Pregunta</option>
              <option value="idea">Idea</option>
            </select>
            <button className="add-button" onClick={handleAddAnnotation} aria-label="Add annotation">Add</button>
          </div>
        </div>
      )}
      
      {/* Edit annotation menu */}
      {editingAnnotation && (
        <div className="annotation-menu edit-menu" style={addMenuStyle}>
          <div className="menu-header">
            <h4>Edit Annotation</h4>
            <button className="close-menu" onClick={() => setEditingAnnotation(null)} aria-label="Close edit menu">×</button>
          </div>
          <div className="menu-content">
            <input
              type="text"
              value={newAnnotationNote}
              onChange={(e) => setNewAnnotationNote(e.target.value)}
              placeholder="Annotation note..."
              aria-label="Edit annotation note"
            />
            <select
              value={newAnnotationCategory}
              onChange={(e) => setNewAnnotationCategory(e.target.value)}
              aria-label="Edit annotation category"
            >
              <option value="general">General</option>
              <option value="importante">Importante</option>
              <option value="pregunta">Pregunta</option>
              <option value="idea">Idea</option>
            </select>
            <div className="edit-buttons">
              <button className="update-button" onClick={handleUpdateAnnotation} aria-label="Update annotation">Update</button>
              <button className="delete-button" onClick={() => {
                setAnnotationToDelete(editingAnnotation);
                setShowDeleteConfirm(true);
              }} aria-label="Delete annotation">Delete</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <p>Delete this annotation?</p>
          <div className="confirm-buttons">
            <button className="confirm-delete" onClick={handleDeleteAnnotation} aria-label="Confirm delete">Yes</button>
            <button className="cancel-delete" onClick={() => {
              setShowDeleteConfirm(false);
              setAnnotationToDelete(null);
              setEditingAnnotation(null);
            }} aria-label="Cancel delete">No</button>
          </div>
        </div>
      )}
      
      {/* Keyboard navigation instructions (hidden but available for screen readers) */}
      <div className="sr-only" aria-live="polite">
        {isActive ? 'Use arrow keys to navigate between markers. Press Enter to edit. Press Escape to close menus.' : ''}
      </div>
    </div>
  );
};

export default EnhancedVerticalScrubberWithAccordion;