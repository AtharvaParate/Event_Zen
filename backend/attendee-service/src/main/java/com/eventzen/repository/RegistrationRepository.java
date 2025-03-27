package com.eventzen.repository;

import com.eventzen.model.Registration;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistrationRepository extends MongoRepository<Registration, String> {

    List<Registration> findByAttendeeId(String attendeeId);

    List<Registration> findByEventId(String eventId);

    List<Registration> findByEventIdAndPaymentStatus(String eventId, Registration.PaymentStatus paymentStatus);

    List<Registration> findByEventIdAndCheckInStatus(String eventId, Registration.CheckInStatus checkInStatus);

    List<Registration> findByConfirmationNumberContainingIgnoreCase(String confirmationNumber);

    long countByEventId(String eventId);

    long countByEventIdAndPaymentStatus(String eventId, Registration.PaymentStatus paymentStatus);
}