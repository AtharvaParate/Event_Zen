package com.eventzen.controller;

import com.eventzen.model.Event;
import com.eventzen.model.User;
import com.eventzen.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
@Tag(name = "Events", description = "Event management endpoints")
public class EventController {
    private final EventService eventService;

    @GetMapping
    @Operation(summary = "Get all events", description = "Get a paginated list of all events")
    public ResponseEntity<Page<Event>> getAllEvents(Pageable pageable) {
        return ResponseEntity.ok(eventService.getAllEvents(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get event by ID", description = "Get a specific event by its ID")
    public ResponseEntity<Event> getEventById(@PathVariable String id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @GetMapping("/organizer")
    @Operation(summary = "Get organizer's events", description = "Get events organized by the authenticated user")
    public ResponseEntity<Page<Event>> getEventsByOrganizer(
            @AuthenticationPrincipal User user,
            Pageable pageable) {
        return ResponseEntity.ok(eventService.getEventsByOrganizer(user, pageable));
    }

    @PostMapping
    @Operation(summary = "Create event", description = "Create a new event")
    public ResponseEntity<Event> createEvent(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody Event event) {
        event.setOrganizerId(user.getId());
        return ResponseEntity.ok(eventService.createEvent(event));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update event", description = "Update an existing event")
    public ResponseEntity<Event> updateEvent(
            @PathVariable String id,
            @Valid @RequestBody Event eventDetails) {
        return ResponseEntity.ok(eventService.updateEvent(id, eventDetails));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update event status", description = "Update the status of an event")
    public ResponseEntity<Event> updateEventStatus(
            @PathVariable String id,
            @RequestParam Event.EventStatus status) {
        return ResponseEntity.ok(eventService.updateEventStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete event", description = "Delete an event by its ID")
    public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming events", description = "Get a list of upcoming published events")
    public ResponseEntity<List<Event>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }

    @GetMapping("/search")
    @Operation(summary = "Search events", description = "Search events by title")
    public ResponseEntity<Page<Event>> searchEvents(
            @RequestParam String title,
            Pageable pageable) {
        return ResponseEntity.ok(eventService.searchEvents(title, pageable));
    }

    @GetMapping("/venue/{venue}")
    @Operation(summary = "Get events by venue", description = "Get events by venue name")
    public ResponseEntity<List<Event>> getEventsByVenue(@PathVariable String venue) {
        return ResponseEntity.ok(eventService.getEventsByVenue(venue));
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get events by category", description = "Get events by category")
    public ResponseEntity<List<Event>> getEventsByCategory(
            @PathVariable String category) {
        return ResponseEntity.ok(eventService.getEventsByCategory(category));
    }

    @GetMapping("/organizer/{organizerId}")
    @Operation(summary = "Get events by organizer ID", description = "Get events by organizer ID")
    public ResponseEntity<List<Event>> getEventsByOrganizerId(
            @PathVariable String organizerId) {
        return ResponseEntity.ok(eventService.getEventsByOrganizerId(organizerId));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get events by status", description = "Get events by status")
    public ResponseEntity<List<Event>> getEventsByStatus(
            @PathVariable Event.EventStatus status) {
        return ResponseEntity.ok(eventService.getEventsByStatus(status));
    }

    @GetMapping("/vendor/{vendorId}")
    @Operation(summary = "Get events by vendor ID", description = "Get events associated with a specific vendor")
    public ResponseEntity<List<Event>> getEventsByVendorId(
            @PathVariable String vendorId) {
        return ResponseEntity.ok(eventService.getEventsByVendorId(vendorId));
    }

    @GetMapping("/attendee/{attendeeId}")
    @Operation(summary = "Get events by attendee ID", description = "Get events a specific attendee is registered for")
    public ResponseEntity<List<Event>> getEventsByAttendeeId(
            @PathVariable String attendeeId) {
        return ResponseEntity.ok(eventService.getEventsByAttendeeId(attendeeId));
    }

    @GetMapping("/dateRange")
    @Operation(summary = "Get events by date range", description = "Get events within a specific date range")
    public ResponseEntity<List<Event>> getEventsByDateRange(
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        return ResponseEntity.ok(eventService.getEventsByDateRange(start, end));
    }

    @GetMapping("/tag/{tag}")
    @Operation(summary = "Get events by tag", description = "Get events with a specific tag")
    public ResponseEntity<List<Event>> getEventsByTag(@PathVariable String tag) {
        return ResponseEntity.ok(eventService.getEventsByTag(tag));
    }

    @GetMapping("/public")
    @Operation(summary = "Get public events", description = "Get publicly available events (published status)")
    public ResponseEntity<List<Event>> getPublicEvents() {
        return ResponseEntity.ok(eventService.getEventsByStatus(Event.EventStatus.PUBLISHED));
    }
}