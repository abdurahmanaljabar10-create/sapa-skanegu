
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const $ = (id) => document.getElementById(id);

    const form = $("profileForm");
    const editButton = $("editProfileButton");
    const cancelButton = $("cancelProfileButton");
    const formActions = $("profileFormActions");
    const saveButton = $("saveProfileButton");

    const profileFields = [
        "fullName",
        "studentNumber",
        "studentClass",
        "email",
        "phone",
        "gender",
        "address"
    ];

    const storageKey = "sapa-skanegu-profile-v1";

    const defaultProfile = {
        fullName: "Nama Siswa",
        studentNumber: "",
        studentClass: "",
        email: "",
        phone: "",
        gender: "",
        address: "",
        username: ""
    };

    let profile = { ...defaultProfile };
    let originalProfile = { ...defaultProfile };
    let editing = false;
    let toastTimeout = null;
    let previousFocus = null;

    const toast = $("profileToast");
    const toastMessage = $("profileToastMessage");
    const passwordModal = $("passwordModal");
    const passwordForm = $("passwordForm");
    const passwordError = $("passwordError");

    const refreshIcons = () => {
        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    };

    const showToast = (message) => {
        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;
        toast.classList.add("show");

        window.clearTimeout(toastTimeout);

        toastTimeout = window.setTimeout(() => {
            toast.classList.remove("show");
        }, 2800);
    };

    const loadProfile = () => {
        try {
            const saved = localStorage.getItem(storageKey);

            if (!saved) {
                return { ...defaultProfile };
            }

            const parsed = JSON.parse(saved);

            if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
                return { ...defaultProfile };
            }

            return {
                ...defaultProfile,
                ...Object.fromEntries(
                    Object.entries(parsed).filter(([key, value]) => {
                        return profileFields.includes(key) || key === "username";
                    })
                )
            };
        } catch (error) {
            console.error("Gagal membaca profil:", error);
            return { ...defaultProfile };
        }
    };

    const saveProfile = () => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(profile));
            return true;
        } catch (error) {
            console.error("Gagal menyimpan profil:", error);
            showToast("Profil gagal disimpan di browser.");
            return false;
        }
    };

    const getInitial = (name) => {
        const value = String(name || "").trim();
        return value ? value.charAt(0).toUpperCase() : "S";
    };

    const updateIdentity = () => {
        const name = profile.fullName.trim() || "Nama Siswa";
        const initial = getInitial(name);
        const className = profile.studentClass.trim() || "Kelas belum diisi";

        const displayName = $("profileDisplayName");
        const displayClass = $("profileDisplayClass");
        const profileInitial = $("profileInitial");
        const sidebarInitial = $("sidebarUserInitial");
        const topbarInitial = $("topbarUserInitial");
        const sidebarName = $("sidebarUserName");
        const topbarName = $("topbarUserName");
        const username = $("accountUsername");

        if (displayName) displayName.textContent = name;
        if (displayClass) displayClass.textContent = className;
        if (profileInitial) profileInitial.textContent = initial;
        if (sidebarInitial) sidebarInitial.textContent = initial;
        if (topbarInitial) topbarInitial.textContent = initial;
        if (sidebarName) sidebarName.textContent = name;
        if (topbarName) topbarName.textContent = name;

        if (username) {
            username.textContent = profile.username || "Belum tersedia";
        }
    };

    const updateCompletion = () => {
        const requiredFields = [
            "fullName",
            "studentClass",
            "email",
            "phone",
            "gender",
            "address"
        ];

        const completed = requiredFields.filter((field) => {
            return String(profile[field] || "").trim().length > 0;
        }).length;

        const percentage = Math.round((completed / requiredFields.length) * 100);
        const completion = $("profileCompletion");
        const bar = $("profileCompletionBar");
        const text = $("profileCompletionText");

        if (completion) {
            completion.textContent = percentage === 100
                ? "Profil lengkap"
                : `${percentage}% lengkap`;
        }

        if (bar) {
            bar.style.width = `${percentage}%`;
        }

        if (text) {
            text.textContent = `${completed} dari ${requiredFields.length} informasi telah diisi.`;
        }
    };

    const renderProfile = () => {
        profileFields.forEach((field) => {
            const input = $(field);

            if (input) {
                input.value = profile[field] || "";
            }
        });

        updateIdentity();
        updateCompletion();
    };

    const setEditing = (enabled) => {
        editing = enabled;

        profileFields.forEach((field) => {
            const input = $(field);

            if (input) {
                input.disabled = !enabled;

                if (field === "studentNumber") {
                    input.disabled = true;
                }
            }
        });

        if (formActions) {
            formActions.hidden = !enabled;
        }

        if (editButton) {
            editButton.hidden = enabled;
        }

        if (enabled) {
            originalProfile = { ...profile };

            const firstInput = $("fullName");

            if (firstInput) {
                firstInput.focus();
            }
        }
    };

    const clearErrors = () => {
        ["fullNameError", "emailError", "phoneError"].forEach((id) => {
            const error = $(id);

            if (error) {
                error.textContent = "";
            }
        });
    };

    const validateProfile = () => {
        clearErrors();

        let valid = true;

        const name = $("fullName");
        const email = $("email");
        const phone = $("phone");

        if (name && !name.value.trim()) {
            $("fullNameError").textContent = "Nama lengkap wajib diisi.";
            valid = false;
        }

        if (email && email.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email.value.trim())) {
                $("emailError").textContent = "Format email belum benar.";
                valid = false;
            }
        }

        if (phone && phone.value.trim()) {
            const phoneValue = phone.value.replace(/[\s-]/g, "");
            const phonePattern = /^\+?[0-9]{9,15}$/;

            if (!phonePattern.test(phoneValue)) {
                $("phoneError").textContent = "Nomor telepon harus berisi 9–15 angka.";
                valid = false;
            }
        }

        return valid;
    };

    const collectFormData = () => {
        profileFields.forEach((field) => {
            const input = $(field);

            if (input) {
                profile[field] = input.value.trim();
            }
        });

        profile.studentNumber = originalProfile.studentNumber || "";
        profile.username = originalProfile.username || "";
    };

    const updateDate = () => {
        const dateElement = $("currentDate");

        if (!dateElement) return;

        dateElement.textContent = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date());
    };

    const openPasswordModal = () => {
        if (!passwordModal) return;

        previousFocus = document.activeElement;
        passwordModal.classList.add("open");
        passwordModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("profile-modal-open");

        const firstInput = $("currentPassword");

        if (firstInput) {
            firstInput.focus();
        }
    };

    const closePasswordModal = () => {
        if (!passwordModal) return;

        passwordModal.classList.remove("open");
        passwordModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("profile-modal-open");

        if (passwordForm) {
            passwordForm.reset();
        }

        if (passwordError) {
            passwordError.textContent = "";
        }

        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
    };

    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!editing) return;

            if (!validateProfile()) {
                showToast("Periksa kembali informasi yang belum benar.");
                return;
            }

            collectFormData();

            if (!saveProfile()) return;

            originalProfile = { ...profile };
            renderProfile();
            setEditing(false);
            showToast("Profil berhasil disimpan di browser.");
        });
    }

    if (editButton) {
        editButton.addEventListener("click", () => {
            clearErrors();
            setEditing(true);
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", () => {
            profile = { ...originalProfile };
            renderProfile();
            clearErrors();
            setEditing(false);
            showToast("Perubahan profil dibatalkan.");
        });
    }

    if (passwordForm) {
        passwordForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (passwordError) {
                passwordError.textContent = "";
            }

            const current = $("currentPassword").value;
            const next = $("newPassword").value;
            const confirmation = $("confirmPassword").value;

            if (current.length < 8 || next.length < 8 || confirmation.length < 8) {
                passwordError.textContent = "Setiap kata sandi minimal 8 karakter.";
                return;
            }

            if (next === current) {
                passwordError.textContent = "Kata sandi baru harus berbeda.";
                return;
            }

            if (next !== confirmation) {
                passwordError.textContent = "Konfirmasi kata sandi tidak sama.";
                return;
            }

            closePasswordModal();
            showToast("Pemeriksaan berhasil. Perubahan kata sandi belum terhubung ke server.");
        });
    }

    const passwordButtons = [
        $("openPasswordButton"),
        $("securityPasswordButton")
    ];

    passwordButtons.forEach((button) => {
        if (button) {
            button.addEventListener("click", openPasswordModal);
        }
    });

    const closePasswordButton = $("closePasswordModal");

    if (closePasswordButton) {
        closePasswordButton.addEventListener("click", closePasswordModal);
    }

    if (passwordModal) {
        passwordModal.addEventListener("click", (event) => {
            if (event.target === passwordModal) {
                closePasswordModal();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && passwordModal?.classList.contains("open")) {
            closePasswordModal();
        }
    });

    profile = loadProfile();
    originalProfile = { ...profile };

    renderProfile();
    updateDate();
    setEditing(false);
    refreshIcons();
});
