
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const statistics = {
        total: 24,
        pending: 4,
        process: 8,
        complete: 12
    };

    const targets = {
        total: document.getElementById("saStatTotal"),
        pending: document.getElementById("saStatPending"),
        process: document.getElementById("saStatProcess"),
        complete: document.getElementById("saStatComplete")
    };

    Object.entries(statistics).forEach(([key, value]) => {
        if (targets[key]) {
            targets[key].textContent = value.toLocaleString("id-ID");
        }
    });

    const currentPage = document.body.dataset.saPage;

    document.querySelectorAll(".sidebar-link").forEach(link => {
        const href = new URL(link.href, window.location.href);
        const current = new URL(window.location.href);

        if (href.pathname === current.pathname) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });

    const quickLinks = document.querySelectorAll(".sa-quick-card");

    quickLinks.forEach((link, index) => {
        link.style.animationDelay = `${index * 45}ms`;
    });

    if (currentPage === "dashboard") {
        document.title = "Dashboard Kesiswaan | SAPA-SKANEGU";
    }
});
