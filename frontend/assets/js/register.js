
// ===================================
// SAPA-SKANEGU - REGISTER JAVASCRIPT
// ===================================

const registerForm = document.getElementById("registerForm");

const fullName = document.getElementById("fullName");
const nisn = document.getElementById("nisn");
const className = document.getElementById("studentClass");
const major = document.getElementById("major");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const registerMessage = document.getElementById("registerMessage");

// ===================================
// 1. SHOW / HIDE PASSWORD
// ===================================

document.querySelectorAll(".toggle-password").forEach(button => {
    button.addEventListener("click", () => {
        const target = document.getElementById(button.dataset.target);

        if (target.type === "password") {
            target.type = "text";
            button.textContent = "◎";
        } else {
            target.type = "password";
            button.textContent = "◉";
        }
    });
});

// ===================================
// 2. INPUT NISN - HANYA ANGKA
// ===================================

nisn.addEventListener("input", () => {
    nisn.value = nisn.value.replace(/\D/g, "").slice(0, 10);
});

// ===================================
// 3. PASSWORD STRENGTH CHECKER
// ===================================

password.addEventListener("input", () => {
    const value = password.value;

    let score = 0;

    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    const levels = [
        { width: "0%", text: "Kekuatan password", color: "transparent" },
        { width: "20%", text: "Sangat lemah", color: "#ff647c" },
        { width: "40%", text: "Lemah", color: "#ff9b62" },
        { width: "60%", text: "Cukup", color: "#e9cb66" },
        { width: "80%", text: "Kuat", color: "#8edbba" },
        { width: "100%", text: "Sangat kuat", color: "#69e6b1" }
    ];

    const level = value.length === 0
        ? levels[0]
        : levels[score];

    strengthBar.style.width = level.width;
    strengthBar.style.background = level.color;
    strengthText.textContent = level.text;
});

// ===================================
// 4. MESSAGE HELPER
// ===================================

function showMessage(message, type) {
    registerMessage.textContent = message;
    registerMessage.className = "register-message " + type;
}

// ===================================
// 5. FORM VALIDATION
// ===================================

registerForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const nameValue = fullName.value.trim();
    const nisnValue = nisn.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value;
    const confirmValue = confirmPassword.value;

    // Nama
    if (nameValue.length < 3) {
        showMessage("Nama lengkap minimal 3 karakter.", "error");
        fullName.focus();
        return;
    }

    // NISN
    if (!/^\d{10}$/.test(nisnValue)) {
        showMessage("NISN harus terdiri dari 10 angka.", "error");
        nisn.focus();
        return;
    }

    // Kelas
    if (!className.value) {
        showMessage("Silakan pilih tingkat kelas.", "error");
        className.focus();
        return;
    }

    // Jurusan
    if (!major.value) {
        showMessage("Silakan pilih jurusan.", "error");
        major.focus();
        return;
    }

    // Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        showMessage("Format email belum benar.", "error");
        email.focus();
        return;
    }

    // Password
    if (passwordValue.length < 8) {
        showMessage("Password minimal harus 8 karakter.", "error");
        password.focus();
        return;
    }

    // Konfirmasi password
    if (passwordValue !== confirmValue) {
        showMessage("Konfirmasi password tidak sama.", "error");
        confirmPassword.focus();
        return;
    }

    // Persetujuan
    if (!document.getElementById("agreeTerms").checked) {
        showMessage("Silakan setujui ketentuan penggunaan terlebih dahulu.", "error");
        return;
    }

    // Demo sementara
    showMessage(
        "Validasi berhasil! Form sudah siap. Pendaftaran akun belum aktif karena backend belum dihubungkan.",
        "success"
    );
});
