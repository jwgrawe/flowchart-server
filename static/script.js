document.addEventListener('DOMContentLoaded', () => {
    mermaid.initialize({ startOnLoad: false });

    const promptInput = document.getElementById('prompt-input');
    const sendButton = document.getElementById('send-button');
    const chatHistory = document.getElementById('chat-history');
    const mermaidCodeBlock = document.getElementById('mermaid-code');
    const mermaidPreviewDiv = document.querySelector('.mermaid');
    const downloadSvgButton = document.getElementById('download-svg');
    const downloadPngButton = document.getElementById('download-png');

    sendButton.addEventListener('click', async () => {
        const userText = promptInput.value.trim();
        if (!userText) {
            return;
        }

        // Add user message to chat history
        const userMessage = document.createElement('div');
        userMessage.textContent = `User: ${userText}`;
        chatHistory.appendChild(userMessage);
        promptInput.value = ''; // Clear input

        try {
            const response = await fetch('/generate_mermaid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: userText }),
            });

            const result = await response.json();

            if (response.ok) {
                if (result.mermaid_code) {
                    // Display raw code
                    mermaidCodeBlock.textContent = result.mermaid_code;

                    // Render flowchart
                    mermaidPreviewDiv.textContent = result.mermaid_code; // Set textContent for rendering
                    mermaid.run({ nodes: [mermaidPreviewDiv] }).then(() => {
                        // Add AI response to chat history
                        const aiMessage = document.createElement('div');
                        aiMessage.textContent = `AI: Flowchart generated successfully.`;
                        chatHistory.appendChild(aiMessage);

                        // Enable download buttons
                        downloadSvgButton.disabled = false;
                        downloadPngButton.disabled = false;
                    }).catch((error) => {
                        const aiMessage = document.createElement('div');
                        aiMessage.textContent = `AI Error: Failed to render flowchart. ${error.message}`;
                        chatHistory.appendChild(aiMessage);
                        console.error('Mermaid render error:', error);
                    });

                } else if (result.error) {
                    const aiMessage = document.createElement('div');
                    aiMessage.textContent = `AI Error: ${result.error}`;
                    chatHistory.appendChild(aiMessage);
                }
            } else {
                const aiMessage = document.createElement('div');
                aiMessage.textContent = `Server Error: ${result.error || response.statusText}`;
                chatHistory.appendChild(aiMessage);
            }
        } catch (error) {
            const aiMessage = document.createElement('div');
            aiMessage.textContent = `Network Error: ${error.message}`;
            chatHistory.appendChild(aiMessage);
            console.error('Fetch error:', error);
        }
    });

    // SVG Download
    downloadSvgButton.addEventListener('click', () => {
        const svgElement = mermaidPreviewDiv.querySelector('svg');
        if (!svgElement) {
            console.error('No SVG element found to download.');
            return;
        }

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'flowchart.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // PNG Download (Basic implementation, might need canvg for complex SVGs)
    downloadPngButton.addEventListener('click', () => {
        const svgElement = mermaidPreviewDiv.querySelector('svg');
        if (!svgElement) {
            console.error('No SVG element found to download.');
            return;
        }

        // Note: Converting SVG to PNG in vanilla JS can be complex, especially with external resources or complex SVG features.
        // A library like `canvg` is often used for more robust conversion.
        // This is a basic attempt and might not work for all SVGs.

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            canvas.toDataURL('image/png', { quality: 1.0 }).split(',')[1];
            const pngUrl = canvas.toDataURL('image/png');

            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = 'flowchart.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        // This might fail due to CORS if the SVG includes external resources
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    });
});