
document.addEventListener("DOMContentLoaded", () => {
    const layer = document.getElementById("starLayer");

    if (!layer) return;

    const totalStars = window.innerWidth < 600 ? 65 : 130;

    for (let i = 0; i < totalStars; i++) {
        const star = document.createElement("span");

        star.className = "star";

        const size = Math.random() * 2.2 + 0.6;

        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        star.style.setProperty(
            "--duration",
            `${Math.random() * 4 + 2}s`
        );

        star.style.setProperty(
            "--delay",
            `${Math.random() * 5}s`
        );

        layer.appendChild(star);
    }
});
