package se.umu.cs.pvt.permission;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
/**
 * Repository for the UserPermissionRepository class enabling simple CRUD methods
 * 
 * @author Team Mango (Grupp 4) - 2024-05-08
 */
@Repository
public interface UserPermissionRepository extends JpaRepository<UserPermission, Long>{
	/**
     * Finds all permissions for a specific user.
     *
     * @param userId      	ID of the User.
     * @return				List of permissions IDs.
     */
    List<UserPermission> findAllByUserId(Long userId);

    /**
     * Deletes a User Permission pair.
     *
     * @param userId          The Id of the User.
     * @param permissionId    The Id of the permission.
     */
    void deleteByUserIdAndPermissionId(Long userId, Long permissionId);

}
