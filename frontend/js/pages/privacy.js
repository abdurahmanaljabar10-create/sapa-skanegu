"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const $ = (id) => document.getElementById(id);

    const refreshIcons = () => {
        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    };

    const updateDate = () => {
        const dateElement = $("currentDate");

        if (!dateElement) return;

        dateElement.textContent = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date());
    };

    const updateUser = () => {
        const topbarName = $("topbarUserName");
        const sidebarName = $("sidebarUserName");
        const topbarInitial = $("topbarUserInitial");
        const sidebarInitial = $("sidebarUserInitial");

        const name = topbarName?.textContent.trim() || "Siswa";
        const initial = name.charAt(0).toUpperCase();

        if (sidebarName) sidebarName.textContent = name;
        if (topbarInitial) topbarInitial.textContent = initial;
        if (sidebarInitial) sidebarInitial.textContent = initial;
    };

    const tocLinks = Array.from(
        document.querySelectorAll(".privacy-toc-link")
    );

    const sections = tocLinks
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    const setActiveLink = (sectionId) => {
        tocLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${sectionId}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    tocLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const target = document.querySelector(link.getAttribute("href"));

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "auto"
                    : "smooth",
                block: "start"
            });

            setActiveLink(target.id);
            history.replaceState(null, "", link.getAttribute("href"));
        });
    });

    if ("IntersectionObserver" in window && sections.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                const visibleSections = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top - b.boundingClientRect.top
                    );

                if (visibleSections.length) {
                    setActiveLink(visibleSections[0].target.id);
                }
            },
            {
                rootMargin: "-15% 0px -70% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => observer.observe(section));
    }

    updateDate();
    updateUser();
    refreshIcons();
});