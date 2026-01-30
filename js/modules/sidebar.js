import { state, elements } from './state.js';
import { renderActiveTOC } from './navigation.js';
import { loadYouTubeVideo } from './player.js';
import { loadDocusConfig, loadClassesData } from './content.js';

export function renderSidebarTree() {
    if (!elements.sidebarTree) return;
    elements.sidebarTree.innerHTML = '';

    state.classesData.cursados.forEach((cursado, cIndex) => {
        const courseNode = createTreeNode('course', cursado.nombre, cIndex);
        const courseContent = courseNode.querySelector('.node-content');

        cursado.clases.forEach((clase, clIndex) => {
            const classNode = createTreeNode('class', formatClassName(clase, clIndex), [cIndex, clIndex], clase.folder);
            courseContent.appendChild(classNode);
        });

        elements.sidebarTree.appendChild(courseNode);
    });

    if (window.lucide) lucide.createIcons();
    // Initialize Nav
    renderActiveTOC();
}

export function toggleSidebar() {
    state.isSidebarCollapsed = !state.isSidebarCollapsed;
    elements.sidebar.classList.toggle('collapsed', state.isSidebarCollapsed);
    localStorage.setItem('sidebarCollapsed', state.isSidebarCollapsed);

    const iconName = state.isSidebarCollapsed ? 'book' : 'book-open';
    if (elements.sidebarToggleBtn) {
        elements.sidebarToggleBtn.innerHTML = `<i data-lucide="${iconName}"></i>`;
        if (window.lucide) lucide.createIcons();
    }
}

export async function selectTreeClass(folder) {
    // Return only if same class AND not in Admin mode AND not in Document/Resource mode
    const isDocMode = elements.youtubePlayer.classList.contains('document-mode');
    if (state.selectedClass === folder && !state.isAdminMode && !isDocMode) return;

    state.selectedClass = folder;
    localStorage.setItem('selectedClass', folder);

    // Default to Compact TOC when entering a class
    state.isTOCCompact = true;

    // UI update
    document.querySelectorAll('.class-node .node-header').forEach(el => el.classList.remove('active'));

    // Selector using dataset
    const nodes = document.querySelectorAll('.tree-node.class-node');
    nodes.forEach(n => {
        if (n.dataset.folder === folder) {
            const header = n.querySelector('.node-header');
            if (header) header.classList.add('active');
        }
    });

    // Reload data context
    await loadDocusConfig();
    await loadClassesData();

    // Find class data object
    let selectedClass = null;
    let location = { c: -1, cl: -1 };

    state.classesData.cursados.forEach((c, cIdx) => {
        c.clases.forEach((cl, clIdx) => {
            if (cl.folder === folder) {
                selectedClass = cl;
                location = { c: cIdx, cl: clIdx };
            }
        });
    });

    if (selectedClass) {
        if (elements.selectedClassTitle) elements.selectedClassTitle.textContent = formatClassName(selectedClass);

        // Sync Nav
        renderActiveTOC(location.c, location.cl, null);

        // Helper to reset view mode
        elements.youtubePlayer.classList.remove('document-mode');
        elements.youtubePlayer.innerHTML = ''; // Force clear Markdown/PDF content

        // Load First Video
        const firstVideo = selectedClass.recursos?.find(r => r.tipo === 'Video_YouTube');
        if (firstVideo?.id_ytb) {
            loadYouTubeVideo(selectedClass, firstVideo.id_ytb);
        }
    }
}

// Event Delegation Setup
export function setupSidebarListeners() {
    if (!elements.sidebarTree) return;

    elements.sidebarTree.addEventListener('click', async (event) => {
        const header = event.target.closest('.node-header');
        if (!header) return;

        // Prevent triggering if clicking specific actions inside header
        if (event.target.closest('.action-btn-mini')) return;

        const node = header.closest('.tree-node');
        const type = node.dataset.type;
        const index = JSON.parse(node.dataset.index);
        const folder = node.dataset.folder !== 'null' ? node.dataset.folder : null;

        handleNodeClick(node, type, index, folder);
    });
}

export function handleSearch() {
    if (!elements.classSearch) return;
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

async function handleNodeClick(node, type, index, folder) {
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
}

function createTreeNode(type, label, index, folder = null) {
    const node = document.createElement('div');
    node.className = `tree-node ${type}-node`;
    const indexStr = JSON.stringify(index);
    if (state.expandedNodes.has(indexStr)) {
        node.classList.add('expanded');
    }

    // Data attributes for delegation
    node.dataset.type = type;
    node.dataset.index = indexStr;
    node.dataset.folder = folder || 'null';

    const isSelected = folder && state.selectedClass === folder;
    const icon = type === 'course' ? 'book' : 'calendar';

    node.innerHTML = `
        <div class="node-header ${isSelected ? 'active' : ''}">
            <i data-lucide="chevron-right" class="chevron-icon"></i>
            <i data-lucide="${icon}"></i>
            <span class="node-label">${label}</span>
            <!-- Admin actions temporarily disabled for cleanup -->
        </div>
        <div class="node-content"></div>
    `;
    return node;
}

function formatClassName(clase, index) {
    let name = clase.nombre;
    const num = clase.class_number || (typeof index === 'number' ? index + 1 : 0);
    if (num) {
        name = `C${String(num).padStart(2, '0')} - ${clase.nombre}`;
    }
    return name;
}
