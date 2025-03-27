package com.eventzen.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "categories")
public class Category {
    @Id
    private String id;
    private String name;
    private String description;
    private double allocatedAmount;
    private double spentAmount;
    
    // Helper method to calculate remaining amount
    public double getRemainingAmount() {
        return allocatedAmount - spentAmount;
    }
} 