'use strict';

(function () {
    document.addEventListener('DOMContentLoaded', () => {
        initHomeReveal();
        initHomeCardIndexes();
        initHomeHeroState();
    });

    function initHomeReveal() {
        const revealElements = document.querySelectorAll(
            [
                '.home-services .section-heading',
                '.home-service-card',
                '.home-projects .section-heading',
                '.home-project-card',
                '.home-property-types .section-heading',
                '.property-card',
                '.home-process .section-heading',
                '.process-card',
                '.home-testimonials .section-heading',
                '.testimonial-card',
                '.final-cta-card'
            ].join(',')
        );

        if (!revealElements.length) {
            return;
        }

        revealElements.forEach((element) => {
            element.classList.add('home-reveal');
        });

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            revealElements.forEach((element) => {
                element.classList.add('is-visible');
            });

            return;
        }

        const observer = new IntersectionObserver(
            (entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add('is-visible');
                    currentObserver.unobserve(entry.target);
                });
            },
            {
                threshold: 0.14,
                rootMargin: '0px 0px -8% 0px'
            }
        );

        revealElements.forEach((element) => {
            observer.observe(element);
        });
    }

    function initHomeCardIndexes() {
        const groupedSelectors = [
            '.home-service-card',
            '.home-project-card',
            '.process-card',
            '.testimonial-card'
        ];

        groupedSelectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((card, index) => {
                card.style.setProperty('--reveal-index', index);
            });
        });
    }

    function initHomeHeroState() {
        const hero = document.querySelector('.home-hero');

        if (!hero) {
            return;
        }

        window.requestAnimationFrame(() => {
            hero.classList.add('is-ready');
        });
    }
})();