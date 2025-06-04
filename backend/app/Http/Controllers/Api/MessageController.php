<?php

// namespace App\Http\Controllers\Api;

// use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;
// use App\Models\Message; // Pastikan model Message sudah ada dan sesuai
// use App\Models\User;    // Pastikan model User sudah ada dan sesuai
// use App\Models\Terapis;  // Pastikan model Terapis sudah ada dan sesuai
// use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Log; // Untuk logging error

// class MessageController extends Controller
// {

//     /**
//      * Mendapatkan pesan untuk percakapan spesifik (pasien-terapis).
//      * `conversation_id` harus unik untuk setiap pasangan pengguna.
//      *
//      * @param Request $request
//      * @param int $participantId ID `iduser` dari peserta lawan bicara
//      * @return \Illuminate\Http\JsonResponse
//      */
// public function getConversationMessages(Request $request, $participantId)
// {
//     $user = Auth::user();
//     if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

//     $currentUserId = $user->iduser;
//     $partner = User::find($participantId); // <-- pastikan participantId adalah iduser

//     // Buat conversation_id
//     $convIdParts = [$currentUserId, $participantId];
//     sort($convIdParts);
//     $conversationId = implode('-', $convIdParts);

//     $messages = Message::where('conversation_id', $conversationId)->get();

//     return response()->json(['messages' => $messages]);
// }

//     /**
//      * Menyimpan pesan baru ke database.
//      * Endpoint ini juga akan memicu event Socket.IO (membutuhkan konfigurasi terpisah).
//      *
//      * @param Request $request
//      * @return \Illuminate\Http\JsonResponse
//      */
// public function store(Request $request)
// {
//     $user = Auth::user();
//     if (!$user) {
//         return response()->json(['message' => 'Unauthenticated.'], 401);
//     }

//     $senderId = $user->iduser;
//     $senderRole = $user->role;

//     // Pastikan request memiliki receiver_id dan message
//     $request->validate([
//         'receiver_id' => 'required|exists:users,iduser',
//         'message' => 'required|string',
//     ]);

//     $receiverId = $request->receiver_id;

//     // Cek apakah penerima adalah pasien atau terapis
//     $receiverUser = User::find($receiverId);
//     if (!$receiverUser || !in_array($receiverUser->role, ['pasien', 'terapis'])) {
//         return response()->json(['message' => 'Penerima tidak valid.'], 400);
//     }

//     // Buat conversation_id konsisten: id kecil-id besar
//     $convIdUser1 = min($senderId, $receiverId);
//     $convIdUser2 = max($senderId, $receiverId);
//     $conversationId = "{$convIdUser1}-{$convIdUser2}";

//     try {
//         Message::create([
//             'sender_id' => $senderId,
//             'sender_role' => $senderRole,
//             'receiver_id' => $receiverId,
//             'message' => $request->message,
//             'conversation_id' => $conversationId,
//         ]);

//         return response()->json(['message' => 'Pesan berhasil dikirim.']);
//     } catch (\Exception $e) {
//         Log::error('Error sending message: ' . $e->getMessage());
//         return response()->json(['message' => 'Gagal mengirim pesan.'], 500);
//     }
// }
//     /**
//      * Mendapatkan daftar pengguna (pasien/terapis) yang pernah mengobrol dengan pengguna saat ini.
//      *
//      * @param Request $request
//      * @return \Illuminate\Http\JsonResponse
//      */
// public function getChatPartners(Request $request) {
//     $user = Auth::user();
//     if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

//     $currentUserId = $user->iduser;

//     $conversationIds = Message::where('sender_id', $currentUserId)
//         ->orWhere('receiver_id', $currentUserId)
//         ->pluck('conversation_id')
//         ->unique();

//     $partners = collect();

//     foreach ($conversationIds as $conversationId) {
//         list($id1, $id2) = explode('-', $conversationId);
//         $otherId = $id1 == $currentUserId ? $id2 : $id1;

