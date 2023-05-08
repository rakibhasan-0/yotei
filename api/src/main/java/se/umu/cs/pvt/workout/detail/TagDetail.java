package se.umu.cs.pvt.workout.detail;

import javax.persistence.*;
import java.util.List;

/**
 * Class to represent a tag. Not using the Tag from the tag package since
 * we need to have a many-many mapping between Workouts and tags and that
 * would require modifications to the Tag class.
 *
 * @author Grupp 5 cyclops
 */

@Entity
@Table(name = "tag")
public class TagDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "tag_id")
    private Long id;

    @Column(nullable = false, name = "name")
    private String name;

    @ManyToMany
    @JoinTable(name = "workout_tag",
            joinColumns = @JoinColumn(name = "work_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private List<WorkoutDetail> workouts;

    protected TagDetail() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
