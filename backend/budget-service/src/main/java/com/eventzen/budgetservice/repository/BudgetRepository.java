package com.eventzen.budgetservice.repository;

import com.eventzen.budgetservice.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    
    List<Budget> findByEventId(Long eventId);
    
    List<Budget> findByStatus(Budget.BudgetStatus status);
    
} 