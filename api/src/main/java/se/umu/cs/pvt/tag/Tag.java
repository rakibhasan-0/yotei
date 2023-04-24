/**
 * The Tag entity.
 * @Author Team 5 Verona
 */
package se.umu.cs.pvt.tag;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;


@Entity
@Table(name = "tag")
public class Tag implements Serializable{
   
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "tag_id")
    private Long id;

    @Column(nullable = false, name = "name")
    private String name;

    @OneToMany(mappedBy = "tag",
                cascade = CascadeType.ALL)
    private List<WorkoutTag> workoutTags;
    
    @OneToMany(mappedBy = "tag",
                cascade = CascadeType.ALL)
    private List<ExerciseTag> exerciseTags;

    @OneToMany(mappedBy = "tag",
                cascade = CascadeType.ALL)
    private List<TechniqueTag> techniqueTags;

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected Tag() {}

    /**
     * Creates a tag.
     * @param id Id of the tag.
     * @param name Name of the tag.
     */
    public Tag(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    /**
     * Get Id of the Tag.
     * @return The TagId.
     */
    public Long getId() {
        return id;
    }

    /**
     * Get the name of the Tag.
     * @return The TagName.
     */
    public String getName() {
        return name;
    }

}
