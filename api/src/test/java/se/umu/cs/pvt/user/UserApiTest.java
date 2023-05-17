package se.umu.cs.pvt.user;

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

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test class for USER-API methods.
 *
 * @author Quattro Formaggio (Group 1), Phoenix (25-04-2023)
 */

@ExtendWith(MockitoExtension.class)
public class UserApiTest {

    @LocalServerPort
    private User user;
    private ArrayList<User> users;
    private UserController lc;

    @Mock
    private final UserRepository userRepository = Mockito.mock(UserRepository.class);

    @BeforeEach
    void init() {
        user = new User();
        lc = new UserController(userRepository);
        Map<String, String> map = new HashMap<>();
    }


    @Test
    void shouldFailWhenCreatingWithoutCredentials() {
        try {
            user.setUsername("");
            user.setPassword("");

            Object response = lc.registerUser(user);
            if (response instanceof ResponseEntity<?>) {
                assertEquals(((ResponseEntity<?>) response).getStatusCode(), HttpStatus.NOT_ACCEPTABLE);
            }
        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
            System.out.println("Exception thrown: " + e.getCause());
        }
    }


    @Test
    void shouldFailIfCreatedUserExists() {
        try {
            user.setUsername("user");
            user.setPassword("1234");
            user.setUserRole(1);

            Mockito.when(userRepository.findUserByUsernameIgnoreCase(user.getUsername())).thenReturn(Optional.of(user));

            Object response = lc.registerUser(user);
            if (response instanceof ResponseEntity<?>) {
                assertEquals(((ResponseEntity<?>) response).getStatusCode(), HttpStatus.NOT_ACCEPTABLE);
            }
        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
            System.out.println("Exception thrown: " + e.getCause());
        }
    }


    @Test
    void shouldSucceedIfNewUserGivesRightResponse() {
        try {
            user.setUsername("user");
            user.setPassword("1234");
            user.setUserRole(1);

            Mockito.when(userRepository.findUserByUsernameIgnoreCase(user.getUsername())).thenReturn(Optional.empty());

            Object response = lc.registerUser(user);
            if (response instanceof ResponseEntity<?>) {
                assertEquals(((ResponseEntity<?>) response).getStatusCode(), HttpStatus.OK);
            }
        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
            System.out.println("Exception thrown: " + e.getCause());
        }
    }


    @Test
    void shouldReturnAllExistingUsersWithoutIdAndPasswordWhenFetchingUsers() {
        try {
            users = new ArrayList<>();
            for (int i = 1; i < 11; i++) {
                users.add(new User("user" + i, "user" + i, i%2));
            }
            Mockito.when(userRepository.findAllProjectedBy()).thenAnswer(invocation -> {
                ArrayList<Pair<String, User.Role>> usersShort = new ArrayList<>();
                for (User u:users) {
                    usersShort.add(Pair.of(u.getUsername(), u.getUserRole()));
                }
                return users;
            });
            ArrayList<Pair<String, User.Role>> expected = new ArrayList<>();
            for (int i = 1; i < 11; i++) {
                expected.add(Pair.of("user" + i, i == 1 ? User.Role.USER : User.Role.ADMIN));
            }
            Object response = lc.getUsers();
            if (response instanceof ResponseEntity<?>) {
                assertEquals(expected, response);
            }
        } catch (Exception e) {
            fail();
            System.out.println("Exception thrown: " + e.getCause());
        }
    }


    @Test
    void shouldReturnNotFoundIfCantGetUsersFromFetchingUsers() {
        try {
            users = new ArrayList<>();
            for (int i = 1; i < 11; i++) {
                users.add(new User("user" + i, "user" + i, i%2));
            }
            Mockito.when(userRepository.findAllProjectedBy()).thenAnswer(invocation -> {
                return null;
            });
            ArrayList<Pair<String, User.Role>> expected = new ArrayList<>();
            for (int i = 1; i < 11; i++) {
                expected.add(Pair.of("user" + i, i == 1 ? User.Role.USER : User.Role.ADMIN));
            }
            Object response = lc.getUsers();
            if (response instanceof ResponseEntity<?>) {
                assertEquals(new ResponseEntity<>(HttpStatus.NOT_FOUND), response);
            }
        } catch (Exception e) {
            fail();
            System.out.println("Exception thrown: " + e.getCause());
        }
    }


    @Test
    void shouldSucceedWhenRemovingUsers() {
        try {
            users = new ArrayList<>();
            for (int i = 1; i < 11; i++) {
                users.add(new User("user" + i, "user" + i, i%2));
            }
            String username = "user3";
            Mockito.when(userRepository.findUserByUsernameIgnoreCase(username)).thenAnswer(invocation -> {
                for (User u:users) {
                    if (u.getUsername().equals(username)) {
                        return Optional.of(u);
                    }
                }
                return Optional.empty();
            });
            Object response = lc.removeUser(username);
            if (response instanceof ResponseEntity<?>) {
                assertEquals(new ResponseEntity<>(HttpStatus.OK), response);
            }
        } catch (Exception e) {
            System.out.println("Exception thrown: " + e.getCause());
            fail();
        }
    }


