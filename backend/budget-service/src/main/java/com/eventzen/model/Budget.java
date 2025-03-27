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
@Document(collection = "budgets")
public class Budget {
    @Id
    private String id;
    private String eventId;
    private String name;
    private String description;
    private double totalBudget;
    private double allocatedAmount;
    private double spentAmount;
    private BudgetStatus status;
    @Builder.Default
    private List<Category> categories = new ArrayList<>();
    @Builder.Default
    private List<Expense> expenses = new ArrayList<>();
    @Builder.Default
    private List<Income> incomes = new ArrayList<>();
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum BudgetStatus {
        DRAFT,
        ACTIVE,
        CLOSED
    }
}