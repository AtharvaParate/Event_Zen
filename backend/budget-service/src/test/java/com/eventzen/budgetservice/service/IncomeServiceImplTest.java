package com.eventzen.budgetservice.service;

import com.eventzen.budgetservice.dto.IncomeDTO;
import com.eventzen.budgetservice.exception.ResourceNotFoundException;
import com.eventzen.budgetservice.model.Budget;
import com.eventzen.budgetservice.model.Income;
import com.eventzen.budgetservice.repository.BudgetRepository;
import com.eventzen.budgetservice.repository.IncomeRepository;
import com.eventzen.budgetservice.service.impl.IncomeServiceImpl;
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
public class IncomeServiceImplTest {

    @Mock
    private IncomeRepository incomeRepository;

    @Mock
    private BudgetRepository budgetRepository;

    @InjectMocks
    private IncomeServiceImpl incomeService;

    private Budget testBudget;
    private Income testIncome;
    private IncomeDTO testIncomeDTO;

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

        testIncome = new Income();
        testIncome.setId(1L);
        testIncome.setBudget(testBudget);
        testIncome.setCategory("Sponsorship");
        testIncome.setAmount(new BigDecimal("500.00"));
        testIncome.setDescription("Gold Sponsorship");
        testIncome.setSource("TechCorp");
        testIncome.setDate(LocalDate.now());
        testIncome.setStatus(Income.IncomeStatus.RECEIVED);

        testIncomeDTO = new IncomeDTO();
        testIncomeDTO.setBudgetId(1L);
        testIncomeDTO.setCategory("Sponsorship");
        testIncomeDTO.setAmount(new BigDecimal("500.00"));
        testIncomeDTO.setDescription("Gold Sponsorship");
        testIncomeDTO.setSource("TechCorp");
        testIncomeDTO.setDate(LocalDate.now());
        testIncomeDTO.setStatus("RECEIVED");
    }

    @Test
    void testGetAllIncomes() {
        // Setup
        when(incomeRepository.findAll()).thenReturn(Arrays.asList(testIncome));

        // Execute
        List<IncomeDTO> result = incomeService.getAllIncomes();

        // Verify
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals(testIncome.getCategory(), result.get(0).getCategory());
        verify(incomeRepository, times(1)).findAll();
    }

    @Test
    void testGetIncomeById_Success() {
        // Setup
        when(incomeRepository.findById(1L)).thenReturn(Optional.of(testIncome));

        // Execute
        IncomeDTO result = incomeService.getIncomeById(1L);

        // Verify
        assertNotNull(result);
        assertEquals(testIncome.getCategory(), result.getCategory());
        assertEquals(testIncome.getAmount(), result.getAmount());
        verify(incomeRepository, times(1)).findById(1L);
    }

    @Test
    void testGetIncomeById_NotFound() {
        // Setup
        when(incomeRepository.findById(99L)).thenReturn(Optional.empty());

        // Execute & Verify
        assertThrows(ResourceNotFoundException.class, () -> {
            incomeService.getIncomeById(99L);
        });
        verify(incomeRepository, times(1)).findById(99L);
    }

    @Test
    void testCreateIncome_Success() {
        // Setup
        when(budgetRepository.findById(1L)).thenReturn(Optional.of(testBudget));
        when(incomeRepository.save(any(Income.class))).thenReturn(testIncome);

        // Execute
        IncomeDTO result = incomeService.createIncome(testIncomeDTO);

        // Verify
        assertNotNull(result);
        assertEquals(testIncome.getCategory(), result.getCategory());
        assertEquals(testIncome.getAmount(), result.getAmount());
        verify(budgetRepository, times(1)).findById(1L);
        verify(incomeRepository, times(1)).save(any(Income.class));
        verify(budgetRepository, times(1)).save(any(Budget.class));
    }

    @Test
    void testCreateIncome_BudgetNotFound() {
        // Setup
        when(budgetRepository.findById(99L)).thenReturn(Optional.empty());
        testIncomeDTO.setBudgetId(99L);

        // Execute & Verify
        assertThrows(ResourceNotFoundException.class, () -> {
            incomeService.createIncome(testIncomeDTO);
        });
        verify(budgetRepository, times(1)).findById(99L);
        verify(incomeRepository, never()).save(any(Income.class));
    }

    @Test
    void testDeleteIncome_Success() {
        // Setup
        when(incomeRepository.findById(1L)).thenReturn(Optional.of(testIncome));

        // Execute
        incomeService.deleteIncome(1L);

        // Verify
        verify(incomeRepository, times(1)).findById(1L);
        verify(budgetRepository, times(1)).save(any(Budget.class));
        verify(incomeRepository, times(1)).delete(testIncome);
    }

    @Test
    void testDeleteIncome_NotFound() {
        // Setup
        when(incomeRepository.findById(99L)).thenReturn(Optional.empty());

        // Execute & Verify
        assertThrows(ResourceNotFoundException.class, () -> {
            incomeService.deleteIncome(99L);
        });
        verify(incomeRepository, times(1)).findById(99L);
        verify(incomeRepository, never()).delete(any(Income.class));
    }
} 