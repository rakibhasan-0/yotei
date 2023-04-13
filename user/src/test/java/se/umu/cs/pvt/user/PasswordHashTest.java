package se.umu.cs.pvt.user;

import org.junit.jupiter.api.Test;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import static org.junit.jupiter.api.Assertions.*;

class PasswordHashTest {

    @Test
    void validatePasswordShouldSucceedWhenCorrect() {
        String password = "test";

        try {
            String hashedPassword = PasswordHash.hashPassword(password);
            assertTrue(PasswordHash.validatePassword("test", hashedPassword));
        } catch (NoSuchAlgorithmException | NumberFormatException | InvalidKeySpecException e) {
            fail();
            System.out.println("Exception thrown: " + e.getCause());
        }
    }

    @Test
    void validatePasswordShouldFailWhenIncorrect() {
        String password = "test1";

        try {
            String hashedPassword = PasswordHash.hashPassword(password);
            assertFalse(PasswordHash.validatePassword("test", hashedPassword));
        } catch (NoSuchAlgorithmException | NumberFormatException | InvalidKeySpecException e) {
            fail();
            System.out.println("Exception thrown: " + e.getCause());
        }
    }

    @Test
    void hashEmptyPasswordShouldSucceed() {
        String password = "";

        try {
            String hashedPassword = PasswordHash.hashPassword(password);
            assertTrue(PasswordHash.validatePassword("", hashedPassword));
        } catch (NoSuchAlgorithmException | NumberFormatException | InvalidKeySpecException e) {
            fail();
            System.out.println("Exception thrown: " + e.getCause());
        }
    }
}