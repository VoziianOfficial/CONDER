'use strict';

(function () {
    const config = window.SITE_CONFIG;

    if (!config) {
        console.warn('SITE_CONFIG is missing. Please load js/config.js before js/main.js.');
        return;
    }

    const selectors = {
        header: '[data-header]',
        servicesDropdown: '[data-services-dropdown]',
        servicesToggle: '[data-services-toggle]',
        servicesMenu: '[data-services-menu]',
        mobileMenu: '[data-mobile-menu]',
        mobileMenuOpen: '[data-menu-open]',
        mobileMenuClose: '[data-menu-close]',
        faqItem: '[data-faq-item]',
        faqButton: '[data-faq-button]',
        faqPanel: '[data-faq-panel]'
    };

    const replacementMap = {
        COMPANY_NAME: config.company.name,
        COMPANY_ID: config.company.companyId,
        COMPANY_ADDRESS: config.company.address,
        COMPANY_EMAIL: config.contact.email,
        COMPANY_PHONE: config.contact.phoneDisplay,
        COMPANY_PHONE_RAW: config.contact.phoneRaw,
        COMPANY_PHONE_TEXT: config.contact.phoneButtonText,
        COMPANY_SERVICE_AREA: config.company.serviceArea,
        FOOTER_DESCRIPTION: config.footer.description,
        DISCLAIMER: config.footer.disclaimer,
        SUPPORT_HOURS: config.contact.supportHours
    };

    document.addEventListener('DOMContentLoaded', () => {
        applyConfigData();
        replaceTextPlaceholders();
        renderDynamicLinks();
        initStickyHeader();
        initServicesDropdown();
        initMobileMenu();
        initFaqAccordions();
        initCookieBanner();
        initActiveNavLinks();
        initSmoothScrolling();
    });

    function applyConfigData() {
        setText('[data-company-name]', config.company.name);
        setText('[data-company-id]', config.company.companyId);
        setText('[data-company-address]', config.company.address);
        setText('[data-company-email]', config.contact.email);
        setText('[data-company-phone]', config.contact.phoneDisplay);
        setText('[data-company-phone-text]', config.contact.phoneButtonText);
        setText('[data-company-service-area]', config.company.serviceArea);
        setText('[data-company-disclaimer]', config.footer.disclaimer);
        setText('[data-footer-description]', config.footer.description);
        setText('[data-support-hours]', config.contact.supportHours);

        setText('[data-cta-primary]', config.cta.primary);
        setText('[data-cta-secondary]', config.cta.secondary);
        setText('[data-cta-contact]', config.cta.contact);
        setText('[data-cta-phone]', config.cta.phone);
        setText('[data-cta-quote]', config.cta.quote);
        setText('[data-cta-services]', config.cta.services);

        document.querySelectorAll('[data-company-phone], [data-company-phone-text], [data-phone-link]').forEach((element) => {
            if (element.tagName.toLowerCase() === 'a') {
                element.href = `tel:${config.contact.phoneRaw}`;
            }
        });

        document.querySelectorAll('[data-company-email], [data-email-link]').forEach((element) => {
            if (element.tagName.toLowerCase() === 'a') {
                element.href = `mailto:${config.contact.email}`;
            }
        });

        document.querySelectorAll('[data-contact-link]').forEach((element) => {
            if (element.tagName.toLowerCase() === 'a') {
                element.href = 'contact.html';
            }
        });
    }

    function setText(selector, value) {
        document.querySelectorAll(selector).forEach((element) => {
            element.textContent = value;
        });
    }

    function replaceTextPlaceholders() {
        const excludedTags = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION']);

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    const parent = node.parentElement;

                    if (!parent || excludedTags.has(parent.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    return node.nodeValue.includes('{{')
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_SKIP;
                }
            }
        );

        const nodes = [];

        while (walker.nextNode()) {
            nodes.push(walker.currentNode);
        }

        nodes.forEach((node) => {
            node.nodeValue = replacePlaceholders(node.nodeValue);
        });

        const attributesToReplace = [
            'title',
            'aria-label',
            'placeholder',
            'alt',
            'data-label'
        ];

        document.querySelectorAll('*').forEach((element) => {
            attributesToReplace.forEach((attribute) => {
                if (element.hasAttribute(attribute)) {
                    const value = element.getAttribute(attribute);
                    element.setAttribute(attribute, replacePlaceholders(value));
                }
            });
        });
    }

    function replacePlaceholders(value) {
        if (!value || typeof value !== 'string') {
            return value;
        }

        return value.replace(/{{\s*([A-Z_]+)\s*}}/g, (match, key) => {
            return Object.prototype.hasOwnProperty.call(replacementMap, key)
                ? replacementMap[key]
                : match;
        });
    }

    function renderDynamicLinks() {
        renderNavigationLinks();
        renderServiceLinks();
        renderLegalLinks();
    }

    function renderNavigationLinks() {
        document.querySelectorAll('[data-render-nav]').forEach((container) => {
            container.innerHTML = config.navigation
                .map((item) => {
                    return `
                        <a class="nav-link" href="${item.url}" data-nav-link>
                            ${item.label}
                        </a>
                    `;
                })
                .join('');
        });
    }

    function renderServiceLinks() {
        document.querySelectorAll('[data-render-services]').forEach((container) => {
            const variant = container.dataset.renderServices || 'default';

            container.innerHTML = config.services
                .map((service) => {
                    if (variant === 'dropdown') {
                        return `
                            <a class="services-dropdown__link" href="${service.url}">
                                <span class="services-dropdown__title">${service.title}</span>
                                <span class="services-dropdown__text">${service.description}</span>
                            </a>
                        `;
                    }

                    if (variant === 'mobile') {
                        return `
                            <a class="mobile-menu__service" href="${service.url}">
                                <span>${service.title}</span>
                                <small>${service.description}</small>
                            </a>
                        `;
                    }

                    if (variant === 'footer') {
                        return `
                            <li>
                                <a href="${service.url}">${service.title}</a>
                            </li>
                        `;
                    }

                    return `
                        <a href="${service.url}">
                            ${service.title}
                        </a>
                    `;
                })
                .join('');
        });
    }

    function renderLegalLinks() {
        document.querySelectorAll('[data-render-legal]').forEach((container) => {
            const variant = container.dataset.renderLegal || 'footer';

            const links = [
                {
                    label: 'Privacy Policy',
                    url: config.legal.privacy
                },
                {
                    label: 'Cookie Policy',
                    url: config.legal.cookies
                },
                {
                    label: 'Terms of Service',
                    url: config.legal.terms
                }
            ];

            container.innerHTML = links
                .map((link) => {
                    if (variant === 'inline') {
                        return `<a href="${link.url}">${link.label}</a>`;
                    }

                    return `
                        <li>
                            <a href="${link.url}">${link.label}</a>
                        </li>
                    `;
                })
                .join('');
        });
    }

    function initStickyHeader() {
        const header = document.querySelector(selectors.header);

        if (!header) {
            return;
        }

        const updateHeaderState = () => {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        };

        updateHeaderState();

        window.addEventListener('scroll', updateHeaderState, {
            passive: true
        });
    }

    function initServicesDropdown() {
        const dropdown = document.querySelector(selectors.servicesDropdown);

        if (!dropdown) {
            return;
        }

        const toggle = dropdown.querySelector(selectors.servicesToggle);
        const menu = dropdown.querySelector(selectors.servicesMenu);

        if (!toggle || !menu) {
            return;
        }

        let closeTimer = null;

        const openDropdown = () => {
            clearTimeout(closeTimer);
            dropdown.classList.add('is-open');
            toggle.setAttribute('aria-expanded', 'true');
        };

        const closeDropdown = () => {
            closeTimer = window.setTimeout(() => {
                dropdown.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            }, 180);
        };

        dropdown.addEventListener('mouseenter', openDropdown);
        dropdown.addEventListener('mouseleave', closeDropdown);

        toggle.addEventListener('focus', openDropdown);

        menu.addEventListener('focusin', openDropdown);

        dropdown.addEventListener('focusout', (event) => {
            if (!dropdown.contains(event.relatedTarget)) {
                dropdown.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });

        toggle.addEventListener('click', (event) => {
            event.preventDefault();

            const isOpen = dropdown.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                dropdown.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function initMobileMenu() {
        const menu = document.querySelector(selectors.mobileMenu);
        const openButton = document.querySelector(selectors.mobileMenuOpen);
        const closeButton = document.querySelector(selectors.mobileMenuClose);

        if (!menu || !openButton || !closeButton) {
            return;
        }

        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(',');

        const openMenu = () => {
            menu.classList.add('is-open');
            document.body.classList.add('menu-open');
            openButton.setAttribute('aria-expanded', 'true');
            menu.setAttribute('aria-hidden', 'false');

            const firstFocusable = menu.querySelector(focusableSelectors);

            if (firstFocusable) {
                firstFocusable.focus();
            }
        };

        const closeMenu = () => {
            menu.classList.remove('is-open');
            document.body.classList.remove('menu-open');
            openButton.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
            openButton.focus();
        };

        openButton.addEventListener('click', openMenu);
        closeButton.addEventListener('click', closeMenu);

        menu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        menu.addEventListener('click', (event) => {
            if (event.target === menu) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (!menu.classList.contains('is-open')) {
                return;
            }

            if (event.key === 'Escape') {
                closeMenu();
            }

            if (event.key === 'Tab') {
                trapFocus(event, menu, focusableSelectors);
            }
        });
    }

    function trapFocus(event, container, focusableSelectors) {
        const focusableElements = Array.from(container.querySelectorAll(focusableSelectors));

        if (!focusableElements.length) {
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        }

        if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    function initFaqAccordions() {
        document.querySelectorAll(selectors.faqItem).forEach((item, index) => {
            const button = item.querySelector(selectors.faqButton);
            const panel = item.querySelector(selectors.faqPanel);

            if (!button || !panel) {
                return;
            }

            const panelId = panel.id || `faq-panel-${index + 1}`;
            const buttonId = button.id || `faq-button-${index + 1}`;

            panel.id = panelId;
            button.id = buttonId;

            button.setAttribute('aria-controls', panelId);
            panel.setAttribute('aria-labelledby', buttonId);

            const isOpen = item.classList.contains('is-open');

            button.setAttribute('aria-expanded', String(isOpen));
            panel.hidden = !isOpen;

            button.addEventListener('click', () => {
                const shouldOpen = !item.classList.contains('is-open');

                item.classList.toggle('is-open', shouldOpen);
                button.setAttribute('aria-expanded', String(shouldOpen));
                panel.hidden = !shouldOpen;
            });
        });
    }

    function initCookieBanner() {
        const storageKey = config.cookieBanner.storageKey;
        const savedChoice = localStorage.getItem(storageKey);

        if (savedChoice) {
            return;
        }

        const banner = document.createElement('section');
        banner.className = 'cookie-banner';
        banner.setAttribute('data-cookie-banner', '');
        banner.setAttribute('aria-label', 'Cookie policy notice');

        banner.innerHTML = `
            <div class="cookie-banner__content">
                <p>
                    ${config.cookieBanner.text}
                    <a href="${config.legal.privacy}">Privacy Policy</a>,
                    <a href="${config.legal.cookies}">Cookie Policy</a>,
                    and
                    <a href="${config.legal.terms}">Terms of Service</a>.
                </p>

                <div class="cookie-banner__actions">
                    <button class="btn btn--small btn--ghost-light" type="button" data-cookie-decline>
                        ${config.cookieBanner.declineLabel}
                    </button>

                    <button class="btn btn--small btn--primary" type="button" data-cookie-accept>
                        ${config.cookieBanner.acceptLabel}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        const acceptButton = banner.querySelector('[data-cookie-accept]');
        const declineButton = banner.querySelector('[data-cookie-decline]');

        const saveChoice = (choice) => {
            localStorage.setItem(storageKey, choice);
            banner.classList.add('is-hidden');

            window.setTimeout(() => {
                banner.remove();
            }, 250);
        };

        acceptButton.addEventListener('click', () => saveChoice('accepted'));
        declineButton.addEventListener('click', () => saveChoice('declined'));
    }

    function initActiveNavLinks() {
        const currentPage = getCurrentPageName();

        document.querySelectorAll('a[href]').forEach((link) => {
            const href = link.getAttribute('href');

            if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) {
                return;
            }

            const linkPage = href.split('#')[0].split('/').pop() || 'index.html';

            if (linkPage === currentPage) {
                link.classList.add('is-active');
                link.setAttribute('aria-current', 'page');
            }
        });

        const servicePages = [
            'window-replacement.html',
            'window-installation.html',
            'window-repair.html',
            'energy-efficient-windows.html'
        ];

        if (servicePages.includes(currentPage)) {
            document.querySelectorAll('.services-toggle').forEach((toggle) => {
                toggle.classList.add('is-active');
                toggle.setAttribute('aria-current', 'page');
            });
        }
    }

    function getCurrentPageName() {
        const path = window.location.pathname;
        const page = path.split('/').pop();

        return page || 'index.html';
    }

    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (event) => {
                const targetId = link.getAttribute('href');

                if (!targetId || targetId === '#') {
                    return;
                }

                const target = document.querySelector(targetId);

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }
})();