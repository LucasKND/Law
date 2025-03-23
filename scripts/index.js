document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const cards = document.querySelectorAll('.practice-area-card');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    
    let currentIndex = 0;
    const totalCards = cards.length;
    
    // Modified to show 3 cards at once
    const cardsToShow = 3;
    // Calculate the maximum index based on cardsToShow
    const maxIndex = Math.max(0, totalCards - cardsToShow);

    // Create navigation buttons
    const carouselControls = document.querySelector('.carousel-controls');
    
    // Create previous button
    const prevButton = document.createElement('button');
    prevButton.className = 'carousel-nav-btn prev-btn';
    prevButton.innerHTML = '&lt;'; // < symbol
    prevButton.setAttribute('aria-label', 'Previous slides');
    prevButton.disabled = true; // Initially disabled as we start at the first card
    
    // Create next button
    const nextButton = document.createElement('button');
    nextButton.className = 'carousel-nav-btn next-btn';
    nextButton.innerHTML = '&gt;'; // > symbol
    nextButton.setAttribute('aria-label', 'Next slides');
    if (totalCards <= cardsToShow) {
        nextButton.disabled = true; // Disable if there are fewer cards than the display amount
    }
    
    // Add buttons to carousel controls
    carouselControls.insertBefore(prevButton, carouselControls.firstChild);
    carouselControls.appendChild(nextButton);

    function updateCarouselPosition() {
        const cardWidth = cards[0].offsetWidth + 30; // card width + margin
        const offset = -(currentIndex * cardWidth);
        
        carousel.style.transition = 'transform 0.3s ease-in-out';
        carousel.style.transform = `translateX(${offset}px)`;
        
        // Update button states
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= maxIndex;
        
        // Update dots
        dots.forEach((dot, index) => {
            // Assuming we have one dot per visible set of cards
            const dotIndex = Math.floor(currentIndex / cardsToShow);
            dot.classList.toggle('active', index === dotIndex);
        });
    }

    function goToNextSlide() {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarouselPosition();
        }
    }

    function goToPrevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarouselPosition();
        }
    }

    // Button click handlers
    prevButton.addEventListener('click', goToPrevSlide);
    nextButton.addEventListener('click', goToNextSlide);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // Each dot represents a set of cards
            currentIndex = index * cardsToShow;
            // Make sure we don't go past the max index
            currentIndex = Math.min(currentIndex, maxIndex);
            updateCarouselPosition();
        });
    });

    // Improved touch support
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    let startOffset = 0;
    let currentOffset = 0;

    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        startOffset = -(currentIndex * (cards[0].offsetWidth + 30));
        isDragging = true;
        carousel.style.transition = 'none';
    }, { passive: true });

    carousel.addEventListener('touchmove', e => {
        if (!isDragging) return;
        
        const currentX = e.changedTouches[0].screenX;
        const diff = currentX - touchStartX;
        currentOffset = startOffset + diff;
        
        carousel.style.transform = `translateX(${currentOffset}px)`;
    }, { passive: true });

    carousel.addEventListener('touchend', e => {
        if (!isDragging) return;
        isDragging = false;
        
        touchEndX = e.changedTouches[0].screenX;
        carousel.style.transition = 'transform 0.3s ease-in-out';
        
        // Determine if we should go to next or previous slide
        if (touchStartX - touchEndX > 50 && currentIndex < maxIndex) {
            goToNextSlide();
        } else if (touchEndX - touchStartX > 50 && currentIndex > 0) {
            goToPrevSlide();
        } else {
            // If the swipe wasn't significant, return to the current slide
            updateCarouselPosition();
        }
    }, { passive: true });

    // Initialize carousel position
    updateCarouselPosition();
});

// Hero text animation
document.addEventListener('DOMContentLoaded', function() {
    // Elements to animate in the hero section
    const heroElements = [
        document.querySelector('.hero-content h1'),
        document.querySelector('.hero-content p'),
        document.querySelector('.hero-content .appointment-btn')
    ];
    
    // Apply initial styles immediately
    heroElements.forEach(element => {
        if (element) {
            // Set initial state immediately to prevent flashing
            element.style.opacity = '0';
            element.style.transform = 'translateX(-100px)';
            element.style.transition = 'none'; // No transition initially
        }
    });
    
    // Animate elements sequentially after a small delay
    function animateHeroElements(index = 0) {
        if (index >= heroElements.length) return;
        
        const element = heroElements[index];
        if (element) {
            setTimeout(() => {
                // Enable transitions before changing properties
                element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                
                // Trigger animation
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
                
                // Animate next element
                animateHeroElements(index + 1);
            }, 800); // 800ms delay between animations
        }
    }
    
    // Start animation with a very short delay to ensure initial styles are applied
    setTimeout(() => {
        animateHeroElements();
    }, 50); // Just a short delay to ensure DOM is ready
});

