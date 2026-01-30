import { state, elements, initElements } from './modules/state.js';
import { ProgressTracker } from './modules/progress.js';
import { loadDocusConfig, loadClassesData } from './modules/content.js';
import { renderSidebarTree, toggleSidebar, selectTreeClass, setupSidebarListeners, handleSearch } from './modules/sidebar.js';
import { toggleAdminMode, openAdminModal, saveChanges } from './modules/admin.js';
import { loadResource } from './modules/content.js';

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Init DOM Elements
        initElements();

        // Init State
        state.progressTracker = new ProgressTracker();

        // Setup Sidebar Tree Delegation (Critical for Navigation)
        setupSidebarListeners();

        // Setup Global UI Listeners (Buttons, Inputs)
        setupGlobalListeners();

        // Initial Config Load
        await loadDocusConfig();
        await loadClassesData();

        // Initial Render
        renderSidebarTree();

        // Auto-select class
        const savedClass = localStorage.getItem('selectedClass');
        if (savedClass) {
            await selectTreeClass(savedClass);
            // Also restore active path if possible? 
            // state.js/activePath initializes to null. 
            // navigation.js/renderActiveTOC relies on state.activePath. 
            // selectTreeClass calls updateTieredNav -> syncs active path partially.
        } else if (state.classesData.cursados.length > 0 && state.classesData.cursados[0].clases.length > 0) {
            await selectTreeClass(state.classesData.cursados[0].clases[0].folder);
        }

    } catch (error) {
        console.error('App Init Error:', error);
    }
});

function setupGlobalListeners() {
    // 1. Sidebar Toggle
    if (elements.sidebarToggleBtn) {
        elements.sidebarToggleBtn.addEventListener('click', toggleSidebar);
    }

    // 2. Admin Mode Toggle
    if (elements.adminModeToggle) {
        elements.adminModeToggle.addEventListener('click', toggleAdminMode);
    }


    // 4. Search Functionality
    if (elements.searchToggleBtn) {
        elements.searchToggleBtn.addEventListener('click', () => {
            if (elements.searchContainer) {
                const isHidden = elements.searchContainer.style.display === 'none' || !elements.searchContainer.style.display;
                elements.searchContainer.style.display = isHidden ? 'block' : 'none';
                if (isHidden && elements.classSearch) {
                    elements.classSearch.focus();
                }
            }
        });
    }

    if (elements.classSearch) {
        elements.classSearch.addEventListener('input', handleSearch);
    }

    // 5. Admin Modal Actions
    if (elements.openMgmtBtn) {
        elements.openMgmtBtn.addEventListener('click', openAdminModal);
    }

    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', () => {
            if (elements.adminModal) elements.adminModal.style.display = 'none';
        });
    }

    if (elements.saveAllBtn) {
        elements.saveAllBtn.addEventListener('click', saveChanges);
    }

    // 6. Window Events
    window.addEventListener('beforeunload', () => {
        if (state.progressTracker) {
            state.progressTracker.saveProgressData();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768 && !state.isSidebarCollapsed) {
            // toggleSidebar(); // Optional auto-collapse
        }
    });
}