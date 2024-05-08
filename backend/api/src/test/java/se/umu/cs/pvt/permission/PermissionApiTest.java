package se.umu.cs.pvt.permission;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;

import java.util.ArrayList;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Tests for the Permission api
 * 
 * @author Team Mango (Grupp 4) - 2024-05-08
 */
@ExtendWith(MockitoExtension.class)
class PermissionApiTest {
    
    private PermissionController permissionController;
    private ArrayList<Permission> permissions;

    @Mock
    private final PermissionRepository permissionRepository = Mockito.mock(PermissionRepository.class);

    @BeforeEach
    void init() {
        permissionController = new PermissionController(permissionRepository);
        permissions = new ArrayList<>();

        Mockito.lenient().when(permissionRepository.findAll()).thenReturn(permissions);
    }

    @Test
    void shouldFindAllPermissions() {
        try {
            permissions.add(new Permission("Perm1", "desc1"));
            permissions.add(new Permission("Perm2", "desc2"));
            permissions.add(new Permission("Perm3", "desc3"));
            permissions.add(new Permission("Perm4", "desc4"));

            assertEquals(new ResponseEntity<>(permissions, HttpStatus.OK), permissionController.getPermissions());
        } catch (InvalidPermissionNameException e) {
            fail();
        }
    }
}
