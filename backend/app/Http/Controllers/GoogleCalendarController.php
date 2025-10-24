<?php

namespace App\Http\Controllers;

use App\Services\GoogleCalendarService;
use Illuminate\Http\Request;

class GoogleCalendarController extends Controller
{
    protected $calendarService;

    public function __construct(GoogleCalendarService $calendarService)
    {
        $this->calendarService = $calendarService;
    }

    /**
     * Redirect user to Google OAuth consent screen
     */
    public function authorize(Request $request)
    {
        // Using hardcoded user ID for demo (no auth)
        $authUrl = $this->calendarService->getAuthUrl(1);
        return response()->json(['auth_url' => $authUrl]);
    }

    /**
     * Handle OAuth callback from Google
     */
    public function callback(Request $request)
    {
        $code = $request->input('code');
        $state = $request->input('state');

        if (!$code) {
            return response()->json(['error' => 'Authorization code not provided'], 400);
        }

        try {
            $this->calendarService->handleCallback($code, $state);
            
            // Redirect to frontend success page
            return redirect(env('FRONTEND_URL') . '/calendar/connected?success=true');
        } catch (\Exception $e) {
            return redirect(env('FRONTEND_URL') . '/calendar/connected?success=false&error=' . urlencode($e->getMessage()));
        }
    }

    /**
     * Disconnect Google Calendar
     */
    public function disconnect(Request $request)
    {
        // Mock user for demo
        $mockUser = (object)['id' => 1];
        try {
            $this->calendarService->disconnect($mockUser);
            return response()->json(['message' => 'Google Calendar disconnected successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get calendar events for a date range
     */
    public function getEvents(Request $request)
    {
        // Mock user for demo
        $mockUser = (object)['id' => 1];
        $startDate = $request->input('start_date', now()->toIso8601String());
        $endDate = $request->input('end_date', now()->addDays(30)->toIso8601String());

        try {
            $events = $this->calendarService->getEvents($mockUser, $startDate, $endDate);
            return response()->json(['events' => $events]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch events: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Check availability for a time slot
     */
    public function checkAvailability(Request $request)
    {
        // Mock user for demo
        $mockUser = (object)['id' => 1];
        $request->validate([
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        try {
            $isAvailable = $this->calendarService->checkAvailability(
                $mockUser,
                $request->start_time,
                $request->end_time
            );

            return response()->json(['available' => $isAvailable]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to check availability: ' . $e->getMessage()], 500);
        }
    }
}
