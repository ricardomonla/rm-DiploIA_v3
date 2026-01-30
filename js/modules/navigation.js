import { state, elements } from './state.js';
import { selectTreeClass } from './sidebar.js'; // Circular dep potential
import { loadResource } from './content.js';    // Content loading

export function renderActiveTOC(cIdx = null, clIdx = null, rIdx = null) {
    // Sync State
    if (cIdx !== null) state.activePath.course = cIdx;
    if (clIdx !== null) state.activePath.class = clIdx;
    if (rIdx !== null) state.activePath.resource = rIdx;

    // Call Context View Render
    renderContextView();

    const container = elements.breadcrumbNav;
    if (!container) return;
    container.innerHTML = '';

    const { course, class: cl, resource } = state.activePath;

    // 1. Root Level: Course Name (or Compact Header)
    if (course !== null && state.classesData.cursados[course]) {
        const courseData = state.classesData.cursados[course];

        // Compact Mode Logic
        if (state.isTOCCompact && cl !== null && courseData.clases[cl]) {
            const classData = courseData.clases[cl];
            const classNum = String(classData.class_number || (cl + 1)).padStart(2, '0');
            const abbr = getCourseAbbr(courseData);
            const compactLabel = `${abbr} - Clase ${classNum}`;

            // Custom Compact Header with Inline Actions
            const header = document.createElement('div');
            header.className = 'toc-item level-course-compact';
            header.style.display = 'flex';
            header.style.alignItems = 'center';
            header.style.justifyContent = 'space-between';
            header.style.cursor = 'default'; // Container not clickable as a whole

            // 1. Label (Toggles Expansion)
            const labelSpan = document.createElement('span');
            labelSpan.className = 'toc-link'; // Reusing style if exists or just standard
            labelSpan.textContent = compactLabel;
            labelSpan.style.cursor = 'pointer';
            labelSpan.style.fontWeight = '700';
            labelSpan.style.color = 'var(--text-color)';
            labelSpan.title = "Click para expandir";
            labelSpan.onclick = () => {
                state.isTOCCompact = false;
                renderActiveTOC();
            };

            // 2. Actions Group
            const actions = document.createElement('div');
            actions.className = 'toc-actions';

            // List Button (Go to Course Root)
            const listBtn = document.createElement('button');
            listBtn.className = 'toc-btn';
            listBtn.innerHTML = '<i data-lucide="list"></i>';
            listBtn.title = "Ver lista de clases";
            listBtn.onclick = (e) => {
                e.stopPropagation();
                // Go to Course Root
                state.activePath = { course: course, class: null, resource: null };
                renderActiveTOC();
            };

            // Play Button (Play Video)
            const playBtn = document.createElement('button');
            playBtn.className = 'toc-btn';
            playBtn.innerHTML = '<i data-lucide="play-circle"></i>';
            playBtn.title = "Ver video";
            playBtn.onclick = async (e) => {
                e.stopPropagation();
                if (classData.folder) await selectTreeClass(classData.folder);
            };

            actions.append(listBtn, playBtn);
            header.append(labelSpan, actions);
            container.appendChild(header);

        } else {
            // Full Mode
            container.appendChild(createTOCItem(courseData.nombre, 'course', course));

            // 2. Second Level: Class Name
            if (cl !== null && courseData.clases[cl]) {
                const classData = courseData.clases[cl];
                const classNum = String(classData.class_number || (cl + 1)).padStart(2, '0');
                const classLabel = `${classNum}. ${classData.nombre}`;

                container.appendChild(createTOCItem(classLabel, 'class', [course, cl], classData.folder));
            }
        }
    }

    if (window.lucide) lucide.createIcons();
}

function getCourseAbbr(courseData) {
    // Dynamic derivation from JSON data
    let abbr = courseData.nombre.split(' ')[0]; // Fallback

    if (courseData.nivel) {
        // "Diplomatura" -> "Diplo"
        const nivelShort = courseData.nivel.substring(0, 5);
        abbr = nivelShort;

        // Append context if present
        if (courseData.nombre.includes('Inteligencia Artificial') || courseData.nombre.includes('IA')) {
            abbr += 'IA';
        }
    }
    return abbr;
}


