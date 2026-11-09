
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('nisn', 20)->nullable()->unique();
            $table->string('nip', 30)->nullable()->unique();

            $table->string('role', 30)->default('siswa')->index();
            $table->string('status', 20)->default('active')->index();

            $table->string('class_name')->nullable();
            $table->string('position')->nullable();

            $table->string('email')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['nisn']);
            $table->dropUnique(['nip']);
            $table->dropIndex(['role']);
            $table->dropIndex(['status']);

            $table->dropColumn([
                'nisn',
                'nip',
                'role',
                'status',
                'class_name',
                'position',
            ]);

            $table->string('email')->nullable(false)->change();
        });
    }
};
