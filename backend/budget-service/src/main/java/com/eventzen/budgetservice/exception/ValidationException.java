package com.eventzen.budgetservice.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ValidationException extends RuntimeException {

    private static final long serialVersionUID = 1L;
    
    private Map<String, String> errors = new HashMap<>();
    
    public ValidationException(String message) {
        super(message);
    }
    
    public ValidationException(String field, String message) {
        super(message);
        errors.put(field, message);
    }
    
    public ValidationException(Map<String, String> errors) {
        super("Validation failed");
        this.errors = errors;
    }
    
    public Map<String, String> getErrors() {
        return errors;
    }
} 