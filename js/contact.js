'use strict';

(function () {
    document.addEventListener('DOMContentLoaded', () => {
        initContactReveal();
        initContactCardIndexes();
        initContactHeroState();
        initContactFormValidation();
    });

    function initContactReveal() {
        const revealElements = document.querySelectorAll(
            [
                '.contact-intro__content',
                '.contact-intro__panel',
                '.contact-form-copy',
                '.contact-form',
                '.contact-cards-section .section-heading',
                '.contact-card',
                '.contact-after-section .section-heading',
                '.contact-after-card',
                '.contact-faq-section .section-heading',
                '.faq-item',
                '.contact-final-card'
            ].join(',')
        );

        if (!revealElements.length) {
            return;
        }

        revealElements.forEach((element) => {
            element.classList.add('contact-reveal');
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

    function initContactCardIndexes() {
        const groupedSelectors = [
            '.contact-card',
            '.contact-after-card',
            '.faq-item'
        ];

        groupedSelectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((card, index) => {
                card.style.setProperty('--reveal-index', index);
            });
        });
    }

    function initContactHeroState() {
        const hero = document.querySelector('.contact-hero');

        if (!hero) {
            return;
        }

        window.requestAnimationFrame(() => {
            hero.classList.add('is-ready');
        });
    }

    function initContactFormValidation() {
        const form = document.querySelector('[data-contact-form]');

        if (!form) {
            return;
        }

        const successMessage = form.querySelector('[data-form-success]');
        const fields = Array.from(form.querySelectorAll('[data-field]'));

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            let isFormValid = true;

            fields.forEach((field) => {
                const isFieldValid = validateField(field);

                if (!isFieldValid) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                const firstInvalidField = form.querySelector('.has-error');

                if (firstInvalidField) {
                    const focusTarget = firstInvalidField.querySelector(
                        'input, select, textarea, button'
                    );

                    if (focusTarget) {
                        focusTarget.focus();
                    }
                }

                if (successMessage) {
                    successMessage.hidden = true;
                }

                return;
            }

            if (successMessage) {
                successMessage.hidden = false;
            }

            form.classList.add('is-submitted');

            window.setTimeout(() => {
                if (successMessage) {
                    successMessage.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }, 120);
        });

        fields.forEach((field) => {
            const controls = field.querySelectorAll('input, select, textarea');

            controls.forEach((control) => {
                control.addEventListener('input', () => {
                    validateField(field);
                    hideSuccess(successMessage);
                });

                control.addEventListener('change', () => {
                    validateField(field);
                    hideSuccess(successMessage);
                });

                control.addEventListener('blur', () => {
                    validateField(field);
                });
            });
        });
    }

    function validateField(field) {
        const errorElement = field.querySelector('[data-error]');
        const controls = Array.from(field.querySelectorAll('input, select, textarea'));

        if (!controls.length) {
            return true;
        }

        const radioControls = controls.filter((control) => control.type === 'radio');
        const checkboxControls = controls.filter((control) => control.type === 'checkbox');

        let isValid = true;
        let message = '';

        if (radioControls.length) {
            const isRequired = radioControls.some((control) => control.required);
            const isChecked = radioControls.some((control) => control.checked);

            if (isRequired && !isChecked) {
                isValid = false;
                message = getErrorMessage(radioControls[0], 'Please choose an option.');
            }
        } else if (checkboxControls.length) {
            const requiredCheckbox = checkboxControls.find((control) => control.required);

            if (requiredCheckbox && !requiredCheckbox.checked) {
                isValid = false;
                message = getErrorMessage(requiredCheckbox, 'Please confirm this field.');
            }
        } else {
            const control = controls[0];

            if (control.required && !String(control.value).trim()) {
                isValid = false;
                message = getErrorMessage(control, 'This field is required.');
            } else if (control.type === 'email' && control.value.trim() && !isValidEmail(control.value)) {
                isValid = false;
                message = getErrorMessage(control, 'Please enter a valid email address.');
            } else if (control.name === 'zipCode' && control.value.trim() && !isValidZip(control.value)) {
                isValid = false;
                message = getErrorMessage(control, 'Please enter a valid ZIP code.');
            } else if (control.name === 'phone' && control.value.trim() && !isValidPhone(control.value)) {
                isValid = false;
                message = getErrorMessage(control, 'Please enter a valid phone number.');
            } else if (control.name === 'projectDetails' && control.value.trim().length < 12) {
                isValid = false;
                message = 'Please add a little more detail about your project.';
            }
        }

        field.classList.toggle('has-error', !isValid);

        if (errorElement) {
            errorElement.textContent = message;
        }

        controls.forEach((control) => {
            control.setAttribute('aria-invalid', String(!isValid));

            if (errorElement) {
                const errorId = errorElement.id || createErrorId(control);

                errorElement.id = errorId;

                if (!isValid) {
                    control.setAttribute('aria-describedby', errorId);
                } else {
                    control.removeAttribute('aria-describedby');
                }
            }
        });

        return isValid;
    }

    function getErrorMessage(control, fallback) {
        return control.dataset.errorMessage || fallback;
    }

    function createErrorId(control) {
        const base = control.id || control.name || 'field';

        return `${base}-error`;
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
    }

    function isValidZip(value) {
        return /^[0-9]{5}(-[0-9]{4})?$/.test(String(value).trim());
    }

    function isValidPhone(value) {
        const digits = String(value).replace(/\D/g, '');

        return digits.length >= 10 && digits.length <= 15;
    }

    function hideSuccess(successMessage) {
        if (!successMessage) {
            return;
        }

        successMessage.hidden = true;
    }
})();