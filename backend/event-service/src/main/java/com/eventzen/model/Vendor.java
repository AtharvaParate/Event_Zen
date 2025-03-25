package com.eventzen.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "vendors")
public class Vendor {

    @Id
    private String id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Indexed(unique = true)
    private String email;

    private String phone;
    private String description;
    private String contactPerson;
    private String address;

    @NotNull(message = "Vendor type is required")
    private VendorType type;

    @Builder.Default
    private List<String> serviceAreas = new ArrayList<>();

    @Builder.Default
    private List<String> eventIds = new ArrayList<>();

    private boolean isActive;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum VendorType {
        CATERING,
        VENUE,
        PHOTOGRAPHY,
        VIDEOGRAPHY,
        MUSIC,
        DECORATION,
        TRANSPORTATION,
        OTHER
    }
}