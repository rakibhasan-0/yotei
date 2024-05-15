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

import se.umu.cs.pvt.role.Role;
import se.umu.cs.pvt.role.RoleRepository;

/**
 * Tests for the role_to_permission api
 * 
 * @author Team Mango (Grupp 4) - 2024-05-15
 */
@ExtendWith(MockitoExtension.class)
class RoleToPermissionApiTest {
    
    private RoleToPermissionController roleToPermissionController;
    private ArrayList<RoleToPermission> rolePermissionPairs;
    private ArrayList<Permission> permissions;

    @Mock
    private final RoleToPermissionRepository roleToPermissionRepository = Mockito.mock(RoleToPermissionRepository.class);
    
    @Mock
    private final RoleRepository roleRepository = Mockito.mock(RoleRepository.class);

    @Mock
    private final PermissionRepository permissionRepository = Mockito.mock(PermissionRepository.class);

    @BeforeEach
    void init() {
        roleToPermissionController = new RoleToPermissionController(roleToPermissionRepository, permissionRepository, roleRepository);
        rolePermissionPairs = new ArrayList<>();
        permissions = new ArrayList<>();

        Mockito.lenient().when(roleToPermissionRepository.findAllByRoleId(Mockito.any()))
            .thenAnswer(invocation -> {
                Long roleId = invocation.getArgument(0);
                ArrayList<Permission> perms = new ArrayList<>();
                for (RoleToPermission rp : rolePermissionPairs) {
                    if (rp.getRoleId() == roleId) {
                        for (Permission permission : permissions) {
                            if (rp.getPerimssionId() == permission.getPermissionId()) {
                                perms.add(permission);
                            }
                        }
                    }
                }
                return perms;
            });

        Mockito.lenient().when(roleRepository.findById(Mockito.any())).thenReturn(Optional.of(new Role()));
    }

    @Test
    void shouldFindAllPermissionsForUser() {
        rolePermissionPairs.add(new RoleToPermission(1L, 0L));
        rolePermissionPairs.add(new RoleToPermission(1L, 2L));
        rolePermissionPairs.add(new RoleToPermission(1L, 5L));
        rolePermissionPairs.add(new RoleToPermission(1L, 7L));

        try {
            Permission perm1 = new Permission("test", "test");
            perm1.setPermissionId(0L);
            permissions.add(perm1);
            Permission perm2 = new Permission("test", "test");
            perm2.setPermissionId(2L);
            permissions.add(perm2);
            Permission perm3 = new Permission("test", "test");
            perm3.setPermissionId(5L);
            permissions.add(perm3);
            Permission perm4 = new Permission("test", "test");
            perm4.setPermissionId(7L);
            permissions.add(perm4);
        } catch (InvalidPermissionNameException e) {
            fail();
        }

        assertEquals(new ResponseEntity<>(permissions, HttpStatus.OK), roleToPermissionController.getAllPermissionsForRoleWithId(1L));
    }

    @Test
    void shouldBeAbleToAddPermissionToRole() {

    }

    @Test
    void shouldBeAbleToRemovePermissionFromRole() {

    }
}
