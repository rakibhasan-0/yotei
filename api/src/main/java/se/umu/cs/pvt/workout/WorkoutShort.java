package se.umu.cs.pvt.workout;

import java.time.LocalDate;

/**
 * Minimal data structure for workout
 *
 * @author Grupp 8 Kebabpizza
 */
public interface WorkoutShort {

    /**
     * @return the id of the workout.
     */
    Long getId();

    /**
     * @return the name of the workout.
     */
    String getName();

    /**
     * @return the created date of the workout.
     */
    LocalDate getCreated();

    /**
     * @return the id of the author who created it.
     */
    Long getAuthor();
}
