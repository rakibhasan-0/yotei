package se.umu.cs.pvt.user;

import javax.persistence.*;

import java.io.Serializable;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Arrays;

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
 * @author Team Mango (Grupp 4) - 2024-05-16
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
     * Foreign key pointing to the role table
     */
    @Column(nullable = true, name = "role_id")
    private Long roleId;

    /**
     * Constructor without arguments, needed for springboot.
     */
    public User() {
    }
    
    /**
     * User constructor with arguments. Hashes the user password.
     * The users role will be set to null (i.e. they will have no role)
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
        this.roleId = null;
    }

    /**
     * User constructor with arguments. Hashes the user password.
     * @param name The username
     * @param password The user password (plain text)
     * @param roleId The id of the role to give the user
     * @throws InvalidPasswordException Thrown when the password is invalid and null
     * @throws InvalidUserNameException Thrown when username is empty
     * @throws NoSuchAlgorithmException Thrown when the hashing algorithm is not found
     * @throws InvalidKeySpecException  Thrown when the key generation fails
     * @see Role
     */
    public User(String name, String password, Long roleId) throws InvalidPasswordException, InvalidUserNameException,
            NoSuchAlgorithmException, InvalidKeySpecException {

        if (name.isEmpty()) {
            throw new InvalidUserNameException("Name may not be empty!");
        } else if (password == null || password.isEmpty()) {
            throw new InvalidPasswordException("Password may not be empty!");
        }

        setUsername(name);
        setPassword(password);
        setRoleId(roleId);
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

    public void setRoleId(Long id) {
        this.roleId = id;
    }

    public Long getRoleId() {
        return this.roleId;
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
