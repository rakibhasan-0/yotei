package se.umu.cs.pvt.export;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

/**
 * Represents an exercise export entity.
 *
 * @author Andre Byström
 * date: 2023-04-25
 */
@Entity
@Table(name = "exercise")
public class ExerciseExport implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "exercise_id")
    @JsonIgnore
    private Long id;

    @Column(nullable = false, name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(nullable = false, name = "duration")
    private int duration;

    @ManyToMany
    @JoinTable(name = "exercise_tag",
            joinColumns = @JoinColumn(name = "ex_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private Set<TagExport> tags;

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected ExerciseExport() {
        // no-args constructor required by JPA spec
        // this one is protected since it shouldn't be used directly
    }

    public ExerciseExport(Long id, String name, String description, int duration, Set<TagExport> tags){
        this.id = id;
        this.name = name;
        this.description = description;
        this.duration = duration;
        this.tags = tags;
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

    public int getDuration() {
        return duration;
    }

    public Set<TagExport> getTags() {
        return tags;
    }
}
