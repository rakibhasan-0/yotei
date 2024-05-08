package se.umu.cs.pvt.role;

/**
 * An exception that can be thrown when an invalid username is given.
 * @author Team Hot-Pepper (G7)
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
