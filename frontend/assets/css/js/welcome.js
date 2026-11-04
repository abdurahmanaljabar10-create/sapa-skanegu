
document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.querySelector(".primary-button");

    if (!startButton) return;

    startButton.addEventListener("click", () => {
        window.location.href = "login.html";
    });
});
