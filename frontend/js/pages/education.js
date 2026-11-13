
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("educationSearch");
    const sortSelect = document.getElementById("educationSort");
    const categoryButtons = document.querySelectorAll("[data-category]");
    const materialCards = Array.from(document.querySelectorAll(".education-material-card"));
    const resultCount = document.getElementById("educationResultCount");
    const noResults = document.getElementById("educationNoResults");
    const activeFilter = document.getElementById("educationActiveFilter");
    const filterText = document.getElementById("educationFilterText");
    const clearFilter = document.getElementById("educationClearFilter");
    const resetSearch = document.getElementById("educationResetSearch");

    const modal = document.getElementById("educationModal");
    const modalTitle = document.getElementById("educationModalTitle");
    const modalCategory = document.getElementById("educationModalCategory");
    const modalBody = document.getElementById("educationModalBody");
    const modalIcon = document.getElementById("educationModalIcon");

    let selectedCategory = "all";
    let lastFocusedElement = null;

    const categoryNames = {
        all: "Semua materi",
        bullying: "Mengenal Bullying",
        cyber: "Cyberbullying",
        mental: "Kesehatan Mental",
        protection: "Perlindungan Diri"
    };

    const materials = {
        bullying: {
            title: "Mengenal Bullying dan Bentuk-Bentuknya",
            category: "Mengenal Bullying",
            icon: "users-round",
            content: `
                <p>Bullying atau perundungan adalah perilaku agresif yang dilakukan secara berulang oleh seseorang atau sekelompok orang terhadap orang lain, ketika terdapat ketidakseimbangan kekuatan sehingga pihak yang menjadi sasaran mengalami kesulitan untuk membela diri.</p>
                <h3>Bentuk-bentuk bullying</h3>
                <ul>
                    <li><strong>Fisik:</strong> memukul, menendang, mendorong, atau merusak barang milik orang lain.</li>
                    <li><strong>Verbal:</strong> mengejek, menghina, mengancam, atau memberikan julukan yang menyakitkan.</li>
                    <li><strong>Sosial atau relasional:</strong> mengucilkan, menyebarkan rumor, atau sengaja merusak hubungan pertemanan.</li>
                    <li><strong>Digital:</strong> menggunakan media digital untuk mempermalukan, mengancam, atau menyakiti orang lain.</li>
                </ul>
                <h3>Mengapa perlu dikenali?</h3>
                <p>Memahami bentuk perundungan membantu siswa mengenali perilaku yang tidak sehat dan mengetahui kapan perlu mencari bantuan.</p>
                <div class="education-modal-note"><strong>Ingat:</strong> konflik biasa dan bullying tidak selalu sama. Perhatikan pola perilaku, pengulangan, serta ketidakseimbangan kekuatan dalam suatu kejadian.</div>
            `
        },
        cyber: {
            title: "Cyberbullying di Media Sosial",
            category: "Cyberbullying",
            icon: "smartphone",
            content: `
                <p>Cyberbullying merupakan tindakan menyakiti, mempermalukan, mengintimidasi, atau mengganggu seseorang melalui teknologi digital, seperti media sosial, aplikasi pesan, forum, maupun platform permainan daring.</p>
                <h3>Contoh perilaku cyberbullying</h3>
                <ul>
                    <li>Mengirim pesan berisi hinaan atau ancaman.</li>
                    <li>Menyebarkan foto, video, atau informasi pribadi tanpa izin.</li>
                    <li>Membuat unggahan untuk mempermalukan seseorang.</li>
                    <li>Mengucilkan seseorang secara sengaja dalam ruang komunikasi digital.</li>
                </ul>
                <h3>Bagaimana menjaga diri?</h3>
                <ul>
                    <li>Atur privasi akun dan jangan sembarangan membagikan informasi pribadi.</li>
                    <li>Simpan bukti pesan atau unggahan yang merugikan.</li>
                    <li>Gunakan fitur blokir dan laporkan akun jika diperlukan.</li>
                    <li>Ceritakan kejadian kepada orang dewasa yang dipercaya.</li>
                </ul>
                <div class="education-modal-note"><strong>Jangan membalas dengan kekerasan digital.</strong> Utamakan keselamatan, simpan bukti, dan cari dukungan.</div>
            `
        },
        mental: {
            title: "Dampak Bullying terhadap Kesehatan Mental",
            category: "Kesehatan Mental",
            icon: "heart-pulse",
            content: `
                <p>Perundungan dapat memengaruhi kesejahteraan emosional dan psikologis seseorang. Dampaknya bisa berbeda pada setiap individu.</p>
                <h3>Dampak yang mungkin dirasakan</h3>
                <ul>
                    <li>Merasa takut, sedih, malu, atau tidak nyaman.</li>
                    <li>Menurunnya rasa percaya diri.</li>
                    <li>Kesulitan berkonsentrasi atau kehilangan semangat belajar.</li>
                    <li>Menarik diri dari pergaulan.</li>
                    <li>Mengalami stres atau kecemasan.</li>
                </ul>
                <h3>Hal yang dapat dilakukan</h3>
                <p>Jangan memendam perasaan sendirian. Bicaralah dengan orang yang dipercaya, seperti keluarga, wali kelas, guru BK, atau tenaga profesional ketika membutuhkan dukungan lebih lanjut.</p>
                <div class="education-modal-note"><strong>Pesan penting:</strong> mengalami perundungan bukan kesalahan korban. Setiap siswa berhak mendapatkan perlindungan dan dukungan.</div>
            `
        },
        protection: {
            title: "Apa yang Harus Dilakukan Saat Mengalami Bullying?",
            category: "Perlindungan Diri",
            icon: "shield-check",
            content: `
                <p>Jika kamu mengalami perundungan, keselamatan dan kondisi dirimu adalah prioritas. Kamu tidak harus menyelesaikan situasi tersebut sendirian.</p>
                <h3>Langkah yang dapat dilakukan</h3>
                <ul>
                    <li>Utamakan keselamatan dan menjauh dari situasi yang membahayakan jika memungkinkan.</li>
                    <li>Ceritakan kejadian kepada orang dewasa yang dipercaya.</li>
                    <li>Catat waktu, tempat, dan kejadian yang dialami jika situasinya aman.</li>
                    <li>Simpan bukti jika perundungan terjadi secara digital.</li>
                    <li>Hubungi wali kelas, guru BK, atau pihak sekolah untuk meminta bantuan.</li>
                </ul>
                <h3>Jika keadaan darurat</h3>
                <p>Segera cari bantuan orang dewasa atau pihak sekolah yang dapat memberikan perlindungan.</p>
                <div class="education-modal-note"><strong>Kamu berhak merasa aman.</strong> Meminta bantuan bukan tanda kelemahan.</div>
            `
        },
        friend: {
            title: "Cara Menjadi Teman yang Mendukung",
            category: "Perlindungan Diri",
            icon: "hand-heart",
            content: `
                <p>Jika melihat teman mengalami perundungan, sikap peduli dapat membantu mereka merasa tidak sendirian.</p>
                <h3>Hal yang bisa dilakukan</h3>
                <ul>
                    <li>Dengarkan cerita teman tanpa menyalahkan atau menghakimi.</li>
                    <li>Tunjukkan bahwa kamu peduli dan bersedia mendampingi.</li>
                    <li>Jangan ikut menertawakan, menyebarkan rumor, atau membagikan konten yang merendahkan.</li>
                    <li>Ajak teman mencari bantuan dari wali kelas atau guru BK.</li>
                    <li>Laporkan kejadian kepada pihak yang tepat jika diperlukan.</li>
                </ul>
                <h3>Hindari tindakan ini</h3>
                <p>Jangan melakukan konfrontasi yang berisiko, menyebarkan identitas korban, atau membalas pelaku dengan kekerasan.</p>
                <div class="education-modal-note"><strong>Menjadi teman yang baik</strong> berarti mendukung, mendengarkan, dan membantu mencari jalan yang aman.</div>
            `
        },
        digital: {
            title: "Bijak Berkomunikasi di Dunia Digital",
            category: "Cyberbullying",
            icon: "globe-2",
            content: `
                <p>Ruang digital merupakan bagian dari kehidupan sehari-hari. Etika dan sikap saling menghargai juga perlu diterapkan ketika berkomunikasi melalui internet.</p>
                <h3>Kebiasaan digital yang sehat</h3>
                <ul>
                    <li>Pikirkan dampak sebelum mengunggah komentar atau konten.</li>
                    <li>Gunakan bahasa yang sopan dan tidak merendahkan.</li>
                    <li>Hormati privasi dan jangan membagikan informasi orang lain tanpa izin.</li>
                    <li>Periksa kebenaran informasi sebelum menyebarkannya.</li>
                    <li>Hindari ikut menyebarkan konten yang mempermalukan seseorang.</li>
                </ul>
                <h3>Jika menemukan konten berbahaya</h3>
                <p>Jangan ikut menyebarkan. Gunakan fitur pelaporan pada platform dan mintalah bantuan orang dewasa jika konten tersebut mengancam keselamatan seseorang.</p>
                <div class="education-modal-note"><strong>Jejak digital dapat bertahan lama.</strong> Gunakan internet secara bertanggung jawab dan saling menghormati.</div>
            `
        }
    };

    const renderIcons = () => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    };

    const updateMaterials = () => {
        const query = searchInput.value.trim().toLowerCase();
        const sortMode = sortSelect.value;

        let visibleCards = materialCards.filter((card) => {
            const categoryMatch = selectedCategory === "all" || card.dataset.category === selectedCategory;
            const searchableText = `${card.dataset.title} ${card.dataset.keywords} ${card.dataset.category}`.toLowerCase();
            return categoryMatch && (!query || searchableText.includes(query));
        });

        if (sortMode === "az") {
            visibleCards.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title, "id"));
        }

        materialCards.forEach((card) => {
            card.hidden = !visibleCards.includes(card);
        });

        const grid = document.getElementById("educationMaterialGrid");

        visibleCards.forEach((card) => {
            grid.appendChild(card);
        });

        resultCount.textContent = `${visibleCards.length} materi`;
        noResults.hidden = visibleCards.length !== 0;
        activeFilter.hidden = selectedCategory === "all" && !query;

        filterText.textContent = query
            ? `${categoryNames[selectedCategory]} · Pencarian: "${searchInput.value.trim()}"`
            : categoryNames[selectedCategory];
    };

    const setCategory = (category) => {
        selectedCategory = category;

        categoryButtons.forEach((button) => {
            const active = button.dataset.category === category;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        updateMaterials();
    };

    categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setCategory(button.dataset.category);

            document.getElementById("educationMaterialGrid").scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                block: "start"
            });
        });
    });

    searchInput.addEventListener("input", updateMaterials);
    sortSelect.addEventListener("change", updateMaterials);

    const resetFilters = () => {
        searchInput.value = "";
        sortSelect.value = "default";
        setCategory("all");
    };

    clearFilter.addEventListener("click", resetFilters);
    resetSearch.addEventListener("click", resetFilters);

    const openModal = (materialKey, trigger) => {
        const material = materials[materialKey];

        if (!material) {
            return;
        }

        lastFocusedElement = trigger;
        modalTitle.textContent = material.title;
        modalCategory.textContent = material.category.toUpperCase();
        modalBody.innerHTML = material.content;
        modalIcon.innerHTML = `<i data-lucide="${material.icon}"></i>`;

        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        renderIcons();
        modal.querySelector(".education-modal-close").focus();
    };

    const closeModal = () => {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    };

    document.querySelectorAll("[data-material]").forEach((button) => {
        button.addEventListener("click", () => {
            openModal(button.dataset.material, button);
        });
    });

    modal.querySelectorAll("[data-modal-close]").forEach((button) => {
        button.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("open")) {
            closeModal();
        }
    });

    
