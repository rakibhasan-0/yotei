package se.umu.cs.pvt.workout;

import java.time.LocalDate;

/**
 * @author Hawaii, Kebabpizza
 *
 * JPA-entity projection for dropdown information Workouts
 */
public interface WorkoutDropDownProjection {

    /**
     * Returns the description of the workout.
     * @return the description of the workout.
     */
    String getDesc();

    /**
     * Returns the duration of the workout.
     * @return the duration of the workout.
     */
    Integer getDuration();

    /**
     * Returns the created date of the workout.
     * @return the created date of the workout.
     */
    LocalDate getCreated();

    /**
     * @return the id of the author of the workout.
     */
    Long getAuthor();
}
