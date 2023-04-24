package se.umu.cs.pvt.user;

/**
 * An exception that can be thrown when an invalid username is given.
 * @author Team Hot-Pepper (G7)
 */
public class InvalidUserNameException extends Exception {

    /**
     * Constructs an InvalidUserNameException with the given detail message.
     * @param errorMessage  the message.
     */
    public InvalidUserNameException(String errorMessage) {
        super(errorMessage);
    }
}
