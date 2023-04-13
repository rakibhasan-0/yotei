package se.cs.umu.pvt.exerciseapi;

/**
 * @author Hawaii
 *
 * JPA-entity projection for dropdown information activities
 */
public interface ExerciseDropDownProjection {
    /**
     * Returns the id of the exercise.
     * @return the id of the exercise.
     */
    String getDescription();

    /**
     * Returns the name of the exercise.
     * @return the name of the exercise.
     */
    Integer getDuration();

}
