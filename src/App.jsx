import { useState, useRef, useEffect } from 'react'
import YouTube from 'react-youtube'
import './App.css'
import EnhancedVerticalScrubberWithAccordion from './components/EnhancedVerticalScrubberWithAccordion'
import {
  loadVideoAnnotations,
  saveVideoAnnotations,
  saveLastVideo,
  loadLastVideo
} from './dataPersistence'

function App() {
  const [videoUrl, setVideoUrl] = useState('')
  const [videoId, setVideoId] = useState('')
  const [annotations, setAnnotations] = useState([])
  const [duration, setDuration] = useState(0)
  const [liveCurrentTime, setLiveCurrentTime] = useState(0)
  const playerRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    const loadInitialData = async () => {
      // Load last video information
      const lastVideo = loadLastVideo();
      if (lastVideo.id) {
        setVideoUrl(lastVideo.url);
        setVideoId(lastVideo.id);
      }
      
      // Load annotations for current video if videoId is available
      if (videoId) {
        const savedAnnotations = await loadVideoAnnotations(videoId);
        setAnnotations(savedAnnotations);
      } else {
        setAnnotations([]);
      }
    };
    
    loadInitialData();
  }, [videoId]);

  useEffect(() => {
    if (videoId) {
      saveVideoAnnotations(videoId, annotations);
    }
  }, [annotations, videoId]);

  useEffect(() => {
    // Save last video information when videoId changes
    if (videoId) {
      saveLastVideo(videoUrl, videoId);
    }
  }, [videoId, videoUrl]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const extractVideoId = (url) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    return match ? match[1] : null
  }

  const handleUrlChange = (e) => {
    const url = e.target.value
    setVideoUrl(url)
    const id = extractVideoId(url)
    setVideoId(id || '')
  }

  const onReady = (event) => {
    playerRef.current = event.target
    setDuration(event.target.getDuration())
  }

  const onStateChange = (event) => {
    if (event.data === 1) { // playing
      startUpdatingTime()
    } else {
      stopUpdatingTime()
    }
  }

  const startUpdatingTime = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      if (playerRef.current) {
        setLiveCurrentTime(playerRef.current.getCurrentTime())
      }
    }, 500)
  }

  const stopUpdatingTime = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const addAnnotation = (newAnnotation) => {
    setAnnotations([...annotations, newAnnotation])
  }

  const saveEdit = (updatedAnnotation) => {
    setAnnotations(annotations.map(ann => ann.id === updatedAnnotation.id ? updatedAnnotation : ann))
  }

  const deleteAnnotation = (id) => {
    setAnnotations(annotations.filter(ann => ann.id !== id))
  }

  const seekTo = (timestamp) => {
    if (playerRef.current) {
      playerRef.current.seekTo(timestamp)
    }
  }

  const opts = {
    height: '600',
    width: '800',
    playerVars: {
      autoplay: 0,
    },
  }

  return (
    <div className="app">
      <div className="ultra-minimal-section">
        {videoId && (
          <div className="video-with-scrubber">
            <div className="youtube-player-container">
              <YouTube videoId={videoId} opts={opts} onReady={onReady} onStateChange={onStateChange} className="youtube-player" />
            </div>
            
            <div className="floating-enhanced-scrubber">
              <EnhancedVerticalScrubberWithAccordion
                annotations={annotations}
                currentTime={liveCurrentTime}
                duration={duration}
                onSeek={seekTo}
                onAddAnnotation={addAnnotation}
                onUpdateAnnotation={saveEdit}
                onDeleteAnnotation={deleteAnnotation}
                videoUrl={videoUrl}
                onUrlChange={handleUrlChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
