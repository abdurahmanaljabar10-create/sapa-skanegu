
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("helpSearch");
    const faqList = document.getElementById("helpFaqList");
    const faqItems = [...document.querySelectorAll(".sa-help-faq-item")];
    const categoryButtons = [...document.querySelectorAll(".sa-help-category")];
    const noResults = document.getElementById("helpNoResults");
    const toast = document.getElementById("helpToast");
    const currentDate = document.getElementById("helpCurrentDate");
    const emailButton = document.getElementById("helpEmailButton");

    if (!searchInput || !faqList || !noResults || !toast) {
        console.error("Elemen Pusat Bantuan tidak ditemukan.");
        return;
    }

    let activeCategory = "all";
    let toastTimer;

    function refreshIcons() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");

        window.clearTimeout(toastTimer);

        toastTimer = window.setTimeout(() => {
            toast.classList.remove("show");
        }, 2800);
    }

    function normalizeText(value) {
        return String(value || "").toLowerCase().trim();
    }

    function filterFAQs() {
        const keyword = normalizeText(searchInput.value);
        let visibleCount = 0;

        faqItems.forEach(item => {
            const category = item.dataset.category;
            const question = item.querySelector(".sa-help-faq-question");
            const answer = item.querySelector(".sa-help-faq-answer");

            const searchableText = normalizeText(
                `${question?.textContent || ""} ${answer?.textContent || ""}`
            );

            const matchesCategory =
                activeCategory === "all" || category === activeCategory;

            const matchesKeyword =
                keyword === "" || searchableText.includes(keyword);

            const visible = matchesCategory && matchesKeyword;

            item.hidden = !visible;

            if (visible) {
                visibleCount++;
            } else {
                item.classList.remove("open");

                const button = item.querySelector(".sa-help-faq-question");
                const answerPanel = item.querySelector(".sa-help-faq-answer");

                if (button) button.setAttribute("aria-expanded", "false");
                if (answerPanel) answerPanel.hidden = true;
            }
        });

        noResults.hidden = visibleCount !== 0;
        refreshIcons();
    }

    function setActiveCategory(category) {
        activeCategory = category;

        categoryButtons.forEach(button => {
            const active = button.dataset.category === category;

            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        filterFAQs();
    }

    function toggleFAQ(item) {
        const button = item.querySelector(".sa-help-faq-question");
        const answer = item.querySelector(".sa-help-faq-answer");

        if (!button || !answer) return;

        const willOpen = !item.classList.contains("open");

        faqItems.forEach(otherItem => {
            otherItem.classList.remove("open");

            const otherButton = otherItem.querySelector(".sa-help-faq-question");
            const otherAnswer = otherItem.querySelector(".sa-help-faq-answer");

            if (otherButton) {
                otherButton.setAttribute("aria-expanded", "false");
            }

            if (otherAnswer) {
                otherAnswer.hidden = true;
            }
        });

        if (willOpen) {
            item.classList.add("open");
            button.setAttribute("aria-expanded", "true");
            answer.hidden = false;
        }

        refreshIcons();
    }

    searchInput.addEventListener("input", filterFAQs);

    searchInput.addEventListener("keydown", event => {
        if (event.key !== "Enter") return;

        event.preventDefault();

        const firstVisible = faqItems.find(item => !item.hidden);

        if (firstVisible) {
            firstVisible.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            toggleFAQ(firstVisible);
        } else {
            showToast("Pertanyaan yang dicari belum tersedia.");
        }
    });

    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            setActiveCategory(button.dataset.category);
        });
    });

    faqList.addEventListener("click", event => {
        const button = event.target.closest(".sa-help-faq-question");

        if (!button) return;

        const item = button.closest(".sa-help-faq-item");

        if (item) {
            toggleFAQ(item);
        }
    });

    document.querySelectorAll('a[href^="#help-"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");
            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });

    if (currentDate) {
        currentDate.textContent = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date());
    }

    if (emailButton) {
        emailButton.addEventListener("click", event => {
            if (!emailButton.getAttribute("href") || emailButton.getAttribute("href") === "mailto:") {
                event.preventDefault();
                showToast("Kontak email pengelola belum dikonfigurasi.");
            }
        });
    }

    const sidebarToggle = document.querySelector("[data-sidebar-toggle]");
    const sidebarClose = document.querySelector("[data-sidebar-close]");
    const sidebarOverlay = document.querySelector("[data-sidebar-overlay]");
    const sidebar = document.querySelector("[data-sidebar]");

    function closeSidebar() {
        if (!sidebar) return;

        sidebar.classList.remove("active");
        sidebarOverlay?.classList.remove("active");
        document.body.classList.remove("sidebar-open");
        sidebarToggle?.setAttribute("aria-expanded", "false");
    }

    sidebarToggle?.addEventListener("click", () => {
        if (!sidebar) return;

        const isOpen = sidebar.classList.toggle("active");

        sidebarOverlay?.classList.toggle("active", isOpen);
        document.body.classList.toggle("sidebar-open", isOpen);
        sidebarToggle.setAttribute("aria-expanded", String(isOpen));
    });

    sidebarClose?.addEventListener("click", closeSidebar);
    sidebarOverlay?.addEventListener("click", closeSidebar);

    document.querySelectorAll(".sidebar-link").forEach(link => {
        link.addEventListener("click", closeSidebar);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeSidebar();
        }
    });

    filterFAQs();
    refreshIcons();
});
