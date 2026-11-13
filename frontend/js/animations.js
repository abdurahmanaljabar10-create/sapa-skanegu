
"use strict";

window.SAPA = window.SAPA || {};

window.SAPA.animations = (() => {
    let initialized = false;
    let reducedMotion = false;
    let pageHidden = document.hidden;
    let pointerFrame = null;
    let glow = null;
    let cards = [];
    let buttons = [];
    let motionQuery = null;
    let pointerMoveHandler = null;
    let pointerLeaveHandler = null;
    let blurHandler = null;
    let visibilityHandler = null;
    let motionHandler = null;

    const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    );

    const createCursorGlow = () => {
        if (!finePointer.matches || reducedMotion) return;

        glow = document.querySelector(".student-dashboard .cursor-glow");

        if (!glow) {
            glow = document.createElement("div");
            glow.className = "cursor-glow";
            glow.setAttribute("aria-hidden", "true");
            document.body.appendChild(glow);
        }

        pointerMoveHandler = (event) => {
            if (reducedMotion || pageHidden || pointerFrame) return;

            pointerFrame = requestAnimationFrame(() => {
                if (!glow) {
                    pointerFrame = null;
                    return;
                }

                glow.style.setProperty("--cursor-x", `${event.clientX}px`);
                glow.style.setProperty("--cursor-y", `${event.clientY}px`);
                glow.style.opacity = "1";
                pointerFrame = null;
            });
        };

        pointerLeaveHandler = () => {
            if (glow) glow.style.opacity = "0";
        };

        blurHandler = () => {
            if (glow) glow.style.opacity = "0";
        };

        document.addEventListener("pointermove", pointerMoveHandler, {
            passive: true
        });

        document.addEventListener("pointerleave", pointerLeaveHandler);
        window.addEventListener("blur", blurHandler);
    };

    const setupCardEffects = () => {
        if (!finePointer.matches) return;

        cards = Array.from(document.querySelectorAll(
            ".student-dashboard .stat-card, " +
            ".student-dashboard .quick-action-card"
        ));

        cards.forEach((card) => {
            const move = (event) => {
                if (reducedMotion || pageHidden) return;

                const rect = card.getBoundingClientRect();

                const x = ((event.clientX - rect.left) / rect.width) * 100;
                const y = ((event.clientY - rect.top) / rect.height) * 100;

                card.style.setProperty("--hover-x", `${x}%`);
                card.style.setProperty("--hover-y", `${y}%`);
                card.style.setProperty("--card-glow-x", `${x}%`);
                card.style.setProperty("--card-glow-y", `${y}%`);
                card.classList.add("is-tilting");
            };

            const leave = () => {
                card.classList.remove("is-tilting");
            };

            card.addEventListener("pointermove", move, {
                passive: true
            });

            card.addEventListener("pointerleave", leave);

            card._sapaAnimationMove = move;
            card._sapaAnimationLeave = leave;
        });
    };

    const setupButtonEffects = () => {
        buttons = Array.from(document.querySelectorAll(
            ".student-dashboard .welcome-actions .button"
        ));

        buttons.forEach((button) => {
            const pointerMove = (event) => {
                if (reducedMotion || pageHidden) return;

                const rect = button.getBoundingClientRect();

                const x = ((event.clientX - rect.left) / rect.width) * 100;
                const y = ((event.clientY - rect.top) / rect.height) * 100;

                button.style.setProperty("--button-glow-x", `${x}%`);
                button.style.setProperty("--button-glow-y", `${y}%`);
                button.classList.add("button-pointer-active");
            };

            const pointerLeave = () => {
                button.classList.remove("button-pointer-active");
            };

            const pointerDown = (event) => {
                if (
                    reducedMotion ||
                    pageHidden ||
                    button.disabled ||
                    (event.pointerType === "mouse" && event.button !== 0)
                ) return;

                const rect = button.getBoundingClientRect();
                const ripple = document.createElement("span");
                const size = Math.max(rect.width, rect.height);

                ripple.className = "button-ripple";
                ripple.style.width = `${size}px`;
                ripple.style.height = `${size}px`;
                ripple.style.left = `${event.clientX - rect.left}px`;
                ripple.style.top = `${event.clientY - rect.top}px`;

                button.appendChild(ripple);

                ripple.addEventListener("animationend", () => {
                    ripple.remove();
                }, { once: true });
            };

            button.addEventListener("pointermove", pointerMove, {
                passive: true
            });

            button.addEventListener("pointerleave", pointerLeave);
            button.addEventListener("pointerdown", pointerDown);

            button._sapaAnimationHandlers = {
                pointerMove,
                pointerLeave,
                pointerDown
            };
        });
    };

    const handleVisibility = () => {
        pageHidden = document.hidden;

        if (pageHidden) {
            if (pointerFrame) {
                cancelAnimationFrame(pointerFrame);
                pointerFrame = null;
            }

            if (glow) glow.style.opacity = "0";

            cards.forEach((card) => {
                card.classList.remove("is-tilting");
            });

            buttons.forEach((button) => {
                button.classList.remove("button-pointer-active");
            });
        }
    };

    const handleMotionPreference = (event) => {
        reducedMotion = event.matches;

        document.documentElement.classList.toggle(
            "reduced-motion",
            reducedMotion
        );

        if (reducedMotion) {
            if (glow) glow.style.opacity = "0";

            cards.forEach((card) => {
                card.classList.remove("is-tilting");
            });

            buttons.forEach((button) => {
                button.classList.remove("button-pointer-active");
            });
        }
    };

    const init = () => {
        if (initialized) return;

        if (!document.querySelector(".student-dashboard")) return;

        initialized = true;

        motionQuery = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        reducedMotion = motionQuery.matches;

        motionHandler = handleMotionPreference;
        visibilityHandler = handleVisibility;

        if (motionQuery.addEventListener) {
            motionQuery.addEventListener("change", motionHandler);
        } else {
            motionQuery.addListener(motionHandler);
        }

        document.addEventListener("visibilitychange", visibilityHandler);

        createCursorGlow();
        setupCardEffects();
        setupButtonEffects();

        document.documentElement.classList.toggle(
            "reduced-motion",
            reducedMotion
        );
    };

    const destroy = () => {
        if (pointerFrame) {
            cancelAnimationFrame(pointerFrame);
            pointerFrame = null;
        }

        if (pointerMoveHandler) {
            document.removeEventListener("pointermove", pointerMoveHandler);
        }

        if (pointerLeaveHandler) {
            document.removeEventListener("pointerleave", pointerLeaveHandler);
        }

        if (blurHandler) {
            window.removeEventListener("blur", blurHandler);
        }

        if (visibilityHandler) {
            document.removeEventListener(
                "visibilitychange",
                visibilityHandler
            );
        }

        if (motionQuery && motionHandler) {
            if (motionQuery.removeEventListener) {
                motionQuery.removeEventListener("change", motionHandler);
            } else {
                motionQuery.removeListener(motionHandler);
            }
        }

        cards.forEach((card) => {
            card.removeEventListener(
                "pointermove",
                card._sapaAnimationMove
            );

            card.removeEventListener(
                "pointerleave",
                card._sapaAnimationLeave
            );

            card.classList.remove("is-tilting");
        });

        buttons.forEach((button) => {
            const handlers = button._sapaAnimationHandlers;

            if (!handlers) return;

            button.removeEventListener("pointermove", handlers.pointerMove);
            button.removeEventListener("pointerleave", handlers.pointerLeave);
            button.removeEventListener("pointerdown", handlers.pointerDown);

            button.classList.remove("button-pointer-active");
        });

        if (glow) {
            glow.style.opacity = "0";

            if (glow.parentElement === document.body) {
                glow.remove();
            }
        }

        cards = [];
        buttons = [];
        glow = null;
        initialized = false;
    };

    return {
        init,
        destroy
    };
})();

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        window.SAPA.animations.init();
    }, { once: true });
} else {
    window.SAPA.animations.init();
}
