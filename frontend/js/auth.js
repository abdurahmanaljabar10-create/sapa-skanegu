
(function (window, document) {
    "use strict";

    window.SAPA = window.SAPA || {};

    const Auth = {
        initialized: false,
        isSubmitting: false,
        isRedirecting: false,
        requestController: null,

        config: {
            loginEndpoint: "/api/login",
            logoutEndpoint: "/api/logout",
            timeout: 20000,
            redirectAfterLogin: true,
            defaultRedirect: "../index.html"
        },

        elements: {},

        roleRedirects: {
            siswa: "/pages/student/dashboard.html",
            guru: "/pages/teacher/dashboard.html",
            wali_kelas: "/pages/homeroom/dashboard.html",
            guru_bk: "/pages/counselor/dashboard.html",
            kepala_sekolah: "/pages/principal/dashboard.html",
            tenaga_kependidikan: "/pages/staff/dashboard.html",
            admin: "/pages/admin/dashboard.html"
        },

        roleAliases: {
            student: "siswa",
            siswa: "siswa",
            teacher: "guru",
            guru: "guru",
            homeroom: "wali_kelas",
            wali_kelas: "wali_kelas",
            wali_kelas_siswa: "wali_kelas",
            counselor: "guru_bk",
            guru_bk: "guru_bk",
            principal: "kepala_sekolah",
            kepala_sekolah: "kepala_sekolah",
            staff: "tenaga_kependidikan",
            tenaga_kependidikan: "tenaga_kependidikan",
            administrator: "admin",
            admin: "admin"
        },

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
            this.initializeAccessibility();
            this.initializePasswordToggle();
            this.initializeIcons();

            return this;
        },

        cacheElements: function () {
            this.elements = {
                form: document.getElementById("login-form"),
                identity: document.getElementById("identity"),
                password: document.getElementById("password"),
                remember: document.getElementById("remember-me"),
                passwordToggle: document.getElementById("password-toggle"),
                submitButton: document.getElementById("login-submit"),
                submitLabel: document.querySelector(
                    "#login-submit .button-label"
                ),
                submitLoader: document.querySelector(
                    "#login-submit .button-loading-indicator"
                ),
                feedback: document.getElementById("form-feedback"),
                identityError: document.getElementById("identity-error"),
                passwordError: document.getElementById("password-error"),
                forgotLink: document.getElementById("forgot-link")
            };
        },

        bindEvents: function () {
            const elements = this.elements;

            elements.form.addEventListener(
                "submit",
                (event) => this.handleSubmit(event)
            );

            if (elements.identity) {
                elements.identity.addEventListener(
                    "input",
                    () => this.clearFieldError(
                        elements.identity,
                        elements.identityError
                    )
                );
            }

            if (elements.password) {
                elements.password.addEventListener(
                    "input",
                    () => this.clearFieldError(
                        elements.password,
                        elements.passwordError
                    )
                );
            }

            if (elements.passwordToggle) {
                elements.passwordToggle.addEventListener(
                    "click",
                    () => this.togglePassword()
                );
            }

            if (elements.forgotLink) {
                elements.forgotLink.addEventListener(
                    "click",
                    (event) => this.handleForgotPassword(event)
                );
            }
        },

        initializeAccessibility: function () {
            const elements = this.elements;

            if (elements.identity) {
                elements.identity.setAttribute(
                    "aria-required",
                    "true"
                );

                if (elements.identityError) {
                    elements.identity.setAttribute(
                        "aria-describedby",
                        elements.identityError.id
                    );
                }
            }

            if (elements.password) {
                elements.password.setAttribute(
                    "aria-required",
                    "true"
                );

                if (elements.passwordError) {
                    elements.password.setAttribute(
                        "aria-describedby",
                        elements.passwordError.id
                    );
                }
            }
        },

        initializePasswordToggle: function () {
            const button = this.elements.passwordToggle;

            if (!button) {
                return;
            }

            button.setAttribute(
                "aria-label",
                "Tampilkan password"
            );

            button.setAttribute(
                "aria-pressed",
                "false"
            );
        },

        togglePassword: function () {
            const password = this.elements.password;
            const button = this.elements.passwordToggle;

            if (!password || !button) {
                return;
            }

            const showPassword = password.type === "password";

            password.type = showPassword ? "text" : "password";

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

        validateForm: function () {
            const elements = this.elements;
            const errors = [];
            const invalidFields = [];

            this.clearFeedback();

            if (!elements.identity || !elements.identity.value.trim()) {
                errors.push({
                    field: elements.identity,
                    target: elements.identityError,
                    message: "Masukkan email atau identitas akun."
                });

                invalidFields.push(elements.identity);
            } else if (elements.identity.value.trim().length < 3) {
                errors.push({
                    field: elements.identity,
                    target: elements.identityError,
                    message: "Identitas minimal 3 karakter."
                });

                invalidFields.push(elements.identity);
            } else if (elements.identity.value.trim().length > 100) {
                errors.push({
                    field: elements.identity,
                    target: elements.identityError,
                    message: "Identitas maksimal 100 karakter."
                });

                invalidFields.push(elements.identity);
            }

            if (!elements.password || !elements.password.value) {
                errors.push({
                    field: elements.password,
                    target: elements.passwordError,
                    message: "Masukkan password."
                });

                invalidFields.push(elements.password);
            } else if (elements.password.value.length > 255) {
                errors.push({
                    field: elements.password,
                    target: elements.passwordError,
                    message: "Password terlalu panjang."
                });

                invalidFields.push(elements.password);
            }

            errors.forEach((error) => {
                this.showFieldError(
                    error.field,
                    error.target,
                    error.message
                );
            });

            return {
                valid: errors.length === 0,
                errors: errors,
                invalidFields: invalidFields
            };
        },

        handleSubmit: async function (event) {
            event.preventDefault();

            if (this.isSubmitting || this.isRedirecting) {
                return;
            }

            const validation = this.validateForm();

            if (!validation.valid) {
                this.showFeedback(
                    "Periksa kembali identitas dan password kamu.",
                    "error"
                );

                const firstInvalid = validation.invalidFields[0];

                if (firstInvalid) {
                    firstInvalid.focus();
                }

                return;
            }

            const payload = this.getLoginPayload();

            this.setLoading(true);

            try {
                const result = await this.requestLogin(payload);

                const user = this.extractUser(result);

                if (!user) {
                    throw new Error(
                        "Server tidak mengembalikan informasi pengguna."
                    );
                }

                const role = this.normalizeRole(
                    this.extractRole(user)
                );

                if (!role) {
                    throw new Error(
                        "Role akun tidak dikenali. Hubungi administrator sekolah."
                    );
                }

                if (!this.roleRedirects[role]) {
                    throw new Error(
                        "Halaman dashboard untuk role ini belum tersedia."
                    );
                }

                this.handleLoginSuccess(user, role, result);

            } catch (error) {
                this.handleLoginError(error);

            } finally {
                if (!this.isRedirecting) {
                    this.setLoading(false);
                }
            }
        },

        getLoginPayload: function () {
            return {
                identifier: this.elements.identity.value.trim(),
                password: this.elements.password.value,
                remember: Boolean(
                    this.elements.remember &&
                    this.elements.remember.checked
                )
            };
        },

        requestLogin: async function (payload) {
            const api = window.SAPA_API;

            if (!api || typeof api.post !== "function") {
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
                const config = window.SAPA.config || {};

                const endpoint =
                    config.loginEndpoint ||
                    this.config.loginEndpoint;

                return await api.post(
                    endpoint,
                    payload,
                    {
                        signal: controller.signal
                    }
                );

            } catch (error) {
                if (error.name === "AbortError") {
                    const timeoutError = new Error(
                        "Permintaan login terlalu lama. Silakan coba kembali."
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

        extractUser: function (result) {
            if (!result || typeof result !== "object") {
                return null;
            }

            if (result.user) {
                return result.user;
            }

            if (result.data && result.data.user) {
                return result.data.user;
            }

            if (
                result.data &&
                (
                    result.data.role ||
                    result.data.roles
                )
            ) {
                return result.data;
            }

            return null;
        },

        extractRole: function (user) {
            if (!user) {
                return null;
            }

            if (typeof user.role === "string") {
                return user.role;
            }

            if (
                user.role &&
                typeof user.role === "object"
            ) {
                return (
                    user.role.name ||
                    user.role.slug ||
                    user.role.code ||
                    null
                );
            }

            if (Array.isArray(user.roles) && user.roles.length) {
                const firstRole = user.roles[0];

                if (typeof firstRole === "string") {
                    return firstRole;
                }

                if (firstRole && typeof firstRole === "object") {
                    return (
                        firstRole.name ||
                        firstRole.slug ||
                        firstRole.code ||
                        null
                    );
                }
            }

            return null;
        },

        normalizeRole: function (role) {
            if (!role) {
                return null;
            }

            const normalized = String(role)
                .trim()
                .toLowerCase()
                .replace(/[\s-]+/g, "_");

            return this.roleAliases[normalized] || null;
        },

        handleLoginSuccess: function (user, role, result) {
            this.isRedirecting = true;

            this.showFeedback(
                "Login berhasil. Mengarahkan ke dashboard...",
                "success"
            );

            document.dispatchEvent(
                new CustomEvent("sapa:login-success", {
                    detail: {
                        user: user,
                        role: role,
                        response: result
                    }
                })
            );

            this.redirectByRole(role);
        },

        redirectByRole: function (role) {
            const destination = this.roleRedirects[role];

            if (!destination) {
                this.isRedirecting = false;

                throw new Error(
                    "Tujuan dashboard tidak ditemukan."
                );
            }

            window.location.assign(destination);
        },

        handleLoginError: function (error) {
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

            if (status === 401 || status === 422) {
                this.showFeedback(
                    "Identitas atau password yang kamu masukkan tidak sesuai.",
                    "error"
                );

                return;
            }

            if (status === 403) {
                this.showFeedback(
                    error.message ||
                    "Akun kamu belum memiliki izin untuk mengakses sistem.",
                    "error"
                );

                return;
            }

            if (status === 419) {
                this.showFeedback(
                    "Sesi keamanan telah berakhir. Muat ulang halaman dan coba kembali.",
                    "error"
                );

                return;
            }

            if (status === 429) {
                this.showFeedback(
                    "Terlalu banyak percobaan login. Silakan tunggu beberapa saat.",
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
                "Terjadi kesalahan saat login.",
                "error"
            );
        },

        handleForgotPassword: function (event) {
            event.preventDefault();

            this.showFeedback(
                "Fitur pemulihan password belum tersedia. Silakan hubungi administrator sekolah.",
                "info"
            );
        },

        showFieldError: function (field, errorElement, message) {
            if (field) {
                field.classList.add("is-invalid");
                field.classList.remove("is-valid");
                field.setAttribute("aria-invalid", "true");
            }

            if (errorElement) {
                errorElement.textContent = message;
                errorElement.hidden = false;
            }
        },

        clearFieldError: function (field, errorElement) {
            if (field) {
                field.classList.remove("is-invalid");
                field.classList.add("is-valid");
                field.setAttribute("aria-invalid", "false");
            }

            if (errorElement) {
                errorElement.textContent = "";
                errorElement.hidden = true;
            }
        },

        showFeedback: function (message, type) {
            const feedback = this.elements.feedback;

            if (!feedback) {
                this.showNotification(message, type);
                return;
            }

            feedback.textContent = message;
            feedback.className = `form-feedback is-${type}`;
            feedback.dataset.type = type;
            feedback.hidden = false;
            feedback.setAttribute("role", "alert");
            feedback.setAttribute("aria-live", "polite");
        },

        clearFeedback: function () {
            const feedback = this.elements.feedback;

            if (!feedback) {
                return;
            }

            feedback.textContent = "";
            feedback.hidden = true;
            feedback.removeAttribute("data-type");
            feedback.className = "form-feedback";
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
                    ? "Memproses..."
                    : "Masuk";
            }

            if (elements.submitLoader) {
                elements.submitLoader.hidden = !loading;
            }

            if (elements.identity) {
                elements.identity.disabled = loading;
            }

            if (elements.password) {
                elements.password.disabled = loading;
            }

            if (elements.remember) {
                elements.remember.disabled = loading;
            }

            if (elements.passwordToggle) {
                elements.passwordToggle.disabled = loading;
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

        getCookie: function (name) {
            const prefix = `${name}=`;

            const cookies = document.cookie.split(";");

            for (let cookie of cookies) {
                cookie = cookie.trim();

                if (cookie.startsWith(prefix)) {
                    return cookie.substring(prefix.length);
                }
            }

            return null;
        },

        logout: async function () {
            const api = window.SAPA_API;

            if (!api || typeof api.post !== "function") {
                throw new Error("Modul API belum tersedia.");
            }

            const config = window.SAPA.config || {};

            const endpoint =
                config.logoutEndpoint ||
                this.config.logoutEndpoint;

            try {
                await api.post(endpoint, {});

                document.dispatchEvent(
                    new CustomEvent("sapa:logout-success")
                );

                window.location.assign(
                    this.config.defaultRedirect
                );

            } catch (error) {
                this.showNotification(
                    error.message ||
                    "Gagal keluar dari akun.",
                    "error"
                );

                throw error;
            }
        },

        destroy: function () {
            this.cancelRequest();

            this.initialized = false;
            this.isSubmitting = false;
            this.isRedirecting = false;

            this.elements = {};
        },

        cancelRequest: function () {
            if (this.requestController) {
                this.requestController.abort();
                this.requestController = null;
            }
        }
    };

    window.SAPA.auth = Auth;

    function initializeAuth() {
        Auth.init();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeAuth,
            { once: true }
        );
    } else {
        initializeAuth();
    }

    document.addEventListener(
        "sapa:ready",
        initializeAuth
    );

})(window, document);
