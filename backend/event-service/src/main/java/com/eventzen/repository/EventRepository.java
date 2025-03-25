package com.eventzen.repository;

import com.eventzen.model.Event;
import com.eventzen.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {

    Page<Event> findByOrganizerId(String organizerId, Pageable pageable);

    Page<Event> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    List<Event> findByLocationContainingIgnoreCase(String location);

    List<Event> findByCategory(String category);

    List<Event> findByStatus(Event.EventStatus status);

    List<Event> findByVendorIdsContaining(String vendorId);

    List<Event> findByAttendeeIdsContaining(String attendeeId);

    List<Event> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);

    List<Event> findByStartTimeAfterAndStatusOrderByStartTimeAsc(LocalDateTime now, Event.EventStatus status);

    List<Event> findByTagsContainingIgnoreCase(String tag);
}