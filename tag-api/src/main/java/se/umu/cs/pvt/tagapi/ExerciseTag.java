/**
 * The Tag API ExcerciseTag Entity.
 * @Author Team 5 Verona
 */
package se.umu.cs.pvt.tagapi;

import java.io.Serializable;
import javax.persistence.*;

/**
 * Model for excercise_tag data in database
 */
@Entity
@Table(name = "exercise_tag")
public class ExerciseTag implements Serializable { 

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "exertag_id")
    private Long pairId;

    @Column(nullable = false, name = "ex_id")
    private Long exerciseId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tag_id")
    private Tag tag;

    /**
     * No-args constructor required by JPA spec
     * This one is protected since it shouldn't be used directly
     */
    protected ExerciseTag() {}

    /**
     * Creates a ExerciseTag.
     * 
     * @param exerciseId Id of the exercise.
     */
    public ExerciseTag(Long exerciseId) {
        this.exerciseId = exerciseId;
    }

    /**
     * Get the exercise Id.
     * 
     * @return The exercise Id.
     */
    public Long getExerciseId() {
        return exerciseId;
    }

    /**
     * Sets the tag.
     * @param tag
     */
    public void setTag(Tag tag) {
        this.tag = tag;
    }

    /**
     * Gets the tag Id.
     * @return The Id of the tag.
     */
    public Long getTag() {
        return tag.getId();
    }

    /**
     * Returns the Tag.
     * 
     * @return tag object.
     */
    public Tag getTagObject() {
        return tag;
    }

    /**
     * Sets the exercise Id.
     * 
     * @param exerciseId new exerciseId.
     */
    public void setExerciseId(Long exerciseId) {
        this.exerciseId = exerciseId;
    }
}