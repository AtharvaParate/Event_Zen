package com.eventzen.budgetservice.service;

import com.eventzen.budgetservice.dto.ExpenseDTO;
import com.eventzen.budgetservice.exception.ResourceNotFoundException;
import com.eventzen.budgetservice.model.Budget;
import com.eventzen.budgetservice.model.Expense;
import com.eventzen.budgetservice.repository.BudgetRepository;
import com.eventzen.budgetservice.repository.ExpenseRepository;
import com.eventzen.budgetservice.service.impl.ExpenseServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ExpenseServiceImplTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private BudgetRepository budgetRepository;

    @InjectMocks
    private ExpenseServiceImpl expenseService;

    private Budget testBudget;
    private Expense testExpense;
    private ExpenseDTO testExpenseDTO;

    @BeforeEach
    void setUp() {
        // Set up test data
        testBudget = new Budget();
        testBudget.setId(1L);
        testBudget.setName("Test Budget");
        testBudget.setTotalBudget(new BigDecimal("1000.00"));
        testBudget.setCurrentExpenses(new BigDecimal("500.00"));
        testBudget.setCurrentIncome(new BigDecimal("1500.00"));
        testBudget.setStatus(Budget.BudgetStatus.ACTIVE);

        testExpense = new Expense();
        testExpense.setId(1L);
        testExpense.setBudget(testBudget);
        testExpense.setCategory("Office Supplies");
        testExpense.setAmount(new BigDecimal("100.00"));
        testExpense.setDescription("Stationery");
        testExpense.setVendor("Office Depot");
        testExpense.setDate(LocalDate.now());
        testExpense.setPaymentStatus(Expense.PaymentStatus.PAID);

        testExpenseDTO = new ExpenseDTO();
        testExpenseDTO.setBudgetId(1L);
        testExpenseDTO.setCategory("Office Supplies");
        testExpenseDTO.setAmount(new BigDecimal("100.00"));
        testExpenseDTO.setDescription("Stationery");
        testExpenseDTO.setVendor("Office Depot");
        testExpenseDTO.setDate(LocalDate.now());
        testExpenseDTO.setPaymentStatus("PAID");
    }

    @Test
    void testGetAllExpenses() {
        // Setup
        when(expenseRepository.findAll()).thenReturn(Arrays.asList(testExpense));

        // Execute
        List<ExpenseDTO> result = expenseService.getAllExpenses();

        // Verify
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals(testExpense.getCategory(), result.get(0).getCategory());
        verify(expenseRepository, times(1)).findAll();
    }

    @Test
    void testGetExpenseById_Success() {
        // Setup
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(testExpense));

        // Execute
        ExpenseDTO result = expenseService.getExpenseById(1L);

        // Verify
        assertNotNull(result);
        assertEquals(testExpense.getCategory(), result.getCategory());
        assertEquals(testExpense.getAmount(), result.getAmount());
        verify(expenseRepository, times(1)).findById(1L);
    }

    @Test
    void testGetExpenseById_NotFound() {
        // Setup
        when(expenseRepository.findById(99L)).thenReturn(Optional.empty());

        // Execute & Verify
        assertThrows(ResourceNotFoundException.class, () -> {
            expenseService.getExpenseById(99L);
        });
        verify(expenseRepository, times(1)).findById(99L);
    }

    @Test
    void testCreateExpense_Success() {
        // Setup
        when(budgetRepository.findById(1L)).thenReturn(Optional.of(testBudget));
        when(expenseRepository.save(any(Expense.class))).thenReturn(testExpense);

        // Execute
        ExpenseDTO result = expenseService.createExpense(testExpenseDTO);

        // Verify
        assertNotNull(result);
        assertEquals(testExpense.getCategory(), result.getCategory());
        assertEquals(testExpense.getAmount(), result.getAmount());
        verify(budgetRepository, times(1)).findById(1L);
        verify(expenseRepository, times(1)).save(any(Expense.class));
        verify(budgetRepository, times(1)).save(any(Budget.class));
    }

    @Test
    void testCreateExpense_BudgetNotFound() {
        // Setup
        when(budgetRepository.findById(99L)).thenReturn(Optional.empty());
        testExpenseDTO.setBudgetId(99L);

        // Execute & Verify
        assertThrows(ResourceNotFoundException.class, () -> {
            expenseService.createExpense(testExpenseDTO);
        });
        verify(budgetRepository, times(1)).findById(99L);
        verify(expenseRepository, never()).save(any(Expense.class));
    }

    @Test
    void testDeleteExpense_Success() {
        // Setup
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(testExpense));

        // Execute
        expenseService.deleteExpense(1L);

        // Verify
        verify(expenseRepository, times(1)).findById(1L);
        verify(budgetRepository, times(1)).save(any(Budget.class));
        verify(expenseRepository, times(1)).delete(testExpense);
    }

    @Test
    void testDeleteExpense_NotFound() {
        // Setup
        when(expenseRepository.findById(99L)).thenReturn(Optional.empty());

        // Execute & Verify
        assertThrows(ResourceNotFoundException.class, () -> {
            expenseService.deleteExpense(99L);
        });
        verify(expenseRepository, times(1)).findById(99L);
        verify(expenseRepository, never()).delete(any(Expense.class));
    }
} 