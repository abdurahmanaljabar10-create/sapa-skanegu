<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $rolePermissions = [
            // SISWA
            'siswa' => [
                'view_dashboard',
                'submit_aspiration',
                'view_own_aspirations',
                'submit_complaint',
                'view_own_complaints',
                'submit_bullying_report',
                'view_own_bullying_reports',
                'track_own_reports',
                'view_notifications',
                'manage_notifications',
                'view_education',
            ],

            // GURU
            'guru' => [
                'view_dashboard',
                'view_notifications',
                'manage_notifications',
                'view_education',
            ],

            // WALI KELAS
            'wali_kelas' => [
                'view_dashboard',
                'view_notifications',
                'manage_notifications',
                'view_education',
            ],

            // GURU BK
            'guru_bk' => [
                'view_dashboard',
                'view_notifications',
                'manage_notifications',
                'view_education',
                'view_assigned_bullying_cases',
                'handle_bullying_cases',
                'update_report_status',
                'view_bullying_statistics',
            ],

            // KEPALA SEKOLAH
            'kepala_sekolah' => [
                'view_dashboard',
                'view_notifications',
                'manage_notifications',
                'view_education',
                'view_bullying_statistics',
            ],

            // TENAGA KEPENDIDIKAN
            'tenaga_kependidikan' => [
                'view_dashboard',
                'view_notifications',
                'manage_notifications',
                'view_education',
            ],

            // ADMIN
            'admin' => [
                'view_dashboard',
                'manage_users',
                'manage_roles',
                'manage_permissions',
                'view_audit_logs',
                'manage_education',
                'manage_faq',
            ],
        ];

        foreach ($rolePermissions as $roleName => $permissionNames) {

            $roleId = DB::table('roles')
                ->where('name', $roleName)
                ->value('id');

            if (!$roleId) {
                throw new RuntimeException(
                    "Role tidak ditemukan: {$roleName}"
                );
            }

            foreach ($permissionNames as $permissionName) {

                $permissionId = DB::table('permissions')
                    ->where('name', $permissionName)
                    ->value('id');

                if (!$permissionId) {
                    throw new RuntimeException(
                        "Permission tidak ditemukan: {$permissionName}"
                    );
                }

                DB::table('role_permissions')->updateOrInsert(
                    [
                        'role_id' => $roleId,
                        'permission_id' => $permissionId,
                    ],
                    [
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }
    }
}
