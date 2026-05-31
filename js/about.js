'use strict';

(function () {
    document.addEventListener('DOMContentLoaded', () => {
        initAboutReveal();
        initAboutCardIndexes();
        initAboutHeroState();
        initAboutMarqueeFocus();
    });

    function initAboutReveal() {
        const revealElements = document.querySelectorAll(
            [
                '.about-story__content',
                '.about-story__visual',
                '.about-model .section-heading',
                '.about-step-card',
                '.about-benefits .section-heading',
                '.about-benefit-card',
                '.about-trust__intro',
                '.about-quote-card',
                '.about-final-card'
            ].join(',')
        );

        if (!revealElements.length) {
            return;
        }

        revealElements.forEach((element) => {
            element.classList.add('about-reveal');
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

    function initAboutCardIndexes() {
        const groupedSelectors = [
            '.about-step-card',
            '.about-benefit-card',
            '.about-quote-card'
        ];

        groupedSelectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((card, index) => {
                card.style.setProperty('--reveal-index', index);
            });
        });
    }

    function initAboutHeroState() {
        const hero = document.querySelector('.about-hero');

        if (!hero) {
            return;
        }

        window.requestAnimationFrame(() => {
            hero.classList.add('is-ready');
        });
    }

    function initAboutMarqueeFocus() {
        const marquee = document.querySelector('[data-about-marquee]');
        const track = marquee ? marquee.querySelector('.about-marquee__track') : null;

        if (!marquee || !track) {
            return;
        }

        const pauseMarquee = () => {
            track.style.animationPlayState = 'paused';
        };

        const playMarquee = () => {
            track.style.animationPlayState = '';
        };

        marquee.addEventListener('focusin', pauseMarquee);
        marquee.addEventListener('focusout', playMarquee);
    }
})();