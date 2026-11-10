
(function (window, document) {
    "use strict";

    window.SAPA = window.SAPA || {};

    const Register = {
        initialized: false,
        isSubmitting: false,
        requestController: null,

        config: {
            endpoint: "/api/register",
            timeout: 20000,
            redirectAfterSuccess: false,
            loginUrl: "../index.html"
        },

        elements: {},

        init: function () {
            if (this.initialized) {
                return this;
            }

            this.cacheElements();

            if (!this.elements.form) {
                return this;
            }

            this.initialized = true;

            this.bindEvents();
            this.initializePasswordToggles();
            this.initializeYear();
            this.initializeIcons();

            return this;
        },

        cacheElements: function () {
            this.elements = {
                form: document.getElementById("registerForm"),
                fullName: document.getElementById("fullName"),
                identifier: document.getElementById("identifier"),
                email: document.getElementById("email"),
                phone: document.getElementById("phone"),
                password: document.getElementById("password"),
                confirmPassword: document.getElementById("confirmPassword"),
                agreement: document.getElementById("agreement"),
                feedback: document.getElementById("registerFeedback"),
                submitButton: document.getElementById("registerButton"),
                submitLabel: document.querySelector(".register-submit-label"),
                submitLoader: document.querySelector(".register-submit-loader")
            };
        },

        bindEvents: function () {
            const elements = this.elements;

            elements.form.addEventListener(
                "submit",
                (event) => this.handleSubmit(event)
            );

            elements.form.addEventListener(
                "input",
                (event) => this.handleFormInput(event)
            );

            elements.form.addEventListener(
                "change",
                (event) => this.handleFormChange(event)
            );

            elements.form.querySelectorAll(
                "[data-password-toggle]"
            ).forEach((button) => {
                button.addEventListener("click", () => {
                    this.togglePassword(button);
                });
            });

            if (elements.password && elements.confirmPassword) {
                elements.password.addEventListener(
                    "input",
                    () => this.updatePasswordStrength()
                );

                elements.confirmPassword.addEventListener(
                    "input",
                    () => this.validatePasswordConfirmation()
                );
            }
        },

        handleFormInput: function (event) {
            const field = event.target;

            if (!field.matches("input, textarea, select")) {
                return;
            }

            this.hideFeedback();

            if (
                field.id === "password" ||
                field.id === "confirmPassword"
            ) {
                this.updatePasswordStrength();
            }
        },

        handleFormChange: function (event) {
            const field = event.target;

            if (
                field.id === "agreement" &&
                field.checked
            ) {
                const validation = this.getValidation();

                if (validation) {
                    validation.clearField(field);
                }
            }
        },

        initializePasswordToggles: function () {
            this.elements.form.querySelectorAll(
                "[data-password-toggle]"
            ).forEach((button) => {
                button.setAttribute(
                    "aria-pressed",
                    "false"
                );
            });
        },

        togglePassword: function (button) {
            const targetId = button.dataset.passwordToggle;
            const input = document.getElementById(targetId);

            if (!input) {
                return;
            }

            const showPassword = input.type === "password";

            input.type = showPassword ? "text" : "password";

            button.setAttribute(
                "aria-label",
                showPassword
                    ? "Sembunyikan password"
                    : "Tampilkan password"
            );

            button.setAttribute(
                "aria-pressed",
                String(showPassword)
            );

            const icon = document.createElement("i");

            icon.setAttribute(
                "data-lucide",
                showPassword ? "eye-off" : "eye"
            );

            icon.setAttribute("aria-hidden", "true");

            button.replaceChildren(icon);

            this.initializeIcons();
        },

        updatePasswordStrength: function () {
            const password = this.elements.password;

            if (!password) {
                return;
            }

            const result = this.calculatePasswordStrength(
                password.value
            );

            password.dataset.strength = result.level;

            document.dispatchEvent(
                new CustomEvent("sapa:password-strength", {
                    detail: {
                        score: result.score,
                        label: result.label,
                        level: result.level
                    }
                })
            );
        },

        calculatePasswordStrength: function (password) {
            if (!password) {
                return {
                    score: 0,
                    label: "Belum diisi",
                    level: "empty"
                };
            }

            let score = 0;

            if (password.length >= 8) score++;
            if (password.length >= 12) score++;
            if (/[a-z]/.test(password)) score++;
            if (/[A-Z]/.test(password)) score++;
            if (/[0-9]/.test(password)) score++;
            if (/[^a-zA-Z0-9]/.test(password)) score++;

            if (score <= 2) {
                return {
                    score,
                    label: "Lemah",
                    level: "weak"
                };
            }

            if (score <= 4) {
                return {
                    score,
                    label: "Sedang",
                    level: "medium"
                };
            }

            return {
                score,
                label: "Kuat",
                level: "strong"
            };
        },

        validatePasswordConfirmation: function () {
            const password = this.elements.password;
            const confirmation = this.elements.confirmPassword;

            if (!password || !confirmation) {
                return true;
            }

            if (!confirmation.value) {
                return true;
            }

            if (
                confirmation.dataset.validationTouched !== "true"
            ) {
                return password.value === confirmation.value;
            }

            const validation = this.getValidation();

            if (!validation) {
                return password.value === confirmation.value;
            }

            return validation.validateField(
                confirmation,
                false
            ).valid;
        },

        validateForm: function () {
            const validation = this.getValidation();

            if (!validation) {
                return {
                    valid: false,
                    errors: {
                        general: "Modul validasi belum tersedia."
                    },
                    invalidFields: []
                };
            }

            const result = validation.validateForm(
                this.elements.form
            );

            const agreement = this.elements.agreement;

            if (agreement && !agreement.checked) {
                const message =
                    "Kamu harus menyetujui ketentuan penggunaan dan kebijakan privasi.";

                validation.showFieldError(
                    agreement,
                    message
                );

                if (!result.invalidFields.includes(agreement)) {
                    result.invalidFields.push(agreement);
                }

                result.errors.agreement = message;
            }

            result.valid = result.invalidFields.length === 0;

            return result;
        },

        getPayload: function () {
            const elements = this.elements;

            return {
                name: elements.fullName.value.trim(),
                identifier: elements.identifier.value.trim(),
                email: elements.email.value.trim(),
                phone: elements.phone.value.trim(),
                password: elements.password.value,
                password_confirmation: elements.confirmPassword.value
            };
        },

        handleSubmit: async function (event) {
            event.preventDefault();

            if (this.isSubmitting) {
                return;
            }

            this.hideFeedback();

            const validation = this.validateForm();

            if (!validation.valid) {
                this.showFeedback(
                    "Periksa kembali data yang kamu masukkan.",
                    "error"
                );

                this.focusFirstInvalid(
                    validation.invalidFields
                );

                return;
            }

            const payload = this.getPayload();

            this.setLoading(true);

            try {
                const result = await this.submitRegistration(
                    payload
                );

                this.handleRegistrationSuccess(result);

            } catch (error) {
                this.handleRegistrationError(error);

            } finally {
                this.setLoading(false);
            }
        },

        submitRegistration: async function (payload) {
            const api = window.SAPA_API;

            if (
                !api ||
                typeof api.post !== "function"
            ) {
                throw new Error(
                    "Modul API belum tersedia. Periksa pemanggilan api.js."
                );
            }

            const controller = new AbortController();

            this.requestController = controller;

            const timeoutId = window.setTimeout(() => {
                controller.abort();
            }, this.config.timeout);

            try {
                const endpoint = this.getRegistrationEndpoint();

                const result = await api.post(
                    endpoint,
                    payload,
                    {
                        signal: controller.signal
                    }
                );

                return result;

            } catch (error) {
                if (error.name === "AbortError") {
                    const timeoutError = new Error(
                        "Permintaan pendaftaran terlalu lama. Silakan coba kembali."
                    );

                    timeoutError.type = "timeout";

                    throw timeoutError;
                }

                throw error;

            } finally {
                window.clearTimeout(timeoutId);
                this.requestController = null;
            }
        },

        getRegistrationEndpoint: function () {
            const config = window.SAPA.config || {};

            return (
                config.registerEndpoint ||
                this.config.endpoint
            );
        },

        handleRegistrationSuccess: function (result) {
            if (
                result &&
                (
                    result.success === false ||
                    result.status === "error"
                )
            ) {
                const error = new Error(
                    result.message ||
                    "Pendaftaran tidak dapat diproses."
                );

                error.data = result;

                throw error;
            }

            const message =
                result?.message ||
                "Pendaftaran berhasil diproses. Silakan masuk menggunakan akun yang telah didaftarkan.";

            this.showFeedback(message, "success");

            this.elements.form.reset();

            this.clearValidationStates();

            this.updatePasswordStrength();

            document.dispatchEvent(
                new CustomEvent("sapa:registration-success", {
                    detail: {
                        response: result
                    }
                })
            );

            this.showNotification(
                "Pendaftaran berhasil diproses.",
                "success"
            );

            if (this.config.redirectAfterSuccess) {
                window.location.assign(
                    this.config.loginUrl
                );
            }
        },

        handleRegistrationError: function (error) {
            const status = Number(error.status || 0);

            if (
                error.name === "NetworkError" ||
                error.name === "TypeError"
            ) {
                this.showFeedback(
                    "Tidak dapat terhubung ke server. Periksa koneksi internet atau status backend.",
                    "error"
                );

                return;
            }

            if (error.type === "timeout") {
                this.showFeedback(
                    error.message,
                    "error"
                );

                return;
            }

            if (status === 409) {
                this.showFeedback(
                    error.message ||
                    "Identitas atau email sudah terdaftar.",
                    "error"
                );

                return;
            }

            if (status === 422) {
                this.handleServerValidationErrors(
                    error.data
                );

                return;
            }

            if (status === 401 || status === 403) {
                this.showFeedback(
                    error.message ||
                    "Pendaftaran tidak memiliki izin untuk diproses.",
                    "error"
                );

                return;
            }

            if (status === 419) {
                this.showFeedback(
                    "Sesi keamanan telah berakhir. Silakan muat ulang halaman.",
                    "error"
                );

                return;
            }

            if (status === 429) {
                this.showFeedback(
                    "Terlalu banyak percobaan pendaftaran. Silakan tunggu beberapa saat.",
                    "error"
                );

                return;
            }

            if (status >= 500) {
                this.showFeedback(
                    "Server sedang mengalami gangguan. Silakan coba kembali nanti.",
                    "error"
                );

                return;
            }

            this.showFeedback(
                error.message ||
                "Terjadi kesalahan saat memproses pendaftaran.",
                "error"
            );
        },

        handleServerValidationErrors: function (data) {
            const errors = data?.errors || {};

            const fieldMapping = {
                name: "fullName",
                full_name: "fullName",
                identifier: "identifier",
                nis: "identifier",
                nisn: "identifier",
                email: "email",
                phone: "phone",
                password: "password",
                password_confirmation: "confirmPassword",
                agreement: "agreement"
            };

            const validation = this.getValidation();

            let firstInvalid = null;

            Object.entries(errors).forEach(([key, value]) => {
                const fieldId = fieldMapping[key];

                if (!fieldId) {
                    return;
                }

                const field = document.getElementById(fieldId);

                if (!field) {
                    return;
                }

                const message = Array.isArray(value)
                    ? value[0]
                    : String(value);

                if (validation) {
                    validation.showFieldError(
                        field,
                        message
                    );
                }

                if (!firstInvalid) {
                    firstInvalid = field;
                }
            });

            this.showFeedback(
                data?.message ||
                "Terdapat data yang belum sesuai dengan ketentuan.",
                "error"
            );

            if (firstInvalid) {
                firstInvalid.focus();
            }
        },

        showFeedback: function (message, type) {
            const feedback = this.elements.feedback;

            if (!feedback) {
                this.showNotification(message, type);
                return;
            }

            feedback.textContent = message;
            feedback.dataset.type = type;
            feedback.className = `register-feedback is-${type}`;
            feedback.hidden = false;
            feedback.setAttribute("role", "alert");
            feedback.setAttribute("aria-live", "polite");
        },

        hideFeedback: function () {
            const feedback = this.elements.feedback;

            if (!feedback) {
                return;
            }

            feedback.textContent = "";
            feedback.hidden = true;
            feedback.removeAttribute("data-type");
            feedback.className = "register-feedback";
        },

        showNotification: function (message, type) {
            const notifications =
                window.SAPA.notifications;

            if (!notifications) {
                return;
            }

            const method = notifications[type];

            if (typeof method === "function") {
                method.call(notifications, message);
            }
        },

        setLoading: function (loading) {
            this.isSubmitting = loading;

            const elements = this.elements;

            if (elements.submitButton) {
                elements.submitButton.disabled = loading;

                elements.submitButton.setAttribute(
                    "aria-busy",
                    String(loading)
                );
            }

            if (elements.submitLabel) {
                elements.submitLabel.textContent = loading
                    ? "Memproses Pendaftaran..."
                    : "Daftar Sekarang";
            }

            if (elements.submitLoader) {
                elements.submitLoader.hidden = !loading;
            }

            if (elements.form) {
                elements.form.querySelectorAll(
                    "input, select, textarea"
                ).forEach((input) => {
                    input.disabled = loading;
                });

                elements.form.querySelectorAll(
                    "[data-password-toggle]"
                ).forEach((button) => {
                    button.disabled = loading;
                });
            }
        },

        focusFirstInvalid: function (fields) {
            if (!fields || fields.length === 0) {
                return;
            }

            const field = fields[0];

            if (field && typeof field.focus === "function") {
                field.focus();
            }
        },

        clearValidationStates: function () {
            const validation = this.getValidation();

            if (validation) {
                validation.clearFormErrors(
                    this.elements.form
                );
            }

            this.elements.form.querySelectorAll(
                ".is-invalid, .is-valid"
            ).forEach((field) => {
                field.classList.remove(
                    "is-invalid",
                    "is-valid"
                );

                field.removeAttribute("aria-invalid");
            });

            this.elements.form.querySelectorAll(
                ".field-error"
            ).forEach((error) => {
                error.textContent = "";
                error.hidden = true;
            });
        },

        getValidation: function () {
            return window.SAPA.validation || null;
        },

        initializeYear: function () {
            const year = document.getElementById(
                "registerYear"
            );

            if (year) {
                year.textContent = new Date().getFullYear();
            }
        },

        initializeIcons: function () {
            if (
                window.lucide &&
                typeof window.lucide.createIcons === "function"
            ) {
                window.lucide.createIcons();
            }
        },

        cancelRequest: function () {
            if (this.requestController) {
                this.requestController.abort();
                this.requestController = null;
            }
        },

        destroy: function () {
            this.cancelRequest();

            this.initialized = false;
            this.isSubmitting = false;
            this.elements = {};
        }
    };

    window.SAPA.register = Register;

    function initializeRegister() {
        Register.init();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeRegister,
            { once: true }
        );
    } else {
        initializeRegister();
    }

    document.addEventListener(
        "sapa:ready",
        initializeRegister
    );

})(window, document);
