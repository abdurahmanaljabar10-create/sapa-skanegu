
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("trackingSearchForm");
    const codeInput = document.getElementById("trackingCode");
    const message = document.getElementById("trackingSearchMessage");
    const resultPanel = document.getElementById("trackingResultPanel");
    const emptyState = document.getElementById("trackingEmptyState");

    const showMessage = (text, state = "info") => {
        if (!message) return;

        message.replaceChildren();

        const icon = document.createElement("i");
        icon.setAttribute(
            "data-lucide",
            state === "error" ? "alert-circle" : "info"
        );

        const paragraph = document.createElement("p");
        paragraph.textContent = text;

        message.append(icon, paragraph);
        message.dataset.state = state;
        message.hidden = false;

        if (window.lucide) {
            window.lucide.createIcons();
        }
    };

    if (codeInput) {
        codeInput.addEventListener("input", () => {
            codeInput.value = codeInput.value.trimStart();
        });
    }

    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!form.reportValidity()) return;

            const trackingCode = codeInput.value.trim();

            if (!trackingCode) {
                showMessage("Masukkan kode laporan terlebih dahulu.", "error");
                return;
            }

            if (resultPanel) {
                resultPanel.hidden = true;
            }

            if (emptyState) {
                emptyState.hidden = false;
            }

            showMessage(
                "Pencarian belum dapat dilakukan karena integrasi API pelacakan backend belum dikonfigurasi. Belum ada data laporan yang diambil.",
                "info"
            );
        });
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }
});
