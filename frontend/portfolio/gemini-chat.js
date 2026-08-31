// ============================================================
// ChandraBot — Built-in Portfolio Assistant
// Chandra Shekar Sai Ram Boppana — Personal Portfolio Bot
// No API key required. Fully built-in. Works on GitHub Pages.
// ============================================================

(function () {

  // ── Response Engine ────────────────────────────────────────
  function getResponse(input) {
    const q = input.toLowerCase().trim();

    // Greetings
    if (/^(hi|hello|hey|hii|helo|namaste|good morning|good evening|good afternoon|sup|howdy)/.test(q)) {
      return "Hey there! 👋 I'm **ChandraBot**, Chandra Shekar's personal assistant.\nI can tell you about his skills, education, projects, and how to contact him. What would you like to know?";
    }

    // Who are you / what are you
    if (/(who are you|what are you|tell me about yourself|about bot|about chandrabot|your name)/.test(q)) {
      return "I'm **ChandraBot** 🤖 — the built-in assistant for Chandra Shekar Sai Ram Boppana's portfolio!\nI know everything about Chandra Shekar — his education, skills, projects, and goals. Just ask!";
    }

    // Who is Chandra / About Chandra
    if (/(who is chandra|about chandra|tell me about chandra|introduce|introduction|portfolio owner|about him)/.test(q)) {
      return "👨‍💻 **Chandra Shekar Sai Ram Boppana** is a B.Tech ECE student at Vignan University, Guntur (2024–2028) with a Minor in Entrepreneurship.\n\nHe's passionate about **Software Development**, **Data Analytics**, and **IoT Engineering**. Current CGPA: **7.35/10**.\n\n📧 chandra2642006@gmail.com\n🔗 LinkedIn in the Contact section!";
    }

    // Education
    if (/(education|study|studying|college|university|school|degree|btech|b\.tech|cgpa|gpa|marks|percentage|academic|qualification|intermediate|ssc|10th|12th|vignan)/.test(q)) {
      return "🎓 **Education Background:**\n\n**B.Tech ECE** — Vignan University, Guntur (2024–2028)\n• Minor: Entrepreneurship\n• CGPA: **7.35 / 10.0**\n\n**Intermediate (MPC)** — Sasi Junior College, Velivennu\n• Percentage: **92%**\n\n**SSC (CBSE)** — Vignan World One School\n• Percentage: **69%**";
    }

    // CGPA
    if (/(cgpa|gpa|grade|score|result)/.test(q)) {
      return "📊 Chandra Shekar's current **B.Tech CGPA is 7.35 / 10.0** at Vignan University. He scored **92%** in Intermediate and **69%** in SSC.";
    }

    // Skills
    if (/(skill|skills|tech|technology|know|expert|language|tool|programming|code|coding|software)/.test(q) && !/(project|work|build|built|create|developed)/.test(q)) {
      return "💻 **Technical Skills:**\n\n🐍 **Programming:** Python, C\n🗄️ **Database:** SQL, MySQL\n📊 **Data Analysis:** MS Excel, CSV Datasets\n🌐 **Web:** HTML, CSS, JavaScript\n🛠️ **Tools & Hardware:** VS Code, Arduino IDE, ESP32, IoT Sensors\n🧠 **Other:** DSA, Embedded C, Hardware Telemetry";
    }

    // Python
    if (/python/.test(q)) {
      return "🐍 Yes! Chandra Shekar knows **Python** — one of his primary programming languages, used for software development and data analytics.";
    }

    // SQL / Database
    if (/(sql|mysql|database|db|query)/.test(q)) {
      return "🗄️ Chandra Shekar is proficient in **SQL and MySQL** for database design, queries, and optimization. He applies SQL in data analytics workflows.";
    }

    // IoT / ESP32 / Hardware
    if (/(iot|esp32|arduino|sensor|hardware|embedded|microcontroller|lpg|gas|mq2|mq-2|buzzer|led)/.test(q)) {
      return "📟 Chandra Shekar built a real-world IoT project — the **Smart LPG Leak Detection System** — using **ESP32**, **MQ-2 gas sensor**, and **Arduino IDE**. Features threshold-based gas detection with buzzer + LED alerts! Try the live simulator on this page! 🔥";
    }

    // Projects
    if (/(project|projects|build|built|create|created|develop|developed|work|made|prototype|what did|what has)/.test(q)) {
      return "🔧 **Featured Project:**\n\n🔥 **Smart LPG Leak Detection System** (IoT)\n• ESP32 microcontroller + MQ-2 gas sensor\n• Arduino IDE firmware\n• Real-time threshold-based leak detection\n• Audio buzzer + LED visual alerts\n• **Live Simulator** on this portfolio! 📟\n\nClick **'Launch Live IoT Simulator'** in the Projects section!";
    }

    // Interests / Goals / Career
    if (/(interest|goal|aim|aspire|passion|focus|future|career|roadmap|plan|looking for|seeking)/.test(q)) {
      return "🚀 **Goals & Interests:**\n\n• Software Development 💻\n• Data Analytics 📊\n• IoT Engineering 📟\n• Embedded Systems & Hardware\n• Entrepreneurship & Prototyping\n\n🎯 Seeking **internships**, software development roles, and data analytics opportunities!";
    }

    // Contact / Email / LinkedIn / Hire
    if (/(contact|email|mail|reach|linkedin|connect|message|hire|hiring|opportunity|touch)/.test(q)) {
      return "📬 **Contact Chandra Shekar:**\n\n📧 **Email:** chandra2642006@gmail.com\n🔗 **LinkedIn:** linkedin.com/in/chandra-shekar-sai-ram-boppana-42166732a\n📍 **Location:** Vignan University, Guntur, AP\n\nOpen to internships, dev roles & data analytics opportunities! ✉️";
    }

    // Location
    if (/(location|where|city|state|place|live|based|guntur|andhra|india|vignan)/.test(q)) {
      return "📍 Chandra Shekar is based at **Vignan University, Guntur, Andhra Pradesh, India** — currently pursuing B.Tech ECE (2024–2028).";
    }

    // Languages
    if (/(language|speak|spoken|telugu|english|communicate)/.test(q)) {
      return "🗣️ Chandra Shekar speaks **English** and **Telugu** fluently!";
    }

    // Minor / Entrepreneurship
    if (/(minor|entrepreneurship|startup|business|entrepreneur)/.test(q)) {
      return "💡 Chandra Shekar is pursuing a **Minor in Entrepreneurship** at Vignan University — passionate about product prototyping and real-world tech solutions!";
    }

    // Resume
    if (/(resume|cv|curriculum|download)/.test(q)) {
      return "📄 Download Chandra Shekar's **Resume PDF** from the green **'Resume PDF 📄'** button in the hero section at the top of this page!";
    }

    // Data Analytics / Excel
    if (/(data|analytics|analysis|excel|csv|dataset|business intelligence)/.test(q)) {
      return "📊 Chandra Shekar works with **MS Excel** for business intelligence, **CSV datasets**, and **SQL** for structured data querying. Actively growing his Data Analytics expertise!";
    }

    // DSA
    if (/(dsa|data structure|algorithm|problem solving|competitive|leetcode)/.test(q)) {
      return "🧠 Chandra Shekar is building skills in **Data Structures & Algorithms (DSA)** and problem-solving — a key part of his software development roadmap!";
    }

    // Thank you / bye
    if (/(thank|thanks|thank you|bye|goodbye|see you|great|awesome|nice|cool|perfect)/.test(q)) {
      return "You're welcome! 😊 Feel free to ask anything else about Chandra Shekar. Good luck! 🚀";
    }

    // Help
    if (/(help|what can you|what do you|capabilities|options|topics|ask)/.test(q)) {
      return "🤖 I can answer questions about:\n\n🎓 **Education** — B.Tech ECE, CGPA, schools\n💻 **Skills** — Python, SQL, IoT, DSA, Excel\n🔧 **Projects** — Smart LPG Leak Detection\n📬 **Contact** — Email, LinkedIn\n🚀 **Goals** — Internships, career aspirations\n\nJust type your question! ✨";
    }

    // Batch / Year
    if (/(batch|year|when|2024|2028|graduation|graduate)/.test(q)) {
      return "📅 Chandra Shekar is in the **2024–2028 batch** at Vignan University. Expected graduation: **2028**.";
    }

    // Fallback
    const fallbacks = [
      "Hmm, I'm not sure about that! 🤔 Try asking about Chandra Shekar's **skills, projects, education, or contact info**!",
      "I didn't quite catch that! 😅 Ask me about his **education, skills, IoT project, or career goals**!",
      "That's outside my knowledge! 🤖 I know everything about Chandra Shekar — try asking about his **projects or skills**!"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  // ── Inject CSS ──────────────────────────────────────────────
  const style = document.createElement('style');
  style.innerHTML = `
    #chandrabot-bubble {
      position: fixed; bottom: 2rem; right: 2rem;
      width: 60px; height: 60px; border-radius: 50%;
      background: linear-gradient(135deg, #38BDF8, #818CF8);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; z-index: 9999;
      box-shadow: 0 4px 20px rgba(56,189,248,0.5);
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
      animation: botPulse 3s infinite;
    }
    @keyframes botPulse {
      0%, 100% { box-shadow: 0 4px 20px rgba(56,189,248,0.4); }
      50% { box-shadow: 0 4px 35px rgba(129,140,248,0.7); }
    }
    #chandrabot-bubble:hover { transform: scale(1.1); }
    #chandrabot-bubble svg { width: 28px; height: 28px; fill: white; }
    #chandrabot-panel {
      position: fixed; bottom: 5.5rem; right: 2rem;
      width: 360px; max-height: 520px;
      display: flex; flex-direction: column;
      background: rgba(11,15,25,0.97);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(56,189,248,0.25); border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(56,189,248,0.08);
      z-index: 9998; overflow: hidden;
      transform: scale(0.8) translateY(30px); opacity: 0; pointer-events: none;
      transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }
    #chandrabot-panel.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
    #chandrabot-header {
      padding: 1rem 1.2rem;
      background: linear-gradient(135deg, rgba(56,189,248,0.12), rgba(129,140,248,0.12));
      border-bottom: 1px solid rgba(255,255,255,0.07);
      display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0;
    }
    #chandrabot-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: linear-gradient(135deg, #38BDF8, #818CF8);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem; flex-shrink: 0;
    }
    #chandrabot-header-text h4 { color: #F8FAFC; font-size: 0.95rem; font-weight: 700; margin: 0; }
    #chandrabot-header-text p {
      color: #34D399; font-size: 0.75rem; margin: 0;
      display: flex; align-items: center; gap: 0.3rem;
    }
    #chandrabot-header-text p::before {
      content: ''; width: 7px; height: 7px; background: #34D399;
      border-radius: 50%; animation: onlinePulse 2s infinite;
    }
    @keyframes onlinePulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    #chandrabot-close {
      margin-left: auto; background: none; border: none;
      color: #64748B; font-size: 1.3rem; cursor: pointer; padding: 0 0.2rem; transition: color 0.2s;
    }
    #chandrabot-close:hover { color: #F8FAFC; }
    #chandrabot-messages {
      flex: 1; overflow-y: auto; padding: 1rem;
      display: flex; flex-direction: column; gap: 0.75rem;
      scrollbar-width: thin; scrollbar-color: rgba(56,189,248,0.2) transparent;
    }
    .bot-msg, .user-msg {
      max-width: 85%; padding: 0.65rem 0.9rem; border-radius: 14px;
      font-size: 0.87rem; line-height: 1.55; animation: msgFadeIn 0.3s ease;
    }
    @keyframes msgFadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    .bot-msg {
      background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.2);
      color: #CBD5E1; align-self: flex-start; border-bottom-left-radius: 4px;
    }
    .user-msg {
      background: linear-gradient(135deg, rgba(56,189,248,0.25), rgba(129,140,248,0.25));
      border: 1px solid rgba(129,140,248,0.3);
      color: #F8FAFC; align-self: flex-end; border-bottom-right-radius: 4px;
    }
    .bot-typing {
      display: flex; gap: 5px; padding: 0.8rem 1rem;
      background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.15);
      border-radius: 14px; border-bottom-left-radius: 4px; align-self: flex-start;
    }
    .bot-typing span {
      width: 7px; height: 7px; background: #38BDF8; border-radius: 50%;
      animation: dotBounce 1.2s infinite;
    }
    .bot-typing span:nth-child(2){animation-delay:0.2s}
    .bot-typing span:nth-child(3){animation-delay:0.4s}
    @keyframes dotBounce { 0%,80%,100%{transform:scale(0.7);opacity:0.4} 40%{transform:scale(1.1);opacity:1} }
    #chandrabot-suggestions {
      padding: 0 1rem 0.5rem; display: flex; flex-wrap: wrap; gap: 0.4rem;
    }
    .suggestion-chip {
      background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.2);
      color: #38BDF8; border-radius: 50px; padding: 0.3rem 0.75rem;
      font-size: 0.75rem; cursor: pointer; transition: all 0.2s ease; white-space: nowrap;
    }
    .suggestion-chip:hover { background: rgba(56,189,248,0.2); transform: translateY(-1px); }
    #chandrabot-input-area {
      padding: 0.75rem 1rem; border-top: 1px solid rgba(255,255,255,0.07);
      display: flex; gap: 0.5rem; flex-shrink: 0;
    }
    #chandrabot-input {
      flex: 1; background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
      padding: 0.6rem 0.9rem; color: #F8FAFC; font-size: 0.875rem;
      font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.2s;
    }
    #chandrabot-input:focus { border-color: rgba(56,189,248,0.5); }
    #chandrabot-input::placeholder { color: #475569; }
    #chandrabot-send {
      width: 40px; height: 40px; border-radius: 10px;
      background: linear-gradient(135deg, #38BDF8, #818CF8);
      border: none; cursor: pointer; display: flex; align-items: center;
      justify-content: center; flex-shrink: 0; transition: transform 0.2s, opacity 0.2s;
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
    <div id="chandrabot-bubble" title="Chat with ChandraBot!">
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
    </div>
    <div id="chandrabot-panel">
      <div id="chandrabot-header">
        <div id="chandrabot-avatar">🤖</div>
        <div id="chandrabot-header-text">
          <h4>ChandraBot</h4>
          <p>Online — Ask me anything!</p>
        </div>
        <button id="chandrabot-close" aria-label="Close">✕</button>
      </div>
      <div id="chandrabot-messages">
        <div class="bot-msg">Hi! 👋 I am <strong>ChandraBot</strong>, Chandra Shekar built-in assistant.<br>Ask me about his skills, projects, education, or how to contact him!</div>
      </div>
      <div id="chandrabot-suggestions">
        <span class="suggestion-chip">🎓 Education</span>
        <span class="suggestion-chip">💻 Skills</span>
        <span class="suggestion-chip">🔧 Projects</span>
        <span class="suggestion-chip">📧 Contact</span>
        <span class="suggestion-chip">🚀 Goals</span>
      </div>
      <div id="chandrabot-input-area">
        <input id="chandrabot-input" type="text" placeholder="Ask about Chandra Shekar..." autocomplete="off" maxlength="300">
        <button id="chandrabot-send" aria-label="Send">
          <svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  `);

  // ── Logic ─────────────────────────────────────────────────────
  const bubble     = document.getElementById('chandrabot-bubble');
  const panel      = document.getElementById('chandrabot-panel');
  const closeBtn   = document.getElementById('chandrabot-close');
  const messagesEl = document.getElementById('chandrabot-messages');
  const inputEl    = document.getElementById('chandrabot-input');
  const sendBtn    = document.getElementById('chandrabot-send');
  const chips      = document.querySelectorAll('.suggestion-chip');

  let isOpen = false;

  bubble.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    if (isOpen) inputEl.focus();
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    panel.classList.remove('open');
  });

  const chipQueries = {
    '🎓 Education': "Tell me about Chandra Shekar education",
    '💻 Skills':    "What are Chandra Shekar technical skills",
    '🔧 Projects':  "What projects has Chandra Shekar built",
    '📧 Contact':   "How can I contact Chandra Shekar",
    '🚀 Goals':     "What are Chandra Shekar career goals"
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      inputEl.value = chipQueries[chip.textContent] || chip.textContent;
      sendMessage();
    });
  });

  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  sendBtn.addEventListener('click', sendMessage);

  function addMessage(text, isUser) {
    const div = document.createElement('div');
    div.className = isUser ? 'user-msg' : 'bot-msg';
    div.innerHTML = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
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

  function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    addMessage(text, true);
    inputEl.value = '';
    sendBtn.disabled = true;
    showTyping();
    setTimeout(() => {
      hideTyping();
      addMessage(getResponse(text), false);
      sendBtn.disabled = false;
      inputEl.focus();
    }, 400 + Math.random() * 350);
  }

})();
