<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'name',
    'email',
    'password',
    'nisn',
    'nip',
    'role',
    'status',
    'class_name',
    'position',
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relasi User dengan Role
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(
            Role::class,
            'user_roles',
            'user_id',
            'role_id'
        )->withTimestamps();
    }

    // Relasi User dengan riwayat penugasan
    public function assignments(): HasMany
    {
        return $this->hasMany(UserAssignment::class);
    }

    // Memeriksa apakah pengguna memiliki role tertentu
    public function hasRole(string $roleName): bool
    {
        return $this->roles()
            ->where('roles.name', $roleName)
            ->exists();
    }

    // Memeriksa apakah pengguna memiliki permission tertentu
    public function hasPermission(string $permissionName): bool
    {
        return $this->roles()
            ->whereHas('permissions', function ($query) use ($permissionName) {
                $query->where('permissions.name', $permissionName);
            })
            ->exists();
    }
}
