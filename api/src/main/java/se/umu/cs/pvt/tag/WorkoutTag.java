/**
 * The WorkoutTag entity.
 * Model for workout_tag data in database.
 *
 * @Author Team 5 Verona (Doc: Griffin dv21jjn)
 */
package se.umu.cs.pvt.tag;

import javax.persistence.*;
import java.io.Serializable;


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
     * @param   workId      ID of the Workout.
     */
    public WorkoutTag(Long workId) {
        this.workId = workId;
    }


    /**
     * Get the Workout ID.
     * 
     * @return  The Workout ID.
     */
    public Long getWorkId() {
        return workId;
    }


    /**
     * Gets the Tag ID.
     *
     * @return  The Tag ID.
     */
    public Long getTag() {
        return tag.getId();
    }


    public void setTag(Tag tag) {
        this.tag = tag;
    }

}
