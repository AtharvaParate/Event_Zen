package com.eventzen.budgetservice.service;

import com.eventzen.budgetservice.dto.BudgetDTO;
import com.eventzen.budgetservice.model.Budget;

import java.util.List;

public interface BudgetService {
    
    List<BudgetDTO> getAllBudgets();
    
    BudgetDTO getBudgetById(Long id);
    
    List<BudgetDTO> getBudgetsByEventId(Long eventId);
    
    BudgetDTO createBudget(BudgetDTO budgetDTO);
    
    BudgetDTO updateBudget(Long id, BudgetDTO budgetDTO);
    
    void deleteBudget(Long id);
    
    List<BudgetDTO> getBudgetsByStatus(Budget.BudgetStatus status);
    
} 