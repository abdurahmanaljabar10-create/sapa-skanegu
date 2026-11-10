
"use strict";

window.SAPA = window.SAPA || {};

/* =========================================================
   01. APPLICATION CONFIGURATION
========================================================= */

window.SAPA.config = Object.assign(
    {
        appName: "SAPA-SKANEGU",
        schoolName: "SMKN 1 Dlanggu",
        apiBaseUrl: "",
        loginEndpoint: "/auth/login",
        logoutEndpoint: "/auth/logout",
        requestTimeout: 15000,
        debug: false
    },
    window.SAPA.config || {}
);


/* =========================================================
   02. DOM UTILITIES
========================================================= */

window.SAPA.utils = window.SAPA.utils || {};

Object.assign(window.SAPA.utils, {

    $(selector, scope = document) {
        return scope.querySelector(selector);
    },

    $$(selector, scope = document) {
        return Array.from(scope.querySelectorAll(selector));
    },

    on(element, eventName, callback, options) {
        if (!element || typeof callback !== "function") {
            return;
        }

        element.addEventListener(
            eventName,
            callback,
            options
        );
    },

    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    debounce(callback, delay = 150) {
        let timeoutId;

        return function (...args) {
            window.clearTimeout(timeoutId);

            timeoutId = window.setTimeout(() => {
                callback.apply(this, args);
            }, delay);
        };
    },

    isReducedMotion() {
        return window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
    },

    isTouchDevice() {
        return (
            window.matchMedia("(pointer: coarse)").matches ||
            navigator.maxTouchPoints > 0
        );
    },

    setText(element, value) {
        if (!element) {
            return;
        }

        element.textContent = String(value ?? "");
    },

    escapeHTML(value) {
        const element = document.createElement("span");

        element.textContent = String(value ?? "");

        return element.innerHTML;
    },

    isElementVisible(element) {
        return Boolean(
            element &&
            element.isConnected &&
            element.getClientRects().length
        );
    }

});


/* =========================================================
   03. ICON MANAGEMENT
========================================================= */

window.SAPA.icons = {

    initialized: false,

    refresh() {
        if (
            !window.lucide ||
            typeof window.lucide.createIcons !== "function"
        ) {
            return false;
        }

        try {
            window.lucide.createIcons();

            this.initialized = true;

            return true;

        } catch (error) {
            console.error(
                "[SAPA] Icon initialization failed:",
                error
            );

            return false;
        }
    }

};


/* =========================================================
   04. CURRENT YEAR
========================================================= */

window.SAPA.initializeYear = function () {

    const currentYear = new Date().getFullYear();

    const elements = window.SAPA.utils.$$(
        "[data-current-year], #currentYear"
    );

    elements.forEach((element) => {
        element.textContent = String(currentYear);
    });

};


/* =========================================================
   05. NOTIFICATION SYSTEM
========================================================= */

window.SAPA.notifications = {

    container: null,

    counter: 0,

    timers: new Map(),

    getContainer() {

        if (this.container?.isConnected) {
            return this.container;
        }

        this.container = document.querySelector(
            "#notification-region"
        );

        if (!this.container) {

            this.container = document.createElement("div");

            this.container.id = "notification-region";

            this.container.className = "notification-region";

            this.container.setAttribute(
                "aria-live",
                "polite"
            );

            this.container.setAttribute(
                "aria-relevant",
                "additions text"
            );

            this.container.setAttribute(
                "aria-atomic",
                "false"
            );

            document.body.appendChild(this.container);
        }

        return this.container;
    },


    getIcon(type) {

        const icons = {
            success: "check-circle",
            error: "alert-circle",
            warning: "alert-triangle",
            info: "info"
        };

        return icons[type] || icons.info;
    },


    show(message, type = "info", duration = 4000) {

        const allowedTypes = [
            "success",
            "error",
            "warning",
            "info"
        ];

        const safeType = allowedTypes.includes(type)
            ? type
            : "info";

        const container = this.getContainer();

        const notificationId =
            `sapa-notification-${++this.counter}`;

        const notification = document.createElement("div");

        notification.id = notificationId;

        notification.className =
            `sapa-notification sapa-notification-${safeType}`;

        notification.setAttribute(
            "role",
            safeType === "error" ? "alert" : "status"
        );

        const icon = document.createElement("i");

        icon.className = "sapa-notification-icon";

        icon.setAttribute("aria-hidden", "true");

        icon.setAttribute(
            "data-lucide",
            this.getIcon(safeType)
        );

        const text = document.createElement("span");

        text.className = "sapa-notification-message";

        text.textContent = String(message ?? "");

        const closeButton = document.createElement("button");

        closeButton.type = "button";

        closeButton.className = "sapa-notification-close";

        closeButton.setAttribute(
            "aria-label",
            "Tutup notifikasi"
        );

        closeButton.textContent = "×";

        notification.append(
            icon,
            text,
            closeButton
        );

        container.appendChild(notification);

        window.SAPA.icons.refresh();

        requestAnimationFrame(() => {
            notification.classList.add("is-visible");
        });

        const remove = () => {

            if (!notification.isConnected) {
                return;
            }

            notification.classList.remove("is-visible");

            notification.classList.add("is-removing");

            const timer = this.timers.get(notificationId);

            if (timer) {
                window.clearTimeout(timer);

                this.timers.delete(notificationId);
            }

            window.setTimeout(() => {
                notification.remove();
            }, 300);
        };

        closeButton.addEventListener(
            "click",
            remove,
            { once: true }
        );

        if (Number(duration) > 0) {

            const timer = window.setTimeout(
                remove,
                Number(duration)
            );

            this.timers.set(notificationId, timer);
        }

        return {
            id: notificationId,
            close: remove
        };
    },


    success(message, duration = 4000) {
        return this.show(message, "success", duration);
    },

    error(message, duration = 5000) {
        return this.show(message, "error", duration);
    },

    warning(message, duration = 4500) {
        return this.show(message, "warning", duration);
    },

    info(message, duration = 4000) {
        return this.show(message, "info", duration);
    },


    clear() {

        this.timers.forEach((timer) => {
            window.clearTimeout(timer);
        });

        this.timers.clear();

        if (this.container) {
            this.container.replaceChildren();
        }
    }

};