const quizQuestions = [
    {
        question: "Apa yang dimaksud dengan bullying?",
        options: [
            "Perbedaan pendapat antara dua teman",
            "Perilaku menyakiti yang dilakukan berulang dan melibatkan ketidakseimbangan kekuatan",
            "Bercanda bersama teman yang disukai semua orang"
        ],
        answer: 1,
        explanation: "Bullying melibatkan perilaku agresif berulang dan ketidakseimbangan kekuatan yang membuat pihak yang menjadi sasaran sulit membela diri."
    },
    {
        question: "Apa tindakan yang tepat ketika melihat teman mengalami bullying?",
        options: [
            "Merekam dan menyebarkan kejadian tersebut",
            "Membalas pelaku dengan kekerasan",
            "Mendukung teman dan membantu mencari pertolongan yang aman"
        ],
        answer: 2,
        explanation: "Dukung teman tanpa menghakimi dan bantu mencari pertolongan dari orang dewasa atau pihak sekolah yang tepat."
    },
    {
        question: "Apa yang sebaiknya dilakukan ketika mengalami cyberbullying?",
        options: [
            "Menyimpan bukti dan mencari bantuan",
            "Menyebarkan data pribadi pelaku",
            "Membalas dengan hinaan yang lebih keras"
        ],
        answer: 0,
        explanation: "Simpan bukti, gunakan fitur blokir atau laporkan, dan ceritakan kepada orang dewasa yang dipercaya."
    }
];