// Keep the rest of your code unchanged
document.addEventListener('DOMContentLoaded', function() {
    const accordionItems = document.querySelectorAll('.faq-section__accordion-item');
    
    accordionItems.forEach(item => {
        const question = item.querySelector('.faq-section__accordion-question');
        
        question.addEventListener('click', () => {
            // Toggle active class on the clicked item
            const currentlyActive = item.classList.contains('active');
            
            // Close all items
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // If the clicked item wasn't active, open it
            if (!currentlyActive) {
                item.classList.add('active');
            }
        });
    });
});

// Stats counter animation
document.addEventListener('DOMContentLoaded', function() {
    const statsValues = document.querySelectorAll('.stats-card__value');
    let animated = false;

    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            element.textContent = currentValue;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function checkScroll() {
        if (animated) return;
        
        const trigger = window.innerHeight * 0.8;
        const statsSection = document.querySelector('.stats-section');
        const statsSectionTop = statsSection.getBoundingClientRect().top;

        if (statsSectionTop < trigger) {
            statsValues.forEach(stat => {
                const finalValue = parseInt(stat.textContent);
                stat.textContent = '0';
                animateValue(stat, 0, finalValue, 2000); // 2000ms = 2 seconds duration
            });
            animated = true;
            window.removeEventListener('scroll', checkScroll);
        }
    }

    window.addEventListener('scroll', checkScroll);
    // Check on load as well
    checkScroll();
});
// Função para mudar o estilo do botão de contato ao rolar
document.addEventListener('DOMContentLoaded', function() {
    const contactBtn = document.querySelector('.contact-btn');
    const firstSection = document.querySelector('section:first-of-type'); // Seleciona a primeira seção
    
    function updateButtonStyle() {
        // Verifica se a primeira seção já saiu da área visível
        const firstSectionBottom = firstSection.getBoundingClientRect().bottom;
        
        if (firstSectionBottom <= 0) {
            // Se a primeira seção já passou, muda o estilo do botão
            contactBtn.style.backgroundColor = 'var(--primary-light)';
            contactBtn.style.color = 'white'; // Opcional: mudar cor do texto para melhor contraste
        } else {
            // Se ainda estiver na primeira seção, mantém o estilo original
            contactBtn.style.backgroundColor = 'transparent';
            contactBtn.style.color = ''; // Volta à cor original do texto
        }
    }
    
    // Verifica no carregamento da página
    updateButtonStyle();
    
    // Adiciona o evento de rolagem
    window.addEventListener('scroll', updateButtonStyle);
});

// About Us animation
document.addEventListener('DOMContentLoaded', function() {
    // Get all elements with the slide-right class in the about section
    const slideRightElements = document.querySelectorAll('.about-content .slide-right');
    
    // Function to check if an element is in the viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Function to activate animations when elements come into view
    function checkAboutAnimation() {
        const aboutSection = document.querySelector('.about-section');
        
        if (isInViewport(aboutSection)) {
            // Add active class to all slide-right elements with their built-in delays
            slideRightElements.forEach(element => {
                element.classList.add('active');
            });
            
            // Remove scroll listener once animation has triggered
            window.removeEventListener('scroll', checkAboutAnimation);
        }
    }
    
    // Check on page load and on scroll
    checkAboutAnimation();
    window.addEventListener('scroll', checkAboutAnimation);
});

