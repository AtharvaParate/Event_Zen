package com.eventzen.budgetservice.controller;

import com.eventzen.budgetservice.dto.BudgetDTO;
import com.eventzen.budgetservice.model.Budget;
import com.eventzen.budgetservice.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    @Autowired
    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<List<BudgetDTO>> getAllBudgets() {
        return ResponseEntity.ok(budgetService.getAllBudgets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetDTO> getBudgetById(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getBudgetById(id));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<BudgetDTO>> getBudgetsByEventId(@PathVariable Long eventId) {
        return ResponseEntity.ok(budgetService.getBudgetsByEventId(eventId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<BudgetDTO>> getBudgetsByStatus(@PathVariable String status) {
        try {
            Budget.BudgetStatus budgetStatus = Budget.BudgetStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(budgetService.getBudgetsByStatus(budgetStatus));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<BudgetDTO> createBudget(@Valid @RequestBody BudgetDTO budgetDTO) {
        BudgetDTO createdBudget = budgetService.createBudget(budgetDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBudget);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetDTO> updateBudget(@PathVariable Long id, @Valid @RequestBody BudgetDTO budgetDTO) {
        return ResponseEntity.ok(budgetService.updateBudget(id, budgetDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }
} 