/* =========================================================
   06. GENERAL BUTTON RIPPLE
   Login button ripple is handled by animations.js.
========================================================= */

window.SAPA.initializeRipple = function () {

    if (window.SAPA.utils.isReducedMotion()) {
        return;
    }

    const buttons = window.SAPA.utils.$$(
        ".button:not(.login-submit)"
    );

    buttons.forEach((button) => {

        if (
            button.dataset.rippleInitialized === "true"
        ) {
            return;
        }

        button.dataset.rippleInitialized = "true";

        button.addEventListener("pointerdown", (event) => {

            if (
                button.disabled ||
                button.getAttribute("aria-busy") === "true"
            ) {
                return;
            }

            if (
                event.pointerType === "mouse" &&
                event.button !== 0
            ) {
                return;
            }

            const rect = button.getBoundingClientRect();

            const ripple = document.createElement("span");

            ripple.className = "interaction-ripple";

            const size = Math.max(
                rect.width,
                rect.height
            ) * 1.5;

            ripple.style.cssText = [
                "position:absolute",
                "z-index:1",
                `width:${size}px`,
                `height:${size}px`,
                `left:${event.clientX - rect.left - size / 2}px`,
                `top:${event.clientY - rect.top - size / 2}px`,
                "border-radius:50%",
                "background:rgba(255,255,255,.2)",
                "pointer-events:none",
                "transform:scale(0)",
                "opacity:1",
                "transition:transform .55s ease,opacity .55s ease"
            ].join(";");

            button.appendChild(ripple);

            requestAnimationFrame(() => {
                ripple.style.transform = "scale(1)";
                ripple.style.opacity = "0";
            });

            window.setTimeout(() => {
                ripple.remove();
            }, 650);

        });

    });

};


/* =========================================================
   07. EXTERNAL LINK SECURITY
========================================================= */

window.SAPA.initializeExternalLinks = function () {

    const links = window.SAPA.utils.$$(
        'a[target="_blank"]'
    );

    links.forEach((link) => {

        const currentRel = link.getAttribute("rel") || "";

        const relTokens = new Set(
            currentRel.split(/\s+/).filter(Boolean)
        );

        relTokens.add("noopener");
        relTokens.add("noreferrer");

        link.setAttribute(
            "rel",
            Array.from(relTokens).join(" ")
        );

    });

};


/* =========================================================
   08. KEYBOARD MANAGEMENT
========================================================= */

window.SAPA.initializeKeyboard = function () {

    if (
        document.documentElement.dataset.keyboardInitialized ===
        "true"
    ) {
        return;
    }

    document.documentElement.dataset.keyboardInitialized =
        "true";

    document.addEventListener("keydown", (event) => {

        if (event.key !== "Escape") {
            return;
        }

        const activeElement = document.activeElement;

        if (
            activeElement instanceof HTMLElement &&
            activeElement.matches(".password-toggle")
        ) {
            activeElement.blur();
        }

    });

};


/* =========================================================
   09. GLOBAL ERROR HANDLING
========================================================= */

window.addEventListener("error", (event) => {

    if (!window.SAPA.config.debug) {
        return;
    }

    console.error(
        "[SAPA] Runtime error:",
        event.message,
        event.filename,
        event.lineno
    );

});


window.addEventListener(
    "unhandledrejection",
    (event) => {

        if (!window.SAPA.config.debug) {
            return;
        }

        console.error(
            "[SAPA] Unhandled promise rejection:",
            event.reason
        );

    }
);


/* =========================================================
   10. APPLICATION INITIALIZER
========================================================= */

window.SAPA.initialize = function () {

    if (
        document.documentElement.dataset.sapaInitialized ===
        "true"
    ) {
        return;
    }

    document.documentElement.dataset.sapaInitialized = "true";

    window.SAPA.initializeYear();

    window.SAPA.icons.refresh();

    window.SAPA.initializeRipple();

    window.SAPA.initializeExternalLinks();

    window.SAPA.initializeKeyboard();

    document.dispatchEvent(
        new CustomEvent("sapa:ready")
    );

    if (window.SAPA.config.debug) {
        console.info(
            "[SAPA] Main application initialized."
        );
    }

};


/* =========================================================
   11. DOM READY
========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        window.SAPA.initialize,
        { once: true }
    );

} else {

    window.SAPA.initialize();

}


/* =========================================================
   END OF MAIN.JS
========================================================= */