//         $otherUser = User::find($otherId);

//         if ($otherUser && $otherUser->role != $user->role) {
//             $latestMessage = Message::where('conversation_id', $conversationId)
//                 ->latest()
//                 ->first();

//             $partners->push([
//                 'id' => $otherUser->iduser, // Pastikan ini iduser
//                 'iduser' => $otherUser->iduser, // Tambahkan juga sebagai iduser
//                 'name' => $otherUser->nama,
//                 'role' => $otherUser->role,
//                 'last_message' => $latestMessage?->message,
//                 'last_message_time' => $latestMessage?->created_at
//             ]);
//         }
//     }

//     return response()->json(['partners' => $partners]);
// }
//     /**
//      * Mendapatkan daftar semua pasien yang tersedia untuk terapis (untuk memulai chat baru).
//      * Hanya bisa diakses oleh terapis.
//      *
//      * @param Request $request
//      * @return \Illuminate\Http\JsonResponse
//      */
//     public function getAllPatients(Request $request)
//     {
//         $user = Auth::user();
//         if (!$user || $user->role !== 'terapis') {
//             return response()->json(['message' => 'Tidak sah atau peran tidak valid.'], 403);
//         }

//         try {
//             // PENTING: Memilih 'iduser' bukan 'id'
//             $patients = User::where('role', 'pasien')
//                             ->get(['iduser', 'nama', 'email']);

//             return response()->json(['patients' => $patients]);
//         } catch (\Exception $e) {
//             Log::error('Error di getAllPatients: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
//             return response()->json(['message' => 'Gagal mengambil daftar pasien.', 'error' => $e->getMessage()], 500);
//         }
//     }

//     /**
//      * Mendapatkan daftar semua terapis yang tersedia untuk pasien (untuk memulai chat baru).
//      * Hanya bisa diakses oleh pasien.
//      *
//      * @param Request $request
//      * @return \Illuminate\Http\JsonResponse
//      */
//     public function getAllTerapis(Request $request)
//     {
//         $user = Auth::user();
//         if (!$user || $user->role !== 'pasien') {
//             return response()->json(['message' => 'Tidak sah atau peran tidak valid.'], 403);
//         }

//         try {
//             // Eager load relasi 'user' dari model Terapis
//             // PENTING: Pastikan select 'iduser' di relasi
//             $terapis = Terapis::with('user:iduser,nama,email') // Pilih kolom iduser, nama, email dari tabel users
//                                ->get();

//             $formattedTerapis = $terapis->map(function ($item) {
//                 return [
//                     'id' => $item->iduser, // Menggunakan iduser dari User yang berelasi dengan Terapis
//                     'terapis_id' => $item->id_terapis, // Mengirimkan id_terapis juga
//                     'name' => $item->user->nama ?? 'Tidak Dikenal', // Nama dari relasi user
//                     'specialization' => $item->spesialisasi, // Spesialisasi dari tabel terapis
//                     'role' => 'terapis',
//                 ];
//             });

//             return response()->json(['terapis' => $formattedTerapis]);

//         } catch (\Exception $e) {
//             Log::error('Error di getAllTerapis: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
//             return response()->json(['message' => 'Gagal mengambil daftar terapis.', 'error' => $e->getMessage()], 500);
//         }
//     }
// }


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use App\Models\Terapis;
use App\Models\JadwalTerapi;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{
    /**
     * Mendapatkan pesan untuk percakapan spesifik (pasien-terapis).
     */
    public function getConversationMessages(Request $request, $participantId)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $currentUserId = $user->iduser;
        $partner = User::find($participantId);
        if (!$partner) {
            return response()->json(['message' => 'Partner tidak ditemukan'], 404);
        }

        $convIdParts = [$currentUserId, $participantId];
        sort($convIdParts);
        $conversationId = implode('-', $convIdParts);

        $messages = Message::where('conversation_id', $conversationId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['messages' => $messages]);
    }

    /**
     * Menyimpan pesan baru ke database.
     */
