
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const mobileOverlay = document.getElementById("mobileOverlay");
    const currentDate = document.getElementById("currentDate");

    const closeSidebar = () => {
        sidebar?.classList.remove("open");
        mobileOverlay?.classList.remove("active");
        document.body.classList.remove("sidebar-open");
    };

    const openSidebar = () => {
        sidebar?.classList.add("open");
        mobileOverlay?.classList.add("active");
        document.body.classList.add("sidebar-open");
    };

    menuToggle?.addEventListener("click", () => {
        const isOpen = sidebar?.classList.contains("open");

        if (isOpen) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    mobileOverlay?.addEventListener("click", closeSidebar);

    document.querySelectorAll(".sidebar-nav .nav-item").forEach(link => {
        link.addEventListener("click", closeSidebar);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 700) {
            closeSidebar();
        }
    });

    if (currentDate) {
        const updateDate = () => {
            const now = new Date();

            currentDate.textContent = new Intl.DateTimeFormat("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }).format(now);
        };

        updateDate();
    }

    const dashboardData = window.SAPA_DASHBOARD_DATA || {};

    const statElements = {
        "total-reports": document.querySelector('[data-stat="total-reports"]'),
        "in-progress": document.querySelector('[data-stat="in-progress"]'),
        "completed": document.querySelector('[data-stat="completed"]'),
        "notifications": document.querySelector('[data-stat="notifications"]')
    };

    const animateCounter = (element, target) => {
        if (!element) return;

        const finalValue = Number(target);

        if (!Number.isFinite(finalValue) || finalValue < 0) {
            element.textContent = "0";
            return;
        }

        const duration = 900;
        const startTime = performance.now();

        const update = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(finalValue * easedProgress);

            element.textContent = currentValue.toLocaleString("id-ID");

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    Object.entries(statElements).forEach(([key, element]) => {
        const value = dashboardData[key] ?? 0;
        animateCounter(element, value);
    });

    const activityEmpty = document.querySelector("[data-activity-empty]");
    const activityList = document.querySelector("[data-activity-list]");

    const renderActivities = (activities) => {
        if (!activityEmpty || !activityList) return;

        activityList.replaceChildren();

        if (!Array.isArray(activities) || activities.length === 0) {
            activityEmpty.hidden = false;
            activityList.hidden = true;
            return;
        }

        activityEmpty.hidden = true;
        activityList.hidden = false;

        activities.slice(0, 5).forEach(activity => {
            const item = document.createElement("article");
            item.className = "activity-item";

            const icon = document.createElement("div");
            icon.className = "activity-item-icon";

            const iconElement = document.createElement("i");
            iconElement.className = "fa-solid fa-file-lines";
            icon.appendChild(iconElement);

            const content = document.createElement("div");
            content.className = "activity-item-content";

            const title = document.createElement("strong");
            title.textContent = activity.title || "Aktivitas";

            const date = document.createElement("span");
            date.textContent = activity.date || "Tanggal belum tersedia";

            content.append(title, date);

            const status = document.createElement("span");
            status.className = "activity-item-status";
            status.textContent = activity.status || "Tercatat";

            item.append(icon, content, status);
            activityList.appendChild(item);
        });
    };

    renderActivities(dashboardData.activities || []);

    const userData = window.SAPA_USER || {};

    const userName = userData.name || "Nama Siswa";
    const firstName = userName.trim().split(/\s+/)[0] || "Penjelajah";

    document.querySelectorAll("[data-user-name]").forEach(element => {
        element.textContent = userName;
    });

    document.querySelectorAll("[data-user-first-name]").forEach(element => {
        element.textContent = firstName;
    });

    document.querySelectorAll("[data-user-role]").forEach(element => {
        element.textContent = userData.roleLabel || "Siswa";
    });

    document.querySelectorAll("[data-logout]").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();

            const confirmed = window.confirm("Apakah kamu yakin ingin keluar dari SAPA-SKANEGU?");

            if (confirmed) {
                window.location.href = "../index.html";
            }
        });
    });

    document.querySelectorAll(".quick-access-card, .btn-primary, .btn-secondary").forEach(element => {
        element.addEventListener("pointerdown", event => {
            if (event.pointerType === "touch") return;

            element.classList.add("pressed");
        });

        ["pointerup", "pointerleave", "pointercancel"].forEach(eventName => {
            element.addEventListener(eventName, () => {
                element.classList.remove("pressed");
            });
        });
    });
});
