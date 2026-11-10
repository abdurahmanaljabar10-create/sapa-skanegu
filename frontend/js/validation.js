
(function (window, document) {
    "use strict";

    window.SAPA = window.SAPA || {};

    const Validation = {
        initialized: false,

        defaults: {
            requiredMessage: "Bagian ini wajib diisi.",
            emailMessage: "Masukkan alamat email yang valid.",
            phoneMessage: "Masukkan nomor telepon yang valid.",
            minMessage: "Jumlah karakter terlalu sedikit.",
            maxMessage: "Jumlah karakter melebihi batas.",
            passwordMessage: "Password belum memenuhi ketentuan.",
            confirmPasswordMessage: "Konfirmasi password tidak cocok.",
            fileMessage: "File tidak memenuhi ketentuan.",
            dateMessage: "Tanggal yang dimasukkan tidak valid.",
            selectMessage: "Silakan pilih salah satu pilihan.",
            patternMessage: "Format yang dimasukkan tidak sesuai.",
            genericMessage: "Periksa kembali isian Anda."
        },

        patterns: {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
            phone: /^(?:\+62|62|0)8[1-9][0-9]{6,11}$/,
            username: /^[a-zA-Z0-9._-]{3,30}$/,
            password: /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/,
            numeric: /^[0-9]+$/,
            alphabetic: /^[a-zA-Z\s]+$/,
            alphanumeric: /^[a-zA-Z0-9]+$/,
            url: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i,
            identity: /^[a-zA-Z0-9@._+-]+$/
        },

        fileTypes: {
            image: [
                "image/jpeg",
                "image/png",
                "image/webp"
            ],
            document: [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ],
            evidence: [
                "image/jpeg",
                "image/png",
                "image/webp",
                "application/pdf"
            ]
        },

        fileExtensions: {
            image: [".jpg", ".jpeg", ".png", ".webp"],
            document: [".pdf", ".doc", ".docx"],
            evidence: [".jpg", ".jpeg", ".png", ".webp", ".pdf"]
        },

        init: function () {
            if (this.initialized) {
                return this;
            }

            this.initialized = true;
            this.bindGlobalEvents();
            this.initializeForms();

            return this;
        },

        bindGlobalEvents: function () {
            document.addEventListener(
                "input",
                this.handleInput.bind(this),
                true
            );

            document.addEventListener(
                "change",
                this.handleChange.bind(this),
                true
            );

            document.addEventListener(
                "reset",
                this.handleReset.bind(this),
                true
            );
        },

        initializeForms: function () {
            const forms = document.querySelectorAll(
                "form[data-validate]"
            );

            forms.forEach((form) => {
                this.registerForm(form);
            });
        },

        registerForm: function (form) {
            if (!(form instanceof HTMLFormElement)) {
                return false;
            }

            if (form.dataset.validationInitialized === "true") {
                return true;
            }

            form.dataset.validationInitialized = "true";

            form.addEventListener("submit", (event) => {
                const result = this.validateForm(form);

                if (!result.valid) {
                    event.preventDefault();

                    const firstInvalid = result.invalidFields[0];

                    if (firstInvalid) {
                        firstInvalid.focus();
                    }

                    this.emit("sapa:validation-failed", {
                        form: form,
                        errors: result.errors
                    });

                    return;
                }

                this.emit("sapa:validation-passed", {
                    form: form
                });
            });

            return true;
        },

        handleInput: function (event) {
            const field = event.target;

            if (!this.isValidatableField(field)) {
                return;
            }

            if (
                field.dataset.validationTouched !== "true"
            ) {
                return;
            }

            this.validateField(field, false);
        },

        handleChange: function (event) {
            const field = event.target;

            if (!this.isValidatableField(field)) {
                return;
            }

            if (
                field.type === "file" ||
                field.type === "checkbox" ||
                field.type === "radio" ||
                field.tagName === "SELECT"
            ) {
                field.dataset.validationTouched = "true";
                this.validateField(field, false);
            }
        },

        handleReset: function (event) {
            const form = event.target;

            if (!(form instanceof HTMLFormElement)) {
                return;
            }

            window.setTimeout(() => {
                this.clearFormErrors(form);
            }, 0);
        },

        isValidatableField: function (field) {
            if (!(field instanceof HTMLElement)) {
                return false;
            }

            if (!field.matches("input, textarea, select")) {
                return false;
            }

            if (field.disabled || field.type === "hidden") {
                return false;
            }

            if (field.closest("#login-form")) {
                return false;
            }

            return true;
        },

        validateForm: function (form) {
            if (!(form instanceof HTMLFormElement)) {
                return {
                    valid: false,
                    errors: {},
                    invalidFields: []
                };
            }

            const fields = Array.from(
                form.querySelectorAll(
                    "input, textarea, select"
                )
            ).filter((field) => {
                return this.isValidatableField(field);
            });

            const errors = {};
            const invalidFields = [];

            fields.forEach((field) => {
                field.dataset.validationTouched = "true";

                const result = this.validateField(
                    field,
                    false
                );

                if (!result.valid) {
                    errors[field.name || field.id] = result.message;
                    invalidFields.push(field);
                }
            });

            return {
                valid: invalidFields.length === 0,
                errors: errors,
                invalidFields: invalidFields
            };
        },

        validateField: function (field, markTouched) {
            if (!this.isValidatableField(field)) {
                return {
                    valid: true,
                    message: ""
                };
            }

            if (markTouched !== false) {
                field.dataset.validationTouched = "true";
            }

            const value = this.getFieldValue(field);
            const rules = this.getFieldRules(field);

            const result = this.runRules(
                field,
                value,
                rules
            );

            if (result.valid) {
                this.clearFieldError(field);
            } else {
                this.showFieldError(
                    field,
                    result.message
                );
            }

            return result;
        },

        getFieldValue: function (field) {
            if (
                field.type === "checkbox" ||
                field.type === "radio"
            ) {
                return field.checked ? field.value : "";
            }

            if (field.type === "file") {
                return field.files;
            }

            return String(field.value || "").trim();
        },

        getFieldRules: function (field) {
            const rules = {};

            rules.required =
                field.required ||
                field.dataset.required === "true";

            if (field.dataset.minLength) {
                rules.minLength = Number(
                    field.dataset.minLength
                );
            }

            if (field.dataset.maxLength) {
                rules.maxLength = Number(
                    field.dataset.maxLength
                );
            }

            if (field.dataset.validate) {
                rules.type = field.dataset.validate;
            }

            if (field.dataset.pattern) {
                rules.pattern = field.dataset.pattern;
            }

            if (field.dataset.match) {
                rules.match = field.dataset.match;
            }

            if (field.dataset.min) {
                rules.min = Number(field.dataset.min);
            }

            if (field.dataset.max) {
                rules.max = Number(field.dataset.max);
            }

            if (field.dataset.maxSize) {
                rules.maxSize = Number(
                    field.dataset.maxSize
                );
            }

            if (field.dataset.fileType) {
                rules.fileType = field.dataset.fileType;
            }

            if (field.dataset.extension) {
                rules.extension = field.dataset.extension
                    .split(",")
                    .map((item) => item.trim().toLowerCase());
            }

            if (field.dataset.customMessage) {
                rules.customMessage =
                    field.dataset.customMessage;
            }

            return rules;
        },

        runRules: function (field, value, rules) {
            if (rules.required) {
                const requiredResult = this.checkRequired(
                    field,
                    value
                );

                if (!requiredResult.valid) {
                    return requiredResult;
                }
            }

            if (this.isEmpty(value)) {
                return {
                    valid: true,
                    message: ""
                };
            }

            if (rules.minLength !== undefined) {
                if (
                    String(value).length <
                    rules.minLength
                ) {
                    return {
                        valid: false,
                        message:
                            `Minimal ${rules.minLength} karakter.`
                    };
                }
            }

            if (rules.maxLength !== undefined) {
                if (
                    String(value).length >
                    rules.maxLength
                ) {
                    return {
                        valid: false,
                        message:
                            `Maksimal ${rules.maxLength} karakter.`
                    };
                }
            }

            if (rules.type) {
                const typeResult = this.checkType(
                    field,
                    value,
                    rules.type
                );

                if (!typeResult.valid) {
                    return typeResult;
                }
            }

            if (rules.pattern) {
                const patternResult = this.checkPattern(
                    value,
                    rules.pattern
                );

                if (!patternResult.valid) {
                    return patternResult;
                }
            }

            if (rules.match) {
                const matchResult = this.checkMatch(
                    field,
                    rules.match
                );

                if (!matchResult.valid) {
                    return matchResult;
                }
            }

            if (rules.min !== undefined) {
                if (Number(value) < rules.min) {
                    return {
                        valid: false,
                        message:
                            `Nilai minimal adalah ${rules.min}.`
                    };
                }
            }

            if (rules.max !== undefined) {
                if (Number(value) > rules.max) {
                    return {
                        valid: false,
                        message:
                            `Nilai maksimal adalah ${rules.max}.`
                    };
                }
            }

            if (field.type === "file") {
                const fileResult = this.checkFiles(
                    field,
                    rules
                );

                if (!fileResult.valid) {
                    return fileResult;
                }
            }

            if (field.type === "date") {
                const dateResult = this.checkDate(
                    value,
                    field
                );

                if (!dateResult.valid) {
                    return dateResult;
                }
            }

            return {
                valid: true,
                message: ""
            };
        },

        checkRequired: function (field, value) {
            if (field.type === "checkbox") {
                const group = this.getCheckboxGroup(field);

                if (group.length > 1) {
                    const checked = group.some(
                        (item) => item.checked
                    );

                    if (!checked) {
                        return {
                            valid: false,
                            message: "Pilih minimal satu pilihan."
                        };
                    }
                } else if (!field.checked) {
                    return {
                        valid: false,
                        message: this.defaults.requiredMessage
                    };
                }

                return {
                    valid: true,
                    message: ""
                };
            }

            if (field.type === "radio") {
                const group = this.getRadioGroup(field);

                if (
                    !group.some((item) => item.checked)
                ) {
                    return {
                        valid: false,
                        message: this.defaults.selectMessage
                    };
                }

                return {
                    valid: true,
                    message: ""
                };
            }

            if (field.type === "file") {
                if (!field.files || field.files.length === 0) {
                    return {
                        valid: false,
                        message: "Silakan pilih file."
                    };
                }

                return {
                    valid: true,
                    message: ""
                };
            }

            if (field.tagName === "SELECT") {
                if (!value || value === "") {
                    return {
                        valid: false,
                        message: this.defaults.selectMessage
                    };
                }
            }

            if (this.isEmpty(value)) {
                return {
                    valid: false,
                    message: this.defaults.requiredMessage
                };
            }

            return {
                valid: true,
                message: ""
            };
        },

        checkType: function (field, value, type) {
            const normalizedType = String(type).toLowerCase();

            if (normalizedType === "email") {
                return {
                    valid: this.patterns.email.test(value),
                    message: this.defaults.emailMessage
                };
            }

            if (normalizedType === "phone") {
                const normalizedPhone = String(value)
                    .replace(/[\s()-]/g, "");

                return {
                    valid: this.patterns.phone.test(
                        normalizedPhone
                    ),
                    message: this.defaults.phoneMessage
                };
            }

            if (normalizedType === "username") {
                return {
                    valid: this.patterns.username.test(value),
                    message: "Username harus 3–30 karakter dan hanya menggunakan huruf, angka, titik, garis bawah, atau tanda hubung."
                };
            }

            if (normalizedType === "password") {
                return {
                    valid: this.patterns.password.test(value),
                    message: "Password minimal 8 karakter dan harus mengandung huruf serta angka."
                };
            }

            if (normalizedType === "identity") {
                return {
                    valid: this.patterns.identity.test(value),
                    message: "Format identitas tidak valid."
                };
            }

            if (normalizedType === "numeric") {
                return {
                    valid: this.patterns.numeric.test(value),
                    message: "Masukkan angka saja."
                };
            }

            if (normalizedType === "alphabetic") {
                return {
                    valid: this.patterns.alphabetic.test(value),
                    message: "Masukkan huruf saja."
                };
            }

            if (normalizedType === "alphanumeric") {
                return {
                    valid: this.patterns.alphanumeric.test(value),
                    message: "Gunakan huruf dan angka saja."
                };
            }

            if (normalizedType === "url") {
                return {
                    valid: this.patterns.url.test(value),
                    message: "Masukkan alamat URL yang valid."
                };
            }

            if (normalizedType === "date") {
                return this.checkDate(value, field);
            }

            if (normalizedType === "file") {
                return this.checkFiles(
                    field,
                    this.getFieldRules(field)
                );
            }

            return {
                valid: true,
                message: ""
            };
        },

        checkPattern: function (value, patternName) {
            let pattern = null;

            if (this.patterns[patternName]) {
                pattern = this.patterns[patternName];
            } else {
                try {
                    pattern = new RegExp(patternName);
                } catch (error) {
                    return {
                        valid: false,
                        message: "Aturan format tidak valid."
                    };
                }
            }

            return {
                valid: pattern.test(value),
                message: this.defaults.patternMessage
            };
        },

        checkMatch: function (field, targetSelector) {
            const target = document.querySelector(
                targetSelector
            );

            if (!target) {
                return {
                    valid: false,
                    message: "Kolom pembanding tidak ditemukan."
                };
            }

            const firstValue = String(field.value || "");
            const secondValue = String(target.value || "");

            return {
                valid: firstValue === secondValue,
                message: this.defaults.confirmPasswordMessage
            };
        },

        checkFiles: function (field, rules) {
            const files = Array.from(
                field.files || []
            );

            if (files.length === 0) {
                return {
                    valid: true,
                    message: ""
                };
            }

            const maxSize = rules.maxSize || 5 * 1024 * 1024;

            const allowedTypes = rules.fileType
                ? this.fileTypes[rules.fileType]
                : null;

            const allowedExtensions = rules.extension
                ? rules.extension
                : rules.fileType
                    ? this.fileExtensions[rules.fileType]
                    : null;

            for (const file of files) {
                if (file.size > maxSize) {
                    return {
                        valid: false,
                        message:
                            `Ukuran file maksimal ${this.formatBytes(maxSize)}.`
                    };
                }

                if (
                    allowedTypes &&
                    !allowedTypes.includes(file.type)
                ) {
                    return {
                        valid: false,
                        message: "Jenis file tidak diperbolehkan."
                    };
                }

                if (allowedExtensions) {
                    const extension = this.getExtension(
                        file.name
                    );

                    if (
                        !allowedExtensions.includes(extension)
                    ) {
                        return {
                            valid: false,
                            message:
                                "Ekstensi file tidak diperbolehkan."
                        };
                    }
                }
            }

            return {
                valid: true,
                message: ""
            };
        },

        checkDate: function (value, field) {
            if (!value) {
                return {
                    valid: true,
                    message: ""
                };
            }

            const date = new Date(value);

            if (Number.isNaN(date.getTime())) {
                return {
                    valid: false,
                    message: this.defaults.dateMessage
                };
            }

            if (field.min) {
                const minimum = new Date(field.min);

                if (date < minimum) {
                    return {
                        valid: false,
                        message: "Tanggal tidak boleh sebelum batas minimum."
                    };
                }
            }

            if (field.max) {
                const maximum = new Date(field.max);

                if (date > maximum) {
                    return {
                        valid: false,
                        message: "Tanggal melewati batas maksimum."
                    };
                }
            }

            return {
                valid: true,
                message: ""
            };
        },

        getCheckboxGroup: function (field) {
            if (!field.name) {
                return [field];
            }

            return Array.from(
                field.form.querySelectorAll(
                    `input[type="checkbox"][name="${this.escapeSelector(field.name)}"]`
                )
            );
        },

        getRadioGroup: function (field) {
            if (!field.name || !field.form) {
                return [field];
            }

            return Array.from(
                field.form.querySelectorAll(
                    `input[type="radio"][name="${this.escapeSelector(field.name)}"]`
                )
            );
        },

        showFieldError: function (field, message) {
            field.classList.add("is-invalid");
            field.classList.remove("is-valid");

            field.setAttribute("aria-invalid", "true");

            const errorElement = this.getErrorElement(field);

            if (errorElement) {
                errorElement.textContent = message;
                errorElement.hidden = false;
            }

            this.emit("sapa:field-invalid", {
                field: field,
                message: message
            });
        },

        clearFieldError: function (field) {
            field.classList.remove("is-invalid");
            field.classList.add("is-valid");

            field.setAttribute("aria-invalid", "false");

            const errorElement = this.getErrorElement(field);

            if (errorElement) {
                errorElement.textContent = "";
                errorElement.hidden = true;
            }

            this.emit("sapa:field-valid", {
                field: field
            });
        },

        getErrorElement: function (field) {
            const explicitId = field.dataset.errorTarget;

            if (explicitId) {
                return document.getElementById(explicitId);
            }

            const container = field.closest(
                ".form-field, .form-group, .input-group, .field-wrapper"
            );

            if (!container) {
                return null;
            }

            return container.querySelector(
                ".field-error, .form-error, .input-error, [data-error-for]"
            );
        },

        clearFormErrors: function (form) {
            const fields = form.querySelectorAll(
                "input, textarea, select"
            );

            fields.forEach((field) => {
                field.classList.remove(
                    "is-invalid",
                    "is-valid"
                );

                field.removeAttribute("aria-invalid");
                delete field.dataset.validationTouched;

                const errorElement = this.getErrorElement(field);

                if (errorElement) {
                    errorElement.textContent = "";
                    errorElement.hidden = true;
                }
            });
        },

        clearField: function (field) {
            if (!field) {
                return;
            }

            field.classList.remove(
                "is-invalid",
                "is-valid"
            );

            field.removeAttribute("aria-invalid");
            delete field.dataset.validationTouched;

            const errorElement = this.getErrorElement(field);

            if (errorElement) {
                errorElement.textContent = "";
                errorElement.hidden = true;
            }
        },

        isEmpty: function (value) {
            if (value === null || value === undefined) {
                return true;
            }

            if (typeof value === "string") {
                return value.trim() === "";
            }

            if (value instanceof FileList) {
                return value.length === 0;
            }

            return false;
        },

        getExtension: function (filename) {
            const index = filename.lastIndexOf(".");

            if (index === -1) {
                return "";
            }

            return filename.slice(index).toLowerCase();
        },

        formatBytes: function (bytes) {
            if (bytes < 1024) {
                return `${bytes} B`;
            }

            if (bytes < 1024 * 1024) {
                return `${(bytes / 1024).toFixed(1)} KB`;
            }

            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        },

        escapeSelector: function (value) {
            if (window.CSS && typeof window.CSS.escape === "function") {
                return window.CSS.escape(value);
            }

            return String(value).replace(
                /[^a-zA-Z0-9_-]/g,
                "\\$&"
            );
        },

        setCustomValidity: function (field, message) {
            if (!field) {
                return;
            }

            if (message) {
                this.showFieldError(field, message);
            } else {
                this.clearFieldError(field);
            }
        },

        validateValue: function (value, rules) {
            const field = document.createElement("input");

            if (rules.required) {
                field.required = true;
            }

            if (rules.type) {
                field.dataset.validate = rules.type;
            }

            if (rules.minLength !== undefined) {
                field.dataset.minLength = rules.minLength;
            }

            if (rules.maxLength !== undefined) {
                field.dataset.maxLength = rules.maxLength;
            }

            field.value = value === null || value === undefined
                ? ""
                : String(value);

            const fieldRules = this.getFieldRules(field);

            return this.runRules(
                field,
                this.getFieldValue(field),
                fieldRules
            );
        },

        validateEmail: function (value) {
            return this.validateValue(value, {
                required: true,
                type: "email"
            });
        },

        validatePhone: function (value) {
            return this.validateValue(value, {
                required: true,
                type: "phone"
            });
        },

        validatePassword: function (value) {
            return this.validateValue(value, {
                required: true,
                type: "password"
            });
        },

        validateUsername: function (value) {
            return this.validateValue(value, {
                required: true,
                type: "username"
            });
        },

        validateIdentity: function (value) {
            return this.validateValue(value, {
                required: true,
                type: "identity",
                minLength: 3,
                maxLength: 100
            });
        },

        validateConfirmation: function (
            password,
            confirmation
        ) {
            return {
                valid: String(password || "") ===
                    String(confirmation || ""),
                message: this.defaults.confirmPasswordMessage
            };
        },

        validateReport: function (data) {
            const errors = {};

            const requiredFields = [
                "category",
                "description"
            ];

            requiredFields.forEach((field) => {
                if (this.isEmpty(data[field])) {
                    errors[field] = this.defaults.requiredMessage;
                }
            });

            if (
                data.description &&
                String(data.description).trim().length < 20
            ) {
                errors.description =
                    "Deskripsi laporan minimal 20 karakter.";
            }

            if (
                data.description &&
                String(data.description).length > 5000
            ) {
                errors.description =
                    "Deskripsi laporan maksimal 5000 karakter.";
            }

            if (
                data.incident_date &&
                !this.checkDate(data.incident_date, {
                    min: "",
                    max: new Date().toISOString().split("T")[0]
                }).valid
            ) {
                errors.incident_date =
                    "Tanggal kejadian tidak valid.";
            }

            return {
                valid: Object.keys(errors).length === 0,
                errors: errors
            };
        },

        validateAspiration: function (data) {
            const errors = {};

            if (this.isEmpty(data.title)) {
                errors.title = "Judul aspirasi wajib diisi.";
            } else if (String(data.title).length < 5) {
                errors.title = "Judul minimal 5 karakter.";
            } else if (String(data.title).length > 150) {
                errors.title = "Judul maksimal 150 karakter.";
            }

            if (this.isEmpty(data.description)) {
                errors.description =
                    "Isi aspirasi wajib diisi.";
            } else if (
                String(data.description).trim().length < 20
            ) {
                errors.description =
                    "Isi aspirasi minimal 20 karakter.";
            } else if (
                String(data.description).length > 5000
            ) {
                errors.description =
                    "Isi aspirasi maksimal 5000 karakter.";
            }

            return {
                valid: Object.keys(errors).length === 0,
                errors: errors
            };
        },

        validateComplaint: function (data) {
            const errors = {};

            if (this.isEmpty(data.category)) {
                errors.category =
                    "Kategori pengaduan wajib dipilih.";
            }

            if (this.isEmpty(data.description)) {
                errors.description =
                    "Deskripsi pengaduan wajib diisi.";
            } else if (
                String(data.description).trim().length < 20
            ) {
                errors.description =
                    "Deskripsi minimal 20 karakter.";
            }

            return {
                valid: Object.keys(errors).length === 0,
                errors: errors
            };
        },

        validateRegistration: function (data) {
            const errors = {};

            if (this.isEmpty(data.name)) {
                errors.name = "Nama lengkap wajib diisi.";
            } else if (
                String(data.name).trim().length < 3
            ) {
                errors.name = "Nama minimal 3 karakter.";
            } else if (
                String(data.name).length > 100
            ) {
                errors.name = "Nama maksimal 100 karakter.";
            }

            if (this.isEmpty(data.email)) {
                errors.email = "Email wajib diisi.";
            } else if (!this.patterns.email.test(data.email)) {
                errors.email = this.defaults.emailMessage;
            }

            if (this.isEmpty(data.password)) {
                errors.password = "Password wajib diisi.";
            } else if (
                !this.patterns.password.test(data.password)
            ) {
                errors.password =
                    "Password minimal 8 karakter dan mengandung huruf serta angka.";
            }

            if (
                data.password !== data.password_confirmation
            ) {
                errors.password_confirmation =
                    this.defaults.confirmPasswordMessage;
            }

            return {
                valid: Object.keys(errors).length === 0,
                errors: errors
            };
        },

        validateProfile: function (data) {
            const errors = {};

            if (this.isEmpty(data.name)) {
                errors.name = "Nama lengkap wajib diisi.";
            }

            if (
                data.email &&
                !this.patterns.email.test(data.email)
            ) {
                errors.email = this.defaults.emailMessage;
            }

            if (data.phone) {
                const phone = String(data.phone).replace(
                    /[\s()-]/g,
                    ""
                );

                if (!this.patterns.phone.test(phone)) {
                    errors.phone = this.defaults.phoneMessage;
                }
            }

            return {
                valid: Object.keys(errors).length === 0,
                errors: errors
            };
        },

        emit: function (eventName, detail) {
            document.dispatchEvent(
                new CustomEvent(eventName, {
                    bubbles: true,
                    detail: detail
                })
            );
        },

        getErrors: function (form) {
            if (!(form instanceof HTMLFormElement)) {
                return {};
            }

            const result = this.validateForm(form);

            return result.errors;
        },

        focusFirstInvalid: function (form) {
            if (!(form instanceof HTMLFormElement)) {
                return false;
            }

            const invalid = form.querySelector(
                ".is-invalid, [aria-invalid='true']"
            );

            if (!invalid) {
                return false;
            }

            invalid.focus();

            return true;
        },

        destroy: function () {
            this.initialized = false;

            document
                .querySelectorAll("form[data-validation-initialized]")
                .forEach((form) => {
                    delete form.dataset.validationInitialized;
                });
        }
    };

    window.SAPA.validation = Validation;

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            function () {
                Validation.init();
            },
            { once: true }
        );
    } else {
        Validation.init();
    }

    document.addEventListener("sapa:ready", function () {
        Validation.init();
    });

})(window, document);
