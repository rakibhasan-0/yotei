package se.umu.cs.pvt.role;

/**
 * An exception that can be thrown when an invalid rolename is given.
 * @author Team Mango (Grupp 4) - 2024-05-08
 */
public class InvalidRoleNameException extends Exception {

    /**
     * Constructs an InvalidRoleNameException with the given detail message.
     * @param errorMessage  the message.
     */
    public InvalidRoleNameException(String errorMessage) {
        super(errorMessage);
    }
}
