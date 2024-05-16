package se.umu.cs.pvt.search.interfaces;

import javax.persistence.Entity;
import javax.persistence.Column;
import javax.persistence.Id;
import java.io.Serializable;
import se.umu.cs.pvt.user.User.Role;

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

    @Column(nullable = false, name = "user_role")
    private String role;

    protected UserDBResult() {}

    public UserDBResult(Long userId, String name, String role) {
        this.userId = userId;
        this.name = name;
        this.role = role;
    }

    public Long getId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return Role.values()[Integer.parseInt(role)].toString();
    }
}
