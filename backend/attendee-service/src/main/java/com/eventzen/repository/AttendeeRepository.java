package com.eventzen.repository;

import com.eventzen.model.Attendee;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendeeRepository extends MongoRepository<Attendee, String> {

    Optional<Attendee> findByUserId(String userId);

    Optional<Attendee> findByEmail(String email);

    List<Attendee> findByEventIdsContaining(String eventId);

    List<Attendee> findByStatus(Attendee.AttendeeStatus status);

    List<Attendee> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
}