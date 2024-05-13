package se.umu.cs.pvt.permission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Interface for role_to_permission table
 *
 * @author Team Mango (Grupp 4) - 2024-05-13
 */
@Repository
public interface RoleToPermissionRepository extends JpaRepository<RoleToPermission, Long> {
    /**
     * Find all permissions belonging to a single role
     * @param roleId The id of the role
     * @return All permissions of said role
     */
    List<Permission> findAllByRoleId(Long roleId);

    /**
     * Remove a permission from a role.
     * @param roleId The role to remove from
     * @param permissionId The permission to remove
     */
    void deleteByRoleIdAndPermissionId(Long roleId, Long permissionId);

    /**
     * Checks if a pair of roleid and permissionid exists
     * @param roleId
     * @param permissionId
     * @return
     */
    List<Permission> findByRoleIdAndPermissionId(Long roleId, Long permissionId);
}
