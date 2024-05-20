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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import se.umu.cs.pvt.role.RoleRepository;

/**
 * RoleToPermission api for mapping permissions to roles.
 * 
 * @author Team Mango (Grupp 4) - 2024-05-16
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
     * 
     * @param roleId Id of the role to fetch permission from
     * @return The list of permissions or an error code
     */
    @GetMapping("/{role_id}")
    public ResponseEntity<List<Permission>> getAllPermissionsForRoleWithId(
        @PathVariable(name = "role_id") Long roleId) {
        if (roleRepository.findById(roleId).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<RoleToPermission> roleToPermissions = roleToPermissionRepository
            .findAllByRoleId(roleId);

        List<Permission> result = findPermissions(roleToPermissions);

        if (result.isEmpty()) {
            return new ResponseEntity<>(result, HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    private List<Permission> findPermissions(List<RoleToPermission> roleToPermissions) {
        List<Permission> permissions = new ArrayList<>();

        for (RoleToPermission roleToPermission : roleToPermissions) {
            Optional<Permission> permission = permissionRepository.findById(
                roleToPermission.getPermissionId());

            if (permission.isPresent()) {
                permissions.add(permission.get());
            }
        }

        return permissions;
    }

    /**
     * (POST) Method for creating a new pair, i.e adding a permission to a role.
     * 
     * @param roleId Id of the role to add a new permission for
     * @param permissionId Id of the permission to add for the role
     * @return The role_to_permission pair, or an error code
     */
    @PostMapping("/{role_id}/add/{permission_id}")
    public ResponseEntity<RoleToPermission> addPermissionToRole(
        @PathVariable(name = "role_id") Long roleId, 
        @PathVariable(name = "permission_id") Long permissionId) {

        if (roleRepository.findById(roleId).isEmpty() || 
            permissionRepository.findById(permissionId).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        // Returns an OK code if the pair already exists
        if (roleToPermissionRepository.findByRoleIdAndPermissionId(
            roleId, permissionId) != null) {
            return new ResponseEntity<>(HttpStatus.OK);
        }

        RoleToPermission newPair = new RoleToPermission(roleId, permissionId);

        RoleToPermission result = roleToPermissionRepository.save(newPair);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * (POST) Method for creating a set of new role permission pairs. If the role
     * or ANY of the permissions doesnt exist, then BAD_REQUEST (400) will be 
     * returned.
     * 
     * @param roleId Id of the role to add new permissions
     * @param permissionIds List of permissions to add for the role
     * @return List of user permission pairs added to the role, or an 
     * error code.
     */
    @PostMapping("/{role_id}/add/permissions")
    public ResponseEntity<List<RoleToPermission>> addPermissionsToRole(
        @PathVariable(name = "role_id") Long roleId,
        @RequestParam List<Long> permissionIds) {

        if (!roleAndPermissionExists(roleId, permissionIds)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        List<RoleToPermission> result = addPermissions(roleId, permissionIds);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * (PUT) Method for editing an existing roles permissions. If the role
     * or ANY of the permissions doesnt exist, then BAD_REQUEST (400) will be 
     * returned. BAD_REQUEST will also be returned if a permission was not 
     * able to be deleted.
     * 
     * @param roleId Id of the role to edit permissions
     * @param newPermissionIds List of new permissions to override the roles
     * current permissions
     * @return List of new user permission pairs added to the role, or an 
     * error code.
     */
    @PutMapping("/{role_id}/edit/permissions")
    public ResponseEntity<List<RoleToPermission>> editRolePermissions(
        @PathVariable(name = "role_id") Long roleId,
        @RequestParam List<Long> newPermissionIds) {

        if (!roleAndPermissionExists(roleId, newPermissionIds)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<Permission> oldPermissions = getAllPermissionsForRoleWithId(
            roleId).getBody();
        try {
            deleteDifferenceInPermissions(roleId, oldPermissions, newPermissionIds);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        List<RoleToPermission> result = addPermissions(roleId, newPermissionIds);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * (DELETE) Method for removing a permission from a role
     * @param roleToPermissionToDelete A body containing a "role_id" and "permission_id" of the pair to remove
     * @return The removed pair or an error message.
     */
    @DeleteMapping("/{role_id}/delete/{permission_id}")
    public ResponseEntity<Object> deletePairFromRoleIdAndPermissionId(
        @PathVariable(name = "role_id") Long roleId, 
        @PathVariable(name = "permission_id") Long permissionId) {
            
        if (!rolePermissisonPairExists(roleId, permissionId)) {
                return new ResponseEntity<>(
                    "Role with id " + roleId + " does not have permission with id " + 
                    permissionId + ".", HttpStatus.BAD_REQUEST);
        }
        
        try {
            roleToPermissionRepository.deleteByRoleIdAndPermissionId(roleId, permissionId);
        } catch (Exception e) {
            return new ResponseEntity<>("Unable to remove permission from role", HttpStatus.BAD_REQUEST);
        }

        Map<String, Long> roleToPermissionToDelete = new HashMap<>();
        roleToPermissionToDelete.put("role_id", roleId);
        roleToPermissionToDelete.put("permission_id", permissionId);

        return new ResponseEntity<>(roleToPermissionToDelete, HttpStatus.OK);
    }

    private List<RoleToPermission> addPermissions(Long roleId, List<Long> permissionIds) {
        List<RoleToPermission> rolePermissionPairs = new ArrayList<>();
    
        for (Long permissionId : permissionIds) {
            if (!rolePermissisonPairExists(roleId, permissionId)) {
                RoleToPermission newPair = new RoleToPermission(roleId, permissionId);
                RoleToPermission result = roleToPermissionRepository.save(newPair);
                rolePermissionPairs.add(result);
            }
        }

        return rolePermissionPairs;
    }

    private void deleteDifferenceInPermissions(Long roleId, List<Permission> oldPermissions, List<Long> newPermissionIds) throws Exception {
        for (Permission oldPermission : oldPermissions) {
            Long oldPermissionId = oldPermission.getPermissionId();

            if (!newPermissionIds.contains(oldPermissionId)) {
                try {
                    roleToPermissionRepository.deleteByRoleIdAndPermissionId(
                    roleId, oldPermissionId);
                } catch (Exception e) {
                    throw e;
                }
            }
        }
    }

    private boolean rolePermissisonPairExists(Long roleId, Long permissionId) {
        return roleToPermissionRepository.findByRoleIdAndPermissionId(
            roleId, permissionId) != null;
    }

    private boolean roleAndPermissionExists(Long roleId, List<Long> permissionIds) {
        for (Long permissionId : permissionIds) {
            if (permissionRepository.findById(permissionId).isEmpty()) {
                return false;
            }
        }
        
        if (roleRepository.findById(roleId).isEmpty()) {
            return false;
        }

        return true;
    }
}