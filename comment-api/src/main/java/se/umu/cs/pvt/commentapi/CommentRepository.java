package se.umu.cs.pvt.commentapi;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository for comments.
 * @author Henrik Aili (c20hai) - Grupp 3 Hawaii
 */
public interface CommentRepository extends JpaRepository<Comment, Long> {
    /**
     * Finds all comments with the given workout id.
     * @param exerciseId The id of the exercise.
     * @return A list of comments.
     */
    List<Comment> findByExerciseId(Long exerciseId);

    /**
     * Finds all comments with the given workout id.
     * @param workoutId The id of the workout.
     * @return A list of comments.
     */
    List<Comment> findByWorkoutId(Long workoutId);

    /**
     * Returns a projection of all comments with the given exercise id.
     */
    List<CommentShort> findALLProjectedByExerciseId(Long exerciseId);

    /**
     * Returns a projection of all comments with the given workout id.
     */
    List<CommentShort> findALLProjectedByWorkoutId(Long workoutId);
}
