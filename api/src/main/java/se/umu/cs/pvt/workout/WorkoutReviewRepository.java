package se.umu.cs.pvt.workout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Repository for workout reviews.
 *
 * @author Calskrove (Team 6)
 */
public interface WorkoutReviewRepository extends JpaRepository<WorkoutReview,Long> {
    
    @Query(value="SELECT wr.review_id, wr.user_id, wr.rating, wr.positive_comment, wr.negative_comment," +
            "wr.review_date, wr.workout_id, u.username " +
            "FROM workout_review AS wr, user_table AS u " +
            "WHERE u.user_id = wr.user_id AND wr.workout_id = :id " +
            "ORDER BY wr.review_date DESC, wr.review_id DESC", nativeQuery = true)
    List<WorkoutReviewReturnInterface> findReviewsForWorkout(int id);
}
