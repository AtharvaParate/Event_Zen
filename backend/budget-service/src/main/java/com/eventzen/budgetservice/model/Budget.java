package com.eventzen.budgetservice.model;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long eventId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalBudget;

    @Column(precision = 15, scale = 2)
    private BigDecimal currentExpenses;

    @Column(precision = 15, scale = 2)
    private BigDecimal currentIncome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BudgetStatus status;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ElementCollection
    @CollectionTable(name = "budget_categories", joinColumns = @JoinColumn(name = "budget_id"))
    @Column(name = "category")
    private List<String> categories = new ArrayList<>();

    @OneToMany(mappedBy = "budget", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Expense> expenses = new ArrayList<>();

    @OneToMany(mappedBy = "budget", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Income> incomes = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum BudgetStatus {
        ACTIVE, CLOSED, DELETED
    }
    
    // Default constructor
    public Budget() {
    }
    
    // All-args constructor
    public Budget(Long id, Long eventId, String name, BigDecimal totalBudget,
                 BigDecimal currentExpenses, BigDecimal currentIncome, BudgetStatus status,
                 String notes, List<String> categories, List<Expense> expenses, 
                 List<Income> incomes, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.eventId = eventId;
        this.name = name;
        this.totalBudget = totalBudget;
        this.currentExpenses = currentExpenses;
        this.currentIncome = currentIncome;
        this.status = status;
        this.notes = notes;
        this.categories = categories;
        this.expenses = expenses;
        this.incomes = incomes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Static builder method
    public static BudgetBuilder builder() {
        return new BudgetBuilder();
    }
    
    // Builder class
    public static class BudgetBuilder {
        private Long id;
        private Long eventId;
        private String name;
        private BigDecimal totalBudget;
        private BigDecimal currentExpenses;
        private BigDecimal currentIncome;
        private BudgetStatus status;
        private String notes;
        private List<String> categories = new ArrayList<>();
        private List<Expense> expenses = new ArrayList<>();
        private List<Income> incomes = new ArrayList<>();
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public BudgetBuilder id(Long id) {
            this.id = id;
            return this;
        }
        
        public BudgetBuilder eventId(Long eventId) {
            this.eventId = eventId;
            return this;
        }
        
        public BudgetBuilder name(String name) {
            this.name = name;
            return this;
        }
        
        public BudgetBuilder totalBudget(BigDecimal totalBudget) {
            this.totalBudget = totalBudget;
            return this;
        }
        
        public BudgetBuilder currentExpenses(BigDecimal currentExpenses) {
            this.currentExpenses = currentExpenses;
            return this;
        }
        
        public BudgetBuilder currentIncome(BigDecimal currentIncome) {
            this.currentIncome = currentIncome;
            return this;
        }
        
        public BudgetBuilder status(BudgetStatus status) {
            this.status = status;
            return this;
        }
        
        public BudgetBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }
        
        public BudgetBuilder categories(List<String> categories) {
            this.categories = categories;
            return this;
        }
        
        public BudgetBuilder expenses(List<Expense> expenses) {
            this.expenses = expenses;
            return this;
        }
        
        public BudgetBuilder incomes(List<Income> incomes) {
            this.incomes = incomes;
            return this;
        }
        
        public BudgetBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        
        public BudgetBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }
        
        public Budget build() {
            return new Budget(id, eventId, name, totalBudget, currentExpenses, 
                            currentIncome, status, notes, categories, expenses, 
                            incomes, createdAt, updatedAt);
        }
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

    public BudgetStatus getStatus() {
        return status;
    }

    public void setStatus(BudgetStatus status) {
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

    public List<Expense> getExpenses() {
        return expenses;
    }

    public void setExpenses(List<Expense> expenses) {
        this.expenses = expenses;
    }

    public List<Income> getIncomes() {
        return incomes;
    }

    public void setIncomes(List<Income> incomes) {
        this.incomes = incomes;
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