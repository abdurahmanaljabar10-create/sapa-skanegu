
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const $ = (id) => document.getElementById(id);

    const searchForm = $("helpSearchForm");
    const searchInput = $("helpSearchInput");
    const faqList = $("helpFaqList");
    const faqItems = Array.from(document.querySelectorAll(".help-faq-item"));
    const categoryButtons = document.querySelectorAll(".help-category-card");
    const noResults = $("helpNoResults");
    const faqCount = $("helpFaqCount");
    const resetSearch = $("resetHelpSearch");
    const showAllButton = $("showAllFaq");

    const questionForm = $("helpQuestionForm");
    const messageInput = $("helpMessage");
    const messageCount = $("helpMessageCount");
    const formNotice = $("helpFormNotice");

    const toast = $("helpToast");
    const toastMessage = $("helpToastMessage");

    let activeCategory = "all";
    let toastTimeout = null;

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

    const updateUser = () => {
        const topbarName = $("topbarUserName");
        const sidebarName = $("sidebarUserName");
        const topbarInitial = $("topbarUserInitial");
        const sidebarInitial = $("sidebarUserInitial");

        const name = topbarName?.textContent.trim() || "Siswa";
        const initial = name.charAt(0).toUpperCase();

        if (sidebarName) sidebarName.textContent = name;
        if (topbarInitial) topbarInitial.textContent = initial;
        if (sidebarInitial) sidebarInitial.textContent = initial;
    };

    const closeAllFaq = () => {
        faqItems.forEach((item) => {
            const button = item.querySelector(".help-faq-question");
            const answer = item.querySelector(".help-faq-answer");

            item.classList.remove("open");

            if (button) {
                button.setAttribute("aria-expanded", "false");
            }

            if (answer) {
                answer.hidden = true;
            }
        });
    };

    const openFaq = (item) => {
        const button = item.querySelector(".help-faq-question");
        const answer = item.querySelector(".help-faq-answer");

        if (!button || !answer) return;

        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
        answer.hidden = false;
    };

    const toggleFaq = (item) => {
        const button = item.querySelector(".help-faq-question");

        if (!button) return;

        const isOpen = button.getAttribute("aria-expanded") === "true";

        closeAllFaq();

        if (!isOpen) {
            openFaq(item);
        }
    };

    const filterFaq = () => {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        let visible = 0;

        faqItems.forEach((item) => {
            const category = item.dataset.category;
            const text = item.textContent.toLowerCase();

            const matchesCategory =
                activeCategory === "all" || category === activeCategory;

            const matchesSearch = !query || text.includes(query);
            const shouldShow = matchesCategory && matchesSearch;

            item.hidden = !shouldShow;

            if (shouldShow) {
                visible++;
            } else {
                item.classList.remove("open");

                const button = item.querySelector(".help-faq-question");
                const answer = item.querySelector(".help-faq-answer");

                if (button) button.setAttribute("aria-expanded", "false");
                if (answer) answer.hidden = true;
            }
        });

        if (faqCount) {
            faqCount.textContent = `${visible} pertanyaan`;
        }

        if (noResults) {
            noResults.hidden = visible !== 0;
        }

        if (faqList) {
            faqList.hidden = visible === 0;
        }

        return visible;
    };

    const setCategory = (category) => {
        activeCategory = category;

        categoryButtons.forEach((button) => {
            button.classList.toggle(
                "selected",
                button.dataset.category === category
            );
        });

        filterFaq();

        const section = $("helpFaqSection");

        if (section) {
            section.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "auto"
                    : "smooth",
                block: "start"
            });
        }
    };

    faqItems.forEach((item) => {
        const button = item.querySelector(".help-faq-question");

        if (button) {
            button.addEventListener("click", () => {
                toggleFaq(item);
            });
        }
    });

    categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setCategory(button.dataset.category);
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            activeCategory = "all";

            categoryButtons.forEach((button) => {
                button.classList.remove("selected");
            });

            filterFaq();
        });
    }

    if (searchForm) {
        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const visible = filterFaq();

            if (visible > 0) {
                $("helpFaqSection")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            } else {
                showToast("Pertanyaan tidak ditemukan. Coba kata kunci lain.");
            }
        });
    }

    document.querySelectorAll("[data-search-term]").forEach((button) => {
        button.addEventListener("click", () => {
            if (!searchInput) return;

            searchInput.value = button.dataset.searchTerm || "";
            activeCategory = "all";

            categoryButtons.forEach((categoryButton) => {
                categoryButton.classList.remove("selected");
            });

            filterFaq();

            $("helpFaqSection")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });

    if (resetSearch) {
        resetSearch.addEventListener("click", () => {
            if (searchInput) {
                searchInput.value = "";
            }

            activeCategory = "all";

            categoryButtons.forEach((button) => {
                button.classList.remove("selected");
            });

            closeAllFaq();
            filterFaq();
            showToast("Pencarian telah diatur ulang.");
        });
    }

    if (showAllButton) {
        showAllButton.addEventListener("click", () => {
            if (searchInput) {
                searchInput.value = "";
            }

            activeCategory = "all";

            categoryButtons.forEach((button) => {
                button.classList.remove("selected");
            });

            closeAllFaq();
            filterFaq();

            $("helpFaqSection")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }

    if (messageInput && messageCount) {
        const updateMessageCount = () => {
            messageCount.textContent = `${messageInput.value.length} / 1500`;
        };

        messageInput.addEventListener("input", updateMessageCount);
        updateMessageCount();
    }

    if (questionForm) {
        questionForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (formNotice) {
                formNotice.hidden = true;
                formNotice.textContent = "";
            }

            if (!questionForm.reportValidity()) {
                showToast("Periksa kembali isian formulir.");
                return;
            }

            const message = messageInput?.value.trim() || "";

            if (message.length < 15) {
                if (formNotice) {
                    formNotice.hidden = false;
                    formNotice.textContent = "Pertanyaan harus berisi minimal 15 karakter.";
                }

                messageInput?.focus();
                return;
            }

            if (formNotice) {
                formNotice.hidden = false;
                formNotice.textContent =
                    "Pemeriksaan formulir berhasil. Namun, pertanyaan belum dikirim karena integrasi API backend belum tersedia. Tidak ada pesan yang tersimpan atau diteruskan ke pihak sekolah.";
            }

            showToast("Pemeriksaan formulir berhasil.");
            formNotice.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        });
    }

    updateDate();
    updateUser();
    filterFaq();
    refreshIcons();
});
