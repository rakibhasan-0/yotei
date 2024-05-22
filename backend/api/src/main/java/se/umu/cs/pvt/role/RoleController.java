package se.umu.cs.pvt.role;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import se.umu.cs.pvt.user.User;
import se.umu.cs.pvt.user.UserRepository;

import java.util.List;
import java.util.Optional;
/**
 * Main class for handling login information and transactions with the database.
 * @author Team Mango (2024-05-24)
 */
@RestController
@CrossOrigin
@RequestMapping(path = "/api/roles")
public class RoleController {
	
	/**
     * CRUDRepository makes connections with the api possible.
     */
	private final RoleRepository roleRepository;

    private final UserRepository userRepository;

    /**
     * Constructor for the LoginController object.
     * @param roleRepository Autowired
     */
    @Autowired
    public RoleController(RoleRepository roleRepository, UserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;

    }

    /**
     * (GET) Returns all the roles.
     * @return HTTP status code and body, where body could be a message or the roles.
     */
    @GetMapping("")
    public ResponseEntity<List<Role>> getRoles() {
        List<Role> result = roleRepository.findAll();
		
        if (result == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        } else if (result.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * (GET) Returns a specific role.
     *
     * @param roleId The id of the role to be returned.
     * @return Returned either HTTP-request or the role if it goes well.
     */
    @GetMapping("/{role_id}")
    public ResponseEntity<Role> getRole(@PathVariable("role_id") Long roleId) {

        if (roleId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Optional<Role> role = roleRepository.findById(roleId);
        if (role.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(role.get(), HttpStatus.OK);
    }

    /**
     * (GET) Returns all users with a specific role.
     * @param roleId The id of the role to get users that are returned.
     * @return A response with either the users with the role or an error message.
     */

    @GetMapping("/users/{role_id}")
    public ResponseEntity<List<User>> getUsersByRoleId(@PathVariable("role_id") Long roleId) {
        if (roleId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Optional<Role> role = roleRepository.findById(roleId);
        if (role.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<User> users = userRepository.findAllByRoleId(roleId);

        if (users.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(users, HttpStatus.OK);

    }

    /**
     * (POST) Method for creating a new role.
     * @param roleToAdd Body with role info to be added
     * @return A response with either the newly created role or an error message.
     */
    @PostMapping("")
    public ResponseEntity<Role> createNewRole(@RequestBody Role roleToAdd) {
        if (roleRepository.existsByRoleName(roleToAdd.getRoleName())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        roleRepository.save(roleToAdd);

        return new ResponseEntity<>(roleToAdd, HttpStatus.OK);
    }

    /**
     * Deletes a role by id.
     *
     * @param roleId the id of the role to delete.
     * @return response, 200 OK on success.
     */
    @DeleteMapping("/{role_id}")
    public ResponseEntity<Object> deleteRole(@PathVariable("role_id") Long roleId) {
        if (roleRepository.findById(roleId).isEmpty()) {
            return new ResponseEntity<>(
                "Role with ID: " + roleId +  "does not exist", HttpStatus.NOT_FOUND);

        } else if (userRepository.existsByRoleId(roleId)) {
            return new ResponseEntity<>("Cannot remove role that is assigned to a user", 
            HttpStatus.FORBIDDEN);
        }

        roleRepository.deleteById(roleId);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Edits a role.
     *
     * @param roleId The role to be updated/edited.
     * @param updatedRole The updated data.
     * @return ResponseEntity with the updated tag or an error message.
     */
    @PutMapping("/{role_id}")
    public ResponseEntity<Role> updateRole(
        @PathVariable("role_id") Long roleId, @RequestBody Role updatedRole) {
        
        Optional<Role> firstRole = roleRepository.findById(roleId);
        if (!firstRole.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Optional<Role> roleWithSameName = roleRepository
            .findByRoleName(updatedRole.getRoleName());

        if (nameTaken(roleId, roleWithSameName)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        } else if (roleWithSameName.isPresent()) {
            return new ResponseEntity<>(HttpStatus.OK);
        }

        Role roleToUpdate = firstRole.get();
        roleToUpdate.setRoleName(updatedRole.getRoleName());

        roleRepository.save(roleToUpdate);

        return new ResponseEntity<>(roleToUpdate, HttpStatus.OK);
    }

    private boolean nameTaken(Long roleId, Optional<Role> roleWithSameName) {
        return roleWithSameName.isPresent() && roleWithSameName.get().getRoleId() != roleId;
    }
}
