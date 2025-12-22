package com.lr.construcao.management.exception;

import java.time.LocalDateTime;

public record ExceptionResponse(
        LocalDateTime timestamp,
        String message,
        String details
) {
}
