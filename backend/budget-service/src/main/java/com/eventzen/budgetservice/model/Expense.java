package com.eventzen.budgetservice.model;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "budget_id", nullable = false)
    private Budget budget;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String vendor;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus paymentStatus;

    @Column(length = 255)
    private String receiptUrl;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum PaymentStatus {
        PENDING, PAID, REFUNDED, CANCELLED
    }
    
    // Default constructor
    public Expense() {
    }
    
    // All-args constructor
    public Expense(Long id, Budget budget, String category, BigDecimal amount, String description,
                  String vendor, LocalDate date, PaymentStatus paymentStatus, String receiptUrl,
                  LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.budget = budget;
        this.category = category;
        this.amount = amount;
        this.description = description;
        this.vendor = vendor;
        this.date = date;
        this.paymentStatus = paymentStatus;
        this.receiptUrl = receiptUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Static builder method
    public static ExpenseBuilder builder() {
        return new ExpenseBuilder();
    }
    
    // Builder class
    public static class ExpenseBuilder {
        private Long id;
        private Budget budget;
        private String category;
        private BigDecimal amount;
        private String description;
        private String vendor;
        private LocalDate date;
        private PaymentStatus paymentStatus;
        private String receiptUrl;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public ExpenseBuilder id(Long id) {
            this.id = id;
            return this;
        }
        
        public ExpenseBuilder budget(Budget budget) {
            this.budget = budget;
            return this;
        }
        
        public ExpenseBuilder category(String category) {
            this.category = category;
            return this;
        }
        
        public ExpenseBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }
        
        public ExpenseBuilder description(String description) {
            this.description = description;
            return this;
        }
        
        public ExpenseBuilder vendor(String vendor) {
            this.vendor = vendor;
            return this;
        }
        
        public ExpenseBuilder date(LocalDate date) {
            this.date = date;
            return this;
        }
        
        public ExpenseBuilder paymentStatus(PaymentStatus paymentStatus) {
            this.paymentStatus = paymentStatus;
            return this;
        }
        
        public ExpenseBuilder receiptUrl(String receiptUrl) {
            this.receiptUrl = receiptUrl;
            return this;
        }
        
        public ExpenseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        
        public ExpenseBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }
        
        public Expense build() {
            return new Expense(id, budget, category, amount, description, vendor, date, 
                             paymentStatus, receiptUrl, createdAt, updatedAt);
        }
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Budget getBudget() {
        return budget;
    }

    public void setBudget(Budget budget) {
        this.budget = budget;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getVendor() {
        return vendor;
    }

    public void setVendor(String vendor) {
        this.vendor = vendor;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getReceiptUrl() {
        return receiptUrl;
    }

    public void setReceiptUrl(String receiptUrl) {
        this.receiptUrl = receiptUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
} 