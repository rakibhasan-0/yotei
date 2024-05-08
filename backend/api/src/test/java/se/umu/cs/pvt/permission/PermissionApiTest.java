package se.umu.cs.pvt.permission;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;

import java.util.ArrayList;
import java.util.Optional;

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
        Mockito.lenient().when(permissionRepository.findById(Mockito.any()))
            .thenAnswer(invocation -> {
                Optional<Permission> perm = Optional.of(permissions.get(Math.toIntExact(invocation.getArgument(0))));
                return perm;
            });
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

    @Test
    void shouldGetNoContentCodeWhenEmpty() {
        assertEquals(new ResponseEntity<>(permissions, HttpStatus.NO_CONTENT), permissionController.getPermissions());
    }

    @Test
    void shouldGetSpecificPermissionWithId() {
        try {
            permissions.add(new Permission("Perm1", "desc1"));
            permissions.add(new Permission("Perm2", "desc2"));
            permissions.add(new Permission("Perm3", "desc3"));
            permissions.add(new Permission("Perm4", "desc4"));

            assertEquals(new ResponseEntity<>(permissions.get(0), HttpStatus.OK), permissionController.getPermissionFromId(0L));
            //assertEquals(permissions.get(2), permissionController.getPermissionFromId(2L));
        } catch (InvalidPermissionNameException e) {
            fail();
        }
    }
}