    @Test
    void shouldFailWhenRemovingNoneExistingUser() {
        try {
            users = new ArrayList<>();
            for (int i = 1; i < 11; i++) {
                users.add(new User("user" + i, "user" + i, i%2));
            }
            String username = "user3";
            Mockito.when(userRepository.findUserByUsernameIgnoreCase(username)).thenAnswer(invocation -> {
                for (User u:users) {
                    if (u.getUsername().equals(username)) {
                        return Optional.of(u);
                    }
                }
                return Optional.empty();
            });
            Mockito.doThrow(new IllegalArgumentException()).when(userRepository).delete(users.get(3));
            Object response = lc.removeUser(username);
            if (response instanceof ResponseEntity<?>) {
                assertEquals(new ResponseEntity<>("Gick inte att ta bort användaren", HttpStatus.BAD_REQUEST), response);
            }
        } catch (Exception e) {
            System.out.println("Exception thrown: " + e.getCause());
            fail();
        }
    }


    @Test
    void shouldFailWhenRemovingUserWithDatabaseFail() {
        try {
            users = new ArrayList<>();
            for (int i = 1; i < 11; i++) {
                users.add(new User("user" + i, "user" + i, i%2));
            }
            String username = "user20";
            Mockito.when(userRepository.findUserByUsernameIgnoreCase(username)).thenAnswer(invocation -> {
                for (User u:users) {
                    if (u.getUsername().equals(username)) {
                        return Optional.of(u);
                    }
                }
                return Optional.empty();
            });
            Object response = lc.removeUser(username);
            if (response instanceof ResponseEntity<?>) {
                assertEquals(new ResponseEntity<>("Användaren finns inte", HttpStatus.BAD_REQUEST), response);
            }
        } catch (Exception e) {
            System.out.println("Exception thrown: " + e.getCause());
            fail();
        }
    }


    @Test
    void shouldSucceedWhenChangingUserRole() {
        try {
            users = new ArrayList<>();
            for (int i = 1; i < 11; i++) {
                users.add(new User("user" + i, "user" + i, i%2));
            }
            String username = "user3";
            Mockito.when(userRepository.findUserByUsernameIgnoreCase(username)).thenAnswer(invocation -> {
                for (User u:users) {
                    if (u.getUsername().equals(username)) {
                        return Optional.of(u);
                    }
                }
                return Optional.empty();
            });

            Object response = lc.changeRoleUser(username);
            if (response instanceof ResponseEntity<?>) {
                assertEquals(new ResponseEntity<>(HttpStatus.OK), response);
            }
        } catch (Exception e) {
            System.out.println("Exception thrown: " + e.getCause());
            fail();
        }
    }


    @Test
    void shouldFailWhenChangingRoleOnNoneExistingUser() {
        try {
            users = new ArrayList<>();
            for (int i = 1; i < 11; i++) {
                users.add(new User("user" + i, "user" + i, i%2));
            }
            String username = "user20";
            Mockito.when(userRepository.findUserByUsernameIgnoreCase(username)).thenAnswer(invocation -> {
                for (User u:users) {
                    if (u.getUsername().equals(username)) {
                        return Optional.of(u);
                    }
                }
                return Optional.empty();
            });

            Object response = lc.changeRoleUser(username);
            if (response instanceof ResponseEntity<?>) {
                assertEquals(new ResponseEntity<>("Användaren finns inte", HttpStatus.BAD_REQUEST), response);
            }
        } catch (Exception e) {
            System.out.println("Exception thrown: " + e.getCause());
            fail();
        }
    }


    @Test
    void shouldFailWhenChangingRoleOnUserWithDatabaseFail() {
        try {
            users = new ArrayList<>();
            for (int i = 1; i < 11; i++) {
                users.add(new User("user" + i, "user" + i, i%2));
            }
            String username = "user3";
            Mockito.when(userRepository.findUserByUsernameIgnoreCase(username)).thenAnswer(invocation -> {
                for (User u:users) {
                    if (u.getUsername().equals(username)) {
                        return Optional.of(u);
                    }
                }
                return Optional.empty();
            });

            Mockito.doThrow(new IllegalArgumentException()).when(userRepository).save(users.get(3));
            Object response = lc.changeRoleUser(username);
            if (response instanceof ResponseEntity<?>) {
                assertEquals(new ResponseEntity<>("Gick inte att ändra roll på användaren", HttpStatus.BAD_REQUEST), response);
            }
        } catch (Exception e) {
            System.out.println("Exception thrown: " + e.getCause());
            fail();
        }
    }
}