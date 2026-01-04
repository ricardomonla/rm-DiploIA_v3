// Main application logic for the dynamic web page
document.addEventListener('DOMContentLoaded', function() {
    const classSelector = document.getElementById('class-selector');
    const youtubePlayer = document.getElementById('youtube-player');
    const documentsList = document.getElementById('documents-list');
    
    let classesData = [];
    let currentPlayer = null;
    
    // Load classes data from subdirectories
    async function loadClassesData() {
        try {
            console.log('Loading classes data from subdirectories...');
            
            // Fetch the list of subdirectories from the server
            const response = await fetch('Clases_DiploIA/');
            if (!response.ok) {
                throw new Error('Failed to load classes directory');
            }
            const html = await response.text();
            
            // Use a simpler approach to extract subdirectory names
            const subdirectories = [];
            const regex = /href="([^"]+)"/g;
            let match;
            while ((match = regex.exec(html)) !== null) {
                const href = match[1];
                if (href && href.endsWith('/') && !href.includes('..')) {
                    const dirName = href.replace('/', '');
                    if (dirName.startsWith('C') && dirName.includes('_')) {
                        // Decode URL-encoded characters
                        const decodedDirName = decodeURIComponent(dirName);
                        subdirectories.push(decodedDirName);
                    }
                }
            }
            
            console.log('Found subdirectories:', subdirectories);
            
            // Load allowed extensions from docus.json
            const docusResponse = await fetch('docus.json');
            const docusConfig = await docusResponse.json();
            const allowedExtensions = docusConfig.allowed_extensions || ['.pdf', '.md'];
            console.log('Allowed extensions:', allowedExtensions);
            
            // Load data for each subdirectory
            classesData = { clases: [] };
            for (const dirName of subdirectories) {
                try {
                    console.log(`Loading data for ${dirName}...`);
                    const dataResponse = await fetch(`Clases_DiploIA/${dirName}/data.json`);
                    if (dataResponse.ok) {
                        const data = await dataResponse.json();
                        console.log(`Data for ${dirName}:`, data);
                        
                        // Fetch the list of documents in the subdirectory
                        const docsResponse = await fetch(`Clases_DiploIA/${dirName}/`);
                        if (docsResponse.ok) {
                            const docsHtml = await docsResponse.text();
                            const docus = [];
                            const docsRegex = /href="([^"]+)"/g;
                            let docsMatch;
                            while ((docsMatch = docsRegex.exec(docsHtml)) !== null) {
                                const docHref = docsMatch[1];
                                if (docHref && !docHref.includes('..') && !docHref.endsWith('/')) {
                                    // Filter documents based on allowed extensions
                                    const isAllowed = allowedExtensions.some(ext => docHref.endsWith(ext));
                                    if (isAllowed) {
                                        // Decode URL-encoded characters in document names
                                        const decodedDocHref = decodeURIComponent(docHref);
                                        docus.push(decodedDocHref);
                                    }
                                }
                            }
                            
                            classesData.clases.push({
                                nombre: dirName,
                                youtube_id: data.youtube_id || '',
                                campus_id: data.campus_id || '',
                                docus: docus
                            });
                            
                            console.log(`Loaded data for ${dirName}:`, {
                                nombre: dirName,
                                youtube_id: data.youtube_id || '',
                                campus_id: data.campus_id || '',
                                docus: docus
                            });
                        }
                    }
                } catch (error) {
                    console.error(`Error loading data for ${dirName}:`, error);
                }
            }
            
            console.log('Classes data:', classesData);
            if (classesData.clases && classesData.clases.length > 0) {
                populateDropdown();
            } else {
                console.error('No classes data available');
                showError('No classes data available');
            }
        } catch (error) {
            console.error('Error loading classes data:', error);
            showError('Error loading classes data: ' + error.message);
        }
    }
    
    // Populate the dropdown selector with class options
    function populateDropdown() {
        console.log('Populating dropdown with classes data:', classesData);
        classSelector.innerHTML = '<option value="">Seleccione una clase</option>';
        
        if (classesData.clases && classesData.clases.length > 0) {
            classesData.clases.forEach(clase => {
                const option = document.createElement('option');
                option.value = clase.nombre;
                option.textContent = formatClassName(clase.nombre);
                classSelector.appendChild(option);
                console.log(`Added option for ${clase.nombre}`);
            });
        } else {
            console.error('No classes data available');
        }
        
        // Add event listener for dropdown change
        classSelector.addEventListener('change', handleClassSelection);
        
        // Auto-select first element or saved selection
        autoSelectClass();
    }
    
    // Auto-select first element or saved selection
    function autoSelectClass() {
        const savedClass = localStorage.getItem('selectedClass');
        if (savedClass) {
            classSelector.value = savedClass;
            handleClassSelection();
        } else if (classesData.clases && classesData.clases.length > 0) {
            // Select first class if no saved selection exists
            const firstClass = classesData.clases[0].nombre;
            classSelector.value = firstClass;
            handleClassSelection();
        }
    }
    
    // Format class name for display (remove prefix and underscores)
    function formatClassName(name) {
        return name.replace('C', 'Clase ').replace(/_/g, ' ');
    }
    
    // Handle class selection
    function handleClassSelection() {
        const selectedClassName = classSelector.value;
        if (!selectedClassName) {
            clearPlayer();
            clearDocuments();
            return;
        }
        
        const selectedClass = classesData.clases.find(clase => clase.nombre === selectedClassName);
        if (selectedClass) {
            loadYouTubeVideo(selectedClass);
            displayDocuments(selectedClass);
        }
    }
    
    // Load YouTube video
    function loadYouTubeVideo(clase) {
        clearPlayer();
        
        if (!clase.youtube_id) {
            showError('No YouTube video available for this class');
            return;
        }
        
        // Use hardcoded YouTube base URL
        const youtubeBaseUrl = 'https://youtu.be/';
        const youtubeUrl = youtubeBaseUrl + clase.youtube_id;
        
        // Create YouTube iframe with lazy loading
        const iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.src = `https://www.youtube.com/embed/${clase.youtube_id}?enablejsapi=1`;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.loading = 'lazy';
        
        youtubePlayer.appendChild(iframe);
        currentPlayer = iframe;
    }
    
    // Display associated documents in sidebar as buttons
    function displayDocuments(clase) {
        clearDocuments();
        
        if (!clase.docus || clase.docus.length === 0) {
            const noDocs = document.createElement('p');
            noDocs.textContent = 'No hay documentos disponibles para esta clase.';
            noDocs.style.color = '#666';
            noDocs.style.fontStyle = 'italic';
            documentsList.appendChild(noDocs);
        }
        
        // Add YouTube video button
        const youtubeButton = document.createElement('button');
        youtubeButton.className = 'document-item';
        youtubeButton.textContent = '📺 Ver Video';
        youtubeButton.onclick = () => {
            loadYouTubeVideo(clase);
        };
        documentsList.appendChild(youtubeButton);
        
        // Add document buttons
        if (clase.docus && clase.docus.length > 0) {
            clase.docus.forEach(doc => {
                const docButton = document.createElement('button');
                docButton.className = 'document-item';
                docButton.textContent = getDocumentIcon(doc) + ' ' + formatDocumentName(doc);
                docButton.onclick = () => previewDocument(clase.nombre, doc);
                
                documentsList.appendChild(docButton);
            });
        }
    }
    
    // Preview document in the video player panel
    function previewDocument(className, docName) {
        clearPlayer();
        
        // Use local symbolic link to access documents
        const docPath = 'Clases_DiploIA/' + className + '/' + docName;
        
        if (docName.endsWith('.pdf')) {
            // Preview PDF using embed in a separate container
            const pdfContainer = document.createElement('div');
            pdfContainer.style.width = '100%';
            pdfContainer.style.height = '100%';
            pdfContainer.style.backgroundColor = '#f8f9fa';
            pdfContainer.style.borderRadius = '8px';
            pdfContainer.style.overflow = 'hidden';
            
            const pdfEmbed = document.createElement('embed');
            pdfEmbed.src = docPath;
            pdfEmbed.type = 'application/pdf';
            pdfEmbed.width = '100%';
            pdfEmbed.height = '100%';
            
            pdfContainer.appendChild(pdfEmbed);
            youtubePlayer.appendChild(pdfContainer);
            currentPlayer = pdfContainer;
        } else if (docName.endsWith('.md')) {
            // Preview Markdown files with rich formatting, edit on demand
            fetch(docPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load document');
                    }
                    return response.text();
                })
                .then(markdown => {
                    createMarkdownViewerWithEdit(className, docName, markdown);
                })
                .catch(error => {
                    showError('Error loading document: ' + error.message);
                });
        } else if (docName.endsWith('.yaml') || docName.endsWith('.yml')) {
            // Preview YAML files with syntax highlighting
            fetch(docPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load document');
                    }
                    return response.text();
                })
                .then(text => {
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
                    youtubePlayer.appendChild(pre);
                    currentPlayer = pre;
                })
                .catch(error => {
                    showError('Error loading document: ' + error.message);
                });
        } else {
            showError('Document type not supported for preview');
        }
        
        // Add back button
        addBackToVideoButton(className);
    }
    
    // Remove back to video button functionality - now handled by sidebar
    function addBackToVideoButton(className) {
        // This function is no longer needed as switching is handled by sidebar buttons
    }
    
    // Get document icon based on file type
    function getDocumentIcon(filename) {
        if (filename.endsWith('.pdf')) return '📄';
        if (filename.endsWith('.md')) return '📝';
        if (filename.endsWith('.yaml') || filename.endsWith('.yml')) return '⚙️';
        return '📁';
    }
    
    // Format document name for display
    function formatDocumentName(filename) {
        return filename.replace(/_/g, ' ');
    }
    
    // Simple Markdown to HTML converter
    function convertMarkdownToHTML(markdown) {
        return markdown
            // Headers
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
            // Bold and italic
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Links
            .replace(/\\[(.*?)\\]\\((.*?)\\)/g, '<a href="$2" target="_blank">$1</a>')
            // Lists
            .replace(/^\* (.*$)/gm, '<li>$1</li>')
            .replace(/^\- (.*$)/gm, '<li>$1</li>')
            // Paragraphs
            .replace(/^(?!<[a-z])\S.*$/gm, '<p>$&</p>')
            // Code blocks
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            // Horizontal rules
            .replace(/^---$/gm, '<hr>')
            // Clean up multiple newlines
            .replace(/\n\n\n+/g, '\n\n');
    }
    
    // Create Markdown viewer with edit button (shows rich view by default)
    function createMarkdownViewerWithEdit(className, docName, markdownContent) {
        clearPlayer();
        
        const viewerContainer = document.createElement('div');
        viewerContainer.className = 'markdown-viewer-container';
        viewerContainer.style.display = 'flex';
        viewerContainer.style.flexDirection = 'column';
        viewerContainer.style.height = '100%';
        viewerContainer.style.gap = '10px';
        
        // Create action bar with edit button
        const actionBar = document.createElement('div');
        actionBar.style.display = 'flex';
        actionBar.style.justifyContent = 'flex-end';
        actionBar.style.padding = '5px';
        actionBar.style.backgroundColor = '#f0f0f0';
        actionBar.style.borderRadius = '5px';
        
        const editButton = document.createElement('button');
        editButton.textContent = '✏️ Editar Markdown';
        editButton.style.padding = '8px 15px';
        editButton.style.backgroundColor = 'var(--primary-color)';
        editButton.style.color = 'white';
        editButton.style.border = 'none';
        editButton.style.borderRadius = '5px';
        editButton.style.cursor = 'pointer';
        editButton.addEventListener('click', () => {
            createMarkdownEditor(className, docName, markdownContent);
        });
        
        actionBar.appendChild(editButton);
        
        // Create rich Markdown preview
        const preview = document.createElement('div');
        preview.className = 'markdown-viewer';
        preview.style.flex = '1';
        preview.style.padding = '20px';
        preview.style.backgroundColor = '#f8f9fa';
        preview.style.borderRadius = '5px';
        preview.style.overflow = 'auto';
        preview.style.textAlign = 'left';
        
        // Convert markdown to HTML
        const htmlContent = convertMarkdownToHTML(markdownContent);
        preview.innerHTML = htmlContent;
        
        viewerContainer.appendChild(actionBar);
        viewerContainer.appendChild(preview);
        
        youtubePlayer.appendChild(viewerContainer);
        currentPlayer = viewerContainer;
    }
    
    // Create Markdown editor with preview and save functionality
    function createMarkdownEditor(className, docName, markdownContent) {
        clearPlayer();
        
        const editorContainer = document.createElement('div');
        editorContainer.className = 'markdown-editor-container';
        editorContainer.style.display = 'flex';
        editorContainer.style.flexDirection = 'column';
        editorContainer.style.height = '100%';
        editorContainer.style.gap = '10px';
        
        // Create toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'markdown-toolbar';
        toolbar.style.display = 'flex';
        toolbar.style.gap = '5px';
        toolbar.style.padding = '5px';
        toolbar.style.backgroundColor = '#f0f0f0';
        toolbar.style.borderRadius = '5px';
        
        // Add formatting buttons
        const boldBtn = createToolbarButton('🔤', () => wrapText('**', '**'));
        const italicBtn = createToolbarButton('🔤', () => wrapText('*', '*'));
        const linkBtn = createToolbarButton('🔗', () => wrapText('[', '](url)'));
        const headerBtn = createToolbarButton('📜', () => insertText('# '));
        const codeBtn = createToolbarButton('💻', () => wrapText('`', '`'));
        const saveBtn = createToolbarButton('💾', () => saveMarkdownFile(className, docName, editor.value));
        const backBtn = createToolbarButton('🔙', () => createMarkdownViewerWithEdit(className, docName, editor.value));
        
        toolbar.appendChild(boldBtn);
        toolbar.appendChild(italicBtn);
        toolbar.appendChild(linkBtn);
        toolbar.appendChild(headerBtn);
        toolbar.appendChild(codeBtn);
        toolbar.appendChild(saveBtn);
        toolbar.appendChild(backBtn);
        
        // Create editor and preview container
        const editorPreviewContainer = document.createElement('div');
        editorPreviewContainer.style.display = 'flex';
        editorPreviewContainer.style.flex = '1';
        editorPreviewContainer.style.gap = '10px';
        editorPreviewContainer.style.overflow = 'hidden';
        
        // Create editor
        const editor = document.createElement('textarea');
        editor.className = 'markdown-editor';
        editor.value = markdownContent;
        editor.style.flex = '1';
        editor.style.padding = '10px';
        editor.style.fontFamily = 'monospace';
        editor.style.fontSize = '14px';
        editor.style.border = '1px solid #ddd';
        editor.style.borderRadius = '5px';
        editor.style.resize = 'none';
        editor.style.overflow = 'auto';
        
        // Create preview
        const preview = document.createElement('div');
        preview.className = 'markdown-preview';
        preview.style.flex = '1';
        preview.style.padding = '15px';
        preview.style.backgroundColor = '#f8f9fa';
        preview.style.border = '1px solid #ddd';
        preview.style.borderRadius = '5px';
        preview.style.overflow = 'auto';
        preview.style.textAlign = 'left';
        
        // Update preview when editor content changes
        editor.addEventListener('input', () => {
            const htmlContent = convertMarkdownToHTML(editor.value);
            preview.innerHTML = htmlContent;
        });
        
        // Initial preview
        const initialHTML = convertMarkdownToHTML(markdownContent);
        preview.innerHTML = initialHTML;
        
        editorPreviewContainer.appendChild(editor);
        editorPreviewContainer.appendChild(preview);
        
        editorContainer.appendChild(toolbar);
        editorContainer.appendChild(editorPreviewContainer);
        
        youtubePlayer.appendChild(editorContainer);
        currentPlayer = editorContainer;
        
        // Helper function to create toolbar buttons
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
        
        // Helper function to wrap selected text
        function wrapText(prefix, suffix) {
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            const selectedText = editor.value.substring(start, end);
            const newText = prefix + selectedText + suffix;
            editor.setRangeText(newText, start, end, 'end');
        }
        
        // Helper function to insert text at cursor
        function insertText(text) {
            const pos = editor.selectionStart;
            editor.setRangeText(text, pos, pos, 'end');
        }
        
        // Save function
        function saveMarkdownFile(className, docName, content) {
            const docPath = 'Clases_DiploIA/' + className + '/' + docName;
            
            // Create a blob with the content
            const blob = new Blob([content], { type: 'text/markdown' });
            
            // Create download link
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
    }
    
    // Clear YouTube player
    function clearPlayer() {
        if (currentPlayer) {
            youtubePlayer.removeChild(currentPlayer);
            currentPlayer = null;
        }
    }
    
    // Clear documents list
    function clearDocuments() {
        documentsList.innerHTML = '';
    }
    
    // Show error message
    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        // Insert error message before the video container
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            videoContainer.parentNode.insertBefore(errorElement, videoContainer);
        }
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.parentNode.removeChild(errorElement);
            }
        }, 5000);
    }
    
    // Initialize the application
    loadClassesData();
    
    // Save selection state to localStorage
    classSelector.addEventListener('change', function() {
        localStorage.setItem('selectedClass', this.value);
    });
});