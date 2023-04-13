package se.umu.cs.pvt.workoutapi;

import java.util.Date;

/**
 * Interface for returning information about reviews.
 *
 * NOTE: The names contain keywords, DO NOT CHANGE NAMES OF METHODS unless you know
 * what you're doing.
 *
 * @author Calskrove (Team 6).
 */
public interface WorkoutReviewReturnInterface {

    Long getReview_id();

    int getUser_id();
    int getRating();
    String getPositive_comment();
    String getNegative_comment();
    Date getReview_date();

    int getWorkout_id();
    String getUsername();

}
