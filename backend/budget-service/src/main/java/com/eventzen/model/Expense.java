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
@Document(collection = "expenses")
public class Expense {
    @Id
    private String id;
    private String budgetId;
    private String categoryId;
    private String vendorId;
    private String name;
    private String description;
    private double amount;
    private LocalDateTime expenseDate;
    private ExpenseStatus status;
    private PaymentMethod paymentMethod;
    private String receiptUrl;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum ExpenseStatus {
        PENDING,
        APPROVED,
        REJECTED,
        PAID
    }

    public enum PaymentMethod {
        CASH,
        CREDIT_CARD,
        BANK_TRANSFER,
        CHECK,
        PAYPAL,
        OTHER
    }
}