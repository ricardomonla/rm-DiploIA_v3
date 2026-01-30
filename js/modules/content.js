import { state, elements, CONFIG } from './state.js';
import { renderActiveTOC } from './navigation.js';

// === CONFIG LOADERS ===
export async function loadDocusConfig() {
    try {
        console.log('Loading unified config from index.json...');
        const response = await fetch(`index.json?v=${Date.now()}`);
        const config = await response.json();

        state.manifest = config;
        state.docusDir = config.docus_dir;
        CONFIG.allowedExtensions = config.allowed_extensions;
        CONFIG.campusUrl = config.url_base_campus || '';
        CONFIG.youtubeBaseUrl = config.url_base_youtube || 'https://www.youtube.com/embed/';
    } catch (error) {
        console.error('Error loading config:', error);
        alert('Error al cargar la configuración');
    }
}

export async function loadClassesData() {
    try {
        const manifest = state.manifest;
        if (!manifest || !manifest.cursados) throw new Error('Manifest or cursados not loaded');

        state.classesData.cursados = manifest.cursados.map(cursado => ({
            ...cursado,
            clases: cursado.clases.map(clase => ({
                ...clase,
                isLoaded: true
            }))
        }));
        console.log('Courses fully integrated:', state.classesData.cursados.length);
    } catch (error) {
        console.error('Error integrating metadata:', error);
        throw error;
    }
}

// === RESOURCE DISPLAY ===
export function loadResource(type, ref, displayName) {
    const playerDiv = elements.youtubePlayer;
    if (type === 'Video_YouTube') {
        playerDiv.classList.remove('document-mode');
        // Just use the player loader logic
        import('./player.js').then(module => {
            module.loadYouTubeVideo(null, ref);
        });
    } else {
        // Document / HTML handling
        playerDiv.classList.add('document-mode');
        // Manually clear player (sync) to avoid race condition with async import
        playerDiv.innerHTML = '';

        // Construct path
        const currentFolder = state.selectedClass;
        const path = `${state.docusDir}${currentFolder}/${ref}`;

        // Detect Markdown
        if (ref.toLowerCase().endsWith('.md')) {
            const viewer = document.createElement('div');
            viewer.className = 'markdown-viewer';
            viewer.innerHTML = '<div class="loading"><div class="spinner"></div>Cargando documento...</div>';
            playerDiv.appendChild(viewer);

            fetch(path)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.text();
                })
                .then(text => {
                    // Simple MD rendering (Headers, Code Blocks, Paragraphs) if no library
                    // Since we don't have Marked, we'll wrap in <pre> or do very basic replacement
                    // BUT, to look good, we need at least basic formatting.
                    // For now, let's wrap in pre tag if it's code-heavy, or just text.
                    // Better: Wrap in <pre><code> to preserve formatting and let Prism highlight if possible.
                    // Or just use <pre> style defined in CSS.

                    // Actually, the user wants to SEE the content.
                    // Let's do a very simple parse for H1, H2, Code.
                    let html = text
                        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
                        .replace(/\*\*(.*)\*\*/g, '<b>$1</b>')
                        .replace(/\n/g, '<br>');

                    viewer.innerHTML = html;
                    if (window.Prism) window.Prism.highlightAllUnder(viewer);
                })
                .catch(err => {
                    console.error('Error loading MD:', err);
                    viewer.innerHTML = `<div class="error-message">Error al cargar el documento: ${err.message}</div>`;
                });
        } else {
            // Iframe for PDF/HTML
            const iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.src = path;
            playerDiv.appendChild(iframe);
        }
    }
}
window.loadResource = loadResource; // Expose for HTML onclicks
