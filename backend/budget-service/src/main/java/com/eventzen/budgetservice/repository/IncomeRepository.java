package com.eventzen.budgetservice.repository;

import com.eventzen.budgetservice.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
    
    List<Income> findByBudgetId(Long budgetId);
    
    List<Income> findByStatus(Income.IncomeStatus status);
    
} 