package se.umu.cs.pvt.role;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doNothing;


/**
 * Test class for ROLE-API methods.
 *
 * @author Team Mango - 2024-05-10
 */
@ExtendWith(MockitoExtension.class)
public class RoleApiTest {

	private List<Role> roleList;

	@LocalServerPort
    private RoleController roleController;

	@Mock
    private final RoleRepository roleRepository = Mockito.mock(
		RoleRepository.class);

    @BeforeEach
    void init() {
        roleController = new RoleController(roleRepository);
		roleList = new ArrayList<>();

		Mockito.lenient().when(roleRepository.findById(Mockito.any()))
		.thenAnswer(invocation -> {
			Optional<Role> perm = Optional.of(roleList.get(Math.toIntExact(invocation.getArgument(0))));
			return perm;
		});

		Mockito.lenient().when(roleRepository.save(Mockito.any())).thenAnswer(invocation -> {
			roleList.add((Role) invocation.getArgument(0));
			return null;
		});

		Mockito.lenient().when(roleRepository.findAll()).thenReturn(roleList);
    }

	@Test
	void shouldReturnAllRolesWithHttpResponeOK() {
		try {
			roleList.add(new Role("role1"));
			roleList.add(new Role("role2"));
			roleList.add(new Role("role3"));

			ResponseEntity<List<Role>> result = roleController.getRoles();
			
			assertTrue(result.equals(new ResponseEntity<>(roleList, HttpStatus.OK)));

		} catch (InvalidRoleNameException e) {
			fail();
		}
	}

	@Test
	void shouldReturnSpecificRoleFromId() {
        try {
			roleList.add(new Role("role1"));
			roleList.add(new Role("role2"));
			roleList.add(new Role("role3"));

            assertEquals(new ResponseEntity<>(roleList.get(0), HttpStatus.OK), 
				roleController.getRole(0L));
            assertEquals(new ResponseEntity<>(roleList.get(2), HttpStatus.OK), 
				roleController.getRole(2L));

        } catch (InvalidRoleNameException e) {
            fail();
        }
	}

	@Test
    void shouldSucceedWhenAddingRole() {
        try {
			Role role = new Role("role1");
	
			assertEquals(new ResponseEntity<>(role, HttpStatus.OK), 
				roleController.createNewRole(role));

        } catch (InvalidRoleNameException e) {
            fail();
        }
    }

	@Test
	void shouldSucceedWhenRemovingRole() {
		try {
			Role role = new Role("role1");
			roleList.add(role);
			
			doNothing().when(roleRepository).deleteById(Mockito.any());

			assertEquals(new ResponseEntity<>(HttpStatus.OK), roleController.deleteRole(0L));

		} catch (InvalidRoleNameException e) {
			fail();
		}
	}

	@Test
	void shouldSucceedWhenUpdatingRole() {
		try {
			String roleName = "firstRoleName";
			String updatedName = "updatedRoleName";

			Role originalRole = new Role(roleName);
			Role newRole = new Role(updatedName);

			roleList.add(originalRole);
			
			

			assertEquals(new ResponseEntity<>(
				originalRole, HttpStatus.OK), 
				roleController.updateRole(0L, newRole));
			assertTrue(roleList.get(0).getRoleName().equals(updatedName));
		} catch (InvalidRoleNameException e) {
			fail();
		}
	}
}
