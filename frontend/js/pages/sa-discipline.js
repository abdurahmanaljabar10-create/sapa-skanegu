
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "sapa_kesiswaan_discipline_v1";

    const initialRecords = [
        {
            id: "KD-001",
            name: "Andi Pratama",
            className: "XI TKJ 1",
            category: "Keterlambatan",
            level: "Ringan",
            date: "2026-11-13",
            status: "Perlu Pembinaan",
            description: "Datang terlambat pada saat kegiatan pembelajaran dimulai.",
            action: "",
            createdAt: "2026-11-13T07:30:00"
        },
        {
            id: "KD-002",
            name: "Siti Rahma",
            className: "X RPL 2",
            category: "Seragam",
            level: "Ringan",
            date: "2026-11-12",
            status: "Selesai",
            description: "Menggunakan atribut seragam yang belum sesuai ketentuan sekolah.",
            action: "Diberikan arahan mengenai kelengkapan atribut seragam.",
            createdAt: "2026-11-12T08:00:00"
        },
        {
            id: "KD-003",
            name: "Budi Santoso",
            className: "XII TKJ 1",
            category: "Kehadiran",
            level: "Sedang",
            date: "2026-11-11",
            status: "Dalam Tindak Lanjut",
            description: "Terdapat ketidakhadiran tanpa keterangan yang perlu diklarifikasi.",
            action: "Koordinasi dengan wali kelas untuk klarifikasi.",
            createdAt: "2026-11-11T09:00:00"
        },
        {
            id: "KD-004",
            name: "Dina Amelia",
            className: "XI RPL 1",
            category: "Tata Tertib",
            level: "Sedang",
            date: "2026-11-10",
            status: "Perlu Pembinaan",
            description: "Melakukan tindakan yang tidak sesuai dengan peraturan sekolah.",
            action: "",
            createdAt: "2026-11-10T10:00:00"
        },
        {
            id: "KD-005",
            name: "Rizky Firmansyah",
            className: "X TKJ 2",
            category: "Perilaku",
            level: "Berat",
            date: "2026-11-09",
            status: "Dalam Tindak Lanjut",
            description: "Terdapat laporan perilaku yang memerlukan pemeriksaan lebih lanjut.",
            action: "Koordinasi dengan pihak terkait untuk menentukan langkah pembinaan.",
            createdAt: "2026-11-09T11:00:00"
        }
    ];

    const elements = {
        search: document.getElementById("disciplineSearch"),
        categoryFilter: document.getElementById("disciplineCategoryFilter"),
        levelFilter: document.getElementById("disciplineLevelFilter"),
        statusFilter: document.getElementById("disciplineStatusFilter"),
        tabs: document.querySelectorAll(".sa-discipline-tab"),
        table: document.getElementById("disciplineTableBody"),
        mobile: document.getElementById("disciplineMobileList"),
        empty: document.getElementById("disciplineEmpty"),
        total: document.getElementById("disciplineTotal"),
        pending: document.getElementById("disciplinePending"),
        followup: document.getElementById("disciplineFollowup"),
        completed: document.getElementById("disciplineCompleted"),
        tabAll: document.getElementById("disciplineTabAll"),
        tabPending: document.getElementById("disciplineTabPending"),
        tabFollowup: document.getElementById("disciplineTabFollowup"),
        tabCompleted: document.getElementById("disciplineTabCompleted"),
        result: document.getElementById("disciplineResultCount"),
        reset: document.getElementById("resetDisciplineFilters"),
        resetTop: document.getElementById("resetDisciplineFiltersTop"),
        openForm: document.getElementById("openDisciplineForm"),
        modal: document.getElementById("disciplineModal"),
        closeModal: document.getElementById("closeDisciplineModal"),
        cancel: document.getElementById("cancelDisciplineForm"),
        form: document.getElementById("disciplineForm"),
        modalTitle: document.getElementById("disciplineModalTitle"),
        modalSubtitle: document.getElementById("disciplineModalSubtitle"),
        recordId: document.getElementById("disciplineRecordId"),
        studentName: document.getElementById("disciplineStudentName"),
        studentClass: document.getElementById("disciplineStudentClass"),
        category: document.getElementById("disciplineCategory"),
        level: document.getElementById("disciplineLevel"),
        date: document.getElementById("disciplineDate"),
        status: document.getElementById("disciplineStatus"),
        description: document.getElementById("disciplineDescription"),
        action: document.getElementById("disciplineAction")
    };

    let records = loadRecords();
    let activeTab = "all";

    function loadRecords() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved) {
                const parsed = JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch (error) {
            console.error("Gagal membaca catatan kedisiplinan:", error);
        }

        return JSON.parse(JSON.stringify(initialRecords));
    }

    function saveRecords() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
            return true;
        } catch (error) {
            console.error("Gagal menyimpan catatan kedisiplinan:", error);
            showMessage("Data tidak dapat disimpan di browser.");
            return false;
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

    function refreshIcons() {
        if (window.SapaStudentAffairs?.refreshIcons) {
            window.SapaStudentAffairs.refreshIcons();
        } else if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function formatDate(value) {
        const date = new Date(`${value}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return "Tanggal tidak tersedia";
        }

        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(date);
    }

    function getLocalDate() {
        const date = new Date();
        const offset = date.getTimezoneOffset() * 60000;

        return new Date(date.getTime() - offset).toISOString().slice(0, 10);
    }

    function getInitials(name) {
        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(part => part.charAt(0))
            .join("")
            .toUpperCase();
    }

    function getLevelClass(level) {
        if (level === "Berat") return "heavy";
        if (level === "Sedang") return "medium";
        return "light";
    }

    function getStatusClass(status) {
        if (status === "Perlu Pembinaan") return "pending";
        if (status === "Dalam Tindak Lanjut") return "followup";
        return "completed";
    }

    function getVisibleRecords() {
        const query = elements.search.value.trim().toLowerCase();
        const category = elements.categoryFilter.value;
        const level = elements.levelFilter.value;
        const status = elements.statusFilter.value;

        return records
            .filter(record => {
                if (activeTab === "pending" && record.status !== "Perlu Pembinaan") {
                    return false;
                }

                if (activeTab === "followup" && record.status !== "Dalam Tindak Lanjut") {
                    return false;
                }

                if (activeTab === "completed" && record.status !== "Selesai") {
                    return false;
                }

                if (category !== "all" && record.category !== category) {
                    return false;
                }

                if (level !== "all" && record.level !== level) {
                    return false;
                }

                if (status !== "all" && record.status !== status) {
                    return false;
                }

                const searchable = `${record.id} ${record.name} ${record.className} ${record.category}`.toLowerCase();

                return searchable.includes(query);
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    function renderStatistics() {
        const total = records.length;
        const pending = records.filter(record => record.status === "Perlu Pembinaan").length;
        const followup = records.filter(record => record.status === "Dalam Tindak Lanjut").length;
        const completed = records.filter(record => record.status === "Selesai").length;

        elements.total.textContent = total;
        elements.pending.textContent = pending;
        elements.followup.textContent = followup;
        elements.completed.textContent = completed;

        elements.tabAll.textContent = total;
        elements.tabPending.textContent = pending;
        elements.tabFollowup.textContent = followup;
        elements.tabCompleted.textContent = completed;
    }

    function renderTableRow(record) {
        return `
            <tr>
                <td>
                    <div class="sa-discipline-student">
                        <span class="sa-discipline-student-avatar">${getInitials(escapeHTML(record.name))}</span>
                        <div class="sa-discipline-student-info">
                            <strong>${escapeHTML(record.name)}</strong>
                            <span>${escapeHTML(record.className)} · ${escapeHTML(record.id)}</span>
                        </div>
                    </div>
                </td>
                <td>${escapeHTML(record.category)}</td>
                <td>${formatDate(record.date)}</td>
                <td><span class="sa-discipline-level ${getLevelClass(record.level)}">${escapeHTML(record.level)}</span></td>
                <td><span class="sa-discipline-state ${getStatusClass(record.status)}">${escapeHTML(record.status)}</span></td>
                <td>
                    <button class="sa-table-action" data-edit-record="${escapeHTML(record.id)}">
                        Detail <i data-lucide="arrow-up-right"></i>
                    </button>
                </td>
            </tr>
        `;
    }

    function renderMobileCard(record) {
        return `
            <article class="sa-discipline-mobile-card">
                <div class="sa-discipline-mobile-top">
                    <div class="sa-discipline-student">
                        <span class="sa-discipline-student-avatar">${getInitials(escapeHTML(record.name))}</span>
                        <div class="sa-discipline-student-info">
                            <strong>${escapeHTML(record.name)}</strong>
                            <span>${escapeHTML(record.className)} · ${escapeHTML(record.id)}</span>
                        </div>
                    </div>
                    <span class="sa-discipline-level ${getLevelClass(record.level)}">${escapeHTML(record.level)}</span>
                </div>
                <p>${escapeHTML(record.category)} · ${formatDate(record.date)}</p>
                <div class="sa-discipline-mobile-bottom">
                    <span class="sa-discipline-state ${getStatusClass(record.status)}">${escapeHTML(record.status)}</span>
                    <button class="sa-button" data-edit-record="${escapeHTML(record.id)}">Lihat detail <i data-lucide="arrow-right"></i></button>
                </div>
            </article>
        `;
    }

    function renderRecords() {
        const visibleRecords = getVisibleRecords();

        elements.table.innerHTML = visibleRecords.map(renderTableRow).join("");
        elements.mobile.innerHTML = visibleRecords.map(renderMobileCard).join("");

        const hasResults = visibleRecords.length > 0;

        elements.empty.hidden = hasResults;
        elements.table.closest(".sa-discipline-table-wrap").hidden = !hasResults || window.innerWidth <= 700;
        elements.mobile.hidden = !hasResults || window.innerWidth > 700;

        elements.result.textContent = `${visibleRecords.length} dari ${records.length} catatan ditampilkan`;

        elements.tabs.forEach(tab => {
            const selected = tab.dataset.disciplineFilter === activeTab;

            tab.classList.toggle("active", selected);
            tab.setAttribute("aria-pressed", String(selected));
        });

        renderStatistics();
        refreshIcons();
    }

    function openForm(recordId = null) {
        elements.form.reset();
        elements.recordId.value = "";
        elements.date.value = getLocalDate();
        elements.status.value = "Perlu Pembinaan";

        if (recordId) {
            const record = records.find(item => item.id === recordId);

            if (!record) {
                showMessage("Catatan tidak ditemukan.");
                return;
            }

            elements.modalTitle.textContent = "Detail Kedisiplinan";
            elements.modalSubtitle.textContent = "Perbarui informasi dan tindak lanjut pembinaan.";
            elements.recordId.value = record.id;
            elements.studentName.value = record.name;
            elements.studentClass.value = record.className;
            elements.category.value = record.category;
            elements.level.value = record.level;
            elements.date.value = record.date;
            elements.status.value = record.status;
            elements.description.value = record.description;
            elements.action.value = record.action || "";
        } else {
            elements.modalTitle.textContent = "Catat Pelanggaran";
            elements.modalSubtitle.textContent = "Isi informasi berdasarkan kejadian yang teramati.";
        }

        elements.modal.hidden = false;
        document.body.style.overflow = "hidden";
        refreshIcons();
        elements.studentName.focus();
    }

    function closeForm() {
        elements.modal.hidden = true;
        document.body.style.overflow = "";
        elements.form.reset();
    }

    function generateRecordId() {
        const numbers = records
            .map(record => Number(record.id.replace("KD-", "")))
            .filter(Number.isFinite);

        const next = Math.max(0, ...numbers) + 1;

        return `KD-${String(next).padStart(3, "0")}`;
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!elements.form.reportValidity()) {
            return;
        }

        const id = elements.recordId.value;
        const existing = id ? records.find(record => record.id === id) : null;

        const recordData = {
            id: id || generateRecordId(),
            name: elements.studentName.value.trim(),
            className: elements.studentClass.value.trim(),
            category: elements.category.value,
            level: elements.level.value,
            date: elements.date.value,
            status: elements.status.value,
            description: elements.description.value.trim(),
            action: elements.action.value.trim(),
            createdAt: existing?.createdAt || new Date().toISOString()
        };

        if (!recordData.name || !recordData.className || !recordData.description) {
            showMessage("Lengkapi seluruh informasi wajib.");
            return;
        }

        if (existing) {
            records = records.map(record =>
                record.id === id ? recordData : record
            );
        } else {
            records.push(recordData);
        }

        if (!saveRecords()) return;

        closeForm();
        renderRecords();

        showMessage(existing
            ? "Catatan kedisiplinan berhasil diperbarui."
            : "Catatan kedisiplinan berhasil ditambahkan."
        );
    }

    function setTab(tab) {
        activeTab = tab;
        renderRecords();
    }

    function resetFilters() {
        elements.search.value = "";
        elements.categoryFilter.value = "all";
        elements.levelFilter.value = "all";
        elements.statusFilter.value = "all";
        setTab("all");
        showMessage("Filter berhasil direset.");
    }

    elements.search.addEventListener("input", renderRecords);
    elements.categoryFilter.addEventListener("change", renderRecords);
    elements.levelFilter.addEventListener("change", renderRecords);
    elements.statusFilter.addEventListener("change", renderRecords);

    elements.tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            setTab(tab.dataset.disciplineFilter);
        });
    });

    elements.table.addEventListener("click", event => {
        const button = event.target.closest("[data-edit-record]");

        if (button) {
            openForm(button.dataset.editRecord);
        }
    });

    elements.mobile.addEventListener("click", event => {
        const button = event.target.closest("[data-edit-record]");

        if (button) {
            openForm(button.dataset.editRecord);
        }
    });

    elements.openForm.addEventListener("click", () => openForm());
    elements.closeModal.addEventListener("click", closeForm);
    elements.cancel.addEventListener("click", closeForm);
    elements.form.addEventListener("submit", handleSubmit);

    elements.modal.addEventListener("click", event => {
        if (event.target === elements.modal) {
            closeForm();
        }
    });

    elements.reset.addEventListener("click", resetFilters);
    elements.resetTop.addEventListener("click", resetFilters);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !elements.modal.hidden) {
            closeForm();
        }
    });

    window.addEventListener("resize", renderRecords);

    renderRecords();
});
