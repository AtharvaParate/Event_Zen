package com.eventzen.service;

import com.eventzen.model.Event;
import com.eventzen.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface EventService {
    Page<Event> getAllEvents(Pageable pageable);

    Event getEventById(String id);

    Page<Event> getEventsByOrganizer(User organizer, Pageable pageable);

    Event createEvent(Event event);

    Event updateEvent(String id, Event eventDetails);

    Event updateEventStatus(String id, Event.EventStatus status);

    void deleteEvent(String id);

    List<Event> getUpcomingEvents();

    Page<Event> searchEvents(String title, Pageable pageable);

    List<Event> getEventsByVenue(String venue);

    List<Event> getEventsByCategory(String category);

    List<Event> getEventsByOrganizerId(String organizerId);

    List<Event> getEventsByStatus(Event.EventStatus status);

    List<Event> getEventsByVendorId(String vendorId);

    List<Event> getEventsByAttendeeId(String attendeeId);

    List<Event> getEventsByDateRange(LocalDateTime start, LocalDateTime end);

    List<Event> getEventsByTag(String tag);
}