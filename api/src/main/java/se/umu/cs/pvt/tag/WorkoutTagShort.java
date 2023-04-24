/**
 * Projection of the WorkoutTag entity that only returns the Id of the workout from the workout-tag pair.
 * @Author Team 5 Verona
 */
package se.umu.cs.pvt.tag;

public interface WorkoutTagShort {

    /**
     * Returns the Workout Id of an WorkoutTag pair.
     * @return The Workout Id of the WorkoutTag pair.
     */
    Long getWorkId(); 
}
