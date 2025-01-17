package se.umu.cs.pvt.permission;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * A mapping class representing permissions that a role has.
 * 
 * @author Team Mango (Grupp 4) - 2024-05-17
 */
@Entity
@Table(name = "role_to_permission")
public class RoleToPermission implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "rp_id")
    private Long rpId;

    @Column(nullable = false, name = "role_id")
    private Long roleId;

    @Column(nullable = false, name = "permission_id")
    private Long permissionId;

    protected RoleToPermission() {}

    public RoleToPermission(Long roleId, Long permissionId) {
        this.roleId = roleId;
        this.permissionId = permissionId;
    }

    public Long getRoleId() {
        return this.roleId;
    }

    public Long getPermissionId() {
        return this.permissionId;
    }
}
