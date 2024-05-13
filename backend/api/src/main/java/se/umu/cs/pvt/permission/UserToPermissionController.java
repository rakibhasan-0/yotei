package se.umu.cs.pvt.permission;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Main class for handling login information and transactions with the database.
 * @author Team Mango (2024-05-13)
 */

@RestController
@CrossOrigin
@RequestMapping(path = "/api/permissions/user")
public class UserToPermissionController {
	
	/**
     * CRUDRepository makes connections with the api possible.
     */
	private final UserToPermissionRepository repository;

	/**
     * Constructor for the LoginController object.
     * @param repository Autowired
     */
    @Autowired
    public UserToPermissionController(UserToPermissionRepository repository) {
        this.repository = repository;

    }

    /**
     * (GET) Returns all the permissions of a user.
     * @return HTTP status code and body, where body could be a message or the permissions.
     */
    @GetMapping("/{user_id}")
	public ResponseEntity<List<Permission>> getUserPermissions(
        @PathVariable("user_id") Long userId) {
		List<Permission> result = repository.findAllByUserId(userId);
        
        if (result == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        } else if (result.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
	}

    /**
     * (POST) Method for creating/adding new permissions for a user.
     * @param roleToAdd Body with permission info to be added to user.
     * @return A response with either the newly created user permission or an error message.
     */
    @PostMapping("/{user_id}/permission")
    public ResponseEntity<UserToPermission> postUserPermissionPair(
        @RequestBody Permission permission, @PathVariable("user_id") Long userId) {
            if (repository.findAllByUserId(userId) == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            UserToPermission userPermissionToAdd = new UserToPermission(permission.get)

            repository.save()
        }
}
