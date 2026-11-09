<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'siswa',
                'display_name' => 'Siswa',
                'description' => 'Pengguna yang berstatus sebagai siswa sekolah.',
            ],
            [
                'name' => 'guru',
                'display_name' => 'Guru',
                'description' => 'Tenaga pendidik yang menjalankan tugas mengajar.',
            ],
            [
                'name' => 'wali_kelas',
                'display_name' => 'Wali Kelas',
                'description' => 'Guru yang mendapat penugasan sebagai wali kelas.',
            ],
            [
                'name' => 'guru_bk',
                'display_name' => 'Guru BK',
                'description' => 'Petugas bimbingan dan konseling sekolah.',
            ],
            [
                'name' => 'kepala_sekolah',
                'display_name' => 'Kepala Sekolah',
                'description' => 'Pimpinan sekolah yang memiliki kewenangan pengawasan.',
            ],
            [
                'name' => 'tenaga_kependidikan',
                'display_name' => 'Tenaga Kependidikan',
                'description' => 'Pegawai sekolah yang menjalankan tugas kependidikan.',
            ],
            [
                'name' => 'admin',
                'display_name' => 'Admin',
                'description' => 'Petugas yang mengelola akun dan konfigurasi sistem.',
            ],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['name' => $role['name']],
                [
                    'display_name' => $role['display_name'],
                    'description' => $role['description'],
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }
    }
}