let quizIndex = 0;
let quizScore = 0;
let selectedAnswer = null;
let quizAnswered = false;

const quizCard = document.getElementById("educationQuizCard");
const quizResult = document.getElementById("educationQuizResult");
const quizQuestion = document.getElementById("educationQuizQuestion");
const quizNumber = document.getElementById("educationQuizNumber");
const quizProgressText = document.getElementById("educationQuizProgressText");
const quizProgressBar = document.getElementById("educationQuizProgressBar");
const quizScoreLabel = document.getElementById("educationQuizScoreLabel");
const quizOptions = document.getElementById("educationQuizOptions");
const quizFeedback = document.getElementById("educationQuizFeedback");
const quizHint = document.getElementById("educationQuizHint");
const quizNext = document.getElementById("educationQuizNext");

const renderQuizQuestion = () => {
    const question = quizQuestions[quizIndex];

    selectedAnswer = null;
    quizAnswered = false;

    quizProgressText.textContent = `PERTANYAAN ${quizIndex + 1} DARI ${quizQuestions.length}`;
    quizScoreLabel.textContent = `Skor: ${quizScore}`;
    quizProgressBar.style.width = `${((quizIndex + 1) / quizQuestions.length) * 100}%`;
    quizNumber.textContent = String(quizIndex + 1).padStart(2, "0");
    quizQuestion.textContent = question.question;

    quizFeedback.hidden = true;
    quizFeedback.classList.remove("incorrect");
    quizHint.textContent = "Pilih satu jawaban untuk melanjutkan.";
    quizNext.disabled = true;
    quizNext.innerHTML = 'Jawab pertanyaan <i data-lucide="arrow-right"></i>';

    quizOptions.replaceChildren();

    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "education-quiz-option";
        button.dataset.answer = String(index);

        const letter = document.createElement("span");
        letter.textContent = String.fromCharCode(65 + index);

        const text = document.createElement("strong");
        text.textContent = option;

        const indicator = document.createElement("span");
        indicator.className = "education-quiz-state";
        indicator.textContent = "○";

        button.append(letter, text, indicator);
        quizOptions.appendChild(button);
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
};

