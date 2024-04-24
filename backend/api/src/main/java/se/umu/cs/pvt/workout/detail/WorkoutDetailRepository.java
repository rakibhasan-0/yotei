package se.umu.cs.pvt.workout.detail;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * @author (UNKNOWN) & Team Tomato
 * @updated 2024-04-24 by Team Tomato
 */
public interface WorkoutDetailRepository extends JpaRepository<WorkoutDetail, Long> {

    @Query("SELECT wd FROM WorkoutDetail wd " +
            "WHERE wd.id = :workoutId AND (" +
            "wd.hidden = false OR " +
            "wd.author.userId = :userId OR " +
            ":userId IN (SELECT u.id FROM User u WHERE u.userRole = 1) OR " +
            ":userId IN (SELECT uw.userId FROM UserWorkout uw WHERE uw.workoutId = wd.id))")
    Optional<WorkoutDetail> findWorkoutByIdAndUserAccess(@Param("workoutId") Long workoutId,
            @Param("userId") Long userId);
}
