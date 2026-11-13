
document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "sapa_kesiswaan_profile_v1";

    const form = document.getElementById("profileForm");
    const nameInput = document.getElementById("profileName");
    const emailInput = document.getElementById("profileEmail");
    const phoneInput = document.getElementById("profilePhone");
    const positionInput = document.getElementById("profilePosition");
    const resetButton = document.getElementById("resetProfile");
    const toast = document.getElementById("profileToast");

    const defaultProfile = {
        name: "Tim Kesiswaan",
        email: "kesiswaan@smkn1dlanggu.sch.id",
        phone: "",
        position: "Petugas Kesiswaan"
    };

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
        }, 2800);
    }

    function getInitials(name) {
        const words = String(name || "")
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (!words.length) return "KS";

        return words
            .slice(0, 2)
            .map(word => word.charAt(0).toUpperCase())
            .join("");
    }

    function loadProfile() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (!saved) return { ...defaultProfile };

            const parsed = JSON.parse(saved);

            return {
                ...defaultProfile,
                ...parsed,
                position: defaultProfile.position
            };
        } catch (error) {
            console.error("Gagal membaca profil:", error);
            return { ...defaultProfile };
        }
    }

    function updateProfileDisplay(profile) {
        nameInput.value = profile.name;
        emailInput.value = profile.email;
        phoneInput.value = profile.phone;
        positionInput.value = profile.position;

        const initials = getInitials(profile.name);

        document.getElementById("profileAvatar").textContent = initials;
        document.getElementById("topbarProfileAvatar").textContent = initials;
        document.getElementById("bannerProfileName").textContent = profile.name;
        document.getElementById("bannerProfileEmail").textContent = profile.email;
        document.getElementById("topbarProfileName").textContent = profile.name;
        document.getElementById("sidebarProfileName").textContent = profile.name;
    }

    function saveProfile(profile) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
            updateProfileDisplay(profile);
            showToast("Perubahan profil berhasil disimpan di perangkat ini.");
        } catch (error) {
            console.error("Gagal menyimpan profil:", error);
            showToast("Profil gagal disimpan. Periksa penyimpanan browser.");
        }
    }

    function getFormProfile() {
        return {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            position: defaultProfile.position
        };
    }

    form?.addEventListener("submit", event => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const profile = getFormProfile();

        if (profile.name.length < 2) {
            showToast("Nama lengkap minimal 2 karakter.");
            nameInput.focus();
            return;
        }

        if (!profile.email) {
            showToast("Email wajib diisi.");
            emailInput.focus();
            return;
        }

        saveProfile(profile);
    });

    resetButton?.addEventListener("click", () => {
        const confirmed = window.confirm(
            "Kembalikan informasi profil ke data awal?"
        );

        if (!confirmed) return;

        try {
            localStorage.removeItem(STORAGE_KEY);
            updateProfileDisplay(defaultProfile);
            showToast("Profil dikembalikan ke data awal.");
        } catch (error) {
            console.error("Gagal mereset profil:", error);
            showToast("Profil gagal direset.");
        }
    });

    const currentDate = document.getElementById("profileCurrentDate");

    if (currentDate) {
        currentDate.textContent = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date());
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

    updateProfileDisplay(loadProfile());
    refreshIcons();
});
