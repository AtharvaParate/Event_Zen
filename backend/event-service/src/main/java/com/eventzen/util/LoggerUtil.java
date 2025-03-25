package com.eventzen.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Logger utility class for consistent logging across the application
 */
@Component
public class LoggerUtil {

    /**
     * Get a logger for the specified class
     *
     * @param clazz the class to get the logger for
     * @return the logger
     */
    public static <T> Logger getLogger(Class<T> clazz) {
        return LoggerFactory.getLogger(clazz);
    }

    /**
     * Log an info message
     *
     * @param logger  the logger
     * @param message the message
     * @param args    the message arguments
     */
    public static void info(Logger logger, String message, Object... args) {
        logger.info(message, args);
    }

    /**
     * Log a debug message
     *
     * @param logger  the logger
     * @param message the message
     * @param args    the message arguments
     */
    public static void debug(Logger logger, String message, Object... args) {
        logger.debug(message, args);
    }

    /**
     * Log a warning message
     *
     * @param logger  the logger
     * @param message the message
     * @param args    the message arguments
     */
    public static void warn(Logger logger, String message, Object... args) {
        logger.warn(message, args);
    }

    /**
     * Log an error message
     *
     * @param logger  the logger
     * @param message the message
     * @param args    the message arguments
     */
    public static void error(Logger logger, String message, Object... args) {
        logger.error(message, args);
    }

    /**
     * Log an error message with exception
     *
     * @param logger  the logger
     * @param message the message
     * @param e       the exception
     */
    public static void error(Logger logger, String message, Throwable e) {
        logger.error(message, e);
    }
}