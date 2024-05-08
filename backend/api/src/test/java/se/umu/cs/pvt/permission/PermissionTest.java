package se.umu.cs.pvt.permission;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

import org.junit.jupiter.api.Test;

public class PermissionTest {
    
    @Test
    public void shouldThrowExceptionWhenRoleNameIsEmpty() {
        Exception exception = assertThrows(InvalidPermissionNameException.class, () -> new Permission("", "description"));

        String expectedMessage = "Permission name can not be empty!";
        String message = exception.getMessage();

        assertTrue(message == expectedMessage);
    }

    @Test
    public void permissionValidConstructor() {
        try {
            String name = "Name";
            String desc = "Description";
            Permission perm = new Permission(name, desc);
            assertEquals(name, perm.getPermissionName());
            assertEquals(desc, perm.getPermissionDescription());
        } catch (InvalidPermissionNameException e) {
            fail();
        }
    }
}
