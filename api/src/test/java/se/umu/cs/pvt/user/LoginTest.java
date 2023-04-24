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

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class LoginTest {

    @LocalServerPort
    private User user;
    private UserController lc;
    private Map<String, String> map;

    @Mock
    private final UserRepository userRepository = Mockito.mock(UserRepository.class);

    @BeforeEach
    void init() {
        user = new User();
        lc = new UserController(userRepository);
        map = new HashMap<>();
    }

    @Test
    void loginWithoutCredentialsShouldFail() {
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
            System.out.println("Exception thrown: " + e.getCause());
        }
    }

    @Test
    void loginWithEmptyUsernameShouldFail() {
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
            System.out.println("Exception thrown: " + e.getCause());
        }
    }

    @Test
    void loginWithEmptyPasswordShouldFail() {
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
            System.out.println("Exception thrown: " + e.getCause());
        }
    }

    @Test
    void loginWithoutExistingUserShouldFail() {
        try {
            user.setUsername("nonExistingUser");
            user.setPassword("randomPassword");

            Mockito.when(userRepository.findUserByUsername(user.getUsername())).thenReturn(Optional.empty());

            map.put("username", user.getUsername());
            map.put("password", user.getPassword());

            Object response = lc.userVerification(map);
            if (response instanceof ResponseEntity<?>) {
                assertNull(((ResponseEntity<?>) response).getBody());
            }
        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
            System.out.println("Exception thrown: " + e.getCause());
        }
    }

    @Test
    void loginWithWrongPasswordShouldFail() {
        try {
            user.setUsername("user");
            user.setPassword("invalidPassword");

            Mockito.when(userRepository.findUserByUsername(user.getUsername())).thenReturn(Optional.of(new User("user", "123")));

            map.put("username", user.getUsername());
            map.put("password", user.getPassword());

            Object response = lc.userVerification(map);
            if (response instanceof ResponseEntity<?>) {
                assertEquals(((ResponseEntity<?>) response).getStatusCode(), HttpStatus.BAD_REQUEST);
            }
        }  catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
            System.out.println("Exception thrown: " + e.getCause());
        }
    }

    @Test
    void loginWithUserShouldSucceed() {

        try {
            user.setUsername("user");
            user.setPassword("1234");
            user.setUserRole(1);
            user.setUserId(1L);

            Mockito.when(userRepository.findUserByUsername(user.getUsername())).thenReturn(Optional.of(user));

            map.put("username", user.getUsername());
            map.put("password", "1234");

            String responseToken = (String) lc.userVerification(map);
            assertNotNull(new JWTUtil().validateToken(responseToken));
        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
            System.out.println("Exception thrown: " + e.getCause());
        }
    }
}