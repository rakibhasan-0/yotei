package se.umu.cs.pvt.tag;

import java.util.List;

/**
 * A class made to be a mapping between an exercise and tags.
 * Used by the import function for exercise tags.
 *
 * @author unknown (Doc: Griffin dv21jjn)
 */
public class ExerciseTagMap {

    private Long exerciseId;

    private List<Tag> tags;


    /**
     * Getter for the Exercise ID.
     *
     * @return          The Exercise ID.
     */
    public Long getExerciseId() {
        return exerciseId;
    }


    /**
     * Setter for the Exercise ID.
     *
     * @param   exerciseId      The value to give the Exercise ID.
     */
    public void setExerciseId(Long exerciseId) {
        this.exerciseId = exerciseId;
    }


    /**
     * Getter for the Tags.
     *
     * @return          The list of Tags.
     */
    public List<Tag> getTags() {
        return tags;
    }


    /**
     * Setter for the Tags.
     *
     * @param   tags    The list object that will become the tags.
     */
    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }
}
