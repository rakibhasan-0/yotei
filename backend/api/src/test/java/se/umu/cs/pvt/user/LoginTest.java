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
import se.umu.cs.pvt.role.RoleRepository;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * @author  Phoenix (25-04-2023)
 *          Dragon (16-05-2023)
 *          Team Mango (Grupp 4) - 2024-05-16
 */
@ExtendWith(MockitoExtension.class)
public class LoginTest {

    @LocalServerPort
    private User user;
    private UserController lc;
    private Map<String, String> map;

    @Mock
    private final UserRepository userRepository = Mockito.mock(UserRepository.class);

    @Mock
    final RoleRepository roleRepository = Mockito.mock(RoleRepository.class);
    
    @Mock
    final RoleToPermissionRepository roleToPermissionRepository = Mockito.mock(RoleToPermissionRepository.class);

    @BeforeEach
    void init() {
        user = new User();
        lc = new UserController(userRepository, roleRepository, roleToPermissionRepository);
        map = new HashMap<>();
    }

    @Test
    void shouldFailWhenLoginWithoutCredentials() {
        try {
            user.setUsername("");
            user.setPassword("");
            map.put("username", user.getUsername());
            map.put("password", user.getPassword());

            Object response = lc.userVerification(map);
            if (response instanceof ResponseEntity<?>) {
                assertEquals(((ResponseEntity<?>) response).getStatusCode(), HttpStatus.NOT_ACCEPTABLE);
            }
        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
        }
    }

    @Test
    void shouldFailWhenLoginWithEmptyUsername() {
        try {
            user.setUsername("");
            user.setPassword("1234");
            map.put("username", user.getUsername());
            map.put("password", user.getPassword());

            Object response = lc.userVerification(map);
            if (response instanceof ResponseEntity<?>) {
                assertEquals(((ResponseEntity<?>) response).getStatusCode(), HttpStatus.NOT_ACCEPTABLE);
            }
        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
        }
    }

    @Test
    void shouldFailWhenLoginWithEmptyPassword() {
        try {
            user.setUsername("user");
            map.put("username", user.getUsername());
            map.put("password", "");

            Object response = lc.userVerification(map);
            if (response instanceof ResponseEntity<?>) {
                assertEquals(((ResponseEntity<?>) response).getStatusCode(), HttpStatus.NOT_ACCEPTABLE);
            }
        } catch (InvalidUserNameException e) {
            fail();
        }
    }

    @Test
    void shouldFailWhenLoginWithoutExistingUser() {
        try {
            user.setUsername("nonExistingUser");
            user.setPassword("randomPassword");

            Mockito.when(userRepository.findUserByUsernameIgnoreCase(user.getUsername())).thenReturn(Optional.empty());

            map.put("username", user.getUsername());
            map.put("password", user.getPassword());

            Object response = lc.userVerification(map);
            if (response instanceof ResponseEntity<?>) {
                assertNull(((ResponseEntity<?>) response).getBody());
            }
        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
        }
    }

    @Test
    void shouldFailWhenLoginWithWrongPassword() {
        try {
            user.setUsername("user");
            user.setPassword("invalidPassword");

            Mockito.when(userRepository.findUserByUsernameIgnoreCase(user.getUsername())).thenReturn(Optional.of(new User("user", "123")));

            map.put("username", user.getUsername());
            map.put("password", user.getPassword());

            Object response = lc.userVerification(map);
            if (response instanceof ResponseEntity<?>) {
                assertEquals(((ResponseEntity<?>) response).getStatusCode(), HttpStatus.BAD_REQUEST);
            }
        }  catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
        }
    }

    @Test
    void shouldSucceedWhenLoginWithUser() {

        try {
            user.setUsername("user");
            user.setPassword("1234");
            user.setUserRole(1);
            user.setUserId(1L);

            Mockito.when(userRepository.findUserByUsernameIgnoreCase(user.getUsername())).thenReturn(Optional.of(user));

            map.put("username", user.getUsername());
            map.put("password", "1234");

            String responseToken = (String) lc.userVerification(map);
            assertNotNull(new JWTUtil().validateToken(responseToken));
        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
        }
    }

}