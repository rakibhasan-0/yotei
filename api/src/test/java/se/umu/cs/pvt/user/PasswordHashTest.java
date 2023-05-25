package se.umu.cs.pvt.user;

import org.junit.jupiter.api.Test;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import static org.junit.jupiter.api.Assertions.*;

/**
 * @author  Phoenix (25-04-2023)
 */
class PasswordHashTest {

    @Test
    void shouldSucceedWhenValidatePasswordIsCorrect() {
        String password = "test";

        try {
            String hashedPassword = PasswordHash.hashPassword(password);
            assertTrue(PasswordHash.validatePassword("test", hashedPassword));
        } catch (NoSuchAlgorithmException | NumberFormatException | InvalidKeySpecException e) {
            fail();
        }
    }

    @Test
    void shouldFailWhenValidatePasswordIsIncorrect() {
        String password = "test1";

        try {
            String hashedPassword = PasswordHash.hashPassword(password);
            assertFalse(PasswordHash.validatePassword("test", hashedPassword));
        } catch (NoSuchAlgorithmException | NumberFormatException | InvalidKeySpecException e) {
            fail();
        }
    }

    @Test
    void shouldSucceedWhenHashEmptyPassword() {
        String password = "";

        try {
            String hashedPassword = PasswordHash.hashPassword(password);
            assertTrue(PasswordHash.validatePassword("", hashedPassword));
        } catch (NoSuchAlgorithmException | NumberFormatException | InvalidKeySpecException e) {
            fail();
        }
    }
}