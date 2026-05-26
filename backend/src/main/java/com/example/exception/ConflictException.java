package com.example.exception;

public class ConflictException extends ServiceException {
    public ConflictException(String message) {
        super(409, message);
    }
}
