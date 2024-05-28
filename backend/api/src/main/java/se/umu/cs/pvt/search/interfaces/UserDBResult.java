package se.umu.cs.pvt.search.interfaces;

import javax.persistence.Entity;
import javax.persistence.Column;
import javax.persistence.Id;
import java.io.Serializable;

/**
 * This entity represents the object returned
 * from the query sent to the database when
 * searching for users.
 * 
 * @author Chimera (Ludvig Larsson)
 */
@Entity
public class UserDBResult implements Serializable {
    @Id
    @Column(nullable = false, name = "user_id")
    private Long userId;

    @Column(nullable = false, name = "username")
    private String name;

    @Column(nullable = true, name = "role_id")
    private Long roleId;

    protected UserDBResult() {}

    public UserDBResult(Long userId, String name, Long roleId) {
        this.userId = userId;
        this.name = name;
        this.roleId = roleId;
    }

    public Long getId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public Long getRoleId() {
        return roleId;
    }
}
