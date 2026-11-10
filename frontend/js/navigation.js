
document.addEventListener("DOMContentLoaded", () => {
    initializeSidebar();
    initializeActiveNavigation();
});

function initializeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const sidebarClose = document.getElementById("sidebarClose");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const mobileBreakpoint = 768;

    const isMobile = () => window.innerWidth <= mobileBreakpoint;

    function openSidebar() {
        if (!sidebar || !isMobile()) return;

        sidebar.classList.add("active");

        if (sidebarOverlay) {
            sidebarOverlay.classList.add("active");
        }

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "true");
        }

        document.body.classList.add("sidebar-open");
    }

    function closeSidebar() {
        if (!sidebar) return;

        sidebar.classList.remove("active");

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("active");
        }

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "false");
        }

        document.body.classList.remove("sidebar-open");
    }

    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            const isOpen = sidebar?.classList.contains("active");

            if (isOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (sidebarClose) {
        sidebarClose.addEventListener("click", closeSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", closeSidebar);
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeSidebar();
        }
    });

    window.addEventListener("resize", () => {
        if (!isMobile()) {
            closeSidebar();
        }
    });

    window.SapaNavigation = {
        openSidebar,
        closeSidebar
    };
}

function initializeActiveNavigation() {
    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    const navigationLinks = document.querySelectorAll(
        ".sidebar-nav a[href]"
    );

    navigationLinks.forEach((link) => {
        const linkPage = link.getAttribute("href")
            .split("/")
            .pop()
            .toLowerCase();

        if (linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }

        link.addEventListener("click", () => {
            if (window.SapaNavigation) {
                window.SapaNavigation.closeSidebar();
            }
        });
    });
}
