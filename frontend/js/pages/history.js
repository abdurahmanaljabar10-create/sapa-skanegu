
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("historyTableBody");
    const emptyState = document.getElementById("historyEmptyState");
    const emptyTitle = document.getElementById("historyEmptyTitle");
    const emptyDescription = document.getElementById("historyEmptyDescription");
    const searchInput = document.getElementById("historySearch");
    const typeFilter = document.getElementById("historyTypeFilter");
    const statusFilter = document.getElementById("historyStatusFilter");
    const refreshButton = document.getElementById("historyRefreshButton");
    const pagination = document.getElementById("historyPagination");
    const message = document.getElementById("historyMessage");

    const showEmptyState = (title, description) => {
        if (tableBody) {
            tableBody.replaceChildren();

            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = 5;

            const placeholder = document.createElement("div");
            placeholder.className = "history-loading-state";

            const icon = document.createElement("i");
            icon.setAttribute("data-lucide", "folder-open");

            const text = document.createElement("span");
            text.textContent = "Belum ada data riwayat yang tersedia.";

            placeholder.append(icon, text);
            cell.appendChild(placeholder);
            row.appendChild(cell);
            tableBody.appendChild(row);
        }

        if (emptyTitle) {
            emptyTitle.textContent = title;
        }

        if (emptyDescription) {
            emptyDescription.textContent = description;
        }

        if (emptyState) {
            emptyState.hidden = false;
        }

        if (pagination) {
            pagination.hidden = true;
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }
    };

    const showMessage = (text) => {
        if (!message) return;

        message.textContent = text;
        message.hidden = false;
    };

    const resetMessage = () => {
        if (!message) return;

        message.textContent = "";
        message.hidden = true;
    };

    const loadHistory = () => {
        resetMessage();

        const total = document.getElementById("historyTotalCount");
        const process = document.getElementById("historyProcessCount");
        const completed = document.getElementById("historyCompletedCount");

        if (total) total.textContent = "—";
        if (process) process.textContent = "—";
        if (completed) completed.textContent = "—";

        showEmptyState(
            "Riwayat belum tersedia",
            "Data riwayat pengajuan akan ditampilkan setelah sistem terhubung dengan API backend."
        );

        showMessage(
            "Data riwayat belum dapat dimuat karena integrasi API backend belum dikonfigurasi. Belum ada data pengajuan yang diambil."
        );
    };

    const handleFilter = () => {
        const searchValue = searchInput ? searchInput.value.trim() : "";
        const typeValue = typeFilter ? typeFilter.value : "all";
        const statusValue = statusFilter ? statusFilter.value : "all";

        if (searchValue || typeValue !== "all" || statusValue !== "all") {
            showEmptyState(
                "Data belum dapat difilter",
                "Pencarian dan filter akan bekerja setelah data riwayat berhasil dimuat dari backend."
            );

            showMessage(
                "Filter sudah dipilih. Hasil belum tersedia karena data riwayat belum terhubung ke sistem."
            );
        } else {
            loadHistory();
        }
    };

    if (searchInput) {
        searchInput.addEventListener("input", handleFilter);
    }

    if (typeFilter) {
        typeFilter.addEventListener("change", handleFilter);
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", handleFilter);
    }

    if (refreshButton) {
        refreshButton.addEventListener("click", loadHistory);
    }

    loadHistory();

    if (window.lucide) {
        window.lucide.createIcons();
    }
});
