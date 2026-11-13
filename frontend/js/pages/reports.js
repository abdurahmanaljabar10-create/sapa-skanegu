
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bullyingReportForm");
    const description = document.getElementById("bullyingDescription");
    const counter = document.getElementById("bullyingCharacterCount");
    const dateInput = document.getElementById("bullyingDate");
    const timeInput = document.getElementById("bullyingTime");
    const notice = document.querySelector(".bullying-form-notice");

    const updateIcons = () => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    };

    if (description && counter) {
        const updateCounter = () => {
            counter.textContent = `${description.value.length} / 4000`;
        };

        description.addEventListener("input", updateCounter);
        updateCounter();
    }

    if (dateInput) {
        const today = new Date();
        const localDate = new Date(
            today.getTime() - today.getTimezoneOffset() * 60000
        ).toISOString().split("T")[0];

        dateInput.max = localDate;
    }

    if (timeInput) {
        const validateTime = () => {
            const value = timeInput.value.trim();
            const validTime = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;

            timeInput.setCustomValidity(
                value && !validTime.test(value)
                    ? "Gunakan format waktu 24 jam, contoh 13:30."
                    : ""
            );
        };

        timeInput.addEventListener("input", validateTime);
        timeInput.addEventListener("change", validateTime);
    }

    if (form && notice) {
        const noticeText = notice.querySelector("p");
        const noticeIcon = notice.querySelector("i");

        notice.setAttribute("role", "status");
        notice.setAttribute("aria-live", "polite");

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!form.reportValidity()) {
                return;
            }

            if (noticeText) {
                noticeText.textContent =
                    "Pemeriksaan formulir berhasil. Namun, pengiriman laporan belum aktif karena integrasi API backend belum dikonfigurasi. Laporan ini belum tersimpan.";
            }

            if (noticeIcon) {
                noticeIcon.setAttribute("data-lucide", "info");
            }

            notice.classList.add("is-validation-result");

            updateIcons();

            notice.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "auto"
                    : "smooth",
                block: "center"
            });
        });
    }

    updateIcons();
});
