
// ===================================
// SAPA-SKANEGU - STUDENT DASHBOARD
// ===================================

// Mobile sidebar
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");

menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

// Tutup sidebar ketika klik di luar area
document.addEventListener("click", (event) => {
    if (
        window.innerWidth <= 760 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {
        sidebar.classList.remove("open");
    }
});

// Demo tombol layanan
document.querySelectorAll("[data-feature]").forEach(link => {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        const feature = link.dataset.feature;

        alert(
            `Menu ${feature} sedang dalam tahap pengembangan.`
        );
    });
});

// Demo tombol notifikasi
const notificationButton = document.querySelector(
    ".notification-button"
);

notificationButton.addEventListener("click", () => {
    alert("Belum ada notifikasi baru.");
});

// Konfirmasi keluar
document.getElementById("logoutButton").addEventListener(
    "click",
    (event) => {
        const confirmLogout = confirm(
            "Apakah kamu yakin ingin keluar dari dashboard?"
        );

        if (!confirmLogout) {
            event.preventDefault();
        }
    }
);
