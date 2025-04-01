package com.eventzen.budgetservice.controller;

import com.eventzen.budgetservice.dto.ExpenseDTO;
import com.eventzen.budgetservice.model.Expense;
import com.eventzen.budgetservice.service.ExpenseService;
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
@RequestMapping("/expenses")
@Tag(name = "Expense Controller", description = "APIs for managing expenses in the budget service")
public class ExpenseController {

    private final ExpenseService expenseService;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    @Operation(summary = "Get all expenses", description = "Retrieves a list of all expenses across all budgets")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved all expenses"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<ExpenseDTO>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get expense by ID", description = "Retrieves an expense by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved expense"),
        @ApiResponse(responseCode = "404", description = "Expense not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ExpenseDTO> getExpenseById(
            @Parameter(description = "ID of the expense to retrieve") @PathVariable Long id) {
        return ResponseEntity.ok(expenseService.getExpenseById(id));
    }

    @GetMapping("/budget/{budgetId}")
    @Operation(summary = "Get expenses by budget ID", description = "Retrieves all expenses for a specific budget")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved expenses for the budget"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<ExpenseDTO>> getExpensesByBudgetId(
            @Parameter(description = "ID of the budget to retrieve expenses for") @PathVariable Long budgetId) {
        return ResponseEntity.ok(expenseService.getExpensesByBudgetId(budgetId));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get expenses by payment status", description = "Retrieves all expenses with a specific payment status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved expenses by status"),
        @ApiResponse(responseCode = "400", description = "Invalid status provided"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<ExpenseDTO>> getExpensesByStatus(
            @Parameter(description = "Payment status to filter expenses by (PENDING, PAID, REFUNDED, CANCELLED)") 
            @PathVariable String status) {
        try {
            Expense.PaymentStatus paymentStatus = Expense.PaymentStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(expenseService.getExpensesByPaymentStatus(paymentStatus));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    @Operation(summary = "Create a new expense", description = "Creates a new expense and associates it with a budget")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Expense successfully created"),
        @ApiResponse(responseCode = "400", description = "Invalid expense data provided"),
        @ApiResponse(responseCode = "404", description = "Budget not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ExpenseDTO> createExpense(
            @Parameter(description = "Expense data to create", required = true)
            @Valid @RequestBody ExpenseDTO expenseDTO) {
        ExpenseDTO createdExpense = expenseService.createExpense(expenseDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdExpense);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an expense", description = "Updates an existing expense by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Expense successfully updated"),
        @ApiResponse(responseCode = "400", description = "Invalid expense data provided"),
        @ApiResponse(responseCode = "404", description = "Expense not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ExpenseDTO> updateExpense(
            @Parameter(description = "ID of the expense to update", required = true) @PathVariable Long id,
            @Parameter(description = "Updated expense data", required = true) @Valid @RequestBody ExpenseDTO expenseDTO) {
        return ResponseEntity.ok(expenseService.updateExpense(id, expenseDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an expense", description = "Deletes an expense by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Expense successfully deleted"),
        @ApiResponse(responseCode = "404", description = "Expense not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Void> deleteExpense(
            @Parameter(description = "ID of the expense to delete", required = true) @PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
} 