// Main application logic for the dynamic web page
document.addEventListener('DOMContentLoaded', function () {
    // === CONFIGURATION & CONSTANTS ===
    const CONFIG = {
        version: '7.4',
        apiEndpoints: {
            docusConfig: 'docus.json'
        }
    };

    // === PROGRESS TRACKING SYSTEM ===
    class ProgressTracker {
        constructor() {
            this.storageKey = 'diploia_progress_v1';
            this.progressData = this.loadProgressData();
        }

        loadProgressData() {
            try {
                const saved = localStorage.getItem(this.storageKey);
                return saved ? JSON.parse(saved) : {
                    classes: {},
                    lastActivity: null
                };
            } catch (error) {
                console.warn('Error loading progress data:', error);
                return { classes: {}, lastActivity: null };
            }
        }

        saveProgressData() {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(this.progressData));
            } catch (error) {
                console.warn('Error saving progress data:', error);
            }
        }

        getClassProgress(classId) {
            return this.progressData.classes[classId] || {
                lastViewed: null,
                videoProgress: 0,
                currentResource: null,
                resources: {}
            };
        }

        updateClassProgress(classId, updates) {
            if (!this.progressData.classes[classId]) {
                this.progressData.classes[classId] = {
                    lastViewed: null,
                    videoProgress: 0,
                    currentResource: null,
                    resources: {}
                };
            }

            Object.assign(this.progressData.classes[classId], updates);
            this.progressData.lastActivity = new Date().toISOString();
            this.saveProgressData();
        }

        updateResourceProgress(classId, resourceType, resourceId, progress) {
            const classProgress = this.getClassProgress(classId);
            if (!classProgress.resources[resourceType]) {
                classProgress.resources[resourceType] = {};
            }

            classProgress.resources[resourceType][resourceId] = {
                ...classProgress.resources[resourceType][resourceId],
                ...progress,
                lastUpdated: new Date().toISOString()
            };

            this.updateClassProgress(classId, { resources: classProgress.resources });
        }

        getCurrentClassProgress(classId) {
            return this.getClassProgress(classId);
        }

        restoreClassProgress(classId) {
            return this.getClassProgress(classId);
        }

        clearProgress(classId) {
            delete this.progressData.classes[classId];
            this.saveProgressData();
        }
    }

    // === STATE MANAGEMENT ===
    const state = {
        classesData: { cursados: [] },
        currentPlayer: null,
        selectedClass: null,
        docusDir: '',
        progressTracker: new ProgressTracker(),
        manifest: null,
        isDarkMode: localStorage.getItem('darkMode') === null ? true : localStorage.getItem('darkMode') === 'true',
        isSidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
        isGitHubPages: window.location.hostname.includes('github.io'),
        isAdminMode: false,
        expandedNodes: new Set()
    };

    // === DOM ELEMENTS ===
    const elements = {
        youtubePlayer: document.getElementById('youtube-player'),
        selectedClassTitle: document.getElementById('selected-class-title'),
        classSearch: document.getElementById('class-search'),
        darkModeToggle: document.getElementById('dark-mode-toggle'),
        sidebarToggleBtn: document.getElementById('sidebar-toggle-btn'),
        sidebar: document.getElementById('documents-sidebar'),
        adminModeToggle: document.getElementById('admin-mode-toggle'),
        sidebarTree: document.getElementById('sidebar-tree'),
        adminModal: document.getElementById('admin-modal'),
        closeModal: document.getElementById('close-modal'),
        saveAllBtn: document.getElementById('save-all-btn'),
        addCursadoBtn: document.getElementById('add-cursado-btn'),
        openMgmtBtn: document.getElementById('open-mgmt-btn')
    };

    // === INITIALIZATION ===
    init();

    // === MAIN FUNCTIONS ===
    async function init() {
        try {
            applyInitialUIState();
            await loadDocusConfig();
            await loadClassesData();
            renderSidebarTree();
            await autoSelectClassAtRuntime();
            setupEventListeners();
            checkStaticEnvironment();
        } catch (error) {
            console.error('Initialization error:', error);
            showError('Error al inicializar la aplicación');
        }
    }

    function applyInitialUIState() {
        if (state.isDarkMode) document.body.classList.add('dark-mode');
        if (state.isSidebarCollapsed) elements.sidebar.classList.add('collapsed');
        updateDarkModeIcon();

        // Update version tag from CONFIG
        const versionTag = document.querySelector('.version-tag');
        if (versionTag) versionTag.textContent = `v${CONFIG.version}`;
    }

    function checkStaticEnvironment() {
        if (state.isGitHubPages) {
            console.info('Running on GitHub Pages. Management features are disabled.');
            if (elements.adminModeToggle) {
                elements.adminModeToggle.title = 'Lectura (GitHub)';
                elements.adminModeToggle.style.opacity = '0.3';
                elements.adminModeToggle.style.cursor = 'not-allowed';
            }
        }
    }

    function setupEventListeners() {
        // Search Filter
        if (elements.classSearch) elements.classSearch.addEventListener('input', handleSearch);

        // Dark Mode Toggle
        if (elements.darkModeToggle) elements.darkModeToggle.addEventListener('click', toggleDarkMode);

        // Sidebar Toggle
        if (elements.sidebarToggleBtn) elements.sidebarToggleBtn.addEventListener('click', toggleSidebar);

        // Admin Mode Toggle
        if (elements.adminModeToggle) elements.adminModeToggle.addEventListener('click', toggleAdminMode);

        // Modal Controls
        if (elements.closeModal) elements.closeModal.onclick = () => elements.adminModal.style.display = 'none';
        if (elements.saveAllBtn) elements.saveAllBtn.onclick = () => saveChanges();
        if (elements.addCursadoBtn) elements.addCursadoBtn.onclick = () => addNewCursado();
        if (elements.openMgmtBtn) elements.openMgmtBtn.onclick = () => openAdminModal();

        window.addEventListener('beforeunload', saveCurrentProgress);
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    function handleSearch() {
        const term = elements.classSearch.value.toLowerCase();
        const treeNodes = elements.sidebarTree.querySelectorAll('.tree-node');

        treeNodes.forEach(node => {
            const label = node.querySelector('.node-label').textContent.toLowerCase();
            const isMatch = label.includes(term);
            const parentNode = node.closest('.course-node');

            if (node.classList.contains('class-node')) {
                node.style.display = isMatch ? 'block' : 'none';
                if (isMatch && parentNode) {
                    parentNode.style.display = 'block';
                    parentNode.classList.add('expanded');
                }
            }
        });

        // Hide courses with no visible classes if they don't match either
        const courseNodes = elements.sidebarTree.querySelectorAll('.course-node');
        courseNodes.forEach(course => {
            const courseLabel = course.querySelector('.node-label').textContent.toLowerCase();
            const hasVisibleClasses = Array.from(course.querySelectorAll('.class-node')).some(cn => cn.style.display !== 'none');

            if (!courseLabel.includes(term) && !hasVisibleClasses) {
                course.style.display = 'none';
            } else {
                course.style.display = 'block';
            }
        });
    }

    function toggleDarkMode() {
        state.isDarkMode = !state.isDarkMode;
        document.body.classList.toggle('dark-mode', state.isDarkMode);
        localStorage.setItem('darkMode', state.isDarkMode);
        updateDarkModeIcon();
    }

    function updateDarkModeIcon() {
        const iconName = state.isDarkMode ? 'sun' : 'moon';
        elements.darkModeToggle.innerHTML = `<i data-lucide="${iconName}"></i>`;
        lucide.createIcons();
    }

    function toggleSidebar() {
        state.isSidebarCollapsed = !state.isSidebarCollapsed;
        elements.sidebar.classList.toggle('collapsed', state.isSidebarCollapsed);
        localStorage.setItem('sidebarCollapsed', state.isSidebarCollapsed);

        const iconName = state.isSidebarCollapsed ? 'book' : 'book-open';
        elements.sidebarToggleBtn.innerHTML = `<i data-lucide="${iconName}"></i>`;
        lucide.createIcons();
    }

    // === CONFIGURATION LOADING ===
    async function loadDocusConfig() {
        try {
            console.log('Loading unified config from index.json...');
            const response = await fetch(`index.json?v=${Date.now()}`);
            const config = await response.json();

            // Guardar el manifiesto en el estado para reuso
            state.manifest = config;

            state.docusDir = config.docus_dir;
            CONFIG.allowedExtensions = config.allowed_extensions;
            CONFIG.campusUrl = config.url_base_campus || '';
            CONFIG.youtubeBaseUrl = config.url_base_youtube || 'https://www.youtube.com/embed/';
        } catch (error) {
            console.error('Error loading config:', error);
            showError('Error al cargar la configuración');
        }
    }

    // === DATA LOADING ===
    async function loadClassesData() {
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


    function getAllClasses() {
        let all = [];
        state.classesData.cursados.forEach(curs => {
            all = all.concat(curs.clases);
        });
        return all;
    }

    function formatClassName(clase) {
        let name = clase.nombre;
        if (clase.class_number) {
            const classNum = String(clase.class_number).padStart(2, '0');
            name = `C${classNum} - ${clase.nombre}`;
        }

        // Show completion marker
        const progress = state.progressTracker.getClassProgress(clase.folder);
        const videoRes = Object.values(progress.resources.video || {})[0];
        if (videoRes && videoRes.progress > 90) {
            name = '✨ ' + name;
        }

        return name;
    }

    function updateClassTitle(title) {
        if (elements.selectedClassTitle) {
            elements.selectedClassTitle.textContent = title;
        }
    }

    function renderSidebarTree() {
        if (!elements.sidebarTree) return;
        elements.sidebarTree.innerHTML = '';

        state.classesData.cursados.forEach((cursado, cIndex) => {
            const courseNode = createTreeNode('course', cursado.nombre, cIndex);
            const courseContent = courseNode.querySelector('.node-content');

            cursado.clases.forEach((clase, clIndex) => {
                const classNode = createTreeNode('class', formatClassName(clase), [cIndex, clIndex], clase.folder);
                courseContent.appendChild(classNode);

                // If admin mode, show resources in tree as well
                if (state.isAdminMode) {
                    const classContent = classNode.querySelector('.node-content');
                    (clase.recursos || []).forEach((recurso, rIndex) => {
                        const resNode = createResourceNode(recurso, [cIndex, clIndex, rIndex]);
                        classContent.appendChild(resNode);
                    });

                    // Add "＋ Recurso" button in admin mode
                    const addResBtn = document.createElement('div');
                    addResBtn.className = 'tree-actions admin-only';
                    addResBtn.style.display = 'flex';
                    addResBtn.style.padding = '5px 20px';
                    addResBtn.innerHTML = `
                        <button class="action-btn" onclick="showResourceMenu(event, ${cIndex}, ${clIndex})">＋ Recurso</button>
                    `;
                    classContent.appendChild(addResBtn);
                }
            });

            elements.sidebarTree.appendChild(courseNode);
        });

        if (window.lucide) lucide.createIcons();
    }

    function createTreeNode(type, label, index, folder = null) {
        const node = document.createElement('div');
        node.className = `tree-node ${type}-node`;
        if (state.expandedNodes.has(JSON.stringify(index))) {
            node.classList.add('expanded');
        }

        const isSelected = folder && state.selectedClass === folder;
        const icon = type === 'course' ? 'book' : 'calendar';

        node.innerHTML = `
            <div class="node-header ${isSelected ? 'active' : ''}" onclick="handleNodeClick(event, '${type}', ${JSON.stringify(index)}, '${folder || ''}')">
                <i data-lucide="chevron-right" class="chevron-icon"></i>
                <i data-lucide="${icon}"></i>
                <span class="node-label">${label}</span>
                <div class="node-actions admin-only">
                    ${type === 'course' ? `
                        <button class="action-btn-mini" onclick="addClaseToCursado(event, ${index})" title="Añadir Clase"><i data-lucide="plus"></i></button>
                    ` : `
                        <button class="action-btn-mini" onclick="editNodeName(event, 'clase', ${JSON.stringify(index)})" title="Editar"><i data-lucide="edit-2"></i></button>
                        <button class="action-btn-mini" onclick="deleteClass(event, ${JSON.stringify(index)})" title="Borrar"><i data-lucide="trash-2"></i></button>
                    `}
                </div>
            </div>
            <div class="node-content"></div>
        `;
        return node;
    }

    function createResourceNode(recurso, path) {
        const div = document.createElement('div');
        div.className = 'tree-resource';
        const icon = recurso.tipo === 'Video_YouTube' ? 'youtube' : 'file-text';
        div.innerHTML = `
            <i data-lucide="${icon}" style="width: 14px; height: 14px;"></i>
            <span>${recurso.tipo === 'Video_YouTube' ? 'Video Clase' : recurso.archivo}</span>
            <div class="node-actions admin-only">
                <button class="action-btn-mini" onclick="deleteResource(event, ${JSON.stringify(path)})"><i data-lucide="x"></i></button>
            </div>
        `;
        return div;
    }

    window.handleNodeClick = async (event, type, index, folder) => {
        event.stopPropagation();

        const node = event.currentTarget.closest('.tree-node');
        const isExpanded = node.classList.toggle('expanded');

        const indexKey = JSON.stringify(index);
        if (isExpanded) {
            state.expandedNodes.add(indexKey);
        } else {
            state.expandedNodes.delete(indexKey);
        }

        if (type === 'class' && folder) {
            await selectTreeClass(folder);
        }
    };

    async function selectTreeClass(folder) {
        if (state.selectedClass === folder && !state.isAdminMode) return;

        state.selectedClass = folder;
        localStorage.setItem('selectedClass', folder);

        // UI update
        document.querySelectorAll('.class-node .node-header').forEach(el => el.classList.remove('active'));
        const activeNode = elements.sidebarTree.querySelector(`.class-node [onclick*="'${folder}'"]`);
        if (activeNode) activeNode.classList.add('active');

        // Logic from old handleClassSelection
        await loadDocusConfig();
        await loadClassesData();

        const allClasses = getAllClasses();
        const selectedClass = allClasses.find(clase => clase.folder === folder);

        if (selectedClass) {
            updateClassTitle(formatClassName(selectedClass));
            displayDocuments(selectedClass);

            const firstVideo = selectedClass.recursos?.find(r => r.tipo === 'Video_YouTube');
            if (firstVideo?.id_ytb) {
                loadYouTubeVideo(selectedClass, firstVideo.id_ytb);
            }
        }
    }

    async function autoSelectClassAtRuntime() {
        const savedClass = localStorage.getItem('selectedClass');
        const allClasses = getAllClasses();
        const folder = savedClass || (allClasses[0] ? allClasses[0].folder : null);
        if (folder) {
            await selectTreeClass(folder);
            // Expand parent course
            const courseNode = elements.sidebarTree.querySelector('.course-node');
            if (courseNode) courseNode.classList.add('expanded');
        }
    }

    function toggleAdminMode() {
        if (state.isGitHubPages) {
            alert('La gestión está deshabilitada en GitHub Pages.');
            return;
        }
        state.isAdminMode = !state.isAdminMode;
        document.body.classList.toggle('admin-mode-active', state.isAdminMode);

        // Update toggle icon
        const icon = state.isAdminMode ? 'shield-check' : 'shield';
        elements.adminModeToggle.innerHTML = `<i data-lucide="${icon}"></i>`;

        renderSidebarTree();
        if (window.lucide) lucide.createIcons();
    }

    // === PLAYER MANAGEMENT ===
    function loadYouTubeVideo(clase, videoId) {
        clearPlayer();

        const id = videoId || clase.recursos?.find(r => r.tipo === 'Video_YouTube')?.id_ytb;
        if (!id) {
            return;
        }

        const iframe = createYouTubeIframe(id);
        elements.youtubePlayer.appendChild(iframe);
        state.currentPlayer = iframe;

        // Initialize YouTube API for progress tracking
        initializeYouTubeAPI(id);
    }

    // YouTube API functions reactivated for progress tracking
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
            const player = new window.YT.Player(iframe, {
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });

            state.youtubePlayer = player;
            restoreVideoProgress(videoId);
        }
    }

    function onPlayerStateChange(event) {
        const videoId = state.selectedClass ? state.classesData.cursados.flatMap(c => c.clases).find(c => c.folder === state.selectedClass)?.recursos?.find(r => r.tipo === 'Video_YouTube')?.id_ytb : null;
        if (!videoId) return;

        if (event.data === window.YT.PlayerState.PLAYING) {
            state.lastPlayerState = window.YT.PlayerState.PLAYING;
            startProgressTracking(videoId);
        } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
            state.lastPlayerState = event.data;
            saveVideoProgress(videoId);
            if (state.progressInterval) clearInterval(state.progressInterval);
        }
    }

    function startProgressTracking(videoId) {
        if (state.progressInterval) clearInterval(state.progressInterval);
        state.progressInterval = setInterval(() => {
            saveVideoProgress(videoId);
        }, 5000);
    }

    function saveVideoProgress(videoId) {
        if (!state.youtubePlayer || !state.selectedClass || !state.youtubePlayer.getCurrentTime) return;

        const currentTime = state.youtubePlayer.getCurrentTime();
        const duration = state.youtubePlayer.getDuration();
        const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

        state.progressTracker.updateResourceProgress(
            state.selectedClass,
            'video',
            videoId,
            {
                currentTime: currentTime,
                duration: duration,
                progress: progress,
                playerState: state.lastPlayerState || window.YT.PlayerState.PAUSED
            }
        );

        updateVideoProgressUI(progress);
        updateSidebarVideoProgress(progress);
    }

    function updateSidebarVideoProgress(progress) {
        // Find corresponding class node in tree and update if needed
        // For now, we rely on the overlay and tree refresh on save
    }

    function updateVideoProgressUI(progress) {
        let progressDisplay = document.getElementById('video-progress-percentage');
        if (!progressDisplay) {
            progressDisplay = document.createElement('div');
            progressDisplay.id = 'video-progress-percentage';
            progressDisplay.className = 'video-progress-overlay';
            elements.youtubePlayer.style.position = 'relative';
            elements.youtubePlayer.appendChild(progressDisplay);
        }
        progressDisplay.textContent = `Visto: ${Math.round(progress)}%`;
    }

    function restoreVideoProgress(videoId) {
        if (!state.selectedClass) return;

        const classProgress = state.progressTracker.getClassProgress(state.selectedClass);
        const videoProgress = classProgress.resources.video?.[videoId];

        if (videoProgress && videoProgress.currentTime > 0) {
            setTimeout(() => {
                if (state.youtubePlayer && state.youtubePlayer.seekTo) {
                    state.youtubePlayer.seekTo(videoProgress.currentTime);
                    if (videoProgress.playerState === window.YT.PlayerState.PLAYING) {
                        state.youtubePlayer.playVideo();
                    }
                }
            }, 1000);
        }

        if (videoProgress && videoProgress.progress) {
            updateVideoProgressUI(videoProgress.progress);
        }
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
        const progressDisplay = document.getElementById('video-progress-percentage');
        if (progressDisplay) progressDisplay.remove();
        if (state.progressInterval) {
            clearInterval(state.progressInterval);
            state.progressInterval = null;
        }
    }

    // === DOCUMENT MANAGEMENT ===
    function displayDocuments(clase) {
        // Obsolete: resources are now rendered directly in the sidebar tree
    }

    async function loadResource(tipo, id, label) {
        clearPlayer();
        const allClasses = getAllClasses();
        const clase = allClasses.find(c => c.folder === state.selectedClass);
        if (!clase) return;

        if (tipo === 'Video_YouTube') {
            loadYouTubeVideo(clase, id);
        } else {
            const docPath = `${state.docusDir}${clase.folder}/${id}`;
            const ext = id.substring(id.lastIndexOf('.')).toLowerCase();

            if (ext === '.pdf') loadPDFDocument(docPath);
            else if (ext === '.md') await loadMarkdownDocument(docPath, clase.nombre, id);
            else if (ext === '.mp4') loadVideoDocument(docPath);
            else if (['.yaml', '.yml'].includes(ext)) await loadYAMLDocument(docPath);
            else window.open(docPath, '_blank');

            state.progressTracker.updateResourceProgress(
                state.selectedClass,
                'document',
                id,
                {
                    lastAccessed: new Date().toISOString(),
                    type: ext.substring(1)
                }
            );
        }
    }
    window.loadResource = loadResource;

    function previewDocument(className, docName) {
        loadResource('Documento', docName, docName);
    }


    function loadCampusContent(url) {
        clearPlayer();

        const iframeContainer = document.createElement('div');
        iframeContainer.style.width = '100%';
        iframeContainer.style.height = '100%';
        iframeContainer.style.backgroundColor = '#f8f9fa';
        iframeContainer.style.borderRadius = '8px';
        iframeContainer.style.overflow = 'hidden';
        iframeContainer.style.position = 'relative';

        // Loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.textContent = 'Cargando contenido del campus...';
        loadingIndicator.style.position = 'absolute';
        loadingIndicator.style.top = '50%';
        loadingIndicator.style.left = '50%';
        loadingIndicator.style.transform = 'translate(-50%, -50%)';
        loadingIndicator.style.padding = '20px';
        loadingIndicator.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        loadingIndicator.style.borderRadius = '8px';
        loadingIndicator.style.zIndex = '100';
        loadingIndicator.style.textAlign = 'center';

        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        iframe.style.border = 'none';
        iframe.style.opacity = '0';

        // Show loading indicator until iframe loads
        iframe.onload = function () {
            iframe.style.opacity = '1';
            iframeContainer.removeChild(loadingIndicator);
        };

        iframe.onerror = function () {
            loadingIndicator.textContent = 'Error al cargar el contenido del campus';
            loadingIndicator.style.color = '#dc3545';

            const retryButton = document.createElement('button');
            retryButton.textContent = 'Reintentar';
            retryButton.style.marginTop = '10px';
            retryButton.style.padding = '5px 15px';
            retryButton.onclick = () => loadCampusContent(url);
            loadingIndicator.appendChild(document.createElement('br'));
            loadingIndicator.appendChild(retryButton);
        };

        const header = document.createElement('div');
        header.style.padding = '10px';
        header.style.backgroundColor = '#f0f0f0';
        header.style.borderBottom = '1px solid #ddd';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';

        const title = document.createElement('strong');
        title.textContent = 'Contenido del Campus Virtual';

        const closeButton = document.createElement('button');
        closeButton.textContent = '✕ Cerrar';
        closeButton.style.padding = '5px 10px';
        closeButton.style.backgroundColor = '#dc3545';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '3px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => clearPlayer();

        header.appendChild(title);
        header.appendChild(closeButton);

        iframeContainer.appendChild(header);
        iframeContainer.appendChild(iframe);
        iframeContainer.appendChild(loadingIndicator);

        elements.youtubePlayer.appendChild(iframeContainer);
        state.currentPlayer = iframeContainer;
    }

    function createDocumentButton(iconName, text, onClick, isAccessed = false, tooltip = '') {
        const button = document.createElement('button');
        button.className = 'document-item';
        button.title = tooltip;

        const iconSpan = document.createElement('span');
        iconSpan.className = 'item-icon';
        iconSpan.innerHTML = `<i data-lucide="${iconName}"></i>`;

        const textSpan = document.createElement('span');
        textSpan.className = 'item-label';
        textSpan.textContent = text;

        button.appendChild(iconSpan);
        button.appendChild(textSpan);

        if (isAccessed) {
            const checkSpan = document.createElement('span');
            checkSpan.className = 'item-check';
            checkSpan.innerHTML = `<i data-lucide="check-circle-2" style="width: 14px; height: 14px;"></i>`;
            button.appendChild(checkSpan);
        }

        button.onclick = onClick;
        return button;
    }

    function highlightActiveSidebarItem(type, id) {
        // Remove active class from all items
        const items = elements.documentsList.querySelectorAll('.document-item');
        items.forEach(item => item.classList.remove('active'));

        // Add active class to corresponding item
        const activeItem = elements.documentsList.querySelector(`.document-item[data-resource-type="${type}"][data-resource-id="${id}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
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
        } else if (docName.endsWith('.mp4')) {
            loadVideoDocument(docPath);
        } else if (docName.endsWith('.yaml') || docName.endsWith('.yml')) {
            loadYAMLDocument(docPath);
        } else {
            showError('Document type not supported for preview');
        }

        // Track document access
        if (state.selectedClass) {
            state.progressTracker.updateResourceProgress(
                state.selectedClass,
                'document',
                docName,
                {
                    lastAccessed: new Date().toISOString(),
                    type: docName.split('.').pop()
                }
            );
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

    function loadVideoDocument(docPath) {
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.backgroundColor = '#f8f9fa';
        container.style.borderRadius = '8px';
        container.style.overflow = 'hidden';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';

        const video = document.createElement('video');
        video.src = docPath;
        video.controls = true;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '100%';

        container.appendChild(video);
        elements.youtubePlayer.appendChild(container);
        state.currentPlayer = container;
    }

    async function loadMarkdownDocument(docPath, className, docName) {
        try {
            const response = await fetch(docPath);
            if (!response.ok) throw new Error('Failed to load document');

            const markdown = await response.text();
            createMarkdownViewerWithEdit(className, docName, markdown);

            // Restore markdown scroll position if available
            restoreMarkdownScrollPosition(className, docName);
        } catch (error) {
            showError('Error loading document: ' + error.message);
        }
    }

    function restoreMarkdownScrollPosition(className, docName) {
        if (!state.selectedClass) return;

        const classProgress = state.progressTracker.getClassProgress(state.selectedClass);
        const docProgress = classProgress.resources.document?.[docName];

        if (docProgress && docProgress.scrollPosition !== undefined) {
            setTimeout(() => {
                const viewer = document.querySelector('.markdown-viewer');
                if (viewer) {
                    viewer.scrollTop = docProgress.scrollPosition;
                }
            }, 100);
        }
    }

    async function loadYAMLDocument(docPath) {
        try {
            const response = await fetch(docPath);
            if (!response.ok) throw new Error('Failed to load document');

            const text = await response.text();
            const pre = document.createElement('pre');
            pre.className = 'language-yaml';
            const code = document.createElement('code');
            code.textContent = text;
            pre.appendChild(code);

            pre.style.whiteSpace = 'pre-wrap';
            pre.style.padding = '20px';
            pre.style.backgroundColor = 'var(--card-bg)';
            pre.style.borderRadius = '5px';
            pre.style.height = '100%';
            pre.style.overflow = 'auto';
            pre.style.fontFamily = 'monospace';
            pre.style.color = 'var(--text-color)';

            elements.youtubePlayer.appendChild(pre);
            state.currentPlayer = pre;

            if (window.Prism) {
                Prism.highlightElement(code);
            }
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
        preview.style.backgroundColor = 'var(--card-bg)';
        preview.style.borderRadius = '5px';
        preview.style.overflow = 'auto';
        preview.style.textAlign = 'left';
        preview.innerHTML = marked.parse(markdownContent);

        // Syntax Highlighting
        if (window.Prism) {
            Prism.highlightAllUnder(preview);
        }

        // Make all links open in new tab
        const links = preview.querySelectorAll('a');
        links.forEach(link => link.setAttribute('target', '_blank'));
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
        preview.innerHTML = marked.parse(markdownContent);
        // Make all links open in new tab
        const links = preview.querySelectorAll('a');
        links.forEach(link => link.setAttribute('target', '_blank'));

        // Add scroll tracking for markdown editor
        editor.addEventListener('scroll', () => {
            if (state.selectedClass) {
                state.progressTracker.updateResourceProgress(
                    state.selectedClass,
                    'document',
                    docName,
                    {
                        scrollPosition: editor.scrollTop,
                        lastUpdated: new Date().toISOString()
                    }
                );
            }
        });

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
            preview.innerHTML = marked.parse(editor.value);
            // Make all links open in new tab
            const links = preview.querySelectorAll('a');
            links.forEach(link => link.setAttribute('target', '_blank'));
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

        // Save current editor content before switching
        if (state.selectedClass) {
            state.progressTracker.updateResourceProgress(
                state.selectedClass,
                'document',
                docName,
                {
                    content: editor.value,
                    lastUpdated: new Date().toISOString()
                }
            );
        }

        createMarkdownViewerWithEdit(className, docName, editor.value);
    }

    function getDocumentIcon(filename) {
        const icons = {
            '.pdf': 'file-text',
            '.md': 'file-edit',
            '.mp4': 'play-circle',
            '.yaml': 'settings',
            '.yml': 'settings'
        };
        const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
        return icons[ext] || 'file';
    }

    function formatDocumentName(filename) {
        return filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
    }


    function clearDocuments() {
        // Obsolete
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

    // === PROGRESS MANAGEMENT FUNCTIONS ===
    function saveCurrentProgress() {
        if (state.selectedClass) {
            const classProgress = state.progressTracker.getCurrentClassProgress(state.selectedClass);

            // Save current resource being viewed
            if (state.currentPlayer) {
                const currentResource = getCurrentResourceInfo();
                if (currentResource) {
                    state.progressTracker.updateClassProgress(state.selectedClass, {
                        currentResource: currentResource,
                        lastViewed: new Date().toISOString()
                    });
                }
            }
        }
    }

    function handleVisibilityChange() {
        if (document.hidden) {
            saveCurrentProgress();
        } else {
            // Restore progress when tab becomes visible
            restoreProgressForCurrentClass();
        }
    }

    function getCurrentResourceInfo() {
        if (!state.currentPlayer) return null;

        // Check if it's a document preview
        const markdownViewer = state.currentPlayer.querySelector('.markdown-viewer');
        if (markdownViewer) {
            return {
                type: 'document',
                id: 'markdown-viewer',
                scrollPosition: markdownViewer.scrollTop
            };
        }

        // Check if it's a PDF
        const pdfEmbed = state.currentPlayer.querySelector('embed[type="application/pdf"]');
        if (pdfEmbed) {
            return {
                type: 'document',
                id: 'pdf-viewer',
                // PDF progress tracking would need additional implementation
                progress: 0
            };
        }

        return null;
    }

    function restoreProgressForCurrentClass() {
        if (!state.selectedClass) return;

        const classProgress = state.progressTracker.restoreClassProgress(state.selectedClass);
        if (classProgress.currentResource) {
            restoreResourceProgress(classProgress.currentResource);
        }
    }

    function restoreResourceProgress(resourceInfo) {
        if (!resourceInfo) return;

        switch (resourceInfo.type) {
            case 'document':
                if (resourceInfo.scrollPosition !== undefined) {
                    // Restore document scroll position
                    setTimeout(() => {
                        const viewer = document.querySelector('.markdown-viewer');
                        if (viewer) {
                            viewer.scrollTop = resourceInfo.scrollPosition;
                        }
                    }, 100);
                }
                break;
        }
    }

    // === TREE MANAGEMENT HANDLERS ===
    window.addClaseToCursado = async (event, cIndex) => {
        if (event) event.stopPropagation();

        const courseNode = elements.sidebarTree.children[cIndex];
        const content = courseNode.querySelector('.node-content');

        // Ensure expanded
        courseNode.classList.add('expanded');
        state.expandedNodes.add(JSON.stringify(cIndex));

        const addContainer = document.createElement('div');
        addContainer.className = 'tree-node class-node temporary-node';
        addContainer.style.padding = '5px 20px';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Nombre de nueva clase...';
        input.className = 'edit-input-inline';
        input.style.width = '100%';

        addContainer.appendChild(input);
        content.insertBefore(addContainer, content.lastElementChild);
        input.focus();

        const finishAdd = async (save) => {
            const name = input.value.trim();
            if (save && name) {
                const newClase = {
                    nombre: name,
                    fecha: new Date().toLocaleDateString('es-ES'),
                    class_number: (state.classesData.cursados[cIndex].clases.length + 1).toString(),
                    folder: name.trim().replace(/\s+/g, '_').toLowerCase(),
                    recursos: [],
                    isLoaded: true
                };
                state.classesData.cursados[cIndex].clases.push(newClase);
                await saveChanges(true);
            } else {
                renderSidebarTree();
            }
        };

        input.onkeydown = (e) => {
            if (e.key === 'Enter') finishAdd(true);
            if (e.key === 'Escape') finishAdd(false);
        };
        input.onblur = () => finishAdd(false);
    };

    window.editNodeName = async (event, type, index) => {
        if (event) event.stopPropagation();

        const header = event.currentTarget.closest('.node-header');
        const labelSpan = header.querySelector('.node-label');
        const originalText = labelSpan.textContent;

        // Disable click while editing
        header.onclick = null;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input-inline';
        input.value = type === 'clase' ? state.classesData.cursados[index[0]].clases[index[1]].nombre : originalText;
        input.style.width = '100%';

        labelSpan.innerHTML = '';
        labelSpan.appendChild(input);
        input.focus();
        input.select();

        const finishEdit = async (save) => {
            const newValue = input.value.trim();
            if (save && newValue && newValue !== originalText) {
                if (type === 'clase') {
                    state.classesData.cursados[index[0]].clases[index[1]].nombre = newValue;
                }
                await saveChanges(true);
            } else {
                renderSidebarTree(); // Refresh to restore original state
            }
        };

        input.onkeydown = (e) => {
            if (e.key === 'Enter') finishEdit(true);
            if (e.key === 'Escape') finishEdit(false);
        };

        input.onblur = () => finishEdit(true);
    };


    window.deleteClass = async (event, index) => {
        if (event) event.stopPropagation();
        if (confirm('¿Seguro que deseas eliminar esta clase y sus recursos?')) {
            state.classesData.cursados[index[0]].clases.splice(index[1], 1);
            await saveChanges(true);
        }
    };

    window.deleteResource = async (event, path) => {
        if (event) event.stopPropagation();
        if (confirm('¿Eliminar este recurso?')) {
            state.classesData.cursados[path[0]].clases[path[1]].recursos.splice(path[2], 1);
            await saveChanges(true);
        }
    };

    window.showResourceMenu = (event, cIndex, clIndex) => {
        if (event) event.stopPropagation();
        const existingMenu = document.querySelector('.float-menu');
        if (existingMenu) existingMenu.remove();

        const menu = document.createElement('div');
        menu.className = 'float-menu';
        menu.style.top = `${event.clientY}px`;
        menu.style.left = `${event.clientX}px`;

        menu.innerHTML = `
            <div class="float-menu-item" onclick="addYoutubeToTree(${cIndex}, ${clIndex})">
                <i data-lucide="youtube"></i> YouTube Video
            </div>
            <div class="float-menu-item" onclick="document.getElementById('file-upload-global').click(); window.globalUploadTarget = {cIndex: ${cIndex}, clIndex: ${clIndex}}">
                <i data-lucide="file-text"></i> Subir Documento
            </div>
        `;

        document.body.appendChild(menu);
        if (window.lucide) lucide.createIcons();

        document.addEventListener('click', () => menu.remove(), { once: true });
    };

    window.addYoutubeToTree = async (cIndex, clIndex) => {
        const videoId = prompt("ID del video de YouTube:");
        if (!videoId) return;

        state.classesData.cursados[cIndex].clases[clIndex].recursos.push({
            tipo: "Video_YouTube",
            id_ytb: videoId
        });
        await saveChanges(true);
    };

    // Global file input for uploads from tree
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'file-upload-global';
    fileInput.style.display = 'none';
    fileInput.onchange = (e) => handleGlobalFileUpload(e);
    document.body.appendChild(fileInput);

    async function handleGlobalFileUpload(event) {
        const file = event.target.files[0];
        const target = window.globalUploadTarget;
        if (!file || !target) return;

        const clase = state.classesData.cursados[target.cIndex].clases[target.clIndex];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('targetFolder', clase.folder);

        try {
            console.log('Subiendo archivo...', file.name);
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                console.info('¡Archivo subido con éxito!');
                await loadDocusConfig();
                await loadClassesData();
                renderSidebarTree();
            } else {
                throw new Error('Error en la carga');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error al subir: ' + error.message);
        }
    }

    window.openAdminModal = () => {
        const modal = document.getElementById('admin-modal');
        if (modal) {
            renderAdminModalHierarchical();
            modal.style.display = 'flex';
        }
    };

    function renderAdminModalHierarchical() {
        const container = document.getElementById('cursados-editor-list');
        if (!container) return;
        container.innerHTML = '';

        state.classesData.cursados.forEach((cursado, cIndex) => {
            const courseDiv = document.createElement('div');
            courseDiv.className = 'modal-course-block';

            // Create Header
            const header = document.createElement('div');
            header.className = 'modal-section-header';
            header.innerHTML = `
                <i data-lucide="book" class="modal-icon"></i>
                <input type="text" class="modal-input-main" value="${cursado.nombre}">
                <div class="header-actions">
                    <button class="action-btn-mini delete-course" title="Eliminar"><i data-lucide="trash-2"></i></button>
                    <button class="action-btn-mini copy-course" title="Duplicar"><i data-lucide="copy"></i></button>
                </div>
            `;

            const nameInput = header.querySelector('.modal-input-main');
            nameInput.onchange = (e) => state.classesData.cursados[cIndex].nombre = e.target.value;

            header.querySelector('.delete-course').onclick = () => {
                if (confirm('¿Eliminar todo este cursado?')) {
                    state.classesData.cursados.splice(cIndex, 1);
                    renderAdminModalHierarchical();
                }
            };
            header.querySelector('.copy-course').onclick = () => duplicateCursado(cIndex);

            courseDiv.appendChild(header);

            // Create Details Container
            const details = document.createElement('div');
            details.className = 'modal-course-details';
            const grid = document.createElement('div');
            grid.className = 'modal-grid';

            cursado.clases.forEach((clase, clIndex) => {
                const card = document.createElement('div');
                card.className = 'modal-class-card';
                card.innerHTML = `
                    <div class="card-header">
                        <strong>Clase ${clIndex + 1}</strong>
                        <button class="action-btn-mini remove-class"><i data-lucide="x"></i></button>
                    </div>
                    <div class="card-body">
                        <div class="input-group">
                            <label>Nombre:</label>
                            <input type="text" class="edit-name" value="${clase.nombre}">
                        </div>
                        <div class="input-group">
                            <label>Fecha:</label>
                            <input type="text" class="edit-date" value="${clase.fecha || ''}">
                        </div>
                        <div class="input-group">
                            <label>Campus ID:</label>
                            <input type="text" class="edit-campus" value="${clase.campus_id || ''}">
                        </div>
                    </div>
                `;

                card.querySelector('.remove-class').onclick = () => {
                    cursado.clases.splice(clIndex, 1);
                    renderAdminModalHierarchical();
                };
                card.querySelector('.edit-name').onchange = (e) => cursado.clases[clIndex].nombre = e.target.value;
                card.querySelector('.edit-date').onchange = (e) => cursado.clases[clIndex].fecha = e.target.value;
                card.querySelector('.edit-campus').onchange = (e) => cursado.clases[clIndex].campus_id = e.target.value;

                grid.appendChild(card);
            });

            // Add Class Button
            const addBtn = document.createElement('button');
            addBtn.className = 'add-card-btn';
            addBtn.innerHTML = '<i data-lucide="plus"></i>';
            addBtn.onclick = async () => {
                const name = prompt("Nombre de la nueva clase:");
                if (name) {
                    const newClase = {
                        nombre: name,
                        fecha: new Date().toLocaleDateString('es-ES'),
                        class_number: (cursado.clases.length + 1).toString(),
                        folder: name.trim().replace(/\s+/g, '_').toLowerCase(),
                        recursos: [],
                        isLoaded: true
                    };
                    cursado.clases.push(newClase);
                    renderAdminModalHierarchical();
                }
            };
            grid.appendChild(addBtn);

            details.appendChild(grid);
            courseDiv.appendChild(details);
            container.appendChild(courseDiv);
        });

        if (window.lucide) lucide.createIcons();
    }

    window.duplicateCursado = (cIndex) => {
        const original = state.classesData.cursados[cIndex];
        const copy = JSON.parse(JSON.stringify(original));
        copy.id = Date.now().toString();
        copy.nombre += " (Copia)";
        state.classesData.cursados.push(copy);
        renderAdminModalHierarchical();
    };

    async function saveChanges(silent = false) {
        try {
            if (state.isGitHubPages) return;

            const payload = {
                ...state.manifest,
                cursados: state.classesData.cursados
            };

            const response = await fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                if (!silent) console.info('¡Cambios guardados con éxito!');
                renderSidebarTree();
            } else {
                throw new Error('Error al guardar');
            }
        } catch (error) {
            console.error('Save error:', error);
            if (!silent) alert('Error al guardar: ' + error.message);
        }
    }

    async function addNewCursado() {
        const name = prompt("Nombre del nuevo cursado/nivel:");
        if (!name) return;

        const newCursado = {
            id: Date.now().toString(),
            nombre: name,
            nivel: "Diplomatura", // Default level
            clases: []
        };

        state.classesData.cursados.push(newCursado);
        await saveChanges(false);


        // Hide modal if open
        const modal = document.getElementById('admin-modal');
        if (modal) modal.style.display = 'none';
    }

    // Modal Synchronization
    const adminModal = document.getElementById('admin-modal');
    const addCursadoBtn = document.getElementById('add-cursado-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const saveAllBtn = document.getElementById('save-all-btn');

    if (addCursadoBtn) addCursadoBtn.onclick = () => addNewCursado();
    if (closeModalBtn) closeModalBtn.onclick = () => adminModal.style.display = 'none';
    if (saveAllBtn) saveAllBtn.onclick = () => saveChanges();

    window.saveChanges = saveChanges;
    window.addNewCursado = addNewCursado;
});