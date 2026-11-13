
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const getElement = (id) => document.getElementById(id);

    const list = getElement("notificationList");
    const search = getElement("notificationSearch");
    const sort = getElement("notificationSort");
    const emptyState = getElement("notificationEmpty");
    const filters = document.querySelectorAll(".notification-filter");

    const totalCount = getElement("totalCount");
    const unreadCount = getElement("unreadCount");
    const readCount = getElement("readCount");
    const filterAllCount = getElement("filterAllCount");
    const filterUnreadCount = getElement("filterUnreadCount");
    const visibleCount = getElement("visibleNotificationCount");
    const listLabel = getElement("notificationListLabel");
    const sidebarCount = getElement("sidebarUnreadCount");

    const markAllButton = getElement("markAllRead");
    const clearReadButton = getElement("clearReadNotifications");
    const resetButton = getElement("resetNotificationFilter");

    const toast = getElement("notificationToast");
    const toastMessage = getElement("notificationToastMessage");

    const confirmModal = getElement("notificationConfirm");
    const confirmTitle = getElement("confirmTitle");
    const confirmMessage = getElement("confirmMessage");
    const cancelDelete = getElement("cancelDelete");
    const confirmDelete = getElement("confirmDelete");

    const storageKey = "sapa-skanegu-notifications-v2";

    if (!list || !search || !sort || !emptyState || !confirmModal) {
        console.error("Elemen utama halaman notifikasi tidak ditemukan.");
        return;
    }

    const initialNotifications = [
        {
            id: "notif-001",
            category: "report",
            categoryLabel: "Laporan",
            icon: "file-check",
            title: "Informasi perkembangan laporan",
            description: "Laporan yang kamu kirim telah masuk ke sistem dan menunggu proses pemeriksaan.",
            date: "2026-11-11T14:30:00",
            time: "11 November 2026, 14.30",
            link: "../student/history.html",
            linkText: "Lihat riwayat",
            read: false
        },
        {
            id: "notif-002",
            category: "announcement",
            categoryLabel: "Pengumuman",
            icon: "megaphone",
            title: "Pengingat lingkungan sekolah aman",
            description: "Mari bersama menjaga lingkungan sekolah yang nyaman, saling menghargai, dan bebas perundungan.",
            date: "2026-11-11T09:00:00",
            time: "11 November 2026, 09.00",
            link: "education.html",
            linkText: "Baca edukasi",
            read: false
        },
        {
            id: "notif-003",
            category: "aspiration",
            categoryLabel: "Aspirasi",
            icon: "lightbulb",
            title: "Informasi layanan aspirasi siswa",
            description: "Kamu dapat menyampaikan ide dan masukan untuk membantu menciptakan lingkungan sekolah yang lebih baik.",
            date: "2026-11-10T15:20:00",
            time: "10 November 2026, 15.20",
            link: "../student/aspirations.html",
            linkText: "Buka aspirasi",
            read: false
        },
        {
            id: "notif-004",
            category: "system",
            categoryLabel: "Sistem",
            icon: "shield-check",
            title: "Jaga keamanan informasi pribadi",
            description: "Jangan membagikan kata sandi, informasi pribadi, atau detail laporan kepada pihak yang tidak berkepentingan.",
            date: "2026-11-10T10:00:00",
            time: "10 November 2026, 10.00",
            link: "privacy-policy.html",
            linkText: "Pelajari privasi",
            read: false
        },
        {
            id: "notif-005",
            category: "announcement",
            categoryLabel: "Pengumuman",
            icon: "calendar-days",
            title: "Informasi layanan pengaduan siswa",
            description: "Kenali layanan pengaduan dan gunakan saluran yang sesuai dengan kebutuhanmu.",
            date: "2026-11-09T08:00:00",
            time: "9 November 2026, 08.00",
            link: "../student/complaints.html",
            linkText: "Buka pengaduan",
            read: true
        },
        {
            id: "notif-006",
            category: "system",
            categoryLabel: "Sistem",
            icon: "user-round-check",
            title: "Selamat datang di SAPA-SKANEGU",
            description: "Gunakan platform ini untuk menyampaikan aspirasi dan mendapatkan informasi layanan sekolah.",
            date: "2026-11-08T12:00:00",
            time: "8 November 2026, 12.00",
            link: "../student/dashboard.html",
            linkText: "Buka dashboard",
            read: true
        }
    ];

    let notifications = [];
    let activeFilter = "all";
    let pendingAction = null;
    let toastTimeout = null;
    let previousFocus = null;

    const iconNames = {
        report: "file-check",
        announcement: "megaphone",
        aspiration: "lightbulb",
        system: "shield-check"
    };

    const filterNames = {
        all: "Semua notifikasi",
        unread: "Notifikasi belum dibaca",
        report: "Notifikasi laporan",
        aspiration: "Notifikasi aspirasi",
        announcement: "Notifikasi pengumuman",
        system: "Notifikasi sistem"
    };

    const refreshIcons = () => {
        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    };

    const loadNotifications = () => {
        try {
            const saved = localStorage.getItem(storageKey);

            if (!saved) {
                return initialNotifications.map((item) => ({ ...item }));
            }

            const parsed = JSON.parse(saved);

            if (!Array.isArray(parsed)) {
                return initialNotifications.map((item) => ({ ...item }));
            }

            return parsed.filter((item) => {
                return (
                    item &&
                    typeof item.id === "string" &&
                    typeof item.title === "string" &&
                    typeof item.description === "string" &&
                    typeof item.category === "string" &&
                    typeof item.read === "boolean" &&
                    typeof item.date === "string"
                );
            });
        } catch (error) {
            console.error("Gagal membaca notifikasi:", error);
            return initialNotifications.map((item) => ({ ...item }));
        }
    };

    const saveNotifications = () => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(notifications));
            return true;
        } catch (error) {
            console.error("Gagal menyimpan notifikasi:", error);
            showToast("Perubahan tidak dapat disimpan di browser.");
            return false;
        }
    };

    const showToast = (message) => {
        if (!toast || !toastMessage) {
            return;
        }

        toastMessage.textContent = message;
        toast.classList.add("show");

        window.clearTimeout(toastTimeout);

        toastTimeout = window.setTimeout(() => {
            toast.classList.remove("show");
        }, 2800);
    };

    const updateDate = () => {
        const dateElement = getElement("currentDate");

        if (!dateElement) {
            return;
        }

        dateElement.textContent = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date());
    };

    const updateUserInitials = () => {
        const nameElement = getElement("topbarUserName");
        const sidebarName = getElement("sidebarUserName");
        const topbarInitial = getElement("topbarUserInitial");
        const sidebarInitial = getElement("sidebarUserInitial");

        if (!nameElement) {
            return;
        }

        const name = nameElement.textContent.trim();
        const initial = name ? name.charAt(0).toUpperCase() : "S";

        if (topbarInitial) {
            topbarInitial.textContent = initial;
        }

        if (sidebarInitial) {
            sidebarInitial.textContent = initial;
        }

        if (sidebarName && name) {
            sidebarName.textContent = name;
        }
    };

    const updateSummary = () => {
        const total = notifications.length;
        const unread = notifications.filter((item) => !item.read).length;
        const read = total - unread;

        if (totalCount) totalCount.textContent = total;
        if (unreadCount) unreadCount.textContent = unread;
        if (readCount) readCount.textContent = read;

        if (filterAllCount) filterAllCount.textContent = total;
        if (filterUnreadCount) filterUnreadCount.textContent = unread;

        if (sidebarCount) {
            sidebarCount.textContent = unread;
            sidebarCount.hidden = unread === 0;
        }

        if (markAllButton) {
            markAllButton.disabled = unread === 0;
        }

        if (clearReadButton) {
            clearReadButton.disabled = read === 0;
        }
    };

    const getFilteredNotifications = () => {
        const query = search.value.trim().toLowerCase();

        const result = notifications.filter((item) => {
            const searchableText = [
                item.title,
                item.description,
                item.categoryLabel
            ].join(" ").toLowerCase();

            const matchesSearch = searchableText.includes(query);
            const matchesFilter =
                activeFilter === "all" ||
                (activeFilter === "unread" && !item.read) ||
                item.category === activeFilter;

            return matchesSearch && matchesFilter;
        });

        result.sort((a, b) => {
            const dateA = new Date(a.date).getTime() || 0;
            const dateB = new Date(b.date).getTime() || 0;

            return sort.value === "oldest"
                ? dateA - dateB
                : dateB - dateA;
        });

        return result;
    };

    const createNotificationElement = (item) => {
        const article = document.createElement("article");
        article.className = `notification-item${item.read ? "" : " unread"}`;
        article.dataset.id = item.id;

        const icon = document.createElement("div");
        icon.className = `notification-type-icon type-${item.category}`;

        const iconElement = document.createElement("i");
        iconElement.setAttribute("data-lucide", iconNames[item.category] || "bell");
        icon.appendChild(iconElement);

        const main = document.createElement("div");
        main.className = "notification-item-main";

        const top = document.createElement("div");
        top.className = "notification-item-top";

        const category = document.createElement("span");
        category.className = "notification-category";
        category.textContent = item.categoryLabel || "Informasi";

        top.appendChild(category);

        if (!item.read) {
            const dot = document.createElement("span");
            dot.className = "notification-unread-dot";
            dot.setAttribute("aria-label", "Belum dibaca");
            top.appendChild(dot);
        }

        const time = document.createElement("time");
        time.dateTime = item.date;
        time.textContent = item.time || "";
        top.appendChild(time);

        const title = document.createElement("h3");
        title.textContent = item.title;

        const description = document.createElement("p");
        description.textContent = item.description;

        const actions = document.createElement("div");
        actions.className = "notification-item-actions";

        const link = document.createElement("a");
        link.href = item.link || "notifications.html";
        link.textContent = item.linkText || "Lihat informasi";

        const linkIcon = document.createElement("i");
        linkIcon.setAttribute("data-lucide", "arrow-up-right");
        link.appendChild(linkIcon);

        const readButton = document.createElement("button");
        readButton.type = "button";
        readButton.dataset.action = "read";
        readButton.textContent = item.read ? "Sudah dibaca" : "Tandai dibaca";
        readButton.disabled = item.read;

        actions.append(link, readButton);
        main.append(top, title, description, actions);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "notification-delete";
        deleteButton.dataset.action = "delete";
        deleteButton.setAttribute("aria-label", `Hapus notifikasi ${item.title}`);

        const deleteIcon = document.createElement("i");
        deleteIcon.setAttribute("data-lucide", "trash-2");
        deleteButton.appendChild(deleteIcon);

        article.append(icon, main, deleteButton);

        return article;
    };

    const renderNotifications = () => {
        const filtered = getFilteredNotifications();

        list.replaceChildren();

        filtered.forEach((item) => {
            list.appendChild(createNotificationElement(item));
        });

        const hasItems = filtered.length > 0;

        list.hidden = !hasItems;
        emptyState.hidden = hasItems;

        if (visibleCount) {
            visibleCount.textContent = `${filtered.length} informasi`;
        }

        if (listLabel) {
            listLabel.textContent = filterNames[activeFilter] || filterNames.all;
        }

        updateSummary();
        refreshIcons();
    };

    const setFilter = (filter) => {
        activeFilter = filter;

        filters.forEach((button) => {
            const isActive = button.dataset.filter === filter;

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        renderNotifications();
    };

    const openConfirm = (title, message, action) => {
        if (!confirmModal || !confirmTitle || !confirmMessage) {
            return;
        }

        pendingAction = action;
        previousFocus = document.activeElement;

        confirmTitle.textContent = title;
        confirmMessage.textContent = message;

        confirmModal.classList.add("open");
        confirmModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("notification-modal-open");

        if (cancelDelete) {
            cancelDelete.focus();
        }
    };

    const closeConfirm = () => {
        confirmModal.classList.remove("open");
        confirmModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("notification-modal-open");

        pendingAction = null;

        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
    };

    const markAsRead = (id) => {
        const notification = notifications.find((item) => item.id === id);

        if (!notification || notification.read) {
            return;
        }

        notification.read = true;
        saveNotifications();
        renderNotifications();
        showToast("Notifikasi ditandai sudah dibaca.");
    };

    const markAllAsRead = () => {
        const unreadItems = notifications.filter((item) => !item.read);

        if (unreadItems.length === 0) {
            showToast("Semua notifikasi sudah dibaca.");
            return;
        }

        notifications.forEach((item) => {
            item.read = true;
        });

        saveNotifications();
        renderNotifications();
        showToast(`${unreadItems.length} notifikasi ditandai sudah dibaca.`);
    };

    const deleteNotification = (id) => {
        const target = notifications.find((item) => item.id === id);

        if (!target) {
            return;
        }

        notifications = notifications.filter((item) => item.id !== id);

        saveNotifications();
        renderNotifications();
        showToast("Notifikasi berhasil dihapus.");
    };

    const clearReadNotifications = () => {
        const readItems = notifications.filter((item) => item.read);

        if (readItems.length === 0) {
            showToast("Tidak ada notifikasi yang sudah dibaca.");
            return;
        }

        openConfirm(
            "Hapus notifikasi yang sudah dibaca?",
            `${readItems.length} notifikasi yang sudah dibaca akan dihapus dari daftar pada perangkat ini.`,
            () => {
                notifications = notifications.filter((item) => !item.read);
                saveNotifications();
                renderNotifications();
                showToast(`${readItems.length} notifikasi berhasil dihapus.`);
            }
        );
    };

    filters.forEach((button) => {
        button.addEventListener("click", () => {
            setFilter(button.dataset.filter);
        });
    });

    search.addEventListener("input", renderNotifications);
    sort.addEventListener("change", renderNotifications);

    if (markAllButton) {
        markAllButton.addEventListener("click", markAllAsRead);
    }

    if (clearReadButton) {
        clearReadButton.addEventListener("click", clearReadNotifications);
    }

    if (resetButton) {
        resetButton.addEventListener("click", () => {
            search.value = "";
            sort.value = "newest";
            setFilter("all");
        });
    }

    list.addEventListener("click", (event) => {
        const actionButton = event.target.closest("[data-action]");

        if (!actionButton) {
            return;
        }

        const article = actionButton.closest(".notification-item");

        if (!article) {
            return;
        }

        const id = article.dataset.id;
        const action = actionButton.dataset.action;

        if (action === "read") {
            markAsRead(id);
        }

        if (action === "delete") {
            const notification = notifications.find((item) => item.id === id);

            if (!notification) {
                return;
            }

            openConfirm(
                "Hapus notifikasi?",
                `Notifikasi "${notification.title}" akan dihapus dari daftar pada perangkat ini.`,
                () => deleteNotification(id)
            );
        }
    });

    if (cancelDelete) {
        cancelDelete.addEventListener("click", closeConfirm);
    }

    if (confirmDelete) {
        confirmDelete.addEventListener("click", () => {
            if (typeof pendingAction !== "function") {
                return;
            }

            const action = pendingAction;
            closeConfirm();
            action();
        });
    }

    confirmModal.addEventListener("click", (event) => {
        if (event.target === confirmModal) {
            closeConfirm();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && confirmModal.classList.contains("open")) {
            closeConfirm();
        }
    });

    window.addEventListener("storage", (event) => {
        if (event.key === storageKey) {
            notifications = loadNotifications();
            renderNotifications();
        }
    });

    notifications = loadNotifications();

    updateDate();
    updateUserInitials();
    renderNotifications();
    refreshIcons();
});
