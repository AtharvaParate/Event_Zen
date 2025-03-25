package com.eventzen.exception;

import java.util.HashMap;
import java.util.Map;

/**
 * Exception thrown when validation fails
 */
public class ValidationException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private final Map<String, String> errors;

    /**
     * Constructs a new validation exception with the specified detail message.
     *
     * @param message the detail message
     */
    public ValidationException(String message) {
        super(message);
        this.errors = new HashMap<>();
    }

    /**
     * Constructs a new validation exception with the specified detail message and
     * validation errors.
     *
     * @param message the detail message
     * @param errors  the validation errors
     */
    public ValidationException(String message, Map<String, String> errors) {
        super(message);
        this.errors = errors;
    }

    /**
     * Gets the validation errors.
     *
     * @return the validation errors
     */
    public Map<String, String> getErrors() {
        return errors;
    }

    /**
     * Adds a validation error.
     *
     * @param field   the field
     * @param message the error message
     * @return this exception for chaining
     */
    public ValidationException addError(String field, String message) {
        this.errors.put(field, message);
        return this;
    }
}