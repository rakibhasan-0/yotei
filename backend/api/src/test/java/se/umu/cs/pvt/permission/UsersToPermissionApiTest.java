package se.umu.cs.pvt.permission;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.Mockito.doNothing;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Tests for the UserToPermission api
 * 
 * @author Team Mango (Grupp 4) - 2024-05-15
 */
@ExtendWith(MockitoExtension.class)
public class UsersToPermissionApiTest {
	private UserToPermissionController userToPermissionController;
	private ArrayList<UserToPermission> userToPermissions;
	private ArrayList<Permission> permissions;

	@Mock
	private final UserToPermissionRepository userToPermissionRepository = Mockito.mock(
		UserToPermissionRepository.class);

	@BeforeEach
	void init() {
		userToPermissionController = new UserToPermissionController(
			userToPermissionRepository);
		userToPermissions = new ArrayList<>();
		permissions = new ArrayList<>();

		Mockito.lenient().when(userToPermissionRepository.findAllByUserId(Mockito.any()))
		.thenAnswer(invocation -> {
			return getUserPermissions(invocation);
		});

		Mockito.lenient().when(userToPermissionRepository.save(Mockito.any())).thenAnswer(
			invocation -> {
				userToPermissions.add((UserToPermission) invocation.getArgument(0));
				return null;
			});

		Mockito.lenient().when(userToPermissionRepository.findByUserIdAndPermissionId(
			Mockito.any(), Mockito.any())).thenAnswer(invocation -> {
				Long userId = invocation.getArgument(0);
				
				for (UserToPermission userToPermission : userToPermissions) {
					if (userId == userToPermission.getUserId()) {
						Long permissionId = userToPermission.getPermissionId();
						Long actualPermissionId = invocation.getArgument(1);

						if (permissionId == actualPermissionId) {
							return userToPermission;
						}
					}
				}
		
				return null;
			});
	}

	private Object getUserPermissions(InvocationOnMock invocation) {
		Long userId = invocation.getArgument(0);
		ArrayList<Permission> userPermissions = new ArrayList<>();

		for (UserToPermission userToPermission : userToPermissions) {
			if (userId == userToPermission.getUserId()) {
				Long permissionId = userToPermission.getPermissionId();

				for (Permission permission : permissions) {
					if (permission.getPermissionId() == permissionId) {
						userPermissions.add(permission);
					}
				}
			}
		}

		return userPermissions;
	}

	@Test
	void shouldFindAllUserPermissions() {
		try {
			Permission perm1 = new Permission("none", "none");
			perm1.setPermissionId(0L);
			permissions.add(perm1);
			Permission perm2 = new Permission("none", "none");
			perm2.setPermissionId(1L);
			permissions.add(perm2);
			Permission perm3 = new Permission("none", "none");
			perm3.setPermissionId(2L);
			permissions.add(perm3);
			
			userToPermissions.add(new UserToPermission(0L, 0L));
			userToPermissions.add(new UserToPermission(0L, 1L));
			userToPermissions.add(new UserToPermission(0L, 2L));

			ResponseEntity<List<Permission>> result = userToPermissionController
				.getUserPermissions(0L);

			assertEquals(result, new ResponseEntity<>(permissions, HttpStatus.OK));
		
		} catch (InvalidPermissionNameException e) {
			fail();
		}
	}

	@Test
	void shouldSucceedInPostingNewUserPermissionPair() {
		try {
			Permission permission = new Permission("none", "none");
			UserToPermission userToPermission = new UserToPermission(
				0L, permission.getPermissionId());
			UserToPermission result = userToPermissionController.postUserPermissionPair(
				permission, 0L).getBody();

			assertEquals(userToPermission.getPermissionId(), result.getPermissionId());
			assertEquals(userToPermission.getUserId(), result.getUserId());
		} catch (InvalidPermissionNameException e) {
			fail();
		}
	}

	@Test
	void shouldSucceedWhenRemovingUserPermissionPair() {
		try {
			Permission permission = new Permission("none", "none");
			permission.setPermissionId(0L);

			UserToPermission userToPermission = new UserToPermission(
				0L, permission.getPermissionId());
			userToPermissions.add(userToPermission);

			Map<String, Long> ids = new HashMap<>();
			ids.put("user_id", 0L);
			ids.put("permission_id", 0L);

			doNothing().when(userToPermissionRepository).deleteByUserIdAndPermissionId(
				Mockito.any(), Mockito.any());

			assertEquals(new ResponseEntity<>(HttpStatus.OK), 
				userToPermissionController.deleteUserPermissionPair(ids));

		} catch (InvalidPermissionNameException e) {
			fail();
		}

	}
}
