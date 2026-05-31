'use strict';

(function () {
    document.addEventListener('DOMContentLoaded', () => {
        initServicesReveal();
        initServicesCardIndexes();
        initServicesHeroState();
    });

    function initServicesReveal() {
        const revealElements = document.querySelectorAll(
            [
                '.services-grid-section .section-heading',
                '.services-page-card',
                '.project-types-section .section-heading',
                '.project-type-card',
                '.services-property-section .section-heading',
                '.services-property-card',
                '.compare-section .section-heading',
                '.compare-card',
                '.services-faq-section .section-heading',
                '.faq-item',
                '.services-final-card'
            ].join(',')
        );

        if (!revealElements.length) {
            return;
        }

        revealElements.forEach((element) => {
            element.classList.add('services-reveal');
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

    function initServicesCardIndexes() {
        const groupedSelectors = [
            '.services-page-card',
            '.project-type-card',
            '.services-property-card',
            '.compare-card',
            '.faq-item'
        ];

        groupedSelectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((card, index) => {
                card.style.setProperty('--reveal-index', index);
            });
        });
    }

    function initServicesHeroState() {
        const hero = document.querySelector('.services-hero');

        if (!hero) {
            return;
        }

        window.requestAnimationFrame(() => {
            hero.classList.add('is-ready');
        });
    }
})();