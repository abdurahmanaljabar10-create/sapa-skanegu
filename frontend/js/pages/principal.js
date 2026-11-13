
document.addEventListener("DOMContentLoaded", () => {
    const NOTES_KEY = "sapa_principal_evaluation_v1";
    const TAKEOVER_KEY = "sapa_principal_takeover_v1";

    const toast = document.getElementById("principalToast");
    const searchInput = document.getElementById("principalSearch");
    const typeFilter = document.getElementById("principalTypeFilter");
    const tableBody = document.getElementById("principalReportTable");
    const emptyState = document.getElementById("principalTableEmpty");
    const tableCount = document.getElementById("principalTableCount");
    const modal = document.getElementById("principalReportModal");
    const modalBody = document.getElementById("principalModalBody");
    const modalTitle = document.getElementById("principalModalTitle");
    const evaluationForm = document.getElementById("principalEvaluationForm");
    const evaluationInput = document.getElementById("principalEvaluation");
    const evaluationCount = document.getElementById("principalEvaluationCount");
    const savedNotes = document.getElementById("principalSavedNotes");

    let toastTimer;
    let activeReportId = null;

    const reportDetails = {
        "ASP-001": {
            type: "Aspirasi",
            summary: "Usulan peningkatan fasilitas sekolah",
            date: "12 November 2026",
            status: "Diproses",
            access: "Ringkasan aspirasi dapat dipantau oleh Kepala Sekolah untuk kebutuhan evaluasi."
        },
        "ADU-014": {
            type: "Pengaduan",
            summary: "Fasilitas kelas membutuhkan perbaikan",
            date: "11 November 2026",
            status: "Diverifikasi",
            access: "Ringkasan pengaduan dapat dipantau untuk memastikan tindak lanjut berjalan."
        },
        "PRD-006": {
            type: "Perundungan",
            summary: "Laporan membutuhkan pemantauan khusus",
            date: "10 November 2026",
            status: "Dalam Penanganan",
            access: "Informasi kasus hanya ditampilkan sesuai kewenangan Kepala Sekolah. Catatan konseling dan informasi terbatas tidak ditampilkan pada dashboard ini."
        },
        "ASP-002": {
            type: "Aspirasi",
            summary: "Usulan kegiatan penguatan karakter",
            date: "9 November 2026",
            status: "Selesai",
            access: "Ringkasan aspirasi dapat dipantau untuk kebutuhan evaluasi."
        }
    };

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

    function formatDate(date) {
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }).format(date);
    }

    function filterReports() {
        const keyword = (searchInput?.value || "").trim().toLowerCase();
        const selectedType = typeFilter?.value || "all";
        const rows = [...tableBody.querySelectorAll("tr")];
        let visibleCount = 0;

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const type = row.dataset.type;
            const matchesKeyword = text.includes(keyword);
            const matchesType = selectedType === "all" || type === selectedType;
            const visible = matchesKeyword && matchesType;

            row.hidden = !visible;

            if (visible) visibleCount += 1;
        });

        emptyState.hidden = visibleCount !== 0;
        tableCount.textContent = `Menampilkan ${visibleCount} dari ${rows.length} contoh laporan`;
    }

    function createModalDetail(label, value) {
        const wrapper = document.createElement("div");
        const title = document.createElement("span");
        const content = document.createElement("strong");

        wrapper.className = "principal-modal-detail";
        title.textContent = label;
        content.textContent = value;

        wrapper.append(title, content);

        return wrapper;
    }

    function openReportModal(reportId) {
        const report = reportDetails[reportId];

        if (!report) {
            showToast("Detail laporan tidak tersedia.");
            return;
        }

        activeReportId = reportId;
        modalTitle.textContent = `Laporan ${reportId}`;
        modalBody.replaceChildren(
            createModalDetail("Nomor Laporan", reportId),
            createModalDetail("Jenis Laporan", report.type),
            createModalDetail("Ringkasan", report.summary),
            createModalDetail("Tanggal", report.date),
            createModalDetail("Status", report.status),
            createModalDetail("Batas Informasi", report.access)
        );

        const warning = document.createElement("div");
        warning.className = "principal-modal-warning";
        warning.textContent = "Data ini merupakan contoh tampilan frontend, bukan data laporan sebenarnya. Pengambilalihan pada halaman ini hanya dicatat secara lokal dan belum mengubah penugasan backend.";
        modalBody.append(warning);

        modal.hidden = false;
        document.body.style.overflow = "hidden";

        refreshIcons();
    }

    function closeReportModal() {
        modal.hidden = true;
        document.body.style.overflow = "";
        activeReportId = null;
    }

    function loadNotes() {
        try {
            const stored = localStorage.getItem(NOTES_KEY);
            const parsed = stored ? JSON.parse(stored) : [];

            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("Gagal membaca catatan evaluasi:", error);
            return [];
        }
    }

    function saveNotes(notes) {
        try {
            localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
            renderNotes();
            return true;
        } catch (error) {
            console.error("Gagal menyimpan catatan evaluasi:", error);
            showToast("Catatan gagal disimpan di browser.");
            return false;
        }
    }

    function renderNotes() {
        const notes = loadNotes();
        savedNotes.replaceChildren();

        if (!notes.length) {
            const empty = document.createElement("div");
            const icon = document.createElement("i");
            const text = document.createElement("span");

            empty.className = "principal-no-notes";
            icon.setAttribute("data-lucide", "notebook-text");
            text.textContent = "Belum ada catatan evaluasi yang disimpan.";

            empty.append(icon, text);
            savedNotes.append(empty);

            refreshIcons();
            return;
        }

        notes.slice().reverse().forEach(note => {
            const item = document.createElement("article");
            const content = document.createElement("div");
            const paragraph = document.createElement("p");
            const date = document.createElement("time");
            const removeButton = document.createElement("button");
            const removeIcon = document.createElement("i");

            item.className = "principal-note-item";
            paragraph.textContent = note.text;
            date.textContent = note.date;
            removeButton.className = "principal-note-delete";
            removeButton.type = "button";
            removeButton.setAttribute("aria-label", "Hapus catatan");
            removeIcon.setAttribute("data-lucide", "trash-2");

            removeButton.append(removeIcon);
            content.append(paragraph, date);
            item.append(content, removeButton);
            savedNotes.append(item);

            removeButton.addEventListener("click", () => {
                const confirmed = window.confirm("Hapus catatan evaluasi ini?");

                if (!confirmed) return;

                const updated = loadNotes().filter(entry => entry.id !== note.id);

                if (saveNotes(updated)) {
                    showToast("Catatan evaluasi dihapus.");
                }
            });
        });

        refreshIcons();
    }

    function updateEvaluationCount() {
        evaluationCount.textContent = `${evaluationInput.value.length}/1000 karakter`;
    }

    function saveTakeover(reportId) {
        try {
            const stored = localStorage.getItem(TAKEOVER_KEY);
            const records = stored ? JSON.parse(stored) : [];
            const list = Array.isArray(records) ? records : [];

            list.push({
                reportId,
                date: new Date().toISOString(),
                role: "Kepala Sekolah",
                note: "Permintaan pengambilalihan dicatat untuk simulasi frontend."
            });

            localStorage.setItem(TAKEOVER_KEY, JSON.stringify(list));

            return true;
        } catch (error) {
            console.error("Gagal mencatat pengambilalihan:", error);
            return false;
        }
    }

    searchInput?.addEventListener("input", filterReports);
    typeFilter?.addEventListener("change", filterReports);

    tableBody?.addEventListener("click", event => {
        const button = event.target.closest("[data-report]");

        if (!button) return;

        openReportModal(button.dataset.report);
    });

    modal?.querySelectorAll("[data-modal-close]").forEach(button => {
        button.addEventListener("click", closeReportModal);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && modal && !modal.hidden) {
            closeReportModal();
        }
    });

    document.getElementById("principalTakeOverButton")?.addEventListener("click", () => {
        if (!activeReportId) return;

        const confirmed = window.confirm(
            `Catat permintaan pengambilalihan laporan ${activeReportId}?`
        );

        if (!confirmed) return;

        if (saveTakeover(activeReportId)) {
            closeReportModal();
            showToast("Catatan pengambilalihan tersimpan secara lokal. Penugasan backend belum berubah.");
        } else {
            showToast("Catatan pengambilalihan gagal disimpan.");
        }
    });

    evaluationInput?.addEventListener("input", updateEvaluationCount);

    evaluationForm?.addEventListener("submit", event => {
        event.preventDefault();

        const text = evaluationInput.value.trim();

        if (!text) {
            showToast("Isi catatan evaluasi terlebih dahulu.");
            evaluationInput.focus();
            return;
        }

        const notes = loadNotes();

        notes.push({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            text,
            date: formatDate(new Date())
        });

        if (saveNotes(notes)) {
            evaluationInput.value = "";
            updateEvaluationCount();
            showToast("Catatan evaluasi berhasil disimpan di browser.");
        }
    });

    document.getElementById("principalNotificationButton")?.addEventListener("click", () => {
        showToast("Halaman notifikasi Kepala Sekolah belum dibuat.");
    });

    const currentDate = document.getElementById("principalCurrentDate");

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
        link.addEventListener("click", event => {
            const href = link.getAttribute("href");

            if (href?.startsWith("#")) {
                const target = document.querySelector(href);

                if (target) {
                    event.preventDefault();
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                    document.querySelectorAll(".sidebar-link").forEach(item => {
                        item.classList.remove("active");
                    });

                    link.classList.add("active");
                }
            }

            closeSidebar();
        });
    });

    filterReports();
    updateEvaluationCount();
    renderNotes();
    refreshIcons();
});
