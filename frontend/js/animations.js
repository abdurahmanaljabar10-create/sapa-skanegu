
"use strict";

window.SAPA = window.SAPA || {};

window.SAPA.animations = {

    /* =====================================================
       01. CONTROLLER STATE
    ===================================================== */

    initialized: false,
    reducedMotion: false,
    pageHidden: document.hidden,

    pointerFrame: null,
    mascotFrame: null,

    pointerX: 0,
    pointerY: 0,

    motionPreference: null,

    elements: {
        glow: null,
        mascot: null,
        cards: [],
        buttons: []
    },

    settings: {
        mascotMovement: 7,
        cardTilt: 7,
        cardPerspective: 900,
        glowOpacity: 1,
        rippleDuration: 650
    },


    /* =====================================================
       02. INITIALIZATION
    ===================================================== */

    init() {

        if (this.initialized) {
            return;
        }

        this.initialized = true;

        this.motionPreference = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        this.reducedMotion = this.motionPreference.matches;

        this.bindMotionPreference();

        this.bindVisibilityHandling();

        if (!this.reducedMotion) {
            this.initializeInteractions();
        }

        this.debug(
            "Cosmic animation controller initialized."
        );
    },


    initializeInteractions() {

        if (this.reducedMotion || this.pageHidden) {
            return;
        }

        this.initCursorGlow();

        this.initMascotParallax();

        this.initCardTilt();

        this.initButtonLight();

        this.initButtonRipple();
    },


    /* =====================================================
       03. DEBUG
    ===================================================== */

    debug(message, type = "log") {

        if (!window.SAPA.config?.debug) {
            return;
        }

        console[type](`[SAPA Animations] ${message}`);
    },


    /* =====================================================
       04. CURSOR GLOW
    ===================================================== */

    initCursorGlow() {

        if (
            window.matchMedia("(pointer: coarse)").matches
        ) {
            return;
        }

        const glow = document.querySelector(
            ".cursor-glow"
        );

        if (!glow) {
            return;
        }

        this.elements.glow = glow;

        let visible = false;

        const updatePosition = (event) => {

            if (
                this.reducedMotion ||
                this.pageHidden
            ) {
                return;
            }

            this.pointerX = event.clientX;
            this.pointerY = event.clientY;

            if (!visible) {
                glow.style.opacity = String(
                    this.settings.glowOpacity
                );

                visible = true;
            }

            if (this.pointerFrame) {
                return;
            }

            this.pointerFrame = requestAnimationFrame(() => {

                glow.style.setProperty(
                    "--cursor-x",
                    `${this.pointerX}px`
                );

                glow.style.setProperty(
                    "--cursor-y",
                    `${this.pointerY}px`
                );

                this.pointerFrame = null;

            });
        };


        const hideGlow = () => {

            glow.style.opacity = "0";

            visible = false;
        };


        document.addEventListener(
            "pointermove",
            updatePosition,
            { passive: true }
        );

        document.addEventListener(
            "pointerleave",
            hideGlow
        );

        window.addEventListener(
            "blur",
            hideGlow
        );

        document.addEventListener(
            "visibilitychange",
            () => {
                if (document.hidden) {
                    hideGlow();
                }
            }
        );

        this.debug("Cursor glow enabled.");
    },


    /* =====================================================
       05. MASCOT PARALLAX
    ===================================================== */

    initMascotParallax() {

        if (
            window.matchMedia("(pointer: coarse)").matches
        ) {
            return;
        }

        const stage = document.querySelector(
            ".mascot-stage"
        );

        const image = stage?.querySelector(
            ".mascot-image-wrapper"
        );

        if (!stage || !image) {
            return;
        }

        this.elements.mascot = image;

        let targetX = 0;
        let targetY = 0;

        let currentX = 0;
        let currentY = 0;

        const maximum = this.settings.mascotMovement;

        const animate = () => {

            if (
                this.reducedMotion ||
                this.pageHidden
            ) {
                this.mascotFrame = null;
                return;
            }

            currentX += (targetX - currentX) * 0.12;

            currentY += (targetY - currentY) * 0.12;

            image.style.setProperty(
                "--mascot-parallax-x",
                `${currentX.toFixed(2)}px`
            );

            image.style.setProperty(
                "--mascot-parallax-y",
                `${currentY.toFixed(2)}px`
            );

            const difference =
                Math.abs(targetX - currentX) +
                Math.abs(targetY - currentY);

            if (difference > 0.08) {
                this.mascotFrame =
                    requestAnimationFrame(animate);
            } else {
                currentX = targetX;
                currentY = targetY;
                this.mascotFrame = null;
            }
        };


        const scheduleAnimation = () => {

            if (
                !this.mascotFrame &&
                !this.reducedMotion &&
                !this.pageHidden
            ) {
                this.mascotFrame =
                    requestAnimationFrame(animate);
            }
        };


        const handlePointer = (event) => {

            const rect = stage.getBoundingClientRect();

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const normalizedX =
                (event.clientX - centerX) /
                Math.max(rect.width / 2, 1);

            const normalizedY =
                (event.clientY - centerY) /
                Math.max(rect.height / 2, 1);

            targetX = Math.max(
                -maximum,
                Math.min(maximum, normalizedX * maximum)
            );

            targetY = Math.max(
                -maximum,
                Math.min(maximum, normalizedY * maximum)
            );

            scheduleAnimation();
        };


        const resetParallax = () => {

            targetX = 0;
            targetY = 0;

            scheduleAnimation();
        };


        document.addEventListener(
            "pointermove",
            handlePointer,
            { passive: true }
        );

        stage.addEventListener(
            "pointerleave",
            resetParallax
        );

        this.debug("Mascot parallax enabled.");
    },


    /* =====================================================
       06. HIGHLIGHT CARD 3D TILT
    ===================================================== */

    initCardTilt() {

        if (
            window.matchMedia("(pointer: coarse)").matches
        ) {
            return;
        }

        const cards = document.querySelectorAll(
            ".highlight-card"
        );

        if (!cards.length) {
            return;
        }

        this.elements.cards = Array.from(cards);

        cards.forEach((card) => {

            const handleMove = (event) => {

                if (
                    this.reducedMotion ||
                    this.pageHidden
                ) {
                    return;
                }

                const rect = card.getBoundingClientRect();

                const x = (
                    event.clientX - rect.left
                ) / rect.width;

                const y = (
                    event.clientY - rect.top
                ) / rect.height;

                const rotateY =
                    (x - 0.5) * this.settings.cardTilt;

                const rotateX =
                    (0.5 - y) * this.settings.cardTilt;

                const glowX = x * 100;
                const glowY = y * 100;

                card.style.setProperty(
                    "--card-rotate-x",
                    `${rotateX.toFixed(2)}deg`
                );

                card.style.setProperty(
                    "--card-rotate-y",
                    `${rotateY.toFixed(2)}deg`
                );

                card.style.setProperty(
                    "--card-glow-x",
                    `${glowX.toFixed(1)}%`
                );

                card.style.setProperty(
                    "--card-glow-y",
                    `${glowY.toFixed(1)}%`
                );

                card.classList.add("is-tilting");
            };


            const resetCard = () => {

                card.style.setProperty(
                    "--card-rotate-x",
                    "0deg"
                );

                card.style.setProperty(
                    "--card-rotate-y",
                    "0deg"
                );

                card.classList.remove("is-tilting");
            };


            card.addEventListener(
                "pointermove",
                handleMove,
                { passive: true }
            );

            card.addEventListener(
                "pointerleave",
                resetCard
            );

            card.addEventListener(
                "pointercancel",
                resetCard
            );

        });

        this.debug("3D card tilt enabled.");
    },


    /* =====================================================
       07. BUTTON LIGHT TRACKING
    ===================================================== */

    initButtonLight() {

        if (
            window.matchMedia("(pointer: coarse)").matches
        ) {
            return;
        }

        const buttons = document.querySelectorAll(
            ".login-submit"
        );

        if (!buttons.length) {
            return;
        }

        this.elements.buttons = Array.from(buttons);

        buttons.forEach((button) => {

            button.addEventListener(
                "pointermove",
                (event) => {

                    if (
                        this.reducedMotion ||
                        this.pageHidden
                    ) {
                        return;
                    }

                    const rect = button.getBoundingClientRect();

                    const x = (
                        event.clientX - rect.left
                    ) / rect.width * 100;

                    const y = (
                        event.clientY - rect.top
                    ) / rect.height * 100;

                    button.style.setProperty(
                        "--button-glow-x",
                        `${x.toFixed(1)}%`
                    );

                    button.style.setProperty(
                        "--button-glow-y",
                        `${y.toFixed(1)}%`
                    );

                    button.classList.add(
                        "button-pointer-active"
                    );
                },
                { passive: true }
            );


            button.addEventListener(
                "pointerleave",
                () => {
                    button.classList.remove(
                        "button-pointer-active"
                    );
                }
            );

        });

        this.debug("Button light tracking enabled.");
    },


    /* =====================================================
       08. BUTTON RIPPLE
    ===================================================== */

    initButtonRipple() {

        const buttons = document.querySelectorAll(
            ".login-submit"
        );

        buttons.forEach((button) => {

            button.addEventListener(
                "pointerdown",
                (event) => {

                    if (
                        this.reducedMotion ||
                        this.pageHidden ||
                        button.disabled ||
                        button.classList.contains("loading")
                    ) {
                        return;
                    }

                    if (event.pointerType === "mouse" &&
                        event.button !== 0) {
                        return;
                    }

                    const rect = button.getBoundingClientRect();

                    const ripple = document.createElement("span");

                    ripple.className = "button-ripple";

                    const size = Math.max(
                        rect.width,
                        rect.height
                    );

                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;

                    ripple.style.width = `${size}px`;
                    ripple.style.height = `${size}px`;

                    ripple.style.left = `${x}px`;
                    ripple.style.top = `${y}px`;

                    button.appendChild(ripple);

                    window.setTimeout(() => {
                        ripple.remove();
                    }, this.settings.rippleDuration);

                }
            );

        });

        this.debug("Button ripple enabled.");
    },


    /* =====================================================
       09. PAGE VISIBILITY
    ===================================================== */

    bindVisibilityHandling() {

        document.addEventListener(
            "visibilitychange",
            () => {

                this.pageHidden = document.hidden;

                document.documentElement.classList.toggle(
                    "page-hidden",
                    this.pageHidden
                );

                if (this.pageHidden) {
                    this.pauseAnimations();
                } else if (!this.reducedMotion) {
                    this.resumeAnimations();
                }

            }
        );
    },


    pauseAnimations() {

        if (this.pointerFrame) {
            cancelAnimationFrame(this.pointerFrame);
            this.pointerFrame = null;
        }

        if (this.mascotFrame) {
            cancelAnimationFrame(this.mascotFrame);
            this.mascotFrame = null;
        }

        if (this.elements.glow) {
            this.elements.glow.style.opacity = "0";
        }

        this.elements.cards.forEach((card) => {
            card.classList.remove("is-tilting");
        });

        this.debug("Animations paused.");
    },


    resumeAnimations() {

        this.debug("Animations resumed.");
    },


    /* =====================================================
       10. MOTION PREFERENCE
    ===================================================== */

    bindMotionPreference() {

        if (!this.motionPreference) {
            return;
        }

        const updatePreference = (event) => {

            this.reducedMotion = event.matches;

            document.documentElement.classList.toggle(
                "reduced-motion",
                this.reducedMotion
            );

            if (this.reducedMotion) {

                this.pauseAnimations();

                this.resetInteractiveElements();

                this.debug("Reduced motion activated.");

            } else if (!this.pageHidden) {

                this.initializeInteractions();

                this.debug("Full motion activated.");

            }

        };


        if (
            typeof this.motionPreference.addEventListener ===
            "function"
        ) {
            this.motionPreference.addEventListener(
                "change",
                updatePreference
            );
        } else {
            this.motionPreference.addListener(
                updatePreference
            );
        }
    },


    /* =====================================================
       11. RESET INTERACTIVE ELEMENTS
    ===================================================== */

    resetInteractiveElements() {

        if (this.elements.glow) {
            this.elements.glow.style.opacity = "0";
        }

        if (this.elements.mascot) {

            this.elements.mascot.style.setProperty(
                "--mascot-parallax-x",
                "0px"
            );

            this.elements.mascot.style.setProperty(
                "--mascot-parallax-y",
                "0px"
            );
        }

        this.elements.cards.forEach((card) => {

            card.style.setProperty(
                "--card-rotate-x",
                "0deg"
            );

            card.style.setProperty(
                "--card-rotate-y",
                "0deg"
            );

            card.classList.remove("is-tilting");
        });

        this.elements.buttons.forEach((button) => {
            button.classList.remove(
                "button-pointer-active"
            );
        });
    },


    /* =====================================================
       12. DESTROY CONTROLLER
    ===================================================== */

    destroy() {

        if (this.pointerFrame) {
            cancelAnimationFrame(this.pointerFrame);
        }

        if (this.mascotFrame) {
            cancelAnimationFrame(this.mascotFrame);
        }

        this.pointerFrame = null;
        this.mascotFrame = null;

        this.resetInteractiveElements();

        this.initialized = false;

        this.debug("Animation controller destroyed.");
    }

};


/* =========================================================
   13. START ANIMATION CONTROLLER
========================================================= */

document.addEventListener(
    "sapa:ready",
    () => {
        window.SAPA.animations.init();
    },
    { once: true }
);

if (document.readyState !== "loading") {
    window.SAPA.animations.init();
} else {
    document.addEventListener(
        "DOMContentLoaded",
        () => {
            window.SAPA.animations.init();
        },
        { once: true }
    );
}


/* =========================================================
   END OF ANIMATIONS.JS
========================================================= */
