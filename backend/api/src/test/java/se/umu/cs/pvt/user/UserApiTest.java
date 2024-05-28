package se.umu.cs.pvt.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import se.umu.cs.pvt.permission.RoleToPermissionRepository;
import se.umu.cs.pvt.permission.UserToPermissionRepository;
import se.umu.cs.pvt.role.Role;
import se.umu.cs.pvt.role.RoleRepository;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test class for USER-API methods.
 *
 * @author Quattro Formaggio (Group 1), Phoenix (25-04-2023)
 * @author Team Mango (Grupp 4) - 2024-05-22
 */

@ExtendWith(MockitoExtension.class)
public class UserApiTest {

    @LocalServerPort
    private User user;
    private ArrayList<User> users;
    private UserController lc;

    @Mock
    private final UserRepository userRepository = Mockito.mock(UserRepository.class);
    @Mock
    final RoleRepository roleRepository = Mockito.mock(RoleRepository.class);
    @Mock
    final RoleToPermissionRepository roleToPermissionRepository = Mockito.mock(RoleToPermissionRepository.class);
    @Mock
    final UserToPermissionRepository userToPermissionRepository = Mockito.mock(UserToPermissionRepository.class);

    @BeforeEach
    void init() {
        user = new User();
        lc = new UserController(userRepository, roleRepository, roleToPermissionRepository, userToPermissionRepository);
    }


    @Test
    void shouldFailWhenCreatingWithoutCredentials() {
        try {
            user.setUsername("");
            user.setPassword("");

            Object response = lc.registerUser(user);
            if (response instanceof ResponseEntity<?>) {
                HttpStatus actual = ((ResponseEntity<?>) response).getStatusCode();
                assertEquals(HttpStatus.NOT_ACCEPTABLE, actual);
            }
        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
        }
    }


    @Test
    void shouldFailIfCreatedUserExists() {
        try {
            user.setUsername("user");
            user.setPassword("1234");

            Mockito.when(userRepository.findUserByUsernameIgnoreCase(user.getUsername())).thenReturn(Optional.of(user));

            Object response = lc.registerUser(user);
            if (response instanceof ResponseEntity<?>) {
                HttpStatus actual = ((ResponseEntity<?>) response).getStatusCode();
                assertEquals(HttpStatus.NOT_ACCEPTABLE, actual);
            }
        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
        }
    }


    @Test
    void shouldSucceedIfNewUserGivesRightResponse() {
        try {
            user.setUsername("user");
            user.setPassword("1234");

            Mockito.when(userRepository.findUserByUsernameIgnoreCase(user.getUsername())).thenReturn(Optional.empty());

            Object response = lc.registerUser(user);
            if (response instanceof ResponseEntity<?>) {
                HttpStatus actual = ((ResponseEntity<?>) response).getStatusCode();
                assertEquals(HttpStatus.OK, actual);
            }
        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
        }
    }

    @Test
    void shouldReturnNotFoundIfCantGetUsersFromFetchingUsers() {
        try {
            Mockito.when(userRepository.findAllProjectedBy()).thenAnswer(invocation -> null);

            Object response = lc.getUsers();
            if (response instanceof ResponseEntity<?>) {
                HttpStatus actual = ((ResponseEntity<?>) response).getStatusCode();
                assertEquals(HttpStatus.NOT_FOUND, actual);
            }
        } catch (Exception e) {
            fail();
        }
    }


    @Test
    void shouldSucceedWhenRemovingUsers() {
        try {
            Long id = 3L;
            Mockito.when(userRepository.findById(id)).thenAnswer(invocation -> Optional.of(new User("user3", "user3")));
            Object response = lc.removeUser(id);
            if (response instanceof ResponseEntity<?>) {
                HttpStatus actual = ((ResponseEntity<?>) response).getStatusCode();
                assertEquals(HttpStatus.OK, actual);
            }
        } catch (Exception e) {
            fail();
        }
    }


