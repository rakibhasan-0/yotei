package se.umu.cs.pvt.role;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * A role class representing roles that users can have.
 * 
 * @author Team Mango (Grupp 4) - 2024-05-20
 */
@Entity
@Table(name = "role")
public class Role implements Serializable{
    
    /**
     * The id for the role
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "role_id")
    private Long roleId;

    /**
     * The name for the role.
     */
    @Column(nullable = false, name = "role_name")
    private String roleName;

    /**
     * Constructor without arguments, needed for springboot.
     */
    public Role() {
    }

    /**
     * Creates a role using arguments
     * 
     * @param name The role name
     * @throws InvalidRoleNameException Thrown when role_name is empty
     */
    public Role(String name) throws InvalidRoleNameException {
        if (name.isEmpty()) {
            throw new InvalidRoleNameException("Role name can not be empty!");
        }

        this.roleName = name;
    }

    public Long getRoleId() {
        return this.roleId;
    }

    public void setRoleName(String name) {
        this.roleName = name;
    }

    public String getRoleName() {
        return this.roleName;
    }

    @Override
    public String toString() {
        return String.format("Role name: {%s}", roleName);
    }
}
