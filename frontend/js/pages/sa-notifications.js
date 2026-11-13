
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "sapa_kesiswaan_notifications_v1";

    const initialNotifications = [
        {
            id: 1,
            title: "Penugasan kasus baru",
            message: "Kasus KS-024 ditugaskan kepada Bidang Kesiswaan untuk ditindaklanjuti.",
            category: "assignment",
            date: "2026-11-13T08:30:00",
            read: false
        },
        {
            id: 2,
            title: "Pembaruan status kasus",
            message: "Status kasus KS-021 berubah menjadi Diproses.",
            category: "case",
            date: "2026-11-12T13:15:00",
            read: false
        },
        {
            id: 3,
            title: "Pengingat tindak lanjut",
            message: "Terdapat kasus yang membutuhkan pemeriksaan perkembangan.",
            category: "reminder",
            date: "2026-11-12T09:00:00",
            read: false
        },
        {
            id: 4,
            title: "Kolaborasi penanganan",
            message: "Anda dilibatkan dalam koordinasi penanganan kasus bersama petugas terkait.",
            category: "collaboration",
            date: "2026-11-11T14:20:00",
            read: false
        },
        {
            id: 5,
            title: "Penanganan kasus selesai",
            message: "Kasus KS-019 telah dinyatakan selesai setelah proses tindak lanjut.",
            category: "case",
            date: "2026-11-10T10:15:00",
            read: true
        },
        {
            id: 6,
            title: "Pengingat evaluasi",
            message: "Periksa kembali catatan perkembangan kasus yang sedang ditangani.",
            category: "reminder",
            date: "2026-11-08T08:00:00",
            read: true
        },
        {
            id: 7,
            title: "Pembaruan materi edukasi",
            message: "Terdapat pembaruan materi edukasi yang dapat digunakan untuk kegiatan pembinaan siswa.",
            category: "system",
            date: "2026-11-07T11:30:00",
            read: true
        },
        {
            id: 8,
            title: "Informasi sistem",
            message: "Selamat datang di panel Kesiswaan SAPA-SKANEGU.",
            category: "system",
            date: "2026-11-06T07:30:00",
            read: true
        }
    ];

    const categorySettings = {
        assignment: {
            label: "Penugasan",
            icon: "clipboard-check"
        },
        case: {
            label: "Kasus",
            icon: "shield-alert"
        },
        reminder: {
            label: "Pengingat",
            icon: "clock-3"
        },
        collaboration: {
            label: "Kolaborasi",
            icon: "users"
        },
        system: {
            label: "Sistem",
            icon: "info"
        }
    };

    const elements = {
        list: document.getElementById("notificationList"),
        empty: document.getElementById("notificationEmpty"),
        search: document.getElementById("notificationSearch"),
        category: document.getElementById("categoryFilter"),
        tabs: document.querySelectorAll(".sa-notification-tab"),
        total: document.getElementById("totalCount"),
        unread: document.getElementById("unreadCount"),
        read: document.getElementById("readCount"),
        tasks: document.getElementById("taskCount"),
        result: document.getElementById("resultSummary"),
        displayed: document.getElementById("displayedCount"),
        tabAll: document.getElementById("tabAllCount"),
        tabUnread: document.getElementById("tabUnreadCount"),
        tabRead: document.getElementById("tabReadCount"),
        markAll: document.getElementById("markAllRead"),
        clearRead: document.getElementById("clearReadNotifications"),
        refresh: document.getElementById("refreshNotifications"),
        reset: document.getElementById("resetNotificationFilter"),
        confirmOverlay: document.getElementById("confirmOverlay"),
        confirmTitle: document.getElementById("confirmTitle"),
        confirmMessage: document.getElementById("confirmMessage"),
        confirmAccept: document.getElementById("confirmAccept"),
        confirmCancel: document.getElementById("confirmCancel")
    };

    let activeFilter = "all";
    let pendingAction = null;
    let notifications = loadNotifications();

    function loadNotifications() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved) {
                const parsed = JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch (error) {
            console.error("Gagal membaca notifikasi:", error);
        }

        return [...initialNotifications];
    }

    function saveNotifications() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
        } catch (error) {
            notify("Data tidak dapat disimpan di browser.");
            console.error("Gagal menyimpan notifikasi:", error);
        }
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[character]);
    }

    function formatDate(dateValue) {
        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "Tanggal tidak tersedia";
        }

        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23"
        }).format(date);
    }

    function notify(message) {
        if (window.SapaStudentAffairs?.showToast) {
            window.SapaStudentAffairs.showToast(message);
            return;
        }

        const toast = document.getElementById("saToast");

        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        window.clearTimeout(notify.timer);

        notify.timer = window.setTimeout(() => {
            toast.classList.remove("show");
        }, 2600);
    }

    function getFilteredNotifications() {
        const searchValue = elements.search.value.trim().toLowerCase();
        const categoryValue = elements.category.value;

        return notifications
            .filter(item => {
                if (activeFilter === "unread" && item.read) return false;
                if (activeFilter === "read" && !item.read) return false;

                if (categoryValue !== "all" && item.category !== categoryValue) {
                    return false;
                }

                const searchableText = `${item.title} ${item.message}`.toLowerCase();

                return searchableText.includes(searchValue);
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    function renderStatistics() {
        const total = notifications.length;
        const unread = notifications.filter(item => !item.read).length;
        const read = total - unread;
        const tasks = notifications.filter(item => item.category === "assignment").length;

        elements.total.textContent = total;
        elements.unread.textContent = unread;
        elements.read.textContent = read;
        elements.tasks.textContent = tasks;

        elements.tabAll.textContent = total;
        elements.tabUnread.textContent = unread;
        elements.tabRead.textContent = read;

        elements.markAll.disabled = unread === 0;
        elements.markAll.style.opacity = unread === 0 ? ".5" : "1";
    }

    function renderNotifications() {
        const filtered = getFilteredNotifications();

        elements.list.innerHTML = filtered.map(item => {
            const category = categorySettings[item.category] || categorySettings.system;
            const readLabel = item.read ? "Sudah dibaca" : "Belum dibaca";
            const readAction = item.read ? "Tandai belum dibaca" : "Tandai sudah dibaca";
            const readIcon = item.read ? "mail" : "mail-open";

            return `
                <article class="sa-notification-item ${item.read ? "" : "unread"}" data-id="${item.id}">
                    <span class="sa-notification-item-icon ${escapeHTML(item.category)}">
                        <i data-lucide="${category.icon}"></i>
                    </span>

                    <div class="sa-notification-item-body">
                        <div class="sa-notification-item-title">
                            <strong>${escapeHTML(item.title)}</strong>
                            <span class="sa-badge">${category.label}</span>
                            ${item.read ? "" : '<span class="sa-notification-unread-dot" title="Belum dibaca"></span>'}
                        </div>

                        <p>${escapeHTML(item.message)}</p>

                        <div class="sa-notification-item-meta">
                            <span><i data-lucide="calendar-clock"></i>${formatDate(item.date)}</span>
                            <span>${readLabel}</span>
                        </div>
                    </div>

                    <div class="sa-notification-item-actions">
                        <button class="sa-notification-action" data-action="toggle-read" data-id="${item.id}" aria-label="${readAction}" title="${readAction}">
                            <i data-lucide="${readIcon}"></i>
                        </button>
                        <button class="sa-notification-action delete" data-action="delete" data-id="${item.id}" aria-label="Hapus notifikasi" title="Hapus notifikasi">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </article>
            `;
        }).join("");

        elements.empty.hidden = filtered.length !== 0;
        elements.list.hidden = filtered.length === 0;

        elements.result.textContent = `Menampilkan ${filtered.length} dari ${notifications.length} notifikasi`;
        elements.displayed.textContent = `${filtered.length} notifikasi ditampilkan`;

        if (window.SapaStudentAffairs?.refreshIcons) {
            window.SapaStudentAffairs.refreshIcons();
        }

        renderStatistics();
    }

    function setActiveFilter(filter) {
        activeFilter = filter;

        elements.tabs.forEach(tab => {
            const active = tab.dataset.filter === filter;

            tab.classList.toggle("active", active);
            tab.setAttribute("aria-pressed", String(active));
        });

        renderNotifications();
    }

    function showConfirmation(title, message, action, buttonLabel) {
        pendingAction = action;

        elements.confirmTitle.textContent = title;
        elements.confirmMessage.textContent = message;
        elements.confirmAccept.textContent = buttonLabel;
        elements.confirmOverlay.hidden = false;
        elements.confirmCancel.focus();
    }

    function closeConfirmation() {
        elements.confirmOverlay.hidden = true;
        pendingAction = null;
    }

    function toggleRead(id) {
        const item = notifications.find(notification => notification.id === id);

        if (!item) return;

        item.read = !item.read;
        saveNotifications();
        renderNotifications();

        notify(item.read ? "Notifikasi ditandai sudah dibaca." : "Notifikasi ditandai belum dibaca.");
    }

    function deleteNotification(id) {
        const exists = notifications.some(item => item.id === id);

        if (!exists) return;

        notifications = notifications.filter(item => item.id !== id);
        saveNotifications();
        renderNotifications();
        notify("Notifikasi berhasil dihapus.");
    }

    elements.search.addEventListener("input", renderNotifications);
    elements.category.addEventListener("change", renderNotifications);

    elements.tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            setActiveFilter(tab.dataset.filter);
        });
    });

    elements.list.addEventListener("click", event => {
        const button = event.target.closest("[data-action]");

        if (!button) return;

        const id = Number(button.dataset.id);
        const action = button.dataset.action;

        if (action === "toggle-read") {
            toggleRead(id);
        }

        if (action === "delete") {
            showConfirmation(
                "Hapus notifikasi?",
                "Notifikasi ini akan dihapus dari daftar pada browser ini.",
                () => deleteNotification(id),
                "Ya, hapus"
            );
        }
    });

    elements.markAll.addEventListener("click", () => {
        const unread = notifications.filter(item => !item.read);

        if (unread.length === 0) {
            notify("Semua notifikasi sudah dibaca.");
            return;
        }

        notifications = notifications.map(item => ({
            ...item,
            read: true
        }));

        saveNotifications();
        renderNotifications();
        notify("Semua notifikasi berhasil ditandai sudah dibaca.");
    });

    elements.clearRead.addEventListener("click", () => {
        const readCount = notifications.filter(item => item.read).length;

        if (readCount === 0) {
            notify("Tidak ada notifikasi yang sudah dibaca.");
            return;
        }

        showConfirmation(
            "Hapus notifikasi yang dibaca?",
            `${readCount} notifikasi yang sudah dibaca akan dihapus dari browser ini.`,
            () => {
                notifications = notifications.filter(item => !item.read);
                saveNotifications();
                renderNotifications();
                notify("Notifikasi yang sudah dibaca berhasil dihapus.");
            },
            "Ya, hapus"
        );
    });

    elements.refresh.addEventListener("click", () => {
        renderNotifications();
        notify("Tampilan notifikasi diperbarui.");
    });

    elements.reset.addEventListener("click", () => {
        elements.search.value = "";
        elements.category.value = "all";
        setActiveFilter("all");
        notify("Filter berhasil direset.");
    });

    elements.confirmAccept.addEventListener("click", () => {
        const action = pendingAction;

        closeConfirmation();

        if (typeof action === "function") {
            action();
        }
    });

    elements.confirmCancel.addEventListener("click", closeConfirmation);

    elements.confirmOverlay.addEventListener("click", event => {
        if (event.target === elements.confirmOverlay) {
            closeConfirmation();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !elements.confirmOverlay.hidden) {
            closeConfirmation();
        }
    });

    setActiveFilter("all");
});