/**
 * Menyimpan pesan baru ke database.
 */
public function store(Request $request)
{
    $user = Auth::user();
    if (!$user) {
        return response()->json(['message' => 'Unauthenticated'], 401);
    }

    $senderId = $user->iduser;
    $senderRole = $user->role;

    $request->validate([
        'receiver_id' => 'required|exists:users,iduser',
        'message' => 'required|string',
    ]);

    $receiverId = $request->receiver_id;
    $receiverUser = User::find($receiverId);
    if (!$receiverUser || !in_array($receiverUser->role, ['pasien', 'terapis'])) {
        return response()->json(['message' => 'Penerima tidak valid'], 400);
    }

    // Pastikan sender dan receiver memiliki role yang berbeda
    if ($senderRole === $receiverUser->role) {
        return response()->json(['message' => 'Pengirim dan penerima tidak boleh memiliki role yang sama'], 400);
    }

    $convIdUser1 = min($senderId, $receiverId);
    $convIdUser2 = max($senderId, $receiverId);
    $conversationId = "{$convIdUser1}-{$convIdUser2}";

    try {
        $message = Message::create([
            'sender_id' => $senderId,
            'sender_role' => $senderRole,
            'receiver_id' => $receiverId,
            'message' => $request->message,
            'conversation_id' => $conversationId,
            'created_at' => now(),
        ]);

        // Emit event untuk Socket.IO
        event(new \App\Events\MessageSent($message));

        return response()->json(['message' => 'Pesan berhasil dikirim']);
    } catch (\Exception $e) {
        Log::error('Error sending message: ' . $e->getMessage());
        return response()->json(['message' => 'Gagal mengirim pesan'], 500);
    }
}

    /**
     * Mendapatkan daftar pengguna yang pernah mengobrol dengan pengguna saat ini.
     */
    public function getChatPartners(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $currentUserId = $user->iduser;

        // Ambil conversation_id unik
        $conversationIds = Message::where('sender_id', $currentUserId)
            ->orWhere('receiver_id', $currentUserId)
            ->pluck('conversation_id')
            ->unique();

        $partners = collect();

        foreach ($conversationIds as $conversationId) {
            [$id1, $id2] = explode('-', $conversationId);
            $otherId = $id1 == $currentUserId ? $id2 : $id1;

            $otherUser = User::select('iduser', 'nama', 'role', 'email')
                ->where('iduser', $otherId)
                ->first();

            if ($otherUser && $otherUser->role !== $user->role) {
                $latestMessage = Message::where('conversation_id', $conversationId)
                    ->latest()
                    ->first();

                $partners->push([
                    'id' => $otherUser->iduser,
                    'name' => $otherUser->nama,
                    'role' => $otherUser->role,
                    'email' => $otherUser->email,
                    'last_message' => $latestMessage?->message,
                    'last_message_time' => $latestMessage?->created_at,
                ]);
            }
        }

        return response()->json(['partners' => $partners->values()]);
    }

    /**
     * Mendapatkan daftar terapis yang memiliki jadwal dengan pasien saat ini.
     */
    public function getAllTerapis(Request $request)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'pasien') {
            return response()->json(['message' => 'Tidak sah atau peran tidak valid'], 403);
        }

        try {
            // Ambil iduser pasien
            $currentUserId = $user->iduser;

            // Ambil daftar terapis yang memiliki jadwal dengan pasien ini
            $terapisIds = JadwalTerapi::where('user_id', $currentUserId)
                ->pluck('terapis_id')
                ->unique();

            $terapis = Terapis::with(['user' => function ($query) {
                $query->select('iduser', 'nama', 'email');
            }])
                ->whereIn('id_terapis', $terapisIds)
                ->get();

            $formattedTerapis = $terapis->map(function ($item) {
                return [
                    'id' => $item->user->iduser,
                    'terapis_id' => $item->id_terapis,
                    'name' => $item->user->nama ?? 'Tidak Dikenal',
                    'specialization' => $item->spesialisasi,
                    'role' => 'terapis',
                    'email' => $item->user->email,
                ];
            });

            return response()->json(['terapis' => $formattedTerapis]);
        } catch (\Exception $e) {
            Log::error('Error di getAllTerapis: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal mengambil daftar terapis'], 500);
        }
    }

    /**
     * Mendapatkan daftar pasien yang memiliki jadwal dengan terapis saat ini.
     */
