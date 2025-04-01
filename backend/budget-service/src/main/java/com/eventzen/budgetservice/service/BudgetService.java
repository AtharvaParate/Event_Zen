package com.eventzen.budgetservice.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.eventzen.budgetservice.dto.BudgetDTO;
import com.eventzen.budgetservice.model.Budget;

public interface BudgetService {
    
    List<BudgetDTO> getAllBudgets();
    
    Page<BudgetDTO> getAllBudgetsPaginated(Pageable pageable);
    
    BudgetDTO getBudgetById(Long id);
    
    List<BudgetDTO> getBudgetsByEventId(Long eventId);
    
    List<BudgetDTO> getBudgetsByStatus(Budget.BudgetStatus status);
    
    BudgetDTO createBudget(BudgetDTO budgetDTO);
    
    BudgetDTO updateBudget(Long id, BudgetDTO budgetDTO);
    
    void deleteBudget(Long id);
    
} 