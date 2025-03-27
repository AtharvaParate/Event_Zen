package com.eventzen.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "incomes")
public class Income {
    @Id
    private String id;
    private String budgetId;
    private String name;
    private String description;
    private double amount;
    private LocalDateTime incomeDate;
    private IncomeStatus status;
    private IncomeSource source;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum IncomeStatus {
        EXPECTED,
        RECEIVED,
        CANCELLED
    }

    public enum IncomeSource {
        TICKET_SALES,
        SPONSORSHIP,
        DONATION,
        MERCHANDISE,
        ADVERTISING,
        OTHER
    }
} 