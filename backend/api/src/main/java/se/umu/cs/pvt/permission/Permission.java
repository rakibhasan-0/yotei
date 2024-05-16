package se.umu.cs.pvt.permission;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * A permission class representing permissions that users and roles can have.
 * 
 * @author Team Mango (Grupp 4) - 2024-05-15
 */
@Entity
@Table(name = "permission")
public class Permission implements Serializable{
    
    /**
     * The id for the role
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "permission_id")
    private Long permission_id;

    /**
     * The name for the permission.
     */
    @Column(nullable = false, name = "permission_name")
    private String permission_name;

    /**
     * The description for the permission.
     */
    @Column(nullable = false, name = "permission_desc")
    private String permission_desc;

    /**
     * Constructor without arguments, needed for springboot.
     */
    public Permission() {
    }

    /**
     * Creates a role using arguments
     * 
     * @param name The permission name
     * @param desc The permission description
     * @throws InvalidPermissionNameException Thrown when name is empty
     */
    public Permission(String name, String desc) throws InvalidPermissionNameException {
        if (name.isEmpty()) {
            throw new InvalidPermissionNameException("Permission name can not be empty!");
        }

        this.permission_name = name;
        this.permission_desc = desc;
    }

    public Long getPermissionId() {
        return this.permission_id;
    }
    
    // Used for testing
    public void setPermissionId(Long newId) {
        this.permission_id = newId;
    }

    public void setPermissionName(String name) {
        this.permission_name = name;
    }

    public String getPermissionName() {
        return this.permission_name;
    }

    public void setPermissinDescription(String desc) {
        this.permission_desc = desc;
    }

    public String getPermissionDescription() {
        return this.permission_desc;
    }

    @Override
    public String toString() {
        return String.format("Permission name: {%s}, description: {%s}", permission_name, permission_desc);
    }
}
