package se.umu.cs.pvt.role;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

import org.junit.jupiter.api.Test;

public class RoleTest {
    
    @Test
    public void shouldThrowExceptionWhenRoleNameIsEmpty() {
        Exception exception = assertThrows(InvalidRoleNameException.class, () -> new Role(""));

        String expectedMessage = "Role name can not be empty!";
        String message = exception.getMessage();

        assertTrue(message == expectedMessage);
    }

    @Test
    public void roleValidConstructorTest() {
        try {
            String role_name = "Trainer";
            Role role = new Role(role_name);
            assertEquals(role_name, role.getRoleName());
        } catch (InvalidRoleNameException e) {
            fail();
        }
    }
}
