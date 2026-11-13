
(function () {
    const roles = {
        siswa: {
            label: "Siswa",
            dashboard: "pages/student/dashboard.html",
            permissions: [
                "aspirations.create",
                "aspirations.view_own",
                "complaints.create",
                "complaints.view_own",
                "bullying.create",
                "bullying.view_own",
                "tracking.view_own",
                "education.view",
                "notifications.view_own",
                "profile.view_own"
            ]
        },
        guru: {
            label: "Guru Mata Pelajaran",
            dashboard: "pages/teacher/dashboard.html",
            permissions: [
                "aspirations.create",
                "aspirations.view_all",
                "aspirations.respond",
                "aspirations.update_status_when_assigned",
                "complaints.create",
                "complaints.view_all",
                "complaints.handle",
                "complaints.update_status_when_assigned",
                "education.view",
                "notifications.view_general",
                "profile.view_own"
            ]
        },
        wali_kelas: {
            label: "Wali Kelas",
            dashboard: "pages/homeroom/dashboard.html",
            permissions: [
                "aspirations.create",
                "aspirations.view_all",
                "aspirations.respond",
                "aspirations.update_status_when_assigned",
                "complaints.create",
                "complaints.view_all",
                "complaints.handle",
                "complaints.update_status_when_assigned",
                "bullying.manage_when_assigned",
                "bullying.collaborate",
                "bullying.update_status_when_assigned_or_collaborator",
                "students.monitor_assigned_class",
                "education.view",
                "notifications.view_general",
                "notifications.view_related_reports",
                "profile.view_own"
            ]
        },
        guru_bk: {
            label: "Guru BK",
            dashboard: "pages/counselor/dashboard.html",
            permissions: [
                "aspirations.create",
                "aspirations.view_all",
                "aspirations.respond",
                "aspirations.update_status_when_assigned",
                "complaints.create",
                "complaints.view_all",
                "complaints.handle",
                "complaints.update_status_when_assigned",
                "bullying.manage_when_assigned",
                "bullying.collaborate",
                "bullying.update_status_when_assigned_or_collaborator",
                "counseling.manage",
                "counseling.view_notes_when_authorized",
                "education.view",
                "education.manage",
                "notifications.view_general",
                "notifications.view_related_reports",
                "profile.view_own"
            ]
        },
        kesiswaan: {
            label: "Kesiswaan",
            dashboard: "pages/student-affairs/dashboard.html",
            permissions: [
                "aspirations.create",
                "aspirations.view_all",
                "aspirations.respond",
                "aspirations.update_status_when_assigned",
                "complaints.create",
                "complaints.view_all",
                "complaints.handle",
                "complaints.update_status_when_assigned",
                "bullying.manage_when_assigned",
                "bullying.collaborate",
                "bullying.update_status_when_assigned_or_collaborator",
                "discipline.manage",
                "bullying.monitor_assigned_cases",
                "bullying.view_assigned_history",
                "education.view",
                "education.manage",
                "notifications.view_general",
                "notifications.view_related_reports",
                "profile.view_own"
            ]
        },
        kepala_sekolah: {
            label: "Kepala Sekolah",
            dashboard: "pages/principal/dashboard.html",
            permissions: [
                "aspirations.view_all",
                "aspirations.respond",
                "aspirations.update_status_when_assigned",
                "complaints.view_all",
                "complaints.handle",
                "complaints.update_status_when_assigned",
                "bullying.view_all",
                "bullying.take_over",
                "bullying.give_direction",
                "bullying.evaluate",
                "statistics.view_all",
                "users.view",
                "education.view",
                "education.manage",
                "notifications.view_important",
                "reports.view_school_evaluation",
                "profile.view_own"
            ]
        },
        tenaga_kependidikan: {
            label: "Tenaga Kependidikan",
            dashboard: "pages/staff/dashboard.html",
            permissions: [
                "aspirations.create",
                "aspirations.view_all",
                "aspirations.respond",
                "aspirations.update_status_when_assigned",
                "complaints.create",
                "complaints.view_all",
                "complaints.handle",
                "complaints.update_status_when_assigned",
                "education.view",
                "notifications.view_general",
                "profile.view_own"
            ]
        },
        admin: {
            label: "Admin",
            dashboard: "pages/admin/dashboard.html",
            permissions: [
                "aspirations.create",
                "aspirations.view_all",
                "aspirations.respond",
                "aspirations.update_status_when_assigned",
                "complaints.view_all",
                "complaints.handle",
                "complaints.update_status_when_assigned",
                "education.view",
                "education.manage",
                "users.manage",
                "roles.manage",
                "permissions.manage",
                "classes.manage",
                "students.manage",
                "categories.aspirations.manage",
                "categories.complaints.manage",
                "categories.bullying.manage",
                "announcements.manage",
                "system.settings.manage",
                "system.audit_log.view",
                "system.statistics.view",
                "notifications.view_system",
                "profile.view_own"
            ]
        }
    };

    function getRole(roleKey) {
        return roles[roleKey] || null;
    }

    function hasPermission(roleKey, permission) {
        const role = getRole(roleKey);

        if (!role || !permission) {
            return false;
        }

        return role.permissions.includes(permission);
    }

    function hasAnyPermission(roleKey, permissions) {
        if (!Array.isArray(permissions)) {
            return false;
        }

        return permissions.some(permission =>
            hasPermission(roleKey, permission)
        );
    }

    function getPermissions(roleKey) {
        const role = getRole(roleKey);

        return role ? [...role.permissions] : [];
    }

    function getDashboard(roleKey) {
        const role = getRole(roleKey);

        return role ? role.dashboard : null;
    }

    function getRoleList() {
        return Object.entries(roles).map(([key, role]) => ({
            key,
            label: role.label,
            dashboard: role.dashboard
        }));
    }

    window.SapaRoleConfig = Object.freeze({
        roles,
        getRole,
        hasPermission,
        hasAnyPermission,
        getPermissions,
        getDashboard,
        getRoleList
    });
})();
