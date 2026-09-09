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

        shortenBtn.innerHTML = '<svg class="spinner" style="width: 20px; height: 20px; display: inline-block; vertical-align: middle; margin-right: 8px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Shortening...';
        shortenBtn.disabled = true;
        resultBox.classList.remove('show'); // Hide previous result if any

        // Using is.gd API which is free and doesn't require auth
        const apiUrl = `https://is.gd/create.php?format=json&url=${encodeURIComponent(inputUrl)}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.shorturl) {
                    shortUrlDisplay.textContent = data.shorturl;
                    shortUrlDisplay.href = data.shorturl;

                    resultBox.classList.add('show');
                } else if (data.errormessage) {
                    throw new Error(data.errormessage);
                } else {
                    throw new Error("Failed to shorten URL.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                errorMsg.textContent = "Error: Could not shorten URL. Please try again.";
                errorMsg.style.display = 'block';
                urlInput.style.borderColor = 'var(--error-color)';
            })
            .finally(() => {
                // Reset button
                shortenBtn.textContent = 'Shorten URL';
                shortenBtn.disabled = false;

                // Reset copy button state
                copyText.textContent = 'Copy';
                copyBtn.style.color = 'var(--secondary-text)';
            });
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