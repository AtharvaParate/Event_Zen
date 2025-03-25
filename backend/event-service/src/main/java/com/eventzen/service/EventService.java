package com.eventzen.service;

import com.eventzen.model.Event;
import com.eventzen.model.User;
import com.eventzen.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;

    @Transactional(readOnly = true)
    public Page<Event> getAllEvents(Pageable pageable) {
        return eventRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Event getEventById(String id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    @Transactional(readOnly = true)
    public Page<Event> getEventsByOrganizer(User organizer, Pageable pageable) {
        return eventRepository.findByOrganizer(organizer, pageable);
    }

    @Transactional
    public Event createEvent(Event event) {
        event.setStatus(Event.EventStatus.DRAFT);
        return eventRepository.save(event);
    }

    @Transactional
    public Event updateEvent(String id, Event eventDetails) {
        Event event = getEventById(id);

        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setStartDateTime(eventDetails.getStartDateTime());
        event.setEndDateTime(eventDetails.getEndDateTime());
        event.setVenue(eventDetails.getVenue());
        event.setMaxAttendees(eventDetails.getMaxAttendees());
        event.setPrice(eventDetails.getPrice());
        event.setVendors(eventDetails.getVendors());

        return eventRepository.save(event);
    }

    @Transactional
    public Event updateEventStatus(String id, Event.EventStatus status) {
        Event event = getEventById(id);
        event.setStatus(status);
        return eventRepository.save(event);
    }

    @Transactional
    public void deleteEvent(String id) {
        Event event = getEventById(id);
        eventRepository.delete(event);
    }

    @Transactional(readOnly = true)
    public List<Event> getUpcomingEvents() {
        LocalDateTime now = LocalDateTime.now();
        return eventRepository.findByStartDateTimeBetween(now, now.plusMonths(1));
    }

    @Transactional(readOnly = true)
    public Page<Event> searchEvents(String title, Pageable pageable) {
        return eventRepository.findByTitleContainingIgnoreCase(title, pageable);
    }

    @Transactional(readOnly = true)
    public List<Event> getEventsByVenue(String venue) {
        return eventRepository.findByVenueContainingIgnoreCase(venue);
    }

    @Transactional(readOnly = true)
    public List<Event> getEventsByCategory(String category) {
        // Implementation needed
        throw new UnsupportedOperationException("Method not implemented");
    }

    @Transactional(readOnly = true)
    public List<Event> getEventsByOrganizerId(String organizerId) {
        // Implementation needed
        throw new UnsupportedOperationException("Method not implemented");
    }

    @Transactional(readOnly = true)
    public List<Event> getEventsByStatus(Event.EventStatus status) {
        // Implementation needed
        throw new UnsupportedOperationException("Method not implemented");
    }

    @Transactional(readOnly = true)
    public List<Event> getEventsByVendorId(String vendorId) {
        // Implementation needed
        throw new UnsupportedOperationException("Method not implemented");
    }

    @Transactional(readOnly = true)
    public List<Event> getEventsByAttendeeId(String attendeeId) {
        // Implementation needed
        throw new UnsupportedOperationException("Method not implemented");
    }

    @Transactional(readOnly = true)
    public List<Event> getEventsByDateRange(LocalDateTime start, LocalDateTime end) {
        // Implementation needed
        throw new UnsupportedOperationException("Method not implemented");
    }

    @Transactional(readOnly = true)
    public List<Event> getEventsByTag(String tag) {
        // Implementation needed
        throw new UnsupportedOperationException("Method not implemented");
    }
}