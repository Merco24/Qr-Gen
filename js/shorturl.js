document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('url-input');
    const shortenBtn = document.getElementById('shorten-btn');
    const resultBox = document.getElementById('result-box');
    const shortUrlDisplay = document.getElementById('short-url-display');
    const copyBtn = document.getElementById('copy-btn');
    const copyText = document.getElementById('copy-text');
    const errorMsg = document.getElementById('error-msg');

    shortenBtn.addEventListener('click', shortenUrl);

    urlInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            shortenUrl();
        }
    });

    // Basic URL validation
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    function shortenUrl() {
        let inputUrl = urlInput.value.trim();

        // Auto add https if missing for valid format checking
        if (inputUrl && !/^https?:\/\//i.test(inputUrl)) {
            inputUrl = 'https://' + inputUrl;
        }

        if (inputUrl.length === 0 || !isValidUrl(inputUrl)) {
            urlInput.style.borderColor = 'var(--error-color)';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('show');
            return;
        }

        // Reset error state
        urlInput.style.borderColor = 'var(--border-color)';
        errorMsg.style.display = 'none';

        // Mock shortening process
        shortenBtn.textContent = 'Shortening...';
        shortenBtn.disabled = true;

        setTimeout(() => {
            // Generate a random mock short URL string
            const randomString = Math.random().toString(36).substring(2, 8);
            const mockShortUrl = `https://ownt.ls/${randomString}`;

            shortUrlDisplay.textContent = mockShortUrl;
            shortUrlDisplay.href = mockShortUrl;

            resultBox.classList.add('show');

            // Reset button
            shortenBtn.textContent = 'Shorten URL';
            shortenBtn.disabled = false;

            // Reset copy button state
            copyText.textContent = 'Copy';
            copyBtn.style.color = 'var(--secondary-text)';

        }, 600); // 600ms mock delay
    }

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        const urlToCopy = shortUrlDisplay.textContent;

        navigator.clipboard.writeText(urlToCopy).then(() => {
            copyText.textContent = 'Copied!';
            copyBtn.style.color = 'var(--success-color)';

            setTimeout(() => {
                copyText.textContent = 'Copy';
                copyBtn.style.color = 'var(--secondary-text)';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard.');
        });
    });
});