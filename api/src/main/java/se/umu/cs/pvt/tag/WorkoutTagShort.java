/**
 * Projection of the WorkoutTag entity that only returns the Id of the workout from the workout-tag pair.
 *
 * @Author Team 5 Verona (Doc: Griffin dv21jjn)
 */
package se.umu.cs.pvt.tag;

public interface WorkoutTagShort {

    /**
     * Returns the Workout ID of an WorkoutTag pair.
     *
     * @return      The Workout ID of the WorkoutTag pair.
     */
    Long getWorkId(); 
}
