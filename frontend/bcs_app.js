/* ==========================================================================
   BCS AGENT: UNIFIED VOICE-FIRST ECOSYSTEM SCRIPT
   Handles Speech Recognition, Wake Word Detection, TTS Synthesis,
   Node Routing Pipeline Animation, and Backend API Communication.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const micBtn = document.getElementById('micBtn');
  const micStatus = document.getElementById('micStatus');
  const commandInput = document.getElementById('commandInput');
  const sendBtn = document.getElementById('sendBtn');
  const responseBox = document.getElementById('responseBox');
  const codeBox = document.getElementById('codeBox');
  const routeStatusTag = document.getElementById('routeStatusTag');
  
  // Node Cards
  const nodeMobile = document.getElementById('nodeMobile');
  const nodeLaptop = document.getElementById('nodeLaptop');
  const nodeReasoning = document.getElementById('nodeReasoning');

  // Quick Action Chips
  const triggerChips = document.querySelectorAll('.trigger-chip');

  // Speech Recognition Setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let isListening = false;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isListening = true;
      micBtn.classList.add('active');
      micStatus.innerText = 'Listening for "Hey BCS" or command...';
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      micStatus.innerText = 'Click mic or say "Hey BCS"';
      micBtn.classList.remove('active');
      isListening = false;
    };

    recognition.onend = () => {
      if (isListening) {
        try { recognition.start(); } catch (e) {}
      } else {
        micBtn.classList.remove('active');
        micStatus.innerText = 'Click mic or say "Hey BCS"';
      }
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript.trim()) {
        const text = finalTranscript.trim();
        console.log('🎤 Speech Captured:', text);
        commandInput.value = text;
        submitCommand(text);
      }
    };
  } else {
    micStatus.innerText = 'Speech API not supported in browser (Use text input)';
  }

  // Toggle Microphone
  micBtn.addEventListener('click', () => {
    if (!recognition) return;
    if (isListening) {
      isListening = false;
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (e) {
        console.error(e);
      }
    }
  });

  // Submit via Button / Enter key
  sendBtn.addEventListener('click', () => {
    const text = commandInput.value.trim();
    if (text) submitCommand(text);
  });

  commandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const text = commandInput.value.trim();
      if (text) submitCommand(text);
    }
  });

  // Quick Trigger Chips
  triggerChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        commandInput.value = cmd;
        submitCommand(cmd);
      }
    });
  });

  // Master Command Handler
  async function submitCommand(promptText) {
    // Reset Node UI Highlights
    nodeMobile.classList.remove('active-target');
    nodeLaptop.classList.remove('active-target');
    nodeReasoning.classList.remove('active-target');

    responseBox.innerHTML = `<em>🤖 Routing & executing command...</em>`;
    codeBox.innerText = `// Awaiting execution pipeline results...`;
    routeStatusTag.innerText = 'ROUTING_IN_PROGRESS';

    try {
      const res = await fetch('/api/bcs/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: promptText })
      });

      const data = await res.json();
      renderExecutionOutput(data);
    } catch (err) {
      console.error('API Error:', err);
      responseBox.innerText = `⚠️ Connection Error: Could not reach BCS server at /api/bcs/command.`;
      routeStatusTag.innerText = 'SERVER_OFFLINE';
    }
  }

  // Render & Animate Pipeline Results
  function renderExecutionOutput(data) {
    const pipeline = data.routing_pipeline || {};
    const intent = pipeline.detected_intent;
    const result = data.execution_result || {};
    const spokenText = data.spoken_response || 'Command executed.';

    routeStatusTag.innerText = intent || 'EXECUTED';

    // Highlight Target Node
    if (intent === 'MOBILE_INTENT') {
      nodeMobile.classList.add('active-target');
    } else if (intent === 'LAPTOP_INTENT') {
      nodeLaptop.classList.add('active-target');
    } else {
      nodeReasoning.classList.add('active-target');
    }

    // Format Structured Output
    let outputHTML = `<strong>Agent:</strong> ${data.agent} (${data.wake_trigger})\n`;
    outputHTML += `<strong>Cleaned Command:</strong> "${data.cleaned_command}"\n`;
    outputHTML += `<strong>Target Node:</strong> ${pipeline.target_execution_node}\n`;
    outputHTML += `<strong>Module:</strong> ${pipeline.module_name}\n\n`;
    outputHTML += `<strong>Execution Status:</strong> ${result.status || 'SUCCESS'}\n`;
    outputHTML += `<strong>Spoken Response:</strong> "${spokenText}"\n\n`;
    outputHTML += `<strong>Details:</strong> ${result.details || 'Executed without errors.'}\n`;

    if (result.results) {
      outputHTML += `\n<strong>Structured Solution Parameters:</strong>\n`;
      for (const [key, val] of Object.entries(result.results)) {
        outputHTML += `  • ${key}: ${val}\n`;
      }
    }

    responseBox.innerText = outputHTML;

    // Render Code or Extra Logs if present
    if (result.code_snippet) {
      codeBox.innerText = `// File: ${result.filename || 'output'}\n// Saved to: ${result.filepath || 'workspace'}\n\n${result.code_snippet}`;
    } else if (result.message_body) {
      codeBox.innerText = `// Direct SMS Payload\nRecipient: ${result.target}\nNumber: ${result.phone_number}\nMessage: "${result.message_body}"`;
    } else if (result.action === 'WHATSAPP_AUTOMATION') {
      codeBox.innerText = `// WhatsApp Automation Payload\nTarget Contact: ${result.contact}\nStatus: DISPATCHED\nMessage: "${result.message}"`;
    } else {
      codeBox.innerText = JSON.stringify(result, null, 2);
    }

    // Hands-Free Speech Synthesis
    speakResponse(spokenText);
  }

  // Text-To-Speech Synthesis
  function speakResponse(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop prior audio
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  // Load Status Telemetry on Startup
  async function checkTelemetry() {
    try {
      const res = await fetch('/api/bcs/status');
      const data = await res.json();
      console.log('📡 BCS System Telemetry:', data);
    } catch (e) {
      console.warn('Backend server telemetry check note:', e);
    }
  }

  checkTelemetry();
});
