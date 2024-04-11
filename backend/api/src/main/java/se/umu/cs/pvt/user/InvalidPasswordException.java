package se.umu.cs.pvt.user;

/**
 * An exception that can be thrown when an invalid password is entered.
 * @author Team Hot-Pepper (G7)
 */
public class InvalidPasswordException extends Exception {

    /**
     * Constructs an InvalidPassWordException with the given detail message.
     * @param errorMessage  The message.
     */
    public InvalidPasswordException(String errorMessage) {
        super(errorMessage);
    }
}
