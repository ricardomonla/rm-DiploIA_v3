import { state, elements, CONFIG } from './state.js';

export function loadYouTubeVideo(clase, videoId) {
    clearPlayer();

    // ID resolution: argument vs state lookup
    const id = videoId; // Simplified for this context
    if (!id) return;

    const iframe = createYouTubeIframe(id);
    elements.youtubePlayer.appendChild(iframe);
    state.currentPlayer = iframe;

    // Show Loader
    showLoader();

    initializeYouTubeAPI(id);
}

function showLoader() {
    const loader = document.createElement('div');
    loader.className = 'video-loader';
    loader.id = 'video-loader';
    loader.innerHTML = '<div class="spinner"></div><span>Cargando video...</span>';
    elements.youtubePlayer.appendChild(loader);
}

function hideLoader() {
    const loader = document.getElementById('video-loader');
    if (loader) loader.remove();
}

export function clearPlayer() {
    if (state.currentPlayer && elements.youtubePlayer.contains(state.currentPlayer)) {
        elements.youtubePlayer.removeChild(state.currentPlayer);
        state.currentPlayer = null;
    }
    hideLoader(); // Ensure loader is gone
    const progressDisplay = document.getElementById('video-progress-percentage');
    if (progressDisplay) progressDisplay.remove();
}

function createYouTubeIframe(videoId) {
    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.src = `${CONFIG.youtubeBaseUrl}${videoId}?enablejsapi=1`;
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    return iframe;
}

function initializeYouTubeAPI(videoId) {
    if (window.YT && window.YT.Player) {
        createYouTubePlayer(videoId);
    } else {
        loadYouTubeAPI(videoId);
    }
}

function loadYouTubeAPI(videoId) {
    if (document.getElementById('yt-iframe-api')) return;

    const tag = document.createElement('script');
    tag.id = 'yt-iframe-api';
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
        createYouTubePlayer(videoId);
    };
}


function createYouTubePlayer(videoId) {
    const iframe = elements.youtubePlayer.querySelector('iframe');
    if (iframe && window.YT && window.YT.Player) {
        new window.YT.Player(iframe, {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }
}

function onPlayerReady(event) {
    // Hide loader when API is ready to play
    hideLoader();
    // Optional: event.target.playVideo(); if auto-play desired
}

function onPlayerStateChange(event) {
    // Ensure loader is gone if we missed onReady or it came late
    if (event.data === window.YT.PlayerState.PLAYING || event.data === window.YT.PlayerState.PAUSED) {
        hideLoader();
    }
    // Tracking logic omitted
}
