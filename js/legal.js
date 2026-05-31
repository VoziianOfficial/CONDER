'use strict';

(function () {
    document.addEventListener('DOMContentLoaded', () => {
        initLegalReveal();
        initLegalIndexes();
        initLegalHeroState();
        initActiveLegalLinks();
    });

    function initLegalReveal() {
        const revealElements = document.querySelectorAll(
            [
                '.legal-sidebar',
                '.legal-card',
                '.legal-block',
                '.legal-note',
                '.legal-contact-box',
                '.legal-final-card'
            ].join(',')
        );

        if (!revealElements.length) {
            return;
        }

        revealElements.forEach((element) => {
            element.classList.add('legal-reveal');
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

    function initLegalIndexes() {
        const groupedSelectors = [
            '.legal-sidebar',
            '.legal-card',
            '.legal-block',
            '.legal-note',
            '.legal-contact-box',
            '.legal-final-card'
        ];

        groupedSelectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((item, index) => {
                item.style.setProperty('--reveal-index', index);
            });
        });
    }

    function initLegalHeroState() {
        const hero = document.querySelector('.legal-hero');

        if (!hero) {
            return;
        }

        window.requestAnimationFrame(() => {
            hero.classList.add('is-ready');
        });
    }

    function initActiveLegalLinks() {
        const currentPage = getCurrentPageName();

        document.querySelectorAll('.legal-sidebar__links a[href]').forEach((link) => {
            const href = link.getAttribute('href');

            if (!href) {
                return;
            }

            const linkPage = href.split('#')[0].split('/').pop();

            if (linkPage === currentPage) {
                link.classList.add('is-active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    function getCurrentPageName() {
        const path = window.location.pathname;
        const page = path.split('/').pop();

        return page || 'index.html';
    }
})();