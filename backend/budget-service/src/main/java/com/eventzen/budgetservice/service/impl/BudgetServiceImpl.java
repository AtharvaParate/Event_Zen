package com.eventzen.budgetservice.service.impl;

import com.eventzen.budgetservice.dto.BudgetDTO;
import com.eventzen.budgetservice.model.Budget;
import com.eventzen.budgetservice.repository.BudgetRepository;
import com.eventzen.budgetservice.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;

    @Autowired
    public BudgetServiceImpl(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    @Override
    public List<BudgetDTO> getAllBudgets() {
        return budgetRepository.findAll()
                .stream()
                .map(BudgetDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public BudgetDTO getBudgetById(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Budget not found with id: " + id));
        return BudgetDTO.fromEntity(budget);
    }

    @Override
    public List<BudgetDTO> getBudgetsByEventId(Long eventId) {
        return budgetRepository.findByEventId(eventId)
                .stream()
                .map(BudgetDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public BudgetDTO createBudget(BudgetDTO budgetDTO) {
        Budget budget = budgetDTO.toEntity();
        budget.setCurrentExpenses(BigDecimal.ZERO);
        budget.setCurrentIncome(BigDecimal.ZERO);
        budget.setStatus(Budget.BudgetStatus.ACTIVE);
        Budget savedBudget = budgetRepository.save(budget);
        return BudgetDTO.fromEntity(savedBudget);
    }

    @Override
    public BudgetDTO updateBudget(Long id, BudgetDTO budgetDTO) {
        Budget existingBudget = budgetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Budget not found with id: " + id));
        
        Budget updatedBudget = budgetDTO.toEntity();
        updatedBudget.setId(id);
        updatedBudget.setCurrentExpenses(existingBudget.getCurrentExpenses());
        updatedBudget.setCurrentIncome(existingBudget.getCurrentIncome());
        
        Budget savedBudget = budgetRepository.save(updatedBudget);
        return BudgetDTO.fromEntity(savedBudget);
    }

    @Override
    public void deleteBudget(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Budget not found with id: " + id));
        budget.setStatus(Budget.BudgetStatus.DELETED);
        budgetRepository.save(budget);
    }

    @Override
    public List<BudgetDTO> getBudgetsByStatus(Budget.BudgetStatus status) {
        return budgetRepository.findByStatus(status)
                .stream()
                .map(BudgetDTO::fromEntity)
                .collect(Collectors.toList());
    }
} 