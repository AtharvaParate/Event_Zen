package com.eventzen.controller;

import com.eventzen.model.Attendee;
import com.eventzen.service.AttendeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendees")
@Tag(name = "Attendee Controller", description = "API for attendee management")
public class AttendeeController {

    private final AttendeeService attendeeService;

    public AttendeeController(AttendeeService attendeeService) {
        this.attendeeService = attendeeService;
    }

    @GetMapping
    @Operation(summary = "Get all attendees", description = "Returns a paginated list of all attendees")
    public ResponseEntity<Page<Attendee>> getAllAttendees(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(attendeeService.getAllAttendees(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get attendee by ID", description = "Returns an attendee by their ID")
    public ResponseEntity<Attendee> getAttendeeById(@PathVariable String id) {
        return ResponseEntity.ok(attendeeService.getAttendeeById(id));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get attendee by user ID", description = "Returns an attendee by their user ID")
    public ResponseEntity<Attendee> getAttendeeByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(attendeeService.getAttendeeByUserId(userId));
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Get attendee by email", description = "Returns an attendee by their email address")
    public ResponseEntity<Attendee> getAttendeeByEmail(@PathVariable String email) {
        return ResponseEntity.ok(attendeeService.getAttendeeByEmail(email));
    }

    @GetMapping("/event/{eventId}")
    @Operation(summary = "Get attendees by event", description = "Returns all attendees for a specific event")
    public ResponseEntity<List<Attendee>> getAttendeesByEventId(@PathVariable String eventId) {
        return ResponseEntity.ok(attendeeService.getAttendeesByEventId(eventId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create attendee", description = "Creates a new attendee")
    public ResponseEntity<Attendee> createAttendee(@RequestBody Attendee attendee) {
        return new ResponseEntity<>(attendeeService.createAttendee(attendee), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update attendee", description = "Updates an existing attendee")
    public ResponseEntity<Attendee> updateAttendee(@PathVariable String id, @RequestBody Attendee attendeeDetails) {
        return ResponseEntity.ok(attendeeService.updateAttendee(id, attendeeDetails));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update attendee status", description = "Updates the status of an attendee")
    public ResponseEntity<Attendee> updateAttendeeStatus(
            @PathVariable String id,
            @RequestParam Attendee.AttendeeStatus status) {
        return ResponseEntity.ok(attendeeService.updateAttendeeStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete attendee", description = "Deletes an attendee")
    public ResponseEntity<Void> deleteAttendee(@PathVariable String id) {
        attendeeService.deleteAttendee(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Search attendees", description = "Searches for attendees by name")
    public ResponseEntity<List<Attendee>> searchAttendees(@RequestParam String name) {
        return ResponseEntity.ok(attendeeService.searchAttendeesByName(name));
    }

    @PostMapping("/{attendeeId}/events/{eventId}")
    @Operation(summary = "Add event to attendee", description = "Adds an event to an attendee's registered events")
    public ResponseEntity<Attendee> addEventToAttendee(
            @PathVariable String attendeeId,
            @PathVariable String eventId) {
        return ResponseEntity.ok(attendeeService.addEventToAttendee(attendeeId, eventId));
    }

    @DeleteMapping("/{attendeeId}/events/{eventId}")
    @Operation(summary = "Remove event from attendee", description = "Removes an event from an attendee's registered events")
    public ResponseEntity<Attendee> removeEventFromAttendee(
            @PathVariable String attendeeId,
            @PathVariable String eventId) {
        return ResponseEntity.ok(attendeeService.removeEventFromAttendee(attendeeId, eventId));
    }
}