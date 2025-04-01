package com.eventzen.budgetservice.service;

import com.eventzen.budgetservice.dto.IncomeDTO;
import com.eventzen.budgetservice.model.Income;

import java.util.List;

public interface IncomeService {
    
    List<IncomeDTO> getAllIncomes();
    
    IncomeDTO getIncomeById(Long id);
    
    List<IncomeDTO> getIncomesByBudgetId(Long budgetId);
    
    IncomeDTO createIncome(IncomeDTO incomeDTO);
    
    IncomeDTO updateIncome(Long id, IncomeDTO incomeDTO);
    
    void deleteIncome(Long id);
    
    List<IncomeDTO> getIncomesByStatus(Income.IncomeStatus status);
    
} 