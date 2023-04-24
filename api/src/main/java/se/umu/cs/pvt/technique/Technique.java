package se.umu.cs.pvt.technique;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Model for technique data in database
 */
@Entity
@Table(name = "technique")
public class Technique implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "technique_id")
    private Long id;

    @Column(nullable = false, name = "name")
    private String name;

    @Column(nullable = false, name = "description")
    private String description;

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected Technique() {}

    /**
     * Creates a technique
     * @param id id of technique
     * @param name name of technique
     * @param description of technique
     */
    public Technique(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Tells if a exercise has valid format.
     * @return true if exercise is valid, else false.
     */
    public boolean validFormat() {
        if (getName() == null || getName().length() == 0) {
            return false;
        }

        return true;
    }

    /**
     * Remove leading and trailing whitespaces.
     */
    public void trimText() {
        if (this.name != null) {
            this.name = name.trim();
        }

        if (this.description != null) {
            this.description = description.trim();
        }
    }
}