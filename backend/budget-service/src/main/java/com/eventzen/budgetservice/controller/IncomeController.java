package com.eventzen.budgetservice.controller;

import com.eventzen.budgetservice.dto.IncomeDTO;
import com.eventzen.budgetservice.model.Income;
import com.eventzen.budgetservice.service.IncomeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/incomes")
@Tag(name = "Income Controller", description = "APIs for managing incomes in the budget service")
public class IncomeController {

    private final IncomeService incomeService;

    @Autowired
    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @GetMapping
    @Operation(summary = "Get all incomes", description = "Retrieves a list of all incomes across all budgets")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved all incomes"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<IncomeDTO>> getAllIncomes() {
        return ResponseEntity.ok(incomeService.getAllIncomes());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get income by ID", description = "Retrieves an income by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved income"),
        @ApiResponse(responseCode = "404", description = "Income not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<IncomeDTO> getIncomeById(
            @Parameter(description = "ID of the income to retrieve") @PathVariable Long id) {
        return ResponseEntity.ok(incomeService.getIncomeById(id));
    }

    @GetMapping("/budget/{budgetId}")
    @Operation(summary = "Get incomes by budget ID", description = "Retrieves all incomes for a specific budget")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved incomes for the budget"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<IncomeDTO>> getIncomesByBudgetId(
            @Parameter(description = "ID of the budget to retrieve incomes for") @PathVariable Long budgetId) {
        return ResponseEntity.ok(incomeService.getIncomesByBudgetId(budgetId));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get incomes by status", description = "Retrieves all incomes with a specific status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved incomes by status"),
        @ApiResponse(responseCode = "400", description = "Invalid status provided"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<IncomeDTO>> getIncomesByStatus(
            @Parameter(description = "Status to filter incomes by (EXPECTED, RECEIVED, CANCELLED)") 
            @PathVariable String status) {
        try {
            Income.IncomeStatus incomeStatus = Income.IncomeStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(incomeService.getIncomesByStatus(incomeStatus));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    @Operation(summary = "Create a new income", description = "Creates a new income and associates it with a budget")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Income successfully created"),
        @ApiResponse(responseCode = "400", description = "Invalid income data provided"),
        @ApiResponse(responseCode = "404", description = "Budget not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<IncomeDTO> createIncome(
            @Parameter(description = "Income data to create", required = true)
            @Valid @RequestBody IncomeDTO incomeDTO) {
        IncomeDTO createdIncome = incomeService.createIncome(incomeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdIncome);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an income", description = "Updates an existing income by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Income successfully updated"),
        @ApiResponse(responseCode = "400", description = "Invalid income data provided"),
        @ApiResponse(responseCode = "404", description = "Income not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<IncomeDTO> updateIncome(
            @Parameter(description = "ID of the income to update", required = true) @PathVariable Long id,
            @Parameter(description = "Updated income data", required = true) @Valid @RequestBody IncomeDTO incomeDTO) {
        return ResponseEntity.ok(incomeService.updateIncome(id, incomeDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an income", description = "Deletes an income by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Income successfully deleted"),
        @ApiResponse(responseCode = "404", description = "Income not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Void> deleteIncome(
            @Parameter(description = "ID of the income to delete", required = true) @PathVariable Long id) {
        incomeService.deleteIncome(id);
        return ResponseEntity.noContent().build();
    }
} 