package se.umu.cs.pvt.role;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import se.umu.cs.pvt.role.RoleRepository;
import se.umu.cs.pvt.user.UserController;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;


/**
 * Test class for ROLE-API methods.
 *
 * @author Team Mango - 2024-05-08
 */
@ExtendWith(MockitoExtension.class)
public class RoleApiTest {

	@LocalServerPort
    private RoleController roleController;

	@Mock
    private final RoleRepository roleRepository = Mockito.mock(
		RoleRepository.class);

    @BeforeEach
    void init() {
        roleController = new RoleController(roleRepository);
    }

	@Test
	void shouldReturnAllRoles() {
		List<Role> roleList = new ArrayList<>();

		try {
			roleList.add(new Role("role1"));
			roleList.add(new Role("role2"));
			roleList.add(new Role("role3"));

			Mockito.when(roleRepository.findAll()).thenReturn(roleList);

			List<Role> actualList = roleRepository.findAll();
			
			assertTrue(actualList.equals(roleList));

		} catch (Exception e) {
			fail();
		}

	}
}
