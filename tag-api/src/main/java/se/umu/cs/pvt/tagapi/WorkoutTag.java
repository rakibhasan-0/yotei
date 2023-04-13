/**
 * The WorkoutTag entity.
 * @Author Team 5 Verona
 */
package se.umu.cs.pvt.tagapi;

import java.io.Serializable;
import javax.persistence.*;

/**
 * Model for workout_tag data in database
 */
@Entity
@Table(name = "workout_tag")
public class WorkoutTag implements Serializable { 

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "worktag_id")
    private Long workTagId;

    @Column(nullable = false, name = "work_id")
    private Long workId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tag_id")
    private Tag tag;

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected WorkoutTag() {}

    /**
     * Creates a WorkoutTag.
     * 
     * @param workId Id of the Workout.
     */
    public WorkoutTag(Long workId) {
        this.workId = workId;
    }
    
    /**
     * Get the workout Id.
     * 
     * @return The workout Id.
     */
    
    public Long getWorkId() {
        return workId;
    }

    /**
     * Gets the tag id.
     * @return
     */
    public Long getTag() {
        return tag.getId();
    }

    /**
     * Sets the tag.
     * @param tag
     */
    public void setTag(Tag tag) {
        this.tag = tag;
    }

}
