
document.addEventListener("DOMContentLoaded", () => {
    const dateElement = document.getElementById("currentDate");

    if (dateElement) {
        dateElement.textContent = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date());
    }

    if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
    }
});
