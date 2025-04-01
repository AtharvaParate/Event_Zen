package com.eventzen.budgetservice.dto;

import com.eventzen.budgetservice.model.Budget;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class BudgetDTO {

    private Long id;
    
    @NotNull(message = "Event ID cannot be null")
    private Long eventId;
    
    @NotBlank(message = "Name cannot be blank")
    @Size(max = 100, message = "Name must be less than 100 characters")
    private String name;
    
    @NotNull(message = "Total budget cannot be null")
    @Positive(message = "Total budget must be positive")
    private BigDecimal totalBudget;
    
    private BigDecimal currentExpenses;
    
    private BigDecimal currentIncome;
    
    private String status;
    
    @Size(max = 1000, message = "Notes must be less than 1000 characters")
    private String notes;
    
    private List<String> categories = new ArrayList<>();
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Default constructor
    public BudgetDTO() {
    }
    
    // All-args constructor
    public BudgetDTO(Long id, Long eventId, String name, BigDecimal totalBudget,
                  BigDecimal currentExpenses, BigDecimal currentIncome, String status,
                  String notes, List<String> categories, LocalDateTime createdAt,
                  LocalDateTime updatedAt) {
        this.id = id;
        this.eventId = eventId;
        this.name = name;
        this.totalBudget = totalBudget;
        this.currentExpenses = currentExpenses;
        this.currentIncome = currentIncome;
        this.status = status;
        this.notes = notes;
        this.categories = categories;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Static builder method
    public static BudgetDTOBuilder builder() {
        return new BudgetDTOBuilder();
    }
    
    // Builder class
    public static class BudgetDTOBuilder {
        private Long id;
        private Long eventId;
        private String name;
        private BigDecimal totalBudget;
        private BigDecimal currentExpenses;
        private BigDecimal currentIncome;
        private String status;
        private String notes;
        private List<String> categories = new ArrayList<>();
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public BudgetDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }
        
        public BudgetDTOBuilder eventId(Long eventId) {
            this.eventId = eventId;
            return this;
        }
        
        public BudgetDTOBuilder name(String name) {
            this.name = name;
            return this;
        }
        
        public BudgetDTOBuilder totalBudget(BigDecimal totalBudget) {
            this.totalBudget = totalBudget;
            return this;
        }
        
        public BudgetDTOBuilder currentExpenses(BigDecimal currentExpenses) {
            this.currentExpenses = currentExpenses;
            return this;
        }
        
        public BudgetDTOBuilder currentIncome(BigDecimal currentIncome) {
            this.currentIncome = currentIncome;
            return this;
        }
        
        public BudgetDTOBuilder status(String status) {
            this.status = status;
            return this;
        }
        
        public BudgetDTOBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }
        
        public BudgetDTOBuilder categories(List<String> categories) {
            this.categories = categories;
            return this;
        }
        
        public BudgetDTOBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        
        public BudgetDTOBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }
        
        public BudgetDTO build() {
            return new BudgetDTO(id, eventId, name, totalBudget, currentExpenses, 
                             currentIncome, status, notes, categories, createdAt, updatedAt);
        }
    }
    
    // Conversion methods
    public static BudgetDTO fromEntity(Budget budget) {
        if (budget == null) return null;
        
        // Create a builder with properties from the entity
        BudgetDTOBuilder builder = BudgetDTO.builder()
                .id(budget.getId())
                .eventId(budget.getEventId())
                .name(budget.getName())
                .totalBudget(budget.getTotalBudget())
                .currentExpenses(budget.getCurrentExpenses() != null ? budget.getCurrentExpenses() : BigDecimal.ZERO)
                .currentIncome(budget.getCurrentIncome() != null ? budget.getCurrentIncome() : BigDecimal.ZERO)
                .notes(budget.getNotes())
                .categories(new ArrayList<>(budget.getCategories()))
                .createdAt(budget.getCreatedAt())
                .updatedAt(budget.getUpdatedAt());

        // Set status as string if it exists
        if (budget.getStatus() != null) {
            builder.status(budget.getStatus().name());
        }
        
        return builder.build();
    }
    
    public Budget toEntity() {
        // Use the Budget's builder
        Budget.BudgetBuilder builder = Budget.builder()
                .eventId(this.eventId)
                .name(this.name)
                .totalBudget(this.totalBudget)
                .notes(this.notes)
                .categories(this.categories != null ? this.categories : new ArrayList<>());

        // Set ID only if it exists
        if (this.id != null) {
            builder.id(this.id);
        }
        
        // Set currentExpenses and currentIncome only if they exist, otherwise default to zero
        builder.currentExpenses(this.currentExpenses != null ? this.currentExpenses : BigDecimal.ZERO);
        builder.currentIncome(this.currentIncome != null ? this.currentIncome : BigDecimal.ZERO);
        
        // Parse status if it exists, otherwise default to ACTIVE
        if (this.status != null && !this.status.isEmpty()) {
            try {
                builder.status(Budget.BudgetStatus.valueOf(this.status));
            } catch (IllegalArgumentException e) {
                builder.status(Budget.BudgetStatus.ACTIVE);
            }
        } else {
            builder.status(Budget.BudgetStatus.ACTIVE);
        }
        
        // Set timestamps if they exist
        if (this.createdAt != null) {
            builder.createdAt(this.createdAt);
        }
        if (this.updatedAt != null) {
            builder.updatedAt(this.updatedAt);
        }
        
        return builder.build();
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(BigDecimal totalBudget) {
        this.totalBudget = totalBudget;
    }

    public BigDecimal getCurrentExpenses() {
        return currentExpenses;
    }

    public void setCurrentExpenses(BigDecimal currentExpenses) {
        this.currentExpenses = currentExpenses;
    }

    public BigDecimal getCurrentIncome() {
        return currentIncome;
    }

    public void setCurrentIncome(BigDecimal currentIncome) {
        this.currentIncome = currentIncome;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
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