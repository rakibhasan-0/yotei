package se.umu.cs.pvt.permission;

import java.util.ArrayList;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import se.umu.cs.pvt.role.RoleRepository;

/**
 * Tests for the role_to_permission api
 * 
 * @author Team Mango (Grupp 4) - 2024-05-13
 */
@ExtendWith(MockitoExtension.class)
class RoleToPermissionApiTest {
    
    private RoleToPermissionController roleToPermissionController;
    private ArrayList<RoleToPermission> rolePermissionPairs;

    @Mock
    private final RoleToPermissionRepository roleToPermissionRepository = Mockito.mock(RoleToPermissionRepository.class);
    
    @Mock
    private final RoleRepository roleRepository = Mockito.mock(RoleRepository.class);

    @Mock
    private final PermissionRepository permissionRepository = Mockito.mock(PermissionRepository.class);

    @BeforeEach
    void init() {
        roleToPermissionController = new RoleToPermissionController(roleToPermissionRepository, permissionRepository, roleRepository);
    }
}
