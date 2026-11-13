
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const CASES_KEY = "sapa_kesiswaan_cases_v1";
    const DISCIPLINE_KEY = "sapa_kesiswaan_discipline_v1";

    const elements = {
        search: document.getElementById("historySearch"),
        type: document.getElementById("historyTypeFilter"),
        period: document.getElementById("historyPeriodFilter"),
        tabs: document.querySelectorAll(".sa-history-tab"),
        list: document.getElementById("historyList"),
        empty: document.getElementById("historyEmpty"),
        total: document.getElementById("historyTotal"),
        cases: document.getElementById("historyCases"),
        discipline: document.getElementById("historyDiscipline"),
        completed: document.getElementById("historyCompleted"),
        tabAll: document.getElementById("historyTabAll"),
        tabCases: document.getElementById("historyTabCases"),
        tabDiscipline: document.getElementById("historyTabDiscipline"),
        result: document.getElementById("historyResultCount"),
        reset: document.getElementById("resetHistoryFilters"),
        resetTop: document.getElementById("resetHistoryFiltersTop"),
        refresh: document.getElementById("refreshHistory")
    };

    let activeTab = "all";
    let historyEntries = [];

    function readStorage(key) {
        try {
            const value = localStorage.getItem(key);

            if (!value) return [];

            const parsed = JSON.parse(value);

            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("Gagal membaca arsip:", error);
            return [];
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

    function addCaseHistory(caseRecords) {
        const entries = [];

        caseRecords
            .filter(record => record.assignedToKesiswaan)
            .forEach(record => {
                const timeline = Array.isArray(record.timeline) ? record.timeline : [];

                timeline.forEach((activity, index) => {
                    entries.push({
                        id: `CASE-${record.id}-${index}`,
                        type: "case",
                        code: record.id,
                        title: activity.title || "Aktivitas penanganan kasus",
                        description: `${record.category || "Kasus"} · Prioritas ${record.priority || "Tidak ditentukan"}`,
                        date: activity.date || record.date,
                        student: "",
                        status: record.status || ""
                    });
                });
            });

        return entries;
    }

    function addDisciplineHistory(records) {
        return records.map(record => ({
            id: `DISC-${record.id}`,
            type: "discipline",
            code: record.id,
            title: "Catatan kedisiplinan dibuat",
            description: `${record.category || "Kedisiplinan"} · Tingkat ${record.level || "Tidak ditentukan"} · Status ${record.status || "Belum ditentukan"}`,
            date: record.createdAt || `${record.date || ""}T00:00:00`,
            student: record.name || "",
            status: record.status || ""
        }));
    }

    function loadHistory() {
        const caseRecords = readStorage(CASES_KEY);
        const disciplineRecords = readStorage(DISCIPLINE_KEY);

        historyEntries = [
            ...addCaseHistory(caseRecords),
            ...addDisciplineHistory(disciplineRecords)
        ].filter(entry => {
            return entry.date && !Number.isNaN(new Date(entry.date).getTime());
        }).sort((a, b) => new Date(b.date) - new Date(a.date));

        renderHistory();
    }

    function getVisibleEntries() {
        const query = elements.search.value.trim().toLowerCase();
        const type = elements.type.value;
        const period = elements.period.value;

        const now = new Date();
        const cutoff = period === "all"
            ? null
            : new Date(now.getTime() - Number(period) * 24 * 60 * 60 * 1000);

        return historyEntries.filter(entry => {
            if (activeTab !== "all" && entry.type !== activeTab) {
                return false;
            }

            if (type !== "all" && entry.type !== type) {
                return false;
            }

            const entryDate = new Date(entry.date);

            if (cutoff && entryDate < cutoff) {
                return false;
            }

            const searchable = [
                entry.code,
                entry.title,
                entry.description,
                entry.student,
                entry.status
            ].join(" ").toLowerCase();

            return searchable.includes(query);
        });
    }

    function renderStatistics() {
        const caseEntries = historyEntries.filter(entry => entry.type === "case");
        const disciplineEntries = historyEntries.filter(entry => entry.type === "discipline");

        const completedCases = new Set(
            caseEntries
                .filter(entry => /selesai/i.test(entry.title))
                .map(entry => entry.code)
        );

        elements.total.textContent = historyEntries.length;
        elements.cases.textContent = caseEntries.length;
        elements.discipline.textContent = disciplineEntries.length;
        elements.completed.textContent = completedCases.size;

        elements.tabAll.textContent = historyEntries.length;
        elements.tabCases.textContent = caseEntries.length;
        elements.tabDiscipline.textContent = disciplineEntries.length;
    }

    function renderEntry(entry, index) {
        const isCase = entry.type === "case";
        const icon = isCase ? "shield-check" : "clipboard-list";
        const typeLabel = isCase ? "Kasus" : "Kedisiplinan";
        const typeClass = isCase ? "" : "discipline";
        const studentLabel = entry.student
            ? `<span><i data-lucide="user-round"></i>${escapeHTML(entry.student)}</span>`
            : "";

        return `
            <article class="sa-history-item" style="animation-delay:${Math.min(index * 25, 200)}ms">
                <span class="sa-history-item-icon ${typeClass}">
                    <i data-lucide="${icon}"></i>
                </span>

                <div class="sa-history-item-main">
                    <div class="sa-history-item-title">
                        <strong>${escapeHTML(entry.title)}</strong>
                        <span class="sa-history-type ${typeClass}">${typeLabel}</span>
                    </div>

                    <p>${escapeHTML(entry.description)}</p>

                    <div class="sa-history-item-meta">
                        <span><i data-lucide="calendar-clock"></i>${formatDate(entry.date)}</span>
                        ${studentLabel}
                    </div>
                </div>

                <span class="sa-history-item-code">${escapeHTML(entry.code)}</span>
            </article>
        `;
    }

    function renderHistory() {
        const visible = getVisibleEntries();

        elements.list.innerHTML = visible.map(renderEntry).join("");
        elements.empty.hidden = visible.length !== 0;
        elements.list.hidden = visible.length === 0;

        elements.result.textContent = `${visible.length} dari ${historyEntries.length} aktivitas ditampilkan`;

        elements.tabs.forEach(tab => {
            const selected = tab.dataset.historyFilter === activeTab;

            tab.classList.toggle("active", selected);
            tab.setAttribute("aria-pressed", String(selected));
        });

        renderStatistics();
        refreshIcons();
    }

    function setTab(tab) {
        activeTab = tab;
        renderHistory();
    }

    function resetFilters() {
        elements.search.value = "";
        elements.type.value = "all";
        elements.period.value = "all";
        setTab("all");
        showMessage("Filter riwayat berhasil direset.");
    }

    elements.search.addEventListener("input", renderHistory);
    elements.type.addEventListener("change", renderHistory);
    elements.period.addEventListener("change", renderHistory);

    elements.tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            setTab(tab.dataset.historyFilter);
        });
    });

    elements.reset.addEventListener("click", resetFilters);
    elements.resetTop.addEventListener("click", resetFilters);

    elements.refresh.addEventListener("click", () => {
        loadHistory();
        showMessage("Riwayat berhasil dimuat ulang dari data lokal.");
    });

    window.addEventListener("storage", event => {
        if (event.key === CASES_KEY || event.key === DISCIPLINE_KEY) {
            loadHistory();
        }
    });

    loadHistory();
});
