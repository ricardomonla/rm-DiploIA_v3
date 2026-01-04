// Main application logic for the dynamic web page
document.addEventListener('DOMContentLoaded', function() {
    // === CONFIGURATION & CONSTANTS ===
    const CONFIG = {
        allowedExtensions: ['.pdf', '.md', '.yaml', '.yml'],
        youtubeBaseUrl: 'https://www.youtube.com/embed/',
        apiEndpoints: {
            docusConfig: 'docus.json'
        }
    };

    // === STATE MANAGEMENT ===
    const state = {
        classesData: { clases: [] },
        currentPlayer: null,
        selectedClass: null,
        docusDir: '' // Will be loaded from docus.json
    };

    // === DOM ELEMENTS ===
    const elements = {
        classSelector: document.getElementById('class-selector'),
        youtubePlayer: document.getElementById('youtube-player'),
        documentsList: document.getElementById('documents-list'),
        selectedClassTitle: document.getElementById('selected-class-title')
    };

    // === INITIALIZATION ===
    init();

    // === MAIN FUNCTIONS ===
    async function init() {
        try {
            await loadDocusConfig();
            await loadClassesData();
            populateDropdown();
            autoSelectClass();
            setupEventListeners();
        } catch (error) {
            console.error('Initialization error:', error);
            showError('Error al inicializar la aplicación');
        }
    }

    function setupEventListeners() {
        elements.classSelector.addEventListener('change', handleClassSelection);
        elements.classSelector.addEventListener('change', (e) => {
            localStorage.setItem('selectedClass', e.target.value);
        });
    }

    // === CONFIGURATION LOADING ===
    async function loadDocusConfig() {
        try {
            const response = await fetch(CONFIG.apiEndpoints.docusConfig);
            const config = await response.json();
            
            state.docusDir = config.docus_dir;
            CONFIG.allowedExtensions = config.allowed_extensions || ['.pdf', '.md', '.yaml', '.yml'];
            
            console.log('Docus config loaded:', {
                docusDir: state.docusDir,
                allowedExtensions: CONFIG.allowedExtensions
            });
            
        } catch (error) {
            console.error('Error loading docus config:', error);
        }
    }

    // === DATA LOADING ===
    async function loadClassesData() {
        try {
            console.log('Loading classes data from subdirectories...');
            
            const subdirectories = await fetchSubdirectories();
            
            state.classesData.clases = await Promise.all(
                subdirectories.map(dirName => loadClassData(dirName))
            );
            
            console.log('Classes data loaded:', state.classesData);
            
        } catch (error) {
            console.error('Error loading classes data:', error);
            throw error;
        }
    }

    async function fetchSubdirectories() {
        const response = await fetch(state.docusDir);
        if (!response.ok) throw new Error('Failed to load classes directory');
        
        const html = await response.text();
        const regex = /href="([^"]+)"/g;
        const subdirectories = [];
        let match;
        
        while ((match = regex.exec(html)) !== null) {
            const href = match[1];
            if (href && href.endsWith('/') && !href.includes('..')) {
                const dirName = decodeURIComponent(href.replace('/', ''));
                if (dirName.startsWith('C') && dirName.includes('_')) {
                    subdirectories.push(dirName);
                }
            }
        }
        
        return subdirectories;
    }

    async function loadClassData(dirName) {
        try {
            const [dataResponse, docsResponse] = await Promise.all([
                fetch(`${state.docusDir}${dirName}/data.json`),
                fetch(`${state.docusDir}${dirName}/`)
            ]);

            const data = dataResponse.ok ? await dataResponse.json() : {};
            const docs = docsResponse.ok ? await extractDocuments(docsResponse) : [];

            return {
                nombre: dirName,
                youtube_id: data.youtube_id || '',
                campus_id: data.campus_id || '',
                class_number: data.class_number || '',
                class_name: data.class_name || '',
                class_date: data.class_date || '',
                docus: docs
            };

        } catch (error) {
            console.error(`Error loading data for ${dirName}:`, error);
            return {
                nombre: dirName,
                youtube_id: '',
                campus_id: '',
                class_number: '',
                class_name: '',
                docus: []
            };
        }
    }

    async function extractDocuments(response) {
        const html = await response.text();
        const regex = /href="([^"]+)"/g;
        const documents = [];
        let match;

        while ((match = regex.exec(html)) !== null) {
            const docHref = match[1];
            if (docHref && !docHref.includes('..') && !docHref.endsWith('/')) {
                const isAllowed = CONFIG.allowedExtensions.some(ext => docHref.endsWith(ext));
                if (isAllowed) {
                    documents.push(decodeURIComponent(docHref));
                }
            }
        }

        return documents;
    }

    // === UI MANAGEMENT ===
    function populateDropdown() {
        elements.classSelector.innerHTML = '<option value="">Seleccione una clase</option>';
        
        if (state.classesData.clases?.length > 0) {
            for (const clase of state.classesData.clases) {
                const option = createClassOption(clase);
                elements.classSelector.appendChild(option);
            }
        }
    }

    function createClassOption(clase) {
        const option = document.createElement('option');
        option.value = clase.nombre;
        option.textContent = formatClassName(clase);
        return option;
    }

    function formatClassName(clase) {
        if (clase.class_number && clase.class_name) {
            const classNum = String(clase.class_number).padStart(2, '0');
            return `C${classNum} - ${clase.class_name}`;
        }
        return clase.nombre.replace('C', 'Clase ').replace(/_/g, ' ');
    }

    function updateClassTitle(title) {
        if (elements.selectedClassTitle) {
            elements.selectedClassTitle.textContent = title;
        }
    }

    function autoSelectClass() {
        const savedClass = localStorage.getItem('selectedClass');
        if (savedClass) {
            elements.classSelector.value = savedClass;
            handleClassSelection();
        } else if (state.classesData.clases?.[0]) {
            elements.classSelector.value = state.classesData.clases[0].nombre;
            handleClassSelection();
        }
    }

    function handleClassSelection() {
        const selectedClassName = elements.classSelector.value;
        if (!selectedClassName) {
            clearPlayer();
            clearDocuments();
            updateClassTitle('Seleccionar una clase');
            return;
        }
        
        const selectedClass = state.classesData.clases.find(clase => clase.nombre === selectedClassName);
        if (selectedClass) {
            updateClassTitle(formatClassName(selectedClass));
            loadYouTubeVideo(selectedClass);
            displayDocuments(selectedClass);
        }
    }

    // === PLAYER MANAGEMENT ===
    function loadYouTubeVideo(clase) {
        clearPlayer();
        
        if (!clase.youtube_id) {
            showError('No YouTube video available for this class');
            return;
        }
        
        const iframe = createYouTubeIframe(clase.youtube_id);
        elements.youtubePlayer.appendChild(iframe);
        state.currentPlayer = iframe;
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

    function clearPlayer() {
        if (state.currentPlayer && elements.youtubePlayer.contains(state.currentPlayer)) {
            elements.youtubePlayer.removeChild(state.currentPlayer);
            state.currentPlayer = null;
        }
    }

    // === DOCUMENT MANAGEMENT ===
    function displayDocuments(clase) {
        clearDocuments();
        
        if (!clase.docus?.length) {
            const noDocs = createNoDocumentsMessage();
            elements.documentsList.appendChild(noDocs);
        }
        
        if (clase.youtube_id?.trim()) {
            const youtubeButton = createDocumentButton(`📺 Clase ${clase.class_date}`, () => loadYouTubeVideo(clase));
            elements.documentsList.appendChild(youtubeButton);
        }
        
        if (clase.docus?.length > 0) {
            for (const doc of clase.docus) {
                const docButton = createDocumentButton(
                    `${getDocumentIcon(doc)} ${formatDocumentName(doc)}`,
                    () => previewDocument(clase.nombre, doc)
                );
                elements.documentsList.appendChild(docButton);
            }
        }
    }

    function createDocumentButton(text, onClick) {
        const button = document.createElement('button');
        button.className = 'document-item';
        button.textContent = text;
        button.onclick = onClick;
        return button;
    }

    function createNoDocumentsMessage() {
        const message = document.createElement('p');
        message.textContent = 'No hay documentos disponibles para esta clase.';
        message.style.color = '#666';
        message.style.fontStyle = 'italic';
        return message;
    }

    function previewDocument(className, docName) {
        clearPlayer();
        
        const docPath = `${state.docusDir}${className}/${docName}`;
        
        if (docName.endsWith('.pdf')) {
            loadPDFDocument(docPath);
        } else if (docName.endsWith('.md')) {
            loadMarkdownDocument(docPath, className, docName);
        } else if (docName.endsWith('.yaml') || docName.endsWith('.yml')) {
            loadYAMLDocument(docPath);
        } else {
            showError('Document type not supported for preview');
        }
    }

    function loadPDFDocument(docPath) {
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.backgroundColor = '#f8f9fa';
        container.style.borderRadius = '8px';
        container.style.overflow = 'hidden';
        
        const embed = document.createElement('embed');
        embed.src = docPath;
        embed.type = 'application/pdf';
        embed.width = '100%';
        embed.height = '100%';
        
        container.appendChild(embed);
        elements.youtubePlayer.appendChild(container);
        state.currentPlayer = container;
    }

    async function loadMarkdownDocument(docPath, className, docName) {
        try {
            const response = await fetch(docPath);
            if (!response.ok) throw new Error('Failed to load document');
            
            const markdown = await response.text();
            createMarkdownViewerWithEdit(className, docName, markdown);
        } catch (error) {
            showError('Error loading document: ' + error.message);
        }
    }

    async function loadYAMLDocument(docPath) {
        try {
            const response = await fetch(docPath);
            if (!response.ok) throw new Error('Failed to load document');
            
            const text = await response.text();
            const pre = document.createElement('pre');
            pre.textContent = text;
            pre.style.whiteSpace = 'pre-wrap';
            pre.style.padding = '20px';
            pre.style.backgroundColor = '#f8f9fa';
            pre.style.borderRadius = '5px';
            pre.style.height = '100%';
            pre.style.overflow = 'auto';
            pre.style.fontFamily = 'monospace';
            pre.style.color = '#333';
            
            elements.youtubePlayer.appendChild(pre);
            state.currentPlayer = pre;
        } catch (error) {
            showError('Error loading document: ' + error.message);
        }
    }

    // === MARKDOWN EDITOR ===
    function createMarkdownViewerWithEdit(className, docName, markdownContent) {
        clearPlayer();
        
        const viewerContainer = createMarkdownContainer();
        const actionBar = createActionBar(className, docName, markdownContent);
        const preview = createMarkdownPreview(markdownContent);
        
        viewerContainer.appendChild(actionBar);
        viewerContainer.appendChild(preview);
        
        elements.youtubePlayer.appendChild(viewerContainer);
        state.currentPlayer = viewerContainer;
    }

    function createMarkdownContainer() {
        const container = document.createElement('div');
        container.className = 'markdown-viewer-container';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = '100%';
        container.style.gap = '10px';
        return container;
    }

    function createActionBar(className, docName, markdownContent) {
        const actionBar = document.createElement('div');
        actionBar.style.display = 'flex';
        actionBar.style.justifyContent = 'flex-end';
        actionBar.style.padding = '5px';
        actionBar.style.backgroundColor = '#f0f0f0';
        actionBar.style.borderRadius = '5px';
        
        const editButton = createToolbarButton('✏️ Editar Markdown', () => {
            createMarkdownEditor(className, docName, markdownContent);
        });
        
        actionBar.appendChild(editButton);
        return actionBar;
    }

    function createMarkdownPreview(markdownContent) {
        const preview = document.createElement('div');
        preview.className = 'markdown-viewer';
        preview.style.flex = '1';
        preview.style.padding = '20px';
        preview.style.backgroundColor = '#f8f9fa';
        preview.style.borderRadius = '5px';
        preview.style.overflow = 'auto';
        preview.style.textAlign = 'left';
        preview.innerHTML = convertMarkdownToHTML(markdownContent);
        return preview;
    }

    function createMarkdownEditor(className, docName, markdownContent) {
        clearPlayer();
        
        const editorContainer = createMarkdownContainer();
        const toolbar = createEditorToolbar(className, docName);
        const editorPreviewContainer = createEditorPreviewContainer(className, docName);
        
        // Initialize editor with content
        const editor = editorPreviewContainer.querySelector('.markdown-editor');
        editor.value = markdownContent;
        
        // Initial preview
        const preview = editorPreviewContainer.querySelector('.markdown-preview');
        preview.innerHTML = convertMarkdownToHTML(markdownContent);
        
        editorContainer.appendChild(toolbar);
        editorContainer.appendChild(editorPreviewContainer);
        
        elements.youtubePlayer.appendChild(editorContainer);
        state.currentPlayer = editorContainer;
    }

    function createEditorToolbar(className, docName) {
        const toolbar = document.createElement('div');
        toolbar.className = 'markdown-toolbar';
        toolbar.style.display = 'flex';
        toolbar.style.gap = '5px';
        toolbar.style.padding = '5px';
        toolbar.style.backgroundColor = '#f0f0f0';
        toolbar.style.borderRadius = '5px';
        
        const buttons = [
            { text: '🔤', action: () => wrapSelectedText('**', '**') },
            { text: '🔤', action: () => wrapSelectedText('*', '*') },
            { text: '🔗', action: () => wrapSelectedText('[', '](url)') },
            { text: '📜', action: () => insertAtCursor('# ') },
            { text: '💻', action: () => wrapSelectedText('`', '`') },
            { text: '💾', action: () => saveMarkdownFile(className, docName) },
            { text: '🔙', action: () => backToViewer(className, docName) }
        ];
        
        for (const btn of buttons) {
            toolbar.appendChild(createToolbarButton(btn.text, btn.action));
        }
        
        return toolbar;
    }

    function createEditorPreviewContainer(className, docName) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flex = '1';
        container.style.gap = '10px';
        container.style.overflow = 'hidden';
        
        const editor = document.createElement('textarea');
        editor.className = 'markdown-editor';
        editor.style.flex = '1';
        editor.style.padding = '10px';
        editor.style.fontFamily = 'monospace';
        editor.style.fontSize = '14px';
        editor.style.border = '1px solid #ddd';
        editor.style.borderRadius = '5px';
        editor.style.resize = 'none';
        editor.style.overflow = 'auto';
        
        const preview = document.createElement('div');
        preview.className = 'markdown-preview';
        preview.style.flex = '1';
        preview.style.padding = '15px';
        preview.style.backgroundColor = '#f8f9fa';
        preview.style.border = '1px solid #ddd';
        preview.style.borderRadius = '5px';
        preview.style.overflow = 'auto';
        preview.style.textAlign = 'left';
        
        editor.addEventListener('input', () => {
            preview.innerHTML = convertMarkdownToHTML(editor.value);
        });
        
        container.appendChild(editor);
        container.appendChild(preview);
        return container;
    }

    function createToolbarButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.padding = '5px 10px';
        btn.style.backgroundColor = 'var(--primary-color)';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '3px';
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', onClick);
        return btn;
    }

    // === UTILITIES ===
    function wrapSelectedText(prefix, suffix) {
        const editor = document.querySelector('.markdown-editor');
        if (!editor) return;
        
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const selectedText = editor.value.substring(start, end);
        const newText = prefix + selectedText + suffix;
        editor.setRangeText(newText, start, end, 'end');
    }

    function insertAtCursor(text) {
        const editor = document.querySelector('.markdown-editor');
        if (!editor) return;
        
        const pos = editor.selectionStart;
        editor.setRangeText(text, pos, pos, 'end');
    }

    function saveMarkdownFile(className, docName) {
        const editor = document.querySelector('.markdown-editor');
        if (!editor) return;
        
        const content = editor.value;
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = docName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showError('Archivo guardado como: ' + docName);
    }

    function backToViewer(className, docName) {
        const editor = document.querySelector('.markdown-editor');
        if (!editor) return;
        
        createMarkdownViewerWithEdit(className, docName, editor.value);
    }

    function getDocumentIcon(filename) {
        const icons = {
            '.pdf': '📄',
            '.md': '📝',
            '.yaml': '⚙️',
            '.yml': '⚙️'
        };
        const ext = filename.substring(filename.lastIndexOf('.'));
        return icons[ext] || '📁';
    }

    function formatDocumentName(filename) {
        return filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
    }

    function convertMarkdownToHTML(markdown) {
        return markdown
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\\[(.*?)\\]\\((.*?)\\)/g, '<a href="$2" target="_blank">$1</a>')
            .replace(/^\* (.*$)/gm, '<li>$1</li>')
            .replace(/^\- (.*$)/gm, '<li>$1</li>')
            .replace(/^(?!<[a-z])\S.*$/gm, '<p>$&</p>')
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/^---$/gm, '<hr>')
            .replace(/\n\n\n+/g, '\n\n');
    }

    function clearDocuments() {
        elements.documentsList.innerHTML = '';
    }

    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            videoContainer.parentNode.insertBefore(errorElement, videoContainer);
        }
        
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.parentNode.removeChild(errorElement);
            }
        }, 5000);
    }
});