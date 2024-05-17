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
import se.umu.cs.pvt.role.RoleRepository;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test class for UPDATE-USER methods.
 *
 * @author Quattro Formaggio (Group 1), Phoenix (25-04-2023)
 * @author Team Mango (Grupp 4) - 2024-05-16
 */

@ExtendWith(MockitoExtension.class)
public class UpdateUserTest {

    @LocalServerPort
    private User user;
    private UserController userController;
    private Map<String, String> map;

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
        userController = new UserController(userRepository, roleRepository, roleToPermissionRepository, userToPermissionRepository);
        map = new HashMap<>();
    }

    @Test
    void shouldSucceedWhenUpdatingUsernameWithCorrectInput() {

        try {
            map.put("newUsername", "newName");
            map.put("id", "42");
            map.put("password", "1234");

            user.setUsername("user");
            user.setPassword("1234");
            user.setUserId(42L);
            user.setUserRole(0);

            Mockito.when(userRepository.findById(42L)).thenReturn(Optional.of(user));

            User newUser = new User("newName", "1234");
            newUser.setUserId(42L);
            newUser.setUserRole(1);

            ResponseEntity<Object> response = userController.updateUsername(map);
            // You should check if a user was found (HttpStatus) before doing the following...
            user = (User) response.getBody();

            assert user != null;
            assertEquals("newName", user.getUsername());

        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
        }
    }

    @Test
    void shouldFailWhenUpdatingUsernameWithWrongPassword() {

        try {
            map.put("newUsername", "newName");
            map.put("id", "42");
            map.put("password", "4321");
            user.setUsername("user");
            user.setPassword("1234");
            user.setUserId(42L);
            user.setUserRole(0);

            Mockito.when(userRepository.findById(42L)).thenReturn(Optional.of(user));

            ResponseEntity<Object> response = userController.updateUsername(map);

            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
        }
    }

    @Test
    void shouldFailWhenUpdatingUsernameWithAlreadyExistingUsername() {

        try {
            map.put("newUsername", "user");
            map.put("id", "42");
            map.put("password", "1234");
            user.setUsername("user");
            user.setPassword("1234");
            user.setUserId(42L);
            user.setUserRole(0);

            Mockito.when(userRepository.findUserByUsernameIgnoreCase("user")).thenReturn(Optional.of(user));

            ResponseEntity<Object> response = userController.updateUsername(map);
            assertEquals(HttpStatus.NOT_ACCEPTABLE, response.getStatusCode());

        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
        }
    }
    @Test
    void shouldFailWhenUpdatingPasswordWithNoInput() {
        try {
            user.setUsername("user");
            user.setPassword("1234");
            user.setUserId(42L);
            user.setUserRole(0);
        } catch (InvalidUserNameException | InvalidKeySpecException | NoSuchAlgorithmException | InvalidPasswordException e) {
            e.printStackTrace();
        }
        map.put("newPassword", "");
        map.put("verifyNewPassword", "");
        map.put("oldPassword", "");
        map.put("id", "42");

        ResponseEntity<Object> response = userController.updatePassword(map);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

    }
    @Test
    void shouldFailWhenUpdatingPasswordWithNewPasswordsDifferent() {
        try {
            user.setUsername("user");
            user.setPassword("1234");
            user.setUserId(42L);
            user.setUserRole(0);
        } catch (InvalidUserNameException | InvalidKeySpecException | NoSuchAlgorithmException | InvalidPasswordException e) {
            e.printStackTrace();
        }
        map.put("newPassword", "4321");
        map.put("verifyNewPassword", "5555");
        map.put("oldPassword", "1234");
        map.put("id", "42");

        ResponseEntity<Object> response = userController.updatePassword(map);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
    @Test
    void shouldFailWhenUpdatingPasswordWithOldPasswordWrong() {
        try {
            user.setUsername("user");
            user.setPassword("1234");
            user.setUserId(42L);
            user.setUserRole(0);
        } catch (InvalidUserNameException | InvalidKeySpecException | NoSuchAlgorithmException | InvalidPasswordException e) {
            e.printStackTrace();
        }
        map.put("newPassword", "4321");
        map.put("verifyNewPassword", "4321");
        map.put("oldPassword", "5555");
        map.put("id", "42");


        Mockito.when(userRepository.findById(42L)).thenReturn(Optional.of(user));
        ResponseEntity<Object> response = userController.updatePassword(map);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
    @Test
    void shouldSucceedWhenUpdatingPasswordWithCorrectInput() throws NoSuchAlgorithmException, InvalidKeySpecException {
        try {
            user.setUsername("user");
            user.setPassword("1234");
            user.setUserId(42L);
            user.setUserRole(0);
        } catch (InvalidUserNameException | InvalidKeySpecException | NoSuchAlgorithmException | InvalidPasswordException e) {
            e.printStackTrace();
        }
        map.put("newPassword", "4321");
        map.put("verifyNewPassword", "4321");
        map.put("oldPassword", "1234");
        map.put("id", "42");


        Mockito.when(userRepository.findById(42L)).thenReturn(Optional.of(user));
        ResponseEntity<Object> response = userController.updatePassword(map);
        user = (User) response.getBody();

        assert user != null;
        assertTrue(PasswordHash.validatePassword("4321", user.getPassword()));
    }
}
