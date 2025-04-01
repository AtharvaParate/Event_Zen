package com.eventzen.budgetservice.repository;

import com.eventzen.budgetservice.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    List<Expense> findByBudgetId(Long budgetId);
    
    List<Expense> findByPaymentStatus(Expense.PaymentStatus paymentStatus);
    
} 