// Practice Areas animation
document.addEventListener('DOMContentLoaded', function() {
    // Get header elements with slide-up class
    const practiceAreaHeaderElements = document.querySelectorAll('.section-header .slide-up');
    
    // Get all card text elements
    const cardTextElements = document.querySelectorAll('.card-content .slide-up-card');
    
    // Function to check if an element is in the viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    // Function to activate header animations
    function checkPracticeAreasAnimation() {
        const practiceAreas = document.querySelector('.practice-areas');
        
        if (isInViewport(practiceAreas)) {
            // Animate header elements
            practiceAreaHeaderElements.forEach(element => {
                element.classList.add('active');
            });
            
            // Remove scroll listener for header animation
            window.removeEventListener('scroll', checkPracticeAreasAnimation);
        }
    }
    
    // Function to check and animate cards as they come into view
    function checkCardAnimations() {
        // Get all cards
        const cards = document.querySelectorAll('.practice-area-card');
        
        cards.forEach(card => {
            if (isInViewport(card)) {
                // Find and animate text elements within this card
                const textElements = card.querySelectorAll('.slide-up-card');
                textElements.forEach(element => {
                    if (!element.classList.contains('active')) {
                        element.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Check on page load and on scroll for header
    checkPracticeAreasAnimation();
    window.addEventListener('scroll', checkPracticeAreasAnimation);
    
    // Check on page load and on scroll for cards
    checkCardAnimations();
    window.addEventListener('scroll', checkCardAnimations);
    
    // Also animate when slides change
    const prevButton = document.querySelector('.prev-btn');
    const nextButton = document.querySelector('.next-btn');
    
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', function() {
            setTimeout(checkCardAnimations, 400); // Slight delay to allow slide transition
        });
        
        nextButton.addEventListener('click', function() {
            setTimeout(checkCardAnimations, 400); // Slight delay to allow slide transition
        });
    }
});

// Contact Section animation
document.addEventListener('DOMContentLoaded', function() {
    // Get all elements with the contact-slide-up class
    const contactSlideElements = document.querySelectorAll('.contact-slide-up');
    
    // Function to check if an element is in the viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    // Function to activate animations when elements come into view
    function checkContactAnimation() {
        const contactSection = document.querySelector('.contact-section');
        
        if (isInViewport(contactSection)) {
            // Add active class to animate elements with their built-in delays
            contactSlideElements.forEach(element => {
                element.classList.add('active');
            });
            
            // Remove scroll listener once animation has triggered
            window.removeEventListener('scroll', checkContactAnimation);
        }
    }
    
    // Check on page load and on scroll
    checkContactAnimation();
    window.addEventListener('scroll', checkContactAnimation);
});

// FAQ Section animation
document.addEventListener('DOMContentLoaded', function() {
    // Get all elements with the faq-slide-up class
    const faqSlideElements = document.querySelectorAll('.faq-slide-up');
    
    // Function to check if an element is in the viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    // Function to activate animations when elements come into view
    function checkFaqAnimation() {
        const faqSection = document.querySelector('.faq-section');
        
        if (isInViewport(faqSection)) {
            // Add active class to animate elements with their built-in delays
            faqSlideElements.forEach(element => {
                element.classList.add('active');
            });
            
            // Remove scroll listener once animation has triggered
            window.removeEventListener('scroll', checkFaqAnimation);
        }
    }
    
    // Check on page load and on scroll
    checkFaqAnimation();
    window.addEventListener('scroll', checkFaqAnimation);
    
    // Also add animation when accordion items are clicked
    const accordionQuestions = document.querySelectorAll('.faq-section__accordion-question');
    accordionQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Ensure all questions have the active animation class
            faqSlideElements.forEach(element => {
                if (!element.classList.contains('active')) {
                    element.classList.add('active');
                }
            });
        });
    });
});

// Footer Animation - with enhanced delays
document.addEventListener('DOMContentLoaded', function() {
    // Get all elements with the footer-slide-up class
    const footerSlideElements = document.querySelectorAll('.footer-slide-up');
    
    // Function to check if an element is in the viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
            rect.bottom >= 0
        );
    }
    
    // Function to activate animations when elements come into view
    function checkFooterAnimation() {
        const footer = document.querySelector('footer');
        
        if (isInViewport(footer)) {
            // Add active class to all footer elements with increasing delays
            footerSlideElements.forEach((element, index) => {
                setTimeout(() => {
                    element.classList.add('active');
                }, 150 * index); // 150ms delay between each element
            });
            
            // Remove scroll listener once animation has triggered
            window.removeEventListener('scroll', checkFooterAnimation);
        }
    }
    
    // Check on page load and on scroll
    checkFooterAnimation();
    window.addEventListener('scroll', checkFooterAnimation);
});

// Header Animation
document.addEventListener('DOMContentLoaded', function() {
    // Get the header element
    const header = document.querySelector('.header-slide-down');
    
    // Trigger animation after a short delay for a better user experience
    setTimeout(() => {
        header.classList.add('active');
    }, 200); // Short delay to ensure everything is ready
});
