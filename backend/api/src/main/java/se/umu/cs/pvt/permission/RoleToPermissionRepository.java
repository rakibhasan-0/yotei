package se.umu.cs.pvt.permission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Interface for role_to_permission table
 *
 * @author Team Mango (Grupp 4) - 2024-05-16
 */
@Repository
public interface RoleToPermissionRepository extends JpaRepository<RoleToPermission, Long> {
    /**
     * Find all role permission pairs belonging to a single role
     * @param roleId The id of the role
     * @return All role permission pairs of said role
     */
    List<RoleToPermission> findAllByRoleId(Long roleId);

    /**
     * Remove a permission from a role.
     * @param roleId The role to remove from
     * @param permissionId The permission to remove
     */
    @Transactional
    void deleteByRoleIdAndPermissionId(Long roleId, Long permissionId);

    /**
     * Finds a role permission pair from the roleid and permissionid.
     * @param roleId The id of the role
     * @param permissionId The id of the permission
     * @return The role permission pair.
     */
    RoleToPermission findByRoleIdAndPermissionId(Long roleId, Long permissionId);
}
