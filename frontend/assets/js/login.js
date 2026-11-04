
/* =================================
   SAPA-SKANEGU LOGIN CONTROLLER
================================= */

const params = new URLSearchParams(window.location.search);
const selectedRole = params.get("role") || "siswa";

const title = document.getElementById("loginTitle");
const description = document.getElementById("loginDescription");

const studentFields = document.getElementById("studentFields");
const teacherFields = document.getElementById("teacherFields");
const principalFields = document.getElementById("principalFields");

const registerOption = document.getElementById("studentRegisterOption");
const staffNote = document.getElementById("staffNote");

const loginForm = document.getElementById("loginForm");
const loginPassword = document.getElementById("loginPassword");
const loginMessage = document.getElementById("loginMessage");

const teacherRole = document.getElementById("teacherRole");
const homeroomGroup = document.getElementById("homeroomGroup");
const homeroomClass = document.getElementById("homeroomClass");

// =================================
// 1. ATUR TAMPILAN SESUAI JENIS AKUN
// =================================

const roleSettings = {
    siswa: {
        title: "Masuk sebagai Siswa",
        description: "Masukkan identitas dan kelas siswa.",
        fields: studentFields
    },

    guru: {
        title: "Masuk sebagai Guru",
        description: "Masukkan identitas dan peran di sekolah.",
        fields: teacherFields
    },

    "kepala-sekolah": {
        title: "Masuk sebagai Kepala Sekolah",
        description: "Masukkan identitas akun kepala sekolah.",
        fields: principalFields
    }
};

const currentRole = roleSettings[selectedRole] || roleSettings.siswa;

title.textContent = currentRole.title;
description.textContent = currentRole.description;

// Sembunyikan semua kolom terlebih dahulu
[studentFields, teacherFields, principalFields].forEach(section => {
    section.hidden = true;

    section.querySelectorAll("input, select").forEach(input => {
        input.required = false;
        input.disabled = true;
    });
});

// Tampilkan kolom yang sesuai
currentRole.fields.hidden = false;

currentRole.fields.querySelectorAll("input, select").forEach(input => {
    input.required = true;
    input.disabled = false;
});

// Pendaftaran hanya untuk siswa
registerOption.hidden = selectedRole !== "siswa";
staffNote.hidden = selectedRole === "siswa";

// =================================
// 2. PASSWORD SHOW / HIDE
// =================================

const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {
    const isHidden = loginPassword.type === "password";

    loginPassword.type = isHidden ? "text" : "password";
    togglePassword.setAttribute("aria-pressed", String(isHidden));
    togglePassword.setAttribute(
        "aria-label",
        isHidden ? "Sembunyikan password" : "Tampilkan password"
    );

    togglePassword.innerHTML = isHidden
        ? `<svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 3l18 18"/>
              <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/>
              <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3.1 3.9"/>
              <path d="M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7c1.1 0 2.1-.2 3-.5"/>
           </svg>`
        : `<svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
           </svg>`;
});

// =================================
// 3. PILIH PERAN GURU
// =================================

teacherRole.addEventListener("change", () => {
    const isHomeroom = teacherRole.value === "wali-kelas";

    homeroomGroup.hidden = !isHomeroom;
    homeroomClass.required = isHomeroom;
    homeroomClass.disabled = !isHomeroom;

    if (!isHomeroom) {
        homeroomClass.value = "";
    }
});

// =================================
// 4. BATASI NISN HANYA ANGKA
// =================================

const studentNisn = document.getElementById("studentNisn");

studentNisn.addEventListener("input", () => {
    studentNisn.value = studentNisn.value
        .replace(/\D/g, "")
        .slice(0, 10);
});

// =================================
// 5. PESAN STATUS
// =================================

function showLoginMessage(message, type = "error") {
    loginMessage.textContent = message;
    loginMessage.className = "login-message " + type;
}

// =================================
// 6. VALIDASI FORM
// =================================

loginForm.addEventListener("submit", (event) => {
    // Mencegah halaman reload dan menghapus isian
    event.preventDefault();

    const password = loginPassword.value.trim();

    if (selectedRole === "siswa") {
        const name = document.getElementById("studentName").value.trim();
        const nisn = studentNisn.value.trim();
        const classValue = document.getElementById("studentClass").value;

        if (!name || !/^\d{10}$/.test(nisn) || !classValue) {
            showLoginMessage(
                "Nama, NISN 10 digit, dan kelas wajib diisi."
            );
            return;
        }
    }

    if (selectedRole === "guru") {
        const name = document.getElementById("teacherName").value.trim();
        const nip = document.getElementById("teacherNip").value.trim();

        if (!name || !nip || !teacherRole.value) {
            showLoginMessage(
                "Nama, NIP, dan peran di sekolah wajib diisi."
            );
            return;
        }

        if (
            teacherRole.value === "wali-kelas" &&
            !homeroomClass.value.trim()
        ) {
            showLoginMessage(
                "Kelas yang diampu wajib diisi untuk wali kelas."
            );
            return;
        }
    }

    if (selectedRole === "kepala-sekolah") {
        const name = document.getElementById("principalName").value.trim();
        const nip = document.getElementById("principalNip").value.trim();

        if (!name || !nip) {
            showLoginMessage("Nama dan NIP wajib diisi.");
            return;
        }
    }

    if (password.length < 8) {
        showLoginMessage("Password minimal 8 karakter.");
        loginPassword.focus();
        return;
    }

    showLoginMessage(
        "Data berhasil divalidasi. Autentikasi akun belum aktif karena backend belum terhubung.",
        "success"
    );
});

// =================================
// 7. LUPA PASSWORD
// =================================

document.getElementById("forgotPassword").addEventListener(
    "click",
    (event) => {
        event.preventDefault();

        showLoginMessage(
            "Fitur pemulihan password akan tersedia setelah backend dibuat.",
            "error"
        );
    }
);
