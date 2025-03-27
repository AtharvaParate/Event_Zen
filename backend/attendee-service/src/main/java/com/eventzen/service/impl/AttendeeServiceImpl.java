package com.eventzen.service.impl;

import com.eventzen.exception.ResourceNotFoundException;
import com.eventzen.model.Attendee;
import com.eventzen.repository.AttendeeRepository;
import com.eventzen.service.AttendeeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttendeeServiceImpl implements AttendeeService {

    private static final Logger logger = LoggerFactory.getLogger(AttendeeServiceImpl.class);

    private final AttendeeRepository attendeeRepository;

    // Constructor injection
    public AttendeeServiceImpl(AttendeeRepository attendeeRepository) {
        this.attendeeRepository = attendeeRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Attendee> getAllAttendees(Pageable pageable) {
        logger.debug("Getting all attendees with pagination");
        return attendeeRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Attendee getAttendeeById(String id) {
        logger.debug("Getting attendee with ID: {}", id);
        return attendeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendee not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Attendee getAttendeeByUserId(String userId) {
        logger.debug("Getting attendee with user ID: {}", userId);
        return attendeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendee not found with user id: " + userId));
    }

    @Override
    @Transactional(readOnly = true)
    public Attendee getAttendeeByEmail(String email) {
        logger.debug("Getting attendee with email: {}", email);
        return attendeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Attendee not found with email: " + email));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Attendee> getAttendeesByEventId(String eventId) {
        logger.debug("Getting attendees for event ID: {}", eventId);
        return attendeeRepository.findByEventIdsContaining(eventId);
    }

    @Override
    @Transactional
    public Attendee createAttendee(Attendee attendee) {
        logger.debug("Creating new attendee: {}", attendee.getEmail());
        attendee.setCreatedAt(LocalDateTime.now());
        attendee.setUpdatedAt(LocalDateTime.now());
        if (attendee.getStatus() == null) {
            attendee.setStatus(Attendee.AttendeeStatus.ACTIVE);
        }
        return attendeeRepository.save(attendee);
    }

    @Override
    @Transactional
    public Attendee updateAttendee(String id, Attendee attendeeDetails) {
        logger.debug("Updating attendee with ID: {}", id);
        Attendee attendee = getAttendeeById(id);

        attendee.setFirstName(attendeeDetails.getFirstName());
        attendee.setLastName(attendeeDetails.getLastName());
        attendee.setEmail(attendeeDetails.getEmail());
        attendee.setPhone(attendeeDetails.getPhone());
        attendee.setUpdatedAt(LocalDateTime.now());

        return attendeeRepository.save(attendee);
    }

    @Override
    @Transactional
    public Attendee updateAttendeeStatus(String id, Attendee.AttendeeStatus status) {
        logger.debug("Updating status of attendee with ID: {} to {}", id, status);
        Attendee attendee = getAttendeeById(id);
        attendee.setStatus(status);
        attendee.setUpdatedAt(LocalDateTime.now());
        return attendeeRepository.save(attendee);
    }

    @Override
    @Transactional
    public void deleteAttendee(String id) {
        logger.debug("Deleting attendee with ID: {}", id);
        Attendee attendee = getAttendeeById(id);
        attendeeRepository.delete(attendee);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Attendee> searchAttendeesByName(String searchTerm) {
        logger.debug("Searching attendees with name containing: {}", searchTerm);
        return attendeeRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                searchTerm, searchTerm);
    }

    @Override
    @Transactional
    public Attendee addEventToAttendee(String attendeeId, String eventId) {
        logger.debug("Adding event ID: {} to attendee ID: {}", eventId, attendeeId);
        Attendee attendee = getAttendeeById(attendeeId);

        if (!attendee.getEventIds().contains(eventId)) {
            attendee.getEventIds().add(eventId);
            attendee.setUpdatedAt(LocalDateTime.now());
            return attendeeRepository.save(attendee);
        }

        return attendee;
    }

    @Override
    @Transactional
    public Attendee removeEventFromAttendee(String attendeeId, String eventId) {
        logger.debug("Removing event ID: {} from attendee ID: {}", eventId, attendeeId);
        Attendee attendee = getAttendeeById(attendeeId);

        if (attendee.getEventIds().contains(eventId)) {
            attendee.getEventIds().remove(eventId);
            attendee.setUpdatedAt(LocalDateTime.now());
            return attendeeRepository.save(attendee);
        }

        return attendee;
    }
}