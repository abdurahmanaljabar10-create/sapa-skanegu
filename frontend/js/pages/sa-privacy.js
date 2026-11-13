
document.addEventListener("DOMContentLoaded", () => {
    const printButton = document.getElementById("printPrivacy");
    const currentDate = document.getElementById("privacyCurrentDate");
    const toast = document.getElementById("privacyToast");
    const tocLinks = [...document.querySelectorAll(".sa-privacy-toc a")];
    const sections = tocLinks
        .map(link => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    let toastTimer;

    function refreshIcons() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function showToast(message) {
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        window.clearTimeout(toastTimer);

        toastTimer = window.setTimeout(() => {
            toast.classList.remove("show");
        }, 2600);
    }

    if (currentDate) {
        currentDate.textContent = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date());
    }

    printButton?.addEventListener("click", () => {
        window.print();
    });

    tocLinks.forEach(link => {
        link.addEventListener("click", event => {
            const target = document.querySelector(link.getAttribute("href"));

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            tocLinks.forEach(item => item.classList.remove("active"));
            link.classList.add("active");
        });
    });

    if ("IntersectionObserver" in window && sections.length) {
        const observer = new IntersectionObserver(entries => {
            const visibleSections = entries
                .filter(entry => entry.isIntersecting)
                .sort((a,b) => b.intersectionRatio - a.intersectionRatio);

            if (!visibleSections.length) return;

            const activeId = visibleSections[0].target.id;

            tocLinks.forEach(link => {
                const active = link.getAttribute("href") === `#${activeId}`;
                link.classList.toggle("active", active);
            });
        }, {
            rootMargin: "-15% 0px -70% 0px",
            threshold: [0,0.15,0.3,0.5]
        });

        sections.forEach(section => observer.observe(section));
    }

    const sidebarToggle = document.querySelector("[data-sidebar-toggle]");
    const sidebarClose = document.querySelector("[data-sidebar-close]");
    const sidebarOverlay = document.querySelector("[data-sidebar-overlay]");
    const sidebar = document.querySelector("[data-sidebar]");

    function closeSidebar() {
        if (!sidebar) return;

        sidebar.classList.remove("active");
        sidebarOverlay?.classList.remove("active");
        document.body.classList.remove("sidebar-open");
        sidebarToggle?.setAttribute("aria-expanded", "false");
    }

    sidebarToggle?.addEventListener("click", () => {
        if (!sidebar) return;

        const isOpen = sidebar.classList.toggle("active");

        sidebarOverlay?.classList.toggle("active", isOpen);
        document.body.classList.toggle("sidebar-open", isOpen);
        sidebarToggle.setAttribute("aria-expanded", String(isOpen));
    });

    sidebarClose?.addEventListener("click", closeSidebar);
    sidebarOverlay?.addEventListener("click", closeSidebar);

    document.querySelectorAll(".sidebar-link").forEach(link => {
        link.addEventListener("click", closeSidebar);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeSidebar();
        }
    });

    refreshIcons();
});
