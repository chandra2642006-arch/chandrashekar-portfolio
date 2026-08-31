document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Theme Toggle (Dark/Light Mode)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  
  // FORCE NEW DARK THEME to overwrite any old cached themes
  const savedTheme = 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  localStorage.setItem('portfolio-theme', savedTheme); 
  updateThemeIcon(savedTheme);
  
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon(newTheme);
  });
  
  function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
  
  // 2. Dynamic Typing Text Effect & Blinking Cursor
  const typingElement = document.getElementById('typingText');
  if (typingElement) {
    typingElement.style.borderRight = "2px solid var(--accent-cyan)";
    typingElement.style.animation = "blinkCursor 0.75s step-end infinite";
    
    // Inject blinking cursor CSS
    const style = document.createElement('style');
    style.innerHTML = `@keyframes blinkCursor { from, to { border-color: transparent } 50% { border-color: var(--accent-cyan); } }`;
    document.head.appendChild(style);

    const phrases = ["B.Tech ECE Student", "Python & SQL Developer", "Data Analytics Aspirant", "IoT Prototype Architect"];
    let phraseIndex = 0; let charIndex = 0; let isDeleting = false;
    
    function typeEffect() {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }
      
      let speed = isDeleting ? 40 : 80;
      
      if (!isDeleting && charIndex === currentPhrase.length) {
        speed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 500;
      }
      setTimeout(typeEffect, speed);
    }
    typeEffect();
  }
  
  // 3. Navbar Scroll Shadow Effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 4. Scroll Reveal Animation (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };
  
  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); 
      }
    });
  }, revealOptions);
  
  revealElements.forEach(el => revealOnScroll.observe(el));
  
  // 5. Interactive IoT LPG Leak Sensor Simulator Modal Logic
  const openSimBtn = document.getElementById('openSimBtn');
  const closeSimBtn = document.getElementById('closeSimBtn');
  const simModal = document.getElementById('simModal');
  const gasSlider = document.getElementById('gasSlider');
  const sliderPpmVal = document.getElementById('sliderPpmVal');
  const oledPpmVal = document.getElementById('oledPpmVal');
  const oledStatusBadge = document.getElementById('oledStatusBadge');
  
  if (openSimBtn && simModal) {
    openSimBtn.addEventListener('click', () => simModal.classList.add('active'));
    closeSimBtn.addEventListener('click', () => simModal.classList.remove('active'));
    simModal.addEventListener('click', (e) => {
      if (e.target === simModal) simModal.classList.remove('active');
    });
  }
  
  if (gasSlider) {
    gasSlider.addEventListener('input', (e) => {
      const ppm = parseInt(e.target.value, 10);
      sliderPpmVal.textContent = `${ppm} PPM`;
      oledPpmVal.textContent = `${ppm} PPM`;
      
      if (ppm < 400) {
        // Normal Safe
        oledStatusBadge.style.background = '#34D399';
        oledStatusBadge.style.color = '#000';
        oledStatusBadge.textContent = 'NORMAL';
        oledPpmVal.style.color = '#34D399';
        oledPpmVal.style.textShadow = '0 0 10px rgba(52, 211, 153, 0.5)';
      } else if (ppm >= 400 && ppm < 850) {
        // Warning
        oledStatusBadge.style.background = '#FBBF24';
        oledStatusBadge.style.color = '#000';
        oledStatusBadge.textContent = 'WARNING';
        oledPpmVal.style.color = '#FBBF24';
        oledPpmVal.style.textShadow = '0 0 10px rgba(251, 191, 36, 0.5)';
      } else {
        // Danger
        oledStatusBadge.style.background = '#EF4444';
        oledStatusBadge.style.color = '#fff';
        oledStatusBadge.textContent = 'LEAK DETECTED!';
        oledPpmVal.style.color = '#EF4444';
        oledPpmVal.style.textShadow = '0 0 15px rgba(239, 68, 68, 0.7)';
      }
    });
  }

  // 6. Initialize MoltenMetal Visual Canvas Instances (React Bits Spec)
  const moltenProps = {
    color1: "#5227FF",
    color2: "#FF9FFC",
    color3: "#FFFFFF",
    speed: 0.35,
    scale: 4,
    detail: 3,
    glow: 1.6,
    coreSize: 0.1,
    swirl: 1,
    fold: -0.2,
    blackPoint: 0.05,
    brightness: 1.3,
    colorMode: "molten",
    grain: true,
    grainIntensity: 0.05,
    mouseInteraction: true,
    mouseStrength: 0.3,
    opacity: 1
  };

  const moltenMetalContainerTop = document.getElementById('moltenMetalContainerTop');
  if (moltenMetalContainerTop && typeof window.initMoltenMetal === 'function') {
    window.initMoltenMetal(moltenMetalContainerTop, moltenProps);
  }

  const moltenMetalContainer = document.getElementById('moltenMetalContainer');
  if (moltenMetalContainer && typeof window.initMoltenMetal === 'function') {
    window.initMoltenMetal(moltenMetalContainer, moltenProps);
  }


  // 7. Initialize AnimatedList Interactive Showcase
  const animatedListContainer = document.getElementById('animatedListContainer');
  if (animatedListContainer && typeof window.initAnimatedList === 'function') {
    const items = [
      '⚡ Python & Core Software Engineering',
      '🗄️ SQL Database Architecture & Optimization',
      '📟 ESP32 Microcontroller & MQ-2 IoT Hardware',
      '📊 Data Analytics & Excel Business Intelligence',
      '🧠 Data Structures, Algorithms & Problem Solving',
      '🌐 Modern Dynamic Web Application Interfaces',
      '💡 Embedded C & Hardware Telemetry Systems',
      '🚀 Product Prototyping & Entrepreneurship Minor'
    ];

    window.initAnimatedList(animatedListContainer, {
      items: items,
      onItemSelect: (item, index) => {
        console.log('Selected item:', item, index);
      },
      showGradients: true,
      enableArrowNavigation: true,
      displayScrollbar: true
    });
  }

  // 8. Initialize GlowCursor Interactive Cursor Trail
  if (typeof window.initGlowCursor === 'function') {
    window.initGlowCursor(document.body, {
      color: "#67E8F9",
      secondaryColor: "#A78BFA",
      trailLength: 40,
      trailWidth: 8,
      trailTaper: 0.8,
      followSpeed: 0.16,
      glowIntensity: 1.9,
      glowSpread: 1.2,
      hotspot: 0.65,
      brightness: 1.25,
      opacity: 1,
      pulseSpeed: 1.1,
      noiseStrength: 0.035,
      idleFade: true,
      idleTimeout: 700,
      fadeDuration: 900,
      blendMode: "screen"
    });
  }

  // 9. Initialize 3D Card Perspective Tilt & Anti-Gravity Float (Aceternity UI)
  if (typeof window.initAll3DCards === 'function') {
    window.initAll3DCards();
  } else if (typeof window.init3DCard === 'function') {
    const projectCard3D = document.getElementById('projectCard3D');
    if (projectCard3D) window.init3DCard(projectCard3D);
  }
});