quizOptions.addEventListener("click", (event) => {
    const button = event.target.closest(".education-quiz-option");

    if (!button || quizAnswered) {
        return;
    }

    selectedAnswer = Number(button.dataset.answer);

    quizOptions.querySelectorAll(".education-quiz-option").forEach((option) => {
        option.classList.remove("selected");
        option.querySelector(".education-quiz-state").textContent = "○";
    });

    button.classList.add("selected");
    button.querySelector(".education-quiz-state").textContent = "◉";

    quizNext.disabled = false;
    quizHint.textContent = "Jawaban sudah dipilih. Klik tombol untuk memeriksa jawaban.";
});

quizNext.addEventListener("click", () => {
    if (!quizAnswered) {
        if (selectedAnswer === null) {
            return;
        }

        const question = quizQuestions[quizIndex];
        const isCorrect = selectedAnswer === question.answer;

        quizAnswered = true;

        if (isCorrect) {
            quizScore += 1;
        }

        quizOptions.querySelectorAll(".education-quiz-option").forEach((button) => {
            const answer = Number(button.dataset.answer);
            const indicator = button.querySelector(".education-quiz-state");

            button.disabled = true;

            if (answer === question.answer) {
                button.classList.add("correct");
                indicator.textContent = "✓";
            } else if (answer === selectedAnswer) {
                button.classList.add("incorrect");
                indicator.textContent = "✕";
            }
        });

        quizFeedback.hidden = false;
        quizFeedback.classList.toggle("incorrect", !isCorrect);
        quizFeedback.textContent = `${isCorrect ? "Benar!" : "Belum tepat."} ${question.explanation}`;

        quizScoreLabel.textContent = `Skor: ${quizScore}`;
        quizHint.textContent = "Baca penjelasan sebelum melanjutkan.";

        quizNext.innerHTML = quizIndex === quizQuestions.length - 1
            ? 'Lihat hasil <i data-lucide="award"></i>'
            : 'Pertanyaan berikutnya <i data-lucide="arrow-right"></i>';

        if (window.lucide) {
            window.lucide.createIcons();
        }

        return;
    }

    if (quizIndex === quizQuestions.length - 1) {
        quizCard.hidden = true;
        quizResult.hidden = false;

        document.getElementById("educationResultScore").textContent =
            `${quizScore}/${quizQuestions.length}`;

        const title = document.getElementById("educationResultTitle");
        const message = document.getElementById("educationResultMessage");

        if (quizScore === quizQuestions.length) {
            title.textContent = "Luar biasa! Semua jawabanmu benar.";
            message.textContent = "Pemahamanmu sudah baik. Terus sebarkan sikap peduli dan saling menghargai.";
        } else if (quizScore >= 2) {
            title.textContent = "Bagus! Kamu sudah memahami sebagian besar materi.";
            message.textContent = "Pelajari kembali materi yang belum kamu kuasai dan terus tingkatkan kepedulian.";
        } else {
            title.textContent = "Tetap semangat belajar!";
            message.textContent = "Tidak masalah jika belum semuanya benar. Baca materi edukasi lalu coba lagi.";
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }

        return;
    }

    quizIndex += 1;
    renderQuizQuestion();
});

