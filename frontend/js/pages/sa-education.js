
document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "sapa_kesiswaan_education_v2";

    const initialMaterials = [
        {
            id: "EDU-001",
            title: "Mengenali dan Mencegah Bullying di Sekolah",
            category: "Anti-Bullying",
            summary: "Memahami bentuk perundungan, dampaknya, dan langkah yang dapat dilakukan untuk mencegahnya.",
            content: "PENGERTIAN BULLYING\n\nBullying atau perundungan merupakan tindakan menyakiti, merendahkan, mengintimidasi, atau mengucilkan orang lain yang dilakukan secara berulang atau melibatkan ketimpangan kekuatan.\n\nBENTUK PERUNDUNGAN\n\n1. Fisik: memukul, menendang, mendorong, atau merusak barang.\n2. Verbal: mengejek, menghina, mengancam, atau memberi julukan buruk.\n3. Sosial: mengucilkan, mempermalukan, atau menyebarkan rumor.\n4. Digital: mengirim pesan menyakitkan, menyebarkan foto tanpa izin, atau melakukan penghinaan melalui media sosial.\n\nLANGKAH PENCEGAHAN\n\n1. Menghargai perbedaan.\n2. Tidak ikut menyebarkan ejekan atau rumor.\n3. Mendukung teman yang mengalami perundungan.\n4. Menyimpan bukti jika terjadi perundungan digital.\n5. Melaporkan kejadian kepada Wali Kelas, Guru BK, atau Kesiswaan.\n\nSekolah yang aman terbentuk ketika seluruh warga sekolah berani mencegah perundungan dan saling menghormati.",
            status: "published",
            createdAt: "2026-11-10T08:00:00"
        },
        {
            id: "EDU-002",
            title: "Membangun Budaya Disiplin di Lingkungan Sekolah",
            category: "Kedisiplinan",
            summary: "Membiasakan sikap disiplin melalui tanggung jawab, ketepatan waktu, dan kepatuhan terhadap aturan.",
            content: "PENTINGNYA KEDISIPLINAN\n\nDisiplin merupakan kebiasaan menaati aturan dan melaksanakan tanggung jawab secara sadar. Kedisiplinan membantu menciptakan kegiatan belajar yang tertib dan nyaman.\n\nCONTOH PERILAKU DISIPLIN\n\n1. Datang ke sekolah tepat waktu.\n2. Mengikuti kegiatan pembelajaran sesuai jadwal.\n3. Menggunakan seragam sesuai ketentuan.\n4. Menjaga kebersihan kelas dan lingkungan sekolah.\n5. Menyelesaikan tugas dengan tanggung jawab.\n\nMEMBANGUN KEBIASAAN\n\nMulailah dari tindakan sederhana, seperti menyiapkan perlengkapan sekolah, mengatur waktu, dan menaati kesepakatan bersama.",
            status: "published",
            createdAt: "2026-11-10T09:00:00"
        },
        {
            id: "EDU-003",
            title: "Memahami Tata Tertib dan Tanggung Jawab Siswa",
            category: "Tata Tertib",
            summary: "Mengenal aturan sekolah, hak siswa, dan tanggung jawab dalam kegiatan pendidikan.",
            content: "TUJUAN TATA TERTIB\n\nTata tertib dibuat untuk menjaga ketertiban, keamanan, dan kenyamanan seluruh warga sekolah.\n\nTANGGUNG JAWAB SISWA\n\n1. Mematuhi peraturan sekolah.\n2. Menghormati guru, tenaga kependidikan, dan sesama siswa.\n3. Menjaga fasilitas sekolah.\n4. Mengikuti kegiatan sekolah sesuai ketentuan.\n5. Menjaga nama baik sekolah.\n\nHAK SISWA\n\nSiswa berhak mendapatkan lingkungan belajar yang aman, memperoleh perlakuan yang adil, menyampaikan pendapat secara bertanggung jawab, dan memperoleh perlindungan sesuai ketentuan yang berlaku.\n\nPENYELESAIAN PELANGGARAN\n\nSetiap pelanggaran perlu ditangani berdasarkan fakta, ketentuan sekolah, dan tingkat pelanggaran. Siswa perlu diberikan kesempatan untuk menjelaskan kejadian dan memahami konsekuensi tindakannya.",
            status: "published",
            createdAt: "2026-11-10T10:00:00"
        },
        {
            id: "EDU-004",
            title: "Membangun Karakter Saling Menghargai",
            category: "Karakter",
            summary: "Mengembangkan empati, tanggung jawab, kejujuran, dan sikap menghormati sesama.",
            content: "PENTINGNYA KARAKTER POSITIF\n\nKarakter positif membantu membentuk hubungan sosial yang sehat dan mendukung suasana belajar yang nyaman.\n\nNILAI KARAKTER YANG PERLU DIBANGUN\n\n1. Empati: berusaha memahami perasaan dan sudut pandang orang lain.\n2. Kejujuran: menyampaikan informasi sesuai fakta.\n3. Tanggung jawab: bersedia menjalankan kewajiban dan memperbaiki kesalahan.\n4. Menghargai: menerima perbedaan dan tidak merendahkan orang lain.\n5. Kerja sama: saling membantu dalam kegiatan positif.\n\nPENERAPAN DI SEKOLAH\n\nGunakan bahasa yang sopan, dengarkan pendapat teman, hindari diskriminasi, dan selesaikan perbedaan melalui komunikasi yang baik.",
            status: "published",
            createdAt: "2026-11-11T08:00:00"
        },
        {
            id: "EDU-005",
            title: "Menjaga Lingkungan Sekolah yang Aman dan Nyaman",
            category: "Lingkungan Sekolah",
            summary: "Mendorong seluruh warga sekolah menjaga kebersihan, keamanan, dan kenyamanan.",
            content: "LINGKUNGAN SEKOLAH YANG POSITIF\n\nLingkungan sekolah yang baik bukan hanya bersih secara fisik, tetapi juga memberikan rasa aman dan nyaman bagi seluruh warga sekolah.\n\nHAL YANG DAPAT DILAKUKAN\n\n1. Menjaga kebersihan ruang kelas dan fasilitas umum.\n2. Tidak merusak sarana sekolah.\n3. Menggunakan fasilitas sesuai fungsinya.\n4. Menghargai perbedaan antarwarga sekolah.\n5. Melaporkan kondisi yang membahayakan keselamatan.\n\nPERAN WARGA SEKOLAH\n\nSiswa, guru, tenaga kependidikan, dan pengelola sekolah memiliki tanggung jawab bersama dalam menciptakan lingkungan yang aman, sehat, dan mendukung proses pembelajaran.",
            status: "published",
            createdAt: "2026-11-11T09:00:00"
        },
        {
            id: "EDU-006",
            title: "Etika Berkomunikasi di Media Sosial",
            category: "Karakter",
            summary: "Menerapkan komunikasi digital yang santun, aman, dan bertanggung jawab.",
            content: "ETIKA DIGITAL\n\nMedia sosial dapat menjadi sarana komunikasi dan pembelajaran. Namun, setiap pengguna tetap bertanggung jawab terhadap konten yang dibagikan.\n\nPRINSIP KOMUNIKASI DIGITAL\n\n1. Periksa kebenaran informasi sebelum membagikannya.\n2. Gunakan bahasa yang sopan.\n3. Jangan menyebarkan data pribadi orang lain tanpa izin.\n4. Hindari komentar yang menghina atau mengancam.\n5. Jangan ikut menyebarkan konten perundungan.\n6. Laporkan konten yang membahayakan melalui saluran yang tepat.\n\nJEJAK DIGITAL\n\nKonten yang diunggah atau dibagikan dapat tersimpan dan tersebar lebih luas. Karena itu, pikirkan dampaknya sebelum mengirimkan sesuatu.",
            status: "draft",
            createdAt: "2026-11-12T08:00:00"
        }
    ];

    const categoryIcons = {
        "Anti-Bullying": "shield-check",
        "Kedisiplinan": "clock",
        "Tata Tertib": "clipboard-check",
        "Karakter": "heart-handshake",
        "Lingkungan Sekolah": "school"
    };

    const el = {
        search: document.getElementById("educationSearch"),
        categoryFilter: document.getElementById("educationCategoryFilter"),
        statusFilter: document.getElementById("educationStatusFilter"),
        tabs: document.querySelectorAll(".education-tab"),
        grid: document.getElementById("educationGrid"),
        empty: document.getElementById("educationEmpty"),
        total: document.getElementById("educationTotal"),
        published: document.getElementById("educationPublished"),
        categories: document.getElementById("educationCategories"),
        created: document.getElementById("educationCreated"),
        result: document.getElementById("educationResultCount"),
        add: document.getElementById("addEducationButton"),
        reset: document.getElementById("resetEducationFilters"),
        resetTop: document.getElementById("resetEducationFiltersTop"),
        detailModal: document.getElementById("educationDetailModal"),
        detailTitle: document.getElementById("educationDetailTitle"),
        detailMeta: document.getElementById("educationDetailMeta"),
        detailBody: document.getElementById("educationDetailBody"),
        closeDetail: document.getElementById("closeEducationDetail"),
        closeDetailBottom: document.getElementById("closeEducationDetailBottom"),
        editFromDetail: document.getElementById("editEducationFromDetail"),
        formModal: document.getElementById("educationFormModal"),
        form: document.getElementById("educationForm"),
        formTitle: document.getElementById("educationFormTitle"),
        closeForm: document.getElementById("closeEducationForm"),
        cancelForm: document.getElementById("cancelEducationForm"),
        id: document.getElementById("educationId"),
        title: document.getElementById("educationTitle"),
        category: document.getElementById("educationCategory"),
        status: document.getElementById("educationStatus"),
        summary: document.getElementById("educationSummary"),
        content: document.getElementById("educationContent"),
        toast: document.getElementById("educationToast")
    };

    const requiredElements = ["search","categoryFilter","statusFilter","grid","empty","add","form","detailModal","formModal","toast"];

    if (requiredElements.some(key => !el[key])) {
        console.error("Elemen halaman Materi Edukasi tidak lengkap.");
        return;
    }

    let materials = loadMaterials();
    let activeCategory = "all";
    let selectedMaterialId = null;
    let toastTimer = null;

    function loadMaterials() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved !== null) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch (error) {
            console.error("Gagal membaca materi:", error);
        }

        return initialMaterials.map(item => ({...item}));
    }

    function saveMaterials() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
            return true;
        } catch (error) {
            console.error("Gagal menyimpan materi:", error);
            showToast("Penyimpanan browser gagal. Periksa ruang penyimpanan.");
            return false;
        }
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[character]);
    }

    function showToast(message) {
        el.toast.textContent = message;
        el.toast.classList.add("show");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => el.toast.classList.remove("show"), 2600);
    }

    function refreshIcons() {
        if (window.lucide) window.lucide.createIcons();
    }

    function formatDate(value) {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) return "Tanggal tidak tersedia";

        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(date);
    }

    function getVisibleMaterials() {
        const query = el.search.value.trim().toLowerCase();
        const category = el.categoryFilter.value;
        const status = el.statusFilter.value;

        return materials.filter(item => {
            if (activeCategory !== "all" && item.category !== activeCategory) return false;
            if (category !== "all" && item.category !== category) return false;
            if (status !== "all" && item.status !== status) return false;

            const searchable = [
                item.title,
                item.category,
                item.summary,
                item.content
            ].join(" ").toLowerCase();

            return searchable.includes(query);
        }).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    function renderStatistics() {
        const published = materials.filter(item => item.status === "published").length;
        const categories = new Set(materials.map(item => item.category)).size;
        const created = materials.filter(item => !initialMaterials.some(seed => seed.id === item.id)).length;

        el.total.textContent = materials.length;
        el.published.textContent = published;
        el.categories.textContent = categories;
        el.created.textContent = created;
    }

    function renderCard(material, index) {
        const icon = categoryIcons[material.category] || "book-open";
        const published = material.status === "published";

        return `
            <article class="education-card" style="animation-delay:${Math.min(index * 35,210)}ms">
                <div class="education-card-top">
                    <span class="education-card-icon"><i data-lucide="${icon}"></i></span>
                    <span class="education-card-category">${escapeHTML(material.category)}</span>
                </div>
                <h3>${escapeHTML(material.title)}</h3>
                <p class="education-card-description">${escapeHTML(material.summary)}</p>
                <div class="education-card-meta">
                    <span><i data-lucide="calendar-days"></i>${formatDate(material.createdAt)}</span>
                    <span><i data-lucide="file-text"></i>Materi edukasi</span>
                </div>
                <div class="education-card-footer">
                    <span class="education-status ${published ? "" : "draft"}">
                        <span class="education-status-dot"></span>
                        ${published ? "Dipublikasikan" : "Draf"}
                    </span>
                    <div class="education-card-actions">
                        <button type="button" class="education-read-button" data-read="${escapeHTML(material.id)}">
                            Baca <i data-lucide="arrow-up-right"></i>
                        </button>
                        <button type="button" class="education-icon-button" data-edit="${escapeHTML(material.id)}" aria-label="Edit materi">
                            <i data-lucide="pencil"></i>
                        </button>
                        <button type="button" class="education-icon-button delete" data-delete="${escapeHTML(material.id)}" aria-label="Hapus materi">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    function renderMaterials() {
        const visible = getVisibleMaterials();

        el.grid.innerHTML = visible.map(renderCard).join("");
        el.grid.hidden = visible.length === 0;
        el.empty.hidden = visible.length !== 0;
        el.result.textContent = `${visible.length} dari ${materials.length} materi ditampilkan`;

        el.tabs.forEach(tab => {
            const active = tab.dataset.category === activeCategory;
            tab.classList.toggle("active", active);
            tab.setAttribute("aria-pressed", String(active));
        });

        renderStatistics();
        refreshIcons();
    }

    function openModal(modal) {
        modal.hidden = false;
        document.body.style.overflow = "hidden";
        refreshIcons();
    }

    function closeModal(modal) {
        modal.hidden = true;

        if (el.detailModal.hidden && el.formModal.hidden) {
            document.body.style.overflow = "";
        }
    }

    function openDetail(id) {
        const material = materials.find(item => item.id === id);

        if (!material) {
            showToast("Materi tidak ditemukan.");
            return;
        }

        selectedMaterialId = id;
        el.detailTitle.textContent = material.title;
        el.detailMeta.textContent = `${material.category} · ${formatDate(material.createdAt)} · ${material.status === "published" ? "Dipublikasikan" : "Draf"}`;
        el.detailBody.textContent = `${material.summary}\n\n${material.content}`;

        openModal(el.detailModal);
        el.closeDetail.focus();
    }

    function openForm(id = null) {
        el.form.reset();
        el.id.value = "";

        if (id) {
            const material = materials.find(item => item.id === id);

            if (!material) {
                showToast("Materi tidak ditemukan.");
                return;
            }

            el.formTitle.textContent = "Edit Materi";
            el.id.value = material.id;
            el.title.value = material.title;
            el.category.value = material.category;
            el.status.value = material.status;
            el.summary.value = material.summary;
            el.content.value = material.content;
        } else {
            el.formTitle.textContent = "Tambah Materi";
            el.status.value = "draft";
        }

        openModal(el.formModal);
        el.title.focus();
    }

    function generateId() {
        const numbers = materials
            .map(item => Number(String(item.id).replace("EDU-","")))
            .filter(Number.isFinite);

        return `EDU-${String(Math.max(0,...numbers) + 1).padStart(3,"0")}`;
    }

    function saveMaterial(event) {
        event.preventDefault();

        if (!el.form.reportValidity()) return;

        const id = el.id.value;
        const existing = id ? materials.find(item => item.id === id) : null;

        const material = {
            id: id || generateId(),
            title: el.title.value.trim(),
            category: el.category.value,
            status: el.status.value,
            summary: el.summary.value.trim(),
            content: el.content.value.trim(),
            createdAt: existing?.createdAt || new Date().toISOString()
        };

        if (!material.title || !material.category || !material.summary || !material.content) {
            showToast("Lengkapi semua informasi materi.");
            return;
        }

        if (existing) {
            materials = materials.map(item => item.id === id ? material : item);
        } else {
            materials.push(material);
        }

        if (!saveMaterials()) return;

        closeModal(el.formModal);
        renderMaterials();
        showToast(existing ? "Materi berhasil diperbarui." : "Materi berhasil ditambahkan.");
    }

    function deleteMaterial(id) {
        const material = materials.find(item => item.id === id);

        if (!material) {
            showToast("Materi tidak ditemukan.");
            return;
        }

        if (!window.confirm(`Apakah kamu yakin ingin menghapus "${material.title}"?`)) return;

        const previousMaterials = materials;
        materials = materials.filter(item => item.id !== id);

        if (!saveMaterials()) {
            materials = previousMaterials;
            return;
        }

        renderMaterials();
        showToast("Materi berhasil dihapus.");
    }

    function resetFilters() {
        el.search.value = "";
        el.categoryFilter.value = "all";
        el.statusFilter.value = "all";
        activeCategory = "all";
        renderMaterials();
        showToast("Filter berhasil direset.");
    }

    el.search.addEventListener("input", renderMaterials);
    el.categoryFilter.addEventListener("change", renderMaterials);
    el.statusFilter.addEventListener("change", renderMaterials);

    el.tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            activeCategory = tab.dataset.category;
            el.categoryFilter.value = "all";
            renderMaterials();
        });
    });

    el.grid.addEventListener("click", event => {
        const readButton = event.target.closest("[data-read]");
        const editButton = event.target.closest("[data-edit]");
        const deleteButton = event.target.closest("[data-delete]");

        if (readButton) {
            openDetail(readButton.dataset.read);
        } else if (editButton) {
            openForm(editButton.dataset.edit);
        } else if (deleteButton) {
            deleteMaterial(deleteButton.dataset.delete);
        }
    });

    el.add.addEventListener("click", () => openForm());
    el.form.addEventListener("submit", saveMaterial);

    el.closeDetail.addEventListener("click", () => closeModal(el.detailModal));
    el.closeDetailBottom.addEventListener("click", () => closeModal(el.detailModal));
    el.closeForm.addEventListener("click", () => closeModal(el.formModal));
    el.cancelForm.addEventListener("click", () => closeModal(el.formModal));

    el.editFromDetail.addEventListener("click", () => {
        const id = selectedMaterialId;
        closeModal(el.detailModal);
        if (id) openForm(id);
    });

    el.detailModal.addEventListener("click", event => {
        if (event.target === el.detailModal) closeModal(el.detailModal);
    });

    el.formModal.addEventListener("click", event => {
        if (event.target === el.formModal) closeModal(el.formModal);
    });

    el.reset.addEventListener("click", resetFilters);
    el.resetTop.addEventListener("click", resetFilters);

    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;

        if (!el.detailModal.hidden) {
            closeModal(el.detailModal);
        } else if (!el.formModal.hidden) {
            closeModal(el.formModal);
        }
    });

    const currentDate = document.getElementById("saCurrentDate");

    if (currentDate) {
        currentDate.textContent = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date());
    }

    renderMaterials();
    refreshIcons();
});
