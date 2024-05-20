package se.umu.cs.pvt.permission;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
/**
 * Repository for the UserPermissionRepository class enabling simple CRUD methods
 * 
 * @author Team Mango (Grupp 4) - 2024-05-16
 */
@Repository
public interface UserToPermissionRepository extends JpaRepository<UserToPermission, Long>{
	/**
     * Finds all user permission pairs for a specific user.
     *
     * @param userId      	ID of the User.
     * @return				List of permissions IDs.
     */
    List<UserToPermission> findAllByUserId(Long userId);

    /**
     * Finds a user permission pair for a specific user.
     *
     * @param userId      	ID of the User.
     * @param permissionId  ID of the permission.
     * @return				List of permissions IDs.
     */
    UserToPermission findByUserIdAndPermissionId(Long userId, Long permissionId);

    /**
     * Deletes a User Permission pair for a specific user.
     *
     * @param userId          The Id of the User.
     * @param permissionId    The Id of the permission.
     */
    @Transactional
    void deleteByUserIdAndPermissionId(Long userId, Long permissionId);

}
