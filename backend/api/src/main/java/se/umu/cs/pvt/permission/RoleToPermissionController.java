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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import se.umu.cs.pvt.role.RoleRepository;

/**
 * RoleToPermission api for mapping permissions to roles.
 * 
 * @author Team Mango (Grupp 4) - 2024-05-15
 */
@RestController
@CrossOrigin
@RequestMapping("/api/permissions/role")
public class RoleToPermissionController {

    private final RoleToPermissionRepository roleToPermissionRepository;
    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public RoleToPermissionController(RoleToPermissionRepository roleToPermissionRepository, PermissionRepository permissionRepository, RoleRepository roleRepository) {
        this.roleToPermissionRepository = roleToPermissionRepository;
        this.permissionRepository = permissionRepository;
        this.roleRepository = roleRepository;
    }

    /**
     * (GET) Method for getting all permissions that belong to a single role
     * A BAD_REQUEST status code will be returned when the role_id doesn't exist and a
     * NO_CONTENT status code will be sent if the role has no permissions.
     * @param roleId
     * @return The list of permissions or an error code.
     */
    @GetMapping("/{role_id}")
    public ResponseEntity<List<Permission>> getAllPermissionsForRoleWithId(@PathVariable(name = "role_id") Long roleId) {

        if (roleRepository.findById(roleId).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<Permission> result = roleToPermissionRepository.findAllByRoleId(roleId);

        if (result.isEmpty()) {
            return new ResponseEntity<>(result, HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * (POST) Method for creating a new pair, i.e adding a permission to a role.
     * @param roleToPermissionToAdd
     * @return The role_to_permission pair, or an error code
     */
    @PostMapping("/add")
    public ResponseEntity<RoleToPermission> addPermissionToRole(@RequestBody Map<String, Long> roleToPermissionToAdd) {
        Long role_id = roleToPermissionToAdd.get("role_id");
        Long permission_id = roleToPermissionToAdd.get("permission_id");

        if (roleRepository.findById(role_id).isEmpty() || permissionRepository.findById(permission_id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        // Returns an OK code if the pair already exists
        if (roleToPermissionRepository.findByRoleIdAndPermissionId(role_id, permission_id) != null) {
            return new ResponseEntity<>(HttpStatus.OK);
        }

        RoleToPermission newPair = new RoleToPermission(role_id, permission_id);

        RoleToPermission result = roleToPermissionRepository.save(newPair);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * (DELETE) Method for removing a permission from a role
     * @param roleToPermissionToDelete A body containing a "role_id" and "permission_id" of the pair to remove
     * @return The removed pair or an error message.
     */
    @DeleteMapping("")
    public ResponseEntity<Object> deletePairFromRoleIdAndPermissionId(@RequestBody Map<String, Long> roleToPermissionToDelete) {
        Long role_id = roleToPermissionToDelete.get("role_id");
        Long permission_id = roleToPermissionToDelete.get("permission_id");

        if (roleToPermissionRepository.findByRoleIdAndPermissionId(role_id, permission_id) == null) {
            return new ResponseEntity<>("Role with id " + role_id + " does not have permission with id " + permission_id + ".", HttpStatus.BAD_REQUEST);
        }

        roleToPermissionRepository.deleteByRoleIdAndPermissionId(role_id, permission_id);
        return new ResponseEntity<>(roleToPermissionToDelete, HttpStatus.OK);
    }
}