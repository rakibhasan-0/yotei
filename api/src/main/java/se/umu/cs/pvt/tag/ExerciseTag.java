/**
 * The Tag API ExcerciseTag Entity, model for exercise_tag data in database.
 *
 * @Author Team 5 Verona (Doc: Griffin dv21jjn)
 */
package se.umu.cs.pvt.tag;

import javax.persistence.*;
import java.io.Serializable;


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
     * @param   exerciseId      Id of the exercise.
     */
    public ExerciseTag(Long exerciseId) {
        this.exerciseId = exerciseId;
    }

    public ExerciseTag(Long exerciseId, Tag tag) {
        this.exerciseId = exerciseId;
        this.tag = tag;
    }


    public Long getExerciseId() {
        return exerciseId;
    }


    public void setTag(Tag tag) {
        this.tag = tag;
    }

    /**
     * Gets the tag Id.
     *
     * @return          The Id of the Tag.
     */
    public Long getTag() {
        return tag.getId();
    }

    /**
     * Returns the Tag.
     * 
     * @return          The Tag object.
     */
    public Tag getTagObject() {
        return tag;
    }


    public void setExerciseId(Long exerciseId) {
        this.exerciseId = exerciseId;
    }
}