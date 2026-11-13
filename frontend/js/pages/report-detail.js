
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const reportNumber = document.getElementById("detailReportNumber");
    const emptyState = document.getElementById("detailEmptyState");
    const emptyMessage = document.getElementById("detailEmptyMessage");
    const retryButton = document.getElementById("detailRetryButton");
    const timelineEmpty = document.getElementById("detailTimelineEmpty");
    const informationList = document.getElementById("detailInformationList");
    const timeline = document.getElementById("detailTimeline");
    const descriptionPanel = document.getElementById("detailDescriptionPanel");

    const params = new URLSearchParams(window.location.search);
    const reportId = params.get("id");

    const renderIcons = () => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    };

    const showUnavailableState = () => {
        if (reportNumber) {
            reportNumber.textContent = reportId
                ? "Data belum dapat dimuat"
                : "Belum tersedia";
        }

        if (emptyMessage) {
            emptyMessage.textContent = reportId
                ? "Nomor laporan tersedia, tetapi informasi detail belum dapat dimuat. Integrasi API backend belum tersedia."
                : "Belum ada identitas laporan yang dipilih. Buka halaman ini melalui riwayat laporan setelah sistem terhubung dengan backend.";
        }

        if (emptyState) {
            emptyState.hidden = false;
        }

        if (timelineEmpty) {
            timelineEmpty.hidden = false;
        }

        if (informationList) {
            informationList.hidden = true;
        }

        if (timeline) {
            timeline.hidden = true;
            timeline.replaceChildren();
        }

        if (descriptionPanel) {
            descriptionPanel.hidden = true;
        }

        renderIcons();
    };

    if (retryButton) {
        retryButton.addEventListener("click", () => {
            retryButton.disabled = true;
            retryButton.innerHTML = '<i data-lucide="loader-circle"></i> Memeriksa...';
            renderIcons();

            window.setTimeout(() => {
                showUnavailableState();
                retryButton.disabled = false;
                retryButton.innerHTML = '<i data-lucide="refresh-cw"></i> Periksa kembali';
                renderIcons();
            }, 450);
        });
    }

    showUnavailableState();
});
