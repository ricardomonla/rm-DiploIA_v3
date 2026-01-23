// Main application logic for the dynamic web page
document.addEventListener('DOMContentLoaded', function () {
    // === CONFIGURATION & CONSTANTS ===
    const CONFIG = {
        version: '6.9',
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
        isSidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true'
    };

    // === DOM ELEMENTS ===
    const elements = {
        classSelector: document.getElementById('class-selector'),
        youtubePlayer: document.getElementById('youtube-player'),
        documentsList: document.getElementById('documents-list'),
        selectedClassTitle: document.getElementById('selected-class-title'),
        classSearch: document.getElementById('class-search'),
        darkModeToggle: document.getElementById('dark-mode-toggle'),
        sidebarToggleBtn: document.getElementById('sidebar-toggle-btn'),
        sidebar: document.getElementById('documents-sidebar'),
        adminToggle: document.getElementById('admin-toggle'),
        adminModal: document.getElementById('admin-modal'),
        closeModal: document.getElementById('close-modal'),
        cursadosEditorList: document.getElementById('cursados-editor-list'),
        addCursadoBtn: document.getElementById('add-cursado-btn'),
        saveAllBtn: document.getElementById('save-all-btn'),
        quickAddClass: document.getElementById('quick-add-class'),
        sidebarResourceActions: document.getElementById('sidebar-resource-actions'),
        quickAddYoutube: document.getElementById('quick-add-youtube')
    };

    // === INITIALIZATION ===
    init();

    // === MAIN FUNCTIONS ===
    async function init() {
        try {
            applyInitialUIState();
            await loadDocusConfig();
            await loadClassesData();
            populateDropdown();
            await autoSelectClass();
            setupEventListeners();
        } catch (error) {
            console.error('Initialization error:', error);
            showError('Error al inicializar la aplicación');
        }
    }

    function applyInitialUIState() {
        if (state.isDarkMode) document.body.classList.add('dark-mode');
        if (state.isSidebarCollapsed) elements.sidebar.classList.add('collapsed');
        updateDarkModeIcon();
    }

    function setupEventListeners() {
        elements.classSelector.addEventListener('change', handleClassSelection);
        elements.classSelector.addEventListener('change', (e) => {
            localStorage.setItem('selectedClass', e.target.value);
        });

        // Search Filter
        elements.classSearch.addEventListener('input', handleSearch);

        // Dark Mode Toggle
        elements.darkModeToggle.addEventListener('click', toggleDarkMode);

        // Sidebar Toggle
        elements.sidebarToggleBtn.addEventListener('click', toggleSidebar);

        // Admin/Management
        elements.adminToggle.addEventListener('click', openAdminModal);
        elements.closeModal.addEventListener('click', () => elements.adminModal.style.display = 'none');
        elements.addCursadoBtn.addEventListener('click', addCursadoToEditor);
        elements.saveAllBtn.addEventListener('click', saveChanges);

        // Quick Actions
        elements.quickAddClass.addEventListener('click', handleQuickAddClass);
        elements.quickAddYoutube.addEventListener('click', handleQuickAddYoutube);

        // Add window unload event to save progress
        window.addEventListener('beforeunload', saveCurrentProgress);

        // Add visibility change event to handle tab switching
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    function handleSearch() {
        const term = elements.classSearch.value.toLowerCase();
        const options = elements.classSelector.options;

        for (let i = 1; i < options.length; i++) {
            const text = options[i].textContent.toLowerCase();
            const match = text.includes(term);
            options[i].style.display = match ? '' : 'none';
        }
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

    // Function to fetch subdirectories (Now legacy/fallback or for specific uses, but manifest is preferred)
    async function fetchSubdirectories() {
        // Obsolete in v6.6, handled by index.json
        return [];
    }

    async function reloadClassData(dirName) {
        // In v6.6, data is loaded once from manifest. No need to reload individual class data.
        // This function now just returns the existing class data from state.
        const existingClass = state.classesData.clases.find(clase => clase.nombre === dirName);
        if (existingClass) {
            return existingClass;
        } else {
            console.warn(`Class data for ${dirName} not found in manifest during reloadClassData.`);
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

    async function reloadClassData(dirName) {
        const updatedClass = await loadClassData(dirName);
        const index = state.classesData.clases.findIndex(clase => clase.nombre === dirName);
        if (index !== -1) {
            state.classesData.clases[index] = updatedClass;
        }
        return updatedClass;
    }

    async function extractDocuments(response) {
        const html = await response.text();
        console.log('Documents HTML:', html.substring(0, 500)); // Log first 500 chars
        const regex = /href="([^"]+)"/g;
        const documents = [];
        let match;

        while ((match = regex.exec(html)) !== null) {
            const docHref = match[1];
            console.log('Found doc href:', docHref);
            if (docHref && !docHref.includes('..') && !docHref.endsWith('/')) {
                const isAllowed = CONFIG.allowedExtensions.some(ext => docHref.endsWith(ext));
                console.log(`Doc ${docHref} allowed:`, isAllowed);
                if (isAllowed) {
                    documents.push(decodeURIComponent(docHref));
                }
            }
        }

        console.log('Final documents list:', documents);
        return documents;
    }

    // === UI MANAGEMENT ===
    function populateDropdown() {
        elements.classSelector.innerHTML = '<option value="">Seleccione una clase</option>';

        state.classesData.cursados.forEach(cursado => {
            const group = document.createElement('optgroup');
            group.label = `${cursado.nombre} (${cursado.nivel})`;

            cursado.clases.forEach(clase => {
                const option = createClassOption(clase);
                group.appendChild(option);
            });

            elements.classSelector.appendChild(group);
        });
    }

    function getAllClasses() {
        let all = [];
        state.classesData.cursados.forEach(curs => {
            all = all.concat(curs.clases);
        });
        return all;
    }

    function createClassOption(clase) {
        const option = document.createElement('option');
        option.value = clase.folder;
        option.textContent = formatClassName(clase);
        return option;
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

    async function autoSelectClass() {
        const savedClass = localStorage.getItem('selectedClass');
        const allClasses = getAllClasses();
        if (savedClass) {
            elements.classSelector.value = savedClass;
            await handleClassSelection();
        } else if (allClasses[0]) {
            elements.classSelector.value = allClasses[0].folder;
            await handleClassSelection();
        }
    }

    async function handleClassSelection() {
        const selectedClassName = elements.classSelector.value;
        if (!selectedClassName) {
            clearPlayer();
            clearDocuments();
            updateClassTitle('Seleccionar una clase');
            elements.sidebarResourceActions.style.display = 'none';
            return;
        }

        elements.sidebarResourceActions.style.display = 'flex';

        // Save progress for previous class before switching
        if (state.selectedClass && state.selectedClass !== selectedClassName) {
            saveCurrentProgress();
        }

        // Re-fetch manifest to ensure resources are up-to-date (dynamic sync)
        await loadDocusConfig();
        await loadClassesData();

        state.selectedClass = selectedClassName;

        const allClasses = getAllClasses();
        let selectedClass = allClasses.find(clase => clase.folder === selectedClassName);

        if (selectedClass && !selectedClass.isLoaded) {
            console.log(`Lazy loading data for ${selectedClassName}...`);
            // selectedClass = await reloadClassData(selectedClassName);
            selectedClass.isLoaded = true;
        }

        if (selectedClass) {
            updateClassTitle(formatClassName(selectedClass));
            displayDocuments(selectedClass);

            // Auto-select first video if available
            const firstVideo = selectedClass.recursos?.find(r => r.tipo === 'Video_YouTube');
            if (firstVideo?.id_ytb) {
                loadYouTubeVideo(selectedClass, firstVideo.id_ytb);
                highlightActiveSidebarItem('video', firstVideo.id_ytb);
            }

            // Restore progress for this class
            setTimeout(() => {
                restoreProgressForCurrentClass();
            }, 500);
        }
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
        const videoId = state.selectedClass ? state.classesData.clases.find(c => c.nombre === state.selectedClass)?.youtube_id : null;
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
        const videoButtons = elements.documentsList.querySelectorAll('.document-item[data-resource-type="video"]');
        videoButtons.forEach(btn => {
            const baseText = btn.getAttribute('data-base-text') || btn.querySelector('.item-label').textContent.split(' (')[0];
            btn.setAttribute('data-base-text', baseText);
            btn.querySelector('.item-label').textContent = `${baseText} (${Math.round(progress)}%)`;
        });
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

                    // Restore Play/Pause state
                    if (videoProgress.playerState === window.YT.PlayerState.PLAYING) {
                        state.youtubePlayer.playVideo();
                    } else {
                        state.youtubePlayer.pauseVideo();
                    }
                }
            }, 1000);
        }

        if (videoProgress && videoProgress.progress) {
            updateVideoProgressUI(videoProgress.progress);
            updateSidebarVideoProgress(videoProgress.progress);
        }
    }

    // function getCurrentVideoId() {
    //     if (state.currentPlayer && state.currentPlayer.querySelector) {
    //         const iframe = state.currentPlayer.querySelector('iframe[src*="youtube"]');
    //         if (iframe) {
    //             return extractYouTubeId(iframe.src);
    //         }
    //     }
    //     return null;
    // }

    // function updateVideoProgressBar(progress) {
    //     // Create or update progress bar
    //     let progressBar = document.getElementById('video-progress-bar');
    //     if (!progressBar) {
    //         progressBar = document.createElement('div');
    //         progressBar.id = 'video-progress-bar';
    //         progressBar.style.position = 'absolute';
    //         progressBar.style.bottom = '10px';
    //         progressBar.style.left = '10px';
    //         progressBar.style.right = '10px';
    //         progressBar.style.height = '4px';
    //         progressBar.style.backgroundColor = '#ddd';
    //         progressBar.style.borderRadius = '2px';
    //         progressBar.style.zIndex = '1000';

    //         const progressFill = document.createElement('div');
    //         progressFill.style.height = '100%';
    //         progressFill.style.backgroundColor = '#007bff';
    //         progressFill.style.width = '0%';
    //         progressFill.style.transition = 'width 0.3s ease';
    //         progressFill.id = 'video-progress-fill';

    //         progressBar.appendChild(progressFill);
    //         elements.youtubePlayer.appendChild(progressBar);
    //     }

    //     const progressFill = document.getElementById('video-progress-fill');
    //     if (progressFill) {
    //         progressFill.style.width = `${progress}%`;
    //     }
    // }

    // function showRestoreNotification(message) {
    //     let notification = document.getElementById('restore-notification');
    //     if (!notification) {
    //         notification = document.createElement('div');
    //         notification.id = 'restore-notification';
    //         notification.style.position = 'absolute';
    //         notification.style.top = '10px';
    //         notification.style.right = '10px';
    //         notification.style.backgroundColor = '#28a745';
    //         notification.style.color = 'white';
    //         notification.style.padding = '8px 16px';
    //         notification.style.borderRadius = '4px';
    //         notification.style.zIndex = '1000';
    //         notification.style.opacity = '0';
    //         notification.style.transition = 'opacity 0.3s ease';

    //         elements.youtubePlayer.appendChild(notification);
    //     }

    //     notification.textContent = message;
    //     notification.style.opacity = '1';

    //     setTimeout(() => {
    //         notification.style.opacity = '0';
    //     }, 3000);
    // }

    // function formatTime(seconds) {
    //     const mins = Math.floor(seconds / 60);
    //     const secs = Math.floor(seconds % 60);
    //     return `${mins}:${secs.toString().padStart(2, '0')}`;
    // }

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

        // Remove progress overlay if it exists
        const progressDisplay = document.getElementById('video-progress-percentage');
        if (progressDisplay) {
            progressDisplay.remove();
        }

        // Stop progress tracking interval
        if (state.progressInterval) {
            clearInterval(state.progressInterval);
            state.progressInterval = null;
        }
    }

    // === DOCUMENT MANAGEMENT ===
    function displayDocuments(clase) {
        clearDocuments();

        if (!clase.recursos?.length) {
            const noDocs = createNoDocumentsMessage();
            elements.documentsList.appendChild(noDocs);
        }

        const classProgress = state.progressTracker.getClassProgress(clase.folder);

        for (const recurso of (clase.recursos || [])) {
            if (recurso.tipo === 'Video_YouTube') {
                const videoProgress = classProgress.resources.video?.[recurso.id_ytb] || {};
                const progressSuffix = videoProgress.progress ? ` (${Math.round(videoProgress.progress)}%)` : '';
                const youtubeButton = createDocumentButton(
                    'youtube',
                    `Clase ${clase.fecha}${progressSuffix}`,
                    () => {
                        loadYouTubeVideo(clase, recurso.id_ytb);
                        highlightActiveSidebarItem('video', recurso.id_ytb);
                    },
                    false,
                    `🎥 Clase ${clase.fecha}`
                );
                youtubeButton.setAttribute('data-resource-type', 'video');
                youtubeButton.setAttribute('data-resource-id', recurso.id_ytb);
                elements.documentsList.appendChild(youtubeButton);
            } else if (recurso.tipo === 'Documento') {
                const docProgress = classProgress.resources.document || {};
                const isAccessed = !!docProgress[recurso.archivo];
                const docButton = createDocumentButton(
                    getDocumentIcon(recurso.archivo),
                    formatDocumentName(recurso.archivo),
                    () => {
                        previewDocument(clase.folder, recurso.archivo);
                        highlightActiveSidebarItem('document', recurso.archivo);
                    },
                    isAccessed,
                    formatDocumentName(recurso.archivo)
                );
                docButton.setAttribute('data-resource-type', 'document');
                docButton.setAttribute('data-resource-id', recurso.archivo);
                elements.documentsList.appendChild(docButton);
            }
        }

        // Add Campus button if campus_id is available
        if (clase.campus_id) {
            const campusButton = createDocumentButton(
                'external-link',
                'Ver Campus Virtual',
                () => {
                    openCampusUrl(clase);
                    highlightActiveSidebarItem('campus', clase.campus_id);
                },
                false,
                '🏫 Campus Virtual'
            );
            campusButton.setAttribute('data-resource-type', 'campus');
            campusButton.setAttribute('data-resource-id', clase.campus_id);
            campusButton.classList.add('campus-btn');
            elements.documentsList.appendChild(campusButton);
        }

        // Render all Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    function openCampusUrl(clase) {
        if (clase.campus_id && CONFIG.campusUrl) {
            const campusUrl = `${CONFIG.campusUrl}${clase.campus_id}`;
            console.log('Opening campus URL in new tab:', campusUrl);
            window.open(campusUrl, '_blank');
            return false;
        } else {
            console.error('Campus info missing - campus_id:', clase.campus_id, 'campusUrl:', CONFIG.campusUrl);
            showError('No se encontró información del campus para esta clase');
        }
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

    // === MANAGEMENT / EDITOR FUNCTIONS ===
    function openAdminModal() {
        elements.adminModal.style.display = 'flex';
        renderEditor();
    }

    function renderEditor() {
        elements.cursadosEditorList.innerHTML = '';
        state.classesData.cursados.forEach((cursado, cIndex) => {
            const cursadoDiv = document.createElement('div');
            cursadoDiv.className = 'editor-item';
            cursadoDiv.innerHTML = `
                <div class="editor-field">
                    <label>Nombre del Cursado</label>
                    <input type="text" class="editor-input" value="${cursado.nombre}" onchange="updateState('cursado', ${cIndex}, 'nombre', this.value)">
                </div>
                <div class="editor-field">
                    <label>Nivel</label>
                    <input type="text" class="editor-input" value="${cursado.nivel}" onchange="updateState('cursado', ${cIndex}, 'nivel', this.value)">
                </div>
                <div class="clases-list" id="clases-editor-${cIndex}"></div>
                <button class="action-btn" onclick="addClaseToCursado(${cIndex})">＋ Añadir Clase</button>
            `;
            elements.cursadosEditorList.appendChild(cursadoDiv);

            const clasesListDiv = cursadoDiv.querySelector('.clases-list');
            cursado.clases.forEach((clase, clIndex) => {
                const claseDiv = document.createElement('div');
                claseDiv.className = 'clase-editor-item';
                claseDiv.innerHTML = `
                    <div class="editor-field">
                        <label>Nombre de Clase</label>
                        <input type="text" class="editor-input" value="${clase.nombre}" onchange="updateState('clase', [${cIndex}, ${clIndex}], 'nombre', this.value)">
                    </div>
                    <div class="editor-field">
                        <label>Fecha (DD/MM/YYYY)</label>
                        <input type="text" class="editor-input" value="${clase.fecha}" onchange="updateState('clase', [${cIndex}, ${clIndex}], 'fecha', this.value)">
                    </div>
                    <div class="editor-field">
                        <label>Carpeta (en el servidor)</label>
                        <input type="text" class="editor-input" value="${clase.folder}" onchange="updateState('clase', [${cIndex}, ${clIndex}], 'folder', this.value)">
                    </div>
                    <div class="recursos-editor" id="recursos-editor-${cIndex}-${clIndex}">
                        ${clase.recursos.map((r, rIndex) => `
                            <div class="recurso-row">
                                <span class="badge">${r.tipo}</span> 
                                <span>${r.tipo === 'Video_YouTube' ? r.id_ytb : r.archivo}</span>
                                <button class="remove-btn" onclick="removeRecurso(${cIndex}, ${clIndex}, ${rIndex})">✕</button>
                            </div>
                        `).join('')}
                    </div>
                    <button class="action-btn" onclick="addYoutubeToClase(${cIndex}, ${clIndex})" style="font-size: 0.8rem">＋ YouTube</button>
                `;
                clasesListDiv.appendChild(claseDiv);
            });
        });
    }

    // Expose functions to global scope for onclick handlers
    window.updateState = (type, index, field, value) => {
        if (type === 'cursado') {
            state.classesData.cursados[index][field] = value;
        } else if (type === 'clase') {
            const [cIdx, clIdx] = index;
            state.classesData.cursados[cIdx].clases[clIdx][field] = value;
        }
    };

    window.addClaseToCursado = (cIndex) => {
        state.classesData.cursados[cIndex].clases.push({
            nombre: "Nueva Clase",
            fecha: new Date().toLocaleDateString('es-ES'),
            folder: "C" + (getAllClasses().length + 1) + "_Nueva_Clase",
            recursos: []
        });
        renderEditor();
    };

    window.addYoutubeToClase = (cIndex, clIndex) => {
        const ytbId = prompt("Ingresa el ID de YouTube (ej: 4il7Li-a684):");
        if (ytbId) {
            state.classesData.cursados[cIndex].clases[clIndex].recursos.push({
                tipo: "Video_YouTube",
                id_ytb: ytbId
            });
            renderEditor();
        }
    };

    window.removeRecurso = (cIndex, clIndex, rIndex) => {
        state.classesData.cursados[cIndex].clases[clIndex].recursos.splice(rIndex, 1);
        renderEditor();
    };

    function addCursadoToEditor() {
        state.classesData.cursados.push({
            nombre: "Nueva Diplomatura",
            nivel: "Diplomatura",
            clases: []
        });
        renderEditor();
    }

    async function saveChanges(silent = false) {
        try {
            if (!silent) {
                elements.saveAllBtn.textContent = 'Guardando...';
                elements.saveAllBtn.disabled = true;
            }

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
                if (!silent) alert('¡Cambios guardados con éxito!');
                // Wait a bit before reload to ensure server saved
                setTimeout(() => location.reload(), 300);
            } else {
                throw new Error('Error al guardar');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Error al guardar los cambios: ' + error.message);
        } finally {
            if (!silent) {
                elements.saveAllBtn.textContent = 'Guardar Cambios';
                elements.saveAllBtn.disabled = false;
            }
        }
    }

    // === QUICK ADD LOGIC ===
    async function handleQuickAddClass() {
        const name = prompt("Nombre de la nueva clase:");
        if (!name) return;

        let targetCursado = state.classesData.cursados[0];
        const selectedValue = elements.classSelector.value;
        const allClasses = getAllClasses();
        const selectedClass = allClasses.find(c => c.folder === selectedValue);

        if (selectedClass) {
            targetCursado = state.classesData.cursados.find(cur =>
                cur.clases.some(c => c.folder === selectedClass.folder)
            );
        }

        const newClase = {
            nombre: name,
            fecha: new Date().toLocaleDateString('es-ES'),
            class_number: (targetCursado.clases.length + 1).toString(),
            folder: name.trim().replace(/\s+/g, '_').toLowerCase(),
            recursos: []
        };

        targetCursado.clases.push(newClase);
        await saveChanges(true); // Silent save
    }

    async function handleQuickAddYoutube() {
        const videoId = prompt("ID del video de YouTube (ej. dQw4w9WgXcQ):");
        if (!videoId) return;

        const selectedValue = elements.classSelector.value;
        const allClasses = getAllClasses();
        const selectedClass = allClasses.find(c => c.folder === selectedValue);

        if (!selectedClass) {
            alert("Selecciona una clase primero.");
            return;
        }

        if (!selectedClass.recursos) selectedClass.recursos = [];
        selectedClass.recursos.push({
            tipo: "Video_YouTube",
            id_ytb: videoId
        });

        await saveChanges(true); // Silent save
    }

    window.saveChanges = saveChanges;
});