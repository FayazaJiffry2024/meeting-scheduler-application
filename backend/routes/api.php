<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\GoogleCalendarController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Google Calendar Authentication Routes
Route::prefix('google')->group(function () {
    Route::get('/auth', [GoogleCalendarController::class, 'authorize']);
    Route::get('/callback', [GoogleCalendarController::class, 'callback']);
    Route::post('/disconnect', [GoogleCalendarController::class, 'disconnect'])->middleware('auth:sanctum');
});

// Meeting Routes (Protected)
Route::middleware('auth:sanctum')->prefix('meetings')->group(function () {
    Route::get('/', [MeetingController::class, 'index']);
    Route::post('/', [MeetingController::class, 'store']);
    Route::get('/{id}', [MeetingController::class, 'show']);
    Route::put('/{id}', [MeetingController::class, 'update']);
    Route::delete('/{id}', [MeetingController::class, 'destroy']);
    Route::post('/{id}/sync', [MeetingController::class, 'syncToCalendar']);
});

// Calendar Events Routes
Route::middleware('auth:sanctum')->prefix('calendar')->group(function () {
    Route::get('/events', [GoogleCalendarController::class, 'getEvents']);
    Route::get('/availability', [GoogleCalendarController::class, 'checkAvailability']);
});
