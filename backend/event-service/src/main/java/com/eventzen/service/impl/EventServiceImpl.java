package com.eventzen.service.impl;

import com.eventzen.exception.ResourceNotFoundException;
import com.eventzen.model.Event;
import com.eventzen.model.User;
import com.eventzen.repository.EventRepository;
import com.eventzen.service.EventService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private static final Logger logger = LoggerFactory.getLogger(EventServiceImpl.class);

    private final EventRepository eventRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<Event> getAllEvents(Pageable pageable) {
        logger.debug("Getting all events with pagination");
        return eventRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Event getEventById(String id) {
        logger.debug("Getting event with ID: {}", id);
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Event> getEventsByOrganizer(User user, Pageable pageable) {
        logger.debug("Getting events for organizer: {}", user.getUsername());
        return eventRepository.findByOrganizerId(user.getId(), pageable);
    }

    @Override
    @Transactional
    public Event createEvent(Event event) {
        logger.debug("Creating new event: {}", event.getTitle());
        event.setCreatedAt(LocalDateTime.now());
        event.setUpdatedAt(LocalDateTime.now());
        if (event.getStatus() == null) {
            event.setStatus(Event.EventStatus.DRAFT);
        }
        return eventRepository.save(event);
    }

    @Override
    @Transactional
    public Event updateEvent(String id, Event eventDetails) {
        logger.debug("Updating event with ID: {}", id);
        Event event = getEventById(id);

        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setStartTime(eventDetails.getStartTime());
        event.setEndTime(eventDetails.getEndTime());
        event.setLocation(eventDetails.getLocation());
        event.setMaxAttendees(eventDetails.getMaxAttendees());
        event.setPrice(eventDetails.getPrice());
        event.setVendorIds(eventDetails.getVendorIds());
        event.setUpdatedAt(LocalDateTime.now());

        return eventRepository.save(event);
    }

    @Override
    @Transactional
    public Event updateEventStatus(String id, Event.EventStatus status) {
        logger.debug("Updating status of event with ID: {} to {}", id, status);
        Event event = getEventById(id);
        event.setStatus(status);
        event.setUpdatedAt(LocalDateTime.now());
        return eventRepository.save(event);
    }

    @Override
    @Transactional
    public void deleteEvent(String id) {
        logger.debug("Deleting event with ID: {}", id);
        Event event = getEventById(id);
        eventRepository.delete(event);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> getUpcomingEvents() {
        logger.debug("Getting upcoming events");
        return eventRepository.findByStartTimeAfterAndStatusOrderByStartTimeAsc(
                LocalDateTime.now(), Event.EventStatus.PUBLISHED);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Event> searchEvents(String title, Pageable pageable) {
        logger.debug("Searching events with title containing: {}", title);
        return eventRepository.findByTitleContainingIgnoreCase(title, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> getEventsByVenue(String venue) {
        logger.debug("Getting events at venue: {}", venue);
        return eventRepository.findByVenue(venue);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> getEventsByCategory(String category) {
        logger.debug("Getting events in category: {}", category);
        return eventRepository.findByCategory(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> getEventsByOrganizerId(String organizerId) {
        logger.debug("Getting events by organizer ID: {}", organizerId);
        return eventRepository.findByOrganizerId(organizerId, Pageable.unpaged()).getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> getEventsByStatus(Event.EventStatus status) {
        logger.debug("Getting events with status: {}", status);
        return eventRepository.findByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> getEventsByVendorId(String vendorId) {
        logger.debug("Getting events with vendor ID: {}", vendorId);
        return eventRepository.findByVendorIdsContaining(vendorId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> getEventsByAttendeeId(String attendeeId) {
        logger.debug("Getting events with attendee ID: {}", attendeeId);
        return eventRepository.findByAttendeeIdsContaining(attendeeId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> getEventsByDateRange(LocalDateTime start, LocalDateTime end) {
        logger.debug("Getting events between {} and {}", start, end);
        return eventRepository.findByStartTimeBetween(start, end);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> getEventsByTag(String tag) {
        logger.debug("Getting events with tag: {}", tag);
        return eventRepository.findByTagsContainingIgnoreCase(tag);
    }
}