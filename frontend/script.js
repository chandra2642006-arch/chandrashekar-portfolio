const chatBox = document.querySelector('.chat-box');
const commandInput = document.getElementById('command');
const sendBtn = document.querySelector('.send-btn');
const voiceBtn = document.querySelector('.voice-btn');

function displayUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message user';
    msgDiv.innerHTML = `<strong>You</strong><span>${escapeHtml(text)}</span>`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function displayAiMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ai';
    msgDiv.innerHTML = `<strong>AI</strong><span>${escapeHtml(text)}</span>`;
    
    // Add quick download link if excel was created
    if (text.includes("Excel") || text.includes("excel")) {
        const downloadDiv = document.createElement('div');
        downloadDiv.style.marginTop = '8px';
        downloadDiv.innerHTML = `<a href="/download/excel" download style="color: #6c7cff; text-decoration: underline; font-weight: bold; display: inline-block;">📥 Download Student_Team_Details.xlsx</a>`;
        msgDiv.appendChild(downloadDiv);
    }

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

async function sendCommandToServer(userCommand) {
    if (!userCommand.trim()) return;
    
    displayUserMessage(userCommand);
    commandInput.value = '';

    try {
        let response = await fetch('/command', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ command: userCommand })
        });

        let data = await response.json();
        displayAiMessage(data.response);

    } catch (error) {
        console.error("Error communicating with AI Brain:", error);
        displayAiMessage("⚠️ Connection to AI Brain lost. Please start server.py.");
    }
}

// Event Listeners
sendBtn.addEventListener('click', () => {
    sendCommandToServer(commandInput.value);
});

commandInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendCommandToServer(commandInput.value);
    }
});

if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
        commandInput.value = 'create excel';
        sendCommandToServer('create excel');
    });
}