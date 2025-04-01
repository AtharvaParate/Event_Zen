package com.eventzen.budgetservice.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventzen.budgetservice.dto.BudgetDTO;
import com.eventzen.budgetservice.model.Budget;
import com.eventzen.budgetservice.service.BudgetService;

@RestController
@RequestMapping("/budgets")
public class BudgetController {

    private static final Logger logger = LoggerFactory.getLogger(BudgetController.class);
    
    private final BudgetService budgetService;

    @Autowired
    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<List<BudgetDTO>> getAllBudgets() {
        logger.info("Received request to get all budgets");
        return ResponseEntity.ok(budgetService.getAllBudgets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetDTO> getBudgetById(@PathVariable Long id) {
        logger.info("Received request to get budget with ID: {}", id);
        return ResponseEntity.ok(budgetService.getBudgetById(id));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<BudgetDTO>> getBudgetsByEventId(@PathVariable Long eventId) {
        logger.info("Received request to get budgets for event with ID: {}", eventId);
        return ResponseEntity.ok(budgetService.getBudgetsByEventId(eventId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<BudgetDTO>> getBudgetsByStatus(@PathVariable String status) {
        logger.info("Received request to get budgets with status: {}", status);
        try {
            Budget.BudgetStatus budgetStatus = Budget.BudgetStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(budgetService.getBudgetsByStatus(budgetStatus));
        } catch (IllegalArgumentException e) {
            logger.error("Invalid budget status: {}", status, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<BudgetDTO> createBudget(@Valid @RequestBody BudgetDTO budgetDTO) {
        logger.info("Received request to create budget: {}", budgetDTO);
        BudgetDTO createdBudget = budgetService.createBudget(budgetDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBudget);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetDTO> updateBudget(@PathVariable Long id, @Valid @RequestBody BudgetDTO budgetDTO) {
        logger.info("Received request to update budget with ID: {}", id);
        return ResponseEntity.ok(budgetService.updateBudget(id, budgetDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long id) {
        logger.info("Received request to delete budget with ID: {}", id);
        try {
            budgetService.deleteBudget(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Budget deleted successfully");
            response.put("id", id);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error deleting budget with ID: {}", id, e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to delete budget: " + e.getMessage());
            errorResponse.put("id", id);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
} 