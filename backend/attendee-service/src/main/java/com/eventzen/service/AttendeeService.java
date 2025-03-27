package com.eventzen.service;

import com.eventzen.model.Attendee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AttendeeService {
    /**
     * Get all attendees with pagination
     */
    Page<Attendee> getAllAttendees(Pageable pageable);

    /**
     * Get attendee by ID
     */
    Attendee getAttendeeById(String id);

    /**
     * Get attendee by user ID
     */
    Attendee getAttendeeByUserId(String userId);

    /**
     * Get attendee by email
     */
    Attendee getAttendeeByEmail(String email);

    /**
     * Get attendees for a specific event
     */
    List<Attendee> getAttendeesByEventId(String eventId);

    /**
     * Create a new attendee
     */
    Attendee createAttendee(Attendee attendee);

    /**
     * Update an existing attendee
     */
    Attendee updateAttendee(String id, Attendee attendeeDetails);

    /**
     * Update attendee status
     */
    Attendee updateAttendeeStatus(String id, Attendee.AttendeeStatus status);

    /**
     * Delete an attendee
     */
    void deleteAttendee(String id);

    /**
     * Search attendees by name
     */
    List<Attendee> searchAttendeesByName(String searchTerm);

    /**
     * Add an event to an attendee's list of registered events
     */
    Attendee addEventToAttendee(String attendeeId, String eventId);

    /**
     * Remove an event from an attendee's list of registered events
     */
    Attendee removeEventFromAttendee(String attendeeId, String eventId);
} 