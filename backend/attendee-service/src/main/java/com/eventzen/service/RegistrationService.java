package com.eventzen.service;

import com.eventzen.model.Registration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface RegistrationService {
    /**
     * Get all registrations with pagination
     */
    Page<Registration> getAllRegistrations(Pageable pageable);

    /**
     * Get registration by ID
     */
    Registration getRegistrationById(String id);

    /**
     * Get registrations by attendee ID
     */
    List<Registration> getRegistrationsByAttendeeId(String attendeeId);

    /**
     * Get registrations by event ID
     */
    List<Registration> getRegistrationsByEventId(String eventId);

    /**
     * Get registrations by event ID and payment status
     */
    List<Registration> getRegistrationsByEventIdAndPaymentStatus(String eventId, Registration.PaymentStatus status);

    /**
     * Get registrations by event ID and check-in status
     */
    List<Registration> getRegistrationsByEventIdAndCheckInStatus(String eventId, Registration.CheckInStatus status);

    /**
     * Get registrations created within a date range
     */
    List<Registration> getRegistrationsByDateRange(LocalDateTime start, LocalDateTime end);

    /**
     * Create a new registration
     */
    Registration createRegistration(Registration registration);

    /**
     * Update an existing registration
     */
    Registration updateRegistration(String id, Registration registrationDetails);

    /**
     * Update registration payment status
     */
    Registration updatePaymentStatus(String id, Registration.PaymentStatus status);

    /**
     * Check in a registration
     */
    Registration checkInRegistration(String id);

    /**
     * Update registration check-in status
     */
    Registration updateCheckInStatus(String id, Registration.CheckInStatus status);

    /**
     * Delete a registration
     */
    void deleteRegistration(String id);

    /**
     * Count registrations for an event
     */
    long countRegistrationsByEventId(String eventId);

    /**
     * Count registrations for an event by payment status
     */
    long countRegistrationsByEventIdAndPaymentStatus(String eventId, Registration.PaymentStatus status);

    /**
     * Search registrations by confirmation number
     */
    List<Registration> searchRegistrationsByConfirmationNumber(String confirmationNumber);
} 