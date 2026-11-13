
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector("[data-sidebar]");
    const overlay = document.querySelector("[data-sidebar-overlay]");
    const openButton = document.querySelector("[data-sidebar-toggle]");
    const closeButton = document.querySelector("[data-sidebar-close]");
    const dateElement = document.getElementById("saCurrentDate");
    const toastElement = document.getElementById("saToast");

    let toastTimer;

    function openSidebar() {
        if (!sidebar || !overlay) return;

        sidebar.classList.add("is-open");
        overlay.classList.add("is-visible");
        openButton?.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
    }

    function closeSidebar() {
        if (!sidebar || !overlay) return;

        sidebar.classList.remove("is-open");
        overlay.classList.remove("is-visible");
        openButton?.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    }

    openButton?.addEventListener("click", openSidebar);
    closeButton?.addEventListener("click", closeSidebar);
    overlay?.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeSidebar();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 800) closeSidebar();
    });

    if (dateElement) {
        dateElement.textContent = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date());
    }

    function initializeIcons() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function showToast(message) {
        if (!toastElement) return;

        toastElement.textContent = message;
        toastElement.classList.add("show");

        window.clearTimeout(toastTimer);

        toastTimer = window.setTimeout(() => {
            toastElement.classList.remove("show");
        }, 2600);
    }

    document.querySelectorAll(".sidebar-link").forEach(link => {
        const currentPath = window.location.pathname;
        const targetPath = new URL(link.href, window.location.href).pathname;

        if (currentPath === targetPath) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });

    window.SapaStudentAffairs = Object.freeze({
        showToast,
        refreshIcons: initializeIcons,
        closeSidebar
    });

    initializeIcons();
});
