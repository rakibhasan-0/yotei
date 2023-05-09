package se.umu.cs.pvt.technique;

import se.umu.cs.pvt.belt.Belt;
import se.umu.cs.pvt.tag.Tag;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

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

    @ManyToMany()
    @JoinTable(
            name = "technique_to_belt",
            joinColumns = @JoinColumn(name = "technique_id"),
            inverseJoinColumns = @JoinColumn(name = "belt_id")
    )
    private Set<Belt> belts;

    @ManyToMany()
    @JoinTable(
            name = "technique_tag",
            joinColumns = @JoinColumn(name = "tech_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags;

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     * However, we still need an ID for JPA to correctly refresh
     * any many-to-many relationship for some reason.
     */
    protected Technique() {
        this.id = 0L;
    }

    /**
     * Creates a technique
     * @param id id of technique
     * @param name name of technique
     * @param description of technique
     */
    public Technique(Long id, String name, String description, Set<Belt> belts, Set<Tag> tags) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.belts = belts;
        this.tags = tags;

        this.trimText();
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

    public Set<Belt> getBelts() {
        return belts;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setDescription(String desc) {
        this.description = desc;
    }

    /**
     * Tells if a exercise has valid format.
     * @return true if exercise is valid, else false.
     */
    public boolean validFormat() {
        return getName() != null && getName().length() != 0 && getName().length() <= 255;
    }

    /**
     * Remove leading and trailing whitespaces
     * from name and description
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