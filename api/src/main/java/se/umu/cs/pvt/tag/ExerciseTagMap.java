package se.umu.cs.pvt.tag;

import java.util.List;

/**
 * A class made to be a mapping between an exercise and tags.
 * Used by the import function for exercise tags.
 */
public class ExerciseTagMap {

    private Long exerciseId;

    private List<Tag> tags;

    /**
     * Getter for the exercise id.
     * @return the exercise id.
     */
    public Long getExerciseId() {
        return exerciseId;
    }

    /**
     * Setter for the exercise id.
     * @param exerciseId the value to give the exercise id.
     */
    public void setExerciseId(Long exerciseId) {
        this.exerciseId = exerciseId;
    }

    /**
     * Getter for the tags.
     * @return the list of tags.
     */
    public List<Tag> getTags() {
        return tags;
    }

    /**
     * Setter for the tags
     * @param tags the list object that will become the tags.
     */
    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }
}
