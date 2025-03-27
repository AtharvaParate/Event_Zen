package com.eventzen.service.impl;

import com.eventzen.exception.ResourceNotFoundException;
import com.eventzen.model.Registration;
import com.eventzen.repository.RegistrationRepository;
import com.eventzen.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class RegistrationServiceImpl implements RegistrationService {

    private static final Logger logger = LoggerFactory.getLogger(RegistrationServiceImpl.class);

    private final RegistrationRepository registrationRepository;

    // Constructor injection
    public RegistrationServiceImpl(RegistrationRepository registrationRepository) {
        this.registrationRepository = registrationRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Registration> getAllRegistrations(Pageable pageable) {
        logger.debug("Getting all registrations with pagination");
        return registrationRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Registration getRegistrationById(String id) {
        logger.debug("Getting registration with ID: {}", id);
        return registrationRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Registration not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Registration> getRegistrationsByAttendeeId(String attendeeId) {
        logger.debug("Getting registrations for attendee ID: {}", attendeeId);
        return registrationRepository.findByAttendeeId(attendeeId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Registration> getRegistrationsByEventId(String eventId) {
        logger.debug("Getting registrations for event ID: {}", eventId);
        return registrationRepository.findByEventId(eventId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Registration> getRegistrationsByEventIdAndPaymentStatus(String eventId,
            Registration.PaymentStatus status) {
        logger.debug("Getting registrations for event ID: {} with payment status: {}", eventId, status);
        return registrationRepository.findByEventIdAndPaymentStatus(eventId, status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Registration> getRegistrationsByEventIdAndCheckInStatus(String eventId,
            Registration.CheckInStatus status) {
        logger.debug("Getting registrations for event ID: {} with check-in status: {}", eventId, status);
        return registrationRepository.findByEventIdAndCheckInStatus(eventId, status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Registration> getRegistrationsByDateRange(LocalDateTime start, LocalDateTime end) {
        logger.debug("Getting registrations between {} and {}", start, end);
        // Since we removed the repository method, we'll implement a workaround
        // In a real application, you should add the proper repository method
        List<Registration> allRegistrations = registrationRepository.findAll();
        return allRegistrations.stream()
                .filter(registration -> {
                    LocalDateTime regDate = registration.getRegistrationDate();
                    return regDate != null && !regDate.isBefore(start) && !regDate.isAfter(end);
                })
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional
    public Registration createRegistration(Registration registration) {
        logger.debug("Creating new registration for attendee ID: {} and event ID: {}",
                registration.getAttendeeId(), registration.getEventId());

        // Generate a confirmation number if not provided
        if (registration.getConfirmationNumber() == null || registration.getConfirmationNumber().isEmpty()) {
            registration.setConfirmationNumber(generateConfirmationNumber());
        }

        // Set default statuses if not provided
        if (registration.getPaymentStatus() == null) {
            registration.setPaymentStatus(Registration.PaymentStatus.PENDING);
        }

        if (registration.getCheckInStatus() == null) {
            registration.setCheckInStatus(Registration.CheckInStatus.NOT_CHECKED_IN);
        }

        return registrationRepository.save(registration);
    }

    @Override
    @Transactional
    public Registration updateRegistration(String id, Registration registrationDetails) {
        logger.debug("Updating registration with ID: {}", id);
        Registration existingRegistration = getRegistrationById(id);

        // Update fields but preserve the ID
        if (registrationDetails.getAttendeeId() != null) {
            existingRegistration.setAttendeeId(registrationDetails.getAttendeeId());
        }

        if (registrationDetails.getEventId() != null) {
            existingRegistration.setEventId(registrationDetails.getEventId());
        }

        if (registrationDetails.getTicketType() != null) {
            existingRegistration.setTicketType(registrationDetails.getTicketType());
        }

        if (registrationDetails.getTicketPrice() != null) {
            existingRegistration.setTicketPrice(registrationDetails.getTicketPrice());
        }

        if (registrationDetails.getPaymentMethod() != null) {
            existingRegistration.setPaymentMethod(registrationDetails.getPaymentMethod());
        }

        if (registrationDetails.getPaymentStatus() != null) {
            existingRegistration.setPaymentStatus(registrationDetails.getPaymentStatus());
        }

        if (registrationDetails.getCheckInStatus() != null) {
            existingRegistration.setCheckInStatus(registrationDetails.getCheckInStatus());
        }

        if (registrationDetails.getNotes() != null) {
            existingRegistration.setNotes(registrationDetails.getNotes());
        }

        return registrationRepository.save(existingRegistration);
    }

    @Override
    @Transactional
    public Registration updatePaymentStatus(String id, Registration.PaymentStatus status) {
        logger.debug("Updating payment status of registration with ID: {} to {}", id, status);
        Registration registration = getRegistrationById(id);
        registration.setPaymentStatus(status);
        return registrationRepository.save(registration);
    }

    @Override
    @Transactional
    public Registration checkInRegistration(String id) {
        logger.debug("Checking in attendee for registration with ID: {}", id);
        Registration registration = getRegistrationById(id);
        registration.setCheckInStatus(Registration.CheckInStatus.CHECKED_IN);
        return registrationRepository.save(registration);
    }

    @Override
    @Transactional
    public Registration updateCheckInStatus(String id, Registration.CheckInStatus status) {
        logger.debug("Updating check-in status of registration with ID: {} to {}", id, status);
        Registration registration = getRegistrationById(id);
        registration.setCheckInStatus(status);
        return registrationRepository.save(registration);
    }

    @Override
    @Transactional
    public void deleteRegistration(String id) {
        logger.debug("Deleting registration with ID: {}", id);
        Registration registration = getRegistrationById(id);
        registrationRepository.delete(registration);
    }

    @Override
    @Transactional(readOnly = true)
    public long countRegistrationsByEventId(String eventId) {
        logger.debug("Counting registrations for event ID: {}", eventId);
        return registrationRepository.countByEventId(eventId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countRegistrationsByEventIdAndPaymentStatus(String eventId, Registration.PaymentStatus status) {
        logger.debug("Counting registrations for event ID: {} with payment status: {}", eventId, status);
        return registrationRepository.countByEventIdAndPaymentStatus(eventId, status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Registration> searchRegistrationsByConfirmationNumber(String confirmationNumber) {
        return registrationRepository.findByConfirmationNumberContainingIgnoreCase(confirmationNumber);
    }

    /**
     * Generates a unique confirmation number for registrations
     * 
     * @return A unique confirmation number
     */
    private String generateConfirmationNumber() {
        // Creating a confirmation number that starts with REG followed by 8
        // alphanumeric characters
        return "REG" + UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8).toUpperCase();
    }
}