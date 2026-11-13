
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("complaintsForm");
    const description = document.getElementById("complaintDescription");
    const counter = document.getElementById("complaintCharacterCount");
    const notice = document.querySelector(".complaints-form-notice p");

    if (description && counter) {
        const updateCounter = () => {
            counter.textContent = `${description.value.length} / 3000`;
        };

        description.addEventListener("input", updateCounter);
        updateCounter();
    }

    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!form.reportValidity()) return;

            if (notice) {
                notice.textContent =
                    "Formulir sudah terisi dan lolos pemeriksaan. Pengiriman pengaduan belum diaktifkan karena integrasi API backend belum dikonfigurasi.";
            }

            const noticeBox = document.querySelector(".complaints-form-notice");

            if (noticeBox) {
                noticeBox.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        });
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }
});
