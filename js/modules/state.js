export const CONFIG = {
    version: '7.4',
    apiEndpoints: {
        docusConfig: 'docus.json'
    }
};

export const state = {
    classesData: { cursados: [] },
    currentPlayer: null,
    selectedClass: null,
    docusDir: '',
    progressTracker: null, // Will be initialized with ProgressTracker instance
    manifest: null,
    isDarkMode: true,
    isSidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
    isGitHubPages: window.location.hostname.includes('github.io'),
    isAdminMode: false,
    expandedNodes: new Set(),
    activePath: { course: null, class: null, resource: null },
    isTOCCompact: false
};

export const elements = {
    youtubePlayer: null,
    selectedClassTitle: null,
    classSearch: null,
    darkModeToggle: null,
    sidebarToggleBtn: null,
    sidebar: null,
    adminModeToggle: null,
    sidebarTree: null,
    adminModal: null,
    closeModal: null,
    saveAllBtn: null,
    addCursadoBtn: null,
    openMgmtBtn: null,
    breadcrumbNav: null,
    searchToggleBtn: null,
    searchContainer: null,
    contextView: null
};

export function initElements() {
    elements.youtubePlayer = document.getElementById('youtube-player');
    elements.selectedClassTitle = document.getElementById('selected-class-title');
    elements.classSearch = document.getElementById('class-search');
    elements.darkModeToggle = document.getElementById('dark-mode-toggle');
    elements.sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    elements.sidebar = document.getElementById('documents-sidebar');
    elements.adminModeToggle = document.getElementById('admin-mode-toggle');
    elements.sidebarTree = document.getElementById('sidebar-tree');
    elements.adminModal = document.getElementById('admin-modal');
    elements.closeModal = document.getElementById('close-modal');
    elements.saveAllBtn = document.getElementById('save-all-btn');
    elements.addCursadoBtn = document.getElementById('add-cursado-btn');
    elements.openMgmtBtn = document.getElementById('open-mgmt-btn');
    elements.breadcrumbNav = document.getElementById('breadcrumb-nav');
    elements.searchToggleBtn = document.getElementById('search-toggle-btn');
    elements.searchContainer = document.getElementById('search-container');
    elements.contextView = document.getElementById('context-view');
}
