
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "sapa_kesiswaan_cases_v1";

    const initialCases = [
        {
            id: "KS-024",
            category: "Bullying",
            date: "2026-11-13T08:30:00",
            status: "Diterima",
            priority: "Tinggi",
            companion: "Guru BK",
            collaborators: ["Tim Kesiswaan", "Guru BK"],
            assignedToKesiswaan: true,
            description: "Laporan dugaan perundungan antarsiswa yang memerlukan pemeriksaan dan koordinasi tindak lanjut.",
            notes: "",
            timeline: [
                {
                    title: "Laporan diterima",
                    date: "2026-11-13T08:30:00"
                }
            ]
        },
        {
            id: "KS-023",
            category: "Bullying",
            date: "2026-11-12T10:15:00",
            status: "Diverifikasi",
            priority: "Tinggi",
            companion: "Wali Kelas",
            collaborators: ["Tim Kesiswaan", "Wali Kelas"],
            assignedToKesiswaan: true,
            description: "Laporan sedang melalui tahap pemeriksaan awal dan klarifikasi informasi.",
            notes: "Koordinasi awal dengan wali kelas telah dilakukan.",
            timeline: [
                {
                    title: "Laporan diterima",
                    date: "2026-11-12T10:15:00"
                },
                {
                    title: "Laporan diverifikasi",
                    date: "2026-11-12T13:00:00"
                }
            ]
        },
        {
            id: "KS-022",
            category: "Pelanggaran Tata Tertib",
            date: "2026-11-11T09:00:00",
            status: "Diproses",
            priority: "Sedang",
            companion: "Kesiswaan",
            collaborators: ["Tim Kesiswaan"],
            assignedToKesiswaan: true,
            description: "Laporan pelanggaran tata tertib yang membutuhkan pemeriksaan dan pembinaan.",
            notes: "Pemeriksaan awal sedang dilakukan.",
            timeline: [
                {
                    title: "Laporan diterima",
                    date: "2026-11-11T09:00:00"
                },
                {
                    title: "Laporan diverifikasi",
                    date: "2026-11-11T11:00:00"
                },
                {
                    title: "Kasus mulai diproses",
                    date: "2026-11-12T08:30:00"
                }
            ]
        },
        {
            id: "KS-021",
            category: "Bullying",
            date: "2026-11-10T13:15:00",
            status: "Dalam Penanganan",
            priority: "Tinggi",
            companion: "Guru BK",
            collaborators: ["Tim Kesiswaan", "Guru BK", "Wali Kelas"],
            assignedToKesiswaan: true,
            description: "Kasus memerlukan koordinasi bersama petugas yang terlibat dalam penanganan.",
            notes: "Koordinasi dengan Guru BK dan wali kelas sedang berjalan.",
            timeline: [
                {
                    title: "Laporan diterima",
                    date: "2026-11-10T13:15:00"
                },
                {
                    title: "Kasus diverifikasi",
                    date: "2026-11-10T15:00:00"
                },
                {
                    title: "Kasus dalam penanganan",
                    date: "2026-11-11T09:00:00"
                }
            ]
        },
        {
            id: "KS-020",
            category: "Pelanggaran Tata Tertib",
            date: "2026-11-09T08:00:00",
            status: "Selesai",
            priority: "Rendah",
            companion: "Kesiswaan",
            collaborators: ["Tim Kesiswaan"],
            assignedToKesiswaan: true,
            description: "Penanganan pelanggaran tata tertib telah diselesaikan melalui pembinaan.",
            notes: "Pembinaan telah dilaksanakan.",
            timeline: [
                {
                    title: "Laporan diterima",
                    date: "2026-11-09T08:00:00"
                },
                {
                    title: "Penanganan selesai",
                    date: "2026-11-10T10:00:00"
                }
            ]
        },
        {
            id: "KS-019",
            category: "Bullying",
            date: "2026-11-07T10:00:00",
            status: "Ditolak",
            priority: "Rendah",
            companion: "Wali Kelas",
            collaborators: ["Tim Kesiswaan"],
            assignedToKesiswaan: true,
            description: "Laporan tidak dapat dilanjutkan setelah pemeriksaan awal karena informasi belum memenuhi kriteria laporan.",
            notes: "Alasan penolakan telah dicatat.",
            timeline: [
                {
                    title: "Laporan diterima",
                    date: "2026-11-07T10:00:00"
                },
                {
                    title: "Laporan ditolak",
                    date: "2026-11-07T14:00:00"
                }
            ]
        }
    ];

    const statusClasses = {
        "Diterima": "received",
        "Diverifikasi": "verified",
        "Diproses": "process",
        "Dalam Penanganan": "handling",
        "Selesai": "completed",
        "Ditolak": "rejected"
    };

    const elements = {
        search: document.getElementById("caseSearch"),
        status: document.getElementById("caseStatusFilter"),
        priority: document.getElementById("casePriorityFilter"),
        tabs: document.querySelectorAll(".sa-case-tab"),
        table: document.getElementById("caseTableBody"),
        mobile: document.getElementById("caseMobileList"),
        empty: document.getElementById("caseEmpty"),
        total: document.getElementById("caseTotal"),
        received: document.getElementById("caseReceived"),
        progress: document.getElementById("caseProgress"),
        completed: document.getElementById("caseCompleted"),
        tabAll: document.getElementById("caseTabAll"),
        tabActive: document.getElementById("caseTabActive"),
        tabCompleted: document.getElementById("caseTabCompleted"),
        result: document.getElementById("caseResultCount"),
        reset: document.getElementById("resetCaseFilters"),
        resetTop: document.getElementById("resetCaseFiltersTop"),
        modal: document.getElementById("caseModal"),
        closeModal: document.getElementById("closeCaseModal"),
        cancelEdit: document.getElementById("cancelCaseEdit"),
        save: document.getElementById("saveCaseUpdate"),
        statusSelect: document.getElementById("detailStatusSelect"),
        note: document.getElementById("detailNote"),
        code: document.getElementById("caseModalCode"),
        category: document.getElementById("detailCategory"),
        date: document.getElementById("detailDate"),
        priority: document.getElementById("detailPriority"),
        statusText: document.getElementById("detailStatus"),
        description: document.getElementById("detailDescription"),
        companion: document.getElementById("detailCompanion"),
        collaborators: document.getElementById("detailCollaborators"),
        timeline: document.getElementById("detailTimeline")
    };

    let cases = loadCases();
    let activeTab = "all";
    let selectedCaseId = null;

    function loadCases() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved) {
                const parsed = JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch (error) {
            console.error("Gagal membaca data kasus:", error);
        }

        return structuredClone(initialCases);
    }

    function saveCases() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
        } catch (error) {
            showMessage("Data tidak dapat disimpan di browser.");
            console.error("Gagal menyimpan data kasus:", error);
        }
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[character]);
    }

    function formatDate(value) {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "Tanggal tidak tersedia";
        }

        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(date);
    }

    function formatDateTime(value) {
        const date = new Date(value);

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

    function showMessage(message) {
        if (window.SapaStudentAffairs?.showToast) {
            window.SapaStudentAffairs.showToast(message);
            return;
        }

        const toast = document.getElementById("saToast");

        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        window.clearTimeout(showMessage.timer);

        showMessage.timer = window.setTimeout(() => {
            toast.classList.remove("show");
        }, 2600);
    }

    function getVisibleCases() {
        const query = elements.search.value.trim().toLowerCase();
        const status = elements.status.value;
        const priority = elements.priority.value;

        return cases
            .filter(item => item.assignedToKesiswaan)
            .filter(item => {
                if (activeTab === "active" && ["Selesai", "Ditolak"].includes(item.status)) {
                    return false;
                }

                if (activeTab === "completed" && item.status !== "Selesai") {
                    return false;
                }

                if (status !== "all" && item.status !== status) {
                    return false;
                }

                if (priority !== "all" && item.priority !== priority) {
                    return false;
                }

                const searchable = `${item.id} ${item.category} ${item.status}`.toLowerCase();

                return searchable.includes(query);
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    function renderStatistics() {
        const assignedCases = cases.filter(item => item.assignedToKesiswaan);
        const total = assignedCases.length;
        const received = assignedCases.filter(item => item.status === "Diterima").length;
        const progress = assignedCases.filter(item =>
            ["Diverifikasi", "Diproses", "Dalam Penanganan"].includes(item.status)
        ).length;
        const completed = assignedCases.filter(item => item.status === "Selesai").length;

        elements.total.textContent = total;
        elements.received.textContent = received;
        elements.progress.textContent = progress;
        elements.completed.textContent = completed;

        elements.tabAll.textContent = total;
        elements.tabActive.textContent = assignedCases.filter(item =>
            !["Selesai", "Ditolak"].includes(item.status)
        ).length;
        elements.tabCompleted.textContent = completed;
    }

    function getPriorityClass(priority) {
        if (priority === "Tinggi") return "high";
        if (priority === "Sedang") return "medium";
        return "low";
    }

    function getStatusMarkup(status) {
        const className = statusClasses[status] || "";

        return `<span class="sa-case-status ${className}">${escapeHTML(status)}</span>`;
    }

    function renderTableRow(item) {
        return `
            <tr>
                <td>
                    <div class="sa-case-code">
                        <strong>${escapeHTML(item.id)}</strong>
                        <span>${escapeHTML(item.category)}</span>
                    </div>
                </td>
                <td>${formatDate(item.date)}</td>
                <td>${getStatusMarkup(item.status)}</td>
                <td><span class="sa-case-priority ${getPriorityClass(item.priority)}">${escapeHTML(item.priority)}</span></td>
                <td><span class="sa-case-collaboration-count">${item.collaborators.length} petugas</span></td>
                <td>
                    <button class="sa-table-action" data-open-case="${escapeHTML(item.id)}">
                        Detail <i data-lucide="arrow-up-right"></i>
                    </button>
                </td>
            </tr>
        `;
    }

    function renderMobileCard(item) {
        return `
            <article class="sa-case-mobile-card">
                <div class="sa-case-mobile-top">
                    <div class="sa-case-code">
                        <strong>${escapeHTML(item.id)}</strong>
                        <span>${escapeHTML(item.category)}</span>
                    </div>
                    ${getStatusMarkup(item.status)}
                </div>
                <p>Tanggal laporan: ${formatDate(item.date)}</p>
                <div class="sa-case-mobile-bottom">
                    <span class="sa-case-priority ${getPriorityClass(item.priority)}">${escapeHTML(item.priority)}</span>
                    <button class="sa-button" data-open-case="${escapeHTML(item.id)}">Lihat detail <i data-lucide="arrow-right"></i></button>
                </div>
            </article>
        `;
    }

    function renderCases() {
        const visibleCases = getVisibleCases();

        elements.table.innerHTML = visibleCases.map(renderTableRow).join("");
        elements.mobile.innerHTML = visibleCases.map(renderMobileCard).join("");

        const hasResults = visibleCases.length > 0;

        elements.empty.hidden = hasResults;
        elements.table.closest(".sa-case-table-wrap").hidden = !hasResults || window.innerWidth <= 700;
        elements.mobile.hidden = !hasResults || window.innerWidth > 700;

        elements.result.textContent = `${visibleCases.length} dari ${cases.filter(item => item.assignedToKesiswaan).length} kasus ditampilkan`;

        elements.tabs.forEach(tab => {
            const selected = tab.dataset.caseFilter === activeTab;

            tab.classList.toggle("active", selected);
            tab.setAttribute("aria-pressed", String(selected));
        });

        renderStatistics();
        refreshIcons();
    }

    function refreshIcons() {
        if (window.SapaStudentAffairs?.refreshIcons) {
            window.SapaStudentAffairs.refreshIcons();
        } else if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function openCase(id) {
        const item = cases.find(entry => entry.id === id && entry.assignedToKesiswaan);

        if (!item) {
            showMessage("Kasus tidak tersedia untuk akun Kesiswaan ini.");
            return;
        }

        selectedCaseId = id;

        elements.code.textContent = item.id;
        elements.category.textContent = item.category;
        elements.date.textContent = formatDateTime(item.date);
        elements.priority.textContent = item.priority;
        elements.statusText.textContent = item.status;
        elements.description.textContent = item.description;
        elements.companion.textContent = item.companion;
        elements.statusSelect.value = item.status;
        elements.note.value = item.notes || "";

        elements.collaborators.innerHTML = item.collaborators.map(name =>
            `<span class="sa-case-collaborator">${escapeHTML(name)}</span>`
        ).join("");

        renderTimeline(item);

        elements.modal.hidden = false;
        document.body.style.overflow = "hidden";
        refreshIcons();

        elements.closeModal.focus();
    }

    function renderTimeline(item) {
        elements.timeline.innerHTML = (item.timeline || []).slice().reverse().map(entry => `
            <div class="sa-case-mini-timeline-item">
                <div>
                    <strong>${escapeHTML(entry.title)}</strong>
                    <span>${formatDateTime(entry.date)}</span>
                </div>
            </div>
        `).join("");
    }

    function closeCase() {
        elements.modal.hidden = true;
        selectedCaseId = null;
        document.body.style.overflow = "";
    }

    function saveCaseUpdate() {
        const item = cases.find(entry =>
            entry.id === selectedCaseId && entry.assignedToKesiswaan
        );

        if (!item) {
            showMessage("Kasus tidak ditemukan atau tidak dapat diakses.");
            closeCase();
            return;
        }

        const nextStatus = elements.statusSelect.value;
        const nextNote = elements.note.value.trim();

        if (!nextNote && nextStatus !== item.status) {
            showMessage("Tambahkan catatan tindak lanjut saat mengubah status.");
            elements.note.focus();
            return;
        }

        const now = new Date().toISOString();

        if (nextStatus !== item.status) {
            item.status = nextStatus;

            item.timeline.push({
                title: `Status diperbarui menjadi ${nextStatus}`,
                date: now
            });
        }

        if (nextNote && nextNote !== item.notes) {
            item.notes = nextNote;

            item.timeline.push({
                title: "Catatan tindak lanjut diperbarui",
                date: now
            });
        }

        saveCases();
        renderCases();
        closeCase();

        showMessage("Perubahan kasus berhasil disimpan pada browser ini.");
    }

    function setTab(tab) {
        activeTab = tab;
        renderCases();
    }

    function resetFilters() {
        elements.search.value = "";
        elements.status.value = "all";
        elements.priority.value = "all";
        setTab("all");
        showMessage("Filter berhasil direset.");
    }

    elements.search.addEventListener("input", renderCases);
    elements.status.addEventListener("change", renderCases);
    elements.priority.addEventListener("change", renderCases);

    elements.tabs.forEach(tab => {
        tab.addEventListener("click", () => setTab(tab.dataset.caseFilter));
    });

    elements.table.addEventListener("click", event => {
        const button = event.target.closest("[data-open-case]");

        if (button) openCase(button.dataset.openCase);
    });

    elements.mobile.addEventListener("click", event => {
        const button = event.target.closest("[data-open-case]");

        if (button) openCase(button.dataset.openCase);
    });

    elements.closeModal.addEventListener("click", closeCase);
    elements.cancelEdit.addEventListener("click", closeCase);
    elements.save.addEventListener("click", saveCaseUpdate);

    elements.modal.addEventListener("click", event => {
        if (event.target === elements.modal) closeCase();
    });

    elements.reset.addEventListener("click", resetFilters);
    elements.resetTop.addEventListener("click", resetFilters);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !elements.modal.hidden) {
            closeCase();
        }
    });

    window.addEventListener("resize", renderCases);

    renderCases();
});
