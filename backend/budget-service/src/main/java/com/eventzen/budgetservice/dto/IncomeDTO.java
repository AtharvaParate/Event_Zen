package com.eventzen.budgetservice.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;

import com.eventzen.budgetservice.model.Income;

public class IncomeDTO {

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
    
    @Size(max = 100, message = "Source must be less than 100 characters")
    private String source;
    
    @NotNull(message = "Date cannot be null")
    private LocalDate date;
    
    private String status;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Default constructor
    public IncomeDTO() {
    }
    
    // All-args constructor
    public IncomeDTO(Long id, Long budgetId, String category, BigDecimal amount, String description,
                   String source, LocalDate date, String status, LocalDateTime createdAt,
                   LocalDateTime updatedAt) {
        this.id = id;
        this.budgetId = budgetId;
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
    public static IncomeDTOBuilder builder() {
        return new IncomeDTOBuilder();
    }
    
    // Builder class
    public static class IncomeDTOBuilder {
        private Long id;
        private Long budgetId;
        private String category;
        private BigDecimal amount;
        private String description;
        private String source;
        private LocalDate date;
        private String status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public IncomeDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }
        
        public IncomeDTOBuilder budgetId(Long budgetId) {
            this.budgetId = budgetId;
            return this;
        }
        
        public IncomeDTOBuilder category(String category) {
            this.category = category;
            return this;
        }
        
        public IncomeDTOBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }
        
        public IncomeDTOBuilder description(String description) {
            this.description = description;
            return this;
        }
        
        public IncomeDTOBuilder source(String source) {
            this.source = source;
            return this;
        }
        
        public IncomeDTOBuilder date(LocalDate date) {
            this.date = date;
            return this;
        }
        
        public IncomeDTOBuilder status(String status) {
            this.status = status;
            return this;
        }
        
        public IncomeDTOBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        
        public IncomeDTOBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }
        
        public IncomeDTO build() {
            return new IncomeDTO(id, budgetId, category, amount, description, source, date, 
                              status, createdAt, updatedAt);
        }
    }
    
    // Conversion methods
    public static IncomeDTO fromEntity(Income income) {
        if (income == null) return null;
        
        // Create a builder with properties from the entity
        IncomeDTOBuilder builder = IncomeDTO.builder()
                .id(income.getId())
                .budgetId(income.getBudget() != null ? income.getBudget().getId() : null)
                .category(income.getCategory())
                .amount(income.getAmount())
                .description(income.getDescription())
                .source(income.getSource())
                .date(income.getDate())
                .createdAt(income.getCreatedAt())
                .updatedAt(income.getUpdatedAt());

        // Set status as string if it exists
        if (income.getStatus() != null) {
            builder.status(income.getStatus().name());
        }
        
        return builder.build();
    }
    
    /**
     * Converts this DTO to an Income entity.
     * Note: This method does not set the Budget object, which should be done separately
     * as it requires accessing the BudgetRepository.
     *
     * @return a new Income entity with values from this DTO
     */
    public Income toEntity() {
        Income income = new Income();
        
        // Set id only if it exists (for updates)
        if (this.id != null) {
            income.setId(this.id);
        }
        
        income.setCategory(this.category);
        income.setAmount(this.amount);
        income.setDescription(this.description);
        income.setSource(this.source);
        income.setDate(this.date);
        
        // Parse status if it exists, otherwise default to EXPECTED
        if (this.status != null && !this.status.isEmpty()) {
            try {
                income.setStatus(Income.IncomeStatus.valueOf(this.status));
            } catch (IllegalArgumentException e) {
                income.setStatus(Income.IncomeStatus.EXPECTED);
            }
        } else {
            income.setStatus(Income.IncomeStatus.EXPECTED);
        }
        
        // Set timestamps if they exist
        if (this.createdAt != null) {
            income.setCreatedAt(this.createdAt);
        }
        if (this.updatedAt != null) {
            income.setUpdatedAt(this.updatedAt);
        }
        
        return income;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
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