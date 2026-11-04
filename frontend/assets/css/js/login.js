
document.addEventListener("DOMContentLoaded", () => {
    const password = document.getElementById("password");
    const toggle = document.getElementById("togglePassword");
    const form = document.getElementById("loginForm");
    const message = document.getElementById("loginMessage");

    // Tampilkan atau sembunyikan password
    toggle.addEventListener("click", () => {
        const hidden = password.type === "password";

        password.type = hidden ? "text" : "password";
        toggle.textContent = hidden ? "Sembunyikan" : "Lihat";
        toggle.setAttribute(
            "aria-label",
            hidden ? "Sembunyikan password" : "Tampilkan password"
        );
    });

    // Form login sementara
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const identity = document.getElementById("identity").value.trim();
        const passwordValue = password.value;

        if (!identity || !passwordValue) {
            message.textContent = "Identitas dan password wajib diisi.";
            return;
        }

        message.textContent =
            "Tampilan siap. Sistem autentikasi akan dihubungkan ke FastAPI.";

        message.style.color = "#d5b8ff";
    });

    // Pemulihan password sementara
    document.getElementById("forgotPassword").addEventListener("click", (event) => {
        event.preventDefault();

        message.textContent =
            "Fitur pemulihan akun akan tersedia setelah backend dibuat.";
    });
});
