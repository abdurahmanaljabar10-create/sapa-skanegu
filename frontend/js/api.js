
(function (window) {
    "use strict";

    window.SAPA = window.SAPA || {};

    let API_BASE_URL = String(
        window.SAPA_API_BASE_URL || ""
    ).replace(/\/+$/, "");

    const DEFAULT_HEADERS = {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest"
    };

    function normalizeEndpoint(endpoint) {
        const value = String(endpoint || "").trim();

        if (!value) {
            throw new Error("Endpoint API belum ditentukan.");
        }

        if (/^https?:\/\//i.test(value)) {
            return value;
        }

        return `${API_BASE_URL}/${value.replace(/^\/+/, "")}`;
    }

    function getCookie(name) {
        const prefix = `${name}=`;

        const cookies = document.cookie.split(";");

        for (let cookie of cookies) {
            cookie = cookie.trim();

            if (cookie.startsWith(prefix)) {
                return cookie.substring(prefix.length);
            }
        }

        return null;
    }

    function getHeaders(options) {
        const headers = {
            ...DEFAULT_HEADERS,
            ...(options.headers || {})
        };

        const csrfMeta = document.querySelector(
            'meta[name="csrf-token"]'
        );

        if (csrfMeta && csrfMeta.content) {
            headers["X-CSRF-TOKEN"] = csrfMeta.content;
        }

        const csrfCookie = getCookie("XSRF-TOKEN");

        if (csrfCookie && !headers["X-XSRF-TOKEN"]) {
            headers["X-XSRF-TOKEN"] =
                decodeURIComponent(csrfCookie);
        }

        return headers;
    }

    async function parseResponse(response) {
        const contentType = response.headers.get(
            "content-type"
        ) || "";

        if (contentType.includes("application/json")) {
            try {
                return await response.json();
            } catch (error) {
                return null;
            }
        }

        const text = await response.text();

        if (!text) {
            return null;
        }

        return {
            message: text
        };
    }

    function createHttpError(response, data) {
        const message =
            data?.message ||
            data?.error ||
            `Permintaan gagal (${response.status}).`;

        const error = new Error(message);

        error.name = "ApiError";
        error.status = response.status;
        error.data = data;
        error.response = response;

        return error;
    }

    async function request(endpoint, options = {}) {
        const url = normalizeEndpoint(endpoint);

        const headers = getHeaders(options);

        const config = {
            method: options.method || "GET",
            headers: headers,
            credentials: options.credentials || "include",
            cache: options.cache || "no-store",
            redirect: options.redirect || "follow"
        };

        if (options.signal) {
            config.signal = options.signal;
        }

        if (options.body !== undefined && options.body !== null) {
            if (
                options.body instanceof FormData ||
                options.body instanceof Blob
            ) {
                config.body = options.body;
            } else if (typeof options.body === "string") {
                config.body = options.body;

                if (!headers["Content-Type"]) {
                    headers["Content-Type"] =
                        "application/json";
                }
            } else {
                config.body = JSON.stringify(options.body);

                headers["Content-Type"] =
                    "application/json";
            }
        }

        let response;

        try {
            response = await fetch(url, config);
        } catch (error) {
            if (error.name === "AbortError") {
                throw error;
            }

            const networkError = new Error(
                "Tidak dapat terhubung ke server. Periksa koneksi atau status backend."
            );

            networkError.name = "NetworkError";
            networkError.originalError = error;

            throw networkError;
        }

        const data = await parseResponse(response);

        if (!response.ok) {
            throw createHttpError(response, data);
        }

        return data;
    }

    const API = {
        request: request,

        get: function (endpoint, options = {}) {
            return request(endpoint, {
                ...options,
                method: "GET"
            });
        },

        post: function (endpoint, data, options = {}) {
            return request(endpoint, {
                ...options,
                method: "POST",
                body: data
            });
        },

        put: function (endpoint, data, options = {}) {
            return request(endpoint, {
                ...options,
                method: "PUT",
                body: data
            });
        },

        patch: function (endpoint, data, options = {}) {
            return request(endpoint, {
                ...options,
                method: "PATCH",
                body: data
            });
        },

        delete: function (endpoint, options = {}) {
            return request(endpoint, {
                ...options,
                method: "DELETE"
            });
        },

        setBaseUrl: function (url) {
            API_BASE_URL = String(url || "").replace(/\/+$/, "");

            window.SAPA_API_BASE_URL = API_BASE_URL;

            return API_BASE_URL;
        },

        getBaseUrl: function () {
            return API_BASE_URL;
        },

        setDefaultHeader: function (name, value) {
            if (!name) {
                return false;
            }

            DEFAULT_HEADERS[name] = value;

            return true;
        },

        removeDefaultHeader: function (name) {
            if (!name) {
                return false;
            }

            delete DEFAULT_HEADERS[name];

            return true;
        },

        getDefaultHeaders: function () {
            return {
                ...DEFAULT_HEADERS
            };
        }
    };

    window.SAPA_API = API;

    window.SAPA.api = API;

    window.SAPA_API_BASE_URL = API_BASE_URL;

})(window);
