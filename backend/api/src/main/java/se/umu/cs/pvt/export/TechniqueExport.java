package se.umu.cs.pvt.export;

import com.fasterxml.jackson.annotation.JsonIgnore;
import se.umu.cs.pvt.belt.Belt;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

/**
 * Represents a technique export entity.
 *
 * @author Andre Byström
 * date: 2023-04-25
 */
@Entity
@Table(name = "technique")
public class TechniqueExport implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "technique_id")
    @JsonIgnore
    private Long id;

    @Column(nullable = false, name = "name")
    private String name;

    @Column(nullable = false, name = "description")
    private String description;

    @ManyToMany
    @JoinTable(name = "technique_tag",
            joinColumns = @JoinColumn(name = "tech_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private Set<TagExport> tags;

    @ManyToMany
    @JoinTable(name = "technique_to_belt",
        joinColumns = @JoinColumn(name = "technique_id"),
        inverseJoinColumns = @JoinColumn(name = "belt_id"))
    private Set<BeltExport> belts;

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected TechniqueExport() {
    }

    public TechniqueExport(long id, String name, String description, Set<TagExport> tags, Set<BeltExport> belts){
        this.id = id;
        this.name = name;
        this.description = description;
        this.tags = tags;
        this.belts = belts;
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

    public Set<TagExport> getTags() {
        return tags;
    }

    public Set<BeltExport> getBelts() { return belts; }
}
