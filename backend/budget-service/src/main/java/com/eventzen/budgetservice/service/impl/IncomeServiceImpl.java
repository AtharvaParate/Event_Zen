package com.eventzen.budgetservice.service.impl;

import com.eventzen.budgetservice.dto.IncomeDTO;
import com.eventzen.budgetservice.model.Budget;
import com.eventzen.budgetservice.model.Income;
import com.eventzen.budgetservice.repository.BudgetRepository;
import com.eventzen.budgetservice.repository.IncomeRepository;
import com.eventzen.budgetservice.service.IncomeService;
import com.eventzen.budgetservice.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncomeServiceImpl implements IncomeService {

    private final IncomeRepository incomeRepository;
    private final BudgetRepository budgetRepository;

    @Autowired
    public IncomeServiceImpl(IncomeRepository incomeRepository, BudgetRepository budgetRepository) {
        this.incomeRepository = incomeRepository;
        this.budgetRepository = budgetRepository;
    }

    @Override
    public List<IncomeDTO> getAllIncomes() {
        return incomeRepository.findAll()
                .stream()
                .map(IncomeDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public IncomeDTO getIncomeById(Long id) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income", "id", id));
        return IncomeDTO.fromEntity(income);
    }

    @Override
    public List<IncomeDTO> getIncomesByBudgetId(Long budgetId) {
        return incomeRepository.findByBudgetId(budgetId)
                .stream()
                .map(IncomeDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public IncomeDTO createIncome(IncomeDTO incomeDTO) {
        // Find the budget
        Budget budget = budgetRepository.findById(incomeDTO.getBudgetId())
                .orElseThrow(() -> new ResourceNotFoundException("Budget", "id", incomeDTO.getBudgetId()));
        
        // Create new income entity from DTO
        Income income = new Income();
        income.setBudget(budget);
        income.setCategory(incomeDTO.getCategory());
        income.setAmount(incomeDTO.getAmount());
        income.setDescription(incomeDTO.getDescription());
        income.setSource(incomeDTO.getSource());
        income.setDate(incomeDTO.getDate());
        
        // Set status
        try {
            if (incomeDTO.getStatus() != null && !incomeDTO.getStatus().isEmpty()) {
                income.setStatus(Income.IncomeStatus.valueOf(incomeDTO.getStatus()));
            } else {
                income.setStatus(Income.IncomeStatus.EXPECTED);
            }
        } catch (IllegalArgumentException e) {
            income.setStatus(Income.IncomeStatus.EXPECTED);
        }
        
        // Save the income
        Income savedIncome = incomeRepository.save(income);
        
        // Update the budget's current income
        BigDecimal currentIncome = budget.getCurrentIncome() != null ? 
                budget.getCurrentIncome() : BigDecimal.ZERO;
        budget.setCurrentIncome(currentIncome.add(incomeDTO.getAmount()));
        budgetRepository.save(budget);
        
        return IncomeDTO.fromEntity(savedIncome);
    }

    @Override
    @Transactional
    public IncomeDTO updateIncome(Long id, IncomeDTO incomeDTO) {
        // Find the existing income
        Income existingIncome = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income", "id", id));
        
        // Calculate amount difference for budget update
        BigDecimal amountDifference = incomeDTO.getAmount().subtract(existingIncome.getAmount());
        
        // Update the income
        existingIncome.setCategory(incomeDTO.getCategory());
        existingIncome.setAmount(incomeDTO.getAmount());
        existingIncome.setDescription(incomeDTO.getDescription());
        existingIncome.setSource(incomeDTO.getSource());
        existingIncome.setDate(incomeDTO.getDate());
        
        // Update status if provided
        if (incomeDTO.getStatus() != null && !incomeDTO.getStatus().isEmpty()) {
            try {
                existingIncome.setStatus(Income.IncomeStatus.valueOf(incomeDTO.getStatus()));
            } catch (IllegalArgumentException e) {
                // Keep existing status if invalid
            }
        }
        
        // Save the updated income
        Income savedIncome = incomeRepository.save(existingIncome);
        
        // Update the budget's current income if amount has changed
        if (amountDifference.compareTo(BigDecimal.ZERO) != 0) {
            Budget budget = existingIncome.getBudget();
            BigDecimal currentIncome = budget.getCurrentIncome() != null ? 
                    budget.getCurrentIncome() : BigDecimal.ZERO;
            budget.setCurrentIncome(currentIncome.add(amountDifference));
            budgetRepository.save(budget);
        }
        
        return IncomeDTO.fromEntity(savedIncome);
    }

    @Override
    @Transactional
    public void deleteIncome(Long id) {
        // Find the income to delete
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income", "id", id));
        
        // Update the budget's current income
        Budget budget = income.getBudget();
        BigDecimal currentIncome = budget.getCurrentIncome() != null ? 
                budget.getCurrentIncome() : BigDecimal.ZERO;
        budget.setCurrentIncome(currentIncome.subtract(income.getAmount()));
        budgetRepository.save(budget);
        
        // Delete the income
        incomeRepository.delete(income);
    }

    @Override
    public List<IncomeDTO> getIncomesByStatus(Income.IncomeStatus status) {
        return incomeRepository.findByStatus(status)
                .stream()
                .map(IncomeDTO::fromEntity)
                .collect(Collectors.toList());
    }
} 