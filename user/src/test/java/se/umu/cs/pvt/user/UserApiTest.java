package se.umu.cs.pvt.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.stubbing.OngoingStubbing;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;

/**
 * Test class for USER-API methods.
 *
 * @author Quattro Formaggio (Group 1)
 */

@ExtendWith(MockitoExtension.class)
public class UserApiTest {

    @LocalServerPort
    private User user;
    private ArrayList<User> users;
    private UserController lc;
    private Map<String, String> map;

    @Mock
    private UserRepository userRepository = Mockito.mock(UserRepository.class);

    @BeforeEach
    void init() {
        user = new User();
        lc = new UserController(userRepository);
        map = new HashMap<>();
    }

    /**
     * Tests if no credentials then fail.
     */
    @Test
    void createWithoutCredentialsShouldFail() {
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

    /**
     * Tests HTTP-response of already existing user.
     */
    @Test
    void createdUserShouldExist() {
        try {
            user.setUsername("user");
            user.setPassword("1234");
            user.setUserRole(1);

            Mockito.when(userRepository.findUserByUsername(user.getUsername())).thenReturn(Optional.of(user));

            Object response = lc.registerUser(user);
            if (response instanceof ResponseEntity<?>) {
                assertEquals(((ResponseEntity<?>) response).getStatusCode(), HttpStatus.NOT_ACCEPTABLE);
            }
        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
            System.out.println("Exception thrown: " + e.getCause());
        }
    }

    /**
     * Tests that a newly created user gives right HTTP-response.
     */
    @Test
    void createdNewUserShouldNotFail() {
        try {
            user.setUsername("user");
            user.setPassword("1234");
            user.setUserRole(1);

            Mockito.when(userRepository.findUserByUsername(user.getUsername())).thenReturn(Optional.empty());

            Object response = lc.registerUser(user);
            if (response instanceof ResponseEntity<?>) {
                assertEquals(((ResponseEntity<?>) response).getStatusCode(), HttpStatus.OK);
            }
        } catch (InvalidUserNameException | InvalidPasswordException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            fail();
            System.out.println("Exception thrown: " + e.getCause());
        }
    }



    /**
     * Tests that all users excluding their password and id is returned on fetching all.
     */
    @Test
    void fetchingUsersShouldReturnAllExistingUsersWithoutIdAndPassword() {
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

    /**
     * Tests that a 404 NOT FOUND is returned if the users could not be found.
     */
    @Test
    void fetchingUsersShouldReturnNotFoundIfCouldNotGetUsers() {
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
                assertEquals(new ResponseEntity(HttpStatus.NOT_FOUND), response);
            }
        } catch (Exception e) {
            fail();
            System.out.println("Exception thrown: " + e.getCause());
        }
    }

    /**
     * Tests that an OK is returned on a successful remove of user.
     */
    @Test
    void removeUserSuccessfully() {
        try {
            users = new ArrayList<>();
            for (int i = 1; i < 11; i++) {
                users.add(new User("user" + i, "user" + i, i%2));
            }
            String username = "user3";
            Mockito.when(userRepository.findUserByUsername(username)).thenAnswer(invocation -> {
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

    /**
     * Tests that a BAD REQUEST is returned on a remove of a none existing user.
     */
    @Test
    void removeUserNoneExistingUser() {
        try {
            users = new ArrayList<>();
            for (int i = 1; i < 11; i++) {
                users.add(new User("user" + i, "user" + i, i%2));
            }
            String username = "user3";
            Mockito.when(userRepository.findUserByUsername(username)).thenAnswer(invocation -> {
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

    /**
     * Tests that a BAD REQUEST is returned on a remove of a user with a database fail.
     */
    @Test
    void removeUserDatabaseFail() {
        try {
            users = new ArrayList<>();
            for (int i = 1; i < 11; i++) {
                users.add(new User("user" + i, "user" + i, i%2));
            }
            String username = "user20";
            Mockito.when(userRepository.findUserByUsername(username)).thenAnswer(invocation -> {
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


    /**
     * Tests that an OK is returned on a successful change of role for a user.
     */
    @Test
    void changeRoleSuccessfully() {
        try {
            users = new ArrayList<>();
            for (int i = 1; i < 11; i++) {
                users.add(new User("user" + i, "user" + i, i%2));
            }
            String username = "user3";
            Mockito.when(userRepository.findUserByUsername(username)).thenAnswer(invocation -> {
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

    /**
     * Tests that a BAD REQUEST is returned on a change role of a none existing user.
     */
    @Test
    void changeRoleNoneExistingUser() {
        try {
            users = new ArrayList<>();
            for (int i = 1; i < 11; i++) {
                users.add(new User("user" + i, "user" + i, i%2));
            }
            String username = "user20";
            Mockito.when(userRepository.findUserByUsername(username)).thenAnswer(invocation -> {
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

    /**
     * Tests that a BAD REQUEST is returned on a change role of a user with a database fail.
     */
    @Test
    void changeRoleDatabaseFail() {
        try {
            users = new ArrayList<>();
            for (int i = 1; i < 11; i++) {
                users.add(new User("user" + i, "user" + i, i%2));
            }
            String username = "user3";
            Mockito.when(userRepository.findUserByUsername(username)).thenAnswer(invocation -> {
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