    @Test
    void shouldFailWhenRemovingNoneExistingUser() {
        try {
            Long id = 3L;
            Mockito.when(userRepository.findById(id)).thenAnswer(invocation -> Optional.empty());
            Object response = lc.removeUser(id);
            if (response instanceof ResponseEntity<?>) {
                HttpStatus actual = ((ResponseEntity<?>) response).getStatusCode();
                assertEquals(HttpStatus.BAD_REQUEST, actual);
            }
        } catch (Exception e) {
            fail();
        }
    }


    @Test
    void shouldFailWhenRemovingUserWithDatabaseFail() {
        try {
            Long id = 20L;
            Mockito.when(userRepository.findById(id)).thenAnswer(invocation -> Optional.empty());
            Object response = lc.removeUser(id);
            if (response instanceof ResponseEntity<?>) {
                HttpStatus actual = ((ResponseEntity<?>) response).getStatusCode();
                assertEquals(HttpStatus.BAD_REQUEST, actual);
            }
        } catch (Exception e) {
            fail();
        }
    }


    // These tests are for the old role system, should be rewritten for the new system
    /* @Test
    void shouldFailWhenChangingRoleOnNoneExistingUser() {
        try {
            Long id = 20L;
            Mockito.when(userRepository.findById(id)).thenAnswer(invocation -> Optional.empty());

            Object response = lc.changeRoleUser(id, User.Role.ADMIN.getKey());
            if (response instanceof ResponseEntity<?>) {
                HttpStatus actual = ((ResponseEntity<?>) response).getStatusCode();
                assertEquals(HttpStatus.BAD_REQUEST, actual);
            }
        } catch (Exception e) {
            fail();
        }
    } */


    /* @Test
    void shouldFailWhenChangingRoleOnUserWithDatabaseFail() {
        try {
            Long id = 3L;
            Mockito.when(userRepository.findById(id)).thenAnswer(invocation -> Optional.empty());

            Object response = lc.changeRoleUser(id, User.Role.USER.getKey());
            if (response instanceof ResponseEntity<?>) {
                HttpStatus actual = ((ResponseEntity<?>) response).getStatusCode();
                assertEquals(HttpStatus.BAD_REQUEST, actual);
            }
        } catch (Exception e) {
            e.printStackTrace();
            fail();
        }
    } */

    @Test
    void shouldSetRoleCorrectly() {
        try {
            Long id = 3L;
            Mockito.lenient().when(userRepository.findById(id)).thenAnswer(invocation -> Optional.of(new User("user3", "user3", 2L)));

            Mockito.lenient().when(roleRepository.findById(Mockito.anyLong())).thenAnswer(invocation -> Optional.of(new Role("test")));

            Mockito.lenient().when(userRepository.save(Mockito.any()))
                .thenAnswer(invocation -> {
                    User newUser = invocation.getArgument(0);
                    return newUser;
                });
            
            Object response = lc.setUserRoleThroughRoleId(id, 4L);
            if (response instanceof ResponseEntity<?>) {
                HttpStatus actual = ((ResponseEntity<?>) response).getStatusCode();
                assertEquals(HttpStatus.OK, actual);
            }
        } catch (Exception e) {
            e.printStackTrace();
            fail();
        }
    }

    @Test
    void shouldRemoveRoleCorrectly() {
        Long id = 3L;
        Mockito.lenient().when(userRepository.findById(id)).thenAnswer(invocation -> Optional.of(new User("user3", "user3", 2L)));

        Mockito.lenient().when(userRepository.save(Mockito.any()))
            .thenAnswer(invocation -> {
                User newUser = invocation.getArgument(0);
                return newUser;
            });

        Object response = lc.removeRoleFromUserWithId(id);
        if (response instanceof ResponseEntity<?>) {
            HttpStatus actual = ((ResponseEntity<?>) response).getStatusCode();
            assertEquals(HttpStatus.OK, actual);
        }
    }
}