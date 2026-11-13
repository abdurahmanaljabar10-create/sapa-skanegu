
"use strict";

(function (window, document) {
    const StudentDashboard = {
        initialized: false,

        init() {
            if (this.initialized) return;

            this.initialized = true;
            this.initializeDate();
            this.initializeUser();
            this.initializeStatistics();
            this.initializeSidebar();
            this.initializeLogout();
        },

        initializeDate() {
            const dateElement = document.getElementById("dashboardDate");

            if (!dateElement) return;

            dateElement.textContent = new Intl.DateTimeFormat("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }).format(new Date());
        },

        initializeUser() {
            const user = window.SAPA_USER || {};
            const name = user.name || "Nama Siswa";
            const firstName = name.trim().split(/\s+/)[0] || "Siswa";
            const role = user.roleLabel || "Siswa";
            const initial = name.trim().charAt(0).toUpperCase() || "S";

            const elements = {
                sidebarUserName: name,
                topbarUserName: name,
                welcomeUserName: firstName,
                sidebarUserInitial: initial,
                topbarUserInitial: initial
            };

            Object.entries(elements).forEach(([id, value]) => {
                const element = document.getElementById(id);

                if (element) {
                    element.textContent = value;
                }
            });

            document.querySelectorAll("[data-user-role]").forEach(element => {
                element.textContent = role;
            });
        },

        initializeStatistics() {
            const data = window.SAPA_DASHBOARD_DATA || {};

            const statistics = {
                totalSubmissions: data.totalSubmissions ?? 0,
                processingSubmissions: data.processingSubmissions ?? 0,
                completedSubmissions: data.completedSubmissions ?? 0,
                unreadNotifications: data.unreadNotifications ?? 0
            };

            Object.entries(statistics).forEach(([id, value]) => {
                const element = document.getElementById(id);

                if (!element) return;

                const number = Number(value);

                element.textContent = Number.isFinite(number) && number >= 0
                    ? number.toLocaleString("id-ID")
                    : "0";
            });
        },

        initializeSidebar() {
            const sidebar = document.querySelector("[data-sidebar]");
            const overlay = document.querySelector("[data-sidebar-overlay]");
            const toggle = document.querySelector("[data-sidebar-toggle]");
            const closeButtons = document.querySelectorAll("[data-sidebar-close]");

            if (!sidebar) return;

            const open = () => {
                sidebar.classList.add("is-open");
                overlay?.classList.add("is-visible");
                document.body.classList.add("sidebar-open");
                toggle?.setAttribute("aria-expanded", "true");
            };

            const close = () => {
                sidebar.classList.remove("is-open");
                overlay?.classList.remove("is-visible");
                document.body.classList.remove("sidebar-open");
                toggle?.setAttribute("aria-expanded", "false");
            };

            toggle?.addEventListener("click", () => {
                sidebar.classList.contains("is-open") ? close() : open();
            });

            overlay?.addEventListener("click", close);

            closeButtons.forEach(button => {
                button.addEventListener("click", close);
            });

            sidebar.querySelectorAll("a").forEach(link => {
                link.addEventListener("click", close);
            });

            document.addEventListener("keydown", event => {
                if (event.key === "Escape") close();
            });

            window.addEventListener("resize", () => {
                if (window.innerWidth > 900) close();
            });
        },

        initializeLogout() {
            document.querySelectorAll("[data-logout]").forEach(button => {
                button.addEventListener("click", async event => {
                    event.preventDefault();

                    const confirmed = window.confirm(
                        "Apakah kamu yakin ingin keluar dari SAPA-SKANEGU?"
                    );

                    if (!confirmed) return;

                    try {
                        if (window.SAPA?.auth?.logout) {
                            await window.SAPA.auth.logout();
                        } else {
                            window.location.href = "../../index.html";
                        }
                    } catch (error) {
                        window.SAPA?.notifications?.error(
                            error.message || "Gagal keluar dari akun."
                        );
                    }
                });
            });
        }
    };

    window.SAPA = window.SAPA || {};
    window.SAPA.studentDashboard = StudentDashboard;

    function initialize() {
        StudentDashboard.init();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize, { once: true });
    } else {
        initialize();
    }

})(window, document);
