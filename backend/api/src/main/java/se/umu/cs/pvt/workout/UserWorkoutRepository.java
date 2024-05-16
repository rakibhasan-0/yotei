package se.umu.cs.pvt.workout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Interface for UserWorkout
 *
 * @author Grupp 2 Cappriciosa (DOCS griffin ens19amd)
 */
@Repository
public interface UserWorkoutRepository extends JpaRepository<UserWorkout, Long> {

    /**
     * Finds workoutUser pair
     * @param userId
     * @param workoutId
     * @return The userWorkout if it's found
     */
    UserWorkout findByWorkoutIdAndUserId(Long workoutId, Long userId);

    /**
     * Deletes UserWorkout with specified workout- and user id
     * @param workoutId
     * @param userId
     */
    void deleteByWorkoutIdAndUserId(Long workoutId, Long userId);

    /**
     *
     * @param workoutId
     * @return list of all users related to workout
     */
    List<UserWorkout> findAllByWorkoutId(Long workoutId);


}
