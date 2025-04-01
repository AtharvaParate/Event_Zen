package com.eventzen.budgetservice.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;

import com.eventzen.budgetservice.model.Expense;

public class ExpenseDTO {

    private Long id;
    
    @NotNull(message = "Budget ID cannot be null")
    private Long budgetId;
    
    @NotBlank(message = "Category cannot be blank")
    @Size(max = 50, message = "Category must be less than 50 characters")
    private String category;
    
    @NotNull(message = "Amount cannot be null")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
    
    @Size(max = 1000, message = "Description must be less than 1000 characters")
    private String description;
    
    @Size(max = 100, message = "Vendor must be less than 100 characters")
    private String vendor;
    
    @NotNull(message = "Date cannot be null")
    private LocalDate date;
    
    private String paymentStatus;
    
    @Size(max = 255, message = "Receipt URL must be less than 255 characters")
    private String receiptUrl;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Default constructor
    public ExpenseDTO() {
    }
    
    // All-args constructor
    public ExpenseDTO(Long id, Long budgetId, String category, BigDecimal amount, String description,
                    String vendor, LocalDate date, String paymentStatus, String receiptUrl,
                    LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.budgetId = budgetId;
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
    public static ExpenseDTOBuilder builder() {
        return new ExpenseDTOBuilder();
    }
    
    // Builder class
    public static class ExpenseDTOBuilder {
        private Long id;
        private Long budgetId;
        private String category;
        private BigDecimal amount;
        private String description;
        private String vendor;
        private LocalDate date;
        private String paymentStatus;
        private String receiptUrl;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public ExpenseDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }
        
        public ExpenseDTOBuilder budgetId(Long budgetId) {
            this.budgetId = budgetId;
            return this;
        }
        
        public ExpenseDTOBuilder category(String category) {
            this.category = category;
            return this;
        }
        
        public ExpenseDTOBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }
        
        public ExpenseDTOBuilder description(String description) {
            this.description = description;
            return this;
        }
        
        public ExpenseDTOBuilder vendor(String vendor) {
            this.vendor = vendor;
            return this;
        }
        
        public ExpenseDTOBuilder date(LocalDate date) {
            this.date = date;
            return this;
        }
        
        public ExpenseDTOBuilder paymentStatus(String paymentStatus) {
            this.paymentStatus = paymentStatus;
            return this;
        }
        
        public ExpenseDTOBuilder receiptUrl(String receiptUrl) {
            this.receiptUrl = receiptUrl;
            return this;
        }
        
        public ExpenseDTOBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        
        public ExpenseDTOBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }
        
        public ExpenseDTO build() {
            return new ExpenseDTO(id, budgetId, category, amount, description, vendor, date, 
                               paymentStatus, receiptUrl, createdAt, updatedAt);
        }
    }
    
    // Conversion methods
    public static ExpenseDTO fromEntity(Expense expense) {
        if (expense == null) return null;
        
        // Create a builder with properties from the entity
        ExpenseDTOBuilder builder = ExpenseDTO.builder()
                .id(expense.getId())
                .budgetId(expense.getBudget() != null ? expense.getBudget().getId() : null)
                .category(expense.getCategory())
                .amount(expense.getAmount())
                .description(expense.getDescription())
                .vendor(expense.getVendor())
                .date(expense.getDate())
                .receiptUrl(expense.getReceiptUrl())
                .createdAt(expense.getCreatedAt())
                .updatedAt(expense.getUpdatedAt());

        // Set paymentStatus as string if it exists
        if (expense.getPaymentStatus() != null) {
            builder.paymentStatus(expense.getPaymentStatus().name());
        }
        
        return builder.build();
    }
    
    /**
     * Converts this DTO to an Expense entity.
     * Note: This method does not set the Budget object, which should be done separately
     * as it requires accessing the BudgetRepository.
     *
     * @return a new Expense entity with values from this DTO
     */
    public Expense toEntity() {
        Expense expense = new Expense();
        
        // Set id only if it exists (for updates)
        if (this.id != null) {
            expense.setId(this.id);
        }
        
        expense.setCategory(this.category);
        expense.setAmount(this.amount);
        expense.setDescription(this.description);
        expense.setVendor(this.vendor);
        expense.setDate(this.date);
        expense.setReceiptUrl(this.receiptUrl);
        
        // Parse payment status if it exists, otherwise default to PENDING
        if (this.paymentStatus != null && !this.paymentStatus.isEmpty()) {
            try {
                expense.setPaymentStatus(Expense.PaymentStatus.valueOf(this.paymentStatus));
            } catch (IllegalArgumentException e) {
                expense.setPaymentStatus(Expense.PaymentStatus.PENDING);
            }
        } else {
            expense.setPaymentStatus(Expense.PaymentStatus.PENDING);
        }
        
        // Set timestamps if they exist
        if (this.createdAt != null) {
            expense.setCreatedAt(this.createdAt);
        }
        if (this.updatedAt != null) {
            expense.setUpdatedAt(this.updatedAt);
        }
        
        return expense;
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBudgetId() {
        return budgetId;
    }

    public void setBudgetId(Long budgetId) {
        this.budgetId = budgetId;
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

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
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