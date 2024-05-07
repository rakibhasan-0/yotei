package se.umu.cs.pvt.roles;

import java.io.Serializable;
import java.util.concurrent.ExecutionException;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * A role class representing roles that users can have.
 * 
 * @author Team Mango (Grupp 4) - 2024-05-07
 */
@Entity
@Table(name = "roles")
public class Role implements Serializable{
    
    /**
     * The id for the role
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "role_id")
    private Long role_id;

    /**
     * The name for the role.
     */
    @Column(nullable = false, name = "username")
    private String role_name;

    /**
     * Constructor without arguments, needed for springboot.
     */
    public Role() {
    }

    // TODO: create custom exception(s)
    public Role(String name) throws Exception {
        if (name.isEmpty()) {
            throw new Exception("Can't be empty");
        }

        this.role_name = name;
    }

    public void setRoleName(String name) {
        this.role_name = name;
    }

    public String getRoleName() {
        return this.role_name;
    }

    @Override
    public String toString() {
        return String.format("Role name: {%s}", role_name);
    }
}
