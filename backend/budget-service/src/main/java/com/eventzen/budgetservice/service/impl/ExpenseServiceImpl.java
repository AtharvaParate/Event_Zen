package com.eventzen.budgetservice.service.impl;

import com.eventzen.budgetservice.dto.ExpenseDTO;
import com.eventzen.budgetservice.model.Budget;
import com.eventzen.budgetservice.model.Expense;
import com.eventzen.budgetservice.repository.BudgetRepository;
import com.eventzen.budgetservice.repository.ExpenseRepository;
import com.eventzen.budgetservice.service.ExpenseService;
import com.eventzen.budgetservice.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;

    @Autowired
    public ExpenseServiceImpl(ExpenseRepository expenseRepository, BudgetRepository budgetRepository) {
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
    }

    @Override
    public List<ExpenseDTO> getAllExpenses() {
        return expenseRepository.findAll()
                .stream()
                .map(ExpenseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public ExpenseDTO getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "id", id));
        return ExpenseDTO.fromEntity(expense);
    }

    @Override
    public List<ExpenseDTO> getExpensesByBudgetId(Long budgetId) {
        return expenseRepository.findByBudgetId(budgetId)
                .stream()
                .map(ExpenseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ExpenseDTO createExpense(ExpenseDTO expenseDTO) {
        // Find the budget
        Budget budget = budgetRepository.findById(expenseDTO.getBudgetId())
                .orElseThrow(() -> new ResourceNotFoundException("Budget", "id", expenseDTO.getBudgetId()));
        
        // Create new expense entity from DTO
        Expense expense = new Expense();
        expense.setBudget(budget);
        expense.setCategory(expenseDTO.getCategory());
        expense.setAmount(expenseDTO.getAmount());
        expense.setDescription(expenseDTO.getDescription());
        expense.setVendor(expenseDTO.getVendor());
        expense.setDate(expenseDTO.getDate());
        
        // Set payment status
        try {
            if (expenseDTO.getPaymentStatus() != null && !expenseDTO.getPaymentStatus().isEmpty()) {
                expense.setPaymentStatus(Expense.PaymentStatus.valueOf(expenseDTO.getPaymentStatus()));
            } else {
                expense.setPaymentStatus(Expense.PaymentStatus.PENDING);
            }
        } catch (IllegalArgumentException e) {
            expense.setPaymentStatus(Expense.PaymentStatus.PENDING);
        }
        
        expense.setReceiptUrl(expenseDTO.getReceiptUrl());
        
        // Save the expense
        Expense savedExpense = expenseRepository.save(expense);
        
        // Update the budget's current expenses
        BigDecimal currentExpenses = budget.getCurrentExpenses() != null ? 
                budget.getCurrentExpenses() : BigDecimal.ZERO;
        budget.setCurrentExpenses(currentExpenses.add(expenseDTO.getAmount()));
        budgetRepository.save(budget);
        
        return ExpenseDTO.fromEntity(savedExpense);
    }

    @Override
    @Transactional
    public ExpenseDTO updateExpense(Long id, ExpenseDTO expenseDTO) {
        // Find the existing expense
        Expense existingExpense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "id", id));
        
        // Calculate amount difference for budget update
        BigDecimal amountDifference = expenseDTO.getAmount().subtract(existingExpense.getAmount());
        
        // Update the expense
        existingExpense.setCategory(expenseDTO.getCategory());
        existingExpense.setAmount(expenseDTO.getAmount());
        existingExpense.setDescription(expenseDTO.getDescription());
        existingExpense.setVendor(expenseDTO.getVendor());
        existingExpense.setDate(expenseDTO.getDate());
        
        // Update payment status if provided
        if (expenseDTO.getPaymentStatus() != null && !expenseDTO.getPaymentStatus().isEmpty()) {
            try {
                existingExpense.setPaymentStatus(Expense.PaymentStatus.valueOf(expenseDTO.getPaymentStatus()));
            } catch (IllegalArgumentException e) {
                // Keep existing payment status if invalid
            }
        }
        
        existingExpense.setReceiptUrl(expenseDTO.getReceiptUrl());
        
        // Save the updated expense
        Expense savedExpense = expenseRepository.save(existingExpense);
        
        // Update the budget's current expenses if amount has changed
        if (amountDifference.compareTo(BigDecimal.ZERO) != 0) {
            Budget budget = existingExpense.getBudget();
            BigDecimal currentExpenses = budget.getCurrentExpenses() != null ? 
                    budget.getCurrentExpenses() : BigDecimal.ZERO;
            budget.setCurrentExpenses(currentExpenses.add(amountDifference));
            budgetRepository.save(budget);
        }
        
        return ExpenseDTO.fromEntity(savedExpense);
    }

    @Override
    @Transactional
    public void deleteExpense(Long id) {
        // Find the expense to delete
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "id", id));
        
        // Update the budget's current expenses
        Budget budget = expense.getBudget();
        BigDecimal currentExpenses = budget.getCurrentExpenses() != null ? 
                budget.getCurrentExpenses() : BigDecimal.ZERO;
        budget.setCurrentExpenses(currentExpenses.subtract(expense.getAmount()));
        budgetRepository.save(budget);
        
        // Delete the expense
        expenseRepository.delete(expense);
    }

    @Override
    public List<ExpenseDTO> getExpensesByPaymentStatus(Expense.PaymentStatus paymentStatus) {
        return expenseRepository.findByPaymentStatus(paymentStatus)
                .stream()
                .map(ExpenseDTO::fromEntity)
                .collect(Collectors.toList());
    }
} 