/**
 * Mendapatkan daftar pasien yang memiliki jadwal dengan terapis saat ini.
 */
public function getAllPatients(Request $request)
{
    $user = Auth::user();
    if (!$user || $user->role !== 'terapis') {
        return response()->json(['message' => 'Tidak sah atau peran tidak valid'], 403);
    }

    try {
        $currentUserId = $user->iduser;
        $terapis = Terapis::where('iduser', $currentUserId)->first();
        if (!$terapis) {
            return response()->json(['message' => 'Data terapis tidak ditemukan'], 404);
        }

        $patientIds = JadwalTerapi::where('terapis_id', $terapis->id_terapis)
            ->pluck('user_id')
            ->unique();

        // Ambil pasien yang belum memiliki riwayat chat
        $existingConversations = Message::where('sender_id', $currentUserId)
            ->orWhere('receiver_id', $currentUserId)
            ->pluck('receiver_id')
            ->merge(Message::where('sender_id', $currentUserId)->pluck('sender_id'))
            ->unique();

        $patientIds = $patientIds->diff($existingConversations);

        $patients = User::where('role', 'pasien')
            ->whereIn('iduser', $patientIds)
            ->select('iduser', 'nama', 'email')
            ->get();

        return response()->json(['patients' => $patients]);
    } catch (\Exception $e) {
        Log::error('Error di getAllPatients: ' . $e->getMessage());
        return response()->json(['message' => 'Gagal mengambil daftar pasien'], 500);
    }
}

/**
 * Mendapatkan daftar partner chat berdasarkan riwayat pesan.
 */
public function getAllPartners(Request $request)
{
    $user = Auth::user();
    if (!$user) {
        return response()->json(['message' => 'Unauthenticated'], 401);
    }

    try {
        $currentUserId = $user->iduser;
        $partners = Message::where('sender_id', $currentUserId)
            ->orWhere('receiver_id', $currentUserId)
            ->select('sender_id', 'receiver_id')
            ->get()
            ->map(function ($message) use ($currentUserId) {
                $partnerId = $message->sender_id === $currentUserId ? $message->receiver_id : $message->sender_id;
                return $partnerId;
            })
            ->unique()
            ->map(function ($partnerId) {
                $partner = User::find($partnerId);
                return [
                    'id' => $partner->iduser,
                    'name' => $partner->nama,
                    'email' => $partner->email,
                    'role' => $partner->role,
                    'last_message' => Message::where(function ($query) use ($partnerId, $currentUserId) {
                        $query->where('sender_id', $currentUserId)->where('receiver_id', $partnerId);
                    })->orWhere(function ($query) use ($partnerId, $currentUserId) {
                        $query->where('sender_id', $partnerId)->where('receiver_id', $currentUserId);
                    })->latest()->first()?->message,
                    'last_message_time' => Message::where(function ($query) use ($partnerId, $currentUserId) {
                        $query->where('sender_id', $currentUserId)->where('receiver_id', $partnerId);
                    })->orWhere(function ($query) use ($partnerId, $currentUserId) {
                        $query->where('sender_id', $partnerId)->where('receiver_id', $currentUserId);
                    })->latest()->first()?->created_at,
                ];
            });

        return response()->json(['partners' => $partners]);
    } catch (\Exception $e) {
        Log::error('Error di getAllPartners: ' . $e->getMessage());
        return response()->json(['message' => 'Gagal mengambil daftar partner'], 500);
    }
}
}