function createTOCItem(label, level, indices, folder = null) {
    const item = document.createElement('div');
    item.className = `toc-item level-${level}`;

    if (level === 'class') {
        item.innerHTML = `${label} <i data-lucide="play-circle" style="width: 14px; margin-left: 5px; opacity: 0.7;"></i>`;
        item.title = "Ver Video de Clase";
    } else {
        item.textContent = label;
    }

    // Interaction Logic
    item.onclick = async () => {
        if (level === 'course') {
            // Always Reset to Course Root (List of Classes)
            // User requested to avoid "old model" (Global Root / List of Courses)
            state.activePath = { course: indices, class: null, resource: null };
            renderActiveTOC();
        } else if (level === 'class') {
            // Trigger Sidebar Class Selection logic (loads video, clears Docs)
            if (folder) {
                await selectTreeClass(folder);
            }
        }
    };

    return item;
}

export function renderContextView() {
    const container = elements.contextView;
    if (!container) return;
    container.innerHTML = '';

    const { course, class: cl, resource } = state.activePath;

    // Determine what level to show children for
    let items = [];
    let type = '';

    if (course === null) {
        // Root level: Show all courses
        type = 'course';
        items = state.classesData.cursados.map((c, i) => ({ label: c.nombre, idx: i }));
    } else if (cl === null) {
        // Course selected: Show classes
        type = 'class';
        items = state.classesData.cursados[course].clases.map((c, i) => ({
            label: formatClassName(c, i),
            idx: [course, i],
            folder: c.folder // Pass folder for identification
        }));
    } else {
        // Class selected: Show resources (excluding Video_YouTube)
        type = 'resource';
        items = state.classesData.cursados[course].clases[cl].recursos
            .filter(r => r.tipo !== 'Video_YouTube')
            .map((r, i) => ({ label: formatResourceName(r), idx: [course, cl, i], data: r }));
    }

    // Render items
    items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'context-item';

        // Highlight Active Resource
        if (type === 'resource' && resource === item.idx[2]) {
            el.classList.add('active');
        }

        // Highlight Active Class (Scroll to it)
        if (type === 'class' && state.selectedClass && item.folder === state.selectedClass) {
            el.classList.add('active'); // Visual feedback
            setTimeout(() => {
                el.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }, 100);
        }

        // Icon
        let iconName = 'folder';
        if (type === 'course') iconName = 'book';
        if (type === 'class') iconName = 'calendar';
        if (type === 'resource') iconName = item.data.tipo === 'Video_YouTube' ? 'youtube' : 'file-text';

        // Custom Layout for Classes (Two Lines)
        if (type === 'class') {
            const [classNumPart, ...nameParts] = item.label.split(' - ');
            const className = nameParts.join(' - '); // Rejoin remaining parts

            el.innerHTML = `
                <div class="context-item-icon"><i data-lucide="${iconName}"></i></div>
                <div class="context-item-details">
                    <span class="context-primary">${classNumPart.replace('C', 'Clase ')}</span>
                    <span class="context-secondary">${className}</span>
                </div>
            `;
            el.classList.add('multi-line');
        } else {
            // Standard Layout
            el.innerHTML = `
                <i data-lucide="${iconName}"></i>
                <span>${item.label}</span>
            `;
        }

        el.onclick = () => {
            if (type === 'course') {
                // Enter course
                state.activePath = { course: item.idx, class: null, resource: null };
                renderActiveTOC();
            } else if (type === 'class') {
                // Enter class
                selectTreeClass(state.classesData.cursados[item.idx[0]].clases[item.idx[1]].folder);
                // selectTreeClass calls renderActiveTOC internally
            } else if (type === 'resource') {
                // Load resource
                loadResource(item.data.tipo, item.data.id_ytb || item.data.archivo, item.data.archivo || item.data.tipo);
                renderActiveTOC(item.idx[0], item.idx[1], item.idx[2]);
            }
        };
        container.appendChild(el);
    });

    if (window.lucide) lucide.createIcons();
}

function formatClassName(clase, index) {
    let name = clase.nombre;
    // Fallback if class_number missing
    const num = clase.class_number || (index + 1);
    const classNum = String(num).padStart(2, '0');
    name = `C${classNum} - ${clase.nombre}`;

    // Note: Progress tracking visual cue logic omitted for brevity in this helper context or can be re-imported
    return name;
}

function formatResourceName(r) {
    if (r.tipo === 'Video_YouTube') return 'Video Clase';
    return r.archivo || r.tipo;
}
