package se.umu.cs.pvt.user;


import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

public class UserTest {

    @Test
    public void shouldThrowExceptionWhenUserNameIsEmpty(){
        Exception exception = assertThrows(InvalidUserNameException.class, () -> new User("","123"));
        String expectedMessage = "Name may not be empty!";
        String actualMessage = exception.getMessage();

        assertTrue(actualMessage.contains(expectedMessage));
    }

    @Test
    public void shouldThrowExceptionWhenPasswordIsEmpty(){
        Exception exception = assertThrows(InvalidPasswordException.class, () -> new User("test",""));
        String expectedMessage = "Password may not be empty!";
        String actualMessage = exception.getMessage();

        assertTrue(actualMessage.contains(expectedMessage));
    }

    @Test
    public void shouldThrowExceptionWhenPasswordIsNull(){
        Exception exception = assertThrows(InvalidPasswordException.class, () -> new User("test",null));
        String expectedMessage = "Password may not be empty!";
        String actualMessage = exception.getMessage();

        assertTrue(actualMessage.contains(expectedMessage));
    }

    @Test
    public void shouldThrowExceptionWhenPasswordIsSetToNull(){
        Exception exception = assertThrows(InvalidPasswordException.class, () ->{
                User user = new User();
                user.setUsername("test");
                user.setPassword(null);
                });
        String expectedMessage = "Failed to secure password properly. User not created.";
        String actualMessage = exception.getMessage();
        assertTrue(actualMessage.contains(expectedMessage));
    }

    @Test
    public void validConstructorTest() {
        try {
            User user = new User("test", "admin");
            assertEquals("test", user.getUsername());
            assertTrue(PasswordHash.validatePassword("admin", user.getPassword()));
        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
            System.out.println("Exception thrown: " + e.getCause());
        }
    }

    @Test
    public void userHasADefaultRole() {
        try {
            User user = new User("test", "test");
            assertEquals(User.Role.USER, user.getUserRole());
        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
            System.out.println("Exception thrown: " + e.getCause());
        }
    }

    @Test
    public void usersHasAdminRoleAfterSettingToAdmin() {
        try {
            User user = new User("test", "test");
            user.setUserRole(User.Role.ADMIN.getKey());
            assertEquals(User.Role.ADMIN, user.getUserRole());
        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
            System.out.println("Exception thrown: " + e.getCause());
        }
    }

    @Test
    public void usersHasUserRoleAfterSettingToUser() {
        try {
            User user = new User("test", "test");
            user.setUserRole(User.Role.ADMIN.getKey());
            user.setUserRole(User.Role.USER.getKey());
            assertEquals(User.Role.USER, user.getUserRole());
        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
            System.out.println("Exception thrown: " + e.getCause());
        }
    }
}
