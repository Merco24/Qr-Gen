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

    function startProcessing(imgDataUrl) {
        // Show loading, hide upload
        uploadSection.style.display = 'none';
        loadingSection.classList.add('active');
        resultSection.classList.remove('active');

        // Simulate API call delay (e.g. 2.5 seconds)
        setTimeout(() => {
            // In a real app, you would send the file to an API like remove.bg here
            // and set resultImg.src to the returned image URL or base64.
            // Since we are mocking, we'll just display the original image as the result for now.
            // To make it look "different", one might apply a CSS filter, but we'll just show the image.
            resultImg.src = imgDataUrl; // Mocked result

            // Hide loading, show result
            loadingSection.classList.remove('active');
            resultSection.classList.add('active');
        }, 2500);
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