document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    const uploadSection = document.getElementById('upload-section');
    const loadingSection = document.getElementById('loading-section');
    const resultSection = document.getElementById('result-section');

    const originalImg = document.getElementById('original-img');
    const resultImg = document.getElementById('result-img');

    const resetBtn = document.getElementById('reset-btn');
    const downloadBtn = document.getElementById('download-btn');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    let currentFile = null;

    // --- Drag and Drop Events ---
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropZone.classList.add('dragover');
    }

    function unhighlight(e) {
        dropZone.classList.remove('dragover');
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;
        handleFiles(files);
    }

    // --- Click to Upload ---
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    // --- Handle Files ---
    function handleFiles(files) {
        if (files.length === 0) return;

        const file = files[0];

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (PNG, JPG, WEBP).');
            return;
        }

        currentFile = file;
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onloadend = function() {
            // Display original image
            originalImg.src = reader.result;

            // Start processing simulation
            startProcessing(reader.result);
        }
    }

    async function startProcessing(imgDataUrl) {
        // Show loading, hide upload
        uploadSection.style.display = 'none';
        loadingSection.classList.add('active');
        resultSection.classList.remove('active');

        progressBar.style.width = '0%';
        progressText.textContent = 'Initializing AI model...';

        try {
            // Using @imgly/background-removal
            // Ensure the library is available globally (from CDN in HTML)
            if (typeof imglyRemoveBackground === 'undefined') {
                throw new Error("Background removal library not loaded.");
            }

            // Configuration for the library
            const config = {
                progress: (key, current, total) => {
                    if (key.includes('fetch')) {
                        const percent = Math.round((current / total) * 100);
                        progressBar.style.width = `${percent}%`;
                        progressText.textContent = `Downloading AI models... ${percent}%`;
                    } else if (key.includes('compute')) {
                        progressBar.style.width = '100%';
                        progressText.textContent = 'Processing image... almost done!';
                    }
                }
            };

            // Call the library function
            const blob = await imglyRemoveBackground(currentFile, config);

            // Convert result blob to object URL
            const url = URL.createObjectURL(blob);
            resultImg.src = url;

            // Hide loading, show result
            loadingSection.classList.remove('active');
            resultSection.classList.add('active');

        } catch (error) {
            console.error("Error processing image:", error);
            alert("Failed to remove background. Please try a different image or check console for errors.");

            // Reset to upload view on error
            uploadSection.style.display = 'block';
            loadingSection.classList.remove('active');
            resultSection.classList.remove('active');
            fileInput.value = '';
            currentFile = null;
        }
    }

    // --- Reset ---
    resetBtn.addEventListener('click', () => {
        uploadSection.style.display = 'block';
        resultSection.classList.remove('active');
        fileInput.value = ''; // Clear input
        currentFile = null;
    });

    // --- Download ---
    downloadBtn.addEventListener('click', () => {
        if (!resultImg.src) return;

        const a = document.createElement('a');
        a.href = resultImg.src;
        a.download = `owntools-nobg-${new Date().getTime()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});