package se.umu.cs.pvt.permission;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.Mockito.doNothing;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import se.umu.cs.pvt.user.User;
import se.umu.cs.pvt.user.UserRepository;

/**
 * Tests for the UserToPermission api
 * 
 * @author Team Mango (Grupp 4) - 2024-05-17
 */
@ExtendWith(MockitoExtension.class)
public class UsersToPermissionApiTest {
	private UserToPermissionController userToPermissionController;
	private ArrayList<UserToPermission> userPermissionPairs;
	private ArrayList<Permission> permissions;

	@Mock
	private final UserToPermissionRepository userToPermissionRepository = Mockito.mock(
		UserToPermissionRepository.class);

	@Mock
	private final UserRepository userRepository = Mockito.mock(
		UserRepository.class);

	@Mock
	private final PermissionRepository permissionRepository = Mockito.mock(
		PermissionRepository.class);
	

	@BeforeEach
	void init() {
		userToPermissionController = new UserToPermissionController(
			userToPermissionRepository, permissionRepository, userRepository);
		userPermissionPairs = new ArrayList<>();
		permissions = new ArrayList<>();

		Mockito.lenient().when(userToPermissionRepository.findAllByUserId(Mockito.any()))
		.thenAnswer(invocation -> {
			return getUserPermissions(invocation);
		});

		Mockito.lenient().when(userToPermissionRepository.save(Mockito.any())).thenAnswer(
			invocation -> {
				UserToPermission result = (UserToPermission) invocation.getArgument(0);
				userPermissionPairs.add(result);

				return result;
			});

		Mockito.lenient().when(userToPermissionRepository.findByUserIdAndPermissionId(
			Mockito.any(), Mockito.any())).thenAnswer(invocation -> {				
				UserToPermission result = findUserToPermissionPair(invocation);
				return result;
			});

		Mockito.lenient().when(
			userRepository.findById(Mockito.any())).thenReturn(Optional.of(new User()));


		Mockito.lenient().when(permissionRepository.findById(Mockito.any()))
		.thenAnswer(invocation -> {
			return findPermission(invocation);
		});
	}

	private UserToPermission findUserToPermissionPair(InvocationOnMock invocation) {
		Long userId = invocation.getArgument(0);

		for (UserToPermission userToPermission : userPermissionPairs) {
			if (userId == userToPermission.getUserId()) {
				Long permissionId = userToPermission.getPermissionId();
				Long actualPermissionId = invocation.getArgument(1);

				if (permissionId == actualPermissionId) {
					return userToPermission;
				}
			}
		}

		return null;
	}

	private Object findPermission(InvocationOnMock invocation) {
		Long permissionId = invocation.getArgument(0);
		Optional<Permission> result = getPermissionObject(permissionId);
		
		return result;
	}

	private Optional<Permission> getPermissionObject(Long permissionId) {
		for (Permission permission : permissions) {
			if (permission.getPermissionId() == permissionId) {
				return Optional.of(permission);
			}
		}

		return Optional.empty();
	}

	private Object getUserPermissions(InvocationOnMock invocation) {
		Long userId = invocation.getArgument(0);
		List<UserToPermission> uToPermissions = new ArrayList<>();

		for (UserToPermission userToPermission : userPermissionPairs) {
			if (userId == userToPermission.getUserId()) {
				uToPermissions.add(userToPermission);
			}
		}

		return uToPermissions;
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
			
			userPermissionPairs.add(new UserToPermission(0L, 0L));
			userPermissionPairs.add(new UserToPermission(0L, 1L));
			userPermissionPairs.add(new UserToPermission(0L, 2L));

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
			permission.setPermissionId(0L);
			permissions.add(permission);

			assertEquals(new ResponseEntity<>(
				HttpStatus.NO_CONTENT), 
				userToPermissionController.getUserPermissions(0L));

			ResponseEntity<UserToPermission> result = userToPermissionController
				.postUserPermissionPair(0L, 0L);

			Long userIdResult = result.getBody().getUserId();
			Long permissionIdResult = result.getBody().getPermissionId();

			assertEquals(userIdResult, 0L);
			assertEquals(permissionIdResult, 0L);

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
			userPermissionPairs.add(userToPermission);

			Map<String, Long> map = new HashMap<>();
			map.put("user_id", 0L);
			map.put("permission_id", 0L);

			doNothing().when(userToPermissionRepository).deleteByUserIdAndPermissionId(
				Mockito.any(), Mockito.any());

			assertEquals(new ResponseEntity<>(map ,HttpStatus.OK), 
				userToPermissionController.deleteUserPermissionPair(0L, 0L));

		} catch (InvalidPermissionNameException e) {
			fail();
		}
	}
}
