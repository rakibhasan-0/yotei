package se.umu.cs.pvt.user;

import javax.persistence.*;

import static org.mockito.ArgumentMatchers.any;

import java.io.Serializable;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Arrays;
import java.util.Collections;

/**
 * This is the User class that is responsible for the credentials of a registered user.
 * 
 * UserController.java - Main class for handling login information and transactions with the database.
 * UserRepository.java - Interface for handling SQL transactions which may be empty.
 * UserShort.java - Minimal data stucture for User entity.
 * PasswordHash.java - The class handles the hashing of passwords.
 * JWTUtil.java - Utility class for creating and verifying Json Web Tokens.
 * InvalidUserNameException.java - An exception that can be thrown when an invalid username is given.
 * InvalidPasswordException.java - An exception that can be thrown when an invalid password is entered.
 * 
 * @author Team Hot-Pepper (G7) (Doc: Griffin c17wfn)
 */
@Entity
@Table(name = "user_table")
public class User implements Serializable {

    /**
     * The id for the user.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "user_id")
    private Long userId;

    /**
     * The username for the user.
     */
    @Column(nullable = false, name = "username")
    private String username;

    /**
     * The password for the user.
     */
    @Column(nullable = false, name = "password")
    private String password;

    /**
     * The role for the user.
     */
    @Column(nullable = false, name = "user_role")
    private Role userRole;

    /**
     * The different roles the user can have.
     */
    public enum Role {
        USER(0), ADMIN(1), EDITOR(2);
        private final int key;

        Role(int key) {
            this.key = key;
        }

        public int getKey() {
            return this.key;
        }

        public static Role fromKey(int key) {
            return Arrays.stream(Role.values()).filter((role) -> 
                role.getKey() == key
            ).findAny().orElse(null);
        }
    }

    /**
     * Constructor without arguments, needed for springboot.
     */
    public User() {
    }

    /**
     * User constructor with arguments. Hashes the user password.
     * @param name The username
     * @param password The user password (plain text)
     * @throws InvalidPasswordException Thrown when the password is invalid and null
     * @throws InvalidUserNameException Thrown when username is empty
     * @throws NoSuchAlgorithmException Thrown when the hashing algorithm is not found
     * @throws InvalidKeySpecException  Thrown when the key generation fails
     */
    public User(String name, String password) throws InvalidPasswordException, InvalidUserNameException,
            NoSuchAlgorithmException, InvalidKeySpecException {
        if (name.isEmpty()) {
            throw new InvalidUserNameException("Name may not be empty!");
        } else if (password == null || password.isEmpty()) {
            throw new InvalidPasswordException("Password may not be empty!");
        }

        this.username = name;
        this.password = PasswordHash.hashPassword(password);
        this.userRole = Role.USER;
    }


    /**
     * User constructor with arguments. Hashes the user password.
     * @param name The username
     * @param password The user password (plain text)
     * @param userRole The role of the user
     * @throws InvalidPasswordException Thrown when the password is invalid and null
     * @throws InvalidUserNameException Thrown when username is empty
     * @throws NoSuchAlgorithmException Thrown when the hashing algorithm is not found
     * @throws InvalidKeySpecException  Thrown when the key generation fails
     * @see Role
     */
    public User(String name, String password, int userRole) throws InvalidPasswordException, InvalidUserNameException,
            NoSuchAlgorithmException, InvalidKeySpecException {

        if (name.isEmpty()) {
            throw new InvalidUserNameException("Name may not be empty!");
        } else if (password == null || password.isEmpty()) {
            throw new InvalidPasswordException("Password may not be empty!");
        }

        setUsername(name);
        setPassword(password);
        setUserRole(userRole);
    }


    public String getUsername() {
        return username;
    }

    /**
     * Sets the username.
     * @param username the username to set
     * @throws InvalidUserNameException Thrown when username is empty.
     */
    public void setUsername(String username) throws InvalidUserNameException {
        if (username != null) {
            this.username = username;
        } else {
            throw new InvalidUserNameException("Name may not be null.");
        }
    }


    public String getPassword() {
        return password;
    }

    /**
     * Sets the password.
     * @param password the new password
     * @throws InvalidPasswordException     Exception thrown if hashing of password failed.
     */
    public void setPassword(String password)
            throws InvalidPasswordException, NoSuchAlgorithmException, InvalidKeySpecException {
        if (password != null) {
            this.password = PasswordHash.hashPassword(password);
        } else {
            throw new InvalidPasswordException("Failed to secure password properly. User not created.");
        }
    }


    public void setUserId(Long userId) {
        this.userId = userId;
    }


    public Long getUserId() {
        return userId;
    }


    public void setUserRole(int role) {
        setUserRole(Role.fromKey(role));
    }

    public void setUserRole(Role role) {
        this.userRole = role;
    }

    
    public Role getUserRole() {
        return this.userRole;
    }

    /**
     * Converts the user attributes to string format.
     * @return The username and password in string format
     */
    @Override
    public String toString() {
        return String.format("Username: {%s} | Password: {%s}", this.username, this.password);
    }
}
