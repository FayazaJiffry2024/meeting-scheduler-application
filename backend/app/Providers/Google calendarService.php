<?php

namespace App\Services;

use App\Models\User;
use App\Models\Meeting;
use Google\Client as GoogleClient;
use Google\Service\Calendar;
use Illuminate\Support\Facades\Cache;

class GoogleCalendarService
{
    protected $client;

    public function __construct()
    {
        $this->client = new GoogleClient();
        $this->client->setClientId(env('GOOGLE_CLIENT_ID'));
        $this->client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $this->client->setRedirectUri(env('GOOGLE_REDIRECT_URI'));
        $this->client->addScope(Calendar::CALENDAR);
        $this->client->setAccessType('offline');
        $this->client->setPrompt('consent');
    }

    /**
     * Get OAuth authorization URL
     */
    public function getAuthUrl($userId)
    {
        $this->client->setState($userId);
        return $this->client->createAuthUrl();
    }

    /**
     * Handle OAuth callback and store tokens
     */
    public function handleCallback($code, $userId)
    {
        $token = $this->client->fetchAccessTokenWithAuthCode($code);

        if (isset($token['error'])) {
            throw new \Exception('Error fetching access token: ' . $token['error']);
        }

        $user = User::findOrFail($userId);
        $user->google_access_token = json_encode($token);
        $user->save();

        return $token;
    }

    /**
     * Get authenticated Google Calendar service
     */
    protected function getCalendarService(User $user)
    {
        if (!$user->google_access_token) {
            throw new \Exception('User has not connected Google Calendar');
        }

        $token = json_decode($user->google_access_token, true);
        $this->client->setAccessToken($token);

        // Refresh token if expired
        if ($this->client->isAccessTokenExpired()) {
            if ($this->client->getRefreshToken()) {
                $newToken = $this->client->fetchAccessTokenWithRefreshToken($this->client->getRefreshToken());
                $user->google_access_token = json_encode($newToken);
                $user->save();
            } else {
                throw new \Exception('Access token expired and no refresh token available');
            }
        }

        return new Calendar($this->client);
    }

    /**
     * Create a calendar event
     */
    public function createEvent(User $user, Meeting $meeting)
    {
        $service = $this->getCalendarService($user);

        $event = new Calendar\Event([
            'summary' => $meeting->title,
            'description' => $meeting->description,
            'start' => [
                'dateTime' => $meeting->start_time,
                'timeZone' => config('app.timezone'),
            ],
            'end' => [
                'dateTime' => $meeting->end_time,
                'timeZone' => config('app.timezone'),
            ],
            'attendees' => array_map(function($email) {
                return ['email' => $email];
            }, $meeting->attendees ?? []),
            'reminders' => [
                'useDefault' => false,
                'overrides' => [
                    ['method' => 'email', 'minutes' => 24 * 60],
                    ['method' => 'popup', 'minutes' => 10],
                ],
            ],
        ]);

        $calendarEvent = $service->events->insert('primary', $event);

        return $calendarEvent->getId();
    }

    /**
     * Update a calendar event
     */
    public function updateEvent(User $user, Meeting $meeting)
    {
        $service = $this->getCalendarService($user);

        $event = $service->events->get('primary', $meeting->google_event_id);
        
        $event->setSummary($meeting->title);
        $event->setDescription($meeting->description);
        $event->setStart(new Calendar\EventDateTime([
            'dateTime' => $meeting->start_time,
            'timeZone' => config('app.timezone'),
        ]));
        $event->setEnd(new Calendar\EventDateTime([
            'dateTime' => $meeting->end_time,
            'timeZone' => config('app.timezone'),
        ]));
        
        if ($meeting->attendees) {
            $event->setAttendees(array_map(function($email) {
                return new Calendar\EventAttendee(['email' => $email]);
            }, $meeting->attendees));
        }

        $service->events->update('primary', $meeting->google_event_id, $event);
    }

    /**
     * Delete a calendar event
     */
    public function deleteEvent(User $user, $eventId)
    {
        $service = $this->getCalendarService($user);
        $service->events->delete('primary', $eventId);
    }

    /**
     * Get calendar events for a date range
     */
    public function getEvents(User $user, $startDate, $endDate)
    {
        $service = $this->getCalendarService($user);

        $optParams = [
            'orderBy' => 'startTime',
            'singleEvents' => true,
            'timeMin' => $startDate,
            'timeMax' => $endDate,
        ];

        $results = $service->events->listEvents('primary', $optParams);
        $events = $results->getItems();

        return array_map(function($event) {
            return [
                'id' => $event->getId(),
                'title' => $event->getSummary(),
                'description' => $event->getDescription(),
                'start' => $event->getStart()->getDateTime() ?? $event->getStart()->getDate(),
                'end' => $event->getEnd()->getDateTime() ?? $event->getEnd()->getDate(),
            ];
        }, $events);
    }

    /**
     * Check if a time slot is available
     */
    public function checkAvailability(User $user, $startTime, $endTime)
    {
        $service = $this->getCalendarService($user);

        $optParams = [
            'timeMin' => $startTime,
            'timeMax' => $endTime,
        ];

        $results = $service->events->listEvents('primary', $optParams);
        
        return count($results->getItems()) === 0;
    }

    /**
     * Disconnect Google Calendar
     */
    public function disconnect(User $user)
    {
        $user->google_access_token = null;
        $user->save();
    }
}
