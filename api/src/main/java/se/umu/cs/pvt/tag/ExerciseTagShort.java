/**
 * Projection of the ExerciseTag entity that only returns the Id of the exercise from the exercise-tag pair.
 * @author Grupp 5 Verona
 */

package se.umu.cs.pvt.tag;

public interface ExerciseTagShort {

    /**
     * Returns the Exercise Id of an ExerciseTag pair.
     * @return The Exercise Id of the ExerciseTag pair.
     */
    Long getExerciseId();
}
