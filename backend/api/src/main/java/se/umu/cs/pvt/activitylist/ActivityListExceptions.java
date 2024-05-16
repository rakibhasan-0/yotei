package se.umu.cs.pvt.activitylist;

/**
 * Custom exceptions used in ActivityList
 * 
 * @author Team Tomato
 * @since 2024-05-16
 * @version 1.0
 */
class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

class UnauthorizedAccessException extends RuntimeException {
    public UnauthorizedAccessException(String message) {
        super(message);
    }
}

class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}

class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}

class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}
