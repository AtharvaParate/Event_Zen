package com.eventzen.exception;

/**
 * Exception thrown when a resource is not found
 */
public class ResourceNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * Constructs a new resource not found exception with the specified detail
     * message.
     *
     * @param message the detail message
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }

    /**
     * Constructs a new resource not found exception with the specified detail
     * message and cause.
     *
     * @param message the detail message
     * @param cause   the cause
     */
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * Constructs a resource not found exception with a formatted message using the
     * given resource type and identifier.
     *
     * @param resourceType the type of resource
     * @param resourceId   the identifier of the resource
     * @return a new ResourceNotFoundException
     */
    public static ResourceNotFoundException create(String resourceType, Object resourceId) {
        return new ResourceNotFoundException(resourceType + " not found with ID: " + resourceId);
    }
}