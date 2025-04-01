package com.eventzen.budgetservice.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eventzen.budgetservice.dto.BudgetDTO;
import com.eventzen.budgetservice.model.Budget;
import com.eventzen.budgetservice.repository.BudgetRepository;
import com.eventzen.budgetservice.service.BudgetService;

@Service
public class BudgetServiceImpl implements BudgetService {

    private static final Logger logger = LoggerFactory.getLogger(BudgetServiceImpl.class);
    
    private final BudgetRepository budgetRepository;

    @Autowired
    public BudgetServiceImpl(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    @Override
    public List<BudgetDTO> getAllBudgets() {
        logger.debug("Getting all budgets");
        return budgetRepository.findAll()
                .stream()
                .map(BudgetDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public BudgetDTO getBudgetById(Long id) {
        logger.debug("Getting budget with ID: {}", id);
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Budget not found with ID: {}", id);
                    return new EntityNotFoundException("Budget not found with id: " + id);
                });
        return BudgetDTO.fromEntity(budget);
    }

    @Override
    public List<BudgetDTO> getBudgetsByEventId(Long eventId) {
        logger.debug("Getting budgets for event with ID: {}", eventId);
        return budgetRepository.findByEventId(eventId)
                .stream()
                .map(BudgetDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BudgetDTO createBudget(BudgetDTO budgetDTO) {
        logger.info("Creating new budget: {}", budgetDTO);
        try {
            Budget budget = budgetDTO.toEntity();
            budget.setCurrentExpenses(BigDecimal.ZERO);
            budget.setCurrentIncome(BigDecimal.ZERO);
            budget.setStatus(Budget.BudgetStatus.ACTIVE);
            Budget savedBudget = budgetRepository.save(budget);
            logger.info("Successfully created budget with ID: {}", savedBudget.getId());
            return BudgetDTO.fromEntity(savedBudget);
        } catch (Exception e) {
            logger.error("Error creating budget: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Transactional
    public BudgetDTO updateBudget(Long id, BudgetDTO budgetDTO) {
        logger.info("Updating budget with ID: {}", id);
        try {
            Budget existingBudget = budgetRepository.findById(id)
                    .orElseThrow(() -> {
                        logger.error("Budget not found with ID: {}", id);
                        return new EntityNotFoundException("Budget not found with id: " + id);
                    });

            // Update fields from DTO
            existingBudget.setName(budgetDTO.getName());
            existingBudget.setNotes(budgetDTO.getNotes());
            existingBudget.setTotalBudget(budgetDTO.getTotalBudget());
            existingBudget.setEventId(budgetDTO.getEventId());
            
            // Only update status if it's provided
            if (budgetDTO.getStatus() != null) {
                try {
                    Budget.BudgetStatus status = Budget.BudgetStatus.valueOf(budgetDTO.getStatus());
                    existingBudget.setStatus(status);
                } catch (IllegalArgumentException e) {
                    logger.warn("Invalid budget status: {}", budgetDTO.getStatus());
                    // Keep existing status
                }
            }

            Budget updatedBudget = budgetRepository.save(existingBudget);
            logger.info("Successfully updated budget with ID: {}", updatedBudget.getId());
            return BudgetDTO.fromEntity(updatedBudget);
        } catch (EntityNotFoundException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error updating budget: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Transactional
    public void deleteBudget(Long id) {
        logger.info("Deleting budget with ID: {}", id);
        try {
            Budget budget = budgetRepository.findById(id)
                    .orElseThrow(() -> {
                        logger.error("Budget not found with ID: {}", id);
                        return new EntityNotFoundException("Budget not found with id: " + id);
                    });
            budgetRepository.delete(budget);
            logger.info("Successfully deleted budget with ID: {}", id);
        } catch (EntityNotFoundException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error deleting budget: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public List<BudgetDTO> getBudgetsByStatus(Budget.BudgetStatus status) {
        logger.debug("Getting budgets with status: {}", status);
        return budgetRepository.findByStatus(status)
                .stream()
                .map(BudgetDTO::fromEntity)
                .collect(Collectors.toList());
    }
} 