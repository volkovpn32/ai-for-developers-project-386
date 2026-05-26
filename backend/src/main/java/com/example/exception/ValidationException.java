package com.example.exception;

public class ValidationException extends ServiceException {
    public ValidationException(String message) {
        super(400, message);
    }
}
