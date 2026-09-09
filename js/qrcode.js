document.addEventListener('DOMContentLoaded', () => {
    const qrInput = document.getElementById('qr-input');
    const generateBtn = document.getElementById('generate-btn');
    const qrResultBox = document.getElementById('qr-result');
    const qrImg = document.getElementById('qr-img');
    const downloadBtn = document.getElementById('download-btn');

    generateBtn.addEventListener('click', generateQR);

    // Also generate on Enter key
    qrInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            generateQR();
        }
    });

    function generateQR() {
        const text = qrInput.value.trim();

        if (text.length > 0) {
            // Generate QR code using API
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}`;

            // Set image source
            qrImg.src = qrUrl;

            // Show the result box once the image loads
            qrImg.onload = () => {
                qrResultBox.classList.add('show');
            };
        } else {
            // Shake animation for empty input
            qrInput.classList.add('error-shake');
            qrInput.style.borderColor = 'var(--error-color)';

            setTimeout(() => {
                qrInput.classList.remove('error-shake');
                qrInput.style.borderColor = 'var(--border-color)';
            }, 500);
        }
    }

    // Handle Download
    downloadBtn.addEventListener('click', () => {
        const imageUrl = qrImg.src;
        if (!imageUrl) return;

        // Since the API might return image that causes CORS issues when drawing to canvas directly
        // for downloading, we use a fetch approach to create a blob URL.
        fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                // Generate a random filename based on timestamp
                a.download = `owntools-qrcode-${new Date().getTime()}.png`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
            .catch(error => {
                console.error('Error downloading image:', error);
                alert("Failed to download image. Try right-clicking the image and selecting 'Save image as...'.");
            });
    });
});