document.getElementById("educationQuizRestart").addEventListener("click", () => {
    quizIndex = 0;
    quizScore = 0;
    selectedAnswer = null;
    quizAnswered = false;

    quizCard.hidden = false;
    quizResult.hidden = true;

    renderQuizQuestion();
});

    const mythQuestions = [
        {
            statement: "“Bullying hanya terjadi jika seseorang mengalami kekerasan fisik.”",
            answer: false,
            explanation: "Mitos. Bullying juga dapat berbentuk verbal, sosial atau relasional, serta digital."
        },
        {
            statement: "“Menyebarkan hinaan kepada seseorang melalui media sosial dapat termasuk cyberbullying.”",
            answer: true,
            explanation: "Fakta. Tindakan digital yang bertujuan menyakiti, mempermalukan, atau mengintimidasi orang lain dapat termasuk cyberbullying."
        },
        {
            statement: "“Meminta bantuan guru BK ketika mengalami bullying adalah tindakan yang tepat.”",
            answer: true,
            explanation: "Fakta. Guru BK dan pihak sekolah dapat membantu memberikan pendampingan serta mengupayakan perlindungan."
        }
    ];

    let mythIndex = 0;
    let mythAnswered = false;

    const mythStatement = document.getElementById("educationMythStatement");
    const mythFeedback = document.getElementById("educationMythFeedback");
    const mythNext = document.getElementById("educationMythNext");
    const mythButtons = document.querySelectorAll("[data-myth-answer]");

    const renderMyth = () => {
        mythAnswered = false;
        mythStatement.textContent = mythQuestions[mythIndex].statement;
        mythFeedback.hidden = true;
        mythFeedback.classList.remove("incorrect");
        mythNext.hidden = true;

        mythButtons.forEach((button) => {
            button.disabled = false;
            button.classList.remove("selected");
        });
    };

    mythButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (mythAnswered) {
                return;
            }

            const selected = button.dataset.mythAnswer === "true";
            const question = mythQuestions[mythIndex];
            const correct = selected === question.answer;

            mythAnswered = true;

            mythButtons.forEach((item) => {
                item.disabled = true;
                item.classList.toggle("selected", item === button);
            });

            mythFeedback.hidden = false;
            mythFeedback.classList.toggle("incorrect", !correct);
            mythFeedback.textContent = `${correct ? "Tepat!" : "Belum tepat."} ${question.explanation}`;

            mythNext.hidden = false;
            mythNext.innerHTML = mythIndex === mythQuestions.length - 1
                ? 'Ulangi dari awal <i data-lucide="refresh-cw"></i>'
                : 'Pernyataan berikutnya <i data-lucide="arrow-right"></i>';

            renderIcons();
        });
    });

    mythNext.addEventListener("click", () => {
        mythIndex = mythIndex === mythQuestions.length - 1 ? 0 : mythIndex + 1;
        renderMyth();
    });

    updateMaterials();
    renderQuizQuestion();
    renderMyth();
    renderIcons();
});
