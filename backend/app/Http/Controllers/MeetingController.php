<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Services\GoogleCalendarService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MeetingController extends Controller
{
    protected $calendarService;

    public function __construct(GoogleCalendarService $calendarService)
    {
        $this->calendarService = $calendarService;
    }

    /**
     * Get all meetings for authenticated user
     */
    public function index(Request $request)
    {
        $meetings = Meeting::orderBy('start_time', 'desc')->get();
        return response()->json(['meetings' => $meetings]);
    }

    /**
     * Create a new meeting
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'attendees' => 'nullable|array',
            'attendees.*' => 'email',
            'sync_to_calendar' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $meeting = Meeting::create([
            'user_id' => 1, // Temporary: hardcoded user ID
            'title' => $request->title,
            'description' => $request->description,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'attendees' => $request->attendees ?? [],
        ]);

        // Sync to Google Calendar if requested
        if ($request->sync_to_calendar) {
            try {
                $mockUser = (object)['id' => 1];
                $calendarEventId = $this->calendarService->createEvent($mockUser, $meeting);
                $meeting->update(['google_event_id' => $calendarEventId]);
            } catch (\Exception $e) {
                return response()->json([
                    'meeting' => $meeting,
                    'calendar_error' => 'Failed to sync with Google Calendar: ' . $e->getMessage()
                ], 201);
            }
        }

        return response()->json(['meeting' => $meeting], 201);
    }

    /**
     * Get a specific meeting
     */
    public function show(Request $request, $id)
    {
        $meeting = Meeting::findOrFail($id);
        return response()->json(['meeting' => $meeting]);
    }

    /**
     * Update a meeting
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'date',
            'end_time' => 'date|after:start_time',
            'attendees' => 'nullable|array',
            'attendees.*' => 'email',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $meeting = Meeting::findOrFail($id);

        $meeting->update($request->only([
            'title', 'description', 'start_time', 'end_time', 'attendees'
        ]));

        // Update Google Calendar event if synced
        if ($meeting->google_event_id) {
            try {
                $mockUser = (object)['id' => 1];
                $this->calendarService->updateEvent($mockUser, $meeting);
            } catch (\Exception $e) {
                return response()->json([
                    'meeting' => $meeting,
                    'calendar_error' => 'Failed to update Google Calendar: ' . $e->getMessage()
                ]);
            }
        }

        return response()->json(['meeting' => $meeting]);
    }

    /**
     * Delete a meeting
     */
    public function destroy(Request $request, $id)
    {
        $meeting = Meeting::findOrFail($id);

        // Delete from Google Calendar if synced
        if ($meeting->google_event_id) {
            try {
                $mockUser = (object)['id' => 1];
                $this->calendarService->deleteEvent($mockUser, $meeting->google_event_id);
            } catch (\Exception $e) {
                // Log error but continue with deletion
            }
        }

        $meeting->delete();

        return response()->json(['message' => 'Meeting deleted successfully']);
    }

    /**
     * Sync existing meeting to Google Calendar
     */
    public function syncToCalendar(Request $request, $id)
    {
        $meeting = Meeting::findOrFail($id);

        if ($meeting->google_event_id) {
            return response()->json(['error' => 'Meeting already synced to calendar'], 400);
        }

        try {
            $mockUser = (object)['id' => 1];
            $calendarEventId = $this->calendarService->createEvent($mockUser, $meeting);
            $meeting->update(['google_event_id' => $calendarEventId]);

            return response()->json([
                'message' => 'Meeting synced to Google Calendar',
                'meeting' => $meeting
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to sync with Google Calendar: ' . $e->getMessage()
            ], 500);
        }
    }
}
