package se.umu.cs.pvt.permission;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import se.umu.cs.pvt.user.UserRepository;

/**
 * UserToPermissionController API for mapping permissions to users.
 * @author Team Mango (2024-05-17)
 */

@RestController
@CrossOrigin
@RequestMapping(path = "/api/permissions/user")
public class UserToPermissionController {
	
	/**
     * CRUDRepository makes connections with the api possible.
     */
	private final UserToPermissionRepository userToPermissionRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;

    @Autowired
    public UserToPermissionController(UserToPermissionRepository userToPermissionRepository,
        PermissionRepository permissionRepository, 
        UserRepository userRepository) {

        this.userToPermissionRepository = userToPermissionRepository;
        this.permissionRepository = permissionRepository;
        this.userRepository = userRepository;
    }

    /**
     * (GET) Returns all the permissions of a user.
     * @return HTTP status code and body, where body could be a message or the permissions.
     */
    @GetMapping("/{user_id}")
	public ResponseEntity<List<Permission>> getUserPermissions(
        @PathVariable("user_id") Long userId) {
            
        if (userRepository.findById(userId).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<UserToPermission> userToPermissions = userToPermissionRepository
            .findAllByUserId(userId);

        List<Permission> result = findPermissions(userToPermissions);

        if (result == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        } else if (result.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
	}

    private List<Permission> findPermissions(List<UserToPermission> userToPermissions) {
    List<Permission> permissions = new ArrayList<>();

    for (UserToPermission userToPermission : userToPermissions) {
        Optional<Permission> permission = permissionRepository.findById(
            userToPermission.getPermissionId());

        if (permission.isPresent()) {
            permissions.add(permission.get());
        }
    }

        return permissions;
    }

    /**
     * (POST) Method for creating/adding new permissions for a user.
     * @param userId Id of the user.
     * @param permissionId Id of the permission.
     * @return A response with either the newly created user permission or an error message.
     */
    @PostMapping("/{user_id}/add/{permission_id}")
    public ResponseEntity<UserToPermission> postUserPermissionPair(
        @PathVariable("user_id") Long userId,
        @PathVariable(name = "permission_id") Long permissionId) {
        
        if (userRepository.findById(userId).isEmpty() || 
            permissionRepository.findById(permissionId).isEmpty()) {

            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Returns an OK code if the pair already exists
        if (userToPermissionRepository.findByUserIdAndPermissionId(
            userId, permissionId) != null) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        
        UserToPermission newPair = new UserToPermission(
            userId, permissionId);

        UserToPermission result = userToPermissionRepository.save(newPair);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * Deletes a user permission pair by user id and permission id.
     *
     * @param userId the id of the user with the permission to delete.
     * @param roleId the id of the permission to delete.
     * @return response, 200 OK on success.
     */
    @DeleteMapping("/{user_id}/delete/{permission_id}")
    public ResponseEntity<Object> deleteUserPermissionPair(
        @PathVariable(name = "user_id") Long userId, 
        @PathVariable(name = "permission_id") Long permissionId){

        UserToPermission userToPermission = userToPermissionRepository
            .findByUserIdAndPermissionId(userId, permissionId);

        if (userToPermission == null) {
            return new ResponseEntity<>(
                "User with ID: " + userId +  
                " does not have the permission with ID: " + permissionId + 
                ".", HttpStatus.BAD_REQUEST);
        }

        userToPermissionRepository.deleteByUserIdAndPermissionId(userId, permissionId);

        Map<String, Long> map = new HashMap<>();
        map.put("user_id", userId);
        map.put("permission_id", permissionId);
        
        return new ResponseEntity<>(map ,HttpStatus.OK);
    }
}
