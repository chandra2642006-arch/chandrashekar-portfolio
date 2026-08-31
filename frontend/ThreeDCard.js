// Ultra-Sleek 3D Card tilt & depth float effect initializer (Aceternity UI spec)
function init3DCard(cardContainer) {
  if (!cardContainer) return null;

  const cardBody = cardContainer.querySelector('.card-body') || cardContainer;
  // Only target elements that explicitly opt-in with data attributes
  const cardItems = cardContainer.querySelectorAll('[data-translate-z], [data-translate-x], [data-translate-y], [data-rotate-x], [data-rotate-y], [data-rotate-z]');

  cardContainer.style.perspective = '1000px';
  cardBody.style.transformStyle = 'preserve-3d';
  cardBody.style.transition = 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)';

  cardItems.forEach(item => {
    item.style.transition = 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)';
    item.style.transformStyle = 'preserve-3d';
  });

  const handleMouseMove = e => {
    const rect = cardContainer.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 22;
    const y = (e.clientY - rect.top - rect.height / 2) / 22;
    cardBody.style.transform = `rotateY(${x}deg) rotateX(${-y}deg) translateY(-4px)`;
  };

  const handleMouseEnter = () => {
    cardItems.forEach(item => {
      const tz = item.getAttribute('data-translate-z') || 0;
      const tx = item.getAttribute('data-translate-x') || 0;
      const ty = item.getAttribute('data-translate-y') || 0;
      const rx = item.getAttribute('data-rotate-x') || 0;
      const ry = item.getAttribute('data-rotate-y') || 0;
      const rz = item.getAttribute('data-rotate-z') || 0;
      item.style.transform = `translateX(${tx}px) translateY(${ty}px) translateZ(${tz}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
    });
  };

  const handleMouseLeave = () => {
    cardBody.style.transform = `rotateY(0deg) rotateX(0deg) translateY(0px)`;
    cardItems.forEach(item => {
      item.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    });
  };

  cardContainer.addEventListener('mousemove', handleMouseMove);
  cardContainer.addEventListener('mouseenter', handleMouseEnter);
  cardContainer.addEventListener('mouseleave', handleMouseLeave);

  return {
    destroy: () => {
      cardContainer.removeEventListener('mousemove', handleMouseMove);
      cardContainer.removeEventListener('mouseenter', handleMouseEnter);
      cardContainer.removeEventListener('mouseleave', handleMouseLeave);
    }
  };
}

function initAll3DCards() {
  const cards = document.querySelectorAll('.glass-card, .timeline-content, .project-card, .activities-grid > div');
  cards.forEach(card => init3DCard(card));
}

window.init3DCard = init3DCard;
window.initAll3DCards = initAll3DCards;
