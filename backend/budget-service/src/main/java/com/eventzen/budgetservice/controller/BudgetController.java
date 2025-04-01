package com.eventzen.budgetservice.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    public ResponseEntity<List<BudgetDTO>> getAllBudgets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        logger.info("Received request to get paginated budgets: page={}, size={}, sortBy={}, direction={}", 
                   page, size, sortBy, direction);
        
        try {
            // Create a Pageable object for pagination and sorting
            Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? 
                                        Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
            
            // Get all budgets with caching for better performance
            List<BudgetDTO> budgets = budgetService.getAllBudgets();
            
            // Add caching headers - allow caching for 30 seconds
            return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(30, TimeUnit.SECONDS))
                .body(budgets);
        } catch (Exception e) {
            logger.error("Error retrieving budgets", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetDTO> getBudgetById(@PathVariable Long id) {
        logger.info("Received request to get budget with ID: {}", id);
        try {
            BudgetDTO budget = budgetService.getBudgetById(id);
            return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(30, TimeUnit.SECONDS))
                .body(budget);
        } catch (Exception e) {
            logger.error("Error retrieving budget with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<BudgetDTO>> getBudgetsByEventId(@PathVariable Long eventId) {
        logger.info("Received request to get budgets for event with ID: {}", eventId);
        try {
            List<BudgetDTO> budgets = budgetService.getBudgetsByEventId(eventId);
            return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(30, TimeUnit.SECONDS))
                .body(budgets);
        } catch (Exception e) {
            logger.error("Error retrieving budgets for event ID: {}", eventId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<BudgetDTO>> getBudgetsByStatus(@PathVariable String status) {
        logger.info("Received request to get budgets with status: {}", status);
        try {
            Budget.BudgetStatus budgetStatus = Budget.BudgetStatus.valueOf(status.toUpperCase());
            List<BudgetDTO> budgets = budgetService.getBudgetsByStatus(budgetStatus);
            return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(30, TimeUnit.SECONDS))
                .body(budgets);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid budget status: {}", status, e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error retrieving budgets with status: {}", status, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<BudgetDTO> createBudget(@RequestBody BudgetDTO budgetDTO) {
        logger.info("Received request to create budget: {}", budgetDTO);
        try {
            BudgetDTO createdBudget = budgetService.createBudget(budgetDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBudget);
        } catch (Exception e) {
            logger.error("Error creating budget", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetDTO> updateBudget(@PathVariable Long id, @RequestBody BudgetDTO budgetDTO) {
        logger.info("Received request to update budget with ID: {}", id);
        try {
            BudgetDTO updatedBudget = budgetService.updateBudget(id, budgetDTO);
            return ResponseEntity.ok(updatedBudget);
        } catch (Exception e) {
            logger.error("Error updating budget with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
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