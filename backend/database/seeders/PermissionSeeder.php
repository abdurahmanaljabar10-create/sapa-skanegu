<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Dashboard
            ['name' => 'view_dashboard', 'display_name' => 'Melihat Dashboard', 'description' => 'Mengakses dashboard sesuai kewenangan pengguna.'],

            // Aspirasi
            ['name' => 'submit_aspiration', 'display_name' => 'Mengirim Aspirasi', 'description' => 'Mengirim aspirasi kepada pihak sekolah.'],
            ['name' => 'view_own_aspirations', 'display_name' => 'Melihat Aspirasi Sendiri', 'description' => 'Melihat aspirasi yang dikirim sendiri.'],
            ['name' => 'manage_aspirations', 'display_name' => 'Mengelola Aspirasi', 'description' => 'Mengelola aspirasi sesuai kewenangan.'],

            // Pengaduan
            ['name' => 'submit_complaint', 'display_name' => 'Mengirim Pengaduan', 'description' => 'Mengirim pengaduan umum.'],
            ['name' => 'view_own_complaints', 'display_name' => 'Melihat Pengaduan Sendiri', 'description' => 'Melihat pengaduan yang dikirim sendiri.'],
            ['name' => 'manage_complaints', 'display_name' => 'Mengelola Pengaduan', 'description' => 'Mengelola pengaduan sesuai kewenangan.'],

            // Bullying
            ['name' => 'submit_bullying_report', 'display_name' => 'Melaporkan Bullying', 'description' => 'Mengirim laporan dugaan bullying.'],
            ['name' => 'view_own_bullying_reports', 'display_name' => 'Melihat Laporan Bullying Sendiri', 'description' => 'Melihat laporan bullying yang dikirim sendiri.'],
            ['name' => 'view_assigned_bullying_cases', 'display_name' => 'Melihat Kasus yang Ditugaskan', 'description' => 'Melihat kasus bullying yang secara resmi ditugaskan.'],
            ['name' => 'handle_bullying_cases', 'display_name' => 'Menangani Kasus Bullying', 'description' => 'Melakukan tindak lanjut kasus sesuai penugasan.'],
            ['name' => 'view_bullying_statistics', 'display_name' => 'Melihat Statistik Bullying', 'description' => 'Melihat statistik kasus yang telah dianonimkan atau diizinkan.'],

            // Pelacakan dan riwayat
            ['name' => 'track_own_reports', 'display_name' => 'Melacak Laporan Sendiri', 'description' => 'Melihat perkembangan laporan sendiri.'],
            ['name' => 'view_report_history', 'display_name' => 'Melihat Riwayat Laporan', 'description' => 'Melihat riwayat laporan sesuai kewenangan.'],
            ['name' => 'update_report_status', 'display_name' => 'Memperbarui Status Laporan', 'description' => 'Memperbarui status laporan yang ditangani.'],

            // Notifikasi dan edukasi
            ['name' => 'view_notifications', 'display_name' => 'Melihat Notifikasi', 'description' => 'Melihat notifikasi akun.'],
            ['name' => 'manage_notifications', 'display_name' => 'Mengelola Notifikasi', 'description' => 'Mengelola notifikasi milik sendiri.'],
            ['name' => 'view_education', 'display_name' => 'Melihat Materi Edukasi', 'description' => 'Mengakses materi edukasi sekolah.'],
            ['name' => 'manage_education', 'display_name' => 'Mengelola Materi Edukasi', 'description' => 'Mengelola konten edukasi.'],

            // Pengguna dan sistem
            ['name' => 'manage_users', 'display_name' => 'Mengelola Pengguna', 'description' => 'Membuat, memperbarui, dan menonaktifkan akun.'],
            ['name' => 'manage_roles', 'display_name' => 'Mengelola Role', 'description' => 'Mengatur role pengguna.'],
            ['name' => 'manage_permissions', 'display_name' => 'Mengelola Permission', 'description' => 'Mengatur hak akses sistem.'],
            ['name' => 'view_audit_logs', 'display_name' => 'Melihat Audit Log', 'description' => 'Melihat catatan aktivitas sistem sesuai kewenangan.'],
            ['name' => 'manage_faq', 'display_name' => 'Mengelola FAQ', 'description' => 'Mengelola pertanyaan dan jawaban bantuan.'],
        ];

        foreach ($permissions as $permission) {
            DB::table('permissions')->updateOrInsert(
                ['name' => $permission['name']],
                [
                    'display_name' => $permission['display_name'],
                    'description' => $permission['description'],
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }
    }
}
