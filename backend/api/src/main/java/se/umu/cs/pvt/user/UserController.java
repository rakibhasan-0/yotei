package se.umu.cs.pvt.user;

import com.auth0.jwt.interfaces.Claim;

import se.umu.cs.pvt.role.Role;
import se.umu.cs.pvt.role.RoleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Main class for handling login information and transactions with the database.
 * @author Team Hot-Pepper (G7), Quattro formaggio (G1), Chimera (G4) c20lln dv21oby, Griffin (G2) c17wfn
 */
@RestController
@CrossOrigin
@RequestMapping(path = "/api/users")
public class UserController {

    /**
     * CRUDRepository makes connections with the api possible.
     */
    private final UserRepository repository;
    private final RoleRepository roleRepository;

    /**
     * Constructor for the LoginController object.
     * @param repository Autowired
     */
    @Autowired
    public UserController(UserRepository repository, RoleRepository roleRepository) {
        this.repository = repository;
        this.roleRepository = roleRepository;
    }

    /**
     * (POST) Method for login verification.
     * @param body HTTP body of information
     * @return HTTP status code and body.
     */
    @PostMapping("/verify")
    public Object userVerification(@RequestBody Map<String, String> body) {
        if (body.get("username").isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        }

        if (body.get("password").isEmpty()) {
            System.err.println("empty password");
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        }

        Optional<User> response = repository.findUserByUsernameIgnoreCase(body.get("username"));

        if (response.isEmpty()) {
            System.err.println("invalid username");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        User user = response.get();

        try {
            if (!PasswordHash.validatePassword(body.get("password"), user.getPassword())) {
                System.err.println("invalid password");
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            System.err.println("internal error");
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new JWTUtil().generateToken(user.getUsername(), user.getUserRole().toString(), Math.toIntExact(user.getUserId()));
    }

    /**
     * (PUT) Method for updating the username for a user
     * @param body HTTP body of information 
     * @return HTTP status code and body, where body could be a message or the user.
     */
    @PutMapping("/name")
    public ResponseEntity<Object> updateUsername(@RequestBody Map<String, String> body) {
        //HTTP input
        if (body.get("id").isEmpty()) {
            return new ResponseEntity<>("Inget id hittat.",HttpStatus.NOT_ACCEPTABLE);
        }

        if (body.get("newUsername").isEmpty()) {
            return new ResponseEntity<>("Fyll i ett nytt användarnamn.",HttpStatus.NOT_ACCEPTABLE);
        }
        if (body.get("password").isEmpty()) {
            return new ResponseEntity<>("Fyll i lösenord.",HttpStatus.NOT_ACCEPTABLE);
        }
        //Check if username already exists
        if (repository.findUserByUsernameIgnoreCase(body.get("newUsername")).isPresent()) {
            return new ResponseEntity<>("Användarnamnet " + body.get("newUsername") + " finns redan.",HttpStatus.NOT_ACCEPTABLE);
        }

        Optional<User> userToBeUpdated = repository.findById(Long.valueOf(body.get("id")));

        if (userToBeUpdated.isEmpty()) {
            return new ResponseEntity<>("Hittade ingen användare med ditt id.",HttpStatus.BAD_REQUEST);
        }

        try {
            userToBeUpdated.get().setUsername(body.get("newUsername"));

            if(!PasswordHash.validatePassword(body.get("password"), userToBeUpdated.get().getPassword())) {
                return new ResponseEntity<>("Lösenordet stämmer inte.",HttpStatus.BAD_REQUEST);
            }
        } catch (InvalidUserNameException e) { 
            return new ResponseEntity<>("Fel vid sparandet av användarnamnet.",HttpStatus.NOT_ACCEPTABLE);
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            return new ResponseEntity<>("Fel vid verifiering av lösenordet.",HttpStatus.BAD_REQUEST);
        }

        // save to db
        try {
            repository.save(userToBeUpdated.get());
        } catch (Exception e) {
            return new ResponseEntity<>("Kunde inte spara nytt användarnamn till databasen", HttpStatus.NOT_ACCEPTABLE);
        }
        return new ResponseEntity<>(userToBeUpdated.get(), HttpStatus.OK);
    }

    /**
     * (GET) Returns all the users, not including password.
     * @return HTTP status code and body, where body could be a message or the users.
     */
    @GetMapping("")
    @ResponseBody
    public Object getUsers() {
        List<UserShort> result = repository.findAllProjectedBy();
        if (result == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return result;
    }

    /**
     * (GET) Returns a specific user.
     *
     * @param username The username to be returned.
     * @return Returned either HTTP-request or the user if it goes well.
     */
    @GetMapping("/{name}")
    public Object getUser(@PathVariable("name") String username) {

        if (username == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return repository.findUserByUsernameIgnoreCase(username);
    }

    /**
     * (POST) Makes a new user and saves it to the database.
     * @return HTTP status.
     */
    @PostMapping("")
    public Object registerUser(@RequestBody User user) {
        if(user.getUsername().isEmpty()) {
            return new ResponseEntity<>("Inget användarnamn angivet", HttpStatus.NOT_ACCEPTABLE);
        }
        if(user.getPassword().isEmpty()) {
            return new ResponseEntity<>("Inget lösenord angivet", HttpStatus.NOT_ACCEPTABLE);
        }
        if(repository.findUserByUsernameIgnoreCase(user.getUsername()).isPresent()) {
            return new ResponseEntity<>("Användarnamnet används redan", HttpStatus.NOT_ACCEPTABLE);
        }
        if(user.getUserRole() == null) {
            return new ResponseEntity<>("Användaren måste ha en roll", HttpStatus.NOT_ACCEPTABLE);
        }

        try {
            User saved = repository.save(user);
            return new ResponseEntity<>(saved, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Kunde inte spara användare i databasen", HttpStatus.NOT_ACCEPTABLE);
        }
    }

    /**
     * (GET) Gets the Username by an id. User ID must be greater than or equal to zero.
     * @param id The ID of the user to get the username for.
     * @return BAD_REQUEST if userId is null or less than zero.
     */
    @GetMapping("/{id}/name")
    public Object getUsername(@PathVariable("id") Long userId){
        if (userId == null || userId < 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return repository.findById(userId);
    }

    /**
     * (PUT) Refreshes the JWT-Token from a previous JWT-Token.
     * @param token The current JWT-Token.
     * @return The previous JWT-token.
     */
    @PostMapping("/refresh")
    public Object refreshToken(@RequestBody String token){
        Map<String, Claim> oldToken = new JWTUtil().validateToken(token).getClaims();

        return new JWTUtil().generateToken(oldToken.get("username").asString(), oldToken.get("role").asString(), oldToken.get("userId").asInt());
    }

    /**
     * (PUT) Updates the password of a user.
     * @param body HTTP body of information
     * @return HTTP status code and body, where body could be a message or the user.
     */
    @PutMapping("/password")
    public ResponseEntity<Object> updatePassword(@RequestBody Map<String, String> body) {
        //HTTP input

        // Check if all fields are filled in
        if (body.get("newPassword").isEmpty() || body.get("verifyNewPassword").isEmpty() || body.get("oldPassword").isEmpty()) {
            return new ResponseEntity<>("Fyll i alla fält.",HttpStatus.BAD_REQUEST);
        }
        // Check for id
        if (body.get("id").isEmpty()) {
            return new ResponseEntity<>("Inget id medskickat",HttpStatus.BAD_REQUEST);
        }
        // Make sure newPassword and verifyNewPassword are equal
        if (!body.get("newPassword").equals(body.get("verifyNewPassword"))) {
            return new ResponseEntity<>("Nya lösenorden överrenstämmer ej.",HttpStatus.BAD_REQUEST);
        }

        // Find current user
        Optional<User> userToBeUpdated = repository.findById(Long.valueOf(body.get("id")));

        // Check if a user was found
        if (userToBeUpdated.isEmpty()) {
            return new ResponseEntity<>("Hittade ingen användare med ditt id.",HttpStatus.BAD_REQUEST);
        }

        // Verify old password then set the new password to the user
        try {
            if(!PasswordHash.validatePassword(body.get("oldPassword"), userToBeUpdated.get().getPassword())) {
                return new ResponseEntity<>("Gamla lösenordet stämmer ej.",HttpStatus.BAD_REQUEST);
            }
            userToBeUpdated.get().setPassword(body.get("newPassword"));
        }  catch (NoSuchAlgorithmException | InvalidKeySpecException | InvalidPasswordException e) {
            return new ResponseEntity<>("Internt fel vid ändring av lösenordet.",HttpStatus.BAD_REQUEST);
        }

        // save updated user to database
        try {
            repository.save(userToBeUpdated.get());
        } catch (Exception e) {
            return new ResponseEntity<>("Kunde inte spara nytt lösenord till databasen", HttpStatus.NOT_ACCEPTABLE);
        }

        return new ResponseEntity<>(userToBeUpdated.get(), HttpStatus.OK);
    }

    /**
     * (DELETE) Removes user.
     * @param id The id of the user to remove
     * @return HTTP status.
     */
    @DeleteMapping("/{id}")
    public Object removeUser(@PathVariable("id") Long id) {
        Optional<User> possibleUser = repository.findById(id);
        if (possibleUser.isEmpty()) {
            return new ResponseEntity<>("Användaren finns inte", HttpStatus.BAD_REQUEST);
        }
        User user = possibleUser.get();

        try {
            repository.delete(user);
        } catch (Exception e) {
            return new ResponseEntity<>("Gick inte att ta bort användaren", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * (PUT) Changes the role of the given user.
     * @param uid the id of the user to update
     * @param rid the id of the role to change to
     * @return HTTP status.
     */
    @PostMapping("/{uid}/role/{rid}")
    public Object changeRoleUser(@PathVariable("uid") Long id, @PathVariable("rid") int roleId) {
        Optional<User> possibleUser = repository.findById(id);
        if (possibleUser.isEmpty()) {
            return new ResponseEntity<>("Användaren finns inte", HttpStatus.BAD_REQUEST);
        }
        User user = possibleUser.get();
        user.setUserRole(roleId);

        try {
            repository.save(user);
        } catch (Exception e) {
            return new ResponseEntity<>("Gick inte att ändra roll på användaren", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }


    @PostMapping("/{user_id}/setrole/{role_id}")
    public Object setUserRoleThroughId(@PathVariable("user_id") Long id, @PathVariable("role_id") int roleId) {
        Optional<User> possibleUser = repository.findById(id);
        if (possibleUser.isEmpty()) {
            return new ResponseEntity<>("Användaren finns inte", HttpStatus.BAD_REQUEST);
        }

        Optional<Role> possibleRole = roleRepository.findById(Long.valueOf(roleId));
        if (possibleRole.isEmpty()) {
            return new ResponseEntity<>("Rollen finns inte", HttpStatus.BAD_REQUEST);
        }

        User user = possibleUser.get();
        user.setRoleId(Long.valueOf(roleId));

        try {
            repository.save(user);
        } catch (Exception e) {
            return new ResponseEntity<>("Gick inte att ändra roll ID på användaren", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
