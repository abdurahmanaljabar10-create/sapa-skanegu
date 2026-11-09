<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    // LOGIN menggunakan NISN atau NIP
    public function login(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
            'password' => 'required|string',
        ]);

        $identifier = $request->identifier;

        $user = User::where('nisn', $identifier)
            ->orWhere('nip', $identifier)
            ->first();

        // Pesan dibuat sama agar identitas akun tidak terbocorkan
        if (
            !$user ||
            !Hash::check($request->password, $user->password) ||
            $user->status !== 'active'
        ) {
            return response()->json([
                'message' => 'NISN/NIP atau password tidak sesuai, atau akun tidak aktif.',
            ], 401);
        }

        // Membuat token akses API
        $token = $user->createToken('sapa-skanegu')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil.',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'nisn' => $user->nisn,
                'nip' => $user->nip,
                'role' => $user->role,
                'class_name' => $user->class_name,
                'position' => $user->position,
            ],
        ], 200);
    }

    // LOGOUT
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil.',
        ], 200);
    }
}
