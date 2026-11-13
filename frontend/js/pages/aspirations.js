
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("aspirationForm");

    if (!form || form.dataset.initialized === "true") return;

    form.dataset.initialized = "true";

    const titleInput = document.getElementById("aspirationTitle");
    const descriptionInput = document.getElementById("aspirationDescription");
    const expectationInput = document.getElementById("aspirationExpectation");
    const categoryInputs = form.querySelectorAll('input[name="category"]');
    const agreementInput = document.getElementById("aspirationAgreement");
    const fileInput = document.getElementById("aspirationAttachment");
    const uploadArea = document.getElementById("uploadArea");
    const selectedFile = document.getElementById("selectedFile");
    const selectedFileName = document.getElementById("selectedFileName");
    const selectedFileSize = document.getElementById("selectedFileSize");
    const removeFileButton = document.getElementById("removeFile");
    const progressBar = document.getElementById("formProgressBar");
    const progressText = document.getElementById("formProgressText");
    const feedback = document.getElementById("aspirationFeedback");
    const submitButton = document.getElementById("submitAspiration");

    const maximumFileSize = 5 * 1024 * 1024;

    const allowedExtensions = ["jpg", "jpeg", "png", "webp", "pdf"];

    const fields = {
        title: titleInput,
        description: descriptionInput,
        expectation: expectationInput
    };

    function getSelectedCategory() {
        return form.querySelector('input[name="category"]:checked');
    }

    function showFeedback(message, type = "success") {
        feedback.textContent = message;
        feedback.classList.toggle("is-error", type === "error");
        feedback.hidden = false;
    }

    function clearFeedback() {
        feedback.textContent = "";
        feedback.hidden = true;
        feedback.classList.remove("is-error");
    }

    function setError(name, message = "") {
        const errorElement = form.querySelector(`[data-error="${name}"]`);

        if (errorElement) {
            errorElement.textContent = message;
        }

        const field = fields[name];

        if (field) {
            field.classList.toggle("is-invalid", Boolean(message));
            field.setAttribute("aria-invalid", message ? "true" : "false");
        }
    }

    function updateCharacterCount(input, name, maximum) {
        const counter = form.querySelector(`[data-count="${name}"]`);

        if (!counter || !input) return;

        counter.textContent = `${input.value.length}/${maximum}`;
    }

    function updateProgress() {
        const checks = [
            Boolean(getSelectedCategory()),
            Boolean(titleInput.value.trim()),
            Boolean(descriptionInput.value.trim()),
            Boolean(expectationInput.value.trim()),
            agreementInput.checked
        ];

        const completed = checks.filter(Boolean).length;
        const percentage = Math.round((completed / checks.length) * 100);

        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}% selesai`;

        progressBar.setAttribute("aria-valuenow", String(percentage));
    }

    function validateTextField(name, input, minimumLength) {
        const value = input.value.trim();

        if (!value) {
            setError(name, "Bagian ini wajib diisi.");
            return false;
        }

        if (value.length < minimumLength) {
            setError(name, `Minimal ${minimumLength} karakter.`);
            return false;
        }

        setError(name);
        return true;
    }

    function validateCategory() {
        const valid = Boolean(getSelectedCategory());

        form.querySelector('[data-error="category"]').textContent = valid
            ? ""
            : "Silakan pilih kategori aspirasi.";

        return valid;
    }

    function validateAgreement() {
        const error = form.querySelector('[data-error="agreement"]');

        error.textContent = agreementInput.checked
            ? ""
            : "Kamu harus menyetujui pernyataan terlebih dahulu.";

        return agreementInput.checked;
    }

    function validateForm() {
        const categoryValid = validateCategory();
        const titleValid = validateTextField("title", titleInput, 5);
        const descriptionValid = validateTextField("description", descriptionInput, 20);
        const expectationValid = validateTextField("expectation", expectationInput, 10);
        const agreementValid = validateAgreement();

        updateProgress();

        return categoryValid &&
            titleValid &&
            descriptionValid &&
            expectationValid &&
            agreementValid;
    }

    function formatFileSize(size) {
        if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(1)} KB`;
        }

        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }

    function validateFile(file) {
        if (!file) return true;

        const extension = file.name.split(".").pop().toLowerCase();

        if (!allowedExtensions.includes(extension)) {
            showFeedback("Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau PDF.", "error");
            return false;
        }

        if (file.size > maximumFileSize) {
            showFeedback("Ukuran file melebihi batas maksimal 5 MB.", "error");
            return false;
        }

        return true;
    }

    function displayFile(file) {
        if (!file || !validateFile(file)) {
            fileInput.value = "";
            selectedFile.hidden = true;
            updateProgress();
            return;
        }

        selectedFileName.textContent = file.name;
        selectedFileSize.textContent = formatFileSize(file.size);
        selectedFile.hidden = false;

        clearFeedback();
    }

    function handleFileSelection() {
        const file = fileInput.files[0];

        if (!file) {
            selectedFile.hidden = true;
            updateProgress();
            return;
        }

        displayFile(file);
    }

    function removeSelectedFile() {
        fileInput.value = "";
        selectedFile.hidden = true;
        selectedFileName.textContent = "";
        selectedFileSize.textContent = "";
        clearFeedback();
    }

    titleInput.addEventListener("input", () => {
        updateCharacterCount(titleInput, "title", 100);
        updateProgress();
        clearFeedback();
    });

    descriptionInput.addEventListener("input", () => {
        updateCharacterCount(descriptionInput, "description", 1500);
        updateProgress();
        clearFeedback();
    });

    expectationInput.addEventListener("input", () => {
        updateCharacterCount(expectationInput, "expectation", 800);
        updateProgress();
        clearFeedback();
    });

    categoryInputs.forEach(input => {
        input.addEventListener("change", () => {
            validateCategory();
            updateProgress();
            clearFeedback();
        });
    });

    agreementInput.addEventListener("change", () => {
        validateAgreement();
        updateProgress();
        clearFeedback();
    });

    Object.entries(fields).forEach(([name, input]) => {
        input.addEventListener("blur", () => {
            if (input.value.trim()) {
                const minimumLength = name === "title" ? 5 : name === "description" ? 20 : 10;
                validateTextField(name, input, minimumLength);
            }
        });
    });

    fileInput.addEventListener("change", handleFileSelection);

    removeFileButton.addEventListener("click", removeSelectedFile);

    uploadArea.addEventListener("dragover", event => {
        event.preventDefault();
        uploadArea.classList.add("is-dragging");
    });

    uploadArea.addEventListener("dragleave", event => {
        if (!uploadArea.contains(event.relatedTarget)) {
            uploadArea.classList.remove("is-dragging");
        }
    });

    uploadArea.addEventListener("drop", event => {
        event.preventDefault();
        uploadArea.classList.remove("is-dragging");

        const file = event.dataTransfer.files[0];

        if (!file) return;

        if (!validateFile(file)) return;

        const transfer = new DataTransfer();
        transfer.items.add(file);
        fileInput.files = transfer.files;

        displayFile(file);
    });

    form.addEventListener("submit", event => {
        event.preventDefault();
        clearFeedback();

        if (!validateForm()) {
            showFeedback("Periksa kembali formulir. Masih ada bagian yang belum benar.", "error");

            const firstInvalid = form.querySelector(".is-invalid");

            if (firstInvalid) {
                firstInvalid.focus();
                firstInvalid.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            } else if (!getSelectedCategory()) {
                categoryInputs[0].focus();
            } else if (!agreementInput.checked) {
                agreementInput.focus();
            }

            return;
        }

        if (fileInput.files.length && !validateFile(fileInput.files[0])) {
            return;
        }

        showFeedback(
            "Formulir sudah lengkap dan valid. Pengiriman ke server belum diaktifkan karena integrasi API Laravel perlu disesuaikan dengan kontrak backend.",
            "success"
        );
    });

    updateCharacterCount(titleInput, "title", 100);
    updateCharacterCount(descriptionInput, "description", 1500);
    updateCharacterCount(expectationInput, "expectation", 800);
    updateProgress();

    if (window.lucide) {
        window.lucide.createIcons();
    }
});
