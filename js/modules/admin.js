import { state, elements } from './state.js';
import { renderSidebarTree } from './sidebar.js'; // To re-render tree after mode switch

export function toggleAdminMode() {
    if (state.isGitHubPages) {
        alert('La gestión está deshabilitada en GitHub Pages.');
        return;
    }
    state.isAdminMode = !state.isAdminMode;
    document.body.classList.toggle('admin-mode-active', state.isAdminMode);

    // Update toggle icon
    const icon = state.isAdminMode ? 'shield-check' : 'shield';
    if (elements.adminModeToggle) {
        elements.adminModeToggle.innerHTML = `<i data-lucide="${icon}"></i>`;
    }

    // Re-render to show/hide admin actions
    renderSidebarTree();
    if (window.lucide) lucide.createIcons();
}

// Expose to window for HTML onclicks

// Placeholder for other admin functions to keep this step focused. 
// I will move the Modal Logic here later or now if I have the context.
// 'openAdminModal', 'saveChanges' etc are large. 
// For this step I will just stub them or move them if I can read them all.
// I'll stick to toggle logic for now and assume the rest is in another tool call or main.js for now.
// Actually, let's move openAdminModal here too if possible.

export function openAdminModal() {
    if (!state.isAdminMode) {
        // Auto enable admin? or warn?
        // User workflow usually requires enabling admin first.
    }
    renderCursadosEditor();
    elements.adminModal.style.display = 'block';
}
window.openAdminModal = openAdminModal;

function renderCursadosEditor() {
    const list = document.getElementById('cursados-editor-list');
    list.innerHTML = '';

    state.classesData.cursados.forEach((cursado, cIndex) => {
        const item = document.createElement('div');
        item.className = 'editor-item';
        item.innerHTML = `
            <div class="editor-header">
                <strong>${cursado.nombre}</strong>
                <div class="editor-actions">
                    <button class="action-btn-mini" onclick="deleteCursado(${cIndex})"><i data-lucide="trash-2"></i></button>
                    <!-- More edit actions could go here -->
                </div>
            </div>
            <!-- Expanded editor details could go here -->
        `;
        list.appendChild(item);
    });
    if (window.lucide) lucide.createIcons();
}

// Stub for saveChanges - actual saving logic involves POST to server.
export async function saveChanges() {
    if (!confirm('¿Guardar todos los cambios en el servidor?')) return;

    try {
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cursados: state.classesData.cursados,
                docus_dir: state.docusDir
            })
        });

        const result = await response.json();
        if (result.status === 'success') {
            alert('Cambios guardados correctamente.');
            elements.adminModal.style.display = 'none';
        } else {
            alert('Error al guardar: ' + result.message);
        }
    } catch (error) {
        console.error('Save error:', error);
        alert('Error de conexión al guardar.');
    }
}
window.saveChanges = saveChanges;
