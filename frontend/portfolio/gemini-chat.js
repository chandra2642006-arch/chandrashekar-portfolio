// ============================================================
// Gemini AI Portfolio Chat Assistant
// Chandra Shekar Sai Ram Boppana — Personal Portfolio Bot
// ============================================================

(function () {
  // API key is stored in localStorage — never hardcoded in source
  function getApiKey() {
    let key = localStorage.getItem('chandrabot_key');
    if (!key) {
      key = prompt('🤖 ChandraBot Setup\n\nEnter your Gemini API key to activate the AI assistant.\n(Get one free at: aistudio.google.com)\n\nYour key is saved locally and never sent anywhere except Google.');
      if (key) localStorage.setItem('chandrabot_key', key.trim());
    }
    return key ? key.trim() : null;
  }
  const GEMINI_API_KEY = getApiKey();
  if (!GEMINI_API_KEY) return;
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const SYSTEM_PROMPT = `You are ChandraBot, a friendly and smart AI assistant on the personal portfolio of Chandra Shekar Sai Ram Boppana.
Your job is to answer questions visitors ask about Chandra Shekar — his education, skills, projects, goals, and contact info.
Always be concise, friendly, and professional. Keep answers short (2-5 sentences max). Use emojis occasionally for warmth.

Here is everything you know about Chandra Shekar:

NAME: Chandra Shekar Sai Ram Boppana
EDUCATION:
  - B.Tech in Electronics & Communication Engineering (ECE) at Vignan University, Guntur (2024–2028, Present)
  - Minor: Entrepreneurship
  - Current CGPA: 7.35 / 10.0
  - Intermediate (MPC) at Sasi Junior College, Velivennu — 92%
  - SSC (CBSE) at Vignan World One School — 69%

SKILLS:
  - Programming: Python, C Programming
  - Database: SQL, MySQL
  - Data Analysis: MS Excel, CSV Datasets
  - Tools & Hardware: VS Code, Arduino IDE, ESP32, IoT Sensors

PROJECTS:
  - Smart LPG Leak Detection System: Built an IoT hardware system using ESP32 microcontroller and MQ-2 gas sensor. Implemented threshold-based real-time gas leak detection with buzzer and LED alerts.

INTERESTS & GOALS:
  - Software Development, Data Analytics, IoT Engineering
  - Seeking internships, software development roles, and data analytics opportunities
  - Passionate about applying ECE knowledge in real-world tech products

CONTACT:
  - Email: chandra2642006@gmail.com
  - LinkedIn: linkedin.com/in/chandra-shekar-sai-ram-boppana-42166732a
  - Location: Vignan University, Guntur, Andhra Pradesh, India

LANGUAGES SPOKEN: English, Telugu

If asked anything unrelated to Chandra Shekar or career topics, politely redirect the conversation back to the portfolio.`;

  // ── Inject CSS ──────────────────────────────────────────────
  const style = document.createElement('style');
  style.innerHTML = `
    #chandrabot-bubble {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #38BDF8, #818CF8);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 9999;
      box-shadow: 0 4px 20px rgba(56,189,248,0.5);
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
      animation: botPulse 3s infinite;
    }
    @keyframes botPulse {
      0%, 100% { box-shadow: 0 4px 20px rgba(56,189,248,0.4); }
      50% { box-shadow: 0 4px 35px rgba(129,140,248,0.7); }
    }
    #chandrabot-bubble:hover {
      transform: scale(1.1);
    }
    #chandrabot-bubble svg {
      width: 28px;
      height: 28px;
      fill: white;
    }
    #chandrabot-panel {
      position: fixed;
      bottom: 5.5rem;
      right: 2rem;
      width: 360px;
      max-height: 520px;
      display: flex;
      flex-direction: column;
      background: rgba(11,15,25,0.97);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(56,189,248,0.25);
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(56,189,248,0.08);
      z-index: 9998;
      overflow: hidden;
      transform: scale(0.8) translateY(30px);
      opacity: 0;
      pointer-events: none;
      transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }
    #chandrabot-panel.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }
    #chandrabot-header {
      padding: 1rem 1.2rem;
      background: linear-gradient(135deg, rgba(56,189,248,0.12), rgba(129,140,248,0.12));
      border-bottom: 1px solid rgba(255,255,255,0.07);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }
    #chandrabot-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #38BDF8, #818CF8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      flex-shrink: 0;
    }
    #chandrabot-header-text h4 {
      color: #F8FAFC;
      font-size: 0.95rem;
      font-weight: 700;
      margin: 0;
    }
    #chandrabot-header-text p {
      color: #34D399;
      font-size: 0.75rem;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
    #chandrabot-header-text p::before {
      content: '';
      width: 7px;
      height: 7px;
      background: #34D399;
      border-radius: 50%;
      animation: botPulse 2s infinite;
    }
    #chandrabot-close {
      margin-left: auto;
      background: none;
      border: none;
      color: #64748B;
      font-size: 1.3rem;
      cursor: pointer;
      padding: 0 0.2rem;
      transition: color 0.2s;
    }
    #chandrabot-close:hover { color: #F8FAFC; }
    #chandrabot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      scrollbar-width: thin;
      scrollbar-color: rgba(56,189,248,0.2) transparent;
    }
    .bot-msg, .user-msg {
      max-width: 85%;
      padding: 0.65rem 0.9rem;
      border-radius: 14px;
      font-size: 0.87rem;
      line-height: 1.5;
      animation: msgFadeIn 0.3s ease;
    }
    @keyframes msgFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .bot-msg {
      background: rgba(56,189,248,0.1);
      border: 1px solid rgba(56,189,248,0.2);
      color: #CBD5E1;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .user-msg {
      background: linear-gradient(135deg, rgba(56,189,248,0.25), rgba(129,140,248,0.25));
      border: 1px solid rgba(129,140,248,0.3);
      color: #F8FAFC;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .bot-typing {
      display: flex;
      gap: 5px;
      padding: 0.8rem 1rem;
      background: rgba(56,189,248,0.08);
      border: 1px solid rgba(56,189,248,0.15);
      border-radius: 14px;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
    }
    .bot-typing span {
      width: 7px;
      height: 7px;
      background: #38BDF8;
      border-radius: 50%;
      animation: typing 1.2s infinite;
    }
    .bot-typing span:nth-child(2) { animation-delay: 0.2s; }
    .bot-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing {
      0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
      40% { transform: scale(1.1); opacity: 1; }
    }
    #chandrabot-suggestions {
      padding: 0 1rem 0.5rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .suggestion-chip {
      background: rgba(56,189,248,0.08);
      border: 1px solid rgba(56,189,248,0.2);
      color: #38BDF8;
      border-radius: 50px;
      padding: 0.3rem 0.75rem;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .suggestion-chip:hover {
      background: rgba(56,189,248,0.2);
      transform: translateY(-1px);
    }
    #chandrabot-input-area {
      padding: 0.75rem 1rem;
      border-top: 1px solid rgba(255,255,255,0.07);
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }
    #chandrabot-input {
      flex: 1;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      padding: 0.6rem 0.9rem;
      color: #F8FAFC;
      font-size: 0.875rem;
      font-family: 'Inter', sans-serif;
      outline: none;
      transition: border-color 0.2s;
    }
    #chandrabot-input:focus {
      border-color: rgba(56,189,248,0.5);
    }
    #chandrabot-input::placeholder { color: #475569; }
    #chandrabot-send {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #38BDF8, #818CF8);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 0.2s, opacity 0.2s;
    }
    #chandrabot-send:hover { transform: scale(1.05); }
    #chandrabot-send:disabled { opacity: 0.4; cursor: default; transform: none; }
    #chandrabot-send svg { width: 18px; height: 18px; fill: white; }
    @media (max-width: 480px) {
      #chandrabot-panel { width: calc(100vw - 2rem); right: 1rem; bottom: 5rem; }
      #chandrabot-bubble { right: 1rem; bottom: 1rem; }
    }
  `;
  document.head.appendChild(style);

  // ── Build HTML ───────────────────────────────────────────────
  document.body.insertAdjacentHTML('beforeend', `
    <div id="chandrabot-bubble" title="Ask ChandraBot about me!">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-5h2v2h-2zm0-8h2v6h-2z"/>
      </svg>
    </div>

    <div id="chandrabot-panel">
      <div id="chandrabot-header">
        <div id="chandrabot-avatar">🤖</div>
        <div id="chandrabot-header-text">
          <h4>ChandraBot AI</h4>
          <p>Online — Ask me anything!</p>
        </div>
        <button id="chandrabot-close">✕</button>
      </div>

      <div id="chandrabot-messages">
        <div class="bot-msg">Hi! 👋 I'm <strong>ChandraBot</strong>, Chandra Shekar's AI assistant.<br>Ask me about his skills, projects, education, or how to contact him!</div>
      </div>

      <div id="chandrabot-suggestions">
        <span class="suggestion-chip">🎓 Education</span>
        <span class="suggestion-chip">💻 Skills</span>
        <span class="suggestion-chip">🔧 Projects</span>
        <span class="suggestion-chip">📧 Contact</span>
      </div>

      <div id="chandrabot-input-area">
        <input id="chandrabot-input" type="text" placeholder="Ask about Chandra Shekar..." autocomplete="off" maxlength="300">
        <button id="chandrabot-send">
          <svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  `);

  // ── Logic ─────────────────────────────────────────────────────
  const bubble = document.getElementById('chandrabot-bubble');
  const panel = document.getElementById('chandrabot-panel');
  const closeBtn = document.getElementById('chandrabot-close');
  const messagesEl = document.getElementById('chandrabot-messages');
  const inputEl = document.getElementById('chandrabot-input');
  const sendBtn = document.getElementById('chandrabot-send');
  const suggestions = document.querySelectorAll('.suggestion-chip');

  let isOpen = false;
  let isLoading = false;
  const conversationHistory = [];

  bubble.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    if (isOpen) inputEl.focus();
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    panel.classList.remove('open');
  });

  suggestions.forEach(chip => {
    chip.addEventListener('click', () => {
      const map = {
        '🎓 Education': "Tell me about Chandra Shekar's education",
        '💻 Skills': "What are Chandra Shekar's technical skills?",
        '🔧 Projects': "What projects has Chandra Shekar built?",
        '📧 Contact': "How can I contact Chandra Shekar?"
      };
      inputEl.value = map[chip.textContent] || chip.textContent;
      sendMessage();
    });
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  sendBtn.addEventListener('click', sendMessage);

  function addMessage(text, isUser) {
    const div = document.createElement('div');
    div.className = isUser ? 'user-msg' : 'bot-msg';
    div.innerHTML = text.replace(/\n/g, '<br>');
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'bot-typing';
    div.id = 'chandrabot-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('chandrabot-typing');
    if (t) t.remove();
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isLoading) return;

    addMessage(text, true);
    inputEl.value = '';
    isLoading = true;
    sendBtn.disabled = true;
    showTyping();

    conversationHistory.push({ role: 'user', parts: [{ text }] });

    try {
      const res = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: conversationHistory,
          generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
        })
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || 'API error');
      }

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that. Try asking about Chandra Shekar's skills or projects!";
      conversationHistory.push({ role: 'model', parts: [{ text: reply }] });
      hideTyping();
      addMessage(reply, false);

    } catch (err) {
      hideTyping();
      addMessage(`⚠️ Oops! Couldn't connect to AI. (${err.message})<br>Please check your Gemini API key.`, false);
      console.error('ChandraBot error:', err);
    }

    isLoading = false;
    sendBtn.disabled = false;
    inputEl.focus();
  }

})();
