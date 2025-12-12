import React from 'react';
import './FloatingBar.css';

const FloatingBar = ({ annotations, currentTime, duration }) => {
  // Filter annotations that should be visible based on current time
  const visibleAnnotations = annotations.filter(ann => ann.timestamp <= currentTime);

  return (
    <div className="floating-bar">
      {visibleAnnotations.length > 0 ? (
        visibleAnnotations.map((ann, index) => (
          <div key={ann.id} className={`floating-mark ${ann.category}`}>
            <span className="mark-text">{ann.note.substring(0, 30)}...</span>
          </div>
        ))
      ) : (
        <div className="no-marks">No marks yet</div>
      )}
    </div>
  );
};

export default FloatingBar;