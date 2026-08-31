// AnimatedList standalone JS initializer
function initAnimatedList(container, props = {}) {
  if (!container) return null;

  const {
    items = [
      '⚡ Python & Software Engineering',
      '🗄️ SQL Database Architecture',
      '📟 ESP32 & MQ-2 IoT Hardware Systems',
      '📊 Data Analytics & Excel Telemetry',
      '🧠 Data Structures & Algorithms',
      '🌐 Modern Web Application Development',
      '💡 Embedded Systems & Microcontrollers',
      '🚀 Product Prototyping & Entrepreneurship'
    ],
    onItemSelect = (item, index) => console.log('Selected:', item, index),
    showGradients = true,
    enableArrowNavigation = true,
    displayScrollbar = true,
    initialSelectedIndex = -1
  } = props;

  container.innerHTML = '';
  container.className = 'scroll-list-container';

  const listEl = document.createElement('div');
  listEl.className = `scroll-list ${!displayScrollbar ? 'no-scrollbar' : ''}`;

  let selectedIndex = initialSelectedIndex;
  let topGradientEl = null;
  let bottomGradientEl = null;

  if (showGradients) {
    topGradientEl = document.createElement('div');
    topGradientEl.className = 'top-gradient';
    topGradientEl.style.opacity = '0';

    bottomGradientEl = document.createElement('div');
    bottomGradientEl.className = 'bottom-gradient';
    bottomGradientEl.style.opacity = '1';

    container.appendChild(topGradientEl);
    container.appendChild(bottomGradientEl);
  }

  const updateGradients = () => {
    if (!showGradients || !topGradientEl || !bottomGradientEl) return;
    const { scrollTop, scrollHeight, clientHeight } = listEl;
    topGradientEl.style.opacity = Math.min(scrollTop / 50, 1).toString();
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    bottomGradientEl.style.opacity = (scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1)).toString();
  };

  const itemElements = [];

  items.forEach((itemText, index) => {
    const itemWrapper = document.createElement('div');
    itemWrapper.setAttribute('data-index', index.toString());
    itemWrapper.style.marginBottom = '0.8rem';
    itemWrapper.style.cursor = 'pointer';
    itemWrapper.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

    const itemInner = document.createElement('div');
    itemInner.className = `item ${selectedIndex === index ? 'selected' : ''}`;

    const textP = document.createElement('p');
    textP.className = 'item-text';
    textP.textContent = itemText;

    itemInner.appendChild(textP);
    itemWrapper.appendChild(itemInner);

    itemWrapper.addEventListener('mouseenter', () => {
      setIndex(index);
    });

    itemWrapper.addEventListener('click', () => {
      setIndex(index);
      if (typeof onItemSelect === 'function') {
        onItemSelect(itemText, index);
      }
    });

    listEl.appendChild(itemWrapper);
    itemElements.push(itemWrapper);
  });

  container.appendChild(listEl);

  function setIndex(newIdx) {
    if (newIdx < 0 || newIdx >= items.length) return;
    selectedIndex = newIdx;
    itemElements.forEach((el, idx) => {
      const inner = el.querySelector('.item');
      if (idx === selectedIndex) {
        inner.classList.add('selected');
      } else {
        inner.classList.remove('selected');
      }
    });
  }

  listEl.addEventListener('scroll', updateGradients);
  updateGradients();

  if (enableArrowNavigation) {
    const handleKeyDown = e => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = Math.min((selectedIndex < 0 ? -1 : selectedIndex) + 1, items.length - 1);
        setIndex(next);
        scrollToSelected();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = Math.max(selectedIndex - 1, 0);
        setIndex(prev);
        scrollToSelected();
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (typeof onItemSelect === 'function') {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      }
    };

    function scrollToSelected() {
      if (selectedIndex < 0) return;
      const targetEl = itemElements[selectedIndex];
      if (targetEl) {
        const extraMargin = 40;
        const containerScrollTop = listEl.scrollTop;
        const containerHeight = listEl.clientHeight;
        const itemTop = targetEl.offsetTop;
        const itemBottom = itemTop + targetEl.offsetHeight;
        if (itemTop < containerScrollTop + extraMargin) {
          listEl.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
        } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
          listEl.scrollTo({ top: itemBottom - containerHeight + extraMargin, behavior: 'smooth' });
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
  }

  return {
    destroy: () => {
      listEl.removeEventListener('scroll', updateGradients);
    }
  };
}

window.initAnimatedList = initAnimatedList;
