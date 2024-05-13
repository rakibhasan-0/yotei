package se.umu.cs.pvt.permission;

/**
 * An exception that can be thrown when an invalid username is given.
 * @author Team Mango (Grupp 4) - 2024-05-08
 */
public class InvalidPermissionNameException extends Exception {

    /**
     * Constructs an InvalidPermissionNameException with the given detail message.
     * @param errorMessage  the message.
     */
    public InvalidPermissionNameException(String errorMessage) {
        super(errorMessage);
    }
}
