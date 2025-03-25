package com.eventzen.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "events")
public class Event {
    @Id
    private String id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;
    private String category;
    private int maxAttendees;
    private double price;
    private String organizerId;
    private List<String> vendorIds;
    private List<String> attendeeIds;
    @Builder.Default
    private List<String> tags = new ArrayList<>();
    private EventStatus status;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum EventStatus {
        DRAFT,
        PUBLISHED,
        CANCELLED,
        COMPLETED
    }
}