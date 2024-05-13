package se.umu.cs.pvt.permission;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
        List<Permission> userPermissions = repository.findAllByUserId(userId);
        if (userPermissions == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        
        } else {
            for (Permission userPermission : userPermissions) {
                if (userPermission.equals(permission)) {
                    return new ResponseEntity<>(HttpStatus.OK);
                }
            }
        }
        
        UserToPermission userPermissionToAdd = new UserToPermission(
            userId ,permission.getPermissionId());

        repository.save(userPermissionToAdd);

        return new ResponseEntity<>(userPermissionToAdd, HttpStatus.OK);
    }

    /**
     * Deletes a user permission by user id and permission id.
     *
     * @param userId the id of the user with the permission to delete.
     * @param roleId the id of the permission to delete.
     * @return response, 200 OK on success.
     */
    @DeleteMapping("")
    public ResponseEntity<Object> deleteUserPermissionPair(
        @RequestBody Map<String, String> userPermissionToDelete) {
        Long userId = Long.parseLong(userPermissionToDelete.get("user_id"));
        Long permissionId = Long.parseLong(userPermissionToDelete.get("permission_id"));
        UserToPermission userToPermission = repository.findByUserIdAndPermissionId(
            userId, permissionId);

        if (userToPermission == null) {
            return new ResponseEntity<>(
                "User with ID: " + userId +  
                "does not have the permission with ID:" + permissionId + 
                ".", HttpStatus.BAD_REQUEST);
        }

        repository.deleteByUserIdAndPermissionId(userId, permissionId);
        
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
