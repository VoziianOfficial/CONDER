'use strict';

(function () {
    document.addEventListener('DOMContentLoaded', () => {
        initServicePageReveal();
        initServicePageIndexes();
        initServiceHeroState();
        initWindowTabs();
    });

    function initServicePageReveal() {
        const revealElements = document.querySelectorAll(
            [
                '.service-overview__content',
                '.service-overview__visual',
                '.service-tabs-section .section-heading',
                '.service-tabs',
                '.service-factors .section-heading',
                '.service-factor-card',
                '.service-examples .section-heading',
                '.service-example-card',
                '.service-faq .section-heading',
                '.faq-item',
                '.service-final-card'
            ].join(',')
        );

        if (!revealElements.length) {
            return;
        }

        revealElements.forEach((element) => {
            element.classList.add('service-page-reveal');
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

    function initServicePageIndexes() {
        const groupedSelectors = [
            '.service-factor-card',
            '.service-example-card',
            '.faq-item'
        ];

        groupedSelectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((card, index) => {
                card.style.setProperty('--reveal-index', index);
            });
        });
    }

    function initServiceHeroState() {
        const hero = document.querySelector('.service-hero');

        if (!hero) {
            return;
        }

        window.requestAnimationFrame(() => {
            hero.classList.add('is-ready');
        });
    }

    function initWindowTabs() {
        document.querySelectorAll('[data-window-tabs]').forEach((tabs) => {
            const buttons = Array.from(tabs.querySelectorAll('[data-window-tab]'));
            const image = tabs.querySelector('[data-tab-image]');
            const title = tabs.querySelector('[data-tab-title]');
            const description = tabs.querySelector('[data-tab-description]');
            const list = tabs.querySelector('[data-tab-list]');

            if (!buttons.length || !image || !title || !description || !list) {
                return;
            }

            const tabList = tabs.querySelector('[role="tablist"]');

            if (tabList) {
                tabList.setAttribute('aria-label', 'Window type comparison tabs');
            }

            buttons.forEach((button, index) => {
                const buttonId = button.id || `window-tab-${index + 1}`;
                button.id = buttonId;

                button.setAttribute('role', 'tab');
                button.setAttribute('aria-selected', button.classList.contains('is-active') ? 'true' : 'false');
                button.setAttribute('tabindex', button.classList.contains('is-active') ? '0' : '-1');

                button.addEventListener('click', () => {
                    activateTab(button, buttons, image, title, description, list);
                });

                button.addEventListener('keydown', (event) => {
                    handleTabKeyboard(event, buttons, image, title, description, list);
                });
            });

            const activeButton = buttons.find((button) => button.classList.contains('is-active')) || buttons[0];

            activateTab(activeButton, buttons, image, title, description, list, {
                shouldFocus: false
            });
        });
    }

    function activateTab(button, buttons, image, title, description, list, options = {}) {
        const shouldFocus = options.shouldFocus !== false;

        buttons.forEach((item) => {
            const isActive = item === button;

            item.classList.toggle('is-active', isActive);
            item.setAttribute('aria-selected', String(isActive));
            item.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        const tabTitle = button.dataset.title || button.textContent.trim();
        const tabImage = button.dataset.image || '../assets/images/tab-double-hung-windows.jpg';
        const tabDescription = button.dataset.description || '';
        const compareItems = parseCompareItems(button.dataset.compare);

        image.style.setProperty('--tab-image', `url("${tabImage}")`);
        image.setAttribute('aria-label', `${tabTitle} example image`);

        title.textContent = tabTitle;
        description.textContent = tabDescription;

        list.innerHTML = compareItems
            .map((item) => `<li>${escapeHtml(item)}</li>`)
            .join('');

        if (shouldFocus) {
            button.focus();
        }
    }

    function handleTabKeyboard(event, buttons, image, title, description, list) {
        const currentIndex = buttons.indexOf(document.activeElement);

        if (currentIndex === -1) {
            return;
        }

        let nextIndex = currentIndex;

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            event.preventDefault();
            nextIndex = currentIndex + 1 >= buttons.length ? 0 : currentIndex + 1;
        }

        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            event.preventDefault();
            nextIndex = currentIndex - 1 < 0 ? buttons.length - 1 : currentIndex - 1;
        }

        if (event.key === 'Home') {
            event.preventDefault();
            nextIndex = 0;
        }

        if (event.key === 'End') {
            event.preventDefault();
            nextIndex = buttons.length - 1;
        }

        if (nextIndex !== currentIndex) {
            activateTab(buttons[nextIndex], buttons, image, title, description, list);
        }
    }

    function parseCompareItems(value) {
        if (!value) {
            return [
                'Frame material and condition',
                'Glass type and insulation needs',
                'Opening style and ventilation goals',
                'Provider availability and quote details'
            ];
        }

        return value
            .split('|')
            .map((item) => item.trim())
            .filter(Boolean);
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }
})();