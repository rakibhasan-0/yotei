/**
 * Projection of the ExerciseTag entity that only returns the Id of the exercise from the exercise-tag pair.
 *
 * @author Grupp 5 Verona (Doc: Griffin dv21jjn)
 */

package se.umu.cs.pvt.tag;

public interface ExerciseTagShort {

    /**
     * Returns the Exercise ID of an ExerciseTag pair.
     *
     * @return          The Exercise ID of the ExerciseTag pair.
     */
    Long getExerciseId();
}
