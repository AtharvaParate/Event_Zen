package com.eventzen.budgetservice.model;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "incomes")
public class Income {

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
    private String source;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private IncomeStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum IncomeStatus {
        EXPECTED, RECEIVED, CANCELLED
    }
    
    // Default constructor
    public Income() {
    }
    
    // All-args constructor
    public Income(Long id, Budget budget, String category, BigDecimal amount, String description, 
                 String source, LocalDate date, IncomeStatus status, LocalDateTime createdAt, 
                 LocalDateTime updatedAt) {
        this.id = id;
        this.budget = budget;
        this.category = category;
        this.amount = amount;
        this.description = description;
        this.source = source;
        this.date = date;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Static builder method
    public static IncomeBuilder builder() {
        return new IncomeBuilder();
    }
    
    // Builder class
    public static class IncomeBuilder {
        private Long id;
        private Budget budget;
        private String category;
        private BigDecimal amount;
        private String description;
        private String source;
        private LocalDate date;
        private IncomeStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public IncomeBuilder id(Long id) {
            this.id = id;
            return this;
        }
        
        public IncomeBuilder budget(Budget budget) {
            this.budget = budget;
            return this;
        }
        
        public IncomeBuilder category(String category) {
            this.category = category;
            return this;
        }
        
        public IncomeBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }
        
        public IncomeBuilder description(String description) {
            this.description = description;
            return this;
        }
        
        public IncomeBuilder source(String source) {
            this.source = source;
            return this;
        }
        
        public IncomeBuilder date(LocalDate date) {
            this.date = date;
            return this;
        }
        
        public IncomeBuilder status(IncomeStatus status) {
            this.status = status;
            return this;
        }
        
        public IncomeBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        
        public IncomeBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }
        
        public Income build() {
            return new Income(id, budget, category, amount, description, source, date, 
                           status, createdAt, updatedAt);
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

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public IncomeStatus getStatus() {
        return status;
    }

    public void setStatus(IncomeStatus status) {
        this.status = status;
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