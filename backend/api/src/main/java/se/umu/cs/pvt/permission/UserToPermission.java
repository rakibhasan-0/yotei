package se.umu.cs.pvt.permission;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * A role class representing permissions that a users can have.
 * 
 * @author Team Mango (Grupp 4) - 2024-05-13
 */
@Entity
@Table(name = "user_to_permission")
public class UserToPermission implements Serializable {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "pair_id")
    private Long pairId;

    @Column(nullable = false, name = "user_id")
    private Long userId;

    @Column(nullable = false, name = "permission_id")
	private Long permissionId;

	/**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected UserToPermission() {}

	protected UserToPermission(Long userId, Long permissionId) {
        this.userId = userId;
        this.permissionId = permissionId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setPermissionId(Long permissionId) {
        this.permissionId = permissionId;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getPermissionId() {
        return permissionId;
    }
}
