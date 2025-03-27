package com.eventzen.controller;

import com.eventzen.model.Registration;
import com.eventzen.service.RegistrationService;
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
@RequestMapping("/api/registrations")
@Tag(name = "Registration Controller", description = "API for event registration management")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @GetMapping
    @Operation(summary = "Get all registrations", description = "Returns a paginated list of all registrations")
    public ResponseEntity<Page<Registration>> getAllRegistrations(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(registrationService.getAllRegistrations(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get registration by ID", description = "Returns a registration by its ID")
    public ResponseEntity<Registration> getRegistrationById(@PathVariable String id) {
        return ResponseEntity.ok(registrationService.getRegistrationById(id));
    }

    @GetMapping("/attendee/{attendeeId}")
    @Operation(summary = "Get registrations by attendee", description = "Returns all registrations for a specific attendee")
    public ResponseEntity<List<Registration>> getRegistrationsByAttendeeId(@PathVariable String attendeeId) {
        return ResponseEntity.ok(registrationService.getRegistrationsByAttendeeId(attendeeId));
    }

    @GetMapping("/event/{eventId}")
    @Operation(summary = "Get registrations by event", description = "Returns all registrations for a specific event")
    public ResponseEntity<List<Registration>> getRegistrationsByEventId(@PathVariable String eventId) {
        return ResponseEntity.ok(registrationService.getRegistrationsByEventId(eventId));
    }

    @GetMapping("/event/{eventId}/status/{status}")
    @Operation(summary = "Get registrations by event and payment status", description = "Returns all registrations for a specific event with a specific payment status")
    public ResponseEntity<List<Registration>> getRegistrationsByEventIdAndPaymentStatus(
            @PathVariable String eventId,
            @PathVariable Registration.PaymentStatus status) {
        return ResponseEntity.ok(registrationService.getRegistrationsByEventIdAndPaymentStatus(eventId, status));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create registration", description = "Creates a new registration")
    public ResponseEntity<Registration> createRegistration(@RequestBody Registration registration) {
        return new ResponseEntity<>(registrationService.createRegistration(registration), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update registration", description = "Updates an existing registration")
    public ResponseEntity<Registration> updateRegistration(@PathVariable String id,
            @RequestBody Registration registrationDetails) {
        return ResponseEntity.ok(registrationService.updateRegistration(id, registrationDetails));
    }

    @PatchMapping("/{id}/payment-status")
    @Operation(summary = "Update payment status", description = "Updates the payment status of a registration")
    public ResponseEntity<Registration> updatePaymentStatus(
            @PathVariable String id,
            @RequestParam Registration.PaymentStatus status) {
        return ResponseEntity.ok(registrationService.updatePaymentStatus(id, status));
    }

    @PatchMapping("/{id}/check-in")
    @Operation(summary = "Check in registration", description = "Checks in a registration")
    public ResponseEntity<Registration> checkInRegistration(@PathVariable String id) {
        return ResponseEntity.ok(registrationService.checkInRegistration(id));
    }

    @PatchMapping("/{id}/check-in-status")
    @Operation(summary = "Update check-in status", description = "Updates the check-in status of a registration")
    public ResponseEntity<Registration> updateCheckInStatus(
            @PathVariable String id,
            @RequestParam Registration.CheckInStatus status) {
        return ResponseEntity.ok(registrationService.updateCheckInStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete registration", description = "Deletes a registration")
    public ResponseEntity<Void> deleteRegistration(@PathVariable String id) {
        registrationService.deleteRegistration(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Search registrations", description = "Searches for registrations by confirmation number")
    public ResponseEntity<List<Registration>> searchRegistrations(@RequestParam String confirmationNumber) {
        return ResponseEntity.ok(registrationService.searchRegistrationsByConfirmationNumber(confirmationNumber));
    }
}